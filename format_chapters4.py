import re
import json
import os

def clean_content(raw_text):
    # Remove page numbers and headers
    lines = raw_text.split('\n')
    cleaned_lines = []
    
    # Pattern for "Prepared exclusively for..." and standalone page numbers
    page_num_pattern = re.compile(r'^\s*\d+\s*$')
    header_pattern = re.compile(r'Prepared exclusively for.*Transaction:', re.IGNORECASE)
    
    for line in lines:
        sline = line.strip()
        if not sline:
            cleaned_lines.append("")
            continue
        if page_num_pattern.match(sline):
            continue
        if header_pattern.search(sline):
            continue
        if "[Tapez ici]" in sline:
            continue
        cleaned_lines.append(sline)
        
    # Reconstruct text with better paragraph handling
    final_text = ""
    for line in cleaned_lines:
        if not line:
            if not final_text.endswith("\n\n"):
                final_text += "\n\n"
        else:
            final_text += line + " "
            
    # Clean up multiple spaces and newlines
    final_text = re.sub(r' +', ' ', final_text)
    final_text = re.sub(r'(\n\s*){3,}', '\n\n', final_text)
    return final_text.strip()

with open("pdf_content.txt", "r", encoding="utf-8") as f:
    text = f.read()

# We look for chapters AFTER the Table of Contents (which ends around page 6/7)
# Let's find the first "1 INTRODUCTION" that isn't followed by dots (TOC style)
# and occurs later in the file.

chapters_definitions = [
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

# Find indices of all chapter headers
# Use a more restrictive regex: Chapter number at start of line, followed by space, then title
found_indices = []

# Search after line 300 approx to skip TOC
# But let's just search the whole text and pick the ones that look like real headers (not TOC)
for num, title in chapters_definitions:
    # Pattern: Digit(s) Title (not followed by many dots)
    # Use re.MULTILINE to use ^
    regex = r"^\s*" + str(num) + r"\s+" + re.escape(title.split()[-1])
    # Actually, simpler: search for the whole string but ensure it's not the TOC line
    
    # Special handling for titles
    search_title = title
    if num == 11: search_title = "11 Le Salarié Averti"
    if num == 13: search_title = "13 LA DOUBLE CULTURE COMME SUPER-POUVOIR"
    
    pattern = re.compile(r"^\s*" + re.escape(search_title), re.IGNORECASE | re.MULTILINE)
    
    matches = list(pattern.finditer(text))
    # In this PDF, the TOC is first, then the content. 
    # TOC lines usually end with ".... [page]".
    # Content headers are usually alone on a line.
    
    real_match = None
    for m in matches:
        start_pos = m.start()
        line_end = text.find("\n", start_pos)
        line = text[start_pos:line_end] if line_end != -1 else text[start_pos:]
        
        # If line has dots followed by numbers, it's TOC
        if "...." in line:
            continue
        
        # If it's the real one, it should be the first one after the TOC
        real_match = m
        # We don't break yet, we want the one that is NOT in the first 5000 chars (TOC)
        if start_pos > 5000:
            break
            
    if real_match:
        found_indices.append((num, title, real_match.start()))
    else:
        print(f"Warning: Could not find real header for {title}")

found_indices.sort(key=lambda x: x[2])

os.makedirs("src/data/content", exist_ok=True)

for i in range(len(found_indices)):
    num, title, start_pos = found_indices[i]
    end_pos = found_indices[i+1][2] if i+1 < len(found_indices) else len(text)
    
    raw_content = text[start_pos:end_pos]
    full_title = title # Keep original title used for UI
    
    # Specific extraction for Chapter 1: 
    # If the first line is just "1 INTRODUCTION", skip it and look for content
    content = clean_content(raw_content)
    
    # Further clean: remove the title from the start of content if it's there
    if content.upper().startswith(full_title.upper()):
        content = content[len(full_title):].strip()

    with open(f"src/data/content/{num}.json", "w", encoding="utf-8") as f:
        json.dump({"title": full_title, "content": content}, f, ensure_ascii=False, indent=2)

print("Extraction logic updated and executed.")
