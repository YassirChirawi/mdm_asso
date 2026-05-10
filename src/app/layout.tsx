import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: {
    default: "Marocains en France – Guide & Accompagnement Étudiant n°1",
    template: "%s | Marocains en France"
  },
  description: "La plateforme de référence pour les étudiants marocains en France : guide administratif, aide au logement, Campus France, bourses et vie associative. Réussissez votre installation avec l'Association MDM.",
  keywords: [
    "étudiants marocains en France", 
    "étudier en France depuis le Maroc", 
    "Campus France Maroc", 
    "Visa étudiant France Maroc", 
    "Logement étudiant France", 
    "Association Marocains en France",
    "Démarches administratives France étudiant",
    "Bourse étude France Maroc",
    "Aide au logement CAF étudiant étranger",
    "Renouvellement titre de séjour étudiant",
    "Conseils expatriation France Maroc",
    "Communauté MDM",
    "Réussir ses études en France"
  ],
  authors: [{ name: "Association MDM" }],
  creator: "Association MDM",
  alternates: {
    canonical: "https://www.marocainsenfrance.fr",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://www.marocainsenfrance.fr",
    siteName: "Marocains en France",
    title: "Marocains en France – Le Guide Complet pour Étudiants",
    description: "Tout ce qu'un étudiant marocain doit savoir pour s'installer en France : Visa, CAF, Logement, Jobs et Intégration.",
    images: [{
      url: "/logo.png",
      width: 1200,
      height: 630,
      alt: "Association Marocains en France - Main dans la main"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Marocains en France",
    description: "Le guide n°1 pour les étudiants marocains s'installant en France.",
    images: ["/logo.png"],
  },
  metadataBase: new URL("https://www.marocainsenfrance.fr"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NGO",
    "name": "Association Marocains en France - Main dans la main",
    "url": "https://www.marocainsenfrance.fr",
    "logo": "https://www.marocainsenfrance.fr/logo.png",
    "description": "Association d'accompagnement des étudiants marocains en France pour le logement, les démarches administratives et l'intégration.",
    "sameAs": [
      "https://www.instagram.com/marocainsenfrance/"
    ]
  };

  return (
    <html lang="fr" className={`scroll-smooth ${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans min-h-screen flex flex-col bg-white text-brand-dark antialiased overflow-x-hidden">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
