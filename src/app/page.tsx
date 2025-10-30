export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-solar-white via-sky-mist to-midday-sand dark:from-eclipse-black dark:via-midnight-graphite dark:to-eclipse-black">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          {/* Hero Section */}
          <div className="space-y-4">
            <h1 className="text-6xl font-bold bg-solar-gradient bg-clip-text text-transparent">
              Solinth Suite
            </h1>
            <p className="text-xl text-dusk-slate dark:text-sky-mist max-w-2xl mx-auto">
              All-in-one business management platform with 8 integrated suites.
              Track every metric, discover correlations, and make data-driven
              decisions.
            </p>
            <p className="text-lg font-medium text-radiant-amber">
              "If it can't be measured, it can't be fixed"
            </p>
          </div>

          {/* Glass Card Demo */}
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {[
              { name: "Business Suite", desc: "Core metrics & integrations" },
              { name: "AI Assistant", desc: "Sol - Your data companion" },
              { name: "Custom Dashboards", desc: "Sandbox API connections" },
              { name: "Reporting Suite", desc: "Automated insights" },
            ].map((suite, index) => (
              <div key={index} className="glass-card p-6 text-center space-y-3">
                <h3 className="text-lg font-semibold text-dusk-slate dark:text-solar-white">
                  {suite.name}
                </h3>
                <p className="text-sm text-dusk-slate/70 dark:text-sky-mist/70">
                  {suite.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Status */}
          <div className="mt-16 glass-card p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-dusk-slate dark:text-solar-white mb-4">
              Development Status
            </h2>
            <p className="text-dusk-slate/80 dark:text-sky-mist/80">
              🚧 Project initialized - Following 6-month development roadmap
            </p>
            <p className="text-sm text-dusk-slate/60 dark:text-sky-mist/60 mt-2">
              Next.js 15 + tRPC + Supabase + Glassmorphic Design
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
