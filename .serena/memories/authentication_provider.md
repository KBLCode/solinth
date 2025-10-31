# Solinth Authentication Provider - Better Auth

## Decision: Better Auth (https://www.better-auth.com/)

**Date:** 2025-10-31
**Status:** ✅ FULLY CONFIGURED - Backend Complete, UI Components Needed

## Implementation Status

### ✅ Completed (Backend Configuration)

1. **Better Auth Server Configuration** (`src/lib/auth/auth.ts`)
   - Prisma adapter connected to Supabase PostgreSQL
   - Email/password authentication with verification
   - Social OAuth (GitHub, Google)
   - Two-factor authentication (TOTP)
   - Organization plugin for multi-tenancy
   - Stripe plugin with 3-tier pricing (Free, Pro, Business)
   - Resend integration for all emails

2. **Better Auth Client Configuration** (`src/lib/auth/auth-client.ts`)
   - React hooks for authentication
   - Organization client with RBAC
   - Stripe client for subscription management
   - Type-safe API calls

3. **Access Control System** (`src/lib/auth/permissions.ts`)
   - 4 Solinth roles: owner, admin, member, viewer
   - 11 resources with granular permissions
   - Dashboard, metric, integration, report, widget, workflow, organization, member, invitation, team, ac

4. **API Route Handler** (`src/app/api/auth/[...all]/route.ts`)
   - Next.js App Router integration
   - Handles all Better Auth endpoints

5. **Environment Configuration**
   - BETTER_AUTH_SECRET, BETTER_AUTH_URL
   - STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
   - RESEND_API_KEY
   - Social OAuth credentials (optional)

### 🔄 Next Steps (UI Components)

1. **Generate Better Auth Database Schema**

   ```bash
   npx @better-auth/cli generate
   npx prisma migrate dev --name add-better-auth-tables
   ```

2. **Create Auth UI Components** with Solinth glassmorphic branding:
   - Login/signup pages (Solar White, Radiant Amber gradient)
   - Email verification page
   - Password reset page
   - MFA setup component
   - Organization switcher dropdown

3. **Test Complete Auth Flow**
   - User signup → email verification → login
   - Organization creation → member invitation
   - Stripe subscription creation
   - Multi-tenant isolation

## Why Better Auth for Solinth

### ✅ Perfect Match for Solinth Requirements

