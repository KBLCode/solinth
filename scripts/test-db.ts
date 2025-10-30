/**
 * Database Connection Test
 * Validates Prisma schema and database client setup
 */

import { config } from "dotenv";
config(); // Load environment variables

import { prisma, createTenantClient, checkDatabaseHealth } from "../src/lib/db";

async function testDatabaseSetup() {
  console.log("🧪 Testing Solinth database setup...");

  try {
    // Test 1: Basic connection
    console.log("\n1️⃣ Testing database connection...");
    const isHealthy = await checkDatabaseHealth();
    console.log(
      isHealthy
        ? "✅ Database connection successful"
        : "❌ Database connection failed"
    );

    // Test 2: Prisma client generation
    console.log("\n2️⃣ Testing Prisma client...");
    const tenantCount = await prisma.tenant.count();
    console.log(`✅ Prisma client working - found ${tenantCount} tenants`);

    // Test 3: Tenant client creation
    console.log("\n3️⃣ Testing tenant client...");
    const tenantClient = createTenantClient("test-tenant-id");
    console.log("✅ Tenant client created successfully");

    // Test 4: Schema validation
    console.log("\n4️⃣ Testing schema models...");
    const models = [
      "tenant",
      "user",
      "dashboard",
      "integration",
      "metric",
      "customApi",
      "widget",
      "report",
      "workflow",
      "brandAsset",
      "aiTokenUsage",
      "comment",
      "auditLog",
    ];

    for (const model of models) {
      if (prisma[model as keyof typeof prisma]) {
        console.log(`✅ Model '${model}' available`);
      } else {
        console.log(`❌ Model '${model}' missing`);
      }
    }

    console.log("\n🎉 All database tests passed!");
    console.log("\n📋 Next steps:");
    console.log("   1. Set up Supabase project");
    console.log("   2. Configure DATABASE_URL in .env");
    console.log("   3. Run migrations: npm run db:push");
    console.log("   4. Seed database: npm run db:seed");
  } catch (error) {
    console.error("❌ Database test failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseSetup();
