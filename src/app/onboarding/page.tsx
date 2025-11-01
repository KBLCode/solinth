"use client";

/**
 * Tenant Onboarding Page
 *
 * First-time setup flow for creating an organization (tenant).
 * Uses glassmorphic design with Solinth brand colors.
 *
 * PRD Reference: Lines 701-750 (Multi-tenancy)
 * PLAN Reference: Lines 128-147 (Task 1.4)
 */

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [organizationName, setOrganizationName] = useState("");
  const [organizationSlug, setOrganizationSlug] = useState("");
  const [plan, setPlan] = useState<"FREE" | "PRO" | "BUSINESS">("FREE");

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    setOrganizationName(name);
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setOrganizationSlug(slug);
  };

  // Create organization
  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Create organization via Better Auth
      const result = await authClient.organization.create({
        name: organizationName,
        slug: organizationSlug,
        metadata: {
          plan,
        },
      });

      if (result.error) {
        throw new Error(
          result.error.message || "Failed to create organization"
        );
      }

      // Set as active organization
      await authClient.organization.setActive({
        organizationId: result.data?.id || "",
      });

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Failed to create organization");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-solar-white via-sky-mist/20 to-midday-sand/30 dark:from-eclipse-black dark:via-midnight-graphite dark:to-eclipse-black">
      {/* Background Pattern */}
      <div className="pointer-events-none fixed inset-0 bg-[url('/patterns/solar-gradient.svg')] opacity-5" />

      {/* Glassmorphic Glow Effects */}
      <div className="fixed left-20 top-20 h-96 w-96 animate-pulse rounded-full bg-radiant-amber/20 blur-3xl" />
      <div className="fixed bottom-20 right-20 h-96 w-96 animate-pulse rounded-full bg-sky-mist/20 blur-3xl delay-1000" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="bg-gradient-to-r from-radiant-amber to-amber-500 bg-clip-text text-4xl font-bold text-transparent">
            Solinth
          </h1>
          <p className="mt-2 text-sm text-dusk-slate/70 dark:text-sky-mist/70">
            If it can&apos;t be measured, it can&apos;t be fixed
          </p>
        </div>

        {/* Onboarding Card */}
        <div className="glass-card w-full max-w-2xl p-8">
          {/* Progress Steps */}
          <div className="mb-8 flex items-center justify-center gap-2">
            <div
              className={`h-2 w-16 rounded-full transition-all ${
                step >= 1
                  ? "bg-radiant-amber"
                  : "bg-dusk-slate/20 dark:bg-sky-mist/20"
              }`}
            />
            <div
              className={`h-2 w-16 rounded-full transition-all ${
                step >= 2
                  ? "bg-radiant-amber"
                  : "bg-dusk-slate/20 dark:bg-sky-mist/20"
              }`}
            />
            <div
              className={`h-2 w-16 rounded-full transition-all ${
                step >= 3
                  ? "bg-radiant-amber"
                  : "bg-dusk-slate/20 dark:bg-sky-mist/20"
              }`}
            />
          </div>

          {/* Step 1: Welcome */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-dusk-slate dark:text-solar-white">
                  Welcome to Solinth! 🎉
                </h2>
                <p className="mt-2 text-dusk-slate/70 dark:text-sky-mist/70">
                  Let&apos;s set up your organization to get started with
                  tracking your business metrics.
                </p>
              </div>

              <div className="glass-card space-y-4 bg-radiant-amber/5 p-6">
                <h3 className="font-medium text-dusk-slate dark:text-solar-white">
                  What you&apos;ll get:
                </h3>
                <ul className="space-y-2 text-sm text-dusk-slate/80 dark:text-sky-mist/80">
                  <li className="flex items-start gap-2">
                    <svg
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-radiant-amber"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>
                      <strong>8 Integrated Suites</strong> - Business, Creative,
                      Directors, Brand, Reporting, Support, Security, Custom
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-radiant-amber"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>
                      <strong>Micro-Metrics Tracking</strong> - Track revenue
                      per hour, product, customer
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-radiant-amber"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4L19 7"
                      />
                    </svg>
                    <span>
                      <strong>AI Assistant &quot;Sol&quot;</strong> - Natural
                      language queries and proactive insights
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-radiant-amber"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>
                      <strong>Cross-Metric Correlations</strong> - Discover
                      hidden insights in your data
                    </span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full rounded-lg bg-gradient-to-r from-radiant-amber to-amber-500 px-4 py-3 font-medium text-white shadow-lg shadow-radiant-amber/30 transition-all hover:shadow-xl hover:shadow-radiant-amber/40"
              >
                Get Started
              </button>
            </div>
          )}

          {/* Step 2: Organization Details */}
          {step === 2 && (
            <form onSubmit={handleCreateOrganization} className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-dusk-slate dark:text-solar-white">
                  Create Your Organization
                </h2>
                <p className="mt-2 text-dusk-slate/70 dark:text-sky-mist/70">
                  This will be your workspace for tracking business metrics.
                </p>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-dusk-slate dark:text-solar-white"
                >
                  Organization Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={organizationName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  className="glass-input w-full"
                  placeholder="Acme Inc."
                />
              </div>

              <div>
                <label
                  htmlFor="slug"
                  className="mb-2 block text-sm font-medium text-dusk-slate dark:text-solar-white"
                >
                  Organization Slug
                </label>
                <input
                  id="slug"
                  type="text"
                  value={organizationSlug}
                  onChange={(e) => setOrganizationSlug(e.target.value)}
                  required
                  pattern="[a-z0-9-]+"
                  className="glass-input w-full"
                  placeholder="acme-inc"
                />
                <p className="mt-1 text-xs text-dusk-slate/60 dark:text-sky-mist/60">
                  Used in URLs and API calls. Only lowercase letters, numbers,
                  and hyphens.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-dusk-slate dark:text-solar-white">
                  Choose Your Plan
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "FREE", label: "Free", price: "$0" },
                    { value: "PRO", label: "Pro", price: "$49" },
                    { value: "BUSINESS", label: "Business", price: "$199" },
                  ].map((planOption) => (
                    <button
                      key={planOption.value}
                      type="button"
                      onClick={() =>
                        setPlan(planOption.value as "FREE" | "PRO" | "BUSINESS")
                      }
                      className={`glass-card p-4 text-center transition-all ${
                        plan === planOption.value
                          ? "border-2 border-radiant-amber bg-radiant-amber/10"
                          : "border-2 border-transparent hover:border-radiant-amber/30"
                      }`}
                    >
                      <p className="font-medium text-dusk-slate dark:text-solar-white">
                        {planOption.label}
                      </p>
                      <p className="mt-1 text-sm text-dusk-slate/70 dark:text-sky-mist/70">
                        {planOption.price}/mo
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                  className="flex-1 rounded-lg border border-dusk-slate/20 px-4 py-3 font-medium text-dusk-slate transition-colors hover:bg-dusk-slate/5 disabled:cursor-not-allowed disabled:opacity-50 dark:border-sky-mist/20 dark:text-solar-white dark:hover:bg-sky-mist/5"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !organizationName || !organizationSlug}
                  className="flex-1 rounded-lg bg-gradient-to-r from-radiant-amber to-amber-500 px-4 py-3 font-medium text-white shadow-lg shadow-radiant-amber/30 transition-all hover:shadow-xl hover:shadow-radiant-amber/40 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? "Creating..." : "Create Organization"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
