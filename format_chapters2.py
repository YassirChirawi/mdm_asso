import re
import json
import os

with open("pdf_content.txt", "r", encoding="utf-8") as f:
    text = f.read()

text = re.sub(r'Prepared exclusively for.*?Transaction: \d+', '', text)

chapter_markers = []
for i in range(1, 17):
    # Regex for number followed by uppercase/spaces (the chapter title)
    pattern = rf"(?m)^{i}\s+([A-ZÉÀÊÈ'\s—-]+)$"
    matches = list(re.finditer(pattern, text))
    if matches:
        # Avoid TOC matches by picking the match that's far enough into the document (e.g. past the first 2000 chars)
        actual_matches = [m for m in matches if m.start() > 2000]
        if actual_matches:
            match = actual_matches[0]
            chapter_markers.append((i, match.start(), match.end(), match.group(0)))

chapter_markers.sort(key=lambda x: x[1])

os.makedirs("src/data/content", exist_ok=True)

for idx, marker in enumerate(chapter_markers):
    ch_num = marker[0]
    start_pos = marker[2]
    title = marker[3]
    
    end_pos = chapter_markers[idx+1][1] if idx + 1 < len(chapter_markers) else len(text)
    
    content = text[start_pos:end_pos].strip()
    
    lines = content.split('\n')
    cleaned = []
    for line in lines:
        line_s = line.strip()
        if not line_s or line_s.isdigit():
            cleaned.append("")
        else:
            cleaned.append(line_s)
            
    final_content = ""
    for line in cleaned:
        if line == "":
            final_content += "\n\n"
        else:
            final_content += line + " "

    final_content = re.sub(r'\n\n+', '\n\n', final_content).strip()
    
    with open(f"src/data/content/{ch_num}.json", "w", encoding="utf-8") as f:
        json.dump({"title": title, "content": final_content}, f, ensure_ascii=False, indent=2)

print("Parsed.")
