"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { api } from "~/trpc/react";
import { UploadButton } from "~/lib/uploadthing";
import "@uploadthing/react/styles.css";

export default function AdminSettingsPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const utils = api.useUtils();

  const { data: profile, isLoading: profileLoading } = api.profile.getMe.useQuery(
    undefined,
    { enabled: authStatus === "authenticated" }
  );

  const [name, setName] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [paymentNotes, setPaymentNotes] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "payment">("profile");

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? "");
      setQrCodeUrl(profile.paymentQrCode ?? null);
      setPaymentNotes(profile.paymentNotes ?? "");
    }
  }, [profile]);

  // Handle authentication redirects in useEffect
  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/auth/signin");
    } else if (authStatus === "authenticated") {
      const role = session?.user?.role ?? "CUSTOMER";
      if (role !== "ADMIN") {
        router.push(`/dashboard/${role.toLowerCase()}/settings`);
      }
    }
  }, [authStatus, session?.user?.role, router]);

  const updateProfile = api.profile.updateProfile.useMutation({
    onSuccess: async () => {
      await utils.profile.getMe.invalidate();
    },
  });

  const updatePaymentDetails = api.profile.updatePaymentDetails.useMutation({
    onSuccess: async () => {
      await utils.profile.getMe.invalidate();
    },
  });

  const deleteQrCode = api.profile.deletePaymentQrCode.useMutation({
    onSuccess: async () => {
      setQrCodeUrl(null);
      await utils.profile.getMe.invalidate();
    },
  });

  // Show loading while checking auth or if redirecting
  const role = session?.user?.role ?? "CUSTOMER";
  if (authStatus === "loading" || profileLoading || authStatus === "unauthenticated" || role !== "ADMIN") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  const handleSaveProfile = () => {
    updateProfile.mutate({ name });
  };

  const handleSavePayment = () => {
    updatePaymentDetails.mutate({
      paymentQrCode: qrCodeUrl,
      paymentNotes: paymentNotes || null,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/dashboard/admin" className="hover:text-gray-700">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-gray-900">Settings</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">
            Manage your account and preferences
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex gap-6">
            <button
              onClick={() => setActiveTab("profile")}
              className={`border-b-2 pb-4 text-sm font-medium transition-colors ${
                activeTab === "profile"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Profile Account
            </button>
            <button
              onClick={() => setActiveTab("payment")}
              className={`border-b-2 pb-4 text-sm font-medium transition-colors ${
                activeTab === "payment"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Payment QR Code
            </button>
          </nav>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-6 text-xl font-semibold text-gray-900">
                Account Information
              </h2>

              {/* Avatar */}
              <div className="mb-6 flex items-center gap-4">
                {profile?.image ? (
                  <Image
                    src={profile.image}
                    alt={profile.name ?? "Profile"}
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-2xl font-semibold text-blue-600">
                    {profile?.name?.charAt(0) ?? "U"}
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900">{profile?.name}</p>
                  <p className="text-sm text-gray-500">{profile?.email}</p>
                  <span className="mt-1 inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-medium capitalize text-red-700">
                    {profile?.role?.toLowerCase()}
                  </span>
                </div>
              </div>

              {/* Name Field */}
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Display Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter your name"
                />
              </div>

              {/* Email Field (Read-only) */}
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={profile?.email ?? ""}
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Email cannot be changed
                </p>
              </div>

              {/* Account Details */}
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-3 text-sm font-medium text-gray-700">
                  Account Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Account ID</span>
                    <span className="font-mono text-gray-700">
                      {profile?.id?.slice(0, 8)}...
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Member Since</span>
                    <span className="text-gray-700">
                      {profile?.createdAt
                        ? new Date(profile.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Role</span>
                    <span className="capitalize text-gray-700">
                      {profile?.role?.toLowerCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveProfile}
                disabled={updateProfile.isPending}
                className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
              >
                {updateProfile.isPending ? "Saving..." : "Save Profile"}
              </button>

              {updateProfile.isSuccess && (
                <p className="mt-3 text-center text-sm text-green-600">
                  Profile saved successfully!
                </p>
              )}

              {updateProfile.isError && (
                <p className="mt-3 text-center text-sm text-red-600">
                  {updateProfile.error.message}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Payment QR Code Tab */}
        {activeTab === "payment" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-6 text-xl font-semibold text-gray-900">
                Payment QR Code Settings
              </h2>
              <p className="mb-6 text-sm text-gray-500">
                Upload your payment QR code so customers can easily pay for your
                services. This QR code will be shown to customers after they
                book your services.
              </p>

              {/* Current QR Code Display */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Your Payment QR Code
                </label>

                {qrCodeUrl ? (
                  <div className="relative">
                    <div className="relative mx-auto h-64 w-64 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                      <Image
                        src={qrCodeUrl}
                        alt="Payment QR Code"
                        fill
                        className="object-contain p-2"
                        sizes="256px"
                      />
                    </div>
                    <button
                      onClick={() => deleteQrCode.mutate()}
                      disabled={deleteQrCode.isPending}
                      className="mt-3 w-full rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deleteQrCode.isPending ? "Removing..." : "Remove QR Code"}
                    </button>
                  </div>
                ) : (
                  <div className="flex h-64 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                    <div className="text-center">
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
                          d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                        />
                      </svg>
                      <p className="mt-2 text-sm text-gray-500">
                        No QR code uploaded yet
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {qrCodeUrl ? "Replace QR Code" : "Upload QR Code"}
                </label>
                <UploadButton
                  endpoint="paymentQrUploader"
                  onUploadBegin={() => setIsUploading(true)}
                  onClientUploadComplete={(res) => {
                    setIsUploading(false);
                    if (res?.[0]?.ufsUrl) {
                      setQrCodeUrl(res[0].ufsUrl);
                    }
                  }}
                  onUploadError={(error: Error) => {
                    setIsUploading(false);
                    alert(`Upload failed: ${error.message}`);
                  }}
                  className="ut-button:bg-blue-600 ut-button:hover:bg-blue-700 ut-button:ut-uploading:bg-blue-400"
                />
                {isUploading && (
                  <p className="mt-2 text-sm text-gray-500">Uploading...</p>
                )}
              </div>

              {/* Payment Notes */}
              <div className="mb-6">
                <label
                  htmlFor="paymentNotes"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Payment Instructions (Optional)
                </label>
                <textarea
                  id="paymentNotes"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="e.g., Please include your booking ID in the payment reference"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              {/* Save Button */}
              <button
                onClick={handleSavePayment}
                disabled={updatePaymentDetails.isPending}
                className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
              >
                {updatePaymentDetails.isPending
                  ? "Saving..."
                  : "Save Payment Settings"}
              </button>

              {updatePaymentDetails.isSuccess && (
                <p className="mt-3 text-center text-sm text-green-600">
                  Payment settings saved successfully!
                </p>
              )}

              {updatePaymentDetails.isError && (
                <p className="mt-3 text-center text-sm text-red-600">
                  {updatePaymentDetails.error.message}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
