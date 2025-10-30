# Solinth Suite Database Setup Guide

## Overview

This guide walks through setting up the complete database architecture for Solinth Suite, including Supabase, Prisma, and Row-Level Security (RLS) for multi-tenant isolation.

## 🏗️ Architecture

- **Database:** PostgreSQL via Supabase
- **ORM:** Prisma with type-safe client
- **Security:** Row-Level Security (RLS) for tenant isolation
- **Connection:** Connection pooling for production scalability

## 📋 Prerequisites

1. Supabase account (free tier available)
2. Node.js 18+ installed
3. Solinth project dependencies installed (`npm install`)

## 🚀 Setup Steps

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose organization and fill in:
   - **Name:** `solinth-suite`
   - **Database Password:** Generate a strong password
   - **Region:** Choose closest to your users
4. Wait for project creation (2-3 minutes)

### Step 2: Get Connection Details

1. In your Supabase dashboard, go to **Settings > Database**
2. Copy the connection strings:
   - **Connection pooling URL** (for DATABASE_URL)
   - **Direct connection URL** (for DIRECT_URL)
3. Also go to **Settings > API** and copy:
   - **Project URL**
   - **anon public key**
   - **service_role key** (keep secret!)

### Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Update the database section in `.env`:

   ```env
   # Database
   DATABASE_URL="postgresql://postgres.xxx:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
   DIRECT_URL="postgresql://postgres.xxx:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   ```

### Step 4: Run Database Migrations

1. Push the Prisma schema to create tables:

   ```bash
   npm run db:push
   ```

2. Apply Row-Level Security policies:
   ```bash
   # Connect to your Supabase database via SQL Editor
   # Copy and paste the contents of prisma/migrations/001_enable_rls.sql
   ```

### Step 5: Seed Development Data

```bash
npm run db:seed
```

### Step 6: Verify Setup

```bash
npx tsx scripts/test-db.ts
```

## 🔐 Security Features

### Multi-Tenant Isolation

- Every table has `tenantId` field
- Row-Level Security (RLS) policies enforce tenant boundaries
- No cross-tenant data access possible

### Performance Optimizations

- Indexed queries for tenant filtering
- Connection pooling via Supabase
- Optimized RLS policies for high-volume tables

### Audit Trail

- All user actions logged in `audit_logs` table
- Tenant-scoped audit logs for compliance

## 🧪 Testing Tenant Isolation

```typescript
import { createTenantClient } from "@/lib/db";

// Create tenant-scoped clients
const tenant1Client = createTenantClient("tenant-1-id");
const tenant2Client = createTenantClient("tenant-2-id");

// Each client only sees their tenant's data
const tenant1Users = await tenant1Client.withTenant((prisma) =>
  prisma.user.findMany()
); // Only returns tenant-1 users

const tenant2Users = await tenant2Client.withTenant((prisma) =>
  prisma.user.findMany()
); // Only returns tenant-2 users
```

## 📊 Database Schema

### Core Models

- **Tenant:** Organization/company using Solinth
- **User:** Individual users within a tenant
- **Dashboard:** Custom dashboards for each suite
- **Integration:** Third-party service connections
- **Metric:** Time-series business metrics
- **CustomApi:** User-defined API connections

### Supporting Models

- **Widget:** Dashboard components
- **Report:** Automated reports
- **Workflow:** Business process automation
- **BrandAsset:** Company branding materials
- **AiTokenUsage:** AI service billing tracking
- **Comment:** Collaborative annotations
- **AuditLog:** Security and compliance logging

## 🔧 Development Commands

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes
npm run db:push

# Run migrations (production)
npm run db:migrate

# Seed development data
npm run db:seed

# Type check
npm run type-check
```

## 🚨 Important Notes

1. **Never commit `.env`** - Contains sensitive credentials
2. **Always use tenant context** - Call `setTenantContext()` before queries
3. **Test RLS policies** - Verify tenant isolation in development
4. **Monitor performance** - Use indexed queries for large datasets
5. **Backup regularly** - Supabase provides automated backups

## 🆘 Troubleshooting

### Connection Issues

- Verify DATABASE_URL format
- Check Supabase project status
- Ensure IP allowlist includes your location

### RLS Policy Issues

- Verify `app.tenant_id` is set before queries
- Check policy syntax in Supabase SQL Editor
- Test with different tenant IDs

### Performance Issues

- Add indexes for frequently queried fields
- Use connection pooling URL
- Monitor query performance in Supabase dashboard

## 📚 Next Steps

After database setup is complete:

1. **Task 1.3:** Authentication System (Supabase Auth)
2. **Task 1.4:** Multi-Tenant Architecture (Context providers)
3. **Task 2.1:** Design System Implementation
