import fitz
import easyocr
import base64
import os
import cv2
import numpy as np

def extract_pdf_easyocr(pdf_path, md_path):
    print(f"Extracting images from {pdf_path}...")
    doc = fitz.open(pdf_path)
    
    # Initialize EasyOCR reader with Thai and English
    reader = easyocr.Reader(['th', 'en'], gpu=False)
    
    all_text = []
    for page_num in range(len(doc)):
        print(f"Processing page {page_num + 1}/{len(doc)}...")
        page = doc.load_page(page_num)
        # Higher DPI for better OCR accuracy
        pix = page.get_pixmap(dpi=200)
        
        # Convert pixmap to numpy array (RGB)
        img_array = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.h, pix.w, pix.n)
        if pix.n == 4:
            img_array = cv2.cvtColor(img_array, cv2.COLOR_RGBA2RGB)
            
        # Run OCR
        result = reader.readtext(img_array, detail=0, paragraph=True)
        text = "\n".join(result)
        
        all_text.append(f"## หน้า {page_num + 1}\n\n{text}\n\n")
        print(f"✅ Page {page_num + 1} done.")
            
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(f"# {os.path.basename(pdf_path)}\n\n")
        f.write("\n".join(all_text))
        
    print(f"Done! Saved to {md_path}")

if __name__ == "__main__":
    extract_pdf_easyocr("NLLaw/คลังความรู้/porobo2.pdf", "Obsidian_NL_Exam/Law_Knowledge/porobo2.md")
    extract_pdf_easyocr("NLLaw/คลังความรู้/XEK5VKDF77QLPVXS.pdf", "Obsidian_NL_Exam/Law_Knowledge/XEK5VKDF77QLPVXS.md")
