# -*- coding: utf-8 -*-
"""Controle de qualite du guide extrait.

Deux garde-fous :
  1. non-perte : toute phrase longue du PDF doit se retrouver dans les blocs
     (les cellules des tableaux retranscrits font exception, elles sont
     reecrites a la main dans scripts/tables.py) ;
  2. mise en page : on rejette les artefacts d'extraction connus (titres d'un
     seul mot, paragraphes commencant en minuscule, points de conduite du
     sommaire, mots composes casses).

Usage : python scripts/check_guide.py
"""
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import extract_guide as eg  # noqa: E402
from corrections import CORRECTIONS  # noqa: E402
from tables import TABLES  # noqa: E402

OUT_DIR = eg.OUT_DIR


def normalise(text):
    """Reduit un texte a ses mots, pour comparer sans se soucier des espaces."""
    return re.sub(r"[^a-zà-ÿ0-9]+", " ", text.lower()).strip()


def strip_markers(line):
    """Retire ce que l'extraction enleve legitimement d'une ligne du PDF.

    Un titre perd sa numerotation (« 1.1 BIENVENUE » -> « BIENVENUE »), une
    puce perd sa marque (« o Recevoir... »), un encadre perd son mot-cle
    (« Astuce : ... »). Sans ca le controle de non-perte crie au loup.
    """
    line = line.strip()
    line = re.sub(r"^\d+(?:\.\d+)*\s+", "", line)
    line = re.sub(r"^([-•➤▪*o]|\d+[.)])\s+", "", line)
    line = eg.CALLOUT_RE.sub(lambda m: m.group(2), line)
    return line


def block_text(block):
    if block["type"] == "ul":
        return " ".join(block["items"])
    if block["type"] == "table":
        return " ".join(block["headers"] + [c for r in block["rows"] for c in r])
    return block.get("text", "") + " " + block.get("caption", "")


def load(num):
    with open(os.path.join(OUT_DIR, "%d.json" % num), encoding="utf-8") as fh:
        return json.load(fh)["blocks"]


def raw_bodies():
    text = eg.clean_text(eg.strip_toc(open(eg.SRC, encoding="utf-8").read()))
    offsets = sorted(eg.find_chapter_offsets(text).items(), key=lambda kv: kv[1][0])
    bodies = {}
    for position, (num, (_, heading_end)) in enumerate(offsets):
        if num == eg.END_MARKER:
            continue
        bodies[num] = text[heading_end : offsets[position + 1][1][0]]
    return bodies


def check_no_loss(failures):
    """Chaque phrase longue du PDF doit survivre dans les blocs."""
    # Les tableaux sont retranscrits : leurs lignes d'origine n'ont pas a etre
    # retrouvees telles quelles.
    table_zones = []
    for spec in TABLES:
        table_zones.append((spec["chapter"], normalise(spec["start"])))

    # Les passages corriges dans scripts/corrections.py ont ete reecrits
    # volontairement : le texte d'origine ne doit plus s'y retrouver.
    corrected = {}
    for spec in CORRECTIONS:
        corrected.setdefault(spec["chapter"], []).append(normalise(spec["find"]))

    for num, body in raw_bodies().items():
        produced = normalise(" ".join(block_text(b) for b in load(num)))
        rewritten = corrected.get(num, [])
        in_table = False
        for raw_line in body.split("\n"):
            line = normalise(strip_markers(raw_line))
            if not line:
                continue
            if any(c == num and line.startswith(anchor[:25]) for c, anchor in table_zones):
                in_table = True
            if in_table:
                # On sort de la zone tableau des qu'on retrouve la ligne intacte.
                if len(line.split()) >= 8 and line in produced:
                    in_table = False
                else:
                    continue
            if len(line.split()) < 8:
                continue
            # La ligne du PDF peut etre plus courte que le passage corrige
            # (ligne coupee) ou plus longue (correction ciblee sur un extrait).
            if any(line in text or text in line for text in rewritten):
                continue                       # correction factuelle assumee
            if line not in produced:
                failures.append(
                    "ch%d : phrase perdue -> %r" % (num, raw_line.strip()[:90])
                )


def check_layout(failures):
    """Artefacts d'extraction qui ne doivent plus exister."""
    for num in range(1, 17):
        for index, block in enumerate(load(num)):
            text = block_text(block)
            where = "ch%d #%d" % (num, index)

            if "...." in text:
                failures.append("%s : point de conduite du sommaire -> %r" % (where, text[:60]))
            for label, pattern in (
                ("marqueur de puce orphelin", r"(^|\s)o\s"),
                ("fleche de sous-puce residuelle", "➤"),
                ("espace avant virgule ou point", r"\s[,.](\s|$)"),
                ("double espace", "  "),
                ("parenthese mal collee", r"\(\s|\s\)"),
                ("caractere de controle", "[\x01-\x08\x0b-\x1f]"),
                ("balisage Markdown residuel", r"\*\*|__"),
            ):
                if re.search(pattern, text):
                    failures.append("%s : %s -> %r" % (where, label, text[:60]))
            if re.search(r"[A-Za-zÀ-ÿ]- [A-ZÀ-Ý]", text):
                failures.append("%s : mot compose casse -> %r" % (where, text[:60]))
            if block["type"] == "p" and re.match(r"^[a-zà-ÿ]", block["text"]):
                failures.append("%s : paragraphe commencant en minuscule -> %r" % (where, text[:60]))
            if block["type"] in ("h2", "h3"):
                if len(block["text"].split()) < 2 and block["text"] not in ("Résumé", "Cinéma"):
                    failures.append("%s : titre d'un seul mot -> %r" % (where, block["text"]))
                if not re.match(r"^([A-ZÀ-Ý(«\"]|\d+[.)])", block["text"]):
                    failures.append("%s : titre mal forme -> %r" % (where, block["text"][:60]))


def main():
    failures = []
    check_no_loss(failures)
    check_layout(failures)

    if failures:
        print("%d probleme(s) :" % len(failures))
        for failure in failures[:40]:
            print("  -", failure)
        sys.exit(1)

    total = sum(
        len(block_text(b).split()) for num in range(1, 17) for b in load(num)
    )
    print("Guide conforme : 16 chapitres, %d mots, aucune perte detectee." % total)


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()
