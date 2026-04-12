import { notFound } from "next/navigation";
import { chapters } from "@/data/chapters";
import fs from "fs/promises";
import path from "path";
import AnimatedContent from "./AnimatedContent";

export async function generateStaticParams() {
  return chapters.map((chapter) => ({
    id: chapter.id.toString(),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const chapterId = resolvedParams.id;
  const chapter = chapters.find((c) => c.id.toString() === chapterId);
  if (!chapter) return { title: "Chapitre introuvable" };
  return {
    title: `${chapter.title} | Guide Marocains en France`,
    description: chapter.desc,
  };
}

export default async function ChapterPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const chapterId = resolvedParams.id;
  const chapterIndex = chapters.findIndex((c) => c.id.toString() === chapterId);

  if (chapterIndex === -1) {
    notFound();
  }

  const chapter = chapters[chapterIndex];
  const prevChapter = chapterIndex > 0 ? chapters[chapterIndex - 1] : null;
  const nextChapter = chapterIndex < chapters.length - 1 ? chapters[chapterIndex + 1] : null;

  let content = "";
  try {
    const filePath = path.join(process.cwd(), "src", "data", "content", `${chapterId}.json`);
    const fileData = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(fileData);
    if (parsed.content) content = parsed.content;
  } catch (e) {
    console.error("Erreur lecture chapitre:", e);
    content = "Contenu en cours de finalisation...";
  }

  const paragraphs = content.split("\n\n").filter(Boolean);

  return (
    <AnimatedContent 
      chapterId={chapter.id.toString()}
      title={chapter.title}
      desc={chapter.desc}
      paragraphs={paragraphs}
      prevChapter={prevChapter}
      nextChapter={nextChapter}
    />
  );
}
