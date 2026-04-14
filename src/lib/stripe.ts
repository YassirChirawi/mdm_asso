import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export const stripe = (stripeSecretKey && stripeSecretKey.trim() !== "")
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2026-03-25.dahlia",
    })
  : null as any;

if (!stripe && process.env.NODE_ENV === "production") {
  console.warn("⚠️ Stripe Secret Key is missing. Payments will be disabled.");
}
