import os
import requests

# Set the base directory for Obsidian
BASE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "Obsidian_NL_Exam")
IMAGES_DIR = os.path.join(BASE_DIR, "Images")

# Ensure Images directory exists
os.makedirs(IMAGES_DIR, exist_ok=True)

# List of terms to fetch images for
SEARCH_TERMS = [
    ("Ameloblastoma histology", "Ameloblastoma.jpg"),
    ("Odontogenic keratocyst histology", "OKC.jpg"),
    ("Dentigerous cyst histology", "Dentigerous_Cyst.jpg"),
    ("Pemphigus vulgaris histology", "Pemphigus_Vulgaris.jpg"),
    ("Mucous membrane pemphigoid histology", "MMP.jpg"),
    ("Recurrent aphthous stomatitis", "Aphthous_Ulcer.jpg")
]

def fetch_wikipedia_image(query, filename):
    """Searches Wikipedia for a query and downloads the first image found."""
    print(f"Searching Wikipedia for: {query}...")
    
    # 1. Search for the page
    search_url = f"https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch={query}&utf8=&format=json"
    response = requests.get(search_url, headers={"User-Agent": "NLDentalBot/1.0 (test@example.com)"})
    data = response.json()
    
    if not data['query']['search']:
        print(f"  ❌ No Wikipedia page found for '{query}'.")
        return None
        
    page_title = data['query']['search'][0]['title']
    print(f"  Found page: {page_title}")
    
    # 2. Get images from the page
    images_url = f"https://en.wikipedia.org/w/api.php?action=query&titles={page_title}&prop=images&format=json"
    res = requests.get(images_url, headers={"User-Agent": "NLDentalBot/1.0 (test@example.com)"})
    pages = res.json()['query']['pages']
    page_id = list(pages.keys())[0]
    
    if 'images' not in pages[page_id]:
        print(f"  ❌ No images found on page '{page_title}'.")
        return None
        
    # Filter out icons and svg
    valid_images = [img['title'] for img in pages[page_id]['images'] if not img['title'].lower().endswith(('.svg', '.png', 'icon'))]
    
    if not valid_images:
        valid_images = [img['title'] for img in pages[page_id]['images']]
        
    if not valid_images:
         print(f"  ❌ No valid images found.")
         return None
         
    target_image_title = valid_images[0]
    
    # 3. Get image URL
    imageinfo_url = f"https://en.wikipedia.org/w/api.php?action=query&titles={target_image_title}&prop=imageinfo&iiprop=url&format=json"
    res = requests.get(imageinfo_url, headers={"User-Agent": "NLDentalBot/1.0 (test@example.com)"})
    image_pages = res.json()['query']['pages']
    img_page_id = list(image_pages.keys())[0]
    
    try:
        image_url = image_pages[img_page_id]['imageinfo'][0]['url']
    except KeyError:
        print(f"  ❌ Could not extract URL for {target_image_title}")
        return None
        
    # 4. Download Image
    print(f"  Downloading image from: {image_url}")
    img_data = requests.get(image_url, headers={"User-Agent": "NLDentalBot/1.0 (test@example.com)"}).content
    filepath = os.path.join(IMAGES_DIR, filename)
    
    with open(filepath, 'wb') as handler:
        handler.write(img_data)
        
    print(f"  ✅ Saved to {filepath}")
    return f"![{query}](Images/{filename})"

def append_to_markdown(markdown_file, image_markdown):
    """Appends the markdown image link to the specified file."""
    filepath = os.path.join(BASE_DIR, markdown_file)
    if os.path.exists(filepath):
        with open(filepath, 'a', encoding='utf-8') as f:
            f.write(f"\n\n{image_markdown}\n")
        print(f"  ✅ Appended image markdown to {markdown_file}")
    else:
        print(f"  ⚠️ Warning: {markdown_file} does not exist.")

if __name__ == "__main__":
    print("Starting Wikipedia Image Fetcher...")
    
    # Fetch for Oral Mucosal Lesions
    pemphigus_md = fetch_wikipedia_image("Pemphigus vulgaris histology", "Pemphigus_Vulgaris.jpg")
    if pemphigus_md: append_to_markdown("Differential_Diagnosis/Oral_Mucosal_Lesions.md", pemphigus_md)
    
    aphthous_md = fetch_wikipedia_image("Aphthous stomatitis", "Aphthous_Ulcer.jpg")
    if aphthous_md: append_to_markdown("Differential_Diagnosis/Oral_Mucosal_Lesions.md", aphthous_md)

    # Fetch for Cysts and Tumors
    ameloblastoma_md = fetch_wikipedia_image("Ameloblastoma histology", "Ameloblastoma.jpg")
    if ameloblastoma_md: append_to_markdown("Differential_Diagnosis/Cysts_and_Tumors.md", ameloblastoma_md)
    
    dentigerous_md = fetch_wikipedia_image("Dentigerous cyst", "Dentigerous_Cyst.jpg")
    if dentigerous_md: append_to_markdown("Differential_Diagnosis/Cysts_and_Tumors.md", dentigerous_md)
    
    print("\nProcess Completed. Check Obsidian_NL_Exam/Images directory.")
