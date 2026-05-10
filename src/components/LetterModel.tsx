"use client";

import { useState, useMemo } from "react";
import { Copy, Download, Edit3, Check, FileText } from "lucide-react";
import { jsPDF } from "jspdf";

interface LetterModelProps {
  content: string;
  title?: string;
}

export default function LetterModel({ content, title }: LetterModelProps) {
  const [isCopying, setIsCopying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Extract placeholders like [Nom], [adresse], etc.
  const placeholders = useMemo(() => {
    const matches = content.match(/\[([^\]]+)\]/g);
    if (!matches) return [];
    // Remove brackets and duplicates
    return Array.from(new Set(matches.map(m => m.slice(1, -1))));
  }, [content]);

  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    placeholders.forEach(p => {
      initial[p] = "";
    });
    return initial;
  });

  const filledContent = useMemo(() => {
    let newContent = content;
    Object.entries(values).forEach(([key, value]) => {
      const placeholder = `[${key}]`;
      // Use a regex to replace all occurrences
      const escapedKey = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      newContent = newContent.replace(new RegExp(escapedKey, 'g'), value || placeholder);
    });
    return newContent;
  }, [content, values]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(filledContent);
      setIsCopying(true);
      setTimeout(() => setIsCopying(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // PDF Config
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - margin * 2;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    
    // Split text to fit page width
    const lines = doc.splitTextToSize(filledContent, maxWidth);
    
    doc.text(lines, margin, margin + 10);
    
    const fileName = title ? `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf` : "lettre_mdm.pdf";
    doc.save(fileName);
  };

  return (
    <div className="my-12 bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
      {/* Header */}
      <div className="bg-gray-50/80 px-8 py-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-brand-red/10 p-2.5 rounded-xl">
            <FileText className="w-5 h-5 text-brand-red" />
          </div>
          <h4 className="font-heading font-black text-brand-dark text-lg leading-tight">
            {title || "Modèle de document"}
          </h4>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
              isEditing 
                ? "bg-brand-dark text-white" 
                : "bg-white text-gray-500 border border-gray-200 hover:border-brand-dark hover:text-brand-dark"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            {isEditing ? "Fermer l'édition" : "Personnaliser"}
          </button>
        </div>
      </div>

      <div className="p-8">
        {/* Placeholders Editor */}
        {isEditing && placeholders.length > 0 && (
          <div className="mb-10 p-6 bg-brand-green/5 rounded-2xl border border-brand-green/10 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-green bg-white px-3 py-1 rounded-full border border-brand-green/20">
                Champs à remplir
              </span>
            </div>
            {placeholders.map(p => (
              <div key={p} className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                  {p}
                </label>
                <input
                  type="text"
                  placeholder={`Ex: ${p}...`}
                  value={values[p]}
                  onChange={(e) => setValues(prev => ({ ...prev, [p]: e.target.value }))}
                  className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
                />
              </div>
            ))}
          </div>
        )}

        {/* Preview Area */}
        <div className="relative">
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={handleCopy}
              className="bg-white/90 backdrop-blur shadow-sm border border-gray-100 p-2.5 rounded-xl hover:bg-brand-green hover:text-white hover:border-brand-green transition-all group/btn"
              title="Copier le texte"
            >
              {isCopying ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
            <button
              onClick={handleDownloadPDF}
              className="bg-white/90 backdrop-blur shadow-sm border border-gray-100 p-2.5 rounded-xl hover:bg-brand-dark hover:text-white hover:border-brand-dark transition-all"
              title="Télécharger en PDF"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-gray-50/30 rounded-2xl p-8 border border-dashed border-gray-200 min-h-[200px] whitespace-pre-wrap font-serif text-gray-700 leading-relaxed text-base md:text-lg">
            {filledContent.split('\n').map((line, idx) => {
              // Highlight placeholders that are not yet filled
              const parts = line.split(/(\[[^\]]+\])/);
              return (
                <div key={idx} className="min-h-[1.5em]">
                  {parts.map((part, pIdx) => {
                    if (part.startsWith('[') && part.endsWith(']')) {
                      return <span key={pIdx} className="bg-brand-red/10 text-brand-red px-1 rounded font-bold italic">{part}</span>;
                    }
                    return part;
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex flex-wrap gap-4 items-center justify-between border-t border-gray-100 pt-8">
          <p className="text-xs text-gray-400 font-medium italic">
            * Remplacez les champs en rouge pour personnaliser votre document.
          </p>
          <div className="flex gap-3">
             <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-green text-white font-bold text-sm shadow-lg shadow-brand-green/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {isCopying ? <><Check className="w-4 h-4" /> Copié !</> : <><Copy className="w-4 h-4" /> Copier le texte</>}
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-dark text-white font-bold text-sm shadow-lg shadow-brand-dark/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Download className="w-4 h-4" />
              PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
