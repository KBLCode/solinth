"use client";

/**
 * Tenant Context Provider
 *
 * Provides tenant (organization) context throughout the application.
 * Integrates with Better Auth organizations for multi-tenancy.
 *
 * PRD Reference: Lines 701-750 (Multi-tenancy requirement)
 * SDD Reference: Lines 180-320 (Database Schema)
 * PLAN Reference: Lines 128-147 (Task 1.4)
 */

import React, { createContext, useContext, useEffect, useState } from "react";

// Tenant type matching Better Auth Organization
export interface Tenant {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  plan: "FREE" | "PRO" | "BUSINESS" | "ENTERPRISE";
  stripeCustomerId?: string;
  role: "owner" | "admin" | "member" | "viewer";
}

interface TenantContextType {
  tenant: Tenant | null;
  tenants: Tenant[];
  isLoading: boolean;
  switchTenant: (tenantId: string) => Promise<void>;
  refreshTenants: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status
  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/session", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        return !!data.session;
      }

      return false;
    } catch (error) {
      console.error("Error checking auth:", error);
      return false;
    }
  };

  // Fetch user's organizations (tenants)
  const fetchTenants = async () => {
    const authenticated = await checkAuth();

    if (!authenticated) {
      setTenants([]);
      setTenant(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Fetch organizations from Better Auth
      const response = await fetch("/api/auth/organization/list", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch organizations");
      }

      const data = await response.json();
      const organizations = data.organizations || [];

      // Map Better Auth organizations to Solinth tenants
      const mappedTenants: Tenant[] = organizations.map(
        (org: {
          id: string;
          name: string;
          slug: string;
          logo?: string;
          metadata?: { plan?: string; stripeCustomerId?: string };
          role?: string;
        }) => ({
          id: org.id,
          name: org.name,
          slug: org.slug,
          logo: org.logo,
          plan: org.metadata?.plan || "FREE",
          stripeCustomerId: org.metadata?.stripeCustomerId,
          role: org.role || "member",
        })
      );

      setTenants(mappedTenants);

      // Get active organization from session
      const sessionResponse = await fetch("/api/auth/session", {
        credentials: "include",
      });

      if (sessionResponse.ok) {
        const sessionData = await sessionResponse.json();
        const activeOrgId = sessionData.session?.activeOrganizationId;
        const activeTenant = mappedTenants.find((t) => t.id === activeOrgId);

        if (activeTenant) {
          setTenant(activeTenant);
        } else if (mappedTenants.length > 0) {
          // Auto-select first tenant if none active
          await switchTenant(mappedTenants[0].id);
        } else {
          setTenant(null);
        }
      }
    } catch (error) {
      console.error("Error fetching tenants:", error);
      setTenants([]);
      setTenant(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Switch active tenant
  const switchTenant = async (tenantId: string) => {
    try {
      setIsLoading(true);

      // Call Better Auth API to set active organization
      const response = await fetch("/api/auth/organization/set-active", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ organizationId: tenantId }),
      });

      if (!response.ok) {
        throw new Error("Failed to switch organization");
      }

      // Update local state
      const selectedTenant = tenants.find((t) => t.id === tenantId);
      if (selectedTenant) {
        setTenant(selectedTenant);
      }

      // Refresh page to update all tenant-scoped data
      window.location.reload();
    } catch (error) {
      console.error("Error switching tenant:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch tenants on mount
  useEffect(() => {
    fetchTenants();
  }, []);

  const value: TenantContextType = {
    tenant,
    tenants,
    isLoading,
    switchTenant,
    refreshTenants: fetchTenants,
  };

  return (
    <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
  );
}

// Hook to use tenant context
export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}

// Hook to require tenant (throws if no tenant)
export function useRequireTenant() {
  const { tenant, isLoading } = useTenant();

  if (!isLoading && !tenant) {
    throw new Error(
      "No active tenant. User must select or create an organization."
    );
  }

  return { tenant: tenant!, isLoading };
}
