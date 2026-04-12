import re
import json
import os

with open("pdf_content.txt", "r", encoding="utf-8") as f:
    text = f.read()

chapters = [
    "1 INTRODUCTION",
    "2 AVANT LE DEPART",
    "3 L’ARRIVÉE EN FRANCE",
    "4 LES DÉMARCHES ADMINISTRATIVES",
    "5 COMPRENDRE LE SYSTEME UNIVERSITAIRE FRANCAIS",
    "6 VIE QUOTIDIENNE EN FRANCE",
    "7 GÉRER SON ARGENT AU-DELÀ DU LOYER",
    "8 SANTÉ, STRESS ET COUPS DURS",
    "9 TES DROITS, TES RECOURS : TE DÉFENDRE ET T'AFFIRMER",
    "10 APRES LES ETUDES",
    "11 Le Salarié Averti - Décrypter son Contrat et Naviguer la Vie d'Entreprise",
    "12 Vie Personnelle, Équilibre et Grandes Décisions",
    "13 LA DOUBLE CULTURE COMME SUPER-POUVOIR : STRATÉGIE DE CARRIÈRE",
    "14 RETOUR D’EXPERIENCE",
    "15 CONCLUSION"
]

indices = []
for i, title in enumerate(chapters):
    # Regex with flexible spacing
    title_regex = r"\s*".join(re.escape(word) for word in title.split())
    matches = list(re.finditer(title_regex, text, re.IGNORECASE))
    if matches:
        idx = matches[-1].start()
        indices.append((i+1, title, idx))

indices.sort(key=lambda x: x[2])

os.makedirs("src/data/content", exist_ok=True)

for i in range(len(indices)):
    ch_num = indices[i][0]
    title = indices[i][1]
    start_idx = indices[i][2]
    
    end_idx = indices[i+1][2] if i + 1 < len(indices) else len(text)
        
    content_raw = text[start_idx:end_idx]
    
    lines = content_raw.split('\n')
    cleaned_lines = []
    
    for line in lines:
        sline = line.strip()
        if sline.isdigit() or "Prepared exclusively for" in sline or "Transaction:" in sline:
            continue
        cleaned_lines.append(sline)
        
    final_text = ""
    for line in cleaned_lines:
        if not line:
            final_text += "\n\n"
        else:
            final_text += line + " "
            
    final_text = re.sub(r'(\n\s*){2,}', '\n\n', final_text).strip()

    with open(f"src/data/content/{ch_num}.json", "w", encoding="utf-8") as f:
        json.dump({"title": title, "content": final_text}, f, ensure_ascii=False, indent=2)

print("Parsed accurately.")
