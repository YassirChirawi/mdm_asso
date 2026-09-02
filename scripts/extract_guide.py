# -*- coding: utf-8 -*-
"""
Extraction du guide PDF -> blocs structures JSON (src/data/content/{n}.json).

Remplace format_chapters*.py. Deux differences importantes :
  1. le sommaire du PDF fait ~28 000 caracteres : les anciens scripts sautaient
     seulement 6 000 caracteres et retombaient donc sur les entrees du sommaire
     pour les chapitres 5 a 13 (d'ou des chapitres vides en ligne) ;
  2. la sortie est une liste de blocs types (h2 / h3 / p / ul / callout), ce qui
     evite de rejouer des heuristiques fragiles dans le composant React.

Les chapitres 14, 15 et 16 ont ete retravailles a la main : on les convertit
depuis leur JSON existant au lieu de les re-extraire.
"""
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from corrections import apply_corrections  # noqa: E402
from tables import apply_tables  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "pdf_content.txt")
OUT_DIR = os.path.join(ROOT, "src", "data", "content")

# Titre editorial affiche dans l'app (aligne sur src/data/chapters.ts)
CHAPTERS = {
    1: "Introduction",
    2: "Avant le depart",
    3: "L'arrivee en France",
    4: "Demarches administratives",
    5: "Systeme universitaire",
    6: "Vie quotidienne",
    7: "Gerer son argent",
    8: "Sante & coups durs",
    9: "Tes droits & recours",
    10: "Apres les etudes",
    11: "Le salarie averti",
    12: "Vie personnelle",
    13: "Double culture",
    14: "Retours d'experience",
    15: "Conclusion",
    16: "Annexes Pratiques",
}

FROM_PDF = range(1, 14)   # 1..13 : extraits du PDF
CURATED = (14, 15, 16)    # deja rediges a la main, sources dans scripts/curated/

# Le chapitre 14 sert uniquement de borne de fin au chapitre 13.
END_MARKER = 14
CURATED_DIR = os.path.join(ROOT, "scripts", "curated")

def strip_toc(raw):
    """Coupe tout ce qui precede la derniere ligne a points de conduite.

    Le sommaire du PDF fait ~250 lignes / 28 000 caracteres. C'est la marche que
    les anciens scripts ne franchissaient pas : ils s'arretaient a 6 000 et
    prenaient donc les entrees du sommaire pour les vrais titres de chapitre.
    """
    lines = raw.split("\n")
    last = max((i for i, l in enumerate(lines) if "...." in l), default=-1)
    return "\n".join(lines[last + 1:])

HEADING_RE = re.compile(r"^(\d+(?:\.\d+){0,3})\s+(\S.*)$")
BULLET_RE = re.compile(r"^([-•➤▪*o])\s+(.*)$")
NUM_BULLET_RE = re.compile(r"^(\d+)[.)]\s+(.+)$")
CALLOUT_RE = re.compile(
    r"^(Note|Conseil|Pro Tip|Astuce|Attention|Bon a savoir|Bon à savoir|Spoiler)\s*:\s*(.*)$",
    re.I,
)
TERMINAL = ".!?…»:;"


def tidy(text):
    """Nettoie les scories typographiques laissees par l'extraction PDF."""
    text = re.sub(r"\s+", " ", text).strip()
    # Marqueurs de puce empiles en debut de ligne : « o - www.lokaviz.fr ».
    for _ in range(2):
        text = re.sub(r"^(?:[-•➤▪*]|o(?=\s))\s+", "", text)
    # Marqueur orphelin en fin de bloc.
    text = re.sub(r"\s+[o•▪➤*]$", "", text)
    # Une sous-puce restee au milieu d'un bloc devient un separateur lisible.
    text = re.sub(r"\s*➤\s*", " — ", text)
    # En francais l'espace se place apres la virgule et le point, jamais avant
    # (contrairement a « ; : ! ? » qui en prennent un).
    text = re.sub(r"\s+([,.])(?=\s|$)", lambda m: m.group(1), text)
    text = re.sub(r"\(\s+", "(", text)
    text = re.sub(r"\s+\)", ")", text)
    # Reste de balisage Markdown present dans le manuscrit d'origine.
    text = text.replace("**", "").replace("__", "")
    # Caracteres de controle : aucun ne doit atteindre la page.
    text = "".join(c for c in text if ord(c) >= 32 or c in "\n\t")
    return re.sub(r"\s{2,}", " ", text).strip()


