"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { api } from "~/trpc/react";

interface PaymentModalProps {
  bookingId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function PaymentModal({ bookingId, isOpen, onClose }: PaymentModalProps) {
  const utils = api.useUtils();

  // Use state to avoid hydration mismatch - date formatting differs between server and client
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [formattedTimeRange, setFormattedTimeRange] = useState<string>("");

  const { data: paymentInfo, isLoading } = api.booking.getPaymentInfo.useQuery(
    { bookingId },
    { enabled: isOpen && !!bookingId }
  );

  const markAsPaid = api.booking.markAsPaid.useMutation({
    onSuccess: async () => {
      await utils.booking.getPaymentInfo.invalidate({ bookingId });
      await utils.booking.getMyBookings.invalidate();
    },
  });

  const confirmPayment = api.booking.confirmPayment.useMutation({
    onSuccess: async () => {
      await utils.booking.getPaymentInfo.invalidate({ bookingId });
      await utils.booking.getProviderSchedule.invalidate();
    },
  });

  // Handle escape key to close modal
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleEscape]);

  // Format dates on client side only to avoid hydration mismatch
  useEffect(() => {
    if (paymentInfo?.booking) {
      setFormattedDate(
        format(new Date(paymentInfo.booking.startTime), "MMM d, yyyy")
      );
      setFormattedTimeRange(
        `${format(new Date(paymentInfo.booking.startTime), "h:mm a")} - ${format(new Date(paymentInfo.booking.endTime), "h:mm a")}`
      );
    }
  }, [paymentInfo?.booking]);

  if (!isOpen) return null;

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "UNPAID":
        return (
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
            Pending Payment
          </span>
        );
      case "CUSTOMER_MARKED_PAID":
        return (
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
            Awaiting Confirmation
          </span>
        );
      case "PROVIDER_CONFIRMED":
        return (
          <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
            Payment Confirmed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Complete Payment
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            </div>
          ) : paymentInfo ? (
            <div className="space-y-6">
              {/* Booking Summary */}
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-3 font-medium text-gray-900">
                  Booking Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Service</span>
                    <span className="font-medium text-gray-900">
                      {paymentInfo.service.title}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date</span>
                    <span className="font-medium text-gray-900">
                      {formattedDate || "Loading..."}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Time</span>
                    <span className="font-medium text-gray-900">
                      {formattedTimeRange || "..."}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Provider</span>
                    <span className="font-medium text-gray-900">
                      {paymentInfo.provider.name}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2">
                    <span className="font-medium text-gray-900">Total</span>
                    <span className="text-lg font-bold text-blue-600">
                      ₱{paymentInfo.service.basePrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Status */}
              <div className="flex items-center justify-center">
                {getPaymentStatusBadge(paymentInfo.booking.paymentStatus)}
              </div>

              {/* QR Code Section */}
              {paymentInfo.provider.paymentQrCode ? (
                <div className="text-center">
                  <p className="mb-4 text-sm text-gray-600">
                    Scan the QR code below to complete your payment
                  </p>
                  <div className="relative mx-auto h-64 w-64 overflow-hidden rounded-lg border-2 border-gray-200 bg-white">
                    <Image
                      src={paymentInfo.provider.paymentQrCode}
                      alt="Payment QR Code"
                      fill
                      className="object-contain p-2"
                      sizes="256px"
                    />
                  </div>
                  {paymentInfo.provider.paymentNotes && (
                    <p className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
                      {paymentInfo.provider.paymentNotes}
                    </p>
                  )}
                </div>
              ) : (
                <div className="rounded-lg bg-yellow-50 p-4 text-center">
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
                  <p className="mt-2 text-sm text-yellow-700">
                    The provider has not uploaded a payment QR code yet.
                    <br />
                    Please contact them directly for payment instructions.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* Customer: Mark as Paid button */}
                {paymentInfo.isCustomer &&
                  paymentInfo.booking.paymentStatus === "UNPAID" && (
                    <button
                      onClick={() => markAsPaid.mutate({ bookingId })}
                      disabled={markAsPaid.isPending}
                      className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                    >
                      {markAsPaid.isPending
                        ? "Processing..."
                        : "I've Completed Payment"}
                    </button>
                  )}

                {/* Provider: Confirm Payment button */}
                {paymentInfo.isProvider &&
                  paymentInfo.booking.paymentStatus === "CUSTOMER_MARKED_PAID" && (
                    <button
                      onClick={() => confirmPayment.mutate({ bookingId })}
                      disabled={confirmPayment.isPending}
                      className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-400"
                    >
                      {confirmPayment.isPending
                        ? "Confirming..."
                        : "Confirm Payment Received"}
                    </button>
                  )}

                {/* Success state */}
                {paymentInfo.booking.paymentStatus === "PROVIDER_CONFIRMED" && (
                  <div className="rounded-lg bg-green-50 p-4 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-green-500"
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
                    <p className="mt-2 font-medium text-green-700">
                      Payment Confirmed!
                    </p>
                    <p className="text-sm text-green-600">
                      Your booking is now confirmed.
                    </p>
                  </div>
                )}

                {/* Waiting state for customer */}
                {paymentInfo.isCustomer &&
                  paymentInfo.booking.paymentStatus === "CUSTOMER_MARKED_PAID" && (
                    <div className="rounded-lg bg-blue-50 p-4 text-center">
                      <p className="text-sm text-blue-700">
                        Waiting for provider to confirm payment...
                      </p>
                    </div>
                  )}
              </div>

              {/* Error Messages */}
              {markAsPaid.isError && (
                <p className="text-center text-sm text-red-600">
                  {markAsPaid.error.message}
                </p>
              )}
              {confirmPayment.isError && (
                <p className="text-center text-sm text-red-600">
                  {confirmPayment.error.message}
                </p>
              )}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              Failed to load payment information
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
