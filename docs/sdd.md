SDD: Solinth Suite v1.0
System Design Document
Executive Summary
PRD Reference: Lines 1-50 (Executive Summary)
Solinth's technical architecture implements a modern, scalable multi-tenant SaaS platform using Next.js 15, tRPC, and Supabase. The system prioritizes performance, security, and developer experience while maintaining infrastructure costs under £200/month in early stages.
The architecture supports three purchasing models (bundle, à la carte, add-ons) through a flexible permission system and row-level security. All eight suites share a unified data layer enabling the cross-metric correlations that differentiate Solinth from competitors.
Technical Philosophy: API-first design, type-safe development, real-time capabilities, and sandboxed extensibility through custom dashboard APIs.
Technology Stack
Core Technologies
Frontend Framework

- Next.js 15 with App Router
  - Rationale: Server components reduce client bundle, excellent SEO, built-in optimizations
  - PRD Reference: Lines 417-418 (Architecture)
  - TypeScript: Strict mode enforced (no implicit any, strict null checks)

Styling & UI

- Tailwind CSS 4.0 with Solinth design tokens (Solar White, Radiant Amber)
- Framer Motion for glassmorphic animations (60fps requirement)
- Radix UI primitives for accessibility
  - Rationale: Meets WCAG 2.1 AA requirement, composable primitives
  - PRD Reference: Lines 362-367 (Security & Design)

API Layer

- tRPC 11.x for type-safe APIs
  - Rationale: End-to-end type safety, reduces bugs, excellent DX
  - TypeScript strict mode ensures no runtime type errors
  - PRD Reference: Lines 418 (Backend Architecture)

Authentication & Authorization

