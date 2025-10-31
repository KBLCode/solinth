import { createAuthClient } from "better-auth/client";
import { organizationClient } from "better-auth/client/plugins";
import { passkeyClient } from "better-auth/client/plugins";
import { stripeClient } from "@better-auth/stripe/client";
import { ac, owner, admin, member, viewer } from "./permissions";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",

  plugins: [
    // Organization plugin for multi-tenant support
    organizationClient({
      ac,
      roles: { owner, admin, member, viewer },
    }),

    // Passkey (WebAuthn) plugin for passwordless auth
    passkeyClient(),

    // Stripe plugin for subscription management
    stripeClient({
      subscription: true,
    }),
  ],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  useActiveOrganization,
  organization,
} = authClient;
