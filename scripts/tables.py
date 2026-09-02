# -*- coding: utf-8 -*-
"""Tableaux du PDF retranscrits a la main.

L'extraction texte d'un PDF perd la structure des tableaux : les colonnes sont
separees par de simples espaces, impossibles a distinguer d'une phrase. Ces
tableaux ressortaient donc en paragraphes illisibles du type
« Paris 1700 2500 Loyer tres cher, caution elevee Lyon 1100 1800 ... ».

Chaque entree ci-dessous decrit les blocs a remplacer (du bloc contenant
`start` a celui contenant `end`, inclus) par un bloc `table`. `tail` permet de
recuperer un texte qui se trouvait colle a la fin du dernier bloc consomme.
"""

TABLES = [
    {
        "chapter": 2,
        "start": "Ville Fourchett",
        "resume": "Explication",
        "caption": "Budget mensuel estimé par ville (logement, transport, courses)",
        "headers": ["Ville", "Fourchette basse", "Fourchette haute", "Commentaire"],
        "rows": [
            ["Paris", "1 700 €", "2 500 €", "Loyer très cher, caution élevée"],
            ["Lyon", "1 100 €", "1 800 €", "Loyer plus abordable, transports moyens"],
            ["Marseille", "1 000 €", "1 700 €", "Climat plus doux, loyers modérés"],
            ["Toulouse", "1 000 €", "1 700 €", "Loyer raisonnable, transports accessibles"],
            ["Montpellier", "1 000 €", "1 700 €", "Ville étudiante dynamique, loyers moyens"],
            ["Grenoble", "1 050 €", "1 750 €", "Loyer et coût de vie modérés"],
            ["Lille", "1 050 €", "1 800 €", "Ville étudiante avec transports variés"],
            ["Rennes", "1 050 €", "1 650 €", "Loyers raisonnables, transports efficaces"],
            ["Bordeaux", "1 050 €", "1 750 €", "Ville étudiante attractive"],
            ["Rouen", "950 €", "1 600 €", "Loyers abordables, transports moins chers"],
        ],
    },
    {
        "chapter": 3,
        "start": "Ville Aéroport principal Itinéraire recommandé",
        "resume": "Paris – Aéroport de Beauvais",
        "caption": "Rejoindre le centre-ville depuis l'aéroport",
        "headers": ["Ville", "Aéroport", "Itinéraire recommandé", "Temps", "Coût moyen"],
        "rows": [
            ["Paris", "Paris-CDG (Roissy)", "RER B ➝ Châtelet-Les Halles ou Gare du Nord", "35–45 min", "10,30 €"],
            ["Paris", "Paris-Orly", "OrlyBus ➝ Denfert-Rochereau OU Tram T7 + métro", "30–45 min", "9–12 €"],
            ["Lille", "Lille-Lesquin", "Navette aéroport ➝ Gare Lille Flandres", "20 min", "8 €"],
            ["Lille", "Lille-Lesquin", "Taxi ou VTC (Uber/Bolt)", "15–20 min", "20–30 €"],
            ["Marseille", "Marseille-Provence", "Navette ➝ Gare Saint-Charles", "25–30 min", "10 €"],
            ["Marseille", "Marseille-Provence", "Taxi (jour)", "25–30 min", "50–60 €"],
            ["Bordeaux", "Bordeaux-Mérignac", "Navette 30'Direct ➝ Gare Saint-Jean", "30–40 min", "8 €"],
            ["Bordeaux", "Bordeaux-Mérignac", "Bus Lianes 1+ ➝ Centre (réseau TBM)", "45–55 min", "1,80 €"],
            ["Rennes", "Rennes-Saint-Jacques", "Bus C6 ➝ Centre-ville", "25–30 min", "1,70 €"],
            ["Rennes", "Rennes-Saint-Jacques", "Taxi", "15–20 min", "20–30 €"],
            ["Toulouse", "Toulouse-Blagnac", "Tram T2 ➝ Métro ligne A ➝ Capitole", "30–40 min", "1,80 €"],
            ["Toulouse", "Toulouse-Blagnac", "Navette ➝ Gare Matabiau", "25–30 min", "9 €"],
            ["Montpellier", "Montpellier-Méditerranée", "Navette ➝ Place de l'Europe + Tram", "25–35 min", "2–3 €"],
            ["Montpellier", "Montpellier-Méditerranée", "Taxi", "15–20 min", "25–30 €"],
            ["Lyon", "Lyon-Saint-Exupéry", "Rhônexpress ➝ Gare Part-Dieu", "30 min", "16,30 €"],
            ["Lyon", "Lyon-Saint-Exupéry", "TCL : bus + métro (moins direct)", "60 min env.", "3 €"],
        ],
    },
    {
        "chapter": 3,
        "start": "Ville Quartiers à privilégier",
        "resume": "Ces quartiers peuvent offrir",
        "caption": "Repères par ville pour choisir son quartier",
        "headers": ["Ville", "Quartiers à privilégier", "Quartiers à éviter ou prudents"],
        "rows": [
            ["Paris", "5e, 6e, 14e, 15e, 13e (Butte-aux-Cailles), 12e",
             "18e (La Chapelle, Barbès), 19e (Stalingrad), 20e (Porte de Montreuil)"],
            ["Lyon", "3e (Part-Dieu), 6e, 7e (Jean Macé, Guillotière côté Rhône)",
             "Guillotière côté Saône, Vénissieux, Vaulx-en-Velin, La Duchère"],
            ["Marseille", "6e, 7e, 8e, 9e (Mazargues), 5e (La Timone)",
             "3e (Félix Pyat), 14e, 15e, 16e arrondissements"],
            ["Lille", "Centre, Vauban-Esquermes, Wazemmes côté Gambetta, Saint-Maurice",
             "Fives, Moulins (certains coins), quartiers trop éloignés"],
            ["Toulouse", "Carmes, Saint-Cyprien, Capitole, Saint-Michel",
             "Mirail, Empalot, Bellefontaine, Bagatelle"],
            ["Montpellier", "Antigone, Port Marianne, Boutonnet, Beaux-Arts",
             "La Paillade (Mosson), Petit-Bard, Figuerolles (certains secteurs)"],
            ["Rennes", "Centre, Thabor, Villejean (proche facs), Saint-Hélier",
             "Le Blosne, Maurepas (certaines rues)"],
            ["Grenoble", "Hyper-centre, Championnet, Europole, Île Verte",
             "Villeneuve, Mistral, certains coins de Fontaine"],
            ["Bordeaux", "Saint-Genès, Chartrons, Victoire, Nansouty",
             "Bacalan, Saint-Michel (certains secteurs), Aubiers"],
            ["Rouen", "Centre, Mont-Saint-Aignan (proche facs), Saint-Marc",
             "Grand-Quevilly, Elbeuf (trop éloigné), Saint-Étienne du Rouvray (certains coins)"],
        ],
    },
    {
        "chapter": 4,
        "start": "Exemple de consulats très fréquentés",
        "resume": "Renouvellement / demande du passeport",
        "caption": "Consulats marocains les plus fréquentés en Île-de-France",
        "headers": ["Ville / Zone", "Adresse", "Infos pratiques"],
        "rows": [
            ["Consulat de Cergy", "5 rue des Chauffours, 95000 Cergy",
             "Très fréquenté, RDV obligatoire via le site de Cergy"],
            ["Consulat d'Orly", "14-16 avenue de l'Aérodrome, 94310 Orly",
             "Couvre une grande partie du sud parisien. RDV via le site d'Orly"],
            ["Consulat de Colombes", "16 rue Léon Bourgeois, 92700 Colombes",
             "Pour les Hauts-de-Seine et une partie du 92-93-95"],
        ],
        "tail": {
            "type": "callout",
            "variant": "conseil",
            # Formulation reprise mot pour mot du guide.
            "text": "Avant de t’y rendre, vérifie toujours sur leur site si la prise "
                    "de RDV se fait en ligne ou par téléphone.",
        },
    },
    {
        "chapter": 4,
        "start": "Situation Problème rencontré",
        "resume": "Situation Problème rencontré",
        "caption": "Renouvellement du titre de séjour : les blocages fréquents (1/2)",
        "headers": ["Situation", "Problème rencontré", "Solution recommandée"],
        "rows": [
            ["Bulletin de notes cacheté ou officiel non délivré à temps",
             "L'école ou l'université tarde à remettre les bulletins nécessaires pour justifier l'assiduité ou la réussite.",
             "Demander une attestation provisoire de passage ou de réussite signée par l'administration (direction des études, scolarité). Joindre un justificatif de demande de bulletin (e-mail, accusé de réception)."],
            ["Conseil de classe très tardif (septembre/octobre)",
             "L'attestation de passage ou de redoublement est délivrée après l'expiration du titre de séjour.",
             "Joindre à la demande de renouvellement le certificat de scolarité provisoire de l'année en cours (si déjà inscrit) et un mail ou une attestation de l'établissement expliquant la date tardive du conseil de classe. Demander un récépissé provisoire pour éviter d'être en situation irrégulière."],
            ["Soutenance de stage ou mémoire prévue en septembre/octobre",
             "La validation du diplôme est postérieure à la date d'expiration du titre de séjour.",
             "Fournir l'attestation de stage en cours, la convocation à la soutenance ou l'e-mail de l'encadrant, et une attestation de l'établissement précisant que le diplôme sera délivré après la soutenance. Demander une prolongation exceptionnelle ou une APS si le diplôme est validé juste après."],
            ["Attestation de réussite pas encore remise",
             "La scolarité tarde à délivrer le document indispensable pour l'APS ou un changement de statut.",
             "Demander une attestation provisoire mentionnant que le diplôme est validé et que l'attestation officielle est en cours d'édition. Joindre un relevé de notes final ou un mail officiel de validation."],
        ],
    },
    {
        "chapter": 4,
        "start": "Situation Problème rencontré",
        "resume": "Renouvellement du titre de séjour : redoublement",
        "caption": "Renouvellement du titre de séjour : les blocages fréquents (2/2)",
        "headers": ["Situation", "Problème rencontré", "Solution recommandée"],
        "rows": [
            ["Inscription en attente pour l'année suivante (logement, visa retour, préinscription)",
             "Impossible de prouver la poursuite d'études au moment du renouvellement.",
             "Joindre une preuve de pré-inscription, de candidature en cours ou une lettre de motivation expliquant la situation. Envisager une demande de renouvellement avec promesse de régularisation du document manquant, ou demander un récépissé provisoire."],
            ["Changement d'établissement en cours",
             "Pas encore inscrit officiellement dans la nouvelle structure (école privée, master sélectif, etc.).",
             "Joindre le courriel ou la lettre d'acceptation (même provisoire), l'attestation de fin d'études précédente et une lettre explicative mentionnant le calendrier administratif spécifique."],
            ["Titre de séjour expiré pendant l'été (août/septembre)",
             "Préfecture fermée ou délais longs pendant les vacances.",
             "Prendre rendez-vous dès juin si possible. Joindre toute pièce prouvant la volonté d'anticipation. En cas de force majeure, présenter une lettre explicative avec justificatifs (courriels, échanges)."],
            ["Diplôme validé tard (septembre/octobre), besoin de temps pour chercher un travail",
             "Le délai est trop court pour déposer une APS dans les temps.",
             "Déposer une demande d'APS dès réception des résultats. Joindre tous les documents disponibles, même provisoires, et une lettre explicative avec les étapes suivies (dates exactes)."],
            ["Redoublement ou réorientation avec dossier fragile",
             "Crainte d'un refus de séjour pour manque de sérieux ou de progression.",
             "Préparer un dossier solide : attestation de motivation, relevés de notes, lettre de l'établissement justifiant le redoublement et projet d'études clair pour l'année à venir. Renforcer le dossier avec une lettre de soutien d'un professeur si possible."],
        ],
    },
    {
        "chapter": 5,
        "start": "Cycle Durée Diplôme obtenu",
        "resume": "ECTS = European Credit Transfer System",
        "caption": "Le système LMD en un coup d'œil",
        "headers": ["Cycle", "Durée", "Diplôme obtenu", "Crédits ECTS"],
        "rows": [
            ["Licence", "3 ans (L1, L2, L3)", "Bac +3", "180 ECTS"],
            ["Master", "2 ans (M1, M2)", "Bac +5", "120 ECTS"],
            ["Doctorat", "3 à 5 ans", "Bac +8 (recherche)", "—"],
        ],
    },
    {
        "chapter": 5,
        "start": "Situation Plateforme à utiliser",
        "resume": "Quelques exemples d’écoles par domaine",
        "caption": "Quelle plateforme de candidature selon ton profil",
        "headers": ["Situation", "Plateforme à utiliser"],
        "rows": [
            ["Étudiant après le bac", "Parcoursup"],
            ["Licence ➝ Master", "MonMaster.gouv.fr"],
            ["Écoles de commerce / ingénieurs privées", "Site de l'école ou Join A School In France"],
            ["Étudiant étranger (hors UE)", "Études en France via Campus France Maroc"],
        ],
    },
    {
        "chapter": 5,
        "start": "Exemples d’établissements",
        "resume": "Trouver un master après une licence",
        "caption": "Quelques exemples d'écoles par domaine",
        "headers": ["Domaine", "Public / Privé", "Exemples d'établissements"],
        "rows": [
            ["Informatique", "Public", "Sorbonne, Université Lyon 1, INSA, EIL"],
            ["Informatique", "Privé", "EPITECH, SUPINFO, Efrei Paris"],
            ["Commerce / Gestion", "Public", "IAE (Instituts d'Administration des Entreprises)"],
            ["Commerce / Gestion", "Privé", "KEDGE BS, NEOMA, INSEEC"],
            ["Santé / Pharma", "Public", "Université de Paris Cité, Faculté de médecine Lyon Est"],
            ["Architecture", "Public", "ENSA (Écoles nationales supérieures d'architecture)"],
            ["Design / Arts", "Public", "École Boulle, ENSAD, Beaux-Arts de Paris"],
            ["Design / Arts", "Privé", "LISAA, Penninghen"],
        ],
    },
    {
        "chapter": 6,
        "start": "Salle Tarif étudiant",
        "resume": "Autres activités sportives",
        "caption": "Salles de sport : tarifs étudiants",
        "headers": ["Salle", "Tarif étudiant"],
        "rows": [
            ["Basic-Fit", "~19,99 €/mois (sans engagement dans certaines offres)"],
            ["Fitness Park", "~29 €/mois (abonnement annuel)"],
            ["Keep Cool", "~30 €/mois, parfois avec offres étudiantes"],
            ["Universités", "Accès aux infrastructures pour 15–40 €/an selon la ville"],
        ],
    },
    {
        "chapter": 6,
        "start": "Poste Budget",
        "resume": "Conduire sans assurance",
        "caption": "Budget voiture : les postes de dépense",
        "headers": ["Poste", "Budget"],
        "rows": [
            ["Carburant", "~1,80 €/L en moyenne"],
            ["Parking", "Payant dans la plupart des villes"],
            ["Contrôle technique", "Tous les 2 ans (~80 €)"],
            ["Entretien (vidange, pneus…)", "Variable selon le modèle"],
        ],
    },
]


