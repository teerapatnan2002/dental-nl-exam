import json

questions = [
    {
        "question_text": "Stem 1\nทพ.รพ.ชุมชนดูแลเด็ก 10,000 คน ข้อมูลจากโรงเรียนบอกว่าฟันผุมากกว่าค่าเฉลี่ยประเทศ 2 เท่า\nวางแผนจะทำโครงการตาม precede proceed\n\n1. ปัจจัยที่ส่งผลโดยตรงต่อความชุกฟันผุ",
        "choices": [
            {"label": "ก", "text": "ความรู้ ทัศนคติ"},
            {"label": "ข", "text": "คุณภาพชีวิต การศึกษา"},
            {"label": "ค", "text": "นโยบาย ความเข้มแข็งของชุมชน"},
            {"label": "ง", "text": "พฤติกรรม สิ่งแวดล้อม"},
            {"label": "จ", "text": "ความตระหนัก ค่านิยม"}
        ],
        "correct_answer": None,
        "category": "ทันตกรรมชุมชน",
        "task": "การเกิดและการดำเนินโรค",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 1\nทพ.รพ.ชุมชนดูแลเด็ก 10,000 คน ข้อมูลจากโรงเรียนบอกว่าฟันผุมากกว่าค่าเฉลี่ยประเทศ 2 เท่า\nวางแผนจะทำโครงการตาม precede proceed\n\n2. อะไรบอกว่าชุมชนมีส่วนร่วมระดับสูงสุด",
        "choices": [
            {"label": "ก", "text": "ผอ.ครูประชุมนโยบายลดอาหารหวาน"},
            {"label": "ข", "text": "เทศบาลสร้างสถานที่แปรงฟัน"},
            {"label": "ค", "text": "ผู้ปกครองเข้าประชุมตามที่ทันตแพทย์นัด"},
            {"label": "ง", "text": "มี LINE ระหว่างครูผู้ปกครองและทันตแพทย์"},
            {"label": "จ", "text": "มีคนบริจาคเงินซื้อแปรงสีฟันให้เด็ก"}
        ],
        "correct_answer": None,
        "category": "ทันตกรรมชุมชน",
        "task": "การสร้างเสริมสุขภาพและการป้องกัน",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 1\nทพ.รพ.ชุมชนดูแลเด็ก 10,000 คน ข้อมูลจากโรงเรียนบอกว่าฟันผุมากกว่าค่าเฉลี่ยประเทศ 2 เท่า\nวางแผนจะทำโครงการตาม precede proceed\n\n3. กิจกรรมใดที่บ่งบอกการส่งเสริม Reinforce fac.",
        "choices": [
            {"label": "ก", "text": "ประกวดแปลงฟันดีและให้รางวัลเป็นระยะ"},
            {"label": "ข", "text": "สร้างความตระหนักเกี่ยวกับการบริโภคน้ำตาล"},
            {"label": "ค", "text": "ซื้อแปรงสีฟันยาสีฟันที่มีสฟลูออไรด์ราคาถูกมาให้"},
            {"label": "ง", "text": "มีผู้บริจาคเงินซื้อแปรงสีฟันให้เด็ก"},
            {"label": "จ", "text": "ออกตรวจรักษาตามเทศกาลวันสำคัญ"}
        ],
        "correct_answer": None,
        "category": "ทันตกรรมชุมชน",
        "task": "การสร้างเสริมสุขภาพและการป้องกัน",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 2\n22 Palatogingival groove ที่ DPa pocket depth 9 mm ด้าน palatal อุด temp ไว้ โจทย์บอก\nOC ไปได้หนึ่งสัปดาห์มีอาการปวด ตื้อๆ ที่ฟัน แนวการสบกับเรียงตัวดูปกติดี เหงือก slightly red\nrecession ประมาณ 1-2 mm Xray Pa 22 เห็นแนวดำกึ่งกลางฟันลากจากคอฟันไปโผล่ที่ปลายรากฟัน\nขนาดกับ canal มี widening PDL ที่ปลายราก mild to moderate horizontal bone loss\n\n1. ปัจจัยใดเป็นปัจจัยส่งเสริม",
        "choices": [
            {"label": "ก", "text": "Palatogingival groove"},
            {"label": "ข", "text": "Dens evaginatus"},
            {"label": "ค", "text": "Traumatic occlusion"},
            {"label": "ง", "text": "Malposed tooth"},
            {"label": "จ", "text": "lingual pit caries"}
        ],
        "correct_answer": None,
        "category": "ปริทันตวิทยา",
        "task": "การเกิดและการดำเนินโรค",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 2\n22 Palatogingival groove ที่ DPa pocket depth 9 mm ด้าน palatal อุด temp ไว้ โจทย์บอก\nOC ไปได้หนึ่งสัปดาห์มีอาการปวด ตื้อๆ ที่ฟัน แนวการสบกับเรียงตัวดูปกติดี เหงือก slightly red\nrecession ประมาณ 1-2 mm Xray Pa 22 เห็นแนวดำกึ่งกลางฟันลากจากคอฟันไปโผล่ที่ปลายรากฟัน\nขนาดกับ canal มี widening PDL ที่ปลายราก mild to moderate horizontal bone loss\n\n2. Management",
        "choices": [
            {"label": "ก", "text": "RCT+ScRP"},
            {"label": "ข", "text": "RCT+Endosurg"},
            {"label": "ค", "text": "Extraction แล้วใส่ฟันปลอม"},
            {"label": "ง", "text": "RCT"},
            {"label": "จ", "text": "อุด composite ปิด groove+ปรับ occlusion"}
        ],
        "correct_answer": None,
        "category": "ปริทันตวิทยา",
        "task": "การจัดการและการรักษาผู้ป่วย",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 2\n22 Palatogingival groove ที่ DPa pocket depth 9 mm ด้าน palatal อุด temp ไว้ โจทย์บอก\nOC ไปได้หนึ่งสัปดาห์มีอาการปวด ตื้อๆ ที่ฟัน แนวการสบกับเรียงตัวดูปกติดี เหงือก slightly red\nrecession ประมาณ 1-2 mm Xray Pa 22 เห็นแนวดำกึ่งกลางฟันลากจากคอฟันไปโผล่ที่ปลายรากฟัน\nขนาดกับ canal มี widening PDL ที่ปลายราก mild to moderate horizontal bone loss\n\n3. ดู prognosis ของ 22 จากอะไร",
        "choices": [
            {"label": "ก", "text": "การบูรณะฟัน"},
            {"label": "ข", "text": "การรักษา perio"},
            {"label": "ค", "text": "การขยายคลองรากฟันและวิธี med"},
            {"label": "ง", "text": "ระยะเวลาที่เริ่มรักษา"},
            {"label": "จ", "text": "ลำดับขั้นตอนการรักษา"}
        ],
        "correct_answer": None,
        "category": "ปริทันตวิทยา",
        "task": "การวินิจฉัยโรค",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 3\nคนไข้อ้าปากได้จำกัด หลังผ่าฟันคุดมา มีปวดเวลาตื่นนอน ชอบเคี้ยวของแข็ง ของเหนียว เคี้ยวข้าง\nขวาข้างเดียว ช่วงหลัง ๆ เป็นหนักขึ้นเพราะภาวะโควิด อ้าปากได้ประมาณ 25-30 mm. คลำเจ็บที่ right\nmasseter temporalis และหน้าหู ให้ภาพฟัน attrition มาทั้งปาก\n\n1. Aggrivative factor ของช่วงหลังคือ",
        "choices": [
            {"label": "ก", "text": "เครียด"},
            {"label": "ข", "text": "นอนกัดฟัน"},
            {"label": "ค", "text": "เคี้ยงข้างเดียว"},
            {"label": "ง", "text": "เคี้ยวเหนียว แข็ง"},
            {"label": "จ", "text": "ผ่าฟันคุด"}
        ],
        "correct_answer": None,
        "category": "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า",
        "task": "การเกิดและการดำเนินโรค",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 3\nคนไข้อ้าปากได้จำกัด หลังผ่าฟันคุดมา มีปวดเวลาตื่นนอน ชอบเคี้ยวของแข็ง ของเหนียว เคี้ยวข้าง\nขวาข้างเดียว ช่วงหลัง ๆ เป็นหนักขึ้นเพราะภาวะโควิด อ้าปากได้ประมาณ 25-30 mm. คลำเจ็บที่ right\nmasseter temporalis และหน้าหู ให้ภาพฟัน attrition มาทั้งปาก\n\n2. Diag",
        "choices": [
            {"label": "ก", "text": "Myospasm"},
            {"label": "ข", "text": "Disc displacement with reduction"},
            {"label": "ค", "text": "Disc displacement without reduction"},
            {"label": "ง", "text": "Myalgia"},
            {"label": "จ", "text": "Myofacial pain"}
        ],
        "correct_answer": None,
        "category": "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า",
        "task": "การวินิจฉัยโรค",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 3\nคนไข้อ้าปากได้จำกัด หลังผ่าฟันคุดมา มีปวดเวลาตื่นนอน ชอบเคี้ยวของแข็ง ของเหนียว เคี้ยวข้าง\nขวาข้างเดียว ช่วงหลัง ๆ เป็นหนักขึ้นเพราะภาวะโควิด อ้าปากได้ประมาณ 25-30 mm. คลำเจ็บที่ right\nmasseter temporalis และหน้าหู ให้ภาพฟัน attrition มาทั้งปาก\n\n3. ปัจจัยอะไรทำให้คนไข้คนนี้เสี่ยงฟันผุสูง",
        "choices": [
            {"label": "ก", "text": "Root expose"},
            {"label": "ข", "text": "Dentine expose"},
            {"label": "ค", "text": "มีฟันผุหลายซี่ในปาก"}
        ],
        "correct_answer": None,
        "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
        "task": "การเกิดและการดำเนินโรค",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 4\nผู้ป่วยอายุ 60 ปี อยากใส่ฟันเทียม พบเหงือกล่างขวาบวม คลำแข็ง ไม่พบความผิดปกตินอกช่องปาก\n(x ray เห็นคล้ายๆในรูป แต่ของจริงจะอยู่แถวๆ 44 45 ขนาดประมาณ 1x1 cm ได้) ผู้ป่วยเป็นโรค liver\ncirrhosis hypertension\n\n1. ก่อนผ่าตัดรอยโรคออกต้องตรวจเพิ่มเติมอะไร",
        "choices": [
            {"label": "ก", "text": "serum Cr"},
            {"label": "ข", "text": "C-reactive protein"},
            {"label": "ค", "text": "CBC"},
            {"label": "ง", "text": "Differential white count"},
            {"label": "จ", "text": "Coagulogram"}
        ],
        "correct_answer": None,
        "category": "ศัลยศาสตร์ช่องปาก",
        "task": "การจัดการและการรักษาผู้ป่วย",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 4\nผู้ป่วยอายุ 60 ปี อยากใส่ฟันเทียม พบเหงือกล่างขวาบวม คลำแข็ง ไม่พบความผิดปกตินอกช่องปาก\n(x ray เห็นคล้ายๆในรูป แต่ของจริงจะอยู่แถวๆ 44 45 ขนาดประมาณ 1x1 cm ได้) ผู้ป่วยเป็นโรค liver\ncirrhosis hypertension\n\n2. diag ว่าเป็น",
        "choices": [
            {"label": "ก", "text": "AOT"},
            {"label": "ข", "text": "Ameloblastoma"},
            {"label": "ค", "text": "Residual cyst"},
            {"label": "ง", "text": "Radicular cyst"},
            {"label": "จ", "text": "CEOT"}
        ],
        "correct_answer": None,
        "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
        "task": "การวินิจฉัยโรค",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 4\nผู้ป่วยอายุ 60 ปี อยากใส่ฟันเทียม พบเหงือกล่างขวาบวม คลำแข็ง ไม่พบความผิดปกตินอกช่องปาก\n(x ray เห็นคล้ายๆในรูป แต่ของจริงจะอยู่แถวๆ 44 45 ขนาดประมาณ 1x1 cm ได้) ผู้ป่วยเป็นโรค liver\ncirrhosis hypertension\n\n3. ก่อนผ่าตัด ต้องส่งตรวจอะไรก่อน",
        "choices": [
            {"label": "ก", "text": "CBC"},
            {"label": "ข", "text": "Coagulogram"},
            {"label": "ค", "text": "Creatinine"},
            {"label": "ง", "text": "C-reactive protein"}
        ],
        "correct_answer": None,
        "category": "ศัลยศาสตร์ช่องปาก",
        "task": "การจัดการและการรักษาผู้ป่วย",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 5\nหญิง 60 กินยา glipizide, losartan, ferrous sulfate, vit B complex มีลักษณะทางคลินิกและ\nภาพทางรังสีดังแสดง (ฟันหน้า11, 12 ผุ proximal + root cariesเยิน ๆ ไม่มีวัสดุอุดเก่า)\n\n1. Systemic related factor ที่สัมพันธ์กับการดำเนินโรคปริทันต์ของผู้ป่วยรายนี้",
        "choices": [
            {"label": "ก", "text": "DM"},
            {"label": "ข", "text": "HT"},
            {"label": "ค", "text": "Medication and supplement"},
            {"label": "ง", "text": "Malnutrition"},
            {"label": "จ", "text": "Hormone"}
        ],
        "correct_answer": None,
        "category": "ปริทันตวิทยา",
        "task": "การเกิดและการดำเนินโรค",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 5\nหญิง 60 กินยา glipizide, losartan, ferrous sulfate, vit B complex มีลักษณะทางคลินิกและ\nภาพทางรังสีดังแสดง (ฟันหน้า11, 12 ผุ proximal + root cariesเยิน ๆ ไม่มีวัสดุอุดเก่า)\n\n2. ฟันผุคอฟันหน้า 11, 21 เป็นแบบไหน",
        "choices": [
            {"label": "ก", "text": "Primary caries"},
            {"label": "ข", "text": "Secondary caries"},
            {"label": "ค", "text": "Incipient caries"},
            {"label": "ง", "text": "Hidden caires"},
            {"label": "จ", "text": "Residual caries"}
        ],
        "correct_answer": None,
        "category": "ทันตกรรมบูรณะ/หัตถการ",
        "task": "การวินิจฉัยโรค",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 5\nหญิง 60 กินยา glipizide, losartan, ferrous sulfate, vit B complex มีลักษณะทางคลินิกและ\nภาพทางรังสีดังแสดง (ฟันหน้า11, 12 ผุ proximal + root cariesเยิน ๆ ไม่มีวัสดุอุดเก่า)\n\n3. ภายหลังการเตรียมช่องปาก lower arch ผู้ป่วยจัดเป็น kennedy class ไหน (ตอนแรก เหลือ\n43, 42, 41, 31, 33, 34, 37 ดูจาก x ray แล้ว 37 ถอนแน่ ๆ แล้ว เพราะ bone เหลือแค่ที่ apical\nของราก+ล้ม mesial เก็บ 43,33,34 ไว้ได้เพราะเหลือ bone ~50% 31, 41, 42 ก็น่าจะถอน\nเพราะ bone เหลือประมาณ 25%)",
        "choices": [
            {"label": "ก", "text": "Class I mod 1"},
            {"label": "ข", "text": "Class II mod 1"},
            {"label": "ค", "text": "Class II mod 2"},
            {"label": "ง", "text": "Class IV mod 1"},
            {"label": "จ", "text": "Unclassified"}
        ],
        "correct_answer": None,
        "category": "ทันตกรรมประดิษฐ์",
        "task": "การวินิจฉัยโรค",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 6\nเด็กอายุ 7 ปี ปวดฟันซี่ 74 ลักษณะทางคลินิกและภาพรังสีดังแสดง (caries ทะลุ pulp ใต้\nfurcation bone ละลายหมด)\n\n1. พบว่ามีอาการบวมแก้มด้านซ้าย การแพร่ของเชื้อเป็นรูปแบบใด",
        "choices": [
            {"label": "ก", "text": "ไม่มีรูปแบบที่แน่นอน การติดเชื้ออยู่ lateral ต่อ buccinator m."},
            {"label": "ข", "text": "ทะลุ bone เหนือต่อจุดเกาะ buccinator m. อยู่ lateral ต่อ buccinator m."},
            {"label": "ค", "text": "ทะลุ bone ใต้ต่อจุดเกาะ buccinator m. อยู่ medial ต่อ buccinator m."},
            {"label": "ง", "text": "ทะลุ bone เหนือต่อจุดเกาะ buccinator m. อยู่ medial ต่อ buccinator m."},
            {"label": "จ", "text": "ทะลุ bone ใต้ต่อจุดเกาะ buccinator m. อยู่ lateral ต่อ buccinator m."}
        ],
        "correct_answer": None,
        "category": "ศัลยศาสตร์ช่องปาก",
        "task": "การเกิดและการดำเนินโรค",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 6\nเด็กอายุ 7 ปี ปวดฟันซี่ 74 ลักษณะทางคลินิกและภาพรังสีดังแสดง (caries ทะลุ pulp ใต้\nfurcation bone ละลายหมด)\n\n2. ขนาดของเข็มยาชาและเครื่องมือถอนฟันที่เหมาะสมในการถอนฟันซี่ 74 คือข้อใด",
        "choices": [
            {"label": "ก", "text": "เข็มยาชา gauge 25 ยาว 16 extraction forcep 150s"},
            {"label": "ข", "text": "เข็มยาชา gauge 25 ยาว 21 extraction forcep 151s"},
            {"label": "ค", "text": "เข็มยาชา gauge 27 ยาว 16 extraction forcep 150s"},
            {"label": "ง", "text": "เข็มยาชา gauge 27 ยาว 21 extraction forcep 150s"},
            {"label": "จ", "text": "เข็มยาชา gauge 27 ยาว 21 extraction forcep 151s"}
        ],
        "correct_answer": None,
        "category": "ทันตกรรมสำหรับเด็ก",
        "task": "ขั้นตอนและวิธีการรักษา",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 6\nเด็กอายุ 7 ปี ปวดฟันซี่ 74 ลักษณะทางคลินิกและภาพรังสีดังแสดง (caries ทะลุ pulp ใต้\nfurcation bone ละลายหมด)\n\n3. ขณะตรวจ เด็กร้องไห้เสียง ดิ้น อาละวาด ปัดมือทันตแพทย์ การวินิจฉัยพฤติกรรมในเด็กรายนี้คือ\nข้อใด",
        "choices": [
            {"label": "ก", "text": "whining behavior"},
            {"label": "ข", "text": "tense cooperate behavior"},
            {"label": "ค", "text": "timid behavior"},
            {"label": "ง", "text": "uncontrolled behavior"},
            {"label": "จ", "text": "lacking cooperate behavior"}
        ],
        "correct_answer": None,
        "category": "ทันตกรรมสำหรับเด็ก",
        "task": "การวินิจฉัยโรค",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 7\nหญิง 70 ปี ติดเตียง ให้อาหารทางสายยาง\n\n1. ป้องกันโรค/ภาวะแทรกซ้อนอะไร",
        "choices": [
            {"label": "ก", "text": "การสูญเสียฟัน"},
            {"label": "ข", "text": "ฟันผุ"},
            {"label": "ค", "text": "ปอดติดเชื้อ"},
            {"label": "ง", "text": "ติดเชื้อในกระแสเลือด"}
        ],
        "correct_answer": None,
        "category": "ทันตกรรมชุมชน",
        "task": "การสร้างเสริมสุขภาพและการป้องกัน",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 7\nหญิง 70 ปี ติดเตียง ให้อาหารทางสายยาง\n\n2. ทันตาภิบาลทำทันตกรรมป้องกันได้มั้ย",
        "choices": [
            {"label": "ก", "text": "ได้แต่ต้องให้ทันตแพทย์มาด้วยทุกครั้ง"},
            {"label": "ข", "text": "ได้เฉพาะทันตาที่จบสาธารณสุขอะไรสักอย่าง"},
            {"label": "ค", "text": "ไม่ได้เพราะทำนอกรพ."}
        ],
        "correct_answer": None,
        "category": "ทันตกรรมชุมชน",
        "task": "การสร้างเสริมสุขภาพและการป้องกัน",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 7\nหญิง 70 ปี ติดเตียง ให้อาหารทางสายยาง\n\n3. แผนของทันตแพทย์",
        "choices": [
            {"label": "ก", "text": "สอนลูกสาวแปรงฟัน"},
            {"label": "ข", "text": "ป้องกันแผลกดทับ"}
        ],
        "correct_answer": None,
        "category": "ทันตกรรมชุมชน",
        "task": "การจัดการและการรักษาผู้ป่วย",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 8\nญ อายุ 50 ปี มีโรคเส้นเลือดหัวใจตีบ ไขมันสูง และความดันสูง กินยา metoprolol, amlodipine,\naspirin, simvastatin\n\n1. เหตุผลที่ใช้ lingual bar (lower RPD)",
        "choices": [
            {"label": "ก", "text": "No gingival recession"},
            {"label": "ข", "text": "ลิ้นโต"},
            {"label": "ค", "text": "Floor of mouth 5 mm"},
            {"label": "ง", "text": "clinical crown สั้น"},
            {"label": "จ", "text": "low lingual frenum"}
        ],
        "correct_answer": None,
        "category": "ทันตกรรมประดิษฐ์",
        "task": "การจัดการและการรักษาผู้ป่วย",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 8\nญ อายุ 50 ปี มีโรคเส้นเลือดหัวใจตีบ ไขมันสูง และความดันสูง กินยา metoprolol, amlodipine,\naspirin, simvastatin\n\n2. ตอนตัด torus ฉีดยาชาไป 2 หลอด แล้วมึอาการหายใจลำบาก ใจสั่น ทำยังไง",
        "choices": [
            {"label": "ก", "text": "oral morphine"},
            {"label": "ข", "text": "IV diazepam"},
            {"label": "ค", "text": "oxygen canula"},
            {"label": "ง", "text": "aspirin อมใต้ลิ้น"},
            {"label": "จ", "text": "vital sign monitoring"}
        ],
        "correct_answer": None,
        "category": "ศัลยศาสตร์ช่องปาก",
        "task": "การจัดการและการรักษาผู้ป่วย",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 8\nญ อายุ 50 ปี มีโรคเส้นเลือดหัวใจตีบ ไขมันสูง และความดันสูง กินยา metoprolol, amlodipine,\naspirin, simvastatin\n\n3. ซักประวัติอะไรเพิ่ม ตามหลัก New York heart association functional classification",
        "choices": [
            {"label": "ก", "text": "เดินขึ้นบันได 2 ชั้นแล้วเหนื่อย"},
            {"label": "ข", "text": "กินยาต้านเกล็ดเลือดสม่ำเสมอ"},
            {"label": "ค", "text": "มีประวัติการถอนฟัน"},
            {"label": "ง", "text": "มีคนในครอบครัวเป็นโรคหัวใจ"},
            {"label": "จ", "text": "พบแพทย์เป็นประจำ"}
        ],
        "correct_answer": None,
        "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
        "task": "การวินิจฉัยโรค",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 9\nคนไข้อายุ 50 ปี มาด้วยอาการสบฟันหลังไม่ได้ มีอาการปวดหน้ารูหูด้านขวา ให้ประวัติว่า ได้รับ\nอุบัติเหตุที่คางมา 1 วันก่อน ตรวจพบมีอาการกดเจ็บที่แก้มด้านขวา และบริเวณขมับด้านขวา อ้าปากได้ปกติ\n\n1. เมื่อถอนฟันซี่ 16 และกำลัง curette แผลถอนฟันอยู่บริเวณก้นแผล ปรากฏว่าเกิดรูทะลุเข้าไปใน\nmaxillary sinus ขนาด 7 mm ต้องทำอย่างไร",
        "choices": [
            {"label": "ก", "text": "ปิดปากแผลให้เป็น primary closure"},
            {"label": "ข", "text": "ปิดปากแผลด้วยเทคนิค figure of eight"},
            {"label": "ค", "text": "ปิดปากแผลด้วยเทคนิค horizontal mattress"},
            {"label": "ง", "text": "ไม่ต้องเย็บปิดแผลและให้ผู้ป่วยกัดผ้าก๊อซ"},
            {"label": "จ", "text": "ใส่ hemostatic material และปิดปากแผล"}
        ],
        "correct_answer": None,
        "category": "ศัลยศาสตร์ช่องปาก",
        "task": "ขั้นตอนและวิธีการรักษา",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 9\nคนไข้อายุ 50 ปี มาด้วยอาการสบฟันหลังไม่ได้ มีอาการปวดหน้ารูหูด้านขวา ให้ประวัติว่า ได้รับ\nอุบัติเหตุที่คางมา 1 วันก่อน ตรวจพบมีอาการกดเจ็บที่แก้มด้านขวา และบริเวณขมับด้านขวา อ้าปากได้ปกติ\n\n2. อาการปวดที่เกิดขึ้นจะบรรเทาอาการอย่างไร",
        "choices": [
            {"label": "ก", "text": "ให้ผู้ป่วยประคบร้อน"},
            {"label": "ข", "text": "พิมพ์ปากและทำ occlusal splint"},
            {"label": "ค", "text": "ให้ความรู้ผู้ป่วยและการดูแลต้นเอง"},
            {"label": "ง", "text": "occlusal adjustment"}
        ],
        "correct_answer": None,
        "category": "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า",
        "task": "การจัดการและการรักษาผู้ป่วย",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 9\nคนไข้อายุ 50 ปี มาด้วยอาการสบฟันหลังไม่ได้ มีอาการปวดหน้ารูหูด้านขวา ให้ประวัติว่า ได้รับ\nอุบัติเหตุที่คางมา 1 วันก่อน ตรวจพบมีอาการกดเจ็บที่แก้มด้านขวา และบริเวณขมับด้านขวา อ้าปากได้ปกติ\n\n3. การวินิจฉัยเบื้องต้นของอาการดังกล่าวคือข้อใด",
        "choices": [
            {"label": "ก", "text": "Myofascial pain"},
            {"label": "ข", "text": "Muscle splinter"},
            {"label": "ค", "text": "Disc displacement without reduction"},
            {"label": "ง", "text": "Arthralgia"}
        ],
        "correct_answer": None,
        "category": "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า",
        "task": "การวินิจฉัยโรค",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 10\nเด็ก 4 ขวบ ปวดฟันเป็น ๆ หาย ๆ ปวดกลางคืน มี fistula ให้ภาพ PA 84-85 85 ผุ exposed pulp\nมี rarefied ที่ furcation มี tooth bud ด้านใต้ , 84 ผุ D3 สุดท้ายทำ pulpec ไป 6 เดือน กลับมา อาการ\nไม่มีแล้วแต่ x ray ไม่หาย มีเหงือกอักเสบนิดหน่อย\n\n1. จะ manage ยังไง",
        "choices": [
            {"label": "ก", "text": "Retreat"},
            {"label": "ข", "text": "scrp รอบๆซี่"},
            {"label": "ค", "text": "observe ละมาตรวจ clinic กับ xray อีกที 6 เดือนหน้า"},
            {"label": "ง", "text": "observe ละมาตรวจ x อีกที 6 เดือนหน้า"},
            {"label": "จ", "text": "ถอนใส่ space maintainer"}
        ],
        "correct_answer": None,
        "category": "ทันตกรรมสำหรับเด็ก",
        "task": "การจัดการและการรักษาผู้ป่วย",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 10\nเด็ก 4 ขวบ ปวดฟันเป็น ๆ หาย ๆ ปวดกลางคืน มี fistula ให้ภาพ PA 84-85 85 ผุ exposed pulp\nมี rarefied ที่ furcation มี tooth bud ด้านใต้ , 84 ผุ D3 สุดท้ายทำ pulpec ไป 6 เดือน กลับมา อาการ\nไม่มีแล้วแต่ x ray ไม่หาย มีเหงือกอักเสบนิดหน่อย\n\n2. Diag 85",
        "choices": [],
        "correct_answer": None,
        "category": "ทันตกรรมสำหรับเด็ก",
        "task": "การวินิจฉัยโรค",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 10\nเด็ก 4 ขวบ ปวดฟันเป็น ๆ หาย ๆ ปวดกลางคืน มี fistula ให้ภาพ PA 84-85 85 ผุ exposed pulp\nมี rarefied ที่ furcation มี tooth bud ด้านใต้ , 84 ผุ D3 สุดท้ายทำ pulpec ไป 6 เดือน กลับมา อาการ\nไม่มีแล้วแต่ x ray ไม่หาย มีเหงือกอักเสบนิดหน่อย\n\n3. ตอน remove caries 84 เจาะทะลุ 1mm ทำไงดี",
        "choices": [
            {"label": "ก", "text": "Pulpec"},
            {"label": "ข", "text": "Pulpo"},
            {"label": "ค", "text": "Apexi"},
            {"label": "ง", "text": "Apexo"},
            {"label": "จ", "text": "Direct pulp cap"}
        ],
        "correct_answer": None,
        "category": "ทันตกรรมสำหรับเด็ก",
        "task": "ขั้นตอนและวิธีการรักษา",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 11\nหญิงอายุ 50 ปี มาด้วยเศษอาหารชอบติดตรงฟังหลัง ล่างซ้าย ให้รูปมาคลินิกมาเป็นซี่ 36 อุด OD\nและซี่ 37 mesioversion ให้ภาพรังสีมาเป็น 36OD มี overhang เล็กๆและมีอุดไม่เต็มที่ผิวด้านนอกด้าน D\nเล็กๆ\n\n1. สาเหตุของรอยดำที่ผิววัสดุคือ",
        "choices": [
            {"label": "ก", "text": "อุด resin composite ไม่เต็ม"},
            {"label": "ข", "text": "Resin composite polymerize ไม่เต็มที่"},
            {"label": "ค", "text": "ไม่ได้ทำ pulp protection ก่อนอุด"}
        ],
        "correct_answer": None,
        "category": "ทันตกรรมบูรณะ/หัตถการ",
        "task": "การเกิดและการดำเนินโรค",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 11\nหญิงอายุ 50 ปี มาด้วยเศษอาหารชอบติดตรงฟังหลัง ล่างซ้าย ให้รูปมาคลินิกมาเป็นซี่ 36 อุด OD\nและซี่ 37 mesioversion ให้ภาพรังสีมาเป็น 36OD มี overhang เล็กๆและมีอุดไม่เต็มที่ผิวด้านนอกด้าน D\nเล็กๆ\n\n2. จะแก้ไขยังไง",
        "choices": [
            {"label": "ก", "text": "ทา fluoride varnish แล้วนัดติดตามอาการ"},
            {"label": "ข", "text": "Re-etch and re-bond"},
            {"label": "ค", "text": "Repair with GIC"},
            {"label": "ง", "text": "Refilling with resin composite"},
            {"label": "จ", "text": "Repolishing"}
        ],
        "correct_answer": None,
        "category": "ทันตกรรมบูรณะ/หัตถการ",
        "task": "การจัดการและการรักษาผู้ป่วย",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 11\nหญิงอายุ 50 ปี มาด้วยเศษอาหารชอบติดตรงฟังหลัง ล่างซ้าย ให้รูปมาคลินิกมาเป็นซี่ 36 อุด OD\nและซี่ 37 mesioversion ให้ภาพรังสีมาเป็น 36OD มี overhang เล็กๆและมีอุดไม่เต็มที่ผิวด้านนอกด้าน D\nเล็กๆ\n\n3. ถ้าจะพิมพ์คอฟันซี่ 15, 16 จะใช้ impression technique อะไร",
        "choices": [
            {"label": "ก", "text": "Double impression PVS with stock tray"},
            {"label": "ข", "text": "Single impression PVS with stock tray"},
            {"label": "ค", "text": "Double mix single wash polysulfide with stock tray"},
            {"label": "ง", "text": "Selective pressure with polyether using custom tray"},
            {"label": "จ", "text": "Mucocompressive with PVS using custom tray"}
        ],
        "correct_answer": None,
        "category": "ทันตกรรมบูรณะ/หัตถการ",
        "task": "ขั้นตอนและวิธีการรักษา",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 12\nผู้ป่วย 45 ปี สันเหงือกบวมตรง eden 47-retromolar pad กด firm\n\n1. ซักประวัติอะไรเพิ่ม",
        "choices": [
            {"label": "ก", "text": "ความถี่การหาหมอฟัน"},
            {"label": "ข", "text": "ประวัติผ่าฟันคุด 48"},
            {"label": "ค", "text": "โรคประจำตัว"},
            {"label": "ง", "text": "ยาที่ใช้ประจำ"},
            {"label": "จ", "text": "คนในครอบครัวที่มีรอยโรคในกระดูกขากรรไกร"}
        ],
        "correct_answer": None,
        "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
        "task": "การวินิจฉัยโรค",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 12\nผู้ป่วย 45 ปี สันเหงือกบวมตรง eden 47-retromolar pad กด firm\n\n2. ตรวจทางพยาธิพบ intercellular bridge ระหว่าง epithelial cell, amorphous eosinophilic\namyloid-like extracellular material, leisegang ring calcification วินิจฉัยว่าอะไร",
        "choices": [
            {"label": "ก", "text": "CEOT"},
            {"label": "ข", "text": "AOT"},
            {"label": "ค", "text": "FCOD"},
            {"label": "ง", "text": "COC"},
            {"label": "จ", "text": "Ameloblastic fibrou-odontoma"}
        ],
        "correct_answer": None,
        "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
        "task": "การวินิจฉัยโรค",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 12\nผู้ป่วย 45 ปี สันเหงือกบวมตรง eden 47-retromolar pad กด firm\n\n3. มีเสียงคลิกแต่ไม่มีอาการปวดที่ข้อต่อและกล้ามเนื้อ มีประวัติทำฟันเมื่อ 6 เดือนก่อน แก้ยังไง",
        "choices": [
            {"label": "ก", "text": "กรอแก้สบ"},
            {"label": "ข", "text": "ทำ splint"},
            {"label": "ค", "text": "ประคบอุ่น"},
            {"label": "ง", "text": "ส่ง MRI TMJ"}
        ],
        "correct_answer": None,
        "category": "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า",
        "task": "การจัดการและการรักษาผู้ป่วย",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 13\nผู้ป่วย มาขูดหินปูน ตรวจเจอเสียงคลิก แบบ reciprocal ตอนอ้าปากพ้น 30 mm และตอนหุบปาก\nลงน้อยกว่า 10 mm อ้าปากกว้างสุด 50 mm ไม่มีประวัตินอนกัดฟัน\n\n1. ขณะทำฟันอ้ากว้างแล้วหุบปากลงไม่ได้ ทำไง",
        "choices": [
            {"label": "ก", "text": "ให้ยาคลายกล้ามเนื้อ และนัดมาติดตามผลวันรุ่งขึ้น"},
            {"label": "ข", "text": "กดลง + ไปข้างหน้า"},
            {"label": "ค", "text": "กดลง + ไปข้างหลัง"},
            {"label": "ง", "text": "ยกขึ้น + ไปข้างหน้า"},
            {"label": "จ", "text": "ยกขึ้น + ไปข้างหลัง"}
        ],
        "correct_answer": None,
        "category": "ศัลยศาสตร์ช่องปาก",
        "task": "ขั้นตอนและวิธีการรักษา",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 13\nผู้ป่วย มาขูดหินปูน ตรวจเจอเสียงคลิก แบบ reciprocal ตอนอ้าปากพ้น 30 mm และตอนหุบปาก\nลงน้อยกว่า 10 mm อ้าปากกว้างสุด 50 mm ไม่มีประวัตินอนกัดฟัน\n\n2. จะพบความผิดปกติของ disc-joint complex ที่ตำแหน่งใดของการอ้าและหุบปาก",
        "choices": [
            {"label": "ก", "text": "ขณะอ้ากว้างสุด 50 mm"},
            {"label": "ข", "text": "ขณะหุบระยะยังไม่น้อยกว่า 10 mm"},
            {"label": "ค", "text": "ขณะหุบปากปกติ"},
            {"label": "ง", "text": "ขณะอ้าเกิน 30 mm"}
        ],
        "correct_answer": None,
        "category": "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า",
        "task": "การเกิดและการดำเนินโรค",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 13\nผู้ป่วย มาขูดหินปูน ตรวจเจอเสียงคลิก แบบ reciprocal ตอนอ้าปากพ้น 30 mm และตอนหุบปาก\nลงน้อยกว่า 10 mm อ้าปากกว้างสุด 50 mm ไม่มีประวัตินอนกัดฟัน\n\n3. ถ้าคนไข้มีอาการปวดเมื่อย ให้การรักษาหรือแนะนำอย่างไร",
        "choices": [
            {"label": "ก", "text": "Splint"},
            {"label": "ข", "text": "Spray"},
            {"label": "ค", "text": "ให้คำแนะนำ self-care"}
        ],
        "correct_answer": None,
        "category": "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า",
        "task": "การจัดการและการรักษาผู้ป่วย",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 14\nน้องเด็ก เป็น Common variable immunodeficiency (CVID) ใส่ removable appliance 1\nเดือนให้รูปคลินิกกระมาณนี้\n\n1. น่าจะเป็นอะไรมากที่สุด",
        "choices": [
            {"label": "ก", "text": "Candida albicans"},
            {"label": "ข", "text": "Allergic to acrylic"},
            {"label": "ค", "text": "SLE"},
            {"label": "ง", "text": "Discoid lupus erythematosus"}
        ],
        "correct_answer": None,
        "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
        "task": "การวินิจฉัยโรค",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 14\nน้องเด็ก เป็น Common variable immunodeficiency (CVID) ใส่ removable appliance 1\nเดือนให้รูปคลินิกกระมาณนี้\n\n2. จะป้องกันโรคนี้ไม่ให้เกิดซ้ำ มีวิธีการอย่างไร",
        "choices": [
            {"label": "ก", "text": "ปรึกษาทันตแพทย์เพื่อเปลี่ยนเครื่องมือ"},
            {"label": "ข", "text": "งดใช้อุปกรณ์"},
            {"label": "ค", "text": "ลดความถี่ในการใช้"},
            {"label": "ง", "text": "ส่งปรึกษาแพทย์ เพื่อปรับยา"}
        ],
        "correct_answer": None,
        "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
        "task": "การสร้างเสริมสุขภาพและการป้องกัน",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 14\nน้องเด็ก เป็น Common variable immunodeficiency (CVID) ใส่ removable appliance 1\nเดือนให้รูปคลินิกกระมาณนี้\n\n3. ทันตกรรมป้องกัน อย่างไร",
        "choices": [
            {"label": "ก", "text": "ใช้ยาสีฟัน 1000 ppm and naf mouthwash"},
            {"label": "ข", "text": "5000 ppm and naf"},
            {"label": "ค", "text": "ใช้ยาสีฟัน 1000 ppm"},
            {"label": "ง", "text": "ใช้ยาสีฟัน 5000 ppm"},
            {"label": "จ", "text": "ใช้ 1000 ppm and chlohexidine"}
        ],
        "correct_answer": None,
        "category": "ทันตกรรมชุมชน",
        "task": "การสร้างเสริมสุขภาพและการป้องกัน",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 15\nให้รูป pfm bridge 13-23 มา ปลายซี่ 11MI มีporcelain บิ่นไปเล็กน้อย วัดระยะจากปลายฟันได้\n2.5 mm ไม่มีประวัตินอนกัดฟัน\n\n1. porcelain บิ่นเกิดจากอะไร",
        "choices": [
            {"label": "ก", "text": "Incisal clearance ไม่พอ"},
            {"label": "ข", "text": "Opaque porcelain หนาเกินไป"},
            {"label": "ค", "text": "Porcelain layering หนาเกินไป"},
            {"label": "ง", "text": "CTE ของ metal substructure สูง"},
            {"label": "จ", "text": "Parafunctional habit"}
        ],
        "correct_answer": None,
        "category": "ทันตกรรมประดิษฐ์",
        "task": "การเกิดและการดำเนินโรค",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 15\nให้รูป pfm bridge 13-23 มา ปลายซี่ 11MI มีporcelain บิ่นไปเล็กน้อย วัดระยะจากปลายฟันได้\n2.5 mm ไม่มีประวัตินอนกัดฟัน\n\n2. ถ้าทำใหม่จะออกแบบ pontic อย่างไร",
        "choices": [
            {"label": "ก", "text": "Unpolished metal"},
            {"label": "ข", "text": "Tissue surface เป็น glazing porcelain"},
            {"label": "ค", "text": "Gold alloy มี tissue surface เป็น well-polished metal"},
            {"label": "ง", "text": "Zirconia"}
        ],
        "correct_answer": None,
        "category": "ทันตกรรมประดิษฐ์",
        "task": "ขั้นตอนและวิธีการรักษา",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 15\nให้รูป pfm bridge 13-23 มา ปลายซี่ 11MI มีporcelain บิ่นไปเล็กน้อย วัดระยะจากปลายฟันได้\n2.5 mm ไม่มีประวัตินอนกัดฟัน\n\n3. ซี่ 35, -ve to EPT, +ve to percussion, x-ray พบ radiolucent area 2x2 ที่ปลายราก ถาม\nDx. Endo",
        "choices": [],
        "correct_answer": None,
        "category": "วิทยาเอ็นโดดอนต์",
        "task": "การวินิจฉัยโรค",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 16\nผู้ป่วย เพศชาย แก่ ฟันเยิน ๆ\n\n1. 26 มีรูปเป็น abfraction อุดอะไร",
        "choices": [
            {"label": "ก", "text": "Microfill CF"},
            {"label": "ข", "text": "Macrofill CF"},
            {"label": "ค", "text": "Alamgam"},
            {"label": "ง", "text": "Conven GI"},
            {"label": "จ", "text": "RMGI"}
        ],
        "correct_answer": None,
        "category": "ทันตกรรมบูรณะ/หัตถการ",
        "task": "ขั้นตอนและวิธีการรักษา",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 16\nผู้ป่วย เพศชาย แก่ ฟันเยิน ๆ\n\n2. ฟันหน้าด้าน labial root caries แหกๆหลายซี่",
        "choices": [
            {"label": "ก", "text": "Polyacrylic acid แล้ว incremental giomer"},
            {"label": "ข", "text": "Polyacrylic acid แล้ว bulk fill with giomer"},
            {"label": "ค", "text": "Polyacrylic acid แล้ว incremental conven GI"},
            {"label": "ง", "text": "Phosphoric acid with incremental conven GI"},
            {"label": "จ", "text": "Phosphoric acid with incremental giomer"}
        ],
        "correct_answer": None,
        "category": "ทันตกรรมบูรณะ/หัตถการ",
        "task": "ขั้นตอนและวิธีการรักษา",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 16\nผู้ป่วย เพศชาย แก่ ฟันเยิน ๆ\n\n3. 42 น่าจะเกิด trauma อะไร (รูปดู recession เยอะมาก ฟันดูยื่นแบบ bimax protrusion)",
        "choices": [
            {"label": "ก", "text": "Protrusion"},
            {"label": "ข", "text": "MIP"},
            {"label": "ค", "text": "Working"},
            {"label": "ง", "text": "Non workinng"},
            {"label": "จ", "text": "Cr premature"}
        ],
        "correct_answer": None,
        "category": "ปริทันตวิทยา",
        "task": "การเกิดและการดำเนินโรค",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 17\nเด็ก 7 ปี ปวดซี่ 74 ให้ภาพ x ray มา ผุระดับ middle third-inner third dentin\n\n1. ใช้วัสดุอะไรในการรักษาคลองรากซี่ 74",
        "choices": [
            {"label": "ก", "text": "Zinc oxide eugenol paste"},
            {"label": "ข", "text": "Ferric sulfate"},
            {"label": "ค", "text": "Calcium hydroxide iodoform paste"},
            {"label": "ง", "text": "Hard setting calcium hydroxide"},
            {"label": "จ", "text": "Formocresol"}
        ],
        "correct_answer": None,
        "category": "ทันตกรรมสำหรับเด็ก",
        "task": "ขั้นตอนและวิธีการรักษา",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 17\nเด็ก 7 ปี ปวดซี่ 74 ให้ภาพ x ray มา ผุระดับ middle third-inner third dentin\n\n2. ซี่ 71 2° mobility, 81 1° mobility แม่กังวลจะหลุดเข้าปาก ทำอย่างไร\n(ฟันแท้ขึ้นแล้วทาง lingual ซี่ 31 ขึ้นมาถึง middle third, ซี่ 41 ขึ้นมาแค่ incisal third)",
        "choices": [
            {"label": "ก", "text": "ถอน 71 81 รอฟันแท้มาแทน"},
            {"label": "ข", "text": "ถอน 71 81 ใส่เครื่องมือขยายขากรรไกรล่าง"},
            {"label": "ค", "text": "ถอน 71 รอนัด3เดือนมาประเมิน81"},
            {"label": "ง", "text": "consult ortho เรื่องการถอนซี่ 71 81"},
            {"label": "จ", "text": "รอหลุดเอง"}
        ],
        "correct_answer": None,
        "category": "ทันตกรรมสำหรับเด็ก",
        "task": "การจัดการและการรักษาผู้ป่วย",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 17\nเด็ก 7 ปี ปวดซี่ 74 ให้ภาพ x ray มา ผุระดับ middle third-inner third dentin\n\n3. ปวดซี่ 84 พิจารณาควรรักษารากแล้วทำครอบฟัน แต่ ผปค ไม่มีเงิน ขอถอนแทน ใช้หลักกฎหมาย\nอะไรในการพิจารณา",
        "choices": [
            {"label": "ก", "text": "พรบวิชาชีพทันตกรรม"},
            {"label": "ข", "text": "พรบสถานพยาบาล"},
            {"label": "ค", "text": "พรบคุ้มครองผู้บริโภค"},
            {"label": "ง", "text": "พรบคุ้มครองผู้รับบริการทางสาธารณสุข"},
            {"label": "จ", "text": "หลักสิทธิผู้ป่วย"},
            {"label": "ฉ", "text": "หลักสิทธิมนุษยชน"},
            {"label": "ช", "text": "จรรยาบรรณวิชาชีพทันตกรรม"},
            {"label": "ซ", "text": "รัฐธรรมนูญ"}
        ],
        "correct_answer": None,
        "category": "ทันตกรรมชุมชน",
        "task": "การจัดการและการรักษาผู้ป่วย",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 18\nให้รูปฟันมา คนไข้อายุ 20 ปีมีฟันกรามบน Root surface exposed 1 ซี่ (ไม่สึก ไม่เป็น cavity)\n\n1. วิธีการแปรงฟันที่จะแนะนำผู้ป่วย",
        "choices": [
            {"label": "ก", "text": "horizontal scrub"},
            {"label": "ข", "text": "circle scrub"},
            {"label": "ค", "text": "stillman technique"},
            {"label": "ง", "text": "charter technique"},
            {"label": "จ", "text": "Fones’ technique"}
        ],
        "correct_answer": None,
        "category": "ปริทันตวิทยา",
        "task": "การสร้างเสริมสุขภาพและการป้องกัน",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 18\nให้รูปฟันมา คนไข้อายุ 20 ปีมีฟันกรามบน Root surface exposed 1 ซี่ (ไม่สึก ไม่เป็น cavity)\n\n2. การจัดการกับเหงือกร่นทางด้านบนขวา",
        "choices": [
            {"label": "ก", "text": "OFD"},
            {"label": "ข", "text": "APF"},
            {"label": "ค", "text": "connective tissue graft"},
            {"label": "ง", "text": "double papilla flap"},
            {"label": "จ", "text": "lateral sliding flap"}
        ],
        "correct_answer": None,
        "category": "ปริทันตวิทยา",
        "task": "การจัดการและการรักษาผู้ป่วย",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 18\nให้รูปฟันมา คนไข้อายุ 20 ปีมีฟันกรามบน Root surface exposed 1 ซี่ (ไม่สึก ไม่เป็น cavity)\n\n3. ฟันซี่ 43 จะมีการสบฟันทราผิดปกติอะไร (ให้รู้เป็นฟันสบแบบ edge to edge ตรงซี่ 12/43 และ\n13/44)",
        "choices": [
            {"label": "ก", "text": "CR-MIP discrepancy"},
            {"label": "ข", "text": "working interference"},
            {"label": "ค", "text": "non-working interference"},
            {"label": "ง", "text": "premature contact in MIP"},
            {"label": "จ", "text": "protrusive interference"}
        ],
        "correct_answer": None,
        "category": "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า",
        "task": "การวินิจฉัยโรค",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 19\nผู้ป่วยหญิง 50 ปี ปวดฟันซี่ที่ endo มาแล้วและทำครอบมา น่าจะซี่ 22 (ฟันหน้า ไม่แน่ใจซี่ไหน)\nxray เห็น gutta percha ห่างจากปลายราก 3-4 mm มีradiolucent ที่ปลายรากแต่ไม่ใหญ่\n\n1. รักษายังไงเหตุผลเพราอะไร (retreat endo มั้ย เพราะอะไร)",
        "choices": [],
        "correct_answer": None,
        "category": "วิทยาเอ็นโดดอนต์",
        "task": "การจัดการและการรักษาผู้ป่วย",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 19\nผู้ป่วยหญิง 50 ปี ปวดฟันซี่ที่ endo มาแล้วและทำครอบมา น่าจะซี่ 22 (ฟันหน้า ไม่แน่ใจซี่ไหน)\nxray เห็น gutta percha ห่างจากปลายราก 3-4 mm มีradiolucent ที่ปลายรากแต่ไม่ใหญ่\n\n2. ให้เลือกวัสดุทำครอบ pfm, zirconia...",
        "choices": [],
        "correct_answer": None,
        "category": "ทันตกรรมประดิษฐ์",
        "task": "ขั้นตอนและวิธีการรักษา",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 20\nผป อายุ 35 ปี ทำครอบซี่ 11 มา 2 ปี มีกลิ่นเหม็น เคาะเจ็บเล็กน้อย ให้รูปฟันบนล่างมา กับเอกเรย์\nไม่ถึงปลายรากคิดว่า leak ตรง margin ซี่ 35 มีclass V ถึง dentine\n\n1. การบูรณะหลังการรักษาคลองรากฟันซ้ำควรทำอย่างไร\nช้อยเป็นglass fiber post, silica fiber post , carbon fiber post , prefabricated post\nคู่กับ zirconia , gold , lithium disilicate crown",
        "choices": [],
        "correct_answer": None,
        "category": "ทันตกรรมประดิษฐ์",
        "task": "ขั้นตอนและวิธีการรักษา",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 20\nผป อายุ 35 ปี ทำครอบซี่ 11 มา 2 ปี มีกลิ่นเหม็น เคาะเจ็บเล็กน้อย ให้รูปฟันบนล่างมา กับเอกเรย์\nไม่ถึงปลายรากคิดว่า leak ตรง margin ซี่ 35 มีclass V ถึง dentine\n\n2. สาเหตุของกลิ่นเหม็นในช่องปาก",
        "choices": [
            {"label": "ก", "text": "Perio"},
            {"label": "ข", "text": "Inadequate rct"},
            {"label": "ค", "text": "Marginal leakage"},
            {"label": "ง", "text": "Trauma"}
        ],
        "correct_answer": None,
        "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
        "task": "การเกิดและการดำเนินโรค",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 20\nผป อายุ 35 ปี ทำครอบซี่ 11 มา 2 ปี มีกลิ่นเหม็น เคาะเจ็บเล็กน้อย ให้รูปฟันบนล่างมา กับเอกเรย์\nไม่ถึงปลายรากคิดว่า leak ตรง margin ซี่ 35 มีclass V ถึง dentine\n\n3. การจะอุดฟันซี่ 35B ให้เกิด bond strength มากที่สุดควรทำอย่างไร",
        "choices": [
            {"label": "ก", "text": "Bevel occlusal enamel แล้วใช้ 1 step"},
            {"label": "ข", "text": "Bevel occlusal enamel แล้วใช้ 2 steps"},
            {"label": "ค", "text": "Bevel occlusal enamel and grinding dentine แล้วใช้ 3 steps"},
            {"label": "ง", "text": "Grinding dentine แล้วใช้ 2 step"},
            {"label": "จ", "text": "Grinding dentine แล้วใช้ 3 step"}
        ],
        "correct_answer": None,
        "category": "ทันตกรรมบูรณะ/หัตถการ",
        "task": "ขั้นตอนและวิธีการรักษา",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 21\nชาย 23 ปี ซี่ 21 เคาะเเละคลำแล้วเจ็บ ไม่มีอาการปวด ให้รูปในช่องปากมาซี่ 21 ฟันหักครึ่งซี่ มี irm\nอุดปิดอยู่ ฟิล์ม x ray พบว่าใน canal มี gutta percha แค่ครึ่ง canal ล่าง\n\n1. dx ซี่ 21",
        "choices": [
            {"label": "ก", "text": "Previously treated tooth with symptomatic apical periodontitis"},
            {"label": "ข", "text": "Previously treated tooth with asymptomatic apical periodontitis"},
            {"label": "ค", "text": "Pulp necrosis"},
            {"label": "ง", "text": "Pulp necrosis with symptomatic apical periodontitis"},
            {"label": "จ", "text": "Previous initiated therapy with symptomatic apical periodontits"}
        ],
        "correct_answer": None,
        "category": "วิทยาเอ็นโดดอนต์",
        "task": "การวินิจฉัยโรค",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 21\nชาย 23 ปี ซี่ 21 เคาะเเละคลำแล้วเจ็บ ไม่มีอาการปวด ให้รูปในช่องปากมาซี่ 21 ฟันหักครึ่งซี่ มี irm\nอุดปิดอยู่ ฟิล์ม x ray พบว่าใน canal มี gutta percha แค่ครึ่ง canal ล่าง\n\n2. เหตุผลที่ต้องทำการรักษาคลองรากฟันซี่ 21 อีกครั้ง",
        "choices": [
            {"label": "ก", "text": "Poor apical seal"},
            {"label": "ข", "text": "Tooth discoloration"}
        ],
        "correct_answer": None,
        "category": "วิทยาเอ็นโดดอนต์",
        "task": "การเกิดและการดำเนินโรค",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 21\nชาย 23 ปี ซี่ 21 เคาะเเละคลำแล้วเจ็บ ไม่มีอาการปวด ให้รูปในช่องปากมาซี่ 21 ฟันหักครึ่งซี่ มี irm\nอุดปิดอยู่ ฟิล์ม x ray พบว่าใน canal มี gutta percha แค่ครึ่ง canal ล่าง\n\n3. ควรบูรณะฟันซี่นี้หลังรักษาคลองรากฟันด้วยอะไร",
        "choices": [
            {"label": "ก", "text": "post and core with pfm crown"},
            {"label": "ข", "text": "resin composite crown"},
            {"label": "ค", "text": "pfm crown"},
            {"label": "ง", "text": "prefab post with ceramic veneer"}
        ],
        "correct_answer": None,
        "category": "ทันตกรรมประดิษฐ์",
        "task": "ขั้นตอนและวิธีการรักษา",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 22\n(ให้รูปในช่องปากและ x-ray มาเห็น 35 retained root) ปวดฟันด้านซ้ายล่าง ในช่องปากเห็น\nretained root เหงือกบวมรอบ ๆ บวม ๆ กดเหลวที่บริเวณ vestibule ด้านแก้ม ใบหน้าซ้ายบวมกว่า\nด้านขวาเล็กน้อย\n\n1. ถ้ารับคนไข้เป็นผู้ป่วยใน เขียนอะไร order for one day",
        "choices": [
            {"label": "ก", "text": "5% D/N/2 1000 ml"},
            {"label": "ข", "text": "Soft diet"},
            {"label": "ค", "text": "Amoxycillin 500 mg 1 cap PO tid"},
            {"label": "ง", "text": "Ibuprofen 400 mg 1 tab PO tid"},
            {"label": "จ", "text": "Routine oral care"}
        ],
        "correct_answer": None,
        "category": "ศัลยศาสตร์ช่องปาก",
        "task": "การจัดการและการรักษาผู้ป่วย",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 22\n(ให้รูปในช่องปากและ x-ray มาเห็น 35 retained root) ปวดฟันด้านซ้ายล่าง ในช่องปากเห็น\nretained root เหงือกบวมรอบ ๆ บวม ๆ กดเหลวที่บริเวณ vestibule ด้านแก้ม ใบหน้าซ้ายบวมกว่า\nด้านขวาเล็กน้อย\n\n2. ถอนฟันและdrainหนองออก พบเชื้อเป็น gram positive cocci จ่ายยาantibiotic อะไร",
        "choices": [
            {"label": "ก", "text": "Amoxicillin"},
            {"label": "ข", "text": "Metronidazole"}
        ],
        "correct_answer": None,
        "category": "ศัลยศาสตร์ช่องปาก",
        "task": "การจัดการและการรักษาผู้ป่วย",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 22\n(ให้รูปในช่องปากและ x-ray มาเห็น 35 retained root) ปวดฟันด้านซ้ายล่าง ในช่องปากเห็น\nretained root เหงือกบวมรอบ ๆ บวม ๆ กดเหลวที่บริเวณ vestibule ด้านแก้ม ใบหน้าซ้ายบวมกว่า\nด้านขวาเล็กน้อย\n\n3. หลังทำคนไข้เป็นลมหมดสติ ถามว่าต้องจับชีพจรตำแหน่งใดจะแม่นยำที่สุด (brachial, carotid, radial)",
        "choices": [],
        "correct_answer": None,
        "category": "ศัลยศาสตร์ช่องปาก",
        "task": "การวินิจฉัยโรค",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 23\nหญิง 55 ปี มีก้อนขึ้นตรงระหว่าง 31, 32 ขนาด 15*15*6 กดนิ่ม ไม่มีอาการ เวลากินหรือแปรงฟัน\nจะมีเลือดออก\n\n1. ถามว่าอะไรน่าจะเป็นสาเหตุ",
        "choices": [
            {"label": "ก", "text": "menopause"},
            {"label": "ข", "text": "gene mutation"},
            {"label": "ค", "text": "poor oral hygiene"},
            {"label": "ง", "text": "traumatic occlusion"}
        ],
        "correct_answer": None,
        "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
        "task": "การเกิดและการดำเนินโรค",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 23\nหญิง 55 ปี มีก้อนขึ้นตรงระหว่าง 31, 32 ขนาด 15*15*6 กดนิ่ม ไม่มีอาการ เวลากินหรือแปรงฟัน\nจะมีเลือดออก\n\n2. ผู้ป่วยแจ้งว่าชอบมีแผลในปากขนาดเล็ก ซึ่งชอบเปลี่ยนที่ไปเรื่อย ๆ ตรวจแล้วไม่เจอ local\ncontributing factor อื่นๆ ควรแนะนำให้ผู้ป่วยทานอะไรเพิ่มเติม",
        "choices": [
            {"label": "ก", "text": "Vit A"},
            {"label": "ข", "text": "Vit D"},
            {"label": "ค", "text": "Vit K"},
            {"label": "ง", "text": "Iodine"},
            {"label": "จ", "text": "Zinc"}
        ],
        "correct_answer": None,
        "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
        "task": "การจัดการและการรักษาผู้ป่วย",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 23\nหญิง 55 ปี มีก้อนขึ้นตรงระหว่าง 31, 32 ขนาด 15*15*6 กดนิ่ม ไม่มีอาการ เวลากินหรือแปรงฟัน\nจะมีเลือดออก\n\n3. หากต้องการตัดก้อน จะต้องจรวจอะไร",
        "choices": [
            {"label": "ก", "text": "cervical lymph node"},
            {"label": "ข", "text": "complete blood count"},
            {"label": "ค", "text": "ฐานของรอยโรค"},
            {"label": "ง", "text": "occlusion"},
            {"label": "จ", "text": "cross sectional occlusal film"}
        ],
        "correct_answer": None,
        "category": "ศัลยศาสตร์ช่องปาก",
        "task": "การวินิจฉัยโรค",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 24\nผู้ป่วยชายอายุ 50 ปี รูปให้มา ซี่ 21 ฟันแตก ไม่ปวด มีรูปฟิล์ม pa มา เป็น post หลุดและ\ninadequate root canal filling\n\n1. Dx.",
        "choices": [
            {"label": "ก", "text": "pulp necrosis with symptomatic apical periodontitis"},
            {"label": "ข", "text": "previously treated"},
            {"label": "ค", "text": "previously initiated therapy"}
        ],
        "correct_answer": None,
        "category": "วิทยาเอ็นโดดอนต์",
        "task": "การวินิจฉัยโรค",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 24\nผู้ป่วยชายอายุ 50 ปี รูปให้มา ซี่ 21 ฟันแตก ไม่ปวด มีรูปฟิล์ม pa มา เป็น post หลุดและ\ninadequate root canal filling\n\n2. RCT ใหม่เพราะอะไร",
        "choices": [
            {"label": "ก", "text": "สีเปลี่ยน"},
            {"label": "ข", "text": "ผุ"},
            {"label": "ค", "text": "แตก"},
            {"label": "ง", "text": "Poor adequated"},
            {"label": "จ", "text": "Deep bite"}
        ],
        "correct_answer": None,
        "category": "วิทยาเอ็นโดดอนต์",
        "task": "การวินิจฉัยโรค",
        "source_exam": "NL 2 2021 Part 3"
    },
    {
        "question_text": "Stem 24\nผู้ป่วยชายอายุ 50 ปี รูปให้มา ซี่ 21 ฟันแตก ไม่ปวด มีรูปฟิล์ม pa มา เป็น post หลุดและ\ninadequate root canal filling\n\n3. บูรณะหลัง RCT ด้วยอะไร",
        "choices": [
            {"label": "ก", "text": "PFM"},
            {"label": "ข", "text": "Prefabricated post"},
            {"label": "ค", "text": "Metal crown"},
            {"label": "ง", "text": "Veneer"}
        ],
        "correct_answer": None,
        "category": "ทันตกรรมประดิษฐ์",
        "task": "ขั้นตอนและวิธีการรักษา",
        "source_exam": "NL 2 2021 Part 3"
    }
]

output_data = {"questions": questions}

with open('/Users/admin/Downloads/NL Test/parsed_exams/NL_2_2021_Part_3.json', 'w', encoding='utf-8') as f:
    json.dump(output_data, f, ensure_ascii=False, indent=2)

print("JSON file successfully created.")
