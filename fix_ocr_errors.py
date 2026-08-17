"""
fix_ocr_errors.py
------------------
Automatically detect and fix OCR encoding artifacts in exam_bank.db.

OCR Problem: Thai characters were mis-encoded and garbled Latin chars
appear embedded in Thai text, e.g.:
  กลุLมเด็ก  →  กลุ่มเด็ก   (L = ่ combining above)
  ตOอง       →  ต้อง        (O = ้ sara above)
  ปUอง       →  ป้อง        (U = ้)
  ฟZน        →  ฟัน         (Z = ั sara a)
  ผูO        →  ผู้          (O = ้)
  ปbด        →  ปิด         (b = ิ sara i)
  เปCน       →  เป็น        (C = ็ mai taikhu)
  ป^วย       →  ป่วย        (^ = ่ mai ek)

Strategy:
1. Detect garbled patterns: ASCII chars flanked by Thai chars
2. Use Gemini AI to clean each corrupted text chunk — ask it to
   return natural Thai with corrected tone marks
3. Apply corrections back to DB (questions + choices)
"""

import sqlite3
import os
import re
import time
import json
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

# ── Config ────────────────────────────────────────────
DB_PATH   = "data/exam_bank.db"
BATCH_SIZE = 10          # questions per API call
DRY_RUN   = False        # set True to preview without writing

# Known single-char substitutions we're confident about
# Pattern: (regex, replacement)  — applied BEFORE AI cleaning
CONFIDENT_SUBS = [
    # "กลุLม" → "กลุ่ม"  L = mai ek ่
    (r'(?<=[\u0E00-\u0E7F])L(?=[\u0E00-\u0E7F])', '่'),
    # "ตOอง" → "ต้อง"   O = mai tho ้
    (r'(?<=[\u0E00-\u0E7F])O(?=[\u0E00-\u0E7F])', '้'),
    # "ปUอง" → "ป้อง"   U = mai tho ้  
    (r'(?<=[\u0E00-\u0E7F])U(?=[\u0E00-\u0E7F])', '้'),
    # "ฟZน" → "ฟัน"    Z = sara a ั
    (r'(?<=[\u0E00-\u0E7F])Z(?=[\u0E00-\u0E7F])', 'ั'),
    # "ป^วย" → "ป่วย"  ^ = mai ek ่
    (r'(?<=[\u0E00-\u0E7F])\^(?=[\u0E00-\u0E7F])', '่'),
    # "เปCน" → "เป็น"  C between Thai = mai taikhu ็
    (r'(?<=[\u0E00-\u0E7F])C(?=[\u0E00-\u0E7F])', '็'),
    # "ปbด" → "ปิด"   b = sara i ิ
    (r'(?<=[\u0E00-\u0E7F])b(?=[\u0E00-\u0E7F])', 'ิ'),
    # "ใĀ้" → "ให้", "เĀ็น" -> "เห็น" (Ā = ห)
    (r'Ā', 'ห'),
    # "cys…" -> "cyst"
    (r'cys…', 'cyst'),
]

# ── Helpers ───────────────────────────────────────────
def apply_confident_subs(text: str) -> str:
    if not text:
        return text
    for pattern, repl in CONFIDENT_SUBS:
        text = re.sub(pattern, repl, text)
    return text

def has_ocr_artifact(text: str) -> bool:
    """Return True if text contains ASCII chars flanked by Thai chars."""
    if not text:
        return False
    return bool(re.search(
        r'[\u0E00-\u0E7F][A-Za-zĀ][\u0E00-\u0E7F]|[\u0E00-\u0E7F][A-Za-zĀ]$|^[A-Za-zĀ][\u0E00-\u0E7F]|Ā|cys…',
        text
    ))

# ── Database helpers ──────────────────────────────────
def fetch_corrupted_questions(conn):
    cur = conn.cursor()
    cur.execute("""
        SELECT id, question_text, stem, proposition
        FROM questions
        WHERE question_text IS NOT NULL
    """)
    rows = cur.fetchall()
    corrupted = []
    for row in rows:
        id_, qt, stem, prop = row
        if has_ocr_artifact(qt) or has_ocr_artifact(stem) or has_ocr_artifact(prop):
            corrupted.append(row)
    return corrupted


def fetch_corrupted_choices(conn):
    cur = conn.cursor()
    cur.execute("SELECT id, text FROM choices WHERE text IS NOT NULL")
    rows = cur.fetchall()
    return [(id_, text) for id_, text in rows if has_ocr_artifact(text)]


