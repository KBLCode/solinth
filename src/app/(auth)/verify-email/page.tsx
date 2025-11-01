"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth/auth-client";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isResending, setIsResending] = useState(false);

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setStatus("error");
      setError("No verification token provided");
    }
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      // Better Auth email verification endpoint
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: verificationToken }),
      });

      if (!response.ok) {
        throw new Error("Verification failed");
      }

      setStatus("success");

      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    } catch (err: unknown) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to verify email");
    }
  };

  const handleResendEmail = async () => {
    if (!email) {
      setError("No email address provided");
      return;
    }

    setIsResending(true);
    setError("");

    try {
      // Better Auth resend verification endpoint
      const response = await fetch("/api/auth/send-verification-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      setError("");
      setSuccessMessage("Verification email sent! Please check your inbox.");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to resend verification email"
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="glass-card p-8">
        {/* Verifying State */}
        {status === "verifying" && (
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center">
              <svg
                className="h-16 w-16 animate-spin text-radiant-amber"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>

            <h2 className="mb-2 text-2xl font-semibold text-dusk-slate dark:text-solar-white">
              Verifying your email
            </h2>
            <p className="text-sm text-dusk-slate/70 dark:text-sky-mist/70">
              Please wait while we verify your email address...
            </p>
          </div>
        )}

        {/* Success State */}
        {status === "success" && (
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
              <svg
                className="h-8 w-8 text-green-600 dark:text-green-400"
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
            </div>

            <h2 className="mb-2 text-2xl font-semibold text-dusk-slate dark:text-solar-white">
              Email verified!
            </h2>
            <p className="mb-6 text-sm text-dusk-slate/70 dark:text-sky-mist/70">
              Your email has been successfully verified. Redirecting to
              dashboard...
            </p>

            <div className="mb-6 rounded-lg bg-green-50 p-4 dark:bg-green-900/10">
              <p className="text-sm text-green-800 dark:text-green-400">
                You can now access all features of Solinth Suite.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="inline-block w-full rounded-lg bg-gradient-to-r from-radiant-amber to-amber-500 px-4 py-3 text-center font-medium text-white shadow-lg shadow-radiant-amber/30 transition-all hover:shadow-xl hover:shadow-radiant-amber/40"
            >
              Go to Dashboard
            </Link>
          </div>
        )}

        {/* Error State */}
        {status === "error" && (
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <svg
                className="h-8 w-8 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>

            <h2 className="mb-2 text-2xl font-semibold text-dusk-slate dark:text-solar-white">
              Verification failed
            </h2>
            <p className="mb-6 text-sm text-dusk-slate/70 dark:text-sky-mist/70">
              {error || "We couldn't verify your email address."}
            </p>

            <div className="mb-6 rounded-lg bg-red-50 p-4 dark:bg-red-900/10">
              <p className="mb-2 text-sm text-red-800 dark:text-red-400">
                This could happen if:
              </p>
              <ul className="space-y-1 text-left text-xs text-red-700 dark:text-red-400">
                <li>• The verification link has expired</li>
                <li>• The link has already been used</li>
                <li>• The link is invalid or corrupted</li>
              </ul>
            </div>

            {email && (
              <button
                onClick={handleResendEmail}
                disabled={isResending}
                className="mb-3 w-full rounded-lg bg-gradient-to-r from-radiant-amber to-amber-500 px-4 py-3 font-medium text-white shadow-lg shadow-radiant-amber/30 transition-all hover:shadow-xl hover:shadow-radiant-amber/40 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isResending ? "Sending..." : "Resend Verification Email"}
              </button>
            )}

            <Link
              href="/login"
              className="inline-block w-full rounded-lg border border-dusk-slate/20 px-4 py-3 text-center font-medium text-dusk-slate transition-colors hover:bg-dusk-slate/5 dark:border-sky-mist/20 dark:text-solar-white dark:hover:bg-sky-mist/5"
            >
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
