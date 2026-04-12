"use client";
import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Blog() {
    const articles = [
        {
            id: 1,
            category: "Vie Étudiante",
            date: "12 Mars 2026",
            title: "Le Guide Ultime : Trouver un logement étudiant facilement à Créteil",
            image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=800&auto=format&fit=crop"
        },
        {
            id: 2,
            category: "Événement",
            date: "05 Mars 2026",
            title: "Retour en images sur notre grande soirée d'intégration annuelle 2026",
            image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop"
        },
        {
            id: 3,
            category: "Administratif",
            date: "28 Février 2026",
            title: "Renouvellement de votre de titre de séjour : les 5 erreurs à éviter absolument",
            image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop"
        }
    ];

    return (
        <section id="blog" className="py-32 bg-gray-50 border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 text-center md:text-left">
                    <div className="mx-auto md:mx-0">
                        <span className="text-[#006233] font-bold tracking-wider uppercase text-sm mb-6 block">Actualités</span>
                        <h2 className="text-5xl font-extrabold text-gray-900 mb-4">Notre Blog</h2>
                        <p className="text-xl font-light text-gray-600">Restez informés sur nos dernières actions et découvrez nos conseils.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {articles.map((article, idx) => (
                        <motion.div
                            key={article.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-[2rem] overflow-hidden border border-gray-200 shadow-sm hover:shadow-2xl transition-all duration-300 group cursor-pointer flex flex-col hover:-translate-y-2"
                        >
                            <div className="aspect-[4/3] overflow-hidden relative">
                                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute top-6 left-6">
                                    <span className="bg-white/95 backdrop-blur-md text-[#006233] text-xs font-bold px-4 py-2 rounded-xl uppercase tracking-wider shadow-sm">
                                        {article.category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-10 flex-grow flex flex-col">
                                <div className="flex items-center gap-2 text-sm text-gray-500 font-bold uppercase tracking-wider mb-6">
                                    <Calendar size={16} className="text-[#006233]" /> {article.date}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-8 group-hover:text-[#C1272D] transition-colors leading-snug">
                                    {article.title}
                                </h3>
                                <div className="mt-auto pt-6 border-t border-gray-100">
                                    <p className="text-gray-900 font-bold flex items-center gap-2 group-hover:gap-4 group-hover:text-[#006233] transition-all text-sm uppercase tracking-wider">
                                        Lire l'article <ArrowRight size={18} />
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
