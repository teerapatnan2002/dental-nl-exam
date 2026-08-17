import sqlite3

conn = sqlite3.connect('data/exam_bank.db')
c = conn.cursor()

mappings = {
    1: [
        ('คนไขม้าดว้ยฟันหลังล่างโยก', ['page5_img1.png']),
        ('มีเสียงคลิกด้านขวา อ้าได้ 45', ['page8_img1.jpeg']),
        ('หญิง ปวดขากรรไกร มาสามวัน', ['page9_img1.jpeg']),
        ('ฟันเทียมหลุด ทํามาเป็น 10 ปีแลว้', ['page11_img1.png']),
        ('ใหรู้ป clinic กับ films มา', ['page14_img1.png', 'page14_img2.png']),
        ('ผูป้ว่ยอายุ 60 ปี เป็น DM มา 10 ปี', ['page16_img1.jpeg']),
        ('มีอาการแสบปากมา 1 เดือน ใหป้ระวัติว่าเพึง่เปลี,ยนยาสีฟัน', ['page17_img1.png']),
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
        ('คนไขห้ญิง40 ปี เคีย้วข้าวไม่ถนัด', ['page2_img1.png']),
        ('คนไข้เด็กอายุ5 ปี เป็นHemophilia A', ['page9_img1.jpeg', 'page9_img2.jpeg']),
        ('ฟันกรามซ้ายล่างแตกมา 1 วัน', ['page10_img1.jpeg']),
        ('สูบบุหรี่ 10 มวนสูบมา20 ปี', ['page11_img1.jpeg']),
        ('หญิง20 ปี ใหรู้ปOPG ติดbrackets', ['page12_img1.jpeg']),
        ('เด็ก7 ขวบกลัวการทําฟันมากไม่เคยทําฟันมาก่อน', ['page17_img1.jpeg']),
        ('คนไข้เพศหญิงอายุ50 ปี ปวดหูทัง้สองข้างเคยรับการรักษาจัดฟัน', ['page18_img1.jpeg']),
    ],
    4: [
        ('ชอบกินน้ำอัดลม', ['page2_img1.jpeg']),
        ('แสบในช่องปากมา 3 สัปดาห์ และมีแผลในปาก', ['page11_img1.jpeg']),
        ('ใหรู้ปซี่ 36B มี', ['page12_img1.jpeg']),
        ('มาดว้ยอาการแสบบริเวณกระพุง้แกม้และลิน้', ['page18_img1.jpeg']),
        ('คนไข้เพศหญิงมีสะพานฟันเก่าซี่ 21-12 ซี่ 12 มีรั,ว', ['page22_img1.jpeg']),
    ]
}

total_updated = 0

for part, map_list in mappings.items():
    source_exam = f"%2566%part {part}%" if part != 2 else "%NL_2_2566_Part_2%"
    
    for text_query, images in map_list:
        # Create the markdown for the images
        image_md = ""
        for img in images:
            image_path = f"/images/2566_part{part}/{img}"
            image_md += f"\n\n![image]({image_path})"
            
        c.execute("""
            SELECT id, stem FROM questions 
            WHERE source_exam LIKE ? AND (stem LIKE ? OR question_text LIKE ?)
        """, (source_exam, f"%{text_query}%", f"%{text_query}%"))
        
        rows = c.fetchall()
        for row in rows:
            q_id, current_stem = row
            
            # Avoid duplicate injection if run multiple times
            if "![image]" not in current_stem:
                new_stem = current_stem + image_md
                c.execute("UPDATE questions SET stem = ? WHERE id = ?", (new_stem, q_id))
                total_updated += 1
                print(f"Updated Q_ID {q_id} with images for snippet '{text_query}' (Part {part})")

conn.commit()
conn.close()

print(f"\nSuccessfully injected {total_updated} image references into the database!")
