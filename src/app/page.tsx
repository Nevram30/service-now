import type { JSX } from "react";
import { ServiceGrid } from "~/app/_components/ServiceGrid";
import { api, HydrateClient } from "~/trpc/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  void api.service.getAll.prefetch({});

  return (
    <HydrateClient>
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-blue-500 blur-3xl" />
            <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-indigo-500 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
            <div className="text-center">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-400 ring-1 ring-inset ring-blue-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </span>
                Trusted by 10,000+ customers
              </span>

              <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                Find & Book
                <span className="block bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
                  Local Services
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">
                Connect with verified professionals for all your needs. Quality service,
                transparent pricing, and satisfaction guaranteed.
              </p>

              {/* Search Bar */}
              <div className="mx-auto mt-10 max-w-2xl">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="What service do you need?"
                      className="w-full rounded-xl border-0 bg-white/10 py-4 pl-12 pr-4 text-white placeholder-slate-400 backdrop-blur-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <Link
                    href="#services"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/25"
                  >
                    Search
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>

                {/* Quick Categories */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
                  <span className="text-slate-400">Popular:</span>
                  <button className="rounded-full bg-white/5 px-3 py-1 text-slate-300 ring-1 ring-inset ring-white/10 transition-all hover:bg-white/10">
                    Cleaning
                  </button>
                  <button className="rounded-full bg-white/5 px-3 py-1 text-slate-300 ring-1 ring-inset ring-white/10 transition-all hover:bg-white/10">
                    Haircut
                  </button>
                  <button className="rounded-full bg-white/5 px-3 py-1 text-slate-300 ring-1 ring-inset ring-white/10 transition-all hover:bg-white/10">
                    AC Repair
                  </button>
                  <button className="rounded-full bg-white/5 px-3 py-1 text-slate-300 ring-1 ring-inset ring-white/10 transition-all hover:bg-white/10">
                    Lawn Care
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Wave Divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg className="w-full text-white" viewBox="0 0 1440 60" fill="currentColor" preserveAspectRatio="none">
              <path d="M0 60h1440V30c-200 20-400 30-720 30S200 50 0 30v30z" />
            </svg>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-white py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <StatCard number="10K+" label="Happy Customers" />
              <StatCard number="500+" label="Verified Providers" />
              <StatCard number="50K+" label="Completed Jobs" />
              <StatCard number="4.9" label="Average Rating" icon="star" />
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                Browse by Category
              </h2>
              <p className="mt-3 text-lg text-slate-600">
                Find the right professional for any job
              </p>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
              <CategoryCard
                icon="leaf"
                label="Lawn & Garden"
                count={48}
                color="green"
              />
              <CategoryCard
                icon="snowflake"
                label="AC & Cooling"
                count={35}
                color="blue"
              />
              <CategoryCard
                icon="sparkles"
                label="Home Cleaning"
                count={62}
                color="purple"
              />
              <CategoryCard
                icon="scissors"
                label="Hair & Beauty"
                count={41}
                color="pink"
              />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Simple Process
              </span>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                How It Works
              </h2>
              <p className="mt-3 text-lg text-slate-600">
                Book a service in just 3 simple steps
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-3">
              <StepCard
                step={1}
                title="Search & Compare"
                description="Browse services, compare prices, and read reviews from verified customers."
                icon="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
              <StepCard
                step={2}
                title="Book Instantly"
                description="Select your preferred time slot and book your service with just a few clicks."
                icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
              <StepCard
                step={3}
                title="Get It Done"
                description="Your verified professional arrives on time. Pay securely after the job is done."
                icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="bg-slate-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">
                  Featured Services
                </h2>
                <p className="mt-2 text-slate-600">
                  Top-rated services from verified professionals
                </p>
              </div>
              <Link
                href="#services"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View all services
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <ServiceGrid />
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Testimonials
              </span>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                What Our Customers Say
              </h2>
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <TestimonialCard
                quote="Found an amazing cleaner within minutes. The booking process was seamless, and the service exceeded my expectations!"
                author="Sarah M."
                role="Homeowner"
                rating={5}
              />
              <TestimonialCard
                quote="As a provider, this platform has helped me grow my business. The clients are great and payments are always on time."
                author="James L."
                role="Service Provider"
                rating={5}
              />
              <TestimonialCard
                quote="Finally, a reliable platform for home services. No more endless searching - just quality professionals at fair prices."
                author="Michael T."
                role="Regular Customer"
                rating={5}
              />
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <TrustBadge
                icon="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                title="Verified Providers"
                description="All service providers are vetted and background-checked"
              />
              <TrustBadge
                icon="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                title="Secure Payments"
                description="Your payment information is encrypted and protected"
              />
              <TrustBadge
                icon="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                title="24/7 Support"
                description="Our team is always here to help you with any issues"
              />
              <TrustBadge
                icon="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                title="Satisfaction Guaranteed"
                description="Not happy? We'll make it right or refund your money"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 py-20">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-white blur-3xl" />
            <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-white blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
              Join thousands of satisfied customers and find the perfect service provider today.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/api/auth/signin"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-semibold text-blue-600 transition-all hover:bg-blue-50 hover:shadow-lg"
              >
                Book a Service
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/api/auth/signin"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                Become a Provider
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {/* Brand */}
              <div className="lg:col-span-1">
                <Link href="/" className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-xl font-bold text-white">ServiceNow</span>
                </Link>
                <p className="mt-4 text-sm text-slate-400">
                  Connecting you with trusted local professionals for all your service needs.
                </p>
                <div className="mt-6 flex gap-4">
                  <a href="#" className="text-slate-400 transition-colors hover:text-white">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-slate-400 transition-colors hover:text-white">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-slate-400 transition-colors hover:text-white">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Links */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                  Services
                </h3>
                <ul className="mt-4 space-y-3">
                  <li><a href="#" className="text-sm text-slate-400 hover:text-white">Home Cleaning</a></li>
                  <li><a href="#" className="text-sm text-slate-400 hover:text-white">Lawn Care</a></li>
                  <li><a href="#" className="text-sm text-slate-400 hover:text-white">AC Repair</a></li>
                  <li><a href="#" className="text-sm text-slate-400 hover:text-white">Hair & Beauty</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                  Company
                </h3>
                <ul className="mt-4 space-y-3">
                  <li><a href="#" className="text-sm text-slate-400 hover:text-white">About Us</a></li>
                  <li><a href="#" className="text-sm text-slate-400 hover:text-white">Careers</a></li>
                  <li><a href="#" className="text-sm text-slate-400 hover:text-white">Blog</a></li>
                  <li><a href="#" className="text-sm text-slate-400 hover:text-white">Press</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                  Support
                </h3>
                <ul className="mt-4 space-y-3">
                  <li><a href="#" className="text-sm text-slate-400 hover:text-white">Help Center</a></li>
                  <li><a href="#" className="text-sm text-slate-400 hover:text-white">Safety</a></li>
                  <li><a href="#" className="text-sm text-slate-400 hover:text-white">Terms of Service</a></li>
                  <li><a href="#" className="text-sm text-slate-400 hover:text-white">Privacy Policy</a></li>
                </ul>
              </div>
            </div>

            <div className="mt-12 border-t border-slate-800 pt-8">
              <p className="text-center text-sm text-slate-400">
                &copy; {new Date().getFullYear()} ServiceNow. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </HydrateClient>
  );
}

