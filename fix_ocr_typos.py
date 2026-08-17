import sqlite3
import re

replacements = [
    (r'เเ', 'แ'),
    (r'ป\+วย', 'ป่วย'),
    (r'ฟ\.น', 'ฟัน'),
    (r'ซี,', 'ซี่'),
    (r'ที,', 'ที่'),
    (r'เป6น', 'เป็น'),
    (r'เคี1ยว', 'เคี้ยว'),
    (r'เพิ,ม', 'เพิ่ม'),
    (r'ชิ1น', 'ชิ้น'),
    (r'นํ1า', 'น้ำ'),
    (r'ป0องกัน', 'ป้องกัน'),
    (r'ป\.จจัย', 'ปัจจัย'),
    (r'ปW', 'ปี'),
    (r'เปลี,ยน', 'เปลี่ยน'),
    (r'เดี,ยว', 'เดี่ยว'),
    (r'ฝ\.,ง', 'ฝั่ง'),
    (r'ทั1ง', 'ทั้ง'),
    (r'ชั1น', 'ชั้น'),
    (r'นั1น', 'นั้น'),
    (r'ลิ1น', 'ลิ้น'),
    (r'ขึ1น', 'ขึ้น'),
    (r'ตํา', 'ตำ'),
    (r'ดํา', 'ดำ'),
    (r'ทํา', 'ทำ'),
    (r'นํา', 'นำ'),
    (r'เพ,อื', 'เพื่อ'),
    (r'วทิ ยา', 'วิทยา'),
    (r'ทนั ตกรรม', 'ทันตกรรม'),
    (r'ผู\$', 'ผู้'),
    (r'หกล\$ม', 'หกล้ม'),
    (r'ฟ4น', 'ฟัน'),
    (r'อย\[าง', 'อย่าง'),
    (r'แต\[', 'แต่'),
    (r'เข\$า', 'เข้า'),
    (r'ไว\$', 'ไว้'),
    (r'แล\$ว', 'แล้ว'),
    (r'เนื,อง', 'เนื่อง'),
    (r'เเม้', 'แม้'),
    (r'เเพ้', 'แพ้'),
    (r'เเทบ', 'แทบ'),
    (r'เเข็ง', 'แข็ง'),
    (r'เเตก', 'แตก'),
    (r'เเผล', 'แผล'),
    (r'เเค่', 'แค่'),
    (r'เเรง', 'แรง'),
    (r'เเบบ', 'แบบ'),
    (r'เเน่', 'แน่'),
    (r'เเก้', 'แก้'),
    (r'เเทน', 'แทน'),
    (r'เเบคทีเรีย', 'แบคทีเรีย'),
    (r'เเก้ม', 'แก้ม'),
    (r'เเคบ', 'แคบ'),
    (r'เเถว', 'แถว'),
    (r'เเม่', 'แม่')
]

def apply_fixes(text):
    if not text:
        return text
    orig = text
    for pattern, repl in replacements:
        text = re.sub(pattern, repl, text)
    return text if text != orig else None

conn = sqlite3.connect('data/exam_bank.db')
c = conn.cursor()

# Update questions
c.execute('SELECT id, question_text, stem, proposition, explanation FROM questions')
rows = c.fetchall()
q_updated = 0

for row in rows:
    qid, qt, stem, prop, expl = row
    new_qt = apply_fixes(qt)
    new_stem = apply_fixes(stem)
    new_prop = apply_fixes(prop)
    new_expl = apply_fixes(expl)
    
    if new_qt or new_stem or new_prop or new_expl:
        c.execute('''
            UPDATE questions 
            SET question_text = COALESCE(?, question_text),
                stem = COALESCE(?, stem),
                proposition = COALESCE(?, proposition),
                explanation = COALESCE(?, explanation)
            WHERE id = ?
        ''', (new_qt, new_stem, new_prop, new_expl, qid))
        q_updated += 1

# Update choices
c.execute('SELECT id, text FROM choices')
c_rows = c.fetchall()
c_updated = 0

for row in c_rows:
    cid, ctext = row
    new_ctext = apply_fixes(ctext)
    if new_ctext:
        c.execute('UPDATE choices SET text = ? WHERE id = ?', (new_ctext, cid))
        c_updated += 1

conn.commit()
print(f"Fixed OCR typos in {q_updated} questions and {c_updated} choices.")
