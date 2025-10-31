# Solinth Authentication Provider - Better Auth

## Decision: Better Auth (https://www.better-auth.com/)

**Date:** 2025-10-31
**Status:** APPROVED - Full Integration Required

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

## Better Auth Features We'll Use

### Core Authentication
```typescript
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { organization, twoFactor } from "better-auth/plugins"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  emailAndPassword: {
    enabled: true
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  },
  plugins: [
    organization({
      allowUserToCreateOrganization: true,
      organizationLimit: 5,
      membershipLimit: 100,
      sendInvitationEmail: async (data) => {
        // Custom Solinth-branded email
      }
    }),
    twoFactor()
  ]
})
```

### Multi-Tenant Organization Plugin
- **Organizations:** Map to Solinth tenants
- **Members:** User roles (OWNER, ADMIN, MEMBER, VIEWER)
- **Invitations:** Email-based team invitations
- **Teams:** Optional sub-groups within organizations
- **Access Control:** Role-based permissions system

### Authentication Methods
1. **Email/Password** - Primary method
2. **Social OAuth** - GitHub, Google, Discord, etc.
3. **Two-Factor Auth** - MFA plugin included
4. **Magic Links** - Optional passwordless
5. **Passkeys** - WebAuthn support

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
const session = await auth.api.getSession({ headers })

// Automatically set tenant context for RLS
if (session?.activeOrganizationId) {
  await setTenantContext(session.activeOrganizationId)
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
│   │   ├── auth.ts              # Better Auth server config
│   │   ├── auth-client.ts       # Better Auth client
│   │   ├── permissions.ts       # Access control definitions
│   │   └── middleware.ts        # Auth middleware for routes
│   └── db.ts                    # Existing Prisma + Supabase
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...all]/route.ts # Better Auth API handler
│   ├── (auth)/
│   │   ├── login/page.tsx       # Custom login UI
│   │   ├── signup/page.tsx      # Custom signup UI
│   │   ├── verify-email/page.tsx
│   │   └── reset-password/page.tsx
│   └── (dashboard)/             # Protected routes
└── components/
    └── auth/
        ├── login-form.tsx       # Glassmorphic login form
        ├── signup-form.tsx      # Glassmorphic signup form
        ├── mfa-setup.tsx        # MFA configuration
        ├── org-switcher.tsx     # Organization switcher
        └── protected-route.tsx  # Route protection wrapper
```

## Environment Variables

```bash
# Better Auth
BETTER_AUTH_SECRET="generated-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# OAuth Providers (optional)
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Email (for invitations and verification)
SMTP_HOST="..."
SMTP_PORT="..."
SMTP_USER="..."
SMTP_PASSWORD="..."
```

## Access Control System

Better Auth provides flexible role-based access control:

```typescript
import { createAccessControl } from "better-auth/plugins/access"

const statement = {
  // Solinth-specific resources
  dashboard: ["create", "read", "update", "delete"],
  metric: ["create", "read", "update", "delete"],
  integration: ["create", "read", "update", "delete"],
  report: ["create", "read", "update", "delete"],
  // Organization resources (built-in)
  organization: ["update", "delete"],
  member: ["create", "update", "delete"],
  invitation: ["create", "cancel"]
} as const

const ac = createAccessControl(statement)

// Define Solinth roles
const owner = ac.newRole({
  dashboard: ["create", "read", "update", "delete"],
  metric: ["create", "read", "update", "delete"],
  integration: ["create", "read", "update", "delete"],
  report: ["create", "read", "update", "delete"],
  organization: ["update", "delete"],
  member: ["create", "update", "delete"],
  invitation: ["create", "cancel"]
})

const admin = ac.newRole({
  dashboard: ["create", "read", "update", "delete"],
  metric: ["create", "read", "update", "delete"],
  integration: ["create", "read", "update"],
  report: ["create", "read", "update", "delete"],
  organization: ["update"],
  member: ["create", "update", "delete"],
  invitation: ["create", "cancel"]
})

const member = ac.newRole({
  dashboard: ["read"],
  metric: ["read"],
  integration: ["read"],
  report: ["read"],
  organization: [],
  member: [],
  invitation: []
})

const viewer = ac.newRole({
  dashboard: ["read"],
  metric: ["read"],
  integration: [],
  report: ["read"],
  organization: [],
  member: [],
  invitation: []
})
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
   - Custom Solinth-branded emails

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
- **Two-Factor Auth:** https://www.better-auth.com/docs/plugins/two-factor
- **Access Control:** https://www.better-auth.com/docs/plugins/organization#access-control

## Implementation Checklist

- [ ] Install Better Auth package
- [ ] Configure Better Auth server instance
- [ ] Set up Prisma adapter
- [ ] Generate Better Auth database schema
- [ ] Run migrations
- [ ] Create API route handler
- [ ] Set up client instance
- [ ] Build custom login UI (Solinth-branded)
- [ ] Build custom signup UI (Solinth-branded)
- [ ] Implement MFA setup component
- [ ] Create organization switcher
- [ ] Add auth middleware
- [ ] Configure access control
- [ ] Set up email templates
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