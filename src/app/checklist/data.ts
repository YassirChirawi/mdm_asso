export interface ChecklistItem {
  id: string;
  label: string;
  detail?: string;
  link?: { text: string; url: string };
  urgent?: boolean;
}

export interface ChecklistCategory {
  id: string;
  title: string;
  emoji: string;
  color: string; // Tailwind bg class
  accentColor: string; // hex
  description: string;
  deadline?: string;
  items: ChecklistItem[];
}

export const CHECKLISTS: ChecklistCategory[] = [
  {
    id: "visa-admission",
    title: "Visa & Admission",
    emoji: "🛂",
    color: "bg-emerald-50",
    accentColor: "#1D9E75",
    description:
      "Les démarches à effectuer avant de quitter le Maroc pour obtenir votre visa et confirmer votre inscription.",
    deadline: "Avant le départ",
    items: [
      {
        id: "va-1",
        label: "Obtenir votre lettre d'admission définitive",
        detail:
          "Confirmation officielle de l'université (Parcoursup ou inscription directe).",
        urgent: true,
      },
      {
        id: "va-2",
        label: "Constituer le dossier de visa long séjour étudiant (VLS-TS)",
        detail:
          "Passeport valide, photos, justificatif de logement, ressources financières, lettre d'admission, assurance.",
        urgent: true,
      },
      {
        id: "va-3",
        label: "Prendre rendez-vous au Campus France (si applicable)",
        detail:
          "Procédure CEF obligatoire pour la plupart des pays. Vérifiez si votre pays est concerné.",
      },
      {
        id: "va-4",
        label: "Payer les frais de scolarité / confirmer l'inscription",
        detail:
          "Respectez la date limite imposée par votre établissement sous peine de perdre votre place.",
        urgent: true,
      },
      {
        id: "va-5",
        label: "Télécharger et signer la charte de l'étudiant",
        detail: "Document fourni par votre université ou grande école.",
      },
      {
        id: "va-6",
        label: "Vérifier les conditions d'équivalence de diplômes (si master)",
        detail:
          "Certains masters requièrent une validation de votre bac ou licence marocain.",
      },
      {
        id: "va-7",
        label: "Préparer les justificatifs de ressources financières",
        detail:
          "Relevés bancaires des 3 derniers mois, attestation de bourse, ou garantie d'un garant français.",
      },
      {
        id: "va-8",
        label: "Valider le visa à l'OFII dès l'arrivée en France",
        detail:
          "Obligatoire dans les 3 mois suivant l'arrivée. Rendez-vous sur ofii.fr.",
        urgent: true,
      },
    ],
  },
  {
    id: "logement",
    title: "Logement",
    emoji: "🏠",
    color: "bg-blue-50",
    accentColor: "#2563EB",
    description:
      "Trouver et sécuriser votre logement avant ou dès votre arrivée en France.",
    deadline: "Idéalement 3 mois avant la rentrée",
    items: [
      {
        id: "log-1",
        label: "Candidater aux résidences CROUS",
        detail:
          "Via Mon Dossier Social Étudiant (MDSE). Ouvre généralement en janvier pour la rentrée suivante.",
        urgent: true,
      },
      {
        id: "log-2",
        label: "Explorer les alternatives : colocation, foyer, résidence privée",
        detail:
          "Platforms recommandées : Leboncoin, SeLoger, HousingAnywhere, Studapart.",
      },
      {
        id: "log-3",
        label: "Préparer un dossier de location solide",
        detail:
          "Pièce d'identité, justificatif d'inscription, garant ou garantie Visale.",
      },
      {
        id: "log-4",
        label: "Obtenir une garantie Visale (Action Logement)",
        detail:
          "Garantie gratuite remplaçant le garant physique. Demande sur visale.fr avant la signature du bail.",
        link: { text: "visale.fr", url: "https://www.visale.fr" },
      },
      {
        id: "log-5",
        label: "Signer le bail et récupérer les clés",
        detail:
          "Lisez attentivement le bail et faites un état des lieux détaillé à l'entrée.",
      },
      {
        id: "log-6",
        label: "Souscrire une assurance habitation (obligatoire)",
        detail:
          "Obligatoire avant l'entrée dans les lieux. Comparez les offres : Luko, Acheel, Maaf Étudiant.",
        urgent: true,
      },
      {
        id: "log-7",
        label: "Demander l'APL (Aide Personnalisée au Logement)",
        detail:
          "Via CAF.fr. À demander dès l'entrée dans le logement. Attention : les étudiants extra-UE peuvent ne plus y être éligibles depuis 2026.",
        link: { text: "caf.fr", url: "https://www.caf.fr" },
      },
      {
        id: "log-8",
        label: "Ouvrir les compteurs (électricité, internet)",
        detail:
          "Enedis pour l'électricité, Free/SFR/Orange pour internet. Prévoir 1 à 2 semaines de délai.",
      },
    ],
  },
  {
    id: "banque-finances",
    title: "Banque & Finances",
    emoji: "💳",
    color: "bg-violet-50",
    accentColor: "#7C3AED",
    description:
      "Ouvrir un compte bancaire français et organiser vos finances pour l'année.",
    deadline: "Dès l'arrivée",
    items: [
      {
        id: "bf-1",
        label: "Ouvrir un compte bancaire en France",
        detail:
          "Banques recommandées pour étudiants : Boursorama, Hello Bank, BNP Paribas, Société Générale.",
        urgent: true,
      },
      {
        id: "bf-2",
        label: "Obtenir une carte bancaire étudiante",
        detail:
          "Vérifiez les frais de tenue de compte (beaucoup de banques offrent la gratuité aux étudiants).",
      },
      {
        id: "bf-3",
        label: "Transférer de l'argent depuis le Maroc",
        detail:
          "Transferts autorisés via agence bancaire avec justificatifs. Montant annuel plafonné.",
      },
      {
        id: "bf-4",
        label: "Établir un budget mensuel prévisionnel",
        detail:
          "Loyer, alimentation, transport, loisirs, abonnements. Prévoir ~700-1200€/mois selon la ville.",
      },
      {
        id: "bf-5",
        label: "Demander la bourse sur critères sociaux (si éligible)",
        detail:
          "Déposez la demande sur Mon Dossier Social Étudiant avant le 31 décembre.",
        link: {
          text: "etudiant.gouv.fr",
          url: "https://www.etudiant.gouv.fr/fr/bourses-et-logement",
        },
      },
      {
        id: "bf-6",
        label: "Conserver tous les justificatifs de dépenses",
        detail:
          "Utiles pour la déclaration d'impôts et le renouvellement du titre de séjour.",
      },
    ],
  },
  {
    id: "sante-securite-sociale",
    title: "Santé & Sécurité Sociale",
    emoji: "🏥",
    color: "bg-rose-50",
    accentColor: "#E11D48",
    description:
      "S'inscrire à la sécurité sociale étudiante et organiser votre couverture santé.",
    deadline: "Dans le mois suivant l'arrivée",
    items: [
      {
        id: "ss-1",
        label: "S'affilier à la Sécurité Sociale Étudiante",
        detail:
          "Inscription via ameli.fr ou directement à votre CPAM. Munissez-vous de votre numéro d'étudiant.",
        link: { text: "ameli.fr", url: "https://www.ameli.fr" },
        urgent: true,
      },
      {
        id: "ss-2",
        label: "Obtenir votre carte vitale",
        detail:
          "Demander la carte vitale après affiliation à la CPAM (délai : 1 à 3 mois).",
      },
      {
        id: "ss-3",
        label: "Souscrire une mutuelle complémentaire",
        detail:
          "La Sécu rembourse 70% des soins. Une mutuelle couvre le reste. Comparez : Smerep, LMDE, Harmonie.",
      },
      {
        id: "ss-4",
        label: "Déclarer un médecin traitant",
        detail:
          "Obligatoire pour être bien remboursé. Cherchez un médecin proche sur ameli.fr.",
      },
      {
        id: "ss-5",
        label: "Vaccination : mettre à jour le carnet de santé",
        detail:
          "Certaines formations exigent des vaccinations spécifiques (ex : hépatite B en médecine).",
      },
      {
        id: "ss-6",
        label: "Prendre connaissance des services de santé universitaires (SSU)",
        detail:
          "Votre université dispose d'un service de santé gratuit ou à tarif réduit.",
      },
    ],
  },
  {
    id: "administrative",
    title: "Démarches Administratives",
    emoji: "📋",
    color: "bg-amber-50",
    accentColor: "#D97706",
    description:
      "Les formalités administratives incontournables dès votre arrivée en France.",
    deadline: "Dans les 3 premiers mois",
    items: [
      {
        id: "adm-1",
        label: "Valider le VLS-TS sur ANEF (procédure OFII)",
        detail:
          "Téléprocédure obligatoire dans les 3 mois suivant l'arrivée sur administration-etrangers-en-france.gouv.fr.",
        urgent: true,
        link: {
          text: "anef.fr",
          url: "https://administration-etrangers-en-france.interieur.gouv.fr",
        },
      },
      {
        id: "adm-2",
        label: "Payer la CVEC (Contribution Vie Étudiante)",
        detail:
          "103 € en 2026. Obligatoire avant la rentrée. Attestation à fournir lors de l'inscription.",
        urgent: true,
        link: { text: "cvec.etudiant.gouv.fr", url: "https://cvec.etudiant.gouv.fr" },
      },
      {
        id: "adm-3",
        label: "S'inscrire pédagogiquement à l'université",
        detail:
          "Inscription administrative puis pédagogique (choix des UE et groupes). Respectez les délais.",
      },
      {
        id: "adm-4",
        label: "Obtenir la carte étudiante",
        detail:
          "Indispensable pour les réductions (transports, cinéma, musées, restauration universitaire).",
      },
      {
        id: "adm-5",
        label: "S'inscrire au restaurant universitaire (RU) du CROUS",
        detail:
          "Repas à partir de 3,30 € avec la carte étudiant. Inscription via l'application Izly.",
        link: { text: "crous.fr", url: "https://www.crous.fr" },
      },
      {
        id: "adm-6",
        label: "Renouveler le titre de séjour si nécessaire",
        detail:
          "Le VLS-TS vaut titre de séjour la 1ère année. À partir de la 2ème année : demander un titre de séjour étudiant.",
      },
      {
        id: "adm-7",
        label: "S'inscrire sur les listes électorales consulaires (optionnel)",
        detail:
          "Permet de voter aux élections marocaines depuis la France. Contact : consulat du Maroc.",
      },
    ],
  },
  {
    id: "transport",
    title: "Transport & Mobilité",
    emoji: "🚇",
    color: "bg-sky-50",
    accentColor: "#0284C7",
    description:
      "Organiser vos déplacements quotidiens et profiter des tarifs étudiants.",
    deadline: "Dès la rentrée",
    items: [
      {
        id: "tr-1",
        label: "Obtenir un abonnement transport en commun étudiant",
        detail:
          "Ex : Navigo Mois jeune (Paris), TaM Étudiant (Montpellier). Jusqu'à 50% de réduction.",
        urgent: true,
      },
      {
        id: "tr-2",
        label: "Créer un compte SNCF et activer la carte Avantage Jeune",
        detail:
          "Réductions sur les billets de train pour les moins de 27 ans. 49€/an.",
        link: { text: "sncf-connect.com", url: "https://www.sncf-connect.com" },
      },
      {
        id: "tr-3",
        label: "Repérer les lignes de bus/métro entre votre logement et l'université",
        detail: "Utilisez Google Maps ou l'application de votre réseau local.",
      },
      {
        id: "tr-4",
        label: "Explorer les options de covoiturage (BlaBlaCar, Karos)",
        detail: "Très pratique pour les week-ends ou les déplacements inter-villes.",
      },
      {
        id: "tr-5",
        label: "Vérifier si un vélo ou trottinette est accessible via votre campus",
        detail:
          "Beaucoup d'universités offrent des prêts de vélos gratuits ou à tarif réduit.",
      },
    ],
  },
  {
    id: "vie-universitaire",
    title: "Vie Universitaire & Intégration",
    emoji: "🎓",
    color: "bg-teal-50",
    accentColor: "#0D9488",
    description:
      "Réussir votre intégration académique et sociale pour profiter pleinement de votre année.",
    deadline: "Septembre - Octobre",
    items: [
      {
        id: "vu-1",
        label: "Participer à la semaine d'intégration (WEI / week-end d'intégration)",
        detail:
          "Excellente occasion de rencontrer vos camarades et de vous faire des amis dès les premiers jours.",
      },
      {
        id: "vu-2",
        label: "Rejoindre des associations étudiantes",
        detail:
          "BDE, associations sportives, culturelles ou professionnelles. Enrichit le CV et la vie sociale.",
      },
      {
        id: "vu-3",
        label: "Rejoindre notre association Marocains en France (MDM)",
        detail:
          "Événements, entraide, réseau d'anciens et accompagnement tout au long de l'année.",
        urgent: true,
      },
      {
        id: "vu-4",
        label: "Repérer la bibliothèque universitaire (BU) et ses ressources numériques",
        detail:
          "Accès gratuit à des milliers de livres, revues et bases de données académiques.",
      },
      {
        id: "vu-5",
        label: "Créer votre espace numérique de travail (ENT)",
        detail:
          "Email universitaire, emploi du temps, accès aux cours en ligne (Moodle, etc.).",
      },
      {
        id: "vu-6",
        label: "Prendre connaissance du règlement intérieur et du plagiat",
        detail:
          "Le plagiat est sévèrement sanctionné. Familiarisez-vous avec les règles académiques.",
      },
      {
        id: "vu-7",
        label: "Identifier les services d'aide à la réussite",
        detail:
          "Tutorat, soutien pédagogique, bureau des étudiants en situation de handicap.",
      },
      {
        id: "vu-8",
        label: "Planifier les examens et les partiels dès le début du semestre",
        detail:
          "Mettez en place un planning de révisions dès que vous avez les dates officielles.",
      },
    ],
  },
  {
    id: "numerique",
    title: "Outils Numériques",
    emoji: "💻",
    color: "bg-indigo-50",
    accentColor: "#4F46E5",
    description:
      "Les comptes et outils numériques essentiels à configurer pour votre vie étudiante.",
    deadline: "Dès l'inscription",
    items: [
      {
        id: "num-1",
        label: "Activer votre adresse email universitaire",
        detail:
          "Toutes les communications officielles passent par cet email. Vérifiez-le quotidiennement.",
        urgent: true,
      },
      {
        id: "num-2",
        label: "Installer un gestionnaire de mots de passe",
        detail:
          "Bitwarden (gratuit) ou 1Password pour gérer vos nombreux comptes en toute sécurité.",
      },
      {
        id: "num-3",
        label: "Activer Microsoft 365 ou Google Workspace étudiant",
        detail: "Souvent gratuit pour les étudiants. Accès à Word, Excel, PowerPoint, etc.",
      },
      {
        id: "num-4",
        label: "Installer les applications essentielles",
        detail: "Izly (RU), Ameli, Mon Compte Formation, application de votre banque, votre réseau de transport.",
      },
      {
        id: "num-5",
        label: "Configurer un VPN fiable",
        detail: "Utile pour accéder à certaines ressources universitaires hors campus.",
      },
      {
        id: "num-6",
        label: "Rejoindre les groupes de promotion et Discord/WhatsApp de votre formation",
        detail: "Restez informé des annonces, organisez des groupes de travail, partagez les ressources.",
      },
    ],
  },
];
