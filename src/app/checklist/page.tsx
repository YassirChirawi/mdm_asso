import type { Metadata } from "next";
import ChecklistClient from "./ChecklistClient";

export const metadata: Metadata = {
  title: "Checklist rentrée 2026-2027 pour étudiants marocains en France",
  description:
    "54 étapes pour réussir votre rentrée en France : visa, logement, CVEC, sécurité sociale, banque, transport. Checklist interactive téléchargeable en PDF, créée par des étudiants marocains pour des étudiants marocains.",
  keywords: [
    "checklist rentrée étudiante 2026",
    "préparation rentrée France étudiant",
    "checklist étudiant marocain France",
    "formalités visa étudiant France",
    "VLS-TS procédure",
    "CVEC 2026",
    "logement étudiant France Maroc",
    "CAF étudiant étranger",
    "rentrée 2026 2027",
  ],
  alternates: { canonical: "https://www.marocainsenfrance.fr/checklist" },
  openGraph: {
    title: "Checklist Rentrée 2026-2027 | Marocains en France",
    description:
      "54 démarches incontournables pour préparer votre installation en France. Interactive, téléchargeable en PDF, 100% gratuit.",
    url: "https://www.marocainsenfrance.fr/checklist",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Checklist Rentrée 2026-2027 pour Étudiants Marocains en France",
  description:
    "Guide étape par étape pour préparer votre arrivée et installation en France en tant qu'étudiant(e) marocain(e).",
  totalTime: "P3M",
  estimatedCost: { "@type": "MonetaryAmount", currency: "EUR", value: "0" },
  supply: [
    { "@type": "HowToSupply", name: "Passeport valide" },
    { "@type": "HowToSupply", name: "Lettre d'admission universitaire" },
    { "@type": "HowToSupply", name: "Justificatifs de ressources financières" },
  ],
  step: [
    { "@type": "HowToStep", name: "Visa & Admission", text: "Obtenir votre visa VLS-TS et confirmer votre admission." },
    { "@type": "HowToStep", name: "Logement", text: "Candidater au CROUS et sécuriser un logement en France." },
    { "@type": "HowToStep", name: "Démarches Administratives", text: "Valider le visa OFII, payer la CVEC, s'inscrire pédagogiquement." },
    { "@type": "HowToStep", name: "Santé", text: "S'affilier à la CPAM et souscrire une mutuelle étudiante." },
    { "@type": "HowToStep", name: "Banque & Finances", text: "Ouvrir un compte bancaire en France et organiser son budget." },
  ],
};

export default function ChecklistPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ChecklistClient />
    </>
  );
}
