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

    const html = `
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
          <div style="margin-top:16px;padding:14px;background:#fef2f2;border-radius:8px;border:1px solid #fecaca;">
            <p style="color:#991b1b;font-size:13px;margin:0;font-weight:600;">⚠️ Action : envoyer le lien de paiement Stripe (15€) à <a href="mailto:${email}">${email}</a></p>
          </div>
        </div>
      </div>`;

    if (process.env.RESEND_API_KEY && resend) {
      await resend.emails.send({
        from: "Adhésion MDM <onboarding@resend.dev>",
        to: "yasschirawi37@gmail.com",
        subject: `❤️ Adhésion – ${prenom} ${nom}`,
        replyTo: email,
        html,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Adhesion API Error:", error);
    return NextResponse.json({ error: "Erreur lors de l'envoi." }, { status: 500 });
  }
}
