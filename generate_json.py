import json
from schema import ExamQuestion, ExamChoice, ExamBank, ClinicalCategory, ProfessionalTask

questions = [
    # STEM 1
    ExamQuestion(
        stem="ผู้ป่วยอายุ 6 ขวบ หกล้มฟันกระแทกพื้น ฟันซี่ 51 ฟันโยกระดับ 3 ฟันซี่ 61 โยกระดับ 3 ตัวฟันบิดไปด้าน palatal ฟันซี่ 52,62 โยกระดับ 1 มีเลือดออกตามขอบเหงือก (ให้ภาพ arch บน OPG ซี่ 11,21 ใกล้ขึ้น แต่ 21 ดูจะขึ้นก่อน จ่อปลายราก 61)",
        proposition="ควรที่จะรักษาฟันซี่ 51,61 อย่างไร",
        question_text="ควรที่จะรักษาฟันซี่ 51,61 อย่างไร",
        choices=[
            ExamChoice(label="a", text="ถอนทั้งซี่ 51เเละ 61"),
            ExamChoice(label="b", text="จับ 61 เข้าที่และ splint ถอน 51"),
            ExamChoice(label="c", text="จับ 51 เข้าที่และsplint ถอน 61"),
            ExamChoice(label="d", text="จับกลับเข้าที่และ splint ฟันทั้ง 51 เเละ 61"),
            ExamChoice(label="e", text="ปล่อยไว้ทั้ง 51เเละ 61แล้วobserve")
        ],
        category=ClinicalCategory.PEDIATRIC_DENTISTRY,
        task=ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT,
        source_exam="NL2 2026 PART1.pdf"
    ),
    ExamQuestion(
        stem="ผู้ป่วยอายุ 6 ขวบ หกล้มฟันกระแทกพื้น ฟันซี่ 51 ฟันโยกระดับ 3 ฟันซี่ 61 โยกระดับ 3 ตัวฟันบิดไปด้าน palatal ฟันซี่ 52,62 โยกระดับ 1 มีเลือดออกตามขอบเหงือก (ให้ภาพ arch บน OPG ซี่ 11,21 ใกล้ขึ้น แต่ 21 ดูจะขึ้นก่อน จ่อปลายราก 61)",
        proposition="การฉีดยาชาวิธีใดเหมาะสมในการรักษาเคสนี้",
        question_text="การฉีดยาชาวิธีใดเหมาะสมในการรักษาเคสนี้",
        choices=[
            ExamChoice(label="a", text="Anterior superior alveolar nerve ด้าน NB และ interdental papilla injection"),
            ExamChoice(label="b", text="Anterior superior alveolar nerve ด้าน NB และ direct palatal infiltration"),
            ExamChoice(label="c", text="Subperiostealด้าน La, และ interdental papilla injection"),
            ExamChoice(label="d", text="Subperiostealด้าน La, และ direct palatal infiltration"),
            ExamChoice(label="e", text="Topical anesthesia")
        ],
        category=ClinicalCategory.PEDIATRIC_DENTISTRY,
        task=ProfessionalTask.PROCEDURES,
        source_exam="NL2 2026 PART1.pdf"
    ),
    ExamQuestion(
        stem="ผู้ป่วยอายุ 6 ขวบ หกล้มฟันกระแทกพื้น ฟันซี่ 51 ฟันโยกระดับ 3 ฟันซี่ 61 โยกระดับ 3 ตัวฟันบิดไปด้าน palatal ฟันซี่ 52,62 โยกระดับ 1 มีเลือดออกตามขอบเหงือก (ให้ภาพ arch บน OPG ซี่ 11,21 ใกล้ขึ้น แต่ 21 ดูจะขึ้นก่อน จ่อปลายราก 61)",
        proposition="ผู้ปกครองกังวลเกี่ยวกับฟันแท้ ควรบอกผู้ปกครองยังไง",
        question_text="ผู้ปกครองกังวลเกี่ยวกับฟันแท้ ควรบอกผู้ปกครองยังไง",
        choices=[
            ExamChoice(label="a", text="ฟันแท้อาจมีโอกาส enamel hypoplasia"),
            ExamChoice(label="b", text="ฟันแท้ไม่เกิดอันตราย เพราะรากฟันไปด้านเพดาน"),
            ExamChoice(label="c", text="เสี่ยงเกิดอันตรายต่อฟันแท้ได้ เพราะตัวฟันแท้กำลังสร้างอยู่"),
            ExamChoice(label="d", text="อาจจะเกิดอันตรายต่อฟันแท้ ทำให้ฟันแท้สามารถเกิด pulp obliterate"),
            ExamChoice(label="e", text="ไม่มีโอกาสเกิดอันตราย เนื่องจาก/รากฟันมาทาง buccal ไม่โดนหน่อฟันแท้")
        ],
        category=ClinicalCategory.PEDIATRIC_DENTISTRY,
        task=ProfessionalTask.HEALTH_PROMOTION_AND_PREVENTION,
        source_exam="NL2 2026 PART1.pdf"
    ),

    # STEM 2
    ExamQuestion(
        stem="คนไข้เคยอุด 37O แต่ยังคงมีอาการเสียวฟันเวลาดื่มนํ้าเย็น จึงกลับมาตรวจ ทันตเเพทย์พบ 37O resin composite filling ยังดูปกติดี +EPT ให้ฟิล์ม Pa 37 พบเห็นฟันผุด้าน distal (น่าจะลึกประมาณ outer third หรือ middle third ไม่มีซี่ 38)",
        proposition="ถ้าบูรณะแล้วจะกลายเป็นปวด คือการติดเชื้อแบบไหน",
        question_text="ถ้าบูรณะแล้วจะกลายเป็นปวด คือการติดเชื้อแบบไหน",
        choices=[
            ExamChoice(label="a", text="primary intraradicular infection"),
            ExamChoice(label="b", text="secondary intraradicular infection"),
            ExamChoice(label="c", text="extraradicular infection"),
            ExamChoice(label="d", text="persistent infection"),
            ExamChoice(label="e", text="dental caries infection")
        ],
        category=ClinicalCategory.ENDODONTICS,
        task=ProfessionalTask.MECHANISM_OF_DISEASES,
        source_exam="NL2 2026 PART1.pdf"
    ),
    ExamQuestion(
        stem="คนไข้เคยอุด 37O แต่ยังคงมีอาการเสียวฟันเวลาดื่มนํ้าเย็น จึงกลับมาตรวจ ทันตเเพทย์พบ 37O resin composite filling ยังดูปกติดี +EPT ให้ฟิล์ม Pa 37 พบเห็นฟันผุด้าน distal (น่าจะลึกประมาณ outer third หรือ middle third ไม่มีซี่ 38)",
        proposition="ถ้า remove caries แล้วไม่ทะลุ pulp บูรณะใช้ matrix อะไร",
        question_text="ถ้า remove caries แล้วไม่ทะลุ pulp บูรณะใช้ matrix อะไร",
        choices=[
            ExamChoice(label="a", text="sectional with band"),
            ExamChoice(label="b", text="celluloid strip"),
            ExamChoice(label="c", text="ivory no.1 with metal band"),
            ExamChoice(label="d", text="metal cervical matrix"),
            ExamChoice(label="e", text="sectional matrix")
        ],
        category=ClinicalCategory.RESTORATIVE_OPERATIVE_DENTISTRY,
        task=ProfessionalTask.PROCEDURES,
        source_exam="NL2 2026 PART1.pdf"
    ),
    ExamQuestion(
        stem="คนไข้เคยอุด 37O แต่ยังคงมีอาการเสียวฟันเวลาดื่มนํ้าเย็น จึงกลับมาตรวจ ทันตเเพทย์พบ 37O resin composite filling ยังดูปกติดี +EPT ให้ฟิล์ม Pa 37 พบเห็นฟันผุด้าน distal (น่าจะลึกประมาณ outer third หรือ middle third ไม่มีซี่ 38)",
        proposition="ถ้า remove caries distal แล้วเจอ exposed pulp 1 mm จะให้วัสดุอะไรปิดรอยทะลุ ที่ดีที่สุด",
        question_text="ถ้า remove caries distal แล้วเจอ exposed pulp 1 mm จะให้วัสดุอะไรปิดรอยทะลุ ที่ดีที่สุด",
        choices=[
            ExamChoice(label="a", text="GIC"),
            ExamChoice(label="b", text="Calcium hydroxide hard setting"),
            ExamChoice(label="c", text="Calcium hydroxide and NSS"),
            ExamChoice(label="d", text="Calcium silicate based material"),
            ExamChoice(label="e", text="Adhesive")
        ],
        category=ClinicalCategory.RESTORATIVE_OPERATIVE_DENTISTRY,
        task=ProfessionalTask.PROCEDURES,
        source_exam="NL2 2026 PART1.pdf"
    ),

    # STEM 3
    ExamQuestion(
        stem="คนไข้อายุ 15 ปีมาหาหมอ ฟันหายซี่ 34-35 ซี่อื่นดูปกติ ไม่มีประวัติการถอนฟันแท้ ไม่มี x-ray จึงไม่รู้ว่าฟันหายจริงไม่ ฟันดูเล็กๆ",
        proposition="โรคอะไรที่เกี่ยวข้องกับการที่ไม่มีฟันในเคสนี้",
        question_text="โรคอะไรที่เกี่ยวข้องกับการที่ไม่มีฟันในเคสนี้",
        choices=[
            ExamChoice(label="a", text="Ectodermal dysplasia"),
            ExamChoice(label="b", text="Hemifacial microsomia"),
            ExamChoice(label="c", text="Gardner syndrome"),
            ExamChoice(label="d", text="Cleidocranial dysplasia"),
            ExamChoice(label="e", text="Apert syndrome")
        ],
        category=ClinicalCategory.ORAL_DIAGNOSIS_AND_ORAL_MEDICINE,
        task=ProfessionalTask.DATA_GATHERING_AND_DIAGNOSIS,
        source_exam="NL2 2026 PART1.pdf"
    ),
    ExamQuestion(
        stem="คนไข้อายุ 15 ปีมาหาหมอ ฟันหายซี่ 34-35 ซี่อื่นดูปกติ ไม่มีประวัติการถอนฟันแท้ ไม่มี x-ray จึงไม่รู้ว่าฟันหายจริงไม่ ฟันดูเล็กๆ",
        proposition="ควรใส่ฟันปลอมอะไร เนื่องจากปฏิเสธการจัดฟัน",
        question_text="ควรใส่ฟันปลอมอะไร เนื่องจากปฏิเสธการจัดฟัน",
        choices=[
            ExamChoice(label="a", text="Implant"),
            ExamChoice(label="b", text="Removable"),
            ExamChoice(label="c", text="Etching bridge"),
            ExamChoice(label="d", text="Fixed bridge")
        ],
        category=ClinicalCategory.PROSTHODONTICS,
        task=ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT,
        source_exam="NL2 2026 PART1.pdf"
    ),

    # STEM 4
    ExamQuestion(
        stem="มีการให้ภาพถ่ายกัดฟัน 2 มุม ( มุมตรงและข้างซ้าย ) เห็นฟันซี่ 24 discoloration และให้ภาพ x-ray เห็น 24 มีวัสดุอุดใหญ่มาก (โจทย์แจ้งว่าเป็น amalgam) แต่ไม่เห็นจากด้าน buccal ,รูปHBW หินปูนproximalฟันกรามชัดมาก",
        proposition="ผู้ป่วยกังวลเรื่องความสวยงาม จะบูรณะยังไง",
        question_text="ผู้ป่วยกังวลเรื่องความสวยงาม จะบูรณะยังไง",
        choices=[
            ExamChoice(label="a", text="ทำ veneer ไม่รื้อ amalgam"),
            ExamChoice(label="b", text="ทำ crown ไม่รื้อ amalgam"),
            ExamChoice(label="c", text="รื้อ amalgam อุด rmgic"),
            ExamChoice(label="d", text="รื้อ amalgam อุด composite"),
            ExamChoice(label="e", text="รื้อ amalgam อุด composite แทนและทำ crown ทับ")
        ],
        category=ClinicalCategory.RESTORATIVE_OPERATIVE_DENTISTRY,
        task=ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT,
        source_exam="NL2 2026 PART1.pdf"
    ),
    ExamQuestion(
        stem="มีการให้ภาพถ่ายกัดฟัน 2 มุม ( มุมตรงและข้างซ้าย ) เห็นฟันซี่ 24 discoloration และให้ภาพ x-ray เห็น 24 มีวัสดุอุดใหญ่มาก (โจทย์แจ้งว่าเป็น amalgam) แต่ไม่เห็นจากด้าน buccal ,รูปHBW หินปูนproximalฟันกรามชัดมาก",
        proposition="อะไรส่งเสริมให้เกิดโรคปริทันต์รุนแรง",
        question_text="อะไรส่งเสริมให้เกิดโรคปริทันต์รุนแรง",
        choices=[
            ExamChoice(label="a", text="Plaque"),
            ExamChoice(label="b", text="Calculus"),
            ExamChoice(label="c", text="Faulty restoration"),
            ExamChoice(label="d", text="High frenum")
        ],
        category=ClinicalCategory.PERIODONTICS,
        task=ProfessionalTask.MECHANISM_OF_DISEASES,
        source_exam="NL2 2026 PART1.pdf"
    ),
    ExamQuestion(
        stem="มีการให้ภาพถ่ายกัดฟัน 2 มุม ( มุมตรงและข้างซ้าย ) เห็นฟันซี่ 24 discoloration และให้ภาพ x-ray เห็น 24 มีวัสดุอุดใหญ่มาก (โจทย์แจ้งว่าเป็น amalgam) แต่ไม่เห็นจากด้าน buccal ,รูปHBW หินปูนproximalฟันกรามชัดมาก",
        proposition="ใช้เครื่องมืออะไรขูดหินปูนฟันกรามหลัง",
        question_text="ใช้เครื่องมืออะไรขูดหินปูนฟันกรามหลัง",
        choices=[
            ExamChoice(label="a", text="Gracey curette 3/4, 7/8"),
            ExamChoice(label="b", text="Gracey curette 11/12, 13/14"),
            ExamChoice(label="c", text="universal curette 44R anterior sickle")
        ],
        category=ClinicalCategory.PERIODONTICS,
        task=ProfessionalTask.PROCEDURES,
        source_exam="NL2 2026 PART1.pdf"
    ),

    # STEM 5
    ExamQuestion(
        stem="ผู้ป่วยชายอายุ 60 ปี มีโรคประจำตัวเป็น HT, DM BP:125/85,PR:80 ทานยา warfarin 3 mg ทุกวัน INR = 3.7 ตรวจเมื่อ 7 วันที่แล้ว HbA1c = 6 ให้รูป x-ray มาเห็นฟันฝังซี่ 45",
        proposition="ถ้าเอาซี่ 45 ออกแล้ว ซี่44 โยก ต้องใช้ flexible splint ยึดไว้นานเท่าไหร่",
        question_text="ถ้าเอาซี่ 45 ออกแล้ว ซี่44 โยก ต้องใช้ flexible splint ยึดไว้นานเท่าไหร่",
        choices=[
            ExamChoice(label="a", text="1 week"),
            ExamChoice(label="b", text="2 weeks"),
            ExamChoice(label="c", text="4 weeks"),
            ExamChoice(label="d", text="6 weeks"),
            ExamChoice(label="e", text="8 weeks")
        ],
        category=ClinicalCategory.ORAL_SURGERY,
        task=ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT,
        source_exam="NL2 2026 PART1.pdf"
    ),
    ExamQuestion(
        stem="ผู้ป่วยชายอายุ 60 ปี มีโรคประจำตัวเป็น HT, DM BP:125/85,PR:80 ทานยา warfarin 3 mg ทุกวัน INR = 3.7 ตรวจเมื่อ 7 วันที่แล้ว HbA1c = 6 ให้รูป x-ray มาเห็นฟันฝังซี่ 45",
        proposition="ถ้าอยากตรวจว่า embedded นี้อยู่ด้าน Buccal หรือ Lingual ควรส่งถ่ายภาพรังสีใด",
        question_text="ถ้าอยากตรวจว่า embedded นี้อยู่ด้าน Buccal หรือ Lingual ควรส่งถ่ายภาพรังสีใด",
        choices=[
            ExamChoice(label="a", text="Occlusal topography"),
            ExamChoice(label="b", text="Vertical bitewing"),
            ExamChoice(label="c", text="Vertical tube shift"),
            ExamChoice(label="d", text="Horizontal tube shift"),
            ExamChoice(label="e", text="Lateral cephalogram")
        ],
        category=ClinicalCategory.ORAL_DIAGNOSIS_AND_ORAL_MEDICINE,
        task=ProfessionalTask.DATA_GATHERING_AND_DIAGNOSIS,
        source_exam="NL2 2026 PART1.pdf"
    ),
    ExamQuestion(
        stem="ผู้ป่วยชายอายุ 60 ปี มีโรคประจำตัวเป็น HT, DM BP:125/85,PR:80 ทานยา warfarin 3 mg ทุกวัน INR = 3.7 ตรวจเมื่อ 7 วันที่แล้ว HbA1c = 6 ให้รูป x-ray มาเห็นฟันฝังซี่ 45",
        proposition="ถ้าจะถอนซี่ 46 ปัญหาที่ต้องปรึกษาแพทย์ประจำตัว",
        question_text="ถ้าจะถอนซี่ 46 ปัญหาที่ต้องปรึกษาแพทย์ประจำตัว",
        choices=[
            ExamChoice(label="a", text="INR"),
            ExamChoice(label="b", text="DM"),
            ExamChoice(label="c", text="HT"),
            ExamChoice(label="d", text="low immune"),
            ExamChoice(label="e", text="wound healing")
        ],
        category=ClinicalCategory.ORAL_DIAGNOSIS_AND_ORAL_MEDICINE,
        task=ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT,
        source_exam="NL2 2026 PART1.pdf"
    ),

    # STEM 6
    ExamQuestion(
        stem="คนไข้หญิง อายุ 50 ปี ปวดหน้าหูทั้งสองข้าง มีอาการ Crepitus มีเสียงกรอบแกรบเวลาเคี้ยวอาหารและอ้าปาก รู้สึกอ้าปากได้น้อยลงมาเป็นปี pain free opening 25 mm, max 38 mm ระยะเวลาเป็นมาได้ 2 ปี อาการค่อยๆเพิ่มตามระยะเวลา",
        proposition="ให้รูป Panoramic มาด้วย ถามอะไรเป็นปัจจัยที่น่าจะทำให้เกิดลักษณะอาการนี้ (pano เห็น flat condyle ชัดๆเลยสองข้าง) เสียงครืดคราดสัมพันธ์กับอะไร",
        question_text="ให้รูป Panoramic มาด้วย ถามอะไรเป็นปัจจัยที่น่าจะทำให้เกิดลักษณะอาการนี้ (pano เห็น flat condyle ชัดๆเลยสองข้าง) เสียงครืดคราดสัมพันธ์กับอะไร",
        choices=[
            ExamChoice(label="a", text="Flattening of condyles"),
            ExamChoice(label="b", text="Decrease of synovial fluid"),
            ExamChoice(label="c", text="Articular disc displacement"),
            ExamChoice(label="d", text="Disc dislocation"),
            ExamChoice(label="e", text="Loss of posterior teeth")
        ],
        category=ClinicalCategory.OCCLUSION_AND_OROFACIAL_PAIN,
        task=ProfessionalTask.MECHANISM_OF_DISEASES,
        source_exam="NL2 2026 PART1.pdf"
    ),
    ExamQuestion(
        stem="คนไข้หญิง อายุ 50 ปี ปวดหน้าหูทั้งสองข้าง มีอาการ Crepitus มีเสียงกรอบแกรบเวลาเคี้ยวอาหารและอ้าปาก รู้สึกอ้าปากได้น้อยลงมาเป็นปี pain free opening 25 mm, max 38 mm ระยะเวลาเป็นมาได้ 2 ปี อาการค่อยๆเพิ่มตามระยะเวลา",
        proposition="Diagnosis TMJ",
        question_text="Diagnosis TMJ",
        choices=[
            ExamChoice(label="a", text="bilateral TMJ Disc displacement without reduction"),
            ExamChoice(label="b", text="bilateral TMJ Disc displacement with reduction"),
            ExamChoice(label="c", text="bilateral TMJ osteoarthritis"),
            ExamChoice(label="d", text="bilateral TMJ osteoarthrosis"),
            ExamChoice(label="e", text="bilateral TMJ arthritis")
        ],
        category=ClinicalCategory.OCCLUSION_AND_OROFACIAL_PAIN,
        task=ProfessionalTask.DATA_GATHERING_AND_DIAGNOSIS,
        source_exam="NL2 2026 PART1.pdf"
    ),
    ExamQuestion(
        stem="คนไข้หญิง อายุ 50 ปี ปวดหน้าหูทั้งสองข้าง มีอาการ Crepitus มีเสียงกรอบแกรบเวลาเคี้ยวอาหารและอ้าปาก รู้สึกอ้าปากได้น้อยลงมาเป็นปี pain free opening 25 mm, max 38 mm ระยะเวลาเป็นมาได้ 2 ปี อาการค่อยๆเพิ่มตามระยะเวลา",
        proposition="แนะนำการดูแลช่องปากยังไง",
        question_text="แนะนำการดูแลช่องปากยังไง",
        choices=[
            ExamChoice(label="a", text="แปรงสีฟันขนนุ่ม+chlorhexidine"),
            ExamChoice(label="b", text="แปรงสีฟันเด็ก+แปรงพุ่มเดี่ยว ( End tufted brush)"),
            ExamChoice(label="c", text="แปรงสีฟันขนนุ่มพิเศษ"),
            ExamChoice(label="d", text="แปรงสีฟันเด็ก+ไหมขัดฟัน")
        ],
        category=ClinicalCategory.OCCLUSION_AND_OROFACIAL_PAIN,
        task=ProfessionalTask.HEALTH_PROMOTION_AND_PREVENTION,
        source_exam="NL2 2026 PART1.pdf"
    ),

    # STEM 7
    ExamQuestion(
        stem="คนไข้อายุ 50 ปี มีอาการปวดบวมฟันด้านซ้ายล่าง ให้รูปในปากมา 2 รูป periapical film อีก 1 รูป\n35OD dislodged amalgam มีตุ่มหนอง, film เห็น periapical lesion\n37OM dislodged amalgam, film ไม่มี periapical lesion",
        proposition="ใน film เห็นอะไรที่บอกความยากในการรักษารากฟันซี่ 35",
        question_text="ใน film เห็นอะไรที่บอกความยากในการรักษารากฟันซี่ 35",
        choices=[
            ExamChoice(label="a", text="Root dilaceration"),
            ExamChoice(label="b", text="Canal obliterated"),
            ExamChoice(label="c", text="Variation of root morphology"),
            ExamChoice(label="d", text="Length of root canal"),
            ExamChoice(label="e", text="Size of periapical lesion")
        ],
        category=ClinicalCategory.ENDODONTICS,
        task=ProfessionalTask.DATA_GATHERING_AND_DIAGNOSIS,
        source_exam="NL2 2026 PART1.pdf"
    ),
    ExamQuestion(
        stem="คนไข้อายุ 50 ปี มีอาการปวดบวมฟันด้านซ้ายล่าง ให้รูปในปากมา 2 รูป periapical film อีก 1 รูป\n35OD dislodged amalgam มีตุ่มหนอง, film เห็น periapical lesion\n37OM dislodged amalgam, film ไม่มี periapical lesion",
        proposition="บูรณะซี่ 37 อย่างอะไร",
        question_text="บูรณะซี่ 37 อย่างอะไร",
        choices=[
            ExamChoice(label="a", text="Composite filling"),
            ExamChoice(label="b", text="GI"),
            ExamChoice(label="c", text="Onlay"),
            ExamChoice(label="d", text="Zirconia crown"),
            ExamChoice(label="e", text="Full metal crown")
        ],
        category=ClinicalCategory.RESTORATIVE_OPERATIVE_DENTISTRY,
        task=ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT,
        source_exam="NL2 2026 PART1.pdf"
    ),
    ExamQuestion(
        stem="คนไข้อายุ 50 ปี มีอาการปวดบวมฟันด้านซ้ายล่าง ให้รูปในปากมา 2 รูป periapical film อีก 1 รูป\n35OD dislodged amalgam มีตุ่มหนอง, film เห็น periapical lesion\n37OM dislodged amalgam, film ไม่มี periapical lesion",
        proposition="ถ้าซี่ 35 Diagnosis เป็น pulp necrosis with chronic apical abscess จะพบเชื้อในข้อใด ยังไม่เคยรักษารากมาก่อน",
        question_text="ถ้าซี่ 35 Diagnosis เป็น pulp necrosis with chronic apical abscess จะพบเชื้อในข้อใด ยังไม่เคยรักษารากมาก่อน",
        choices=[
            ExamChoice(label="a", text="Obligate anaerobe"),
            ExamChoice(label="b", text="Mixed anaerobe and aerobe"),
            ExamChoice(label="c", text="Aerobe"),
            ExamChoice(label="d", text="Facultative anaerobe")
        ],
        category=ClinicalCategory.ENDODONTICS,
        task=ProfessionalTask.MECHANISM_OF_DISEASES,
        source_exam="NL2 2026 PART1.pdf"
    ),

    # STEM 8
    ExamQuestion(
        stem="ซี่ 14 รักษารากฟันมา 6 เดือน วัสดุอุดหลุด expose gutta percha มา 2 เดือน\nซี่ 15 มี cl.V composite ขอบดูสะดุดๆจากฟัน (ไม่รู้ undermargin or overcontour)\nซี่ 45 มี cl.V composite เยินมากๆ มี secondary caries\nให้ฟิล์ม periapical มา เห็นซี่ 15 radiopaque restoration มี radiolucent rim รอบๆ",
        proposition="ควรรักษา 14อย่างไร",
        question_text="ควรรักษา 14อย่างไร",
        choices=[
            ExamChoice(label="a", text="อุด Cf แล้ว observe"),
            ExamChoice(label="b", text="Retreat และทำ ceramic crown"),
            ExamChoice(label="c", text="ทำ crown เลย"),
            ExamChoice(label="d", text="Retreat แล้ว cf")
        ],
        category=ClinicalCategory.ENDODONTICS,
        task=ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT,
        source_exam="NL2 2026 PART1.pdf"
    ),
    ExamQuestion(
        stem="ซี่ 14 รักษารากฟันมา 6 เดือน วัสดุอุดหลุด expose gutta percha มา 2 เดือน\nซี่ 15 มี cl.V composite ขอบดูสะดุดๆจากฟัน (ไม่รู้ undermargin or overcontour)\nซี่ 45 มี cl.V composite เยินมากๆ มี secondary caries\nให้ฟิล์ม periapical มา เห็นซี่ 15 radiopaque restoration มี radiolucent rim รอบๆ",
        proposition="ควรรักษา 14 อย่างไร",
        question_text="ควรรักษา 14 อย่างไร",
        choices=[
            ExamChoice(label="a", text="Repair with CF"),
            ExamChoice(label="b", text="Polishing"),
            ExamChoice(label="c", text="Repair with AF"),
            ExamChoice(label="d", text="Replace with CF"),
            ExamChoice(label="e", text="Observe")
        ],
        category=ClinicalCategory.RESTORATIVE_OPERATIVE_DENTISTRY,
        task=ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT,
        source_exam="NL2 2026 PART1.pdf"
    ),
    ExamQuestion(
        stem="ซี่ 14 รักษารากฟันมา 6 เดือน วัสดุอุดหลุด expose gutta percha มา 2 เดือน\nซี่ 15 มี cl.V composite ขอบดูสะดุดๆจากฟัน (ไม่รู้ undermargin or overcontour)\nซี่ 45 มี cl.V composite เยินมากๆ มี secondary caries\nให้ฟิล์ม periapical มา เห็นซี่ 15 radiopaque restoration มี radiolucent rim รอบๆ",
        proposition="ทำอย่างไรกับ 45",
        question_text="ทำอย่างไรกับ 45",
        choices=[
            ExamChoice(label="a", text="Repair with CF"),
            ExamChoice(label="b", text="Polishing"),
            ExamChoice(label="c", text="Repair with AF"),
            ExamChoice(label="d", text="Replace with CF"),
            ExamChoice(label="e", text="Observe")
        ],
        category=ClinicalCategory.RESTORATIVE_OPERATIVE_DENTISTRY,
        task=ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT,
        source_exam="NL2 2026 PART1.pdf"
    ),

    # STEM 9
    ExamQuestion(
        stem="คนไข้เพศหญิง อายุ 35 CC ไม่มีฟันเคี้ยวข้าว อยากทำฟันปลอมจะได้มีฟันช่วยเคี้ยว generalized floating teeth ทั้งขากรรไกรบนและล่าง occlusion ไม่ stable เเละให้ภาพ opg กับภาพฟันในช่องปากมา ใน opg เห็นเป็นฟันลอยๆ bone loss หนักๆ คนไข้มีปัญหาทางการเงิน อยากทำฟันปลอมเพื่อให้เคี้ยวอาหารได้กับดูบุคลิกภาพดีขึ้น",
        proposition="จะทำการรักษาอย่างไร",
        question_text="จะทำการรักษาอย่างไร",
        choices=[
            ExamChoice(label="a", text="ถอนทั้งหมดแล้วทำ immediate denture"),
            ExamChoice(label="b", text="ถอนฟันหน้าแล้วทำ immediate denture"),
            ExamChoice(label="c", text="ถอนฟันทั้งหมดแล้วทำ all on 4 dental implant"),
            ExamChoice(label="d", text="ถอนแล้วทำอะไรสักอย่างแต่เป็นพวกงาน fixed"),
            ExamChoice(label="e", text="ถอนทั้งหมดแล้วรอทำ CD")
        ],
        category=ClinicalCategory.PROSTHODONTICS,
        task=ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT,
        source_exam="NL2 2026 PART1.pdf"
    ),
    ExamQuestion(
        stem="คนไข้เพศหญิง อายุ 35 CC ไม่มีฟันเคี้ยวข้าว อยากทำฟันปลอมจะได้มีฟันช่วยเคี้ยว generalized floating teeth ทั้งขากรรไกรบนและล่าง occlusion ไม่ stable เเละให้ภาพ opg กับภาพฟันในช่องปากมา ใน opg เห็นเป็นฟันลอยๆ bone loss หนักๆ คนไข้มีปัญหาทางการเงิน อยากทำฟันปลอมเพื่อให้เคี้ยวอาหารได้กับดูบุคลิกภาพดีขึ้น",
        proposition="เมื่อเห็นดังภาพ อยากที่จะตรวจอะไรเพิ่ม",
        question_text="เมื่อเห็นดังภาพ อยากที่จะตรวจอะไรเพิ่ม",
        choices=[
            ExamChoice(label="a", text="CBC"),
            ExamChoice(label="b", text="CT scan"),
            ExamChoice(label="c", text="HbA1c"),
            ExamChoice(label="d", text="ไม่ส่งตรวจอะไรเพิ่มเติม")
        ],
        category=ClinicalCategory.ORAL_DIAGNOSIS_AND_ORAL_MEDICINE,
        task=ProfessionalTask.DATA_GATHERING_AND_DIAGNOSIS,
        source_exam="NL2 2026 PART1.pdf"
    ),

    # STEM 10
    ExamQuestion(
        stem="ให้รูป OPG มา 4 รูป\nHBW Q1,4 มี bridge 46(47)48\nHBW Q2,3 มี bridge 36(37)38 ซี่ 38 เหมือนมีขอบรั่ว\nภาพด้าน Lingual Q4 มี plaque เกรอะกรัง",
        proposition="ถ้าต้องทำ bridge 46-48 ใหม่ จาก oral hygiene ของคนไข้และต้องการความสวยงาม จะใช้ pontic แบบใด",
        question_text="ถ้าต้องทำ bridge 46-48 ใหม่ จาก oral hygiene ของคนไข้และต้องการความสวยงาม จะใช้ pontic แบบใด",
        choices=[
            ExamChoice(label="a", text="Modified ridge lap"),
            ExamChoice(label="b", text="Ridge lap"),
            ExamChoice(label="c", text="Hygienic"),
            ExamChoice(label="d", text="Conical"),
            ExamChoice(label="e", text="Ovate")
        ],
        category=ClinicalCategory.PROSTHODONTICS,
        task=ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT,
        source_exam="NL2 2026 PART1.pdf"
    ),
    ExamQuestion(
        stem="ให้รูป OPG มา 4 รูป\nHBW Q1,4 มี bridge 46(47)48\nHBW Q2,3 มี bridge 36(37)38 ซี่ 38 เหมือนมีขอบรั่ว\nภาพด้าน Lingual Q4 มี plaque เกรอะกรัง",
        proposition="ถ้าต้องถอน 38 ทิ้ง แต่ 36 จะใช้ครอบเดิม ตัด connector ยังไงดี",
        question_text="ถ้าต้องถอน 38 ทิ้ง แต่ 36 จะใช้ครอบเดิม ตัด connector ยังไงดี",
        choices=[
            ExamChoice(label="a", text="ตัดระหว่าง retainer 36 กับ pontic 37 จากนั้นถอน 38"),
            ExamChoice(label="b", text="ตัดระหว่าง pontic 37 กับ retainer 38 จากนั้นถอน 38"),
            ExamChoice(label="c", text="ตัดconnector ออกทั้งหมด แล้วค่อยถอน 38"),
            ExamChoice(label="d", text="เอา bridge ออกมาตัดระหว่าง retainer 36 กับ pontic 37 นอกปาก จากนั้นถอน 38 แล้วใส่ crown กลับเข้าไป"),
            ExamChoice(label="e", text="เอา bridge ออกมาระหว่าง pontic 37 กับ retainer 38 นอกปาก จากนั้นถอน 38 แล้วใส่ bridge กลับเข้าไป")
        ],
        category=ClinicalCategory.PROSTHODONTICS,
        task=ProfessionalTask.PROCEDURES,
        source_exam="NL2 2026 PART1.pdf"
    ),
    ExamQuestion(
        stem="ให้รูป OPG มา 4 รูป\nHBW Q1,4 มี bridge 46(47)48\nHBW Q2,3 มี bridge 36(37)38 ซี่ 38 เหมือนมีขอบรั่ว\nภาพด้าน Lingual Q4 มี plaque เกรอะกรัง",
        proposition="ทำความสะอาดใต้ Pontic ยังไง",
        question_text="ทำความสะอาดใต้ Pontic ยังไง",
        choices=[
            ExamChoice(label="a", text="Superfloss"),
            ExamChoice(label="b", text="Proxabrush")
        ],
        category=ClinicalCategory.PERIODONTICS,
        task=ProfessionalTask.HEALTH_PROMOTION_AND_PREVENTION,
        source_exam="NL2 2026 PART1.pdf"
    ),

    # STEM 11
    ExamQuestion(
        stem="คนไข้ปวดหน้าจมูก ก้มหน้าปวดด้านซ้าย มีประวัติถอนฟันดรามที่ฟันผุทะลุโพรงประสาทฟันมาก่อนหน้านี้ มาหาทันตแพทย์\nให้รูป waters view ด้านบนซ้ายมีขาวๆที่ max sinus เป็น sinusitis\nรูปประมาณนี้ air fluid level ต่างกับอีกข้างชัด",
        proposition="เจอหนองทะลุออกมาจากรูถอนฟัน ถามว่าmx ยังไง",
        question_text="เจอหนองทะลุออกมาจากรูถอนฟัน ถามว่าmx ยังไง",
        choices=[
            ExamChoice(label="a", text="hemostatic agent (gelfoam) + figure of eight"),
            ExamChoice(label="b", text="B flap advancement"),
            ExamChoice(label="c", text="พิมพ์ปากทำ obturator"),
            ExamChoice(label="d", text="Irrigate with 0.12% CHX MW")
        ],
        category=ClinicalCategory.ORAL_SURGERY,
        task=ProfessionalTask.PROCEDURES,
        source_exam="NL2 2026 PART1.pdf"
    ),
    ExamQuestion(
        stem="คนไข้ปวดหน้าจมูก ก้มหน้าปวดด้านซ้าย มีประวัติถอนฟันดรามที่ฟันผุทะลุโพรงประสาทฟันมาก่อนหน้านี้ มาหาทันตแพทย์\nให้รูป waters view ด้านบนซ้ายมีขาวๆที่ max sinus เป็น sinusitis\nรูปประมาณนี้ air fluid level ต่างกับอีกข้างชัด",
        proposition="อ่านฟิล์มอย่างไร",
        question_text="อ่านฟิล์มอย่างไร",
        choices=[
            ExamChoice(label="a", text="Cloudy appearance with air fluid level"),
            ExamChoice(label="b", text="Mucosal thickening"),
            ExamChoice(label="c", text="Dome shaped radiopaque")
        ],
        category=ClinicalCategory.ORAL_DIAGNOSIS_AND_ORAL_MEDICINE,
        task=ProfessionalTask.DATA_GATHERING_AND_DIAGNOSIS,
        source_exam="NL2 2026 PART1.pdf"
    ),

    # STEM 12
    ExamQuestion(
        stem="สาธารณสุขจะทำ AI chatbot เพื่อให้หญิงตั้งครรภ์มารับบริการทันตกรรมมากขึ้นและส่งเสริมสุขภาพช่องปาก\nสำรวจชุมชนพบว่าหญิงตั้งครรภ์มาตรวจฟันและรับคำแนะนำน้อยมาก เลยทำ AI chatbot ช่วยคัดกรองให้ก่อน (อารมณ์ teledent นิดนึง) โดยไปประชาสัมพันธ์ตามคลินิกฝากครรภ์ ตั้งเป้าว่าจะมีคนท้องมารับบริการเพิ่มขึ้น 20%",
        proposition="การทำ AI chatbot บริการคนท้อง คือ factor อะไร",
        question_text="การทำ AI chatbot บริการคนท้อง คือ factor อะไร",
        choices=[
            ExamChoice(label="a", text="Predisposing factor"),
            ExamChoice(label="b", text="Reinforcing factor"),
            ExamChoice(label="c", text="Enabling factor"),
            ExamChoice(label="d", text="Individual factor"),
            ExamChoice(label="e", text="Technology factor")
        ],
        category=ClinicalCategory.COMMUNITY_DENTISTRY,
        task=ProfessionalTask.MECHANISM_OF_DISEASES,
        source_exam="NL2 2026 PART1.pdf"
    ),
    ExamQuestion(
        stem="สาธารณสุขจะทำ AI chatbot เพื่อให้หญิงตั้งครรภ์มารับบริการทันตกรรมมากขึ้นและส่งเสริมสุขภาพช่องปาก\nสำรวจชุมชนพบว่าหญิงตั้งครรภ์มาตรวจฟันและรับคำแนะนำน้อยมาก เลยทำ AI chatbot ช่วยคัดกรองให้ก่อน (อารมณ์ teledent นิดนึง) โดยไปประชาสัมพันธ์ตามคลินิกฝากครรภ์ ตั้งเป้าว่าจะมีคนท้องมารับบริการเพิ่มขึ้น 20%",
        proposition="คนท้องควรมีส่วนร่วมยังไงมากสุดในโครงการนี้",
        question_text="คนท้องควรมีส่วนร่วมยังไงมากสุดในโครงการนี้",
        choices=[
            ExamChoice(label="a", text="ช่วยออกเงินค่า develop chatbot"),
            ExamChoice(label="b", text="ช่วย feedback ผลลัพธ์หลังใช้งานจริง"),
            ExamChoice(label="c", text="สาธารณสุขไปเก็บข้อมูลจากคนท้อง เอา pain point มาพัฒนา loop chatbot"),
            ExamChoice(label="d", text="คนท้องร่วมกันช่วยคุย สอบถาม train chatbot เพื่อตอบสนองความต้องการที่แตกต่างกัน")
        ],
        category=ClinicalCategory.COMMUNITY_DENTISTRY,
        task=ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT,
        source_exam="NL2 2026 PART1.pdf"
    ),
    ExamQuestion(
        stem="สาธารณสุขจะทำ AI chatbot เพื่อให้หญิงตั้งครรภ์มารับบริการทันตกรรมมากขึ้นและส่งเสริมสุขภาพช่องปาก\nสำรวจชุมชนพบว่าหญิงตั้งครรภ์มาตรวจฟันและรับคำแนะนำน้อยมาก เลยทำ AI chatbot ช่วยคัดกรองให้ก่อน (อารมณ์ teledent นิดนึง) โดยไปประชาสัมพันธ์ตามคลินิกฝากครรภ์ ตั้งเป้าว่าจะมีคนท้องมารับบริการเพิ่มขึ้น 20%",
        proposition="โครงการที่ทำอยู่ตรงกับ Ottawa ข้อใด",
        question_text="โครงการที่ทำอยู่ตรงกับ Ottawa ข้อใด",
        choices=[
            ExamChoice(label="a", text="Build health public policy"),
            ExamChoice(label="b", text="Create supportive environment"),
            ExamChoice(label="c", text="Strengthen community action"),
            ExamChoice(label="d", text="Develop personal skills"),
            ExamChoice(label="e", text="Reoriented health service")
        ],
        category=ClinicalCategory.COMMUNITY_DENTISTRY,
        task=ProfessionalTask.HEALTH_PROMOTION_AND_PREVENTION,
        source_exam="NL2 2026 PART1.pdf"
    ),

    # STEM 13
    ExamQuestion(
        stem="คนไข้อายุ 25 ปี จะไปสัมภาษณ์งาน มาตรวจฟัน ไม่เคยตรวจฟันมาก่อนไม่สนใจสุขภาพช่องปาก ฟันเคยปวด ปัจจุบันไม่ปวดแล้ว , รูปในช่องปากมีฟันผุเยอะหลายซี่ ฟันหายหลายซี่",
        proposition="House classification",
        question_text="House classification",
        choices=[
            ExamChoice(label="a", text="Indifferent"),
            ExamChoice(label="b", text="Hysterical"),
            ExamChoice(label="c", text="Philosophic"),
            ExamChoice(label="d", text="Exacting")
        ],
        category=ClinicalCategory.PROSTHODONTICS,
        task=ProfessionalTask.DATA_GATHERING_AND_DIAGNOSIS,
        source_exam="NL2 2026 PART1.pdf"
    ),

    # STEM 14
    ExamQuestion(
        stem="ผู้ป่วยหญิง 50 ปี รับประทานยา amitriptyline รักษาอาการซึมเศร้า มีอาการเจ็บแปล๊บที่ใบหน้าด้านซ้ายเมื่อขยับขากรรไกร ให้คะแนน 10/10 (NRS) มีอาการประมาณหนึ่งนาทีแล้วบรรเทาลง\nให้ภาพคลินิกกับ Pa ของ Q3 ซี่ 34 torsi ล้ม lingual ซี่ 36 เป็นครอบฟัน ดูปกติดี จากฟิล์มเคยรักษารากมา bone ปกติดี ไม่มีรอยโรค",
        proposition="ปัจจัยที่ทำให้มีคราบจุลินทรีย์เกาะเยอะที่ด้าน lingual ของฟันล่าง",
        question_text="ปัจจัยที่ทำให้มีคราบจุลินทรีย์เกาะเยอะที่ด้าน lingual ของฟันล่าง",
        choices=[
            ExamChoice(label="a", text="ยาต้านเศร้า ทำให้แร่ธาตุในน้ำลายเพิ่มขึ้น ทำให้เกิดหินปูนเพิ่ม"),
            ExamChoice(label="b", text="เพราะโรคซึมเศร้าและอาการปวด ทำให้ละเลยการดูแลสุขภาพช่องปาก"),
            ExamChoice(label="c", text="Lingual frenum เกาะสูง ขัดขวางการแปรงฟัน"),
            ExamChoice(label="d", text="36 รักษารากมาไม่ดี ทำให้ bone loss"),
            ExamChoice(label="e", text="36 secondary caries ทำให้ food impaction")
        ],
        category=ClinicalCategory.PERIODONTICS,
        task=ProfessionalTask.MECHANISM_OF_DISEASES,
        source_exam="NL2 2026 PART1.pdf"
    ),
    ExamQuestion(
        stem="ผู้ป่วยหญิง 50 ปี รับประทานยา amitriptyline รักษาอาการซึมเศร้า มีอาการเจ็บแปล๊บที่ใบหน้าด้านซ้ายเมื่อขยับขากรรไกร ให้คะแนน 10/10 (NRS) มีอาการประมาณหนึ่งนาทีแล้วบรรเทาลง\nให้ภาพคลินิกกับ Pa ของ Q3 ซี่ 34 torsi ล้ม lingual ซี่ 36 เป็นครอบฟัน ดูปกติดี จากฟิล์มเคยรักษารากมา bone ปกติดี ไม่มีรอยโรค",
        proposition="ปัจจัยส่งเสริมโรคปริทันต์อักเสบ",
        question_text="ปัจจัยส่งเสริมโรคปริทันต์อักเสบ",
        choices=[
            ExamChoice(label="a", text="Overcontour ของครอบฟันซี่ 36"),
            ExamChoice(label="b", text="Anatomical crown-root ratio ไม่เหมาะสม"),
            ExamChoice(label="c", text="Malposted tooth"),
            ExamChoice(label="d", text="Secondary caries ที่ครอบฟันซี่ 36 ทำให้เกิด food impaction")
        ],
        category=ClinicalCategory.PERIODONTICS,
        task=ProfessionalTask.MECHANISM_OF_DISEASES,
        source_exam="NL2 2026 PART1.pdf"
    ),
    ExamQuestion(
        stem="ผู้ป่วยหญิง 50 ปี รับประทานยา amitriptyline รักษาอาการซึมเศร้า มีอาการเจ็บแปล๊บที่ใบหน้าด้านซ้ายเมื่อขยับขากรรไกร ให้คะแนน 10/10 (NRS) มีอาการประมาณหนึ่งนาทีแล้วบรรเทาลง\nให้ภาพคลินิกกับ Pa ของ Q3 ซี่ 34 torsi ล้ม lingual ซี่ 36 เป็นครอบฟัน ดูปกติดี จากฟิล์มเคยรักษารากมา bone ปกติดี ไม่มีรอยโรค",
        proposition="Management อาการปวดนั้นอย่างไร",
        question_text="Management อาการปวดนั้นอย่างไร",
        choices=[
            ExamChoice(label="a", text="กรอแก้สบฟันซี่ 36"),
            ExamChoice(label="b", text="พิจารณาจ่ายยา carbamazepine"),
            ExamChoice(label="c", text="เลี่ยงการอ้าปากกว้าง ทานอาหารที่ต้องเคี้ยวเยอะๆ"),
            ExamChoice(label="d", text="ประคบอุ่นแก้มซ้าย")
        ],
        category=ClinicalCategory.OCCLUSION_AND_OROFACIAL_PAIN,
        task=ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT,
        source_exam="NL2 2026 PART1.pdf"
    ),

    # STEM 15
    ExamQuestion(
        stem="ผู้ป่วยชายไทย 50 ปี เหลือฟันหลังประมาณ 3 คู่สบและมีฟัน supraeruption เพราะไม่มีคู่สบหลายซี่ ส่วนฟันหน้าเหลือเยอะ",
        proposition="ขั้นตอนแรกในการทำ prosthetic คืออะไร",
        question_text="ขั้นตอนแรกในการทำ prosthetic คืออะไร",
        choices=[
            ExamChoice(label="a", text="denture design"),
            ExamChoice(label="b", text="diagnostic cast mounting"),
            ExamChoice(label="c", text="tooth alteration"),
            ExamChoice(label="d", text="occlusal analysis"),
            ExamChoice(label="e", text="mandibular torectomy")
        ],
        category=ClinicalCategory.PROSTHODONTICS,
        task=ProfessionalTask.PROCEDURES,
        source_exam="NL2 2026 PART1.pdf"
    ),
    ExamQuestion(
        stem="ผู้ป่วยชายไทย 50 ปี เหลือฟันหลังประมาณ 3 คู่สบและมีฟัน supraeruption เพราะไม่มีคู่สบหลายซี่ ส่วนฟันหน้าเหลือเยอะ",
        proposition="virulence factor ของเชื้อที่ทำให้เกิดโรค periodontitis คือ",
        question_text="virulence factor ของเชื้อที่ทำให้เกิดโรค periodontitis คือ",
        choices=[
            ExamChoice(label="a", text="LPS"),
            ExamChoice(label="b", text="exotoxin"),
            ExamChoice(label="c", text="collagen dismutase")
        ],
        category=ClinicalCategory.PERIODONTICS,
        task=ProfessionalTask.MECHANISM_OF_DISEASES,
        source_exam="NL2 2026 PART1.pdf"
    ),

    # STEM 16
    ExamQuestion(
        stem="ผู้ป่วยเพศหญิงอายุ 50 ปี แก้มขวาบวมมา 2 วัน ไม่มีบวมและร้อน กดเจ็บเล็กน้อย ประวัติพึ่งถอนฟัน 46 เมื่อสัปดาห์ที่แล้ว\nรูปประมาณนี้แต่ไม่มี 46 แล้ว vestibule ลึกกว่านี้",
        proposition="ต้องฉีดยาชายังไงก่อน incision & drain",
        question_text="ต้องฉีดยาชายังไงก่อน incision & drain",
        choices=[
            ExamChoice(label="a", text="IAN block"),
            ExamChoice(label="b", text="Long buccal N block"),
            ExamChoice(label="c", text="IAN block, long buccal N block, infiltrate รอบ ๆ"),
            ExamChoice(label="d", text="Infiltrate รอบแผลถอนฟัน"),
            ExamChoice(label="e", text="Infiltrate บริเวณที่บวม")
        ],
        category=ClinicalCategory.ORAL_SURGERY,
        task=ProfessionalTask.PROCEDURES,
        source_exam="NL2 2026 PART1.pdf"
    ),
    ExamQuestion(
        stem="ผู้ป่วยเพศหญิงอายุ 50 ปี แก้มขวาบวมมา 2 วัน ไม่มีบวมและร้อน กดเจ็บเล็กน้อย ประวัติพึ่งถอนฟัน 46 เมื่อสัปดาห์ที่แล้ว\nรูปประมาณนี้แต่ไม่มี 46 แล้ว vestibule ลึกกว่านี้",
        proposition="จ่ายยา ibuprofen ต้องระวัง side effect อะไร",
        question_text="จ่ายยา ibuprofen ต้องระวัง side effect อะไร",
        choices=[
            ExamChoice(label="a", text="Gastric irritation"),
            ExamChoice(label="b", text="Cushingoid effect"),
            ExamChoice(label="c", text="Diarrhea")
        ],
        category=ClinicalCategory.ORAL_DIAGNOSIS_AND_ORAL_MEDICINE,
        task=ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT,
        source_exam="NL2 2026 PART1.pdf"
    ),
    ExamQuestion(
        stem="ผู้ป่วยเพศหญิงอายุ 50 ปี แก้มขวาบวมมา 2 วัน ไม่มีบวมและร้อน กดเจ็บเล็กน้อย ประวัติพึ่งถอนฟัน 46 เมื่อสัปดาห์ที่แล้ว\nรูปประมาณนี้แต่ไม่มี 46 แล้ว vestibule ลึกกว่านี้",
        proposition="แนวทางการเดินทางของเชื้อจากแผลถอนฟัน",
        question_text="แนวทางการเดินทางของเชื้อจากแผลถอนฟัน",
        choices=[
            ExamChoice(label="a", text="ใต้ buccinator"),
            ExamChoice(label="b", text="บน buccinator"),
            ExamChoice(label="c", text="ใต้ masseter"),
            ExamChoice(label="d", text="บน masseter"),
            ExamChoice(label="e", text="หลัง buccinator")
        ],
        category=ClinicalCategory.ORAL_SURGERY,
        task=ProfessionalTask.MECHANISM_OF_DISEASES,
        source_exam="NL2 2026 PART1.pdf"
    ),

    # STEM 17
    ExamQuestion(
        stem="เด็กอายุ 4 ขวบ หนัก 18 kg เป็น hemophilia A ปวดฟันซี่ 85",
        proposition="ฉีดยาชา 2% lidocaine 1:100,000 ฉีดได้มากที่สุดกี่หลอด",
        question_text="ฉีดยาชา 2% lidocaine 1:100,000 ฉีดได้มากที่สุดกี่หลอด",
        choices=[
            ExamChoice(label="a", text="0.5"),
            ExamChoice(label="b", text="1"),
            ExamChoice(label="c", text="1.5"),
            ExamChoice(label="d", text="2"),
            ExamChoice(label="e", text="2.5")
        ],
        category=ClinicalCategory.PEDIATRIC_DENTISTRY,
        task=ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT,
        source_exam="NL2 2026 PART1.pdf"
    ),
    ExamQuestion(
        stem="เด็กอายุ 4 ขวบ หนัก 18 kg เป็น hemophilia A ปวดฟันซี่ 85",
        proposition="เด็กมาทำฟันครั้งแรกไม่ให้ความร่วมมือ ดิ้น ร้องไห้ จัดเป็นพฤติกรรมแบบไหน",
        question_text="เด็กมาทำฟันครั้งแรกไม่ให้ความร่วมมือ ดิ้น ร้องไห้ จัดเป็นพฤติกรรมแบบไหน",
        choices=[
            ExamChoice(label="a", text="lacking coop"),
            ExamChoice(label="b", text="whinning"),
            ExamChoice(label="c", text="potentially coop"),
            ExamChoice(label="d", text="frankl’s scale 3"),
            ExamChoice(label="e", text="frankl’s scale 4")
        ],
        category=ClinicalCategory.PEDIATRIC_DENTISTRY,
        task=ProfessionalTask.DATA_GATHERING_AND_DIAGNOSIS,
        source_exam="NL2 2026 PART1.pdf"
    ),

    # STEM 18
    ExamQuestion(
        stem="ผู้ป่วยเพศหญิงอายุ 50 ปี ตรวจพบ ซี่ 14 วัสดุอุดมีรอยร้าวและขอบแนบไม่ดี\nภาพ clinic: ให้รูป arch บนมา ซี่ 14(OD) อุด Am มีฟันบนครบทุกซี่แต่ไม่มีซี่ 15 เเละให้ arch ล่างมีฟันครบทุกซี่ ฟันซี่ 44(OD) อุด Am, 45-48, 34-38 เป็น metal crown\nภาพ x-ray: ดูอุดดีไม่มี overhang ไม่มี overcontour ไม่มีรอยโรคปลายราก",
        proposition="ทำไมซี่ 14 วัสดุอุดถึงมีรอยร้าว",
        question_text="ทำไมซี่ 14 วัสดุอุดถึงมีรอยร้าว",
        choices=[
            ExamChoice(label="a", text="กรอ Isthmus แคบ"),
            ExamChoice(label="b", text="ไม่ได้ทำ retention groove"),
            ExamChoice(label="c", text="ไม่ได้ bevel axio-pulpal line"),
            ExamChoice(label="d", text="Angle of departure ไม่เกิน 90 องศา (จำไม่ได้ว่าเกิน หรือ ไม่เกิน)"),
            ExamChoice(label="e", text="ไม่ได้ทำ reverse curved")
        ],
        category=ClinicalCategory.RESTORATIVE_OPERATIVE_DENTISTRY,
        task=ProfessionalTask.MECHANISM_OF_DISEASES,
        source_exam="NL2 2026 PART1.pdf"
    ),
    ExamQuestion(
        stem="ผู้ป่วยเพศหญิงอายุ 50 ปี ตรวจพบ ซี่ 14 วัสดุอุดมีรอยร้าวและขอบแนบไม่ดี\nภาพ clinic: ให้รูป arch บนมา ซี่ 14(OD) อุด Am มีฟันบนครบทุกซี่แต่ไม่มีซี่ 15 เเละให้ arch ล่างมีฟันครบทุกซี่ ฟันซี่ 44(OD) อุด Am, 45-48, 34-38 เป็น metal crown\nภาพ x-ray: ดูอุดดีไม่มี overhang ไม่มี overcontour ไม่มีรอยโรคปลายราก",
        proposition="ถ้าจะปักรากเทียมซี่ 15 ต้องถ่ายภาพอะไร",
        question_text="ถ้าจะปักรากเทียมซี่ 15 ต้องถ่ายภาพอะไร",
        choices=[
            ExamChoice(label="a", text="CBCT"),
            ExamChoice(label="b", text="MRI"),
            ExamChoice(label="c", text="occlusal topography"),
            ExamChoice(label="d", text="orthopantomogram"),
            ExamChoice(label="e", text="lateral cephalogram")
        ],
        category=ClinicalCategory.PROSTHODONTICS,
        task=ProfessionalTask.DATA_GATHERING_AND_DIAGNOSIS,
        source_exam="NL2 2026 PART1.pdf"
    ),
    ExamQuestion(
        stem="ผู้ป่วยเพศหญิงอายุ 50 ปี ตรวจพบ ซี่ 14 วัสดุอุดมีรอยร้าวและขอบแนบไม่ดี\nภาพ clinic: ให้รูป arch บนมา ซี่ 14(OD) อุด Am มีฟันบนครบทุกซี่แต่ไม่มีซี่ 15 เเละให้ arch ล่างมีฟันครบทุกซี่ ฟันซี่ 44(OD) อุด Am, 45-48, 34-38 เป็น metal crown\nภาพ x-ray: ดูอุดดีไม่มี overhang ไม่มี overcontour ไม่มีรอยโรคปลายราก",
        proposition="ถ้าจะให้ซี่ 14 เป็น rest ต้องทำไง",
        question_text="ถ้าจะให้ซี่ 14 เป็น rest ต้องทำไง",
        choices=[
            ExamChoice(label="a", text="Repair Am ด้าน occlusal with Co"),
            ExamChoice(label="b", text="Replace Am with Am"),
            ExamChoice(label="c", text="Replace Am with Co"),
            ExamChoice(label="d", text="Replace Am with RMGI"),
            ExamChoice(label="e", text="Replace Am with crown")
        ],
        category=ClinicalCategory.PROSTHODONTICS,
        task=ProfessionalTask.PROCEDURES,
        source_exam="NL2 2026 PART1.pdf"
    ),

    # STEM 19
    ExamQuestion(
        stem="ให้ค่าเลือดมา Hbฝ MCH, MCHC ,platelet, neutrophil, lymphocyte น้อยหมด เเต่ WBC ปริมาณสูง\nให้ Hx บอกว่า มี lymphnode บวม ในปากมีตุ่มน้ำที่ palate ฝั่งเดียว",
        proposition="Dx จากค่าเลือดน่าจะเป็น",
        question_text="Dx จากค่าเลือดน่าจะเป็น",
        choices=[
            ExamChoice(label="a", text="Aplastic anemia"),
            ExamChoice(label="b", text="Hemophilia"),
            ExamChoice(label="c", text="Lymphoma"),
            ExamChoice(label="d", text="Leukemia"),
            ExamChoice(label="e", text="thrombocytopenia")
        ],
        category=ClinicalCategory.ORAL_DIAGNOSIS_AND_ORAL_MEDICINE,
        task=ProfessionalTask.DATA_GATHERING_AND_DIAGNOSIS,
        source_exam="NL2 2026 PART1.pdf"
    ),
    ExamQuestion(
        stem="ให้ค่าเลือดมา Hbฝ MCH, MCHC ,platelet, neutrophil, lymphocyte น้อยหมด เเต่ WBC ปริมาณสูง\nให้ Hx บอกว่า มี lymphnode บวม ในปากมีตุ่มน้ำที่ palate ฝั่งเดียว",
        proposition="การรักษาที่เหมาะสม",
        question_text="การรักษาที่เหมาะสม",
        choices=[
            ExamChoice(label="a", text="Corticosteroid"),
            ExamChoice(label="b", text="Acyclovia"),
            ExamChoice(label="c", text="Antifungal")
        ],
        category=ClinicalCategory.ORAL_DIAGNOSIS_AND_ORAL_MEDICINE,
        task=ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT,
        source_exam="NL2 2026 PART1.pdf"
    ),

    # STEM 20
    ExamQuestion(
        stem="เด็กให้รูปมาเหมือนมีรอยแผลเป็น cleft ตรงซี่ 22 ให้รูปในปากมา มีฟันซี่ 6 แท้ครบ, 31,41,32,42,11,21,43 มีซี่ 4 แท้ขึ้น กับรูป extraoral (เหมือนจะอยู่ part 2 นะข้อนี้)\nExtra oral เห็น scar เชื่อม upper lip กับฐานจมูกซ้าย, ปีกจมูกซ้ายเบี้ยวต่ำลงมา\nIntra oral upper arch เห็นรอย cleft ระหว่าง 21 63 ไม่มี 22\nรูปกัดฟัน ฝั่งไม่ cleft บนมี 11 12 13 54 (มี cusp 14 โผล่มาด้าน buccal นิดๆ) 55 16\nล่าง 41 42 83 84 85 46",
        proposition="ให้ประเมินอายุเด็ก (โจทย์บอกเลยว่าเด็กคนนี้ฟันขึ้นตรงตามอายุจริง ของเกณฑ์ …)",
        question_text="ให้ประเมินอายุเด็ก (โจทย์บอกเลยว่าเด็กคนนี้ฟันขึ้นตรงตามอายุจริง ของเกณฑ์ …)",
        choices=[
            ExamChoice(label="a", text="5-6 ขวบ"),
            ExamChoice(label="b", text="7-8 ขวบ"),
            ExamChoice(label="c", text="9-10 ขวบ"),
            ExamChoice(label="d", text="11-12 ขวบ"),
            ExamChoice(label="e", text="13-14 ขวบ")
        ],
        category=ClinicalCategory.PEDIATRIC_DENTISTRY,
        task=ProfessionalTask.DATA_GATHERING_AND_DIAGNOSIS,
        source_exam="NL2 2026 PART1.pdf"
    ),
    ExamQuestion(
        stem="เด็กให้รูปมาเหมือนมีรอยแผลเป็น cleft ตรงซี่ 22 ให้รูปในปากมา มีฟันซี่ 6 แท้ครบ, 31,41,32,42,11,21,43 มีซี่ 4 แท้ขึ้น กับรูป extraoral (เหมือนจะอยู่ part 2 นะข้อนี้)\nExtra oral เห็น scar เชื่อม upper lip กับฐานจมูกซ้าย, ปีกจมูกซ้ายเบี้ยวต่ำลงมา\nIntra oral upper arch เห็นรอย cleft ระหว่าง 21 63 ไม่มี 22\nรูปกัดฟัน ฝั่งไม่ cleft บนมี 11 12 13 54 (มี cusp 14 โผล่มาด้าน buccal นิดๆ) 55 16\nล่าง 41 42 83 84 85 46",
        proposition="ฟันซี่ 22 ที่ไม่ขึ้นเกิดจากอะไร",
        question_text="ฟันซี่ 22 ที่ไม่ขึ้นเกิดจากอะไร",
        choices=[
            ExamChoice(label="a", text="Alveolar cleft"),
            ExamChoice(label="b", text="Anodontia"),
            ExamChoice(label="c", text="Early loss of primary"),
            ExamChoice(label="d", text="Insufficient space")
        ],
        category=ClinicalCategory.PEDIATRIC_DENTISTRY,
        task=ProfessionalTask.MECHANISM_OF_DISEASES,
        source_exam="NL2 2026 PART1.pdf"
    ),

    # STEM 21
    ExamQuestion(
        stem="ผู้ป่วยชายอายุ 50 ปี มีลูก 2 คน ดูแลแม่ที่ติดเตียงที่บ้าน มีความสามารถในการซ่อมท่อประปาเป็นคนที่สามารถ สามารถช่วยเหลือเพื่อนบ้านได้ และเพื่อนบ้านก็ช่วยเหลือเหมือนกัน ชอบนั่งสมาธิและสวดมนต์\nวันนึงปวดฟันมากจึงมาพบทันตแพทย์",
        proposition="จากโจทย์ที่กล่าวมาปัจจัยไหนที่ไม่ได้กล่าวถึงใน พรบ.สุขภาพ 2550",
        question_text="จากโจทย์ที่กล่าวมาปัจจัยไหนที่ไม่ได้กล่าวถึงใน พรบ.สุขภาพ 2550",
        choices=[
            ExamChoice(label="a", text="ร่างกาย"),
            ExamChoice(label="b", text="จิตใจ"),
            ExamChoice(label="c", text="ปัญญา"),
            ExamChoice(label="d", text="สังคม"),
            ExamChoice(label="e", text="ทุกด้าน")
        ],
        category=ClinicalCategory.COMMUNITY_DENTISTRY,
        task=ProfessionalTask.DATA_GATHERING_AND_DIAGNOSIS,
        source_exam="NL2 2026 PART1.pdf"
    ),
    ExamQuestion(
        stem="ผู้ป่วยชายอายุ 50 ปี มีลูก 2 คน ดูแลแม่ที่ติดเตียงที่บ้าน มีความสามารถในการซ่อมท่อประปาเป็นคนที่สามารถ สามารถช่วยเหลือเพื่อนบ้านได้ และเพื่อนบ้านก็ช่วยเหลือเหมือนกัน ชอบนั่งสมาธิและสวดมนต์\nวันนึงปวดฟันมากจึงมาพบทันตแพทย์",
        proposition="อะไรคือเป้าหมายสูงสุดของคุณลุงตามหลัก",
        question_text="อะไรคือเป้าหมายสูงสุดของคุณลุงตามหลัก",
        choices=[
            ExamChoice(label="a", text="ไม่ต้องพบหมอฟันกับหมอเบาหวานอีกเลย"),
            ExamChoice(label="b", text="มีความรู้เรื่อง…"),
            ExamChoice(label="c", text="มีคุณภาพชีวิตในมิติสุขภาพช่องปากที่ดี")
        ],
        category=ClinicalCategory.COMMUNITY_DENTISTRY,
        task=ProfessionalTask.HEALTH_PROMOTION_AND_PREVENTION,
        source_exam="NL2 2026 PART1.pdf"
    ),
    ExamQuestion(
        stem="ผู้ป่วยชายอายุ 50 ปี มีลูก 2 คน ดูแลแม่ที่ติดเตียงที่บ้าน มีความสามารถในการซ่อมท่อประปาเป็นคนที่สามารถ สามารถช่วยเหลือเพื่อนบ้านได้ และเพื่อนบ้านก็ช่วยเหลือเหมือนกัน ชอบนั่งสมาธิและสวดมนต์\nวันนึงปวดฟันมากจึงมาพบทันตแพทย์",
        proposition="การประเมินความน่าเชื่อถือ ของการวิจัยเกี่ยวกับผลการดูแลโรคปริทันต์ ในผู้ป่วยเบาหวาน ดูจากอะไร",
        question_text="การประเมินความน่าเชื่อถือ ของการวิจัยเกี่ยวกับผลการดูแลโรคปริทันต์ ในผู้ป่วยเบาหวาน ดูจากอะไร",
        choices=[
            ExamChoice(label="a", text="การออกแบบการวิจัย"),
            ExamChoice(label="b", text="ประเทศที่ทำการวิจัย"),
            ExamChoice(label="c", text="คุณวุฒิของผู้ทำวิจัย"),
            ExamChoice(label="d", text="impact factor ของนิตยาสารที่ตีพิมพ์"),
            ExamChoice(label="e", text="ปีที่ตีพิมพ์")
        ],
        category=ClinicalCategory.COMMUNITY_DENTISTRY,
        task=ProfessionalTask.DATA_GATHERING_AND_DIAGNOSIS,
        source_exam="NL2 2026 PART1.pdf"
    ),

    # STEM 22
    ExamQuestion(
        stem="เด็ก 5 ขวบ นน. 20 kg มาด้วยปวดฟันกรามล่างขวาตอนเคี้ยวเศษอาหารไปติด ปวดตอนกลางคืน\nให้ภาพฟิล์ม 85 lamina dura หาย",
        proposition="จ่ายยาแก้ปวดใด",
        question_text="จ่ายยาแก้ปวดใด",
        choices=[
            ExamChoice(label="a", text="Para 120 3 tsp q4h"),
            ExamChoice(label="b", text="Para 250 1 tsp q4h"),
            ExamChoice(label="c", text="Para 120 1 tsp q4h"),
            ExamChoice(label="d", text="Para 250 3 tsp q4h"),
            ExamChoice(label="e", text="Para 120 1.5 tsp prn")
        ],
        category=ClinicalCategory.PEDIATRIC_DENTISTRY,
        task=ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT,
        source_exam="NL2 2026 PART1.pdf"
    ),
    ExamQuestion(
        stem="เด็ก 5 ขวบ นน. 20 kg มาด้วยปวดฟันกรามล่างขวาตอนเคี้ยวเศษอาหารไปติด ปวดตอนกลางคืน\nให้ภาพฟิล์ม 85 lamina dura หาย",
        proposition="ซี่ 85 รักษาอะไร",
        question_text="ซี่ 85 รักษาอะไร",
        choices=[
            ExamChoice(label="a", text="pulpotomy"),
            ExamChoice(label="b", text="composite filling"),
            ExamChoice(label="c", text="SSC"),
            ExamChoice(label="d", text="indirect pulp therapy"),
            ExamChoice(label="e", text="pulpectomy")
        ],
        category=ClinicalCategory.PEDIATRIC_DENTISTRY,
        task=ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT,
        source_exam="NL2 2026 PART1.pdf"
    ),
    ExamQuestion(
        stem="เด็ก 5 ขวบ นน. 20 kg มาด้วยปวดฟันกรามล่างขวาตอนเคี้ยวเศษอาหารไปติด ปวดตอนกลางคืน\nให้ภาพฟิล์ม 85 lamina dura หาย",
        proposition="ฟลูออไรด์ที่เหมาะสม",
        question_text="ฟลูออไรด์ที่เหมาะสม",
        choices=[
            ExamChoice(label="a", text="0.05 NaF"),
            ExamChoice(label="b", text="0.2 NaF"),
            ExamChoice(label="c", text="5 NaF"),
            ExamChoice(label="d", text="1.1 NaF")
        ],
        category=ClinicalCategory.PEDIATRIC_DENTISTRY,
        task=ProfessionalTask.HEALTH_PROMOTION_AND_PREVENTION,
        source_exam="NL2 2026 PART1.pdf"
    ),

    # STEM 23
    ExamQuestion(
        stem="ผู้ป่วยชายอายุ 60 ปี เป็นโรคไตเรื้อรังต้องฟอกไตทุกวัน ให้ภาพในช่องปากมา เหลือฟันซี่ 15 14 13 23 35 34 33 32 31 41 42 43 44",
        proposition="ถ้าถอนซี่ 14 แล้วเกิด buccal space infection ควรจ่ายยาอะไร",
        question_text="ถ้าถอนซี่ 14 แล้วเกิด buccal space infection ควรจ่ายยาอะไร",
        choices=[
            ExamChoice(label="a", text="Clindamycin"),
            ExamChoice(label="b", text="Cephalexin"),
            ExamChoice(label="c", text="Amoxicillin"),
            ExamChoice(label="d", text="Augmentin"),
            ExamChoice(label="e", text="Metronidazole")
        ],
        category=ClinicalCategory.ORAL_DIAGNOSIS_AND_ORAL_MEDICINE,
        task=ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT,
        source_exam="NL2 2026 PART1.pdf"
    ),
    ExamQuestion(
        stem="ผู้ป่วยชายอายุ 60 ปี เป็นโรคไตเรื้อรังต้องฟอกไตทุกวัน ให้ภาพในช่องปากมา เหลือฟันซี่ 15 14 13 23 35 34 33 32 31 41 42 43 44",
        proposition="ขนาดพิมพ์ปากผู้ป่วยพบว่า alginate เข้าหลอดลม ผู้ป่วยหมดสติหาชีพจรไม่เจอจะทำอย่างไร",
        question_text="ขนาดพิมพ์ปากผู้ป่วยพบว่า alginate เข้าหลอดลม ผู้ป่วยหมดสติหาชีพจรไม่เจอจะทำอย่างไร",
        choices=[
            ExamChoice(label="a", text="เริ่มปั๊มหัวใจ"),
            ExamChoice(label="b", text="ใช้เครื่อง AED ทันที"),
            ExamChoice(label="c", text="โทรเรียก1669"),
            ExamChoice(label="d", text="ทำ black block")
        ],
        category=ClinicalCategory.ORAL_SURGERY,
        task=ProfessionalTask.PROCEDURES,
        source_exam="NL2 2026 PART1.pdf"
    ),
    ExamQuestion(
        stem="ผู้ป่วยชายอายุ 60 ปี เป็นโรคไตเรื้อรังต้องฟอกไตทุกวัน ให้ภาพในช่องปากมา เหลือฟันซี่ 15 14 13 23 35 34 33 32 31 41 42 43 44",
        proposition="คนไข้ไม่ถอนฟันจะเลือกทำ denture แบบใด",
        question_text="คนไข้ไม่ถอนฟันจะเลือกทำ denture แบบใด",
        choices=[
            ExamChoice(label="a", text="APD"),
            ExamChoice(label="b", text="RPD"),
            ExamChoice(label="c", text="Over dentures"),
            ExamChoice(label="d", text="CD"),
            ExamChoice(label="e", text="Implant")
        ],
        category=ClinicalCategory.PROSTHODONTICS,
        task=ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT,
        source_exam="NL2 2026 PART1.pdf"
    ),

    # STEM 24
    ExamQuestion(
        stem="ชายอายุ ? ปี มาด้วยอาการปวดฟันกรามล่างซ้าย ตรวจพบมีตุ่มหนองที่บริเวณฟันกรามน้อยล่างซ้าย ให้รูปทางคลินิกเป็น 46(MODP) amalgam filling มีรอยแตกใหญ่ทางด้าน OM ให้ฟิล์มซี่ 45",
        proposition="pulp necrosis with chronic apical abscess เชื้อ",
        question_text="pulp necrosis with chronic apical abscess เชื้อ",
        choices=[
            ExamChoice(label="a", text="Aerobes"),
            ExamChoice(label="b", text="Mixed anaerobes + aerobes"),
            ExamChoice(label="c", text="Facultative anaerobes"),
            ExamChoice(label="d", text="Obligative anaerobes")
        ],
        category=ClinicalCategory.ENDODONTICS,
        task=ProfessionalTask.MECHANISM_OF_DISEASES,
        source_exam="NL2 2026 PART1.pdf"
    ),
    ExamQuestion(
        stem="ชายอายุ ? ปี มาด้วยอาการปวดฟันกรามล่างซ้าย ตรวจพบมีตุ่มหนองที่บริเวณฟันกรามน้อยล่างซ้าย ให้รูปทางคลินิกเป็น 46(MODP) amalgam filling มีรอยแตกใหญ่ทางด้าน OM ให้ฟิล์มซี่ 45",
        proposition="คนไข้มาด้วยฟันซี่ 46 วัสดุอุดแตกใหญ่หายไปครึ่งนึง วัสดุอุดด้าน MODPฟันซี่นี่ควรบูรณะด้วย",
        question_text="คนไข้มาด้วยฟันซี่ 46 วัสดุอุดแตกใหญ่หายไปครึ่งนึง วัสดุอุดด้าน MODPฟันซี่นี่ควรบูรณะด้วย",
        choices=[
            ExamChoice(label="a", text="Full metal crown"),
            ExamChoice(label="b", text="Resin composite"),
            ExamChoice(label="c", text="Ceramic inlay onlay"),
            ExamChoice(label="d", text="RMGI"),
            ExamChoice(label="e", text="Full metal crown")
        ],
        category=ClinicalCategory.RESTORATIVE_OPERATIVE_DENTISTRY,
        task=ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT,
        source_exam="NL2 2026 PART1.pdf"
    ),
    ExamQuestion(
        stem="ชายอายุ ? ปี มาด้วยอาการปวดฟันกรามล่างซ้าย ตรวจพบมีตุ่มหนองที่บริเวณฟันกรามน้อยล่างซ้าย ให้รูปทางคลินิกเป็น 46(MODP) amalgam filling มีรอยแตกใหญ่ทางด้าน OM ให้ฟิล์มซี่ 45",
        proposition="ปัจจัยที่ทำให้รักษารากยากในฟันซี่นี้คือ",
        question_text="ปัจจัยที่ทำให้รักษารากยากในฟันซี่นี้คือ",
        choices=[
            ExamChoice(label="a", text="Size of periapical lesion"),
            ExamChoice(label="b", text="Root canal dilaceration"),
            ExamChoice(label="c", text="Variations of root canal"),
            ExamChoice(label="d", text="Length of tooth"),
            ExamChoice(label="e", text="Root canal calcification")
        ],
        category=ClinicalCategory.ENDODONTICS,
        task=ProfessionalTask.MECHANISM_OF_DISEASES,
        source_exam="NL2 2026 PART1.pdf"
    )
]

bank = ExamBank(questions=questions)

with open('/Users/admin/Downloads/NL Test/parsed_exams/NL2_2026_PART1.json', 'w', encoding='utf-8') as f:
    f.write(bank.model_dump_json(indent=2))

print("JSON saved successfully!")
