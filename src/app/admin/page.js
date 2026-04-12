"use client";
import React, { useState, useEffect } from 'react';
import { Mail, Download, MessageSquare, Trash2, ArrowLeft, LogOut, Loader2, BarChart3, Users, BookOpen, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
    const [messages, setMessages] = useState([]);
    const [chapterStats, setChapterStats] = useState([]);
    const [stats, setStats] = useState({ downloads: 0, messages: 0, totalViews: 0, estimatedReaders: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [msgRes, downloadStatRes, chapterStatRes] = await Promise.all([
                fetch('/api/admin/messages'),
                fetch('/api/stats?file=guide-etudiant.pdf'),
                fetch('/api/stats/chapter')
            ]);

            const msgData = await msgRes.json();
            const downloadStatData = await downloadStatRes.json();
            const chapterStatData = await chapterStatRes.json();

            const totalViews = chapterStatData.reduce((acc, curr) => acc + curr.views, 0);
            const estimatedReaders = Math.max(...(chapterStatData.map(s => s.views) || [0]), 0);

            setMessages(msgData || []);
            setChapterStats(chapterStatData || []);
            setStats({
                messages: msgData.length || 0,
                downloads: downloadStatData.count || 0,
                totalViews,
                estimatedReaders
            });
        } catch (error) {
            console.error('Failed to fetch admin data', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteMessage = async (id) => {
        if (!confirm('Supprimer ce message ?')) return;
        try {
            await fetch(`/api/admin/messages?id=${id}`, { method: 'DELETE' });
            setMessages(messages.filter(m => m.id !== id));
            setStats(prev => ({ ...prev, messages: prev.messages - 1 }));
        } catch (error) {
            alert('Erreur lors de la suppression');
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-brand-green w-12 h-12" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar / Header */}
            <nav className="bg-brand-dark text-white p-6 shadow-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <a href="/" className="p-2 hover:bg-white/10 rounded-full transition-all">
                            <ArrowLeft />
                        </a>
                        <h1 className="text-xl font-bold italic tracking-tighter">
                            MDM <span className="text-brand-green">Admin</span>
                        </h1>
                    </div>
                    <button className="flex items-center gap-2 bg-white/10 hover:bg-brand-red text-white px-4 py-2 rounded-xl transition-all font-bold">
                        <LogOut size={18} /> Déconnexion
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-6 md:p-12">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div className="p-3 bg-brand-green/10 rounded-xl text-brand-green w-fit mb-4">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Lecteurs Estimés</p>
                            <p className="text-3xl font-black text-brand-dark">{stats.estimatedReaders}</p>
                        </div>
                    </div>
                    
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500 w-fit mb-4">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Lectures Totales</p>
                            <p className="text-3xl font-black text-brand-dark">{stats.totalViews}</p>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div className="p-3 bg-brand-red/10 rounded-xl text-brand-red w-fit mb-4">
                            <MessageSquare size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Messages Reçus</p>
                            <p className="text-3xl font-black text-brand-dark">{stats.messages}</p>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div className="p-3 bg-gray-100 rounded-xl text-gray-600 w-fit mb-4">
                            <Download size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">PDF Téléchargés</p>
                            <p className="text-3xl font-black text-brand-dark">{stats.downloads}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Chapter Performances */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-full">
                            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="text-lg font-black text-brand-dark flex items-center gap-2 tracking-tighter uppercase">
                                    <BarChart3 className="w-5 h-5 text-brand-green" /> Lectures / Chapitre
                                </h2>
                            </div>
                            <div className="p-6">
                                {chapterStats.length === 0 ? (
                                    <p className="text-center py-10 text-gray-400">Aucune lecture enregistrée.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {chapterStats.map((chapter) => (
                                            <div key={chapter.id} className="group">
                                                <div className="flex justify-between items-center mb-2 font-bold text-sm">
                                                    <span className="text-gray-600">Chapitre {chapter.chapterId}</span>
                                                    <span className="text-brand-dark">{chapter.views} vues</span>
                                                </div>
                                                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                                    <div 
                                                        className="bg-brand-green h-full rounded-full transition-all duration-1000"
                                                        style={{ width: `${(chapter.views / stats.estimatedReaders) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Messages List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h2 className="text-lg font-black text-brand-dark flex items-center gap-2 tracking-tighter uppercase">
                                    <Mail className="w-5 h-5 text-brand-red" /> Messages Récents
                                </h2>
                                <button onClick={fetchData} className="bg-brand-green/10 text-brand-green px-4 py-1.5 rounded-full text-xs font-black tracking-widest hover:bg-brand-green hover:text-white transition-all">
                                    RAFRAÎCHIR
                                </button>
                            </div>

                            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                                {messages.length === 0 ? (
                                    <div className="p-12 text-center text-gray-400 flex flex-col items-center gap-4">
                                        <AlertCircle className="w-12 h-12 opacity-20" />
                                        <p className="font-medium">Aucun message reçu pour le moment.</p>
                                    </div>
                                ) : (
                                    messages.map((msg) => (
                                        <div key={msg.id} className="p-8 hover:bg-gray-50 transition-all group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="font-black text-brand-dark text-xl tracking-tight mb-1">{msg.subject}</h3>
                                                    <div className="flex flex-wrap gap-2 items-center">
                                                        <span className="text-sm font-bold text-gray-500">{msg.name}</span>
                                                        <span className="text-gray-300">•</span>
                                                        <span className="text-sm font-medium text-brand-green">{msg.email}</span>
                                                        <span className="text-gray-300">•</span>
                                                        <span className="text-[10px] font-black p-1 bg-gray-100 rounded text-gray-400 uppercase tracking-tighter">
                                                            {new Date(msg.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => deleteMessage(msg.id)}
                                                    className="p-3 text-gray-300 hover:text-brand-red hover:bg-brand-red/10 rounded-xl transition-all lg:opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                            <p className="text-gray-600 leading-relaxed font-medium bg-[#fafafa] p-6 rounded-[2rem] border border-gray-100 whitespace-pre-wrap">
                                                {msg.message}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
