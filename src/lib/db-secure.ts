/**
 * Secure Multi-Tenant Database Client
 *
 * CRITICAL SECURITY: This module implements defense-in-depth for multi-tenant data isolation.
 *
 * Security Layers:
 * 1. Prisma Middleware - Auto-injects tenantId filter on ALL queries
 * 2. Context Validation - Ensures tenant context exists before queries
 * 3. Audit Logging - Tracks all database operations
 * 4. Error Handling - Fails safely if tenant context missing
 *
 * PRD Reference: Lines 701-750 (Multi-tenancy requirement)
 * SDD Reference: Lines 289-320 (RLS Implementation)
 * SECURITY-AUDIT.md: All critical requirements
 */

import { PrismaClient, Prisma } from "@prisma/client";
import { AsyncLocalStorage } from "async_hooks";

// ============================================================================
// TENANT CONTEXT STORAGE
// ============================================================================

/**
 * Thread-safe tenant context storage
 * Uses Node.js AsyncLocalStorage to maintain tenant context across async operations
 */
interface TenantContext {
  tenantId: string;
  userId: string;
  role: string;
  operation: string;
}

const tenantContextStorage = new AsyncLocalStorage<TenantContext>();

/**
 * Get current tenant context
 * @throws Error if no tenant context (security fail-safe)
 */
export function getTenantContext(): TenantContext {
  const context = tenantContextStorage.getStore();

  if (!context) {
    throw new Error(
      "SECURITY VIOLATION: Database operation attempted without tenant context. " +
        "All queries must be wrapped in withTenantContext()."
    );
  }

  return context;
}

/**
 * Execute operation with tenant context
 * This is the ONLY way to safely execute database operations
 */
export async function withTenantContext<T>(
  context: TenantContext,
  operation: () => Promise<T>
): Promise<T> {
  return tenantContextStorage.run(context, operation);
}

// ============================================================================
// MODELS REQUIRING TENANT FILTERING
// ============================================================================

/**
 * Models that MUST have tenantId filtering
 * Add new models here as they're created
 */
const TENANT_SCOPED_MODELS = new Set([
  "Tenant",
  "User",
  "Dashboard",
  "Integration",
  "Metric",
  "Report",
  "Workflow",
  "CustomApi",
  "BrandAsset",
  "AiTokenUsage",
  "MetricValue",
  "DashboardWidget",
  "ReportSchedule",
  "WorkflowExecution",
  "IntegrationConfig",
  "ApiKey",
  "AuditLog",
]);

/**
 * Models that DON'T need tenant filtering (auth tables)
 */
const AUTH_MODELS = new Set([
  "AuthUser",
  "AuthSession",
  "AuthAccount",
  "AuthVerification",
  "AuthOrganization",
  "AuthMember",
  "AuthInvitation",
  "AuthPasskey",
  "AuthTwoFactor",
]);

/**
 * Check if model requires tenant filtering
 */
function requiresTenantFilter(modelName: string | undefined): boolean {
  if (!modelName) return false;
  return TENANT_SCOPED_MODELS.has(modelName);
}

// ============================================================================
// SECURE PRISMA CLIENT WITH MIDDLEWARE
// ============================================================================

/**
 * Create Prisma client with security middleware
 */
