"use client";

import { Header } from "@/components/navigation/header";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-solar-white dark:bg-eclipse-black">
      <Header />
      <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-12">
        <div className="glass-card p-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-dusk-slate dark:text-solar-white">
            Get in Touch
          </h1>
          <p className="text-xl text-dusk-slate/70 dark:text-sky-mist/70">
            Contact form coming soon. Ready to transform your business
            operations?
          </p>
        </div>
      </main>
    </div>
  );
}
