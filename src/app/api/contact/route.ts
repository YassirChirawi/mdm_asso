import { resend } from "@/lib/resend";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    // Sauvegarde dans la base de données Prisma
    await prisma.message.create({
      data: {
        name,
        email,
        subject: subject || "Sans objet",
        message,
      },
    });

    if (!process.env.RESEND_API_KEY) {
      console.warn("⚠️ Clé d'API Resend manquante (RESEND_API_KEY). Email simulé.");
      return NextResponse.json({ success: true, warning: "Sauvegardé en DB (Email simulé)" });
    }

    const data = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: "yasschirawi37@gmail.com",
      subject: `Nouveau message - ${subject || "Sans objet"}`,
      replyTo: email,
      html: `
        <h3>Message depuis le site Marocains en France</h3>
        <p><strong>Nom:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Contact API Error:", error);
    return NextResponse.json({ error: "Erreur lors de l'envoi ou de la sauvegarde" }, { status: 500 });
  }
}
