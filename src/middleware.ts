import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth";

// ============================================================================
// ROUTE DEFINITIONS
// ============================================================================

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/login",
  "/signup",
  "/verify-email",
  "/reset-password",
  "/pricing",
  "/about",
  "/contact",
  "/terms",
  "/privacy",
  "/api/auth", // Better Auth API routes
  "/api/stripe/webhook", // Stripe webhooks
];

// Auth routes that should redirect to dashboard if already authenticated
const authRoutes = ["/login", "/signup"];

// Protected routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/dashboards",
  "/business",
  "/creative",
  "/directors",
  "/brand",
  "/reporting",
  "/support",
  "/security",
  "/custom",
  "/integrations",
  "/metrics",
  "/reports",
  "/workflows",
  "/settings",
  "/organizations",
  "/billing",
  "/team",
  "/profile",
  "/onboarding", // Tenant onboarding
  "/api/trpc", // tRPC API routes (will be added later)
];

// Admin-only routes (for future use)
const adminRoutes = ["/admin"];

// ============================================================================
// MIDDLEWARE LOGIC
// ============================================================================

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow all public routes without authentication
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // 2. Check for session cookie (Better Auth)
  const sessionCookie = request.cookies.get("better-auth.session_token");
  const isAuthenticated = Boolean(sessionCookie);

  // 2.5. Get session and tenant context for authenticated users
  let activeOrganizationId: string | null = null;

  if (isAuthenticated) {
    try {
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      activeOrganizationId = session?.session?.activeOrganizationId || null;
    } catch (error) {
      console.error("Error getting session in middleware:", error);
    }
  }

  // 3. Redirect authenticated users away from auth pages
  if (isAuthenticated && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 4. Protect all routes that require authentication
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 5. Admin routes protection (for future use)
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  if (isAdminRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 6. Check if user needs to select/create an organization
  const requiresTenant = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (
    isAuthenticated &&
    requiresTenant &&
    !activeOrganizationId &&
    pathname !== "/onboarding"
  ) {
    // Redirect to onboarding if no active organization
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  // 7. Add security headers and tenant context to all responses
  const response = NextResponse.next();

  // Security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // Tenant context header (for server components)
  if (activeOrganizationId) {
    response.headers.set("x-tenant-id", activeOrganizationId);
  }

  // CSP for production (commented out for development)
  // response.headers.set(
  //   "Content-Security-Policy",
  //   "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.stripe.com;"
  // );

  return response;
}

// ============================================================================
// MATCHER CONFIGURATION
// ============================================================================

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder (images, fonts, etc.)
     * - API routes that handle their own auth
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|eot)$).*)",
  ],
};