- Better Auth (https://www.better-auth.com/)
  - TypeScript-native authentication framework
  - Prisma adapter for direct database integration
  - Organization plugin for multi-tenant support
  - Stripe plugin for subscription management
  - Custom Solinth-branded UI (glassmorphic design)
  - Features:
    - Email/Password with verification
    - Social OAuth (GitHub, Google, Discord)
    - Two-Factor Authentication (TOTP)
    - Role-based access control (OWNER, ADMIN, MEMBER, VIEWER)
    - Team invitations and management
    - Organization switching
    - Subscription billing with Stripe
  - Rationale: 100% custom UI control, TypeScript-native, no vendor lock-in
  - PRD Reference: Lines 362-377 (Security Requirements)
  - SDD Reference: Lines 994-1033 (Authentication Architecture)

Email Infrastructure

- Resend (https://resend.com/)
  - Transactional email API
  - Integration with Better Auth email hooks
  - Custom Solinth-branded email templates
  - Features:
    - Email verification
    - Password reset emails
    - Organization invitations
    - Welcome emails
  - Rationale: Simple API, reliable delivery, perfect for Better Auth integration
  - PRD Reference: Lines 420-430 (Email Infrastructure)

Payment Infrastructure

- Stripe (https://stripe.com/)
  - Subscription billing and management
  - Integration via Better Auth Stripe plugin
  - Features:
    - Automatic customer creation on signup
    - 3-tier pricing (Free, Pro, Business)
    - Trial periods (14 days on Pro)
    - Subscription lifecycle management
    - Webhook handling with signature verification
    - Organization-based billing
  - Rationale: Industry standard, comprehensive API, native Better Auth integration
  - PRD Reference: Lines 420-430 (Payment Infrastructure)

Database

- Supabase (PostgreSQL with Row-Level Security)
  - Connection: Supabase Pooler (Transaction mode - port 6543)
  - ORM: Prisma 6.17 with Supabase adapter
  - Rationale: Managed PostgreSQL, built-in RLS, real-time capabilities
  - PRD Reference: Lines 365, 419 (Multi-tenancy & Database)

File Storage

- Cloudflare R2 for large files
- Supabase Storage for small assets
  - Rationale: R2 has no egress fees, cost-effective at scale

AI Infrastructure

- OpenRouter for LLM routing
  - Rationale: Provider flexibility, cost optimization
  - PRD Reference: Lines 422 (AI/ML)

Background Jobs

- Inngest for queues and scheduling
  - Rationale: Serverless-friendly, better than cron at scale
  - PRD Reference: Lines 423 (Queue)

Analytics & Monitoring

- PostHog for product analytics
- Sentry for error tracking
- BetterStack for uptime monitoring
  - PRD Reference: Lines 424 (Monitoring)
    Database Architecture
    Schema Design
    PRD Reference: Lines 151-500 (All Features requiring data storage)
    // Multi-tenant foundation - EVERY table has tenantId
    model Tenant {
    id String @id @default(cuid())
    name String
    slug String @unique // for subdomains
    plan PlanType @default(FREE)
    stripeCustomerId String? @unique
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    // Relations
    users User[]
    dashboards Dashboard[]
    integrations Integration[]
    metrics Metric[]
    reports Report[]
    workflows Workflow[]
    customApis CustomApi[]
    brandAssets BrandAsset[]
    aiTokenUsage AiTokenUsage[]
    }

model User {
id String @id @default(cuid())
tenantId String
email String  
 name String?
role UserRole @default(MEMBER)
avatarUrl String?
createdAt DateTime @default(now())
lastActiveAt DateTime @default(now())

// Relations
tenant Tenant @relation(fields: [tenantId], references: [id])
dashboards Dashboard[]
comments Comment[]
auditLogs AuditLog[]

@@unique([tenantId, email])
@@index([tenantId])
}

model Dashboard {
id String @id @default(cuid())
tenantId String
userId String
name String
type DashboardType
config Json // Widget positions, sizes, settings
isPublic Boolean @default(false)
shareToken String? @unique
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

// Relations
tenant Tenant @relation(fields: [tenantId], references: [id])
user User @relation(fields: [userId], references: [id])
widgets Widget[]

@@index([tenantId])
@@index([userId])
}

model Integration {
id String @id @default(cuid())
tenantId String
type IntegrationType // STRIPE, QUICKBOOKS, etc
credentials Json @encrypted // OAuth tokens
config Json // Sync frequency, settings
status IntegrationStatus
lastSyncAt DateTime?
lastErrorAt DateTime?
lastError String?

// Relations
tenant Tenant @relation(fields: [tenantId], references: [id])
metrics Metric[]

@@unique([tenantId, type])
@@index([tenantId])
}

model Metric {
id String @id @default(cuid())
tenantId String
integrationId String?
name String
value Decimal
unit String?
timestamp DateTime
dimensions Json // Product, customer, category, etc

// Relations
tenant Tenant @relation(fields: [tenantId], references: [id])
integration Integration? @relation(fields: [integrationId], references: [id])

@@index([tenantId, name, timestamp])
@@index([integrationId])
}

model CustomApi {
id String @id @default(cuid())
tenantId String
name String
url String
method String
headers Json?
body Json?
schedule String? // Cron expression
rateLimit Int @default(60) // requests per minute
status ApiStatus
lastRunAt DateTime?
metrics Json // Mapped fields to metrics

// Relations
tenant Tenant @relation(fields: [tenantId], references: [id])

@@index([tenantId])
}

// Enums
enum PlanType {
FREE
PRO
BUSINESS
ENTERPRISE
}

enum UserRole {
OWNER
ADMIN
MANAGER
MEMBER
VIEWER
CLIENT // For agency client access
}

enum DashboardType {
BUSINESS
CREATIVE
DIRECTORS
BRAND
REPORTING
SUPPORT
SECURITY
CUSTOM
}

enum IntegrationType {
STRIPE
QUICKBOOKS
GOOGLE_ANALYTICS
GOOGLE_ADS
SALESFORCE
HUBSPOT
SHOPIFY
MAILCHIMP
CRISP
POSTBRIDGE
}

enum IntegrationStatus {
CONNECTED
ERROR
DISABLED
SYNCING
}

enum ApiStatus {
ACTIVE
PAUSED
ERROR
BLOCKED
}
Row-Level Security (RLS)
PRD Reference: Lines 701-750 (Multi-tenancy requirement)
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;

-- Users can only see data from their tenant
CREATE POLICY tenant_isolation ON users
FOR ALL
USING (tenant_id = current_setting('app.tenant_id')::uuid);

-- Metrics isolation with performance optimization
CREATE POLICY metrics_tenant_isolation ON metrics
FOR SELECT
USING (tenant_id = current_setting('app.tenant_id')::uuid);

-- Indexed for performance
CREATE INDEX idx_metrics_tenant_timestamp
ON metrics(tenant_id, timestamp DESC);

CREATE INDEX idx_metrics_tenant_name
ON metrics(tenant_id, name);
API Design
tRPC Router Structure
PRD Reference: Lines 151-250 (Integration Hub), Lines 351-450 (Reporting features)
// src/server/api/root.ts
export const appRouter = createTRPCRouter({
auth: authRouter,
tenant: tenantRouter,
dashboard: dashboardRouter,
integration: integrationRouter,
metric: metricRouter,
report: reportRouter,
ai: aiRouter,
customApi: customApiRouter,
billing: billingRouter,
});

// src/server/api/routers/dashboard.ts
export const dashboardRouter = createTRPCRouter({
list: protectedProcedure
.query(async ({ ctx }) => {
return ctx.prisma.dashboard.findMany({
where: { tenantId: ctx.tenant.id },
include: { widgets: true },
});
}),

create: protectedProcedure
.input(createDashboardSchema)
.mutation(async ({ ctx, input }) => {
// Check plan limits
const dashboardCount = await ctx.prisma.dashboard.count({
where: { tenantId: ctx.tenant.id },
});

      if (ctx.tenant.plan === 'FREE' && dashboardCount >= 5) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Free plan limited to 5 dashboards',
        });
      }

      return ctx.prisma.dashboard.create({
        data: {
          tenantId: ctx.tenant.id,
          userId: ctx.user.id,
          ...input,
        },
      });
    }),

share: protectedProcedure
.input(z.object({
id: z.string(),
isPublic: z.boolean(),
}))
.mutation(async ({ ctx, input }) => {
// PRO+ feature only
if (ctx.tenant.plan === 'FREE') {
throw new TRPCError({
code: 'FORBIDDEN',
message: 'Dashboard sharing requires Pro plan',
});
}

      const shareToken = isPublic ? generateToken() : null;

      return ctx.prisma.dashboard.update({
        where: {
          id: input.id,
          tenantId: ctx.tenant.id,
        },
        data: {
          isPublic: input.isPublic,
          shareToken,
        },
      });
    }),

});

