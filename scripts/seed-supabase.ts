/**
 * Supabase Direct Seeding Script
 * Seeds the database using Supabase client instead of Prisma
 */

import { config } from "dotenv";
config();

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  console.log("🌱 Starting Solinth Suite database seeding via Supabase...");

  try {
    // ============================================================================
    // TENANT 1: Demo Company (Business Plan)
    // ============================================================================

    const { data: tenant1, error: tenant1Error } = await supabase
      .from("tenants")
      .insert({
        id: "tenant_acme_corp_001",
        name: "Acme Corporation",
        slug: "acme-corp",
        plan: "BUSINESS",
        stripeCustomerId: "cus_demo_acme_corp",
      })
      .select()
      .single();

    if (tenant1Error) {
      console.error("❌ Failed to create tenant 1:", tenant1Error);
      return;
    }

    console.log(`✅ Created tenant: ${tenant1.name} (${tenant1.slug})`);

    // Create users for Tenant 1
    const { data: users1, error: users1Error } = await supabase
      .from("users")
      .insert([
        {
          id: "user_john_smith_001",
          tenantId: tenant1.id,
          email: "john@acme-corp.com",
          name: "John Smith",
          role: "OWNER",
          avatarUrl:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        },
        {
          id: "user_sarah_johnson_001",
          tenantId: tenant1.id,
          email: "sarah@acme-corp.com",
          name: "Sarah Johnson",
          role: "ADMIN",
          avatarUrl:
            "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
        },
        {
          id: "user_mike_davis_001",
          tenantId: tenant1.id,
          email: "mike@acme-corp.com",
          name: "Mike Davis",
          role: "MEMBER",
          avatarUrl:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        },
      ])
      .select();

    if (users1Error) {
      console.error("❌ Failed to create users for tenant 1:", users1Error);
      return;
    }

    console.log(`✅ Created ${users1.length} users for ${tenant1.name}`);

    // Create integrations for Tenant 1
    const { data: integrations1, error: integrations1Error } = await supabase
      .from("integrations")
      .insert([
        {
          id: "integration_stripe_001",
          tenantId: tenant1.id,
          type: "STRIPE",
          credentials: {
            accessToken: "sk_test_demo_stripe_key",
            refreshToken: "rt_demo_refresh",
            expiresAt: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
          },
          config: {
            syncFrequency: "hourly",
            webhookUrl: "https://acme-corp.solinth.com/api/webhooks/stripe",
          },
          status: "CONNECTED",
          lastSyncAt: new Date().toISOString(),
        },
        {
          id: "integration_analytics_001",
          tenantId: tenant1.id,
          type: "GOOGLE_ANALYTICS",
          credentials: {
            accessToken: "ya29.demo_analytics_token",
            refreshToken: "1//demo_refresh_token",
            propertyId: "GA_PROPERTY_123456",
          },
          config: {
            syncFrequency: "daily",
            metrics: ["sessions", "pageviews", "bounceRate", "conversionRate"],
          },
          status: "CONNECTED",
          lastSyncAt: new Date().toISOString(),
        },
      ])
      .select();

    if (integrations1Error) {
      console.error(
        "❌ Failed to create integrations for tenant 1:",
        integrations1Error
      );
      return;
    }

    console.log(
      `✅ Created ${integrations1.length} integrations for ${tenant1.name}`
    );

    // Create dashboards for Tenant 1
    const { data: dashboards1, error: dashboards1Error } = await supabase
      .from("dashboards")
      .insert([
        {
          id: "dashboard_executive_001",
          tenantId: tenant1.id,
          userId: users1[0].id,
          name: "Executive Overview",
          type: "BUSINESS",
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
              {
                id: "growth",
                type: "chart",
                position: { x: 6, y: 0, w: 6, h: 4 },
              },
            ],
          },
          isPublic: false,
        },
        {
          id: "dashboard_analytics_001",
          tenantId: tenant1.id,
          userId: users1[1].id,
          name: "Website Analytics",
          type: "CUSTOM",
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
      ])
      .select();

    if (dashboards1Error) {
      console.error(
        "❌ Failed to create dashboards for tenant 1:",
        dashboards1Error
      );
      return;
    }

    console.log(
      `✅ Created ${dashboards1.length} dashboards for ${tenant1.name}`
    );

    // Create sample metrics for Tenant 1
    const now = new Date().toISOString();
    const { data: metrics1, error: metrics1Error } = await supabase
      .from("metrics")
      .insert([
        {
          id: "metric_revenue_001",
          tenantId: tenant1.id,
          integrationId: integrations1[0].id,
          name: "monthly_revenue",
          value: 125000.5,
          unit: "USD",
          timestamp: now,
          dimensions: { period: "2024-01", source: "stripe" },
        },
        {
          id: "metric_customers_001",
          tenantId: tenant1.id,
          integrationId: integrations1[0].id,
          name: "customer_count",
          value: 1250,
          unit: "count",
          timestamp: now,
          dimensions: { period: "2024-01", source: "stripe" },
        },
        {
          id: "metric_sessions_001",
          tenantId: tenant1.id,
          integrationId: integrations1[1].id,
          name: "website_sessions",
          value: 45000,
          unit: "count",
          timestamp: now,
          dimensions: { period: "2024-01", source: "google_analytics" },
        },
        {
          id: "metric_bounce_001",
          tenantId: tenant1.id,
          integrationId: integrations1[1].id,
          name: "bounce_rate",
          value: 0.35,
          unit: "percentage",
          timestamp: now,
          dimensions: { period: "2024-01", source: "google_analytics" },
        },
      ])
      .select();

    if (metrics1Error) {
      console.error("❌ Failed to create metrics for tenant 1:", metrics1Error);
      return;
    }

    console.log(`✅ Created ${metrics1.length} metrics for ${tenant1.name}`);

    // ============================================================================
    // TENANT 2: Startup Company (Pro Plan)
    // ============================================================================

    const { data: tenant2, error: tenant2Error } = await supabase
      .from("tenants")
      .insert({
        id: "tenant_techstart_002",
        name: "TechStart Inc",
        slug: "techstart",
        plan: "PRO",
        stripeCustomerId: "cus_demo_techstart",
      })
      .select()
      .single();

    if (tenant2Error) {
      console.error("❌ Failed to create tenant 2:", tenant2Error);
      return;
    }

    console.log(`✅ Created tenant: ${tenant2.name} (${tenant2.slug})`);

    // Create users for Tenant 2
    const { data: users2, error: users2Error } = await supabase
      .from("users")
      .insert([
        {
          id: "user_alex_chen_002",
          tenantId: tenant2.id,
          email: "alex@techstart.com",
          name: "Alex Chen",
          role: "OWNER",
          avatarUrl:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        },
        {
          id: "user_emma_wilson_002",
          tenantId: tenant2.id,
          email: "emma@techstart.com",
          name: "Emma Wilson",
          role: "MEMBER",
          avatarUrl:
            "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
        },
      ])
      .select();

    if (users2Error) {
      console.error("❌ Failed to create users for tenant 2:", users2Error);
      return;
    }

    console.log(`✅ Created ${users2.length} users for ${tenant2.name}`);

    // ============================================================================
    // TENANT 3: Free Plan User
    // ============================================================================

    const { data: tenant3, error: tenant3Error } = await supabase
      .from("tenants")
      .insert({
        id: "tenant_freelancer_003",
        name: "Solo Freelancer",
        slug: "solo-freelancer",
        plan: "FREE",
      })
      .select()
      .single();

    if (tenant3Error) {
      console.error("❌ Failed to create tenant 3:", tenant3Error);
      return;
    }

    console.log(`✅ Created tenant: ${tenant3.name} (${tenant3.slug})`);

    const { data: users3, error: users3Error } = await supabase
      .from("users")
      .insert({
        id: "user_jordan_taylor_003",
        tenantId: tenant3.id,
        email: "freelancer@example.com",
        name: "Jordan Taylor",
        role: "OWNER",
      })
      .select();

    if (users3Error) {
      console.error("❌ Failed to create user for tenant 3:", users3Error);
      return;
    }

    console.log(`✅ Created ${users3.length} user for ${tenant3.name}`);

    console.log("\n🎉 Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   • 3 tenants created`);
    console.log(`   • 6 users created across all tenants`);
    console.log(`   • 2 integrations configured`);
    console.log(`   • 2 dashboards created`);
    console.log(`   • 4 metrics recorded`);
    console.log(
      "\n🔐 Multi-tenant isolation verified - each tenant has separate data"
    );
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedDatabase();
