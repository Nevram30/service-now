import type { JSX } from "react";
import { ServiceGrid } from "~/app/_components/ServiceGrid";
import { api, HydrateClient } from "~/trpc/server";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  void api.service.getAll.prefetch({});

  return (
    <HydrateClient>
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

          {/* Floating gradient orbs */}
          <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 opacity-60 blur-3xl" />
          <div className="absolute -right-40 top-20 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-cyan-100 to-teal-100 opacity-50 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 sm:pb-32 sm:pt-28 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              {/* Badge */}
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-500 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-600"></span>
                </span>
                Over 10,000+ services booked this month
              </div>

              {/* Headline */}
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl">
                Professional services,
                <span className="relative mt-2 block">
                  <span className="relative bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-500 bg-clip-text text-transparent">
                    delivered to your door
                  </span>
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
                Connect with verified local professionals in minutes.
                From home cleaning to repairs, book trusted experts with transparent pricing and guaranteed satisfaction.
              </p>

              {/* CTA Buttons */}
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="#services"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-teal-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-teal-600/20 transition-all hover:bg-teal-700 hover:shadow-xl hover:shadow-teal-600/30"
                >
                  Explore Services
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/api/auth/signin"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-teal-200 bg-white px-8 py-4 text-base font-semibold text-teal-700 transition-all hover:border-teal-300 hover:bg-teal-50"
                >
                  Become a Provider
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Verified Professionals</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Secure Payments</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Money-back Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof - Logos */}
        <section className="border-y border-slate-100 bg-slate-50/50 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm font-medium uppercase tracking-wider text-slate-500">
              Trusted by leading companies and thousands of customers
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-8 opacity-60 grayscale">
              <LogoPlaceholder name="TechCorp" />
              <LogoPlaceholder name="Innovate" />
              <LogoPlaceholder name="HomeBase" />
              <LogoPlaceholder name="LocalPro" />
              <LogoPlaceholder name="ServiceHub" />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
              <StatCard
                number="10,000+"
                label="Happy Customers"
                description="Served nationwide"
                icon={
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                }
              />
              <StatCard
                number="500+"
                label="Verified Providers"
                description="Background checked"
                icon={
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                }
              />
              <StatCard
                number="50,000+"
                label="Jobs Completed"
                description="And counting"
                icon={
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                }
              />
              <StatCard
                number="4.9"
                label="Average Rating"
                description="From real reviews"
                icon={
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                }
                highlight
              />
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="bg-gradient-to-b from-slate-50 to-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold uppercase tracking-wider text-teal-600">
                Our Services
              </span>
              <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                Browse by Category
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Choose from a wide range of professional services tailored to your needs
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <CategoryCard
                icon="lawn"
                label="Lawn & Garden"
                description="Mowing, landscaping, and garden care"
                count={48}
                color="emerald"
              />
              <CategoryCard
                icon="cooling"
                label="AC & Cooling"
                description="Installation, repair, and maintenance"
                count={35}
                color="sky"
              />
              <CategoryCard
                icon="cleaning"
                label="Home Cleaning"
                description="Deep cleaning, regular, and move-out"
                count={62}
                color="violet"
              />
              <CategoryCard
                icon="beauty"
                label="Hair & Beauty"
                description="Haircuts, styling, and treatments"
                count={41}
                color="rose"
              />
            </div>

            <div className="mt-12 text-center">
              <Link
                href="#services"
                className="inline-flex items-center gap-2 text-base font-semibold text-teal-600 hover:text-teal-700"
              >
                View all categories
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="overflow-hidden py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold uppercase tracking-wider text-teal-600">
                How It Works
              </span>
              <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                Book a service in 3 easy steps
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                We&apos;ve simplified the entire process so you can focus on what matters most
              </p>
            </div>

            <div className="relative mt-20">
              {/* Connection line */}
              <div className="absolute left-0 right-0 top-24 hidden h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent lg:block" />

              <div className="grid gap-12 lg:grid-cols-3 lg:gap-8">
                <StepCard
                  step={1}
                  title="Search & Compare"
                  description="Browse our marketplace of verified professionals. Compare ratings, reviews, and prices to find your perfect match."
                  icon={
                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  }
                />
                <StepCard
                  step={2}
                  title="Book Instantly"
                  description="Select your preferred date and time. Confirm your booking with secure payment — it only takes a minute."
                  icon={
                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  }
                />
                <StepCard
                  step={3}
                  title="Get It Done"
                  description="Your professional arrives on time and gets the job done right. Rate your experience and enjoy peace of mind."
                  icon={
                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                />
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="bg-slate-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <span className="text-sm font-semibold uppercase tracking-wider text-teal-600">
                  Featured
                </span>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  Top-Rated Services
                </h2>
                <p className="mt-2 max-w-xl text-slate-600">
                  Handpicked services from our highest-rated professionals
                </p>
              </div>
              <Link
                href="#services"
                className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"
              >
                View all services
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <ServiceGrid />
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold uppercase tracking-wider text-teal-600">
                Testimonials
              </span>
              <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                Loved by thousands of customers
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Don&apos;t just take our word for it — hear from people who&apos;ve transformed their home service experience
              </p>
            </div>

            <div className="mt-16 grid gap-8 lg:grid-cols-3">
              <TestimonialCard
                quote="Found an amazing cleaner within minutes. The booking process was seamless, and the service exceeded my expectations. I've already booked three more services!"
                author="Sarah Mitchell"
                role="Homeowner"
                location="San Francisco, CA"
                rating={5}
              />
              <TestimonialCard
                quote="As a provider, this platform has transformed my business. The quality of clients is excellent, payments are always on time, and the support team is fantastic."
                author="James Rodriguez"
                role="Service Provider"
                location="Austin, TX"
                rating={5}
                featured
              />
              <TestimonialCard
                quote="Finally, a reliable platform for home services. No more endless searching — just quality professionals at fair prices. The verification process gives me peace of mind."
                author="Michael Thompson"
                role="Regular Customer"
                location="Seattle, WA"
                rating={5}
              />
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="border-y border-slate-100 bg-slate-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Your trust and safety come first
              </h2>
              <p className="mt-4 text-slate-600">
                We&apos;ve built every feature with your peace of mind in mind
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <TrustBadge
                icon={
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                }
                title="Verified Providers"
                description="Every professional is vetted with comprehensive background checks"
              />
              <TrustBadge
                icon={
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
                title="Secure Payments"
                description="Bank-level encryption protects your payment information"
              />
              <TrustBadge
                icon={
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                }
                title="24/7 Support"
                description="Our dedicated team is always here when you need assistance"
              />
              <TrustBadge
                icon={
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                }
                title="Satisfaction Guaranteed"
                description="Not happy with a service? We'll make it right or refund you"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden bg-slate-900 py-24">
          {/* Background elements */}
          <div className="absolute inset-0">
            <div className="absolute -left-20 -top-20 h-[400px] w-[400px] rounded-full bg-teal-500/20 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-[400px] w-[400px] rounded-full bg-cyan-500/20 blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />
          </div>

          <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Ready to experience the difference?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
              Join thousands of satisfied customers who have simplified their lives with quality home services. Your first booking is just a click away.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="#services"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-teal-500 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-teal-400"
              >
                Book Your First Service
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/api/auth/signin"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-teal-400 bg-transparent px-8 py-4 text-base font-semibold text-teal-400 transition-all hover:border-teal-300 hover:bg-teal-900/30"
              >
                Join as a Provider
              </Link>
            </div>

            {/* Mini trust indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Book in under 2 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span>No hidden fees</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-6">
              {/* Brand */}
              <div className="lg:col-span-2">
                <Link href="/" className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl">
                    <Image
                      src="/image/logo/logo.png"
                      alt="ServiceNow Logo"
                      width={36}
                      height={36}
                    />
                  </div>
                  <span className="text-xl font-bold text-slate-900">ServiceNow</span>
                </Link>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-600">
                  Connecting you with trusted local professionals for all your service needs. Quality guaranteed.
                </p>
                <div className="mt-6 flex gap-4">
                  <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </a>
                  <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Links */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Services</h3>
                <ul className="mt-4 space-y-3">
                  <li><a href="#" className="text-sm text-slate-600 transition-colors hover:text-slate-900">Home Cleaning</a></li>
                  <li><a href="#" className="text-sm text-slate-600 transition-colors hover:text-slate-900">Lawn Care</a></li>
                  <li><a href="#" className="text-sm text-slate-600 transition-colors hover:text-slate-900">AC Repair</a></li>
                  <li><a href="#" className="text-sm text-slate-600 transition-colors hover:text-slate-900">Hair & Beauty</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900">Company</h3>
                <ul className="mt-4 space-y-3">
                  <li><a href="#" className="text-sm text-slate-600 transition-colors hover:text-slate-900">About Us</a></li>
                  <li><a href="#" className="text-sm text-slate-600 transition-colors hover:text-slate-900">Careers</a></li>
                  <li><a href="#" className="text-sm text-slate-600 transition-colors hover:text-slate-900">Blog</a></li>
                  <li><a href="#" className="text-sm text-slate-600 transition-colors hover:text-slate-900">Press</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900">Support</h3>
                <ul className="mt-4 space-y-3">
                  <li><a href="#" className="text-sm text-slate-600 transition-colors hover:text-slate-900">Help Center</a></li>
                  <li><a href="#" className="text-sm text-slate-600 transition-colors hover:text-slate-900">Safety</a></li>
                  <li><a href="#" className="text-sm text-slate-600 transition-colors hover:text-slate-900">Terms of Service</a></li>
                  <li><a href="#" className="text-sm text-slate-600 transition-colors hover:text-slate-900">Privacy Policy</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900">Contact</h3>
                <ul className="mt-4 space-y-3">
                  <li className="text-sm text-slate-600">support@servicenow.com</li>
                  <li className="text-sm text-slate-600">1-800-SERVICE</li>
                  <li className="text-sm text-slate-600">Mon-Fri 9am-6pm</li>
                </ul>
              </div>
            </div>

            <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 sm:flex-row">
              <p className="text-sm text-slate-500">
                &copy; {new Date().getFullYear()} ServiceNow. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <a href="#" className="text-sm text-slate-500 transition-colors hover:text-slate-700">Privacy</a>
                <a href="#" className="text-sm text-slate-500 transition-colors hover:text-slate-700">Terms</a>
                <a href="#" className="text-sm text-slate-500 transition-colors hover:text-slate-700">Cookies</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </HydrateClient>
  );
}

