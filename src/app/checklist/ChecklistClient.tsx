"use client";

import { useState, useCallback } from "react";
import { CHECKLISTS, ChecklistCategory } from "./data";
import { Download, CheckCircle2, Circle, ChevronDown, ChevronUp, FileDown, RotateCcw } from "lucide-react";

/* ─── PDF generation (jsPDF) ─────────────────────────────────────── */
async function generatePDF(categories: ChecklistCategory[], checked: Record<string, boolean>) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const GREEN = [29, 158, 117] as const;
  const DARK = [44, 44, 42] as const;
  const GRAY = [100, 100, 100] as const;
  const W = 210;
  const MARGIN = 18;
  const CONTENT_W = W - MARGIN * 2;
  let y = 0;

  const addPage = () => { doc.addPage(); y = 20; };
  const checkY = (needed: number) => { if (y + needed > 275) addPage(); };

  // ── Cover ──
  doc.setFillColor(29, 158, 117);
  doc.rect(0, 0, W, 60, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Checklists Rentrée", MARGIN, 24);
  doc.setFontSize(28);
  doc.text("2026 – 2027", MARGIN, 37);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Association Marocains en France – Main dans la main", MARGIN, 50);
  doc.text(`Généré le ${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`, MARGIN, 56);

  // ── Progress summary ──
  const total = Object.keys(checked).length > 0
    ? Object.values(checked).filter(Boolean).length
    : 0;
  const allItems = categories.flatMap(c => c.items);
  const pct = allItems.length > 0 ? Math.round((total / allItems.length) * 100) : 0;

  y = 72;
  doc.setTextColor(...DARK);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(`Progression globale : ${total} / ${allItems.length} tâches complétées (${pct}%)`, MARGIN, y);

  // progress bar
  y += 4;
  doc.setFillColor(229, 231, 235);
  doc.roundedRect(MARGIN, y, CONTENT_W, 5, 2, 2, "F");
  if (pct > 0) {
    doc.setFillColor(...GREEN);
    doc.roundedRect(MARGIN, y, (CONTENT_W * pct) / 100, 5, 2, 2, "F");
  }
  y += 14;

  // ── Each category ──
  for (const cat of categories) {
    checkY(24);

    // category header bar
    doc.setFillColor(245, 250, 248);
    doc.roundedRect(MARGIN, y, CONTENT_W, 12, 2, 2, "F");
    doc.setDrawColor(...GREEN);
    doc.setLineWidth(0.8);
    doc.line(MARGIN, y, MARGIN, y + 12);
    doc.setTextColor(...DARK);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`${cat.emoji}  ${cat.title}`, MARGIN + 4, y + 8);

    const catDone = cat.items.filter(i => checked[i.id]).length;
    doc.setFontSize(9);
    doc.setTextColor(...GRAY);
    doc.text(`${catDone}/${cat.items.length}`, W - MARGIN - 1, y + 8, { align: "right" });

    if (cat.deadline) {
      doc.setFontSize(8);
      doc.text(`⏰ ${cat.deadline}`, MARGIN + 4, y + 11.5);
    }

    y += 16;

    for (const item of cat.items) {
      const done = !!checked[item.id];
      const lines = doc.splitTextToSize(`  ${item.label}`, CONTENT_W - 14);
      const blockH = lines.length * 5 + (item.detail ? 5 : 0) + 4;
      checkY(blockH);

      // checkbox
      if (done) {
        doc.setFillColor(...GREEN);
        doc.circle(MARGIN + 3, y + 3, 2.5, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(7);
        doc.text("✓", MARGIN + 1.8, y + 4.5);
      } else {
        doc.setDrawColor(180, 180, 180);
        doc.setLineWidth(0.5);
        doc.circle(MARGIN + 3, y + 3, 2.5, "S");
      }

      // label
      if (done) { doc.setTextColor(120, 120, 120); } else { doc.setTextColor(...DARK); }
      doc.setFontSize(10);
      doc.setFont("helvetica", done ? "normal" : "normal");
      doc.text(lines, MARGIN + 9, y + 4);

      if (item.urgent && !done) {
        doc.setFillColor(254, 226, 226);
        doc.setTextColor(185, 28, 28);
        doc.setFontSize(7);
        doc.roundedRect(W - MARGIN - 16, y + 0.5, 15, 5, 1, 1, "F");
        doc.text("Urgent", W - MARGIN - 8.5, y + 4, { align: "center" });
      }

      if (item.detail) {
        y += lines.length * 5 + 1;
        doc.setFontSize(8);
        doc.setTextColor(...GRAY);
        const dLines = doc.splitTextToSize(item.detail, CONTENT_W - 14);
        doc.text(dLines, MARGIN + 9, y + 1);
        y += dLines.length * 4 + 3;
      } else {
        y += lines.length * 5 + 4;
      }
    }
    y += 6;
  }

  // ── Footer on every page ──
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...GRAY);
    doc.text("marocainsenfrance.fr  |  Association MDM", MARGIN, 290);
    doc.text(`Page ${i} / ${pageCount}`, W - MARGIN, 290, { align: "right" });
  }

  doc.save("checklist-rentree-2026-2027.pdf");
}

