import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features for better performance
  experimental: {
    // Enable static optimization
    optimizePackageImports: [
      "framer-motion",
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
    ],
    serverComponentsExternalPackages: ["@prisma/client"],
  },

  // Configure turbopack for faster builds
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },

  // Configure advanced caching headers
  async headers() {
    return [
      {
        // Static assets (JS, CSS, images, fonts) - 1 year cache
        source: "/(_next/static|favicon.ico|robots.txt|sitemap.xml)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
      {
        // Marketing pages - 1 hour cache with 24h stale-while-revalidate
        source: "/((?!api|portal|admin).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=86400",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
      {
        // Public API routes - moderate caching
        source: "/api/(health|forms/submit)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=300, stale-while-revalidate=600",
          },
          {
            key: "Vary",
            value: "Accept-Encoding, Authorization",
          },
        ],
      },
      {
        // Private API routes - short cache with revalidation
        source:
          "/api/(dashboard|metrics|tenants|users|suites|business|creative|directors|reporting|support|security)/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "private, s-maxage=60, stale-while-revalidate=300",
          },
          {
            key: "Vary",
            value: "Authorization, Cookie",
          },
        ],
      },
      {
        // Webhook endpoints - no cache
        source: "/api/webhooks/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate",
          },
        ],
      },
      {
        // Health check - short cache for monitoring
        source: "/api/health",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=30, stale-while-revalidate=60",
          },
          {
            key: "X-Health-Check",
            value: "solinth-suite-systems",
          },
        ],
      },
    ];
  },

  // Configure image optimization with advanced settings
  images: {
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 31536000, // 1 year
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: [
      // Add external image domains here if needed
      "images.unsplash.com",
      "avatars.githubusercontent.com",
      "supabase.co",
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Enable compression and optimization
  compress: true,

  // Configure output for deployment
  output: "standalone",

  // Configure webpack for better performance
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
          common: {
            name: "common",
            minChunks: 2,
            chunks: "all",
            enforce: true,
          },
        },
      };
    }

    return config;
  },

  // Redirects for multi-tenant support
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/admin/dashboard",
        permanent: true,
      },
      {
        source: "/docs",
        destination: "/documentation",
        permanent: true,
      },
      {
        source: "/help",
        destination: "/contact",
        permanent: false,
      },
    ];
  },

  // Rewrites for subdomain routing and API
  async rewrites() {
    const rewrites = [
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap",
      },
      {
        source: "/robots.txt",
        destination: "/api/robots",
      },
    ];

    if (process.env.NEXT_PUBLIC_ENABLE_SUBDOMAINS === "true") {
      rewrites.unshift({
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "(?<tenant>.*)\\.localhost:3000",
          },
        ],
        destination: "/tenant/:tenant/:path*",
      });
    }

    return rewrites;
  },
};

export default nextConfig;
