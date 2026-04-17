import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getStripe, PRICE_AMOUNTS } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const checkoutRequirements = ["STRIPE_SECRET_KEY", "NEXT_PUBLIC_APP_URL"];

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { repoOwner, repoName, auditType } = await req.json();

  if (!repoOwner || !repoName || !auditType) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const validTypes = ["SELLER", "BUYER", "MONITOR"];
  if (!validTypes.includes(auditType)) {
    return NextResponse.json({ error: "Invalid audit type" }, { status: 400 });
  }

  const missingConfig: string[] = checkoutRequirements.filter((key) => !process.env[key]);
  if (auditType === "MONITOR" && !process.env.STRIPE_MONITOR_PRICE_ID) {
    missingConfig.push("STRIPE_MONITOR_PRICE_ID");
  }

  if (missingConfig.length > 0) {
    return NextResponse.json(
      { error: `Checkout is not configured. Missing: ${missingConfig.join(", ")}` },
      { status: 503 }
    );
  }

  const repoUrl = `https://github.com/${repoOwner}/${repoName}`;

  // Create pending audit record
  const audit = await prisma.audit.create({
    data: {
      userId: session.user.id,
      repoOwner,
      repoName,
      repoUrl,
      auditType,
      status: "PENDING",
    },
  });

  const isSubscription = auditType === "MONITOR";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  const lineItems = isSubscription
    ? undefined
    : [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: auditType === "SELLER" ? "Seller Audit Report" : "Buyer Due Diligence Report",
              description:
                auditType === "SELLER"
                  ? `AI-powered technical audit of ${repoName} — shareable proof of code quality`
                  : `Full acquisition risk assessment for ${repoName} with Risk Score and price adjustment recommendation`,
            },
            unit_amount: PRICE_AMOUNTS[auditType as "SELLER" | "BUYER"],
          },
          quantity: 1,
        },
      ];

  const checkoutSession = await getStripe().checkout.sessions.create({
    mode: isSubscription ? "subscription" : "payment",
    payment_method_types: ["card"],
    ...(isSubscription
      ? {
          line_items: [
            {
              price: process.env.STRIPE_MONITOR_PRICE_ID!,
              quantity: 1,
            },
          ],
        }
      : { line_items: lineItems }),
    success_url: `${appUrl}/audit/${audit.id}?success=1`,
    cancel_url: `${appUrl}/dashboard?canceled=1`,
    metadata: {
      auditId: audit.id,
      userId: session.user.id,
      auditType,
    },
    customer_email: session.user.email ?? undefined,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
