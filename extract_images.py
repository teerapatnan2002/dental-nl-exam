import fitz  # PyMuPDF
import sqlite3
import os
import glob
import difflib
import re

os.makedirs("images", exist_ok=True)

conn = sqlite3.connect("exam_bank.db")
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

cursor.execute("SELECT id, question_text, stem, proposition FROM questions")
all_questions = cursor.fetchall()

def clean_text(t):
    # Remove whitespace, newlines, and common bullet numbering to focus on raw words
    t = re.sub(r'\s+', '', t)
    return t.strip()

pdf_files = glob.glob("**/*.pdf", recursive=True)

print(f"Loaded {len(all_questions)} questions from DB.")
print(f"Found {len(pdf_files)} PDF files to scan.")

for pdf_path in pdf_files:
    if "venv" in pdf_path or "node_modules" in pdf_path or ".tempmediaStorage" in pdf_path:
        continue
        
    print(f"Scanning {pdf_path}...")
    try:
        doc = fitz.open(pdf_path)
    except Exception as e:
        print(f"Could not open {pdf_path}: {e}")
        continue
        
    for page_num in range(len(doc)):
        page = doc[page_num]
        
        try:
            images = page.get_image_info(xrefs=True)
        except Exception:
            continue
            
        if not images:
            continue
            
        blocks = page.get_text("blocks")
        
        for img in images:
            bbox = img.get("bbox")
            xref = img.get("xref")
            if not bbox or not xref or xref <= 0:
                continue
                
            # Filter out tiny noise images (e.g. logos or artifacts)
            width = bbox[2] - bbox[0]
            height = bbox[3] - bbox[1]
            if width < 50 or height < 50:
                continue
                
            y0_img = bbox[1]
            
            # Gather all text on the page ABOVE this image
            text_above = ""
            for b in blocks:
                if b[6] == 0:  # text block
                    y1_block = b[3]
                    if y1_block <= y0_img + 15:
                        text_above += b[4]
                        
            cleaned_above = clean_text(text_above)
            
            if len(cleaned_above) < 10:
                continue
                
            # Find the best matching question
            # Since the text_above contains ALL text from the top of the page down to the image,
            # the actual question text should be a suffix or near the end of cleaned_above.
            # We can use difflib to find the best match or simply check if the question text is in the text_above.
            
            best_match = None
            best_score = 0
            
            for q in all_questions:
                q_text = clean_text(q['question_text'])
                
                # Heuristic 1: Question text is a direct substring of the text above the image
                if len(q_text) > 10 and q_text in cleaned_above:
                    best_match = q
                    best_score = 1.0
                    break
                    
                # Heuristic 2: Sequence matching on the end of the text
                # Compare the last N characters of text_above with the question text
                compare_len = min(len(cleaned_above), len(q_text) + 20)
                tail_text = cleaned_above[-compare_len:]
                
                ratio = difflib.SequenceMatcher(None, tail_text, q_text).ratio()
                if ratio > best_score:
                    best_score = ratio
                    best_match = q
                    
            if best_match and best_score > 0.6:
                print(f"  Matched image on page {page_num+1} to QID {best_match['id']} (Score: {best_score:.2f})")
                
                base_image = doc.extract_image(xref)
                if base_image:
                    image_bytes = base_image["image"]
                    ext = base_image["ext"]
                    img_filename = f"{best_match['id']}.{ext}"
                    
                    with open(os.path.join("images", img_filename), "wb") as f:
                        f.write(image_bytes)
                        
                    cursor.execute("UPDATE questions SET image_path = ? WHERE id = ?", (img_filename, best_match['id']))
                    conn.commit()

conn.close()
print("Done.")
