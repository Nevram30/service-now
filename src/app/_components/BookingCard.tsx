"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { format } from "date-fns";

interface BookingCardProps {
  id: string;
  startTime: Date;
  endTime: Date;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  paymentStatus: "UNPAID" | "CUSTOMER_MARKED_PAID" | "PROVIDER_CONFIRMED";
  service: {
    id: string;
    title: string;
    basePrice: number;
    category: string;
  };
  provider?: {
    id: string;
    name: string | null;
    image: string | null;
  };
  customer?: {
    id: string;
    name: string | null;
    image: string | null;
  };
  showProvider?: boolean;
  showCustomer?: boolean;
  onPaymentClick?: () => void;
  onStatusUpdate?: (status: "CONFIRMED" | "CANCELLED" | "COMPLETED") => void;
  isProvider?: boolean;
}

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

const paymentStatusConfig = {
  UNPAID: {
    label: "Unpaid",
    color: "bg-orange-100 text-orange-800",
  },
  CUSTOMER_MARKED_PAID: {
    label: "Awaiting Confirmation",
    color: "bg-blue-100 text-blue-800",
  },
  PROVIDER_CONFIRMED: {
    label: "Paid",
    color: "bg-green-100 text-green-800",
  },
};

const categoryConfig: Record<string, { label: string; color: string }> = {
  GRASS_CUTTING: {
    label: "Grass Cutting",
    color: "bg-green-50 text-green-700",
  },
  AIRCON_REPAIR: {
    label: "Aircon Repair",
    color: "bg-blue-50 text-blue-700",
  },
  CLEANING: {
    label: "Cleaning",
    color: "bg-purple-50 text-purple-700",
  },
  HAIRCUT: {
    label: "Haircut",
    color: "bg-pink-50 text-pink-700",
  },
};

export function BookingCard({
  id,
  startTime,
  endTime,
  status,
  paymentStatus,
  service,
  provider,
  customer,
  showProvider = true,
  showCustomer = false,
  onPaymentClick,
  onStatusUpdate,
  isProvider = false,
}: BookingCardProps) {
  const { data: session } = useSession();
  const userRole = session?.user?.role?.toLowerCase() ?? "customer";
  const bookingPath = `/dashboard/${userRole}/bookings/${id}`;

  const statusStyle = statusConfig[status];
  const paymentStyle = paymentStatusConfig[paymentStatus];
  const categoryStyle = categoryConfig[service.category] ?? {
    label: service.category,
    color: "bg-gray-50 text-gray-700",
  };

  // Use state to avoid hydration mismatch - date formatting differs between server and client
  const [isPast, setIsPast] = useState(false);
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [formattedTimeRange, setFormattedTimeRange] = useState<string>("");

  useEffect(() => {
    setIsPast(new Date(endTime) < new Date());
    setFormattedDate(format(new Date(startTime), "EEE, MMM d, yyyy"));
    setFormattedTimeRange(
      `${format(new Date(startTime), "h:mm a")} - ${format(new Date(endTime), "h:mm a")}`
    );
  }, [startTime, endTime]);

  const canUpdateStatus =
    isProvider && status !== "CANCELLED" && status !== "COMPLETED";
  const showPaymentButton =
    !isProvider &&
    status !== "CANCELLED" &&
    paymentStatus !== "PROVIDER_CONFIRMED";

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Header with Status Badges */}
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-3">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${categoryStyle.color}`}
        >
          {categoryStyle.label}
        </span>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle.color}`}
          >
            {statusStyle.label}
          </span>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${paymentStyle.color}`}
          >
            {paymentStyle.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <Link href={bookingPath}>
          <h3 className="mb-2 text-lg font-semibold text-gray-900 hover:text-blue-600">
            {service.title}
          </h3>
        </Link>

        {/* Date & Time */}
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>{formattedDate || "Loading..."}</span>
          <span className="text-gray-400">|</span>
          <span>{formattedTimeRange || "..."}</span>
        </div>

        {/* Provider/Customer Info */}
        {showProvider && provider && (
          <div className="mb-4 flex items-center gap-3 rounded-lg bg-gray-50 p-3">
            {provider.image ? (
              <img
                src={provider.image}
                alt={provider.name ?? "Provider"}
                className="h-10 w-10 rounded-full"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                {provider.name?.charAt(0) ?? "P"}
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500">Provider</p>
              <p className="font-medium text-gray-900">
                {provider.name ?? "Unknown"}
              </p>
            </div>
          </div>
        )}

        {showCustomer && customer && (
          <div className="mb-4 flex items-center gap-3 rounded-lg bg-gray-50 p-3">
            {customer.image ? (
              <img
                src={customer.image}
                alt={customer.name ?? "Customer"}
                className="h-10 w-10 rounded-full"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-600">
                {customer.name?.charAt(0) ?? "C"}
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500">Customer</p>
              <p className="font-medium text-gray-900">
                {customer.name ?? "Unknown"}
              </p>
            </div>
          </div>
        )}

        {/* Price */}
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">Total Price</span>
          <span className="text-xl font-bold text-gray-900">
            ₱{service.basePrice.toFixed(2)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Link
            href={bookingPath}
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            View Details
          </Link>

          {showPaymentButton && onPaymentClick && (
            <button
              onClick={onPaymentClick}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              {paymentStatus === "UNPAID" ? "Pay Now" : "Payment Info"}
            </button>
          )}

          {canUpdateStatus && onStatusUpdate && (
            <div className="flex w-full gap-2 pt-2">
              {status === "PENDING" && (
                <>
                  <button
                    onClick={() => onStatusUpdate("CONFIRMED")}
                    className="flex-1 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => onStatusUpdate("CANCELLED")}
                    className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                  >
                    Cancel
                  </button>
                </>
              )}
              {status === "CONFIRMED" && !isPast && (
                <button
                  onClick={() => onStatusUpdate("CANCELLED")}
                  className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                >
                  Cancel
                </button>
              )}
              {status === "CONFIRMED" && isPast && (
                <button
                  onClick={() => onStatusUpdate("COMPLETED")}
                  className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Mark Completed
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
