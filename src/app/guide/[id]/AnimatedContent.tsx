"use client";

import { motion, Variants, useScroll, useSpring } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, ChevronDown, ListTree, Info, AlertTriangle, Lightbulb, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Props {
  chapterId: string;
  title: string;
  desc: string;
  paragraphs: string[];
  prevChapter: { id: string | number; title: string } | null;
  nextChapter: { id: string | number; title: string } | null;
}

export default function AnimatedContent({ chapterId, title, desc, paragraphs, prevChapter, nextChapter }: Props) {
  const [isTocOpen, setIsTocOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const trackView = async () => {
      try {
        await fetch("/api/stats/chapter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chapterId }),
        });
      } catch (err) {
        console.error("Failed to track view:", err);
      }
    };
    trackView();
  }, [chapterId]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Parsing the Table of Contents dynamically from H2 elements
  const toc = paragraphs.reduce<{ id: string; title: string; index: number }[]>((acc, p, i) => {
    if (p.length < 150 && !p.endsWith('.') && !p.endsWith(':') && p.search(/^[0-9]+(\.[0-9]+)*\s/) !== -1) {
      acc.push({ id: `section-${i}`, title: p.replace(/^[0-9]+(\.[0-9]+)*\s/, ''), index: i });
    }
    return acc;
  }, []);

  const renderParagraph = (p: string, i: number, isFirst: boolean) => {
    const pTrim = p.trim();
    
    // Filter out page numbers (loose numbers on a line)
    if (/^\d+$/.test(pTrim)) return null;

    // Heuristics for Subtitles H2
    if (p.length < 150 && !p.endsWith('.') && !p.endsWith(':') && p.search(/^[0-9]+(\.[0-9]+)*\s/) !== -1) {
      return (
        <motion.h2 
          variants={itemVariants} 
          key={i} 
          id={`section-${i}`}
          className="font-heading text-3xl md:text-4xl font-black text-brand-dark mt-20 mb-8 border-l-8 border-brand-green pl-6 py-2 bg-brand-green/5 rounded-r-xl scroll-mt-28"
        >
          {p.replace(/^[0-9]+(\.[0-9]+)*\s/, '')}
        </motion.h2>
      );
    }

    // Callout boxes (Heuristics)
    const calloutRegex = /^(Note|Conseil|Pro Tip|Attention|Spoiler)\s*:/i;
    const match = pTrim.match(calloutRegex);
    
    if (match) {
      const type = match[1].toLowerCase();
      const calloutConfigs: Record<string, { color: string; icon: any; title: string }> = {
        attention: { color: "border-brand-red bg-brand-red/5", icon: <AlertTriangle className="w-6 h-6 text-brand-red" />, title: "Attention" },
        note: { color: "border-blue-500 bg-blue-50", icon: <Info className="w-6 h-6 text-blue-500" />, title: "Note" },
        conseil: { color: "border-brand-green bg-brand-green/5", icon: <Lightbulb className="w-6 h-6 text-brand-green" />, title: "Conseil" },
        "pro tip": { color: "border-brand-green bg-brand-green/5", icon: <Lightbulb className="w-6 h-6 text-brand-green" />, title: "Conseil" },
        spoiler: { color: "border-purple-500 bg-purple-50", icon: <CheckCircle2 className="w-6 h-6 text-purple-500" />, title: "Bon à savoir" }
      };

      const config = calloutConfigs[type] || calloutConfigs.note;
      
      return (
        <motion.div variants={itemVariants} key={i} className={`my-10 p-6 rounded-2xl border-l-4 shadow-sm flex gap-5 ${config.color}`}>
          <div className="shrink-0 pt-1">{config.icon}</div>
          <div>
            <div className="font-heading font-black uppercase tracking-widest text-xs mb-2 opacity-80">{config.title}</div>
            <p className="text-gray-800 leading-relaxed font-medium">{p.substring(match[0].length).trim()}</p>
          </div>
        </motion.div>
      );
    }

    // Lists
    if (p.startsWith('- ') || p.startsWith('• ') || p.startsWith('➤ ') || p.startsWith('o ')) {
       return (
         <motion.li variants={itemVariants} key={i} className="ml-4 mb-4 list-none flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
           <span className="bg-brand-green/10 text-brand-green rounded-full p-1 mt-0.5 shrink-0">
             <CheckCircle2 className="w-4 h-4" />
           </span>
           <span className="text-gray-700 font-medium leading-relaxed">{p.substring(2)}</span>
         </motion.li>
       );
    }

    // Standard paragraphs with Drop Cap for the first one
    return (
      <motion.p 
        variants={itemVariants} 
        key={i} 
        className={`mb-8 leading-loose text-gray-600 text-lg md:text-xl font-normal ${isFirst ? "first-letter:text-7xl first-letter:font-black first-letter:text-brand-green first-letter:mr-3 first-letter:float-left first-letter:leading-[1]" : ""}`}
      >
        {p}
      </motion.p>
    );
  };

  return (
    <div className="pt-24 pb-16 bg-[#fafafa] min-h-screen selection:bg-brand-green/30">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-brand-green z-[100] origin-left"
        style={{ scaleX }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="mb-12">
          <Link href="/guide" className="group inline-flex items-center text-sm font-bold text-gray-500 hover:text-brand-green transition-colors bg-white px-5 py-2.5 rounded-full border border-gray-100 shadow-sm hover:shadow-md">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Retour au guide
          </Link>
        </motion.div>

        <article className="mx-auto max-w-none">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-16 border-b border-gray-200 pb-12 relative">
            <div className="inline-flex items-center gap-3 text-brand-green font-heading font-black text-sm tracking-widest uppercase mb-8 bg-brand-green/10 px-6 py-2.5 rounded-full shadow-sm">
              <BookOpen className="w-5 h-5" />
              Chapitre {chapterId}
            </div>
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-black mb-8 tracking-tighter leading-[1.1] text-brand-dark">
              {title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 font-medium leading-relaxed max-w-3xl border-l-4 border-gray-200 pl-8">
              {desc}
            </p>
          </motion.div>

          {/* Sommaire Pliable */}
          {toc.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-20 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
              <button 
                onClick={() => setIsTocOpen(!isTocOpen)} 
                className="w-full flex items-center justify-between p-8 bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-brand-green p-2 rounded-lg text-white shadow-lg shadow-brand-green/20">
                    <ListTree className="w-6 h-6" />
                  </div>
                  <span className="font-heading font-black text-brand-dark text-xl">Dans ce chapitre</span>
                </div>
                <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform duration-500 ${isTocOpen ? "rotate-180" : ""}`} />
              </button>
              
              <motion.div 
                initial={false}
                animate={{ height: isTocOpen ? "auto" : 0, opacity: isTocOpen ? 1 : 0 }}
                className="overflow-hidden"
              >
                <div className="p-8 pt-4 border-t border-gray-50 bg-white">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {toc.map((item, idx) => (
                      <li key={item.id}>
                        <a 
                          href={`#${item.id}`} 
                          onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                            setIsTocOpen(false);
                          }}
                          className="group flex gap-4 text-gray-600 hover:text-brand-green font-bold transition-all items-center p-3 rounded-2xl hover:bg-brand-green/5"
                        >
                          <span className="bg-gray-100 text-gray-400 group-hover:bg-brand-green group-hover:text-white transition-all rounded-xl w-10 h-10 flex items-center justify-center text-sm font-black shrink-0 shadow-sm">
                            {idx + 1}
                          </span>
                          <span className="leading-tight">{item.title}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          )}

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="font-sans"
          >
            {paragraphs.length > 0 ? (
              paragraphs.map((p, i) => renderParagraph(p, i, i === 0))
            ) : (
              <motion.div variants={itemVariants} className="bg-white rounded-[3rem] p-20 border border-gray-100 text-center shadow-2xl shadow-gray-200/40">
                <Spinner />
              </motion.div>
            )}
          </motion.div>
        </article>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="mt-32 flex flex-col md:flex-row justify-between items-stretch gap-8 border-t border-gray-200 pt-20">
          {prevChapter ? (
            <Link href={`/guide/${prevChapter.id}`} className="flex items-center text-brand-dark hover:text-brand-green transition-all duration-500 w-full p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-brand-green/5 hover:-translate-y-2 bg-white group">
              <div className="bg-gray-100 p-4 rounded-2xl text-gray-400 group-hover:bg-brand-red/10 group-hover:text-brand-red transition-colors shrink-0 mr-8">
                <ArrowLeft className="w-8 h-8 group-hover:-translate-x-2 transition-transform" />
              </div>
              <div>
                <div className="text-[10px] text-brand-red uppercase tracking-[0.3em] font-black mb-2 px-3 py-1 bg-brand-red/5 rounded-full inline-block">Précédent</div>
                <div className="font-heading font-black text-2xl group-hover:text-brand-dark transition-colors">{prevChapter.title}</div>
              </div>
            </Link>
          ) : <div className="w-full"></div>}

          {nextChapter && (
            <Link href={`/guide/${nextChapter.id}`} className="flex items-center justify-end text-brand-dark hover:text-brand-green transition-all duration-500 w-full p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-brand-green/5 hover:-translate-y-2 bg-white group">
              <div className="text-right">
                <div className="text-[10px] text-brand-green uppercase tracking-[0.3em] font-black mb-2 px-3 py-1 bg-brand-green/5 rounded-full inline-block">Suivant</div>
                <div className="font-heading font-black text-2xl group-hover:text-brand-dark transition-colors">{nextChapter.title}</div>
              </div>
              <div className="bg-gray-100 p-4 rounded-2xl text-gray-400 group-hover:bg-brand-green/10 group-hover:text-brand-green transition-colors shrink-0 ml-8">
                <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          )}
        </motion.div>

      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 border-4 border-brand-green border-t-transparent rounded-full animate-spin mb-8 shadow-lg shadow-brand-green/20"></div>
      <h2 className="font-heading text-3xl font-black text-brand-dark mb-4 uppercase tracking-widest">Mise en page...</h2>
      <p className="text-xl text-gray-400 font-medium">Nous préparons une expérience de lecture optimale.</p>
    </div>
  )
}
