"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ServiceGrid } from "~/app/_components/ServiceGrid";
import { api } from "~/trpc/react";

const validRoles = ["customer", "provider", "admin"];

export default function ServicesPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  const role = params.role as string;

  // Prefetch services
  api.service.getAll.useQuery({});

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (authStatus === "authenticated") {
      const userRole = session?.user?.role?.toLowerCase() ?? "customer";

      // Validate role parameter
      if (!validRoles.includes(role)) {
        router.push(`/dashboard/${userRole}/services`);
        return;
      }

      // Redirect if role doesn't match
      if (role !== userRole) {
        router.push(`/dashboard/${userRole}/services`);
      }
    }
  }, [authStatus, session?.user?.role, role, router]);

  // Show loading while checking auth
  if (authStatus === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  const userRole = session?.user?.role?.toLowerCase() ?? "customer";
  if (authStatus === "unauthenticated" || role !== userRole) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

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
