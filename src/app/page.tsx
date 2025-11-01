import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-solar-white via-sky-mist to-midday-sand dark:from-eclipse-black dark:via-midnight-graphite dark:to-eclipse-black">
      <div className="container mx-auto px-4 py-16">
        <div className="space-y-8 text-center">
          {/* Hero Section */}
          <div className="space-y-4">
            <h1 className="bg-solar-gradient bg-clip-text text-6xl font-bold text-transparent">
              Solinth Suite
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-dusk-slate dark:text-sky-mist">
              All-in-one business management platform with 8 integrated suites.
              Track every metric, discover correlations, and make data-driven
              decisions.
            </p>
            <p className="text-lg font-medium text-radiant-amber">
              &ldquo;If it can&apos;t be measured, it can&apos;t be fixed&rdquo;
            </p>

            {/* Glassmorphic Buttons Demo */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/signup">Get Started Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button variant="secondary" size="lg">
                View Demo
              </Button>
              <Button variant="ghost" size="lg">
                Learn More
              </Button>
            </div>
          </div>

          {/* Glass Card Demo */}
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Business Suite", desc: "Core metrics & integrations" },
              { name: "AI Assistant", desc: "Sol - Your data companion" },
              { name: "Custom Dashboards", desc: "Sandbox API connections" },
              { name: "Reporting Suite", desc: "Automated insights" },
            ].map((suite, index) => (
              <div key={index} className="glass-card space-y-3 p-6 text-center">
                <h3 className="text-lg font-semibold text-dusk-slate dark:text-solar-white">
                  {suite.name}
                </h3>
                <p className="text-sm text-dusk-slate/70 dark:text-sky-mist/70">
                  {suite.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Button Variants Demo */}
          <div className="glass-card mx-auto mt-16 max-w-4xl p-8">
            <h2 className="mb-6 text-2xl font-bold text-dusk-slate dark:text-solar-white">
              Glassmorphic Button System
            </h2>
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button>Primary (Default)</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">🔥</Button>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="glass-card mx-auto mt-8 max-w-2xl p-8">
            <h2 className="mb-4 text-2xl font-bold text-dusk-slate dark:text-solar-white">
              Development Status
            </h2>
            <p className="text-dusk-slate/80 dark:text-sky-mist/80">
              ✅ Glassmorphic Design System Complete
            </p>
            <p className="mt-2 text-dusk-slate/80 dark:text-sky-mist/80">
              ✅ Button Component with Solinth Brand Colors
            </p>
            <p className="mt-2 text-dusk-slate/80 dark:text-sky-mist/80">
              ✅ Better Auth Integration Fixed
            </p>
            <p className="mt-4 text-sm text-dusk-slate/60 dark:text-sky-mist/60">
              Next.js 15 + tRPC + Supabase + Better Auth + Glassmorphic Design
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
