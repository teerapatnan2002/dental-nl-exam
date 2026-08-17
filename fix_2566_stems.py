import fitz
import re
import sqlite3
import glob

conn = sqlite3.connect('data/exam_bank.db')
c = conn.cursor()

def get_part_num(filename):
    m = re.search(r'part[_\s]*(\d)', filename.lower())
    return int(m.group(1)) if m else None

def clean(text):
    if not text: return text
    replacements = [
        (r'ป\+วย', 'ป่วย'), (r'ฟ\.น', 'ฟัน'), (r'ซี,', 'ซี่'),
        (r'ที,', 'ที่'), (r'เป6น', 'เป็น'), (r'เคี1ยว', 'เคี้ยว'),
        (r'เพิ,ม', 'เพิ่ม'), (r'ชิ1น', 'ชิ้น'), (r'นํ1า', 'น้ำ'),
        (r'ป0องกัน', 'ป้องกัน'), (r'ป\.จจัย', 'ปัจจัย'), (r'ปW', 'ปี')
    ]
    for p, r in replacements:
        text = re.sub(p, r, text)
    return text.strip()

def strip_vowels(s):
    # Remove Thai vowels, tone marks, and all whitespace/punctuation to make a robust search key
    return re.sub(r'[\u0E30-\u0E4E\s\.\(\)\-\,]', '', str(s))

for pdf_path in glob.glob('NL2Test2023/NL 2 2566 part [14]*.pdf'):
    part_num = get_part_num(pdf_path)
    if not part_num: continue
    print(f"Processing 2566 Part {part_num}...")
    
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text() + "\n"
        
    chunks = []
    matches = list(re.finditer(r'(?i)(STEM\s*\d+.*?)(?=STEM\s*\d+|\Z)', text, flags=re.DOTALL))
    for m in matches:
        chunk_text = m.group(1)
        
        q_start = re.search(r'\n\s*\d{1,3}\.\s+[^\n]', chunk_text)
        if not q_start:
            q_start = re.search(r'\s\d{1,3}\.\s+[^\n]', chunk_text)
            
        if q_start:
            raw_stem = chunk_text[:q_start.start()].strip()
        else:
            raw_stem = chunk_text.strip()
            
        raw_stem = re.sub(r'(?i)^STEM\s*\d+\s*', '', raw_stem)
        cleaned_stem = clean(raw_stem)
        
        chunks.append({
            'stem': cleaned_stem,
            'searchable': strip_vowels(chunk_text)
        })
        
    print(f"Found {len(chunks)} STEM chunks in PDF.")
    
    c.execute("""
        SELECT id, question_text FROM questions 
        WHERE source_exam LIKE ?
        ORDER BY id
    """, (f'%2566%part_{part_num}%'.replace('_', '_'),))
    
    questions = c.fetchall()
    print(f"Found {len(questions)} questions in DB.")
    
    updated = 0
    for qid, qt in questions:
        if not qt: continue
        
        # Take the question text, strip the number, and take first 20 stripped chars
        qt_clean = re.sub(r'^\d{1,3}\.\s*', '', str(qt))
        snippet = strip_vowels(qt_clean)[:25]
        
        matched_stem = None
        for chunk in chunks:
            if snippet in chunk['searchable']:
                matched_stem = chunk['stem']
                break
                
        if matched_stem:
            # Check if this question is just a standalone question with no stem
            # If the matched stem is very short, it might just be the question itself
            if len(matched_stem) > 15 and matched_stem != qt_clean:
                c.execute("UPDATE questions SET stem = ? WHERE id = ?", (matched_stem, qid))
                updated += 1
            else:
                c.execute("UPDATE questions SET stem = ? WHERE id = ?", (None, qid))
        else:
            print(f"  WARNING: Could not find chunk for Q{qid}: {qt[:30]}")
                
    print(f"Successfully updated {updated} out of {len(questions)} questions.")

conn.commit()
print("Done.")
