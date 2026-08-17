import fitz
import sys

def check_pdf_text(pdf_path):
    print(f"Checking {pdf_path}...")
    doc = fitz.open(pdf_path)
    page = doc.load_page(0)
    text = page.get_text()
    if text.strip():
        print("Text found directly!")
        print(text[:500])
    else:
        print("No text found. Needs OCR.")

if __name__ == "__main__":
    check_pdf_text("NLLaw/คลังความรู้/porobo2.pdf")
    check_pdf_text("NLLaw/คลังความรู้/XEK5VKDF77QLPVXS.pdf")