def join_lines(lines):
    """Recolle des lignes de PDF en un seul paragraphe.

    Une ligne qui se termine par un trait d'union est un mot compose coupe par
    la mise en page (« Saint- » + « Etienne ») : on la recolle sans espace,
    sinon on obtient « Saint- Etienne du Rouvray ».
    """
    text = ""
    for line in lines:
        line = line.strip()
        if not line:
            continue
        if not text:
            text = line
        elif text.endswith(("-", "‐")) and re.match(r"^[A-Za-zÀ-ÿ]", line):
            text += line
        else:
            text += " " + line
    return tidy(text)

CALLOUT_VARIANT = {
    "attention": "attention",
    "note": "note",
    "conseil": "conseil",
    "astuce": "conseil",
    "pro tip": "conseil",
    "bon a savoir": "info",
    "bon à savoir": "info",
    "spoiler": "info",
}


def clean_text(raw):
    """Retire les artefacts de pagination du PDF."""
    raw = re.sub(r"Prepared exclusively for.*?Transaction:\s*\d+", "\n", raw, flags=re.I)
    raw = raw.replace("[Tapez ici]", "")
    out = []
    for line in raw.split("\n"):
        line = line.replace("\xa0", " ").rstrip()
        stripped = line.strip()
        if not stripped:
            out.append("")
            continue
        if stripped.isdigit():                       # numero de page isole
            continue
        if "...." in stripped:                       # ligne de sommaire residuelle
            continue
        if re.fullmatch(r"[-–—_·•\s]+", stripped):
            continue
        out.append(line)
    return "\n".join(out)


def find_chapter_offsets(text):
    """Localise le vrai titre de chaque chapitre, apres le sommaire."""
    offsets = {}
    for num in list(FROM_PDF) + [END_MARKER]:
        pattern = re.compile(
            r"^[ \t]*%d\s+[A-ZÀ-Ý][A-ZÀ-Ý0-9'’\-–,:()\s]{5,}$" % num,
            re.MULTILINE,
        )
        match = next(iter(pattern.finditer(text)), None)
        if match is None:
            raise SystemExit("Chapitre %d introuvable dans %s" % (num, SRC))
        offsets[num] = (match.start(), match.end())
    return offsets


def is_heading(line, chapter=None):
    """Retourne (niveau, texte) si la ligne est un titre numerote, sinon None."""
    match = HEADING_RE.match(line)
    if not match:
        return None
    number, label = match.group(1), match.group(2).strip()
    # Le livre numerote ses sections a partir du chapitre : 4.2, 4.2.1...
    # Sans ce controle, un code postal (« 94310 Orly ») ou un prix (« 8 € »)
    # tire d'une cellule de tableau passait pour un titre.
    if chapter is not None and number.split(".")[0] != str(chapter):
        return None
    if len(label) > 120 or label[-1:] in ".;":
        return None                                  # phrase commencant par un nombre
    # « 75 € et peut entrainer... » : un montant en cours de phrase n'est pas un
    # titre. On accepte un mot, une parenthese, ou une sous-numerotation
    # (« 1. Bourses sur criteres sociaux »), et rien d'autre.
    if not re.match(r"^([A-ZÀ-Ý(«\"]|\d+[.)]\s+[A-Za-zÀ-ÿ])", label):
        return None
    depth = number.count(".")
    return ("h2" if depth <= 1 else "h3", label)


def is_subtitle(line, previous, following):
    """Intertitre non numerote : ligne courte, sans ponctuation finale, isolee."""
    # « Ville », « Orly », « Resume » : ces lignes isolees sont des cellules de
    # tableau ou des etiquettes, pas des intertitres.
    if not (11 < len(line) <= 85) or len(line.split()) < 2:
        return False
    if line[-1] in TERMINAL or line.endswith(","):
        return False
    if BULLET_RE.match(line) or NUM_BULLET_RE.match(line) or CALLOUT_RE.match(line):
        return False
    # Une ligne qui suit une ligne PLEINE non ponctuee est la suite d'un
    # paragraphe. Apres une ligne courte (elle-meme un intertitre, une puce ou
    # une fin de paragraphe), rien n'empeche un nouvel intertitre.
    if previous and len(previous) >= 60 and previous[-1] not in TERMINAL:
        return False
    if not following or following[:1].islower():
        return False
    return bool(re.match(r"^[A-ZÀ-Ý0-9]", line))


