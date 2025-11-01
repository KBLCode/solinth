"use client";

import { motion } from "framer-motion";
import React from "react";
import { ShaderBackground } from "@/components/ui/shader-background";
import { GlassButton } from "@/components/ui/glass-button";
import { ArrowRight, BarChart3 } from "lucide-react";

/**
 * Hero Section - Solinth Suite
 *
 * Features:
 * - Full viewport height with WebGL shader mesh gradient background
 * - Glassmorphic design with Solinth brand colors
 * - CTA buttons for conversion
 * - Solinth mission: "If it can't be measured, it can't be fixed"
 */

export function Hero() {
  const scrollToContact = () => {
    const contactSection = document.querySelector("#contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToFeatures = () => {
    const featuresSection = document.querySelector("#features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-solar-white dark:bg-eclipse-black">
      {/* WebGL Shader Background */}
      <ShaderBackground />

      {/* Content */}
      <div className="relative z-20 flex min-h-screen items-center px-4 pb-20 pt-32 sm:pb-20 sm:pt-24">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Side - Copy and CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Main Heading */}
            <div className="space-y-4 sm:space-y-6">
              <motion.h1
                className="text-4xl font-bold leading-tight text-dusk-slate dark:text-solar-white sm:text-5xl md:text-6xl lg:text-7xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Measure everything.
                <br />
                <span className="bg-solar-gradient bg-clip-text text-transparent">
                  Fix anything.
                </span>
              </motion.h1>

              <motion.p
                className="max-w-xl text-base leading-relaxed text-dusk-slate/80 dark:text-sky-mist/80 sm:text-lg md:text-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                All-in-one business management platform with 8 integrated
                suites. Track every metric, discover hidden correlations, and
                make data-driven decisions that actually move the needle.
              </motion.p>

              <motion.p
                className="text-base font-medium italic text-radiant-amber sm:text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                &ldquo;If it can&apos;t be measured, it can&apos;t be
                fixed&rdquo;
              </motion.p>
            </div>

            {/* CTA Buttons */}
            <motion.div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
              <GlassButton
                size="lg"
                onClick={scrollToContact}
                contentClassName="flex items-center gap-2"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="h-5 w-5" />
              </GlassButton>
              <GlassButton size="lg" onClick={scrollToFeatures}>
                Explore Suites
              </GlassButton>
            </motion.div>
          </motion.div>

          {/* Right Side - Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative"
          >
            <div
              className="relative overflow-hidden rounded-2xl backdrop-blur-xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.65) 50%, rgba(255, 255, 255, 0.75) 100%)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(0, 0, 0, 0.08)",
                borderTopColor: "rgba(255, 255, 255, 0.9)",
                borderLeftColor: "rgba(255, 255, 255, 0.8)",
                boxShadow:
                  "inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(0, 0, 0, 0.05), 0 8px 24px rgba(0, 0, 0, 0.08), 0 0 30px rgba(255, 168, 69, 0.15)",
              }}
            >
              <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-radiant-amber/5 to-sky-mist/10">
                <div className="text-center">
                  <div className="glass-card mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl">
                    <BarChart3 className="h-10 w-10 text-radiant-amber" />
                  </div>
                  <p className="text-xl font-medium text-dusk-slate dark:text-solar-white">
                    Business Intelligence Dashboard
                  </p>
                  <p className="mt-2 text-sm text-dusk-slate/60 opacity-60 dark:text-sky-mist/60">
                    8 Suites. Infinite Insights.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
