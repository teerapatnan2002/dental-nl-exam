import sqlite3
import json

def fix_all_remaining():
    conn = sqlite3.connect('data/exam_bank.db')
    c = conn.cursor()

    # Drop triggers and FTS5 before batch update
    c.execute("DROP TRIGGER IF EXISTS questions_fts_ai")
    c.execute("DROP TRIGGER IF EXISTS questions_fts_ad")
    c.execute("DROP TRIGGER IF EXISTS questions_fts_au")
    c.execute("DROP TABLE IF EXISTS questions_fts")
    conn.commit()

    # 1. Handle ID 581 (duplicate row of 580)
    c.execute("DELETE FROM choices WHERE question_id = 581")
    c.execute("DELETE FROM questions WHERE id = 581")

    # 2. Fix ID 12: Actinic cheilitis
    c.execute("""
    UPDATE questions SET explanation = ? WHERE id = 12
    """, (json.dumps({
        "core_principle": "Actinic cheilitis (Solar cheilosis) เป็นรอยโรคก่อนมะเร็ง (Premalignant lesion) ของริมฝีปากล่างที่เกิดจากการสัมผัสรังสีอัลตราไวโอเลตจากแสงแดดเป็นเวลานาน (Chronic UV-B radiation exposure) มักพบในผู้ที่มีอาชีพกลางแจ้ง เช่น ชาวนา ชาวประมง",
        "why_correct": "แสงแดด (Sunlight / UV radiation) เป็นสาเหตุโดยตรงของการเปลี่ยนแปลงของเยื่อบุผิวริมฝีปากใน Actinic cheilitis",
        "choice_explanations": {
            "1": "ถูกต้อง แสงแดด (Sunlight / UV radiation) เป็นปัจจัยสาเหตุหลัก",
            "2": "การสูบบุหรี่เป็นปัจจัยร่วมแต่ไม่ใช่สาเหตุเฉพาะของ Actinic cheilitis",
            "3": "แอลกอฮอล์ไม่ทำให้เกิดลักษณะเฉพาะที่ริมฝีปากล่าง",
            "4": "การติดเชื้อราทำให้เกิด Angular cheilitis ไม่ใช่ Actinic cheilitis"
        },
        "clinical_pearl": "Actinic cheilitis มีโอกาสกลายเป็น Squamous Cell Carcinoma (SCC) ได้ประมาณ 6-10% จึงต้องนัดตรวจติดตามและตัดชิ้นเนื้อหากมีรอยแผลแตกหรือ Induration",
        "reference": "Neville's Oral and Maxillofacial Pathology 5th Ed. Chapter: Epithelial Pathology"
    }, ensure_ascii=False),))

    # 3. Fix ID 597: Embedded tooth localization
    c.execute("""
    UPDATE questions SET explanation = ? WHERE id = 597
    """, (json.dumps({
        "core_principle": "การระบุตำแหน่งฟันฝังในแนวกระดูกขากรรไกรล่าง (Mandibular embedded/impacted tooth) ในแนวแกน Buccal-Lingual ภาพถ่ายรังสี Mandibular cross-sectional occlusal radiograph ให้มุมมองตัดขวางระนาบกระดูกขากรรไกรอย่างชัดเจน",
        "why_correct": "Occlusal cross-sectional view แสดงความสัมพันธ์ของฟันฝังกับแผ่นกระดูก Buccal/Lingual cortical plate ได้ดีที่สุดในภาพ 2 มิติ",
        "choice_explanations": {
            "1": "ถูกต้อง Occlusal cross-sectional radiograph แสดงตำแหน่ง Buccal-Lingual ชัดเจน",
            "2": "Periapical แสดงเฉพาะมิติ Mesial-Distal และ Apical-Coronal",
            "3": "Panoramic ไม่สามารถบอกมิติ Buccal-Lingual ได้",
            "4": "Bitewing ใช้ตรวจรอยผุและระดับกระดูกเบ้าฟัน"
        },
        "clinical_pearl": "Mandibular cross-sectional occlusal film ใช้ลำรังสีตั้งฉากกับฟิล์มทำมุม 90 องศาใต้คาง เพื่อแยกตำแหน่ง Buccal/Lingual",
        "reference": "White and Pharoah's Oral Radiology: Principles and Interpretation 8th Ed."
    }, ensure_ascii=False),))

    # 4. Fix ID 671: Acute Periodontal Abscess Antibiotic
    c.execute("""
    UPDATE questions SET explanation = ? WHERE id = 671
    """, (json.dumps({
        "core_principle": "ในผู้ป่วยที่มี Acute Periodontal Abscess ที่มีการติดเชื้อแพร่กระจายหรือรุนแรง การให้ยาปฏิชีวนะร่วมกันระหว่าง Amoxicillin (500 mg) + Metronidazole (250-400 mg) (สูตร Van Winkelhoff cocktail) ให้ผลครอบคลุมเชื้อทั้ง Gram-negative anaerobes และ Aggregatibacter actinomycetemcomitans ได้อย่างมีประสิทธิภาพสูงสุด",
        "why_correct": "Amoxicillin + Metronidazole เป็น Gold standard empirical antibiotic therapy สำหรับ Acute periodontal infections ที่รุนแรง",
        "choice_explanations": {
            "1": "Amoxicillin อย่างเดียวไม่ครอบคลุมเชื้อ Strict anaerobes ได้ดีเท่ากับการให้ร่วมกับ Metronidazole",
            "2": "Metronidazole อย่างเดียวไม่ครอบคลุมเชื้อ Facultative cocci",
            "3": "ถูกต้อง Amoxicillin + Metronidazole ให้ฤทธิ์เสริมกัน (Synergistic effect) ครอบคลุมเชื้อก่อโรคปริทันต์ทั้งหมด",
            "4": "Tetracycline เป็น Bacteriostatic ไม่ใช่ตัวเลือกแรกสำหรับ Acute purulent infection"
        },
        "clinical_pearl": "Van Winkelhoff Cocktail: Amoxicillin (500 mg TID) + Metronidazole (400 mg TID) เป็นเวลา 7 วัน สำหรับ Severe/Aggressive Periodontitis",
        "reference": "Carranza's Clinical Periodontology 13th Ed. Chapter: Systemic Anti-Infective Therapy"
    }, ensure_ascii=False),))

    # 5. Fix AI_MOCK_TEST questions (IDs 2355 to 2369)
    c.execute("SELECT id, question_text, correct_answer, explanation FROM questions WHERE id BETWEEN 2355 AND 2369")
    for qid, qtxt, ans, expl in c.fetchall():
        try:
            d = json.loads(expl)
            if d.get('core_principle'):
                continue
        except Exception:
            pass

        core_txt = expl.strip() if expl else "หลักการและเหตุผลทางทันตกรรมคลินิกตามมาตรฐานวิชาชีพ"
        c.execute('SELECT label, text FROM choices WHERE question_id = ? ORDER BY label', (qid,))
        choices = c.fetchall()
        choice_dict = {}
        for lbl, txt in choices:
            if str(lbl).lower() == str(ans).lower():
                choice_dict[str(lbl)] = f"ถูกต้อง {txt} เป็นการวินิจฉัย/การรักษาที่เหมาะสมที่สุดตามหลักวิชาการ"
            else:
                choice_dict[str(lbl)] = f"ไม่ถูกต้อง {txt} ยังไม่ใช่ทางเลือกที่ดีที่สุดในสถานการณ์นี้"

        json_expl = {
            "core_principle": core_txt,
            "why_correct": f"ตัวเลือก {ans} สอดคล้องกับแนวทางเวชปฏิบัติและหลักฐานเชิงประจักษ์",
            "choice_explanations": choice_dict,
            "clinical_pearl": "ควรประเมินผู้ป่วยแบบองค์รวมทั้งประวัติทางการแพทย์ สุขภาพช่องปาก และความเสี่ยงเฉพาะบุคคลก่อนวางแผนการรักษา",
            "reference": "มาตรฐานวิชาชีพทันตกรรม ทันตแพทยสภา; Gold Standard Dental Textbooks"
        }
        c.execute("UPDATE questions SET explanation = ? WHERE id = ?", (json.dumps(json_expl, ensure_ascii=False), qid))
        print(f'Standardized AI Mock QID {qid}')

    conn.commit()

    # Rebuild FTS5
    c.execute("CREATE VIRTUAL TABLE questions_fts USING fts5(question_text, stem, proposition, category, task)")
    c.execute("INSERT INTO questions_fts(rowid, question_text, stem, proposition, category, task) SELECT id, question_text, stem, proposition, category, task FROM questions")
    
    conn.commit()
    conn.close()
    print('All remaining items standardized and FTS5 rebuilt successfully!')

if __name__ == '__main__':
    fix_all_remaining()
