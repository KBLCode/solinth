import { createAccessControl } from "better-auth/plugins/access";

// Define the statement object with resources and actions
const statement = {
  // Solinth-specific resources
  dashboard: ["create", "read", "update", "delete"],
  metric: ["create", "read", "update", "delete"],
  integration: ["create", "read", "update", "delete"],
  report: ["create", "read", "update", "delete"],
  widget: ["create", "read", "update", "delete"],
  workflow: ["create", "read", "update", "delete"],

  // Organization resources (Better Auth built-in)
  organization: ["update", "delete"],
  member: ["create", "update", "delete"],
  invitation: ["create", "cancel"],

  // Team resources (for teams feature)
  team: ["create", "read", "update", "delete"],

  // Access control for dynamic roles
  ac: ["create", "read", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

// Define Solinth roles with specific permissions
export const owner = ac.newRole({
  // Full access to everything
  dashboard: ["create", "read", "update", "delete"],
  metric: ["create", "read", "update", "delete"],
  integration: ["create", "read", "update", "delete"],
  report: ["create", "read", "update", "delete"],
  widget: ["create", "read", "update", "delete"],
  workflow: ["create", "read", "update", "delete"],
  organization: ["update", "delete"],
  member: ["create", "update", "delete"],
  invitation: ["create", "cancel"],
  team: ["create", "read", "update", "delete"],
  ac: ["create", "read", "update", "delete"],
});

export const admin = ac.newRole({
  // Almost full access, but cannot delete organization
  dashboard: ["create", "read", "update", "delete"],
  metric: ["create", "read", "update", "delete"],
  integration: ["create", "read", "update"],
  report: ["create", "read", "update", "delete"],
  widget: ["create", "read", "update", "delete"],
  workflow: ["create", "read", "update"],
  organization: ["update"],
  member: ["create", "update", "delete"],
  invitation: ["create", "cancel"],
  team: ["create", "read", "update", "delete"],
  ac: ["create", "read", "update", "delete"],
});

export const member = ac.newRole({
  // Limited access - can read most things, create some
  dashboard: ["create", "read", "update"],
  metric: ["create", "read"],
  integration: ["read"],
  report: ["create", "read"],
  widget: ["create", "read", "update"],
  workflow: ["read"],
  organization: [],
  member: [],
  invitation: [],
  team: ["read"],
  ac: ["read"],
});

export const viewer = ac.newRole({
  // Read-only access
  dashboard: ["read"],
  metric: ["read"],
  integration: ["read"],
  report: ["read"],
  widget: ["read"],
  workflow: ["read"],
  organization: [],
  member: [],
  invitation: [],
  team: ["read"],
  ac: ["read"],
});
