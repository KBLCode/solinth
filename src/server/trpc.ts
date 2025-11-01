/**
 * tRPC Server Configuration with Multi-Tenant Security
 *
 * CRITICAL SECURITY: This module implements secure tRPC context with tenant validation.
 *
 * Security Features:
 * 1. Session validation on every request
 * 2. Tenant membership verification
 * 3. Role-based access control
 * 4. Type-safe tenant context
 * 5. Automatic tenant injection into database queries
 *
 * PRD Reference: Lines 701-750 (Multi-tenancy requirement)
 * SDD Reference: Lines 45-100 (tRPC Architecture)
 * SECURITY-AUDIT.md: Requirement 2 (tRPC Secure Context)
 */

import { initTRPC, TRPCError } from "@trpc/server";
import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import superjson from "superjson";
import { ZodError } from "zod";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { withTenantContext, type TenantContext } from "@/lib/db-secure";

// ============================================================================
// CONTEXT CREATION
// ============================================================================

/**
 * Create tRPC context with session and tenant validation
 *
 * This runs on EVERY tRPC request and ensures:
 * - User is authenticated
 * - User has an active organization
 * - User is a member of that organization
 * - Tenant context is available for database queries
 */
export async function createTRPCContext(opts: FetchCreateContextFnOptions) {
  const { req } = opts;

  // Get session from Better Auth
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  // Unauthenticated context (for public procedures)
  if (!session || !session.user) {
    return {
      session: null,
      user: null,
      tenant: null,
      role: null,
      db: prisma,
    };
  }

  // Get active organization from session
  const activeOrganizationId = session.session?.activeOrganizationId;

  // No active organization (user needs to select/create one)
  if (!activeOrganizationId) {
    return {
      session: session.session,
      user: session.user,
      tenant: null,
      role: null,
      db: prisma,
    };
  }

  // ============================================================================
  // SECURITY: Validate tenant membership
  // ============================================================================

  const member = await prisma.authMember.findFirst({
    where: {
      userId: session.user.id,
      organizationId: activeOrganizationId,
    },
    include: {
      organization: {
        include: {
          tenant: true,
        },
      },
    },
  });

  if (!member) {
    // SECURITY VIOLATION: User has activeOrganizationId but is not a member
    console.error(
      "🚨 SECURITY VIOLATION: User not member of active organization",
      {
        userId: session.user.id,
        activeOrganizationId,
        timestamp: new Date().toISOString(),
      }
    );

    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You are not a member of the active organization",
    });
  }

  // ============================================================================
  // Return authenticated context with tenant
  // ============================================================================

  return {
    session: session.session,
    user: session.user,
    tenant: member.organization.tenant,
    role: member.role as "owner" | "admin" | "member" | "viewer",
    db: prisma,
  };
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

// ============================================================================
// TRPC INITIALIZATION
// ============================================================================

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

// ============================================================================
// REUSABLE PROCEDURES
// ============================================================================

/**
 * Public procedure (no authentication required)
 */
export const publicProcedure = t.procedure;

/**
 * Protected procedure (authentication required)
 */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
      user: ctx.user,
    },
  });
});

/**
 * Tenant procedure (authentication + active tenant required)
 *
 * This is the MOST COMMON procedure type for Solinth.
 * It ensures user has an active organization and wraps all database
 * operations in tenant context for automatic filtering.
 */
export const tenantProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (!ctx.tenant) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message:
        "No active organization. Please select or create an organization.",
    });
  }

  // Create tenant context for database operations
  const tenantContext: TenantContext = {
    tenantId: ctx.tenant.id,
    userId: ctx.user.id,
    role: ctx.role!,
    operation: "trpc",
  };

  // Execute procedure with tenant context
  // This ensures ALL database queries are automatically filtered by tenantId
  return withTenantContext(tenantContext, () =>
    next({
      ctx: {
        ...ctx,
        tenant: ctx.tenant!,
        role: ctx.role!,
      },
    })
  );
});

/**
 * Admin procedure (owner or admin role required)
 */
export const adminProcedure = tenantProcedure.use(({ ctx, next }) => {
  if (ctx.role !== "owner" && ctx.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin access required",
    });
  }

  return next({ ctx });
});

/**
 * Owner procedure (owner role required)
 */
export const ownerProcedure = tenantProcedure.use(({ ctx, next }) => {
  if (ctx.role !== "owner") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Owner access required",
    });
  }

  return next({ ctx });
});

// ============================================================================
// ROUTER CREATION
// ============================================================================

export const createTRPCRouter = t.router;
export const middleware = t.middleware;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type { TenantContext };
