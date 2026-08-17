import os
import google.generativeai as genai
from dotenv import load_dotenv
import time

load_dotenv()
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])

def extract_pdf_gemini(pdf_path, md_path):
    print(f"Uploading {pdf_path} to Gemini...")
    pdf_file = genai.upload_file(pdf_path, mime_type="application/pdf")
    
    # Wait for the file to be processed if needed
    while pdf_file.state.name == "PROCESSING":
        print("Waiting for file processing...")
        time.sleep(2)
        pdf_file = genai.get_file(pdf_file.name)
        
    print("Extracting text via Gemini API...")
    model = genai.GenerativeModel('gemini-1.5-flash')
    prompt = "Extract all the Thai text from this PDF exactly as it appears. Ensure accuracy, maintain paragraphs, and output in Markdown format."
    response = model.generate_content([pdf_file, prompt])
    
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(f"# {os.path.basename(pdf_path)}\n\n")
        f.write(response.text)
    
    print(f"Done! Saved to {md_path}")
    genai.delete_file(pdf_file.name)

if __name__ == "__main__":
    extract_pdf_gemini("NLLaw/คลังความรู้/1.pdf", "Obsidian_NL_Exam/Law_Knowledge/1.md")
