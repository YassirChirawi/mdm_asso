import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    if (!amount || amount < 1) {
      return NextResponse.json({ error: "Montant invalide" }, { status: 400 });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      console.warn("⚠️ Clé secrète Stripe manquante. Redirection factice simulée.");
      return NextResponse.json({ url: "/dons?success=true" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Soutien à l'association Marocains en France",
              description: "Don libre pour l'association loi 1901.",
            },
            unit_amount: amount * 100, // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dons?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dons?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Donate API Error:", error);
    return NextResponse.json({ error: "Erreur de paiement" }, { status: 500 });
  }
}
