import os
import fitz
import base64
import requests
import json
from dotenv import load_dotenv

load_dotenv()
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")

def extract_pdf_openrouter(pdf_path):
    print(f"Extracting images from {pdf_path}...")
    doc = fitz.open(pdf_path)
    
    page = doc.load_page(0)
    pix = page.get_pixmap(dpi=150)
    img_bytes = pix.tobytes("jpeg")
    b64 = base64.b64encode(img_bytes).decode('utf-8')
    print(f"Extracted page 1")
    
    print(f"Sending images to OpenRouter...")
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "nvidia/nemotron-nano-12b-v2-vl:free",
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "Extract all the Thai text from this page exactly as it appears. Ensure accuracy, maintain paragraphs, and output only the extracted text in Markdown format. Do not include any conversational filler."},
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64}"}}
                ]
            }
        ],
        "max_tokens": 1500
    }
    
    try:
        response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload, timeout=60)
        if response.status_code == 200:
            result = response.json()
            print("Raw response:", result)
            text = result['choices'][0]['message']['content']
            print(f"✅ Page 1 done.")
            print(text)
        else:
            print(f"❌ Error on page 1: {response.status_code} {response.text}")
    except Exception as e:
        print(f"❌ Exception on page 1: {str(e)}")

if __name__ == "__main__":
    extract_pdf_openrouter("NLLaw/คลังความรู้/porobo2.pdf")
