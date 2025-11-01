"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: {
    token: string;
  };
}

export default function ResetPasswordConfirmPage({ params }: PageProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password strength validation
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  useEffect(() => {
    // Verify token on mount
    const verifyToken = async () => {
      try {
        const response = await fetch("/api/auth/verify-reset-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: params.token }),
        });

        if (response.ok) {
          setIsTokenValid(true);
        } else {
          setIsTokenValid(false);
          setError("This reset link is invalid or has expired");
        }
      } catch (err) {
        setIsTokenValid(false);
        setError("Failed to verify reset link");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [params.token]);

  useEffect(() => {
    // Update password strength indicators
    setPasswordStrength({
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [password]);

  const isPasswordValid = Object.values(passwordStrength).every(Boolean);
  const passwordsMatch = password === confirmPassword && confirmPassword !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!isPasswordValid) {
      setError("Password does not meet all requirements");
      setIsLoading(false);
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: params.token,
          password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to reset password");
      }

      setIsSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login?reset=success");
      }, 3000);
    } catch (err: unknown) {
      setError(err.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state while verifying token
  if (isVerifying) {
    return (
      <div className="w-full max-w-md">
        <div className="glass-card p-8">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-radiant-amber/20 border-t-radiant-amber"></div>
            <p className="text-dusk-slate dark:text-solar-white">
              Verifying reset link...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (!isTokenValid) {
    return (
      <div className="w-full max-w-md">
        <div className="glass-card p-8">
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h2 className="mb-2 text-2xl font-semibold text-dusk-slate dark:text-solar-white">
              Invalid Reset Link
            </h2>
            <p className="mb-6 text-sm text-dusk-slate/70 dark:text-sky-mist/70">
              {error}
            </p>

            <div className="space-y-3">
              <Link
                href="/reset-password"
                className="block w-full rounded-lg bg-gradient-to-r from-radiant-amber to-amber-500 px-4 py-3 text-center font-medium text-white shadow-lg shadow-radiant-amber/30 transition-all hover:shadow-xl hover:shadow-radiant-amber/40"
              >
                Request New Link
              </Link>
              <Link
                href="/login"
                className="block w-full rounded-lg border border-dusk-slate/20 px-4 py-3 text-center font-medium text-dusk-slate transition-colors hover:bg-dusk-slate/5 dark:border-sky-mist/20 dark:text-solar-white dark:hover:bg-sky-mist/5"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="w-full max-w-md">
        <div className="glass-card p-8">
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
              Password Reset Successful
            </h2>
            <p className="mb-6 text-sm text-dusk-slate/70 dark:text-sky-mist/70">
              Your password has been reset successfully. Redirecting to login...
            </p>

            <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-dusk-slate/10 dark:bg-sky-mist/10">
              <div className="h-full animate-[progress_3s_linear] bg-gradient-to-r from-radiant-amber to-amber-500"></div>
            </div>

            <Link
              href="/login"
              className="inline-block w-full rounded-lg bg-gradient-to-r from-radiant-amber to-amber-500 px-4 py-3 text-center font-medium text-white shadow-lg shadow-radiant-amber/30 transition-all hover:shadow-xl hover:shadow-radiant-amber/40"
            >
              Go to Login Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Reset password form
  return (
    <div className="w-full max-w-md">
      <div className="glass-card p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-radiant-amber/10">
            <svg
              className="h-6 w-6 text-radiant-amber"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-dusk-slate dark:text-solar-white">
            Set New Password
          </h2>
          <p className="mt-2 text-sm text-dusk-slate/70 dark:text-sky-mist/70">
            Choose a strong password for your account
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-dusk-slate dark:text-solar-white"
            >
              New Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="glass-input w-full pl-10 pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-dusk-slate/50 hover:text-dusk-slate dark:text-sky-mist/50 dark:hover:text-sky-mist"
              >
                {showPassword ? (
                  <svg
                    className="h-5 w-5"
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
                    className="h-5 w-5"
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
          </div>

          {/* Password Strength Indicators */}
          {password && (
            <div className="space-y-2 rounded-lg bg-sky-mist/10 p-3 dark:bg-sky-mist/5">
              <p className="text-xs font-medium text-dusk-slate dark:text-solar-white">
                Password Requirements:
              </p>
              <div className="space-y-1">
                <PasswordRequirement
                  met={passwordStrength.hasMinLength}
                  text="At least 8 characters"
                />
                <PasswordRequirement
                  met={passwordStrength.hasUpperCase}
                  text="One uppercase letter"
                />
                <PasswordRequirement
                  met={passwordStrength.hasLowerCase}
                  text="One lowercase letter"
                />
                <PasswordRequirement
                  met={passwordStrength.hasNumber}
                  text="One number"
                />
                <PasswordRequirement
                  met={passwordStrength.hasSpecialChar}
                  text="One special character"
                />
              </div>
            </div>
          )}

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-dusk-slate dark:text-solar-white"
            >
              Confirm Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="glass-input w-full pl-10 pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-dusk-slate/50 hover:text-dusk-slate dark:text-sky-mist/50 dark:hover:text-sky-mist"
              >
                {showConfirmPassword ? (
                  <svg
                    className="h-5 w-5"
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
                    className="h-5 w-5"
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
            {confirmPassword && !passwordsMatch && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                Passwords do not match
              </p>
            )}
            {confirmPassword && passwordsMatch && (
              <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                Passwords match ✓
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !isPasswordValid || !passwordsMatch}
            className="w-full rounded-lg bg-gradient-to-r from-radiant-amber to-amber-500 px-4 py-3 font-medium text-white shadow-lg shadow-radiant-amber/30 transition-all hover:shadow-xl hover:shadow-radiant-amber/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm font-medium text-radiant-amber transition-colors hover:text-amber-600"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

// Password requirement indicator component
function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-4 w-4 items-center justify-center rounded-full transition-colors ${
          met
            ? "bg-green-500 dark:bg-green-600"
            : "bg-dusk-slate/20 dark:bg-sky-mist/20"
        }`}
      >
        {met && (
          <svg
            className="h-3 w-3 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
      <span
        className={`text-xs ${
          met
            ? "text-green-600 dark:text-green-400"
            : "text-dusk-slate/60 dark:text-sky-mist/60"
        }`}
      >
        {text}
      </span>
    </div>
  );
}
