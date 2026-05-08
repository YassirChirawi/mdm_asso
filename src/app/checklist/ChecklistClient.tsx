"use client";

import { useState, useCallback, useEffect } from "react";
import { CHECKLISTS, ChecklistCategory } from "./data";
import {
  Download, CheckCircle2, Circle, ChevronDown, ChevronUp,
  FileDown, RotateCcw, Heart, Users, CheckCheck, Minus,
  Sparkles, ArrowRight,
} from "lucide-react";

const STORAGE_KEY = "mdm-checklist-2026";

/* ─── PDF generation ────────────────────────────────────────────── */
async function generatePDF(
  categories: ChecklistCategory[],
  checked: Record<string, boolean>
) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const GREEN: [number, number, number] = [29, 158, 117];
  const DARK: [number, number, number] = [44, 44, 42];
  const GRAY: [number, number, number] = [120, 120, 120];
  const W = 210;
  const M = 18;
  const CW = W - M * 2;
  let y = 0;

  const addPage = () => { doc.addPage(); y = 20; };
  const checkY = (n: number) => { if (y + n > 275) addPage(); };

  // Cover
  doc.setFillColor(...GREEN);
  doc.rect(0, 0, W, 62, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Checklists Rentrée 2026 – 2027", M, 26);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Association Marocains en France – marocainsenfrance.fr", M, 38);
  doc.text(
    `Généré le ${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`,
    M, 48
  );

  const allItems = categories.flatMap((c) => c.items);
  const done = allItems.filter((i) => checked[i.id]).length;
  const pct = Math.round((done / allItems.length) * 100);

  y = 74;
  doc.setTextColor(...DARK);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`Progression : ${done} / ${allItems.length} (${pct}%)`, M, y);
  y += 4;
  doc.setFillColor(229, 231, 235);
  doc.roundedRect(M, y, CW, 4, 1, 1, "F");
  if (pct > 0) {
    doc.setFillColor(...GREEN);
    doc.roundedRect(M, y, (CW * pct) / 100, 4, 1, 1, "F");
  }
  y += 12;

  for (const cat of categories) {
    checkY(22);
    doc.setFillColor(245, 250, 248);
    doc.roundedRect(M, y, CW, 11, 2, 2, "F");
    doc.setDrawColor(...GREEN);
    doc.setLineWidth(0.7);
    doc.line(M, y, M, y + 11);
    doc.setTextColor(...DARK);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`${cat.emoji}  ${cat.title}`, M + 4, y + 7.5);
    const catDone = cat.items.filter((i) => checked[i.id]).length;
    doc.setFontSize(8);
    doc.setTextColor(...GRAY);
    doc.text(`${catDone}/${cat.items.length}`, W - M - 1, y + 7.5, { align: "right" });
    if (cat.deadline) {
      doc.setFontSize(7.5);
      doc.text(`⏰ ${cat.deadline}`, M + 4, y + 11);
    }
    y += 15;

    for (const item of cat.items) {
      const isDone = !!checked[item.id];
      const lines = doc.splitTextToSize(`  ${item.label}`, CW - 12);
      const bh = lines.length * 4.8 + (item.detail ? 4 : 0) + 4;
      checkY(bh);

      if (isDone) {
        doc.setFillColor(...GREEN);
        doc.circle(M + 2.8, y + 2.8, 2.3, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(7);
        doc.text("✓", M + 1.7, y + 4.2);
      } else {
        doc.setDrawColor(180, 180, 180);
        doc.setLineWidth(0.45);
        doc.circle(M + 2.8, y + 2.8, 2.3, "S");
      }

      if (isDone) { doc.setTextColor(150, 150, 150); } else { doc.setTextColor(...DARK); }
      doc.setFontSize(9.5);
      doc.setFont("helvetica", "normal");
      doc.text(lines, M + 8, y + 3.5);

      if (item.urgent && !isDone) {
        doc.setFillColor(254, 226, 226);
        doc.setTextColor(185, 28, 28);
        doc.setFontSize(6.5);
        doc.roundedRect(W - M - 14, y + 0.5, 13, 4.5, 1, 1, "F");
        doc.text("Urgent", W - M - 7.5, y + 3.5, { align: "center" });
      }

      if (item.detail) {
        y += lines.length * 4.8 + 1;
        doc.setFontSize(7.5);
        doc.setTextColor(...GRAY);
        const dl = doc.splitTextToSize(item.detail, CW - 12);
        doc.text(dl, M + 8, y);
        y += dl.length * 3.8 + 3;
      } else {
        y += lines.length * 4.8 + 4;
      }
    }
    y += 5;
  }

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setTextColor(...GRAY);
    doc.text("marocainsenfrance.fr  ·  Association MDM – Main dans la main", M, 291);
    doc.text(`${i} / ${pageCount}`, W - M, 291, { align: "right" });
  }

  doc.save("checklist-rentree-2026-2027-mdm.pdf");
}

