import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** Modération : tous les échanges, approuvés ou non. Route protégée par le middleware. */
export async function GET() {
  try {
    const comments = await prisma.chapterComment.findMany({
      orderBy: [{ approved: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(comments);
  } catch (error) {
    console.error("Lecture des commentaires impossible :", error);
    return NextResponse.json({ error: "Lecture impossible." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, approved } = await req.json();
    if (!id) return NextResponse.json({ error: "Identifiant requis." }, { status: 400 });

    const comment = await prisma.chapterComment.update({
      where: { id },
      data: { approved: Boolean(approved) },
    });
    return NextResponse.json(comment);
  } catch (error) {
    console.error("Modération impossible :", error);
    return NextResponse.json({ error: "Modération impossible." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Identifiant requis." }, { status: 400 });

    await prisma.chapterComment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Suppression impossible :", error);
    return NextResponse.json({ error: "Suppression impossible." }, { status: 500 });
  }
}
