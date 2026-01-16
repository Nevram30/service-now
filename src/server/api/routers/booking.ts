import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { addMinutes } from "date-fns";

export const bookingRouter = createTRPCRouter({
  // Protected mutation for customers to request a booking slot
  create: protectedProcedure
    .input(
      z.object({
        serviceId: z.string(),
        startTime: z.date(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get the service to determine provider and duration
      const service = await ctx.db.service.findUnique({
        where: { id: input.serviceId },
        include: { provider: true },
      });

      if (!service) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Service not found",
        });
      }

      // Calculate end time based on service duration
      const endTime = addMinutes(input.startTime, service.durationMinutes);

      // Check for overlapping bookings for the provider
      const overlappingBooking = await ctx.db.booking.findFirst({
        where: {
          providerId: service.providerId,
          status: { in: ["PENDING", "CONFIRMED"] },
          OR: [
            {
              AND: [
                { startTime: { lte: input.startTime } },
                { endTime: { gt: input.startTime } },
              ],
            },
            {
              AND: [
                { startTime: { lt: endTime } },
                { endTime: { gte: endTime } },
              ],
            },
            {
              AND: [
                { startTime: { gte: input.startTime } },
                { endTime: { lte: endTime } },
              ],
            },
          ],
        },
      });

      if (overlappingBooking) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "This time slot is already booked",
        });
      }

      // Create the booking
      return ctx.db.booking.create({
        data: {
          serviceId: input.serviceId,
          customerId: ctx.session.user.id,
          providerId: service.providerId,
          startTime: input.startTime,
          endTime,
          notes: input.notes,
          status: "PENDING",
        },
        include: {
          service: true,
          provider: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });
    }),

  // Protected query for providers to see their appointments
  getProviderSchedule: protectedProcedure
    .input(
      z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        status: z
          .enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"])
          .optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      // Verify user is a provider
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (user?.role !== "PROVIDER") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only providers can view their schedule",
        });
      }

      return ctx.db.booking.findMany({
        where: {
          providerId: ctx.session.user.id,
          ...(input?.startDate && { startTime: { gte: input.startDate } }),
          ...(input?.endDate && { endTime: { lte: input.endDate } }),
          ...(input?.status && { status: input.status }),
        },
        include: {
          service: true,
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: { startTime: "asc" },
      });
    }),

  // Get customer's own bookings
  getMyBookings: protectedProcedure
    .input(
      z.object({
        status: z
          .enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"])
          .optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.booking.findMany({
        where: {
          customerId: ctx.session.user.id,
          ...(input?.status && { status: input.status }),
        },
        include: {
          service: true,
          provider: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: { startTime: "desc" },
      });
    }),

  // Provider updates booking status (confirm, cancel, complete)
  updateStatus: protectedProcedure
    .input(
      z.object({
        bookingId: z.string(),
        status: z.enum(["CONFIRMED", "CANCELLED", "COMPLETED"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const booking = await ctx.db.booking.findUnique({
        where: { id: input.bookingId },
      });

      if (!booking) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Booking not found",
        });
      }

      // Only the provider can update booking status
      if (booking.providerId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only the provider can update booking status",
        });
      }

      return ctx.db.booking.update({
        where: { id: input.bookingId },
        data: { status: input.status },
        include: {
          service: true,
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    }),

  // Get available time slots for a service on a specific date
  getAvailableSlots: protectedProcedure
    .input(
      z.object({
        serviceId: z.string(),
        date: z.date(),
      })
    )
    .query(async ({ ctx, input }) => {
      const service = await ctx.db.service.findUnique({
        where: { id: input.serviceId },
      });

      if (!service) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Service not found",
        });
      }

      // Get all bookings for the provider on that date
      const startOfDay = new Date(input.date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(input.date);
      endOfDay.setHours(23, 59, 59, 999);

      const existingBookings = await ctx.db.booking.findMany({
        where: {
          providerId: service.providerId,
          status: { in: ["PENDING", "CONFIRMED"] },
          startTime: { gte: startOfDay, lte: endOfDay },
        },
        orderBy: { startTime: "asc" },
      });

      // Generate available slots (9 AM to 5 PM, based on service duration)
      const slots: { startTime: Date; endTime: Date; available: boolean }[] = [];
      const workStartHour = 9;
      const workEndHour = 17;

      for (let hour = workStartHour; hour < workEndHour; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const slotStart = new Date(input.date);
          slotStart.setHours(hour, minute, 0, 0);
          const slotEnd = addMinutes(slotStart, service.durationMinutes);

          // Check if slot end is within working hours
          if (slotEnd.getHours() > workEndHour ||
              (slotEnd.getHours() === workEndHour && slotEnd.getMinutes() > 0)) {
            continue;
          }

          // Check if slot overlaps with existing bookings
          const isOverlapping = existingBookings.some((booking) => {
            return (
              (slotStart >= booking.startTime && slotStart < booking.endTime) ||
              (slotEnd > booking.startTime && slotEnd <= booking.endTime) ||
              (slotStart <= booking.startTime && slotEnd >= booking.endTime)
            );
          });

          slots.push({
            startTime: slotStart,
            endTime: slotEnd,
            available: !isOverlapping,
          });
        }
      }

      return slots;
    }),

  // Get payment info for a booking (provider's QR code)
  getPaymentInfo: protectedProcedure
    .input(z.object({ bookingId: z.string() }))
    .query(async ({ ctx, input }) => {
      const booking = await ctx.db.booking.findUnique({
        where: { id: input.bookingId },
        include: {
          service: true,
          provider: {
            select: {
              id: true,
              name: true,
              paymentQrCode: true,
              paymentNotes: true,
            },
          },
          customer: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!booking) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Booking not found",
        });
      }

      // Only the customer or provider can view payment info
      if (
        booking.customerId !== ctx.session.user.id &&
        booking.providerId !== ctx.session.user.id
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this booking",
        });
      }

      return {
        booking: {
          id: booking.id,
          startTime: booking.startTime,
          endTime: booking.endTime,
          status: booking.status,
          paymentStatus: booking.paymentStatus,
          notes: booking.notes,
        },
        service: {
          id: booking.service.id,
          title: booking.service.title,
          basePrice: booking.service.basePrice,
        },
        provider: booking.provider,
        isCustomer: booking.customerId === ctx.session.user.id,
        isProvider: booking.providerId === ctx.session.user.id,
      };
    }),

  // Customer marks booking as paid
  markAsPaid: protectedProcedure
    .input(z.object({ bookingId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const booking = await ctx.db.booking.findUnique({
        where: { id: input.bookingId },
      });

      if (!booking) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Booking not found",
        });
      }

      // Only the customer can mark as paid
      if (booking.customerId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only the customer can mark as paid",
        });
      }

      // Can only mark as paid if currently unpaid
      if (booking.paymentStatus !== "UNPAID") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Payment has already been marked",
        });
      }

      return ctx.db.booking.update({
        where: { id: input.bookingId },
        data: { paymentStatus: "CUSTOMER_MARKED_PAID" },
        include: {
          service: true,
          provider: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    }),

  // Provider confirms payment received
  confirmPayment: protectedProcedure
    .input(z.object({ bookingId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const booking = await ctx.db.booking.findUnique({
        where: { id: input.bookingId },
      });

      if (!booking) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Booking not found",
        });
      }

      // Only the provider can confirm payment
      if (booking.providerId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only the provider can confirm payment",
        });
      }

      return ctx.db.booking.update({
        where: { id: input.bookingId },
        data: {
          paymentStatus: "PROVIDER_CONFIRMED",
          status: "CONFIRMED",
        },
        include: {
          service: true,
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    }),

  // Cancel a booking (customer or provider can cancel)
  cancel: protectedProcedure
    .input(z.object({ bookingId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const booking = await ctx.db.booking.findUnique({
        where: { id: input.bookingId },
      });

      if (!booking) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Booking not found",
        });
      }

      // Only the customer or provider can cancel
      if (
        booking.customerId !== ctx.session.user.id &&
        booking.providerId !== ctx.session.user.id
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to cancel this booking",
        });
      }

      // Cannot cancel completed or already cancelled bookings
      if (booking.status === "COMPLETED" || booking.status === "CANCELLED") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Cannot cancel a ${booking.status.toLowerCase()} booking`,
        });
      }

      return ctx.db.booking.update({
        where: { id: input.bookingId },
        data: { status: "CANCELLED" },
        include: {
          service: true,
          provider: {
            select: {
              id: true,
              name: true,
            },
          },
          customer: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    }),

  // Get single booking by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const booking = await ctx.db.booking.findUnique({
        where: { id: input.id },
        include: {
          service: true,
          provider: {
            select: {
              id: true,
              name: true,
              image: true,
              paymentQrCode: true,
              paymentNotes: true,
            },
          },
          customer: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      if (!booking) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Booking not found",
        });
      }

      // Only customer or provider can view the booking
      if (
        booking.customerId !== ctx.session.user.id &&
        booking.providerId !== ctx.session.user.id
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this booking",
        });
      }

      return booking;
    }),
});
