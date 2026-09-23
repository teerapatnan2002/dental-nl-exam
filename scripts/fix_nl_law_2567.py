import sqlite3
import re
import os
from sqlalchemy import create_engine, text

# ══════════════════════════════════════════════════════════════
# NL Law 2567 (IDs 2282 to 2314) Audit & Fix Script
# ══════════════════════════════════════════════════════════════

def clean_text(s):
    if not s:
        return s
    replacements = [
        ('ศีรษะนิรนำม', 'ศีรษะนิรนาม'),
        ('ประสานงานักบโรงพยาบาล', 'ประสานงานกับโรงพยาบาล'),
        ('นำย', 'นาย'),
        ('นำง', 'นาง'),
        ('ทันตกรรท', 'ทันตกรรม'),
        ('ทำไรได้บ้าง', 'ทำอะไรได้บ้าง'),
        ('พรบ.วิชาชีพทันตกรรม', 'พ.ร.บ. วิชาชีพทันตกรรม'),
        ('พรบ.สถานพยาบาล', 'พ.ร.บ. สถานพยาบาล'),
        ('พรบวิชาชีพ', 'พ.ร.บ. วิชาชีพ'),
        ('พรบสถานพยาบาล', 'พ.ร.บ. สถานพยาบาล'),
        ('พรบคุ้มครองผู้บริโภค', 'พ.ร.บ. คุ้มครองผู้บริโภค'),
    ]
    for old, new in replacements:
        s = s.replace(old, new)
    return s

def update_sqlite():
    print("--- Updating SQLite for Year 2567 (IDs 2282-2314) ---")
    conn = sqlite3.connect('data/exam_bank.db')
    c = conn.cursor()

    # Drop triggers & FTS
    c.execute("DROP TRIGGER IF EXISTS questions_fts_ai")
    c.execute("DROP TRIGGER IF EXISTS questions_fts_ad")
    c.execute("DROP TRIGGER IF EXISTS questions_fts_au")
    c.execute("DROP TABLE IF EXISTS questions_fts")

    for qid in range(2282, 2315):
        c.execute("SELECT stem, proposition, question_text FROM questions WHERE id = ?", (qid,))
        stem, prop, qt = c.fetchone()

        new_stem = clean_text(stem)
        new_prop = clean_text(prop)
        new_qt = clean_text(qt)

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
    print("SQLite & FTS5 updated successfully for Year 2567!\n")

def update_supabase():
    print("--- Updating Supabase PostgreSQL for Year 2567 ---")
    url = "postgresql://postgres.fgexylhuyaaedmtnplra:HuBAfgLaZ5IGeqpm@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require"
    engine = create_engine(url, pool_pre_ping=True)

    conn_sq = sqlite3.connect('data/exam_bank.db')
    c_sq = conn_sq.cursor()

    with engine.begin() as conn:
        for qid in range(2282, 2315):
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
    print("Supabase updated successfully for Year 2567!\n")

def clean_obsidian_markdown():
    path = "Obsidian_NL_Exam/Law_Knowledge/NL2-2567 Part กฎหมาย.md"
    print(f"--- Cleaning {path} ---")
    if not os.path.exists(path):
        print(f"File {path} not found!")
        return

    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Systematic replacements for 2567 OCR artifacts
    replacements = [
        (r'ฟ\.น', 'ฟัน'),
        (r'ครั1ง', 'ครั้ง'),
        (r'ที,', 'ที่'),
        (r'เพื,อ', 'เพื่อ'),
        (r'เคสนี1', 'เคสนี้'),
        (r'กรณีนี1', 'กรณีนี้'),
        (r'ชิ1น', 'ชิ้น'),
        (r'เนื1อหา', 'เนื้อหา'),
        (r'คลิปนี1', 'คลิปนี้'),
        (r'สิ1นสุด', 'สิ้นสุด'),
        (r'สิ1นเปลือง', 'สิ้นเปลือง'),
        (r'วันนี1', 'วันนี้'),
        (r'ขึ1น', 'ขึ้น'),
        (r'นั1น', 'นั้น'),
        (r'ทิ1ง', 'ทิ้ง'),
        (r'ดังต่อไปนี1', 'ดังต่อไปนี้'),
        (r'คลินิกนี1', 'คลินิกนี้'),
        (r'ชี1แจง', 'ชี้แจง'),
        (r'พื1นที,', 'พื้นที่'),
        (r'ไม่สมารถ', 'ไม่สามารถ'),
        (r'เป6น', 'เป็น'),
        (r'เปUด', 'เปิด'),
        (r'ปUด', 'ปิด'),
        (r'ตํารวจ', 'ตำรวจ'),
        (r'ทํางาน', 'ทำงาน'),
        (r'ทํา', 'ทำ'),
        (r'สํารอง', 'สำรอง'),
        (r'สําเร็จ', 'สำเร็จ'),
        (r'คําเเนะนํา', 'คำแนะนำ'),
        (r'คําปรึกษา', 'คำปรึกษา'),
        (r'คําถาม', 'คำถาม'),
        (r'คํา', 'คำ'),
        (r'นํ1านม', 'น้ำนม'),
        (r'ยี,ห้อ', 'ยี่ห้อ'),
        (r'เครื,องมือ', 'เครื่องมือ'),
        (r'เป0าหมาย', 'เป้าหมาย'),
        (r'ฟ0อง', 'ฟ้อง'),
        (r'ป0องกัน', 'ป้องกัน'),
        (r'ปW', 'ปี'),
        (r'ชื,อ', 'ชื่อ'),
        (r'ผู้ป\+วย', 'ผู้ป่วย'),
        (r'เเต่อยู่', 'แต่อยู่'),
        (r'ดูเเล', 'ดูแล'),
        (r'วินิฉัย', 'วินิจฉัย'),
        (r'กระทรวงสาธารสุข', 'กระทรวงสาธารณสุข'),
        (r'ภาคทันต์', 'ภาคทัณฑ์'),
        (r'นำย', 'นาย'),
        (r'นำง', 'นาง'),
        (r'ทันตกรรท', 'ทันตกรรม'),
        (r'ศีรษะนิรนำม', 'ศีรษะนิรนาม'),
        (r'แฟชั,น', 'แฟชั่น'),
        (r'เคี1ยว', 'เคี้ยว'),
        (r'สิ,ง', 'สิ่ง'),
        (r'อื,น', 'อื่น'),
        (r'เรื,อง', 'เรื่อง'),
        (r'พี,ง', 'เพิ่ง'),
        (r'เพิ,ง', 'เพิ่ง'),
        (r'อํานาจ', 'อำนาจ'),
        (r'ดําเนิน', 'ดำเนิน'),
        (r'สํานักงาน', 'สำนักงาน'),
        (r'ใบอนุญาติ', 'ใบอนุญาต'),
        (r'ทัตแพทย์', 'ทันตแพทย์'),
        (r'มาตราฐาน', 'มาตรฐาน'),
        (r'คิอค่า', 'คิดค่า'),
        (r'สื,อสัตย์', 'ซื่อสัตย์'),
        (r'ฟ\.งความ', 'ฟังความ'),
        (r'ประนาม', 'ประณาม'),
        (r'ประสานงานักบโรงพยาบาล', 'ประสานงานกับโรงพยาบาล'),
    ]

    for pat, rep in replacements:
        content = re.sub(pat, rep, content)

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Obsidian markdown file 2567 cleaned and saved successfully!\n")

if __name__ == '__main__':
    update_sqlite()
    update_supabase()
    clean_obsidian_markdown()
    print("ALL 33 QUESTIONS OF NL LAW 2567 AUDITED AND SYNCHRONIZED!")
