import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { sendDonationEmail } from "@/lib/email";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature") || "";

  let event: Stripe.Event;

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.warn("STRIPE_WEBHOOK_SECRET missing. Skipping signature validation.");
      event = JSON.parse(body);
    } else {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    }
  } catch (err: any) {
    console.error(`⚠️ Webhook error: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log(`Donation successful! Amount: ${session.amount_total}`);

      // Récupérer les champs personnalisés
      const prenom = session.custom_fields?.find(f => f.key === 'prenom')?.text?.value || "";
      const nom = session.custom_fields?.find(f => f.key === 'nom')?.text?.value || "";

      try {
        await prisma.donation.create({
          data: {
            stripeId: session.id,
            amount: session.amount_total || 0,
            currency: session.currency || "eur",
            name: session.customer_details?.name || `${prenom} ${nom}`.trim() || "Anonyme",
            firstName: prenom,
            lastName: nom,
            email: session.customer_details?.email || "N/A",
          },
        });

        // Envoyer l'email de remerciement
        if (session.customer_details?.email) {
          await sendDonationEmail({
            prenom: prenom || "Ami(e)",
            nom: nom || "",
            email: session.customer_details.email,
            montant: (session.amount_total || 0) / 100,
            dateDon: new Date().toLocaleDateString('fr-FR')
          });
        }
      } catch (dbErr) {
        console.error("Failed to process successful donation:", dbErr);
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

