import sqlite3
import re

def fix_all_thai_typos():
    conn = sqlite3.connect('data/exam_bank.db')
    c = conn.cursor()

    # Drop triggers and FTS5 before batch update
    c.execute("DROP TRIGGER IF EXISTS questions_fts_ai")
    c.execute("DROP TRIGGER IF EXISTS questions_fts_ad")
    c.execute("DROP TRIGGER IF EXISTS questions_fts_au")
    c.execute("DROP TABLE IF EXISTS questions_fts")
    conn.commit()

    replacements = [
        # Specific phrases & words
        (r'ดื่อมน\s*้า', 'ดื่มน้ำ'),
        (r'ดื่อมน้ำ', 'ดื่มน้ำ'),
        (r'ดื่อม', 'ดื่ม'),
        (r'น\s*้าเย็น', 'น้ำเย็น'),
        (r'น\s*้าร้อน', 'น้ำร้อน'),
        (r'น\s*้าตาล', 'น้ำตาล'),
        (r'น\s*้าลาย', 'น้ำลาย'),
        (r'น\s*้าเกลือ', 'น้ำเกลือ'),
        (r'น\s*้า', 'น้ำ'),
        (r'เพื่ออ', 'เพื่อ'),
        (r'เมื่ออ', 'เมื่อ'),
        (r'ต่อเนื่ออง', 'ต่อเนื่อง'),
        (r'เนื่อองจาก', 'เนื่องจาก'),
        (r'เนื่ออง', 'เนื่อง'),
        (r'จังหัวด', 'จังหวัด'),
        (r'ส\s*าหรับ', 'สำหรับ'),
        (r'ส\s*าเร็จ', 'สำเร็จ'),
        (r'ส\s*ารวจ', 'สำรวจ'),
        (r'ส\s*าคัญ', 'สำคัญ'),
        (r'จ\s*าหน่าย', 'จำหน่าย'),
        (r'จ\s*าไม่ได้', 'จำไม่ได้'),
        (r'จ\s*าแนก', 'จำแนก'),
        (r'จ\s*านวน', 'จำนวน'),
        (r'จ\s*ากัด', 'จำกัด'),
        (r'จ\s*าเพาะ', 'จำเพาะ'),
        (r'จ\s*าเป็น', 'จำเป็น'),
        (r'ท\s*าการ', 'ทำการ'),
        (r'ท\s*าให้', 'ทำให้'),
        (r'ท\s*าฟัน', 'ทำฟัน'),
        (r'ท\s*าความสะอาด', 'ทำความสะอาด'),
        (r'ท\s*าหน้าที่', 'ทำหน้าที่'),
        (r'ท\s*างาน', 'ทำงาน'),
        (r'ท\s*าไม', 'ทำไม'),
        (r'ท\s*าได้', 'ทำได้'),
        (r'ท\s*า', 'ทำ'),
        (r'แนะน\s*า', 'แนะนำ'),
        (r'น\s*ามา', 'นำมา'),
        (r'น\s*าไป', 'นำไป'),
        (r'น\s*า', 'นำ'),
        (r'ก\s*าลัง', 'กำลัง'),
        (r'ก\s*าหนด', 'กำหนด'),
        (r'ก\s*าจัด', 'กำจัด'),
        (r'อ\s*าเภอ', 'อำเภอ'),
        (r'ค\s*าน\s*า', 'คำนำ'),
        (r'ค\s*าแนะน\s*า', 'คำแนะนำ'),
        (r'ค\s*าถาม', 'คำถาม'),
        (r'ค\s*าตอบ', 'คำตอบ'),
        (r'ช\s*้าๆ', 'ช้ำๆ'),
        (r'ช\s*้า', 'ช้ำ'),
        (r'คลีนิก', 'คลินิก'),
        (r'ผู้ป\+วย', 'ผู้ป่วย'),
        (r'ผู%ป\'วย', 'ผู้ป่วย'),
        (r'ฟ\.น', 'ฟัน'),
        (r'ฟ3น', 'ฟัน'),
        (r'ป0องกัน', 'ป้องกัน'),
        (r'เป6น', 'เป็น'),
        (r'เปëน', 'เป็น'),
        (r'ขึ1น', 'ขึ้น'),
        (r'ครั1ง', 'ครั้ง'),
        (r'ซี,', 'ซี่'),
        (r'ที,', 'ที่'),
        (r'ชNองปาก', 'ช่องปาก'),
        (r'ไมN', 'ไม่'),
        (r'ห\s*า่', 'ห่าง'),
        (r'D่A', 'DNA'),
    ]

    def clean_text(text):
        if not text:
            return text
        res = text
        for pattern, repl in replacements:
            res = re.sub(pattern, repl, res)
        # Clean extra spaces
        res = re.sub(r'[ \t]+', ' ', res).strip()
        return res

    # 1. Clean choices
    c.execute("SELECT id, text FROM choices")
    choices = c.fetchall()
    updated_ch = 0
    for cid, txt in choices:
        new_txt = clean_text(txt)
        if new_txt != txt:
            c.execute("UPDATE choices SET text = ? WHERE id = ?", (new_txt, cid))
            updated_ch += 1
    print(f'Cleaned {updated_ch} choices.')

    # 2. Clean questions
    c.execute("SELECT id, question_text, proposition, stem, explanation FROM questions")
    questions = c.fetchall()
    updated_q = 0
    for qid, qtxt, prop, stem, expl in questions:
        new_qtxt = clean_text(qtxt)
        new_prop = clean_text(prop)
        new_stem = clean_text(stem)
        new_expl = clean_text(expl)

        if (new_qtxt != qtxt) or (new_prop != prop) or (new_stem != stem) or (new_expl != expl):
            c.execute("""
            UPDATE questions 
            SET question_text = ?, proposition = ?, stem = ?, explanation = ?
            WHERE id = ?
            """, (new_qtxt, new_prop, new_stem, new_expl, qid))
            updated_q += 1
    print(f'Cleaned {updated_q} questions.')

    # Explicitly check ID 1719
    c.execute("SELECT question_text, proposition FROM questions WHERE id = 1719")
    r1719 = c.fetchone()
    print('ID 1719 updated to:', r1719)

    conn.commit()

    # Rebuild FTS5
    c.execute("CREATE VIRTUAL TABLE questions_fts USING fts5(question_text, stem, proposition, category, task)")
    c.execute("INSERT INTO questions_fts(rowid, question_text, stem, proposition, category, task) SELECT id, question_text, stem, proposition, category, task FROM questions")
    
    conn.commit()
    conn.close()
    print('FTS5 rebuilt and Thai typography fully polished!')

if __name__ == '__main__':
    fix_all_thai_typos()
