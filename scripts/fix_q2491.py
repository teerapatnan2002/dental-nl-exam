import sqlite3
import json
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

NEW_CORRECT_ANSWER = "ก"
NEW_EXPLANATION = {
    "correct_answer": "ก",
    "key_takeaway": "ผู้ดำเนินการสถานพยาบาล (ประเภทไม่รับผู้ป่วยค้างคืน) สามารถเป็นได้ไม่เกิน 2 แห่ง โดยเวลาทำการต้องไม่ซ้ำซ้อนกันและดูแลได้ใกล้ชิด",
    "core_principle": "ตาม พ.ร.บ. สถานพยาบาล พ.ศ. 2541 มาตรา 25 บัญญัติคุณสมบัติของผู้ขอรับใบอนุญาตเป็นผู้ดำเนินการสถานพยาบาลไว้ว่า (2) ต้องไม่เป็นผู้ดำเนินการอยู่แล้วสองแห่ง และ (3) สามารถควบคุมดูแลกิจการสถานพยาบาลได้โดยใกล้ชิดตลอดเวลาที่เปิดทำการ ดังนั้น ทันตแพทย์ กฤษณ์ ซึ่งปัจจุบันเป็นผู้ดำเนินการอยู่เพียง 1 แห่ง จึงสามารถขอเป็นผู้ดำเนินการในคลินิกแห่งที่ 2 ได้ โดยมีเงื่อนไขสำคัญคือเวลาเปิดทำการของคลินิกทั้งสองแห่งต้องไม่ซ้ำซ้อนกัน และต้องควบคุมดูแลได้อย่างใกล้ชิดจริงตลอดเวลาที่เปิดทำการ (หากเป็นสถานพยาบาลประเภทรับผู้ป่วยค้างคืน/โรงพยาบาล จะเป็นได้เพียง 1 แห่งเท่านั้น)",
    "legal_citation": "พ.ร.บ. สถานพยาบาล พ.ศ. 2541 มาตรา 25 (2) และ (3)",
    "cognitive_level": "Comprehension",
    "tos_code": "1.2 พ.ร.บ. สถานพยาบาล: คุณสมบัติและจำนวนแห่งของผู้ดำเนินการสถานพยาบาล",
    "common_pitfall": "สับสนคิดว่ากฎหมายห้ามเกิน 1 แห่งอย่างเด็ดขาดทุกกรณี ซึ่งความจริงมาตรา 25 (2) ห้ามเฉพาะผู้ที่เป็น 'ผู้ดำเนินการอยู่แล้วสองแห่ง' ดังนั้นสำหรับคลินิก (ไม่รับผู้ป่วยค้างคืน) สามารถเป็นได้สูงสุด 2 แห่ง โดยมีเงื่อนไขเหล็กคือเวลาทำการต้องไม่ทับซ้อนกัน",
    "choice_explanations": {
        "ก": "✓ ถูกต้อง — ตามมาตรา 25 (2) กฎหมายห้ามเฉพาะผู้ที่เป็นผู้ดำเนินการอยู่แล้วสองแห่ง ดังนั้นจึงสามารถเป็นผู้ดำเนินการแห่งที่สองได้ หากเวลาเปิดทำการไม่ซ้ำซ้อนกันและควบคุมดูแลได้โดยใกล้ชิดตามมาตรา 25 (3)",
        "ข": "✗ ไม่ถูกต้อง — กฎหมายไม่ได้กำหนดให้ขึ้นอยู่กับการขอความเห็นชอบเป็นกรณีพิเศษจากผู้อนุญาต แต่เป็นคุณสมบัติตามเกณฑ์มาตรา 25 ที่เวลาต้องไม่ตรงกัน",
        "ค": "✗ ไม่ถูกต้อง — กฎหมายไม่ได้จำกัดไว้เพียงแห่งเดียวเด็ดขาดสำหรับคลินิก (ประเภทไม่รับผู้ป่วยค้างคืน) แต่จำกัดไว้ไม่เกิน 2 แห่ง (ต่างจากประเภทรับผู้ป่วยค้างคืน/โรงพยาบาลที่ได้เพียงแห่งเดียว)",
        "ง": "✗ ไม่ถูกต้อง — ผู้ช่วยทันตแพทย์ไม่มีคุณสมบัติในการประกอบวิชาชีพ ไม่สามารถควบคุมดูแลคลินิกแทนผู้ดำเนินการได้",
        "จ": "✗ ไม่ถูกต้อง — กฎหมายไม่ได้กำหนดเกณฑ์ชั่วโมงขั้นต่ำ 20 ชั่วโมงต่อสัปดาห์ แต่กำหนดให้ต้องควบคุมดูแลได้โดยใกล้ชิดตลอดเวลาเปิดทำการ"
    },
    "future_prediction": "ข้อสอบมักเปรียบเทียบระหว่าง ผู้รับใบอนุญาตประกอบกิจการ (ไม่จำกัดจำนวนแห่ง) vs ผู้ดำเนินการคลินิก (ไม่เกิน 2 แห่ง เวลาไม่ตรงกัน) vs ผู้ดำเนินการโรงพยาบาล (ได้แค่ 1 แห่งเท่านั้น)"
}

