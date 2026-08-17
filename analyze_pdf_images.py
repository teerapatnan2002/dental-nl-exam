import fitz
import sys

def analyze_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    print(f"\n\n======= ANALYZING {pdf_path} =======")
    for i, page in enumerate(doc):
        text = page.get_text("text").strip()
        images = page.get_images(full=True)
        if images:
            # Filter tiny images
            valid_images = []
            for img in images:
                xref = img[0]
                base_image = doc.extract_image(xref)
                w = base_image["width"]
                h = base_image["height"]
                if w >= 50 and h >= 50:
                    valid_images.append(img)
            
            if valid_images:
                print(f"--- PAGE {i+1} HAS VALID IMAGES ({len(valid_images)}) ---")
                lines = text.split('\n')
                print("FIRST 6 LINES:")
                print("\n".join(lines[:6]))
                print("="*40)

analyze_pdf("NL2Test2023/NL 2 2566 part 2.pdf")
analyze_pdf("NL2Test2023/NL 2 2566 part 3.pdf")
analyze_pdf("NL2Test2023/NL 2 2566 part 4.pdf")
