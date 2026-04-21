"use client";
import React, { useState, useEffect } from 'react';
import { Mail, Download, MessageSquare, Trash2, ArrowLeft, LogOut, Loader2, BarChart3, Users, BookOpen, AlertCircle, FileText, Upload, Plus, X, Heart } from 'lucide-react';
import { signOut } from "next-auth/react";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('stats'); // 'stats' or 'documents' or 'donations'
    const [messages, setMessages] = useState([]);
    const [donations, setDonations] = useState([]);
    const [chapterStats, setChapterStats] = useState([]);
    const [stats, setStats] = useState({ downloads: 0, messages: 0, totalViews: 0, estimatedReaders: 0, totalDonations: 0 });
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [newDoc, setNewDoc] = useState({ name: '', type: 'Statuts' });
    const [file, setFile] = useState(null);

    useEffect(() => {
        fetchData();
        fetchDocuments();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [msgRes, downloadStatRes, chapterStatRes, donationsRes] = await Promise.all([
                fetch('/api/admin/messages'),
                fetch('/api/stats?file=guide-etudiant.pdf'),
                fetch('/api/stats/chapter'),
                fetch('/api/admin/donations')
            ]);

            const msgData = await msgRes.json();
            const downloadStatData = await downloadStatRes.json();
            const chapterStatData = await chapterStatRes.json();
            const donationsData = await donationsRes.json();

            const totalViews = chapterStatData.reduce((acc, curr) => acc + curr.views, 0);
            const estimatedReaders = Math.max(...(chapterStatData.map(s => s.views) || [0]), 0);

            const totalDonations = donationsData.reduce((acc, curr) => acc + (curr.amount || 0), 0);

            setMessages(msgData || []);
            setChapterStats(chapterStatData || []);
            setDonations(donationsData || []);
            setStats({
                messages: msgData.length || 0,
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

    const handleUpload = async (e) => {
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

    const deleteDocument = async (id) => {
        if (!confirm('Supprimer ce document ?')) return;
        try {
            await fetch(`/api/admin/documents?id=${id}`, { method: 'DELETE' });
            setDocuments(documents.filter(d => d.id !== id));
        } catch (error) {
            alert('Erreur lors de la suppression');
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
                            <button 
                                onClick={() => setActiveTab('stats')}
                                className={`px-6 py-2 rounded-xl text-sm font-black tracking-tighter transition-all ${activeTab === 'stats' ? 'bg-brand-green text-brand-dark' : 'hover:bg-white/10'}`}
                            >
                                DASHBOARD
                            </button>
                            <button 
                                onClick={() => setActiveTab('donations')}
                                className={`px-6 py-2 rounded-xl text-sm font-black tracking-tighter transition-all ${activeTab === 'donations' ? 'bg-brand-green text-brand-dark' : 'hover:bg-white/10'}`}
                            >
                                DONS
                            </button>
                            <button 
                                onClick={() => setActiveTab('documents')}
                                className={`px-6 py-2 rounded-xl text-sm font-black tracking-tighter transition-all ${activeTab === 'documents' ? 'bg-brand-green text-brand-dark' : 'hover:bg-white/10'}`}
                            >
                                DOCUMENTS LÉGAUX
                            </button>
                        </div>
                    </div>
                    <button 
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="flex items-center gap-2 bg-white/10 hover:bg-brand-red text-white px-4 py-2 rounded-xl transition-all font-bold"
                    >
                        <LogOut size={18} /> Déconnexion
                    </button>
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

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
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
                    </>
                )}
                
                {activeTab === 'donations' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h2 className="text-3xl font-black text-brand-dark tracking-tighter uppercase">Dons effectués</h2>
                                <p className="text-gray-500 font-medium">Historique des dons reçus via Stripe</p>
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
                                                {(doc.size / 1024 / 1024).toFixed(2)} MB
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
                                    onChange={(e) => setFile(e.target.files[0])}
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
