# Solinth Suite - Database Architecture

## Status: ✅ COMPLETE (Task 1.2)

### Overview
Complete multi-tenant PostgreSQL database with Row-Level Security (RLS) implemented using Prisma ORM and Supabase.

### Architecture Components

#### Database Models (13 total)
**Core Models:**
- **Tenant:** Organization/company using Solinth
- **User:** Individual users within a tenant  
- **Dashboard:** Custom dashboards for each of the 8 suites
- **Integration:** Third-party service connections (Stripe, GA, etc.)
- **Metric:** Time-series business metrics and KPIs
- **CustomApi:** User-defined API connections for custom dashboards

**Supporting Models:**
- **Widget:** Dashboard components and visualizations
- **Report:** Automated reports and insights
- **Workflow:** Business process automation
- **BrandAsset:** Company branding materials and assets
- **AiTokenUsage:** AI service billing and usage tracking
- **Comment:** Collaborative annotations on dashboards/reports
- **AuditLog:** Security and compliance logging

#### Security Features
- **Row-Level Security (RLS):** Database-level tenant isolation
- **Tenant Context:** Automatic tenant filtering for all queries
- **Audit Trail:** Complete logging of all user actions
- **Performance Indexes:** Optimized for high-volume metrics queries

#### Database Client
- **TenantPrismaClient:** Wrapper that automatically sets tenant context
- **Connection Pooling:** Supabase pooler for production scalability
- **Type Safety:** Full TypeScript integration with Prisma

### Key Files
- `prisma/schema.prisma` - Complete database schema
- `prisma/migrations/001_enable_rls.sql` - RLS policies
- `src/lib/db.ts` - Database client with tenant context
- `scripts/seed.ts` - Development test data
- `DATABASE_SETUP.md` - Complete setup guide

### Usage Patterns

#### Tenant-Safe Queries
```typescript
import { createTenantClient } from '@/lib/db';

const tenantClient = createTenantClient(tenantId);
const users = await tenantClient.withTenant(prisma => 
  prisma.user.findMany()
); // Only returns users from this tenant
```

#### Direct Prisma (with manual context)
```typescript
import { prisma, setTenantContext } from '@/lib/db';

await setTenantContext(tenantId);
const dashboards = await prisma.dashboard.findMany();
// RLS automatically filters by tenant
```

### Multi-Tenant Isolation
- Every table has `tenantId` field (except Tenant table itself)
- RLS policies prevent cross-tenant data access
- Tenant context must be set before any database operations
- Automatic cleanup of tenant context after operations

### Performance Optimizations
- Indexed tenant filtering for all major tables
- Special optimization for metrics table (high-volume)
- Connection pooling via Supabase
- Efficient RLS policies with proper indexing

### Next Steps
1. Manual Supabase project setup required
2. Configure DATABASE_URL in environment
3. Run migrations and seed data
4. Task 1.3: Authentication System integration