// Components

function LogoPlaceholder({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 text-xl font-bold text-slate-400">
      <div className="h-8 w-8 rounded-lg bg-slate-300" />
      {name}
    </div>
  );
}

function StatCard({
  number,
  label,
  description,
  icon,
  highlight
}: {
  number: string;
  label: string;
  description: string;
  icon: JSX.Element;
  highlight?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border p-6 ${highlight
        ? 'border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50'
        : 'border-slate-200 bg-white'
      }`}>
      <div className={`mb-4 inline-flex rounded-xl p-3 ${highlight ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'
        }`}>
        {icon}
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-3xl font-bold ${highlight ? 'text-amber-700' : 'text-slate-900'}`}>
          {number}
        </span>
        {highlight && (
          <svg className="h-5 w-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
      </div>
      <p className="mt-1 font-medium text-slate-900">{label}</p>
      <p className="mt-0.5 text-sm text-slate-500">{description}</p>
    </div>
  );
}

function CategoryCard({
  icon,
  label,
  description,
  count,
  color,
}: {
  icon: string;
  label: string;
  description: string;
  count: number;
  color: string;
}) {
  const colorClasses: Record<string, { bg: string; iconBg: string; text: string; border: string; hover: string }> = {
    emerald: {
      bg: "bg-emerald-50",
      iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600",
      text: "text-emerald-700",
      border: "border-emerald-100",
      hover: "hover:border-emerald-200 hover:shadow-emerald-100"
    },
    sky: {
      bg: "bg-sky-50",
      iconBg: "bg-gradient-to-br from-cyan-500 to-teal-600",
      text: "text-sky-700",
      border: "border-sky-100",
      hover: "hover:border-sky-200 hover:shadow-sky-100"
    },
    violet: {
      bg: "bg-violet-50",
      iconBg: "bg-gradient-to-br from-violet-500 to-purple-600",
      text: "text-violet-700",
      border: "border-violet-100",
      hover: "hover:border-violet-200 hover:shadow-violet-100"
    },
    rose: {
      bg: "bg-rose-50",
      iconBg: "bg-gradient-to-br from-rose-500 to-pink-600",
      text: "text-rose-700",
      border: "border-rose-100",
      hover: "hover:border-rose-200 hover:shadow-rose-100"
    },
  };

  const icons: Record<string, JSX.Element> = {
    lawn: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    cooling: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    cleaning: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    beauty: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
      </svg>
    ),
  };

  const classes = colorClasses[color] ?? colorClasses.sky!;

  return (
    <div className={`group cursor-pointer rounded-2xl border ${classes.border} ${classes.bg} p-6 transition-all duration-300 ${classes.hover} hover:shadow-lg`}>
      <div className={`mb-4 inline-flex rounded-xl ${classes.iconBg} p-3 text-white shadow-lg`}>
        {icons[icon]}
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{label}</h3>
      <p className="mt-1 text-sm text-slate-600">{description}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className={`text-sm font-medium ${classes.text}`}>{count} providers</span>
        <svg className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
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
  icon: JSX.Element;
}) {
  return (
    <div className="relative text-center lg:text-left">
      <div className="flex flex-col items-center lg:items-start">
        {/* Step number badge */}
        <div className="relative">
          <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-500/30">
            {icon}
          </div>
          <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
            {step}
          </div>
        </div>

        <h3 className="mt-6 text-xl font-semibold text-slate-900">{title}</h3>
        <p className="mt-3 leading-relaxed text-slate-600">{description}</p>
      </div>
    </div>
  );
}

