import sqlite3
import re
import os
import glob
from collections import defaultdict

conn = sqlite3.connect('data/exam_bank.db')
c = conn.cursor()

def audit_year(source_name, start_id, end_id, md_path):
    print(f"\n{'='*70}")
    print(f"AUDITING: {source_name} (IDs {start_id} to {end_id})")
    print(f"Source file: {md_path}")
    print(f"{'='*70}")
    
    # 1. Check raw file exists
    if not os.path.exists(md_path):
        print(f"ERROR: File {md_path} does not exist!")
        return

    with open(md_path, 'r', encoding='utf-8') as f:
        md_content = f.read()

    # 2. Fetch DB questions
    db_questions = c.execute('''
        SELECT id, stem, proposition, question_text, correct_answer 
        FROM questions 
        WHERE id BETWEEN ? AND ? 
        ORDER BY id
    ''', (start_id, end_id)).fetchall()

    print(f"Total questions in DB: {len(db_questions)}")

    # 3. Detect OCR issues & Tone shifts in DB
    suspicious_chars = re.compile(r'([ก-ฮ][่้๊๋์][ก-ฮ][่้๊๋์]|ว[่้๊๋]|อ[่้๊๋]|ง[่้๊๋]|ย[่้๊๋]|นำย|มีนำคม|มั1ย|มัย้|เป6น|ฟ\.น|ป_|ไม5|ได;|ผู;ปMวย)')
    
    db_typos = []
    for qid, stem, prop, qt, ans in db_questions:
        combined = f"{stem or ''} {prop or ''} {qt or ''}"
        matches = suspicious_chars.findall(combined)
        if matches:
            db_typos.append((qid, list(set(matches))))

    print(f"Questions with suspicious Thai characters/OCR in DB: {len(db_typos)}")
    for qid, pats in db_typos[:10]:
        print(f"   Q{qid}: {pats}")

    # 4. Check Choices count & differences
    choice_issues = []
    for qid, stem, prop, qt, ans in db_questions:
        choices = c.execute('SELECT label, text FROM choices WHERE question_id = ? ORDER BY label', (qid,)).fetchall()
        # check if choice has suspicious chars
        for lbl, txt in choices:
            m = suspicious_chars.findall(txt)
            if m:
                choice_issues.append((qid, lbl, list(set(m)), txt[:40]))

    print(f"Choices with suspicious Thai characters in DB: {len(choice_issues)}")
    for item in choice_issues[:10]:
        print(f"   Q{item[0]} [{item[1]}]: {item[2]} -> {item[3]}")

    # 5. Check Answer Key vs Obsidian individual Q-notes
    ans_mismatches = []
    for qid, stem, prop, qt, ans in db_questions:
        q_files = glob.glob(f"Obsidian_NL_Exam/Q{qid}_*.md")
        if q_files:
            with open(q_files[0], 'r', encoding='utf-8') as qf:
                q_text = qf.read()
            md_correct = re.findall(r'-\s*✅\s*\*\*([1-5A-Fa-f])\*\*', q_text)
            if md_correct:
                md_ans = md_correct[0].upper()
                db_ans = str(ans).strip().upper()
                # Check equivalence
                is_same = (db_ans == md_ans)
                if not is_same:
                    if db_ans in '12345' and md_ans in 'ABCDE':
                        is_same = ((ord(md_ans) - ord('A') + 1) == int(db_ans))
                    elif db_ans in 'ABCDE' and md_ans in '12345':
                        is_same = ((ord(db_ans) - ord('A') + 1) == int(md_ans))
                if not is_same:
                    ans_mismatches.append((qid, prop[:40] if prop else '', f"DB={db_ans}", f"MD={md_ans}"))

    print(f"Answer Key Mismatches between DB and Q-notes: {len(ans_mismatches)}")
    for item in ans_mismatches:
        print(f"   Q{item[0]}: {item[1]} | {item[2]} vs {item[3]}")

if __name__ == '__main__':
    audit_year('NL2 2565 กฎหมาย (NL Law 65)', 2252, 2281, 'Obsidian_NL_Exam/Law_Knowledge/NL2 กฏหมายรอบแรก.md')
    audit_year('NL2-2567 Part กฎหมาย', 2282, 2314, 'Obsidian_NL_Exam/Law_Knowledge/NL2-2567 Part กฎหมาย.md')
    audit_year('NL กฎหมาย รอบ 3_2568', 2315, 2344, 'Obsidian_NL_Exam/Law_Knowledge/NL กฎหมาย รอบ 3_2568.md')
    audit_year('NL กฎหมาย 2026', 2345, 2354, 'Obsidian_NL_Exam/Law_Knowledge/NL กฎหมาย 2026.md')
