-- Solinth Suite Row-Level Security (RLS) Policies
-- Multi-tenant data isolation - corrected column names

-- ============================================================================
-- ENABLE RLS ON ALL TENANT-SCOPED TABLES
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_apis ENABLE ROW LEVEL SECURITY;
ALTER TABLE widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_token_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- TENANT ISOLATION POLICIES
-- ============================================================================

-- Users: Can only see users from their tenant
CREATE POLICY tenant_isolation_users ON users
FOR ALL
USING ("tenantId" = current_setting('app.tenant_id')::text);

-- Dashboards: Can only see dashboards from their tenant
CREATE POLICY tenant_isolation_dashboards ON dashboards
FOR ALL
USING ("tenantId" = current_setting('app.tenant_id')::text);

-- Integrations: Can only see integrations from their tenant
CREATE POLICY tenant_isolation_integrations ON integrations
FOR ALL
USING ("tenantId" = current_setting('app.tenant_id')::text);

-- Metrics: Can only see metrics from their tenant
CREATE POLICY tenant_isolation_metrics ON metrics
FOR ALL
USING ("tenantId" = current_setting('app.tenant_id')::text);

-- Custom APIs: Can only see custom APIs from their tenant
CREATE POLICY tenant_isolation_custom_apis ON custom_apis
FOR ALL
USING ("tenantId" = current_setting('app.tenant_id')::text);

-- Reports: Can only see reports from their tenant
CREATE POLICY tenant_isolation_reports ON reports
FOR ALL
USING ("tenantId" = current_setting('app.tenant_id')::text);

-- Workflows: Can only see workflows from their tenant
CREATE POLICY tenant_isolation_workflows ON workflows
FOR ALL
USING ("tenantId" = current_setting('app.tenant_id')::text);

-- Brand Assets: Can only see brand assets from their tenant
CREATE POLICY tenant_isolation_brand_assets ON brand_assets
FOR ALL
USING ("tenantId" = current_setting('app.tenant_id')::text);

-- AI Token Usage: Can only see AI usage from their tenant
CREATE POLICY tenant_isolation_ai_token_usage ON ai_token_usage
FOR ALL
USING ("tenantId" = current_setting('app.tenant_id')::text);

-- ============================================================================
-- USER-SCOPED POLICIES (for tables that belong to specific users)
-- ============================================================================

-- Widgets: Can only see widgets from dashboards they have access to
CREATE POLICY user_access_widgets ON widgets
FOR ALL
USING (
  "dashboardId" IN (
    SELECT id FROM dashboards 
    WHERE "tenantId" = current_setting('app.tenant_id')::text
  )
);

-- Comments: Can only see comments from their tenant's entities
CREATE POLICY tenant_isolation_comments ON comments
FOR ALL
USING (
  "userId" IN (
    SELECT id FROM users 
    WHERE "tenantId" = current_setting('app.tenant_id')::text
  )
);

-- Audit Logs: Can only see audit logs from their tenant's users
CREATE POLICY tenant_isolation_audit_logs ON audit_logs
FOR ALL
USING (
  "userId" IN (
    SELECT id FROM users 
    WHERE "tenantId" = current_setting('app.tenant_id')::text
  )
);

-- ============================================================================
-- TENANT CONTEXT HELPER FUNCTIONS
-- ============================================================================

-- Function to get current tenant ID
CREATE OR REPLACE FUNCTION get_current_tenant_id()
RETURNS TEXT AS $$
BEGIN
  RETURN current_setting('app.tenant_id', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate tenant access
CREATE OR REPLACE FUNCTION validate_tenant_access(check_tenant_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN check_tenant_id = current_setting('app.tenant_id', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;