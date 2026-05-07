import re
import json
import os

def clean_page(page_text):
    # Remove "Prepared exclusively for..." and the following line (usually page number)
    page_text = re.sub(r'Prepared exclusively for.*Transaction:.*', '', page_text, flags=re.IGNORECASE)
    # Remove [Tapez ici]
    page_text = re.sub(r'\[Tapez ici\]', '', page_text)
    
    lines = page_text.split('\n')
    cleaned_lines = []
    for line in lines:
        # Remove standalone page numbers (sometimes they are just a digit on a line)
        if line.strip().isdigit():
            continue
        cleaned_lines.append(line.rstrip())
    
    return "\n".join(cleaned_lines)

with open("pdf_content.txt", "r", encoding="utf-8") as f:
    text = f.read()

# The TOC ends around "1 INTRODUCTION"
# Let's find the first "1 INTRODUCTION" after some offset to skip TOC
TOC_SKIP = 6000

chapters_config = [
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

# Step 1: Clean the text globally but preserve page-relative structure
# We identify page breaks by the footer pattern
pages = re.split(r'Prepared exclusively for.*Transaction:.*', text, flags=re.IGNORECASE)
cleaned_pages = []
for page in pages:
    cleaned_pages.append(clean_page(page))

full_cleaned_text = "\n".join(cleaned_pages)

# Step 2: Find chapter starts in the cleaned text
found = []
for num, title in chapters_config:
    # Pattern: ^num TITLE
    # We escape special characters in title but keep it flexible
    short_title = " ".join(title.split()[:3])
    clean_title = re.sub(r'^\d+\s+', '', short_title)
    
    pattern = re.compile(rf"^\s*{num}\s+.*{re.escape(clean_title)}", re.IGNORECASE | re.MULTILINE)
    
    matches = list(pattern.finditer(full_cleaned_text))
    best = None
    for m in matches:
        if m.start() > TOC_SKIP:
            best = m
            break
    
    if best:
        found.append((num, title, best.start()))
    else:
        # Fallback to just the number on a line if it's the start of a chapter
        pattern = re.compile(rf"^\s*{num}\s*$", re.MULTILINE)
        matches = list(pattern.finditer(full_cleaned_text))
        for m in matches:
            if m.start() > TOC_SKIP:
                best = m
                break
        if best:
            found.append((num, title, m.start()))

found.sort(key=lambda x: x[2])

# Step 3: Extract and save chapters
os.makedirs("src/data/content", exist_ok=True)
for i in range(len(found)):
    num, title, start = found[i]
    end = found[i+1][2] if i+1 < len(found) else len(full_cleaned_text)
    
    chapter_text = full_cleaned_text[start:end]
    
    # Clean the chapter text
    # 1. Remove the header line
    lines = chapter_text.split('\n')
    if lines:
        # Skip the first few lines if they are empty or just the title
        content_lines = []
        started = False
        for line in lines[1:]:
            if not started and not line.strip():
                continue
            started = True
            content_lines.append(line)
        
        # Join lines and handle multiple newlines
        content = "\n".join(content_lines)
        # Normalize multiple newlines to double newlines for the frontend
        content = re.sub(r'\n{3,}', '\n\n', content)
        
        # Final cleanup for the frontend heuristics
        # Ensure subheaders like "3.1.1" have double newlines before them if they are on a line
        content = re.sub(r'\n([0-9]+\.[0-9]+(\.[0-9]+)?)', r'\n\n\1', content)
        
        with open(f"src/data/content/{num}.json", "w", encoding="utf-8") as f:
            json.dump({"title": title, "content": content.strip()}, f, ensure_ascii=False, indent=2)

print(f"Extraction complete. {len(found)} chapters generated.")
