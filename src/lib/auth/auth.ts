import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { organization, twoFactor } from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";
import { stripe } from "@better-auth/stripe";
import Stripe from "stripe";
import { prisma } from "@/lib/db";
import { ac, owner, admin, member, viewer } from "./permissions";
import { Resend } from "resend";

// Initialize Stripe client
const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY!);

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
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  plugins: [
    // Organization plugin for multi-tenant support
    organization({
      ac,
      roles: { owner, admin, member, viewer },
      allowUserToCreateOrganization: true,
      organizationLimit: 5,
      membershipLimit: 100,
      requireEmailVerificationOnInvitation: true,

      async sendInvitationEmail(data: {
        id: string;
        email: string;
        organization: { name: string };
        inviter: { user: { name: string } };
      }) {
        const inviteLink = `${process.env.BETTER_AUTH_URL}/accept-invitation/${data.id}`;

        await resend.emails.send({
          from: "Solinth <noreply@solinth.com>",
          to: data.email,
          subject: `Join ${data.organization.name} on Solinth`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #FFA845 0%, #FFD67C 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">
                  Welcome to Solinth
                </h1>
              </div>
              
              <div style="background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                <p style="font-size: 16px; color: #2E3440; margin-bottom: 24px;">
                  ${data.inviter.user.name} has invited you to join <strong>${data.organization.name}</strong> on Solinth.
                </p>
                
                <p style="font-size: 14px; color: #6B7280; margin-bottom: 32px;">
                  Solinth is the all-in-one business management platform with 8 integrated suites to help your team succeed.
                </p>
                
                <div style="text-align: center; margin: 32px 0;">
                  <a href="${inviteLink}" 
                     style="background: linear-gradient(135deg, #FFA845 0%, #FFD67C 100%); 
                            color: white; 
                            text-decoration: none; 
                            padding: 12px 32px; 
                            border-radius: 8px; 
                            font-weight: 600; 
                            display: inline-block;
                            box-shadow: 0 4px 12px rgba(255, 168, 69, 0.3);">
                    Accept Invitation
                  </a>
                </div>
                
                <p style="font-size: 12px; color: #9CA3AF; text-align: center; margin-top: 32px;">
                  If you didn't expect this invitation, you can safely ignore this email.
                </p>
              </div>
            </div>
          `,
        });
      },

      onInvitationAccepted: async (data: {
        acceptedUser: { email: string };
        organization: { name: string };
      }) => {
        // Log invitation acceptance, send welcome email, etc.
        console.error(
          `User ${data.acceptedUser.email} joined ${data.organization.name}`
        );
      },
    }),

    // Two-factor authentication
    twoFactor(),

    // Passkey (WebAuthn) authentication
    passkey({
      rpID: process.env.NODE_ENV === "production" ? "solinth.com" : "localhost",
      rpName: "Solinth Suite",
      origin: process.env.BETTER_AUTH_URL!,
      authenticatorSelection: {
        authenticatorAttachment: "platform", // Prefer platform authenticators (Face ID, Touch ID, Windows Hello)
        residentKey: "preferred",
        userVerification: "preferred",
      },
    }),

    // Stripe integration for subscriptions
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: true,

      subscription: {
        enabled: true,
        plans: [
          {
            name: "free",
            priceId: "", // Will be set when we have actual Stripe products
            limits: {
              dashboards: 3,
              metrics: 1000,
              integrations: 1,
              reports: 5,
            },
          },
          {
            name: "pro",
            priceId: "", // Will be set when we have actual Stripe products
            limits: {
              dashboards: 15,
              metrics: 10000,
              integrations: 5,
              reports: 50,
            },
            freeTrial: {
              days: 14,
            },
          },
          {
            name: "business",
            priceId: "", // Will be set when we have actual Stripe products
            limits: {
              dashboards: -1, // unlimited
              metrics: 100000,
              integrations: 15,
              reports: 500,
            },
          },
        ],

        authorizeReference: async ({
          user,
          referenceId,
        }: {
          user: { id: string };
          referenceId: string;
        }) => {
          // Check if user has permission to manage subscriptions for this organization
          const member = await prisma.authMember.findFirst({
            where: {
              userId: user.id,
              organizationId: referenceId,
            },
          });

          return member?.role === "owner" || member?.role === "admin";
        },

        onSubscriptionComplete: async ({
          subscription,
          plan,
        }: {
          subscription: { id: string };
          plan: { name: string };
        }) => {
          console.error(
            `Subscription created: ${subscription.id} for plan: ${plan.name}`
          );
        },

        onSubscriptionCancel: async ({
          subscription,
        }: {
          subscription: { id: string };
        }) => {
          console.error(`Subscription cancelled: ${subscription.id}`);
        },
      },

      onCustomerCreate: async ({ stripeCustomer, user }) => {
        console.error(
          `Stripe customer ${stripeCustomer.id} created for user ${user.id}`
        );
      },
    }),
  ],

  // Email configuration using Resend
  emailVerification: {
    sendVerificationEmail: async ({
      user,
      url,
    }: {
      user: { email: string };
      url: string;
    }) => {
      await resend.emails.send({
        from: "Solinth <noreply@solinth.com>",
        to: user.email,
        subject: "Verify your Solinth account",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #FFA845 0%, #FFD67C 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">
                Verify Your Email
              </h1>
            </div>
            
            <div style="background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
              <p style="font-size: 16px; color: #2E3440; margin-bottom: 24px;">
                Welcome to Solinth! Please verify your email address to get started.
              </p>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="${url}" 
                   style="background: linear-gradient(135deg, #FFA845 0%, #FFD67C 100%); 
                          color: white; 
                          text-decoration: none; 
                          padding: 12px 32px; 
                          border-radius: 8px; 
                          font-weight: 600; 
                          display: inline-block;
                          box-shadow: 0 4px 12px rgba(255, 168, 69, 0.3);">
                  Verify Email
                </a>
              </div>
              
              <p style="font-size: 12px; color: #9CA3AF; text-align: center; margin-top: 32px;">
                If you didn't create this account, you can safely ignore this email.
              </p>
            </div>
          </div>
        `,
      });
    },
  },

  // Password reset configuration
  forgotPassword: {
    sendResetEmail: async ({
      user,
      url,
    }: {
      user: { email: string };
      url: string;
    }) => {
      await resend.emails.send({
        from: "Solinth <noreply@solinth.com>",
        to: user.email,
        subject: "Reset your Solinth password",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #FFA845 0%, #FFD67C 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">
                Reset Password
              </h1>
            </div>
            
            <div style="background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
              <p style="font-size: 16px; color: #2E3440; margin-bottom: 24px;">
                Click the button below to reset your password for your Solinth account.
              </p>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="${url}" 
                   style="background: linear-gradient(135deg, #FFA845 0%, #FFD67C 100%); 
                          color: white; 
                          text-decoration: none; 
                          padding: 12px 32px; 
                          border-radius: 8px; 
                          font-weight: 600; 
                          display: inline-block;
                          box-shadow: 0 4px 12px rgba(255, 168, 69, 0.3);">
                  Reset Password
                </a>
              </div>
              
              <p style="font-size: 12px; color: #9CA3AF; text-align: center; margin-top: 32px;">
                If you didn't request this password reset, you can safely ignore this email.
              </p>
            </div>
          </div>
        `,
      });
    },
  },

  trustedOrigins: [process.env.BETTER_AUTH_URL!],
  secret: process.env.BETTER_AUTH_SECRET!,
});
