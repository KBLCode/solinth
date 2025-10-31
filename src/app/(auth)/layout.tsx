import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication | Solinth Suite",
  description: "Sign in to your Solinth account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
            If it can't be measured, it can't be fixed
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}
