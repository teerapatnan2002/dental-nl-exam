import fitz
import base64
import requests
import os
import time
from dotenv import load_dotenv

load_dotenv()
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")

def extract_pdf_openrouter(pdf_path, md_path):
    print(f"Extracting images from {pdf_path}...")
    doc = fitz.open(pdf_path)
    base64_images = []
    
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        # Using a lower DPI (72) to reduce payload size and avoid 504 timeouts
        pix = page.get_pixmap(dpi=72)
        img_bytes = pix.tobytes("jpeg")
        b64 = base64.b64encode(img_bytes).decode('utf-8')
        base64_images.append(b64)
        print(f"Extracted page {page_num + 1}/{len(doc)} at DPI 72")
        
    print(f"Sending images to OpenRouter (nvidia/nemotron-nano-12b-v2-vl:free)...")
    
    all_text = []
    for i, b64 in enumerate(base64_images):
        max_retries = 3
        for attempt in range(max_retries):
            print(f"Processing page {i+1}/{len(base64_images)} (Attempt {attempt+1})...")
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
                    text = result.get('choices', [{}])[0].get('message', {}).get('content')
                    if text:
                        all_text.append(f"## หน้า {i+1}\n\n{text}\n\n")
                        print(f"✅ Page {i+1} done.")
                        break
                    else:
                        print(f"⚠️ Page {i+1} returned empty content. Retrying...")
                else:
                    print(f"❌ Error on page {i+1}: {response.status_code} {response.text}")
            except Exception as e:
                print(f"❌ Exception on page {i+1}: {str(e)}")
            
            if attempt < max_retries - 1:
                time.sleep(5)
            else:
                all_text.append(f"## หน้า {i+1}\n\n(Error extracting text)\n\n")
            
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(f"# {os.path.basename(pdf_path)}\n\n")
        f.write("\n".join(all_text))
        
    print(f"Done! Saved to {md_path}")

if __name__ == "__main__":
    extract_pdf_openrouter("NLLaw/คลังความรู้/porobo2.pdf", "Obsidian_NL_Exam/Law_Knowledge/porobo2.md")
    extract_pdf_openrouter("NLLaw/คลังความรู้/XEK5VKDF77QLPVXS.pdf", "Obsidian_NL_Exam/Law_Knowledge/XEK5VKDF77QLPVXS.md")
