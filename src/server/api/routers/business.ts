import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const businessRouter = createTRPCRouter({
  // Get current provider's subscription status
  getMySubscription: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      include: {
        businessSubscription: true,
        providedServices: true,
      },
    });

    if (!user || user.role !== "PROVIDER") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only providers can access subscription info",
      });
    }

    // If no subscription exists, create one with default limit of 1
    const subscription = user.businessSubscription ?? await ctx.db.businessSubscription.create({
      data: {
        providerId: ctx.session.user.id,
        serviceLimit: 1,
        status: "PENDING",
      },
    });

    return {
      subscription,
      currentServiceCount: user.providedServices.length,
      canAddService: user.providedServices.length < subscription.serviceLimit && subscription.status === "ACTIVE",
    };
  }),

  // Get admin's GCash QR code for payment
  getAdminQrCode: protectedProcedure.query(async ({ ctx }) => {
    // Find admin user with QR code
    const admin = await ctx.db.user.findFirst({
      where: {
        role: "ADMIN",
        paymentQrCode: { not: null },
      },
      select: {
        paymentQrCode: true,
        paymentNotes: true,
      },
    });

    if (!admin?.paymentQrCode) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Admin payment QR code not set up yet",
      });
    }

    return {
      qrCode: admin.paymentQrCode,
      notes: admin.paymentNotes,
    };
  }),

  // Provider marks payment as sent
  markPaymentSent: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      include: { businessSubscription: true },
    });

    if (!user || user.role !== "PROVIDER") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only providers can mark payment as sent",
      });
    }

    if (!user.businessSubscription) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No subscription found",
      });
    }

    if (user.businessSubscription.status === "ACTIVE") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Subscription is already active",
      });
    }

    return ctx.db.businessSubscription.update({
      where: { id: user.businessSubscription.id },
      data: {
        status: "PAYMENT_SENT",
        paymentSentAt: new Date(),
      },
    });
  }),

  // Admin: Get all pending activation requests
  getPendingActivations: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
    });

    if (user?.role !== "ADMIN") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only admins can view activation requests",
      });
    }

    return ctx.db.businessSubscription.findMany({
      where: { status: "PAYMENT_SENT" },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: { paymentSentAt: "asc" },
    });
  }),

  // Admin: Activate a provider's subscription
  activateSubscription: protectedProcedure
    .input(z.object({ subscriptionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (user?.role !== "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can activate subscriptions",
        });
      }

      const subscription = await ctx.db.businessSubscription.findUnique({
        where: { id: input.subscriptionId },
      });

      if (!subscription) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Subscription not found",
        });
      }

      if (subscription.status !== "PAYMENT_SENT") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Only subscriptions with payment sent can be activated",
        });
      }

      return ctx.db.businessSubscription.update({
        where: { id: input.subscriptionId },
        data: {
          status: "ACTIVE",
          activatedAt: new Date(),
          activatedBy: ctx.session.user.id,
        },
      });
    }),

  // Check if provider can add more services
  canAddService: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      include: {
        businessSubscription: true,
        providedServices: true,
      },
    });

    if (!user || user.role !== "PROVIDER") {
      return { canAdd: false, reason: "Not a provider" };
    }

    // If no subscription, provider can add 1 service (free tier)
    if (!user.businessSubscription) {
      const canAdd = user.providedServices.length < 1;
      return {
        canAdd,
        reason: canAdd ? "Free tier allows 1 service" : "Free tier limit reached. Please subscribe to add more services.",
        currentCount: user.providedServices.length,
        limit: 1,
      };
    }

    const subscription = user.businessSubscription;

    // If subscription is not active and already has 1 service
    if (subscription.status !== "ACTIVE") {
      const canAdd = user.providedServices.length < 1;
      return {
        canAdd,
        reason: canAdd ? "Free tier allows 1 service" : "Please complete payment and wait for activation to add more services.",
        currentCount: user.providedServices.length,
        limit: 1,
        subscriptionStatus: subscription.status,
      };
    }

    // Active subscription - check against limit
    const canAdd = user.providedServices.length < subscription.serviceLimit;
    return {
      canAdd,
      reason: canAdd ? `You can add up to ${subscription.serviceLimit} services` : "Service limit reached",
      currentCount: user.providedServices.length,
      limit: subscription.serviceLimit,
      subscriptionStatus: subscription.status,
    };
  }),
});
