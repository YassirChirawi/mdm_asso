"use client";

import { Target, Heart, Users, Award, ShieldCheck, Compass } from "lucide-react";
import { motion } from "framer-motion";

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="pt-32 pb-24 bg-[#fafafa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto mb-24"
        >
          <div className="inline-flex items-center gap-3 text-brand-green font-heading font-black text-sm tracking-[0.2em] uppercase mb-8 bg-brand-green/10 px-6 py-2.5 rounded-full">
            <Award className="w-5 h-5" />
            Notre Histoire
          </div>
          <h1 className="font-heading text-5xl md:text-7xl font-black text-brand-dark mb-10 tracking-tighter leading-none">
            Main dans la main pour <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-red">
              votre réussite en France.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 leading-relaxed font-medium">
            Fondée par Yassir Chirawi en juillet 2025, notre association est née d'un constat simple : 
            aucun étudiant ne devrait affronter seul l'expatriation.
          </p>
        </motion.div>

        {/* Mission/Values Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32"
        >
          {[
            { icon: <Target className="w-8 h-8" />, title: "Notre Mission", color: "text-brand-green", bg: "bg-brand-green/10", desc: "Simplifier l'administration, sécuriser le logement et garantir une intégration sereine." },
            { icon: <Heart className="w-8 h-8" />, title: "Nos Valeurs", color: "text-brand-red", bg: "bg-brand-red/10", desc: "La solidarité n'est pas un vain mot. C'est le moteur de chaque action de nos bénévoles." },
            { icon: <Compass className="w-8 h-8" />, title: "Notre Vision", color: "text-brand-dark", bg: "bg-brand-dark/10", desc: "Devenir le pont incontournable entre le système français et l'ambition marocaine." }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              variants={itemVariants}
              className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-xl shadow-gray-200/30 hover:shadow-2xl transition-all group"
            >
              <div className={`w-16 h-16 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <h3 className="font-heading text-2xl font-black mb-4 text-brand-dark">{item.title}</h3>
              <p className="text-gray-500 leading-relaxed font-medium">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Leadership Section */}
        <div className="bg-brand-dark rounded-[4rem] p-12 md:p-24 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-green/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-red/10 rounded-full blur-[100px]"></div>
          
          <div className="relative z-10">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="font-heading text-4xl md:text-5xl font-black mb-6">Le Bureau de l'Association</h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg font-medium">
                Une équipe de bénévoles passionnés qui travaillent dans l'ombre pour éclairer votre parcours.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              {/* President */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col items-center"
              >
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand-green to-brand-red rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  <div className="w-32 h-32 bg-brand-dark rounded-[2.5rem] border-2 border-white/20 flex items-center justify-center text-4xl font-black text-white relative z-10">
                    YC
                  </div>
                </div>
                <h3 className="font-heading text-2xl font-black text-white mb-2">Yassir Chirawi</h3>
                <p className="text-brand-green font-black uppercase tracking-[0.2em] text-xs px-4 py-1.5 bg-brand-green/10 rounded-full">Président Fondateur</p>
              </motion.div>

              {/* Placeholder Member 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center"
              >
                <div className="w-32 h-32 bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center justify-center text-3xl font-black text-white/30 mb-6">
                  MDM
                </div>
                <h3 className="font-heading text-2xl font-black text-white/50 mb-2">Membre Bureau</h3>
                <p className="text-white/20 font-black uppercase tracking-[0.2em] text-xs px-4 py-1.5 bg-white/5 rounded-full">Secrétaire Général</p>
              </motion.div>

              {/* Placeholder Member 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="flex flex-col items-center"
              >
                <div className="w-32 h-32 bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center justify-center text-3xl font-black text-white/30 mb-6">
                  MDM
                </div>
                <h3 className="font-heading text-2xl font-black text-white/50 mb-2">Membre Bureau</h3>
                <p className="text-white/20 font-black uppercase tracking-[0.2em] text-xs px-4 py-1.5 bg-white/5 rounded-full">Trésorier</p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Action Poles Section */}
        <div className="mt-32">
          <div className="text-center mb-20">
            <h2 className="font-heading text-4xl md:text-6xl font-black text-brand-dark mb-6 tracking-tighter">Nos Pôles d'Action</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
              Au-delà de l'information, nous créons des espaces de vie et d'épanouissement pour notre communauté.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Sport Pole */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-xl shadow-gray-200/20 group hover:shadow-2xl transition-all"
            >
              <div className="flex items-center gap-6 mb-10">
                <div className="w-24 h-24 bg-[#fafafa] rounded-3xl p-3 border border-gray-100 shadow-sm transition-transform group-hover:rotate-3 duration-500">
                  <img src="/ballomania.png" alt="Ballomania Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="font-heading text-3xl font-black text-brand-dark">Pôle Sportif</h3>
                  <p className="text-brand-green font-bold uppercase tracking-widest text-xs">Ballomania FC – Foot à 7</p>
                </div>
              </div>
              <p className="text-gray-500 text-lg mb-8 leading-relaxed font-medium">
                Le sport est un levier d'intégration exceptionnel. Avec Ballomania FC, nous offrons aux étudiants la possibilité d'exprimer leur talent et de forger des liens forts à travers le championnat FLA.
              </p>
              <div className="flex gap-4">
                <span className="px-4 py-2 bg-brand-green/10 text-brand-green rounded-full text-xs font-black uppercase tracking-widest italic">#EspritDeCorps</span>
                <span className="px-4 py-2 bg-brand-dark/5 text-brand-dark rounded-full text-xs font-black uppercase tracking-widest italic">#Saison2025</span>
              </div>
            </motion.div>

            {/* Partnership Pole */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-brand-dark rounded-[3rem] p-12 text-white relative overflow-hidden group border border-white/5"
            >
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-red/10 rounded-full blur-[80px] translate-y-1/2 translate-x-1/2"></div>
              
              <div className="flex items-center gap-6 mb-10 relative z-10">
                <div className="w-24 h-24 bg-white/5 rounded-3xl p-6 border border-white/10 backdrop-blur-xl group-hover:scale-110 transition-transform duration-500">
                  <img src="/citiz.png" alt="Citiz Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="font-heading text-3xl font-black">Partenariats & Logement</h3>
                  <p className="text-brand-red font-bold uppercase tracking-widest text-xs">Collaboration Coliving Citiz</p>
                </div>
              </div>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed font-medium relative z-10">
                Notre partenariat avec Coliving Citiz permet de proposer des solutions d'hébergement modernes et conviviales, pensées pour la réussite académique et le bien-être social des étudiants.
              </p>
              <a 
                href="https://www.instagram.com/marocainsenfrance/p/DN0xgVEXuHo/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="relative z-10 inline-flex items-center gap-3 text-white font-black uppercase tracking-widest text-xs bg-brand-red px-8 py-4 rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-brand-red/20"
              >
                Voir la publication Instagram
              </a>
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
}
