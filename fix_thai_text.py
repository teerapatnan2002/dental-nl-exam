import sqlite3

def clean_thai(text):
    if not text:
        return text
    # Replace Nikhahit + Sara Aa with Sara Am
    text = text.replace("\u0E4D\u0E32", "\u0E33") 
    # Also replace any weird Sara A anomalies if they exist (though less common)
    # Remove Zero Width Space if any
    text = text.replace("\u200B", "")
    return text

conn = sqlite3.connect('exam_bank.db')
c = conn.cursor()

# Update questions
c.execute("SELECT id, question_text, stem, proposition, explanation FROM questions")
rows = c.fetchall()
for r in rows:
    qid, q_text, stem, prop, exp = r
    new_q_text = clean_thai(q_text)
    new_stem = clean_thai(stem)
    new_prop = clean_thai(prop)
    new_exp = clean_thai(exp)
    if new_q_text != q_text or new_stem != stem or new_prop != prop or new_exp != exp:
        c.execute("UPDATE questions SET question_text=?, stem=?, proposition=?, explanation=? WHERE id=?", 
                  (new_q_text, new_stem, new_prop, new_exp, qid))

# Update choices
c.execute("SELECT id, text FROM choices")
rows = c.fetchall()
for r in rows:
    cid, c_text = r
    new_c_text = clean_thai(c_text)
    if new_c_text != c_text:
        c.execute("UPDATE choices SET text=? WHERE id=?", (new_c_text, cid))

conn.commit()
conn.close()
print("Fixed Thai text encoding anomalies in DB.")
