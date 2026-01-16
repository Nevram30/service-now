"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";

export default function AdminActivationsPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const utils = api.useUtils();

  const { data: pendingActivations, isLoading } =
    api.business.getPendingActivations.useQuery(undefined, {
      enabled: authStatus === "authenticated",
    });

  const activateSubscription = api.business.activateSubscription.useMutation({
    onSuccess: async () => {
      await utils.business.getPendingActivations.invalidate();
    },
  });

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/auth/signin");
    } else if (authStatus === "authenticated") {
      const role = session?.user?.role ?? "CUSTOMER";
      if (role !== "ADMIN") {
        router.push(`/dashboard/${role.toLowerCase()}`);
      }
    }
  }, [authStatus, session?.user?.role, router]);

  const role = session?.user?.role ?? "CUSTOMER";
  if (
    authStatus === "loading" ||
    isLoading ||
    authStatus === "unauthenticated" ||
    role !== "ADMIN"
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/dashboard/admin" className="hover:text-gray-700">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-gray-900">Activation Requests</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Activation Requests
          </h1>
          <p className="mt-2 text-gray-600">
            Review and activate provider subscription payments
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Pending Activations
              </p>
              <p className="mt-1 text-3xl font-bold text-yellow-600">
                {pendingActivations?.length ?? 0}
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

        {/* Pending Activations List */}
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Providers Awaiting Activation
            </h2>
          </div>

          <div className="p-6">
            {pendingActivations?.length === 0 ? (
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  No Pending Activations
                </h3>
                <p className="text-gray-500">
                  All provider subscriptions have been processed.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingActivations?.map((activation) => (
                  <div
                    key={activation.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      {activation.provider.image ? (
                        <Image
                          src={activation.provider.image}
                          alt={activation.provider.name ?? "Provider"}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-semibold text-blue-600">
                          {activation.provider.name?.charAt(0) ?? "P"}
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {activation.provider.name ?? "Unknown Provider"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {activation.provider.email}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
                            Payment Sent
                          </span>
                          {activation.paymentSentAt && (
                            <span className="text-xs text-gray-400">
                              {new Date(
                                activation.paymentSentAt
                              ).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Service Limit</p>
                        <p className="font-semibold text-gray-900">
                          {activation.serviceLimit}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          activateSubscription.mutate({
                            subscriptionId: activation.id,
                          })
                        }
                        disabled={activateSubscription.isPending}
                        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-400"
                      >
                        {activateSubscription.isPending
                          ? "Activating..."
                          : "Activate"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activateSubscription.isError && (
              <p className="mt-4 text-center text-sm text-red-600">
                {activateSubscription.error.message}
              </p>
            )}

            {activateSubscription.isSuccess && (
              <p className="mt-4 text-center text-sm text-green-600">
                Subscription activated successfully!
              </p>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100">
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">
                How Activation Works
              </h3>
              <ul className="mt-2 space-y-1 text-sm text-blue-700">
                <li>
                  1. Provider scans your GCash QR code and sends payment
                </li>
                <li>
                  2. Provider marks payment as sent from their subscription page
                </li>
                <li>3. Verify payment in your GCash app</li>
                <li>
                  4. Click &quot;Activate&quot; to enable their subscription
                </li>
              </ul>
              <p className="mt-3 text-sm text-blue-600">
                Make sure to set up your GCash QR code in{" "}
                <Link
                  href="/dashboard/admin/settings"
                  className="font-medium underline hover:no-underline"
                >
                  Settings
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
