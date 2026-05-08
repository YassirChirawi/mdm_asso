import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const adhesions = await prisma.adhesion.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(adhesions);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, statut } = await req.json();
    if (!id || !statut) return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    const updated = await prisma.adhesion.update({ where: { id }, data: { statut } });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Erreur mise à jour" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    await prisma.adhesion.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erreur suppression" }, { status: 500 });
  }
}
