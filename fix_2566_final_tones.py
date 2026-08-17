import sqlite3
import re

conn = sqlite3.connect('data/exam_bank.db')
c = conn.cursor()

def final_clean_2566(text):
    if not text: return text
    orig = text
    
    # 1. Right-shifted tone marks on final consonants
    # Consonant1 + Consonant2 + Tone, where Cons2 is final consonant and Cons1+Cons2 is NOT a valid cluster
    valid_clusters = ['กร', 'ขร', 'คร', 'ตร', 'ปร', 'พร',
                      'กล', 'ขล', 'คล', 'ปล', 'พล', 'ผล',
                      'กว', 'ขว', 'คว',
                      'หง', 'หน', 'หม', 'หย', 'หร', 'หล', 'หว',
                      'อย']
                      
    def tone_swap_replacer(match):
        c1 = match.group(1)
        c2 = match.group(2)
        tone = match.group(3)
        if c1+c2 not in valid_clusters:
            return c1 + tone + c2
        return match.group(0)
        
    text = re.sub(r'([ก-ฮ])([งนมยวกดบ])([\u0E48-\u0E4B])', tone_swap_replacer, text)
    
    # 2. Tone mark drifted before consonant
    def left_drift_replacer(match):
        tone = match.group(1)
        c1 = match.group(2)
        return c1 + tone
        
    text = re.sub(r'([\u0E48-\u0E4B])([ก-ฮ])', left_drift_replacer, text)
    
    # 3. Specific space injections inside common words
    space_replacements = [
        (r'ผ่า\s*น', 'ผ่าน'),
        (r'ตา่\s*ง', 'ต่าง'),
        (r'กอ่\s*น', 'ก่อน'),
        (r'ออ่\s*น', 'อ่อน'),
        (r'เพมิ\s*เตมิ', 'เพิ่มเติม'),
        (r'ทีสุ\s*ด', 'ที่สุด'),
        (r'ดงั\s*นั1น', 'ดังนั้น'),
        (r'ดงั\s*นนั1', 'ดังนั้น'),
        (r'อยา่\s*ง', 'อย่าง'),
        (r'ให\s*้', 'ให้'),
        (r'ได\s*้', 'ได้'),
        (r'ใช\s*้', 'ใช้'),
        (r'ข\s*้อ', 'ข้อ'),
        (r'ช\s*ื่อ', 'ชื่อ'),
        (r'น\s*้ำ', 'น้ำ'),
        (r'ต\s*้อง', 'ต้อง'),
        (r'ซ\s*ี่', 'ซี่'),
        (r'ที\s*่', 'ที่'),
        (r'นี\s*้', 'นี้'),
        (r'ชอ่\s*ง', 'ช่อง'),
        (r'อ\s*ื\s*่\s*น', 'อื่น'),
        (r'ตาํ\s*แหนง่', 'ตำแหน่ง'),
        (r'แหนง่', 'แหน่ง'),
        (r'รว่\s*ม', 'ร่วม'),
        (r'สว่\s*น', 'ส่วน')
    ]
    for p, r in space_replacements:
        text = re.sub(p, r, text)
        
    text = re.sub(r'\s{2,}', ' ', text)
    
    return text if text != orig else None


q_up = 0
c.execute("SELECT id, question_text, stem, proposition FROM questions WHERE source_exam LIKE '%2566%'")
for r in c.fetchall():
    qid, qt, stem, prop = r
    n_qt = final_clean_2566(qt)
    n_stem = final_clean_2566(stem)
    n_prop = final_clean_2566(prop)
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
    n_ctext = final_clean_2566(ctext)
    if n_ctext:
        c.execute("UPDATE choices SET text=? WHERE id=?", (n_ctext, cid))
        c_up += 1

conn.commit()
print(f"Final cleaned {q_up} questions and {c_up} choices for 2566.")

c.execute("DELETE FROM questions_fts")
c.execute("""
    INSERT INTO questions_fts(rowid, question_text, stem, proposition, category, task)
    SELECT id, question_text, stem, proposition, category, task FROM questions
""")
conn.commit()
print("FTS5 Index rebuilt successfully.")
conn.close()
