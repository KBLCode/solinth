# Solinth Suite - Technology Stack

## Core Technologies
- **Frontend:** Next.js 15 with App Router
- **Backend:** tRPC for type-safe APIs
- **Database:** Supabase (PostgreSQL) with Row-Level Security (RLS)
- **Styling:** Tailwind CSS with custom Solinth design tokens
- **Animation:** Framer Motion
- **Language:** TypeScript (strict mode)
- **State Management:** TanStack React Query + tRPC
- **Authentication:** Supabase Auth (with MFA support)
- **AI Integration:** OpenRouter for model flexibility
- **Payments:** Stripe
- **Caching:** Upstash Redis
- **Background Jobs:** Inngest
- **Charts:** Recharts
- **UI Components:** Radix UI primitives

## Architecture Principles
- **Multi-tenant:** All data isolated by tenant with RLS policies
- **Type-safe:** End-to-end TypeScript with tRPC
- **Real-time:** Supabase real-time subscriptions
- **Security-first:** Backend-first approach for security
- **Performance:** Server components, static optimization
- **Scalable:** Designed for 1M+ users

## Development Tools
- **Package Manager:** pnpm (preferred) or npm
- **Linting:** ESLint with Next.js config
- **Formatting:** Prettier with Tailwind plugin
- **Testing:** Jest
- **Database ORM:** Prisma
- **Environment:** Docker Compose for local development