exp_json = json.dumps(NEW_EXPLANATION, ensure_ascii=False)

# 1. Update SQLite
print("1. Updating SQLite (data/exam_bank.db)...")
conn = sqlite3.connect("data/exam_bank.db")
c = conn.cursor()
c.execute("UPDATE questions SET correct_answer = ?, explanation = ? WHERE id = 2491", (NEW_CORRECT_ANSWER, exp_json))
conn.commit()
conn.close()
print("   -> SQLite updated successfully.")

# 2. Update Supabase
print("2. Updating Supabase PostgreSQL...")
db_url = os.getenv("DATABASE_URL")
if db_url:
    engine = create_engine(db_url)
    with engine.begin() as sconn:
        sconn.execute(
            text("UPDATE questions SET correct_answer = :ans, explanation = :exp WHERE id = 2491"),
            {"ans": NEW_CORRECT_ANSWER, "exp": exp_json}
        )
    print("   -> Supabase updated successfully.")
else:
    print("   -> DATABASE_URL not found, skipped Supabase.")

# 3. Update scratch/dsat_mock_set4.json
if os.path.exists("scratch/dsat_mock_set4.json"):
    print("3. Updating scratch/dsat_mock_set4.json...")
    with open("scratch/dsat_mock_set4.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    for q in data:
        if q["id"] == 2491:
            q["correct_answer"] = NEW_CORRECT_ANSWER
            q["explanation"] = NEW_EXPLANATION
    with open("scratch/dsat_mock_set4.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("   -> scratch json updated.")

# 4. Update Obsidian note Q2491
obsidian_file = "Obsidian_NL_Exam/Q2491_กฎหมายและจรรยาบรรณ.md"
if os.path.exists(obsidian_file):
    print("4. Updating Obsidian note Q2491...")
    q_md = f"""# 📌 Question ID: 2491

**ชุดข้อสอบ:** DSAT Mock Law ชุดที่ 4 (2570)  
**หมวดวิชา:** กฎหมายและจรรยาบรรณ  
**หัวข้อสมรรถนะ:** พ.ร.บ. สถานพยาบาล พ.ศ. 2541: คุณสมบัติและข้อจำกัดของผู้ดำเนินการ  
**ระดับการเรียนรู้ (Cognitive Level):** Comprehension  
**รหัส TOS:** 1.2 พ.ร.บ. สถานพยาบาล: คุณสมบัติและจำนวนแห่งของผู้ดำเนินการสถานพยาบาล  

---

### 📖 สถานการณ์ทางคลินิก (Stem)
ทันตแพทย์ กฤษณ์ มีใบอนุญาตเป็นผู้ประกอบวิชาชีพทันตกรรม ได้ร่วมลงทุนกับนาย ธีระ (นักธุรกิจซึ่งมิได้เป็นบุคลากรทางการแพทย์) เพื่อจัดตั้งคลินิกทันตกรรมเอกชนแห่งหนึ่งในเขตกรุงเทพมหานคร โดยมีมติให้นาย ธีระ เป็นผู้ยื่นคำขอรับใบอนุญาตให้ประกอบกิจการสถานพยาบาล และทันตแพทย์ กฤษณ์ เป็นผู้ยื่นคำขอรับใบอนุญาตให้เป็นผู้ดำเนินการสถานพยาบาล ทั้งสองได้รับใบอนุญาตอย่างถูกต้องเมื่อวันที่ 15 มีนาคม 2568

### ❓ คำถาม (Proposition)
หากทันตแพทย์ กฤษณ์ ประสงค์จะไปเป็นผู้ดำเนินการสถานพยาบาลในคลินิกทันตกรรมอีกแห่งหนึ่งในจังหวัดนนทบุรี ทันตแพทย์ กฤษณ์ สามารถดำเนินการได้หรือไม่ เพราะเหตุใด?

### 🔘 ตัวเลือก (Choices)
- **ก.** ได้ หากคลินิกทั้งสองแห่งเปิดทำการในช่วงเวลาที่ไม่ตรงกัน
- **ข.** ได้ หากได้รับความเห็นชอบเป็นลายลักษณ์อักษรจากผู้อนุญาตทั้งสองจังหวัด
- **ค.** ไม่ได้ เพราะผู้ดำเนินการสถานพยาบาลเป็นผู้ดำเนินการได้คราวละ 1 แห่งเท่านั้น
- **ง.** ไม่ได้ เว้นแต่คลินิกแห่งที่สองจะมีผู้ช่วยทันตแพทย์ปฏิบัติงานแทนในเวลาที่ไม่อยู่
- **จ.** ได้ หากทันตแพทย์ กฤษณ์ เดินทางไปควบคุมดูแลคลินิกทั้งสองแห่งได้จริงไม่น้อยกว่าสัปดาห์ละ 20 ชั่วโมง

---

### 🎯 เฉลยและการวิเคราะห์อย่างละเอียด
**เฉลยที่ถูกต้อง:** **ก**

#### 🔑 Key Takeaway
{NEW_EXPLANATION["key_takeaway"]}

#### ⚖️ หลักการสำคัญและข้อกฎหมาย (Core Principle & Legal Citation)
- **พ.ร.บ. สถานพยาบาล พ.ศ. 2541 มาตรา 25 (2) และ (3)**
{NEW_EXPLANATION["core_principle"]}

#### 🔍 วิเคราะห์ตัวเลือกรายข้อ (Choice Explanations)
- **ก.** {NEW_EXPLANATION["choice_explanations"]["ก"]}
- **ข.** {NEW_EXPLANATION["choice_explanations"]["ข"]}
- **ค.** {NEW_EXPLANATION["choice_explanations"]["ค"]}
- **ง.** {NEW_EXPLANATION["choice_explanations"]["ง"]}
- **จ.** {NEW_EXPLANATION["choice_explanations"]["จ"]}

#### ⚠️ จุดลวงที่พบบ่อย (Common Pitfall)
{NEW_EXPLANATION["common_pitfall"]}

#### 🔮 แนวโน้มข้อสอบในอนาคต (Future Prediction)
{NEW_EXPLANATION["future_prediction"]}
"""
    with open(obsidian_file, "w", encoding="utf-8") as f:
        f.write(q_md)
    print("   -> Obsidian Q2491 updated successfully.")

# 5. Update scripts/generate_and_sync_mock4.py definition for Q2491
print("5. Updating scripts/generate_and_sync_mock4.py...")
with open("scripts/generate_and_sync_mock4.py", "r", encoding="utf-8") as f:
    gen_content = f.read()

# Replace in generate script
old_snippet = '''        "correct_answer": "ค",
        "explanation": {
            "correct_answer": "ค",
            "key_takeaway": "ผู้ดำเนินการสถานพยาบาลสามารถเป็นผู้ดำเนินการได้เพียง '1 แห่งในเวลาเดียวกัน' เท่านั้น",'''

new_snippet = '''        "correct_answer": "ก",
        "explanation": {
            "correct_answer": "ก",
            "key_takeaway": "ผู้ดำเนินการสถานพยาบาล (ประเภทไม่รับผู้ป่วยค้างคืน) สามารถเป็นได้ไม่เกิน 2 แห่ง โดยเวลาทำการต้องไม่ซ้ำซ้อนกันและดูแลได้ใกล้ชิด",'''

if old_snippet in gen_content:
    gen_content = gen_content.replace(old_snippet, new_snippet)
    with open("scripts/generate_and_sync_mock4.py", "w", encoding="utf-8") as f:
        f.write(gen_content)
    print("   -> generate_and_sync_mock4.py updated.")

print("\nAll updates completed successfully!")
