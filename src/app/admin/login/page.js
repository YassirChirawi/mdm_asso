"use client";
import React, { useState } from 'react';
import { Mail, Lock, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Email ou mot de passe incorrect");
            } else {
                router.push("/admin");
                router.refresh();
            }
        } catch (err) {
            setError("Une erreur est survenue");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-green/20 rounded-full blur-3xl -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl -ml-48 -mb-48"></div>
            </div>

            <div className="bg-white p-8 md:p-12 w-full max-w-md relative z-10 shadow-2xl rounded-[2.5rem] border border-gray-100">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-brand-dark rounded-2xl mx-auto mb-6 flex items-center justify-center text-brand-green text-2xl font-black shadow-lg italic">MDM</div>
                    <h1 className="text-2xl font-black text-brand-dark tracking-tighter uppercase">Administration</h1>
                    <p className="text-gray-500 mt-2 font-medium">Connectez-vous pour gérer l'association</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold animate-pulse">
                        <AlertCircle size={18} /> {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-4 text-gray-400" size={18} />
                            <input
                                type="email" required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-brand-green outline-none transition-all bg-gray-50 font-medium"
                                placeholder="admin@mdm.fr"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Mot de passe</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-4 text-gray-400" size={18} />
                            <input
                                type="password" required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-brand-green outline-none transition-all bg-gray-50 font-medium"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-dark text-white py-5 rounded-2xl font-black text-lg hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl hover:shadow-brand-green/20 disabled:opacity-50 uppercase tracking-tighter"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "Se Connecter"}
                    </button>
                </form>

                <a href="/" className="mt-8 flex items-center justify-center gap-2 text-gray-400 hover:text-brand-dark transition-all text-sm font-bold uppercase tracking-widest">
                    <ArrowLeft size={16} /> Retour au site
                </a>
            </div>
        </div>
    );
}