def parse_blocks(body, chapter):
    """Reconstruit des blocs types a partir des lignes brutes du PDF."""
    lines = [l.strip() for l in body.split("\n")]
    blocks = []
    para = []
    bullets = []

    def flush_para():
        if not para:
            return
        text = join_lines(para)
        del para[:]
        if not text:
            return
        callout = CALLOUT_RE.match(text)
        if callout and len(text) < 900:
            blocks.append({
                "type": "callout",
                "variant": CALLOUT_VARIANT.get(callout.group(1).lower(), "note"),
                "text": callout.group(2).strip(),
            })
        else:
            blocks.append({"type": "p", "text": text})

    def flush_list():
        if not bullets:
            return
        items = [tidy(b) for b in bullets]
        del bullets[:]
        items = [i for i in items if i]
        if items:
            blocks.append({"type": "ul", "items": items})

    for index, line in enumerate(lines):
        if not line:
            flush_list()
            flush_para()
            continue

        heading = is_heading(line, chapter)
        if heading:
            flush_list()
            flush_para()
            blocks.append({"type": heading[0], "text": tidy(heading[1])})
            continue

        bullet = BULLET_RE.match(line) or NUM_BULLET_RE.match(line)
        if bullet:
            flush_para()
            bullets.append(bullet.group(2).strip())
            continue

        if bullets:
            # Ligne de continuation d'une puce coupee par la mise en page du PDF.
            if bullets[-1] and bullets[-1][-1] not in TERMINAL and line[:1].islower():
                bullets[-1] = join_lines([bullets[-1], line])
                continue
            flush_list()

        previous = next((l for l in reversed(lines[:index]) if l), "")
        following = next((l for l in lines[index + 1:] if l), "")
        if is_subtitle(line, previous, following):
            flush_para()
            blocks.append({"type": "h3", "text": tidy(line)})
            continue

        para.append(line)

    flush_list()
    flush_para()
    blocks = apply_tables(chapter, stitch_paragraphs(blocks))
    return apply_corrections(chapter, blocks)


# Mots qui ne peuvent pas terminer une phrase : s'ils closent un bloc, la suite
# en est forcement la fin, meme si elle commence par une majuscule.
DANGLING = {
    "le", "la", "les", "un", "une", "des", "du", "de", "d'", "au", "aux", "a", "à",
    "en", "et", "ou", "pour", "par", "sur", "dans", "avec", "sans", "sous", "chez",
    "ce", "cet", "cette", "ces", "son", "sa", "ses", "leur", "leurs", "ton", "ta",
    "tes", "mon", "ma", "mes", "qui", "que", "qu'", "dont", "vers",
}


def _last_word(text):
    words = re.findall(r"[\wÀ-ÿ']+", text.lower())
    return words[-1] if words else ""


def stitch_paragraphs(blocks):
    """Recolle ce que la mise en page du PDF a coupe.

    Trois artefacts recurrents :
      * le pied de page ("Prepared exclusively for...") est retire avant le
        decoupage et laisse une ligne vide au milieu d'une phrase ;
      * un titre trop long deborde sur une deuxieme ligne, qui se retrouve
        isolee ("...DEFENSEUR DES" / "DROITS") ;
      * un intertitre pose juste apres une liste se fait aspirer par la
        derniere puce ("...vie active" + "Ecoles d'ingenieurs").
    """
    out = []
    for index, block in enumerate(blocks):
        previous = out[-1] if out else None
        following = blocks[index + 1] if index + 1 < len(blocks) else None

        previous_text = ""
        if previous is not None:
            previous_text = (
                previous["items"][-1] if previous["type"] == "ul" else previous.get("text", "")
            )

        # Suite d'un titre repartie sur deux lignes, toujours en capitales.
        if (
            block["type"] == "p"
            and previous is not None
            and previous["type"] in ("h2", "h3")
            and len(block["text"].split()) <= 6
            and block["text"] == block["text"].upper()
            and re.search(r"[A-ZÀ-Þ]", block["text"])
            and previous_text[-1:] not in TERMINAL
        ):
            previous["text"] = previous["text"] + " " + block["text"]
            continue

        if block["type"] == "p" and previous is not None and previous["type"] in ("p", "ul", "callout"):
            text = block["text"]
            # Une ligne finissant par deux-points annonce ce qui suit : c'est
            # une etiquette de liste, jamais la fin d'une phrase coupee.
            is_label = text.rstrip().endswith(":")
            # Intertitre : court, capitalise, sans ponctuation finale, et suivi
            # d'une liste qu'il introduit.
            is_lead_in = (
                following is not None
                and following["type"] == "ul"
                and 2 <= len(text.split()) <= 8
                # Un intertitre peut etre une question (« CM, TD, TP : comment
                # ca marche ? ») : seul le point le disqualifie vraiment.
                and (text[-1] not in TERMINAL or text.endswith(("?", "!")))
                and re.match(r"^[A-ZÀ-Ý]", text) is not None
            )
            # Le bloc precedent se termine sur un mot suspendu : la suite lui
            # appartient, quoi qu'il arrive.
            dangles = _last_word(previous_text) in DANGLING
            # Une parenthese fermante cloture aussi bien qu'un point.
            unfinished = (
                bool(previous_text)
                and previous_text[-1] not in TERMINAL + ")"
                and len(text.split()) <= 12
            )

            if not is_label and (dangles or (not is_lead_in and (
                unfinished
                or re.match(r"^[a-zà-ÿ]", text) is not None
                or previous_text.endswith(("-", "–", "—"))
            ))):
                glue = "" if previous_text.endswith(("-", "–", "—")) else " "
                if previous["type"] in ("p", "callout"):
                    previous["text"] += glue + text
                    continue
                if previous["type"] == "ul" and previous["items"]:
                    previous["items"][-1] += glue + text
                    continue

            if is_lead_in and not is_label:
                out.append({"type": "h3", "text": text})
                continue

        out.append(block)
    return out


