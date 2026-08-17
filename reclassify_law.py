import os
import sys
import time
import sqlite3
from dotenv import load_dotenv

load_dotenv()

DB_PATH = "exam_bank.db"
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")
DELAY_BETWEEN = 2  # seconds between requests
WORKING_MODEL = "tencent/hy3:free"

SYSTEM_PROMPT = """คุณเป็นผู้เชี่ยวชาญด้านกฎหมายและจรรยาบรรณวิชาชีพทันตกรรม
หน้าที่ของคุณคือจัดหมวดหมู่ (Task) ของข้อสอบต่อไปนี้ให้อยู่ใน 1 ใน 4 หมวดที่กำหนดไว้เท่านั้น

4 หมวดที่อนุญาต:
- พ.ร.บ. วิชาชีพทันตกรรม พ.ศ. 2537
- จรรยาบรรณแห่งวิชาชีพทันตกรรม
- พ.ร.บ. สถานพยาบาล พ.ศ. 2541
- กฎหมายอื่นๆ ที่เกี่ยวข้อง"""

def build_prompt(q_text):
    return f"""อ่านข้อสอบต่อไปนี้และตัดสินว่าอยู่ในหมวดใดจาก 4 หมวดที่กำหนด

ข้อสอบ:
{q_text}

กรุณาตอบเฉพาะชื่อหมวด 1 ใน 4 หมวดนี้เท่านั้น ห้ามพิมพ์คำอธิบายเพิ่มเติม:
1. พ.ร.บ. วิชาชีพทันตกรรม พ.ศ. 2537
2. จรรยาบรรณแห่งวิชาชีพทันตกรรม
3. พ.ร.บ. สถานพยาบาล พ.ศ. 2541
4. กฎหมายอื่นๆ ที่เกี่ยวข้อง"""

def call_openrouter(prompt, retries=3):
    from openai import OpenAI
    client = OpenAI(base_url="https://openrouter.ai/api/v1", api_key=OPENROUTER_API_KEY)
    for attempt in range(retries):
        try:
            resp = client.chat.completions.create(
                model=WORKING_MODEL,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt},
                ],
                timeout=30,
            )
            return resp.choices[0].message.content.strip()
        except Exception as e:
            err = str(e)
            if "429" in err:
                wait = 15 * (attempt + 1)
                print(f"    ⏳ Rate limited, waiting {wait}s...")
                time.sleep(wait)
            else:
                raise
    return None

def clean_category(result_text):
    if not result_text: return None
    # match against the 4 categories
    valid_categories = [
        "พ.ร.บ. วิชาชีพทันตกรรม พ.ศ. 2537",
        "จรรยาบรรณแห่งวิชาชีพทันตกรรม",
        "พ.ร.บ. สถานพยาบาล พ.ศ. 2541",
        "กฎหมายอื่นๆ ที่เกี่ยวข้อง"
    ]
    for c in valid_categories:
        if c in result_text:
            return c
    return "กฎหมายอื่นๆ ที่เกี่ยวข้อง"  # fallback

def reclassify():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    cur.execute("SELECT id, question_text, stem, proposition FROM questions WHERE category = 'กฎหมายและจรรยาบรรณ'")
    questions = cur.fetchall()
    
    total = len(questions)
    print(f"📋 Found {total} law questions to re-categorize...")
    
    success = 0

    for i, (qid, q_text, stem, prop) in enumerate(questions, 1):
        full_q = ""
        if stem and stem.strip() and stem.strip() != (q_text or "").strip():
            full_q = f"{stem.strip()}\n{prop or q_text}"
        else:
            full_q = q_text or prop or ""
            
        print(f"[{i}/{total}] Q#{qid} -> {full_q[:50].replace(chr(10), ' ')}...")
        
        prompt = build_prompt(full_q)
        raw_result = call_openrouter(prompt)
        new_task = clean_category(raw_result)
        
        if new_task:
            cur.execute("UPDATE questions SET task = ? WHERE id = ?", (new_task, qid))
            conn.commit()
            print(f"    ✅ => {new_task}")
            success += 1
        else:
            print(f"    ❌ Failed")
            
        time.sleep(DELAY_BETWEEN)

    conn.close()
    print(f"\n🎉 Done! Successfully re-categorized {success}/{total} questions.")

if __name__ == "__main__":
    reclassify()
