"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

export default function Testimonials() {
    const feedbacks = [
        {
            name: "Amine R.",
            role: "Étudiant en Master, Paris",
            quote: "L'association m'a aidé à trouver mon premier logement étudiant et m'a guidé pour toutes les démarches administratives. Une vraie famille !",
            rating: 5
        },
        {
            name: "Sofia L.",
            role: "Licence Économie, Lyon",
            quote: "Les événements culturels me permettent de rester connectée à mes racines tout en m'intégrant parfaitement à la vie étudiante en France.",
            rating: 5
        },
        {
            name: "Yassine M.",
            role: "Doctorant, Créteil",
            quote: "Un soutien indispensable pour les étudiants arrivants. Le sérieux administratif et la bienveillance des membres font toute la différence.",
            rating: 5
        }
    ];

    return (
        <section id="feedback" className="py-32 bg-white relative overflow-hidden">
            {/* Background Animations */}
            <div className="absolute top-1/4 left-10 w-64 h-64 bg-[#006233]/5 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-[#C1272D]/5 rounded-full blur-3xl animate-pulse-slow"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <span className="text-[#006233] font-bold tracking-wider uppercase text-sm mb-6 block">Ils nous font confiance</span>
                    <h2 className="text-5xl font-extrabold text-gray-900 mb-8">Retours d'étudiants</h2>
                    <p className="text-xl font-light leading-relaxed text-gray-600 italic">
                        "Parce que votre réussite est notre plus belle victoire."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {feedbacks.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-50 p-10 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 relative group"
                        >
                            <div className="absolute top-8 right-8 text-[#C1272D]/10 group-hover:text-[#C1272D]/20 transition-colors">
                                <Quote size={64} fill="currentColor" />
                            </div>

                            <div className="flex gap-1 mb-6">
                                {[...Array(item.rating)].map((_, i) => (
                                    <Star key={i} size={18} className="fill-[#D4AF37] text-[#D4AF37]" />
                                ))}
                            </div>

                            <p className="text-lg text-gray-700 italic mb-10 leading-relaxed relative z-10">
                                "{item.quote}"
                            </p>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#006233] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                                    {item.name[0]}
                                </div>
                                <div>
                                    <p className="font-extrabold text-gray-900">{item.name}</p>
                                    <p className="text-sm text-[#006233] font-bold uppercase tracking-widest">{item.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
