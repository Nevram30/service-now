"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { api } from "~/trpc/react";

const statusConfig = {
  PENDING: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
  },
  CONFIRMED: {
    label: "Confirmed",
    color: "bg-green-100 text-green-800",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800",
  },
  COMPLETED: {
    label: "Completed",
    color: "bg-blue-100 text-blue-800",
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

export default function ProviderDashboard() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const utils = api.useUtils();

  const { data: bookings, isLoading: bookingsLoading } =
    api.booking.getProviderSchedule.useQuery(
      {},
      { enabled: authStatus === "authenticated" }
    );

  const { data: services, isLoading: servicesLoading } =
    api.service.getAll.useQuery(undefined, {
      enabled: authStatus === "authenticated",
    });

  const updateStatus = api.booking.updateStatus.useMutation({
    onSuccess: async () => {
      await utils.booking.getProviderSchedule.invalidate();
    },
  });

  // Handle authentication redirects in useEffect
  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/auth/signin");
    } else if (authStatus === "authenticated") {
      const role = session?.user?.role ?? "CUSTOMER";
      if (role !== "PROVIDER") {
        router.push(`/dashboard/${role.toLowerCase()}`);
      }
    }
  }, [authStatus, session?.user?.role, router]);

  // Show loading while checking auth or if redirecting
  const role = session?.user?.role ?? "CUSTOMER";
  if (authStatus === "loading" || authStatus === "unauthenticated" || role !== "PROVIDER") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  // Filter services to only show the provider's own services
  const myServices =
    services?.filter((s) => s.provider.id === session?.user?.id) ?? [];

  const pendingCount =
    bookings?.filter((b) => b.status === "PENDING").length ?? 0;
  const completedCount =
    bookings?.filter((b) => b.status === "COMPLETED").length ?? 0;
  const confirmedBookings =
    bookings?.filter(
      (b) => b.status === "CONFIRMED" && b.paymentStatus === "PROVIDER_CONFIRMED"
    ) ?? [];
  const totalRevenue = confirmedBookings.reduce(
    (sum, b) => sum + b.service.basePrice,
    0
  );

  const recentBookings = bookings?.slice(0, 5) ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Provider Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage your services and bookings
          </p>
        </div>

        {/* Stats Overview */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {bookings?.length ?? 0}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <svg
                  className="h-6 w-6 text-blue-600"
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
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="mt-1 text-3xl font-bold text-yellow-600">
                  {pendingCount}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
                <svg
                  className="h-6 w-6 text-yellow-600"
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
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="mt-1 text-3xl font-bold text-green-600">
                  {completedCount}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Revenue</p>
                <p className="mt-1 text-3xl font-bold text-purple-600">
                  ₱{totalRevenue.toFixed(2)}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <svg
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/dashboard/provider/services/new"
            className="flex items-center gap-4 rounded-xl border-2 border-dashed border-gray-300 bg-white p-6 transition-colors hover:border-blue-500 hover:bg-blue-50"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Add New Service</h3>
              <p className="text-sm text-gray-500">Create a new service listing</p>
            </div>
          </Link>

          <Link
            href="/dashboard/provider/bookings"
            className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Manage Bookings</h3>
              <p className="text-sm text-gray-500">View and manage requests</p>
            </div>
          </Link>

          <Link
            href="/dashboard/provider/settings"
            className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
              <svg
                className="h-6 w-6 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Payment Settings</h3>
              <p className="text-sm text-gray-500">Update payment QR code</p>
            </div>
          </Link>

          <Link
            href="/dashboard/provider/subscription"
            className="flex items-center gap-4 rounded-xl border border-orange-200 bg-orange-50 p-6 transition-shadow hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
              <svg
                className="h-6 w-6 text-orange-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Business Subscription</h3>
              <p className="text-sm text-gray-500">Upgrade to add more services</p>
            </div>
          </Link>
        </div>

        {/* My Services */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">My Services</h2>
            <Link
              href="/dashboard/provider/services/new"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Add Service
            </Link>
          </div>
          <div className="p-6">
            {servicesLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
              </div>
            ) : myServices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <svg
                    className="h-8 w-8 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  No services yet
                </h3>
                <p className="mb-4 text-gray-500">Start by adding your first service</p>
                <Link
                  href="/dashboard/provider/services/new"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Add Service
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {myServices.map((service) => {
                  const cat = categoryConfig[service.category] ?? {
                    label: service.category,
                    color: "bg-gray-100 text-gray-700",
                  };
                  return (
                    <Link
                      key={service.id}
                      href={`/dashboard/provider/services/${service.id}`}
                      className="rounded-lg border border-gray-100 p-4 transition-colors hover:bg-gray-50"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${cat.color}`}
                        >
                          {cat.label}
                        </span>
                        <span className="font-semibold text-gray-900">
                          ₱{service.basePrice.toFixed(2)}
                        </span>
                      </div>
                      <h4 className="font-medium text-gray-900">{service.title}</h4>
                      <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                        {service.description}
                      </p>
                      <p className="mt-2 text-xs text-gray-400">
                        {service.durationMinutes} min
                      </p>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent Booking Requests */}
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Booking Requests
            </h2>
            {bookings && bookings.length > 0 && (
              <Link
                href="/dashboard/provider/bookings"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View All
              </Link>
            )}
          </div>
          <div className="p-6">
            {bookingsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <svg
                    className="h-8 w-8 text-gray-400"
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
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  No booking requests
                </h3>
                <p className="text-gray-500">New requests will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentBookings.map((booking) => {
                  const statusStyle = statusConfig[booking.status];
                  const isPending = booking.status === "PENDING";

                  return (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between rounded-lg border border-gray-100 p-4"
                    >
                      <div className="flex items-center gap-4">
                        {booking.customer.image ? (
                          <img
                            src={booking.customer.image}
                            alt={booking.customer.name ?? "Customer"}
                            className="h-12 w-12 rounded-full"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-600">
                            {booking.customer.name?.charAt(0) ?? "C"}
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {booking.service.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {booking.customer.name} &bull;{" "}
                            {format(new Date(booking.startTime), "MMM d")} at{" "}
                            {format(new Date(booking.startTime), "h:mm a")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle.color}`}
                        >
                          {statusStyle.label}
                        </span>
                        {isPending && (
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                updateStatus.mutate({
                                  bookingId: booking.id,
                                  status: "CONFIRMED",
                                })
                              }
                              disabled={updateStatus.isPending}
                              className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-700 disabled:bg-green-400"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() =>
                                updateStatus.mutate({
                                  bookingId: booking.id,
                                  status: "CANCELLED",
                                })
                              }
                              disabled={updateStatus.isPending}
                              className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:bg-red-50"
                            >
                              Decline
                            </button>
                          </div>
                        )}
                        {!isPending && (
                          <Link
                            href={`/dashboard/provider/bookings/${booking.id}`}
                            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                          >
                            View
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
