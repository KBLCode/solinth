"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth/auth-client";
import QRCode from "qrcode";

interface MfaSetupProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

export function MfaSetup({ onComplete, onCancel }: MfaSetupProps) {
  const [step, setStep] = useState<"generate" | "verify" | "success">(
    "generate"
  );
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedBackupCodes, setCopiedBackupCodes] = useState(false);

  useEffect(() => {
    if (step === "generate") {
      generateMfaSecret();
    }
  }, [step]);

  const generateMfaSecret = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Call Better Auth API to generate TOTP secret
      const response = await fetch("/api/auth/mfa/generate", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to generate MFA secret");
      }

      const data = await response.json();

      // Generate QR code from the otpauth URL
      const qrCode = await QRCode.toDataURL(data.otpauthUrl);
      setQrCodeUrl(qrCode);
      setSecret(data.secret);
      setBackupCodes(data.backupCodes || []);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to generate MFA secret"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Verify the TOTP code
      const response = await fetch("/api/auth/mfa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          code: verificationCode,
          secret,
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid verification code");
      }

      setStep("success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to verify code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyBackupCodes = () => {
    const codesText = backupCodes.join("\n");
    navigator.clipboard.writeText(codesText);
    setCopiedBackupCodes(true);
    setTimeout(() => setCopiedBackupCodes(false), 2000);
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    }
  };

  // Generate step
  if (step === "generate") {
    return (
      <div className="glass-card max-w-md p-8">
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
            Set Up Two-Factor Authentication
          </h2>
          <p className="mt-2 text-sm text-dusk-slate/70 dark:text-sky-mist/70">
            Add an extra layer of security to your account
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-radiant-amber/20 border-t-radiant-amber"></div>
            <p className="text-sm text-dusk-slate dark:text-solar-white">
              Generating MFA secret...
            </p>
          </div>
        ) : qrCodeUrl ? (
          <div className="space-y-6">
            {/* Step 1: Scan QR Code */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-dusk-slate dark:text-solar-white">
                Step 1: Scan QR Code
              </h3>
              <div className="rounded-lg bg-white p-4 text-center">
                <img
                  src={qrCodeUrl}
                  alt="MFA QR Code"
                  className="mx-auto h-48 w-48"
                />
              </div>
              <p className="mt-2 text-xs text-dusk-slate/60 dark:text-sky-mist/60">
                Scan this QR code with your authenticator app (Google
                Authenticator, Authy, 1Password, etc.)
              </p>
            </div>

            {/* Step 2: Manual Entry */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-dusk-slate dark:text-solar-white">
                Step 2: Or Enter Manually
              </h3>
              <div className="flex items-center gap-2 rounded-lg bg-sky-mist/10 p-3 dark:bg-sky-mist/5">
                <code className="flex-1 font-mono text-sm text-dusk-slate dark:text-solar-white">
                  {secret}
                </code>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(secret);
                  }}
                  className="rounded-lg bg-radiant-amber/10 p-2 text-radiant-amber transition-colors hover:bg-radiant-amber/20"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Backup Codes */}
            {backupCodes.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-medium text-dusk-slate dark:text-solar-white">
                  Step 3: Save Backup Codes
                </h3>
                <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
                  <div className="mb-2 flex items-start gap-2">
                    <svg
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400"
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
                    <p className="text-xs text-amber-800 dark:text-amber-200">
                      Save these backup codes in a secure location. You can use
                      them to access your account if you lose your authenticator
                      device.
                    </p>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 rounded bg-white p-3 font-mono text-xs dark:bg-midnight-graphite">
                    {backupCodes.map((code, index) => (
                      <div
                        key={index}
                        className="text-dusk-slate dark:text-solar-white"
                      >
                        {code}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyBackupCodes}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800"
                  >
                    {copiedBackupCodes ? (
                      <>
                        <svg
                          className="h-4 w-4"
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
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        Copy Backup Codes
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 rounded-lg border border-dusk-slate/20 px-4 py-3 font-medium text-dusk-slate transition-colors hover:bg-dusk-slate/5 dark:border-sky-mist/20 dark:text-solar-white dark:hover:bg-sky-mist/5"
                >
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={() => setStep("verify")}
                className="flex-1 rounded-lg bg-gradient-to-r from-radiant-amber to-amber-500 px-4 py-3 font-medium text-white shadow-lg shadow-radiant-amber/30 transition-all hover:shadow-xl hover:shadow-radiant-amber/40"
              >
                Continue to Verify
              </button>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  // Verify step
  if (step === "verify") {
    return (
      <div className="glass-card max-w-md p-8">
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-dusk-slate dark:text-solar-white">
            Verify Your Setup
          </h2>
          <p className="mt-2 text-sm text-dusk-slate/70 dark:text-sky-mist/70">
            Enter the 6-digit code from your authenticator app
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label
              htmlFor="code"
              className="mb-2 block text-sm font-medium text-dusk-slate dark:text-solar-white"
            >
              Verification Code
            </label>
            <input
              id="code"
              type="text"
              value={verificationCode}
              onChange={(e) =>
                setVerificationCode(e.target.value.replace(/\D/g, ""))
              }
              maxLength={6}
              required
              className="glass-input w-full text-center font-mono text-2xl tracking-widest"
              placeholder="000000"
              autoComplete="off"
            />
            <p className="mt-2 text-xs text-dusk-slate/60 dark:text-sky-mist/60">
              The code refreshes every 30 seconds
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep("generate")}
              className="flex-1 rounded-lg border border-dusk-slate/20 px-4 py-3 font-medium text-dusk-slate transition-colors hover:bg-dusk-slate/5 dark:border-sky-mist/20 dark:text-solar-white dark:hover:bg-sky-mist/5"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading || verificationCode.length !== 6}
              className="flex-1 rounded-lg bg-gradient-to-r from-radiant-amber to-amber-500 px-4 py-3 font-medium text-white shadow-lg shadow-radiant-amber/30 transition-all hover:shadow-xl hover:shadow-radiant-amber/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Verify & Enable"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Success step
  if (step === "success") {
    return (
      <div className="glass-card max-w-md p-8">
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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>

          <h2 className="mb-2 text-2xl font-semibold text-dusk-slate dark:text-solar-white">
            Two-Factor Authentication Enabled
          </h2>
          <p className="mb-6 text-sm text-dusk-slate/70 dark:text-sky-mist/70">
            Your account is now protected with two-factor authentication
          </p>

          <div className="mb-6 rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
            <div className="flex items-start gap-3">
              <svg
                className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-left">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Next time you sign in:
                </p>
                <ul className="mt-2 space-y-1 text-xs text-green-700 dark:text-green-300">
                  <li>• Enter your email and password</li>
                  <li>
                    • Provide the 6-digit code from your authenticator app
                  </li>
                  <li>• Use a backup code if you lose your device</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleComplete}
            className="w-full rounded-lg bg-gradient-to-r from-radiant-amber to-amber-500 px-4 py-3 font-medium text-white shadow-lg shadow-radiant-amber/30 transition-all hover:shadow-xl hover:shadow-radiant-amber/40"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return null;
}
