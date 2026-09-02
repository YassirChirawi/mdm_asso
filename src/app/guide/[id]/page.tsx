import { notFound } from "next/navigation";
import { chapters } from "@/data/chapters";
import fs from "fs/promises";
import path from "path";
import AnimatedContent from "./AnimatedContent";
import { Block, ChapterContent, readingTime } from "@/data/blocks";

export async function generateStaticParams() {
  return chapters.map((chapter) => ({
    id: chapter.id.toString(),
  }));
}

async function loadChapter(chapterId: string): Promise<Block[]> {
  const filePath = path.join(process.cwd(), "src", "data", "content", `${chapterId}.json`);
  const parsed = JSON.parse(await fs.readFile(filePath, "utf-8")) as ChapterContent;
  return Array.isArray(parsed.blocks) ? parsed.blocks : [];
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const chapter = chapters.find((c) => c.id.toString() === id);
  if (!chapter) return { title: "Chapitre introuvable" };
  return {
    title: `${chapter.title} | Guide Marocains en France`,
    description: chapter.desc,
    alternates: {
      canonical: `https://www.marocainsenfrance.fr/guide/${id}`,
    },
  };
}

export default async function ChapterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const chapterIndex = chapters.findIndex((c) => c.id.toString() === id);

  if (chapterIndex === -1) {
    notFound();
  }

  const chapter = chapters[chapterIndex];
  const prevChapter = chapterIndex > 0 ? chapters[chapterIndex - 1] : null;
  const nextChapter = chapterIndex < chapters.length - 1 ? chapters[chapterIndex + 1] : null;

  let blocks: Block[] = [];
  try {
    blocks = await loadChapter(id);
  } catch (error) {
    // Un chapitre illisible ne doit pas renvoyer une 500 : on sert la page avec
    // sa navigation, le contenu manquant se voit immédiatement en préproduction.
    console.error(`Chapitre ${id} illisible :`, error);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: chapter.title,
    description: chapter.desc,
    inLanguage: "fr-FR",
    isPartOf: {
      "@type": "Book",
      name: "Guide de l'étudiant marocain en France",
    },
    timeRequired: `PT${readingTime(blocks)}M`,
    author: {
      "@type": "Organization",
      name: "Association Marocains en France",
    },
    publisher: {
      "@type": "Organization",
      name: "Association Marocains en France",
      logo: {
        "@type": "ImageObject",
        url: "https://www.marocainsenfrance.fr/logo.png",
      },
    },
    datePublished: "2025-07-01",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AnimatedContent
        chapterId={chapter.id.toString()}
        title={chapter.title}
        desc={chapter.desc}
        blocks={blocks}
        prevChapter={prevChapter}
        nextChapter={nextChapter}
      />
    </>
  );
}
