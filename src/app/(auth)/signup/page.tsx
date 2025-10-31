"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth/auth-client";

type Step = "account" | "organization" | "verification";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("account");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Account details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Organization details
  const [orgName, setOrgName] = useState("");
  const [orgSlug, setOrgSlug] = useState("");

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setStep("organization");
  };

  const handleOrganizationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Sign up user
      const signupResult = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (!signupResult.data) {
        throw new Error("Failed to create account");
      }

      // Create organization
      await authClient.organization.create({
        name: orgName,
        slug: orgSlug,
      });

      setStep("verification");
    } catch (err: any) {
      setError(err.message || "Failed to create account");
      setIsLoading(false);
    }
  };

  // Auto-generate slug from org name
  const handleOrgNameChange = (value: string) => {
    setOrgName(value);
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setOrgSlug(slug);
  };

  return (
    <div className="w-full max-w-md">
      {/* Progress Indicator */}
      <div className="mb-8 flex items-center justify-center space-x-4">
        <div className="flex items-center">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
              step === "account"
                ? "border-radiant-amber bg-radiant-amber text-white"
                : step === "organization" || step === "verification"
                  ? "border-radiant-amber bg-radiant-amber text-white"
                  : "border-dusk-slate/30 text-dusk-slate/50 dark:border-sky-mist/30 dark:text-sky-mist/50"
            }`}
          >
            {step === "organization" || step === "verification" ? (
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              "1"
            )}
          </div>
          <span className="ml-2 text-sm font-medium text-dusk-slate dark:text-solar-white">
            Account
          </span>
        </div>

        <div className="h-0.5 w-16 bg-dusk-slate/20 dark:bg-sky-mist/20">
          <div
            className={`h-full bg-radiant-amber transition-all duration-500 ${
              step === "organization" || step === "verification"
                ? "w-full"
                : "w-0"
            }`}
          />
        </div>

        <div className="flex items-center">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
              step === "organization"
                ? "border-radiant-amber bg-radiant-amber text-white"
                : step === "verification"
                  ? "border-radiant-amber bg-radiant-amber text-white"
                  : "border-dusk-slate/30 text-dusk-slate/50 dark:border-sky-mist/30 dark:text-sky-mist/50"
            }`}
          >
            {step === "verification" ? (
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              "2"
            )}
          </div>
          <span className="ml-2 text-sm font-medium text-dusk-slate dark:text-solar-white">
            Organization
          </span>
        </div>

        <div className="h-0.5 w-16 bg-dusk-slate/20 dark:bg-sky-mist/20">
          <div
            className={`h-full bg-radiant-amber transition-all duration-500 ${
              step === "verification" ? "w-full" : "w-0"
            }`}
          />
        </div>

        <div className="flex items-center">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
              step === "verification"
                ? "border-radiant-amber bg-radiant-amber text-white"
                : "border-dusk-slate/30 text-dusk-slate/50 dark:border-sky-mist/30 dark:text-sky-mist/50"
            }`}
          >
            3
          </div>
          <span className="ml-2 text-sm font-medium text-dusk-slate dark:text-solar-white">
            Verify
          </span>
        </div>
      </div>

      {/* Glassmorphic Card */}
      <div className="glass-card p-8">
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Step 1: Account Details */}
        {step === "account" && (
          <>
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-semibold text-dusk-slate dark:text-solar-white">
                Create your account
              </h2>
              <p className="mt-2 text-sm text-dusk-slate/70 dark:text-sky-mist/70">
                Get started with Solinth Suite
              </p>
            </div>

            <form onSubmit={handleAccountSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-dusk-slate dark:text-solar-white"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="glass-input w-full"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-dusk-slate dark:text-solar-white"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="glass-input w-full"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-dusk-slate dark:text-solar-white"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="glass-input w-full pr-10"
                    placeholder="••••••••"
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showPassword ? (
                      <svg
                        className="h-5 w-5 text-dusk-slate/50 dark:text-sky-mist/50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5 text-dusk-slate/50 dark:text-sky-mist/50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-dusk-slate/60 dark:text-sky-mist/60">
                  Must be at least 8 characters
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-dusk-slate dark:text-solar-white"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="glass-input w-full"
                  placeholder="••••••••"
                  minLength={8}
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-gradient-to-r from-radiant-amber to-amber-500 px-4 py-3 font-medium text-white shadow-lg shadow-radiant-amber/30 transition-all hover:shadow-xl hover:shadow-radiant-amber/40"
              >
                Continue
              </button>
            </form>
          </>
        )}

        {/* Step 2: Organization Details */}
        {step === "organization" && (
          <>
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-semibold text-dusk-slate dark:text-solar-white">
                Create your organization
              </h2>
              <p className="mt-2 text-sm text-dusk-slate/70 dark:text-sky-mist/70">
                Set up your workspace for your team
              </p>
            </div>

            <form onSubmit={handleOrganizationSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="orgName"
                  className="mb-2 block text-sm font-medium text-dusk-slate dark:text-solar-white"
                >
                  Organization Name
                </label>
                <input
                  id="orgName"
                  type="text"
                  value={orgName}
                  onChange={(e) => handleOrgNameChange(e.target.value)}
                  required
                  className="glass-input w-full"
                  placeholder="Acme Corporation"
                />
              </div>

              <div>
                <label
                  htmlFor="orgSlug"
                  className="mb-2 block text-sm font-medium text-dusk-slate dark:text-solar-white"
                >
                  Organization Slug
                </label>
                <div className="flex items-center">
                  <span className="mr-2 text-sm text-dusk-slate/60 dark:text-sky-mist/60">
                    solinth.com/
                  </span>
                  <input
                    id="orgSlug"
                    type="text"
                    value={orgSlug}
                    onChange={(e) => setOrgSlug(e.target.value)}
                    required
                    className="glass-input flex-1"
                    placeholder="acme-corp"
                    pattern="[a-z0-9-]+"
                  />
                </div>
                <p className="mt-1 text-xs text-dusk-slate/60 dark:text-sky-mist/60">
                  Lowercase letters, numbers, and hyphens only
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setStep("account")}
                  className="flex-1 rounded-lg border border-dusk-slate/20 px-4 py-3 font-medium text-dusk-slate transition-colors hover:bg-dusk-slate/5 dark:border-sky-mist/20 dark:text-solar-white dark:hover:bg-sky-mist/5"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 rounded-lg bg-gradient-to-r from-radiant-amber to-amber-500 px-4 py-3 font-medium text-white shadow-lg shadow-radiant-amber/30 transition-all hover:shadow-xl hover:shadow-radiant-amber/40 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? "Creating..." : "Create Organization"}
                </button>
              </div>
            </form>
          </>
        )}

        {/* Step 3: Email Verification */}
        {step === "verification" && (
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-radiant-amber/10">
              <svg
                className="h-8 w-8 text-radiant-amber"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>

            <h2 className="mb-2 text-2xl font-semibold text-dusk-slate dark:text-solar-white">
              Check your email
            </h2>
            <p className="mb-6 text-sm text-dusk-slate/70 dark:text-sky-mist/70">
              We've sent a verification link to <strong>{email}</strong>
            </p>

            <div className="mb-6 rounded-lg bg-sky-mist/10 p-4 dark:bg-sky-mist/5">
              <p className="text-sm text-dusk-slate dark:text-solar-white">
                Click the link in the email to verify your account and start
                using Solinth.
              </p>
            </div>

            <button
              onClick={() => router.push("/login")}
              className="w-full rounded-lg bg-gradient-to-r from-radiant-amber to-amber-500 px-4 py-3 font-medium text-white shadow-lg shadow-radiant-amber/30 transition-all hover:shadow-xl hover:shadow-radiant-amber/40"
            >
              Go to Login
            </button>
          </div>
        )}

        {/* Sign In Link */}
        {step !== "verification" && (
          <p className="mt-6 text-center text-sm text-dusk-slate/70 dark:text-sky-mist/70">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-radiant-amber transition-colors hover:text-amber-600"
            >
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
