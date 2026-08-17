import fitz  # PyMuPDF
import os

pdf_files = [
    "NL 2 2566 part 1.pdf",
    "NL 2 2566 part 2.pdf",
    "NL 2 2566 part 3.pdf",
    "NL 2 2566 part 4.pdf"
]

base_dir = "NL2Test2023"
output_base_dir = "frontend/public/images"

def extract_images():
    for pdf_file in pdf_files:
        part_name = pdf_file.split("part ")[1].split(".pdf")[0]
        output_dir = os.path.join(output_base_dir, f"2566_part{part_name}")
        os.makedirs(output_dir, exist_ok=True)
        
        pdf_path = os.path.join(base_dir, pdf_file)
        if not os.path.exists(pdf_path):
            print(f"Skipping {pdf_file}: File not found")
            continue
            
        doc = fitz.open(pdf_path)
        print(f"\nProcessing {pdf_file}...")
        
        total_images_extracted = 0
        for page_index in range(len(doc)):
            page = doc[page_index]
            images = page.get_images(full=True)
            
            if images:
                for img_index, img in enumerate(images):
                    xref = img[0]
                    base_image = doc.extract_image(xref)
                    image_bytes = base_image["image"]
                    image_ext = base_image["ext"]
                    
                    # Some PDFs use masks or background images, let's filter out very small images
                    # which are usually icons or noise. We'll check width/height.
                    width = base_image["width"]
                    height = base_image["height"]
                    if width < 50 or height < 50:
                        continue # Skip tiny icon-like images
                        
                    image_filename = f"page{page_index + 1}_img{img_index + 1}.{image_ext}"
                    image_path = os.path.join(output_dir, image_filename)
                    
                    with open(image_path, "wb") as f:
                        f.write(image_bytes)
                    total_images_extracted += 1
                    print(f"  Saved {image_filename} (Size: {width}x{height})")
                    
        print(f"Total extracted for Part {part_name}: {total_images_extracted} images")

if __name__ == "__main__":
    extract_images()
