import type { Metadata } from "next";
import ChecklistClient from "./ChecklistClient";

export const metadata: Metadata = {
  title: "Checklists Rentrée 2026-2027",
  description:
    "Checklists complètes et téléchargeables pour préparer votre rentrée universitaire en France 2026-2027. Visa, logement, CVEC, banque, assurance et plus.",
  keywords: [
    "checklist rentrée étudiante",
    "préparation rentrée France",
    "checklist étudiant marocain",
    "formalités universitaires",
    "rentrée 2026 2027",
  ],
};

export default function ChecklistPage() {
  return <ChecklistClient />;
}
