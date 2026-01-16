"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ServiceGrid } from "~/app/_components/ServiceGrid";
import { api } from "~/trpc/react";

export default function ServicesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Prefetch services
  api.service.getAll.useQuery({});

  useEffect(() => {
    // Redirect authenticated users to role-based route
    if (status === "authenticated") {
      const userRole = session?.user?.role?.toLowerCase() ?? "customer";
      router.replace(`/dashboard/${userRole}/services`);
    }
  }, [status, session?.user?.role, router]);

  // Show loading while redirecting authenticated users
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  // Show loading spinner while redirecting authenticated users
  if (status === "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  // Show services page for unauthenticated users (public view)
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Browse Services</h1>
          <p className="mt-2 text-gray-600">
            Find and book trusted local services
          </p>
        </div>

        {/* Services Grid */}
        <ServiceGrid />
      </div>
    </main>
  );
}
