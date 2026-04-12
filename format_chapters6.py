import re
import json
import os

with open("pdf_content.txt", "r", encoding="utf-8") as f:
    text = f.read()

# Define chapters and their exact body header string or part of it
# that appears after the TOC.
chapters = [
    (1, "1 INTRODUCTION"),
    (2, "2 AVANT LE DEPART"),
    (3, "3 L’ARRIVÉE EN FRANCE"),
    (4, "4 LES DÉMARCHES ADMINISTRATIVES"),
    (5, "5 COMPRENDRE LE SYSTEME UNIVERSITAIRE FRANCAIS"),
    (6, "6 VIE QUOTIDIENNE EN FRANCE"),
    (7, "7 GÉRER SON ARGENT AU-DELÀ DU LOYER"),
    (8, "8 SANTÉ, STRESS ET COUPS DURS"),
    (9, "9 TES DROITS, TES RECOURS : TE DÉFENDRE ET T'AFFIRMER"),
    (10, "10 APRES LES ETUDES"),
    (11, "11 Le Salarié Averti"),
    (12, "12 Vie Personnelle, Équilibre et Grandes Décisions"),
    (13, "13 LA DOUBLE CULTURE COMME SUPER-POUVOIR"),
    (14, "14 RETOUR D’EXPERIENCE"),
    (15, "15 CONCLUSION")
]

# Step 1: Find all lines that look like a main chapter header (\d+ TITLE)
# after skipping the TOC (which ends approx around line 300 / char pos 6000)
TOC_SKIP = 6000

# We'll search for patterns: ^[num] [TITLE]
# Some headers are multiline or have slight variations.
# We'll find ALL matches and then pick the first one after TOC_SKIP for each number.

found = []
for num, title in chapters:
    # Use only the first few words for the regex to be safe
    short_title = " ".join(title.split()[:3]).upper()
    # Normalize by removing number for regex if needed
    clean_title = re.sub(r'^\d+\s+', '', short_title)
    
    # Pattern: Digit(s) followed by title words (case insensitive, allowing some noise)
    pattern = re.compile(rf"^\s*{num}\s+.*{re.escape(clean_title)}", re.IGNORECASE | re.MULTILINE)
    
    matches = list(pattern.finditer(text))
    # Pick the one that is after TOC_SKIP
    best = None
    for m in matches:
        if m.start() > TOC_SKIP:
            best = m
            break
    
    if best:
        found.append((num, title, best.start()))
    else:
        # Emergency fallback: search for just the number if it's a short header
        pattern = re.compile(rf"^\s*{num}\s*$", re.MULTILINE)
        matches = list(pattern.finditer(text))
        for m in matches:
            if m.start() > TOC_SKIP:
                best = m
                break
        if best:
            found.append((num, title, best.start()))
        else:
            print(f"FAILED TO FIND CHAPTER {num}")

found.sort(key=lambda x: x[2])

def clean_content(content):
    # Remove markers like "Prepared exclusively for..." and page numbers
    content = re.sub(r'Prepared exclusively for.*Transaction:.*', '', content, flags=re.IGNORECASE)
    content = re.sub(r'\[Tapez ici\]', '', content)
    # Remove standalone numbers on lines (page numbers)
    lines = content.split('\n')
    cleaned = []
    for l in lines:
        if l.strip().isdigit(): continue
        cleaned.append(l.strip())
    
    res = " ".join(cleaned)
    res = re.sub(r'\s+', ' ', res)
    # Re-insert paragraphs based on some logic or just double-newlines
    # The original PDF text usually has sub-headers like 1.1, 1.2
    # Let's add newlines before these.
    res = re.sub(r' (\d+\.\d+(\.\d+)?) ', r'\n\n\1 ', res)
    # Also before main numbers in sublists
    res = re.sub(r' (\d+\.) ', r'\n\n\1 ', res)
    return res.strip()

os.makedirs("src/data/content", exist_ok=True)
for i in range(len(found)):
    num, title, start = found[i]
    end = found[i+1][2] if i+1 < len(found) else len(text)
    
    chapter_text = text[start:end]
    # Remove the first line (the header)
    first_newline = chapter_text.find('\n')
    if first_newline != -1:
        chapter_text = chapter_text[first_newline:]
        
    final_content = clean_content(chapter_text)
    
    with open(f"src/data/content/{num}.json", "w", encoding="utf-8") as f:
        json.dump({"title": title, "content": final_content}, f, ensure_ascii=False, indent=2)

print("FINISH")
