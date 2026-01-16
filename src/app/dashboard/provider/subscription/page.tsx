"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";

const statusConfig = {
  PENDING: {
    label: "Not Subscribed",
    color: "bg-gray-100 text-gray-700",
    description: "Pay via GCash to unlock more services",
  },
  PAYMENT_SENT: {
    label: "Payment Sent",
    color: "bg-yellow-100 text-yellow-800",
    description: "Waiting for admin to activate your subscription",
  },
  ACTIVE: {
    label: "Active",
    color: "bg-green-100 text-green-800",
    description: "Your subscription is active",
  },
};

export default function ProviderSubscriptionPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const utils = api.useUtils();

  const { data: subscriptionData, isLoading: subscriptionLoading } =
    api.business.getMySubscription.useQuery(undefined, {
      enabled: authStatus === "authenticated",
    });

  const { data: adminQr, isLoading: qrLoading } =
    api.business.getAdminQrCode.useQuery(undefined, {
      enabled: authStatus === "authenticated",
    });

  const markPaymentSent = api.business.markPaymentSent.useMutation({
    onSuccess: async () => {
      await utils.business.getMySubscription.invalidate();
    },
  });

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

  const role = session?.user?.role ?? "CUSTOMER";
  if (
    authStatus === "loading" ||
    subscriptionLoading ||
    authStatus === "unauthenticated" ||
    role !== "PROVIDER"
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  const subscription = subscriptionData?.subscription;
  const status = subscription?.status ?? "PENDING";
  const statusInfo = statusConfig[status];
  const currentServiceCount = subscriptionData?.currentServiceCount ?? 0;
  const serviceLimit = subscription?.serviceLimit ?? 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/dashboard/provider" className="hover:text-gray-700">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-gray-900">Business Subscription</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Business Subscription
          </h1>
          <p className="mt-2 text-gray-600">
            Upgrade your account to add more services
          </p>
        </div>

        {/* Current Status Card */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Current Status
              </h2>
              <div className="mt-2 flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${statusInfo.color}`}
                >
                  {statusInfo.label}
                </span>
                <span className="text-sm text-gray-500">
                  {statusInfo.description}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Services Used</p>
              <p className="text-2xl font-bold text-gray-900">
                {currentServiceCount} / {serviceLimit}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className={`h-full rounded-full transition-all ${currentServiceCount >= serviceLimit
                  ? "bg-red-500"
                  : "bg-blue-500"
                  }`}
                style={{
                  width: `${Math.min((currentServiceCount / serviceLimit) * 100, 100)}%`,
                }}
              />
            </div>
          </div>

          {currentServiceCount >= serviceLimit && status !== "ACTIVE" && (
            <p className="mt-3 text-sm text-red-600">
              You have reached your service limit. Subscribe to add more
              services.
            </p>
          )}
        </div>

        {/* Payment Section - Show only if not active */}
        {status !== "ACTIVE" && (
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              Upgrade to Premium
            </h2>

            {status === "PAYMENT_SENT" ? (
              <div className="rounded-lg bg-yellow-50 p-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                  <svg
                    className="h-8 w-8 text-yellow-600"
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
                <h3 className="mb-2 text-lg font-semibold text-yellow-800">
                  Payment Verification Pending
                </h3>
                <p className="text-yellow-700">
                  Your payment has been marked as sent. Please wait for the
                  admin to verify and activate your subscription.
                </p>
                {subscription?.paymentSentAt && (
                  <p className="mt-3 text-sm text-yellow-600">
                    Payment marked on:{" "}
                    {new Date(subscription.paymentSentAt).toLocaleString()}
                  </p>
                )}
              </div>
            ) : (
              <>
                <div className="mb-6 rounded-lg bg-blue-50 p-4">
                  <h3 className="mb-2 font-semibold text-blue-900">
                    Premium Benefits
                  </h3>
                  <ul className="space-y-2 text-sm text-blue-700">
                    <li className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Add unlimited services
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Priority listing in search results
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Reach more customers
                    </li>
                  </ul>
                </div>

                {/* GCash QR Code */}
                <div className="mb-6">

                  {qrLoading ? (
                    <div className="flex h-64 items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                    </div>
                  ) : adminQr?.qrCode ? (
                    <div className="text-center">
                      <div className="relative mx-auto h-64 w-64 overflow-hidden rounded-lg border-2 border-blue-200 bg-white">
                        <Image
                          src={adminQr.qrCode}
                          alt="GCash QR Code"
                          fill
                          className="object-contain p-2"
                          sizes="256px"
                        />
                      </div>
                      <p className="mt-3 text-sm font-medium text-gray-700">
                        Scan this QR code with your GCash app
                      </p>
                      {adminQr.notes && (
                        <div className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                          <p className="font-medium">Payment Instructions:</p>
                          <p>{adminQr.notes}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-lg bg-gray-50 p-6 text-center">
                      <p className="text-gray-500">
                        Admin payment QR code is not set up yet. Please contact
                        the administrator.
                      </p>
                    </div>
                  )}
                </div>

                {/* Mark Payment as Sent Button */}
                {adminQr?.qrCode && (
                  <div className="border-t border-gray-200 pt-6">
                    <p className="mb-4 text-sm text-gray-600">
                      After you have sent the payment via GCash, click the
                      button below to notify the admin for activation.
                    </p>
                    <button
                      onClick={() => markPaymentSent.mutate()}
                      disabled={markPaymentSent.isPending}
                      className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                    >
                      {markPaymentSent.isPending
                        ? "Submitting..."
                        : "I Have Sent the Payment - Activate My Subscription"}
                    </button>

                    {markPaymentSent.isError && (
                      <p className="mt-3 text-center text-sm text-red-600">
                        {markPaymentSent.error.message}
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Active Subscription Info */}
        {status === "ACTIVE" && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
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
              <div>
                <h3 className="text-lg font-semibold text-green-900">
                  Subscription Active
                </h3>
                <p className="text-green-700">
                  You can add up to {serviceLimit} services. Enjoy your premium
                  benefits!
                </p>
                {subscription?.activatedAt && (
                  <p className="mt-1 text-sm text-green-600">
                    Activated on:{" "}
                    {new Date(subscription.activatedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/dashboard/provider/services/new"
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-700"
              >
                <svg
                  className="h-5 w-5"
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
                Add New Service
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
