import sqlite3
import re

conn = sqlite3.connect('data/exam_bank.db')
c = conn.cursor()

# Dictionary of replacements: OCR error -> Correct Thai
replacements = {
    r'ไไข้': 'ไข้',
    r'มถ่ อด': 'ไม่ถอด',
    r'ฟน\s*ปลอม': 'ฟันปลอม',
    r'อาฟน': 'เอาฟัน',
    r'แชน่ าํ': 'แช่น้ำ',
    r'สง่ ผ่า น': 'ส่งผ่าน',
    r'แนือ้': 'เนื้อ',
    r'ใหรู้ป': 'ให้รูป',
    r'ใหป้ระวัติ': 'ให้ประวัติ',
    r'ผูป้ว่ย': 'ผู้ป่วย',
    r'ลิน้': 'ลิ้น',
    r'แกม้': 'แก้ม',
    r'กระพุง้': 'กระพุ้ง',
    r'ใหภ้าพ': 'ให้ภาพ',
    r'ฟ.น': 'ฟัน',
    r'ป_': 'ปี',
    r'ซี,': 'ซี่',
    r'ครั1งที,': 'ครั้งที่',
    r'ดื,ม': 'ดื่ม',
    r'เป6น': 'เป็น',
    r'นํ1า': 'น้ำ',
    r'เพึง่': 'เพิ่ง',
    r'เปลี,ยน': 'เปลี่ยน',
    r'บว้น': 'บ้วน',
    r'เคีย้ว': 'เคี้ยว',
    r'ตือ': 'ตื้อ',
    r'รักษากฉกุเฉิน': 'รักษาฉุกเฉิน',
    r'รกัษา': 'รักษา',
    r'ไมม่ี': 'ไม่มี',
    r'ทัง้': 'ทั้ง',
    r'ขึน้': 'ขึ้น',
    r'ดว้ย': 'ด้วย',
    r'อยูบ่้า': 'อยู่บ้าน',
    r'ตุบ๊': 'ตุ๊บ',
    r'อ้าปาก': 'อ้าปาก',
    r'ลม้ๆ': 'ล้มๆ',
    r'ตอ่': 'ต่อ',
    r'ผ่า น': 'ผ่าน',
    r'ฟัน ซี': 'ฟันซี่',
    r'คนไไข้': 'คนไข้',
    r'ขึ1น': 'ขึ้น',
    r'ผู้ป\+วย': 'ผู้ป่วย',
    r'มื1อ': 'มื้อ',
    r'บุหรี,': 'บุหรี่',
    r'ลิ1น': 'ลิ้น',
    r'รั,ว': 'รั่ว',
    r'คลํากล้ามแนือ้': 'คลำกล้ามเนื้อ',
}

def clean_text(text):
    if not text:
        return text
    
    cleaned = str(text)
    for bad, good in replacements.items():
        cleaned = re.sub(bad, good, cleaned)
    return cleaned

print("Cleaning questions table...")
c.execute("SELECT id, stem, question_text, explanation FROM questions")
rows = c.fetchall()
q_updated = 0
for r in rows:
    q_id, stem, q_text, expl = r
    c_stem = clean_text(stem)
    c_q_text = clean_text(q_text)
    c_expl = clean_text(expl)
    
    if c_stem != stem or c_q_text != q_text or c_expl != expl:
        c.execute("UPDATE questions SET stem=?, question_text=?, explanation=? WHERE id=?", 
                  (c_stem, c_q_text, c_expl, q_id))
        q_updated += 1

print("Cleaning choices table...")
c.execute("SELECT id, text FROM choices")
rows = c.fetchall()
c_updated = 0
for r in rows:
    c_id, c_text = r
    cleaned = clean_text(c_text)
    if cleaned != c_text:
        c.execute("UPDATE choices SET text=? WHERE id=?", (cleaned, c_id))
        c_updated += 1

conn.commit()
conn.close()

print(f"Updated {q_updated} questions and {c_updated} choices.")
