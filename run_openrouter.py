import sys
from openrouter_ocr_pdf import extract_pdf_openrouter

if len(sys.argv) > 2:
    extract_pdf_openrouter(sys.argv[1], sys.argv[2])
