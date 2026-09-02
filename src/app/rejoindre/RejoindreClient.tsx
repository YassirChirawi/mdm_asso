"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart, Users, Sparkles, CheckCircle2, ArrowRight,
  BookOpen, Megaphone, Globe, Trophy, Handshake, Star,
  Send, Loader2, CreditCard,
} from "lucide-react";

const ROLE_OPTIONS = [
  "Tuteur / Mentor",
  "Communication & Réseaux sociaux",
  "Correspondant Local",
  "Partenariats",
  "Animation Événements",
  "Créatif / Tech",
  "Autre",
];

function BenevoleForm() {
  const [form, setForm] = useState({
    prenom: "", nom: "", email: "", ville: "", disponibilite: "", motivation: "",
  });
  const [roles, setRoles] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const toggleRole = (role: string) =>
    setRoles((prev) => prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.prenom || !form.nom || !form.email || !form.motivation) {
      setErrorMsg("Merci de remplir tous les champs obligatoires.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/benevole", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, roles }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Une erreur s'est produite. Réessaie ou écris-nous directement.");
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-14 px-6"
      >
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: "#D1FAE5" }}>
          <CheckCircle2 size={32} style={{ color: "#1D9E75" }} />
        </div>
        <h3 className="text-xl font-black text-brand-dark mb-2" style={{ fontFamily: "var(--font-outfit)" }}>
          Candidature envoyée ! 🎉
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
          Merci {form.prenom} ! On revient vers toi dans les prochains jours pour un petit échange.
          Bienvenue dans la famille MDM !
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Nom / Prénom */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5" htmlFor="prenom">
            Prénom <span className="text-red-400">*</span>
          </label>
          <input id="prenom" name="prenom" type="text" value={form.prenom} onChange={handleChange}
            placeholder="Yassir"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition"
            style={{ "--tw-ring-color": "#1D9E75" } as React.CSSProperties}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5" htmlFor="nom">
            Nom <span className="text-red-400">*</span>
          </label>
          <input id="nom" name="nom" type="text" value={form.nom} onChange={handleChange}
            placeholder="Chirawi"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5" htmlFor="email">
          Adresse email <span className="text-red-400">*</span>
        </label>
        <input id="email" name="email" type="email" value={form.email} onChange={handleChange}
          placeholder="prenom@email.com"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition"
        />
      </div>

      {/* Ville / Disponibilité */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5" htmlFor="ville">
            Ville / Région
          </label>
          <input id="ville" name="ville" type="text" value={form.ville} onChange={handleChange}
            placeholder="Paris, Lyon, Bordeaux…"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5" htmlFor="disponibilite">
            Disponibilité
          </label>
          <select id="disponibilite" name="disponibilite" value={form.disponibilite} onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition bg-white">
            <option value="">Choisir…</option>
            <option>Quelques heures / mois</option>
            <option>1 à 2 jours / mois</option>
            <option>Week-ends uniquement</option>
            <option>Flexible</option>
          </select>
        </div>
      </div>

      {/* Rôles */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Rôle(s) souhaité(s)</p>
        <div className="flex flex-wrap gap-2">
          {ROLE_OPTIONS.map((role) => {
            const selected = roles.includes(role);
            return (
              <button key={role} type="button" onClick={() => toggleRole(role)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
                style={{
                  borderColor: selected ? "#1D9E75" : "#e5e7eb",
                  background: selected ? "#1D9E7515" : "white",
                  color: selected ? "#1D9E75" : "#6b7280",
                }}>
                {selected ? "✓ " : ""}{role}
              </button>
            );
          })}
        </div>
      </div>

      {/* Motivation */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5" htmlFor="motivation">
          Pourquoi veux-tu rejoindre ? <span className="text-red-400">*</span>
        </label>
        <textarea id="motivation" name="motivation" value={form.motivation} onChange={handleChange}
          rows={4}
          placeholder="En quelques lignes, dis-nous ce qui te motive et ce que tu apportes…"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition resize-none"
        />
      </div>

      {/* Error */}
      {errorMsg && (
        <p className="text-sm text-red-500 bg-red-50 px-4 py-2.5 rounded-xl">{errorMsg}</p>
      )}

      {/* Submit */}
      <button type="submit" disabled={status === "loading"}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
        style={{ background: "#1D9E75", color: "white" }}>
        {status === "loading"
          ? <><Loader2 size={16} className="animate-spin" /> Envoi en cours…</>
          : <><Send size={16} /> Envoyer ma candidature</>}
      </button>

      <p className="text-center text-xs text-gray-400">
        Tes données ne seront utilisées que dans le cadre de ta candidature bénévole.
      </p>
    </form>
  );
}

/* ── helpers ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay },
});

/* ── data ── */
const ADHESION_PERKS = [
  { emoji: "🎓", text: "Réductions sur nos événements (soirées, ateliers, conférences)" },
  { emoji: "🤝", text: "Accès prioritaire au réseau d'entraide privé" },
  { emoji: "🏠", text: "Offres exclusives partenaires (logement, services, abonnements)" },
  { emoji: "📧", text: "Newsletter mensuelle avec les bons plans réservés aux membres" },
  { emoji: "🗣️", text: "Droit de vote aux assemblées générales" },
  { emoji: "❤️", text: "Tu soutiens une association qui aide des centaines d'étudiants" },
];

function AdhesionForm() {
  const [form, setForm] = useState({ prenom: "", nom: "", email: "", ville: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.prenom || !form.nom || !form.email) {
      setErrorMsg("Merci de remplir les champs obligatoires.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/adhesion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Une erreur s'est produite. Réessaie ou écris-nous directement.");
    }
  };

  if (status === "success") {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 px-6">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: "#FEE2E2" }}>
          <CheckCircle2 size={30} style={{ color: "#C1272D" }} />
        </div>
        <h3 className="text-xl font-black text-brand-dark mb-2" style={{ fontFamily: "var(--font-outfit)" }}>
          Demande enregistrée ! 🎉
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto mb-6">
          Merci {form.prenom} ! Tu peux maintenant finaliser ton adhésion (15€/an) en cliquant sur le bouton ci-dessous.
        </p>
        <a 
          href="https://buy.stripe.com/eVqdR22cP1ne9T7gaFb3q01"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: "#C1272D", color: "white" }}>
          <CreditCard size={18} /> Payer mon adhésion (15€)
        </a>
        <p className="text-[10px] text-gray-400 mt-4 italic">
          Un email de confirmation avec ce lien t'a également été envoyé.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Prénom <span className="text-red-400">*</span></label>
          <input name="prenom" type="text" value={form.prenom} onChange={handleChange} placeholder="Yassir"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 transition" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Nom <span className="text-red-400">*</span></label>
          <input name="nom" type="text" value={form.nom} onChange={handleChange} placeholder="Chirawi"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 transition" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Email <span className="text-red-400">*</span></label>
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="prenom@email.com"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 transition" />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Ville (optionnel)</label>
        <input name="ville" type="text" value={form.ville} onChange={handleChange} placeholder="Paris, Lyon…"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 transition" />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Un mot (optionnel)</label>
        <textarea name="message" value={form.message} onChange={handleChange} rows={3}
          placeholder="Comment as-tu connu l'association ? Un mot de motivation…"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 transition resize-none" />
      </div>
      {errorMsg && <p className="text-sm text-red-500 bg-red-50 px-4 py-2.5 rounded-xl">{errorMsg}</p>}
      <button type="submit" disabled={status === "loading"}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm hover:scale-[1.02] transition-all disabled:opacity-60"
        style={{ background: "#C1272D", color: "white" }}>
        {status === "loading"
          ? <><Loader2 size={16} className="animate-spin" /> Envoi…</>
          : <><Heart size={16} /> Adhérer pour 15€/an</>}
      </button>
      <p className="text-center text-xs text-gray-400">
        Tu seras redirigé vers le paiement sécurisé après cette étape.
      </p>
    </form>
  );
}