// src/server/api/routers/metric.ts
export const metricRouter = createTRPCRouter({
correlate: protectedProcedure
.input(correlationSchema)
.query(async ({ ctx, input }) => {
const [metrics1, metrics2] = await Promise.all([
ctx.prisma.metric.findMany({
where: {
tenantId: ctx.tenant.id,
name: input.metric1,
timestamp: {
gte: input.startDate,
lte: input.endDate,
},
},
}),
ctx.prisma.metric.findMany({
where: {
tenantId: ctx.tenant.id,
name: input.metric2,
timestamp: {
gte: input.startDate,
lte: input.endDate,
},
},
}),
]);

      // Calculate Pearson correlation
      const correlation = calculateCorrelation(metrics1, metrics2);

      return {
        correlation,
        insight: generateInsight(correlation, input.metric1, input.metric2),
        visualization: prepareChartData(metrics1, metrics2),
      };
    }),

});
Real-time Subscriptions
PRD Reference: Lines 701-750 (Real-time requirement)
// src/server/api/routers/realtime.ts
export const realtimeRouter = createTRPCRouter({
onMetricUpdate: protectedProcedure
.input(z.object({
dashboardId: z.string(),
}))
.subscription(({ ctx, input }) => {
return observable<MetricUpdate>((emit) => {
const channel = supabase
.channel(`metrics:${ctx.tenant.id}`)
.on(
'postgres_changes',
{
event: 'INSERT',
schema: 'public',
table: 'metrics',
filter: `tenant_id=eq.${ctx.tenant.id}`,
},
(payload) => {
emit.next({
type: 'metric',
data: payload.new,
});
}
)
.subscribe();

        return () => {
          channel.unsubscribe();
        };
      });
    }),

});
Component Architecture
Frontend Structure
PRD Reference: Lines 501-600 (Design Requirements)
src/
├── app/
│ ├── (auth)/
│ │ ├── login/
│ │ ├── signup/
│ │ └── forgot-password/
│ ├── (dashboard)/
│ │ ├── layout.tsx # Dashboard shell
│ │ ├── page.tsx # Main dashboard
│ │ ├── business/ # Business Suite
│ │ ├── creative/ # Creative Suite
│ │ ├── directors/ # Directors Suite
│ │ ├── brand/ # Brand Suite
│ │ ├── reporting/ # Reporting Suite
│ │ ├── support/ # Support Suite
│ │ ├── security/ # Security Suite
│ │ └── custom/ # Custom Dashboards
│ ├── api/
│ │ └── trpc/
│ │ └── [trpc]/
│ └── (public)/
│ ├── shared/[token]/ # Public dashboard view
│ └── pricing/
├── components/
│ ├── ui/ # Base components
│ │ ├── glass-card.tsx # Signature glass effect
│ │ ├── button.tsx
│ │ ├── chart.tsx
│ │ └── ...
│ ├── dashboard/
│ │ ├── widget-grid.tsx
│ │ ├── metric-card.tsx
│ │ ├── correlation-viewer.tsx
│ │ └── ...
│ ├── ai/
│ │ ├── ask-sol-button.tsx
│ │ ├── insight-panel.tsx
│ │ └── brand-voice-trainer.tsx
│ └── integration/
│ ├── oauth-connect.tsx
│ ├── api-sandbox.tsx
│ └── health-monitor.tsx
├── hooks/
│ ├── use-tenant.ts
│ ├── use-metrics.ts
│ ├── use-realtime.ts
│ └── use-ai.ts
├── lib/
│ ├── api.ts
│ ├── auth.ts
│ ├── permissions.ts
│ └── analytics.ts
└── styles/
├── globals.css
└── glass.css
Glass Component System
PRD Reference: Lines 501-600 (Glassmorphic Design System)
// components/ui/glass-card.tsx
import { cn } from '@/lib/utils';

interface GlassCardProps {
children: React.ReactNode;
className?: string;
variant?: 'default' | 'elevated' | 'interactive';
glow?: boolean;
}

