import type { Metadata } from "next";
import fs from "fs/promises";
import path from "path";
import { chapters } from "@/data/chapters";
import { ChapterContent, readingTime } from "@/data/blocks";
import GuideIndexClient from "./GuideIndexClient";

export const metadata: Metadata = {
  title: "Le Guide Complet – 16 chapitres pour étudier en France",
  description:
    "Le guide gratuit de l'Association Marocains en France : visa, logement, CAF, préfecture, santé, argent, emploi et double culture. 16 chapitres écrits par des étudiants marocains.",
  alternates: { canonical: "https://www.marocainsenfrance.fr/guide" },
};

export default async function GuidePage() {
  const summaries = await Promise.all(
    chapters.map(async (chapter) => {
      try {
        const filePath = path.join(
          process.cwd(), "src", "data", "content", `${chapter.id}.json`
        );
        const parsed = JSON.parse(await fs.readFile(filePath, "utf-8")) as ChapterContent;
        return { ...chapter, minutes: readingTime(parsed.blocks ?? []) };
      } catch {
        return { ...chapter, minutes: 0 };
      }
    })
  );

  return <GuideIndexClient chapters={summaries} />;
}
