from pypdf import PdfReader

reader = PdfReader(r"C:\Users\Yassir Chirawi\Downloads\Main_dans_la_main_FINAL.pdf")
text = ""
for page in reader.pages:
    text += page.extract_text() + "\n\n"

with open("pdf_content.txt", "w", encoding="utf-8") as f:
    f.write(text)

print("PDF text extracted.")
