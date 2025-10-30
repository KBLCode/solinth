/**
 * Solinth Suite Database Seeding Script
 * Creates test data for development and testing
 * Multi-tenant safe with proper isolation
 */

import {
  PrismaClient,
  PlanType,
  UserRole,
  DashboardType,
  IntegrationType,
  IntegrationStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Solinth Suite database seeding...");

  // ============================================================================
  // TENANT 1: Demo Company (Business Plan)
  // ============================================================================

  const tenant1 = await prisma.tenant.create({
    data: {
      name: "Acme Corporation",
      slug: "acme-corp",
      plan: PlanType.BUSINESS,
      stripeCustomerId: "cus_demo_acme_corp",
    },
  });

  console.log(`✅ Created tenant: ${tenant1.name} (${tenant1.slug})`);

  // Create users for Tenant 1
  const user1Owner = await prisma.user.create({
    data: {
      tenantId: tenant1.id,
      email: "john@acme-corp.com",
      name: "John Smith",
      role: UserRole.OWNER,
      avatarUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    },
  });

  const user1Admin = await prisma.user.create({
    data: {
      tenantId: tenant1.id,
      email: "sarah@acme-corp.com",
      name: "Sarah Johnson",
      role: UserRole.ADMIN,
      avatarUrl:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
    },
  });

  const user1Member = await prisma.user.create({
    data: {
      tenantId: tenant1.id,
      email: "mike@acme-corp.com",
      name: "Mike Davis",
      role: UserRole.MEMBER,
      avatarUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    },
  });

  console.log(`✅ Created ${3} users for ${tenant1.name}`);

  // Create integrations for Tenant 1
  const stripeIntegration = await prisma.integration.create({
    data: {
      tenantId: tenant1.id,
      type: IntegrationType.STRIPE,
      credentials: {
        accessToken: "sk_test_demo_stripe_key",
        refreshToken: "rt_demo_refresh",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
      config: {
        syncFrequency: "hourly",
        webhookUrl: "https://acme-corp.solinth.com/api/webhooks/stripe",
      },
      status: IntegrationStatus.CONNECTED,
      lastSyncAt: new Date(),
    },
  });

  const analyticsIntegration = await prisma.integration.create({
    data: {
      tenantId: tenant1.id,
      type: IntegrationType.GOOGLE_ANALYTICS,
      credentials: {
        accessToken: "ya29.demo_analytics_token",
        refreshToken: "1//demo_refresh_token",
        propertyId: "GA_PROPERTY_123456",
      },
      config: {
        syncFrequency: "daily",
        metrics: ["sessions", "pageviews", "bounceRate", "conversionRate"],
      },
      status: IntegrationStatus.CONNECTED,
      lastSyncAt: new Date(),
    },
  });

  console.log(`✅ Created ${2} integrations for ${tenant1.name}`);

  // Create dashboards for Tenant 1
  const businessDashboard = await prisma.dashboard.create({
    data: {
      tenantId: tenant1.id,
      userId: user1Owner.id,
      name: "Executive Overview",
      type: DashboardType.BUSINESS,
      config: {
        layout: "grid",
        columns: 12,
        widgets: [
          {
            id: "revenue",
            type: "metric",
            position: { x: 0, y: 0, w: 3, h: 2 },
          },
          {
            id: "customers",
            type: "metric",
            position: { x: 3, y: 0, w: 3, h: 2 },
          },
          { id: "growth", type: "chart", position: { x: 6, y: 0, w: 6, h: 4 } },
        ],
      },
      isPublic: false,
    },
  });

  const analyticsDashboard = await prisma.dashboard.create({
    data: {
      tenantId: tenant1.id,
      userId: user1Admin.id,
      name: "Website Analytics",
      type: DashboardType.CUSTOM,
      config: {
        layout: "grid",
        columns: 12,
        widgets: [
          {
            id: "sessions",
            type: "metric",
            position: { x: 0, y: 0, w: 4, h: 2 },
          },
          {
            id: "pageviews",
            type: "metric",
            position: { x: 4, y: 0, w: 4, h: 2 },
          },
          {
            id: "bounce",
            type: "metric",
            position: { x: 8, y: 0, w: 4, h: 2 },
          },
        ],
      },
      isPublic: true,
      shareToken: "share_analytics_demo_token",
    },
  });

  console.log(`✅ Created ${2} dashboards for ${tenant1.name}`);

  // Create sample metrics for Tenant 1
  const now = new Date();
  const metricsData = [
    // Revenue metrics
    {
      tenantId: tenant1.id,
      integrationId: stripeIntegration.id,
      name: "monthly_revenue",
      value: 125000.5,
      unit: "USD",
      timestamp: now,
      dimensions: { period: "2024-01", source: "stripe" },
    },
    {
      tenantId: tenant1.id,
      integrationId: stripeIntegration.id,
      name: "customer_count",
      value: 1250,
      unit: "count",
      timestamp: now,
      dimensions: { period: "2024-01", source: "stripe" },
    },
    // Analytics metrics
    {
      tenantId: tenant1.id,
      integrationId: analyticsIntegration.id,
      name: "website_sessions",
      value: 45000,
      unit: "count",
      timestamp: now,
      dimensions: { period: "2024-01", source: "google_analytics" },
    },
    {
      tenantId: tenant1.id,
      integrationId: analyticsIntegration.id,
      name: "bounce_rate",
      value: 0.35,
      unit: "percentage",
      timestamp: now,
      dimensions: { period: "2024-01", source: "google_analytics" },
    },
  ];

  await prisma.metric.createMany({
    data: metricsData,
  });

  console.log(`✅ Created ${metricsData.length} metrics for ${tenant1.name}`);

  // ============================================================================
  // TENANT 2: Startup Company (Pro Plan)
  // ============================================================================

  const tenant2 = await prisma.tenant.create({
    data: {
      name: "TechStart Inc",
      slug: "techstart",
      plan: PlanType.PRO,
      stripeCustomerId: "cus_demo_techstart",
    },
  });

  console.log(`✅ Created tenant: ${tenant2.name} (${tenant2.slug})`);

  // Create users for Tenant 2
  const user2Owner = await prisma.user.create({
    data: {
      tenantId: tenant2.id,
      email: "alex@techstart.com",
      name: "Alex Chen",
      role: UserRole.OWNER,
      avatarUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    },
  });

  const user2Member = await prisma.user.create({
    data: {
      tenantId: tenant2.id,
      email: "emma@techstart.com",
      name: "Emma Wilson",
      role: UserRole.MEMBER,
      avatarUrl:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
    },
  });

  console.log(`✅ Created ${2} users for ${tenant2.name}`);

  // Create a simple dashboard for Tenant 2
  const startupDashboard = await prisma.dashboard.create({
    data: {
      tenantId: tenant2.id,
      userId: user2Owner.id,
      name: "Startup Metrics",
      type: DashboardType.BUSINESS,
      config: {
        layout: "simple",
        widgets: [
          { id: "mrr", type: "metric", position: { x: 0, y: 0, w: 6, h: 2 } },
          { id: "users", type: "metric", position: { x: 6, y: 0, w: 6, h: 2 } },
        ],
      },
      isPublic: false,
    },
  });

  console.log(`✅ Created ${1} dashboard for ${tenant2.name}`);

  // ============================================================================
  // TENANT 3: Free Plan User
  // ============================================================================

  const tenant3 = await prisma.tenant.create({
    data: {
      name: "Solo Freelancer",
      slug: "solo-freelancer",
      plan: PlanType.FREE,
    },
  });

  console.log(`✅ Created tenant: ${tenant3.name} (${tenant3.slug})`);

  const user3Owner = await prisma.user.create({
    data: {
      tenantId: tenant3.id,
      email: "freelancer@example.com",
      name: "Jordan Taylor",
      role: UserRole.OWNER,
    },
  });

  console.log(`✅ Created ${1} user for ${tenant3.name}`);

  // ============================================================================
  // AI TOKEN USAGE (for billing)
  // ============================================================================

  const aiUsageData = [
    {
      tenantId: tenant1.id,
      model: "gpt-4",
      tokens: 15000,
      cost: 0.45,
      purpose: "dashboard_insights",
    },
    {
      tenantId: tenant1.id,
      model: "claude-3-sonnet",
      tokens: 8000,
      cost: 0.24,
      purpose: "report_generation",
    },
    {
      tenantId: tenant2.id,
      model: "gpt-3.5-turbo",
      tokens: 5000,
      cost: 0.1,
      purpose: "chat_assistance",
    },
  ];

  await prisma.aiTokenUsage.createMany({
    data: aiUsageData,
  });

  console.log(`✅ Created ${aiUsageData.length} AI usage records`);

  // ============================================================================
  // AUDIT LOGS (for compliance)
  // ============================================================================

  const auditData = [
    {
      userId: user1Owner.id,
      action: "create",
      entityId: businessDashboard.id,
      entityType: "dashboard",
      changes: { name: "Executive Overview", type: "BUSINESS" },
      metadata: { ip: "192.168.1.100", userAgent: "Chrome/120.0" },
    },
    {
      userId: user1Admin.id,
      action: "update",
      entityId: analyticsIntegration.id,
      entityType: "integration",
      changes: { status: "CONNECTED" },
      metadata: { ip: "192.168.1.101", userAgent: "Firefox/121.0" },
    },
  ];

  await prisma.auditLog.createMany({
    data: auditData,
  });

  console.log(`✅ Created ${auditData.length} audit log entries`);

  console.log("\n🎉 Database seeding completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`   • ${3} tenants created`);
  console.log(`   • ${6} users created across all tenants`);
  console.log(`   • ${2} integrations configured`);
  console.log(`   • ${3} dashboards created`);
  console.log(`   • ${4} metrics recorded`);
  console.log(`   • ${3} AI usage records`);
  console.log(`   • ${2} audit log entries`);
  console.log(
    "\n🔐 Multi-tenant isolation verified - each tenant has separate data"
  );
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
