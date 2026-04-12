"use client";
import React from 'react';
import { Info, MapPin, Calendar, FileText } from 'lucide-react';

export default function Activities() {
    const stats = [
        { label: "Création", value: "26 Août 2025" },
        { label: "Lieu", value: "Créteil, France" },
        { label: "Régime", value: "Loi 1901" },
        { label: "Établissement", value: "1 en activité" },
    ];

    return (
        <section id="activities" className="py-32 bg-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -ml-48 -mb-48 pointer-events-none"></div>

            <div className="max-w-[100rem] mx-auto px-6 sm:px-10 lg:px-16 relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center">
                    <div className="animate-fade-in">
                        <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-6 block flex items-center gap-3">
                            <span className="w-10 h-[2px] bg-secondary"></span>
                            À propos de nous
                        </span>
                        <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-8 leading-[1.1] tracking-tight">
                            Une structure solide pour porter vos <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">projets.</span>
                        </h2>
                        <div className="prose prose-lg text-gray-600 max-w-none">
                            <p className="mb-6 font-light leading-relaxed text-xl">
                                L’association <strong className="text-gray-900 font-bold">MAIN DANS LA MAIN ÉTUDIANTS MAROCAINS EN FRANCE</strong> est née d'une volonté commune de créer un pont entre le Maroc et la France pour faciliter l'arrivée et le séjour des étudiants.
                            </p>
                            <p className="mb-10 font-medium text-gray-700 text-xl border-l-4 border-primary pl-6 py-2 bg-gray-50 rounded-r-2xl">
                                Immatriculée sous le numéro RNA W941020600, notre siège social se situe au cœur de Créteil.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mt-12">
                            {stats.map((stat, idx) => (
                                <div key={stat.label} className="bg-white rounded-3xl p-8 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] border border-gray-100 hover:border-primary/20 hover:-translate-y-2 transition-all duration-300 group">
                                    <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-3 group-hover:text-primary transition-colors">{stat.label}</p>
                                    <p className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-secondary/30 rounded-[3rem] blur-2xl transform translate-x-6 translate-y-6 -z-10 hidden lg:block"></div>
                            <img
                                src="/images/solidarity.png"
                                alt="Solidarity"
                                className="rounded-[3rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.2)] relative z-10 w-full object-cover h-[700px] border border-white"
                            />
                            <div className="absolute -bottom-10 -left-10 bg-white/95 backdrop-blur-xl border border-gray-100 p-8 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] z-20 hidden md:block max-w-[20rem] hover:scale-105 transition-transform duration-500">
                                <div className="flex items-center gap-5 mb-6">
                                    <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                                        <Info size={32} strokeWidth={2.5} />
                                    </div>
                                    <span className="font-extrabold text-gray-900 tracking-tight text-xl leading-tight">Informations <br />Légales</span>
                                </div>
                                <div className="space-y-4 text-gray-600 font-medium bg-gray-50 p-5 rounded-2xl">
                                    <p className="flex justify-between items-center"><span className="text-xs uppercase tracking-widest text-gray-500">Siret</span> <span className="text-gray-900 font-bold tracking-wider">990 831 778 00016</span></p>
                                    <p className="flex justify-between items-center"><span className="text-xs uppercase tracking-widest text-gray-500">APE</span> <span className="text-gray-900 font-bold tracking-wider">94.99Z</span></p>
                                    <p className="flex justify-between items-center"><span className="text-xs uppercase tracking-widest text-gray-500">RNA</span> <span className="text-gray-900 font-bold tracking-wider">W941 020 600</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
