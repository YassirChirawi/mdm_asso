import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const dynamic = 'force-dynamic';


export async function GET() {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe non configuré" }, { status: 500 });
  }

  try {
    const charges = await stripe.charges.list({
      limit: 100,
    });

    const donations = charges.data
      .filter((charge: any) => charge.paid && !charge.refunded)
      .map((charge: any) => ({
        id: charge.id,
        amount: charge.amount,
        currency: charge.currency,
        name: charge.billing_details?.name || 'Anonyme',
        email: charge.billing_details?.email || 'N/A',
        createdAt: new Date(charge.created * 1000).toISOString(),
      }));

    return NextResponse.json(donations);
  } catch (error: any) {
    console.error("Erreur récupération dons:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
