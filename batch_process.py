import os
import sys
import glob
import time
import json
import traceback
from ai_categorizer import extract_text_from_pdf, categorize_exam_questions
from import_data import import_data

def get_all_pdfs(root_dir):
    pdf_files = []
    for dirpath, _, filenames in os.walk(root_dir):
        for f in filenames:
            if f.lower().endswith('.pdf') and f != 'manual2020.pdf' and 'node_modules' not in dirpath:
                pdf_files.append(os.path.join(dirpath, f))
    return pdf_files

def main():
    root_dir = "."
    output_dir = "parsed_exams"
    os.makedirs(output_dir, exist_ok=True)
    
    pdfs = get_all_pdfs(root_dir)
    print(f"Found {len(pdfs)} PDF files to process.")
    
    processed_count = 0
    failed_count = 0
    
    for pdf_path in pdfs:
        filename = os.path.basename(pdf_path)
        output_json = os.path.join(output_dir, f"{filename}.json")
        
        # Skip if already processed successfully
        if os.path.exists(output_json):
            print(f"Skipping {filename} - already processed.")
            continue
            
        print(f"\n--- Processing {filename} ---")
        text = extract_text_from_pdf(pdf_path)
        if not text.strip():
            print(f"Warning: No text found in {filename}")
            continue
            
        max_retries = 5
        retry_count = 0
        
        while retry_count < max_retries:
            try:
                print(f"Extracted {len(text)} characters. Calling API... (Attempt {retry_count + 1})")
                time.sleep(15) # Wait before hitting API
                
                exam_bank = categorize_exam_questions(text, filename)
                
                with open(output_json, "w", encoding="utf-8") as f:
                    json.dump(exam_bank.model_dump(), f, ensure_ascii=False, indent=2)
                    
                print(f"Successfully processed and saved {filename}")
                print(f"Importing {filename} into database...")
                import_data(output_json)
                
                processed_count += 1
                break # Success, break the retry loop
                
            except Exception as e:
                print(f"Failed to process {filename}: {e}")
                retry_count += 1
                if retry_count >= max_retries:
                    print(f"Max retries reached for {filename}. Skipping.")
                    failed_count += 1
                    break
                print("Sleeping for 40 seconds before retrying due to error...")
                time.sleep(40)
            
    print(f"\n=== Batch Processing Complete ===")
    print(f"Processed successfully: {processed_count}")
    print(f"Failed: {failed_count}")

if __name__ == "__main__":
    main()