function createSecurePrismaClient() {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

  // ============================================================================
  // MIDDLEWARE: AUTO-INJECT TENANT FILTER
  // ============================================================================

  client.$use(async (params, next) => {
    const modelName = params.model;

    // Skip auth models (they don't have tenantId)
    if (AUTH_MODELS.has(modelName || "")) {
      return next(params);
    }

    // Check if model requires tenant filtering
    if (!requiresTenantFilter(modelName)) {
      return next(params);
    }

    // Get tenant context (throws if missing - security fail-safe)
    let context: TenantContext;
    try {
      context = getTenantContext();
    } catch (error) {
      // Log security violation
      console.error("🚨 SECURITY VIOLATION:", {
        model: modelName,
        action: params.action,
        timestamp: new Date().toISOString(),
        error: (error as Error).message,
      });
      throw error;
    }

    // ============================================================================
    // AUTO-INJECT TENANT FILTER
    // ============================================================================

    switch (params.action) {
      case "findUnique":
      case "findUniqueOrThrow":
      case "findFirst":
      case "findFirstOrThrow":
      case "findMany":
      case "count":
      case "aggregate":
      case "groupBy":
        // Inject tenantId into where clause
        params.args.where = {
          ...params.args.where,
          tenantId: context.tenantId,
        };
        break;

      case "create":
      case "createMany":
        // Inject tenantId into data
        if (params.action === "create") {
          params.args.data = {
            ...(params.args.data as Record<string, unknown>),
            tenantId: context.tenantId,
          };
        } else {
          // createMany
          if (Array.isArray(params.args.data)) {
            params.args.data = params.args.data.map(
              (item: Record<string, unknown>) => ({
                ...item,
                tenantId: context.tenantId,
              })
            );
          }
        }
        break;

      case "update":
      case "updateMany":
      case "upsert":
        // Inject tenantId into where clause
        params.args.where = {
          ...params.args.where,
          tenantId: context.tenantId,
        };

        // Prevent changing tenantId
        if (
          params.args.data?.tenantId &&
          params.args.data.tenantId !== context.tenantId
        ) {
          throw new Error(
            "SECURITY VIOLATION: Attempted to change tenantId. " +
              "Resources cannot be moved between tenants."
          );
        }
        break;

      case "delete":
      case "deleteMany":
        // Inject tenantId into where clause
        params.args.where = {
          ...params.args.where,
          tenantId: context.tenantId,
        };
        break;
    }

    // ============================================================================
    // AUDIT LOGGING
    // ============================================================================

    const startTime = Date.now();

    try {
      const result = await next(params);

      // Log successful operation (only in development or for sensitive operations)
      if (
        process.env.NODE_ENV === "development" ||
        ["delete", "deleteMany", "update", "updateMany"].includes(params.action)
      ) {
        console.log("📊 DB Operation:", {
          model: modelName,
          action: params.action,
          tenantId: context.tenantId,
          userId: context.userId,
          duration: Date.now() - startTime,
        });
      }

      return result;
    } catch (error) {
      // Log failed operation
      console.error("❌ DB Operation Failed:", {
        model: modelName,
        action: params.action,
        tenantId: context.tenantId,
        userId: context.userId,
        duration: Date.now() - startTime,
        error: (error as Error).message,
      });
      throw error;
    }
  });

  return client;
}

// ============================================================================
// GLOBAL INSTANCE
// ============================================================================

declare global {
  var __securePrisma: PrismaClient | undefined;
}

export const securePrisma =
  globalThis.__securePrisma ?? createSecurePrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__securePrisma = securePrisma;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Validate resource ownership
 * Ensures a resource belongs to the current tenant
 *
 * @throws Error if resource doesn't belong to current tenant
 */
export async function validateResourceOwnership<T extends { tenantId: string }>(
  resource: T | null,
  resourceType: string
): Promise<T> {
  if (!resource) {
    throw new Error(`${resourceType} not found`);
  }

  const context = getTenantContext();

  if (resource.tenantId !== context.tenantId) {
    // Log security incident
    console.error("🚨 SECURITY VIOLATION: Cross-tenant access attempt", {
      resourceType,
      resourceTenantId: resource.tenantId,
      currentTenantId: context.tenantId,
      userId: context.userId,
      timestamp: new Date().toISOString(),
    });

    throw new Error(
      `Access denied: ${resourceType} belongs to different organization`
    );
  }

  return resource;
}

/**
 * Create audit log entry
 * Records sensitive operations for compliance and security monitoring
 */
export async function createAuditLog(event: {
  action: string;
  resourceType: string;
  resourceId: string;
  metadata?: Record<string, unknown>;
}) {
  const context = getTenantContext();

  // In production, this would write to audit_logs table
  // For now, we log to console
  console.log("📝 AUDIT LOG:", {
    ...event,
    tenantId: context.tenantId,
    userId: context.userId,
    timestamp: new Date().toISOString(),
  });

  // TODO: Implement actual audit log table writes
  // await securePrisma.auditLog.create({
  //   data: {
  //     ...event,
  //     tenantId: context.tenantId,
  //     userId: context.userId,
  //   }
  // });
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type { TenantContext };
export { Prisma };
