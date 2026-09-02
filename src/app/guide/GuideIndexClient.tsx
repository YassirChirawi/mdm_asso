"use client";

import Link from "next/link";
import { BookOpen, ArrowRight, GraduationCap, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface ChapterSummary {
  id: number;
  title: string;
  desc: string;
  minutes: number;
}

export default function GuideIndexClient({ chapters }: { chapters: ChapterSummary[] }) {
  const totalMinutes = chapters.reduce((total, chapter) => total + chapter.minutes, 0);

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
                    <div className="bg-gray-50 text-gray-400 p-3 rounded-2xl group-hover:bg-brand-green group-hover:text-white transition-all transform group-hover:rotate-12">
                      <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
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
                      Commencer la lecture
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
