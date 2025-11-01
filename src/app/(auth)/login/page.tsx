"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M3.06364 7.50914C4.70909 4.24092 8.09084 2 12 2C14.6954 2 16.959 2.99095 18.6909 4.60455L15.8227 7.47274C14.7864 6.48185 13.4681 5.97727 12 5.97727C9.39542 5.97727 7.19084 7.73637 6.40455 10.1C6.2045 10.7 6.09086 11.3409 6.09086 12C6.09086 12.6591 6.2045 13.3 6.40455 13.9C7.19084 16.2636 9.39542 18.0227 12 18.0227C13.3454 18.0227 14.4909 17.6682 15.3864 17.0682C16.4454 16.3591 17.15 15.3 17.3818 14.05H12V10.1818H21.4181C21.5364 10.8363 21.6 11.5182 21.6 12.2273C21.6 15.2727 20.5091 17.8363 18.6181 19.5773C16.9636 21.1046 14.7 22 12 22C8.09084 22 4.70909 19.7591 3.06364 16.4909C2.38638 15.1409 2 13.6136 2 12C2 10.3864 2.38638 8.85911 3.06364 7.50914Z" />
  </svg>
);

export default function LoginPage() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await authClient.signIn.email({
        email,
        password,
        rememberMe,
      });
      router.push("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
      console.error("Sign in error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
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

  return (
    <div className="glass-card mx-auto w-full max-w-md space-y-6 rounded-2xl p-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold text-dusk-slate dark:text-solar-white">
          Welcome back
        </h1>
        <p className="text-dusk-slate/60 dark:text-sky-mist/60">
          Sign in to access your dashboard, settings and projects.
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-5">
        <Button
          variant="outline"
          className="w-full justify-center gap-2"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <GoogleIcon className="h-4 w-4" />
          Sign in with Google
        </Button>

        <div className="flex items-center gap-2">
          <Separator className="flex-1" />
          <span className="text-sm text-dusk-slate/60 dark:text-sky-mist/60">
            or sign in with email
          </span>
          <Separator className="flex-1" />
        </div>

        <form onSubmit={handleEmailSignIn} className="space-y-6">
          <div>
            <Label
              htmlFor="email"
              className="text-dusk-slate dark:text-solar-white"
            >
              Email
            </Label>
            <div className="relative mt-2.5">
              <Input
                id="email"
                className="peer ps-9"
                placeholder="you@company.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-dusk-slate/60 peer-disabled:opacity-50 dark:text-sky-mist/60">
                <Mail size={16} aria-hidden="true" />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="text-dusk-slate dark:text-solar-white"
              >
                Password
              </Label>
              <Link
                href="/reset-password"
                className="text-sm text-dusk-slate hover:text-dusk-slate/80 dark:text-solar-white dark:hover:text-solar-white/80"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative mt-2.5">
              <Input
                id="password"
                className="pe-9 ps-9"
                placeholder="Enter your password"
                type={isVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-dusk-slate/60 peer-disabled:opacity-50 dark:text-sky-mist/60">
                <Lock size={16} aria-hidden="true" />
              </div>
              <button
                className="focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-dusk-slate/60 outline-none transition-[color,box-shadow] hover:text-dusk-slate focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-sky-mist/60 dark:hover:text-solar-white"
                type="button"
                onClick={toggleVisibility}
                aria-label={isVisible ? "Hide password" : "Show password"}
                aria-pressed={isVisible}
                aria-controls="password"
                disabled={isLoading}
              >
                {isVisible ? (
                  <EyeOff size={16} aria-hidden="true" />
                ) : (
                  <Eye size={16} aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Checkbox
              id="remember-me"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              disabled={isLoading}
            />
            <Label
              htmlFor="remember-me"
              className="text-dusk-slate dark:text-solar-white"
            >
              Remember for 30 days
            </Label>
          </div>

          <Button
            type="submit"
            className="w-full bg-radiant-amber text-solar-white hover:bg-radiant-amber/90"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <div className="text-center text-sm text-dusk-slate/60 dark:text-sky-mist/60">
          No account?{" "}
          <Link
            href="/signup"
            className="font-medium text-dusk-slate hover:underline dark:text-solar-white"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
