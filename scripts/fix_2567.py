import sqlite3
import json

def fix_2567_anomalies():
    conn = sqlite3.connect('data/exam_bank.db')
    c = conn.cursor()

    # Drop triggers and FTS5 before batch update
    c.execute("DROP TRIGGER IF EXISTS questions_fts_ai")
    c.execute("DROP TRIGGER IF EXISTS questions_fts_ad")
    c.execute("DROP TRIGGER IF EXISTS questions_fts_au")
    c.execute("DROP TABLE IF EXISTS questions_fts")
    conn.commit()

    # 1. Re-align STEM 1 & STEM 2 questions in 2567 Part 2
    # STEM 1
    stem1_text = "STEM 1: เด็ก 7 ขวบ 25 kg ปวดฟันล่างขวา ให้รูปในช่องปากพบฟันผุ 46O ให้ภาพรังสี bitewing พบฟันผุ proximal 84D middle 1/3 of dentin, 85D outer enamel (46 partial eruption)"
    
    # Q1 (ID 1432): Mepivacaine calculation
    c.execute("DELETE FROM choices WHERE question_id = 1432")
    c.execute("""
    UPDATE questions SET 
        stem = ?, 
        question_text = 'ถ้าจะทำการรักษาโดยฉีดยาชา 2% mepivacaine with 1:100,000 epinephrine (1 หลอด = 1.8 ml) จะสามารถฉีดได้มากที่สุดกี่หลอด',
        proposition = 'ถ้าจะทำการรักษาโดยฉีดยาชา 2% mepivacaine with 1:100,000 epinephrine (1 หลอด = 1.8 ml) จะสามารถฉีดได้มากที่สุดกี่หลอด',
        correct_answer = '3',
        category = 'ศัลยศาสตร์ช่องปาก',
        explanation = ?
    WHERE id = 1432
    """, (stem1_text, json.dumps({
        "core_principle": "ขนาดยาสูงสุดของ 2% Mepivacaine with 1:100,000 Epinephrine ในเด็กตามเกณฑ์ AAPD และ Malamed คือ 4.4 mg/kg ในเด็กน้ำหนัก 25 kg: ขนาดยาสูงสุด = 25 kg × 4.4 mg/kg = 110 mg ยาชา 2% 1 หลอด (1.8 mL) มีตัวยา 36 mg ดังนั้นจำนวนหลอดสูงสุด = 110 / 36 = 3.05 หลอด (ปัดเศษอย่างปลอดภัยเป็นไม่เกิน 3 หลอด)",
        "why_correct": "3 หลอด (108 mg) เป็นจำนวนหลอดสูงสุดที่ปลอดภัยสำหรับเด็กน้ำหนัก 25 kg ภายใต้เกณฑ์ 4.4 mg/kg",
        "choice_explanations": {
            "1": "2 หลอด = 72 mg (ยังไม่ถึงขนาดยาสูงสุด)",
            "2": "2.5 หลอด = 90 mg",
            "3": "ถูกต้อง 3 หลอด = 108 mg (อยู่ในเกณฑ์ปลอดภัยสูงสุด 110 mg)",
            "4": "3.5 หลอด = 126 mg (เกินขนาดสูงสุด 110 mg)",
            "5": "4 หลอด = 144 mg (เกินขนาดอย่างมีนัยสำคัญ)"
        },
        "clinical_pearl": "สูตรคำนวณยาชาเด็ก: น้ำหนัก (kg) × 4.4 mg/kg -> หารด้วย 36 mg/หลอด = จำนวนหลอดสูงสุด",
        "reference": "Malamed's Handbook of Local Anesthesia 7th Ed.; AAPD Guidelines on Local Anesthesia"
    }, ensure_ascii=False)))

    for lbl, txt in [('1', '2'), ('2', '2.5'), ('3', '3'), ('4', '3.5'), ('5', '4')]:
        c.execute("INSERT INTO choices (question_id, label, text) VALUES (1432, ?, ?)", (lbl, txt))

    # Q2 (ID 1433): Rubber dam isolation on partial eruption 46
    c.execute("DELETE FROM choices WHERE question_id = 1433")
    c.execute("""
    UPDATE questions SET 
        stem = ?, 
        question_text = 'ผุซี่ 46 icdas 5 จะบูรณะยังไง (x-ray เห็นเพิ่มว่ามี 84D d1)',
        proposition = 'ผุซี่ 46 icdas 5 จะบูรณะยังไง (x-ray เห็นเพิ่มว่ามี 84D d1)',
        correct_answer = '1',
        category = 'ทันตกรรมสำหรับเด็ก',
        explanation = ?
    WHERE id = 1433
    """, (stem1_text, json.dumps({
        "core_principle": "ฟันกรามแท้ซี่แรก 46 ที่ขึ้นเพียงบางส่วน (Partially erupted molar) การใส่แคลมป์ทั่วไปอาจหลุดง่าย จึงต้องใช้ Retentive clamp ที่มี Jaw เอียงลงด้านล่าง (Subgingival jaws) เช่น Clamp #14 หรือ #14A เพื่อยึดจับบริเวณคอฟันใต้ขอบเหงือกได้อย่างมั่นคง และขึงแผ่นยางครอบคลุมถึงฟันเขี้ยวน้ำนม (83) เพื่อให้ได้ทัศนวิสัยที่ดี",
        "why_correct": "Clamp 14A ออกแบบมาเฉพาะสำหรับ Partially erupted molar ร่วมกับการขึง Rubber dam ถึงฟันเขี้ยวน้ำนม 83",
        "choice_explanations": {
            "1": "ถูกต้อง Clamp 14A ยึดซี่ 46 ที่ partially erupted และขึงถึง 83",
            "2": "ขึงถึง 41 กว้างเกินความจำเป็นสำหรับ Class I restoration",
            "3": "Clamp 14 ซี่ 85 ไม่สามารถกั้นน้ำลายซี่ 46 ที่กำลังจะอุดได้",
            "4": "Clamp 85 ขึงไม่ครอบคลุม 46",
            "5": "Clamp 85 ไม่ตรงตำแหน่ง"
        },
        "clinical_pearl": "Clamp #14A / #8A เป็น Clamp ที่มีลักษณะ Jaws เอียงงุ้มลง (Festooned) เหมาะอย่างยิ่งสำหรับ Partially erupted permanent molars",
        "reference": "McDonald and Avery's Dentistry for the Child and Adolescent 11th Ed.; Sturdevant Operative 7th Ed."
    }, ensure_ascii=False)))

    for lbl, txt in [
        ('1', 'Clamp 14A ซี่ 46 ขึง rubber dam ถึง 83'),
        ('2', 'Clamp 14A ซี่ 46 ขึง rubber dam ถึง 41'),
        ('3', 'Clamp 14 ซี่ 85 ขึง rubber dam ถึง 84'),
        ('4', 'Clamp 14 ซี่ 85 ขึง rubber dam ถึง 83'),
        ('5', 'Clamp 14 ซี่ 85 ขึง rubber dam ถึง 41')
    ]:
        c.execute("INSERT INTO choices (question_id, label, text) VALUES (1433, ?, ?)", (lbl, txt))

    # Q3 (ID 1434): Prevention of caries progression
    c.execute("DELETE FROM choices WHERE question_id = 1434")
    c.execute("""
    UPDATE questions SET 
        stem = ?, 
        question_text = 'ควรป้องกันการผุลุกลามของฟันกรามแท้อย่างไร',
        proposition = 'ควรป้องกันการผุลุกลามของฟันกรามแท้อย่างไร',
        correct_answer = '3',
        category = 'ทันตกรรมสำหรับเด็ก',
        explanation = ?
    WHERE id = 1434
    """, (stem1_text, json.dumps({
        "core_principle": "ในเด็กอายุ 7 ปีที่มีฟันแท้กำลังขึ้นและมีความเสี่ยงฟันผุสูง การทา 5% Sodium Fluoride Varnish (22,600 ppm) และการเคลือบหลุมร่องฟัน (Pit and fissure sealant) หรือ Resin-modified glass ionomer (RMGI sealant) บนฟันที่ partial eruption เป็นวิธีที่มีหลักฐานเชิงประจักษ์สูงสุดในการป้องกันการลุกลามของฟันผุ",
        "why_correct": "Fluoride varnish ช่วยเสริมสร้างความแข็งแรงของผิวเคลือบฟันที่เพิ่งขึ้นใหม่ (Post-eruptive enamel maturation) ได้ดีที่สุด",
        "choice_explanations": {
            "1": "NaF mouthwash มีประสิทธิภาพน้อยกว่า Varnish ในการหยุดยั้งรอยผุระยะแรก",
            "2": "ITR ใช้สำหรับโพรงฟันผุที่มี Cavitation",
            "3": "ถูกต้อง Fluoride varnish ให้การปล่อยฟลูออไรด์ความเข้มข้นสูงสัมผัสผิวฟันยาวนาน",
            "4": "1500 ppm ยาสีฟันเป็นมาตรการพื้นฐานที่บ้าน แต่ในคลินิกต้องใช้ Varnish",
            "5": "Cavit เป็นวัสดุอุดชั่วคราว ไม่ได้มีฤทธิ์ป้องกันฟันผุ"
        },
        "clinical_pearl": "ฟันกรามแท้ที่กำลังขึ้น (Erupting molars) มี Enamel maturation ต่ำและสะสมคราบจุลินทรีย์ง่าย ควรทา Fluoride Varnish ทุก 3-6 เดือน",
        "reference": "AAPD Fluoride Therapy Guidelines; Cochrane Database of Systematic Reviews: Fluorides for preventing dental caries"
    }, ensure_ascii=False)))

    for lbl, txt in [
        ('1', 'NaF mouthwash'),
        ('2', 'Interim therapeutic restoration (ITR)'),
        ('3', 'Fluoride varnish (5% NaF)'),
        ('4', '1500 ppm fluoride dentifrices'),
        ('5', 'Temporary filling with Cavit')
    ]:
        c.execute("INSERT INTO choices (question_id, label, text) VALUES (1434, ?, ?)", (lbl, txt))

    # STEM 2
    stem2_text = "STEM 2: ผู้ป่วยหญิงอายุ 30 ปี ปวดหน้าหูเวลาเคี้ยวของเหนียว ภาพฟันด้านขวาที่ตำแหน่ง ICP สบทุกซี่ตั้งแต่ 3-7, ให้ภาพ right lateral excursion เห็น 13 สบกับ 43 และฟันซี่ 13 มีลักษณะฟันเปลี่ยนเป็นสีเทามี craze line และมี attrition"

    # Q4 (ID 1435): Barrier for intrapulpal bleaching
    c.execute("DELETE FROM choices WHERE question_id = 1435")
    c.execute("""
    UPDATE questions SET 
        stem = ?, 
        question_text = 'อะไรเป็น barrier สำหรับ intrapulpal bleaching',
        proposition = 'อะไรเป็น barrier สำหรับ intrapulpal bleaching',
        correct_answer = '1',
        category = 'วิทยาเอ็นโดดอนต์',
        explanation = ?
    WHERE id = 1435
    """, (stem2_text, json.dumps({
        "core_principle": "ในการฟอกสีฟันในฟันที่ตายแล้ว (Internal / Walking bleaching with sodium perborate): การป้องกันไม่ให้น้ำยาฟอกสีซึมผ่านคลองรากฟันไปยังเอ็นยึดปริทันต์และก่อให้เกิด Cervical external root resorption จำเป็นต้องวาง Cervical barrier (Intraorifice barrier) หนา 2 mm เช่น Glass Ionomer Cement (GIC), Resin-modified GIC หรือ Cavit บริเวณใต้ CEJ เล็กน้อย",
        "why_correct": "Glass Ionomer Cement (GIC) มีคุณสมบัติ Chemical adhesion กับเนื้อฟันและปิดผนึกได้ดีเยี่ยม จึงเป็นวัสดุมาตรฐานสำหรับ Cervical barrier",
        "choice_explanations": {
            "1": "ถูกต้อง GI cement มีความหนา 2 mm ปิดผนึกคลองรากฟันป้องกันการรั่วซึมของ Bleaching agent",
            "2": "Flowable composite มี polymerization shrinkage สูง เสี่ยงต่อ microleakage",
            "3": "Calcium hydroxide ละลายน้ำได้ง่าย ไม่สามารถเป็น barrier ถาวรได้",
            "4": "Hydrogen peroxide เป็นสารฟอกสีฟัน ไม่ใช่วัสดุกั้น",
            "5": "Sodium perborate เป็นสารฟอกสีฟันชนิดผง"
        },
        "clinical_pearl": "Cervical Barrier Rule: ต้องมีความหนาอย่างน้อย 2 mm รูปทรง Ski-slope ตามแนวขอบ CEJ เพื่อป้องกัน External cervical resorption",
        "reference": "Cohen's Pathways of the Pulp 12th Ed. Chapter: Bleaching Procedures in Endodontics"
    }, ensure_ascii=False)))

    for lbl, txt in [
        ('1', 'GI cement (Glass Ionomer Cement)'),
        ('2', 'Flowable composite'),
        ('3', 'Calcium hydroxide'),
        ('4', 'Hydrogen peroxide'),
        ('5', 'Sodium perborate')
    ]:
        c.execute("INSERT INTO choices (question_id, label, text) VALUES (1435, ?, ?)", (lbl, txt))

    # Q5 (ID 1436): Cause of tooth discoloration
    c.execute("DELETE FROM choices WHERE question_id = 1436")
    c.execute("""
    UPDATE questions SET 
        stem = ?, 
        question_text = 'สาเหตุของฟันซี่ 13 เปลี่ยนสีเกิดจากอะไร',
        proposition = 'สาเหตุของฟันซี่ 13 เปลี่ยนสีเกิดจากอะไร',
        correct_answer = '2',
        category = 'วิทยาเอ็นโดดอนต์',
        explanation = ?
    WHERE id = 1436
    """, (stem2_text, json.dumps({
        "core_principle": "ฟันซี่ 13 มีประวัติรับแรงกระแทกจากการสบฟันผิดปกติ (Traumatic occlusion / Heavy canine guidance / Attrition) ร่วมกับ Craze line และเปลี่ยนเป็นสีเทา การบาดเจ็บเรื้อรังจากแรงสบฟันทำให้เกิด Pulpal hemorrhage หรือ Pulp necrosis ซึ่งสารสลายตัวของเม็ดเลือดแดง (Hemoglobin breakdown products: Hemosiderin, Iron sulfide) แทรกซึมเข้า Dentinal tubules ทำให้ฟันเปลี่ยนเป็นสีเทาคล้ำ",
        "why_correct": "Traumatic occlusion และการบาดเจ็บต่อเนื้อเยื่อในโพรงประสาทฟันทำให้เกิด Pulpal necrosis และฟันเปลี่ยนสี",
        "choice_explanations": {
            "1": "Tetracycline ทำให้เกิดฟันเปลี่ยนสีทั้งปากตั้งแต่ช่วงสร้างฟันในวัยเด็ก",
            "2": "ถูกต้อง Traumatic occlusion ทำให้เกิดการตายของโพรงประสาทฟันและฟันเปลี่ยนสี",
            "3": "Bacterial infection จากฟันผุ (เคสนี้ไม่มีประวัติฟันผุ มีแต่ craze line + attrition)",
            "4": "Root canal medication เกิดขึ้นหลังการรักษาราก แต่ฟันนี้ยังไม่ได้รักษาราก",
            "5": "Orthodontic treatment ไม่ได้เป็นสาเหตุหลักในกรณีนี้"
        },
        "clinical_pearl": "ฟันที่มีรอย Craze line ลึกและรับแรงสบหนัก อาจเกิด Cracking ลุกลามถึง Pulp ทำให้เกิด Pulp necrosis โดยไม่มีฟันผุ",
        "reference": "Cohen's Pathways of the Pulp 12th Ed.; Sturdevant Operative 7th Ed."
    }, ensure_ascii=False)))

    for lbl, txt in [
        ('1', 'Tetracycline ingestion'),
        ('2', 'Traumatic occlusion / Pulpal necrosis'),
        ('3', 'Bacterial infection from caries'),
        ('4', 'Root canal medication'),
        ('5', 'Orthodontic force')
    ]:
        c.execute("INSERT INTO choices (question_id, label, text) VALUES (1436, ?, ?)", (lbl, txt))

    # Q6 (ID 1437): TMJ Pain origin
    c.execute("DELETE FROM choices WHERE question_id = 1437")
    c.execute("""
    UPDATE questions SET 
        stem = ?, 
        question_text = 'อาการปวดหน้าหูเกิดที่อวัยวะใด',
        proposition = 'อาการปวดหน้าหูเกิดที่อวัยวะใด',
        correct_answer = '3',
        category = 'ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า',
        explanation = ?
    WHERE id = 1437
    """, (stem2_text, json.dumps({
        "core_principle": "เนื้อเยื่อ Retrodiscal tissue (Bilaminar zone / Posterior attachment) เป็นบริเวณที่มีหลอดเลือดและเส้นประสาทรับความรู้สึก (Auriculotemporal nerve) หนาแน่นมาก เมื่อเกิด Disc displacement หรือ Condyle ถูกดันไปด้านหลังกดทับ Retrodiscal tissue จะก่อให้เกิดอาการปวดหน้าหู (Retrodiscitis) ขณะเคี้ยวอาหารหรือสบฟัน",
        "why_correct": "Retrodiscal tissue เป็นแหล่งกำเนิดความเจ็บปวดหลัก (Primary pain source) ของข้อต่อขากรรไกรเนื่องจากมี Sensory nerve fibers หนาแน่น ขณะที่ตัว Articular disc ไม่มีเส้นประสาท",
        "choice_explanations": {
            "1": "Temporomandibular joint เป็นโครงสร้างรวม แต่จุดรับความรู้สึกปวดจำเพาะคือ Retrodiscal tissue",
            "2": "TMJ ligament ป้องกันการเคลื่อนที่เกินขอบเขตแต่ไม่ใช่จุดกำเนิดปวดหลักเวลาเคี้ยว",
            "3": "ถูกต้อง Retrodiscal tissue (Bilaminar zone) มีเส้นประสาทรับความรู้สึกปวดหนาแน่นมากที่สุด",
            "4": "Masseter muscle ปวดบริเวณมุมขากรรไกรและแก้ม ไม่ใช่หน้าหูโดยตรง",
            "5": "Internal auditory canal อยู่ลึกในกะโหลกศีรษะ"
        },
        "clinical_pearl": "Articular disc ไม่มีเส้นประสาทและหลอดเลือด (Avascular & Aneural) ดังนั้น Disc จึง 'ไม่ปวด' ความปวดใน TMJ เกิดจาก Retrodiscal tissue (Retrodiscitis) หรือ Capsule/Synovium",
        "reference": "Okeson's Management of Temporomandibular Disorders and Occlusion 8th Ed."
    }, ensure_ascii=False)))

    for lbl, txt in [
        ('1', 'Temporomandibular joint disc'),
        ('2', 'Temporomandibular ligament'),
        ('3', 'Retrodiscal tissue (Bilaminar zone)'),
        ('4', 'Masseter muscle'),
        ('5', 'Internal auditory canal')
    ]:
        c.execute("INSERT INTO choices (question_id, label, text) VALUES (1437, ?, ?)", (lbl, txt))

    # 2. Fix 2567 Law questions (IDs 2307 and 2313)
    c.execute("""
    UPDATE questions SET explanation = ? WHERE id = 2307
    """, (json.dumps({
        "core_principle": "ตามพระราชบัญญัติวิชาชีพทันตกรรม พ.ศ. 2537 มาตรา 41 และข้อบังคับทันตแพทยสภา: กรรมการทันตแพทยสภามีอำนาจสั่งลงโทษผู้ประกอบวิชาชีพทันตกรรมที่ประพฤติผิดจรรยาบรรณได้ 4 สถาน คือ 1) ยกข้อกล่าวหาหรือว่ากล่าวตักเตือน, 2) ภาคทัณฑ์, 3) พักใช้ใบอนุญาต (ไม่เกิน 2 ปี), 4) เพิกถอนใบอนุญาต",
        "why_correct": "การลงโทษทางจรรยาบรรณเป็นอำนาจของคณะกรรมการทันตแพทยสภาตามขั้นตอนที่กฎหมายกำหนด",
        "choice_explanations": {
            "A": "ถูกต้อง เป็นไปตามบทบัญญัติแห่ง พ.ร.บ. วิชาชีพทันตกรรม พ.ศ. 2537",
            "B": "ไม่ถูกต้อง",
            "C": "ไม่ถูกต้อง",
            "D": "ไม่ถูกต้อง"
        },
        "clinical_pearl": "จำบทลงโทษ 4 สถาน: ตักเตือน -> ภาคทัณฑ์ -> พักใช้ (<= 2 ปี) -> เพิกถอนใบอนุญาต",
        "reference": "พระราชบัญญัติวิชาชีพทันตกรรม พ.ศ. 2537 มาตรา 41"
    }, ensure_ascii=False),))

    c.execute("""
    UPDATE questions SET explanation = ? WHERE id = 2313
    """, (json.dumps({
        "core_principle": "ผู้ประกอบวิชาชีพทันตกรรมและผู้ดำเนินการสถานพยาบาลมีหน้าที่ควบคุมและรายงานการกระทำที่ผิดกฎหมายหรือไม่ได้มาตรฐานในคลินิก หากพบเห็นผู้ไม่มีใบประกอบวิชาชีพกระทำการรักษาคนไข้แล้วเพิกเฉย อาจถือว่ามีความผิดฐานสมรู้ร่วมคิดหรือละเลยการควบคุมดูแลตาม พ.ร.บ. สถานพยาบาล พ.ศ. 2541",
        "why_correct": "การรายงานการกระทำความผิดและไม่ยินยอมให้ผู้ไม่มีใบอนุญาตทำการรักษาเป็นหน้าที่ตามกฎหมายและจรรยาบรรณแห่งวิชาชีพ",
        "choice_explanations": {
            "A": "ถูกต้อง ต้องรายงานและยับยั้งการกระทำผิด",
            "B": "ไม่ถูกต้อง การเพิกเฉยมีความผิดตามกฎหมาย",
            "C": "ไม่ถูกต้อง",
            "D": "ไม่ถูกต้อง"
        },
        "clinical_pearl": "ผู้ดำเนินการสถานพยาบาลมีหน้าที่ตามกฎหมายในการควบคุมมิให้ผู้ที่มิใช่ผู้ประกอบวิชาชีพมาทำการรักษาผู้ป่วยในสถานพยาบาล",
        "reference": "พระราชบัญญัติสถานพยาบาล พ.ศ. 2541; พระราชบัญญัติวิชาชีพทันตกรรม พ.ศ. 2537"
    }, ensure_ascii=False),))

    conn.commit()

    # Rebuild FTS5
    c.execute("CREATE VIRTUAL TABLE questions_fts USING fts5(question_text, stem, proposition, category, task)")
    c.execute("INSERT INTO questions_fts(rowid, question_text, stem, proposition, category, task) SELECT id, question_text, stem, proposition, category, task FROM questions")
    
    conn.commit()
    conn.close()
    print('All 2567 questions fixed and standardized successfully!')

if __name__ == '__main__':
    fix_2567_anomalies()
