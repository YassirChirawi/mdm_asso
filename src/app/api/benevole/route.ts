import { resend } from "@/lib/resend";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { prenom, nom, email, ville, disponibilite, roles, motivation } = await req.json();

    if (!prenom || !nom || !email || !motivation) {
      return NextResponse.json({ error: "Champs obligatoires manquants." }, { status: 400 });
    }

    const rolesStr = Array.isArray(roles) ? roles.join(", ") : (roles || "");

    // Persist to DB
    await prisma.benevole.create({
      data: { prenom, nom, email, ville: ville || null, disponibilite: disponibilite || null, roles: rolesStr || null, motivation },
    });

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#1D9E75;padding:24px 32px;border-radius:12px 12px 0 0;">
          <h2 style="color:white;margin:0;">🙋 Nouvelle candidature bénévole</h2>
          <p style="color:#a7f3d0;margin:4px 0 0;font-size:13px;">Association MDM – marocainsenfrance.fr</p>
        </div>
        <div style="background:#f8fafc;padding:28px 32px;border:1px solid #e5e7eb;border-radius:0 0 12px 12px;">
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:7px 0;color:#6b7280;width:130px;">Prénom & Nom</td><td style="font-weight:600;color:#111;">${prenom} ${nom}</td></tr>
            <tr><td style="padding:7px 0;color:#6b7280;">Email</td><td><a href="mailto:${email}" style="color:#1D9E75;font-weight:600;">${email}</a></td></tr>
            <tr><td style="padding:7px 0;color:#6b7280;">Ville</td><td style="color:#111;">${ville || "—"}</td></tr>
            <tr><td style="padding:7px 0;color:#6b7280;">Disponibilité</td><td style="color:#111;">${disponibilite || "—"}</td></tr>
            <tr><td style="padding:7px 0;color:#6b7280;vertical-align:top;">Rôle(s)</td><td style="color:#111;">${rolesStr || "—"}</td></tr>
          </table>
          <div style="margin-top:16px;padding:14px;background:white;border-radius:8px;border:1px solid #e5e7eb;">
            <p style="color:#6b7280;font-size:11px;margin:0 0 6px;text-transform:uppercase;letter-spacing:.05em;">Motivation</p>
            <p style="color:#111;white-space:pre-wrap;margin:0;line-height:1.6;">${motivation}</p>
          </div>
        </div>
      </div>`;

    if (process.env.RESEND_API_KEY && resend) {
      await resend.emails.send({
        from: "Candidature Bénévole <onboarding@resend.dev>",
        to: "contact@marocainsenfrance.fr",
        subject: `🙋 Bénévole – ${prenom} ${nom}`,
        replyTo: email,
        html,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Benevole API Error:", error);
    return NextResponse.json({ error: "Erreur lors de l'envoi." }, { status: 500 });
  }
}
