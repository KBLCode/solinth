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
    <div className="min-h-screen bg-solar-white dark:bg-eclipse-black">
      {/* Glassmorphic Glow Effects */}
      <div className="fixed left-20 top-20 h-96 w-96 animate-pulse rounded-full bg-radiant-amber/10 blur-3xl" />
      <div className="fixed bottom-20 right-20 h-96 w-96 animate-pulse rounded-full bg-sky-mist/10 blur-3xl delay-1000" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-dusk-slate dark:text-solar-white">
            Solinth
          </h1>
          <p className="mt-2 text-sm text-dusk-slate/60 dark:text-sky-mist/60">
            If it can&apos;t be measured, it can&apos;t be fixed
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}
