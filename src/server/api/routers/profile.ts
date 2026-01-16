import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const profileRouter = createTRPCRouter({
  // Get current user's profile
  getMe: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        paymentQrCode: true,
        paymentNotes: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return user;
  }),

  // Update payment details (QR code URL and notes) - only for providers/admins
  updatePaymentDetails: protectedProcedure
    .input(
      z.object({
        paymentQrCode: z.string().url().optional().nullable(),
        paymentNotes: z.string().max(500).optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify user is a provider or admin
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { role: true },
      });

      if (user?.role !== "PROVIDER" && user?.role !== "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only providers and admins can update payment details",
        });
      }

      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          paymentQrCode: input.paymentQrCode,
          paymentNotes: input.paymentNotes,
        },
        select: {
          id: true,
          paymentQrCode: true,
          paymentNotes: true,
        },
      });
    }),

  // Update user role (admin only)
  updateRole: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(["CUSTOMER", "PROVIDER", "ADMIN"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify current user is admin
      const currentUser = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { role: true },
      });

      if (currentUser?.role !== "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can update user roles",
        });
      }

      return ctx.db.user.update({
        where: { id: input.userId },
        data: { role: input.role },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });
    }),

  // Update basic profile info
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: input,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
        },
      });
    }),

  // Delete payment QR code
  deletePaymentQrCode: protectedProcedure.mutation(async ({ ctx }) => {
    // Verify user is a provider or admin
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: { role: true },
    });

    if (user?.role !== "PROVIDER" && user?.role !== "ADMIN") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only providers and admins can manage payment details",
      });
    }

    return ctx.db.user.update({
      where: { id: ctx.session.user.id },
      data: { paymentQrCode: null },
      select: {
        id: true,
        paymentQrCode: true,
      },
    });
  }),
});
