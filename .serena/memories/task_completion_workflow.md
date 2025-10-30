# Solinth Suite - Task Completion Workflow

## MANDATORY Documentation Reading (Before ANY Task)
1. **BUILT.MD** - Current project status and progress
2. **PLAN.md** - Overall project roadmap and tasks (6-month timeline)
3. **PRD.md** - Product requirements (WHAT to build - 8 suites)
4. **SDD.md** - System design (HOW to build - tRPC + Supabase)
5. Any feature-specific documentation

## Research Phase (MANDATORY)
Always perform Grep MCP research before implementing:
```typescript
// Search for Solinth-specific patterns
grep_search({
  query: "tRPC multi-tenant business intelligence",
  language: "typescript",
  path: "*.ts"
});

// Find Supabase RLS patterns
grep_search({
  query: "Supabase row level security multi tenant",
  language: "sql"
});
```

## Quality Assurance Checklist
Before completing any task, verify:
- [ ] Multi-tenant isolation (all queries filter by tenantId)
- [ ] Solinth brand colors applied correctly
- [ ] Glassmorphic design patterns used
- [ ] TypeScript strict mode compliance
- [ ] Performance optimizations applied
- [ ] Security best practices followed

## Git Commit Format
```bash
type(scope): detailed description [Task-X.X] [Doc: PLAN/PRD/SDD lines] [Grep: search-terms]

## Documentation Read:
- BUILT.MD: Lines X-Y (current status)
- PLAN.MD: Lines A-B (task requirements)
- PRD.MD: Lines C-D (feature specs)
- SDD.MD: Lines E-F (implementation)

## Implementation:
- Created: [what was built]
- Applied: [Solinth patterns used]
- Ensured: [multi-tenant security]
- Tested: [testing performed]
```

## BUILT.MD Update (MANDATORY)
After every task, update BUILT.MD with:
- Task completion status
- Documentation consumed
- Research performed
- Implementation details
- Decisions made
- Testing performed
- Next steps

## Testing Requirements
- Multi-tenant isolation verified
- Solinth brand consistency checked
- Performance with business data tested
- TypeScript compilation successful
- ESLint passes without errors

## Deployment Checklist
- [ ] All tests pass
- [ ] Type checking passes
- [ ] Linting passes
- [ ] Build succeeds
- [ ] Environment variables configured
- [ ] Database migrations applied