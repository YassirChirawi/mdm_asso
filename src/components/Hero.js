"use client";
import React, { useState, useEffect } from 'react';
import { ArrowRight, FileDown, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
    {
        quote: "Si je ne fais pas les choses moi-même, personne ne le fera à ma place.",
        author: "Yassmine",
        context: "22 ans, Montpellier – École de commerce",
    },
    {
        quote: "Khouya, khti, tu vas forcément devoir affronter des galères. C'est comme ça que tu sauras qui tu es.",
        author: "Hamza",
        context: "25 ans, Asnières-sur-Seine – 3 alternances",
    },
    {
        quote: "Les bons contacts peuvent vraiment faire la différence.",
        author: "Mohamed",
        context: "25 ans, Dunkerque – Bac+5 en achats",
    },
    {
        quote: "Prends soin de ta tête et fais gaffe à qui tu fréquentes. Ça paye toujours.",
        author: "Hassan",
        context: "26 ans, Créteil – Supply chain management",
    },
    {
        quote: "Fais très attention à tes fréquentations. Un mauvais entourage peut te tirer vers le bas.",
        author: "Said",
        context: "25 ans, Paris – MSc achats et supply chain",
    },
    {
        quote: "Soyez confiants, même lorsque l'avenir semble incertain.",
        author: "Youssef",
        context: "25 ans, Paris – Aventure entre Nancy, Berlin et Paris",
    },
    {
        quote: "N'oubliez jamais l'objectif premier qui vous a fait venir jusqu'ici.",
        author: "Mohammed Amine",
        context: "27 ans, CDI – Passeport talent",
    },
    {
        quote: "Ne restez pas seuls. Se faire des amis, c'est le meilleur raccourci pour une intégration réussie.",
        author: "Kimo",
        context: "Créteil – Première année réussie",
    },
];

export default function Hero() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleDownload = async () => {
        try {
            await fetch('/api/download', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileName: 'guide-etudiant.pdf' })
            });
            window.open('/guide-etudiant.pdf', '_blank');
        } catch (error) {
            console.error('Download error', error);
        }
    };

    return (
        <section id="hero" className="relative min-h-[85vh] flex items-center py-32 bg-[#FFFFFF] overflow-hidden">
            {/* Background Animated Elements */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-[#C1272D]/5 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#006233]/5 rounded-full blur-3xl animate-float"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] bg-gray-50/50 rounded-full blur-[100px] -z-10"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-2xl"
                    >
                        <span className="text-[#006233] font-bold tracking-wider uppercase text-sm mb-6 block">Bienvenue en France</span>
                        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-8 leading-tight">
                            Votre intégration, <br />
                            <span className="text-[#C1272D]">notre priorité.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed font-light">
                            Plateforme centralisée regroupant l'accompagnement administratif, social, culturel et sportif par les étudiants, pour les étudiants.
                        </p>
                        <div className="flex flex-wrap gap-4 mt-8">
                            <a href="#missions" className="bg-[#C1272D] text-white px-8 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-red-800 transition-all shadow-md hover:shadow-lg">
                                Découvrir <ArrowRight size={20} />
                            </a>
                            <button
                                onClick={handleDownload}
                                className="bg-[#006233] text-white px-8 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-green-800 transition-all shadow-md hover:shadow-lg"
                            >
                                Télécharger le guide <FileDown size={20} />
                            </button>
                            <a href="#contact" className="bg-white border-2 border-gray-200 text-gray-800 px-8 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
                                Nous contacter
                            </a>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative"
                    >
                        <div className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl border border-gray-100 relative bg-gray-50">
                            <img
                                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2000&auto=format&fit=crop"
                                alt="Étudiants"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent flex items-end p-6 md:p-10">
                                {/* Rotating Testimonials */}
                                <div className="w-full relative min-h-[140px]">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentIndex}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.5, ease: "easeInOut" }}
                                            className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl w-full"
                                        >
                                            <div className="flex gap-4">
                                                <div className="shrink-0">
                                                    <div className="w-10 h-10 rounded-xl bg-[#C1272D]/10 flex items-center justify-center">
                                                        <Quote className="w-5 h-5 text-[#C1272D]" />
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-gray-800 font-semibold text-sm md:text-base leading-relaxed mb-3 italic">
                                                        &ldquo;{testimonials[currentIndex].quote}&rdquo;
                                                    </p>
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div>
                                                            <p className="font-extrabold text-[#006233] text-sm">{testimonials[currentIndex].author}</p>
                                                            <p className="text-[11px] text-gray-500 font-medium">{testimonials[currentIndex].context}</p>
                                                        </div>
                                                        <a
                                                            href="/guide/14"
                                                            className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-[#C1272D] bg-[#C1272D]/5 px-3 py-1.5 rounded-full hover:bg-[#C1272D]/10 transition-colors"
                                                        >
                                                            Lire son histoire →
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>

                                    {/* Progress dots */}
                                    <div className="flex justify-center gap-1.5 mt-4">
                                        {testimonials.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentIndex(idx)}
                                                className={`h-1.5 rounded-full transition-all duration-500 ${
                                                    idx === currentIndex
                                                        ? "w-8 bg-white"
                                                        : "w-1.5 bg-white/40 hover:bg-white/60"
                                                }`}
                                                aria-label={`Témoignage ${idx + 1}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Decorative background blobs */}
                        <div className="absolute -top-16 -right-16 w-80 h-80 bg-[#C1272D]/5 rounded-full blur-3xl -z-10"></div>
                        <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-[#006233]/5 rounded-full blur-3xl -z-10"></div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
