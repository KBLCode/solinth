# Solinth Suite - Technology Stack

## Updated: 2025-10-31 - Better Auth Integration

## Core Stack

### Frontend
- **Framework:** Next.js 15.5.4 (App Router)
- **React:** 19.0.0 (latest with concurrent features)
- **TypeScript:** 5.3+ (strict mode)
- **Styling:** Tailwind CSS 4.0 (CSS variables for Solinth brand)
- **Animations:** Framer Motion (glassmorphic effects)
- **UI Components:** Radix UI (headless, accessible)

### Backend
- **API Layer:** tRPC 11.x (type-safe APIs)
- **Database ORM:** Prisma 6.17 (type-safe queries)
- **Database:** Supabase PostgreSQL (managed, with RLS)
- **Authentication:** Better Auth (https://www.better-auth.com/)
- **Real-time:** Supabase Realtime (WebSocket subscriptions)
- **Caching:** Redis/Upstash (session and query caching)

### Authentication & Authorization
- **Provider:** Better Auth (TypeScript-native, framework-agnostic)
- **Features:**
  - Email/Password authentication
  - Social OAuth (GitHub, Google, Discord)
  - Two-Factor Authentication (TOTP)
  - Multi-tenant organizations
  - Role-based access control
  - Custom Solinth-branded UI
- **Session Management:** HTTP-only cookies with JWT
- **Multi-Tenant:** Organization plugin with teams
- **Database Adapter:** Prisma adapter for Better Auth

### Database & Security
- **Primary Database:** Supabase PostgreSQL
- **Connection Pooling:** Supabase Pooler (Transaction mode - port 6543)
- **ORM:** Prisma 6.17 with Supabase adapter
- **Row-Level Security:** PostgreSQL RLS policies
- **Multi-Tenant Isolation:** Tenant context with RLS
- **Audit Logging:** Complete user action tracking

### AI Integration
- **Provider:** OpenRouter (model flexibility)
- **Models:** GPT-4, Claude 3, Gemini Pro
- **Features:** Streaming responses, context management
- **Use Cases:** Sol AI assistant, content generation

### File Storage
- **Provider:** Cloudflare R2 (S3-compatible)
- **Features:** CDN, image optimization
- **Use Cases:** Brand assets, user uploads, reports

### Background Jobs
- **Provider:** Inngest (serverless workflows)
- **Features:** Scheduled jobs, retries, monitoring
- **Use Cases:** Report generation, data sync, email sending

### Monitoring & Analytics
- **Error Tracking:** Sentry
- **Analytics:** PostHog (product analytics)
- **Logging:** Structured logging with Winston
- **Performance:** Vercel Analytics

### Email
- **Provider:** Resend or SendGrid
- **Features:** Transactional emails, templates
- **Use Cases:** Auth emails, invitations, notifications

### Payments
- **Provider:** Stripe
- **Features:** Subscriptions, invoicing, webhooks
- **Plans:** Free, Pro, Business, Enterprise

## Development Tools

### Code Quality
- **Linting:** ESLint with custom rules
- **Formatting:** Prettier
- **Type Checking:** TypeScript strict mode
- **Git Hooks:** Husky + lint-staged

### Testing
- **Unit Tests:** Jest
- **Integration Tests:** Jest + Supertest
- **E2E Tests:** Playwright
- **Component Tests:** React Testing Library

### Build & Deploy
- **Hosting:** Vercel (Next.js optimized)
- **CI/CD:** GitHub Actions
- **Preview Deployments:** Vercel preview URLs
- **Environment Management:** Vercel environment variables

## Solinth-Specific Patterns

### Glassmorphic Design System
```css
/* Light Mode Glass */
.glass-card {
  background: linear-gradient(
    135deg, 
    rgba(255,255,255,0.98) 0%, 
    rgba(255,255,255,0.92) 50%, 
    rgba(255,255,255,0.95) 100%
  );
  backdrop-filter: blur(20px);
  border: 1.5px solid rgba(255,165,69,0.15);
  box-shadow: 
    inset 0 1px 2px rgba(255,255,255,1),
    0 8px 32px rgba(255,165,69,0.12),
    0 2px 8px rgba(0,0,0,0.08);
}

/* Dark Mode Glass */
.dark .glass-card {
  background: linear-gradient(
    135deg,
    rgba(28,31,36,0.95) 0%,
    rgba(28,31,36,0.88) 50%,
    rgba(28,31,36,0.92) 100%
  );
  border: 1.5px solid rgba(255,165,69,0.25);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.08),
    0 12px 40px rgba(255,165,69,0.15),
    0 4px 12px rgba(0,0,0,0.4);
}
```

### Multi-Tenant Architecture
- **Tenant Isolation:** Row-Level Security at database level
- **Tenant Context:** Set via Better Auth session
- **Tenant Switching:** Organization switcher component
- **Data Filtering:** Automatic via RLS policies

### Type-Safe APIs
```typescript
// tRPC router with tenant context
export const dashboardRouter = createTRPCRouter({
  list: protectedProcedure
    .query(async ({ ctx }) => {
      // Tenant context automatically set from Better Auth session
      const tenantId = ctx.session.activeOrganizationId
      
      return ctx.prisma.dashboard.findMany({
        where: { tenantId }
      })
    })
})
```

### Authentication Flow
```typescript
// Better Auth integration with Solinth
import { auth } from "@/lib/auth/auth"

// Server-side session check
const session = await auth.api.getSession({ headers })

if (session?.activeOrganizationId) {
  // Set tenant context for RLS
  await setTenantContext(session.activeOrganizationId)
}

// Client-side hooks
const { data: session } = authClient.useSession()
const { data: organization } = authClient.useActiveOrganization()
```

## Package Versions (Key Dependencies)

```json
{
  "dependencies": {
    "next": "15.5.4",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "@prisma/client": "6.17.0",
    "@supabase/supabase-js": "^2.39.0",
    "@trpc/server": "^11.0.0",
    "@trpc/client": "^11.0.0",
    "@trpc/react-query": "^11.0.0",
    "@tanstack/react-query": "^5.0.0",
    "better-auth": "^1.3.0",
    "framer-motion": "^11.0.0",
    "@radix-ui/react-*": "^1.0.0",
    "tailwindcss": "^4.0.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "prisma": "6.17.0",
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}
```

## Architecture Decisions

### Why Better Auth over Supabase Auth?
1. **Custom UI Control:** 100% control over authentication UI with Solinth branding
2. **TypeScript Native:** Full type safety across auth system
3. **Prisma Integration:** Works directly with our existing database
4. **Multi-Tenant Built-In:** Organization plugin perfect for Solinth
5. **No Vendor Lock-In:** We own all auth code
6. **Framework Agnostic:** Works with any framework

### Why tRPC over REST?
1. **Type Safety:** End-to-end type safety
2. **No Code Generation:** Types inferred automatically
3. **Better DX:** Autocomplete and inline docs
4. **Smaller Bundle:** No runtime validation needed

### Why Prisma over Raw SQL?
1. **Type Safety:** Generated types for all queries
2. **Migration Management:** Version-controlled schema changes
3. **Query Builder:** Intuitive API for complex queries
4. **Multi-Database:** Easy to switch databases if needed

### Why Supabase over Self-Hosted PostgreSQL?
1. **Managed Service:** No database maintenance
2. **Built-in RLS:** Row-Level Security out of the box
3. **Real-time:** WebSocket subscriptions included
4. **Backups:** Automatic daily backups
5. **Scaling:** Easy to scale with usage

## Performance Targets

- **Page Load:** < 3 seconds (p95)
- **API Response:** < 200ms (p95)
- **Dashboard Render:** < 1 second with 50 widgets
- **Auth Flow:** < 500ms for login/signup
- **Database Query:** < 100ms (p95)
- **Real-time Updates:** < 100ms latency

## Security Standards

- **Authentication:** Better Auth with JWT + HTTP-only cookies
- **Authorization:** Role-based access control (RBAC)
- **Data Isolation:** Row-Level Security (RLS)
- **API Security:** tRPC with session validation
- **HTTPS Only:** All connections encrypted
- **CSRF Protection:** Built into Better Auth
- **Rate Limiting:** API endpoint protection
- **Audit Logging:** All user actions tracked

## Scalability Considerations

- **Database:** Supabase scales automatically
- **API:** Vercel serverless functions auto-scale
- **Caching:** Redis for session and query caching
- **CDN:** Cloudflare R2 for static assets
- **Background Jobs:** Inngest handles job queuing
- **Real-time:** Supabase Realtime scales with connections