const BENEVOLE_ROLES = [
  {
    icon: <BookOpen size={22} />,
    title: "Tuteur / Mentor",
    desc: "Accompagne un nouvel arrivant dans ses premières semaines en France : conseils, démarches, premiers repères.",
    color: "#1D9E75",
    bg: "#f0fdf4",
  },
  {
    icon: <Megaphone size={22} />,
    title: "Communication & Réseaux",
    desc: "Crée du contenu, anime nos réseaux sociaux et aide à faire connaître l'association auprès des futurs étudiants.",
    color: "#7C3AED",
    bg: "#f5f3ff",
  },
  {
    icon: <Globe size={22} />,
    title: "Correspondant Local",
    desc: "Tu vis dans une ville de France ? Sois le référent MDM de ta ville, organise des rencontres et relie les étudiants.",
    color: "#0284C7",
    bg: "#f0f9ff",
  },
  {
    icon: <Handshake size={22} />,
    title: "Partenariats",
    desc: "Identifie et contacte des partenaires potentiels (logement, services, entreprises) pour enrichir nos offres.",
    color: "#D97706",
    bg: "#fffbeb",
  },
  {
    icon: <Trophy size={22} />,
    title: "Animation Événements",
    desc: "Aide à organiser nos soirées d'intégration, tournois sportifs, webinaires et sorties culturelles.",
    color: "#C1272D",
    bg: "#fff1f2",
  },
  {
    icon: <Star size={22} />,
    title: "Créatif / Tech",
    desc: "Designer, dev, photographe, vidéaste… Mets tes talents au service de la communauté.",
    color: "#2C2C2A",
    bg: "#f8fafc",
  },
];

