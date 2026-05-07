import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Fetch from Database
    const dbDonations = await prisma.donation.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // 2. If DB is empty, or if we want to ensure we have the latest from Stripe, 
    // we can also fetch from Stripe. For now, let's merge them or just return DB.
    // If we want to be fully reliable, we should sync Stripe to DB regularly.
    
    // Fallback to Stripe if DB is empty to show existing history
    if (dbDonations.length === 0 && stripe) {
      try {
        const charges = await stripe.charges.list({ limit: 100 });
        const stripeDonations = charges.data
          .filter((charge: any) => charge.paid && !charge.refunded)
          .map((charge: any) => ({
            id: charge.id,
            amount: charge.amount,
            currency: charge.currency,
            name: charge.billing_details?.name || 'Anonyme',
            email: charge.billing_details?.email || 'N/A',
            createdAt: new Date(charge.created * 1000).toISOString(),
          }));
        return NextResponse.json(stripeDonations);
      } catch (stripeErr) {
        console.error("Stripe fetch error:", stripeErr);
      }
    }

    return NextResponse.json(dbDonations);
  } catch (error: any) {
    console.error("Erreur récupération dons:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

