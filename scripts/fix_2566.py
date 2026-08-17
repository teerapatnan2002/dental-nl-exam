import sqlite3
import json

def fix_2566_missing():
    conn = sqlite3.connect('data/exam_bank.db')
    c = conn.cursor()

    # Drop triggers and FTS5 before batch update
    c.execute("DROP TRIGGER IF EXISTS questions_fts_ai")
    c.execute("DROP TRIGGER IF EXISTS questions_fts_ad")
    c.execute("DROP TRIGGER IF EXISTS questions_fts_au")
    c.execute("DROP TABLE IF EXISTS questions_fts")
    conn.commit()

    stem6_text = "STEM 6: รูป : ฟันแท้ 32, 42 ขึ้นครึ่งนึง Lingual ต่อ 72, 82 | 36 deep Pit&fissure, 46 resin sealant ขึ้นเต็ม เด็กหญิงอายุ 10 ปี ฟันขึ้นซ้อน 72, 82 โยก 2 degree"

    c.execute("DELETE FROM choices WHERE question_id = 1122")
    c.execute("""
    UPDATE questions SET 
        stem = ?, 
        question_text = 'ฟันแท้ที่ขึ้นซ้อนทางด้านลิ้นนี้เกิดจากอะไร',
        proposition = 'ฟันแท้ที่ขึ้นซ้อนทางด้านลิ้นนี้เกิดจากอะไร',
        correct_answer = '1',
        category = 'ทันตกรรมสำหรับเด็ก',
        explanation = ?
    WHERE id = 1122
    """, (stem6_text, json.dumps({
        "core_principle": "หน่อฟันแท้ของฟันตัดล่าง (Mandibular permanent incisors) วางตัวอยู่ทางด้าน Lingual ต่อรากฟันน้ำนมตามธรรมชาติ เมื่อฟันแท้เริ่มงอกขึ้นมักจะโผล่ขึ้นทางด้าน Lingual (Lingual eruption path) หากรากฟันน้ำนมยังไม่ละลายหมดหรือหลุดช้า (Over-retained primary incisors) จะทำให้เห็นเป็นฟันขึ้นซ้อนสองแถว (Shark teeth / Double row of teeth)",
        "why_correct": "การขึ้นของฟันแท้ทางด้านลิ้นเป็นแนวทางการขึ้นตามปกติของหน่อฟันตัดล่างร่วมกับการที่ฟันน้ำนมยังไม่หลุด",
        "choice_explanations": {
            "1": "ถูกต้อง เป็นแนวทางการงอกขึ้นตามธรรมชาติทางด้าน Lingual ของหน่อฟันตัดแท้ล่าง",
            "2": "รากฟันน้ำนมไม่ละลายเป็นปัจจัยร่วมแต่สาเหตุที่ฟันแท้อยู่ด้านในเกิดจากตำแหน่งหน่อฟันแท้",
            "3": "ฟันน้ำนมหลุดช้าเป็นผลสืบเนื่อง",
            "4": "เนื้อเยื่อเหงือกหนาไม่เกี่ยวข้องกับตำแหน่ง Lingual",
            "5": "ขนาดขากรรไกรเล็กอาจทำให้ฟันซ้อนเกแต่ไม่ได้กำหนดแนวทางการขึ้นด้านลิ้น"
        },
        "clinical_pearl": "Mandibular incisors lingual eruption: หน่อฟันแท้ตัดล่างอยู่ด้าน Lingual เสมอ เมื่อถอนฟันน้ำนมที่ขวางออก แรงดันจากลิ้น (Tongue pressure) จะดันฟันแท้ให้เคลื่อนมาข้างหน้าเข้าสู่แนวโค้งฟันได้เองตามธรรมชาติ",
        "reference": "McDonald and Avery's Dentistry for the Child and Adolescent 11th Ed.; Proffit Contemporary Orthodontics 6th Ed."
    }, ensure_ascii=False)))

    for lbl, txt in [
        ('1', 'แนวทางการงอกขึ้นตามธรรมชาติของหน่อฟันแท้ตัดล่างทางด้านลิ้น (Lingual eruption path)'),
        ('2', 'รากฟันน้ำนมไม่ละลายตัว'),
        ('3', 'ฟันน้ำนมหลุดช้ากว่าปกติ (Delayed exfoliation)'),
        ('4', 'พังผืดเหงือกหนาผิดปกติ'),
        ('5', 'ขากรรไกรล่างมีขนาดเล็กเกินไป')
    ]:
        c.execute("INSERT INTO choices (question_id, label, text) VALUES (1122, ?, ?)", (lbl, txt))

    conn.commit()

    # Rebuild FTS5
    c.execute("CREATE VIRTUAL TABLE questions_fts USING fts5(question_text, stem, proposition, category, task)")
    c.execute("INSERT INTO questions_fts(rowid, question_text, stem, proposition, category, task) SELECT id, question_text, stem, proposition, category, task FROM questions")
    
    conn.commit()
    conn.close()
    print('ID 1122 in 2566 Part 4 fixed and FTS5 rebuilt successfully!')

if __name__ == '__main__':
    fix_2566_missing()
