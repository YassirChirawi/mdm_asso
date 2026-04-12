"use client";
import React from 'react';
import { ArrowRight, Info, FileDown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
    const handleDownload = async () => {
        try {
            // Track download
            await fetch('/api/download', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileName: 'guide-etudiant.pdf' })
            });
            // Open file
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
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent flex items-end p-10">
                                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl max-w-sm">
                                    <p className="font-extrabold text-[#006233] text-xl mb-2">Main dans la Main</p>
                                    <p className="text-sm font-medium text-gray-700 leading-relaxed">L'union fait la force pour une intégration réussie.</p>
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