const ETAPES = [
  { num: "01", title: "Rejoins le groupe", desc: "Envoie-nous un message sur Instagram ou par email pour te présenter et dire ce qui te motive." },
  { num: "02", title: "Un échange rapide", desc: "On organise un court appel ou échange pour mieux te connaître et trouver le rôle qui te correspond." },
  { num: "03", title: "Bienvenue dans l'équipe", desc: "Tu rejoins notre groupe bénévoles, tu accèdes aux outils et tu commences à contribuer à ton rythme." },
];

/* ── component ── */
export default function RejoindreClient() {
  return (
    <div className="bg-[#fafafa] min-h-screen">

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden pt-36 pb-24 text-center"
        style={{ background: "linear-gradient(150deg, #1D9E75 0%, #15745A 60%, #0f5c46 100%)" }}
      >
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)", backgroundSize: "32px 32px" }} />
        <div className="relative max-w-4xl mx-auto px-6">
          <motion.div {...fadeUp(0)}>
            <span className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              <Users size={14} /> Association Loi 1901 · SIRET 990831778
            </span>
          </motion.div>
          <motion.h1 {...fadeUp(0.05)}
            className="text-4xl md:text-6xl font-black text-white leading-tight mb-5"
            style={{ fontFamily: "var(--font-outfit)" }}>
            Rejoins notre réseau.<br />
            <span className="text-emerald-200">Ensemble, on va plus loin.</span>
          </motion.h1>
          <motion.p {...fadeUp(0.1)} className="text-emerald-100 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Adhère à l'association, deviens bénévole ou simplement fais partie de la communauté MDM —
            chaque engagement, petit ou grand, renforce le réseau.
          </motion.p>
          <motion.div {...fadeUp(0.15)} className="flex flex-wrap gap-4 justify-center">
            <a href="#adhesion"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm shadow-xl transition-all hover:scale-105"
              style={{ background: "white", color: "#1D9E75" }}>
              <Heart size={16} /> Adhérer maintenant
            </a>
            <a href="#benevole"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm border border-white/40 text-white hover:bg-white/10 transition-all">
              <Sparkles size={16} /> Devenir bénévole
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── POURQUOI REJOINDRE ── */}
      <section className="py-20 max-w-5xl mx-auto px-6">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-3" style={{ fontFamily: "var(--font-outfit)" }}>
            Pourquoi rejoindre MDM ?
          </h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            L'association, c'est avant tout une communauté humaine — des étudiants qui s'entraident, partagent et grandissent ensemble.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { emoji: "🤝", title: "Un réseau solide", desc: "Des centaines d'étudiants à travers la France prêts à partager leur expérience, leurs bons plans et leurs contacts." },
            { emoji: "📚", title: "Des ressources exclusives", desc: "Guides, modèles de lettres, fiches pratiques, accès à des webinaires et ateliers réservés aux membres." },
            { emoji: "🌍", title: "Un impact réel", desc: "Chaque adhésion finance directement nos actions : guides imprimés, événements, accompagnements individuels." },
          ].map((item, i) => (
            <motion.div key={i} {...fadeUp(i * 0.08)}
              className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">{item.emoji}</div>
              <h3 className="font-bold text-base mb-2 text-brand-dark" style={{ fontFamily: "var(--font-outfit)" }}>{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── ADHÉSION ── */}
      <section id="adhesion" className="scroll-mt-24 md:scroll-mt-28 py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div {...fadeUp()} className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-red bg-brand-red/10 px-4 py-1.5 rounded-full inline-block mb-4">
              Adhésion annuelle
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-4" style={{ fontFamily: "var(--font-outfit)" }}>
              Tout est gratuit.
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-rose-400">
                L'adhésion, c'est un coup de pouce.
              </span>
            </h2>
            <p className="text-gray-500 text-base max-w-2xl mx-auto leading-relaxed">
              Le guide, les checklists, les conseils — tout est accessible sans adhérer. Mais si tu veux aller plus loin,
              soutenir l'association et profiter d'avantages exclusifs, l'adhésion à <strong>15€/an</strong> est faite pour toi.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Left — avantages */}
            <motion.div {...fadeUp(0.05)}>
              <div className="bg-[#fafafa] rounded-2xl border border-gray-100 p-7 mb-6">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5">Ce que tu obtiens en adhérant</p>
                <ul className="space-y-3">
                  {ADHESION_PERKS.map((p, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-lg flex-shrink-0">{p.emoji}</span>
                      <span className="text-sm text-gray-600 leading-snug">{p.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center gap-4 p-5 rounded-2xl" style={{ background: "linear-gradient(135deg, #C1272D10, #C1272D05)" }}>
                <div className="text-3xl font-black" style={{ color: "#C1272D" }}>15€</div>
                <div>
                  <p className="font-bold text-brand-dark text-sm">/an · Adhésion annuelle</p>
                  <p className="text-xs text-gray-400">Résiliable à tout moment · Paiement sécurisé</p>
                </div>
              </div>
            </motion.div>

            {/* Right — formulaire */}
            <motion.div {...fadeUp(0.1)}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
                <p className="text-sm font-bold text-brand-dark mb-5" style={{ fontFamily: "var(--font-outfit)" }}>
                  Remplis ce formulaire — on t'envoie le lien de paiement sous 48h.
                </p>
                <AdhesionForm />
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      <section id="benevole" className="scroll-mt-24 md:scroll-mt-28 py-20 max-w-5xl mx-auto px-6">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-violet-600 bg-violet-50 px-4 py-1.5 rounded-full inline-block mb-4">
            100% bénévole · À votre rythme
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-3" style={{ fontFamily: "var(--font-outfit)" }}>
            Deviens bénévole MDM
          </h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            Tu es étudiant(e) installé(e) en France et tu veux aider les autres ? Il n'y a pas de petit geste.
            Choisissez un rôle qui correspond à vos disponibilités et compétences.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-14">
          {BENEVOLE_ROLES.map((role, i) => (
            <motion.div key={i} {...fadeUp(i * 0.06)}
              className="rounded-2xl p-5 border border-gray-100 bg-white hover:shadow-md transition-shadow group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                style={{ background: role.bg, color: role.color }}>
                {role.icon}
              </div>
              <h3 className="font-bold text-sm mb-1.5" style={{ color: "#2C2C2A" }}>{role.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{role.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Étapes */}
        <motion.div {...fadeUp(0.1)}
          className="rounded-2xl p-8 mb-14"
          style={{ background: "linear-gradient(135deg, #1D9E75 0%, #15745A 100%)" }}>
          <h3 className="text-white font-bold text-lg text-center mb-8" style={{ fontFamily: "var(--font-outfit)" }}>
            Comment ça se passe ?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ETAPES.map((e, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-3xl font-black text-white/20 leading-none flex-shrink-0">{e.num}</span>
                <div>
                  <p className="text-white font-bold text-sm mb-1">{e.title}</p>
                  <p className="text-emerald-100 text-xs leading-relaxed">{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── FORMULAIRE BÉNÉVOLE ── */}
        <motion.div {...fadeUp(0.1)} id="formulaire-benevole" className="scroll-mt-24 md:scroll-mt-28">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
              style={{ background: "#EDE9FE", color: "#7C3AED" }}>
              <Sparkles size={13} /> Candidature en ligne
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-brand-dark" style={{ fontFamily: "var(--font-outfit)" }}>
              Postule en 2 minutes
            </h3>
            <p className="text-gray-400 text-sm mt-2">Remplis ce formulaire et on revient vers toi rapidement.</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-2xl mx-auto">
            <BenevoleForm />
          </div>
        </motion.div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div {...fadeUp()}>
            <h2 className="text-2xl md:text-3xl font-black text-brand-dark mb-3" style={{ fontFamily: "var(--font-outfit)" }}>
              Pas encore prêt(e) à adhérer ?
            </h2>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Commence par explorer notre guide gratuit, consulter nos checklists de rentrée
              ou simplement nous suivre sur Instagram pour rester informé(e).
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/guide"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm border border-gray-200 hover:border-brand-green hover:text-brand-green transition-all">
                <BookOpen size={15} /> Lire le guide
              </Link>
              <Link href="/checklist"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm border border-gray-200 hover:border-brand-green hover:text-brand-green transition-all">
                ✅ Checklist rentrée
              </Link>
              <a href="https://www.instagram.com/marocainsenfrance/" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm"
                style={{ background: "#1D9E75", color: "white" }}>
                <ArrowRight size={15} /> Suivre sur Instagram
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
