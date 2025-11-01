"use client";

/**
 * Homepage - Solinth Suite
 *
 * Status: In Progress
 *
 * Components Completed:
 * ✅ 1.1 - Navigation Bar (Navbar)
 * ✅ 1.2 - Hero Section (Glassmorphic with Shader Background)
 * 🔄 1.3 - Features Section (8 Suites Overview)
 * 🔄 1.4 - Pricing Section
 * 🔄 1.5 - About Section
 * 🔄 1.6 - Contact Section
 */

import { Navbar } from "@/components/navigation/navbar";
import { Hero } from "@/components/marketing/hero";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-solar-white dark:bg-eclipse-black">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Features Section - Coming Soon */}
      <section id="features" className="min-h-screen px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="glass-card p-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-dusk-slate dark:text-solar-white">
              8 Integrated Suites
            </h2>
            <p className="text-xl text-dusk-slate/70 dark:text-sky-mist/70">
              Coming Soon: Business Suite, AI Assistant, Custom Dashboards,
              Creative Suite, Directors Suite, Reporting Suite, Support Suite,
              Security Suite
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section - Coming Soon */}
      <section id="pricing" className="min-h-screen px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="glass-card p-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-dusk-slate dark:text-solar-white">
              Flexible Pricing
            </h2>
            <p className="text-xl text-dusk-slate/70 dark:text-sky-mist/70">
              Bundle all 8 suites, choose à la carte, or add individual
              features. Pricing details coming soon.
            </p>
          </div>
        </div>
      </section>

      {/* About Section - Coming Soon */}
      <section id="about" className="min-h-screen px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="glass-card p-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-dusk-slate dark:text-solar-white">
              About Solinth
            </h2>
            <p className="text-xl text-dusk-slate/70 dark:text-sky-mist/70">
              Building the &ldquo;Adobe Creative Cloud of business
              management&rdquo; - professional, comprehensive, and scalable.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section - Coming Soon */}
      <section id="contact" className="min-h-screen px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="glass-card p-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-dusk-slate dark:text-solar-white">
              Get in Touch
            </h2>
            <p className="text-xl text-dusk-slate/70 dark:text-sky-mist/70">
              Contact form coming soon. Ready to transform your business
              operations?
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
