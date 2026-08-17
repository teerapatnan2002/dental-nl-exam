import sqlite3
import re

conn = sqlite3.connect('data/exam_bank.db')
c = conn.cursor()

def deep_clean_2566(text):
    if not text: return text
    orig = text
    
    # Precise multi-word mapping based on observed 2566 OCR garbage
    mappings = [
        (r'คนไไข้', 'คนไข้'),
        (r'\bมถ่\s*อด\b', 'ไม่ถอด'),
        (r'ฟน\s*ปลอม', 'ฟันปลอม'),
        (r'ฟน\s', 'ฟัน '),
        (r'ฟน\b', 'ฟัน'),
        (r'แชน่\s*าํ', 'แช่น้ำ'),
        (r'แชน่\s*้ำ', 'แช่น้ำ'),
        (r'ใให้', 'ให้'),
        (r'ไแม่', 'ไม่'),
        (r'ไไม่', 'ไม่'),
        (r'ชอ่ ง\s*ปาก', 'ช่องปาก'),
        (r'ชอ่ ง', 'ช่อง'),
        (r'อยา่ ง', 'อย่าง'),
        (r'ผปู้ ว ย', 'ผู้ป่วย'),
        (r'ซขี\s*า้ง', 'ซี่ข้าง'),
        (r'เพอื\s', 'เพื่อ '),
        (r'รปู ร่า ง', 'รูปร่าง'),
        (r'ชนดิ\s', 'ชนิด '),
        (r'เชค็\s', 'เช็ค '),
        (r'นาํ\s*ลาย', 'น้ำลาย'),
        (r'นาํ\s*ตาล', 'น้ำตาล'),
        (r'วเิ\s*คราะห', 'วิเคราะห์'),
        (r'ปจจยั\s*นาํ', 'ปัจจัยนำ'),
        (r'ปัจจัย\s*เอือ', 'ปัจจัยเอื้อ'),
        (r'เชอื\s*ที', 'เชื้อที่'),
        (r'ทำใให้', 'ทำให้'),
        (r'รากปด\s*แล้ว', 'รากปิดแล้ว'),
        (r'ใหมด้\s*่\s*ว\s*ย', 'ใหม่ด้วย'),
        (r'ต้านเชอื\s*รา', 'ต้านเชื้อรา'),
        (r'โพรงฟน', 'โพรงฟัน'),
        (r'รองพนื', 'รองพื้น'),
        (r'คอฟน', 'คอฟัน'),
        (r'เรยีน', 'เรียน'),
        (r'สงู\s*ขนึ', 'สูงขึ้น'),
        (r'สขุ\s*ภาพ', 'สุขภาพ'),
        (r'สฟี\s*น', 'สีฟัน'),
        (r'รวู้\s*า่', 'รู้ว่า'),
        (r'เสยี\s*ดส', 'เสียดสี'),
        (r'เนอื\s*เยอื', 'เนื้อเยื่อ'),
        (r'ฆ่า\s*เชอื', 'ฆ่าเชื้อ'),
        (r'จ่า\s*ย', 'จ่าย'),
        (r'ทีผดิ\s*ปกติ', 'ที่ผิดปกติ'),
        (r'ซที\s*ี', 'ซี่ที่'),
        (r'วินิจฉยั', 'วินิจฉัย'),
        (r'ประเมนิ', 'ประเมิน'),
        (r'ปจจยั', 'ปัจจัย'),
        (r'สาํ\s*คัญ', 'สำคัญ'),
        (r'ทีสดุ', 'ที่สุด'),
        (r'มรีปู', 'มีรูป'),
        (r'ทำใหร้ กั ษา', 'ทำให้รักษา'),
        (r'ร กั ษา', 'รักษา'),
        (r'ขดั\s', 'ขัด '),
        (r'เยนิ\s', 'เยิน '),
        (r'ด้านหนา้', 'ด้านหน้า'),
        (r'บอกวา่', 'บอกว่า'),
        (r'คนไไข้อาฟน', 'คนไข้เอาฟัน'),
        (r'แช่ H2O2', 'แช่ H2O2'), # Not a fix, just for context
        (r'คนไข้เอาฟน', 'คนไข้เอาฟัน')
    ]
    
    for pat, rep in mappings:
        text = re.sub(pat, rep, text)
        
    return text if text != orig else None


q_up = 0
c.execute("SELECT id, question_text, stem, proposition FROM questions WHERE source_exam LIKE '%2566%'")
for r in c.fetchall():
    qid, qt, stem, prop = r
    n_qt = deep_clean_2566(qt)
    n_stem = deep_clean_2566(stem)
    n_prop = deep_clean_2566(prop)
    if n_qt or n_stem or n_prop:
        f_qt = n_qt if n_qt else qt
        f_stem = n_stem if n_stem else stem
        f_prop = n_prop if n_prop else prop
        c.execute("UPDATE questions SET question_text=?, stem=?, proposition=? WHERE id=?", (f_qt, f_stem, f_prop, qid))
        q_up += 1

c_up = 0
c.execute("SELECT id, text FROM choices WHERE id IN (SELECT c.id FROM choices c JOIN questions q ON c.question_id = q.id WHERE q.source_exam LIKE '%2566%')")
for r in c.fetchall():
    cid, ctext = r
    n_ctext = deep_clean_2566(ctext)
    if n_ctext:
        c.execute("UPDATE choices SET text=? WHERE id=?", (n_ctext, cid))
        c_up += 1

conn.commit()
print(f"Deep cleaned {q_up} questions and {c_up} choices for 2566.")

c.execute("DELETE FROM questions_fts")
c.execute("""
    INSERT INTO questions_fts(rowid, question_text, stem, proposition, category, task)
    SELECT id, question_text, stem, proposition, category, task FROM questions
""")
conn.commit()
print("FTS5 Index rebuilt successfully.")
conn.close()
