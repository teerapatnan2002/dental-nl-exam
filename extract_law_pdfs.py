import os
import fitz

DIRS = [
    "/Users/admin/Downloads/NL Test/NLLaw/คลังความรู้",
    "/Users/admin/Downloads/NL Test/NLLaw"
]
DEST_DIR = "/Users/admin/Downloads/NL Test/Obsidian_NL_Exam/Law_Knowledge"

def extract_pdf_to_md(pdf_path, md_path):
    try:
        doc = fitz.open(pdf_path)
        text_content = []
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            text_content.append(page.get_text("text"))
        with open(md_path, "w", encoding="utf-8") as f:
            f.write(f"# {os.path.basename(pdf_path)}\n\n" + "\n\n".join(text_content))
        print(f"✅ Extracted: {os.path.basename(pdf_path)}")
    except Exception as e:
        print(f"❌ Failed: {os.path.basename(pdf_path)} - {str(e)}")

os.makedirs(DEST_DIR, exist_ok=True)
for d in DIRS:
    for filename in os.listdir(d):
        if filename.endswith(".pdf"):
            md_path = os.path.join(DEST_DIR, filename.replace(".pdf", ".md"))
            if not os.path.exists(md_path):
                extract_pdf_to_md(os.path.join(d, filename), md_path)