export function GlassCard({
children,
className,
variant = 'default',
glow = false,
}: GlassCardProps) {
return (
<div
className={cn(
'glass-card',
variant === 'elevated' && 'glass-elevated',
variant === 'interactive' && 'glass-interactive',
glow && 'glass-glow',
className
)} >
{children}
</div>
);
}

// components/ui/button.tsx - Solinth Glassmorphic Buttons
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300",
{
variants: {
variant: {
// Primary glassmorphic button with Radiant Amber gradient
default: "glass-button bg-solar-gradient text-solar-white shadow-lg hover:shadow-xl hover:scale-[1.02]",
// Outline glassmorphic button
outline: "glass-card border-2 border-radiant-amber/30 hover:bg-radiant-amber/10",
// Secondary glassmorphic button
secondary: "glass-card bg-midday-sand/50 dark:bg-midnight-graphite/50",
// Ghost button
ghost: "hover:bg-radiant-amber/10 hover:text-radiant-amber",
},
size: {
default: "h-10 px-6 py-2",
sm: "h-8 px-4 text-xs",
lg: "h-12 px-8 text-base",
icon: "h-10 w-10",
},
},
defaultVariants: {
variant: "default",
size: "default",
},
}
);

export function Button({ variant, size, className, ...props }: ButtonProps) {
return (
<button
className={cn(buttonVariants({ variant, size, className }))}
{...props}
/>
);
}

// styles/glass.css - CORRECTED GLASSMORPHIC DESIGN
.glass-card {
@apply relative overflow-hidden rounded-xl;
background: linear-gradient(
135deg,
rgba(255, 255, 255, 1) 0%, /_ Full opacity - enhanced frost _/
rgba(255, 255, 255, 0.95) 50%,
rgba(255, 255, 255, 0.98) 100%
);
backdrop-filter: blur(24px); /_ Increased frost _/
-webkit-backdrop-filter: blur(24px);
border: 2px solid rgba(0, 0, 0, 0.15); /_ Darker border _/
border-top-color: rgba(255, 255, 255, 1); /_ Light from top-left _/
border-left-color: rgba(255, 255, 255, 1); /_ Creates depth _/
box-shadow:
inset 0 1px 2px rgba(255, 255, 255, 1), /_ Top highlight _/
inset 0 -1px 2px rgba(0, 0, 0, 0.05), /_ Bottom shadow _/
0 8px 32px rgba(255, 165, 69, 0.12), /_ Amber glow _/
0 2px 8px rgba(0, 0, 0, 0.08); /_ Depth shadow _/
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-card:hover {
transform: translateY(-2px);
box-shadow:
inset 0 1px 2px rgba(255, 255, 255, 1),
inset 0 -1px 2px rgba(0, 0, 0, 0.05),
0 12px 40px rgba(255, 165, 69, 0.18), /_ Stronger amber glow _/
0 4px 12px rgba(0, 0, 0, 0.1);
}

/_ Dark mode variant - CORRECTED _/
.dark .glass-card {
background: linear-gradient(
135deg,
rgba(28, 31, 36, 1) 0%, /_ Full opacity - enhanced frost _/
rgba(28, 31, 36, 0.95) 50%,
rgba(28, 31, 36, 0.98) 100%
);
backdrop-filter: blur(28px); /_ Even more frost in dark mode _/
-webkit-backdrop-filter: blur(28px);
border: 2px solid rgba(255, 165, 69, 0.2); /_ Amber border _/
border-top-color: rgba(255, 255, 255, 0.15); /_ Light from top-left _/
border-left-color: rgba(255, 255, 255, 0.15);
box-shadow:
inset 0 1px 0 rgba(255, 255, 255, 0.1), /_ Top highlight _/
inset 0 -1px 0 rgba(0, 0, 0, 0.3), /_ Bottom shadow _/
0 12px 40px rgba(255, 165, 69, 0.15), /_ Amber glow _/
0 4px 12px rgba(0, 0, 0, 0.4); /_ Depth shadow _/
}

.dark .glass-card:hover {
box-shadow:
inset 0 1px 0 rgba(255, 255, 255, 0.1),
inset 0 -1px 0 rgba(0, 0, 0, 0.3),
0 16px 48px rgba(255, 165, 69, 0.2), /_ Stronger glow _/
0 6px 16px rgba(0, 0, 0, 0.5);
}
Integration System
OAuth Flow
PRD Reference: Lines 151-250 (Embedded OAuth requirement)
// lib/integrations/oauth.ts
export class EmbeddedOAuth {
async connect(provider: IntegrationType): Promise<void> {
// No redirects - embedded iframe approach
const iframe = document.createElement('iframe');
iframe.src = `/api/oauth/${provider}/authorize`;
iframe.style.cssText = `     position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 500px;
      height: 600px;
      border: none;
      border-radius: 12px;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  `;

    document.body.appendChild(iframe);

    // Listen for completion
    window.addEventListener('message', async (event) => {
      if (event.data.type === 'oauth-complete') {
        const { code, state } = event.data;

        await this.exchangeToken(provider, code, state);
        iframe.remove();
      }
    });

}

private async exchangeToken(
provider: IntegrationType,
code: string,
state: string
): Promise<void> {
const response = await fetch('/api/oauth/callback', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ provider, code, state }),
});

    if (!response.ok) {
      throw new Error('OAuth exchange failed');
    }

}
}
Data Sync Engine
PRD Reference: Lines 151-250 (Integration syncing)
// lib/sync/engine.ts
export class SyncEngine {
private queue: Inngest;

async syncIntegration(
tenantId: string,
integrationType: IntegrationType
): Promise<void> {
await this.queue.send({
name: 'sync/integration',
data: { tenantId, integrationType },
});
}

// Inngest function definition
async handleSync({ event, step }: InngestEvent) {
const { tenantId, integrationType } = event.data;

    // Get integration config
    const integration = await step.run('get-integration', async () => {
      return prisma.integration.findUnique({
        where: {
          tenantId_type: { tenantId, type: integrationType },
        },
      });
    });

    // Fetch data from provider
    const data = await step.run('fetch-data', async () => {
      const adapter = this.getAdapter(integrationType);
      return adapter.fetchData(integration.credentials);
    });

    // Transform and store
    await step.run('store-metrics', async () => {
      const metrics = this.transformToMetrics(data, integrationType);

      // Batch insert with duplicate detection
      await prisma.$transaction(async (tx) => {
        for (const batch of chunk(metrics, 1000)) {
          await tx.metric.createMany({
            data: batch,
            skipDuplicates: true,
          });
        }
      });
    });

    // Update last sync
    await step.run('update-status', async () => {
      await prisma.integration.update({
        where: { id: integration.id },
        data: {
          lastSyncAt: new Date(),
          status: 'CONNECTED',
        },
      });
    });

}
}
AI Implementation
Sol Assistant Architecture
PRD Reference: Lines 251-350 (AI Assistant features)
// lib/ai/sol.ts
import { OpenRouter } from 'openrouter';

