"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface CachedUser {
  name?: string | null;
  image?: string | null;
  role?: string | null;
}

const SESSION_CACHE_KEY = "navbar_session_cache";

function getCachedUser(): CachedUser | null {
  if (typeof window === "undefined") return null;
  try {
    const cached = sessionStorage.getItem(SESSION_CACHE_KEY);
    return cached ? (JSON.parse(cached) as CachedUser) : null;
  } catch {
    return null;
  }
}

function setCachedUser(user: CachedUser | null) {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(SESSION_CACHE_KEY);
    }
  } catch {
    // Ignore storage errors
  }
}

export function Navbar() {
  const { data: session, status } = useSession();
  const [cachedUser, setCachedUserState] = useState<CachedUser | null>(null);

  // Load cached user on mount
  useEffect(() => {
    setCachedUserState(getCachedUser());
  }, []);

  // Update cache when session changes
  useEffect(() => {
    if (session?.user) {
      const user = {
        name: session.user.name,
        image: session.user.image,
        role: session.user.role,
      };
      setCachedUser(user);
      setCachedUserState(user);
    }
    // Clear cache on logout
    if (status === "unauthenticated") {
      setCachedUser(null);
      setCachedUserState(null);
    }
  }, [session, status]);

  // Use session user or fall back to cached user
  const displayUser = session?.user ?? cachedUser;
  const hasUser = !!displayUser;
  const isAuthenticated = status === "authenticated" || hasUser;
  const isInitialLoading = status === "loading" && !hasUser;
  const userRole = displayUser?.role?.toLowerCase() ?? "customer";
  const servicesPath = `/dashboard/${userRole}/services`;
  const bookingsPath = `/dashboard/${userRole}/bookings`;
  const dashboardPath = `/dashboard/${userRole}`;
  const settingsPath = `/dashboard/${userRole}/settings`;

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <span className="text-xl font-bold text-gray-900">ServiceNow</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <Link
                href={servicesPath}
                className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
              >
                Browse Services
              </Link>
              <Link
                href={bookingsPath}
                className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
              >
                My Bookings
              </Link>
              <Link
                href={dashboardPath}
                className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
              >
                Dashboard
              </Link>
              <Link
                href={settingsPath}
                className="flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
              >
                <span>Settings</span>
              </Link>
            </>
          ) : (
            <Link
              href="/services"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              Browse Services
            </Link>
          )}
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-4">
          {isInitialLoading ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
          ) : isAuthenticated  ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {displayUser?.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {displayUser?.role?.toLowerCase()}
                </p>
              </div>
              {displayUser?.image ? (
                <img
                  src={displayUser.image}
                  alt={displayUser.name ?? "User"}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
                  {displayUser?.name?.charAt(0) ?? "U"}
                </div>
              )}
              
              <Link
                href="/api/auth/signout"
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Sign out
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/auth/signin"
                className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
