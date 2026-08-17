import sqlite3
import re

conn = sqlite3.connect('data/exam_bank.db')
c = conn.cursor()

# 1. Strip the markdown images from the stem column
print("Removing markdown from stem...")
c.execute("SELECT id, stem FROM questions WHERE stem LIKE '%![image]%'")
rows = c.fetchall()
for row in rows:
    q_id, stem = row
    # Remove all markdown image tags
    new_stem = re.sub(r'\n\n!\[image\]\(/images/[^\)]+\)', '', stem)
    c.execute("UPDATE questions SET stem = ? WHERE id = ?", (new_stem, q_id))

# 2. Inject images into image_path column using CLEANED text!
mappings = {
    1: [
        ('คนไข้มาด้วยฟันหลังล่างโยก', ['page5_img1.png']),
        ('มีเสียงคลิกด้านขวา อ้าได้ 45', ['page8_img1.jpeg']),
        ('หญิง ปวดขากรรไกร มาสามวัน', ['page9_img1.jpeg']),
        ('ฟันเทียมหลุด ทำมาเป็น 10 ปีแล้ว', ['page11_img1.png']),
        ('ให้รูป clinic กับ films มา', ['page14_img1.png']), 
        ('ผู้ป่วยอายุ 60 ปี เป็น DM มา 10 ปี', ['page16_img1.jpeg']),
        ('มีอาการแสบปากมา 1 เดือน ให้ประวัติว่าเพิ่งเปลี่ยนยาสีฟัน', ['page17_img1.png']),
        ('ANB -4 SN-MP 20', ['page25_img1.jpeg']),
    ],
    2: [
        ('STEM 2:', ['page3_img1.jpeg']),
        ('STEM 3:', ['page4_img1.png']),
        ('STEM 12:', ['page16_img1.jpeg']),
        ('STEM 14:', ['page18_img1.jpeg']),
        ('STEM 17:', ['page21_img1.png']),
        ('STEM 18:', ['page22_img1.jpeg']),
        ('STEM 22:', ['page26_img1.jpeg']),
    ],
    3: [
        ('คนไข้หญิง40 ปี เคี้ยวข้าวไม่ถนัด', ['page2_img1.png']),
        ('คนไข้เด็กอายุ5 ปี เป็นHemophilia A', ['page9_img1.jpeg']),
        ('ฟันกรามซ้ายล่างแตกมา 1 วัน', ['page10_img1.jpeg']),
        ('สูบบุหรี่ 10 มวนสูบมา20 ปี', ['page11_img1.jpeg']),
        ('หญิง20 ปี ให้รูปOPG ติดbrackets', ['page12_img1.jpeg']),
        ('เด็ก7 ขวบกลัวการทำฟันมากไม่เคยทำฟันมาก่อน', ['page17_img1.jpeg']),
        ('คนไข้เพศหญิงอายุ50 ปี ปวดหูทั้งสองข้างเคยรับการรักษาจัดฟัน', ['page18_img1.jpeg']),
    ],
    4: [
        ('ชอบกินน้ำอัดลม', ['page2_img1.jpeg']),
        ('แสบในช่องปากมา 3 สัปดาห์ และมีแผลในปาก', ['page11_img1.jpeg']),
        ('ให้รูปซี่ 36B มี', ['page12_img1.jpeg']),
        ('มาด้วยอาการแสบบริเวณกระพุ้งแก้มและลิ้น', ['page18_img1.jpeg']),
        ('คนไข้เพศหญิงมีสะพานฟันเก่าซี่ 21-12 ซี่ 12 มีรั่ว', ['page22_img1.jpeg']),
    ]
}

total_injected = 0
for part, map_list in mappings.items():
    source_exam = f"%2566%part {part}%" if part != 2 else "%NL_2_2566_Part_2%"
    
    for text_query, images in map_list:
        c.execute("""
            SELECT id FROM questions 
            WHERE source_exam LIKE ? AND (stem LIKE ? OR question_text LIKE ?)
            ORDER BY id ASC
        """, (source_exam, f"%{text_query}%", f"%{text_query}%"))
        
        rows = c.fetchall()
        if rows:
            first_q_id = rows[0][0]
            img_path = f"2566_part{part}/{images[0]}"
            c.execute("UPDATE questions SET image_path = ? WHERE id = ?", (img_path, first_q_id))
            total_injected += 1
            print(f"Updated Q_ID {first_q_id} with image_path '{img_path}'")

conn.commit()
conn.close()

print(f"\nCleaned markdown and successfully set image_path for {total_injected} STEMs!")
