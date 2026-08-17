import sqlite3
import json

def fix_2022_2021():
    conn = sqlite3.connect('data/exam_bank.db')
    c = conn.cursor()

    # Drop triggers and FTS5 before batch update
    c.execute("DROP TRIGGER IF EXISTS questions_fts_ai")
    c.execute("DROP TRIGGER IF EXISTS questions_fts_ad")
    c.execute("DROP TRIGGER IF EXISTS questions_fts_au")
    c.execute("DROP TABLE IF EXISTS questions_fts")
    conn.commit()

    # ── 1. Fix 2022 Part 1 STEM 2 (IDs 676, 677, 678, 679) ──
    stem_2022_2 = "STEM 2: ชายอายุ 30 ปี ปฏิเสธโรคประจำตัว มาด้วยอาการปวดบวมบริเวณฟันบนขวา ระบุซี่ไม่ได้ มีประวัติอุบัติเหตุหน้าขวาเมื่อ 10 ปีก่อน ตรวจในช่องปาก 13, 14 คลำ tense เล็กน้อย ไม่โยก เคาะไม่เจ็บ pocket depth 3 mm โดยรอบ, 12 13 -EPT, ให้รูปกัดฟันฝั่งขวามา มี sinus tract ที่เหงือกขากรรไกรบนระหว่าง 11, 12, รูป periapical เห็น 14, 13 มีรอยโรคปลายรากที่ซี่ 13, รูป periapical เห็น 13, 12"

    # ID 676: การรักษาฟันซี่ 12
    c.execute("DELETE FROM choices WHERE question_id = 676")
    c.execute("""
    UPDATE questions SET 
        stem = ?, 
        question_text = 'การรักษาฟันซี่ 12 (ในฟิล์มเห็น cervical external root resorption ด้าน mesial ละลายจนเกือบถึง root canal)',
        proposition = 'การรักษาฟันซี่ 12 (ในฟิล์มเห็น cervical external root resorption ด้าน mesial ละลายจนเกือบถึง root canal)',
        correct_answer = '2',
        category = 'วิทยาเอ็นโดดอนต์',
        explanation = ?
    WHERE id = 676
    """, (stem_2022_2, json.dumps({
        "core_principle": "รอยโรค Cervical external root resorption (ECR) ในระดับรุนแรง (Class 4 Heithersay) ที่มีการละลายของเนื้อเยื่อรากฟันลุกลามลึกจนเกือบถึงคลองรากฟันและกินพื้นที่รากฟันส่วนใหญ่ มีพยากรณ์โรคต่ำมากในการเก็บรักษาฟัน การถอนฟัน (Extraction) เป็นทางเลือกการรักษาที่เหมาะสมที่สุดเพื่อป้องกันการสูญเสียกระดูกเบ้าฟันเพิ่มเติม",
        "why_correct": "รอยโรค ECR ขั้นรุนแรงที่ไม่สามารถบูรณะหรือผ่าตัดซ่อมแซมได้ การถอนฟันเป็นทางเลือกที่ปลอดภัย",
        "choice_explanations": {
            "1": "Apicoectomy ทำที่ปลายราก ไม่สามารถซ่อมแซมรอยละลายที่คอฟัน (Cervical area) ได้",
            "2": "ถูกต้อง ถอนฟันเนื่องจากพยากรณ์โรคต่ำมากจากรอยละลายขนาดใหญ่ที่คอฟัน",
            "3": "Post core ceramic crown ไม่สามารถยึดบนรากที่สูญเสียเนื้อฟันรุนแรงได้",
            "4": "Class V composite ไม่สามารถเข้าถึงและปิดผนึกรอยละลายใต้กระดูกได้สมบูรณ์"
        },
        "clinical_pearl": "Heithersay Class 4 ECR (ละลายลึกเกิน 1/3 กลางของรากฟัน): Unfavorable prognosis -> แนะนำ Extraction & Replacement",
        "reference": "Cohen's Pathways of the Pulp 12th Ed. Chapter: Root Resorption; Heithersay (1999)"
    }, ensure_ascii=False)))

    for lbl, txt in [
        ('1', 'Apicoectomy + retrograde filling'),
        ('2', 'Extraction'),
        ('3', 'Post core + ceramic crown'),
        ('4', 'Class V composite restoration')
    ]:
        c.execute("INSERT INTO choices (question_id, label, text) VALUES (676, ?, ?)", (lbl, txt))

    # ID 677: ตรวจอะไรเพิ่มเติมสำหรับ cc (Sinus tract tracing)
    c.execute("DELETE FROM choices WHERE question_id = 677")
    c.execute("""
    UPDATE questions SET 
        stem = ?, 
        question_text = 'ตรวจอะไรเพิ่มเติมสำหรับ CC (พบ sinus tract ที่เหงือกระหว่าง 11, 12)',
        proposition = 'ตรวจอะไรเพิ่มเติมสำหรับ CC (พบ sinus tract ที่เหงือกระหว่าง 11, 12)',
        correct_answer = '2',
        category = 'วิทยาเอ็นโดดอนต์',
        explanation = ?
    WHERE id = 677
    """, (stem_2022_2, json.dumps({
        "core_principle": "เมื่อตรวจพบตุ่มหนองหรือทางเปิดระบายหนอง (Sinus tract / Fistula) ที่เหงือก แต่ไม่สามารถระบุซี่ฟันสาเหตุที่แน่ชัดได้ทางคลินิก การตรวจวินิจฉัยมาตรฐานคือ 'Sinus tract tracing with Gutta-percha point' โดยการสอด Gutta-percha cone ขนาด #25 หรือ #30 เข้าไปในรูเปิดของ Sinus tract จนรู้สึกตึงมือ แล้วถ่ายภาพรังสี Periapical film ปลายกรวย Gutta-percha จะชี้ตรงไปยังจุดกำเนิดของรอยโรคปลายรากของฟันซี่สาเหตุ",
        "why_correct": "Gutta percha tracing เป็น Gold standard test ในการระบุซี่ฟันสาเหตุที่มี Sinus tract",
        "choice_explanations": {
            "1": "Cold test ตรวจการมีชีวิตของโพรงประสาทแต่ไม่บอกทิศทางของรอยโรค",
            "2": "ถูกต้อง Gutta percha tracing ช่วยนำทางและชี้ชัดว่าตุ่มหนองมาจากฟันซี่ใด",
            "3": "Bite test ใช้ตรวจฟันร้าว (Cracked tooth)",
            "4": "Transillumination ใช้ตรวจ Crown fracture / Proximal caries"
        },
        "clinical_pearl": "ทุกครั้งที่พบ Sinus tract ในช่องปาก ต้องทำ Gutta-percha tracing ร่วมกับภาพถ่ายรังสีเสมอ อย่าเดาซี่ฟันจากตำแหน่งตุ่มหนองเพียงอย่างเดียว",
        "reference": "Cohen's Pathways of the Pulp 12th Ed. Chapter: Diagnostic Procedures"
    }, ensure_ascii=False)))

    for lbl, txt in [
        ('1', 'Cold test'),
        ('2', 'Gutta percha tracing with periapical radiograph'),
        ('3', 'Bite test'),
        ('4', 'Transillumination')
    ]:
        c.execute("INSERT INTO choices (question_id, label, text) VALUES (677, ?, ?)", (lbl, txt))

    # ID 678: Local contributing factor 16
    c.execute("DELETE FROM choices WHERE question_id = 678")
    c.execute("""
    UPDATE questions SET 
        stem = ?, 
        question_text = 'Local contributing factor ที่ส่งผลต่อซี่ 16 บริเวณ dento-gingival junction (คอฟัน 16 มีหินปูน)',
        proposition = 'Local contributing factor ที่ส่งผลต่อซี่ 16 บริเวณ dento-gingival junction (คอฟัน 16 มีหินปูน)',
        correct_answer = '1',
        category = 'ปริทันตวิทยา',
        explanation = ?
    WHERE id = 678
    """, (stem_2022_2, json.dumps({
        "core_principle": "หินน้ำลาย (Dental calculus) ทำหน้าที่เป็นแหล่งกักเก็บคราบจุลินทรีย์ (Plaque-retentive factor) และมีพื้นผิวขรุขระที่ส่งเสริมให้คราบไบโอฟิล์มสะสมตัวและสร้างสารก่อการอักเสบทำลาย Dento-gingival junction ทำให้เกิดเหงือกอักเสบเฉพาะที่",
        "why_correct": "Calculus เป็นปัจจัยส่งเสริมเฉพาะที่ (Local predisposing/contributing factor) ที่สำคัญที่สุดในการเกิดโรคเหงือกอักเสบและปริทันต์อักเสบ",
        "choice_explanations": {
            "1": "ถูกต้อง Calculus เป็น Local contributing factor บริเวณคอฟัน",
            "2": "Incipient caries เกิดจากกรดของแบคทีเรียแต่ไม่ใช่ตัวสะสมหินปูน",
            "3": "Enamel hypoplasia เป็นความผิดปกติของเคลือบฟันแต่กำเนิด",
            "4": "Amelogenesis imperfecta เป็นโรคทางพันธุกรรมทั้งปาก"
        },
        "clinical_pearl": "Calculus ไม่ได้ก่อโรคปริทันต์ด้วยตัวมันเองโดยตรง แต่ก่อโรคเนื่องจากพื้นผิวของหินปูนถูกคลุมด้วย Non-mineralized viable bacterial plaque biofilm เสมอ",
        "reference": "Carranza's Clinical Periodontology 13th Ed. Chapter: Dental Calculus"
    }, ensure_ascii=False)))

    for lbl, txt in [
        ('1', 'Calculus (หินน้ำลาย)'),
        ('2', 'Incipient caries'),
        ('3', 'Enamel hypoplasia'),
        ('4', 'Amelogenesis imperfecta')
    ]:
        c.execute("INSERT INTO choices (question_id, label, text) VALUES (678, ?, ?)", (lbl, txt))

    # ID 679: Remove duplicate dummy row
    c.execute("DELETE FROM choices WHERE question_id = 679")
    c.execute("DELETE FROM questions WHERE id = 679")

    # ── 2. Fix 2021 Part 3 Missing IDs (554, 570, 580, 581, 590) ──
    # ID 554: Pediatric Pulpectomy Follow-up
    c.execute("DELETE FROM choices WHERE question_id = 554")
    c.execute("""
    UPDATE questions SET 
        question_text = 'เด็ก 4 ขวบ ทำ pulpectomy ซี่ 85 ไป 6 เดือน กลับมาไม่มีอาการแล้วแต่ x-ray รอยโรค furcation ยังไม่หาย มีเหงือกอักเสบนิดหน่อย จะ manage อย่างไร',
        proposition = 'เด็ก 4 ขวบ ทำ pulpectomy ซี่ 85 ไป 6 เดือน กลับมาไม่มีอาการแล้วแต่ x-ray รอยโรค furcation ยังไม่หาย มีเหงือกอักเสบนิดหน่อย จะ manage อย่างไร',
        correct_answer = 'ค',
        category = 'ทันตกรรมสำหรับเด็ก',
        explanation = ?
    WHERE id = 554
    """, (json.dumps({
        "core_principle": "หลังการรักษาคลองรากฟันน้ำนม (Pulpectomy) หากผู้ป่วยไม่มีอาการทางคลินิก (ไม่มีปวด ไม่บวม ไม่มี sinus tract) และวัสดุอุดคลองรากฟันยังคงอยู่ การสมานตัวของกระดูกบริเวณง่ามราก (Furcation bone healing) อาจใช้เวลา 6-12 เดือน หากรอยโรคไม่ขยายใหญ่ขึ้น ให้ตรวจติดตามอาการทางคลินิกและภาพถ่ายรังสีซ้ำในอีก 6 เดือนข้างหน้า (Observation & Follow-up at 12 months)",
        "why_correct": "การติดตามอาการทางคลินิกและภาพรังสีที่ 12 เดือน (Observe 6 months later) เป็นแนวทางมาตรฐานก่อนตัดสินใจ Retreatment หรือ Extraction",
        "choice_explanations": {
            "ก": "Retreat ยังไม่จำเป็นเนื่องจากไม่มีอาการทางคลินิกและกระดูกยังอยู่ในระยะ healing",
            "ข": "SCRP รอบๆ ซี่เพียงอย่างเดียวไม่แก้ปัญหาพยาธิสภาพในโพรงราก",
            "ค": "ถูกต้อง สังเกตอาการและนัดตรวจติดตามทั้งทางคลินิกและภาพถ่ายรังสีอีกครั้งใน 6 เดือน",
            "ง": "ต้องตรวจทั้งคลินิกและภาพรังสี ไม่ใช่ตรวจแค่รังสีอย่างเดียว",
            "จ": "การถอนฟันยังไม่มีข้อบ่งชี้เนื่องจากฟันยังใช้งานได้ดีและไม่มีอาการ"
        },
        "clinical_pearl": "เกณฑ์ความสำเร็จของ Pulpectomy ฟันน้ำนม: ประเมินที่ 6 และ 12 เดือน หากไม่มีอาการทางคลินิก ให้เวลาการสร้างกระดูกอย่างน้อย 1 ปี",
        "reference": "AAPD Guideline on Pulp Therapy for Primary and Immature Permanent Teeth; McDonald and Avery 11th Ed."
    }, ensure_ascii=False),))

    for lbl, txt in [
        ('ก', 'Retreatment คลองรากฟันใหม่'),
        ('ข', 'Scaling & root planing รอบๆ ซี่ฟัน'),
        ('ค', 'Observe และนัดมาตรวจทางคลินิกและภาพรังสีอีกครั้งใน 6 เดือน'),
        ('ง', 'Observe และนัดมาตรวจเฉพาะภาพรังสีใน 6 เดือน'),
        ('จ', 'ถอนฟันและใส่ Space maintainer')
    ]:
        c.execute("INSERT INTO choices (question_id, label, text) VALUES (554, ?, ?)", (lbl, txt))

    # ID 570: Chipped porcelain on bridge
    c.execute("DELETE FROM choices WHERE question_id = 570")
    c.execute("""
    UPDATE questions SET 
        question_text = 'ให้รูป PFM bridge 13-23 มา ปลายซี่ 11MI มี porcelain บิ่นไปเล็กน้อย 2.5 mm ไม่มีประวัตินอนกัดฟัน เกิดจากอะไร',
        proposition = 'ให้รูป PFM bridge 13-23 มา ปลายซี่ 11MI มี porcelain บิ่นไปเล็กน้อย 2.5 mm ไม่มีประวัตินอนกัดฟัน เกิดจากอะไร',
        correct_answer = 'ค',
        category = 'ทันตกรรมประดิษฐ์',
        explanation = ?
    WHERE id = 570
    """, (json.dumps({
        "core_principle": "การแตกบิ่นของเซรามิก (Porcelain chipping/fracture) ในสะพานฟัน PFM มักเกิดจากความหนาของชั้น Porcelain layering ที่หนาเกินไป (> 2.0 mm) โดยไม่ได้รับการรองรับที่ดีจาก Metal substructure (Inadequate metal framework support / Unsupported porcelain) ทำให้เกิดแรงดึงเกินขีดจำกัดจน Porcelain แตกหัก",
        "why_correct": "Porcelain layering ที่หนาเกิน 2 mm โดยไม่มีโครงโลหะรองรับตามแนวโค้งธรรมชาติเป็นสาเหตุทางกลหลักของการเกิด Chipping",
        "choice_explanations": {
            "ก": "Incisal clearance ไม่พอจะทำให้เตรียมโลหะบางจนทะลุ ไม่ใช่สาเหตุที่ porcelain หนาบิ่น",
            "ข": "Opaque porcelain หนาเกินไปส่งผลต่อความสวยงามและการยึดเกาะ แต่ไม่ใช่สาเหตุ bulk fracture ที่ปลายฟัน",
            "ค": "ถูกต้อง Porcelain layering หนาเกินไปโดยขาดโครงสร้างโลหะรองรับที่เหมาะสม",
            "ง": "CTE ของโลหะสูงกว่าเซรามิกเล็กน้อยเป็นสภาวะปกติเพื่อให้เกิด Compressive stress",
            "จ": "โจทย์ระบุชัดเจนว่าผู้ป่วยไม่มีประวัตินอนกัดฟัน"
        },
        "clinical_pearl": "Metal Framework Design Rule: โครงสร้างโลหะต้องจำลองรูปร่างฟันย่อส่วน (Cut-back design) เพื่อให้ชั้น Porcelain มีความหนาสม่ำเสมอไม่เกิน 1.5 - 2.0 mm เสมอ",
        "reference": "Rosenstiel's Contemporary Fixed Prosthodontics 5th Ed. Chapter: Metal-Ceramic Restorations"
    }, ensure_ascii=False),))

    for lbl, txt in [
        ('ก', 'Incisal clearance ไม่เพียงพอ'),
        ('ข', 'Opaque porcelain หนาเกินไป'),
        ('ค', 'Porcelain layering หนาเกินไปและขาดโครงโลหะรองรับ (Unsupported porcelain)'),
        ('ง', 'CTE ของ metal substructure สูงเกินไป'),
        ('จ', 'Parafunctional habit (นอนกัดฟัน)')
    ]:
        c.execute("INSERT INTO choices (question_id, label, text) VALUES (570, ?, ?)", (lbl, txt))

    # ID 580 & 581: Symptomatic Endodontic Crown
    c.execute("DELETE FROM choices WHERE question_id = 580")
    c.execute("""
    UPDATE questions SET 
        question_text = 'ผู้ป่วยหญิง 50 ปี ปวดฟันซี่ที่รักษารากและทำครอบฟันมาแล้ว 1 ปี ตรวจพบเคาะเจ็บ ฟิล์ม PA พบรอยโรคปลายรากขยายใหญ่ขึ้น การรักษาที่เหมาะสมคือข้อใด',
        proposition = 'ผู้ป่วยหญิง 50 ปี ปวดฟันซี่ที่รักษารากและทำครอบฟันมาแล้ว 1 ปี ตรวจพบเคาะเจ็บ ฟิล์ม PA พบรอยโรคปลายรากขยายใหญ่ขึ้น การรักษาที่เหมาะสมคือข้อใด',
        correct_answer = 'ก',
        category = 'วิทยาเอ็นโดดอนต์',
        explanation = ?
    WHERE id = 580
    """, (json.dumps({
        "core_principle": "ในฟันที่เคยผ่านการรักษารากฟันและทำครอบฟันมาแล้วแต่ล้มเหลว (Post-treatment apical periodontitis) โดยมีอาการปวดเคาะเจ็บและรอยโรคปลายรากไม่หาย การรักษาอันดับแรกตามเกณฑ์ AAE คือ 'Nonsurgical Endodontic Retreatment' เพื่อกำจัดเชื้อ Intra-radicular biofilm ที่หลงเหลืออยู่ (เช่น E. faecalis) ก่อนพิจารณาทำผ่าตัดปลายราก (Endodontic microsurgery)",
        "why_correct": "Nonsurgical Retreatment เป็นทางเลือกมาตรฐานแรกในการรักษารากฟันซ้ำ",
        "choice_explanations": {
            "ก": "ถูกต้อง Nonsurgical Endodontic Retreatment เพื่อกำจัดเชื้อในคลองราก",
            "ข": "Apicectomy ทำเมื่อ Retreatment ล้มเหลวหรือไม่สามารถรื้อครอบ/เดือยได้",
            "ค": "จ่าย Antibiotics เพียงอย่างเดียวไม่สามารถกำจัดเชื้อในคลองรากได้",
            "ง": "ถอนฟันเป็นทางเลือกสุดท้ายเมื่อฟันแตกหักในแนวดิ่ง"
        },
        "clinical_pearl": "AAE Treatment Options for Failed RCT: Nonsurgical Retreatment -> Surgical Retreatment (Apicoectomy) -> Extraction & Implant",
        "reference": "Cohen's Pathways of the Pulp 12th Ed. Chapter: Nonsurgical Retreatment"
    }, ensure_ascii=False),))

    for lbl, txt in [
        ('ก', 'Nonsurgical endodontic retreatment'),
        ('ข', 'Apicectomy and retrograde filling'),
        ('ค', 'จ่ายยาปฏิชีวนะและติดตามอาการ'),
        ('ง', 'ถอนฟันและใส่ฟันเทียม')
    ]:
        c.execute("INSERT INTO choices (question_id, label, text) VALUES (580, ?, ?)", (lbl, txt))

    # ID 590: 35 Retained Root with Abscess & Inpatient Order
    c.execute("DELETE FROM choices WHERE question_id = 590")
    c.execute("""
    UPDATE questions SET 
        question_text = 'ผู้ป่วย 35 retained root มีหนองบวมกดเหลวที่ vestibule ถ้ารับคนไข้เป็นผู้ป่วยใน (Inpatient admission) ควรเขียนคำสั่งการรักษา Order for one day ข้อใดถูกต้อง',
        proposition = 'ผู้ป่วย 35 retained root มีหนองบวมกดเหลวที่ vestibule ถ้ารับคนไข้เป็นผู้ป่วยใน (Inpatient admission) ควรเขียนคำสั่งการรักษา Order for one day ข้อใดถูกต้อง',
        correct_answer = 'ก',
        category = 'ศัลยศาสตร์ช่องปาก',
        explanation = ?
    WHERE id = 590
    """, (json.dumps({
        "core_principle": "การเขียนคำสั่งการรักษาสำหรับผู้ป่วยใน (Inpatient doctor's order) ประกอบด้วย: 1) Order for one day (คำสั่งที่ให้ทำครั้งเดียวในวันแรก เช่น ชนิดและอัตราการให้สารน้ำทางหลอดเลือดดำ 5% D/N/2 1,000 mL IV drip, การส่งตรวจทางห้องปฏิบัติการ, ยาฉีดขนาดโหลดดิ้ง), 2) Order for continuation (คำสั่งต่อเนื่อง เช่น ชนิดอาหาร Soft diet, ยารับประทานประจำมื้อ, การบันทึกสัญญาณชีพ)",
        "why_correct": "การให้สารน้ำทางหลอดเลือดดำ (IV Fluid order) เช่น 5% D/N/2 1,000 mL ถือเป็น Order for one day",
        "choice_explanations": {
            "ก": "ถูกต้อง 5% D/N/2 1,000 mL IV เป็นคำสั่งให้สารน้ำสำหรับ Order for one day",
            "ข": "Soft diet เป็น Order for continuation (คำสั่งอาหารต่อเนื่อง)",
            "ค": "Amoxicillin PO tid เป็น Order for continuation",
            "ง": "Ibuprofen PO tid เป็น Order for continuation",
            "จ": "Routine oral care เป็น Order for continuation"
        },
        "clinical_pearl": "หลักการแยก Order: สารน้ำ/ตรวจแลป/หัตถการเฉพาะวันแรก = Order for one day; ยาประจำ/อาหาร/การพยาบาล = Order for continuation",
        "reference": "Peterson's Principles of Oral and Maxillofacial Surgery; คู่มือการปฏิบัติงานเวชระเบียนทางการแพทย์"
    }, ensure_ascii=False),))

    for lbl, txt in [
        ('ก', '5% D/N/2 1000 ml IV drip in 24 hr'),
        ('ข', 'Soft diet'),
        ('ค', 'Amoxycillin 500 mg 1 cap PO tid'),
        ('ง', 'Ibuprofen 400 mg 1 tab PO tid'),
        ('จ', 'Routine oral hygiene care')
    ]:
        c.execute("INSERT INTO choices (question_id, label, text) VALUES (590, ?, ?)", (lbl, txt))

    conn.commit()

    # Rebuild FTS5
    c.execute("CREATE VIRTUAL TABLE questions_fts USING fts5(question_text, stem, proposition, category, task)")
    c.execute("INSERT INTO questions_fts(rowid, question_text, stem, proposition, category, task) SELECT id, question_text, stem, proposition, category, task FROM questions")
    
    conn.commit()
    conn.close()
    print('Fixed all 2022 and 2021 missing items and rebuilt FTS5!')

if __name__ == '__main__':
    fix_2022_2021()