// Components

function StatCard({ number, label, icon }: { number: string; label: string; icon?: string }) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1">
        {icon === "star" && (
          <svg className="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
        <span className="text-3xl font-bold text-slate-900 sm:text-4xl">{number}</span>
      </div>
      <p className="mt-1 text-sm text-slate-600">{label}</p>
    </div>
  );
}

function CategoryCard({
  icon,
  label,
  count,
  color,
}: {
  icon: string;
  label: string;
  count: number;
  color: string;
}) {
  const colorClasses: Record<string, { bg: string; iconBg: string; text: string }> = {
    green: { bg: "bg-green-50", iconBg: "bg-green-500", text: "text-green-700" },
    blue: { bg: "bg-blue-50", iconBg: "bg-blue-500", text: "text-blue-700" },
    purple: { bg: "bg-purple-50", iconBg: "bg-purple-500", text: "text-purple-700" },
    pink: { bg: "bg-pink-50", iconBg: "bg-pink-500", text: "text-pink-700" },
  };

  const icons: Record<string, JSX.Element> = {
    leaf: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    snowflake: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    sparkles: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    scissors: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
      </svg>
    ),
  };

  const classes = colorClasses[color] ?? colorClasses.blue!;

  return (
    <div className={`group cursor-pointer rounded-2xl ${classes.bg} p-6 transition-all hover:shadow-lg`}>
      <div className={`mb-4 inline-flex rounded-xl ${classes.iconBg} p-3 text-white`}>
        {icons[icon]}
      </div>
      <h3 className="font-semibold text-slate-900">{label}</h3>
      <p className={`mt-1 text-sm ${classes.text}`}>{count} providers</p>
    </div>
  );
}

function StepCard({
  step,
  title,
  description,
  icon,
}: {
  step: number;
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="relative text-center">
      {/* Connector line */}
      {step < 3 && (
        <div className="absolute left-1/2 top-8 hidden h-0.5 w-full bg-slate-200 sm:block" />
      )}

      <div className="relative z-10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white">
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
        </svg>
      </div>
      <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600">
        Step {step}
      </span>
      <h3 className="mb-2 text-xl font-semibold text-slate-900">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
}

function TestimonialCard({
  quote,
  author,
  role,
  rating,
}: {
  quote: string;
  author: string;
  role: string;
  rating: number;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-6">
      <div className="mb-4 flex gap-1">
        {Array.from({ length: rating }).map((_, i) => (
          <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="mb-6 text-slate-700">&ldquo;{quote}&rdquo;</p>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white">
          {author.charAt(0)}
        </div>
        <div>
          <p className="font-medium text-slate-900">{author}</p>
          <p className="text-sm text-slate-500">{role}</p>
        </div>
      </div>
    </div>
  );
}

function TrustBadge({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
        </svg>
      </div>
      <div>
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      </div>
    </div>
  );
}
