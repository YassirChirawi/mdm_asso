"use client";

import Link from "next/link";
import { BookOpen, ArrowRight, GraduationCap, Clock, CheckCircle2, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { useGuideProgress } from "@/lib/guideProgress";

interface ChapterSummary {
  id: number;
  title: string;
  desc: string;
  minutes: number;
}

export default function GuideIndexClient({ chapters }: { chapters: ChapterSummary[] }) {
  const totalMinutes = chapters.reduce((total, chapter) => total + chapter.minutes, 0);
  const { progress, reset } = useGuideProgress();

  const lus = chapters.filter((c) => progress[c.id.toString()]).length;
  const pourcentage = chapters.length ? Math.round((lus / chapters.length) * 100) : 0;
  // On reprend au premier chapitre non lu, pas au dernier ouvert : c'est ce que
  // le lecteur cherche quand il revient sur l'index.
  const aReprendre = chapters.find((c) => !progress[c.id.toString()]);
  const minutesRestantes = chapters
    .filter((c) => !progress[c.id.toString()])
    .reduce((total, c) => total + c.minutes, 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.04 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="pt-28 md:pt-32 pb-24 bg-[#fafafa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-14 md:mb-20"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-[2rem] bg-brand-dark text-white mb-8 shadow-2xl shadow-brand-green/20 -rotate-3">
            <GraduationCap className="w-8 h-8 md:w-10 md:h-10 text-brand-green" />
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-6xl font-black text-brand-dark mb-6 tracking-tight break-words">
            Le Guide Complet
          </h1>
          <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed">
            {chapters.length} chapitres pour maîtriser chaque étape de ton parcours étudiant en France.
            Gratuit, pratique et sans langue de bois.
          </p>
          {totalMinutes > 0 && (
            <p className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 bg-white border border-gray-100 px-4 py-2 rounded-full">
              <Clock className="w-3.5 h-3.5" />
              Environ {Math.round(totalMinutes / 60)} h de lecture au total
            </p>
          )}
        </motion.div>

        {lus > 0 && (
          <div className="max-w-3xl mx-auto mb-14 bg-white border border-gray-100 rounded-3xl shadow-sm p-6 md:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
              <span className="font-heading font-black text-brand-dark">
                Ta progression : {lus} chapitre{lus > 1 ? "s" : ""} sur {chapters.length}
              </span>
              <span className="font-heading font-black text-brand-green">{pourcentage} %</span>
            </div>
            <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-brand-green transition-all duration-700"
                style={{ width: `${pourcentage}%` }}
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {aReprendre ? (
                <>
                  <Link
                    href={`/guide/${aReprendre.id}`}
                    className="inline-flex items-center gap-2 bg-brand-green text-white font-black text-xs uppercase tracking-widest px-6 py-3 rounded-2xl hover:bg-brand-dark transition-colors"
                  >
                    Reprendre au chapitre {aReprendre.id}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  {minutesRestantes > 0 && (
                    <span className="text-sm text-gray-400 font-medium">
                      Il te reste environ {minutesRestantes} min de lecture.
                    </span>
                  )}
                </>
              ) : (
                <span className="inline-flex items-center gap-2 text-brand-green font-black text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  Guide terminé. Bravo.
                </span>
              )}
              <button
                onClick={reset}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-brand-red transition-colors ml-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Réinitialiser
              </button>
            </div>

            <p className="mt-4 text-xs text-gray-400 leading-relaxed">
              Ta progression est enregistrée dans ce navigateur. Elle ne quitte pas ton
              appareil et ne nécessite aucun compte.
            </p>
          </div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {chapters.map((chapter) => (
            <motion.div key={chapter.id} variants={itemVariants}>
              <Link
                href={`/guide/${chapter.id}`}
                className="group relative bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 h-full shadow-sm hover:shadow-2xl hover:shadow-brand-green/5 transition-all duration-500 border border-gray-100 flex flex-col items-start overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-[4rem] group-hover:bg-brand-green/5 transition-colors" />

                <div className="relative z-10 w-full flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6 md:mb-8">
                    <div className="font-heading text-4xl md:text-5xl font-black text-gray-100 group-hover:text-brand-green/10 transition-colors">
                      {chapter.id.toString().padStart(2, "0")}
                    </div>
                    {progress[chapter.id.toString()] ? (
                      <div className="bg-brand-green/10 text-brand-green p-3 rounded-2xl" title="Chapitre lu">
                        <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                    ) : (
                      <div className="bg-gray-50 text-gray-400 p-3 rounded-2xl group-hover:bg-brand-green group-hover:text-white transition-all transform group-hover:rotate-12">
                        <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                    )}
                  </div>

                  <h2 className="font-heading text-xl md:text-2xl font-black text-brand-dark mb-3 leading-tight group-hover:text-brand-green transition-colors break-words">
                    {chapter.title}
                  </h2>
                  <p className="text-gray-500 font-medium text-sm leading-relaxed mb-6">
                    {chapter.desc}
                  </p>

                  <div className="mt-auto w-full">
                    {chapter.minutes > 0 && (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 mb-4">
                        <Clock className="w-3.5 h-3.5" />
                        {chapter.minutes} min de lecture
                      </div>
                    )}
                    <div className="flex items-center text-xs md:text-sm font-black uppercase tracking-widest text-brand-dark group-hover:text-brand-green transition-all">
                      {progress[chapter.id.toString()] ? "Relire ce chapitre" : "Commencer la lecture"}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
