import sqlite3
import re
import os
from sqlalchemy import create_engine, text

# ══════════════════════════════════════════════════════════════
# NL Law 2568 (IDs 2315 to 2344) Audit & Fix Script
# ══════════════════════════════════════════════════════════════

def clean_text(s):
    if not s:
        return s
    replacements = [
        ('มีนำคม', 'มีนาคม'),
        ('ประสานงานักบโรงพยาบาล', 'ประสานงานกับโรงพยาบาล'),
        ('เปิดคลินิค', 'เปิดคลินิก'),
        ('คลินิค', 'คลินิก'),
        ('ปฎิบัติ', 'ปฏิบัติ'),
        ('โซเชี่ยล', 'โซเชียล'),
        ('ประนาม', 'ประณาม'),
        ('ควมคุม', 'ควบคุม'),
        ('พรบ.วิชาชีพทันตกรรม', 'พ.ร.บ. วิชาชีพทันตกรรม'),
        ('พรบ.สถานพยาบาล', 'พ.ร.บ. สถานพยาบาล'),
        ('พรบวิชาชีพ', 'พ.ร.บ. วิชาชีพ'),
    ]
    for old, new in replacements:
        s = s.replace(old, new)
    return s

def update_sqlite():
    print("--- Updating SQLite for Year 2568 (IDs 2315-2344) ---")
    conn = sqlite3.connect('data/exam_bank.db')
    c = conn.cursor()

    # Drop triggers & FTS
    c.execute("DROP TRIGGER IF EXISTS questions_fts_ai")
    c.execute("DROP TRIGGER IF EXISTS questions_fts_ad")
    c.execute("DROP TRIGGER IF EXISTS questions_fts_au")
    c.execute("DROP TABLE IF EXISTS questions_fts")

    # Specific updates for 2568 stems & propositions
    for qid in range(2315, 2345):
        c.execute("SELECT stem, proposition, question_text FROM questions WHERE id = ?", (qid,))
        stem, prop, qt = c.fetchone()

        new_stem = clean_text(stem)
        new_prop = clean_text(prop)
        new_qt = clean_text(qt)

        # Standardize stem for 2336-2338
        if qid in [2336, 2337, 2338]:
            if new_stem.startswith('A มีวุฒิบัตร'):
                new_stem = 'ทันตแพทย์ ' + new_stem

        if (new_stem != stem) or (new_prop != prop) or (new_qt != qt):
            c.execute("""
                UPDATE questions 
                SET stem = ?, proposition = ?, question_text = ? 
                WHERE id = ?
            """, (new_stem, new_prop, new_qt, qid))
            print(f"Updated SQLite Question {qid} text/stem")

        # Clean choices
        c.execute("SELECT label, text FROM choices WHERE question_id = ? ORDER BY label", (qid,))
        for lbl, txt in c.fetchall():
            new_txt = clean_text(txt)
            if new_txt != txt:
                c.execute("UPDATE choices SET text = ? WHERE question_id = ? AND label = ?", (new_txt, qid, lbl))
                print(f"Updated SQLite Choice {qid}-{lbl}")

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
    print("SQLite & FTS5 updated successfully for Year 2568!\n")

def update_supabase():
    print("--- Updating Supabase PostgreSQL for Year 2568 ---")
    url = "postgresql://postgres.fgexylhuyaaedmtnplra:HuBAfgLaZ5IGeqpm@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require"
    engine = create_engine(url, pool_pre_ping=True)

    # Read from SQLite current clean state
    conn_sq = sqlite3.connect('data/exam_bank.db')
    c_sq = conn_sq.cursor()

    with engine.begin() as conn:
        for qid in range(2315, 2345):
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

            c_sq.execute("SELECT label, text FROM choices WHERE question_id = ? ORDER BY label", (qid,))
            for lbl, txt in c_sq.fetchall():
                conn.execute(text("""
                    UPDATE choices 
                    SET text = :txt 
                    WHERE question_id = :qid AND label = :lbl
                """), {"txt": txt, "qid": qid, "lbl": lbl})
            print(f"Updated Supabase Question {qid}")
    conn_sq.close()
    print("Supabase updated successfully for Year 2568!\n")