/* ─── Progress bar component ─────────────────────────────────────── */
function ProgressBar({ done, total, color }: { done: number; total: number; color: string }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs mb-1" style={{ color: "#6b7280" }}>
        <span>{done}/{total} complétées</span>
        <span className="font-semibold" style={{ color }}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

/* ─── Single category card ───────────────────────────────────────── */
function CategoryCard({
  cat,
  checked,
  onToggle,
}: {
  cat: ChecklistCategory;
  checked: Record<string, boolean>;
  onToggle: (id: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const done = cat.items.filter(i => checked[i.id]).length;
  const allDone = done === cat.items.length;

  return (
    <div
      id={`category-${cat.id}`}
      className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      style={{ background: "white" }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-6 py-4 text-left"
        style={{ background: allDone ? "#f0fdf4" : "white" }}
      >
        <span className="text-2xl select-none">{cat.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-bold text-lg" style={{ color: "#2C2C2A", fontFamily: "var(--font-outfit)" }}>
              {cat.title}
            </h2>
            {cat.deadline && (
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: "#FEF3C7", color: "#92400E" }}>
                ⏰ {cat.deadline}
              </span>
            )}
            {allDone && (
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ background: "#D1FAE5", color: "#065F46" }}>
                ✓ Complété
              </span>
            )}
          </div>
          <ProgressBar done={done} total={cat.items.length} color={cat.accentColor} />
        </div>
        <span className="text-gray-400 ml-2">
          {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </button>

      {/* Items */}
      {open && (
        <div className="px-6 pb-5 pt-1 border-t border-gray-50">
          <p className="text-sm text-gray-500 mb-4">{cat.description}</p>
          <ul className="space-y-2.5">
            {cat.items.map(item => {
              const isChecked = !!checked[item.id];
              return (
                <li key={item.id}>
                  <label
                    htmlFor={`item-${item.id}`}
                    className="flex items-start gap-3 cursor-pointer group p-2.5 rounded-xl transition-colors hover:bg-gray-50"
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      <input
                        type="checkbox"
                        id={`item-${item.id}`}
                        checked={isChecked}
                        onChange={() => onToggle(item.id)}
                        className="sr-only"
                      />
                      {isChecked
                        ? <CheckCircle2 size={22} style={{ color: cat.accentColor }} />
                        : <Circle size={22} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="text-sm font-medium leading-snug transition-colors"
                          style={{ color: isChecked ? "#9CA3AF" : "#2C2C2A", textDecoration: isChecked ? "line-through" : "none" }}
                        >
                          {item.label}
                        </span>
                        {item.urgent && !isChecked && (
                          <span className="text-xs px-1.5 py-0.5 rounded font-semibold flex-shrink-0"
                            style={{ background: "#FEE2E2", color: "#B91C1C" }}>
                            Urgent
                          </span>
                        )}
                      </div>
                      {item.detail && (
                        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{item.detail}</p>
                      )}
                      {item.link && (
                        <a href={item.link.url} target="_blank" rel="noopener noreferrer"
                          className="text-xs font-medium mt-0.5 inline-block hover:underline"
                          style={{ color: cat.accentColor }}
                          onClick={e => e.stopPropagation()}>
                          → {item.link.text}
                        </a>
                      )}
                    </div>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────────── */
export default function ChecklistClient() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [downloading, setDownloading] = useState(false);

  const toggle = useCallback((id: string) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const totalItems = CHECKLISTS.flatMap(c => c.items).length;
  const totalDone = Object.values(checked).filter(Boolean).length;
  const globalPct = Math.round((totalDone / totalItems) * 100);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await generatePDF(CHECKLISTS, checked);
    } finally {
      setDownloading(false);
    }
  };

  const handleReset = () => {
    if (confirm("Réinitialiser toutes les cases ? Votre progression sera perdue.")) {
      setChecked({});
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #f8fafc 60%, #fdf4ff 100%)" }}>
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1D9E75 0%, #15745A 100%)" }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-1.5 text-white text-sm font-medium mb-6">
            <span>✨</span> Association Marocains en France
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-outfit)" }}>
            Checklists Rentrée<br />
            <span className="text-emerald-200">2026 – 2027</span>
          </h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto mb-8">
            Toutes les démarches pour préparer votre arrivée en France, étape par étape.
            Cochez au fur et à mesure et téléchargez votre récap en PDF.
          </p>

          {/* Global progress */}
          <div className="bg-white/15 backdrop-blur rounded-2xl p-5 max-w-md mx-auto mb-8">
            <div className="flex justify-between text-white text-sm mb-2 font-medium">
              <span>Progression globale</span>
              <span>{totalDone} / {totalItems} — {globalPct}%</span>
            </div>
            <div className="h-3 rounded-full bg-white/30 overflow-hidden">
              <div
                className="h-full rounded-full bg-white transition-all duration-700"
                style={{ width: `${globalPct}%` }}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              id="btn-download-pdf"
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-70"
              style={{ background: "white", color: "#1D9E75" }}
            >
              {downloading
                ? <><FileDown size={18} className="animate-bounce" /> Génération…</>
                : <><Download size={18} /> Télécharger le PDF</>
              }
            </button>
            <button
              id="btn-reset-checklist"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm border border-white/50 text-white hover:bg-white/10 transition-all"
            >
              <RotateCcw size={18} /> Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* Category nav pills */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {CHECKLISTS.map(cat => {
            const done = cat.items.filter(i => checked[i.id]).length;
            return (
              <a
                key={cat.id}
                href={`#category-${cat.id}`}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all hover:scale-105"
                style={{
                  borderColor: done === cat.items.length ? cat.accentColor : "#e5e7eb",
                  background: done === cat.items.length ? cat.accentColor + "15" : "white",
                  color: done === cat.items.length ? cat.accentColor : "#6b7280",
                }}
              >
                <span>{cat.emoji}</span>
                <span>{cat.title}</span>
                <span className="bg-gray-100 rounded-full px-1.5 py-0.5" style={{
                  background: done === cat.items.length ? cat.accentColor + "25" : "#f3f4f6",
                  color: done === cat.items.length ? cat.accentColor : "#9ca3af",
                }}>
                  {done}/{cat.items.length}
                </span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Checklist cards */}
      <main className="max-w-4xl mx-auto px-4 py-10 space-y-5">
        {CHECKLISTS.map(cat => (
          <CategoryCard key={cat.id} cat={cat} checked={checked} onToggle={toggle} />
        ))}

        {/* Bottom CTA */}
        <div className="rounded-2xl p-8 text-center" style={{ background: "linear-gradient(135deg, #1D9E75, #15745A)" }}>
          <p className="text-white text-lg font-semibold mb-2" style={{ fontFamily: "var(--font-outfit)" }}>
            🎉 Prêt(e) pour la rentrée ?
          </p>
          <p className="text-emerald-100 text-sm mb-5">
            Téléchargez votre checklist personnalisée avec votre progression actuelle.
          </p>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-70"
            style={{ background: "white", color: "#1D9E75" }}
          >
            {downloading
              ? <><FileDown size={18} className="animate-bounce" /> Génération en cours…</>
              : <><Download size={18} /> Télécharger mon PDF</>
            }
          </button>
        </div>
      </main>
    </div>
  );
}