function TestimonialCard({
  quote,
  author,
  role,
  location,
  rating,
  featured,
}: {
  quote: string;
  author: string;
  role: string;
  location: string;
  rating: number;
  featured?: boolean;
}) {
  return (
    <div className={`relative flex flex-col rounded-2xl p-8 ${featured
        ? 'border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50'
        : 'border border-slate-200 bg-white'
      }`}>
      {featured && (
        <div className="absolute -top-3 left-8 rounded-full bg-teal-600 px-3 py-1 text-xs font-semibold text-white">
          Featured
        </div>
      )}

      {/* Quote mark */}
      <svg className={`h-8 w-8 ${featured ? 'text-teal-300' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 32 32">
        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
      </svg>

      {/* Rating */}
      <div className="mt-4 flex gap-1">
        {Array.from({ length: rating }).map((_, i) => (
          <svg key={i} className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      <p className="mt-4 flex-1 text-lg leading-relaxed text-slate-700">&ldquo;{quote}&rdquo;</p>

      <div className="mt-6 flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-full text-base font-semibold text-white ${featured ? 'bg-gradient-to-br from-teal-600 to-cyan-600' : 'bg-slate-700'
          }`}>
          {author.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <p className="font-semibold text-slate-900">{author}</p>
          <p className="text-sm text-slate-500">{role} &bull; {location}</p>
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
  icon: JSX.Element;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-teal-600 shadow-lg shadow-slate-200">
        {icon}
      </div>
      <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
    </div>
  );
}