1. **100% Custom UI Control**
   - Better Auth provides ZERO pre-built UI components
   - We build every pixel with Solinth glassmorphic branding
   - Solar White (#FFFFFF) and Radiant Amber (#FFA845) design system
   - Complete control over animations with Framer Motion

2. **TypeScript Native**
   - Full type safety across entire auth system
   - Perfect match for Solinth's TypeScript-first approach
   - Auto-generated types for all auth operations

3. **Works with Existing Prisma Database**
   - Direct integration with our Supabase + Prisma setup
   - No database migration needed
   - Uses our existing multi-tenant architecture

4. **Multi-Tenant Built-In**
   - Organization plugin provides complete multi-tenant support
   - Teams, members, invitations out of the box
   - Perfect for Solinth's 8-suite architecture

5. **Framework Agnostic**
   - Works perfectly with Next.js 15 App Router
   - Server and client components supported
   - API routes integration seamless

6. **No Vendor Lock-In**
   - We own all the auth code
   - No external dependencies for core functionality
   - Can customize everything

## Better Auth Features We're Using

### Core Authentication

```typescript
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { organization, twoFactor, stripe } from "better-auth/plugins";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [
    organization({
      ac,
      roles: { owner, admin, member, viewer },
      allowUserToCreateOrganization: true,
      organizationLimit: 5,
      membershipLimit: 100,
      sendInvitationEmail: async (data) => {
        // Resend integration for Solinth-branded emails
      },
    }),
    twoFactor(),
    stripe({
      stripeSecretKey: process.env.STRIPE_SECRET_KEY,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
      plans: [
        {
          id: "free",
          name: "Free",
          price: 0,
          limits: { dashboards: 5, metrics: 1000, integrations: 1 },
        },
        {
          id: "pro",
          name: "Pro",
          price: 4900, // $49/month
          trialDays: 14,
          limits: { dashboards: 50, metrics: 100000, integrations: 10 },
        },
        {
          id: "business",
          name: "Business",
          price: 19900, // $199/month
          limits: { dashboards: -1, metrics: -1, integrations: -1 },
        },
      ],
    }),
  ],
});
```

### Multi-Tenant Organization Plugin

- **Organizations:** Map to Solinth tenants
- **Members:** User roles (OWNER, ADMIN, MEMBER, VIEWER)
- **Invitations:** Email-based team invitations via Resend
- **Teams:** Optional sub-groups within organizations
- **Access Control:** Role-based permissions system

### Stripe Plugin Features

- **Automatic Customer Creation:** Stripe customer created on user signup
- **3-Tier Pricing:** Free, Pro (14-day trial), Business
- **Subscription Management:** Create, upgrade, cancel, restore subscriptions
- **Webhook Handling:** Secure webhook processing with signature verification
- **Organization Billing:** Subscriptions linked to organizations, not individual users
- **Plan Limits:** Configurable limits per plan (dashboards, metrics, integrations, reports)
- **Trial Periods:** 14-day free trial on Pro plan
- **Lifecycle Hooks:** onSubscriptionComplete, onSubscriptionCancel callbacks

### Resend Email Integration

- **Email Verification:** Solinth-branded verification email with gradient header
- **Organization Invitation:** Custom invitation email with organization details
- **Password Reset:** Secure password reset email with branded design
- **Welcome Email:** Sent when invitation is accepted (via onInvitationAccepted hook)

### Authentication Methods

1. **Email/Password** - Primary method with verification
2. **Social OAuth** - GitHub, Google
3. **Two-Factor Auth** - MFA plugin included
4. **Magic Links** - Optional passwordless (future)
5. **Passkeys** - WebAuthn support (future)

## Integration with Solinth Architecture

### Database Integration

Better Auth works directly with our existing Prisma schema:

**Existing Solinth Tables:**

- `tenants` → Maps to Better Auth `organization`
- `users` → Extends Better Auth `user` table
- `audit_logs` → Tracks all auth events

**New Better Auth Tables:**

- `user` - Core user authentication
- `session` - Active user sessions
- `account` - OAuth provider accounts
- `verification` - Email verification tokens
- `organization` - Multi-tenant organizations
- `member` - Organization membership
- `invitation` - Pending invitations

### Tenant Context Integration

```typescript
// Better Auth session includes organization context
const session = await auth.api.getSession({ headers });

// Automatically set tenant context for RLS
if (session?.activeOrganizationId) {
  await setTenantContext(session.activeOrganizationId);
}
```

### Custom Solinth-Branded UI Components

**Login Page** (`/app/(auth)/login/page.tsx`):

- Glassmorphic card with amber glow
- Solar White background
- Radiant Amber CTAs
- Smooth Framer Motion animations

**Signup Page** (`/app/(auth)/signup/page.tsx`):

- Multi-step registration flow
- Organization creation during signup
- Email verification
- Solinth brand consistency

**MFA Setup** (`/components/auth/mfa-setup.tsx`):

- QR code generation
- Backup codes display
- Glassmorphic design

**Organization Switcher** (`/components/auth/org-switcher.tsx`):

- Dropdown with active organization
- Switch between tenants
- Create new organization

## File Structure

```
src/
├── lib/
│   ├── auth/
│   │   ├── auth.ts              # ✅ Better Auth server config (COMPLETE)
│   │   ├── auth-client.ts       # ✅ Better Auth client (COMPLETE)
│   │   ├── permissions.ts       # ✅ Access control definitions (COMPLETE)
│   │   └── middleware.ts        # Route protection (TODO)
│   └── db.ts                    # Existing Prisma + Supabase
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...all]/route.ts # ✅ Better Auth API handler (COMPLETE)
│   ├── (auth)/
│   │   ├── login/page.tsx       # Custom login UI (TODO)
│   │   ├── signup/page.tsx      # Custom signup UI (TODO)
│   │   ├── verify-email/page.tsx # Email verification (TODO)
│   │   └── reset-password/page.tsx # Password reset (TODO)
│   └── (dashboard)/             # Protected routes (TODO)
└── components/
    └── auth/
        ├── login-form.tsx       # Glassmorphic login form (TODO)
        ├── signup-form.tsx      # Glassmorphic signup form (TODO)
        ├── mfa-setup.tsx        # MFA configuration (TODO)
        ├── org-switcher.tsx     # Organization switcher (TODO)
        └── protected-route.tsx  # Route protection wrapper (TODO)
```

## Environment Variables

```bash
# Better Auth
BETTER_AUTH_SECRET="generated-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# Stripe (via Better Auth plugin)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Resend (for emails)
RESEND_API_KEY="re_..."

# OAuth Providers (optional)
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

## Access Control System

Better Auth provides flexible role-based access control:

```typescript
import { createAccessControl } from "better-auth/plugins/access";

const statement = {
  // Solinth-specific resources
  dashboard: ["create", "read", "update", "delete"],
  metric: ["create", "read", "update", "delete"],
  integration: ["create", "read", "update", "delete"],
  report: ["create", "read", "update", "delete"],
  widget: ["create", "read", "update", "delete"],
  workflow: ["create", "read", "update", "delete"],
  // Organization resources (built-in)
  organization: ["update", "delete"],
  member: ["create", "update", "delete"],
  invitation: ["create", "cancel"],
  team: ["create", "update", "delete"],
  ac: ["create", "read", "update", "delete"],
} as const;

const ac = createAccessControl(statement);

// Define Solinth roles
const owner = ac.newRole({
  dashboard: ["create", "read", "update", "delete"],
  metric: ["create", "read", "update", "delete"],
  integration: ["create", "read", "update", "delete"],
  report: ["create", "read", "update", "delete"],
  widget: ["create", "read", "update", "delete"],
  workflow: ["create", "read", "update", "delete"],
  organization: ["update", "delete"],
  member: ["create", "update", "delete"],
  invitation: ["create", "cancel"],
  team: ["create", "update", "delete"],
  ac: ["create", "read", "update", "delete"],
});

const admin = ac.newRole({
  dashboard: ["create", "read", "update", "delete"],
  metric: ["create", "read", "update", "delete"],
  integration: ["create", "read", "update"],
  report: ["create", "read", "update", "delete"],
  widget: ["create", "read", "update", "delete"],
  workflow: ["create", "read", "update"],
  organization: ["update"],
  member: ["create", "update", "delete"],
  invitation: ["create", "cancel"],
  team: ["create", "update", "delete"],
  ac: ["read"],
});

const member = ac.newRole({
  dashboard: ["create", "read"],
  metric: ["read"],
  integration: ["read"],
  report: ["read"],
  widget: ["read"],
  workflow: ["read"],
  organization: [],
  member: [],
  invitation: [],
  team: [],
  ac: [],
});

const viewer = ac.newRole({
  dashboard: ["read"],
  metric: ["read"],
  integration: [],
  report: ["read"],
  widget: [],
  workflow: [],
  organization: [],
  member: [],
  invitation: [],
  team: [],
  ac: [],
});
```

## Migration from Supabase Auth (Not Needed)

We're NOT migrating from Supabase Auth - we're implementing Better Auth from scratch as our primary authentication system. Supabase will only be used for:

- Database (PostgreSQL with RLS)
- Real-time subscriptions
- Storage (future)

## Security Features

1. **Row-Level Security Integration**
   - Better Auth session includes `activeOrganizationId`
   - Automatically set PostgreSQL tenant context
   - All queries filtered by tenant

2. **JWT Tokens**
   - Secure session management
   - HTTP-only cookies
   - CSRF protection

3. **Two-Factor Authentication**
   - TOTP-based MFA
   - Backup codes
   - Recovery options

4. **Email Verification**
   - Required for new accounts
   - Configurable for invitations
   - Custom Solinth-branded emails via Resend

5. **Rate Limiting**
   - Login attempt limits
   - API endpoint protection
   - Configurable thresholds

## Performance Considerations

1. **Session Management**
   - Redis caching for sessions (future)
   - Optimized database queries
   - Connection pooling

2. **OAuth Providers**
   - Lazy loading of provider configs
   - Cached provider metadata
   - Efficient token refresh

3. **Database Queries**
   - Indexed auth tables
   - Optimized joins
   - Prepared statements

## Testing Strategy

1. **Unit Tests**
   - Auth utility functions
   - Permission checks
   - Token validation

2. **Integration Tests**
   - Login/signup flows
   - Organization creation
   - Member invitations
   - MFA setup

3. **E2E Tests**
   - Complete user journeys
   - Multi-tenant isolation
   - Role-based access

## Documentation References

- **Better Auth Docs:** https://www.better-auth.com/docs
- **Installation:** https://www.better-auth.com/docs/installation
- **Organization Plugin:** https://www.better-auth.com/docs/plugins/organization
- **Stripe Plugin:** https://www.better-auth.com/docs/plugins/stripe
- **Two-Factor Auth:** https://www.better-auth.com/docs/plugins/two-factor
- **Access Control:** https://www.better-auth.com/docs/plugins/organization#access-control

## Implementation Checklist

- [x] Install Better Auth package
- [x] Configure Better Auth server instance
- [x] Set up Prisma adapter
- [x] Configure Stripe plugin with 3-tier pricing
- [x] Configure Resend for email delivery
- [ ] Generate Better Auth database schema
- [ ] Run migrations
- [x] Create API route handler
- [x] Set up client instance
- [ ] Build custom login UI (Solinth-branded)
- [ ] Build custom signup UI (Solinth-branded)
- [ ] Implement MFA setup component
- [ ] Create organization switcher
- [ ] Add auth middleware
- [x] Configure access control
- [x] Set up email templates
- [ ] Test multi-tenant isolation
- [ ] Verify RLS integration
- [ ] Document auth flows

## Next Steps After Implementation

1. **Email Templates**
   - Design Solinth-branded email templates
   - Verification emails
   - Invitation emails
   - Password reset emails

2. **Advanced Features**
   - Passkey support (WebAuthn)
   - Magic link authentication
   - Social provider expansion
   - SSO for enterprise (future)

3. **Monitoring**
   - Auth event logging
   - Failed login tracking
   - Session analytics
   - Security alerts
