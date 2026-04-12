import re
import json
import os

with open("pdf_content.txt", "r", encoding="utf-8") as f:
    text = f.read()

# Identify the end of the Table of Contents to avoid false positives
toc_end_marker = "1 INTRODUCTION"
# Search for the second occurrence of "1 INTRODUCTION" (the first is in TOC)
matches = list(re.finditer(r"^\s*1\s+INTRODUCTION", text, re.MULTILINE | re.IGNORECASE))
if len(matches) > 1:
    body_start = matches[1].start()
else:
    body_start = text.find("1 INTRODUCTION", 500) # Fallback

body_text = text[body_start:]

chapters_meta = [
    (1, "1 INTRODUCTION"),
    (2, "2 AVANT LE DEPART"),
    (3, "3 L’ARRIVÉE EN FRANCE"),
    (4, "4 LES DÉMARCHES ADMINISTRATIVES"),
    (5, "5 COMPRENDRE LE SYSTEME UNIVERSITAIRE FRANCAIS"),
    (6, "6 VIE QUOTIDIENNE EN FRANCE"),
    (7, "7 GÉRER SON ARGENT AU-DELÀ DU LOYER"),
    (8, "8 SANTÉ, STRESS ET COUPS DURS"),
    (9, "9 TES DROITS, TES RECOURS"),
    (10, "10 APRES LES ETUDES"),
    (11, "11 LE SALARIE AVERTI"),
    (12, "12 VIE PERSONNELLE"),
    (13, "13 LA DOUBLE CULTURE"),
    (14, "14 RETOUR D’EXPERIENCE"),
    (15, "15 CONCLUSION")
]

def find_chapter_pos(num, title, text_block):
    title_words = [w.upper() for w in title.split()[1:]]
    
    # Strategy 1: Standard "Num Title" on one line
    title_regex = r"\s+".join([re.escape(w) for w in title_words])
    pattern = re.compile(rf"^\s*{num}\s+{title_regex}", re.IGNORECASE | re.MULTILINE)
    matches = list(pattern.finditer(text_block))
    if matches:
        return matches[0].start()
    
    # Strategy 2: Number on one line, Title on next line(s)
    # We look for the number at start of line, followed by the first 2 title words within 100 chars
    pattern = re.compile(rf"^\s*{num}\s*$", re.MULTILINE)
    matches = list(pattern.finditer(text_block))
    for m in matches:
        # Check if the next non-empty lines contain the title words
        look_ahead = text_block[m.end():m.end()+300].upper()
        # It must contain at least the first two major words of the title
        match_count = sum(1 for w in title_words if w in look_ahead)
        if match_count >= 2:
            return m.start()
            
    return None

indices = []
for num, title in chapters_meta:
    pos = find_chapter_pos(num, title, body_text)
    if pos is not None:
        indices.append((num, title, pos))
    else:
        print(f"FAILED to find Chapter {num}: {title}")

indices.sort(key=lambda x: x[2])

def clean_segment(raw):
    # Remove PDF artifacts
    raw = re.sub(r'Prepared exclusively for.*Transaction:.*', '', raw, flags=re.IGNORECASE)
    raw = re.sub(r'\[Tapez ici\]', '', raw)
    
    # Split into lines and group into paragraphs
    lines = raw.split('\n')
    paragraphs = []
    current_p = []
    
    for line in lines:
        s = line.strip()
        if not s:
            if current_p:
                paragraphs.append(" ".join(current_p))
                current_p = []
            continue
        
        # Heuristic: if a line starts with a list marker or a callout keyword, it's a new block
        if re.match(r'^(•|-|➤|o|Note\s*:|Conseil\s*:|Attention\s*:|Spoiler\s*:|[0-9]+\.[0-9]+)', s, re.IGNORECASE):
            if current_p:
                paragraphs.append(" ".join(current_p))
                current_p = []
            paragraphs.append(s)
            continue
            
        current_p.append(s)
        
    if current_p:
        paragraphs.append(" ".join(current_p))
        
    return "\n\n".join(paragraphs)

os.makedirs("src/data/content", exist_ok=True)
for i in range(len(indices)):
    num, title, start = indices[i]
    if i + 1 < len(indices):
        end = indices[i+1][2]
    else:
        annex_pos = body_text.find("16 ANNEXES", start)
        end = annex_pos if annex_pos != -1 else len(body_text)
        
    raw_segment = body_text[start:end]
    # Remove the title itself from the start
    lines = raw_segment.split('\n')
    if len(lines) > 1:
        raw_segment = '\n'.join(lines[1:])
        
    final_text = clean_segment(raw_segment)
    
    with open(f"src/data/content/{num}.json", "w", encoding="utf-8") as f:
        json.dump({"title": title, "content": final_text}, f, ensure_ascii=False, indent=2)

print(f"SUCCESS: {len(indices)} chapters regenerated.")
