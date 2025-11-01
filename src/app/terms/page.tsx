"use client";

import { Header } from "@/components/navigation/header";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-solar-white dark:bg-eclipse-black">
      <Header />
      <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-12">
        <div className="glass-card p-12">
          <h1 className="mb-4 text-4xl font-bold text-dusk-slate dark:text-solar-white">
            Terms of Service
          </h1>
          <p className="text-lg text-dusk-slate/70 dark:text-sky-mist/70">
            Terms of Service coming soon.
          </p>
        </div>
      </main>
    </div>
  );
}
