import json
import sqlite3
import glob
import os

conn = sqlite3.connect('data/exam_bank.db')
c = conn.cursor()

updated = 0
for filepath in glob.glob("parsed_exams/*.json"):
    with open(filepath, 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)
            questions = data.get("questions", [])
            for q in questions:
                stem = q.get("stem")
                prop = q.get("proposition")
                q_text = q.get("question_text")
                if stem and q_text:
                    c.execute("""
                        UPDATE questions 
                        SET stem = ?, proposition = ? 
                        WHERE question_text = ? AND (stem IS NULL OR stem = '')
                    """, (stem, prop, q_text))
                    updated += c.rowcount
        except Exception as e:
            print(f"Error reading {filepath}: {e}")

conn.commit()
print(f"Updated {updated} questions with stem/proposition from JSONs.")
