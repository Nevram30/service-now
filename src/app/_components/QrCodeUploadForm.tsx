"use client";

import { useState } from "react";
import Image from "next/image";
import { api } from "~/trpc/react";
import { UploadButton } from "~/lib/uploadthing";
import "@uploadthing/react/styles.css";

interface QrCodeUploadFormProps {
  currentQrCode?: string | null;
  currentNotes?: string | null;
}

export function QrCodeUploadForm({
  currentQrCode,
  currentNotes,
}: QrCodeUploadFormProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(
    currentQrCode ?? null
  );
  const [notes, setNotes] = useState(currentNotes ?? "");
  const [isUploading, setIsUploading] = useState(false);

  const utils = api.useUtils();

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

  const handleSaveNotes = () => {
    updatePaymentDetails.mutate({
      paymentQrCode: qrCodeUrl,
      paymentNotes: notes || null,
    });
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">
        Payment QR Code Settings
      </h2>

      <div className="space-y-6">
        {/* Current QR Code Display */}
        <div>
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
        <div>
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
        <div>
          <label
            htmlFor="paymentNotes"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Payment Instructions (Optional)
          </label>
          <textarea
            id="paymentNotes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g., Please include your booking ID in the payment reference"
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            rows={3}
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveNotes}
          disabled={updatePaymentDetails.isPending}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          {updatePaymentDetails.isPending ? "Saving..." : "Save Payment Settings"}
        </button>

        {updatePaymentDetails.isSuccess && (
          <p className="text-center text-sm text-green-600">
            Payment settings saved successfully!
          </p>
        )}

        {updatePaymentDetails.isError && (
          <p className="text-center text-sm text-red-600">
            {updatePaymentDetails.error.message}
          </p>
        )}
      </div>
    </div>
  );
}
