import sqlite3
import json
from sqlalchemy import create_engine, text

def update_q2235():
    print("--- Updating Q2235 in SQLite and Supabase to Option 3 (2575) ---")

    explanation_data = {
        "correct_answer": "3",
        "key_takeaway": "เกณฑ์ CDE ของทันตแพทยสภากำหนดให้ใช้ 100 หน่วยกิตต่อการต่ออายุ 1 รอบ (5 ปี) โดยไม่มีนโยบายการยกยอดแต้มส่วนเกินไปใช้ในรอบถัดไป (Strictly No Carry-over) แต้มส่วนเกินจะถูกตัดทิ้งเมื่อครบ 5 ปี ดังนั้น 200 แต้มที่เก็บได้จะนำไปใช้ต่ออายุได้เพียง 1 รอบ คือคุ้มครองใบอนุญาตได้ยาวนานที่สุดถึงปี พ.ศ. 2575",
        "legal_citation": "พ.ร.บ. วิชาชีพทันตกรรม (ฉบับที่ 2) พ.ศ. 2559 มาตรา 31 และข้อบังคับทันตแพทยสภาว่าด้วยการศึกษาต่อเนื่องทางทันตแพทยศาสตร์ พ.ศ. 2560",
        "common_pitfall": "ผู้สอบมักเข้าใจผิดว่าแต้ม CDE สามารถยกยอดไปใช้ในรอบถัดไปได้ จึงนำ 200 แต้มไปคำนวณต่ออายุ 2 รอบ (ถึงปี 2580) ซึ่งผิดหลักเกณฑ์ของ ศ.ท.พ. (CDEC) ที่คะแนนจะถูกตัดรอบทุก 5 ปี ไม่มีการยกยอด",
        "core_principle": "ตาม พ.ร.บ. วิชาชีพทันตกรรม (ฉบับที่ 2) พ.ศ. 2559 และข้อบังคับทันตแพทยสภาว่าด้วยการศึกษาต่อเนื่องทางทันตแพทยศาสตร์ พ.ศ. 2560 ใบอนุญาตประกอบวิชาชีพทันตกรรมมีอายุ 5 ปี (เริ่ม 4 ก.ค. 2565 หมดอายุ 3 ก.ค. 2570) การต่ออายุต้องสะสมหน่วยกิจกรรมการศึกษาต่อเนื่อง (CDE) ไม่น้อยกว่า 100 หน่วยกิตในรอบ 5 ปี โดยทันตแพทยสภาไม่มีระเบียบให้ยกยอดคะแนนส่วนเกินไปยังรอบถัดไป ดังนั้นแต้ม 200 แต้มที่เก็บได้ในรอบแรก เมื่อนำไปยื่นต่ออายุในปี 2570 จะใช้ 100 แต้มเพื่อต่ออายุไปอีก 5 ปี ถึงวันที่ 3 กรกฎาคม พ.ศ. 2575 ส่วนแต้มที่เหลืออีก 100 แต้มจะถูกตัดทิ้ง ไม่สามารถนำไปใช้ในรอบปี 2575-2580 ได้",
        "choice_explanations": {
            "1": "✗ ไม่ถูกต้อง — การนำ 200 แต้มไปคิดเป็น 2 รอบ (10 ปี ถึง 2580) เป็นความเข้าใจผิด เนื่องจากทันตแพทยสภาไม่มีนโยบายให้ยกยอดแต้มส่วนเกินไปใช้ในรอบถัดไป",
            "2": "✗ ไม่ถูกต้อง — ปี พ.ศ. 2570 คือปีที่ใบอนุญาตรอบแรกหมดอายุ ยังไม่ได้นำแต้ม CDE มาคำนวณต่ออายุ",
            "3": "✓ ถูกต้อง — ใบอนุญาตแรกหมดอายุปี 2570 นำคะแนนมาใช้ 100 แต้มเพื่อต่ออายุได้อีก 5 ปี คุ้มครองยาวนานที่สุดถึงวันที่ 3 กรกฎาคม พ.ศ. 2575 ส่วนแต้มที่เกินอีก 100 แต้มจะถูกตัดรอบทิ้ง ไม่สามารถยกยอดได้",
            "4": "✗ ไม่ถูกต้อง — ปี 2574 ไม่ตรงกับวันครบกำหนดรอบ 5 ปี",
            "5": "✗ ไม่ถูกต้อง — ปี 2576 ไม่ตรงกับรอบระยะเวลา 5 ปีของการต่ออายุใบอนุญาต"
        },
        "future_prediction": "ข้อสอบอาจถามถึงสถานะของใบอนุญาตหากสะสม CDE ไม่ครบตามเกณฑ์ ซึ่งจะส่งผลให้ไม่สามารถต่ออายุใบอนุญาตและใบอนุญาตสิ้นผลลงทันที"
    }

    explanation_json = json.dumps(explanation_data, ensure_ascii=False)

    # 1. Update SQLite
    conn_sq = sqlite3.connect('data/exam_bank.db')
    c_sq = conn_sq.cursor()

    # Drop triggers & FTS
    c_sq.execute("DROP TRIGGER IF EXISTS questions_fts_ai")
    c_sq.execute("DROP TRIGGER IF EXISTS questions_fts_ad")
    c_sq.execute("DROP TRIGGER IF EXISTS questions_fts_au")
    c_sq.execute("DROP TABLE IF EXISTS questions_fts")

    c_sq.execute("""
        UPDATE questions 
        SET correct_answer = '3', explanation = ? 
        WHERE id = 2235
    """, (explanation_json,))

    # Rebuild FTS5
    c_sq.execute("CREATE VIRTUAL TABLE questions_fts USING fts5(question_text, stem, proposition, category, task)")
    c_sq.execute("""
        INSERT INTO questions_fts(rowid, question_text, stem, proposition, category, task)
        SELECT id, question_text, stem, proposition, category, task FROM questions
    """)

    # Recreate Triggers
    c_sq.execute("""
        CREATE TRIGGER questions_fts_ai AFTER INSERT ON questions BEGIN
            INSERT INTO questions_fts(rowid, question_text, stem, proposition, category, task)
            VALUES (new.id, new.question_text, IFNULL(new.stem,''), IFNULL(new.proposition,''), new.category, new.task);
        END
    """)
    c_sq.execute("""
        CREATE TRIGGER questions_fts_ad AFTER DELETE ON questions BEGIN
            INSERT INTO questions_fts(questions_fts, rowid, question_text, stem, proposition, category, task)
            VALUES ('delete', old.id, old.question_text, IFNULL(old.stem,''), IFNULL(old.proposition,''), old.category, old.task);
        END
    """)
    c_sq.execute("""
        CREATE TRIGGER questions_fts_au AFTER UPDATE ON questions BEGIN
            INSERT INTO questions_fts(questions_fts, rowid, question_text, stem, proposition, category, task)
            VALUES ('delete', old.id, old.question_text, IFNULL(old.stem,''), IFNULL(old.proposition,''), old.category, old.task);
            INSERT INTO questions_fts(rowid, question_text, stem, proposition, category, task)
            VALUES (new.id, new.question_text, IFNULL(new.stem,''), IFNULL(new.proposition,''), new.category, new.task);
        END
    """)
    conn_sq.commit()
    conn_sq.close()
    print("Updated SQLite Q2235: correct_answer = '3'")

    # 2. Update Supabase
    url = "postgresql://postgres.fgexylhuyaaedmtnplra:HuBAfgLaZ5IGeqpm@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require"
    engine = create_engine(url, pool_pre_ping=True)
    with engine.begin() as conn_pg:
        conn_pg.execute(text("""
            UPDATE questions 
            SET correct_answer = '3', explanation = :exp 
            WHERE id = 2235
        """), {"exp": explanation_json})
    print("Updated Supabase Q2235: correct_answer = '3'")

    # 3. Update Obsidian Note
    md_content = """---
tags:
  - กฎหมายและจรรยาบรรณ
  - พ.ร.บ._วิชาชีพทันตกรรม_พ.ศ._2537
  - NL2_2566_กฎหมาย.pdf
id: 2235
---
# คำถามที่ 2235

**Stem:**
ทันตแพทย์ A ได้รับการขึ้นทะเบียนและออกใบอนุญาตประกอบวิชาชีพทันตกรรมเมื่อวันที่ 4 กรกฎาคม พ.ศ. 2565

**Proposition:**
หากทันตแพทย์ A เก็บหน่วยกิตการศึกษาต่อเนื่อง (CDE) ได้จำนวน 200 คะแนน/แต้ม สำหรับการต่ออายุใบอนุญาต แต้มที่สะสมมานี้สามารถนำไปใช้ต่ออายุใบอนุญาตได้ยาวนานที่สุดถึงปี พ.ศ. ใด

## ตัวเลือก
- ❌ **1**: 2580
- ❌ **2**: 2570
- ✅ **3**: 2575
- ❌ **4**: 2574
- ❌ **5**: 2576


## คำอธิบาย (Explanation)

**Core Principle:**
ตาม พ.ร.บ. วิชาชีพทันตกรรม (ฉบับที่ 2) พ.ศ. 2559 มาตรา 31 และข้อบังคับทันตแพทยสภาว่าด้วยการศึกษาต่อเนื่องทางทันตแพทยศาสตร์ พ.ศ. 2560 ใบอนุญาตประกอบวิชาชีพทันตกรรมของผู้ที่ได้รับใบอนุญาตหลังวันที่ 25 พฤษภาคม 2559 มีกำหนดอายุ 5 ปี (ทันตแพทย์ A ขึ้นทะเบียนวันที่ 4 กรกฎาคม 2565 ใบอนุญาตฉบับแรกจะหมดอายุในวันที่ 3 กรกฎาคม 2570) โดยการต่ออายุใบอนุญาตในแต่ละรอบ 5 ปี ต้องมีหน่วยกิจกรรมการศึกษาต่อเนื่อง (CDE) สะสมไม่น้อยกว่า 100 หน่วยกิต

**หลักเกณฑ์สำคัญเรื่องการยกยอดหน่วยกิต (No Carry-over):**
ศูนย์การศึกษาต่อเนื่องของทันตแพทย์ (ศ.ท.พ. หรือ CDEC) **ไม่มีระเบียบให้นำคะแนน CDE ส่วนเกินยกยอดไปใช้ในรอบถัดไปได้ (Strictly No Carry-over)** เนื่องจากเจตนารมณ์ของการศึกษาต่อเนื่องคือการกระตุ้นให้ผู้ประกอบวิชาชีพศึกษาและพัฒนาความรู้ความสามารถทางวิชาการอย่างต่อเนื่องสม่ำเสมอในทุก ๆ รอบ 5 ปี ไม่สามารถสะสมแต้มล่วงหน้าเพื่อใช้ในอนาคตได้ ดังนั้น เมื่อถึงคราวหมดอายุรอบแรกในปี 2570 ทันตแพทย์ A นำแต้ม 200 แต้มมายื่นต่ออายุ ระบบจะใช้ 100 แต้มเพื่อต่ออายุใบอนุญาตออกไปอีก 5 ปี คือคุ้มครองได้ถึงวันที่ 3 กรกฎาคม พ.ศ. 2575 ส่วนแต้มที่เกินมาอีก 100 แต้มจะถูกตัดรอบทิ้ง ไม่สามารถนำไปใช้ต่ออายุในรอบปี 2575–2580 ได้

**Choice Breakdown:**
- **1**: ผิด — 2580 เป็นการคำนวณแบบคณิตศาสตร์ที่เข้าใจผิดว่าแต้ม 200 แต้มสามารถยกยอดไปใช้ต่ออายุได้ 2 รอบ (10 ปี) ซึ่งในทางกฎหมายและระเบียบ CDEC ไม่มีนโยบายยกยอดแต้มส่วนเกินข้ามรอบ
- **2**: ผิด — 2570 เป็นปีที่ใบอนุญาตรอบแรกหมดอายุ และเป็นปีที่ต้องนำแต้ม CDE มายื่นต่ออายุ ไม่ใช่ปีสุดท้ายที่ได้รับการคุ้มครองหลังต่ออายุ
- **3**: ถูกต้อง — แต้ม 200 แต้มที่เก็บได้ สามารถใช้ต่ออายุได้เพียง 1 รอบ (ใช้ 100 แต้ม) ทำให้ใบอนุญาตได้รับการต่ออายุออกไปอีก 5 ปี ถึงวันที่ 3 กรกฎาคม พ.ศ. 2575 ส่วนแต้มส่วนเกินอีก 100 แต้มจะถูกตัดทิ้ง ไม่มียกยอด
- **4**: ผิด — 2574 ไม่ตรงกับรอบระยะเวลาการต่ออายุ 5 ปี
- **5**: ผิด — 2576 ไม่ตรงกับรอบระยะเวลาการต่ออายุ 5 ปี
"""
    with open("Obsidian_NL_Exam/Q2235_กฎหมายและจรรยาบรรณ.md", "w", encoding="utf-8") as f:
        f.write(md_content)
    print("Updated Obsidian Note Q2235 successfully!")

if __name__ == '__main__':
    update_q2235()
