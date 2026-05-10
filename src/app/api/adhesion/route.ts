import { resend } from "@/lib/resend";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { prenom, nom, email, ville, message } = await req.json();

    if (!prenom || !nom || !email) {
      return NextResponse.json({ error: "Champs obligatoires manquants." }, { status: 400 });
    }

    // Persist to DB
    await prisma.adhesion.create({
      data: { prenom, nom, email, ville: ville || null, message: message || null },
    });

    const adminHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#C1272D;padding:24px 32px;border-radius:12px 12px 0 0;">
          <h2 style="color:white;margin:0;">❤️ Nouvelle demande d'adhésion – 15€</h2>
          <p style="color:#fca5a5;margin:4px 0 0;font-size:13px;">Association MDM – marocainsenfrance.fr</p>
        </div>
        <div style="background:#f8fafc;padding:28px 32px;border:1px solid #e5e7eb;border-radius:0 0 12px 12px;">
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:7px 0;color:#6b7280;width:130px;">Prénom & Nom</td><td style="font-weight:600;color:#111;">${prenom} ${nom}</td></tr>
            <tr><td style="padding:7px 0;color:#6b7280;">Email</td><td><a href="mailto:${email}" style="color:#C1272D;font-weight:600;">${email}</a></td></tr>
            <tr><td style="padding:7px 0;color:#6b7280;">Ville</td><td style="color:#111;">${ville || "—"}</td></tr>
          </table>
          ${message ? `<div style="margin-top:14px;padding:14px;background:white;border-radius:8px;border:1px solid #e5e7eb;"><p style="color:#6b7280;font-size:11px;margin:0 0 6px;text-transform:uppercase;">Message</p><p style="color:#111;white-space:pre-wrap;margin:0;">${message}</p></div>` : ""}
          <div style="margin-top:16px;padding:14px;background:#f0fdf4;border-radius:8px;border:1px solid #dcfce7;">
            <p style="color:#166534;font-size:13px;margin:0;font-weight:600;">✅ Le lien de paiement a été proposé à l'utilisateur.</p>
          </div>
        </div>
      </div>`;

    const userHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#334155;">
        <div style="background:#C1272D;padding:32px;border-radius:12px 12px 0 0;text-align:center;">
          <h1 style="color:white;margin:0;font-size:24px;">Bienvenue chez MDM ! ❤️</h1>
        </div>
        <div style="padding:32px;border:1px solid #e2e8f0;border-radius:0 0 12px 12px;background:white;line-height:1.6;">
          <p>Bonjour <strong>${prenom}</strong>,</p>
          <p>Merci pour ta demande d'adhésion à l'association <strong>Marocains en France (MDM)</strong> ! Nous sommes ravis de te compter parmi nous.</p>
          <p>Pour finaliser ton adhésion annuelle de <strong>15€</strong> et accéder à tous tes avantages (événements, réseau privé, offres partenaires), tu peux cliquer sur le lien sécurisé ci-dessous :</p>
          
          <div style="margin:32px 0;text-align:center;">
            <a href="https://buy.stripe.com/eVqdR22cP1ne9T7gaFb3q01" 
               style="background:#C1272D;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">
               💳 Payer mon adhésion (15€)
            </a>
          </div>

          <p style="font-size:14px;color:#64748b;">Si tu as déjà effectué le paiement sur le site, ignore simplement cet email. Ton adhésion sera validée manuellement par notre équipe sous 24h à 48h.</p>
          <hr style="border:0;border-top:1px solid #e2e8f0;margin:24px 0;" />
          <p style="margin:0;font-size:13px;">L'équipe MDM<br/><a href="https://marocainsenfrance.fr" style="color:#C1272D;">marocainsenfrance.fr</a></p>
        </div>
      </div>`;

    if (process.env.RESEND_API_KEY && resend) {
      // Send to Admin
      await resend.emails.send({
        from: "Adhésion MDM <onboarding@resend.dev>",
        to: "yasschirawi37@gmail.com",
        subject: `❤️ Adhésion – ${prenom} ${nom}`,
        replyTo: email,
        html: adminHtml,
      });

      // Send to User
      await resend.emails.send({
        from: "Association MDM <onboarding@resend.dev>",
        to: email,
        subject: `Bienvenue chez MDM, ${prenom} ! ❤️ (Adhésion)`,
        html: userHtml,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Adhesion API Error:", error);
    return NextResponse.json({ error: "Erreur lors de l'envoi." }, { status: 500 });
  }
}