/* ─── Sub-components ────────────────────────────────────────────── */
function ProgressBar({ done, total, color }: { done: number; total: number; color: string }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div className="mt-2.5">
      <div className="flex justify-between text-xs mb-1" style={{ color: "#9ca3af" }}>
        <span>{done}/{total} complétées</span>
        <span className="font-bold" style={{ color }}>{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function CategoryCard({
  cat, checked, onToggle, onToggleAll,
}: {
  cat: ChecklistCategory;
  checked: Record<string, boolean>;
  onToggle: (id: string) => void;
  onToggleAll: (catId: string, value: boolean) => void;
}) {
  const [open, setOpen] = useState(true);
  const done = cat.items.filter((i) => checked[i.id]).length;
  const allDone = done === cat.items.length;
  const allCheckedState = done === cat.items.length;

  return (
    <article
      id={`category-${cat.id}`}
      className="rounded-2xl border overflow-hidden transition-shadow hover:shadow-md"
      style={{ borderColor: allDone ? cat.accentColor + "40" : "#f3f4f6", background: "white" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 py-4"
        style={{ background: allDone ? cat.accentColor + "08" : "white" }}
      >
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-3 flex-1 text-left min-w-0"
          aria-expanded={open}
          aria-controls={`items-${cat.id}`}
        >
          <span className="text-xl select-none flex-shrink-0">{cat.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-bold text-base" style={{ color: "#2C2C2A", fontFamily: "var(--font-outfit)" }}>
                {cat.title}
              </h2>
              {cat.deadline && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                  style={{ background: "#FEF3C7", color: "#92400E" }}>
                  ⏰ {cat.deadline}
                </span>
              )}
              {allDone && (
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
                  style={{ background: "#D1FAE5", color: "#065F46" }}>
                  ✓ Complété
                </span>
              )}
            </div>
            <ProgressBar done={done} total={cat.items.length} color={cat.accentColor} />
          </div>
          <span className="text-gray-300 ml-1 flex-shrink-0">
            {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </span>
        </button>

        {/* Toggle all button */}
        <button
          onClick={() => onToggleAll(cat.id, !allCheckedState)}
          title={allCheckedState ? "Tout décocher" : "Tout cocher"}
          className="flex-shrink-0 p-2 rounded-xl transition-colors text-xs font-semibold flex items-center gap-1"
          style={{ color: cat.accentColor, background: cat.accentColor + "10" }}
        >
          {allCheckedState ? <Minus size={14} /> : <CheckCheck size={14} />}
          <span className="hidden sm:inline">{allCheckedState ? "Décocher" : "Tout"}</span>
        </button>
      </div>

      {/* Items */}
      {open && (
        <div id={`items-${cat.id}`} className="px-5 pb-5 pt-1 border-t border-gray-50">
          <p className="text-xs text-gray-400 mb-3 leading-relaxed">{cat.description}</p>
          <ul className="space-y-1.5" role="list">
            {cat.items.map((item) => {
              const isChecked = !!checked[item.id];
              return (
                <li key={item.id}>
                  <label
                    htmlFor={`item-${item.id}`}
                    className="flex items-start gap-3 cursor-pointer group p-2.5 rounded-xl transition-colors hover:bg-gray-50"
                  >
                    <div className="mt-0.5 flex-shrink-0 transition-transform group-hover:scale-110">
                      <input
                        type="checkbox"
                        id={`item-${item.id}`}
                        checked={isChecked}
                        onChange={() => onToggle(item.id)}
                        className="sr-only"
                        aria-label={item.label}
                      />
                      {isChecked
                        ? <CheckCircle2 size={20} style={{ color: cat.accentColor }} />
                        : <Circle size={20} className="text-gray-200 group-hover:text-gray-300 transition-colors" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="text-sm font-medium leading-snug"
                          style={{
                            color: isChecked ? "#9CA3AF" : "#2C2C2A",
                            textDecoration: isChecked ? "line-through" : "none",
                          }}
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
                        <a
                          href={item.link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold mt-0.5 inline-block hover:underline"
                          style={{ color: cat.accentColor }}
                          onClick={(e) => e.stopPropagation()}
                        >
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
    </article>
  );
}

/* ─── Volunteer / network banner ────────────────────────────────── */
function VolunteerBanner() {
  return (
    <div className="rounded-2xl p-6 border border-emerald-100"
      style={{ background: "linear-gradient(135deg, #f0fdf4, #ecfdf5)" }}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "#1D9E7520" }}>
          <Users size={20} style={{ color: "#1D9E75" }} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-base mb-1" style={{ color: "#2C2C2A", fontFamily: "var(--font-outfit)" }}>
            Rejoins le réseau d'entraide MDM
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-3">
            Tu es déjà bien installé(e) en France ? Deviens bénévole et aide les nouveaux arrivants à s'intégrer.
            Parrainage, conseils logement, accompagnement administratif — chaque coup de main compte.
          </p>
          <a
            href="https://www.instagram.com/marocainsenfrance/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full transition-all hover:scale-105"
            style={{ background: "#1D9E75", color: "white" }}
          >
            <Sparkles size={14} /> Rejoindre le réseau
          </a>
          <a
            href="/contact"
            className="inline-flex items-center gap-1.5 text-sm font-semibold ml-3"
            style={{ color: "#1D9E75" }}
          >
            En savoir plus <ArrowRight size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── Subtle donation nudge ─────────────────────────────────────── */
function DonationNudge() {
  return (
    <div className="rounded-2xl p-5 flex items-center gap-4 border border-red-50"
      style={{ background: "#fff7f7" }}>
      <Heart size={22} className="flex-shrink-0 text-red-400" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-600 leading-relaxed">
          Ce guide est <strong>100% gratuit</strong> et maintenu par des bénévoles.
          Si il t'a été utile, un petit soutien nous aide à continuer. 🙏
        </p>
      </div>
      <a
        href="https://donate.stripe.com/5kQaEQ6t57LC7KZ2jPb3q00"
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 text-sm font-bold px-4 py-2 rounded-full whitespace-nowrap transition-all hover:scale-105"
        style={{ background: "#FEE2E2", color: "#B91C1C" }}
      >
        Soutenir ❤️
      </a>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────────── */
export default function ChecklistClient() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [downloading, setDownloading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Restore from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setChecked(JSON.parse(raw));
    } catch {/* ignore */}
    setHydrated(true);
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
      setSaved(true);
      const t = setTimeout(() => setSaved(false), 1800);
      return () => clearTimeout(t);
    } catch {/* ignore */}
  }, [checked, hydrated]);

  const toggle = useCallback((id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const toggleAll = useCallback((catId: string, value: boolean) => {
    const cat = CHECKLISTS.find((c) => c.id === catId);
    if (!cat) return;
    setChecked((prev) => {
      const next = { ...prev };
      cat.items.forEach((item) => { next[item.id] = value; });
      return next;
    });
  }, []);

  const totalItems = CHECKLISTS.flatMap((c) => c.items).length;
  const totalDone = Object.values(checked).filter(Boolean).length;
  const globalPct = Math.round((totalDone / totalItems) * 100);

  const handleDownload = async () => {
    setDownloading(true);
    try { await generatePDF(CHECKLISTS, checked); }
    finally { setDownloading(false); }
  };

  const handleReset = () => {
    if (confirm("Réinitialiser toutes les cases ? Votre progression sera perdue.")) {
      setChecked({});
      try { localStorage.removeItem(STORAGE_KEY); } catch {/* ignore */}
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#f8fafc" }}>
      {/* Hero */}
      <div
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(140deg, #1D9E75 0%, #15745A 100%)" }}
      >
        {/* subtle dot pattern */}
        <div className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative max-w-3xl mx-auto px-6 py-14 text-center">
          <p className="text-emerald-200 text-xs font-bold uppercase tracking-widest mb-3">
            Association Marocains en France · Rentrée 2026-2027
          </p>
          <h1
            className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Ta checklist complète<br />
            <span className="text-emerald-200">pour réussir ton arrivée en France</span>
          </h1>
          <p className="text-emerald-100 text-base max-w-xl mx-auto mb-7 leading-relaxed">
            {totalItems} démarches classées par priorité. Coche au fur et à mesure —
            ta progression est sauvegardée automatiquement.
          </p>

          {/* Global progress */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-5 max-w-sm mx-auto mb-7">
            <div className="flex justify-between text-white text-sm mb-2 font-semibold">
              <span>Progression globale</span>
              <span>{totalDone}/{totalItems} — {globalPct}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-white transition-all duration-700"
                style={{ width: `${globalPct}%` }}
              />
            </div>
            {globalPct === 100 && (
              <p className="text-emerald-200 text-xs text-center mt-2 font-semibold">
                🎉 Félicitations, tu es prêt(e) pour la rentrée !
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <button
              id="btn-download-pdf"
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-60"
              style={{ background: "white", color: "#1D9E75" }}
            >
              {downloading
                ? <><FileDown size={16} className="animate-bounce" /> Génération…</>
                : <><Download size={16} /> Télécharger le PDF</>}
            </button>
            <button
              id="btn-reset-checklist"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-sm border border-white/40 text-white hover:bg-white/10 transition-all"
            >
              <RotateCcw size={15} /> Réinitialiser
            </button>
          </div>

          {/* Saved indicator */}
          <div className={`mt-3 text-xs text-emerald-200 transition-opacity duration-500 ${saved ? "opacity-100" : "opacity-0"}`}>
            ✓ Progression sauvegardée
          </div>
        </div>
      </div>

      {/* Sticky category nav */}
      <nav
        aria-label="Catégories de la checklist"
        className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-100 shadow-sm"
      >
        <div className="max-w-3xl mx-auto px-4 py-2.5 flex gap-2 overflow-x-auto">
          {CHECKLISTS.map((cat) => {
            const d = cat.items.filter((i) => checked[i.id]).length;
            const complete = d === cat.items.length;
            return (
              <a
                key={cat.id}
                href={`#category-${cat.id}`}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all hover:scale-105"
                style={{
                  borderColor: complete ? cat.accentColor : "#e5e7eb",
                  background: complete ? cat.accentColor + "12" : "white",
                  color: complete ? cat.accentColor : "#6b7280",
                }}
              >
                <span>{cat.emoji}</span>
                <span className="hidden sm:inline">{cat.title}</span>
                <span
                  className="rounded-full px-1.5 py-0.5"
                  style={{
                    background: complete ? cat.accentColor + "20" : "#f3f4f6",
                    color: complete ? cat.accentColor : "#9ca3af",
                  }}
                >
                  {d}/{cat.items.length}
                </span>
              </a>
            );
          })}
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-4">

        {/* Volunteer banner — top, non-intrusive */}
        <VolunteerBanner />

        {/* Checklist cards */}
        {CHECKLISTS.map((cat, idx) => (
          <div key={cat.id}>
            <CategoryCard cat={cat} checked={checked} onToggle={toggle} onToggleAll={toggleAll} />

            {/* Donation nudge after 3rd category — subtle, once */}
            {idx === 2 && <div className="mt-4"><DonationNudge /></div>}
          </div>
        ))}

        {/* Bottom CTA */}
        <div
          className="rounded-2xl p-8 text-center mt-6"
          style={{ background: "linear-gradient(135deg, #1D9E75, #15745A)" }}
        >
          <p className="text-white font-bold text-lg mb-1" style={{ fontFamily: "var(--font-outfit)" }}>
            {globalPct === 100 ? "🎉 Tu es prêt(e) !" : "Télécharge ton récapitulatif"}
          </p>
          <p className="text-emerald-100 text-sm mb-5">
            {globalPct === 100
              ? "Toutes les cases sont cochées. Bonne rentrée !"
              : `${totalDone}/${totalItems} tâches complétées — imprime et garde-le avec toi.`}
          </p>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold text-sm shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-60"
            style={{ background: "white", color: "#1D9E75" }}
          >
            {downloading
              ? <><FileDown size={16} className="animate-bounce" /> Génération…</>
              : <><Download size={16} /> Télécharger mon PDF ({globalPct}%)</>}
          </button>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 pb-4">
          Ce contenu est produit bénévolement par l'association MDM.{" "}
          <a href="/mentions-legales" className="underline hover:text-gray-600">Mentions légales</a>
          {" · "}
          <a href="/contact" className="underline hover:text-gray-600">Nous contacter</a>
        </p>
      </main>
    </div>
  );
}
