"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  metadata?: {
    plan?: string;
  };
}

interface OrgSwitcherProps {
  currentOrg?: Organization;
}

export function OrgSwitcher({ currentOrg }: OrgSwitcherProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Fetch user's organizations
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch("/api/auth/organization/list", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setOrganizations(data.organizations || []);
        }
      } catch (error) {
        console.error("Failed to fetch organizations:", error);
      }
    };

    if (isOpen) {
      fetchOrganizations();
    }
  }, [isOpen]);

  const handleSwitchOrganization = async (orgId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/organization/set-active", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ organizationId: orgId }),
      });

      if (response.ok) {
        // Refresh the page to load new organization context
        router.refresh();
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Failed to switch organization:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPlanBadgeColor = (plan?: string) => {
    switch (plan?.toLowerCase()) {
      case "business":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300";
      case "pro":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300";
      case "free":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800/20 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800/20 dark:text-gray-300";
    }
  };

  if (!currentOrg) {
    return (
      <div className="flex h-10 w-48 animate-pulse items-center gap-2 rounded-lg bg-dusk-slate/10 px-3 dark:bg-sky-mist/10">
        <div className="h-6 w-6 rounded-full bg-dusk-slate/20 dark:bg-sky-mist/20"></div>
        <div className="h-4 flex-1 rounded bg-dusk-slate/20 dark:bg-sky-mist/20"></div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-3 rounded-lg border border-dusk-slate/20 bg-white/50 px-3 py-2 transition-all hover:bg-white/80 dark:border-sky-mist/20 dark:bg-midnight-graphite/50 dark:hover:bg-midnight-graphite/80"
      >
        {/* Organization Logo/Avatar */}
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-radiant-amber to-amber-500 text-sm font-semibold text-white">
          {currentOrg.logo ? (
            <img
              src={currentOrg.logo}
              alt={currentOrg.name}
              className="h-full w-full rounded-lg object-cover"
            />
          ) : (
            currentOrg.name.charAt(0).toUpperCase()
          )}
        </div>

        {/* Organization Info */}
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-dusk-slate dark:text-solar-white">
              {currentOrg.name}
            </p>
            {currentOrg.metadata?.plan && (
              <span
                className={`rounded px-1.5 py-0.5 text-xs font-medium ${getPlanBadgeColor(
                  currentOrg.metadata.plan
                )}`}
              >
                {currentOrg.metadata.plan}
              </span>
            )}
          </div>
        </div>

        {/* Dropdown Icon */}
        <svg
          className={`h-4 w-4 flex-shrink-0 text-dusk-slate/50 transition-transform dark:text-sky-mist/50 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-lg border border-dusk-slate/20 bg-white shadow-xl dark:border-sky-mist/20 dark:bg-midnight-graphite">
          {/* Organizations List */}
          <div className="max-h-80 overflow-y-auto">
            {organizations.length > 0 ? (
              <div className="p-2">
                <p className="mb-2 px-2 text-xs font-medium text-dusk-slate/60 dark:text-sky-mist/60">
                  Your Organizations
                </p>
                {organizations.map((org) => (
                  <button
                    key={org.id}
                    onClick={() => handleSwitchOrganization(org.id)}
                    disabled={isLoading || org.id === currentOrg.id}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                      org.id === currentOrg.id
                        ? "bg-radiant-amber/10 text-radiant-amber"
                        : "text-dusk-slate hover:bg-dusk-slate/5 dark:text-solar-white dark:hover:bg-sky-mist/5"
                    } ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    {/* Organization Logo/Avatar */}
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-radiant-amber to-amber-500 text-sm font-semibold text-white">
                      {org.logo ? (
                        <img
                          src={org.logo}
                          alt={org.name}
                          className="h-full w-full rounded-lg object-cover"
                        />
                      ) : (
                        org.name.charAt(0).toUpperCase()
                      )}
                    </div>

                    {/* Organization Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{org.name}</p>
                        {org.metadata?.plan && (
                          <span
                            className={`rounded px-1.5 py-0.5 text-xs font-medium ${getPlanBadgeColor(
                              org.metadata.plan
                            )}`}
                          >
                            {org.metadata.plan}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-dusk-slate/60 dark:text-sky-mist/60">
                        {org.slug}
                      </p>
                    </div>

                    {/* Active Indicator */}
                    {org.id === currentOrg.id && (
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-radiant-amber"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-sm text-dusk-slate/60 dark:text-sky-mist/60">
                  No organizations found
                </p>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-dusk-slate/10 dark:border-sky-mist/10"></div>

          {/* Actions */}
          <div className="p-2">
            <button
              onClick={() => {
                router.push("/organizations/new");
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-radiant-amber transition-colors hover:bg-radiant-amber/10"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Create New Organization
            </button>

            <button
              onClick={() => {
                router.push("/organizations/settings");
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-dusk-slate transition-colors hover:bg-dusk-slate/5 dark:text-solar-white dark:hover:bg-sky-mist/5"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Organization Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
