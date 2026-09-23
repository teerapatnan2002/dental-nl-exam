import sqlite3
import re
import os
from sqlalchemy import create_engine, text

# ══════════════════════════════════════════════════════════════
# NL Law 2565 (IDs 2252 to 2281) Audit & Fix Script
# ══════════════════════════════════════════════════════════════

def update_sqlite():
    print("--- Updating SQLite for Year 2565 (IDs 2252-2281) ---")
    conn = sqlite3.connect('data/exam_bank.db')
    c = conn.cursor()

    # Drop triggers & FTS
    c.execute("DROP TRIGGER IF EXISTS questions_fts_ai")
    c.execute("DROP TRIGGER IF EXISTS questions_fts_ad")
    c.execute("DROP TRIGGER IF EXISTS questions_fts_au")
    c.execute("DROP TABLE IF EXISTS questions_fts")

    # Q2274 fix extra อ
    c.execute("""
        UPDATE questions 
        SET proposition = REPLACE(proposition, 'ขออนุญาตอเปิด', 'ขออนุญาตเปิด')
        WHERE id = 2274
    """)

    # Q2279, 2280, 2281 fix นำย -> นาย
    for qid in [2279, 2280, 2281]:
        c.execute("""
            UPDATE questions 
            SET stem = REPLACE(stem, 'นำย', 'นาย'),
                proposition = REPLACE(proposition, 'นำย', 'นาย'),
                question_text = REPLACE(question_text, 'นำย', 'นาย')
            WHERE id = ?
        """, (qid,))
        print(f"Updated SQLite Question {qid} text/stem (นำย -> นาย)")

    # Q2281: Remove artificial Choice E
    c.execute("DELETE FROM choices WHERE question_id = 2281 AND label IN ('E', '5')")
    print("Deleted artificial Choice E from Q2281 in SQLite")

    # Rebuild FTS5
    c.execute("CREATE VIRTUAL TABLE questions_fts USING fts5(question_text, stem, proposition, category, task)")
    c.execute("""
        INSERT INTO questions_fts(rowid, question_text, stem, proposition, category, task)
        SELECT id, question_text, stem, proposition, category, task FROM questions
    """)

    # Recreate Triggers
    c.execute("""
        CREATE TRIGGER questions_fts_ai AFTER INSERT ON questions BEGIN
            INSERT INTO questions_fts(rowid, question_text, stem, proposition, category, task)
            VALUES (new.id, new.question_text, IFNULL(new.stem,''), IFNULL(new.proposition,''), new.category, new.task);
        END
    """)
    c.execute("""
        CREATE TRIGGER questions_fts_ad AFTER DELETE ON questions BEGIN
            INSERT INTO questions_fts(questions_fts, rowid, question_text, stem, proposition, category, task)
            VALUES ('delete', old.id, old.question_text, IFNULL(old.stem,''), IFNULL(old.proposition,''), old.category, old.task);
        END
    """)
    c.execute("""
        CREATE TRIGGER questions_fts_au AFTER UPDATE ON questions BEGIN
            INSERT INTO questions_fts(questions_fts, rowid, question_text, stem, proposition, category, task)
            VALUES ('delete', old.id, old.question_text, IFNULL(old.stem,''), IFNULL(old.proposition,''), old.category, old.task);
            INSERT INTO questions_fts(rowid, question_text, stem, proposition, category, task)
            VALUES (new.id, new.question_text, IFNULL(new.stem,''), IFNULL(new.proposition,''), new.category, new.task);
        END
    """)
    conn.commit()
    conn.close()
    print("SQLite & FTS5 updated successfully for Year 2565!\n")

def update_supabase():
    print("--- Updating Supabase PostgreSQL for Year 2565 ---")
    url = "postgresql://postgres.fgexylhuyaaedmtnplra:HuBAfgLaZ5IGeqpm@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require"
    engine = create_engine(url, pool_pre_ping=True)

    conn_sq = sqlite3.connect('data/exam_bank.db')
    c_sq = conn_sq.cursor()

    with engine.begin() as conn:
        for qid in range(2252, 2282):
            c_sq.execute("SELECT stem, proposition, question_text FROM questions WHERE id = ?", (qid,))
            stem, prop, qt = c_sq.fetchone()
            conn.execute(text("""
                UPDATE questions 
                SET stem = :stem, proposition = :prop, question_text = :qt 
                WHERE id = :id
            """), {
                "stem": stem,
                "prop": prop,
                "qt": qt,
                "id": qid
            })

            # Sync choices
            c_sq.execute("SELECT label, text FROM choices WHERE question_id = ? ORDER BY label", (qid,))
            sq_choices = c_sq.fetchall()
            for lbl, txt in sq_choices:
                conn.execute(text("""
                    UPDATE choices 
                    SET text = :txt 
                    WHERE question_id = :qid AND label = :lbl
                """), {"txt": txt, "qid": qid, "lbl": lbl})

        # Remove Choice E from Q2281 in Supabase
        conn.execute(text("DELETE FROM choices WHERE question_id = 2281 AND label IN ('E', '5')"))
        print("Deleted artificial Choice E from Q2281 in Supabase")

    conn_sq.close()
    print("Supabase updated successfully for Year 2565!\n")

def clean_obsidian_markdown():
    path = "Obsidian_NL_Exam/Law_Knowledge/NL2 กฏหมายรอบแรก.md"
    print(f"--- Cleaning {path} ---")
    if not os.path.exists(path):
        print(f"File {path} not found!")
        return

    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Systematic fixes for broken Sara Am and OCR artifacts
    # 1. Broken Sara Am inside words: e.g. ด าเนิน -> ดำเนิน, ส าหรับ -> สำหรับ
    content = re.sub(r'([กดขคงจชซตทธนบปผฝพฟมยรลวศษสหฬอฮ])\s+า', r'\1ำ', content)
    # 2. Broken Mai Tho + Sara Aa: น ้า -> น้ำ
    content = re.sub(r'น\s+้า', 'น้ำ', content)
    # 3. นำย -> นาย, นำง -> นาง
    content = content.replace('นำย', 'นาย')
    content = content.replace('นำง', 'นาง')
    # 4. Specific known typos
    content = content.replace('ทันตแพทสภา', 'ทันตแพทยสภา')
    content = content.replace('ขออนุญาตอเปิด', 'ขออนุญาตเปิด')
    content = content.replace('cademic affair', 'Academic affair')

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Obsidian markdown file 2565 cleaned and saved successfully!\n")

    # Also clean Obsidian note for Q2281
    q2281_path = "Obsidian_NL_Exam/Q2281_กฎหมายและจรรยาบรรณ.md"
    if os.path.exists(q2281_path):
        print(f"--- Cleaning {q2281_path} ---")
        with open(q2281_path, "r", encoding="utf-8") as f:
            q_content = f.read()
        # Remove line `- ❌ **E**: `
        q_content = re.sub(r'- ❌ \*\*E\*\*:.*?\n', '', q_content)
        # Remove `- **E**: ไม่มีตัวเลือก E ในข้อสอบนี้`
        q_content = re.sub(r'- \*\*E\*\*:.*?\n', '', q_content)
        with open(q2281_path, "w", encoding="utf-8") as f:
            f.write(q_content)
        print("Obsidian note Q2281 cleaned successfully!\n")

if __name__ == '__main__':
    update_sqlite()
    update_supabase()
    clean_obsidian_markdown()
    print("ALL 30 QUESTIONS OF NL LAW 2565 AUDITED AND SYNCHRONIZED!")
