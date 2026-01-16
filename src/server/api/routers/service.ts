import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const serviceRouter = createTRPCRouter({
  // Public query to list all services with optional category filtering
  getAll: publicProcedure
    .input(
      z.object({
        category: z
          .enum(["GRASS_CUTTING", "AIRCON_REPAIR", "CLEANING", "HAIRCUT"])
          .optional(),
        search: z.string().optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.service.findMany({
        where: {
          ...(input?.category && { category: input.category }),
          ...(input?.search && {
            OR: [
              { title: { contains: input.search, mode: "insensitive" } },
              { description: { contains: input.search, mode: "insensitive" } },
            ],
          }),
        },
        include: {
          provider: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  // Get a single service by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const service = await ctx.db.service.findUnique({
        where: { id: input.id },
        include: {
          provider: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      if (!service) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Service not found",
        });
      }

      return service;
    }),

  // Protected mutation for providers to create a service
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(100),
        description: z.string().min(1).max(1000),
        category: z.enum(["GRASS_CUTTING", "AIRCON_REPAIR", "CLEANING", "HAIRCUT"]),
        basePrice: z.number().positive(),
        durationMinutes: z.number().int().positive(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify user is a provider
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        include: {
          businessSubscription: true,
          providedServices: true,
        },
      });

      if (user?.role !== "PROVIDER") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only providers can create services",
        });
      }

      // Check service limit
      const currentServiceCount = user.providedServices.length;
      const subscription = user.businessSubscription;

      // Determine the limit based on subscription status
      let serviceLimit = 1; // Default free tier limit
      if (subscription?.status === "ACTIVE") {
        serviceLimit = subscription.serviceLimit;
      }

      if (currentServiceCount >= serviceLimit) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: subscription?.status === "ACTIVE"
            ? "You have reached your service limit. Please contact admin to increase your limit."
            : "Free tier allows only 1 service. Please subscribe to add more services.",
        });
      }

      return ctx.db.service.create({
        data: {
          ...input,
          providerId: ctx.session.user.id,
        },
      });
    }),
});
