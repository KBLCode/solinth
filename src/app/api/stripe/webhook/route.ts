import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${errorMessage}`);
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
        await handleSubscriptionCreated(
          event.data.object as Stripe.Subscription
        );
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription
        );
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        );
        break;

      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(
          event.data.object as Stripe.Invoice
        );
        break;

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.error(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`Error processing webhook: ${errorMessage}`);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const organizationId = subscription.metadata.organizationId;

  if (!organizationId) {
    console.error("No organizationId in subscription metadata");
    return;
  }

  // Update organization with subscription details
  await prisma.authOrganization.update({
    where: { id: organizationId },
    data: {
      metadata: {
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0]?.price.id,
        subscriptionStatus: subscription.status,
      },
    },
  });

  console.error(`Subscription created for organization: ${organizationId}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const organizationId = subscription.metadata.organizationId;

  if (!organizationId) {
    console.error("No organizationId in subscription metadata");
    return;
  }

  // Update organization subscription status
  await prisma.authOrganization.update({
    where: { id: organizationId },
    data: {
      metadata: {
        stripeSubscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
        stripePriceId: subscription.items.data[0]?.price.id,
      },
    },
  });

  // If subscription is canceled or past_due, handle accordingly
  if (
    subscription.status === "canceled" ||
    subscription.status === "past_due"
  ) {
    console.error(
      `Subscription ${subscription.status} for organization: ${organizationId}`
    );
    // TODO: Send notification email to organization owner
    // TODO: Restrict access to paid features
  }

  console.error(`Subscription updated for organization: ${organizationId}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const organizationId = subscription.metadata.organizationId;

  if (!organizationId) {
    console.error("No organizationId in subscription metadata");
    return;
  }

  // Update organization to free plan
  await prisma.authOrganization.update({
    where: { id: organizationId },
    data: {
      metadata: {
        stripeSubscriptionId: null,
        subscriptionStatus: "canceled",
        stripePriceId: null,
      },
    },
  });

  console.error(`Subscription deleted for organization: ${organizationId}`);
  // TODO: Send notification email
  // TODO: Downgrade to free plan limits
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId =
    typeof invoice.subscription === "string"
      ? invoice.subscription
      : invoice.subscription?.id;

  if (!subscriptionId || typeof subscriptionId !== "string") {
    return;
  }

  // Fetch subscription to get organization ID
  const stripeSubscription =
    await stripe.subscriptions.retrieve(subscriptionId);
  const organizationId = stripeSubscription.metadata.organizationId;

  if (!organizationId) {
    return;
  }

  console.error(`Payment succeeded for organization: ${organizationId}`);
  // TODO: Send receipt email
  // TODO: Log payment in audit trail
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId =
    typeof invoice.subscription === "string"
      ? invoice.subscription
      : invoice.subscription?.id;

  if (!subscriptionId || typeof subscriptionId !== "string") {
    return;
  }

  // Fetch subscription to get organization ID
  const stripeSubscription =
    await stripe.subscriptions.retrieve(subscriptionId);
  const organizationId = stripeSubscription.metadata.organizationId;

  if (!organizationId) {
    return;
  }

  console.error(`Payment failed for organization: ${organizationId}`);
  // TODO: Send payment failed email
  // TODO: Notify organization owner
}
