"use client";

import { Navbar } from "@/components/navigation/navbar";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-solar-white dark:bg-eclipse-black">
      <Navbar />

      <div className="flex min-h-screen items-center justify-center px-4 pt-32">
        <div className="glass-card max-w-4xl p-16 text-center">
          <h1 className="mb-6 text-6xl font-bold text-dusk-slate dark:text-solar-white">
            Pricing
          </h1>
          <p className="mb-4 text-2xl text-dusk-slate/80 dark:text-sky-mist/80">
            Flexible pricing for 8 suites
          </p>
          <p className="text-xl text-dusk-slate/70 dark:text-sky-mist/70">
            Placeholder - Bundle, à la carte, and add-on pricing coming soon
          </p>
        </div>
      </div>
    </div>
  );
}
