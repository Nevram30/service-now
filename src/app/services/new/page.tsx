"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function NewServicePage() {
  const router = useRouter();
  const { status: authStatus } = useSession();

  // Redirect to new route structure
  useEffect(() => {
    if (authStatus === "authenticated") {
      router.replace("/dashboard/provider/services/new");
    } else if (authStatus === "unauthenticated") {
      router.replace("/auth/signin");
    }
  }, [authStatus, router]);

  // Show loading while redirecting
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
    </div>
  );
}
