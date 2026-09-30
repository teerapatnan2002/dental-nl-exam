import json
import sqlite3
import os
from sqlalchemy import create_engine, text

with open('./scratch/dsat_mock_parsed.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

print(f"Loaded {len(questions)} questions from scratch/dsat_mock_parsed.json")

# -------------------------------------------------------------------------
# 1. Sync to SQLite
# -------------------------------------------------------------------------
sqlite_path = 'data/exam_bank.db'
conn = sqlite3.connect(sqlite_path)
c = conn.cursor()

# Disable triggers if needed
c.execute("DROP TRIGGER IF EXISTS questions_fts_au")
c.execute("DROP TRIGGER IF EXISTS questions_fts_ad")
c.execute("DROP TRIGGER IF EXISTS questions_fts_ai")

# Clear existing questions in ID range 2400-2489 to ensure clean idempotent insert
c.execute("DELETE FROM choices WHERE question_id BETWEEN 2400 AND 2489")
c.execute("DELETE FROM questions WHERE id BETWEEN 2400 AND 2489")

choice_id_max = c.execute("SELECT coalesce(max(id), 0) FROM choices").fetchone()[0]
cur_choice_id = choice_id_max + 1

for q in questions:
    c.execute("""
        INSERT INTO questions (id, question_text, correct_answer, category, task, explanation, source_exam, stem, proposition)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        q['id'],
        q['question_text'],
        q['correct_answer'],
        q['category'],
        q['task'],
        q['explanation'],
        q['source_exam'],
        q['stem'],
        q['proposition']
    ))
    
    for ch in q['choices']:
        c.execute("""
            INSERT INTO choices (id, question_id, label, text)
            VALUES (?, ?, ?, ?)
        """, (
            cur_choice_id,
            q['id'],
            ch['label'],
            ch['text']
        ))
        cur_choice_id += 1

conn.commit()
conn.close()
print("✓ 1. SQLite sync completed successfully.")

# -------------------------------------------------------------------------
# 2. Sync to Supabase PostgreSQL
# -------------------------------------------------------------------------
supabase_url = "postgresql+psycopg://postgres.fgexylhuyaaedmtnplra:HuBAfgLaZ5IGeqpm@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require"
engine = create_engine(supabase_url)

with engine.begin() as s_conn:
    # Clear range
    s_conn.execute(text("DELETE FROM choices WHERE question_id BETWEEN 2400 AND 2489"))
    s_conn.execute(text("DELETE FROM questions WHERE id BETWEEN 2400 AND 2489"))
    
    # Get max choice id
    r = s_conn.execute(text("SELECT coalesce(max(id), 0) FROM choices")).scalar()
    s_cur_choice_id = r + 1
    
    for q in questions:
        s_conn.execute(text("""
            INSERT INTO questions (id, question_text, correct_answer, category, task, explanation, source_exam, stem, proposition)
            VALUES (:id, :question_text, :correct_answer, :category, :task, :explanation, :source_exam, :stem, :proposition)
        """), {
            'id': q['id'],
            'question_text': q['question_text'],
            'correct_answer': q['correct_answer'],
            'category': q['category'],
            'task': q['task'],
            'explanation': q['explanation'],
            'source_exam': q['source_exam'],
            'stem': q['stem'],
            'proposition': q['proposition']
        })
        
        for ch in q['choices']:
            s_conn.execute(text("""
                INSERT INTO choices (id, question_id, label, text)
                VALUES (:id, :question_id, :label, :text)
            """), {
                'id': s_cur_choice_id,
                'question_id': q['id'],
                'label': ch['label'],
                'text': ch['text']
            })
            s_cur_choice_id += 1

print("✓ 2. Supabase PostgreSQL sync completed successfully.")

# -------------------------------------------------------------------------
# 3. Generate Obsidian Vault Markdown Notes
# -------------------------------------------------------------------------
os.makedirs("Obsidian_NL_Exam", exist_ok=True)
os.makedirs("Obsidian_NL_Exam/Law_Knowledge", exist_ok=True)

for q in questions:
    exp_obj = json.loads(q['explanation'])
    md_filename = f"Obsidian_NL_Exam/Q{q['id']}_กฎหมายและจรรยาบรรณ.md"
    
    choice_lines = []
    for ch in q['choices']:
        is_c = (ch['label'] == q['correct_answer'])
        icon = "✅" if is_c else "❌"
        choice_lines.append(f"- {icon} **{ch['label']}**: {ch['text']}")
        
    md_content = f"""---
tags:
  - กฎหมายและจรรยาบรรณ
  - นิติทันตวิทยา
  - DSAT_Mock_Exam
  - {q['source_exam'].replace(' ', '_')}
id: {q['id']}
set: {q['set_num']}
qnum: {q['qnum']}
cognitive_level: {exp_obj.get('cognitive_level', '')}
tos_code: "{exp_obj.get('tos_code', '')}"
---
# คำถามที่ {q['id']} ({q['source_exam']} ข้อ {q['qnum']})

**สถานการณ์ (STEM):**
{q['stem']}

**คำถาม (Proposition):**
{q['proposition']}

## ตัวเลือก
{chr(10).join(choice_lines)}

## เฉลยละเอียดและหลักกฎหมาย (Explanation)

**เฉลยที่ถูกต้อง:** **{q['correct_answer']}** ({exp_obj.get('key_takeaway', '')})
**ระดับการประเมิน (Level):** {exp_obj.get('cognitive_level', '')}
**มาตรฐาน TOS:** {exp_obj.get('tos_code', '')}

### 1. เหตุผลและหลักการสำคัญ (Core Principle)
{exp_obj.get('core_principle', '')}

### 2. บทกฎหมาย/เกณฑ์มาตรฐานอ้างอิง (Legal Reference)
📌 {exp_obj.get('legal_citation', '')}

```json
{json.dumps(exp_obj, ensure_ascii=False, indent=2)}
```
"""
    with open(md_filename, "w", encoding="utf-8") as f:
        f.write(md_content.strip() + "\n")

# Master Index Notes
for s_num, s_title in [(1, "DSAT Mock Law ชุดที่ 1"), (2, "DSAT Mock Law ชุดที่ 2"), (3, "DSAT Mock Law ชุดที่ 3")]:
    set_qs = [q for q in questions if q['set_num'] == s_num]
    m_filename = f"Obsidian_NL_Exam/Law_Knowledge/{s_title}.md"
    table_rows = []
    for q in set_qs:
        exp_obj = json.loads(q['explanation'])
        table_rows.append(f"| [[Q{q['id']}_กฎหมายและจรรยาบรรณ\|ข้อ {q['qnum']} (ID {q['id']})]] | {q['proposition'][:45]}... | **{q['correct_answer']}** | {exp_obj.get('cognitive_level')} | {exp_obj.get('tos_code', '')[:30]} |")
        
    m_content = f"""# {s_title} (สนทท. / DSAT)

ข้อสอบจำลองความรู้ผู้ประกอบวิชาชีพทันตกรรม (NL) วิชาเฉพาะ: **กฎหมายและจรรยาบรรณวิชาชีพทันตกรรม + นิติทันตวิทยา**
จัดทำโดย: **สมาพันธ์นิสิตนักศึกษาทันตแพทย์แห่งประเทศไทย (สนทท. / DSAT)**
จำนวน: 30 ข้อ (10 STEMs) · เวลาสอบ: 60 นาที

| ข้อ | สาระสำคัญคำถาม | เฉลย | ระดับ (Level) | TOS Blueprint |
| :--- | :--- | :---: | :---: | :--- |
{chr(10).join(table_rows)}
"""
    with open(m_filename, "w", encoding="utf-8") as f:
        f.write(m_content.strip() + "\n")

print("✓ 3. Obsidian Vault sync completed (90 question files + 3 master index files).")
