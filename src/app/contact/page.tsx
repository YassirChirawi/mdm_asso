"use client";

import ContactForm from "@/components/ContactForm";
import { Mail, MapPin, MessageSquare, Clock, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <div className="pt-32 pb-24 bg-[#fafafa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-green/10 text-brand-green mb-6 shadow-sm">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-black text-brand-dark mb-6 tracking-tighter">
            Contactez-nous
          </h1>
          <p className="text-xl text-gray-500 font-medium leading-relaxed">
            Une question sur vos démarches ? Envie de devenir bénévole ? 
            Notre équipe est à votre écoute.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-8"
          >
            <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 border border-gray-100 shadow-xl shadow-gray-200/20 flex-grow relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/5 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
               <h2 className="font-heading text-3xl font-black mb-10 text-brand-dark relative z-10">Informations</h2>
               
               <div className="space-y-10 relative z-10">
                 <div className="flex items-center gap-6 group">
                   <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-brand-green shadow-sm group-hover:bg-brand-green group-hover:text-white transition-all duration-300">
                     <Mail className="w-7 h-7" />
                   </div>
                   <div>
                     <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Email</p>
                     <a href="mailto:contact@marocainsenfrance.fr" className="text-lg font-bold text-brand-dark hover:text-brand-green transition-colors">
                       contact@marocainsenfrance.fr
                     </a>
                   </div>
                 </div>
                 
                 <div className="flex items-center gap-6 group">
                   <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-brand-red shadow-sm group-hover:bg-brand-red group-hover:text-white transition-all duration-300">
                     <MapPin className="w-7 h-7" />
                   </div>
                   <div>
                     <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Siège Social</p>
                     <p className="text-lg font-bold text-brand-dark">
                       Association Main dans la main, France
                     </p>
                   </div>
                 </div>

                 <div className="flex items-center gap-6 group">
                   <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-brand-dark shadow-sm group-hover:bg-brand-dark group-hover:text-white transition-all duration-300">
                     <Clock className="w-7 h-7" />
                   </div>
                   <div>
                     <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Temps de réponse</p>
                     <p className="text-lg font-bold text-brand-dark">48h à 72h ouvrés</p>
                   </div>
                 </div>
               </div>
            </div>

            <div className="bg-brand-green p-10 rounded-[2.5rem] text-white flex items-center gap-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 opacity-20 transform translate-x-4 -translate-y-4">
                  <Globe className="w-32 h-32" />
               </div>
               <div className="relative z-10">
                 <h4 className="font-heading text-2xl font-black mb-2">Communauté Facebook</h4>
                 <p className="opacity-80 font-medium mb-4">Rejoignez plus de 10,000 membres pour des réponses instantanées.</p>
                 <a href="#" className="inline-flex items-center gap-2 bg-white text-brand-green px-6 py-2 rounded-xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-transform">
                    Rejoindre le groupe
                 </a>
               </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-16 border border-gray-100 shadow-2xl shadow-gray-200/40"
          >
            <ContactForm />
          </motion.div>

        </div>
      </div>
    </div>
  );
}