def blocks_from_curated(content):
    """Chapitres deja rediges proprement : un bloc par paragraphe."""
    blocks = []
    for raw in content.split("\n\n"):
        chunk = raw.strip()
        if not chunk:
            continue
        heading = is_heading(chunk) if "\n" not in chunk else None
        if heading:
            blocks.append({"type": heading[0], "text": heading[1]})
        elif "Objet :" in chunk or "Madame, Monsieur," in chunk or chunk.startswith("Bonjour,"):
            blocks.append({"type": "letter", "text": chunk})
        else:
            blocks.append({"type": "p", "text": re.sub(r"[ \t]+", " ", chunk)})
    return blocks


def attach_letter_titles(blocks):
    """Un titre suivi d'une lettre devient le titre de la carte modele."""
    merged = []
    skip = False
    for i, block in enumerate(blocks):
        if skip:
            skip = False
            continue
        nxt = blocks[i + 1] if i + 1 < len(blocks) else None
        if block["type"] in ("h2", "h3") and nxt and nxt["type"] == "letter":
            merged.append({"type": "letter", "title": block["text"], "text": nxt["text"]})
            skip = True
        else:
            merged.append(block)
    return merged


def write(num, blocks, report):
    payload = {"title": CHAPTERS[num], "blocks": blocks}
    with open(os.path.join(OUT_DIR, "%d.json" % num), "w", encoding="utf-8") as fh:
        json.dump(payload, fh, ensure_ascii=False, indent=2)
    counts = {}
    for block in blocks:
        counts[block["type"]] = counts.get(block["type"], 0) + 1
    words = sum(len(b.get("text", "").split()) for b in blocks)
    words += sum(len(" ".join(b.get("items", [])).split()) for b in blocks)
    words += sum(
        len(" ".join(b.get("headers", []) + [c for r in b.get("rows", []) for c in r]).split())
        for b in blocks
    )
    report.append((num, sorted(counts.items()) + [("mots", words)]))


def main():
    text = clean_text(strip_toc(open(SRC, encoding="utf-8").read()))
    offsets = find_chapter_offsets(text)
    ordered = sorted(offsets.items(), key=lambda kv: kv[1][0])

    os.makedirs(OUT_DIR, exist_ok=True)
    report = []

    for position, item in enumerate(ordered):
        num, (_, heading_end) = item
        if num == END_MARKER:
            continue
        end = ordered[position + 1][1][0]
        write(num, parse_blocks(text[heading_end:end], num), report)

    for num in CURATED:
        path = os.path.join(CURATED_DIR, "%d.json" % num)
        content = json.load(open(path, encoding="utf-8")).get("content", "")
        write(num, attach_letter_titles(blocks_from_curated(content)), report)

    for num, counts in sorted(report):
        print("ch%2d  " % num + "  ".join("%s=%s" % (k, v) for k, v in counts))


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()
