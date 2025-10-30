import type { Config } from "tailwindcss";

const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Solinth Brand Colors - Light Mode
        "solar-white": "#FFFFFF",
        "radiant-amber": "#FFA845",
        "midday-sand": "#EADAC0",
        "dusk-slate": "#2E3440",
        "sky-mist": "#D8E3F0",

        // Solinth Brand Colors - Dark Mode
        "eclipse-black": "#0F1114",
        "midnight-graphite": "#1C1F24",
        "lunar-sand": "#B7A98B",

        // Map CSS variables to Tailwind colors
        background: "rgb(var(--background) / <alpha-value>)",
        "background-subtle": "rgb(var(--background-subtle) / <alpha-value>)",
        "background-card": "rgb(var(--background-card) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        "foreground-muted": "rgb(var(--foreground-muted) / <alpha-value>)",
        "foreground-subtle": "rgb(var(--foreground-subtle) / <alpha-value>)",
        primary: "rgb(var(--primary) / <alpha-value>)",
        "primary-foreground": "rgb(var(--primary-foreground) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
        error: "rgb(var(--error) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
      },
      backgroundImage: {
        "solar-gradient": "linear-gradient(135deg, #FFA845 0%, #FFD67C 100%)",
        "solar-flare": "linear-gradient(135deg, #FFB347 0%, #FFCE73 100%)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
      animation: {
        aurora: "aurora 60s linear infinite",
        shimmer: "shimmer 2s infinite",
        "fade-in": "fadeIn var(--duration-normal) var(--ease-out)",
        "slide-up": "slideUp var(--duration-normal) var(--ease-out)",
        "glass-glow": "glassGlow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        aurora: {
          from: {
            backgroundPosition: "50% 50%, 50% 50%",
          },
          to: {
            backgroundPosition: "350% 50%, 350% 50%",
          },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        glassGlow: {
          "0%": { boxShadow: "0 8px 32px rgba(255, 165, 69, 0.12)" },
          "100%": { boxShadow: "0 12px 40px rgba(255, 165, 69, 0.25)" },
        },
      },
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        glass: "20px",
        "glass-dark": "24px",
      },
      boxShadow: {
        "glass-light": `
          inset 0 1px 2px rgba(255, 255, 255, 1),
          0 8px 32px rgba(255, 165, 69, 0.12),
          0 2px 8px rgba(0, 0, 0, 0.08)
        `,
        "glass-dark": `
          inset 0 1px 0 rgba(255, 255, 255, 0.08),
          0 12px 40px rgba(255, 165, 69, 0.15),
          0 4px 12px rgba(0, 0, 0, 0.4)
        `,
      },
    },
  },
  plugins: [addVariablesForColors],
};

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val]),
  );

  addBase({
    ":root": newVars,
  });
}

export default config;
