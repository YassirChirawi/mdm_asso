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
                   "apprentissage, professionnalisation). Vérifie ta situation sur caf.fr "
                   "avant de compter sur cette aide dans ton budget.",
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
                   "UE (25 % en 2027-2028) — l'exonération n'est plus la règle, vérifie la "
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
        "replace": "https://www.visale.fr — fais la demande dès que possible.",
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
                  "de vieillesse — sans rapport avec l'assurance chômage.",
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
