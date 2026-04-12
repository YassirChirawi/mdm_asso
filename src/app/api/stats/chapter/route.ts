import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { chapterId } = await req.json();

    if (!chapterId) {
      return NextResponse.json({ error: "Chapter ID is required" }, { status: 400 });
    }

    // Incrémentation du compteur de vues (Upsert)
    const stats = await prisma.chapterStats.upsert({
      where: { chapterId },
      update: { views: { increment: 1 } },
      create: { chapterId, views: 1 },
    });

    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error("Chapter Stats Error:", error);
    return NextResponse.json({ error: "Failed to update stats" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const stats = await prisma.chapterStats.findMany({
      orderBy: { views: "desc" },
    });
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Chapter Stats Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
