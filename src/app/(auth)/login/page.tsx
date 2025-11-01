"use client";

import { cn } from "@/lib/utils";
import React, { useState, useRef, useEffect } from "react";
import {
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Fingerprint,
} from "lucide-react";
import { AnimatePresence, motion, useInView, Variants } from "framer-motion";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { ShaderBackground } from "@/components/ui/shader-background";
import Link from "next/link";

// --- GLASS BUTTON COMPONENT ---
const GlassButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    contentClassName?: string;
    size?: "default" | "sm" | "lg" | "icon";
  }
>(
  (
    {
      className,
      children,
      size = "default",
      contentClassName,
      onClick,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      default: "px-6 py-3.5 text-base md:px-8 md:py-4 md:text-lg",
      sm: "px-4 py-2 text-sm md:px-6 md:py-3 md:text-base",
      lg: "px-8 py-4 text-lg md:px-10 md:py-5 md:text-xl",
      icon: "h-10 w-10 md:h-12 md:w-12 flex items-center justify-center",
    };

    const handleWrapperClick = (e: React.MouseEvent<HTMLDivElement>) => {
      const button = e.currentTarget.querySelector("button");
      if (button && e.target !== button) button.click();
    };

    return (
      <div
        className={cn(
          "glass-button-wrap relative cursor-pointer rounded-full",
          className
        )}
        onClick={handleWrapperClick}
      >
        <button
          className={cn(
            "glass-button relative z-10 rounded-full font-medium",
            sizeClasses[size]
          )}
          ref={ref}
          onClick={onClick}
          {...props}
        >
          <span
            className={cn(
              "glass-button-text relative block select-none tracking-tighter",
              contentClassName
            )}
          >
            {children}
          </span>
        </button>
        <div className="glass-button-shadow pointer-events-none rounded-full"></div>
      </div>
    );
  }
);
GlassButton.displayName = "GlassButton";

