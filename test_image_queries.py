import sqlite3

conn = sqlite3.connect('data/exam_bank.db')
c = conn.cursor()

queries = {
    1: [
        ('ฟันหลังล่างโยก', ['page5_img1.png']),
        ('มีเสียงคลิกด้านขวา', ['page8_img1.jpeg']),
        ('ปวดขากรรไกร', ['page9_img1.jpeg']),
        ('ฟันเทียมหลุด', ['page11_img1.png']),
        ('clinic กับ films', ['page14_img1.png', 'page14_img2.png']),
        ('เป็น DM มา 10', ['page16_img1.jpeg']),
        ('แสบปากมา 1', ['page17_img1.png']),
        ('ANB -4 SN-MP 20', ['page25_img1.jpeg']),
    ],
    2: [
        ('stain', ['page3_img1.jpeg']),
        ('fremitus', ['page4_img1.png']),
        ('แผลข้างลิ้น', ['page16_img1.jpeg']),
        ('unilocular', ['page18_img1.jpeg']),
        ('ผุที่คอฟัน', ['page21_img1.png']),
        ('มี 13 RR', ['page22_img1.jpeg']),
        ('ตุ่มน้ำ', ['page26_img1.jpeg']),
    ],
    3: [
        ('nasopharyngeal', ['page2_img1.png']),
        ('Hemophilia A', ['page9_img1.jpeg', 'page9_img2.jpeg']),
        ('กรามซ้ายล่างแตก', ['page10_img1.jpeg']),
        ('สูบบุหรี่ 10 มวน', ['page11_img1.jpeg']),
        ('distal cusp', ['page12_img1.jpeg']),
        ('กลัวการทำฟันมาก', ['page17_img1.jpeg']),
        ('ปวดหู', ['page18_img1.jpeg']),
    ],
    4: [
        ('น้ำอัดลม', ['page2_img1.jpeg']),
        ('แสบในช่องปากมา 3 สัปดาห์', ['page11_img1.jpeg']),
        ('white lesion', ['page12_img1.jpeg']),
        ('กระพุ้งแก้ม', ['page18_img1.jpeg']),
        ('สะพานฟันเก่า', ['page22_img1.jpeg']),
    ]
}

print("Testing matches:")
for part, map_list in queries.items():
    source_pattern = f"%2566%part {part}%" if part != 2 else "%NL_2_2566_Part_2%"
    
    for text_query, imgs in map_list:
        c.execute("""
            SELECT id FROM questions 
            WHERE source_exam LIKE ? 
            AND (stem LIKE ? OR question_text LIKE ?)
        """, (source_pattern, f"%{text_query}%", f"%{text_query}%"))
        
        matches = c.fetchall()
        print(f"Part {part} - '{text_query}': {len(matches)} matches")

conn.close()
