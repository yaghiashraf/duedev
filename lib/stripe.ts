import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

export const PRICES = {
  SELLER: process.env.STRIPE_SELLER_PRICE_ID!,
  BUYER: process.env.STRIPE_BUYER_PRICE_ID!,
  MONITOR: process.env.STRIPE_MONITOR_PRICE_ID!,
};

export const PRICE_AMOUNTS = {
  SELLER: 4900,  // $49
  BUYER: 7900,   // $79
  MONITOR: 2900, // $29/mo
};
