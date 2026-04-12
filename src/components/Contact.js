"use client";
import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setStatus({ type: 'success', message: 'Message envoyé avec succès !' });
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                throw new Error();
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Erreur lors de l\'envoi. Réessayez plus tard.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="contact" className="py-32 bg-[#FFFFFF] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-[#C1272D]/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-[#006233]/5 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                    <div>
                        <span className="text-[#C1272D] font-bold tracking-wider uppercase text-sm mb-6 block">Nous Contacter</span>
                        <h2 className="text-5xl font-extrabold text-gray-900 mb-8">Restons en contact</h2>
                        <p className="text-xl text-gray-600 mb-16 font-light leading-relaxed">
                            Une question, une suggestion ou besoin d'accompagnement ? N'hésitez pas à nous envoyer un message via le formulaire.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-center gap-6 bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"><MapPin className="text-[#006233]" size={32} /></div>
                                <div>
                                    <p className="font-extrabold text-gray-900 text-xl mb-1">Siège Social</p>
                                    <p className="text-gray-600 font-medium">27 AV DU GENERAL PIERRE BILLOTTE<br />94000 CRETEIL, FRANCE</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"><Mail className="text-[#C1272D]" size={32} /></div>
                                <div>
                                    <p className="font-extrabold text-gray-900 text-xl mb-1">Email</p>
                                    <p className="text-gray-600 font-medium">contact@mdm-etudiants.fr</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-10 md:p-14 rounded-[2rem] shadow-2xl border border-gray-100 relative">
                        <form className="space-y-8" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="block text-sm font-bold text-gray-900 uppercase tracking-widest pl-2">Nom Complet</label>
                                    <input
                                        type="text" required
                                        className="w-full px-6 py-5 font-medium rounded-2xl bg-gray-50 border-2 border-gray-100 focus:border-[#006233] focus:bg-white outline-none transition-all text-lg"
                                        placeholder="Votre nom"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-sm font-bold text-gray-900 uppercase tracking-widest pl-2">Email</label>
                                    <input
                                        type="email" required
                                        className="w-full px-6 py-5 font-medium rounded-2xl bg-gray-50 border-2 border-gray-100 focus:border-[#C1272D] focus:bg-white outline-none transition-all text-lg"
                                        placeholder="votre@email.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="block text-sm font-bold text-gray-900 uppercase tracking-widest pl-2">Sujet</label>
                                <input
                                    type="text" required
                                    className="w-full px-6 py-5 font-medium rounded-2xl bg-gray-50 border-2 border-gray-100 focus:border-[#006233] focus:bg-white outline-none transition-all text-lg"
                                    placeholder="Sujet du message"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="block text-sm font-bold text-gray-900 uppercase tracking-widest pl-2">Message</label>
                                <textarea rows="6" required
                                    className="w-full px-6 py-5 font-medium rounded-2xl bg-gray-50 border-2 border-gray-100 focus:border-[#006233] focus:bg-white outline-none transition-all resize-none text-lg"
                                    placeholder="Comment pouvons-nous vous aider ?"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                ></textarea>
                            </div>
                            {status.message && (
                                <div className={`p-4 rounded-xl flex items-center gap-3 font-medium ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                    {status.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                                    {status.message}
                                </div>
                            )}
                            <button type="submit" disabled={loading} className="bg-[#006233] text-white w-full py-6 rounded-2xl font-bold text-xl flex justify-center items-center gap-3 hover:bg-green-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 mt-6 disabled:opacity-50">
                                {loading ? <Loader2 className="animate-spin" /> : <>Envoyer le message <Send size={24} /></>}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
