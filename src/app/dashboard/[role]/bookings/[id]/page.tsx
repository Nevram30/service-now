"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { format } from "date-fns";
import { api } from "~/trpc/react";
import { PaymentModal } from "~/app/_components/PaymentModal";

const validRoles = ["customer", "provider", "admin"];

const statusConfig = {
  PENDING: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
    description: "Waiting for provider confirmation",
  },
  CONFIRMED: {
    label: "Confirmed",
    color: "bg-green-100 text-green-800",
    description: "Your booking is confirmed",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800",
    description: "This booking has been cancelled",
  },
  COMPLETED: {
    label: "Completed",
    color: "bg-blue-100 text-blue-800",
    description: "Service has been completed",
  },
};

const paymentStatusConfig = {
  UNPAID: {
    label: "Pending Payment",
    color: "bg-orange-100 text-orange-800",
  },
  CUSTOMER_MARKED_PAID: {
    label: "Awaiting Confirmation",
    color: "bg-blue-100 text-blue-800",
  },
  PROVIDER_CONFIRMED: {
    label: "Payment Confirmed",
    color: "bg-green-100 text-green-800",
  },
};

const categoryConfig: Record<string, { label: string; color: string }> = {
  GRASS_CUTTING: {
    label: "Grass Cutting",
    color: "bg-green-100 text-green-700",
  },
  AIRCON_REPAIR: {
    label: "Aircon Repair",
    color: "bg-blue-100 text-blue-700",
  },
  CLEANING: {
    label: "Cleaning",
    color: "bg-purple-100 text-purple-700",
  },
  HAIRCUT: {
    label: "Haircut",
    color: "bg-pink-100 text-pink-700",
  },
};

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const role = params.role as string;
  const bookingId = params.id as string;
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const utils = api.useUtils();
  const userRole = session?.user?.role?.toLowerCase() ?? "customer";

  const { data: booking, isLoading, error } = api.booking.getById.useQuery(
    { id: bookingId },
    { enabled: !!bookingId }
  );

  const updateStatus = api.booking.updateStatus.useMutation({
    onSuccess: async () => {
      await utils.booking.getById.invalidate({ id: bookingId });
      await utils.booking.getProviderSchedule.invalidate();
      await utils.booking.getMyBookings.invalidate();
    },
  });

  const cancelBooking = api.booking.cancel.useMutation({
    onSuccess: async () => {
      await utils.booking.getById.invalidate({ id: bookingId });
      await utils.booking.getProviderSchedule.invalidate();
      await utils.booking.getMyBookings.invalidate();
    },
  });

  useEffect(() => {
    if (!validRoles.includes(role) && session?.user?.role) {
      router.push(`/dashboard/${userRole}/bookings/${bookingId}`);
    } else if (role !== userRole && session?.user?.role) {
      router.push(`/dashboard/${userRole}/bookings/${bookingId}`);
    }
  }, [role, userRole, bookingId, router, session?.user?.role]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Booking Not Found
          </h1>
          <p className="mb-4 text-gray-600">
            The booking you&apos;re looking for doesn&apos;t exist or you don&apos;t have
            access to it.
          </p>
          <Link
            href={`/dashboard/${userRole}/bookings`}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            View My Bookings
          </Link>
        </div>
      </div>
    );
  }

  const isProvider = session?.user?.id === booking.providerId;
  const isCustomer = session?.user?.id === booking.customerId;
  const statusStyle = statusConfig[booking.status];
  const paymentStyle = paymentStatusConfig[booking.paymentStatus];
  const categoryStyle = categoryConfig[booking.service.category] ?? {
    label: booking.service.category,
    color: "bg-gray-100 text-gray-700",
  };
  const isPast = new Date(booking.endTime) < new Date();

  const canUpdateStatus =
    isProvider &&
    booking.status !== "CANCELLED" &&
    booking.status !== "COMPLETED";

  const canCancel =
    (isCustomer || isProvider) &&
    booking.status !== "CANCELLED" &&
    booking.status !== "COMPLETED" &&
    !isPast;

  const showPayButton =
    isCustomer &&
    booking.status !== "CANCELLED" &&
    booking.paymentStatus !== "PROVIDER_CONFIRMED";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href={`/dashboard/${userRole}/bookings`}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Bookings
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Status Banner */}
        <div
          className={`mb-6 rounded-xl p-4 ${statusStyle.color.replace("text-", "bg-").replace("800", "50")}`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${statusStyle.color}`}
            >
              {statusStyle.label}
            </span>
            <span className="text-sm text-gray-700">
              {statusStyle.description}
            </span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Info */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${categoryStyle.color}`}
                >
                  {categoryStyle.label}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${paymentStyle.color}`}
                >
                  {paymentStyle.label}
                </span>
              </div>

              <h1 className="mb-2 text-2xl font-bold text-gray-900">
                {booking.service.title}
              </h1>
              <p className="text-gray-600">{booking.service.description}</p>
            </div>

            {/* Date & Time */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Appointment Details
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <svg
                      className="h-5 w-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium text-gray-900">
                      {format(new Date(booking.startTime), "EEEE, MMMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <svg
                      className="h-5 w-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium text-gray-900">
                      {format(new Date(booking.startTime), "h:mm a")} -{" "}
                      {format(new Date(booking.endTime), "h:mm a")}
                    </p>
                  </div>
                </div>
              </div>

              {booking.notes && (
                <div className="mt-4 rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Notes</p>
                  <p className="mt-1 text-gray-700">{booking.notes}</p>
                </div>
              )}
            </div>

            {/* Provider Info (for customers) */}
            {isCustomer && (
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  Service Provider
                </h2>
                <div className="flex items-center gap-4">
                  {booking.provider.image ? (
                    <img
                      src={booking.provider.image}
                      alt={booking.provider.name ?? "Provider"}
                      className="h-16 w-16 rounded-full"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-xl font-semibold text-blue-600">
                      {booking.provider.name?.charAt(0) ?? "P"}
                    </div>
                  )}
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      {booking.provider.name ?? "Unknown Provider"}
                    </p>
                    <p className="text-sm text-gray-500">Service Provider</p>
                  </div>
                </div>
              </div>
            )}

            {/* Customer Info (for providers) */}
            {isProvider && (
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  Customer
                </h2>
                <div className="flex items-center gap-4">
                  {booking.customer.image ? (
                    <img
                      src={booking.customer.image}
                      alt={booking.customer.name ?? "Customer"}
                      className="h-16 w-16 rounded-full"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-xl font-semibold text-green-600">
                      {booking.customer.name?.charAt(0) ?? "C"}
                    </div>
                  )}
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      {booking.customer.name ?? "Unknown Customer"}
                    </p>
                    <p className="text-sm text-gray-500">Customer</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Payment Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Service Price</span>
                  <span className="font-medium text-gray-900">
                    ₱{booking.service.basePrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-medium text-gray-900">
                    {booking.service.durationMinutes} min
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ₱{booking.service.basePrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {showPayButton && (
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  {booking.paymentStatus === "UNPAID"
                    ? "Complete Payment"
                    : "View Payment Status"}
                </button>
              )}
            </div>

            {/* Actions Card */}
            {(canUpdateStatus || canCancel) && (
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  Actions
                </h2>
                <div className="space-y-3">
                  {canUpdateStatus && booking.status === "PENDING" && (
                    <>
                      <button
                        onClick={() =>
                          updateStatus.mutate({
                            bookingId: booking.id,
                            status: "CONFIRMED",
                          })
                        }
                        disabled={updateStatus.isPending}
                        className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-green-700 disabled:bg-green-400"
                      >
                        {updateStatus.isPending
                          ? "Updating..."
                          : "Confirm Booking"}
                      </button>
                    </>
                  )}

                  {canUpdateStatus &&
                    booking.status === "CONFIRMED" &&
                    isPast && (
                      <button
                        onClick={() =>
                          updateStatus.mutate({
                            bookingId: booking.id,
                            status: "COMPLETED",
                          })
                        }
                        disabled={updateStatus.isPending}
                        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400"
                      >
                        {updateStatus.isPending
                          ? "Updating..."
                          : "Mark as Completed"}
                      </button>
                    )}

                  {canCancel && (
                    <button
                      onClick={() =>
                        cancelBooking.mutate({ bookingId: booking.id })
                      }
                      disabled={cancelBooking.isPending}
                      className="w-full rounded-lg border border-red-200 bg-white px-4 py-3 font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:bg-red-50"
                    >
                      {cancelBooking.isPending
                        ? "Cancelling..."
                        : "Cancel Booking"}
                    </button>
                  )}
                </div>

                {(updateStatus.isError || cancelBooking.isError) && (
                  <p className="mt-3 text-sm text-red-600">
                    {updateStatus.error?.message ?? cancelBooking.error?.message}
                  </p>
                )}
              </div>
            )}

            {/* QR Code for Provider */}
            {isProvider &&
              booking.paymentStatus === "CUSTOMER_MARKED_PAID" && (
                <div className="rounded-xl bg-yellow-50 p-6 shadow-sm">
                  <h2 className="mb-2 text-lg font-semibold text-gray-900">
                    Payment Received?
                  </h2>
                  <p className="mb-4 text-sm text-gray-600">
                    The customer has marked this booking as paid. Please verify
                    and confirm.
                  </p>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-green-700"
                  >
                    Review & Confirm Payment
                  </button>
                </div>
              )}
          </div>
        </div>
      </main>

      {/* Payment Modal */}
      <PaymentModal
        bookingId={bookingId}
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
      />
    </div>
  );
}
