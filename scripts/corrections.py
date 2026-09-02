# -*- coding: utf-8 -*-
"""Corrections factuelles appliquees au texte du guide.

Le PDF source a ete redige avant la rentree 2026 : plusieurs montants et regles
ont change depuis, parfois quelques semaines avant la rentree (APL, droits
d'inscription, timbres fiscaux). Comme le contenu est REGENERE depuis le PDF,
ces corrections ne peuvent pas vivre dans les JSON : elles seraient effacees au
prochain `npm run guide:extract`. Elles sont donc appliquees ici.

Chaque entree porte sa source et sa date de verification. `count` documente le
nombre d'occurrences attendues : si le compte ne tombe pas juste, l'extraction
echoue plutot que d'appliquer une correction a cote.

Verifie le 2 septembre 2026.
"""

CORRECTIONS = [
    # ------------------------------------------------------------------ CVEC
    {
        "chapter": 2,
        "find": "Montant : 100 € (tarif 2024–2025).",
        "replace": "Montant : 105 € (tarif 2026-2027).",
        "source": "https://cvec.etudiant.gouv.fr/",
        "note": "Le PDF donnait le tarif 2024-2025.",
    },
    # ------------------------------------------------- Aides au logement (APL)
    # Reforme du 1er juillet 2026 : un etudiant extracommunautaire n'a plus
    # droit aux aides au logement du seul fait de son titre de sejour.
    {
        "chapter": 2,
        "find": "Tu peux bénéficier d’une aide au logement (APL) dès ton arrivée, "
                "si ton dossier CAF est complet.",
        "replace": "Aide au logement (APL/ALS) : depuis le 1er juillet 2026, si tu es "
                   "étudiant extracommunautaire, un visa long séjour ou un titre "
                   "« poursuite d'études » ne suffit plus. Il faut en plus percevoir une "
                   "bourse sur critères sociaux, ou travailler (salarié, auto-entrepreneur, "
                   "apprentissage, professionnalisation). Et attention au piège : la bourse "
                   "sur critères sociaux exige 2 ans de résidence en France, donc elle est "
                   "hors de portée à ton arrivée. En pratique, si tu ne travailles pas, "
                   "construis ton budget de première année sans aide au logement.",
        "source": "https://www.caf.fr/allocataires/actualites/actualites-nationales/"
                  "apl-ce-qui-change-pour-certains-etudiants-partir-du-1er-juillet-2026",
        "note": "Le PDF presentait l'APL comme acquise a tout etudiant.",
    },
    {
        "chapter": 2,
        "find": "même si tu ne restes que quelques mois, fais la demande APL rapidement, "
                "l’effet est rétroactif parfois au premier mois si le dossier est déposé à temps.",
        "replace": "si tu remplis les conditions (bourse sur critères sociaux ou activité "
                   "professionnelle), fais la demande dès la signature du bail : le droit "
                   "s'ouvre le mois suivant l'entrée dans le logement, chaque mois de retard "
                   "est perdu.",
        "source": "https://www.caf.fr/allocataires/actualites/actualites-nationales/"
                  "apl-ce-qui-change-pour-certains-etudiants-partir-du-1er-juillet-2026",
        "note": "Conditionne le conseil et corrige la retroactivite, qui n'existe pas.",
    },
    # -------------------------------------------------------- Timbres fiscaux
    # Tarifs releves au 1er mai 2026. Tarif minore etudiant : 150 € en premiere
    # delivrance, 100 € en renouvellement ; 100 € pour l'APS.
    {
        "chapter": 4,
        "find": "Ne pas respecter les délais va entrainer automatquement une majoration "
                "sur le timbre de 75 € à 255 €",
        "replace": "Ne pas respecter les délais entraîne une majoration du droit de timbre",
        "source": "https://www.alpes-maritimes.gouv.fr/Demarches/Immigration-et-integration/"
                  "Tarifs-des-titres-de-sejour",
        "note": "Montants obsoletes depuis le 1er mai 2026, et faute de frappe « automatquement ».",
    },
    {
        "chapter": 4,
        "find": "Timbres fiscaux : €75,00.",
        "replace": "Droit de timbre : 100 € pour le renouvellement d'un titre étudiant "
                   "(tarif minoré, depuis le 1er mai 2026).",
        "source": "https://www.alpes-maritimes.gouv.fr/Demarches/Immigration-et-integration/"
                  "Tarifs-des-titres-de-sejour",
    },
    {
        "chapter": 4,
        "find": "Timbres fiscaux : 225,00 € (salarié) ou plus selon statut.",
        "replace": "Droit de timbre : 250 € pour un changement de statut vers « salarié » "
                   "(350 € en première délivrance de droit commun) depuis le 1er mai 2026. "
                   "Vérifie le tarif applicable à ton cas sur le site de ta préfecture.",
        "source": "https://www.alpes-maritimes.gouv.fr/Demarches/Immigration-et-integration/"
                  "Tarifs-des-titres-de-sejour",
    },
    {
        "chapter": 4,
        "find": "Timbres fiscaux : 225,00 €.",
        "replace": "Droit de timbre : 100 € pour l'APS (taxe créée le 1er mai 2026).",
        "source": "https://www.alpes-maritimes.gouv.fr/Demarches/Immigration-et-integration/"
                  "Tarifs-des-titres-de-sejour",
    },
    # --------------------------------------------------- Droits d'inscription
    {
        "chapter": 5,
        "find": "Frais très bas (170–250 €/an pour les Européens, env. 2800 €/an pour les "
                "non-Européens sauf exceptions boursiers)",
        "replace": "Droits nationaux 2026-2027 : 178 €/an en licence, 255 €/an en master. "
                   "Pour les étudiants hors UE/EEE, droits différenciés de 2 902 €/an en "
                   "licence et 3 950 €/an en master. Attention : depuis 2026-2027, chaque "
                   "université ne peut exonérer que 30 % au maximum de ses étudiants hors "
                   "UE (25 % en 2027-2028). L'exonération n'est plus la règle : vérifie la "
                   "politique de ton établissement avant de candidater",
        "source": "https://www.service-public.gouv.fr/particuliers/actualites/A18927",
        "note": "Le PDF donnait des montants anterieurs et presentait l'exoneration comme "
                "quasi systematique, ce qui n'est plus vrai depuis le decret de mai 2026.",
    },
    # ------------------------------------------------------ Gratification stage
    {
        "chapter": 5,
        "find": "convention de stage + minimum 4,35€/h (si >2 mois)",
        "replace": "convention de stage + minimum 4,50 €/h en 2026, soit environ 630 € par "
                   "mois à temps plein (obligatoire au-delà de 2 mois)",
        "source": "https://www.service-public.gouv.fr/particuliers/vosdroits/F16734",
        "note": "4,35 €/h etait le taux 2024 ; il suit le plafond horaire de la Securite sociale.",
    },
    # ---------------------------------------------------------- Mon soutien psy
    {
        "chapter": 8,
        "find": "Jusqu’à 8 séances gratuites par an avec un psychologue conventionné.",
        "replace": "Jusqu'à 12 séances par an avec un psychologue conventionné, sans "
                   "prescription médicale préalable. Les séances coûtent 50 € et sont prises "
                   "en charge à 60 % par l'Assurance Maladie, le reste par la mutuelle ou la "
                   "Complémentaire santé solidaire.",
        "source": "https://monsoutienpsy.ameli.fr",
        "note": "8 seances et la gratuite correspondaient a l'ancien dispositif MonPsy.",
    },
    # ------------------------------------------------------------------- URLs
    {
        "chapter": 8,
        "find": "https://www.monsoutienpsy.fr",
        "replace": "https://monsoutienpsy.ameli.fr",
        "source": "Domaine www.monsoutienpsy.fr : NXDOMAIN au 02/09/2026.",
    },
    {
        "chapter": 4,
        "find": "https://www.prefectureduNord.gouv.fr/",
        "replace": "https://www.nord.gouv.fr/",
        "source": "Domaine prefectureduNord.gouv.fr : NXDOMAIN au 02/09/2026.",
    },
    {
        "chapter": 10,
        "find": "https://www.rhone.gouv.fr/Services-de-l-Etat/Prefecture",
        "replace": "https://www.rhone.gouv.fr/",
        "source": "URL en 404 au 02/09/2026.",
    },
    {
        "chapter": 3,
        "find": "http://www.visale.fr— fais la demande dès que possible.",
        "replace": "https://www.visale.fr. Fais la demande dès que possible.",
        "source": "Tiret colle a l'URL dans le PDF source ; passage en HTTPS.",
    },
    # ------------------------------ Accord franco-marocain de securite sociale
    # La convention du 9 juillet 1965 a ete EXPRESSEMENT ABROGEE par celle du
    # 22 octobre 2007 (en vigueur le 1er juin 2011). Son article 22 porte sur la
    # levee des clauses de residence pour les pensions de VIEILLESSE, et
    # l'assurance chomage n'entre pas dans le champ materiel de la convention.
    # L'argumentaire d'origine envoyait l'etudiant citer un texte abroge.
    {
        "chapter": 10,
        "find": "Ce droit est reconnu grâce à l’accord bilatéral franco-marocain de sécurité "
                "sociale du 9 juillet 1965, toujours en vigueur. Selon cet accord, les "
                "travailleurs marocains bénéficient des mêmes droits que les nationaux en "
                "matière d’assurance chômage, y compris après l’obtention de leur diplôme.",
        "replace": "Ce droit ne découle pas d'un accord bilatéral mais du règlement "
                   "d'assurance chômage lui-même : l'ARE s'apprécie sur les périodes "
                   "travaillées et la condition de résidence, à condition de détenir un "
                   "titre de séjour permettant de travailler. Fais confirmer ta situation "
                   "par France Travail avant de t'engager sur ce point.",
        "source": "Convention générale de sécurité sociale France-Maroc du 22 octobre 2007 "
                  "(CLEISS) : elle abroge celle du 9 juillet 1965 et ne couvre pas "
                  "l'assurance chômage.",
    },
    {
        "chapter": 10,
        "find": "Argumentaire juridique : Lors de votre entretien ou dans vos communications, "
                "si vous sentez une hésitation de la part de l'agent, mentionnez explicitement "
                "l'\"Accord franco-marocain de sécurité sociale du 9 juillet 1965\", notamment "
                "son article 22 qui vous assimile à un ressortissant français pour ce droit. "
                "Le fait que votre dernier contrat était un contrat de travail (l'alternance) "
                "vous rend éligible, même si votre titre de séjour actuel (APS) limite votre "
                "droit au travail.",
        "replace": "En pratique : ne cite pas la convention franco-marocaine de 1965, elle est "
                   "abrogée depuis 2011 et ne portait pas sur le chômage. Appuie-toi sur ton "
                   "dossier : contrat d'alternance, attestation employeur, bulletins de paie, "
                   "et titre de séjour en cours de validité. En cas de refus, demande-le par "
                   "écrit et motivé, puis saisis la médiation de France Travail.",
        "source": "Convention générale de sécurité sociale France-Maroc du 22 octobre 2007 "
                  "(CLEISS), article 22 : levée des clauses de résidence pour les pensions "
                  "de vieillesse, sans rapport avec l'assurance chômage.",
    },
    # ------------------------------------------------------- Tarifs transport
    # Verifie le 2 septembre 2026. Ces tarifs sont revises chaque annee (souvent
    # au 1er juillet) : c'est le premier bloc a reverifier chaque rentree.
    {
        "chapter": 2,
        "find": "Paris (Navigo) : environ 84,10 € par mois pour tout le réseau Île-de-France.",
        "replace": "Paris (Navigo Mois, toutes zones) : 90,80 € par mois en 2026.",
        "source": "https://www.iledefrance-mobilites.fr/titres-et-tarifs/detail/forfait-navigo-mois",
    },
    {
        "chapter": 2,
        "find": "Toulouse : environ 55 € (Tisseo).",
        "replace": "Toulouse : 59 € (Tisséo, depuis le 1er juillet 2026).",
        "source": "https://www.tisseo.fr/les-tarifs/la-gamme",
    },
    {
        "chapter": 6,
        "find": "Navigo Imagine R (Île-de-France) : 365€/an (~32€/mois) → illimité métro, bus, RER",
        "replace": "Navigo Imagine R Étudiant (Île-de-France) : 401,30 € pour 2026-2027 "
                   "(393,30 € + 8 € de frais de dossier), soit environ 43,70 €/mois en 9 "
                   "prélèvements → illimité métro, bus, RER. À la première souscription, le "
                   "forfait couvre 13 mois pour le prix de 12",
        "source": "https://www.iledefrance-mobilites.fr/titres-et-tarifs/detail/forfait-imagine-r-etudiant",
    },
    {
        "chapter": 6,
        "find": "Toulouse (Tisséo) : 10€/mois pour les étudiants",
        "replace": "Toulouse (Tisséo) : 16 €/mois pour les étudiants de moins de 26 ans, "
                   "12,80 €/mois pour les boursiers",
        "source": "https://tisseo-collectivites.fr/des-tarifs-adaptes-pour-toutes-et-tous",
    },
    # ------------------------------------------ Exoneration des jobs etudiants
    {
        "chapter": 4,
        "find": "Les salaires étudiants sont exonérés jusqu’à un certain plafond (~4 900 €/an)",
        "replace": "Les salaires étudiants sont exonérés d'impôt dans la limite de 3 fois le "
                   "SMIC mensuel brut, soit 5 405 € pour les revenus 2025, si tu as 25 ans "
                   "au plus au 1er janvier de l'année d'imposition (ce plafond est revalorisé "
                   "chaque année)",
        "source": "https://www.impots.gouv.fr/particulier/questions/"
                  "mon-enfant-est-etudiant-les-revenus-quil-percus-sont-ils-imposables",
        "note": "~4 900 € correspondait a un plafond anterieur ; la regle des 3 SMIC est stable.",
    },
    # --------------------------------------------- Bourse sur criteres sociaux
    # Point capital pour le public du guide : un etudiant marocain qui arrive
    # avec un visa etudiant ne remplit PAS les conditions (2 ans de domicile en
    # France + 2 ans de rattachement a un foyer fiscal francais). Or l'APL en
    # depend depuis juillet 2026.
    {
        "chapter": 8,
        "find": "Il existe plusieurs \u00e9chelons de bourse, allant de quelques centaines "
                "d\u2019euros \u00e0 plus de 500 \u20ac par mois, vers\u00e9s mensuellement.",
        "replace": "Les \u00e9chelons vont de 0 bis \u00e0 7, soit de 145,40 \u20ac \u00e0 "
                   "633,50 \u20ac par mois en 2026-2027, vers\u00e9s sur 10 mois. Attention : "
                   "si tu es marocain et que tu arrives avec un visa \u00e9tudiant, tu n'y as "
                   "pas droit. La bourse sur crit\u00e8res sociaux exige d'\u00eatre domicili\u00e9 "
                   "en France depuis au moins 2 ans et rattach\u00e9 \u00e0 un foyer fiscal "
                   "fran\u00e7ais depuis 2 ans. Renseigne-toi plut\u00f4t sur les bourses du "
                   "gouvernement marocain, celles de Campus France et les aides de ton "
                   "\u00e9tablissement.",
        "source": "https://www.etudiant.gouv.fr/fr/bourses-sur-criteres-sociaux-pour-qui-2980",
        "note": "Montants perimes, et la condition de nationalite manquait completement.",
    },
    # ---------------------------------------------------------- Cheque energie
    {
        "chapter": 3,
        "find": "Il est envoy\u00e9 automatiquement aux b\u00e9n\u00e9ficiaires, sans d\u00e9marche.",
        "replace": "L'envoi n'est plus enti\u00e8rement automatique : les foyers identifi\u00e9s "
                   "par l'administration le re\u00e7oivent en avril, les autres doivent le "
                   "r\u00e9clamer en ligne ou par courrier entre le 1er avril et le 31 "
                   "d\u00e9cembre.",
        "source": "https://www.economie.gouv.fr/actualites/"
                  "cheque-energie-2026-envoi-des-cheques-et-ouverture-du-guichet-de-demande-au-1er-avril",
    },
    {
        "chapter": 3,
        "find": "Le montant varie entre 48\u20ac et 277\u20ac (donn\u00e9es 2024) selon les revenus.",
        "replace": "Le montant varie entre 48 \u20ac et 277 \u20ac selon les revenus et la "
                   "composition du foyer, pour une moyenne de 153 \u20ac (bar\u00e8me 2026).",
        "source": "https://www.economie.gouv.fr/particuliers/gerer-mon-argent/"
                  "comment-beneficier-du-cheque-energie",
    },
    # ------------------------------------------ Honoraires d'agence (loi Alur)
    {
        "chapter": 3,
        "find": "ils sont plafonn\u00e9s \u00e0 8, 10 ou 12 \u20ac/m\u00b2 (selon la zone)",
        "replace": "ils sont plafonn\u00e9s depuis le 1er janvier 2026 \u00e0 12,10 \u20ac/m\u00b2 "
                   "en zone tr\u00e8s tendue, 10,10 \u20ac/m\u00b2 en zone tendue et 8,10 "
                   "\u20ac/m\u00b2 ailleurs, plus 3 \u20ac/m\u00b2 au maximum pour "
                   "l'\u00e9tat des lieux",
        "source": "https://www.contrat-de-location.com/outils/frais-agence-location/",
    },
    # --------------------------------------------------------- Velo electrique
    {
        "chapter": 6,
        "find": "Prime \u00e0 l\u2019achat d\u2019un v\u00e9lo \u00e9lectrique : jusqu\u2019\u00e0 400\u20ac selon conditions",
        "replace": "Prime \u00e0 l'achat d'un v\u00e9lo \u00e9lectrique : le bonus national a "
                   "\u00e9t\u00e9 supprim\u00e9 le 14 f\u00e9vrier 2025. Il reste les aides "
                   "locales, souvent plus g\u00e9n\u00e9reuses, de 100 \u20ac \u00e0 800 "
                   "\u20ac selon la ville et les revenus : regarde du c\u00f4t\u00e9 de ta "
                   "m\u00e9tropole et de ta r\u00e9gion",
        "source": "D\u00e9cret n\u00b0 2024-1084 du 29 novembre 2024, supprimant le bonus v\u00e9lo.",
        "note": "Le guide envoyait vers une aide qui n'existe plus.",
    },
    # ------------------------------------------------------- Auto-entrepreneur
    {
        "chapter": 4,
        "find": "Voici les taux de cotisation en 2024 selon ton activit\u00e9 :",
        "replace": "Voici les taux de cotisation en 2026 selon ton activit\u00e9 :",
        "source": "https://www.urssaf.fr/accueil/actualites/taux-cotisations-autoentrepeneur.html",
        "note": "Le taux de 21,2 % en prestations de services BIC reste exact en 2026.",
    },
    # ---------------------------------------------------- Abonnements etudiants
    # Verifie le 2 septembre 2026. La plupart des reseaux revisent leurs tarifs
    # au 1er juillet ou au 1er septembre : bloc a reverifier chaque rentree.
    {
        "chapter": 6,
        "find": "Lyon (TCL) : Abonnement \u00e9tudiant \u00e0 32\u20ac/mois",
        "replace": "Lyon (TCL) : 26 \u20ac/mois pour les 18-25 ans et les \u00e9tudiants, "
                   "11 \u20ac/mois pour les boursiers depuis le 1er septembre 2026",
        "source": "https://www.tcl.fr/titres-et-tarifs/tarification-tcl/les-abonnements-tcl",
    },
    {
        "chapter": 6,
        "find": "Lille (Il\u00e9via) : Pass \u00e9tudiant \u00e0 28\u20ac/mois",
        "replace": "Lille (Il\u00e9via, l'ancien Transpole) : abonnement jeune et \u00e9tudiant "
                   "calcul\u00e9 selon le quotient familial, 32,45 \u20ac/mois au tarif le plus "
                   "\u00e9lev\u00e9 et nettement moins si ton quotient est bas",
        "source": "https://www.ilevia.fr/boutique/abonnements",
    },
    {
        "chapter": 6,
        "find": "Grenoble (TAG) : Environ 22\u20ac/mois pour les -26 ans",
        "replace": "Grenoble (M r\u00e9so, l'ancien TAG) : 19,20 \u20ac/mois ou 192 \u20ac/an "
                   "pour les 18-25 ans en \u00e9tudes, avec des tarifs r\u00e9duits pour les "
                   "boursiers",
        "source": "https://www.reso-m.fr/747-etudiant-achete-ton-abonnement-de-transport-en-commun.htm",
    },
    {
        "chapter": 6,
        "find": "Rennes (STAR) : Abonnement jeune \u00e0 30,60\u20ac/mois",
        "replace": "Rennes (STAR) : 26,60 \u20ac/mois pour les 18-26 ans depuis juillet 2026, "
                   "avec un forfait \u00e9tudiant qui inclut les v\u00e9los en libre-service",
        "source": "https://www.star.fr/star-et-moi/parent-eleve-etudiant/tarifs-etudiants",
    },
    {
        "chapter": 6,
        "find": "Bordeaux (TBM) : 20\u20ac/mois pour les jeunes",
        "replace": "Bordeaux (TBM) : Pass Jeune 11-27 ans \u00e0 20,80 \u20ac/mois en formule "
                   "annuelle, 35,10 \u20ac si tu le prends au mois, depuis le 1er juillet 2026",
        "source": "https://www.infotbm.com/fr/tarifs-et-abonnements.html",
    },
    {
        "chapter": 6,
        "find": "Montpellier : GRATUIT pour les -26 ans inscrits",
        "replace": "Montpellier (TaM) : gratuit \u00e0 tout \u00e2ge si tu habites l'une des 31 "
                   "communes de la m\u00e9tropole, mais il faut demander le Pass gratuit\u00e9 "
                   "nominatif (pi\u00e8ce d'identit\u00e9, photo, justificatif de domicile). "
                   "Hors m\u00e9tropole, 28 \u20ac/mois avant 26 ans",
        "source": "https://www.montpellier.fr/vie-quotidienne/se-deplacer/"
                  "se-deplacer-en-transports-en-commun/se-deplacer-gratuitement",
        "note": "La gratuite depend du domicile, pas de l'age, et n'est pas automatique.",
    },
    {
        "chapter": 6,
        "find": "Rouen : ~22\u20ac/mois \u00e9tudiant",
        "replace": "Rouen (r\u00e9seau Astuce, l'ancien TCAR) : tarifs \u00e9tudiants sur "
                   "justificatif de scolarit\u00e9 et de domicile dans la m\u00e9tropole, "
                   "\u00e0 v\u00e9rifier sur reseau-astuce.fr",
        "source": "https://www.reseau-astuce.fr/fr/abonnements/80",
        "note": "Tarif etudiant non confirme : le montant est retire plutot que laisse faux.",
    },
    # ------------------------- Plein tarif du premier mois, avant l'abonnement
    {
        "chapter": 2,
        "find": "Lille : Pass mensuel environ 55 \u20ac (Transpole).",
        "replace": "Lille : 65 \u20ac par mois au plein tarif, sur le r\u00e9seau Il\u00e9via "
                   "qui a remplac\u00e9 Transpole.",
        "source": "https://www.ilevia.fr/boutique/abonnements",
    },
    {
        "chapter": 2,
        "find": "Rouen : environ 45 \u20ac (TCAR).",
        "replace": "Rouen : 64 \u20ac par mois depuis le 1er septembre 2026, sur le r\u00e9seau "
                   "Astuce qui a remplac\u00e9 le TCAR.",
        "source": "https://www.reseau-astuce.fr/fr/abonnements/80",
    },
    {
        "chapter": 2,
        "find": "Grenoble : environ 50 \u20ac (TAG).",
        "replace": "Grenoble : une cinquantaine d'euros au plein tarif, sur le r\u00e9seau "
                   "M r\u00e9so qui a remplac\u00e9 le TAG.",
        "source": "https://www.reso-m.fr/",
    },
    {
        "chapter": 2,
        "find": "Montpellier : environ 55 \u20ac (TaM). (GRATUIT pour les -26 ans inscrits)",
        "replace": "Montpellier : gratuit si tu habites la m\u00e9tropole, sur demande du Pass "
                   "gratuit\u00e9. Sinon 28 \u20ac par mois avant 26 ans.",
        "source": "https://www.montpellier.fr/vie-quotidienne/se-deplacer/"
                  "se-deplacer-en-transports-en-commun/se-deplacer-gratuitement",
    },
    {
        "chapter": 2,
        "find": "Marseille : environ 60 \u20ac (RTM).",
        "replace": "Marseille : le Pass Permanent \u00e9tudiant du RTM d\u00e9marre \u00e0 "
                   "9,20 \u20ac par mois, bien en dessous du plein tarif.",
        "source": "https://www.rtm.fr/tarifs",
        "note": "La gratuite marseillaise vise les moins de 11 ans et les 65 ans et plus, "
                "pas les etudiants : c'etait une promesse de campagne, non appliquee.",
    },
]


def apply_corrections(chapter, blocks):
    """Applique les corrections factuelles du chapitre, en verifiant les comptes."""
    for spec in [c for c in CORRECTIONS if c["chapter"] == chapter]:
        expected = spec.get("count", 1)
        seen = 0
        for block in blocks:
            if block.get("type") == "ul":
                for index, item in enumerate(block["items"]):
                    if spec["find"] in item:
                        block["items"][index] = item.replace(spec["find"], spec["replace"])
                        seen += 1
            elif "text" in block:
                if spec["find"] in block["text"]:
                    seen += block["text"].count(spec["find"])
                    block["text"] = block["text"].replace(spec["find"], spec["replace"])
        if seen != expected:
            raise SystemExit(
                "Correction ch%d : %d occurrence(s) trouvee(s), %d attendue(s) -> %r\n"
                "Le texte source a change : revois scripts/corrections.py."
                % (chapter, seen, expected, spec["find"][:70])
            )
    return blocks
