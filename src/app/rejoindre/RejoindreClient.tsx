"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Heart, Users, Sparkles, CheckCircle2, ArrowRight,
  BookOpen, Megaphone, Globe, Trophy, Handshake, Star,
} from "lucide-react";

/* ── helpers ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay },
});

/* ── data ── */
const PLANS = [
  {
    id: "etudiant",
    label: "Membre Étudiant",
    price: "10",
    period: "/ an",
    color: "#1D9E75",
    highlight: false,
    perks: [
      "Accès au guide complet en PDF",
      "Invitations aux événements membres",
      "Accès au réseau d'entraide privé",
      "Badge membre sur le groupe WhatsApp",
      "Newsletter mensuelle exclusive",
    ],
  },
  {
    id: "soutien",
    label: "Membre Soutien",
    price: "25",
    period: "/ an",
    color: "#C1272D",
    highlight: true,
    perks: [
      "Tout ce qui est inclus dans Membre Étudiant",
      "Mention dans nos publications annuelles",
      "Accès prioritaire aux ateliers & webinaires",
      "Accompagnement personnalisé (1 séance offerte)",
      "Vote aux assemblées générales",
    ],
  },
  {
    id: "bienfaiteur",
    label: "Membre Bienfaiteur",
    price: "50",
    period: "/ an",
    color: "#2C2C2A",
    highlight: false,
    perks: [
      "Tout ce qui est inclus dans Membre Soutien",
      "Remerciement nominatif sur le site",
      "Accès à tous les ateliers sans limite",
      "Impact direct sur nos projets communautaires",
      "Attestation fiscale (don déductible si éligible)",
    ],
  },
];

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
      <section id="adhesion" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-green bg-brand-green/10 px-4 py-1.5 rounded-full inline-block mb-4">
              Frais d'adhésion
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-3" style={{ fontFamily: "var(--font-outfit)" }}>
              Choisissez votre niveau d'engagement
            </h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">
              Adhésion annuelle, résiliable à tout moment. Tous les montants vont directement au financement des projets associatifs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan, i) => (
              <motion.div key={plan.id} {...fadeUp(i * 0.08)}
                className="relative rounded-2xl border overflow-hidden flex flex-col"
                style={{
                  borderColor: plan.highlight ? plan.color + "60" : "#f3f4f6",
                  boxShadow: plan.highlight ? `0 8px 40px ${plan.color}20` : undefined,
                  background: plan.highlight ? `linear-gradient(160deg, ${plan.color}08, white)` : "white",
                }}>
                {plan.highlight && (
                  <div className="text-center text-xs font-bold uppercase tracking-widest py-2"
                    style={{ background: plan.color, color: "white" }}>
                    ⭐ Recommandé
                  </div>
                )}
                <div className="p-7 flex-1 flex flex-col">
                  <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: plan.color }}>{plan.label}</p>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-black" style={{ color: "#2C2C2A" }}>{plan.price}€</span>
                    <span className="text-gray-400 text-sm">{plan.period}</span>
                  </div>
                  <ul className="space-y-2.5 flex-1 mb-8">
                    {plan.perks.map((perk, j) => (
                      <li key={j} className="flex items-start gap-2.5">
                        <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" style={{ color: plan.color }} />
                        <span className="text-sm text-gray-600 leading-snug">{perk}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={`mailto:contact@marocainsenfrance.fr?subject=Adhésion ${plan.label}&body=Bonjour, je souhaite adhérer en tant que ${plan.label}.`}
                    className="block text-center py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
                    style={{
                      background: plan.highlight ? plan.color : plan.color + "15",
                      color: plan.highlight ? "white" : plan.color,
                    }}>
                    Adhérer — {plan.price}€/an
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p {...fadeUp(0.2)} className="text-center text-xs text-gray-400 mt-6">
            Le paiement s'effectue par virement ou via notre lien de don Stripe après confirmation par email. 
            Attestation d'adhésion fournie dans les 48h. · <Link href="/contact" className="underline">Une question ?</Link>
          </motion.p>
        </div>
      </section>

      {/* ── BENEVOLE ── */}
      <section id="benevole" className="py-20 max-w-5xl mx-auto px-6">
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
          className="rounded-2xl p-8"
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
          <div className="text-center mt-8">
            <a
              href="https://www.instagram.com/marocainsenfrance/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all hover:scale-105"
              style={{ background: "white", color: "#1D9E75" }}>
              <Sparkles size={15} /> Postuler comme bénévole
            </a>
            <p className="text-emerald-200 text-xs mt-3">
              Via Instagram ou par email à{" "}
              <a href="mailto:contact@marocainsenfrance.fr" className="underline font-semibold">
                contact@marocainsenfrance.fr
              </a>
            </p>
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
