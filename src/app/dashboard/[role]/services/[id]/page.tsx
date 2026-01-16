"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { api } from "~/trpc/react";
import { BookingCalendar } from "~/app/_components/BookingCalendar";

const validRoles = ["customer", "provider", "admin"];

const categoryConfig: Record<
  string,
  { label: string; color: string; bgColor: string }
> = {
  GRASS_CUTTING: {
    label: "Grass Cutting",
    color: "text-green-700",
    bgColor: "bg-green-100",
  },
  AIRCON_REPAIR: {
    label: "Aircon Repair",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
  },
  CLEANING: {
    label: "Cleaning",
    color: "text-purple-700",
    bgColor: "bg-purple-100",
  },
  HAIRCUT: {
    label: "Haircut",
    color: "text-pink-700",
    bgColor: "bg-pink-100",
  },
};

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const role = params.role as string;
  const serviceId = params.id as string;

  const { data: service, isLoading, error } = api.service.getById.useQuery(
    { id: serviceId },
    { enabled: !!serviceId }
  );

  const userRole = session?.user?.role?.toLowerCase() ?? "customer";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated") {
      // Validate role parameter
      if (!validRoles.includes(role)) {
        router.push(`/dashboard/${userRole}/services/${serviceId}`);
        return;
      }

      // Redirect if role doesn't match
      if (role !== userRole) {
        router.push(`/dashboard/${userRole}/services/${serviceId}`);
      }
    }
  }, [status, session?.user?.role, role, userRole, serviceId, router]);

  const handleBookingComplete = () => {
    router.push(`/dashboard/${userRole}/bookings`);
  };

  if (isLoading || status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Service Not Found
          </h1>
          <p className="mb-4 text-gray-600">
            The service you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href={`/dashboard/${userRole}/services`}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Browse Services
          </Link>
        </div>
      </div>
    );
  }

  const config = categoryConfig[service.category] ?? {
    label: service.category,
    color: "text-gray-700",
    bgColor: "bg-gray-100",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href={`/dashboard/${userRole}/services`}
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
            Back to Services
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Service Info */}
        <div className="mb-8 overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${config.bgColor} ${config.color}`}
            >
              {config.label}
            </span>
          </div>

          <div className="p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">
                  {service.title}
                </h1>
                <p className="mb-6 text-lg text-gray-600">
                  {service.description}
                </p>

                {/* Provider Info */}
                <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
                  {service.provider.image ? (
                    <img
                      src={service.provider.image}
                      alt={service.provider.name ?? "Provider"}
                      className="h-12 w-12 rounded-full"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-semibold text-blue-600">
                      {service.provider.name?.charAt(0) ?? "P"}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      {service.provider.name ?? "Unknown Provider"}
                    </p>
                    <p className="text-sm text-gray-500">Service Provider</p>
                  </div>
                </div>
              </div>

              {/* Price Card */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:w-72">
                <div className="mb-4 text-center">
                  <p className="text-sm text-gray-500">Starting at</p>
                  <p className="text-4xl font-bold text-gray-900">
                    ₱{service.basePrice.toFixed(2)}
                  </p>
                </div>
                <div className="space-y-2 border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Duration</span>
                    <span className="font-medium text-gray-900">
                      {service.durationMinutes} minutes
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Category</span>
                    <span className="font-medium text-gray-900">
                      {config.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Section */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Book This Service
          </h2>

          {!session ? (
            <div className="rounded-lg bg-gray-50 p-8 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Sign in to Book
              </h3>
              <p className="mt-2 text-gray-600">
                You need to be signed in to book this service.
              </p>
              <Link
                href="/auth/signin"
                className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Sign In
              </Link>
            </div>
          ) : session.user.id === service.provider.id ? (
            <div className="rounded-lg bg-yellow-50 p-8 text-center">
              <svg
                className="mx-auto h-12 w-12 text-yellow-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                This is Your Service
              </h3>
              <p className="mt-2 text-gray-600">
                You cannot book your own service.
              </p>
            </div>
          ) : (
            <BookingCalendar
              serviceId={serviceId}
              serviceDuration={service.durationMinutes}
              onBookingComplete={handleBookingComplete}
            />
          )}
        </div>
      </main>
    </div>
  );
}