def clean_obsidian_markdown():
    path = "Obsidian_NL_Exam/Law_Knowledge/NL กฎหมาย รอบ 3_2568.md"
    print(f"--- Cleaning {path} ---")
    if not os.path.exists(path):
        print(f"File {path} not found!")
        return

    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Systematic replacement of corrupted Thai OCR artifacts
    replacements = [
        (r'เป<น', 'เป็น'),
        (r'เปeน', 'เป็น'),
        (r'เป-น', 'เป็น'),
        (r'เปdด', 'เปิด'),
        (r'ทันตแพทย\.', 'ทันตแพทย์'),
        (r'ทันตแพทยG', 'ทันตแพทย์'),
        (r'ป3', 'ปี'),
        (r'ปS', 'ปี'),
        (r'ป`', 'ปี'),
        (r'ไมF', 'ไม่'),
        (r'ไม\)', 'ไม่'),
        (r'ไม5', 'ไม่'),
        (r'หนFวย', 'หน่วย'),
        (r'หน\)วย', 'หน่วย'),
        (r'ตFอ', 'ต่อ'),
        (r'ต\)', 'ต่อ'),
        (r'ให5', 'ให้'),
        (r'ใหU', 'ให้'),
        (r'ใหั', 'ให้'),
        (r'ให;', 'ให้'),
        (r'แล5ว', 'แล้ว'),
        (r'แลUว', 'แล้ว'),
        (r'ได5', 'ได้'),
        (r'ไดU', 'ได้'),
        (r'ได;', 'ได้'),
        (r'อุทรณG', 'อุทธรณ์'),
        (r'ประสบการณG', 'ประสบการณ์'),
        (r'อ\)าน', 'อ่าน'),
        (r'อย\)างไร', 'อย่างไร'),
        (r'เท\)าไหร\)', 'เท่าไหร่'),
        (r'จ\)าย', 'จ่าย'),
        (r'ค\)า', 'ค่า'),
        (r'คFา', 'ค่า'),
        (r'ค5า', 'ค่า'),
        (r'ฟZน', 'ฟัน'),
        (r'ฟfน', 'ฟัน'),
        (r'แหFง', 'แห่ง'),
        (r'แห5ง', 'แห่ง'),
        (r'ตุFม', 'ตุ่ม'),
        (r'ผูU', 'ผู้'),
        (r'ผู5', 'ผู้'),
        (r'ปnวย', 'ป่วย'),
        (r'ปMวย', 'ป่วย'),
        (r'ฟaอง', 'ฟ้อง'),
        (r'ฟYอง', 'ฟ้อง'),
        (r'รUอง', 'ร้อง'),
        (r'ร5อง', 'ร้อง'),
        (r'แม\)', 'แม่'),
        (r'ข5อ', 'ข้อ'),
        (r'ขUอ', 'ข้อ'),
        (r'ข=อ', 'ข้อ'),
        (r'ว\)า', 'ว่า'),
        (r'วFา', 'ว่า'),
        (r'ว\)ากล\)าว', 'ว่ากล่าว'),
        (r'ภาคทัณฑG', 'ภาคทัณฑ์'),
        (r'องคGกร', 'องค์กร'),
        (r'ปfจจุบัน', 'ปัจจุบัน'),
        (r'ป35', 'ปี 5'),
        (r'ผูUชFวย', 'ผู้ช่วย'),
        (r'ผู5ช\)วย', 'ผู้ช่วย'),
        (r'วันเสาร\.-อาทิตย\.', 'วันเสาร์-อาทิตย์'),
        (r'พฤติการณG', 'พฤติการณ์'),
        (r'ใกล5ชิด', 'ใกล้ชิด'),
        (r'อยู\)', 'อยู่'),
        (r'จUาง', 'จ้าง'),
        (r'ไม\)น5อยกว\)า', 'ไม่น้อยกว่า'),
        (r'ล5มละลาย', 'ล้มละลาย'),
        (r'อุปกรณG', 'อุปกรณ์'),
        (r'ควมคุม', 'ควบคุม'),
        (r'แจUง', 'แจ้ง'),
        (r'รFาง', 'ร่าง'),
        (r'ร\)าง', 'ร่าง'),
        (r'ไหมU', 'ไหม้'),
        (r'ปuด', 'ปิด'),
        (r'ด5วย', 'ด้วย'),
        (r'ใช5', 'ใช้'),
        (r'อัตลักษณG', 'อัตลักษณ์'),
        (r'เสื้อผ5า', 'เสื้อผ้า'),
        (r'หน5า', 'หน้า'),
        (r'ง\)าย', 'ง่าย'),
        (r'กว\)า', 'กว่า'),
        (r'ล\)าง', 'ล่าง'),
        (r'ปaาย', 'ป้าย'),
        (r'ปYาย', 'ป้าย'),
        (r'ใหญF', 'ใหญ่'),
        (r'ใหญ\)', 'ใหญ่'),
        (r'กFอน', 'ก่อน'),
        (r'ก\)อน', 'ก่อน'),
        (r'ใต5', 'ใต้'),
        (r'ลายลักษณGอักษร', 'ลายลักษณ์อักษร'),
        (r'ตFางดUาว', 'ต่างด้าว'),
        (r'ต\)างด5าว', 'ต่างด้าว'),
        (r'ช\)องปาก', 'ช่องปาก'),
        (r'หมอฟZน', 'หมอฟัน'),
        (r'รู5', 'รู้'),
        (r'ต่ำกว\)า', 'ต่ำกว่า'),
        (r'ช\)วยเหลือ', 'ช่วยเหลือ'),
        (r'ผู5ยากไร5', 'ผู้ยากไร้'),
        (r'นำย', 'นาย'),
        (r'มีนำคม', 'มีนาคม'),
        (r'คลินิค', 'คลินิก'),
        (r'โซเชี่ยล', 'โซเชียล'),
        (r'ปฎิบัติ', 'ปฏิบัติ'),
        (r'ประสานงานักบโรงพยาบาล', 'ประสานงานกับโรงพยาบาล'),
        (r'ประนาม', 'ประณาม')
    ]

    for pat, rep in replacements:
        content = re.sub(pat, rep, content)

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Obsidian markdown file 2568 cleaned and saved successfully!\n")

if __name__ == '__main__':
    update_sqlite()
    update_supabase()
    clean_obsidian_markdown()
    print("ALL 30 QUESTIONS OF NL LAW 2568 AUDITED AND SYNCHRONIZED!")
