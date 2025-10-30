/**
 * Solinth Suite Database Client
 * Multi-tenant PostgreSQL with Row-Level Security (RLS)
 * Based on SDD Lines 218-240
 */

import { PrismaClient } from "@prisma/client";

// Global Prisma instance for development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create Prisma client with connection pooling
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Set tenant context for Row-Level Security
 * This must be called before any database operations
 * to ensure proper tenant isolation
 */
export async function setTenantContext(tenantId: string) {
  await prisma.$executeRaw`SELECT set_config('app.tenant_id', ${tenantId}, true)`;
}

/**
 * Clear tenant context (for cleanup)
 */
export async function clearTenantContext() {
  await prisma.$executeRaw`SELECT set_config('app.tenant_id', '', true)`;
}

/**
 * Multi-tenant safe Prisma client
 * Automatically sets tenant context for all operations
 */
export class TenantPrismaClient {
  private tenantId: string;

  constructor(tenantId: string) {
    this.tenantId = tenantId;
  }

  /**
   * Execute a database operation with tenant context
   */
  async withTenant<T>(
    operation: (prisma: PrismaClient) => Promise<T>
  ): Promise<T> {
    try {
      // Set tenant context
      await setTenantContext(this.tenantId);

      // Execute operation
      const result = await operation(prisma);

      return result;
    } finally {
      // Always clear context after operation
      await clearTenantContext();
    }
  }

  /**
   * Get tenant-scoped Prisma client
   * Use this for multiple operations within the same tenant context
   */
  async getClient(): Promise<PrismaClient> {
    await setTenantContext(this.tenantId);
    return prisma;
  }
}

/**
 * Create a tenant-scoped database client
 */
export function createTenantClient(tenantId: string): TenantPrismaClient {
  return new TenantPrismaClient(tenantId);
}

/**
 * Database health check
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Database health check failed:", error);
    return false;
  }
}

/**
 * Initialize database connection
 * Call this on app startup
 */
export async function initializeDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }
}

/**
 * Gracefully disconnect from database
 * Call this on app shutdown
 */
export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
  console.log("✅ Database disconnected");
}

// Export types for use in other files
export type { PrismaClient } from "@prisma/client";
export * from "@prisma/client";
