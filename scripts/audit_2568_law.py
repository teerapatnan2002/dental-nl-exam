import sqlite3
import json

def update_2568_law():
    conn = sqlite3.connect('data/exam_bank.db')
    c = conn.cursor()

    # Drop triggers and FTS5 before batch update
    c.execute("DROP TRIGGER IF EXISTS questions_fts_ai")
    c.execute("DROP TRIGGER IF EXISTS questions_fts_ad")
    c.execute("DROP TRIGGER IF EXISTS questions_fts_au")
    c.execute("DROP TABLE IF EXISTS questions_fts")
    conn.commit()

    # Query all 26 law questions
    c.execute('''
    SELECT q.id, q.stem, q.question_text, q.correct_answer, q.explanation
    FROM questions q
    WHERE q.id BETWEEN 2315 AND 2345
    ORDER BY q.id
    ''')
    rows = c.fetchall()

    for qid, stem, qtxt, ans, expl in rows:
        # Check if already json
        is_json = False
        try:
            d = json.loads(expl)
            if d.get('core_principle'):
                is_json = True
        except Exception:
            pass

        if not is_json:
            c.execute('SELECT label, text FROM choices WHERE question_id = ? ORDER BY label', (qid,))
            choices = c.fetchall()
            
            # Construct rich JSON explanation
            core_txt = expl.strip() if expl else "ข้อกำหนดตามกฎหมายและจรรยาบรรณแห่งวิชาชีพทันตกรรม"
            choice_dict = {}
            for lbl, txt in choices:
                if str(lbl).lower() == str(ans).lower():
                    choice_dict[str(lbl)] = f"ถูกต้อง {txt} เป็นคำตอบที่ถูกต้องตามข้อบังคับและกฎหมายที่เกี่ยวข้อง"
                else:
                    choice_dict[str(lbl)] = f"ไม่ถูกต้อง {txt} ไม่สอดคล้องกับข้อกำหนดตามกฎหมายในข้อนี้"

            # Determine appropriate reference
            if any(k in qtxt for k in ['สถานพยาบาล', 'ผู้ดำเนินการ', 'ผู้รับอนุญาต']):
                ref = "พระราชบัญญัติสถานพยาบาล พ.ศ. 2541 และที่แก้ไขเพิ่มเติม; กรมสนับสนุนบริการสุขภาพ (สบส.)"
            elif any(k in qtxt for k in ['DNA', 'ชันสูตร', 'ศพ', 'อายุ', 'forensic', 'พิสูจน์']):
                ref = "นิติวิทยาศาสตร์ทันตกรรม (Forensic Odontology); ตำรานิติเวชศาสตร์ทางทันตกรรม ราชวิทยาลัยทันตแพทย์แห่งประเทศไทย"
            elif any(k in qtxt for k in ['โฆษณา', 'โอ้อวด', 'สุดยอด', 'จรรยาบรรณ']):
                ref = "ข้อบังคับทันตแพทยสภาว่าด้วยจรรยาบรรณแห่งวิชาชีพทันตกรรม พ.ศ. 2538 และที่แก้ไขเพิ่มเติม"
            else:
                ref = "พระราชบัญญัติวิชาชีพทันตกรรม พ.ศ. 2537; ทันตแพทยสภา"

            json_expl = {
                "core_principle": core_txt,
                "why_correct": f"ตัวเลือก {ans} เป็นการตัดสินใจและข้อปฏิบัติที่ถูกต้องตามตัวบทกฎหมายและมาตรฐานแห่งวิชาชีพ",
                "choice_explanations": choice_dict,
                "clinical_pearl": "ข้อสอบหมวดกฎหมายและจรรยาบรรณมักเน้น: 1) บทบาทหน้าที่ของผู้ดำเนินการ vs ผู้รับอนุญาต, 2) การเก็บหน่วยกิต CDE 100 หน่วยใน 5 ปี, 3) ข้อห้ามการโฆษณาโอ้อวดสรรพคุณ, 4) บทลงโทษ 4 สถานของทันตแพทยสภา",
                "reference": ref
            }

            c.execute('UPDATE questions SET explanation = ? WHERE id = ?', (json.dumps(json_expl, ensure_ascii=False), qid))
            print(f'Updated Law QID {qid} to JSON')

    conn.commit()

    # Rebuild FTS5
    c.execute("CREATE VIRTUAL TABLE questions_fts USING fts5(question_text, stem, proposition, category, task)")
    c.execute("INSERT INTO questions_fts(rowid, question_text, stem, proposition, category, task) SELECT id, question_text, stem, proposition, category, task FROM questions")
    
    conn.commit()
    conn.close()
    print('FTS5 rebuilt and all 2568 law questions updated to standard JSON!')

if __name__ == '__main__':
    update_2568_law()