def _searchable(block):
    """Texte d'un bloc, quel que soit son type, pour y chercher une ancre."""
    if block.get("type") == "ul":
        return " ".join(block.get("items", []))
    return block.get("text") or ""


def apply_tables(chapter, blocks):
    """Remplace les blocs d'un tableau aplati par sa transcription.

    On borne la zone par `start` (premiere cellule) et `resume` (premier bloc
    qui doit survivre apres le tableau) plutot que par la derniere cellule :
    selon le decoupage, un tableau s'etale sur 2 ou 40 blocs, mais ce qui le
    suit est toujours identifiable. Le texte situe avant `start` ou apres
    `resume` dans leurs blocs respectifs est reinjecte, jamais perdu.
    """
    for spec in [t for t in TABLES if t["chapter"] == chapter]:
        start = next(
            (i for i, b in enumerate(blocks) if spec["start"] in _searchable(b)),
            None,
        )
        if start is None:
            raise SystemExit("Tableau introuvable (ch%d) : %r" % (chapter, spec["start"]))

        resume = next(
            (
                i
                for i in range(start + 1, len(blocks))
                if spec["resume"] in _searchable(blocks[i])
            ),
            None,
        )
        if resume is None:
            raise SystemExit(
                "Reprise introuvable apres le tableau (ch%d) : %r" % (chapter, spec["resume"])
            )

        head_text = _searchable(blocks[start]).split(spec["start"])[0].strip()

        replacement = []
        if len(head_text.split()) >= 4:
            replacement.append({"type": "p", "text": head_text})
        replacement.append({
            "type": "table",
            "caption": spec["caption"],
            "headers": spec["headers"],
            "rows": spec["rows"],
        })
        if "tail" in spec:
            replacement.append(spec["tail"])

        resume_text = _searchable(blocks[resume])
        if resume_text.startswith(spec["resume"]) or blocks[resume]["type"] == "ul":
            # Le bloc de reprise est intact : on s'arrete juste avant.
            blocks[start:resume] = replacement
        else:
            # La reprise est collee a la derniere cellule : on la detache.
            kept = resume_text[resume_text.index(spec["resume"]):].strip()
            replacement.append({"type": "p", "text": kept})
            blocks[start : resume + 1] = replacement
    return blocks
