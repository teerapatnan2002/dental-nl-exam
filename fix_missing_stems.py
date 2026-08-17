import sqlite3
import re

conn = sqlite3.connect('data/exam_bank.db')
c = conn.cursor()

c.execute('SELECT id, question_text FROM questions WHERE stem IS NULL')
rows = c.fetchall()

updated = 0
for row in rows:
    qid, qt = row
    if not qt:
        continue
    
    # Try to split by space followed by a number and a dot, e.g. " 1. " or " 28. "
    # Or newline followed by number and dot.
    mm = re.split(r"[\s\n]+(?=\d{1,3}\.\s)", qt, maxsplit=1)
    
    if len(mm) == 2 and len(mm[0].strip()) > 15:
        stem = mm[0].strip()
        prop = mm[1].strip()
    else:
        # Fallback to "ข้อ N"
        mm2 = re.split(r"[\s\n]+(?=ข้อ\s*\d{1,3})", qt, maxsplit=1)
        if len(mm2) == 2 and len(mm2[0].strip()) > 15:
            stem = mm2[0].strip()
            prop = mm2[1].strip()
        else:
            # Standalone question
            stem = qt.strip()
            prop = ""

    c.execute("UPDATE questions SET stem = ?, proposition = ? WHERE id = ?", (stem, prop, qid))
    updated += 1

conn.commit()
print(f"Fixed {updated} questions with missing STEMs.")
