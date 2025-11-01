import type { Metadata } from "next";
import { Header } from "@/components/navigation/header";

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
      {/* Navigation */}
      <Header />

      {/* Glassmorphic Glow Effects */}
      <div className="fixed left-20 top-20 h-96 w-96 animate-pulse rounded-full bg-radiant-amber/10 blur-3xl" />
      <div className="fixed bottom-20 right-20 h-96 w-96 animate-pulse rounded-full bg-sky-mist/10 blur-3xl delay-1000" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4">
        {children}
      </div>
    </div>
  );
}
