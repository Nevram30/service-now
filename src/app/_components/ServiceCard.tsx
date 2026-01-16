"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  basePrice: number;
  durationMinutes: number;
  provider: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

const categoryConfig: Record<
  string,
  { label: string; color: string; icon: string }
> = {
  GRASS_CUTTING: {
    label: "Grass Cutting",
    color: "bg-green-100 text-green-700",
    icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
  },
  AIRCON_REPAIR: {
    label: "Aircon Repair",
    color: "bg-blue-100 text-blue-700",
    icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  },
  CLEANING: {
    label: "Cleaning",
    color: "bg-purple-100 text-purple-700",
    icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
  },
  HAIRCUT: {
    label: "Haircut",
    color: "bg-pink-100 text-pink-700",
    icon: "M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z",
  },
};

export function ServiceCard({
  id,
  title,
  description,
  category,
  basePrice,
  durationMinutes,
  provider,
}: ServiceCardProps) {
  const { data: session, status } = useSession();
  const userRole = session?.user?.role?.toLowerCase() ?? "customer";

  // Use role-based path for authenticated users, fallback to public path for others
  const servicePath = status === "authenticated"
    ? `/dashboard/${userRole}/services/${id}`
    : `/services/${id}`;

  const config = categoryConfig[category] ?? {
    label: category,
    color: "bg-gray-100 text-gray-700",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  };

  return (
    <Link href={servicePath}>
      <div className="group h-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:border-blue-200 hover:shadow-md">
        {/* Category Banner */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.color}`}
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={config.icon}
              />
            </svg>
            {config.label}
          </span>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-blue-600">
            {title}
          </h3>
          <p className="mb-4 line-clamp-2 text-sm text-gray-600">
            {description}
          </p>

          {/* Provider Info */}
          <div className="mb-4 flex items-center gap-2">
            {provider.image ? (
              <img
                src={provider.image}
                alt={provider.name ?? "Provider"}
                className="h-6 w-6 rounded-full"
              />
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600">
                {provider.name?.charAt(0) ?? "P"}
              </div>
            )}
            <span className="text-sm text-gray-500">
              {provider.name ?? "Unknown Provider"}
            </span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                ₱{basePrice.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">{durationMinutes} min</p>
            </div>
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors group-hover:bg-blue-700">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