# ── Main fix logic ────────────────────────────────────
def fix_all():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    print("🔍 Scanning for OCR errors...")
    corrupted_q = fetch_corrupted_questions(conn)
    corrupted_c = fetch_corrupted_choices(conn)
    print(f"  Found {len(corrupted_q)} corrupted questions")
    print(f"  Found {len(corrupted_c)} corrupted choices")
    print(f"\n🔧 Applying confident substitutions first...")

    # Step 1: Apply confident single-char subs directly
    q_fixed = 0
    for id_, qt, stem, prop in corrupted_q:
        new_qt   = apply_confident_subs(qt)
        new_stem = apply_confident_subs(stem)
        new_prop = apply_confident_subs(prop)
        if (new_qt, new_stem, new_prop) != (qt, stem, prop):
            if not DRY_RUN:
                cur.execute(
                    "UPDATE questions SET question_text=?, stem=?, proposition=? WHERE id=?",
                    (new_qt, new_stem, new_prop, id_)
                )
            q_fixed += 1

    c_fixed = 0
    for id_, text in corrupted_c:
        new_text = apply_confident_subs(text)
        if new_text != text:
            if not DRY_RUN:
                cur.execute("UPDATE choices SET text=? WHERE id=?", (new_text, id_))
            c_fixed += 1

    if not DRY_RUN:
        conn.commit()
    print(f"  ✅ Fixed {q_fixed} questions, {c_fixed} choices via pattern substitution")

    # Step 2: Re-scan for remaining artifacts
    corrupted_q2 = fetch_corrupted_questions(conn)
    corrupted_c2 = fetch_corrupted_choices(conn)
    remaining = len(corrupted_q2) + len(corrupted_c2)
    print(f"\n📊 Remaining after pattern fixes: {remaining} items")

    if remaining > 0:
        print("\n🤖 Using Gemini AI to fix remaining ambiguous OCR errors...")
        fix_with_ai(conn, cur, corrupted_q2, corrupted_c2)

    conn.close()
    print("\n✅ All done! Run build_knowledge_base.py to rebuild FAISS index.")


def fix_with_ai(conn, cur, questions, choices):
    """Use Gemini to clean remaining corrupted texts."""
    genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
    model = genai.GenerativeModel("gemini-2.0-flash")

    SYSTEM = """คุณเป็น AI ผู้เชี่ยวชาญด้านภาษาไทย งานของคุณคือแก้ไขข้อความภาษาไทยที่มีข้อผิดพลาดจากการ OCR PDF

ปัญหา: ตัวอักษร ASCII แปลกๆ แทรกอยู่ในข้อความภาษาไทย เช่น:
- "กลุLม" → "กลุ่ม" (L แทน วรรณยุกต์ ่)
- "ตOอง" → "ต้อง" (O แทน ้)
- "ฟZน" → "ฟัน" (Z แทน ั)
- "เปCน" → "เป็น" (C แทน ็)

กฎ:
1. แก้ไขเฉพาะคำที่มีปัญหา OCR เท่านั้น อย่าเปลี่ยนเนื้อหา
2. คำศัพท์อังกฤษทางทันตแพทย์ (DMFT, NL, HbA1c, etc.) ให้คงไว้
3. ตัวเลขและสัญลักษณ์ทางการแพทย์คงไว้
4. ตอบกลับเป็น JSON เท่านั้น ตามรูปแบบที่กำหนด"""

    # Process questions in batches
    all_items = [("q", id_, qt, stem, prop) for id_, qt, stem, prop in questions]
    all_items += [("c", id_, text, None, None) for id_, text in choices]

    batch = []
    total_fixed = 0

    for i, item in enumerate(all_items):
        batch.append(item)
        if len(batch) >= BATCH_SIZE or i == len(all_items) - 1:
            # Build prompt
            entries = []
            for j, it in enumerate(batch):
                if it[0] == "q":
                    entries.append(f'{j}: question_text="{it[2]}"')
                    if it[3]: entries.append(f'{j}s: stem="{it[3]}"')
                else:
                    entries.append(f'{j}: choice="{it[2]}"')

            prompt = f"""แก้ไข OCR errors ในข้อความต่อไปนี้:

{chr(10).join(entries)}

ตอบกลับในรูปแบบ JSON:
{{
  "0": "ข้อความที่แก้ไขแล้ว",
  "0s": "stem ที่แก้ไขแล้ว",
  "1": "...",
  ...
}}

สำคัญ: ตอบเฉพาะ JSON เท่านั้น ไม่มีข้อความอื่น"""

            retries = 3
            for attempt in range(retries):
                try:
                    resp = model.generate_content(f"{SYSTEM}\n\n{prompt}")
                    raw = resp.text.strip()
                    # Extract JSON
                    json_match = re.search(r'\{.*\}', raw, re.DOTALL)
                    if json_match:
                        fixes = json.loads(json_match.group())
                        # Apply fixes
                        for j, it in enumerate(batch):
                            key = str(j)
                            if key in fixes and fixes[key] and not DRY_RUN:
                                if it[0] == "q":
                                    new_qt = fixes.get(key, it[2])
                                    new_stem = fixes.get(f"{key}s", it[3])
                                    cur.execute(
                                        "UPDATE questions SET question_text=?, stem=? WHERE id=?",
                                        (new_qt, new_stem, it[1])
                                    )
                                else:
                                    cur.execute(
                                        "UPDATE choices SET text=? WHERE id=?",
                                        (fixes[key], it[1])
                                    )
                            total_fixed += 1
                        conn.commit()
                        print(f"  ✅ Batch {i//BATCH_SIZE + 1}: fixed {len(batch)} items")
                    break
                except Exception as e:
                    if "429" in str(e) and attempt < retries - 1:
                        wait = 60 * (attempt + 1)
                        print(f"  ⏳ Rate limited, waiting {wait}s...")
                        time.sleep(wait)
                    else:
                        print(f"  ⚠️  Batch failed: {e}")
                        break

            batch = []
            time.sleep(2)  # Be polite to API

    print(f"\n🤖 AI fixed {total_fixed} additional items")


if __name__ == "__main__":
    fix_all()
