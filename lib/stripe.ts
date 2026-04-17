import Stripe from "stripe";

// Lazy-initialize to avoid module-level construction during Next.js build phase
export function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-03-25.dahlia",
  });
}

export const PRICES = {
  SELLER: process.env.STRIPE_SELLER_PRICE_ID,
  BUYER: process.env.STRIPE_BUYER_PRICE_ID,
  MONITOR: process.env.STRIPE_MONITOR_PRICE_ID,
};

export const PRICE_AMOUNTS = {
  SELLER: 4900,  // $49
  BUYER: 7900,   // $79
  MONITOR: 2900, // $29/mo
};

export type CheckoutAuditType = keyof typeof PRICE_AMOUNTS;

export function getConfiguredPriceId(auditType: CheckoutAuditType) {
  return PRICES[auditType];
}
