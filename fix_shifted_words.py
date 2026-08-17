import sqlite3
import re

conn = sqlite3.connect('data/exam_bank.db')
c = conn.cursor()

def clean_shifted_words(text):
    if not text:
        return text
        
    original = text
    
    # 1. Shifted Tone Marks on Vowels
    replacements_1 = [
        (r'วา่', 'ว่า'),
        (r'หนา้', 'หน้า'),
        (r'ขา้', 'ข้า'),
        (r'ผา่', 'ผ่า'),
        (r'นา้', 'น้า'),
        (r'รา้', 'ร้า'),
        (r'ดา้', 'ด้า'),
        (r'ยา่', 'ย่า'),
        (r'จา่', 'จ่า'),
        (r'รา่', 'ร่า'),
        (r'ฆา่', 'ฆ่า'),
        (r'วา้', 'ว้า'),
        (r'ผา้', 'ผ้า')
    ]
    
    # 2. Shifted Vowels and Tones (OCR put Tone on the leading vowel)
    replacements_2 = [
        (r'หเ้', 'ให้'),
        (r'หใ้', 'ให้'),
        (r'มไ่', 'ไม่'),
        (r'มเ่', 'ไม่'),
        (r'มโ่', 'ไม่'),
        (r'ขไ้', 'ไข้'),
        (r'ขใ้', 'ไข้'),
        (r'ขเ้', 'ไข้'),
        (r'ขแ้', 'ไข้'),
        (r'ชไ้', 'ใช้'),
        (r'มแ่', 'แม่')
    ]
    
    # 3. Misspelled words (specific 2566 OCR breaks)
    replacements_3 = [
        (r'รสู้ กึ', 'รู้สึก'),
        (r'เจบ็', 'เจ็บ'),
        (r'\bเปน\b', 'เป็น'), # \b ensures we match the whole word 'เปน', though Thai doesn't have word boundaries, we can use (?<![ก-ฮ])เปน(?![ก-ฮ])
        (r'(?<![ก-ฮ])เปน(?![ก-ฮ])', 'เป็น'),
        (r'ปจจยั', 'ปัจจัย'),
        (r'สาํ\s*คัญ', 'สำคัญ'), 
        (r'สาํ', 'สำ'), # fixing split S-am
        (r'ทีสดุ', 'ที่สุด'),
        (r'มรีปู', 'มีรูป'),
        (r'ทำใหร้ กั ษา', 'ทำให้รักษา'),
        (r'ร กั ษา', 'รักษา'),
        (r'ขดั', 'ขัด'),
        (r'คนไขบ้ น่', 'คนไข้บ่น'),
        (r'ใหร้ ปู', 'ให้รูป'),
        (r'มรีปู', 'มีรูป'),
        (r'เยนิ', 'เยิน'),
        (r'ด้านหนา้', 'ด้านหน้า')
    ]
    
    for pattern, repl in replacements_1 + replacements_2 + replacements_3:
        text = re.sub(pattern, repl, text)
        
    return text if text != original else None


# Update Questions
c.execute("SELECT id, question_text, stem, proposition, explanation FROM questions")
rows = c.fetchall()

q_updated = 0
for row in rows:
    qid, qt, stem, prop, exp = row
    
    new_qt = clean_shifted_words(qt)
    new_stem = clean_shifted_words(stem)
    new_prop = clean_shifted_words(prop)
    new_exp = clean_shifted_words(exp)
    
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
c.execute("SELECT id, text FROM choices")
c_rows = c.fetchall()

c_updated = 0
for row in c_rows:
    cid, ctext = row
    new_ctext = clean_shifted_words(ctext)
    if new_ctext:
        c.execute("UPDATE choices SET text = ? WHERE id = ?", (new_ctext, cid))
        c_updated += 1

conn.commit()
print(f"Updated {q_updated} questions and {c_updated} choices.")

print("Rebuilding FTS5 Index...")
c.execute("DELETE FROM questions_fts")
c.execute("""
    INSERT INTO questions_fts(rowid, question_text, stem, proposition, category, task)
    SELECT id, question_text, stem, proposition, category, task FROM questions
""")
conn.commit()
print("FTS5 Index rebuilt successfully.")
conn.close()
