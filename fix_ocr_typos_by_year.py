import sqlite3
import re

conn = sqlite3.connect('data/exam_bank.db')
c = conn.cursor()

def clean_text(text):
    if not text:
        return text
        
    original = text
    
    # 1. Target 1 used as ไม้โท (\u0e49)
    replacements_1 = [
        (r'ขึ1น', 'ขึ้น'), (r'ทั1ง', 'ทั้ง'), (r'นื1อ', 'เนื้อ'),
        (r'ตั1ง', 'ตั้ง'), (r'รั1ง', 'รั้ง'), (r'ลิ1น', 'ลิ้น'),
        (r'สั1น', 'สั้น'), (r'ชื1อ', 'ชื่อ'), (r'ซื1อ', 'ซื้อ'),
        (r'ซํ1า', 'ซ้ำ'), (r'ฟ1น', 'ฟัน'), (r'พื1น', 'พื้น')
    ]
    for pattern, repl in replacements_1:
        text = re.sub(pattern, repl, text)
        
    # 2. Target , used as ไม้เอก (\u0e48)
    replacements_comma = [
        (r'อื,น', 'อื่น'), (r'ทั,ว', 'ทั่ว'), (r'พื,อ', 'เพื่อ'),
        (r'รื,อ', 'รื้อ'), (r'พิ,ง', 'พึ่ง'), (r'ตื,น', 'ตื่น'),
        (r'บิ,น', 'บิ่น'), (r'ติ,ง', 'ติ่ง'), (r'มื,อ', 'เมื่อ'),
        (r'ชั,ว', 'ชั่ว'), (r'สั,ง', 'สั่ง'), (r'กี,', 'กี่'),
        (r'รี,', 'รี่'), (r'ลิ,น', 'ลิ่น'), (r'นี1', 'นี้')
    ]
    for pattern, repl in replacements_comma:
        text = re.sub(pattern, repl, text)
        
    # Also replace _ as sara ee if it says ป_
    text = re.sub(r'ป_', 'ปี', text)
    
    # 3. Double Sara E -> Sara AE
    text = text.replace('เเ', 'แ')
    
    return text if text != original else None


# Update Questions
c.execute("SELECT id, question_text, stem, proposition, explanation FROM questions")
rows = c.fetchall()

q_updated = 0
for row in rows:
    qid, qt, stem, prop, exp = row
    
    new_qt = clean_text(qt)
    new_stem = clean_text(stem)
    new_prop = clean_text(prop)
    new_exp = clean_text(exp)
    
    if new_qt or new_stem or new_prop or new_exp:
        final_qt = new_qt if new_qt else qt
        final_stem = new_stem if new_stem else stem
        final_prop = new_prop if new_prop else prop
        final_exp = new_exp if new_exp else exp
        
        c.execute("""
            UPDATE questions 
            SET question_text = ?, stem = ?, proposition = ?, explanation = ?
            WHERE id = ?
        """, (final_qt, final_stem, final_prop, final_exp, qid))
        q_updated += 1


# Update Choices
c.execute("SELECT id, text, label FROM choices")
c_rows = c.fetchall()

c_updated = 0
for row in c_rows:
    cid, ctext, clabel = row
    
    new_ctext = clean_text(ctext)
    
    if new_ctext:
        c.execute("UPDATE choices SET text = ? WHERE id = ?", (new_ctext, cid))
        c_updated += 1

conn.commit()

print(f"Updated {q_updated} questions and {c_updated} choices.")

# Rebuild FTS5 index
print("Rebuilding FTS5 Index...")
c.execute("DELETE FROM questions_fts")
c.execute("""
    INSERT INTO questions_fts(rowid, question_text, stem, proposition, explanation)
    SELECT id, question_text, stem, proposition, explanation FROM questions
""")
conn.commit()
print("FTS5 Index rebuilt successfully.")

conn.close()
