"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  const bookingId = params.id as string;

  // Redirect to role-based route
  useEffect(() => {
    if (authStatus === "authenticated") {
      const userRole = session?.user?.role?.toLowerCase() ?? "customer";
      router.replace(`/dashboard/${userRole}/bookings/${bookingId}`);
    } else if (authStatus === "unauthenticated") {
      router.replace("/auth/signin");
    }
  }, [authStatus, session?.user?.role, bookingId, router]);

  // Show loading while redirecting
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
    </div>
  );
}
