import { resend } from "@/lib/resend";
import { NextResponse } from "next/server";

const ROLES = [
  "Tuteur / Mentor",
  "Communication & Réseaux sociaux",
  "Correspondant Local",
  "Partenariats",
  "Animation Événements",
  "Créatif / Tech",
  "Autre",
];

export async function POST(req: Request) {
  try {
    const { prenom, nom, email, ville, disponibilite, roles, motivation } = await req.json();

    if (!prenom || !nom || !email || !motivation) {
      return NextResponse.json({ error: "Champs obligatoires manquants." }, { status: 400 });
    }

    const selectedRoles = Array.isArray(roles) && roles.length > 0
      ? roles.join(", ")
      : "Non précisé";

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1D9E75; padding: 24px 32px; border-radius: 12px 12px 0 0;">
          <h2 style="color: white; margin: 0; font-size: 20px;">🙋 Nouvelle candidature bénévole</h2>
          <p style="color: #a7f3d0; margin: 6px 0 0; font-size: 13px;">Association Marocains en France – MDM</p>
        </div>
        <div style="background: #f8fafc; padding: 32px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px; width: 140px;">Prénom & Nom</td>
                <td style="padding: 8px 0; font-weight: 600; color: #111;">${prenom} ${nom}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Email</td>
                <td style="padding: 8px 0; font-weight: 600; color: #111;">
                  <a href="mailto:${email}" style="color: #1D9E75;">${email}</a>
                </td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Ville / Région</td>
                <td style="padding: 8px 0; color: #111;">${ville || "Non précisée"}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px;">Disponibilité</td>
                <td style="padding: 8px 0; color: #111;">${disponibilite || "Non précisée"}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280; font-size: 13px; vertical-align: top;">Rôle(s) souhaité(s)</td>
                <td style="padding: 8px 0; color: #111;">${selectedRoles}</td></tr>
          </table>
          <div style="margin-top: 20px; padding: 16px; background: white; border-radius: 8px; border: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 12px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.05em;">Motivation</p>
            <p style="color: #111; white-space: pre-wrap; margin: 0; line-height: 1.6;">${motivation}</p>
          </div>
          <p style="margin-top: 24px; font-size: 12px; color: #9ca3af; text-align: center;">
            Réponds directement à cet email pour contacter le/la candidat(e).
          </p>
        </div>
      </div>
    `;

    if (!process.env.RESEND_API_KEY || !resend) {
      console.warn("⚠️ RESEND_API_KEY manquant – email simulé.");
      return NextResponse.json({ success: true, warning: "Email simulé (clé manquante)" });
    }

    await resend.emails.send({
      from: "Formulaire Bénévole <onboarding@resend.dev>",
      to: "yasschirawi37@gmail.com",
      subject: `🙋 Candidature bénévole – ${prenom} ${nom}`,
      replyTo: email,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Benevole API Error:", error);
    return NextResponse.json({ error: "Erreur lors de l'envoi." }, { status: 500 });
  }
}
