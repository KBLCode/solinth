# Solinth Suite - Code Style & Conventions

## TypeScript Configuration
- **Strict Mode:** Always enabled (`strict: true`)
- **No Unchecked Indexed Access:** Enabled for safety
- **Force Consistent Casing:** Enabled for cross-platform compatibility

## File Structure Conventions
```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
├── server/             # tRPC routers and server logic
├── styles/             # Global styles and CSS modules
└── types/              # TypeScript type definitions
```

## Naming Conventions
- **Files:** kebab-case (e.g., `user-profile.tsx`)
- **Components:** PascalCase (e.g., `UserProfile`)
- **Functions:** camelCase (e.g., `getUserProfile`)
- **Constants:** SCREAMING_SNAKE_CASE (e.g., `MAX_RETRY_ATTEMPTS`)
- **Types/Interfaces:** PascalCase (e.g., `UserProfile`, `ApiResponse`)

## Multi-Tenant Security Patterns
```typescript
// ❌ NEVER DO THIS
const data = await prisma.metric.findMany();

// ✅ ALWAYS DO THIS
const data = await prisma.metric.findMany({
  where: { tenantId: ctx.tenant.id }
});
```

## tRPC Router Pattern
```typescript
export const router = createTRPCRouter({
  list: protectedProcedure
    .query(async ({ ctx }) => {
      // 1. Always get tenant
      const tenantId = ctx.tenant.id;
      
      // 2. Check permissions
      if (!ctx.user.permissions.canView) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }
      
      // 3. Query with tenant filter
      return ctx.prisma.dashboard.findMany({
        where: { tenantId },
      });
    }),
});
```

## Component Patterns
```typescript
import { GlassCard } from '@/components/ui/glass-card';

export function MetricCard({ metric }: Props) {
  return (
    <GlassCard variant="interactive" glow>
      <h3>{metric.name}</h3>
      <p>{metric.value}</p>
    </GlassCard>
  );
}
```

## Import Organization
1. React and Next.js imports
2. Third-party library imports
3. Internal imports (components, lib, types)
4. Relative imports

## ESLint & Prettier
- Use Next.js ESLint config
- Prettier with Tailwind plugin for class sorting
- Automatic formatting on save recommended