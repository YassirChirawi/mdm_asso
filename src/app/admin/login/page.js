"use client";
import React from 'react';
import { Mail, Lock, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-primary flex items-center justify-center p-4">
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -ml-48 -mb-48"></div>
            </div>

            <div className="glass-card bg-white p-8 md:p-12 w-full max-w-md relative z-10 shadow-2xl">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-primary rounded-2xl mx-auto mb-6 flex items-center justify-center text-secondary text-2xl font-bold shadow-lg">MDM</div>
                    <h1 className="text-2xl font-bold text-gray-900">Espace Administration</h1>
                    <p className="text-gray-500 mt-2">Connectez-vous pour gérer les messages</p>
                </div>

                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            <input
                                type="email" required
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                                placeholder="admin@mdm.fr"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Mot de passe</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            <input
                                type="password" required
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                            <span className="text-sm text-gray-600">Rester connecté</span>
                        </label>
                        <a href="#" className="text-sm text-primary font-bold hover:underline">Oublié ?</a>
                    </div>

                    <button
                        type="button"
                        onClick={() => window.location.href = '/admin'}
                        className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-dark transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-primary/30"
                    >
                        Connexion
                    </button>
                </form>

                <a href="/" className="mt-8 flex items-center justify-center gap-2 text-gray-400 hover:text-primary transition-all text-sm">
                    <ArrowLeft size={16} /> Retour au site
                </a>
            </div>
        </div>
    );
}
