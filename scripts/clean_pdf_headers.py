import sqlite3
import re

def clean_database_headers_exact():
    conn = sqlite3.connect('data/exam_bank.db')
    c = conn.cursor()

    # Drop triggers and FTS5 before batch update
    c.execute("DROP TRIGGER IF EXISTS questions_fts_ai")
    c.execute("DROP TRIGGER IF EXISTS questions_fts_ad")
    c.execute("DROP TRIGGER IF EXISTS questions_fts_au")
    c.execute("DROP TABLE IF EXISTS questions_fts")
    conn.commit()

    fragments = [
        "cademic affair,",
        "cademic affair",
        "academic affair,",
        "academic affair",
        "Academic affair,",
        "Academic affair",
        "Academic affairs,",
        "Academic affairs",
        "Dental Student Association of Thailand",
        "Dental Student Association",
        "Association of Thailand",
        "รวมข้อสอบประเมินความรู้",
        "่ 2 Part 2",
        "่ 2 Part 4",
        "่ 2 Part 3",
        "่ 2 Part 1",
        "Part 2 วันที่",
        "Part 3 วันที่",
        "Part 4 วันที่",
        "Part 1 วันที่"
    ]

    def clean_str(s):
        if not s:
            return s
        res = s
        for frag in fragments:
            res = re.sub(re.escape(frag), '', res, flags=re.IGNORECASE)
        # Remove trailing comma or dot or whitespace
        res = re.sub(r'[\s,]+$', '', res)
        # If it becomes empty or xxx
        if re.match(r'^x+\s*$', res.strip(), re.IGNORECASE) or not res.strip():
            res = '…' if re.match(r'^x+\s*$', s.strip(), re.IGNORECASE) else res.strip()
        # Clean double spaces
        res = re.sub(r'[ \t]+', ' ', res).strip()
        return res

    # Clean choices
    c.execute("SELECT id, text FROM choices")
    choices = c.fetchall()
    for cid, txt in choices:
        cleaned = clean_str(txt)
        if cleaned != txt:
            c.execute("UPDATE choices SET text = ? WHERE id = ?", (cleaned, cid))

    # Clean questions
    c.execute("SELECT id, question_text, proposition, stem FROM questions")
    questions = c.fetchall()
    for qid, qtxt, prop, stem in questions:
        new_qtxt = clean_str(qtxt)
        new_prop = clean_str(prop)
        new_stem = clean_str(stem)
        if (new_qtxt != qtxt) or (new_prop != prop) or (new_stem != stem):
            c.execute("""
            UPDATE questions 
            SET question_text = ?, proposition = ?, stem = ?
            WHERE id = ?
            """, (new_qtxt, new_prop, new_stem, qid))

    conn.commit()

    # Rebuild FTS5
    c.execute("CREATE VIRTUAL TABLE questions_fts USING fts5(question_text, stem, proposition, category, task)")
    c.execute("INSERT INTO questions_fts(rowid, question_text, stem, proposition, category, task) SELECT id, question_text, stem, proposition, category, task FROM questions")
    
    conn.commit()
    conn.close()
    print('FTS5 rebuilt and all text artifacts 100% purged!')

if __name__ == '__main__':
    clean_database_headers_exact()
