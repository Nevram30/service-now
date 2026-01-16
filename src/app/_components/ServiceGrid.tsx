"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { ServiceCard } from "./ServiceCard";

const categories = [
  { value: undefined, label: "All Services" },
  { value: "GRASS_CUTTING" as const, label: "Grass Cutting" },
  { value: "AIRCON_REPAIR" as const, label: "Aircon Repair" },
  { value: "CLEANING" as const, label: "Cleaning" },
  { value: "HAIRCUT" as const, label: "Haircut" },
];

export function ServiceGrid() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "GRASS_CUTTING" | "AIRCON_REPAIR" | "CLEANING" | "HAIRCUT" | undefined
  >(undefined);

  const { data: services, isLoading } = api.service.getAll.useQuery({
    category: selectedCategory,
    search: search || undefined,
  });

  return (
    <div>
      {/* Search and Filter Section */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-gray-900 placeholder-gray-500 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.label}
              onClick={() => setSelectedCategory(category.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                selectedCategory === category.value
                  ? "bg-teal-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"></div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && services?.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white py-16 text-center">
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
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No services found
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {search
              ? "Try adjusting your search or filter to find what you're looking for."
              : "No services are available at the moment. Check back later!"}
          </p>
        </div>
      )}

      {/* Services Grid */}
      {!isLoading && services && services.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              id={service.id}
              title={service.title}
              description={service.description}
              category={service.category}
              basePrice={service.basePrice}
              durationMinutes={service.durationMinutes}
              provider={service.provider}
            />
          ))}
        </div>
      )}

      {/* Results Count */}
      {!isLoading && services && services.length > 0 && (
        <p className="mt-6 text-center text-sm text-gray-500">
          Showing {services.length} service{services.length !== 1 ? "s" : ""}
          {selectedCategory &&
            ` in ${categories.find((c) => c.value === selectedCategory)?.label}`}
        </p>
      )}
    </div>
  );
}
