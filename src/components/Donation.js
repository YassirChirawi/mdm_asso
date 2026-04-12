"use client";
import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Donation() {
    const [selectedAmount, setSelectedAmount] = useState(20);
    const amounts = [10, 20, 50];

    return (
        <section id="don" className="py-32 bg-[#FFFFFF] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-gray-50 border border-gray-200 p-12 md:p-20 rounded-[3rem] shadow-sm relative overflow-hidden max-w-5xl mx-auto"
                >
                    <div className="absolute top-0 right-0 w-80 h-80 bg-[#C1272D]/5 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="w-24 h-24 bg-white shadow-sm border border-gray-100 text-[#C1272D] rounded-full flex items-center justify-center mx-auto mb-8">
                        <Heart size={48} className="fill-current" />
                    </div>
                    <h2 className="text-5xl font-extrabold text-gray-900 mb-6">Soutenez notre mission</h2>
                    <p className="text-gray-600 mb-16 text-xl font-light max-w-2xl mx-auto leading-relaxed">
                        Votre don est essentiel pour financer nos événements et garantir l'accompagnement d'urgence aux étudiants en situation précaire.
                    </p>

                    <div className="grid grid-cols-3 gap-6 mb-12 max-w-2xl mx-auto">
                        {amounts.map((amount) => (
                            <button
                                key={amount}
                                onClick={() => setSelectedAmount(amount)}
                                className={`py-6 rounded-2xl font-black text-3xl transition-all ${selectedAmount === amount
                                        ? 'bg-[#006233] text-white shadow-lg border-2 border-[#006233] scale-105'
                                        : 'bg-white text-gray-800 border-2 border-gray-200 hover:border-[#006233] hover:text-[#006233]'
                                    }`}
                            >
                                {amount} €
                            </button>
                        ))}
                    </div>

                    <button className="max-w-2xl mx-auto w-full bg-[#C1272D] text-white py-6 rounded-2xl font-bold text-2xl hover:bg-red-800 transition-colors shadow-lg flex items-center justify-center gap-4 hover:-translate-y-1">
                        Faire un don symbolique de {selectedAmount} € <Heart size={24} className="fill-current" />
                    </button>

                    <p className="text-sm font-medium text-gray-500 mt-8 bg-white inline-block px-6 py-3 border border-gray-200 rounded-full shadow-sm">
                        🔒 Paiement 100% sécurisé via HelloAsso.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
