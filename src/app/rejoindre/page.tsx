import type { Metadata } from "next";
import RejoindreClient from "./RejoindreClient";

export const metadata: Metadata = {
  title: "Rejoindre l'association : adhésion et bénévolat",
  description:
    "Rejoignez l'association Marocains en France : adhérez en ligne, devenez bénévole et intégrez un réseau d'entraide solide pour les étudiants marocains en France.",
  keywords: [
    "rejoindre association étudiants marocains",
    "adhésion association MDM",
    "devenir bénévole étudiant France",
    "réseau entraide marocain France",
    "association loi 1901 étudiants",
  ],
  alternates: { canonical: "https://www.marocainsenfrance.fr/rejoindre" },
  openGraph: {
    title: "Rejoindre Marocains en France : adhésion et bénévolat",
    description:
      "Adhérez à l'association, devenez bénévole et faites partie du réseau d'entraide n°1 des étudiants marocains en France.",
    url: "https://www.marocainsenfrance.fr/rejoindre",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "JoinAction",
  agent: { "@type": "Organization", name: "Association Marocains en France" },
  object: {
    "@type": "Organization",
    name: "Marocains en France – Main dans la main",
    url: "https://www.marocainsenfrance.fr",
  },
};

export default function RejoindrePageWrapper() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RejoindreClient />
    </>
  );
}
