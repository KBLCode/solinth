"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/logo";
import { Eye, EyeOff, Fingerprint } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M3.06364 7.50914C4.70909 4.24092 8.09084 2 12 2C14.6954 2 16.959 2.99095 18.6909 4.60455L15.8227 7.47274C14.7864 6.48185 13.4681 5.97727 12 5.97727C9.39542 5.97727 7.19084 7.73637 6.40455 10.1C6.2045 10.7 6.09086 11.3409 6.09086 12C6.09086 12.6591 6.2045 13.3 6.40455 13.9C7.19084 16.2636 9.39542 18.0227 12 18.0227C13.3454 18.0227 14.4909 17.6682 15.3864 17.0682C16.4454 16.3591 17.15 15.3 17.3818 14.05H12V10.1818H21.4181C21.5364 10.8363 21.6 11.5182 21.6 12.2273C21.6 15.2727 20.5091 17.8363 18.6181 19.5773C16.9636 21.1046 14.7 22 12 22C8.09084 22 4.70909 19.7591 3.06364 16.4909C2.38638 15.1409 2 13.6136 2 12C2 10.3864 2.38638 8.85911 3.06364 7.50914Z" />
  </svg>
);

export default function SignIn() {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await authClient.signIn.email({
        email,
        password,
        rememberMe,
      });

      if (result.error) {
        setError(result.error.message || "Invalid email or password");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Invalid email or password");
      console.error("Sign in error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (err) {
      setError("Failed to sign in with Google");
      console.error("Google sign in error:", err);
      setIsLoading(false);
    }
  };

  const handlePasskeySignIn = async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await authClient.passkey.signIn();

      if (result.error) {
        setError(result.error.message || "Failed to sign in with passkey");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(
        "Failed to sign in with passkey. Make sure you have a passkey registered."
      );
      console.error("Passkey sign in error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="mx-4 w-full max-w-md pb-0">
        <CardHeader className="mb-2 mt-4 space-y-1 text-center">
          <div className="flex justify-center">
            <Logo size={48} showText={false} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-dusk-slate dark:text-solar-white">
              Sign in to Solinth
            </h2>
            <p className="text-sm text-dusk-slate/60 dark:text-sky-mist/60">
              Welcome back! Please enter your details.
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="w-full"
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <GoogleIcon className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button
              variant="outline"
              className="w-full"
              type="button"
              onClick={handlePasskeySignIn}
              disabled={isLoading}
            >
              <Fingerprint className="mr-2 h-4 w-4" />
              Passkey
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-dusk-slate/10 dark:border-sky-mist/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-solar-white px-2 text-dusk-slate/60 dark:bg-eclipse-black dark:text-sky-mist/60">
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-dusk-slate dark:text-solar-white"
              >
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-0">
              <div className="mb-2 flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-dusk-slate dark:text-solar-white"
                >
                  Password
                </Label>
                <Link
                  href="/reset-password"
                  className="text-sm text-radiant-amber hover:underline"
                >
                  Reset password
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  className="pe-9"
                  placeholder="Enter your password"
                  type={isPasswordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button
                  className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-dusk-slate/60 outline-none transition-[color,box-shadow] hover:text-dusk-slate focus:z-10 focus-visible:ring-[3px] focus-visible:ring-radiant-amber/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-sky-mist/60 dark:hover:text-solar-white"
                  type="button"
                  onClick={togglePasswordVisibility}
                  aria-label={
                    isPasswordVisible ? "Hide password" : "Show password"
                  }
                  aria-pressed={isPasswordVisible}
                  aria-controls="password"
                  disabled={isLoading}
                >
                  {isPasswordVisible ? (
                    <EyeOff size={16} aria-hidden="true" />
                  ) : (
                    <Eye size={16} aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                disabled={isLoading}
              />
              <Label
                htmlFor="remember"
                className="text-sm font-normal text-dusk-slate dark:text-solar-white"
              >
                Remember me
              </Label>
            </div>

            <Button
              className="w-full bg-radiant-amber text-solar-white hover:bg-radiant-amber/90"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-dusk-slate/10 !py-4 dark:border-sky-mist/10">
          <p className="text-center text-sm text-dusk-slate/60 dark:text-sky-mist/60">
            New to Solinth?{" "}
            <Link href="/signup" className="text-radiant-amber hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
