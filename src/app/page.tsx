"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Users, HelpCircle, Heart, Sparkles, Globe, ShieldCheck, Trophy, Zap, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center justify-center bg-brand-dark overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-green/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-red/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 text-white/90 backdrop-blur-xl border border-white/10 mb-10 mx-auto shadow-2xl"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-brand-green animate-pulse shadow-[0_0_10px_#1D9E75]"></span>
            <span className="text-sm font-bold tracking-wide uppercase">Rentrée 2025 – Plus de 150 guides distribués</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-heading text-4xl md:text-8xl lg:text-[6rem] font-black text-white tracking-tighter mb-8 leading-[0.95]"
          >
            L'accompagnement <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green via-white to-brand-red">
              par les étudiants.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 font-medium leading-relaxed"
          >
            Rejoins la communauté n°1 des étudiants marocains en France. 
            Démarches, logement, vie sociale : on ne te laisse jamais seul.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link
              href="/guide"
              className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-black text-brand-dark bg-white rounded-2xl hover:bg-gray-50 transition-all hover:-translate-y-1 shadow-[0_20px_40px_rgba(255,255,255,0.1)] w-full sm:w-auto overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-brand-green/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <BookOpen className="w-6 h-6 mr-3 relative z-10" />
              <span className="relative z-10">Accéder au Guide Gratuit</span>
            </Link>
            <Link
              href="/dons"
              className="group inline-flex items-center justify-center px-10 py-5 text-lg font-black text-white bg-brand-red rounded-2xl hover:bg-red-700 transition-all hover:-translate-y-1 shadow-[0_20px_40px_rgba(193,39,45,0.3)] w-full sm:w-auto"
            >
              <Heart className="w-6 h-6 mr-3 group-hover:scale-125 transition-transform" />
              Soutenir l'Association
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30 animate-bounce">
           <div className="w-px h-12 bg-gradient-to-b from-white to-transparent"></div>
        </div>
      </section>

      {/* Trust/Stats Section */}
      <section className="py-24 bg-white relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
               whileHover={{ y: -10 }}
               className="bg-[#fafafa] rounded-[2.5rem] p-10 text-center border border-gray-100 shadow-sm transition-all hover:shadow-2xl hover:shadow-brand-red/5 group"
            >
              <div className="w-16 h-16 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white group-hover:scale-110 transition-all duration-500 overflow-hidden shadow-inner p-2 bg-brand-red/5">
                <BookOpen className="w-8 h-8 text-brand-red mt-1" />
              </div>
              <h2 className="font-heading text-4xl font-black text-brand-dark mb-2 tracking-tighter">150+</h2>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Guides Distribués (2025)</p>
            </motion.div>

            <motion.div 
               whileHover={{ y: -10 }}
               className="bg-[#fafafa] rounded-[2.5rem] p-10 text-center border border-gray-100 shadow-sm transition-all hover:shadow-2xl hover:shadow-brand-dark/5 group"
            >
              <div className="w-16 h-16 mx-auto bg-brand-dark/10 rounded-2xl flex items-center justify-center mb-6 text-brand-dark group-hover:bg-brand-dark group-hover:text-white transition-all duration-500 shadow-inner">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="font-heading text-4xl font-black text-brand-dark mb-2 tracking-tighter">100%</h2>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Engagement Bénévole</p>
            </motion.div>
            
            <motion.div 
               whileHover={{ y: -10 }}
               className="bg-[#fafafa] rounded-[2.5rem] p-10 text-center border border-gray-100 shadow-sm transition-all hover:shadow-2xl hover:shadow-brand-dark/5 group"
            >
              <div className="w-16 h-16 mx-auto bg-brand-dark/10 rounded-2xl flex items-center justify-center mb-6 text-brand-dark group-hover:bg-brand-dark group-hover:text-white transition-all duration-500 shadow-inner">
                <Globe className="w-8 h-8" />
              </div>
              <h2 className="font-heading text-4xl font-black text-brand-dark mb-2 tracking-tighter">France</h2>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Présence Nationale</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Activities Section (Ballomania & Citiz) */}
      <section className="py-24 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Ballomania FC */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-brand-dark rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden group border border-white/5"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-green/30 transition-colors"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-20 h-20 bg-white rounded-2xl p-2 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform">
                    <img src="/ballomania.png" alt="Ballomania Logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="font-heading text-3xl font-black">Ballomania FC</h3>
                    <p className="text-brand-green font-bold uppercase tracking-widest text-xs">Pôle Sportif – Foot à 7 (FLA)</p>
                  </div>
                </div>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed font-medium">
                  Parce que l'intégration passe aussi par le sport. Notre équipe de Foot à 7 porte haut les couleurs de l'association dans le championnat FLA.
                </p>
                <div className="flex items-center gap-6">
                   <div className="flex flex-col">
                      <span className="text-2xl font-black text-white">2025</span>
                      <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Saison Inaugurale</span>
                   </div>
                   <div className="w-px h-10 bg-white/10"></div>
                   <div className="flex items-center gap-2 text-brand-green font-black uppercase text-xs tracking-widest">
                      <Trophy className="w-4 h-4" /> Esprit d'Équipe
                   </div>
                </div>
              </div>
            </motion.div>

            {/* Citiz Collaboration */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[3rem] p-10 md:p-16 border border-gray-100 shadow-2xl shadow-gray-200/50 flex flex-col justify-between group"
            >
              <div className="relative">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-20 h-20 bg-[#fafafa] rounded-2xl p-4 border border-gray-100 group-hover:scale-105 transition-transform">
                    <img src="/citiz.png" alt="Citiz Logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="font-heading text-3xl font-black text-brand-dark">Coliving Citiz</h3>
                    <p className="text-brand-red font-bold uppercase tracking-widest text-xs">Collaboration Officielle – Rentrée 2025</p>
                  </div>
                </div>
                <p className="text-gray-500 text-lg mb-8 leading-relaxed font-medium">
                  Une alliance stratégique pour faciliter l'accès au logement de qualité. Découvrez nos solutions de coliving adaptées aux besoins des étudiants.
                </p>
              </div>
              <a 
                href="https://www.instagram.com/marocainsenfrance/p/DN0xgVEXuHo/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-brand-dark font-black uppercase tracking-widest text-xs border-b-2 border-brand-red pb-2 w-fit group-hover:gap-5 transition-all"
              >
                Découvrir le partenariat <ExternalLink className="w-4 h-4 text-brand-red" />
              </a>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Guide Features Upgrade */}
      <section className="py-32 bg-brand-dark text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <div className="text-brand-green font-heading font-black tracking-[0.3em] uppercase text-sm mb-6 bg-brand-green/10 px-6 py-2 rounded-full inline-block">Le Savoir est une force</div>
              <h2 className="font-heading text-4xl md:text-7xl font-black leading-none tracking-tighter">Ton installation, <br/>sans zone d'ombre.</h2>
            </div>
            <Link href="/guide" className="group flex items-center gap-4 bg-white/5 hover:bg-white/10 p-4 rounded-2xl border border-white/10 transition-all font-bold">
               Consulter l'index complet des chapitres
               <div className="bg-brand-green rounded-xl p-2 group-hover:scale-110 transition-transform">
                 <ArrowRight className="w-5 h-5" />
               </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { num: "01", title: "Avant le départ", color: "text-brand-green", bg: "bg-brand-green/5", desc: "Visa, budget prévisionnel, choix de la ville et valises. Tout ce qu'il faut régler avant de quitter le Maroc." },
              { num: "02", title: "Démarches en France", color: "text-brand-red", bg: "bg-brand-red/5", desc: "CAF, ANEF, CPAM... On t'explique comment naviguer l'administration française sans te perdre." },
              { num: "03", title: "Réussite et Carrière", color: "text-white", bg: "bg-white/5", desc: "Optimiser ton CV, trouver une alternance et transformer ta double culture en super-pouvoir professionnel." }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`p-10 rounded-[3rem] ${feature.bg} border border-white/5 relative group hover:border-white/10 transition-colors`}
              >
                <div className={`${feature.color} font-heading font-black text-6xl md:text-8xl mb-8 opacity-20 group-hover:opacity-40 transition-opacity`}>{feature.num}</div>
                <h3 className="font-heading text-3xl font-black mb-6">{feature.title}</h3>
                <p className="text-gray-400 text-lg leading-relaxed mb-6">
                  {feature.desc}
                </p>
                <Link href="/guide" className="text-sm font-black uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                   Découvrir ce module <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Dynamic Background Element */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-brand-green/10 rounded-full blur-[100px] pointer-events-none"></div>
      </section>
    </div>
  );
}

