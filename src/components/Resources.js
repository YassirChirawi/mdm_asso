"use client";
import React, { useState, useEffect } from 'react';
import { Download, FileText, CheckCircle } from 'lucide-react';

export default function Resources() {
    const [downloadCount, setDownloadCount] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        // Fetch initial download count
        fetch('/api/stats?file=guide-etudiant.pdf')
            .then(res => res.json())
            .then(data => setDownloadCount(data.count || 0))
            .catch(() => setDownloadCount(0));
    }, []);

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const response = await fetch('/api/download', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileName: 'guide-etudiant.pdf' }),
            });

            if (response.ok) {
                // Increment local count for UX
                setDownloadCount(prev => prev + 1);
                // Trigger file download (link to the actual file)
                window.open('/documents/guide-etudiant-marocain.pdf', '_blank');
            }
        } catch (error) {
            console.error('Download failed', error);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <section id="resources" className="py-32 bg-gray-50 border-y border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 -skew-x-12 translate-x-1/2 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-[100rem] mx-auto px-6 sm:px-10 lg:px-16 relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center">
                    <div className="animate-fade-in">
                        <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-8 tracking-tight">Ressources <span className="text-secondary">Utiles</span></h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-accent to-primary mb-10 rounded-full"></div>
                        <p className="text-2xl text-gray-600 mb-10 font-light leading-relaxed">
                            Téléchargez notre guide complet pour préparer votre arrivée et faciliter votre intégration en France.
                        </p>
                        <div className="space-y-6 mb-12">
                            <div className="flex items-center gap-5 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <CheckCircle className="text-primary w-8 h-8" />
                                <span className="text-gray-800 font-medium text-lg">Checklist administrative complète</span>
                            </div>
                            <div className="flex items-center gap-5 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <CheckCircle className="text-primary w-8 h-8" />
                                <span className="text-gray-800 font-medium text-lg">Guide du logement et des aides</span>
                            </div>
                            <div className="flex items-center gap-5 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <CheckCircle className="text-primary w-8 h-8" />
                                <span className="text-gray-800 font-medium text-lg">Bons plans et vie étudiante</span>
                            </div>
                        </div>

                        <button
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className="bg-secondary border border-green-600 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-secondary-light hover:shadow-[0_10px_30px_-10px_rgba(0,163,85,0.6)] hover:-translate-y-1 transition-all flex items-center justify-center gap-4 group disabled:opacity-70"
                        >
                            <Download className="group-hover:-translate-y-1 transition-transform" />
                            {isDownloading ? 'Préparation...' : 'Télécharger le Guide'}
                        </button>
                        <p className="mt-6 text-base text-gray-500 font-medium">
                            Déjà téléchargé <span className="text-primary font-bold">{downloadCount}</span> fois par la communauté.
                        </p>
                    </div>

                    <div className="animate-fade-in flex justify-center" style={{ animationDelay: '0.2s' }}>
                        <div className="relative group cursor-pointer w-full max-w-lg" onClick={handleDownload}>
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative bg-white border border-gray-100 p-16 rounded-[2.5rem] flex flex-col items-center transform transition-all duration-500 group-hover:-translate-y-2 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] group-hover:shadow-[0_30px_60px_-15px_rgba(193,39,45,0.2)]">
                                <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-10 shadow-inner group-hover:bg-primary/5 transition-colors">
                                    <FileText size={64} className="text-primary drop-shadow-sm" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-4xl font-black text-gray-900 text-center tracking-tight leading-tight mb-4">Guide de l'Étudiant <br /> <span className="text-secondary">Marocain</span></h3>
                                <p className="text-gray-500 font-bold tracking-widest uppercase text-sm">PDF • 5.2 MB • Edition 2025</p>
                                <div className="mt-10 px-8 py-3 bg-green-50 text-green-700 border border-green-200 rounded-full text-base font-bold shadow-sm group-hover:bg-green-100 transition-colors">
                                    Disponible Gratuitement
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
