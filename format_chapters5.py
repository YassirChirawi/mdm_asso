import re
import json
import os
import unicodedata

def normalize(text):
    return "".join(c for c in unicodedata.normalize('NFD', text)
                   if unicodedata.category(c) != 'Mn').upper().strip()

def clean_content(raw_text):
    lines = raw_text.split('\n')
    cleaned_lines = []
    
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
        
    final_text = ""
    for line in cleaned_lines:
        if not line:
            if not final_text.endswith("\n\n"):
                final_text += "\n\n"
        else:
            final_text += line + " "
            
    final_text = re.sub(r' +', ' ', final_text)
    final_text = re.sub(r'(\n\s*){3,}', '\n\n', final_text)
    return final_text.strip()

with open("pdf_content.txt", "r", encoding="utf-8") as f:
    text = f.read()

# Chapter definitions with unique keywords to identify them in the body
chapters_definitions = [
    (1, "1 INTRODUCTION", "BIENVENUE EN FRANCE"),
    (2, "2 AVANT LE DEPART", "ORGANISER SES BAGAGES"),
    (3, "3 L’ARRIVÉE EN FRANCE", "À L’AÉROPORT ET LES PREMIERS JOURS"),
    (4, "4 LES DÉMARCHES ADMINISTRATIVES", "NOTICE GÉNÉRALE"),
    (5, "5 COMPRENDRE LE SYSTEME UNIVERSITAIRE FRANCAIS", "TYPES D’ÉTABLISSEMENTS"),
    (6, "6 VIE QUOTIDIENNE EN FRANCE", "MANGER HALAL"),
    (7, "7 GÉRER SON ARGENT AU-DELÀ DU LOYER", "ANATOMIE D'UNE FICHE DE PAIE"),
    (8, "8 SANTÉ, STRESS ET COUPS DURS", "QUAND TU TOMBES MALADE"),
    (9, "9 TES DROITS, TES RECOURS", "NE PLUS SUBIR"),
    (10, "10 APRES LES ETUDES", "DEMANDER L’APS"),
    (11, "11 Le Salarié Averti", "DÉCRYPTER SON CONTRAT"),
    (12, "12 Vie Personnelle, Équilibre", "LE VOYAGE INTÉRIEUR"),
    (13, "13 LA DOUBLE CULTURE", "NE PLUS SE JUSTIFIER"),
    (14, "14 RETOUR D’EXPERIENCE", "APRÈS TOUTES LES INFORMATIONS"),
    (15, "15 CONCLUSION", "MERCI D'AVOIR PARCOURU")
]

found_indices = []

for num, title, keyword in chapters_definitions:
    # Try finding the chapter number at the start of a line
    # followed by the keyword shortly after
    norm_text = normalize(text)
    norm_keyword = normalize(keyword)
    
    # We search for the pattern "NUM ... KEYWORD" but we need the original index
    # Let's search for "NUM" at start of line and check if it's the right one
    
    # Find all occurrences of the number at start of line
    pattern = re.compile(rf"^\s*{num}\s+", re.MULTILINE)
    matches = list(pattern.finditer(text))
    
    best_match = None
    for m in matches:
        start_pos = m.start()
        # Look ahead for keyword
        look_ahead = text[start_pos:start_pos+500]
        if normalize(norm_keyword) in normalize(look_ahead):
            # Ensure it's not the TOC (usually TOC has dots)
            line_end = text.find("\n", start_pos)
            line = text[start_pos:line_end]
            if "...." in line:
                continue
            best_match = m
            break
            
    if best_match:
        found_indices.append((num, title, best_match.start()))
    else:
        # Fallback for some chapters that might not have the keyword exactly
        print(f"Warning: Falling back for {title}")
        # Just search for the TITLE string itself after skipping TOC
        pattern = re.compile(rf"^\s*{num}\s+{re.escape(title.split()[-1])}", re.IGNORECASE | re.MULTILINE)
        matches = list(pattern.finditer(text))
        for m in matches:
            if m.start() > 5000 and "...." not in text[m.start():text.find("\n", m.start())]:
                best_match = m
                break
        if best_match:
            found_indices.append((num, title, best_match.start()))
        else:
            print(f"Error: Could not find {title}")

found_indices.sort(key=lambda x: x[2])

os.makedirs("src/data/content", exist_ok=True)

for i in range(len(found_indices)):
    num, title, start_pos = found_indices[i]
    end_pos = found_indices[i+1][2] if i+1 < len(found_indices) else len(text)
    
    # Special stop for Chapter 15 to not include Annexes
    if num == 15:
        # Annexes usually start with "16 ANNEXES"
        annex_pos = text.find("16 ANNEXES", start_pos)
        if annex_pos != -1:
            end_pos = annex_pos

    raw_content = text[start_pos:end_pos]
    content = clean_content(raw_content)
    
    # Remove the first line if it's just the header
    lines = content.split('\n')
    if lines and normalize(lines[0]).startswith(normalize(str(num))):
        content = "\n".join(lines[1:]).strip()

    with open(f"src/data/content/{num}.json", "w", encoding="utf-8") as f:
        json.dump({"title": title, "content": content}, f, ensure_ascii=False, indent=2)

print("Robust extraction complete.")
