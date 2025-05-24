import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/utils/stripe";

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 500 }
    );
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe signature" },
      { status: 400 }
    );
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log("Webhook event received:", event.type);

    // Handle different event types here
    switch (event.type) {
      case "checkout.session.completed":
        // Handle successful payment
        break;
      case "customer.subscription.created":
        // Handle subscription creation
        break;
      case "customer.subscription.updated":
        // Handle subscription updates
        break;
      case "customer.subscription.deleted":
        // Handle subscription cancellation
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook error:", err.message);
    return NextResponse.json(
      { error: `Webhook error: ${err.message}` },
      { status: 400 }
    );
  }
}