export class SolAssistant {
private openrouter: OpenRouter;
private brandVoice: Map<string, BrandVoiceConfig> = new Map();

async query(
tenantId: string,
question: string,
context?: ChartContext
): Promise<AiResponse> {
// Get tenant's metrics for context
const recentMetrics = await this.getRecentMetrics(tenantId);

    // Build prompt
    const systemPrompt = this.buildSystemPrompt(tenantId, recentMetrics);
    const userPrompt = context
      ? `${question}\n\nContext: ${JSON.stringify(context)}`
      : question;

    // Query OpenRouter
    const response = await this.openrouter.chat({
      model: 'anthropic/claude-3-opus',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Track token usage
    await this.trackUsage(tenantId, response.usage);

    return {
      text: response.content,
      charts: this.extractCharts(response.content),
      insights: this.extractInsights(response.content),
      actions: this.extractActions(response.content),
    };

}

async trainBrandVoice(
tenantId: string,
samples: string[]
): Promise<void> {
// Analyze samples for patterns
const analysis = await this.openrouter.chat({
model: 'anthropic/claude-3-opus',
messages: [
{
role: 'system',
content: 'Analyze these writing samples and extract brand voice characteristics.',
},
{
role: 'user',
content: samples.join('\n\n'),
},
],
});

    // Store brand voice config
    this.brandVoice.set(tenantId, {
      tone: analysis.tone,
      vocabulary: analysis.vocabulary,
      style: analysis.style,
      examples: samples.slice(0, 3),
    });

}

private buildSystemPrompt(
tenantId: string,
metrics: Metric[]
): string {
const brandVoice = this.brandVoice.get(tenantId);

    return `
      You are Sol, the Solinth AI assistant.

      Current metrics context:
      ${JSON.stringify(metrics)}

      ${brandVoice ? `Brand voice: ${JSON.stringify(brandVoice)}` : ''}

      Provide actionable insights and specific recommendations.
      Format numbers clearly and use charts when helpful.
      Be concise but thorough.
    `;

}
}
Custom API Sandbox
Security Implementation
PRD Reference: Lines 451-500 (Sandbox API security)
// lib/sandbox/executor.ts
export class SandboxExecutor {
private readonly limits = {
memory: 100 _ 1024 _ 1024, // 100MB
timeout: 30000, // 30 seconds
responseSize: 1024 \* 1024, // 1MB
};

async executeApi(
customApi: CustomApi,
tenantId: string
): Promise<ApiResult> {
// Validation
this.validateUrl(customApi.url);
this.checkRateLimit(customApi.id, customApi.rateLimit);

    // Execute in isolated context
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, this.limits.timeout);

    try {
      const response = await fetch(customApi.url, {
        method: customApi.method,
        headers: customApi.headers as HeadersInit,
        body: customApi.body ? JSON.stringify(customApi.body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      // Check response size
      const contentLength = response.headers.get('content-length');
      if (contentLength && parseInt(contentLength) > this.limits.responseSize) {
        throw new Error('Response too large');
      }

      const data = await response.json();

      // Sanitize and validate
      this.sanitizeResponse(data);
      this.detectAnomalies(data, customApi.id);

      // Transform to metrics
      const metrics = this.transformData(data, customApi.metrics);

      return {
        success: true,
        data: metrics,
        timestamp: new Date(),
      };
    } catch (error) {
      await this.handleError(customApi.id, error);
      throw error;
    } finally {
      clearTimeout(timeout);
    }

}

private validateUrl(url: string): void {
const parsed = new URL(url);

    // HTTPS only
    if (parsed.protocol !== 'https:') {
      throw new Error('HTTPS required');
    }

    // No internal networks
    const hostname = parsed.hostname;
    if (
      hostname === 'localhost' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('172.')
    ) {
      throw new Error('Internal networks blocked');
    }

}

private sanitizeResponse(data: any): void {
// Check for sensitive data patterns
const sensitivePatterns = [
/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
/\b(?:\d{4}[-\s]?){3}\d{4}\b/, // Credit card
/\b[A-Za-z0-9]{20,}\b/, // API keys
];

    const dataString = JSON.stringify(data);
    for (const pattern of sensitivePatterns) {
      if (pattern.test(dataString)) {
        throw new Error('Sensitive data detected');
      }
    }

}
}
Performance Optimization
Caching Strategy
PRD Reference: Lines 701-750 (Performance requirements)
// lib/cache/strategy.ts
import { Redis } from '@upstash/redis';

export class CacheStrategy {
private redis: Redis;
private memoryCache: Map<string, CacheEntry> = new Map();

async getMetrics(
tenantId: string,
query: MetricQuery
): Promise<Metric[]> {
const cacheKey = this.buildKey(tenantId, query);

    // L1: Memory cache (instant)
    const memoryHit = this.memoryCache.get(cacheKey);
    if (memoryHit && !this.isExpired(memoryHit)) {
      return memoryHit.data;
    }

    // L2: Redis cache (fast)
    const redisHit = await this.redis.get(cacheKey);
    if (redisHit) {
      this.memoryCache.set(cacheKey, {
        data: redisHit,
        timestamp: Date.now(),
      });
      return redisHit;
    }

    // L3: Database (slower)
    const data = await this.fetchFromDatabase(tenantId, query);

    // Cache based on plan
    const ttl = this.getTtl(tenantId);
    await this.redis.setex(cacheKey, ttl, data);
    this.memoryCache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });

    return data;

}

private getTtl(tenantId: string): number {
const tenant = await this.getTenant(tenantId);

    switch (tenant.plan) {
      case 'ENTERPRISE': return 10; // 10 seconds
      case 'BUSINESS': return 60; // 1 minute
      case 'PRO': return 300; // 5 minutes
      default: return 3600; // 1 hour
    }

}
}
Query Optimization
// lib/db/queries.ts
export class OptimizedQueries {
// Use materialized views for common aggregations
async getDashboardMetrics(
tenantId: string,
dashboardId: string
): Promise<DashboardData> {
// Single query with JSON aggregation
const result = await prisma.$queryRaw`     WITH metric_data AS (
        SELECT 
          name,
          DATE_TRUNC('hour', timestamp) as hour,
          AVG(value) as avg_value,
          MIN(value) as min_value,
          MAX(value) as max_value,
          COUNT(*) as data_points
        FROM metrics
        WHERE tenant_id = ${tenantId}
          AND timestamp > NOW() - INTERVAL '24 hours'
        GROUP BY name, hour
      )
      SELECT 
        json_agg(
          json_build_object(
            'name', name,
            'data', json_agg(
              json_build_object(
                'hour', hour,
                'avg', avg_value,
                'min', min_value,
                'max', max_value,
                'count', data_points
              ) ORDER BY hour
            )
          )
        ) as metrics
      FROM metric_data
      GROUP BY name;
  `;

    return result;

}
}
Deployment Architecture
Infrastructure
PRD Reference: Lines 801-850 (Scaling strategy)

# docker-compose.yml for local development

version: '3.8'

services:
app:
build: .
ports: - "3000:3000"
environment: - DATABASE_URL=postgresql://user:pass@db:5432/solinth - REDIS_URL=redis://redis:6379
depends_on: - db - redis

db:
image: supabase/postgres:15
environment: - POSTGRES_PASSWORD=password - POSTGRES_DB=solinth
volumes: - postgres_data:/var/lib/postgresql/data

redis:
image: redis:7-alpine
ports: - "6379:6379"

volumes:
postgres_data:
Production Deployment
// vercel.json
{
"functions": {
"app/api/trpc/[trpc]/route.ts": {
"maxDuration": 30
},
"app/api/sync/route.ts": {
"maxDuration": 300
}
},
"crons": [
{
"path": "/api/cron/sync",
"schedule": "*/5 * * * *"
},
{
"path": "/api/cron/reports",
"schedule": "0 9 * * *"
}
]
}
Security Architecture
Authentication & Authorization (Better Auth)
PRD Reference: Lines 362-365, 439 (Authentication & Security)
Provider: Better Auth (https://www.better-auth.com/)
TypeScript: Strict mode enforced across all auth code

// lib/auth/auth.ts - Better Auth Server Configuration
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { organization, twoFactor } from "better-auth/plugins"
import { prisma } from "@/lib/db"
import { ac, owner, admin, member, viewer } from "./permissions"

export const auth = betterAuth({
database: prismaAdapter(prisma, {
provider: "postgresql"
}),
emailAndPassword: {
enabled: true,
requireEmailVerification: true
},
socialProviders: {
github: {
clientId: process.env.GITHUB_CLIENT_ID as string,
clientSecret: process.env.GITHUB_CLIENT_SECRET as string
},
google: {
clientId: process.env.GOOGLE_CLIENT_ID as string,
clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
}
},
plugins: [
organization({
ac,
roles: { owner, admin, member, viewer },
allowUserToCreateOrganization: true,
organizationLimit: 5,
membershipLimit: 100,
sendInvitationEmail: async (data) => {
const inviteLink = `${process.env.BETTER_AUTH_URL}/accept-invitation/${data.id}`
await sendEmail({
to: data.email,
subject: `Join ${data.organization.name} on Solinth`,
html: solinthInvitationTemplate({
inviterName: data.inviter.user.name,
organizationName: data.organization.name,
inviteLink
})
})
}
}),
twoFactor()
]
})

// lib/auth/auth-client.ts - Better Auth Client
import { createAuthClient } from "better-auth/react"
import { organizationClient } from "better-auth/client/plugins"
import { ac, owner, admin, member, viewer } from "./permissions"

export const authClient = createAuthClient({
baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
plugins: [
organizationClient({
ac,
roles: { owner, admin, member, viewer }
})
]
})

export const {
signIn,
signUp,
signOut,
useSession,
useActiveOrganization,
organization
} = authClient

// lib/auth/permissions.ts - Solinth Access Control
import { createAccessControl } from "better-auth/plugins/access"

const statement = {
// Solinth-specific resources
dashboard: ["create", "read", "update", "delete"],
metric: ["create", "read", "update", "delete"],
integration: ["create", "read", "update", "delete"],
report: ["create", "read", "update", "delete"],
widget: ["create", "read", "update", "delete"],
workflow: ["create", "read", "update", "delete"],
// Organization resources (Better Auth built-in)
organization: ["update", "delete"],
member: ["create", "update", "delete"],
invitation: ["create", "cancel"]
} as const

export const ac = createAccessControl(statement)

// Solinth Role Definitions
export const owner = ac.newRole({
dashboard: ["create", "read", "update", "delete"],
metric: ["create", "read", "update", "delete"],
integration: ["create", "read", "update", "delete"],
report: ["create", "read", "update", "delete"],
widget: ["create", "read", "update", "delete"],
workflow: ["create", "read", "update", "delete"],
organization: ["update", "delete"],
member: ["create", "update", "delete"],
invitation: ["create", "cancel"]
})

export const admin = ac.newRole({
dashboard: ["create", "read", "update", "delete"],
metric: ["create", "read", "update", "delete"],
integration: ["create", "read", "update"],
report: ["create", "read", "update", "delete"],
widget: ["create", "read", "update", "delete"],
workflow: ["create", "read", "update"],
organization: ["update"],
member: ["create", "update", "delete"],
invitation: ["create", "cancel"]
})

export const member = ac.newRole({
dashboard: ["read"],
metric: ["read"],
integration: ["read"],
report: ["read"],
widget: ["read"],
workflow: ["read"],
organization: [],
member: [],
invitation: []
})

export const viewer = ac.newRole({
dashboard: ["read"],
metric: ["read"],
integration: [],
report: ["read"],
widget: [],
workflow: [],
organization: [],
member: [],
invitation: []
})

// lib/auth/middleware.ts - Route Protection
import { auth } from "./auth"
import { NextRequest, NextResponse } from "next/server"

export async function authMiddleware(request: NextRequest) {
const session = await auth.api.getSession({
headers: request.headers
})

if (!session) {
return NextResponse.redirect(new URL('/login', request.url))
}

// Set tenant context for RLS if organization is active
if (session.activeOrganizationId) {
// Tenant context will be set in tRPC context
request.headers.set('x-tenant-id', session.activeOrganizationId)
}

return NextResponse.next()
}

// app/api/auth/[...all]/route.ts - Better Auth API Handler
import { auth } from "@/lib/auth/auth"
import { toNextJsHandler } from "better-auth/next-js"

export const { POST, GET } = toNextJsHandler(auth)

// TypeScript strict mode ensures:
// - No implicit any types
// - Strict null checks
// - Strict function types
// - All Better Auth types properly inferred
Audit Logging
// lib/audit/logger.ts
export class AuditLogger {
async log(event: AuditEvent): Promise<void> {
// Compress for storage efficiency
const compressed = await this.compress(event);

    await prisma.auditLog.create({
      data: {
        tenantId: event.tenantId,
        userId: event.userId,
        action: event.action,
        resource: event.resource,
        changes: compressed,
        ip: event.ip,
        userAgent: event.userAgent,
        timestamp: new Date(),
      },
    });

}

private async compress(data: any): Promise<Buffer> {
const json = JSON.stringify(data);
return zlib.gzipSync(json);
}
}
Testing Strategy
Test Structure
// **tests**/api/dashboard.test.ts
describe('Dashboard API', () => {
it('enforces tenant isolation', async () => {
const tenant1 = await createTestTenant();
const tenant2 = await createTestTenant();

    const dashboard1 = await createDashboard(tenant1);

    // Try to access from different tenant
    const caller = createCaller({ tenant: tenant2 });

    await expect(
      caller.dashboard.get({ id: dashboard1.id })
    ).rejects.toThrow('Not found');

});

it('enforces plan limits', async () => {
const tenant = await createTestTenant({ plan: 'FREE' });

    // Create 5 dashboards (limit)
    for (let i = 0; i < 5; i++) {
      await createDashboard(tenant);
    }

    // 6th should fail
    await expect(
      createDashboard(tenant)
    ).rejects.toThrow('Free plan limited to 5 dashboards');

});
});
Migration Strategy
Database Migrations
-- migrations/001_initial_schema.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enable RLS
ALTER DATABASE solinth SET row_security = on;

-- Tenant table
CREATE TABLE tenants (
id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
name VARCHAR(255) NOT NULL,
slug VARCHAR(255) UNIQUE NOT NULL,
plan VARCHAR(20) DEFAULT 'FREE',
created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
CREATE POLICY tenant_isolation ON tenants
FOR ALL
USING (id = current_setting('app.tenant_id')::uuid);
Anti-Patterns to Avoid
Never Do This
PRD Reference: Lines 701-750 (Security requirements)
// ❌ WRONG - Data leak vulnerability
const getAllMetrics = async () => {
return prisma.metric.findMany(); // No tenant filter!
};

// ✅ CORRECT - Always filter by tenant
const getTenantMetrics = async (tenantId: string) => {
return prisma.metric.findMany({
where: { tenantId },
});
};

// ❌ WRONG - Client-side filtering
const DashboardList = () => {
const { data } = useQuery(['dashboards']);
const filtered = data?.filter(d => d.tenantId === currentTenant);
};

// ✅ CORRECT - Server-side filtering
const DashboardList = () => {
const { data } = useQuery(['dashboards'], {
tenantId: currentTenant, // Pass to API
});
};

// ❌ WRONG - Storing credentials in plain text
await prisma.integration.create({
data: {
credentials: { apiKey: 'sk_live_xyz' }, // Plain text!
},
});

// ✅ CORRECT - Encrypt sensitive data
await prisma.integration.create({
data: {
credentials: await encrypt({ apiKey: 'sk_live_xyz' }),
},
});
Performance Benchmarks
Target Metrics
Operation Target Measurement
Dashboard Load < 1s Real user monitoring
API Response (p95) < 200ms APM tracking
Metric Query (1M rows) < 500ms Database profiling
Correlation Calculation < 2s Performance testing
AI Response < 3s OpenRouter metrics
Sync Operation < 30s Job monitoring
Monitoring & Observability
Key Metrics
// lib/monitoring/metrics.ts
export const trackMetrics = {
// Business metrics
userSignup: (plan: PlanType) => {
posthog.capture('user_signup', { plan });
},

// Performance metrics
apiLatency: (endpoint: string, duration: number) => {
statsig.logEvent('api_latency', { endpoint, duration });
},

// Error tracking
integrationError: (type: string, error: Error) => {
sentry.captureException(error, {
tags: { integration: type },
});
},

// Feature usage
aiQuery: (tenantId: string, tokens: number) => {
amplitude.track('ai_query', { tenantId, tokens });
},
};
Cost Optimization
Infrastructure Budget
PRD Reference: Lines 51-150 (£150-200/month budget)
Service Cost/Month Notes
Vercel Pro £20 Frontend hosting
Supabase Pro £25 Database + auth
Cloudflare R2 £10 Storage (pay per use)
Upstash Redis £10 Caching
PostHog £0 Free tier
Sentry £0 Free tier
OpenRouter £50 AI tokens (pay per use)
Total £115 Under budget
