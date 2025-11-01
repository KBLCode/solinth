"use client";

/**
 * Glassmorphic Navigation Bar - Solinth Suite
 *
 * Features:
 * - Sticky positioning with glassmorphic backdrop blur
 * - Smooth scroll to anchor sections
 * - Active link highlighting with animated glow effects
 * - Mobile-responsive with full-screen slide-out menu
 * - Framer Motion animations with layoutId transitions
 * - Solinth brand colors (Radiant Amber)
 */

import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/logo";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
  { label: "Contact", href: "#contact" },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();

  // Set mounted state to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    // Set initial active section based on pathname
    if (pathname === "/pricing") {
      setActiveSection("Pricing");
    } else if (pathname === "/docs") {
      setActiveSection("Docs");
    } else {
      setActiveSection("Features");
    }
  }, [pathname]);

  // Update active section when pathname changes
  useEffect(() => {
    if (pathname === "/contact") {
      setActiveSection("Contact");
    } else if (pathname === "/pricing") {
      setActiveSection("Pricing");
    } else if (pathname === "/") {
      // On homepage, detect based on scroll position
      setActiveSection("Features");
    }
  }, [pathname]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);

    // Only update active section based on scroll if we're on the homepage
    if (pathname === "/") {
      const sections = ["features", "pricing", "about", "contact"];
      const navbarHeight = 100;
      let currentSection = "Features"; // Default to Features

      // Check which section is currently most visible
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top;
          const elementBottom = rect.bottom;

          // Section is considered active if its top is above the middle of the screen
          // and its bottom is below the navbar
          if (elementTop <= navbarHeight && elementBottom > navbarHeight) {
            currentSection =
              sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
          }
        }
      }

      if (activeSection !== currentSection) {
        setActiveSection(currentSection);
      }
    }
  });

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = (label: string, href: string, e: React.MouseEvent) => {
    setActiveSection(label);
    setIsMobileMenuOpen(false);

    // Check if it's an anchor link (starts with #) or a page route
    if (href.startsWith("#")) {
      e.preventDefault();

      // If we're not on the homepage, navigate to homepage first
      if (window.location.pathname !== "/") {
        window.location.href = "/" + href;
        return;
      }

      const element = document.querySelector(href);
      if (element) {
        // Calculate offset to account for fixed navbar height
        const navbarHeight = 100; // Approximate navbar height with padding
        const elementPosition =
          element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
    // For page routes like /pricing, /contact - let Next.js Link handle the navigation
    // No preventDefault() needed for page routes
  };

  return (
    <>
      <div
        className={`fixed left-0 right-0 top-0 z-[100] transition-all duration-300 ${
          isScrolled ? "py-3" : "py-5"
        }`}
      >
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="mx-auto max-w-7xl px-2 sm:px-4 md:px-6 lg:px-8"
        >
          <div
            className="glass-navbar mx-2 rounded-full sm:mx-0"
            style={{
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            <div className="flex items-center justify-between px-3 py-3 sm:px-6">
              <motion.div
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Logo size={64} showText={false} href="/" />
              </motion.div>

              <div className="hidden items-center space-x-1 md:flex">
                {navItems.map((item) => (
                  <motion.div
                    key={item.label}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={item.href}
                      onClick={(e) => {
                        handleNavClick(item.label, item.href, e);
                      }}
                      className={`relative inline-block rounded-full px-6 py-2 text-sm font-medium transition-all duration-300 ${
                        isMounted && activeSection === item.label
                          ? "text-dusk-slate dark:text-solar-white"
                          : "text-dusk-slate/60 hover:text-dusk-slate dark:text-sky-mist/60 dark:hover:text-solar-white"
                      }`}
                    >
                      {isMounted && activeSection === item.label && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 rounded-full"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(255, 168, 69, 0.15) 0%, rgba(255, 168, 69, 0.08) 50%, rgba(255, 168, 69, 0.12) 100%)",
                            backdropFilter: "blur(8px)",
                            WebkitBackdropFilter: "blur(8px)",
                            border: "1px solid rgba(255, 168, 69, 0.2)",
                            borderTopColor: "rgba(255, 255, 255, 0.3)",
                            borderLeftColor: "rgba(255, 255, 255, 0.25)",
                            boxShadow: "0 2px 8px rgba(255, 168, 69, 0.2)",
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                      <span className="relative z-10">{item.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="hidden md:block">
                <Link href="/login">
                  <div className="glass-button-wrap">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="glass-button rounded-full px-6 py-2 text-sm font-semibold transition-all duration-300"
                    >
                      <span className="glass-button-text">Sign In</span>
                    </motion.button>
                    <div className="glass-button-shadow rounded-full"></div>
                  </div>
                </Link>
              </div>

              <motion.button
                className="p-2 text-dusk-slate dark:text-solar-white md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </div>
          </div>
        </motion.nav>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 right-0 top-0 z-50 w-full max-w-sm shadow-2xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "2px solid rgba(0, 0, 0, 0.1)",
                borderTopColor: "rgba(255, 255, 255, 1)",
                borderLeftColor: "rgba(255, 255, 255, 0.8)",
                boxShadow:
                  "inset 0 4px 8px rgba(255, 255, 255, 1), inset 0 -4px 8px rgba(0, 0, 0, 0.08), 0 12px 32px rgba(0, 0, 0, 0.15), 0 0 40px rgba(255, 168, 69, 0.25)",
              }}
            >
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-black/10 p-6">
                  <Logo size={126} showText={false} href="/" />
                  <motion.button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-black"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={24} />
                  </motion.button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-8">
                  <div className="space-y-2">
                    {navItems.map((item, index) => {
                      const activeStyle =
                        activeSection === item.label
                          ? {
                              background:
                                "linear-gradient(135deg, rgba(255, 168, 69, 0.2) 0%, rgba(255, 214, 124, 0.15) 50%, rgba(255, 168, 69, 0.18) 100%)",
                              backdropFilter: "blur(12px)",
                              WebkitBackdropFilter: "blur(12px)",
                              border: "1px solid rgba(255, 168, 69, 0.3)",
                              borderTopColor: "rgba(255, 255, 255, 0.8)",
                              borderLeftColor: "rgba(255, 255, 255, 0.6)",
                              boxShadow:
                                "inset 0 2px 4px rgba(255, 255, 255, 0.8), inset 0 -2px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.1), 0 0 20px rgba(255, 168, 69, 0.3)",
                            }
                          : {};

                      return (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Link
                            href={item.href}
                            onClick={(e) => {
                              handleNavClick(item.label, item.href, e);
                            }}
                            className={`block rounded-2xl px-6 py-4 text-lg font-medium transition-all duration-300 ${
                              activeSection === item.label
                                ? "text-black shadow-lg"
                                : "text-gray-600 hover:bg-black/5 hover:text-black"
                            }`}
                            style={activeStyle}
                          >
                            {item.label}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-black/10 p-6">
                  <Link href="/login">
                    <div className="glass-button-wrap w-full">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="glass-button w-full rounded-full px-6 py-4 text-base font-semibold"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span className="glass-button-text">Sign In</span>
                      </motion.button>
                      <div className="glass-button-shadow rounded-full"></div>
                    </div>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
