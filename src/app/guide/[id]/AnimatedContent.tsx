"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import {
  ArrowLeft, ArrowRight, BookOpen, ChevronDown, ListTree,
  Info, AlertTriangle, Lightbulb, CheckCircle2, Clock, ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import LetterModel from "@/components/LetterModel";
import { Block, CalloutVariant, buildToc, readingTime, DERNIERE_VERIFICATION } from "@/data/blocks";

interface Props {
  chapterId: string;
  title: string;
  desc: string;
  blocks: Block[];
  prevChapter: { id: string | number; title: string } | null;
  nextChapter: { id: string | number; title: string } | null;
}

const CALLOUTS: Record<CalloutVariant, { className: string; label: string; icon: React.ReactNode }> = {
  attention: {
    className: "border-brand-red bg-brand-red/5",
    label: "Attention",
    icon: <AlertTriangle className="w-5 h-5 text-brand-red" />,
  },
  conseil: {
    className: "border-brand-green bg-brand-green/5",
    label: "Conseil",
    icon: <Lightbulb className="w-5 h-5 text-brand-green" />,
  },
  info: {
    className: "border-purple-500 bg-purple-50",
    label: "Bon à savoir",
    icon: <CheckCircle2 className="w-5 h-5 text-purple-500" />,
  },
  note: {
    className: "border-blue-500 bg-blue-50",
    label: "Note",
    icon: <Info className="w-5 h-5 text-blue-500" />,
  },
};

/**
 * Le PDF source compose une partie de ses titres en capitales, sans accents
 * (convention typographique française). On les garde tels quels — les
 * repasser en bas de casse ferait apparaître « PREVOIR » comme une faute —
 * mais on les compose plus petits pour qu'ils ne crient pas dans la page.
 */
function isAllCaps(text: string) {
  const letters = text.replace(/[^A-Za-zÀ-ÿ]/g, "");
  if (letters.length < 4) return false;
  const upper = letters.replace(/[^A-ZÀ-Þ]/g, "").length;
  return upper / letters.length > 0.8;
}

