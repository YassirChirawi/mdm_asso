import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { chapters } from "@/data/chapters";

export const dynamic = "force-dynamic";

const CHAPTER_IDS = new Set(chapters.map((c) => c.id.toString()));

/** Échanges publiés sous un chapitre. Seuls les messages approuvés sortent. */
export async function GET(req: Request) {
  const chapterId = new URL(req.url).searchParams.get("chapterId");

  if (!chapterId || !CHAPTER_IDS.has(chapterId)) {
    return NextResponse.json({ error: "Chapitre inconnu." }, { status: 400 });
  }

  try {
    const comments = await prisma.chapterComment.findMany({
      where: { chapterId, approved: true },
      orderBy: { createdAt: "asc" },
      // L'e-mail sert uniquement à recontacter l'auteur : il ne sort jamais.
      select: { id: true, prenom: true, message: true, createdAt: true },
    });
    return NextResponse.json(comments);
  } catch (error) {
    console.error("Lecture des commentaires impossible :", error);
    return NextResponse.json({ error: "Lecture impossible." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const chapterId = String(body.chapterId ?? "");
    const prenom = String(body.prenom ?? "").trim();
    const message = String(body.message ?? "").trim();
    const email = String(body.email ?? "").trim();

    // Champ piège : invisible pour un humain, rempli par les robots.
    if (String(body.website ?? "").trim()) {
      return NextResponse.json({ success: true });
    }

    if (!CHAPTER_IDS.has(chapterId)) {
      return NextResponse.json({ error: "Chapitre inconnu." }, { status: 400 });
    }
    if (prenom.length < 2 || prenom.length > 40) {
      return NextResponse.json(
        { error: "Indique un prénom entre 2 et 40 caractères." },
        { status: 400 }
      );
    }
    if (message.length < 5 || message.length > 2000) {
      return NextResponse.json(
        { error: "Ton message doit faire entre 5 et 2000 caractères." },
        { status: 400 }
      );
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return NextResponse.json({ error: "Adresse e-mail invalide." }, { status: 400 });
    }

    await prisma.chapterComment.create({
      data: { chapterId, prenom, message, email: email || null },
    });

    return NextResponse.json({
      success: true,
      pending: true,
      info: "Merci ! Ton message part en relecture avant d'être publié.",
    });
  } catch (error) {
    console.error("Enregistrement du commentaire impossible :", error);
    return NextResponse.json({ error: "Envoi impossible." }, { status: 500 });
  }
}
