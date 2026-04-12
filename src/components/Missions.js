"use client";
import React from 'react';
import { FileText, Music, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Missions() {
    const missions = [
        {
            title: "Accompagnement administratif",
            desc: "Aide pour les démarches liées au séjour, au logement et aux inscriptions universitaires en France.",
            icon: <FileText size={32} className="text-white" />,
            bg: "bg-[#C1272D]",
            cardBg: "bg-white"
        },
        {
            title: "Événements culturels",
            desc: "Organisation d'événements pour célébrer la culture marocaine et favoriser le métissage culturel.",
            icon: <Music size={32} className="text-white" />,
            bg: "bg-[#006233]",
            cardBg: "bg-white"
        },
        {
            title: "Sport & Loisirs",
            desc: "Promotion du bien-être à travers des pratiques sportives de loisir et de nombreuses rencontres amicales.",
            icon: <Trophy size={32} className="text-gray-900" />,
            bg: "bg-gray-100",
            cardBg: "bg-white"
        }
    ];

    return (
        <section id="missions" className="py-32 bg-gray-50 border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <span className="text-[#C1272D] font-bold tracking-wider uppercase text-sm mb-6 block">Notre Raison d'être</span>
                    <h2 className="text-5xl font-extrabold text-gray-900 mb-8">Nos Missions au Quotidien</h2>
                    <p className="text-xl font-light leading-relaxed text-gray-600">
                        Un accompagnement global pour vous aider à vous épanouir et réussir votre parcours en France, tout en gardant un lien fort avec la culture marocaine.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {missions.map((mission, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`${mission.cardBg} p-10 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}
                        >
                            <div className={`w-20 h-20 rounded-2xl ${mission.bg} flex items-center justify-center mb-8 shadow-sm`}>
                                {mission.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">{mission.title}</h3>
                            <p className="text-gray-600 font-medium leading-relaxed text-lg">{mission.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
