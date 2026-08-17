# Pre-cache Answer Keys for Exam Bank
# =====================================
# Goal: ทำ background job สร้างเฉลยล่วงหน้าทุกข้อใน DB
# เพื่อให้ Exam Result แสดงผลได้ทันทีโดยไม่ต้องรอ AI
#
# Strategy:
# 1. ใช้ Gemini 2.0 Flash (Google API Key) เป็นหลัก
# 2. ถ้า quota หมด → fallback ไป OpenRouter
# 3. Smart-skip: ข้ามข้อที่มีเฉลยและ explanation ครบแล้ว
# 4. บันทึกลง DB ทันทีทุกข้อ (ไม่ต้องรอครบ batch)

import os
import sys
import json
import time
import re
import sqlite3
from dotenv import load_dotenv

load_dotenv()

DB_PATH = "exam_bank.db"
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")
DELAY_BETWEEN = 3  # seconds between requests
WORKING_MODEL = "tencent/hy3:free"  # only confirmed-working free model

SYSTEM_PROMPT = """คุณเป็นอาจารย์ทันตแพทย์ผู้เชี่ยวชาญระดับสูง
หน้าที่ของคุณคือวิเคราะห์ข้อสอบและให้เฉลยที่ถูกต้องพร้อมคำอธิบายเชิงลึกเป็นภาษาไทย
สำหรับข้อสอบ National License ทันตแพทย์ (NL) ของประเทศไทย ตามมาตรฐาน ศ.ป.ท."""


def build_prompt(q_text, choices_list, category, task):
    choices_block = "\n".join(f"{label}. {text}" for label, text in choices_list)
    return f"""วิเคราะห์ข้อสอบต่อไปนี้และระบุตัวเลือกที่ถูกต้องพร้อมเหตุผล

หมวดวิชา: {category}
บทบาทหน้าที่: {task}

คำถาม:
{q_text}

ตัวเลือก:
{choices_block}

ตอบในรูปแบบ JSON เท่านั้น:
{{
  "correct_answer": "label ของตัวเลือกที่ถูกต้อง (เช่น 1, 2, 3, ก, ข)",
  "core_principle": "อธิบายหลักการและเหตุผลทางวิชาการโดยละเอียด",
  "choice_explanations": {{
    "1": "เหตุผลที่ข้อนี้ถูกหรือผิด",
    "2": "เหตุผล..."
  }}
}}"""


def parse_json_response(text):
    """Extract JSON from LLM response."""
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1:
        try:
            return json.loads(text[start:end+1])
        except Exception:
            pass
    return None


def call_openrouter(prompt, retries=3):
    """Call OpenRouter with tencent/hy3:free (confirmed working)."""
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
                timeout=90,
            )
            return resp.choices[0].message.content
        except Exception as e:
            err = str(e)
            if "429" in err:
                wait = 30 * (attempt + 1)
                print(f"    ⏳ Rate limited, waiting {wait}s...")
                time.sleep(wait)
            else:
                raise
    return None


def generate_answer(prompt):
    """Generate answer via OpenRouter."""
    try:
        text = call_openrouter(prompt)
        if not text:
            return None
        result = parse_json_response(text)
        if result and result.get("correct_answer"):
            result["_source"] = "openrouter"
            return result
        # If JSON parse failed, try to extract answer from plain text
        print(f"    ⚠️  JSON parse failed, raw: {text[:80]}")
    except Exception as e:
        print(f"    ❌ Failed: {str(e)[:100]}")
    return None


def precache_answers():
    conn = sqlite3.connect(DB_PATH, timeout=30)
    conn.execute("PRAGMA journal_mode=WAL")
    cur = conn.cursor()

    # Find questions that need caching
    # Skip questions that already have both correct_answer AND explanation
    cur.execute("""
        SELECT q.id, q.question_text, q.stem, q.proposition,
               q.correct_answer, q.explanation, q.category, q.task
        FROM questions q
        WHERE q.explanation IS NULL OR q.explanation = ''
           OR q.correct_answer IS NULL OR q.correct_answer = ''
        ORDER BY q.id
    """)
    questions = cur.fetchall()

    total = len(questions)
    print(f"📋 Questions needing pre-cache: {total}")
    print(f"   (questions with full cache will be skipped)\n")

    # Count existing
    cur.execute("SELECT COUNT(*) FROM questions WHERE correct_answer IS NOT NULL AND correct_answer != '' AND explanation IS NOT NULL AND explanation != ''")
    already_done = cur.fetchone()[0]
    print(f"✅ Already cached: {already_done}")
    print(f"🔄 To process: {total}\n")

    success = 0
    failed = 0

    for i, (qid, q_text, stem, prop, existing_ans, existing_expl, category, task) in enumerate(questions, 1):
        # Build full question text
        full_q = ""
        if stem and stem.strip() and stem.strip() != (q_text or "").strip():
            full_q = f"[Case] {stem.strip()}\n\n[คำถาม] {prop or q_text}"
        else:
            full_q = q_text or prop or ""

        if not full_q.strip():
            print(f"[{i}/{total}] Q#{qid}: ⏭️  Empty question, skipping")
            continue

        # Get choices
        cur.execute("SELECT label, text FROM choices WHERE question_id=? ORDER BY label", (qid,))
        choices = cur.fetchall()

        if not choices:
            print(f"[{i}/{total}] Q#{qid}: ⏭️  No choices, skipping")
            continue

        print(f"[{i}/{total}] Q#{qid} [{category[:15]}]: {full_q[:50]}...")

        prompt = build_prompt(full_q, choices, category, task)

        result = generate_answer(prompt)

        if result:
            correct_ans = result.get("correct_answer", "").strip()
            # Build explanation JSON
            explanation_json = json.dumps({
                "core_principle": result.get("core_principle", ""),
                "choice_explanations": result.get("choice_explanations", {}),
            }, ensure_ascii=False)

            # Only update what's missing
            if existing_ans and existing_ans.strip():
                # Keep existing answer, only update explanation
                cur.execute(
                    "UPDATE questions SET explanation=? WHERE id=?",
                    (explanation_json, qid)
                )
            else:
                cur.execute(
                    "UPDATE questions SET correct_answer=?, explanation=? WHERE id=?",
                    (correct_ans, explanation_json, qid)
                )
            conn.commit()
            src = result.get("_source", "?")
            print(f"    ✅ Answer: {correct_ans} [{src}]")
            success += 1
        else:
            print(f"    ❌ Failed to generate")
            failed += 1

        # Delay between requests
        if i < total:
            time.sleep(DELAY_BETWEEN)

    conn.close()

    print(f"\n{'='*50}")
    print(f"🎯 Pre-caching complete!")
    print(f"   ✅ Success: {success}")
    print(f"   ❌ Failed:  {failed}")
    print(f"\n💡 Next: Restart the backend server to serve fresh cached answers")


if __name__ == "__main__":
    precache_answers()
