-- Fix: Enable RLS on tenants table and create secure policies
-- This addresses the security vulnerability where tenants table was exposed

-- 1. Enable RLS on tenants table
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- 2. Create policies for tenant access
-- Only allow users to see their own tenant (based on JWT claim or user context)

-- Policy for SELECT: Users can only see their own tenant
CREATE POLICY "Users can view their own tenant" ON public.tenants
  FOR SELECT TO authenticated
  USING (
    id = current_setting('app.tenant_id', true)::text
    OR id IN (
      SELECT "tenantId" FROM public.users 
      WHERE id = auth.uid()::text
    )
  );

-- Policy for INSERT: Only service role can create tenants (signup process)
CREATE POLICY "Service role can create tenants" ON public.tenants
  FOR INSERT TO service_role
  WITH CHECK (true);

-- Policy for UPDATE: Users can update their own tenant (owners/admins only)
CREATE POLICY "Tenant owners can update their tenant" ON public.tenants
  FOR UPDATE TO authenticated
  USING (
    id IN (
      SELECT "tenantId" FROM public.users 
      WHERE id = auth.uid()::text 
      AND role IN ('OWNER', 'ADMIN')
    )
  )
  WITH CHECK (
    id IN (
      SELECT "tenantId" FROM public.users 
      WHERE id = auth.uid()::text 
      AND role IN ('OWNER', 'ADMIN')
    )
  );

-- Policy for DELETE: Only service role can delete tenants (admin operations)
CREATE POLICY "Service role can delete tenants" ON public.tenants
  FOR DELETE TO service_role
  USING (true);

-- 3. Create performance index for policy lookups
CREATE INDEX IF NOT EXISTS idx_tenants_rls_lookup ON public.tenants (id);

-- 4. Add comments for documentation
COMMENT ON POLICY "Users can view their own tenant" ON public.tenants IS 
'Allows users to view only the tenant they belong to, preventing cross-tenant data access';

COMMENT ON POLICY "Tenant owners can update their tenant" ON public.tenants IS 
'Allows only tenant owners and admins to update their tenant information';

-- 5. Verify RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'tenants' AND schemaname = 'public';