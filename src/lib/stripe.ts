import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2026-03-25.dahlia",
});
