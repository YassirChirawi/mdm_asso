import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: {
    default: "Marocains en France – Main dans la main",
    template: "%s | Marocains en France"
  },
  description: "La communauté et l'accompagnement n°1 des étudiants marocains en France. Logement, administration, vie sociale et réussite scolaire.",
  keywords: ["étudiants marocains", "étude en France", "Marocains en France", "Visa France", "Logement étudiant France", "Association marocaine"],
  authors: [{ name: "Yassir Chirawi" }],
  creator: "Association MDM",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://www.marocainsenfrance.fr",
    siteName: "Marocains en France",
    title: "Marocains en France – Accompagnement des étudiants",
    description: "Guide complet et communauté pour réussir son expatriation étudiante en France.",
    images: [{
      url: "/logo.png",
      width: 800,
      height: 600,
      alt: "MDM Association Logo"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Marocains en France",
    description: "L'accompagnement n°1 des étudiants marocains en France.",
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
    <html lang="fr" className={`scroll-smooth ${inter.variable} ${outfit.variable}`}>
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
