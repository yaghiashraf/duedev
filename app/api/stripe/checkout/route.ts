import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getConfiguredPriceId, getStripe, PRICE_AMOUNTS, type CheckoutAuditType } from "@/lib/stripe";
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

  const validTypes: CheckoutAuditType[] = ["SELLER", "BUYER", "MONITOR"];
  if (!validTypes.includes(auditType)) {
    return NextResponse.json({ error: "Invalid audit type" }, { status: 400 });
  }
  const selectedAuditType = auditType as CheckoutAuditType;

  const missingConfig: string[] = checkoutRequirements.filter((key) => !process.env[key]);
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
      auditType: selectedAuditType,
      status: "PENDING",
    },
  });

  const isSubscription = selectedAuditType === "MONITOR";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!.replace(/\/$/, "");
  const configuredPriceId = getConfiguredPriceId(selectedAuditType);

  const productName =
    selectedAuditType === "SELLER" ? "DueDev Seller Report" :
    selectedAuditType === "BUYER" ? "DueDev Buyer Due Diligence" :
    "DueDev Continuous Monitor";

  const lineItems = configuredPriceId
    ? [{ price: configuredPriceId, quantity: 1 }]
    : [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: productName,
              description:
                selectedAuditType === "SELLER"
                  ? `Technical audit of ${repoName} with shareable code-quality proof`
                  : `Acquisition risk assessment for ${repoName} with findings and price guidance`,
              metadata: {
                product: "duedev",
                auditType: selectedAuditType,
              },
            },
            unit_amount: PRICE_AMOUNTS[selectedAuditType],
            ...(isSubscription ? { recurring: { interval: "month" as const } } : {}),
          },
          quantity: 1,
        },
      ];

  let checkoutSession;
  try {
    checkoutSession = await getStripe().checkout.sessions.create({
      mode: isSubscription ? "subscription" : "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${appUrl}/audit/${audit.id}?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/dashboard?canceled=1`,
      metadata: {
        auditId: audit.id,
        userId: session.user.id,
        auditType: selectedAuditType,
        repoOwner,
        repoName,
      },
      client_reference_id: audit.id,
      customer_email: session.user.email ?? undefined,
      allow_promotion_codes: true,
    });
  } catch (error) {
    await prisma.audit.update({
      where: { id: audit.id },
      data: {
        status: "FAILED",
        reportData: {
          error: error instanceof Error ? error.message : "Stripe checkout creation failed",
        },
      },
    });

    return NextResponse.json(
      { error: "Stripe checkout could not be created. Check Stripe keys and price configuration." },
      { status: 502 }
    );
  }

  return NextResponse.json({ url: checkoutSession.url });
}