export default function AnimatedContent({
  chapterId, title, desc, blocks, prevChapter, nextChapter,
}: Props) {
  const [isTocOpen, setIsTocOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const toc = useMemo(() => buildToc(blocks), [blocks]);
  const minutes = useMemo(() => readingTime(blocks), [blocks]);

  useEffect(() => {
    // Une vue par chapitre et par session : sans ce garde, un aller-retour
    // entre deux chapitres regonflait le compteur à chaque montage.
    const sessionKey = `mdm-chapter-view-${chapterId}`;
    try {
      if (sessionStorage.getItem(sessionKey)) return;
      sessionStorage.setItem(sessionKey, "1");
    } catch {
      /* navigation privée : on laisse passer */
    }
    fetch("/api/stats/chapter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chapterId }),
    }).catch(() => {
      /* les statistiques ne doivent jamais casser la lecture */
    });
  }, [chapterId]);

  const firstParagraphIndex = blocks.findIndex((b) => b.type === "p");

  const renderBlock = (block: Block, index: number) => {
    switch (block.type) {
      case "h2":
        return (
          <h2
            key={index}
            id={`section-${index}`}
            className={`font-heading font-black text-brand-dark mt-16 mb-6 border-l-4 md:border-l-8 border-brand-green pl-4 md:pl-6 py-2.5 bg-brand-green/5 rounded-r-xl scroll-mt-28 md:scroll-mt-32 break-words hyphens-auto ${
              isAllCaps(block.text)
                ? "text-lg sm:text-xl md:text-2xl tracking-wide leading-snug"
                : "text-2xl sm:text-3xl md:text-4xl leading-tight"
            }`}
          >
            {block.text}
          </h2>
        );

      case "h3":
        return (
          <h3
            key={index}
            id={`section-${index}`}
            className={`font-heading font-black text-brand-dark mt-12 mb-4 scroll-mt-28 md:scroll-mt-32 break-words hyphens-auto ${
              isAllCaps(block.text)
                ? "text-base sm:text-lg tracking-wide"
                : "text-xl sm:text-2xl"
            }`}
          >
            {block.text}
          </h3>
        );

      case "p":
        return (
          <p
            key={index}
            className={`mb-6 leading-relaxed md:leading-loose text-gray-600 text-base sm:text-lg md:text-xl ${
              index === firstParagraphIndex
                ? "first-letter:text-6xl md:first-letter:text-7xl first-letter:font-black first-letter:text-brand-green first-letter:mr-3 first-letter:float-left first-letter:leading-[0.9]"
                : ""
            }`}
          >
            {block.text}
          </p>
        );

      case "ul":
        return (
          <ul key={index} className="my-8 space-y-2.5">
            {block.items.map((item, itemIndex) => (
              <li
                key={itemIndex}
                className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-white border border-gray-100 shadow-sm"
              >
                <span className="bg-brand-green/10 text-brand-green rounded-full p-1 mt-0.5 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
                <span className="text-gray-700 leading-relaxed min-w-0 break-words">{item}</span>
              </li>
            ))}
          </ul>
        );

      case "callout": {
        const config = CALLOUTS[block.variant] ?? CALLOUTS.note;
        return (
          <div
            key={index}
            className={`my-8 p-5 md:p-6 rounded-2xl border-l-4 shadow-sm flex gap-4 ${config.className}`}
          >
            <div className="shrink-0 pt-0.5">{config.icon}</div>
            <div className="min-w-0">
              <div className="font-heading font-black uppercase tracking-widest text-xs mb-2 opacity-80">
                {config.label}
              </div>
              <p className="text-gray-800 leading-relaxed">{block.text}</p>
            </div>
          </div>
        );
      }

      case "table":
        return (
          <figure key={index} className="my-10">
            <figcaption className="font-heading font-black text-brand-dark text-sm uppercase tracking-widest mb-3">
              {block.caption}
            </figcaption>

            {/* Mobile : une carte par ligne, chaque cellule etiquetee par sa
                colonne. Un tableau a 5 colonnes est illisible sur 360 px. */}
            <div className="md:hidden space-y-3">
              {block.rows.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="rounded-2xl border border-gray-100 bg-white shadow-sm divide-y divide-gray-50"
                >
                  {row.map((cell, cellIndex) => (
                    <div key={cellIndex} className="flex gap-3 px-4 py-2.5 text-sm">
                      <span className="w-28 shrink-0 font-black uppercase tracking-wide text-[10px] text-gray-400 pt-0.5">
                        {block.headers[cellIndex]}
                      </span>
                      <span className="min-w-0 break-words text-gray-700">{cell}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-100 shadow-sm bg-white">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50/70">
                    {block.headers.map((header, headerIndex) => (
                      <th
                        key={headerIndex}
                        scope="col"
                        className="p-4 font-heading font-black text-brand-dark uppercase tracking-wide text-xs"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {block.rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50/40 transition-colors">
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className={`p-4 align-top ${
                            cellIndex === 0 ? "font-bold text-brand-dark" : "text-gray-600"
                          }`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </figure>
        );

      case "letter":
        return <LetterModel key={index} title={block.title} content={block.text} />;
    }
  };

  return (
    <div className="pt-28 md:pt-32 pb-16 bg-[#fafafa] min-h-screen selection:bg-brand-green/30">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-brand-green z-[110] origin-left"
        style={{ scaleX }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <Link
            href="/guide"
            className="group inline-flex items-center text-sm font-bold text-gray-500 hover:text-brand-green transition-colors bg-white px-5 py-2.5 rounded-full border border-gray-100 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Retour au guide
          </Link>
        </div>

        <article>
          <header className="mb-12 border-b border-gray-200 pb-10">
            <div className="inline-flex items-center gap-3 text-brand-green font-heading font-black text-xs sm:text-sm tracking-widest uppercase mb-6 bg-brand-green/10 px-5 py-2.5 rounded-full">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              Chapitre {chapterId}
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight leading-[1.1] text-brand-dark break-words hyphens-auto">
              {title}
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-gray-500 leading-relaxed max-w-3xl border-l-4 border-gray-200 pl-5 md:pl-8">
              {desc}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 bg-gray-100 px-4 py-2 rounded-full">
                <Clock className="w-3.5 h-3.5" />
                {minutes} min de lecture
              </span>
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-brand-green bg-brand-green/10 px-4 py-2 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                Infos vérifiées le {DERNIERE_VERIFICATION}
              </span>
            </div>
          </header>

          {toc.length > 0 && (
            <nav
              aria-label="Sommaire du chapitre"
              className="mb-16 bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden"
            >
              <button
                onClick={() => setIsTocOpen((open) => !open)}
                aria-expanded={isTocOpen}
                aria-controls="chapter-toc"
                className="w-full flex items-center justify-between p-5 md:p-8 bg-gray-50/50 hover:bg-gray-50 transition-colors text-left"
              >
                <span className="flex items-center gap-3 md:gap-4 min-w-0">
                  <span className="bg-brand-green p-2 rounded-lg text-white shrink-0">
                    <ListTree className="w-5 h-5 md:w-6 md:h-6" />
                  </span>
                  <span className="font-heading font-black text-brand-dark text-lg md:text-xl">
                    Dans ce chapitre
                  </span>
                  <span className="text-sm text-gray-400 font-semibold shrink-0">({toc.length})</span>
                </span>
                <ChevronDown
                  className={`w-6 h-6 text-gray-400 shrink-0 transition-transform duration-300 ${
                    isTocOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Replié = retiré du DOM : évite les liens invisibles atteignables au clavier. */}
              {isTocOpen && (
                <div id="chapter-toc" className="p-5 md:p-8 pt-4 border-t border-gray-50 bg-white">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                    {toc.map((item, index) => (
                      <li key={item.id} className={item.level === "h3" ? "md:pl-4" : ""}>
                        <a
                          href={`#${item.id}`}
                          onClick={() => setIsTocOpen(false)}
                          className="group flex gap-3 text-gray-600 hover:text-brand-green font-bold transition-colors items-center p-2.5 rounded-2xl hover:bg-brand-green/5"
                        >
                          <span className="bg-gray-100 text-gray-400 group-hover:bg-brand-green group-hover:text-white transition-colors rounded-xl w-8 h-8 flex items-center justify-center text-xs font-black shrink-0">
                            {index + 1}
                          </span>
                          <span className="leading-tight text-sm md:text-base min-w-0 break-words">
                            {item.title}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </nav>
          )}

          {/* Contenu volontairement non animé : sur les longs chapitres, une
              animation d'entrée en cascade laissait des écrans entiers vides. */}
          <div className="font-sans">{blocks.map(renderBlock)}</div>
        </article>

        <nav
          aria-label="Navigation entre chapitres"
          className="mt-24 flex flex-col md:flex-row justify-between items-stretch gap-5 border-t border-gray-200 pt-14"
        >
          {prevChapter ? (
            <Link
              href={`/guide/${prevChapter.id}`}
              className="flex items-center text-brand-dark hover:text-brand-green transition-all w-full p-5 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl bg-white group min-w-0"
            >
              <div className="bg-gray-100 p-3 md:p-4 rounded-2xl text-gray-400 group-hover:bg-brand-red/10 group-hover:text-brand-red transition-colors shrink-0 mr-5 md:mr-8">
                <ArrowLeft className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-brand-red uppercase tracking-[0.2em] font-black mb-1.5">
                  Précédent
                </div>
                <div className="font-heading font-black text-lg md:text-2xl break-words">
                  {prevChapter.title}
                </div>
              </div>
            </Link>
          ) : (
            <div className="hidden md:block w-full" />
          )}

          {nextChapter && (
            <Link
              href={`/guide/${nextChapter.id}`}
              className="flex items-center justify-end text-brand-dark hover:text-brand-green transition-all w-full p-5 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl bg-white group min-w-0"
            >
              <div className="text-right min-w-0">
                <div className="text-[10px] text-brand-green uppercase tracking-[0.2em] font-black mb-1.5">
                  Suivant
                </div>
                <div className="font-heading font-black text-lg md:text-2xl break-words">
                  {nextChapter.title}
                </div>
              </div>
              <div className="bg-gray-100 p-3 md:p-4 rounded-2xl text-gray-400 group-hover:bg-brand-green/10 group-hover:text-brand-green transition-colors shrink-0 ml-5 md:ml-8">
                <ArrowRight className="w-6 h-6 md:w-8 md:h-8" />
              </div>
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
