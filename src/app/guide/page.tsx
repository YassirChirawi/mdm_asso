"use client";

import Link from "next/link";
import { BookOpen, ArrowRight, GraduationCap } from "lucide-react";
import { chapters } from "@/data/chapters";
import { motion } from "framer-motion";

export default function GuideIndex() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="pt-32 pb-24 bg-[#fafafa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-brand-dark text-white mb-8 shadow-2xl shadow-brand-green/20 -rotate-3">
            <GraduationCap className="w-10 h-10 text-brand-green" />
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-black text-brand-dark mb-6 tracking-tighter">
            Le Guide Complet
          </h1>
          <p className="text-xl text-gray-500 font-medium leading-relaxed">
            15 modules exclusifs pour maîtriser chaque étape de ton parcours étudiant en France. 
            Gratuit, pratique et sans langue de bois.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {chapters.map((chapter, idx) => (
            <motion.div key={chapter.id} variants={itemVariants}>
              <Link 
                href={`/guide/${chapter.id}`}
                className="group relative bg-white rounded-[2.5rem] p-7 md:p-8 h-full shadow-sm hover:shadow-2xl hover:shadow-brand-green/5 transition-all duration-500 border border-gray-100 flex flex-col items-start overflow-hidden"
              >
                {/* Accent Background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-[4rem] group-hover:bg-brand-green/5 transition-colors -z-0"></div>
                
                <div className="relative z-10 w-full">
                  <div className="flex justify-between items-start mb-8">
                    <div className="font-heading text-5xl font-black text-gray-100 group-hover:text-brand-green/10 transition-colors">
                      {chapter.id.toString().padStart(2, '0')}
                    </div>
                    <div className="bg-gray-50 text-gray-400 p-3 rounded-2xl group-hover:bg-brand-green group-hover:text-white transition-all transform group-hover:rotate-12">
                      <BookOpen className="w-6 h-6" />
                    </div>
                  </div>
                  
                  <h3 className="font-heading text-2xl font-black text-brand-dark mb-4 leading-tight group-hover:text-brand-green transition-colors">
                    {chapter.title}
                  </h3>
                  <p className="text-gray-500 font-medium text-sm leading-relaxed mb-8 line-clamp-3">
                    {chapter.desc}
                  </p>
                  
                  <div className="mt-auto flex items-center text-sm font-black uppercase tracking-widest text-brand-dark group-hover:text-brand-green transition-all">
                    Commencer la lecture 
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
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
