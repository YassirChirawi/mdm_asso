import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function GET() {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe non configuré" }, { status: 500 });
  }

  try {
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      expand: ['data.payment_intent']
    });

    const donations = sessions.data
      .filter((session: any) => session.payment_status === 'paid')
      .map((session: any) => ({
        id: session.id,
        amount: session.amount_total,
        currency: session.currency,
        name: session.customer_details?.name || 'Anonyme',
        email: session.customer_details?.email || 'N/A',
        createdAt: new Date(session.created * 1000).toISOString(),
      }));

    return NextResponse.json(donations);
  } catch (error: any) {
    console.error("Erreur récupération dons:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
