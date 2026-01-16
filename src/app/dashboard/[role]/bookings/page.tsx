"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { api } from "~/trpc/react";
import { BookingCard } from "~/app/_components/BookingCard";
import { PaymentModal } from "~/app/_components/PaymentModal";

const validRoles = ["customer", "provider", "admin"];

type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

export default function BookingsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  const role = params.role as string;
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "ALL">("ALL");
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const utils = api.useUtils();

  const userRole = session?.user?.role?.toLowerCase() ?? "customer";

  // Get user's role to determine which query to use
  const isProvider = session?.user?.role === "PROVIDER";

  // Customer bookings query
  const {
    data: customerBookings,
    isLoading: customerLoading,
  } = api.booking.getMyBookings.useQuery(
    statusFilter === "ALL" ? {} : { status: statusFilter },
    { enabled: !isProvider && authStatus === "authenticated" }
  );

  // Provider bookings query
  const {
    data: providerBookings,
    isLoading: providerLoading,
  } = api.booking.getProviderSchedule.useQuery(
    statusFilter === "ALL" ? {} : { status: statusFilter },
    { enabled: isProvider && authStatus === "authenticated" }
  );

  // Update status mutation (for providers)
  const updateStatus = api.booking.updateStatus.useMutation({
    onSuccess: async () => {
      await utils.booking.getProviderSchedule.invalidate();
      await utils.booking.getMyBookings.invalidate();
    },
  });

  const handleStatusUpdate = (
    bookingId: string,
    newStatus: "CONFIRMED" | "CANCELLED" | "COMPLETED"
  ) => {
    updateStatus.mutate({ bookingId, status: newStatus });
  };

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (authStatus === "authenticated") {
      // Validate role parameter
      if (!validRoles.includes(role)) {
        router.push(`/dashboard/${userRole}/bookings`);
        return;
      }

      // Redirect if role doesn't match
      if (role !== userRole) {
        router.push(`/dashboard/${userRole}/bookings`);
      }
    }
  }, [authStatus, session?.user?.role, role, userRole, router]);

  // Redirect if not authenticated
  if (authStatus === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (authStatus === "unauthenticated" || role !== userRole) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  const bookings = isProvider ? providerBookings : customerBookings;
  const isLoading = isProvider ? providerLoading : customerLoading;

  const filterOptions: { value: BookingStatus | "ALL"; label: string }[] = [
    { value: "ALL", label: "All Bookings" },
    { value: "PENDING", label: "Pending" },
    { value: "CONFIRMED", label: "Confirmed" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELLED", label: "Cancelled" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isProvider ? "Booking Requests" : "My Bookings"}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                {isProvider
                  ? "Manage your incoming booking requests"
                  : "View and manage your service bookings"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setStatusFilter(option.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                statusFilter === option.value
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Bookings Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : !bookings || bookings.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <svg
              className="mx-auto h-16 w-16 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No bookings found
            </h3>
            <p className="mt-2 text-gray-600">
              {statusFilter !== "ALL"
                ? `You don't have any ${statusFilter.toLowerCase()} bookings.`
                : isProvider
                  ? "You don't have any booking requests yet."
                  : "You haven't made any bookings yet."}
            </p>
            {!isProvider && (
              <Link
                href={`/dashboard/${userRole}/services`}
                className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Browse Services
              </Link>
            )}
          </div>
        ) : isProvider && providerBookings ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {providerBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                id={booking.id}
                startTime={booking.startTime}
                endTime={booking.endTime}
                status={booking.status}
                paymentStatus={booking.paymentStatus}
                service={booking.service}
                customer={booking.customer}
                showProvider={false}
                showCustomer={true}
                isProvider={true}
                onPaymentClick={() => setSelectedBookingId(booking.id)}
                onStatusUpdate={(status) => handleStatusUpdate(booking.id, status)}
              />
            ))}
          </div>
        ) : customerBookings ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {customerBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                id={booking.id}
                startTime={booking.startTime}
                endTime={booking.endTime}
                status={booking.status}
                paymentStatus={booking.paymentStatus}
                service={booking.service}
                provider={booking.provider}
                showProvider={true}
                showCustomer={false}
                isProvider={false}
                onPaymentClick={() => setSelectedBookingId(booking.id)}
                onStatusUpdate={(status) => handleStatusUpdate(booking.id, status)}
              />
            ))}
          </div>
        ) : null}

        {/* Update status loading/error state */}
        {updateStatus.isPending && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20">
            <div className="rounded-lg bg-white p-6 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                <span className="text-gray-700">Updating booking...</span>
              </div>
            </div>
          </div>
        )}

        {updateStatus.isError && (
          <div className="fixed bottom-4 right-4 z-40 rounded-lg bg-red-50 p-4 shadow-lg">
            <p className="text-sm text-red-700">
              Failed to update: {updateStatus.error.message}
            </p>
          </div>
        )}
      </main>

      {/* Payment Modal */}
      {selectedBookingId && (
        <PaymentModal
          bookingId={selectedBookingId}
          isOpen={true}
          onClose={() => setSelectedBookingId(null)}
        />
      )}
    </div>
  );
}