// --- BLUR FADE ANIMATION ---
interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}
function BlurFade({ children, className, delay = 0 }: BlurFadeProps) {
  const ref = useRef(null);
  const inViewResult = useInView(ref, { once: true, margin: "-50px" });
  const defaultVariants: Variants = {
    hidden: { y: 6, opacity: 0, filter: `blur(6px)` },
    visible: { y: -6, opacity: 1, filter: `blur(0px)` },
  };
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inViewResult ? "visible" : "hidden"}
      exit="hidden"
      variants={defaultVariants}
      transition={{ delay: 0.04 + delay, duration: 0.4, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// --- GOOGLE ICON ---
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    className="h-6 w-6"
  >
    <g fillRule="evenodd" fill="none">
      <g fillRule="nonzero" transform="translate(3, 2)">
        <path
          fill="#4285F4"
          d="M57.8123233,30.1515267 C57.8123233,27.7263183 57.6155321,25.9565533 57.1896408,24.1212666 L29.4960833,24.1212666 L29.4960833,35.0674653 L45.7515771,35.0674653 C45.4239683,37.7877475 43.6542033,41.8844383 39.7213169,44.6372555 L39.6661883,45.0037254 L48.4223791,51.7870338 L49.0290201,51.8475849 C54.6004021,46.7020943 57.8123233,39.1313952 57.8123233,30.1515267"
        ></path>
        <path
          fill="#34A853"
          d="M29.4960833,58.9921667 C37.4599129,58.9921667 44.1456164,56.3701671 49.0290201,51.8475849 L39.7213169,44.6372555 C37.2305867,46.3742596 33.887622,47.5868638 29.4960833,47.5868638 C21.6960582,47.5868638 15.0758763,42.4415991 12.7159637,35.3297782 L12.3700541,35.3591501 L3.26524241,42.4054492 L3.14617358,42.736447 C7.9965904,52.3717589 17.959737,58.9921667 29.4960833,58.9921667"
        ></path>
        <path
          fill="#FBBC05"
          d="M12.7159637,35.3297782 C12.0932812,33.4944915 11.7329116,31.5279353 11.7329116,29.4960833 C11.7329116,27.4640054 12.0932812,25.4976752 12.6832029,23.6623884 L12.6667095,23.2715173 L3.44779955,16.1120237 L3.14617358,16.2554937 C1.14708246,20.2539019 0,24.7439491 0,29.4960833 C0,34.2482175 1.14708246,38.7380388 3.14617358,42.736447 L12.7159637,35.3297782"
        ></path>
        <path
          fill="#EB4335"
          d="M29.4960833,11.4050769 C35.0347044,11.4050769 38.7707997,13.7975244 40.9011602,15.7968415 L49.2255853,7.66898166 C44.1130815,2.91684746 37.4599129,0 29.4960833,0 C17.959737,0 7.9965904,6.62018183 3.14617358,16.2554937 L12.6832029,23.6623884 C15.0758763,16.5505675 21.6960582,11.4050769 29.4960833,11.4050769"
        ></path>
      </g>
    </g>
  </svg>
);

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authStep, setAuthStep] = useState("email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const isEmailValid = /\S+@\S+\.\S+/.test(email);
  const isPasswordValid = password.length >= 6;

  useEffect(() => {
    if (authStep === "password") {
      setTimeout(() => passwordInputRef.current?.focus(), 500);
    }
  }, [authStep]);

  const handleEmailSignIn = async () => {
    if (!isPasswordValid) return;
    setIsLoading(true);
    setError("");

    try {
      const result = await authClient.signIn.email({
        email,
        password,
        rememberMe: true,
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
      // TODO: Implement passkey sign-in with Better Auth
      // Need to check Better Auth passkey documentation for correct method
      setError("Passkey sign-in coming soon!");
    } catch (err) {
      setError("Failed to sign in with passkey.");
      console.error("Passkey sign in error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProgressStep = () => {
    if (authStep === "email" && isEmailValid) {
      setAuthStep("password");
    } else if (authStep === "password" && isPasswordValid) {
      handleEmailSignIn();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleProgressStep();
    }
  };

  const handleGoBack = () => {
    if (authStep === "password") {
      setAuthStep("email");
      setPassword("");
    }
  };

  return (
    <>
      <style>{`
        @property --angle-1 { syntax: "<angle>"; inherits: false; initial-value: -75deg; }
        @property --angle-2 { syntax: "<angle>"; inherits: false; initial-value: -45deg; }
        .glass-button-wrap { --anim-time: 400ms; --anim-ease: cubic-bezier(0.25, 1, 0.5, 1); --border-width: clamp(1px, 0.0625em, 4px); position: relative; z-index: 2; transform-style: preserve-3d; transition: transform var(--anim-time) var(--anim-ease); }
        .glass-button-wrap:has(.glass-button:active) { transform: rotateX(25deg); }
        .glass-button-shadow { --shadow-cutoff-fix: 2em; position: absolute; width: calc(100% + var(--shadow-cutoff-fix)); height: calc(100% + var(--shadow-cutoff-fix)); top: calc(0% - var(--shadow-cutoff-fix) / 2); left: calc(0% - var(--shadow-cutoff-fix) / 2); filter: blur(clamp(2px, 0.125em, 12px)); transition: filter var(--anim-time) var(--anim-ease); pointer-events: none; z-index: 0; }
        .glass-button-shadow::after { content: ""; position: absolute; inset: 0; border-radius: 9999px; background: linear-gradient(180deg, rgba(255, 168, 69, 0.2), rgba(255, 168, 69, 0.1)); width: calc(100% - var(--shadow-cutoff-fix) - 0.25em); height: calc(100% - var(--shadow-cutoff-fix) - 0.25em); top: calc(var(--shadow-cutoff-fix) - 0.5em); left: calc(var(--shadow-cutoff-fix) - 0.875em); padding: 0.125em; box-sizing: border-box; mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); mask-composite: exclude; transition: all var(--anim-time) var(--anim-ease); opacity: 1; }
        .glass-button { -webkit-tap-highlight-color: transparent; backdrop-filter: blur(clamp(1px, 0.125em, 4px)); transition: all var(--anim-time) var(--anim-ease); background: linear-gradient(-75deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05)); box-shadow: inset 0 0.125em 0.125em rgba(255, 168, 69, 0.05), inset 0 -0.125em 0.125em rgba(0, 0, 0, 0.1), 0 0.25em 0.125em -0.125em rgba(255, 168, 69, 0.2), 0 0 0.1em 0.25em inset rgba(255, 255, 255, 0.2), 0 0 0 0 rgba(255, 255, 255, 0); }
        .dark .glass-button { background: linear-gradient(-75deg, rgba(28, 31, 36, 0.05), rgba(28, 31, 36, 0.2), rgba(28, 31, 36, 0.05)); }
        .glass-button:hover { transform: scale(0.975); backdrop-filter: blur(0.01em); box-shadow: inset 0 0.125em 0.125em rgba(255, 168, 69, 0.05), inset 0 -0.125em 0.125em rgba(0, 0, 0, 0.1), 0 0.15em 0.05em -0.1em rgba(255, 168, 69, 0.25), 0 0 0.05em 0.1em inset rgba(255, 255, 255, 0.3), 0 0 0 0 rgba(255, 255, 255, 0); }
        .glass-button-text { color: #2E3440; text-shadow: 0em 0.25em 0.05em rgba(0, 0, 0, 0.1); transition: all var(--anim-time) var(--anim-ease); }
        .dark .glass-button-text { color: #FFFFFF; }
        .glass-button:hover .glass-button-text { text-shadow: 0.025em 0.025em 0.025em rgba(0, 0, 0, 0.12); }
        .glass-input-wrap { position: relative; z-index: 2; transform-style: preserve-3d; border-radius: 9999px; }
        .glass-input { display: flex; position: relative; width: 100%; align-items: center; gap: 0.5rem; border-radius: 9999px; padding: 0.25rem; -webkit-tap-highlight-color: transparent; backdrop-filter: blur(clamp(1px, 0.125em, 4px)); transition: all 400ms cubic-bezier(0.25, 1, 0.5, 1); background: linear-gradient(-75deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05)); box-shadow: inset 0 0.125em 0.125em rgba(255, 168, 69, 0.05), inset 0 -0.125em 0.125em rgba(0, 0, 0, 0.1), 0 0.25em 0.125em -0.125em rgba(255, 168, 69, 0.2), 0 0 0.1em 0.25em inset rgba(255, 255, 255, 0.2), 0 0 0 0 rgba(255, 255, 255, 0); }
        .dark .glass-input { background: linear-gradient(-75deg, rgba(28, 31, 36, 0.05), rgba(28, 31, 36, 0.2), rgba(28, 31, 36, 0.05)); }
        .glass-input-wrap:focus-within .glass-input { backdrop-filter: blur(0.01em); box-shadow: inset 0 0.125em 0.125em rgba(255, 168, 69, 0.05), inset 0 -0.125em 0.125em rgba(0, 0, 0, 0.1), 0 0.15em 0.05em -0.1em rgba(255, 168, 69, 0.25), 0 0 0.05em 0.1em inset rgba(255, 255, 255, 0.3), 0 0 0 0 rgba(255, 255, 255, 0); }
      `}</style>

      <div className="absolute inset-0 z-0">
        <ShaderBackground />
      </div>

      <fieldset
        disabled={isLoading}
        className="relative z-10 mx-auto flex w-full max-w-[400px] flex-col items-center gap-8 p-4 md:max-w-[500px] lg:max-w-[600px]"
      >
        {error && (
          <div className="bg-destructive/10 text-destructive w-full rounded-lg p-3 text-center text-sm md:p-4 md:text-base">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {authStep === "email" && (
            <motion.div
              key="email-content"
              initial={{ y: 6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex w-full flex-col items-center gap-4"
            >
              <BlurFade delay={0.25 * 1} className="w-full">
                <div className="text-center">
                  <h1 className="text-5xl font-light tracking-tight text-dusk-slate dark:text-solar-white sm:text-6xl md:text-7xl lg:text-8xl">
                    Welcome back
                  </h1>
                </div>
              </BlurFade>
              <BlurFade delay={0.25 * 2}>
                <p className="text-base font-medium text-dusk-slate/60 dark:text-sky-mist/60 md:text-lg">
                  Continue with
                </p>
              </BlurFade>
              <BlurFade delay={0.25 * 3}>
                <div className="flex w-full items-center justify-center gap-4 md:gap-6">
                  <GlassButton
                    onClick={handleGoogleSignIn}
                    contentClassName="flex items-center justify-center gap-2"
                    className="md:scale-110"
                  >
                    <GoogleIcon />
                    <span className="font-semibold">Google</span>
                  </GlassButton>
                  <GlassButton
                    onClick={handlePasskeySignIn}
                    contentClassName="flex items-center justify-center gap-2"
                    className="md:scale-110"
                  >
                    <Fingerprint className="h-6 w-6" />
                    <span className="font-semibold">Passkey</span>
                  </GlassButton>
                </div>
              </BlurFade>
              <BlurFade delay={0.25 * 4} className="w-full">
                <div className="flex w-full items-center gap-2 py-2 md:gap-4 md:py-4">
                  <hr className="w-full border-dusk-slate/10 dark:border-sky-mist/10" />
                  <span className="text-sm font-semibold text-dusk-slate/60 dark:text-sky-mist/60 md:text-base">
                    OR
                  </span>
                  <hr className="w-full border-dusk-slate/10 dark:border-sky-mist/10" />
                </div>
              </BlurFade>
            </motion.div>
          )}
          {authStep === "password" && (
            <motion.div
              key="password-title"
              initial={{ y: 6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex w-full flex-col items-center gap-4 text-center"
            >
              <BlurFade delay={0} className="w-full">
                <div className="text-center">
                  <h1 className="text-5xl font-light tracking-tight text-dusk-slate dark:text-solar-white sm:text-6xl md:text-7xl lg:text-8xl">
                    Enter password
                  </h1>
                </div>
              </BlurFade>
              <BlurFade delay={0.25 * 1}>
                <p className="text-base font-medium text-dusk-slate/60 dark:text-sky-mist/60 md:text-lg">
                  Sign in to your account
                </p>
              </BlurFade>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full space-y-6 md:space-y-8">
          <AnimatePresence>
            {authStep !== "password" && (
              <motion.div
                key="email-field"
                exit={{ opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full"
              >
                <BlurFade
                  delay={authStep === "email" ? 0.25 * 5 : 0}
                  className="w-full"
                >
                  <div className="glass-input-wrap w-full">
                    <div className="glass-input">
                      <div
                        className={cn(
                          "relative z-10 flex flex-shrink-0 items-center justify-center overflow-hidden transition-all duration-300 ease-in-out",
                          email.length > 20
                            ? "w-0 px-0"
                            : "w-10 pl-2 md:w-12 md:pl-3"
                        )}
                      >
                        <Mail className="h-5 w-5 flex-shrink-0 text-dusk-slate/80 dark:text-solar-white/80 md:h-6 md:w-6" />
                      </div>
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className={cn(
                          "relative z-10 h-full w-0 grow bg-transparent text-base text-dusk-slate transition-[padding-right] delay-300 duration-300 ease-in-out placeholder:text-dusk-slate/60 focus:outline-none dark:text-solar-white dark:placeholder:text-sky-mist/60 md:text-lg",
                          isEmailValid ? "pr-2" : "pr-0"
                        )}
                      />
                      <div
                        className={cn(
                          "relative z-10 flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out",
                          isEmailValid ? "w-10 pr-1 md:w-12 md:pr-2" : "w-0"
                        )}
                      >
                        <GlassButton
                          type="button"
                          onClick={handleProgressStep}
                          size="icon"
                          aria-label="Continue with email"
                          contentClassName="text-dusk-slate/80 dark:text-solar-white/80"
                        >
                          <ArrowRight className="h-5 w-5 md:h-6 md:w-6" />
                        </GlassButton>
                      </div>
                    </div>
                  </div>
                </BlurFade>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {authStep === "password" && (
              <BlurFade key="password-field" className="w-full">
                <div className="relative w-full">
                  <AnimatePresence>
                    {password.length > 0 && (
                      <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="absolute -top-6 left-4 z-10"
                      >
                        <label className="text-xs font-semibold text-dusk-slate/60 dark:text-sky-mist/60">
                          Password
                        </label>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="glass-input-wrap w-full">
                    <div className="glass-input">
                      <div className="relative z-10 flex w-10 flex-shrink-0 items-center justify-center pl-2 md:w-12 md:pl-3">
                        {isPasswordValid ? (
                          <button
                            type="button"
                            aria-label="Toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            className="rounded-full p-2 text-dusk-slate/80 transition-colors hover:text-dusk-slate dark:text-solar-white/80 dark:hover:text-solar-white"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5 md:h-6 md:w-6" />
                            ) : (
                              <Eye className="h-5 w-5 md:h-6 md:w-6" />
                            )}
                          </button>
                        ) : (
                          <Lock className="h-5 w-5 flex-shrink-0 text-dusk-slate/80 dark:text-solar-white/80 md:h-6 md:w-6" />
                        )}
                      </div>
                      <input
                        ref={passwordInputRef}
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="relative z-10 h-full w-0 grow bg-transparent text-base text-dusk-slate placeholder:text-dusk-slate/60 focus:outline-none dark:text-solar-white dark:placeholder:text-sky-mist/60 md:text-lg"
                      />
                      <div
                        className={cn(
                          "relative z-10 flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out",
                          isPasswordValid ? "w-10 pr-1 md:w-12 md:pr-2" : "w-0"
                        )}
                      >
                        <GlassButton
                          type="button"
                          onClick={handleProgressStep}
                          size="icon"
                          aria-label="Sign in"
                          contentClassName="text-dusk-slate/80 dark:text-solar-white/80"
                        >
                          <ArrowRight className="h-5 w-5 md:h-6 md:w-6" />
                        </GlassButton>
                      </div>
                    </div>
                  </div>
                </div>
                <BlurFade delay={0.2}>
                  <button
                    type="button"
                    onClick={handleGoBack}
                    className="mt-4 flex items-center gap-2 text-sm text-dusk-slate/70 transition-colors hover:text-dusk-slate dark:text-sky-mist/70 dark:hover:text-solar-white"
                  >
                    <ArrowLeft className="h-4 w-4" /> Go back
                  </button>
                </BlurFade>
              </BlurFade>
            )}
          </AnimatePresence>
        </div>

        <BlurFade delay={0.25 * 6} className="mt-8 w-full text-center">
          <p className="text-base text-dusk-slate dark:text-solar-white md:text-lg">
            No account?{" "}
            <Link
              href="/signup"
              className="font-bold text-dusk-slate underline decoration-2 underline-offset-4 transition-all hover:opacity-70 dark:text-solar-white"
            >
              Sign up
            </Link>
          </p>
        </BlurFade>
      </fieldset>
    </>
  );
}
