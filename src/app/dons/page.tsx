"use client";

import DonationForm from "@/components/DonationForm";
import { Heart, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Dons() {
  return (
    <div className="pt-32 pb-24 bg-[#fafafa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-red/10 text-brand-red mb-8 shadow-sm">
              <Heart className="w-8 h-8 fill-brand-red" />
            </div>
            <h1 className="font-heading text-5xl md:text-6xl font-black text-brand-dark mb-8 tracking-tighter leading-none">
              Soutenir <br/>
              <span className="text-brand-green">notre vision.</span>
            </h1>
            <p className="text-xl text-gray-500 mb-10 leading-relaxed font-medium">
              Chaque don est un investissement direct dans la réussite d'un étudiant marocain en France. 
              Ensemble, bâtissons une communauté plus forte.
            </p>
            
            <div className="space-y-6">
              {[
                { title: "Soutien direct", desc: "Aide pour le premier mois de loyer et caution." },
                { title: "Vie associative", desc: "Organisation d'ateliers et d'événements culturels." },
                { title: "Bourses d'excellence", desc: "Récompenser les parcours les plus méritants." }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-3xl bg-white border border-gray-100 shadow-sm">
                  <div className="bg-brand-green/10 p-2 rounded-xl text-brand-green">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark">{item.title}</h4>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 rounded-3xl bg-brand-dark text-white flex items-center gap-6">
               <div className="bg-white/10 p-4 rounded-2xl">
                 <ShieldCheck className="w-8 h-8 text-brand-green" />
               </div>
               <div>
                 <p className="text-sm font-bold opacity-50 uppercase tracking-widest mb-1">Paiement Sécurisé</p>
                 <p className="font-medium">Vos transactions sont protégées par Stripe.</p>
               </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-green to-brand-red opacity-10 blur-[100px] transform rotate-12"></div>
            <div className="relative z-10 bg-white p-2 rounded-[3.5rem] shadow-2xl shadow-gray-200">
               <div className="bg-[#fafafa] rounded-[3rem] p-4">
                 <DonationForm />
               </div>
            </div>
            
            {/* Social Proof */}
            <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-3xl shadow-xl border border-gray-50 hidden md:block">
               <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200"></div>)}
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-brand-green flex items-center justify-center text-[10px] text-white font-black">+45</div>
                  </div>
                  <p className="text-xs font-bold text-gray-500">Déjà donateurs ce mois-ci</p>
               </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
