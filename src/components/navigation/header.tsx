"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";
import { createPortal } from "react-dom";
import Link from "next/link";

export function Header() {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <style>{`
				.glass-navbar {
					background: linear-gradient(
						135deg,
						rgba(255, 255, 255, 0.9) 0%,
						rgba(255, 255, 255, 0.8) 100%
					);
					backdrop-filter: blur(20px);
					-webkit-backdrop-filter: blur(20px);
					border-bottom: 1px solid rgba(0, 0, 0, 0.1);
				}
				.dark .glass-navbar {
					background: linear-gradient(
						135deg,
						rgba(28, 31, 36, 0.9) 0%,
						rgba(28, 31, 36, 0.8) 100%
					);
					border-bottom: 1px solid rgba(255, 255, 255, 0.1);
				}
			`}</style>
      <header
        className={cn("sticky top-0 z-50 w-full transition-all duration-300", {
          "glass-navbar": scrolled,
        })}
      >
        <nav className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2 transition-opacity hover:opacity-80"
            >
              <div
                className="flex items-center justify-center rounded-full"
                style={{
                  width: 32,
                  height: 32,
                  background:
                    "linear-gradient(135deg, #FFA845 0%, #FFD67C 100%)",
                  boxShadow: "0 4px 12px rgba(255, 168, 69, 0.3)",
                }}
              >
                <svg
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="12" cy="12" r="4" fill="white" />
                  <path
                    d="M12 2v4M12 18v4M22 12h-4M6 12H2M19.07 4.93l-2.83 2.83M7.76 16.24l-2.83 2.83M19.07 19.07l-2.83-2.83M7.76 7.76L4.93 4.93"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="text-base font-bold text-dusk-slate dark:text-solar-white">
                Solinth
              </span>
            </Link>
            <div className="hidden items-center gap-1 md:flex">
              <Link
                href="/pricing"
                className="rounded-md px-4 py-2 text-sm font-medium text-dusk-slate transition-colors hover:bg-dusk-slate/5 dark:text-solar-white dark:hover:bg-solar-white/5"
              >
                Pricing
              </Link>
              <Link
                href="/docs"
                className="rounded-md px-4 py-2 text-sm font-medium text-dusk-slate transition-colors hover:bg-dusk-slate/5 dark:text-solar-white dark:hover:bg-solar-white/5"
              >
                Docs
              </Link>
              <Link
                href="/about"
                className="rounded-md px-4 py-2 text-sm font-medium text-dusk-slate transition-colors hover:bg-dusk-slate/5 dark:text-solar-white dark:hover:bg-solar-white/5"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="rounded-md px-4 py-2 text-sm font-medium text-dusk-slate transition-colors hover:bg-dusk-slate/5 dark:text-solar-white dark:hover:bg-solar-white/5"
              >
                Contact
              </Link>
            </div>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <Link href="/login">
              <div className="glass-button-wrap">
                <button className="glass-button rounded-full px-6 py-2 text-sm font-semibold">
                  <span className="glass-button-text">Sign In</span>
                </button>
                <div className="glass-button-shadow rounded-full"></div>
              </div>
            </Link>
            <Link href="/signup">
              <div className="glass-button-wrap">
                <button className="glass-button rounded-full px-6 py-2 text-sm font-semibold">
                  <span className="glass-button-text">Get Started</span>
                </button>
                <div className="glass-button-shadow rounded-full"></div>
              </div>
            </Link>
          </div>
          <button
            onClick={() => setOpen(!open)}
            className="p-2 text-dusk-slate dark:text-solar-white md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            <MenuToggleIcon open={open} className="size-5" duration={300} />
          </button>
        </nav>
      </header>
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

function MobileMenu({ open, onClose }: MobileMenuProps) {
  if (!open || typeof window === "undefined") return null;

  return createPortal(
    <div
      id="mobile-menu"
      className="glass-card fixed bottom-0 left-0 right-0 top-14 z-40 flex flex-col overflow-hidden border-y md:hidden"
    >
      <div className="flex size-full flex-col justify-between gap-2 overflow-y-auto p-4">
        <div className="flex w-full flex-col gap-y-2">
          <Link
            href="/pricing"
            onClick={onClose}
            className="hover:bg-accent flex w-full flex-row gap-x-2 rounded-sm p-3 font-medium text-dusk-slate dark:text-solar-white"
          >
            Pricing
          </Link>
          <Link
            href="/docs"
            onClick={onClose}
            className="hover:bg-accent flex w-full flex-row gap-x-2 rounded-sm p-3 font-medium text-dusk-slate dark:text-solar-white"
          >
            Docs
          </Link>
          <Link
            href="/about"
            onClick={onClose}
            className="hover:bg-accent flex w-full flex-row gap-x-2 rounded-sm p-3 font-medium text-dusk-slate dark:text-solar-white"
          >
            About
          </Link>
          <Link
            href="/contact"
            onClick={onClose}
            className="hover:bg-accent flex w-full flex-row gap-x-2 rounded-sm p-3 font-medium text-dusk-slate dark:text-solar-white"
          >
            Contact
          </Link>
          <Link
            href="/terms"
            onClick={onClose}
            className="hover:bg-accent flex w-full flex-row gap-x-2 rounded-sm p-3 font-medium text-dusk-slate dark:text-solar-white"
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            onClick={onClose}
            className="hover:bg-accent flex w-full flex-row gap-x-2 rounded-sm p-3 font-medium text-dusk-slate dark:text-solar-white"
          >
            Privacy
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          <Link href="/login" onClick={onClose}>
            <div className="glass-button-wrap w-full">
              <button className="glass-button w-full rounded-full px-6 py-3 text-sm font-semibold">
                <span className="glass-button-text">Sign In</span>
              </button>
              <div className="glass-button-shadow rounded-full"></div>
            </div>
          </Link>
          <Link href="/signup" onClick={onClose}>
            <div className="glass-button-wrap w-full">
              <button className="glass-button w-full rounded-full px-6 py-3 text-sm font-semibold">
                <span className="glass-button-text">Get Started</span>
              </button>
              <div className="glass-button-shadow rounded-full"></div>
            </div>
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
}
