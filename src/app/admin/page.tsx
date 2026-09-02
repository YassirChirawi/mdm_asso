"use client";
import React, { useState, useEffect } from 'react';
import { Mail, Download, MessageSquare, Trash2, ArrowLeft, LogOut, Loader2, BarChart3, Users, BookOpen, AlertCircle, FileText, Upload, Plus, X, Heart, RefreshCcw, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import { signOut } from "next-auth/react";

interface Message {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: string;
}

interface Donation {
    id: string;
    name: string;
    email: string;
    amount: number;
    currency: string;
    createdAt: string;
}

interface ChapterStat {
    id: string;
    chapterId: string;
    views: number;
}

interface Document {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
    createdAt: string;
}

interface Benevole {
    id: string;
    prenom: string;
    nom: string;
    email: string;
    ville?: string;
    disponibilite?: string;
    roles?: string;
    motivation: string;
    createdAt: string;
}

interface Adhesion {
    id: string;
    prenom: string;
    nom: string;
    email: string;
    ville?: string;
    message?: string;
    statut: string;
    createdAt: string;
}

interface ChapterComment {
    id: string;
    chapterId: string;
    prenom: string;
    email?: string;
    message: string;
    approved: boolean;
    createdAt: string;
}

/** Un benevole est compte comme candidat mentor s'il a coche ce role. */
const estMentor = (b: Benevole) => (b.roles || "").toLowerCase().includes("mentor");

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('stats');
    const [messages, setMessages] = useState<Message[]>([]);
    const [donations, setDonations] = useState<Donation[]>([]);
    const [chapterStats, setChapterStats] = useState<ChapterStat[]>([]);
    const [stats, setStats] = useState({ downloads: 0, messages: 0, totalViews: 0, estimatedReaders: 0, totalDonations: 0 });
    const [documents, setDocuments] = useState<Document[]>([]);
    const [benevoles, setBenevoles] = useState<Benevole[]>([]);
    const [adhesions, setAdhesions] = useState<Adhesion[]>([]);
    const [comments, setComments] = useState<ChapterComment[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [newDoc, setNewDoc] = useState({ name: '', type: 'Statuts' });
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        fetchData();
        fetchDocuments();
        fetchBenevoles();
        fetchAdhesions();
        fetchComments();
    }, []);

    const fetchComments = async () => {
        try {
            const res = await fetch('/api/admin/comments');
            const data = await res.json();
            setComments(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Chargement des echanges impossible', error);
        }
    };

    const modererComment = async (id: string, approved: boolean) => {
        await fetch('/api/admin/comments', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, approved }),
        });
        setComments(prev => prev.map(c => (c.id === id ? { ...c, approved } : c)));
    };

    const supprimerComment = async (id: string) => {
        await fetch(`/api/admin/comments?id=${id}`, { method: 'DELETE' });
        setComments(prev => prev.filter(c => c.id !== id));
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [msgRes, downloadStatRes, chapterStatRes, donationsRes] = await Promise.all([
                fetch('/api/admin/messages'),
                fetch('/api/stats?file=guide-etudiant.pdf'),
                fetch('/api/stats/chapter'),
                fetch('/api/admin/donations')
            ]);

            const msgData = await msgRes.json().catch(() => []);
            const downloadStatData = await downloadStatRes.json().catch(() => ({ count: 0 }));
            const chapterStatData = await chapterStatRes.json().catch(() => []);
            const donationsData = await donationsRes.json().catch(() => []);

            // Assurer que les données sont des tableaux
            const safeMessages = Array.isArray(msgData) ? msgData : [];
            const safeChapterStats = Array.isArray(chapterStatData) ? chapterStatData : [];
            const safeDonations = Array.isArray(donationsData) ? donationsData : [];

            const totalViews = safeChapterStats.reduce((acc, curr) => acc + (curr.views || 0), 0);
            const estimatedReaders = safeChapterStats.length > 0 
                ? Math.max(...safeChapterStats.map(s => (s as any).views || 0)) 
                : 0;

            const totalDonations = safeDonations.reduce((acc, curr) => acc + (curr.amount || 0), 0);

            setMessages(safeMessages as any);
            setChapterStats(safeChapterStats as any);
            setDonations(safeDonations as any);
            setStats({
                messages: safeMessages.length,
                downloads: downloadStatData.count || 0,
                totalViews,
                estimatedReaders,
                totalDonations
            });
        } catch (error) {
            console.error('Failed to fetch admin data', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDocuments = async () => {
        try {
            const res = await fetch('/api/admin/documents');
            const data = await res.json();
            if (!data.error) setDocuments(data);
        } catch (error) {
            console.error('Failed to fetch documents', error);
        }
    };

    const fetchBenevoles = async () => {
        try {
            const res = await fetch('/api/admin/benevoles');
            const data = await res.json();
            if (Array.isArray(data)) setBenevoles(data);
        } catch (error) {
            console.error('Failed to fetch benevoles', error);
        }
    };

    const fetchAdhesions = async () => {
        try {
            const res = await fetch('/api/admin/adhesions');
            const data = await res.json();
            if (Array.isArray(data)) setAdhesions(data);
        } catch (error) {
            console.error('Failed to fetch adhesions', error);
        }
    };

    const updateAdhesionStatut = async (id: string, statut: string) => {
        try {
            const res = await fetch('/api/admin/adhesions', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, statut }),
            });
            if (res.ok) setAdhesions(prev => prev.map(a => a.id === id ? { ...a, statut } : a));
        } catch (error) {
            console.error('Failed to update adhesion', error);
        }
    };

    const deleteBenevole = async (id: string) => {
        if (!confirm('Supprimer cette candidature ?')) return;
        await fetch(`/api/admin/benevoles?id=${id}`, { method: 'DELETE' });
        setBenevoles(prev => prev.filter(b => b.id !== id));
    };

    const deleteAdhesion = async (id: string) => {
        if (!confirm('Supprimer cette adhésion ?')) return;
        await fetch(`/api/admin/adhesions?id=${id}`, { method: 'DELETE' });
        setAdhesions(prev => prev.filter(a => a.id !== id));
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', newDoc.name || file.name);
        formData.append('type', newDoc.type);

        try {
            const res = await fetch('/api/admin/documents', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.error) {
                alert(data.error);
            } else {
                setDocuments([data, ...documents]);
                setShowUploadModal(false);
                setFile(null);
                setNewDoc({ name: '', type: 'Statuts' });
            }
        } catch (error) {
            alert('Erreur lors du téléversement');
        } finally {
            setUploading(false);
        }
    };

    const deleteDocument = async (id: string) => {
        if (!confirm('Supprimer ce document ?')) return;
        try {
            await fetch(`/api/admin/documents?id=${id}`, { method: 'DELETE' });
            setDocuments(documents.filter(d => d.id !== id));
        } catch (error) {
            alert('Erreur lors de la suppression');
        }
    };

    const deleteMessage = async (id: string) => {
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
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Sidebar / Header */}
            <nav className="bg-brand-dark text-white p-6 shadow-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <a href="/" className="p-2 hover:bg-white/10 rounded-full transition-all">
                            <ArrowLeft />
                        </a>
                        <h1 className="text-xl font-black italic tracking-tighter">
                            MDM <span className="text-brand-green">Admin</span>
                        </h1>
                        <div className="hidden md:flex items-center gap-2 ml-8 bg-white/5 p-1 rounded-2xl">
                            {[
                                { id: 'stats', label: 'DASHBOARD' },
                                { id: 'infos', label: "DEMANDES D'INFOS" },
                                { id: 'mentorat', label: 'MENTORAT' },
                                { id: 'echanges', label: 'ÉCHANGES' },
                                { id: 'benevoles', label: 'BÉNÉVOLES' },
                                { id: 'adhesions', label: 'ADHÉRENTS' },
                                { id: 'donations', label: 'DONS' },
                                { id: 'documents', label: 'DOCUMENTS' },
                            ].map(tab => (
                                <button key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-5 py-2 rounded-xl text-sm font-black tracking-tighter transition-all ${
                                        activeTab === tab.id ? 'bg-brand-green text-brand-dark' : 'hover:bg-white/10'
                                    }`}>
                                    {tab.label}
                                    {tab.id === 'benevoles' && benevoles.length > 0 && (
                                        <span className="ml-2 bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-full">{benevoles.length}</span>
                                    )}
                                    {tab.id === 'adhesions' && adhesions.length > 0 && (
                                        <span className="ml-2 bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-full">{adhesions.length}</span>
                                    )}
                                    {tab.id === 'infos' && messages.length > 0 && (
                                        <span className="ml-2 bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-full">{messages.length}</span>
                                    )}
                                    {tab.id === 'mentorat' && benevoles.filter(estMentor).length > 0 && (
                                        <span className="ml-2 bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-full">{benevoles.filter(estMentor).length}</span>
                                    )}
                                    {tab.id === 'echanges' && comments.filter(c => !c.approved).length > 0 && (
                                        <span className="ml-2 bg-brand-red text-white text-[10px] px-1.5 py-0.5 rounded-full">{comments.filter(c => !c.approved).length}</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={fetchData}
                            className="p-2 hover:bg-white/10 rounded-xl transition-all"
                            title="Rafraîchir les données"
                        >
                            <RefreshCcw size={18} />
                        </button>
                        <button 
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="flex items-center gap-2 bg-white/10 hover:bg-brand-red text-white px-4 py-2 rounded-xl transition-all font-bold"
                        >
                            <LogOut size={18} /> Déconnexion
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-6 md:p-12">
                {activeTab === 'stats' && (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
                                <div className="p-3 bg-brand-green/10 rounded-xl text-brand-green w-fit mb-4">
                                    <Heart size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total des Dons</p>
                                    <p className="text-3xl font-black text-brand-dark">{(stats.totalDonations / 100).toFixed(2)}€</p>
                                </div>
                            </div>
                            
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
                                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500 w-fit mb-4">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Lecteurs Estimés</p>
                                    <p className="text-3xl font-black text-brand-dark">{stats.estimatedReaders}</p>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
                                <div className="p-3 bg-blue-400/10 rounded-xl text-blue-400 w-fit mb-4">
                                    <BookOpen size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Lectures Totales</p>
                                    <p className="text-3xl font-black text-brand-dark">{stats.totalViews}</p>
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
                                                                style={{ width: `${stats.estimatedReaders > 0 ? (chapter.views / stats.estimatedReaders) * 100 : 0}%` }}
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
                    </>
                )}
                
                {activeTab === 'infos' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="mb-10">
                            <h2 className="text-3xl font-black text-brand-dark tracking-tighter uppercase">Demandes d&apos;infos</h2>
                            <p className="text-gray-500 font-medium">Messages reçus via le formulaire de contact</p>
                        </div>

                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                            {messages.length === 0 ? (
                                <div className="text-center py-20 text-gray-400">
                                    <Mail size={48} className="mx-auto mb-4 opacity-20" />
                                    <p className="font-bold tracking-widest uppercase text-xs">Aucune demande reçue</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {messages.map((msg) => (
                                        <div key={msg.id} className="p-6 bg-gray-50 rounded-3xl border border-transparent hover:border-gray-100 hover:bg-white hover:shadow-lg transition-all">
                                            <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                                                <div className="min-w-0">
                                                    <p className="font-black text-brand-dark text-lg">{msg.name}</p>
                                                    <a href={`mailto:${msg.email}`} className="text-brand-green text-sm font-semibold break-all">{msg.email}</a>
                                                    <p className="text-gray-500 text-sm mt-1 font-bold">{msg.subject}</p>
                                                </div>
                                                <div className="flex items-center gap-3 shrink-0">
                                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                        {new Date(msg.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </span>
                                                    <button onClick={() => deleteMessage(msg.id)}
                                                        className="p-2.5 text-gray-300 hover:text-brand-red hover:bg-brand-red/10 rounded-xl transition-all">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 leading-relaxed bg-white p-5 rounded-2xl border border-gray-100 whitespace-pre-wrap break-words">{msg.message}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'mentorat' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="mb-10">
                            <h2 className="text-3xl font-black text-brand-dark tracking-tighter uppercase">Demandes de mentorat</h2>
                            <p className="text-gray-500 font-medium">
                                Bénévoles ayant coché le rôle « Tuteur / Mentor » dans leur candidature
                            </p>
                        </div>

                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                            {benevoles.filter(estMentor).length === 0 ? (
                                <div className="text-center py-20 text-gray-400">
                                    <Users size={48} className="mx-auto mb-4 opacity-20" />
                                    <p className="font-bold tracking-widest uppercase text-xs">Aucune demande de mentorat</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {benevoles.filter(estMentor).map((b) => (
                                        <div key={b.id} className="p-6 bg-gray-50 rounded-3xl border border-transparent hover:border-gray-100 hover:bg-white hover:shadow-lg transition-all">
                                            <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                                                <div className="min-w-0">
                                                    <p className="font-black text-brand-dark text-lg">{b.prenom} {b.nom}</p>
                                                    <a href={`mailto:${b.email}`} className="text-brand-green text-sm font-semibold break-all">{b.email}</a>
                                                    <p className="text-gray-500 text-sm mt-1">
                                                        {[b.ville, b.disponibilite].filter(Boolean).join(' · ') || 'Disponibilité non précisée'}
                                                    </p>
                                                </div>
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest shrink-0">
                                                    {new Date(b.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </span>
                                            </div>
                                            {b.roles && (
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {b.roles.split(',').map((role, i) => (
                                                        <span key={i} className="text-[11px] font-bold px-3 py-1 rounded-full bg-brand-green/10 text-brand-green">
                                                            {role.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            <p className="text-gray-600 leading-relaxed bg-white p-5 rounded-2xl border border-gray-100 whitespace-pre-wrap break-words">{b.motivation}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'echanges' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="mb-10">
                            <h2 className="text-3xl font-black text-brand-dark tracking-tighter uppercase">Échanges du guide</h2>
                            <p className="text-gray-500 font-medium">
                                Rien n&apos;est visible sur le site tant que tu n&apos;as pas approuvé le message
                            </p>
                        </div>

                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                            {comments.length === 0 ? (
                                <div className="text-center py-20 text-gray-400">
                                    <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                                    <p className="font-bold tracking-widest uppercase text-xs">Aucun échange pour le moment</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {comments.map((c) => (
                                        <div key={c.id} className={`p-6 rounded-3xl border transition-all ${c.approved ? 'bg-gray-50 border-transparent' : 'bg-brand-red/5 border-brand-red/20'}`}>
                                            <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                                                <div className="min-w-0">
                                                    <p className="font-black text-brand-dark text-lg">
                                                        {c.prenom}
                                                        <a href={`/guide/${c.chapterId}#echanges`} target="_blank" rel="noopener noreferrer"
                                                            className="ml-3 text-xs font-bold uppercase tracking-widest text-brand-green hover:underline">
                                                            Chapitre {c.chapterId}
                                                        </a>
                                                    </p>
                                                    {c.email && <span className="text-gray-400 text-sm break-all">{c.email}</span>}
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                        {new Date(c.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </span>
                                                    <button onClick={() => modererComment(c.id, !c.approved)}
                                                        title={c.approved ? 'Retirer du site' : 'Publier sur le site'}
                                                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${c.approved ? 'bg-gray-200 text-gray-600 hover:bg-gray-300' : 'bg-brand-green text-white hover:bg-brand-dark'}`}>
                                                        {c.approved ? 'Retirer' : 'Publier'}
                                                    </button>
                                                    <button onClick={() => supprimerComment(c.id)}
                                                        className="p-2.5 text-gray-300 hover:text-brand-red hover:bg-brand-red/10 rounded-xl transition-all">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 leading-relaxed bg-white p-5 rounded-2xl border border-gray-100 whitespace-pre-wrap break-words">{c.message}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'donations' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h2 className="text-3xl font-black text-brand-dark tracking-tighter uppercase">Dons effectués</h2>
                                <p className="text-gray-500 font-medium">Historique des dons reçus</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                            {donations.length === 0 ? (
                                <div className="text-center py-20 text-gray-400">
                                    <Heart size={48} className="mx-auto mb-4 opacity-20" />
                                    <p className="font-bold tracking-widest uppercase text-xs">Aucun don enregistré</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {donations.map((don) => (
                                        <div key={don.id} className="flex justify-between items-center p-6 bg-gray-50 rounded-3xl hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-gray-100">
                                            <div className="flex items-center gap-4">
                                                <div className="p-4 bg-brand-green/10 text-brand-green rounded-2xl">
                                                    <Heart size={24} />
                                                </div>
                                                <div>
                                                    <p className="font-black text-brand-dark text-lg">{don.name}</p>
                                                    <p className="text-gray-500 text-sm">{don.email}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-2xl text-brand-dark">
                                                    {(don.amount / 100).toFixed(2)} {don.currency.toUpperCase()}
                                                </p>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                    {new Date(don.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── BÉNÉVOLES ── */}
                {activeTab === 'benevoles' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h2 className="text-3xl font-black text-brand-dark tracking-tighter uppercase flex items-center gap-3">
                                    <Sparkles className="text-violet-500" size={28} /> Candidatures Bénévoles
                                </h2>
                                <p className="text-gray-500 font-medium">{benevoles.length} candidature{benevoles.length > 1 ? 's' : ''} reçue{benevoles.length > 1 ? 's' : ''}</p>
                            </div>
                        </div>
                        <div className="space-y-5">
                            {benevoles.length === 0 ? (
                                <div className="bg-white rounded-3xl p-16 text-center text-gray-400 border border-gray-100">
                                    <Sparkles size={48} className="mx-auto mb-4 opacity-20" />
                                    <p className="font-bold uppercase tracking-widest text-xs">Aucune candidature reçue</p>
                                </div>
                            ) : benevoles.map(b => (
                                <div key={b.id} className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-black text-xl text-brand-dark">{b.prenom} {b.nom}</h3>
                                            <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
                                                <a href={`mailto:${b.email}`} className="text-brand-green font-semibold hover:underline">{b.email}</a>
                                                {b.ville && <span>📍 {b.ville}</span>}
                                                {b.disponibilite && <span>🕐 {b.disponibilite}</span>}
                                            </div>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <a href={`mailto:${b.email}`} className="p-2.5 bg-brand-green/10 text-brand-green rounded-xl hover:bg-brand-green hover:text-white transition-all">
                                                <Mail size={16} />
                                            </a>
                                            <button onClick={() => deleteBenevole(b.id)} className="p-2.5 bg-gray-100 text-gray-400 rounded-xl hover:bg-brand-red hover:text-white transition-all">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    {b.roles && (
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {b.roles.split(', ').map(r => (
                                                <span key={r} className="px-3 py-1 bg-violet-50 text-violet-600 text-xs font-semibold rounded-full">{r}</span>
                                            ))}
                                        </div>
                                    )}
                                    <p className="text-gray-600 text-sm bg-gray-50 rounded-xl p-4 leading-relaxed">{b.motivation}</p>
                                    <p className="text-xs text-gray-300 mt-3">{new Date(b.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── ADHÉRENTS ── */}
                {activeTab === 'adhesions' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h2 className="text-3xl font-black text-brand-dark tracking-tighter uppercase flex items-center gap-3">
                                    <Heart className="text-brand-red" size={28} /> Demandes d'Adhésion
                                </h2>
                                <p className="text-gray-500 font-medium">
                                    {adhesions.filter(a => a.statut === 'validé').length} validé(s) · {adhesions.filter(a => a.statut === 'en_attente').length} en attente
                                </p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {adhesions.length === 0 ? (
                                <div className="bg-white rounded-3xl p-16 text-center text-gray-400 border border-gray-100">
                                    <Heart size={48} className="mx-auto mb-4 opacity-20" />
                                    <p className="font-bold uppercase tracking-widest text-xs">Aucune demande d'adhésion</p>
                                </div>
                            ) : adhesions.map(a => (
                                <div key={a.id} className={`bg-white rounded-2xl p-6 border shadow-sm transition-all group ${
                                    a.statut === 'validé' ? 'border-brand-green/30' :
                                    a.statut === 'refusé' ? 'border-red-200' : 'border-gray-100'
                                }`}>
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="font-black text-lg text-brand-dark">{a.prenom} {a.nom}</h3>
                                                <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase rounded-full ${
                                                    a.statut === 'validé' ? 'bg-green-100 text-green-700' :
                                                    a.statut === 'refusé' ? 'bg-red-100 text-red-600' :
                                                    'bg-amber-100 text-amber-700'
                                                }`}>
                                                    {a.statut === 'en_attente' ? '⏳ En attente' : a.statut === 'validé' ? '✓ Validé' : '✗ Refusé'}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                                                <a href={`mailto:${a.email}`} className="text-brand-red font-semibold hover:underline">{a.email}</a>
                                                {a.ville && <span>📍 {a.ville}</span>}
                                                <span className="text-xs text-gray-300">{new Date(a.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            </div>
                                            {a.message && <p className="text-xs text-gray-500 mt-2 bg-gray-50 rounded-lg p-3">{a.message}</p>}
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            {a.statut !== 'validé' && (
                                                <button onClick={() => updateAdhesionStatut(a.id, 'validé')}
                                                    className="p-2.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-all" title="Valider">
                                                    <CheckCircle2 size={16} />
                                                </button>
                                            )}
                                            {a.statut !== 'en_attente' && (
                                                <button onClick={() => updateAdhesionStatut(a.id, 'en_attente')}
                                                    className="p-2.5 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 transition-all" title="Remettre en attente">
                                                    <Clock size={16} />
                                                </button>
                                            )}
                                            <a href={`mailto:${a.email}?subject=Votre adhésion MDM : paiement 15€&body=Bonjour ${a.prenom},%0D%0A%0D%0ANous avons bien reçu votre demande d'adhésion. Voici le lien de paiement (15€) :%0D%0Ahttps://buy.stripe.com/eVqdR22cP1ne9T7gaFb3q01%0D%0A%0D%0ACordialement,%0D%0AL'équipe MDM`}
                                                className="p-2.5 bg-brand-red/10 text-brand-red rounded-xl hover:bg-brand-red hover:text-white transition-all" title="Envoyer le lien de paiement">
                                                <Mail size={16} />
                                            </a>
                                            <button onClick={() => deleteAdhesion(a.id)} className="p-2.5 bg-gray-100 text-gray-400 rounded-xl hover:bg-red-100 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'documents' && (
                    /* Documents Section */
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h2 className="text-3xl font-black text-brand-dark tracking-tighter uppercase">Documents Légaux</h2>
                                <p className="text-gray-500 font-medium">Gérez les documents officiels de l'association</p>
                            </div>
                            <button 
                                onClick={() => setShowUploadModal(true)}
                                className="bg-brand-dark text-white px-8 py-4 rounded-2xl font-black text-sm tracking-widest hover:bg-black transition-all flex items-center gap-2 shadow-xl hover:shadow-brand-green/20"
                            >
                                <Plus size={20} /> AJOUTER UN DOCUMENT
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {documents.length === 0 ? (
                                <div className="col-span-full py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-400">
                                    <FileText size={64} className="mb-4 opacity-10" />
                                    <p className="font-bold tracking-widest uppercase text-xs">Aucun document téléversé</p>
                                </div>
                            ) : (
                                documents.map((doc) => (
                                    <div key={doc.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="p-4 bg-brand-green/10 rounded-2xl text-brand-green">
                                                <FileText size={24} />
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                <a 
                                                    href={doc.url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="p-3 bg-gray-50 text-gray-600 hover:bg-brand-green hover:text-white rounded-xl transition-all"
                                                >
                                                    <Download size={18} />
                                                </a>
                                                <button 
                                                    onClick={() => deleteDocument(doc.id)}
                                                    className="p-3 bg-gray-50 text-gray-600 hover:bg-brand-red hover:text-white rounded-xl transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                        <h3 className="font-black text-brand-dark text-xl tracking-tight mb-2 line-clamp-1">{doc.name}</h3>
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                {doc.type}
                                            </span>
                                            <span className="text-[10px] font-bold text-gray-300">
                                                {(doc.size ? (doc.size / 1024 / 1024).toFixed(2) : '0')} MB
                                            </span>
                                        </div>
                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">
                                            Ajouté le {new Date(doc.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Types suggérés (Checklist) */}
                        <div className="mt-16 p-10 bg-brand-dark rounded-[3rem] text-white">
                            <h3 className="text-xl font-black mb-8 tracking-tighter uppercase flex items-center gap-3">
                                <AlertCircle className="text-brand-green" /> Documents Essentiels à prévoir
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 opacity-80">
                                {['Statuts', 'RI', 'PV AG', 'Récépissé', 'RIB', 'Assurance', 'SIRENE', 'JOAFE', 'Bureaux', 'Subventions'].map((type) => (
                                    <div key={type} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <div className={`w-4 h-4 rounded-full border-2 ${documents.some(d => d.type === type) ? 'bg-brand-green border-brand-green' : 'border-white/20'}`}></div>
                                        <span className="text-xs font-black tracking-widest">{type}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-brand-dark/90 backdrop-blur-sm" onClick={() => !uploading && setShowUploadModal(false)}></div>
                    <div className="bg-white w-full max-w-xl rounded-[3rem] p-10 relative z-10 shadow-2xl animate-in zoom-in-95 duration-300">
                        <button 
                            onClick={() => setShowUploadModal(false)}
                            className="absolute top-8 right-8 p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-all"
                        >
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-black text-brand-dark mb-8 tracking-tighter uppercase">Téléverser un document</h2>
                        
                        <form onSubmit={handleUpload} className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Nom du document</label>
                                <input 
                                    type="text" required
                                    value={newDoc.name}
                                    onChange={(e) => setNewDoc({...newDoc, name: e.target.value})}
                                    placeholder="Ex: Statuts MDM 2025"
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand-green outline-none font-bold"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Type de document</label>
                                <select 
                                    value={newDoc.type}
                                    onChange={(e) => setNewDoc({...newDoc, type: e.target.value})}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand-green outline-none font-bold appearance-none"
                                >
                                    {['Statuts', 'RI', 'PV AG', 'Récépissé', 'RIB', 'Assurance', 'SIRENE', 'JOAFE', 'Bureaux', 'Subventions', 'Autre'].map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="relative border-2 border-dashed border-gray-200 rounded-3xl p-10 text-center hover:border-brand-green transition-all group">
                                <input 
                                    type="file" required
                                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <Upload className="mx-auto mb-4 text-gray-300 group-hover:text-brand-green transition-all" size={40} />
                                <p className="text-sm font-bold text-gray-500">
                                    {file ? file.name : "Cliquez ou glissez un fichier ici"}
                                </p>
                            </div>

                            <button 
                                type="submit"
                                disabled={uploading || !file}
                                className="w-full bg-brand-dark text-white py-5 rounded-2xl font-black tracking-widest uppercase hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50"
                            >
                                {uploading ? <Loader2 className="animate-spin" /> : "TÉLÉVERSER"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
