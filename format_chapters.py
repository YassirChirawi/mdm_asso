import re
import json
import os

with open("pdf_content.txt", "r", encoding="utf-8") as f:
    text = f.read()

# Nettoyage de base pour enlever les footers "Prepared exclusively for..."
text = re.sub(r'Prepared exclusively for.*?\n', '', text)
text = re.sub(r'\n\d+\s*\n', '\n', text) # suppression probable des numéros de page isolés

chapters_titles = [
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
    "11 Le Salarié Averti",
    "12 Vie Personnelle",
    "13 LA DOUBLE CULTURE",
    "14 RETOUR D’EXPERIENCE",
    "15 CONCLUSION"
]

chapters_content = {}
current_chapter = 0

lines = text.split('\n')
current_text = []

for line in lines:
    line_stripped = line.strip()
    
    # Détection de début de chapitre (heuristique)
    is_new_chapter = False
    for i, title in enumerate(chapters_titles):
        if i + 1 > current_chapter and line_stripped.startswith(str(i+1) + " ") and len(line_stripped) < 80:
            if title[:5].lower() in line_stripped.lower():
                # save previous
                if current_chapter > 0:
                    chapters_content[current_chapter] = "\n".join(current_text)
                current_chapter = i + 1
                current_text = [f"## {line_stripped}"]
                is_new_chapter = True
                break
    
    if not is_new_chapter:
        if current_chapter > 0:
            current_text.append(line)

# save the last one
if current_chapter > 0:
    chapters_content[current_chapter] = "\n".join(current_text)

os.makedirs("src/data/content", exist_ok=True)

for i in range(1, 15):
    content = chapters_content.get(i, "Contenu non trouvé ou en cours de formatage.")
    # format simple : double line breaks for paragraph
    paragraphs = []
    chunk = ""
    for ln in content.split('\n'):
        if ln.strip() == "":
            if chunk.strip():
                paragraphs.append(chunk.strip())
            chunk = ""
        else:
            chunk += " " + ln.strip()
    if chunk.strip():
        paragraphs.append(chunk.strip())
        
    final_content = "\n\n".join(paragraphs)
    
    with open(f"src/data/content/{i}.json", "w", encoding="utf-8") as f:
        json.dump({"content": final_content}, f, ensure_ascii=False, indent=2)

print("Parsed chapters to src/data/content/")
