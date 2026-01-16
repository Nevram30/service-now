"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { api } from "~/trpc/react";

function ServiceLimitModal({
  isOpen,
  onClose,
  message,
}: {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          Service Limit Reached
        </h3>
        <p className="mb-6 text-gray-600">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <Link
            href="/dashboard/provider/subscription"
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-center font-medium text-white transition-colors hover:bg-blue-700"
          >
            Subscribe Now
          </Link>
        </div>
      </div>
    </div>
  );
}

type ServiceCategory = "GRASS_CUTTING" | "AIRCON_REPAIR" | "CLEANING" | "HAIRCUT";

const categoryOptions: { value: ServiceCategory; label: string; description: string }[] = [
  {
    value: "GRASS_CUTTING",
    label: "Grass Cutting",
    description: "Lawn mowing and garden maintenance services",
  },
  {
    value: "AIRCON_REPAIR",
    label: "Aircon Repair",
    description: "Air conditioning repair and maintenance",
  },
  {
    value: "CLEANING",
    label: "Cleaning",
    description: "Home and office cleaning services",
  },
  {
    value: "HAIRCUT",
    label: "Haircut",
    description: "Hair cutting and styling services",
  },
];

export default function NewServicePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  const role = params.role as string;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ServiceCategory | "">("");
  const [basePrice, setBasePrice] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitErrorMessage, setLimitErrorMessage] = useState("");

  const userRole = session?.user?.role?.toLowerCase() ?? "customer";

  const createService = api.service.create.useMutation({
    onSuccess: () => {
      router.push(`/dashboard/${userRole}`);
    },
    onError: (error) => {
      // Check if it's a service limit error
      if (
        error.message.includes("Free tier allows only 1 service") ||
        error.message.includes("service limit")
      ) {
        setLimitErrorMessage(error.message);
        setShowLimitModal(true);
      }
    },
  });

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (authStatus === "authenticated") {
      // Only providers can create services
      if (session?.user?.role !== "PROVIDER") {
        router.push(`/dashboard/${userRole}`);
        return;
      }

      // Redirect if role param doesn't match
      if (role !== "provider") {
        router.push("/dashboard/provider/services/new");
      }
    }
  }, [authStatus, session?.user?.role, role, userRole, router]);

  // Redirect if not authenticated or not a provider
  if (authStatus === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (authStatus === "unauthenticated") {
    return null;
  }

  if (session?.user?.role !== "PROVIDER") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Provider Access Required
          </h1>
          <p className="mb-4 text-gray-600">
            Only providers can create services. Please update your account to become a provider.
          </p>
          <Link
            href={`/dashboard/${userRole}`}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.length > 100) {
      newErrors.title = "Title must be 100 characters or less";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    } else if (description.length > 1000) {
      newErrors.description = "Description must be 1000 characters or less";
    }

    if (!category) {
      newErrors.category = "Please select a category";
    }

    const price = parseFloat(basePrice);
    if (!basePrice || isNaN(price)) {
      newErrors.basePrice = "Please enter a valid price";
    } else if (price <= 0) {
      newErrors.basePrice = "Price must be greater than 0";
    }

    const duration = parseInt(durationMinutes);
    if (!durationMinutes || isNaN(duration)) {
      newErrors.durationMinutes = "Please enter a valid duration";
    } else if (duration <= 0) {
      newErrors.durationMinutes = "Duration must be greater than 0";
    } else if (duration > 480) {
      newErrors.durationMinutes = "Duration cannot exceed 8 hours (480 minutes)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    createService.mutate({
      title: title.trim(),
      description: description.trim(),
      category: category as ServiceCategory,
      basePrice: parseFloat(basePrice),
      durationMinutes: parseInt(durationMinutes),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/dashboard/provider"
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
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Service</h1>
          <p className="mt-2 text-gray-600">
            Add a new service to your offerings. Fill out the details below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Service Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Professional Lawn Mowing"
              className={`mt-2 w-full rounded-lg border px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? "border-red-300" : "border-gray-200"
              }`}
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-600">{errors.title}</p>
            )}
            <p className="mt-2 text-sm text-gray-500">
              {title.length}/100 characters
            </p>
          </div>

          {/* Description */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your service in detail..."
              rows={4}
              className={`mt-2 w-full rounded-lg border px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? "border-red-300" : "border-gray-200"
              }`}
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-600">{errors.description}</p>
            )}
            <p className="mt-2 text-sm text-gray-500">
              {description.length}/1000 characters
            </p>
          </div>

          {/* Category */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <label className="block text-sm font-medium text-gray-700">
              Category *
            </label>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {categoryOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setCategory(option.value)}
                  className={`rounded-lg border p-4 text-left transition-all ${
                    category === option.value
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <p className="font-medium text-gray-900">{option.label}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {option.description}
                  </p>
                </button>
              ))}
            </div>
            {errors.category && (
              <p className="mt-2 text-sm text-red-600">{errors.category}</p>
            )}
          </div>

          {/* Price & Duration */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="basePrice"
                  className="block text-sm font-medium text-gray-700"
                >
                  Base Price (PHP) *
                </label>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    ₱
                  </span>
                  <input
                    type="number"
                    id="basePrice"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className={`w-full rounded-lg border py-3 pl-8 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.basePrice ? "border-red-300" : "border-gray-200"
                    }`}
                  />
                </div>
                {errors.basePrice && (
                  <p className="mt-2 text-sm text-red-600">{errors.basePrice}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="durationMinutes"
                  className="block text-sm font-medium text-gray-700"
                >
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  id="durationMinutes"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  placeholder="60"
                  min="1"
                  max="480"
                  className={`mt-2 w-full rounded-lg border px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.durationMinutes ? "border-red-300" : "border-gray-200"
                  }`}
                />
                {errors.durationMinutes && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.durationMinutes}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-4">
            <Link
              href="/dashboard/provider"
              className="rounded-lg border border-gray-200 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={createService.isPending}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              {createService.isPending ? "Creating..." : "Create Service"}
            </button>
          </div>

          {createService.isError && !showLimitModal && (
            <div className="rounded-lg bg-red-50 p-4 text-center">
              <p className="text-sm text-red-600">
                {createService.error.message}
              </p>
            </div>
          )}
        </form>
      </main>

      <ServiceLimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        message={limitErrorMessage}
      />
    </div>
  );
}
