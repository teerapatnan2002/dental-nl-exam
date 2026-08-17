import json

data = {
    "questions": [
        {
            "question_text": "ทำฟันปลอม ตอน insert and recheck ต้องบอกอะไรคนไข้หรือมีข้อควรระวังอะไร",
            "choices": [
                {"label": "A", "text": "ใส่ฟันปลอมตลอดในช่วง 24 ชั่วโมงแรก"},
                {"label": "B", "text": "ระวังอย่าให้ฟันปลอมกด เพราะจะเกิดแผลกดเจ็บได้"},
                {"label": "C", "text": "แช่ฟันปลอมในน้ำยาฆ่าเชื้อทุกคืน"},
                {"label": "D", "text": "เอาขอบไว้ยาวๆ เพื่อเพิ่ม atmospheric pressure กระตุ้นสารคัดหลั่ง เช่น น้ำลาย"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมประดิษฐ์",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "ชาย 50 ปี เป็นเบาหวานมา 10 ปี พบแพทย์ทุก 3 เดือน ให้ภาพในปาก Kennedy Class I mod 1 บน/ล่าง ผุคอฟันไม่รู้ลึกแค่ไหนทุกซี่",
            "proposition": "ทำฟันปลอม ตอน insert and recheck ต้องบอกอะไรคนไข้หรือมีข้อควรระวังอะไร"
        },
        {
            "question_text": "ถอนฟันเสร็จก่อนทำฟันปลอมต้องทำอะไรอีก",
            "choices": [
                {"label": "A", "text": "Alveoloplasty"},
                {"label": "B", "text": "Vestibuloplasty"},
                {"label": "C", "text": "Lingual frenectomy"},
                {"label": "D", "text": "Bone block graft"},
                {"label": "E", "text": "Mucosa graft"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมประดิษฐ์",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "ชาย 50 ปี เป็นเบาหวานมา 10 ปี พบแพทย์ทุก 3 เดือน ให้ภาพในปาก Kennedy Class I mod 1 บน/ล่าง ผุคอฟันไม่รู้ลึกแค่ไหนทุกซี่",
            "proposition": "ถอนฟันเสร็จก่อนทำฟันปลอมต้องทำอะไรอีก"
        },
        {
            "question_text": "ตรวจ FBS 150 เห็นเหงือกอักเสบถามว่าเกิดการเปลี่ยนแปลงทางพยาธิสภาพอะไร",
            "choices": [
                {"label": "A", "text": "C reactive protein ลด"},
                {"label": "B", "text": "Protein kinase A เพิ่ม"},
                {"label": "C", "text": "TNF alpha ลด"},
                {"label": "D", "text": "Advanced glycated end product เพิ่ม"},
                {"label": "E", "text": "PGE2 ลดลง"}
            ],
            "correct_answer": None,
            "category": "ปริทันตวิทยา",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "ชาย 50 ปี เป็นเบาหวานมา 10 ปี พบแพทย์ทุก 3 เดือน ให้ภาพในปาก Kennedy Class I mod 1 บน/ล่าง ผุคอฟันไม่รู้ลึกแค่ไหนทุกซี่",
            "proposition": "ตรวจ FBS 150 เห็นเหงือกอักเสบถามว่าเกิดการเปลี่ยนแปลงทางพยาธิสภาพอะไร"
        },
        {
            "question_text": "สาเหตุที่ทำให้เกิดความผิดปกติของฟันซี่ 11",
            "choices": [
                {"label": "A", "text": "มีภาวะไข้สูงและชัก"},
                {"label": "B", "text": "ได้รับฟลูออไรด์มากเกินไป"},
                {"label": "C", "text": "ได้รับยาปฏิชีวนะต่อเนื่องมานาน (Tetracycline staining)"},
                {"label": "D", "text": "การบาดเจ็บการการสบคร่อมซี่ 11"},
                {"label": "E", "text": "เกิดอุบัติเหตุหกล้มฟันซี่ 51 กระแทกพื้น"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมสำหรับเด็ก",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "เด็กชายอายุ 10 ขวบ ฟันหน้าไม่สวย ให้รูปฟันซี่ 11 สีน้ำตาลเป็นหลุมอยู่ซี่เดียว ซี่11,12 มี median diastema 32-42 ล่าง mild crowding crossbite ที่ incisor ทั้ง 2 ซี่",
            "proposition": "สาเหตุที่ทำให้เกิดความผิดปกติของฟันซี่ 11"
        },
        {
            "question_text": "ช่วงวัยใดที่ทำให้เกิดความผิดปกติของฟันซี่ 11",
            "choices": [
                {"label": "A", "text": "ขณะอยู่ในครรภ์"},
                {"label": "B", "text": "ช่วงแรกเกิด"},
                {"label": "C", "text": "อายุ 1-2 ปี"},
                {"label": "D", "text": "อายุ 4-5 ปี"},
                {"label": "E", "text": "อายุ 6-7 ปี"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมสำหรับเด็ก",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "เด็กชายอายุ 10 ขวบ ฟันหน้าไม่สวย ให้รูปฟันซี่ 11 สีน้ำตาลเป็นหลุมอยู่ซี่เดียว ซี่11,12 มี median diastema 32-42 ล่าง mild crowding crossbite ที่ incisor ทั้ง 2 ซี่",
            "proposition": "ช่วงวัยใดที่ทำให้เกิดความผิดปกติของฟันซี่ 11"
        },
        {
            "question_text": "แก้ไขความผิดปกตินี้ได้อย่างไร",
            "choices": [
                {"label": "A", "text": "Serial extraction"},
                {"label": "B", "text": "Stippling ฟันหน้าล่าง"},
                {"label": "C", "text": "ติดเครื่องมือติดแน่นเพื่อปิด median diastema"},
                {"label": "D", "text": "จัดฟันเมื่อฟันแท้ขึ้นครบ"},
                {"label": "E", "text": "กัดไม้ไอศครีมเพื่อดันฟันซี่ 11,21"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมสำหรับเด็ก",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "เด็กชายอายุ 10 ขวบ ฟันหน้าไม่สวย ให้รูปฟันซี่ 11 สีน้ำตาลเป็นหลุมอยู่ซี่เดียว ซี่11,12 มี median diastema 32-42 ล่าง mild crowding crossbite ที่ incisor ทั้ง 2 ซี่",
            "proposition": "แก้ไขความผิดปกตินี้ได้อย่างไร"
        },
        {
            "question_text": "ข้อใดคือการจัดการที่เหมาะสม",
            "choices": [
                {"label": "A", "text": "GI"},
                {"label": "B", "text": "SSC"},
                {"label": "C", "text": "Strip crown"},
                {"label": "D", "text": "Resin composite"},
                {"label": "E", "text": "Amalgam"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมสำหรับเด็ก",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "เด็ก 5 ขวบ ECC ฟันหน้าผุ 4 ซี่ผุถึงเนื้อฟันรอบซี่",
            "proposition": "ข้อใดคือการจัดการที่เหมาะสม"
        },
        {
            "question_text": "ให้ฟลูออไรด์อะไรจึงจะเหมาะสม",
            "choices": [
                {"label": "A", "text": "18% SDF solution"},
                {"label": "B", "text": "1.23% APF gel"},
                {"label": "C", "text": "5% NaF varnish"},
                {"label": "D", "text": "Fluoride mouthwash"},
                {"label": "E", "text": "1500 ppm Fluoride toothpaste"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมสำหรับเด็ก",
            "task": "การสร้างเสริมสุขภาพและการป้องกัน",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "เด็ก 5 ขวบ ECC ฟันหน้าผุ 4 ซี่ผุถึงเนื้อฟันรอบซี่",
            "proposition": "ให้ฟลูออไรด์อะไรจึงจะเหมาะสม"
        },
        {
            "question_text": "ถ้าหากรักษารากซี่ 17 เสร็จเรียบร้อยเเล้วจะบูรณะต่อด้วยอะไร (CoF ใหญ่มากๆ)",
            "choices": [
                {"label": "A", "text": "MOD gold inlay"},
                {"label": "B", "text": "Full metal crown"},
                {"label": "C", "text": "OM glass ionomer filling"},
                {"label": "D", "text": "OM resin composite filling"},
                {"label": "E", "text": "OM tip MPa cusp bonded amalgam"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมบูรณะ/หัตถการ",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "คนไข้อายุ 70 ปี มีอาการปวดฟัน",
            "proposition": "ถ้าหากรักษารากซี่ 17 เสร็จเรียบร้อยเเล้วจะบูรณะต่อด้วยอะไร (CoF ใหญ่มากๆ)"
        },
        {
            "question_text": "รักษารากฟัน จะจับ clamp ซี่ 17 ใช้ ivory clamp อะไร",
            "choices": [
                {"label": "A", "text": "14"},
                {"label": "B", "text": "2"},
                {"label": "C", "text": "2A"},
                {"label": "D", "text": "6"},
                {"label": "E", "text": "9"}
            ],
            "correct_answer": None,
            "category": "วิทยาเอ็นโดดอนต์",
            "task": "ขั้นตอนและวิธีการรักษา",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "คนไข้อายุ 70 ปี มีอาการปวดฟัน",
            "proposition": "รักษารากฟัน จะจับ clamp ซี่ 17 ใช้ ivory clamp อะไร"
        },
        {
            "question_text": "จะ trace gutta percha ด้วย อะไร",
            "choices": [
                {"label": "A", "text": "Main cone No. 15"},
                {"label": "B", "text": "Main cone No. 30"},
                {"label": "C", "text": "Main cone No. 50"},
                {"label": "D", "text": "Lateral cone size FF"},
                {"label": "E", "text": "Maximum taper/ Greater taper"}
            ],
            "correct_answer": None,
            "category": "วิทยาเอ็นโดดอนต์",
            "task": "ขั้นตอนและวิธีการรักษา",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "คนไข้อายุ 70 ปี มีอาการปวดฟัน",
            "proposition": "จะ trace gutta percha ด้วย อะไร"
        },
        {
            "question_text": "ควรซักประวัติอะไรเพิ่ม",
            "choices": [
                {"label": "A", "text": "Glucose tolerance rate, EKG"},
                {"label": "B", "text": "HbA1C, โรคประจำตัวและยาทีกิน"},
                {"label": "C", "text": "CBC"},
                {"label": "D", "text": "Hematocrit, vitamin K"},
                {"label": "E", "text": "FBS, creatinine"}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "คนไข้มาหาทันตแพทย์เฉพาะเมื่อมีอาการ เคยเข้าโรงพยาบาลเพราะเป็น hyperglycemia ให้รูปฟันมา ไม่มีฟันซี่ 16,25 (น่าจะ), 36,46 หินปูนด้าน Li ของฟันหลัง quadrant 2-3 เยอะมาก torus palatinus ขนาดไม่ใหญ่มาก",
            "proposition": "ควรซักประวัติอะไรเพิ่ม"
        },
        {
            "question_text": "วัด floor of mouth 6 mm ใช้ major connector อะไรบ้างทั้งบนล่าง",
            "choices": [
                {"label": "A", "text": "บนมี A-P strap, palatal plate, U-shape ; ล่างมี Lingual plate, Lingual bar"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมประดิษฐ์",
            "task": "ขั้นตอนและวิธีการรักษา",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "คนไข้มาหาทันตแพทย์เฉพาะเมื่อมีอาการ เคยเข้าโรงพยาบาลเพราะเป็น hyperglycemia ให้รูปฟันมา ไม่มีฟันซี่ 16,25 (น่าจะ), 36,46 หินปูนด้าน Li ของฟันหลัง quadrant 2-3 เยอะมาก torus palatinus ขนาดไม่ใหญ่มาก",
            "proposition": "วัด floor of mouth 6 mm ใช้ major connector อะไรบ้างทั้งบนล่าง"
        },
        {
            "question_text": "ตรงฟันซี่ 26 จัดเป็นระดับไหน มีเซลล์อะไรอยู่เยอะ (ถ้าจำไม่ผิด โจทย์น่าจะบอกว่ามี pocket หรือ bone loss)",
            "choices": [
                {"label": "A", "text": "Advanced lesion with T cell"},
                {"label": "B", "text": "Advanced lesion with plasma cell"},
                {"label": "C", "text": "Established lesion with B cell"},
                {"label": "D", "text": "Established lesion with PMNs"},
                {"label": "E", "text": "Established lesion with osteoclast"}
            ],
            "correct_answer": None,
            "category": "ปริทันตวิทยา",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "คนไข้มาหาทันตแพทย์เฉพาะเมื่อมีอาการ เคยเข้าโรงพยาบาลเพราะเป็น hyperglycemia ให้รูปฟันมา ไม่มีฟันซี่ 16,25 (น่าจะ), 36,46 หินปูนด้าน Li ของฟันหลัง quadrant 2-3 เยอะมาก torus palatinus ขนาดไม่ใหญ่มาก",
            "proposition": "ตรงฟันซี่ 26 จัดเป็นระดับไหน มีเซลล์อะไรอยู่เยอะ"
        },
        {
            "question_text": "การจัดการที่เหมาะสมเพื่อเพิ่มระยะอ้าปาก",
            "choices": [
                {"label": "A", "text": "Jaw stretching exercise"},
                {"label": "B", "text": "Isometric jaw exercise"},
                {"label": "C", "text": "Orthognathic surgery"},
                {"label": "D", "text": "Masseter muscle resection"},
                {"label": "E", "text": "TMJ osteoplasty"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "ให้คนไข้ญ อายุ 35 ปี มาด้วยอ้าปากได้น้อย หลังจากเคี้ยวอัลมอนด์และมีเสียงกึก ปวดหน้าหูขวา มา 1 สัปดาห์ ให้รูปคลินิก อ้าปากได้ 22 mm เมื่อวัดจากปลายฟันซี่ 21-32 ให้ภาพ right excursion เยื้องได้เยอะ แต่ left excursion ได้น้อย มีรูป clinical 4 รูป เป็นรูปfrontal กัดฟัน เห็น13(La) เหมือนมี tooth gem? ตรงกลางฟัน",
            "proposition": "การจัดการที่เหมาะสมเพื่อเพิ่มระยะอ้าปาก"
        },
        {
            "question_text": "การจัดการเบื้องต้น",
            "choices": [
                {"label": "A", "text": "Home care and analgesic medication"},
                {"label": "B", "text": "Home care and orthodontic referral"},
                {"label": "C", "text": "Arthrocentesis lavage"},
                {"label": "D", "text": "Occlusal adjustment"},
                {"label": "E", "text": "Anterior bite plant"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "ให้คนไข้ญ อายุ 35 ปี มาด้วยอ้าปากได้น้อย หลังจากเคี้ยวอัลมอนด์และมีเสียงกึก ปวดหน้าหูขวา มา 1 สัปดาห์ ให้รูปคลินิก อ้าปากได้ 22 mm เมื่อวัดจากปลายฟันซี่ 21-32 ให้ภาพ right excursion เยื้องได้เยอะ แต่ left excursion ได้น้อย มีรูป clinical 4 รูป เป็นรูปfrontal กัดฟัน เห็น13(La) เหมือนมี tooth gem? ตรงกลางฟัน",
            "proposition": "การจัดการเบื้องต้น"
        },
        {
            "question_text": "เชื้อกลุ่มแรกที่ biofilm ซี่ 13",
            "choices": [
                {"label": "A", "text": "A. Israelii"},
                {"label": "B", "text": "P. Gingivalis"},
                {"label": "C", "text": "T. Denticola"},
                {"label": "D", "text": "S. Oralis"},
                {"label": "E", "text": "Fusobacterium nucleatum"}
            ],
            "correct_answer": None,
            "category": "ปริทันตวิทยา",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "ให้คนไข้ญ อายุ 35 ปี มาด้วยอ้าปากได้น้อย หลังจากเคี้ยวอัลมอนด์และมีเสียงกึก ปวดหน้าหูขวา มา 1 สัปดาห์ ให้รูปคลินิก อ้าปากได้ 22 mm เมื่อวัดจากปลายฟันซี่ 21-32 ให้ภาพ right excursion เยื้องได้เยอะ แต่ left excursion ได้น้อย มีรูป clinical 4 รูป เป็นรูปfrontal กัดฟัน เห็น13(La) เหมือนมี tooth gem? ตรงกลางฟัน",
            "proposition": "เชื้อกลุ่มแรกที่ biofilm ซี่ 13"
        },
        {
            "question_text": "ถ้าจะถอนฟัน 27 จะให้ยาแก้ปวดอะไร",
            "choices": [
                {"label": "A", "text": "Acetaminophen"},
                {"label": "B", "text": "Ibuprofen"},
                {"label": "C", "text": "Mefenamic Acid"},
                {"label": "D", "text": "Etoricoxib"},
                {"label": "E", "text": "Codeine"}
            ],
            "correct_answer": None,
            "category": "ศัลยศาสตร์ช่องปาก",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "ผู้ป่วยหญิงอายุ 60 มาด้วยการบวมที่เพดานมา 2 wk (แผลบวมๆ มี bone expose) ไม่มีอาการใดๆ มีโรคประจำตัว เป็น RA, HT, ไขมันในเลือดสูง, Osteoporosis กินยา Methotrexate, Naproxen, Alendronate,Denosumab, (+ยาความดัน ไขมัน), Calcium supplement",
            "proposition": "ถ้าจะถอนฟัน 27 จะให้ยาแก้ปวดอะไร"
        },
        {
            "question_text": "ถ้าคนไข้หมดสติที่เก้าอี้ทำฟัน เช็ค pulse ไม่มี pulse จะทำไรต่อหลังจาก call for help แล้ว",
            "choices": [
                {"label": "A", "text": "ช่วยหายใจ"},
                {"label": "B", "text": "เปิดทางเดินหายใจ"},
                {"label": "C", "text": "เปิดเส้นเลือด/ฉีดยา"},
                {"label": "D", "text": "กดหน้าอก"},
                {"label": "E", "text": "ใช้เครื่อง AED"}
            ],
            "correct_answer": None,
            "category": "ศัลยศาสตร์ช่องปาก",
            "task": "ขั้นตอนและวิธีการรักษา",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "ผู้ป่วยหญิงอายุ 60 มาด้วยการบวมที่เพดานมา 2 wk (แผลบวมๆ มี bone expose) ไม่มีอาการใดๆ มีโรคประจำตัว เป็น RA, HT, ไขมันในเลือดสูง, Osteoporosis กินยา Methotrexate, Naproxen, Alendronate,Denosumab, (+ยาความดัน ไขมัน), Calcium supplement",
            "proposition": "ถ้าคนไข้หมดสติที่เก้าอี้ทำฟัน เช็ค pulse ไม่มี pulse จะทำไรต่อหลังจาก call for help แล้ว"
        },
        {
            "question_text": "Diagnosis",
            "choices": [
                {"label": "A", "text": "MRONJ"},
                {"label": "B", "text": "Pleomorphic adenoma"},
                {"label": "C", "text": "Mucoepidermoid carcinoma"},
                {"label": "D", "text": "Traumatic ulcer"},
                {"label": "E", "text": "Mucormycosis"}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "ผู้ป่วยหญิงอายุ 60 มาด้วยการบวมที่เพดานมา 2 wk (แผลบวมๆ มี bone expose) ไม่มีอาการใดๆ มีโรคประจำตัว เป็น RA, HT, ไขมันในเลือดสูง, Osteoporosis กินยา Methotrexate, Naproxen, Alendronate,Denosumab, (+ยาความดัน ไขมัน), Calcium supplement",
            "proposition": "Diagnosis"
        },
        {
            "question_text": "อาการบวมที่เพดานมีสาเหตุจากอะไร",
            "choices": [
                {"label": "A", "text": "Infection"},
                {"label": "B", "text": "Odontogenic cyst"},
                {"label": "C", "text": "Malignant tumor"},
                {"label": "D", "text": "Non-odontogenic cyst"},
                {"label": "E", "text": "Odontogenic tumor"}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "ผู้ป่วยชาย อายุ 70 ปี เป็นเบาหวาน ยังไม่ได้รับการรักษา BP153/90, PR 90 bpm, temp 36.5 celsius, respiratory rate 18, มี retained root ซี่ 13 มาด้วยอาการเหงือกบวมโต เป็นมา 3 วัน บวมขึ้นเรื่อยๆ ให้ภาพ x-ray มา ซี่ 13 มี periapical lesion + ข้าง ๆ มีก้อนบวมใหญ่ ๆ แถว midline ไปถึง palate, positive to palpation, fluctuant, ดูมี pus อยู่ด้านใน รูปในช่องปาก: Upper complete edentulism มี Retained root of 13 บริเวณดังกล่าวเหงือกบวม รวม ถึงเพดานบวมด้วย OPG: Retained root 13 with periapical lesion Topo: bone loss รอบ retained root of 13",
            "proposition": "อาการบวมที่เพดานมีสาเหตุจากอะไร"
        },
        {
            "question_text": "จะรักษายังไง",
            "choices": [
                {"label": "A", "text": "Extraction of 13 and drain"},
                {"label": "B", "text": "Incision and drain"},
                {"label": "C", "text": "Incisional biopsy"},
                {"label": "D", "text": "Enucleation/marsupialization"},
                {"label": "E", "text": "จ่าย IV Antibiotics"}
            ],
            "correct_answer": None,
            "category": "ศัลยศาสตร์ช่องปาก",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "ผู้ป่วยชาย อายุ 70 ปี เป็นเบาหวาน ยังไม่ได้รับการรักษา BP153/90, PR 90 bpm, temp 36.5 celsius, respiratory rate 18, มี retained root ซี่ 13 มาด้วยอาการเหงือกบวมโต เป็นมา 3 วัน บวมขึ้นเรื่อยๆ ให้ภาพ x-ray มา ซี่ 13 มี periapical lesion + ข้าง ๆ มีก้อนบวมใหญ่ ๆ แถว midline ไปถึง palate, positive to palpation, fluctuant, ดูมี pus อยู่ด้านใน รูปในช่องปาก: Upper complete edentulism มี Retained root of 13 บริเวณดังกล่าวเหงือกบวม รวม ถึงเพดานบวมด้วย OPG: Retained root 13 with periapical lesion Topo: bone loss รอบ retained root of 13",
            "proposition": "จะรักษายังไง"
        },
        {
            "question_text": "หากคนไข้เป็นลมหมดสติเรียกไม่ตื่น ต้องทำอย่างไรเป็นอันดับแรก",
            "choices": [
                {"label": "A", "text": "วัดระดับน้ำตาลบริเวณปลายนิ้ว"},
                {"label": "B", "text": "คลำชีพจร"},
                {"label": "C", "text": "วัด Blood Pressure"},
                {"label": "D", "text": "วัด O2 saturation"},
                {"label": "E", "text": "วัด Body Temperature"}
            ],
            "correct_answer": None,
            "category": "ศัลยศาสตร์ช่องปาก",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "ผู้ป่วยชาย อายุ 70 ปี เป็นเบาหวาน ยังไม่ได้รับการรักษา BP153/90, PR 90 bpm, temp 36.5 celsius, respiratory rate 18, มี retained root ซี่ 13 มาด้วยอาการเหงือกบวมโต เป็นมา 3 วัน บวมขึ้นเรื่อยๆ ให้ภาพ x-ray มา ซี่ 13 มี periapical lesion + ข้าง ๆ มีก้อนบวมใหญ่ ๆ แถว midline ไปถึง palate, positive to palpation, fluctuant, ดูมี pus อยู่ด้านใน รูปในช่องปาก: Upper complete edentulism มี Retained root of 13 บริเวณดังกล่าวเหงือกบวม รวม ถึงเพดานบวมด้วย OPG: Retained root 13 with periapical lesion Topo: bone loss รอบ retained root of 13",
            "proposition": "หากคนไข้เป็นลมหมดสติเรียกไม่ตื่น ต้องทำอย่างไรเป็นอันดับแรก"
        },
        {
            "question_text": "นอกจาก Develop personal skills แล้ว ทันตแพทย์สามารถจัดกิจกรรมที่ส่งเสริมสุขภาพช่องปากในวัดนี้ได้อย่างไรตามหลัก Ottawa Charter",
            "choices": [
                {"label": "A", "text": "สร้างความตระหนักการแปรงฟัน"},
                {"label": "B", "text": "สร้างทัศนคติที่ดีต่อการดูแลสุขภาพช่องปาก"},
                {"label": "C", "text": "แนะนำเทคนิคแปรงฟันแห้ง"},
                {"label": "D", "text": "จัดการควบคุมอาหารและเครื่องดื่มภายในวัด"},
                {"label": "E", "text": "ให้ทันตสุขศึกษาเรื่องอาหารและเครื่องดื่ม"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมชุมชน",
            "task": "การสร้างเสริมสุขภาพและการป้องกัน",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "พระสงฆ์ที่วัดแห่งหนึ่งจำนวน 20 รูป มีความชุกของฟันผุร้อยละ 90 และมีค่าเฉลี่ย DMFT 6.8 ซี่ต่อคน",
            "proposition": "นอกจาก Develop personal skills แล้ว ทันตแพทย์สามารถจัดกิจกรรมที่ส่งเสริมสุขภาพช่องปากในวัดนี้ได้อย่างไรตามหลัก Ottawa Charter"
        },
        {
            "question_text": "หากท่านต้องการเปรียบเทียบความชุกและความรุนแรงของโรคฟันผุของพระสงฆ์กับสภาวะช่องปากแห่งชาติ ต้องเก็บข้อมูลแบบใด",
            "choices": [
                {"label": "A", "text": "จำแนกกลุ่มตามอายุ"},
                {"label": "B", "text": "จำแนกกลุ่มตามระดับการศึกษา"},
                {"label": "C", "text": "จำแนกกลุ่มตามภูมิลำเนา"},
                {"label": "D", "text": "สัมภาษณ์นโยบายเรื่องเครื่องดื่มและอาหารจากเจ้าอาวาส"},
                {"label": "E", "text": "เก็บข้อมูลจากการสอบถามเกี่ยวกับประสบการณ์ทันตสาธารณสุขที่พระสงฆ์ได้รับ"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมชุมชน",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "พระสงฆ์ที่วัดแห่งหนึ่งจำนวน 20 รูป มีความชุกของฟันผุร้อยละ 90 และมีค่าเฉลี่ย DMFT 6.8 ซี่ต่อคน",
            "proposition": "หากท่านต้องการเปรียบเทียบความชุกและความรุนแรงของโรคฟันผุของพระสงฆ์กับสภาวะช่องปากแห่งชาติ ต้องเก็บข้อมูลแบบใด"
        },
        {
            "question_text": "ปัจจัยใดที่ส่งผลต่อการเกิดโรคฟันผุมากกว่าคนปกติ",
            "choices": [
                {"label": "A", "text": "ทัศนคติต่อการเข้ารับการรักษาทางทันตกรรม"},
                {"label": "B", "text": "ทักษะในการแปรงฟัน"},
                {"label": "C", "text": "ความถี่ในการบริโภคเครื่องดื่มที่มีน้ำตาลสูง"},
                {"label": "D", "text": "การดูแลอนามัยช่องปาก"},
                {"label": "E", "text": "โรคประจำตัว"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมชุมชน",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "พระสงฆ์ที่วัดแห่งหนึ่งจำนวน 20 รูป มีความชุกของฟันผุร้อยละ 90 และมีค่าเฉลี่ย DMFT 6.8 ซี่ต่อคน",
            "proposition": "ปัจจัยใดที่ส่งผลต่อการเกิดโรคฟันผุมากกว่าคนปกติ"
        },
        {
            "question_text": "Diagnosis คืออะไร",
            "choices": [
                {"label": "A", "text": "Odontoma"},
                {"label": "B", "text": "Ossifying fibroma"},
                {"label": "C", "text": "Osteoid osteoma"},
                {"label": "D", "text": "Odontogenic keratocyst"},
                {"label": "E", "text": "Cementoblastoma"}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "เด็กอายุมาด้วยฟันหน้าล่างห่าง และฟันหน้าบน 4 ซี่มี White Spot Lesion ให้ภาพรังสี panoramic พบฟันซี่ 43 form รากไปเกิน 2/3 แล้ว, ซี่ 83 ยังไม่หลุด รากไม่ค่อยละลาย, มี odontoma ขวางซี่ 43 อยู่",
            "proposition": "Diagnosis คืออะไร"
        },
        {
            "question_text": "รักษายังไง",
            "choices": [
                {"label": "A", "text": "Removal of 83 and calcified lesion"},
                {"label": "B", "text": "Removal of 83, 43, calcified lesion and consult ortho"},
                {"label": "C", "text": "Consult orthodontist for artificial eruption 43"},
                {"label": "D", "text": "Removal of 83 and 42"}
            ],
            "correct_answer": None,
            "category": "ศัลยศาสตร์ช่องปาก",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "เด็กอายุมาด้วยฟันหน้าล่างห่าง และฟันหน้าบน 4 ซี่มี White Spot Lesion ให้ภาพรังสี panoramic พบฟันซี่ 43 form รากไปเกิน 2/3 แล้ว, ซี่ 83 ยังไม่หลุด รากไม่ค่อยละลาย, มี odontoma ขวางซี่ 43 อยู่",
            "proposition": "รักษายังไง"
        },
        {
            "question_text": "ปัจจัยที่ทำให้เกิดภาวะเหงือกอักเสบในเคสนี้คือ",
            "choices": [
                {"label": "A", "text": "Malocclusion"},
                {"label": "B", "text": "Carbohydrate consumption"},
                {"label": "C", "text": "Mouth breathing"},
                {"label": "D", "text": "Drug"},
                {"label": "E", "text": "Hormonal change"}
            ],
            "correct_answer": None,
            "category": "ปริทันตวิทยา",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "เด็กอายุมาด้วยฟันหน้าล่างห่าง และฟันหน้าบน 4 ซี่มี White Spot Lesion ให้ภาพรังสี panoramic พบฟันซี่ 43 form รากไปเกิน 2/3 แล้ว, ซี่ 83 ยังไม่หลุด รากไม่ค่อยละลาย, มี odontoma ขวางซี่ 43 อยู่",
            "proposition": "ปัจจัยที่ทำให้เกิดภาวะเหงือกอักเสบในเคสนี้คือ"
        },
        {
            "question_text": "Differntial diagosis สิ่งที่ลูกศรชี้",
            "choices": [
                {"label": "A", "text": "Odontoma, supernumerary tooth"},
                {"label": "B", "text": "Odontoma, osteoma"},
                {"label": "C", "text": "Tooth 12, microdontia"},
                {"label": "D", "text": "Microdontia, supernumerary tooth"},
                {"label": "E", "text": "Microdontia, osteoma"}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "เด็กอายุ 8 ปี ไม่มีโรคประจำตัว มาตรวจสุขภาพช่องปากประจำปี จากการตรวจคลินิกพบ 21 ขึ้นในช่องปาก ⅔ ของ crown สบ crossbite กับซี่ 31 มี overjet -1, overbite 0.5 mm ให้ภาพรังสี periapical ฟันหน้าบนซี่ 11-21 พบ ฟันซี่ 21 partially erupted, ซี่ 11 อยู่ apically กว่า และ torsi, ระหว่างรากมี tooth- like structure mass with radiolucent rim ลักษณะคล้าย crown ขนาดเล็กกว่า crown ซี่ 21 เล็กน้อย, ในภาพเห็นซี่ 12, 22 ถูกตำแหน่ง",
            "proposition": "Differntial diagosis สิ่งที่ลูกศรชี้"
        },
        {
            "question_text": "Functional appliance ใดควรจะใช้กับผู้ป่วยรายนี้",
            "choices": [
                {"label": "A", "text": "Upper removable plate with paddle spring on tooth 21"},
                {"label": "B", "text": "Lower fixed inclined plane"},
                {"label": "C", "text": "Lower removable plate with posterior bite plane"},
                {"label": "D", "text": "Upper removable plate with double cantilever spring on tooth 21"},
                {"label": "E", "text": "Upper removable plate with sectional screw"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมจัดฟัน",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "เด็กอายุ 8 ปี ไม่มีโรคประจำตัว มาตรวจสุขภาพช่องปากประจำปี จากการตรวจคลินิกพบ 21 ขึ้นในช่องปาก ⅔ ของ crown สบ crossbite กับซี่ 31 มี overjet -1, overbite 0.5 mm ให้ภาพรังสี periapical ฟันหน้าบนซี่ 11-21 พบ ฟันซี่ 21 partially erupted, ซี่ 11 อยู่ apically กว่า และ torsi, ระหว่างรากมี tooth- like structure mass with radiolucent rim ลักษณะคล้าย crown ขนาดเล็กกว่า crown ซี่ 21 เล็กน้อย, ในภาพเห็นซี่ 12, 22 ถูกตำแหน่ง",
            "proposition": "Functional appliance ใดควรจะใช้กับผู้ป่วยรายนี้"
        },
        {
            "question_text": "การจัดการเหมาะสมที่สุดของเคสนี้",
            "choices": [
                {"label": "A", "text": "Consult orthodontist for artificial eruption"},
                {"label": "B", "text": "Surgical removal"},
                {"label": "C", "text": "Surgical exposure"},
                {"label": "D", "text": "Marsupilization"},
                {"label": "E", "text": "Observe"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมสำหรับเด็ก",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "เด็กอายุ 8 ปี ไม่มีโรคประจำตัว มาตรวจสุขภาพช่องปากประจำปี จากการตรวจคลินิกพบ 21 ขึ้นในช่องปาก ⅔ ของ crown สบ crossbite กับซี่ 31 มี overjet -1, overbite 0.5 mm ให้ภาพรังสี periapical ฟันหน้าบนซี่ 11-21 พบ ฟันซี่ 21 partially erupted, ซี่ 11 อยู่ apically กว่า และ torsi, ระหว่างรากมี tooth- like structure mass with radiolucent rim ลักษณะคล้าย crown ขนาดเล็กกว่า crown ซี่ 21 เล็กน้อย, ในภาพเห็นซี่ 12, 22 ถูกตำแหน่ง",
            "proposition": "การจัดการเหมาะสมที่สุดของเคสนี้"
        },
        {
            "question_text": "อะไรจะเป็นผลดีกับคนไข้ที่สุดในระยะยาว หลังถอนฟัน 46 และจัดการรอยโรคจน lesion หายแล้ว",
            "choices": [
                {"label": "A", "text": "ปลูกถ่ายฟันตัวเอง (tooth transplant: ATT-replant ซี่ 46 กลับเข้าไป)"},
                {"label": "B", "text": "ใส่ implant"},
                {"label": "C", "text": "ปลูกถ่ายกระดูกและทำรากเทียม"},
                {"label": "D", "text": "ทำสะพานฟัน 45-47"},
                {"label": "E", "text": "ทำฟันปลอมถอดได้ TP/RPD"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมประดิษฐ์",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "ผู้ป่วยชาย อายุ 15 ปี มาด้วยอาการบวมขากรรไกรล่างด้านขวามานาน 1 ปี คลำนิ่ม egg shell cracking palpation นิ่มตรงกลาง ไม่มีอาการปวด, ตรวจฟันซี่ 46 มีวัสดุอุดใหญ่ สีเปลี่ยน negative to EPT (ในภาพรังสียังมีซี่ 48) - ให้ภาพในช่องปาก มีบวมที่ buccal mucosa จนถึง vestibule ของ 45-47 - ให้ภาพรังสี pano เห็น well-defined unilocular radiolucency ที่ ปลายราก ตั้งแต่ 45-46 เห็นซี่ 48 ยัง สร้างปลายรากไม่เสร็จ และซี่ 8 บนยัง form root ไม่เสร็จ",
            "proposition": "อะไรจะเป็นผลดีกับคนไข้ที่สุดในระยะยาว หลังถอนฟัน 46 และจัดการรอยโรคจน lesion หายแล้ว"
        },
        {
            "question_text": "หลังจากฉีกยาชากำลังจะถอนฟัน ผู้ป่วยบอกว่าใจสั่น ปวดหัว ยังมีสติอยู่ ถามว่าต้อง monitor อะไร",
            "choices": [
                {"label": "A", "text": "PR, BP"},
                {"label": "B", "text": "BP, RR"},
                {"label": "C", "text": "RR, Oxygen saturation"},
                {"label": "D", "text": "BP, Oxygen saturation"},
                {"label": "E", "text": "PR, RR"}
            ],
            "correct_answer": None,
            "category": "ศัลยศาสตร์ช่องปาก",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "ผู้ป่วยชาย อายุ 15 ปี มาด้วยอาการบวมขากรรไกรล่างด้านขวามานาน 1 ปี คลำนิ่ม egg shell cracking palpation นิ่มตรงกลาง ไม่มีอาการปวด, ตรวจฟันซี่ 46 มีวัสดุอุดใหญ่ สีเปลี่ยน negative to EPT (ในภาพรังสียังมีซี่ 48) - ให้ภาพในช่องปาก มีบวมที่ buccal mucosa จนถึง vestibule ของ 45-47 - ให้ภาพรังสี pano เห็น well-defined unilocular radiolucency ที่ ปลายราก ตั้งแต่ 45-46 เห็นซี่ 48 ยัง สร้างปลายรากไม่เสร็จ และซี่ 8 บนยัง form root ไม่เสร็จ",
            "proposition": "หลังจากฉีกยาชากำลังจะถอนฟัน ผู้ป่วยบอกว่าใจสั่น ปวดหัว ยังมีสติอยู่ ถามว่าต้อง monitor อะไร"
        },
        {
            "question_text": "อะไรเป็นผลการตรวจที่สำคัญในการวินิจฉัยแยกโรคได้ดีที่สุด",
            "choices": [
                {"label": "A", "text": "Egg shell cracking sound"},
                {"label": "B", "text": "ฟันเปลี่ยนสี และ 46 Negative to EPT"},
                {"label": "C", "text": "คลำนิ่ม"},
                {"label": "D", "text": "ภาพรังสี Unilocular radiolucency"},
                {"label": "E", "text": "บวมมา 1 ปี ไม่มีอาการ"}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "ผู้ป่วยชาย อายุ 15 ปี มาด้วยอาการบวมขากรรไกรล่างด้านขวามานาน 1 ปี คลำนิ่ม egg shell cracking palpation นิ่มตรงกลาง ไม่มีอาการปวด, ตรวจฟันซี่ 46 มีวัสดุอุดใหญ่ สีเปลี่ยน negative to EPT (ในภาพรังสียังมีซี่ 48) - ให้ภาพในช่องปาก มีบวมที่ buccal mucosa จนถึง vestibule ของ 45-47 - ให้ภาพรังสี pano เห็น well-defined unilocular radiolucency ที่ ปลายราก ตั้งแต่ 45-46 เห็นซี่ 48 ยัง สร้างปลายรากไม่เสร็จ และซี่ 8 บนยัง form root ไม่เสร็จ",
            "proposition": "อะไรเป็นผลการตรวจที่สำคัญในการวินิจฉัยแยกโรคได้ดีที่สุด"
        },
        {
            "question_text": "อะไรใช้ในการวินิจฉัย",
            "choices": [
                {"label": "A", "text": "Shave biopsy"},
                {"label": "B", "text": "Excisional biopsy"},
                {"label": "C", "text": "Incisional biopsy"},
                {"label": "D", "text": "Fine needle aspiration"},
                {"label": "E", "text": "Punch biopsy / Sentinel node biopsy"}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "ชาย 20 ปี ใส่เครื่องมือจัดฟัน มีตุ่มที่ริมฝีปากล่าง เป็นๆหายๆ กัดแล้วยุบ มีภาพคลินิกกับ histo",
            "proposition": "อะไรใช้ในการวินิจฉัย"
        },
        {
            "question_text": "ข้อใดเป็นสาเหตุของรอยโรค",
            "choices": [
                {"label": "A", "text": "Chemical irritation"},
                {"label": "B", "text": "Allergy"},
                {"label": "C", "text": "Bacterial infection"},
                {"label": "D", "text": "Chronic irritation"},
                {"label": "E", "text": "Smoking"}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "ชาย 20 ปี ใส่เครื่องมือจัดฟัน มีตุ่มที่ริมฝีปากล่าง เป็นๆหายๆ กัดแล้วยุบ มีภาพคลินิกกับ histo",
            "proposition": "ข้อใดเป็นสาเหตุของรอยโรค"
        },
        {
            "question_text": "จงให้การวินิจฉัย",
            "choices": [
                {"label": "A", "text": "Lipoma"},
                {"label": "B", "text": "Irritation fibroma"},
                {"label": "C", "text": "Mucoclele"},
                {"label": "D", "text": "Hemangioma"},
                {"label": "E", "text": "Varices"}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "ชาย 20 ปี ใส่เครื่องมือจัดฟัน มีตุ่มที่ริมฝีปากล่าง เป็นๆหายๆ กัดแล้วยุบ มีภาพคลินิกกับ histo",
            "proposition": "จงให้การวินิจฉัย"
        },
        {
            "question_text": "การจัดการที่เหมาะสมสำหรับผู้ป่วยรายนี้",
            "choices": [
                {"label": "A", "text": "Observation"},
                {"label": "B", "text": "1% Dexamethasone mouthwash"},
                {"label": "C", "text": "5% Acyclovir cream"},
                {"label": "D", "text": "Acyclovir drug 200 mg"},
                {"label": "E", "text": "0.1% Triamcinolone acetonide orabase"}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "คนไข้เพศชาย อายุ 40 มีจุดแดงๆๆ บนเพดาน เป็นมา 2-3 วัน (ตุ่มแดงไม่ข้าม midline) และให้รูปฟัน 31M, 41M Root caries สีดำ cavity ใหญ่",
            "proposition": "การจัดการที่เหมาะสมสำหรับผู้ป่วยรายนี้"
        },
        {
            "question_text": "เชื้อที่พบในรอยผุซี่ 31, 41",
            "choices": [
                {"label": "A", "text": "Prevotella spp."},
                {"label": "B", "text": "Actinomyces spp."},
                {"label": "C", "text": "Candidas spp."},
                {"label": "D", "text": "Bifidobacterium spp."},
                {"label": "E", "text": "Vertotella spp."}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "คนไข้เพศชาย อายุ 40 มีจุดแดงๆๆ บนเพดาน เป็นมา 2-3 วัน (ตุ่มแดงไม่ข้าม midline) และให้รูปฟัน 31M, 41M Root caries สีดำ cavity ใหญ่",
            "proposition": "เชื้อที่พบในรอยผุซี่ 31, 41"
        },
        {
            "question_text": "ควรอุดรอยผุซี่ 31, 41 ด้วยวัสดุอะไร",
            "choices": [
                {"label": "A", "text": "Resin modified glass ionomer cement"},
                {"label": "B", "text": "Microfilled resin composite"},
                {"label": "C", "text": "Nanofilled resin composite"},
                {"label": "D", "text": "Compomer"},
                {"label": "E", "text": "Giomer"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมบูรณะ/หัตถการ",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "คนไข้เพศชาย อายุ 40 มีจุดแดงๆๆ บนเพดาน เป็นมา 2-3 วัน (ตุ่มแดงไม่ข้าม midline) และให้รูปฟัน 31M, 41M Root caries สีดำ cavity ใหญ่",
            "proposition": "ควรอุดรอยผุซี่ 31, 41 ด้วยวัสดุอะไร"
        },
        {
            "question_text": "ข้อใดเป็นปัจจัยเสี่ยงฟันผุระดับชุมชนและบุคคลของเด็กคนนี้ เรียงตามลำดับ",
            "choices": [
                {"label": "A", "text": "ร้านจัดฟัน การได้รับฟลูออไรด์"},
                {"label": "B", "text": "เครื่องมือจัดฟัน การได้รับฟลูออไรด์"},
                {"label": "C", "text": "กฎหมายเกี่ยวกับการจัดฟัน อนามัยช่องปาก"},
                {"label": "D", "text": "ระดับสังคมรายได้ผู้ปกครอง ความรู้ความเข้าใจ"},
                {"label": "E", "text": "การบริโภคอาหาร เครื่องมือจัดฟัน"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมชุมชน",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "เด็ก 10 ขวบ อยากจัดฟันแฟชั่นตามเพื่อน จึงเก็บเงินไปจัดฟันแฟชั่นที่ร้านในตลาดนัด",
            "proposition": "ข้อใดเป็นปัจจัยเสี่ยงฟันผุระดับชุมชนและบุคคลของเด็กคนนี้ เรียงตามลำดับ"
        },
        {
            "question_text": "ข้อใดจัดเป็นการ Strengthening community action ตามหลัก Ottawa charter",
            "choices": [
                {"label": "A", "text": "ให้ชุมชนเกิดการจัดระเบียบร้านค้าในตลาดนัด เพื่อขับไล่ร้านจัดฟันเถื่อน"},
                {"label": "B", "text": "กระตุ้นให้ชุมชนรู้ถึงอันตรายของการจัดฟันแฟชั่น และแจ้งตำรวจมากวาดล้าง"},
                {"label": "C", "text": "กระตุ้นให้ชุมชนตระหนักว่าการจัดฟันแฟชั่นเป็นปัญหาของชุมชนที่ทุกคนในชุมชนต้องช่วยกันหาทางแก้ไข"},
                {"label": "D", "text": "ให้ความรู้เด็กในชุมชนเกี่ยวกับอันตรายจากการจัดฟันแฟชั่น"},
                {"label": "E", "text": "ประสานให้ความช่วยเหลือด้านวิชาการ และไกล่เกลี่ยเรื่องผลประโยชน์ระหว่างคนในชุมชน ตลาดนัด และร้านจัดฟันแฟชั่น"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมชุมชน",
            "task": "การสร้างเสริมสุขภาพและการป้องกัน",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "เด็ก 10 ขวบ อยากจัดฟันแฟชั่นตามเพื่อน จึงเก็บเงินไปจัดฟันแฟชั่นที่ร้านในตลาดนัด",
            "proposition": "ข้อใดจัดเป็นการ Strengthening community action ตามหลัก Ottawa charter"
        },
        {
            "question_text": "ข้อใดเป็นการป้องกันไม่ให้เด็กคนนี้ไปจัดฟันแฟชั่นตามหลัก Ottawa charter",
            "choices": [
                {"label": "A", "text": "Create supportive environment โดยการแจ้งตำรวจจับร้านจัดฟันแฟชั่น"},
                {"label": "B", "text": "Create supportive environment โดยให้ชุมชนจัดระเบียบควบคุมร้านจัดฟันแฟชั่น ไม่ให้มีการเปิดร้านจัดฟันแฟชั่น"},
                {"label": "C", "text": "Develop personal skill การดูแลฟันตัวเองหลังจัดฟันจะได้ไม่ฟันผุ"},
                {"label": "D", "text": "Develop personal skill การเลือกตัดสินใจ โดยการให้ความรู้ข้อดีข้อเสียของการจัดฟันแฟชั่น"},
                {"label": "E", "text": "Build policy เพิ่มหลักสูตรการสอนเกี่ยวกับการจัดฟันแฟชั่นในโรงเรียน"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมชุมชน",
            "task": "การสร้างเสริมสุขภาพและการป้องกัน",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "เด็ก 10 ขวบ อยากจัดฟันแฟชั่นตามเพื่อน จึงเก็บเงินไปจัดฟันแฟชั่นที่ร้านในตลาดนัด",
            "proposition": "ข้อใดเป็นการป้องกันไม่ให้เด็กคนนี้ไปจัดฟันแฟชั่นตามหลัก Ottawa charter"
        },
        {
            "question_text": "ข้อใดเป็นวัสดุอุดที่เหมาะสม",
            "choices": [
                {"label": "A", "text": "Nanohybrid composite"},
                {"label": "B", "text": "Bulk-fill composite"},
                {"label": "C", "text": "Macrofilled composite"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมบูรณะ/หัตถการ",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "เป็นภาพ abfraction",
            "proposition": "ข้อใดเป็นวัสดุอุดที่เหมาะสม"
        },
        {
            "question_text": "คุณสมบัติใดที่ต้องคำนึงในการเลือกวัสดุสำหรับการอุดฟันซี่นี้",
            "choices": [
                {"label": "A", "text": "Wear resistance"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมบูรณะ/หัตถการ",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "เป็นภาพ abfraction",
            "proposition": "คุณสมบัติใดที่ต้องคำนึงในการเลือกวัสดุสำหรับการอุดฟันซี่นี้"
        },
        {
            "question_text": "(ไม่แน่ใจว่าใช้ข้อนี้มั้ย) ควรแนะนำอะไรผู้ป่วย",
            "choices": [
                {"label": "A", "text": "เปลี่ยนวิธีการแปรงฟัน"},
                {"label": "B", "text": "ลดการทานอาหารเปรี้ยว"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมบูรณะ/หัตถการ",
            "task": "การสร้างเสริมสุขภาพและการป้องกัน",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "เป็นภาพ abfraction",
            "proposition": "(ไม่แน่ใจว่าใช้ข้อนี้มั้ย) ควรแนะนำอะไรผู้ป่วย"
        },
        {
            "question_text": "จะจัดการยังไงกับคอฟันที่ดำ",
            "choices": [
                {"label": "A", "text": "รื้อครอบและเดือย ทำ internal bleaching แล้วทำ endo crown"},
                {"label": "B", "text": "รื้อครอบ, gingivectomy, ทำ ceramic crown"},
                {"label": "C", "text": "รื้อครอบ กรอให้ขอบให้ลึกขึ้นอยู่ subgingival แล้วทำ zirconia crown"},
                {"label": "D", "text": "กรอบริเวณนั้นเเล้วอุดวัสดุ opaque"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมประดิษฐ์",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "ผู้ป่วยไม่ชอบที่ฟันหน้าขอบเหงือกดำ ในรูปเป็นซี่ 11 PFM metal collar crown มีประวัติ endo และ post core ด้าน mesial เหงือกร่นเห็นรากฟัน (ในรูปคอฟัน 11 PFM พอๆกับ 13 canine, ปลาย PFM ยาว, เดา space รูปกัดสบดู deep bite) ซี่ 21 edentulous area ซี่ 26OM อุด Am เป็นvertical slot แตกตรงขอบด้าน palatal ที่ติดกับซี่ 25",
            "proposition": "จะจัดการยังไงกับคอฟันที่ดำ"
        },
        {
            "question_text": "ถ้าจะทำ implant บริเวณซี่ 11 แล้วทำ bone graft จะใส่ฟันเทียมแบบไหนไปก่อน",
            "choices": [
                {"label": "A", "text": "Temporary bridge 11-22"},
                {"label": "B", "text": "Etch bridge 11-21"},
                {"label": "C", "text": "Acrylic plate flange type"},
                {"label": "D", "text": "Acrylic plate socket type"},
                {"label": "E", "text": "ไม่ทำเพราะเดี๋ยวกดโดนแผล"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมประดิษฐ์",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "ผู้ป่วยไม่ชอบที่ฟันหน้าขอบเหงือกดำ ในรูปเป็นซี่ 11 PFM metal collar crown มีประวัติ endo และ post core ด้าน mesial เหงือกร่นเห็นรากฟัน (ในรูปคอฟัน 11 PFM พอๆกับ 13 canine, ปลาย PFM ยาว, เดา space รูปกัดสบดู deep bite) ซี่ 21 edentulous area ซี่ 26OM อุด Am เป็นvertical slot แตกตรงขอบด้าน palatal ที่ติดกับซี่ 25",
            "proposition": "ถ้าจะทำ implant บริเวณซี่ 11 แล้วทำ bone graft จะใส่ฟันเทียมแบบไหนไปก่อน"
        },
        {
            "question_text": "ต้องกรอ cavity ยังไงให้ไม่เกิดเกิด defective restoration แบบนี้อีกในซี่ 26",
            "choices": [
                {"label": "A", "text": "ทำให้ angle of departure 90 องศา"},
                {"label": "B", "text": "กรอขยายไปที่ central groove ให้เกิด dovetail"},
                {"label": "C", "text": "สร้าง retentive groove ที่ axiobuccal axiolingual"},
                {"label": "D", "text": "ทำ proximal cavity ให้มี convergence"},
                {"label": "E", "text": "bevel axiopulpal line angle"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมบูรณะ/หัตถการ",
            "task": "ขั้นตอนและวิธีการรักษา",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "ผู้ป่วยไม่ชอบที่ฟันหน้าขอบเหงือกดำ ในรูปเป็นซี่ 11 PFM metal collar crown มีประวัติ endo และ post core ด้าน mesial เหงือกร่นเห็นรากฟัน (ในรูปคอฟัน 11 PFM พอๆกับ 13 canine, ปลาย PFM ยาว, เดา space รูปกัดสบดู deep bite) ซี่ 21 edentulous area ซี่ 26OM อุด Am เป็นvertical slot แตกตรงขอบด้าน palatal ที่ติดกับซี่ 25",
            "proposition": "ต้องกรอ cavity ยังไงให้ไม่เกิดเกิด defective restoration แบบนี้อีกในซี่ 26"
        },
        {
            "question_text": "ก่อนเติมฟันเทียมที่ช่อง 11-12 ควรคำนึงถึงอะไร",
            "choices": [
                {"label": "A", "text": "Diagnostic wax up"},
                {"label": "B", "text": "Anterior guidance"},
                {"label": "C", "text": "Occlusal plane analysis"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมประดิษฐ์",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "ผู้ป่วยหญิง อายุ 30 มีคราบติดสีบนฟัน (dental staining) ให้รูปคลินิก front view มารูปเดียว พบฟันมี stain สีน้ำตาลทุกซี่ Generalized recession ฟันหลังร่นค่อนข้างเยอะน่าจะประมาณ 3-5 mm ฟันหน้าล่างน่าจะร่นประมาณ 2-3 mm ฟันหน้าล่างดูมี black triangle, 31-41 spacing ประมาณ 1.5 mm, 11-21 spacing ประมาณ 4-5mm moderate plaque deposits โดยเฉพาะฟันหน้าล่าง",
            "proposition": "ก่อนเติมฟันเทียมที่ช่อง 11-12 ควรคำนึงถึงอะไร"
        },
        {
            "question_text": "สอนการดูแลสุขภาพช่องปากอย่างไร",
            "choices": [
                {"label": "A", "text": "Modified roll technique + ไหมขัดฟัน"},
                {"label": "B", "text": "Modified Stillman technique + ไหมขัดฟัน"},
                {"label": "C", "text": "Modified Charter technique + ไหมขัดฟัน"},
                {"label": "D", "text": "Bass technique + แปรงซอกฟัน"},
                {"label": "E", "text": "แปรงสีฟันไฟฟ้า + แปรงซอกฟัน"}
            ],
            "correct_answer": None,
            "category": "ปริทันตวิทยา",
            "task": "การสร้างเสริมสุขภาพและการป้องกัน",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "ผู้ป่วยหญิง อายุ 30 มีคราบติดสีบนฟัน (dental staining) ให้รูปคลินิก front view มารูปเดียว พบฟันมี stain สีน้ำตาลทุกซี่ Generalized recession ฟันหลังร่นค่อนข้างเยอะน่าจะประมาณ 3-5 mm ฟันหน้าล่างน่าจะร่นประมาณ 2-3 mm ฟันหน้าล่างดูมี black triangle, 31-41 spacing ประมาณ 1.5 mm, 11-21 spacing ประมาณ 4-5mm moderate plaque deposits โดยเฉพาะฟันหน้าล่าง",
            "proposition": "สอนการดูแลสุขภาพช่องปากอย่างไร"
        },
        {
            "question_text": "การขูดหินปูนและเกลารากฟัน เป็นการหายแบบใด",
            "choices": [
                {"label": "A", "text": "Regeneration"},
                {"label": "B", "text": "Reattachment"},
                {"label": "C", "text": "New attachment"},
                {"label": "D", "text": "Long junctional epithelium"},
                {"label": "E", "text": "New junctional epithelium"}
            ],
            "correct_answer": None,
            "category": "ปริทันตวิทยา",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "ผู้ป่วยหญิง อายุ 30 มีคราบติดสีบนฟัน (dental staining) ให้รูปคลินิก front view มารูปเดียว พบฟันมี stain สีน้ำตาลทุกซี่ Generalized recession ฟันหลังร่นค่อนข้างเยอะน่าจะประมาณ 3-5 mm ฟันหน้าล่างน่าจะร่นประมาณ 2-3 mm ฟันหน้าล่างดูมี black triangle, 31-41 spacing ประมาณ 1.5 mm, 11-21 spacing ประมาณ 4-5mm moderate plaque deposits โดยเฉพาะฟันหน้าล่าง",
            "proposition": "การขูดหินปูนและเกลารากฟัน เป็นการหายแบบใด"
        },
        {
            "question_text": "จัดการอย่างไรกับฟัน",
            "choices": [
                {"label": "A", "text": "ไม่ให้การรักษาถ้าไม่ได้ขัดขวางการสบฟัน"},
                {"label": "B", "text": "ถอนทั้ง 2 ซี่"},
                {"label": "C", "text": "ซี่ 51 ไม่ทำอะไร , 61 จัดฟันให้เข้าที่ & splint"},
                {"label": "D", "text": "ซี่ 51 จัดฟันให้เข้าที่ & splint, 61 ถอน"},
                {"label": "E", "text": "Splint ฟัน 51 & 61"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมสำหรับเด็ก",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "ผู้ป่วยเด็ก 6 ปี ประสบอุบัติเหตุล้มฟันหน้ากระแทกมา 2 ชม. แล้วค่อยมาหาทันตแพทย์ ตรวจพบฟันซี่ 51 โยกระดับ 1 ไม่มีอาการ, ฟันซี่ 61 ล้มเอียงไปทางด้านเพดาน ให้ภาพรังสีฟันหน้าบน มุม occlusal topographic (คิดว่าไม่น่าจะ exposed pulp ทั้งคู่? ฟันซี่ 61 อยู่เหนือ bone ประมาณ 2-3 mm)",
            "proposition": "จัดการอย่างไรกับฟัน"
        },
        {
            "question_text": "ให้ทันตกรรมส่งเสริมป้องกันอย่างไร",
            "choices": [
                {"label": "A", "text": "จ่าย 0.2% NaF mouthwash ใช้ทุกวัน"},
                {"label": "B", "text": "จ่าย 0.5% NaF mouthwash ใช้สัปดาห์ละครั้ง"},
                {"label": "C", "text": "ให้ใช้ยาสีฟันผสมฟลูออไรด์ 1500 ppm"},
                {"label": "D", "text": "สอนการใช้ floss โดยผูก floss เป็นวงกลม"},
                {"label": "E", "text": "Apply 1.23% APF gel"},
                {"label": "F", "text": "ทา fluoride varnish"},
                {"label": "G", "text": "ทา SDF"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมสำหรับเด็ก",
            "task": "การสร้างเสริมสุขภาพและการป้องกัน",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "ผู้ป่วยเด็ก 6 ปี ประสบอุบัติเหตุล้มฟันหน้ากระแทกมา 2 ชม. แล้วค่อยมาหาทันตแพทย์ ตรวจพบฟันซี่ 51 โยกระดับ 1 ไม่มีอาการ, ฟันซี่ 61 ล้มเอียงไปทางด้านเพดาน ให้ภาพรังสีฟันหน้าบน มุม occlusal topographic (คิดว่าไม่น่าจะ exposed pulp ทั้งคู่? ฟันซี่ 61 อยู่เหนือ bone ประมาณ 2-3 mm)",
            "proposition": "ให้ทันตกรรมส่งเสริมป้องกันอย่างไร"
        },
        {
            "question_text": "ให้คำแนะนำภายหลังการรักษาอย่างไร",
            "choices": [
                {"label": "A", "text": "ควรกลับมาติดตามอาการอย่างต่อเนื่องจนกว่าฟันหน้าแท้จะขึ้น"},
                {"label": "B", "text": "อาจเกิด enamel hypoplasia ในฟันหน้าแท้ เนื่องจากได้รับภยันอันตรายอย่างรุนแรง"},
                {"label": "C", "text": "อาจเกิด crossbite ของฟันแท้ได้"},
                {"label": "D", "text": "ไม่น่ากระทบกับฟันแท้ เพราะรากของฟันน้ำนมเคลื่อนไปยังด้านริมฝีปาก"},
                {"label": "E", "text": "ไม่น่ากังวล เพราะตัวฟันสร้างเสร็จแล้ว"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมสำหรับเด็ก",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "ผู้ป่วยเด็ก 6 ปี ประสบอุบัติเหตุล้มฟันหน้ากระแทกมา 2 ชม. แล้วค่อยมาหาทันตแพทย์ ตรวจพบฟันซี่ 51 โยกระดับ 1 ไม่มีอาการ, ฟันซี่ 61 ล้มเอียงไปทางด้านเพดาน ให้ภาพรังสีฟันหน้าบน มุม occlusal topographic (คิดว่าไม่น่าจะ exposed pulp ทั้งคู่? ฟันซี่ 61 อยู่เหนือ bone ประมาณ 2-3 mm)",
            "proposition": "ให้คำแนะนำภายหลังการรักษาอย่างไร"
        },
        {
            "question_text": "ในการทำฟันเทียม ข้อมูลอะไรมีความสำคัญสุดก่อนทำ",
            "choices": [
                {"label": "A", "text": "Facebow transfer"},
                {"label": "B", "text": "ประเมิน VD"},
                {"label": "C", "text": "verify occlusal ฟันบน"},
                {"label": "D", "text": "กำหนดระดับปลายฟันหน้าล่าง"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมประดิษฐ์",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "รูป เหลือแต่ฟันหน้า บน- ล่าง แล้ว attrition enamel หายไปพอสมควร",
            "proposition": "ในการทำฟันเทียม ข้อมูลอะไรมีความสำคัญสุดก่อนทำ"
        },
        {
            "question_text": "ลักษณะทางรังสีที่ปรากฏสามารถแปลผลได้ว่าอย่างไร",
            "choices": [
                {"label": "A", "text": "Stepladder of trabecular bone"},
                {"label": "B", "text": "Ground glass appearance"},
                {"label": "C", "text": "Irregular trabecular bone"},
                {"label": "D", "text": "Punched out of trabecular bone"},
                {"label": "E", "text": "Periosteal reaction at inferior border of mandible"}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "คนไข้มีประวัติเคยฉายรังสีที่ H&N เมื่อ 5 ปีก่อน เเละถอนฟันล่างขวาไปเมื่อ 3 เดือนก่อน มีภาพ OPG และรูปถ่ายในช่องปากพบฟันผุทั่วทั้งปาก",
            "proposition": "ลักษณะทางรังสีที่ปรากฏสามารถแปลผลได้ว่าอย่างไร"
        },
        {
            "question_text": "ถาม differential diagnosis",
            "choices": [
                {"label": "A", "text": "Osteosarcoma, Ossifying fibroma"},
                {"label": "B", "text": "Ossifying fibroma, Fibrous dysplasia"},
                {"label": "C", "text": "Chondrosarcoma, Fibrous dysplasia"},
                {"label": "D", "text": "Osteoradionecrosis, Osteomyelitis"},
                {"label": "E", "text": "Fibrous dysplasia, Ossifying fibroma"}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "คนไข้มีประวัติเคยฉายรังสีที่ H&N เมื่อ 5 ปีก่อน เเละถอนฟันล่างขวาไปเมื่อ 3 เดือนก่อน มีภาพ OPG และรูปถ่ายในช่องปากพบฟันผุทั่วทั้งปาก",
            "proposition": "ถาม differential diagnosis"
        },
        {
            "question_text": "กระบวนการการเกิดของรอยโรค",
            "choices": [
                {"label": "A", "text": "Bone replaced by connective tissue"},
                {"label": "B", "text": "Bone cell necrosis and death"},
                {"label": "C", "text": "Hypercellular of bone"},
                {"label": "D", "text": "Hypervascularization of bone"},
                {"label": "E", "text": "Hyperactive bone response"}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "คนไข้มีประวัติเคยฉายรังสีที่ H&N เมื่อ 5 ปีก่อน เเละถอนฟันล่างขวาไปเมื่อ 3 เดือนก่อน มีภาพ OPG และรูปถ่ายในช่องปากพบฟันผุทั่วทั้งปาก",
            "proposition": "กระบวนการการเกิดของรอยโรค"
        },
        {
            "question_text": "รอยโรคบริเวณล่างขวา",
            "choices": [
                {"label": "A", "text": "Macule"},
                {"label": "B", "text": "Palpule"},
                {"label": "C", "text": "Nodule"},
                {"label": "D", "text": "Patch"},
                {"label": "E", "text": "Plaque"}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "ผู้ป่วย อายุ 50 ปี อยากทำฟันปลอมบนและล่าง Kennedy Class I U/L เคี้ยวอาหารไม่สะดวก ไม่เคยใส่ฟันปลอม บน เหลือ 15-24 ล่าง 33-43 และ 35 มีรอยสีดำบริเวณสันเหงือกด้านล่างขวา ลักษณะผิวเรียบแบน ไม่ยกนูน ขนาด ประมาณ 0.5x0.5 mm\nภาพเอกซเรย์ PA พบฟัน 41 31 มีรอยโรคปลายราก ซี่อื่น widening PDL space ซี่ 35 ปลายรากอ้วน",
            "proposition": "รอยโรคบริเวณล่างขวา"
        },
        {
            "question_text": "ถ้าจะใส่ฟันปลอมล่าง ต้องประเมินอะไร",
            "choices": [
                {"label": "A", "text": "Vitality ฟันหน้าล่าง & bone support"},
                {"label": "B", "text": "สบฟันที่ CR"},
                {"label": "C", "text": "ปลายฟันล่าง"},
                {"label": "D", "text": "Mobility ซี่ 35"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมประดิษฐ์",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "ผู้ป่วย อายุ 50 ปี อยากทำฟันปลอมบนและล่าง Kennedy Class I U/L เคี้ยวอาหารไม่สะดวก ไม่เคยใส่ฟันปลอม บน เหลือ 15-24 ล่าง 33-43 และ 35 มีรอยสีดำบริเวณสันเหงือกด้านล่างขวา ลักษณะผิวเรียบแบน ไม่ยกนูน ขนาด ประมาณ 0.5x0.5 mm\nภาพเอกซเรย์ PA พบฟัน 41 31 มีรอยโรคปลายราก ซี่อื่น widening PDL space ซี่ 35 ปลายรากอ้วน",
            "proposition": "ถ้าจะใส่ฟันปลอมล่าง ต้องประเมินอะไร"
        },
        {
            "question_text": "การตรวจเบื้องต้นเพื่อพิมพ์ final impression ข้อใดเหมาะสมสุด",
            "choices": [
                {"label": "A", "text": "ขอบเขตด้านท้ายครอบคลุมขอบเขตทั้งหมดของ retromolar pad"},
                {"label": "B", "text": "ตรวจขณะผู้ป่วยไม่กระดกลิ้น ให้ลิ้นอยู่นิ่งๆ"},
                {"label": "C", "text": "ขอบเขตด้านแก้ม จุดลึกสุด"},
                {"label": "D", "text": "กดบริเวณสันเหงือกเพื่อดูความลึกที่กดได้"},
                {"label": "E", "text": "ขอบเขตด้านหน้าขยายถึงด้านท้ายของซี่ 33"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมประดิษฐ์",
            "task": "ขั้นตอนและวิธีการรักษา",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "ผู้ป่วย อายุ 50 ปี อยากทำฟันปลอมบนและล่าง Kennedy Class I U/L เคี้ยวอาหารไม่สะดวก ไม่เคยใส่ฟันปลอม บน เหลือ 15-24 ล่าง 33-43 และ 35 มีรอยสีดำบริเวณสันเหงือกด้านล่างขวา ลักษณะผิวเรียบแบน ไม่ยกนูน ขนาด ประมาณ 0.5x0.5 mm\nภาพเอกซเรย์ PA พบฟัน 41 31 มีรอยโรคปลายราก ซี่อื่น widening PDL space ซี่ 35 ปลายรากอ้วน",
            "proposition": "การตรวจเบื้องต้นเพื่อพิมพ์ final impression ข้อใดเหมาะสมสุด"
        },
        {
            "question_text": "สิทธิประกันสุขภาพถ้วนหน้าครอบคลุมการรักษาใดบ้าง",
            "choices": [
                {"label": "A", "text": "ขัดเคลือบฟลูออไรด์ อุดฟัน"},
                {"label": "B", "text": "อุดฟัน รักษารากฟัน ถอนฟัน"},
                {"label": "C", "text": "ขัดเคลือบฟลูออไรด์ ถอนฟัน ใส่เครื่องมือกันช่องว่าง"},
                {"label": "D", "text": "ขัดเคลือบฟลูออไรด์ ครอบฟันเหล็กไร้สนิม"},
                {"label": "E", "text": "ครอบฟันเหล็กไร้สนิม"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมชุมชน",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "ทันตแพทย์ลงชุมชน ศพด. ชุมชน 67,000 คน ศูนย์พัฒนาเด็กเล็ก 5 ที่ โรงเรียนประถม 6 ที่ โรงเรียนมัธยม 1 ที่ เด็กเล็กมีพฤติกรรมติดขวดนม เด็กติดขนมน้ำอัดลม มัธยมใช้บุหรี่ไฟฟ้าและจัดฟันแฟชั่น น้ำประปาวัดค่าฟลูออไรด์ได้ 0.1 ppm",
            "proposition": "สิทธิประกันสุขภาพถ้วนหน้าครอบคลุมการรักษาใดบ้าง"
        },
        {
            "question_text": "ทันตกรรมป้องกันเพื่อตอบโจทย์ Common risk factor ในวัยมัธยม",
            "choices": [
                {"label": "A", "text": "ผลกระทบของสูบบุหรี่ไฟฟ้า"},
                {"label": "B", "text": "เคลือบฟลูออไรด์ทุก 6 เดือน"},
                {"label": "C", "text": "บ้วนปากด้วยน้ำยาบ้วนปากผสมฟลูออไรด์"},
                {"label": "D", "text": "การแปรงฟัน"},
                {"label": "E", "text": "เคลือบหลุมร่องฟัน"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมชุมชน",
            "task": "การสร้างเสริมสุขภาพและการป้องกัน",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "ทันตแพทย์ลงชุมชน ศพด. ชุมชน 67,000 คน ศูนย์พัฒนาเด็กเล็ก 5 ที่ โรงเรียนประถม 6 ที่ โรงเรียนมัธยม 1 ที่ เด็กเล็กมีพฤติกรรมติดขวดนม เด็กติดขนมน้ำอัดลม มัธยมใช้บุหรี่ไฟฟ้าและจัดฟันแฟชั่น น้ำประปาวัดค่าฟลูออไรด์ได้ 0.1 ppm",
            "proposition": "ทันตกรรมป้องกันเพื่อตอบโจทย์ Common risk factor ในวัยมัธยม"
        },
        {
            "question_text": "ศึกษาความสัมพันธ์การกระจายตัวฟันผุกับพฤติกรรม",
            "choices": [
                {"label": "A", "text": "Cross sectional study"},
                {"label": "B", "text": "Case control study"},
                {"label": "C", "text": "Ecological study"},
                {"label": "D", "text": "Descriptive study"},
                {"label": "E", "text": "Cohort study"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมชุมชน",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "ทันตแพทย์ลงชุมชน ศพด. ชุมชน 67,000 คน ศูนย์พัฒนาเด็กเล็ก 5 ที่ โรงเรียนประถม 6 ที่ โรงเรียนมัธยม 1 ที่ เด็กเล็กมีพฤติกรรมติดขวดนม เด็กติดขนมน้ำอัดลม มัธยมใช้บุหรี่ไฟฟ้าและจัดฟันแฟชั่น น้ำประปาวัดค่าฟลูออไรด์ได้ 0.1 ppm",
            "proposition": "ศึกษาความสัมพันธ์การกระจายตัวฟันผุกับพฤติกรรม"
        },
        {
            "question_text": "Lesion ที่คอฟันซี่ 34 คือ",
            "choices": [
                {"label": "A", "text": "Erosion"},
                {"label": "B", "text": "Abrasion"},
                {"label": "C", "text": "Abfraction"},
                {"label": "D", "text": "Rampant caries"},
                {"label": "E", "text": "Meth mouth caries"}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "ผู้ป่วยหญิง 40 ปี ปวดฟันกรามน้อยซ้ายล่าง\n- ให้รูปสบฟันหน้าตรง-ซ้าย-ขวา มีฟันครบ อุดคอฟันหลังหลายซี่มาก ๆ ส่วนซี่ 34 พบคอฟันสึกไปทางรากฟัน ร่วมกับเหงือกร่น\n- มีเหงือกบวมตรงบริเวณฟันกรามน้อยล่างด้านซ้าย ไม่มีอาการผิดปกติใดๆ\n- X-ray Pa: ซี่ 34 มี gutta percha tracing ไปหยุดใกล้ ๆ ปลายราก เห็น radiolucent at periapical area มี bone level ต่ำกว่าซี่ข้างเคียงนิดหน่อย , ซี่ 35OM amalgam วัสดุอุดขนาดใหญ่ ปลายรากโค้งงอ เบา ๆ มี round radiolucent superimposed กับปลายราก (คนละวงดำกับ 34) แต่เห็น lamina dura ชัดรอบปลายราก no widening PDL space",
            "proposition": "Lesion ที่คอฟันซี่ 34 คือ"
        },
        {
            "question_text": "อ่านฟิล์มซี่ 34",
            "choices": [
                {"label": "A", "text": "20% Vertical bone loss with widening PDL space/ periapical lesion"},
                {"label": "B", "text": "50% Vertical bone loss with periapical lesion"},
                {"label": "C", "text": "30% Horizontal bone loss with discontinued lamina dura"},
                {"label": "D", "text": "60% Horizontal bone loss with …"},
                {"label": "E", "text": "Total bone loss with periapical lesion/abnormal trabecular bone"}
            ],
            "correct_answer": None,
            "category": "ปริทันตวิทยา",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "ผู้ป่วยหญิง 40 ปี ปวดฟันกรามน้อยซ้ายล่าง\n- ให้รูปสบฟันหน้าตรง-ซ้าย-ขวา มีฟันครบ อุดคอฟันหลังหลายซี่มาก ๆ ส่วนซี่ 34 พบคอฟันสึกไปทางรากฟัน ร่วมกับเหงือกร่น\n- มีเหงือกบวมตรงบริเวณฟันกรามน้อยล่างด้านซ้าย ไม่มีอาการผิดปกติใดๆ\n- X-ray Pa: ซี่ 34 มี gutta percha tracing ไปหยุดใกล้ ๆ ปลายราก เห็น radiolucent at periapical area มี bone level ต่ำกว่าซี่ข้างเคียงนิดหน่อย , ซี่ 35OM amalgam วัสดุอุดขนาดใหญ่ ปลายรากโค้งงอ เบา ๆ มี round radiolucent superimposed กับปลายราก (คนละวงดำกับ 34) แต่เห็น lamina dura ชัดรอบปลายราก no widening PDL space",
            "proposition": "อ่านฟิล์มซี่ 34"
        },
        {
            "question_text": "ปัจจัยที่กำหนดขนาด MAF ของซี่ 35 (โจทย์ถามที่ซี่ 35 จริง ๆ)",
            "choices": [
                {"label": "A", "text": "Working length"},
                {"label": "B", "text": "Thickness & curve ของปลายราก"},
                {"label": "C", "text": "ขนาด apical lesion"},
                {"label": "D", "text": "พยากรณ์ผลการรักษา"},
                {"label": "E", "text": "Pre-operative diagnosis"}
            ],
            "correct_answer": None,
            "category": "วิทยาเอ็นโดดอนต์",
            "task": "ขั้นตอนและวิธีการรักษา",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "ผู้ป่วยหญิง 40 ปี ปวดฟันกรามน้อยซ้ายล่าง\n- ให้รูปสบฟันหน้าตรง-ซ้าย-ขวา มีฟันครบ อุดคอฟันหลังหลายซี่มาก ๆ ส่วนซี่ 34 พบคอฟันสึกไปทางรากฟัน ร่วมกับเหงือกร่น\n- มีเหงือกบวมตรงบริเวณฟันกรามน้อยล่างด้านซ้าย ไม่มีอาการผิดปกติใดๆ\n- X-ray Pa: ซี่ 34 มี gutta percha tracing ไปหยุดใกล้ ๆ ปลายราก เห็น radiolucent at periapical area มี bone level ต่ำกว่าซี่ข้างเคียงนิดหน่อย , ซี่ 35OM amalgam วัสดุอุดขนาดใหญ่ ปลายรากโค้งงอ เบา ๆ มี round radiolucent superimposed กับปลายราก (คนละวงดำกับ 34) แต่เห็น lamina dura ชัดรอบปลายราก no widening PDL space",
            "proposition": "ปัจจัยที่กำหนดขนาด MAF ของซี่ 35 (โจทย์ถามที่ซี่ 35 จริง ๆ)"
        },
        {
            "question_text": "รอยโรคทางชีวภาพที่สัมพันธ์กับรอยโรคทางคลินิกซี่ 12/ บริเวณคอฟันซี่ 12 พบว่าโรคปริทันต์อักเสบขั้นใด",
            "choices": [
                {"label": "A", "text": "Initial lesion"},
                {"label": "B", "text": "Early lesion"},
                {"label": "C", "text": "Establish lesion"},
                {"label": "D", "text": "Advanced lesion"},
                {"label": "E", "text": "Primary lesion"}
            ],
            "correct_answer": None,
            "category": "ปริทันตวิทยา",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "ผู้ป่วยชายอายุ 55 ปี มีฟันสึกซี่ 14 ตามรูป ให้ภาพฟันหน้าบน 15-25 มีคอฟันสึกซี่ 14 แล้วเห็นเหงือกตรง 12 บวมแดงแบบ round margin (รูปฟันสึกเฉพาะ 14 และ 11 มีฟันหัก และ 12 ฟันดูปกติ เหงือกดู firm)",
            "proposition": "รอยโรคทางชีวภาพที่สัมพันธ์กับรอยโรคทางคลินิกซี่ 12/ บริเวณคอฟันซี่ 12 พบว่าโรคปริทันต์อักเสบขั้นใด"
        },
        {
            "question_text": "หากบูรณะคอฟันซี่ 14 จะใช้วัสดุอะไร",
            "choices": [
                {"label": "A", "text": "Conventional GIC"},
                {"label": "B", "text": "RMGIC"},
                {"label": "C", "text": "Nanohybrid Resin composite"},
                {"label": "D", "text": "Bulk fill Resin composite"},
                {"label": "E", "text": "Macrofilled Resin composite"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมบูรณะ/หัตถการ",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "ผู้ป่วยชายอายุ 55 ปี มีฟันสึกซี่ 14 ตามรูป ให้ภาพฟันหน้าบน 15-25 มีคอฟันสึกซี่ 14 แล้วเห็นเหงือกตรง 12 บวมแดงแบบ round margin (รูปฟันสึกเฉพาะ 14 และ 11 มีฟันหัก และ 12 ฟันดูปกติ เหงือกดู firm)",
            "proposition": "หากบูรณะคอฟันซี่ 14 จะใช้วัสดุอะไร"
        },
        {
            "question_text": "ทันตแพทย์ใช้หัวกรอปลายแหลมทำที่วัสดุอุดคอฟัน 14 ให้เป็นร่องตื้นๆในแนว mesio-distal เป็นการจำลอง ลักษณะใดของผิวฟัน",
            "choices": [
                {"label": "A", "text": "Perikymata"},
                {"label": "B", "text": "Striae of Retzius"},
                {"label": "C", "text": "Neonatal line"},
                {"label": "D", "text": "Hunter-Schreger bands"},
                {"label": "E", "text": "Enamel lamella"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมบูรณะ/หัตถการ",
            "task": "ขั้นตอนและวิธีการรักษา",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "ผู้ป่วยชายอายุ 55 ปี มีฟันสึกซี่ 14 ตามรูป ให้ภาพฟันหน้าบน 15-25 มีคอฟันสึกซี่ 14 แล้วเห็นเหงือกตรง 12 บวมแดงแบบ round margin (รูปฟันสึกเฉพาะ 14 และ 11 มีฟันหัก และ 12 ฟันดูปกติ เหงือกดู firm)",
            "proposition": "ทันตแพทย์ใช้หัวกรอปลายแหลมทำที่วัสดุอุดคอฟัน 14 ให้เป็นร่องตื้นๆในแนว mesio-distal เป็นการจำลอง ลักษณะใดของผิวฟัน"
        },
        {
            "question_text": "ข้อมูลใดสำคัญน้อยที่สุดในการประเมินความเสี่ยงการเป็นโรคปริทันต์",
            "choices": [
                {"label": "A", "text": "โรคเบาหวานที่ควบคุมไม่ได้"},
                {"label": "B", "text": "ความลึกร่องเหงือก"},
                {"label": "C", "text": "สูบบุหรี่"},
                {"label": "D", "text": "อายุ"}
            ],
            "correct_answer": None,
            "category": "ปริทันตวิทยา",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "ผู้ป่วยเพศหญิง 15 ปี ไม่กินอาหารจุบจิบ ไม่กินของหวาน ไม่กินระหว่างมื้อ ปฏิเสธโรคประจำตัวและการแพ้ยา มาตรวจสุขภาพช่องปาก ไม่มีฟันผุ แต่มีคราบจุลินทรีย์ที่ชัดเจน ปัจจุบันใส่ retainer",
            "proposition": "ข้อมูลใดสำคัญน้อยที่สุดในการประเมินความเสี่ยงการเป็นโรคปริทันต์"
        },
        {
            "question_text": "ประเมินความเสี่ยงของการเกิดฟันผุในผู้ป่วยรายนี้เป็นอย่างไร เพราะเหตุใด",
            "choices": [
                {"label": "A", "text": "เสี่ยงสูง เพราะมีคราบจุลินทรีย์ชัดเจนรวมถึงใส่เครื่องมือในช่องปาก"},
                {"label": "B", "text": "เสี่ยงปานกลางเพราะยังไม่มีรูป x-ray ดูว่ามีฟันผุด้านประชิดหรือไม่"},
                {"label": "C", "text": "ไม่สามารถประเมินได้"},
                {"label": "D", "text": "เสี่ยงต่ำ เพราะไม่รับประทานอาหารจุบจิบ"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมบูรณะ/หัตถการ",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "ผู้ป่วยเพศหญิง 15 ปี ไม่กินอาหารจุบจิบ ไม่กินของหวาน ไม่กินระหว่างมื้อ ปฏิเสธโรคประจำตัวและการแพ้ยา มาตรวจสุขภาพช่องปาก ไม่มีฟันผุ แต่มีคราบจุลินทรีย์ที่ชัดเจน ปัจจุบันใส่ retainer",
            "proposition": "ประเมินความเสี่ยงของการเกิดฟันผุในผู้ป่วยรายนี้เป็นอย่างไร เพราะเหตุใด"
        },
        {
            "question_text": "ควรจัดการยังไงกับรอยผุที่ distal pit ของ 46",
            "choices": [
                {"label": "A", "text": "Flowable composite + etch and rinse"},
                {"label": "B", "text": "Conventional composite + self etch"},
                {"label": "C", "text": "Resin sealant"},
                {"label": "D", "text": "GI sealant"},
                {"label": "E", "text": "GI"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมสำหรับเด็ก",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "เด็กอายุ 14 มาตรวจฟัน (ให้ภาพocclusal view ฟันล่าง เห็น 46 ดำ ๆ ตรง distal pit, 44,45,34,35 เหมือนเห็น dens evaginatus, film PA เห็น 46 ไม่เห็น radiolucent)",
            "proposition": "ควรจัดการยังไงกับรอยผุที่ distal pit ของ 46"
        },
        {
            "question_text": "ควรจัดการยังไงกับซี่ 45 (ที่เห็นเป็น dens evaginatus)",
            "choices": [
                {"label": "A", "text": "PRR"},
                {"label": "B", "text": "Apexification"},
                {"label": "C", "text": "Pulpotomy"},
                {"label": "D", "text": "Resin sealant"},
                {"label": "E", "text": "RCT"}
            ],
            "correct_answer": None,
            "category": "วิทยาเอ็นโดดอนต์",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "เด็กอายุ 14 มาตรวจฟัน (ให้ภาพocclusal view ฟันล่าง เห็น 46 ดำ ๆ ตรง distal pit, 44,45,34,35 เหมือนเห็น dens evaginatus, film PA เห็น 46 ไม่เห็น radiolucent)",
            "proposition": "ควรจัดการยังไงกับซี่ 45 (ที่เห็นเป็น dens evaginatus)"
        },
        {
            "question_text": "ควรปรับปรุงคุณภาพฟิล์มยังไง (film PA cone-cut)",
            "choices": [
                {"label": "A", "text": "ให้เด็กนั่งนิ่ง ๆ"},
                {"label": "B", "text": "วางฟิล์มให้ครอบคลุม cone"},
                {"label": "C", "text": "ใช้ฟิล์มเล็กลง"},
                {"label": "D", "text": "วางฟิล์มแนวตั้ง"},
                {"label": "E", "text": "เปลี่ยนค่า exposure time"}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "ขั้นตอนและวิธีการรักษา",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2-2567 Part 3",
            "stem": "เด็กอายุ 14 มาตรวจฟัน (ให้ภาพocclusal view ฟันล่าง เห็น 46 ดำ ๆ ตรง distal pit, 44,45,34,35 เหมือนเห็น dens evaginatus, film PA เห็น 46 ไม่เห็น radiolucent)",
            "proposition": "ควรปรับปรุงคุณภาพฟิล์มยังไง (film PA cone-cut)"
        }
    ]
}

with open('/Users/admin/Downloads/NL Test/parsed_exams/NL2_2567_Part_3.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

