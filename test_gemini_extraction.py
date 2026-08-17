import os
import sys
import fitz
import json
import base64
from openai import OpenAI
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key=os.environ.get("OPENROUTER_API_KEY"),
)

def process_page(pdf_path, page_num):
    doc = fitz.open(pdf_path)
    page = doc[page_num]
    
    # 1. Render page to image
    pix = page.get_pixmap(dpi=150)
    img_bytes = pix.tobytes("png")
    base64_image = base64.b64encode(img_bytes).decode('utf-8')
    
    # 3. Get images on this page to provide as context
    images_on_page = page.get_images(full=True)
    
    sys_prompt = """
You are an expert OCR and Thai dental exam transcriber.
You must accurately transcribe all the exam questions and their choices into a structured JSON format.
The JSON must follow this exact schema:
{
  "questions": [
    {
      "id": "1",
      "question_text": "text",
      "stem": "text or null",
      "choices": [{"text": "choice 1"}, {"text": "choice 2"}]
    }
  ]
}

Guidelines:
- Spelling is critical. Thai vowels and tone marks must be grammatically correct. Do NOT shift tone marks to the final consonant (e.g. write ส่ง, not สง่).
- 'id' should be the original question number (e.g. "12").
- 'stem' should contain any introductory clinical scenario that applies to the question. If the question shares a STEM, duplicate the stem string for each question.
- 'question_text' should contain the actual question being asked.
- Combine choices into the 'choices' list as objects with a 'text' key.
"""

    prompt = f"""
There are {len(images_on_page)} clinical images on this page. 
Whenever you see a clinical image that belongs to a STEM or a question, insert an image placeholder exactly like this: `[IMAGE_N]` where N is the image number (from 1 to {len(images_on_page)}, top to bottom).
Please transcribe this page.
"""

    response = client.chat.completions.create(
      model="google/gemini-2.0-flash-lite-preview-02-05:free",
      messages=[
        {
          "role": "system",
          "content": sys_prompt
        },
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": prompt
            },
            {
              "type": "image_url",
              "image_url": {
                "url": f"data:image/png;base64,{base64_image}"
              }
            }
          ]
        }
      ],
      response_format={"type": "json_object"},
      temperature=0.0
    )
    
    print(response.choices[0].message.content)

if __name__ == "__main__":
    process_page("NL2Test2023/NL 2 2566 part 1.pdf", 8) # Page 8 (0-indexed 8 is 9th page)
