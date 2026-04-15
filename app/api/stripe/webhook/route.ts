import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { runAudit } from "@/lib/audit-engine";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { auditId, userId } = session.metadata ?? {};

    if (!auditId || !userId) {
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    await prisma.audit.update({
      where: { id: auditId },
      data: {
        stripePaymentId: session.payment_intent as string ?? session.subscription as string,
        paidAt: new Date(),
      },
    });

    // Fetch the user's GitHub token to run the audit
    const account = await prisma.account.findFirst({
      where: { userId, provider: "github" },
    });

    if (account?.access_token) {
      // Run audit async (fire and forget — results stored to DB)
      runAudit(auditId, account.access_token).catch(console.error);
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    await prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: { status: "canceled" },
    });
  }

  return NextResponse.json({ received: true });
}
