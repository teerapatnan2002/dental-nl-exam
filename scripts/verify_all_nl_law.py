import sqlite3
import re
from sqlalchemy import create_engine, text

def run_verification():
    print("=" * 60)
    print("COMPREHENSIVE VERIFICATION OF ALL NL LAW EXAMS (2565 - 2026)")
    print("=" * 60)

    # 1. Connect to SQLite
    conn_sq = sqlite3.connect('data/exam_bank.db')
    c_sq = conn_sq.cursor()

    # 2. Connect to Supabase
    url = "postgresql://postgres.fgexylhuyaaedmtnplra:HuBAfgLaZ5IGeqpm@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require"
    engine = create_engine(url, pool_pre_ping=True)

    # Corrupt patterns to look for
    corrupt_patterns = [
        'เป-น', 'เป<น', 'เปeน', 'เปdด', 'ฟZน', 'ฟfน', 'ฟ.น', 'ศีรษะนิรนำม',
        'ข5อ', 'ขUอ', 'ข=อ', 'ไม5', 'ไมF', 'ไม)', 'ได5', 'ไดU', 'ได;', 'ให5', 'ใหU', 'ให;', 'ใหั',
        'แล5ว', 'แลUว', 'ป3', 'ปS', 'ป`', 'คFา', 'ค5า', 'หนFวย', 'หน)วย', 'ตFอ', 'ต)', 'แหFง', 'แห5ง',
        'ผูU', 'ผู5', 'ปnวย', 'ปMวย', 'ฟaอง', 'ฟYอง', 'รUอง', 'ร5อง', 'อุทรณG', 'ประสบการณG',
        'นำย', 'มีนำคม', 'เป0า', 'สิ1น', 'ครั1ง', 'ที,', 'เพื,อ'
    ]

    total_checked = 0
    ocr_issues = []
    parity_diffs = []
    choice_count_checks = {}

    with engine.connect() as conn_pg:
        # Check all questions in range 2222 to 2354
        c_sq.execute("SELECT id, stem, proposition, question_text, correct_answer FROM questions WHERE id BETWEEN 2222 AND 2354 ORDER BY id")
        sq_questions = c_sq.fetchall()

        for qid, stem, prop, qt, ans in sq_questions:
            total_checked += 1
            # Check SQLite choices
            c_sq.execute("SELECT label, text FROM choices WHERE question_id = ? ORDER BY label", (qid,))
            sq_choices = c_sq.fetchall()
            choice_count_checks[qid] = len(sq_choices)

            # Check for OCR artifacts in SQLite
            full_sq = f"{stem or ''} {prop or ''} {qt or ''} " + " ".join([t for l, t in sq_choices])
            for pat in corrupt_patterns:
                if pat in full_sq:
                    ocr_issues.append((qid, pat))

            # Fetch corresponding PG question
            pg_q = conn_pg.execute(text("SELECT stem, proposition, question_text, correct_answer FROM questions WHERE id = :id"), {"id": qid}).fetchone()
            if not pg_q:
                parity_diffs.append(f"Q{qid} missing in Supabase!")
                continue

            pg_choices = conn_pg.execute(text("SELECT label, text FROM choices WHERE question_id = :qid ORDER BY label"), {"qid": qid}).fetchall()

            # Compare choice count
            if len(sq_choices) != len(pg_choices):
                parity_diffs.append(f"Q{qid} choice count mismatch: SQLite={len(sq_choices)} vs PG={len(pg_choices)}")

            # Compare correct_answer
            if str(ans).strip().upper() != str(pg_q[3]).strip().upper():
                parity_diffs.append(f"Q{qid} correct_answer mismatch: SQLite={ans} vs PG={pg_q[3]}")

            # Compare question_text
            if (qt or '').strip() != (pg_q[2] or '').strip():
                parity_diffs.append(f"Q{qid} question_text mismatch between SQLite and PG")

            # Compare choices texts
            sq_dict = {str(l).strip().upper(): t.strip() for l, t in sq_choices}
            pg_dict = {str(l).strip().upper(): t.strip() for l, t in pg_choices}
            for lbl, sq_t in sq_dict.items():
                if lbl not in pg_dict:
                    parity_diffs.append(f"Q{qid} choice {lbl} missing in PG")
                elif sq_t != pg_dict[lbl]:
                    parity_diffs.append(f"Q{qid} choice {lbl} text differs between SQLite and PG")

    # Check FTS5
    c_sq.execute("SELECT count(*) FROM questions_fts")
    fts_count = c_sq.fetchone()[0]
    c_sq.execute("SELECT count(*) FROM questions")
    q_count = c_sq.fetchone()[0]

    # Check Q2230 and Q2281 specifically
    q2230_cnt = choice_count_checks.get(2230)
    q2281_cnt = choice_count_checks.get(2281)

    conn_sq.close()

    print(f"\n1. Total NL Law Questions Checked: {total_checked}")
    print(f"2. FTS5 Index Count: {fts_count} / {q_count} questions")
    print(f"3. Specific Golden Rule Validations:")
    print(f"   - Q2230 (Year 2566) choice count: {q2230_cnt} (Expected: 4, No artificial Choice 5)")
    print(f"   - Q2281 (Year 2565) choice count: {q2281_cnt} (Expected: 4, No artificial Choice E)")
    print(f"4. Remaining OCR / Tone Drifting Artifacts: {len(ocr_issues)}")
    if ocr_issues:
        for q, p in ocr_issues:
            print(f"   - Q{q}: '{p}'")
    print(f"5. Discrepancies between SQLite and Supabase: {len(parity_diffs)}")
    if parity_diffs:
        for diff in parity_diffs[:10]:
            print(f"   - {diff}")
    
    if len(ocr_issues) == 0 and len(parity_diffs) == 0 and q2230_cnt == 4 and q2281_cnt == 4 and fts_count == q_count:
        print("\n>>> ALL CHECKS PASSED WITH 100% PERFECTION! <<<")
    else:
        print("\n>>> WARNING: ISSUES FOUND! <<<")

if __name__ == '__main__':
    run_verification()
