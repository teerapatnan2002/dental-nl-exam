import json
import os

data = {
    "questions": [
        {
            "question_text": "น้องมีการเติบโตปกติตาม National standard ซัมติง ดูจากฟัน น้องอายุเท่าไหร่",
            "choices": [
                {"label": "A", "text": "6-7"},
                {"label": "B", "text": "8-9"},
                {"label": "C", "text": "10-11"},
                {"label": "D", "text": "11-12"},
                {"label": "E", "text": "…"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมสำหรับเด็ก",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ให้รูปเด็กหญิงเป็น cleft lip ซ้าย (ที่ผ่าแก้แล้ว) มา - มีฟันแท้ซี่ 16 12 11 21 26 36 33 32 31 41 42 46 - มีฟันน้ำนมซี่ 55 54 64 65 74 75 84 85 - missing 43 22",
            "proposition": None
        },
        {
            "question_text": "ฟันซี่ 22 หายไปเพราะอะไร",
            "choices": [
                {"label": "A", "text": "Cleft"},
                {"label": "B", "text": "…"},
                {"label": "C", "text": "…"},
                {"label": "D", "text": "…"},
                {"label": "E", "text": "…"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมสำหรับเด็ก",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ให้รูปเด็กหญิงเป็น cleft lip ซ้าย (ที่ผ่าแก้แล้ว) มา - มีฟันแท้ซี่ 16 12 11 21 26 36 33 32 31 41 42 46 - มีฟันน้ำนมซี่ 55 54 64 65 74 75 84 85 - missing 43 22",
            "proposition": None
        },
        {
            "question_text": "ทำอะไรต่อดี",
            "choices": [
                {"label": "A", "text": "Incisional biopsy"},
                {"label": "B", "text": "ย้อม DIF"},
                {"label": "C", "text": "10% KOH preparation"},
                {"label": "D", "text": "…"},
                {"label": "E", "text": "…"}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "คนไข้เพศหญิง อายุเท่าไหร่จำไม่ได้ เป็นโรคเบาหวาน มีรอยโรคสีขาวที่ vestibule ล่าง เช็ดไม่ออก ไม่มีอาการปวด มองแว้บแรกเหมือนไลเคน",
            "proposition": None
        },
        {
            "question_text": "ให้รูป histo มา เห็นพวก Pleomorphism, Hyperchromatic Nuclei invade เข้ามาในชั้น connective tissue final diag เป็นอะไรดี",
            "choices": [
                {"label": "A", "text": "Epithelial dysplasia"},
                {"label": "B", "text": "SCC"},
                {"label": "C", "text": "Lichen planus"},
                {"label": "D", "text": "PV"},
                {"label": "E", "text": "…"}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "คนไข้เพศหญิง อายุเท่าไหร่จำไม่ได้ เป็นโรคเบาหวาน มีรอยโรคสีขาวที่ vestibule ล่าง เช็ดไม่ออก ไม่มีอาการปวด มองแว้บแรกเหมือนไลเคน",
            "proposition": None
        },
        {
            "question_text": "ให้รูปลิ้นคนไข้มา มีคราบขาว ๆ ติดเต็มลิ้น เหมือน candida สุด แต่เช็ดออก แล้วไม่มีรอยแดงข้างใต้ ไม่มีอาการปวด ไม่แสบ ไม่อะไรเลย คิดว่าเป็นอะไร",
            "choices": [
                {"label": "A", "text": "Candida infection"},
                {"label": "B", "text": "Poor oral hygiene"},
                {"label": "C", "text": "Aging related"},
                {"label": "D", "text": "Torus palatinus"},
                {"label": "E", "text": "…"}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "คนไข้เพศหญิง อายุเท่าไหร่จำไม่ได้ เป็นโรคเบาหวาน มีรอยโรคสีขาวที่ vestibule ล่าง เช็ดไม่ออก ไม่มีอาการปวด มองแว้บแรกเหมือนไลเคน",
            "proposition": None
        },
        {
            "question_text": "สาเหตุที่เป็นไปได้มากที่สุด ทำให้เกิดภาวะเหงือกโตดังรูป",
            "choices": [
                {"label": "A", "text": "Dental plaque"},
                {"label": "B", "text": "Dental plaque, Simvastatin"},
                {"label": "C", "text": "Dental plaque, Amlodipine"},
                {"label": "D", "text": "Dental plaque, Aspirin"},
                {"label": "E", "text": "Dental plaque, Clopidogrel"}
            ],
            "correct_answer": None,
            "category": "ปริทันตวิทยา",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ผู้ป่วยหญิงอายุ 60 ปี มีโรคประจำตัว คือ MI,HT กินยา aspirin,clopidogrel,simvastatin,amlodipine ให้รูปมาเหงือกบวม ๆ เยิน ๆ",
            "proposition": None
        },
        {
            "question_text": "ถ้าฟันทุกซี่ที่เหลือเป็น hopeless ต้องวางแผนยังไง",
            "choices": [
                {"label": "A", "text": "รักษาโรคปริทันต์ > ถอนฟัน > ฟันเทียม"},
                {"label": "B", "text": "ปรึกษาแพทย์เรื่องการเปลี่ยนยาต้านการแข็งตัวของเลือด > ถอนฟัน > ฟันเทียม"},
                {"label": "C", "text": "ปรึกษาการเปลี่ยนยาที่ทำให้เหงือกบวม > ขูดหินปูน > gingivectomy"},
                {"label": "D", "text": "ถอนฟันล่างทั้งหมดก่อน > treatment denture"},
                {"label": "E", "text": "หยุดยา aspirin 5-7 วัน > ถอนฟัน > ฟันเทียม"}
            ],
            "correct_answer": None,
            "category": "ปริทันตวิทยา",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ผู้ป่วยหญิงอายุ 60 ปี มีโรคประจำตัว คือ MI,HT กินยา aspirin,clopidogrel,simvastatin,amlodipine ให้รูปมาเหงือกบวม ๆ เยิน ๆ",
            "proposition": None
        },
        {
            "question_text": "สิ่งสำคัญที่จะต้องระบุในใบปรึกษาแพทย์ประจำตัวเกี่ยวกับการควบคุม dual antiplatelet drug",
            "choices": [
                {"label": "A", "text": "อายุและเพศ"},
                {"label": "B", "text": "ระยะเวลาการทำหัตถการ"},
                {"label": "C", "text": "หัตถการที่จะทำ"},
                {"label": "D", "text": "เทคนิคการฉีดยาชาและปริมาณยาชา"},
                {"label": "E", "text": "ยาแก้ปวดที่จะใช้"}
            ],
            "correct_answer": None,
            "category": "ศัลยศาสตร์ช่องปาก",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ผู้ป่วยหญิงอายุ 60 ปี มีโรคประจำตัว คือ MI,HT กินยา aspirin,clopidogrel,simvastatin,amlodipine ให้รูปมาเหงือกบวม ๆ เยิน ๆ",
            "proposition": None
        },
        {
            "question_text": "รอยโรคของคนไข้ (Perio) อยู่ในขั้นใด",
            "choices": [
                {"label": "A", "text": "Established lesion"},
                {"label": "B", "text": "Initial lesion"},
                {"label": "C", "text": "Early lesion"},
                {"label": "D", "text": "Advanced lesion"},
                {"label": "E", "text": "Secondary lesion"}
            ],
            "correct_answer": None,
            "category": "ปริทันตวิทยา",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "คนไข้เพศหญิงอายุ 50 ปี เป็นโรคปริทันต์อักเสบ ให้ภาพช่องปากมา กับ PA full mouth มี bone loss",
            "proposition": None
        },
        {
            "question_text": "สาเหตุที่ mucosa คนไข้ดูเงาวาว glossy appearance คือ",
            "choices": [
                {"label": "A", "text": "Age related tissue thining"},
                {"label": "B", "text": "Candida"},
                {"label": "C", "text": "Iron deficiency"},
                {"label": "D", "text": "Dry mouth"},
                {"label": "E", "text": "Oral lichen planus"}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "คนไข้เพศหญิงอายุ 50 ปี เป็นโรคปริทันต์อักเสบ ให้ภาพช่องปากมา กับ PA full mouth มี bone loss",
            "proposition": None
        },
        {
            "question_text": "ให้อ่าน bone loss ซี่ 47 (มี bone loss เยอะๆ เกือบถึงปลายราก)",
            "choices": [
                {"label": "A", "text": "Hori <50% with intact lamina dura"},
                {"label": "B", "text": "Hori<70% with absent alveolar lamina dura"},
                {"label": "C", "text": "…"},
                {"label": "D", "text": "…"},
                {"label": "E", "text": "…"}
            ],
            "correct_answer": None,
            "category": "ปริทันตวิทยา",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "คนไข้เพศหญิงอายุ 50 ปี เป็นโรคปริทันต์อักเสบ ให้ภาพช่องปากมา กับ PA full mouth มี bone loss",
            "proposition": None
        },
        {
            "question_text": "น่าจะติดเชื้อ space ไหน",
            "choices": [
                {"label": "A", "text": "submasseteric space"},
                {"label": "B", "text": "pterygomandibular space"},
                {"label": "C", "text": "submandibular space"},
                {"label": "D", "text": "Sublingual"},
                {"label": "E", "text": "Sup temp"}
            ],
            "correct_answer": None,
            "category": "ศัลยศาสตร์ช่องปาก",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "คนไข้หญิง โตแล้ว ปวดฟันกรามคุดล่างซ้ายมา 3 วัน อ้าปากได้น้อยมาก ประมาณ 5 cm. ให้ OPG : มาเป็น canine impaction ทั้ง 2 ข้าง ลูกศรชี้ซี่ 22 ที่ใน film torsi มากเห็นแหลม ๆ มี 63 ยังอยู่ในฟิล์มด้วย",
            "proposition": None
        },
        {
            "question_text": "ถามลูกศรชี้ซี่ไหน ลูกศรชี้อะไร (ชี้ที่ฟัน TV area 22)",
            "choices": [
                {"label": "A", "text": "ซี่ 22"},
                {"label": "B", "text": "ซี่ 23"},
                {"label": "C", "text": "ซี่ 63"},
                {"label": "D", "text": "Supernumerary tooth"},
                {"label": "E", "text": "Turner's tooth"}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "คนไข้หญิง โตแล้ว ปวดฟันกรามคุดล่างซ้ายมา 3 วัน อ้าปากได้น้อยมาก ประมาณ 5 cm. ให้ OPG : มาเป็น canine impaction ทั้ง 2 ข้าง ลูกศรชี้ซี่ 22 ที่ใน film torsi มากเห็นแหลม ๆ มี 63 ยังอยู่ในฟิล์มด้วย",
            "proposition": None
        },
        {
            "question_text": "ถ้าจะรักษาภายใต้ GA การตรวจแลปอะไรสำคัญที่สุด",
            "choices": [
                {"label": "A", "text": "Electrolyte"},
                {"label": "B", "text": "CBC"},
                {"label": "C", "text": "liver function test"},
                {"label": "D", "text": "Coagulogram"},
                {"label": "E", "text": "EKG"}
            ],
            "correct_answer": None,
            "category": "ศัลยศาสตร์ช่องปาก",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "คนไข้หญิง โตแล้ว ปวดฟันกรามคุดล่างซ้ายมา 3 วัน อ้าปากได้น้อยมาก ประมาณ 5 cm. ให้ OPG : มาเป็น canine impaction ทั้ง 2 ข้าง ลูกศรชี้ซี่ 22 ที่ใน film torsi มากเห็นแหลม ๆ มี 63 ยังอยู่ในฟิล์มด้วย",
            "proposition": None
        },
        {
            "question_text": "รอยโรคในภาพ (epulis fissuratum) เกิดจากอะไร",
            "choices": [
                {"label": "A", "text": "ขอบฟันปลอม”สั้น”และขยับ"},
                {"label": "B", "text": "เคี้ยวฟันปลอมข้างเดียว"},
                {"label": "C", "text": "ใส่ฟันปลอมนอน"},
                {"label": "D", "text": "ไม่มีช้อยส์ขอบยาว ไม่มีช้อยส์ irritation"},
                {"label": "E", "text": "…"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมประดิษฐ์",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ให้ภาพคนไข้อายุ 60 ปี ใส่ UCD และฟันล่างเหลือแต่ lower anterior teeth (ไม่มีรูปฟันปลอมล่างให้ว่างทำเป็นอะไร) มี Epulis fissuratum บริเวณ ขอบฟันปลอม Q2 ติด flange",
            "proposition": None
        },
        {
            "question_text": "รักษารอยโรคในภาพ (epulis fissuratum) ยังไง",
            "choices": [
                {"label": "A", "text": "Surgical removal"},
                {"label": "B", "text": "ทา tissue conditioner"},
                {"label": "C", "text": "…"},
                {"label": "D", "text": "…"},
                {"label": "E", "text": "…"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมประดิษฐ์",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ให้ภาพคนไข้อายุ 60 ปี ใส่ UCD และฟันล่างเหลือแต่ lower anterior teeth (ไม่มีรูปฟันปลอมล่างให้ว่างทำเป็นอะไร) มี Epulis fissuratum บริเวณ ขอบฟันปลอม Q2 ติด flange",
            "proposition": None
        },
        {
            "question_text": "ให้รูปฟันปลอมหักบริเวณฐานฟันปลอม Q2 และมีร่องรอยการซ่อมมาแล้ว ถามว่า สาเหตุที่เป็นไปได้ของการหักฟันปลอมคนไข้รายนี้คืออะไร",
            "choices": [
                {"label": "A", "text": "ฐานฟันปลอมบางไป"},
                {"label": "B", "text": "คนไข้สบแรงมากไป"},
                {"label": "C", "text": "แช่ฟันปลอมในน้ำยาฆ่าเชื้อนานเกินไป"},
                {"label": "D", "text": "เว้าหลบส่วน frenum มากเกินไป"},
                {"label": "E", "text": "…"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมประดิษฐ์",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ให้ภาพคนไข้อายุ 60 ปี ใส่ UCD และฟันล่างเหลือแต่ lower anterior teeth (ไม่มีรูปฟันปลอมล่างให้ว่างทำเป็นอะไร) มี Epulis fissuratum บริเวณ ขอบฟันปลอม Q2 ติด flange",
            "proposition": None
        },
        {
            "question_text": "คนทำฟันไป หลังฉีดยาชา คนไข้กระสับกระส่าย เหงื่อออก หัวใจเต้นเร็ว ความดันสูง เป็นไข้ pr กว้าง เป็นอะไร",
            "choices": [
                {"label": "A", "text": "Adrenal insufficience"},
                {"label": "B", "text": "Thyroid crisis"},
                {"label": "C", "text": "Allergic to local anesthesia"},
                {"label": "D", "text": "MI"},
                {"label": "E", "text": "Pulseless electrical activity (PEA)"}
            ],
            "correct_answer": None,
            "category": "ศัลยศาสตร์ช่องปาก",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "คนไข้เพศหญิงอายุ 50 ปี เป็นgrave’s disease แต่ไม่ได้รับการรักษาอย่างต่อเนื่อง กลัวการทำฟัน",
            "proposition": None
        },
        {
            "question_text": "Treatment อะไรอย่างแรก",
            "choices": [
                {"label": "A", "text": "Treatment denture"},
                {"label": "B", "text": "Periodontal treatment"},
                {"label": "C", "text": "Tooth modification"},
                {"label": "D", "text": "Complete filling"},
                {"label": "E", "text": "Crown"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมประดิษฐ์",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "คนไข้เพศหญิงอายุ 50 ปี เป็นgrave’s disease แต่ไม่ได้รับการรักษาอย่างต่อเนื่อง กลัวการทำฟัน",
            "proposition": None
        },
        {
            "question_text": "รอยน้ำตาล (แอบค่อนข้างดำ) แบนๆที่ B mucosa บริเวณฟันหน้าล่างคืออะไร",
            "choices": [
                {"label": "A", "text": "melanoma"},
                {"label": "B", "text": "melanotic macule"},
                {"label": "C", "text": "melanoplakia"},
                {"label": "D", "text": "hermangioma"},
                {"label": "E", "text": "AF tattoo"}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "คนไข้เพศหญิงอายุ 50 ปี เป็นgrave’s disease แต่ไม่ได้รับการรักษาอย่างต่อเนื่อง กลัวการทำฟัน",
            "proposition": None
        },
        {
            "question_text": "จ่ายยาอะไร",
            "choices": [
                {"label": "A", "text": "Amoxicillin"},
                {"label": "B", "text": "Cephalexin"},
                {"label": "C", "text": "Amoxi-clav"},
                {"label": "D", "text": "Penicillin"},
                {"label": "E", "text": "Clindamycin"}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ผู้ป่วยชายอายุ 60 ปี เป็นโรคไตเรื้อรังต้องฟอกไตทุกวัน ให้ภาพในช่องปากมา เหลือฟันซี่ 15 14 13 23 35 34 33 32 31 41 42 43 44",
            "proposition": None
        },
        {
            "question_text": "ถ้ายังไม่อยากถอนฟันจะใส่ฟันปลอมอะไรไปก่อน",
            "choices": [
                {"label": "A", "text": "Treatment denture"},
                {"label": "B", "text": "Immediate denture"},
                {"label": "C", "text": "Transition denture"},
                {"label": "D", "text": "Overdenture"},
                {"label": "E", "text": "MRPD"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมประดิษฐ์",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ผู้ป่วยชายอายุ 60 ปี เป็นโรคไตเรื้อรังต้องฟอกไตทุกวัน ให้ภาพในช่องปากมา เหลือฟันซี่ 15 14 13 23 35 34 33 32 31 41 42 43 44",
            "proposition": None
        },
        {
            "question_text": "จะรื้อวัสดุสักอย่างละตกลงคอ ระหว่างพยายามเอาออกคนไข้หมดสติ คลำแล้วไม่เจอชีพจร จะทำไรต่อ",
            "choices": [
                {"label": "A", "text": "Chest compression"},
                {"label": "B", "text": "เปิด airway head tilt chin lift"},
                {"label": "C", "text": "Heimlich maneuver"},
                {"label": "D", "text": "โทร 1669"},
                {"label": "E", "text": "…"}
            ],
            "correct_answer": None,
            "category": "ศัลยศาสตร์ช่องปาก",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ผู้ป่วยชายอายุ 60 ปี เป็นโรคไตเรื้อรังต้องฟอกไตทุกวัน ให้ภาพในช่องปากมา เหลือฟันซี่ 15 14 13 23 35 34 33 32 31 41 42 43 44",
            "proposition": None
        },
        {
            "question_text": "ข้อควรระวังในการทำ CD/RPD",
            "choices": [
                {"label": "A", "text": "ขนาดซี่ฟันปลอมไม่สัมพันธ์กับฟันคนไข้"},
                {"label": "B", "text": "สีฟันปลอมไม่สัมพันธ์"},
                {"label": "C", "text": "visibility ของฟันปลอมไม่สัมพันธ์"},
                {"label": "D", "text": "ขนาดพื้นที่รองรับ"},
                {"label": "E", "text": "สิ่งรองรับที่ต่างกันระหว่างฟันเทียมทั้งปากกับฟันเทียมบางส่วน"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมประดิษฐ์",
            "task": "ขั้นตอนและวิธีการรักษา",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ผู้ป่วยหญิงอายุ 60 ปี มาตรวจสุขภาพช่องปาก CF : maxillary arch เป็น edentulous area, arch ล่างไม่มีซี่ 36,46,47 ฟันหน้าล่างเป็น cupping erosion มีรูปฟันปลอมบนมา",
            "proposition": None
        },
        {
            "question_text": "ตำแหน่งอ้างอิงในการหาความสูง maxillary occlusal rim",
            "choices": [
                {"label": "A", "text": "rugae"},
                {"label": "B", "text": "commissure of mouth"},
                {"label": "C", "text": "palatine fovea"},
                {"label": "D", "text": "tuberosity"},
                {"label": "E", "text": "ala-tragus line"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมประดิษฐ์",
            "task": "ขั้นตอนและวิธีการรักษา",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ผู้ป่วยหญิงอายุ 60 ปี มาตรวจสุขภาพช่องปาก CF : maxillary arch เป็น edentulous area, arch ล่างไม่มีซี่ 36,46,47 ฟันหน้าล่างเป็น cupping erosion มีรูปฟันปลอมบนมา",
            "proposition": None
        },
        {
            "question_text": "ฟันหน้าล่างสึกด้าน incisal edge ควรซักอะไรเพิ่ม",
            "choices": [
                {"label": "A", "text": "การแปรงฟัน"},
                {"label": "B", "text": "การทานอาหารเปรี้ยว"},
                {"label": "C", "text": "การนอนกัดฟัน"},
                {"label": "D", "text": "การเคี้ยวอาหารเหนียว"},
                {"label": "E", "text": "การกัดฟันตอนกลางวัน"}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ผู้ป่วยหญิงอายุ 60 ปี มาตรวจสุขภาพช่องปาก CF : maxillary arch เป็น edentulous area, arch ล่างไม่มีซี่ 36,46,47 ฟันหน้าล่างเป็น cupping erosion มีรูปฟันปลอมบนมา",
            "proposition": None
        },
        {
            "question_text": "จะใช้อะไรในการรักษาฟันซี่ 85",
            "choices": [
                {"label": "A", "text": "Direct composite filling"},
                {"label": "B", "text": "File + ZOE"},
                {"label": "C", "text": "universal forcep 151s"},
                {"label": "D", "text": "38% SDF"},
                {"label": "E", "text": "File + calcium"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมสำหรับเด็ก",
            "task": "ขั้นตอนและวิธีการรักษา",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "เด็กอายุ 8 ปีให้รูปในช่องปากกับ pa มา - PA ซี่ 85 ผุใหญ่จาก occlusal ใกล้ pulp ดูไม่ชัดว่าถึง pulp chamber มั้ย แต่ข้างล่างไปมี lesion ที่ furcation แล้ว ยังมี bone กั้นระหว่าง lesion กับหน่อฟันแท้อยู่ รากแทบไม่ละลาย - รูปในปาก 85 ผุใหญ่ ประมาณครึ่งซี่ (กึ่งๆไม่ ICDAS 5 ก็ 6) 36 สภาพดูดีมาก นี่มองไม่เห็น lesion ไรเลย (อาจจาไม่เห็นเอง) แต่เพื่อนบางคนเหมือนจะเห็น white lesion",
            "proposition": None
        },
        {
            "question_text": "ถาม ICDAS ซี่ 85 กับ 36",
            "choices": [
                {"label": "A", "text": "ICDAS 1,4"},
                {"label": "B", "text": "ICDAS 1,6"},
                {"label": "C", "text": "ICDAS 2,4"},
                {"label": "D", "text": "ICDAS 2,5"},
                {"label": "E", "text": "ICDAS 2,6"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมสำหรับเด็ก",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "เด็กอายุ 8 ปีให้รูปในช่องปากกับ pa มา - PA ซี่ 85 ผุใหญ่จาก occlusal ใกล้ pulp ดูไม่ชัดว่าถึง pulp chamber มั้ย แต่ข้างล่างไปมี lesion ที่ furcation แล้ว ยังมี bone กั้นระหว่าง lesion กับหน่อฟันแท้อยู่ รากแทบไม่ละลาย - รูปในปาก 85 ผุใหญ่ ประมาณครึ่งซี่ (กึ่งๆไม่ ICDAS 5 ก็ 6) 36 สภาพดูดีมาก นี่มองไม่เห็น lesion ไรเลย (อาจจาไม่เห็นเอง) แต่เพื่อนบางคนเหมือนจะเห็น white lesion",
            "proposition": None
        },
        {
            "question_text": "ปัญหาของ Lower arch แก้ด้วย",
            "choices": [
                {"label": "A", "text": "Space regainer with distalization screw"},
                {"label": "B", "text": "Lower lingual holder arch"},
                {"label": "C", "text": "2x4 fix"},
                {"label": "D", "text": "…"},
                {"label": "E", "text": "…"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมสำหรับเด็ก",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "เด็กอายุ 8 ปีให้รูปในช่องปากกับ pa มา - PA ซี่ 85 ผุใหญ่จาก occlusal ใกล้ pulp ดูไม่ชัดว่าถึง pulp chamber มั้ย แต่ข้างล่างไปมี lesion ที่ furcation แล้ว ยังมี bone กั้นระหว่าง lesion กับหน่อฟันแท้อยู่ รากแทบไม่ละลาย - รูปในปาก 85 ผุใหญ่ ประมาณครึ่งซี่ (กึ่งๆไม่ ICDAS 5 ก็ 6) 36 สภาพดูดีมาก นี่มองไม่เห็น lesion ไรเลย (อาจจาไม่เห็นเอง) แต่เพื่อนบางคนเหมือนจะเห็น white lesion",
            "proposition": None
        },
        {
            "question_text": "ฟันซี่ 46 โยกระดับ 2 PD > 7 mm prognosis ซี่ 46 คือ",
            "choices": [
                {"label": "A", "text": "Fair"},
                {"label": "B", "text": "Poor"},
                {"label": "C", "text": "Questionable"},
                {"label": "D", "text": "Hopeless"},
                {"label": "E", "text": "Unfavorable"}
            ],
            "correct_answer": None,
            "category": "ปริทันตวิทยา",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ผู้ป่วยชาย 50 ปี ปวดซี่ 46 เคี้ยวอาหารลำบาก พบมี PD > 7 mm, mobility 2,2 รูป intraoral, full mouth PA, pano ผู้ป่วยมีอาการเคี้ยวเจ็บซี่ 46 ให้รูปในช่องปากกับฟิล์ม VBW ในฟิล์มเห็น 46,47 ล้ม แล้ว 46 D root bone loss แทบจะถึงปลายราก",
            "proposition": None
        },
        {
            "question_text": "ถามว่า bone loss เท่าไหร่ในซี่ 45 (45 ดู vertical bone loss ด้าน mesial เกือบถึงปลายราก ด้าน distal horizontal bone loss <25%)",
            "choices": [
                {"label": "A", "text": "vertical bone loss < 70%"},
                {"label": "B", "text": "horizontal bone loss < 70%"},
                {"label": "C", "text": "Vertical bone loss >70%"},
                {"label": "D", "text": "Horizontal bone >50%"},
                {"label": "E", "text": "…"}
            ],
            "correct_answer": None,
            "category": "ปริทันตวิทยา",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ผู้ป่วยชาย 50 ปี ปวดซี่ 46 เคี้ยวอาหารลำบาก พบมี PD > 7 mm, mobility 2,2 รูป intraoral, full mouth PA, pano ผู้ป่วยมีอาการเคี้ยวเจ็บซี่ 46 ให้รูปในช่องปากกับฟิล์ม VBW ในฟิล์มเห็น 46,47 ล้ม แล้ว 46 D root bone loss แทบจะถึงปลายราก",
            "proposition": None
        },
        {
            "question_text": "เชค premature contact?",
            "choices": [
                {"label": "A", "text": "Shimstock"},
                {"label": "B", "text": "Aluwax"},
                {"label": "C", "text": "Occlusal indicator wax"},
                {"label": "D", "text": "Pink wax"},
                {"label": "E", "text": "…"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ผู้ป่วยชาย 50 ปี ปวดซี่ 46 เคี้ยวอาหารลำบาก พบมี PD > 7 mm, mobility 2,2 รูป intraoral, full mouth PA, pano ผู้ป่วยมีอาการเคี้ยวเจ็บซี่ 46 ให้รูปในช่องปากกับฟิล์ม VBW ในฟิล์มเห็น 46,47 ล้ม แล้ว 46 D root bone loss แทบจะถึงปลายราก",
            "proposition": None
        },
        {
            "question_text": "เดือนที่ควรถอนฟันคือเดือนอะไร",
            "choices": [
                {"label": "A", "text": "มกราคม"},
                {"label": "B", "text": "กุมภาพันธ์"},
                {"label": "C", "text": "มีนาคม"},
                {"label": "D", "text": "พฤษภาคม"},
                {"label": "E", "text": "มิถุนายน"}
            ],
            "correct_answer": None,
            "category": "ศัลยศาสตร์ช่องปาก",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "หญิงอายุ 80 ปี เป็นโรค osteoporosis ฉีดยาทุก 6 เดือนมา 3 ปี ฉีดล่าสุดเดือนมกราคม ให้รูปรอยโรค white plaque สีขาวปนแดงบริเวณ vestibule ที่ฟันหน้าล่าง ไม่มีอาการใด ๆ",
            "proposition": None
        },
        {
            "question_text": "ส่งตรวจอะไรเพิ่มเติม",
            "choices": [
                {"label": "A", "text": "KOH"},
                {"label": "B", "text": "Incision biopsy"},
                {"label": "C", "text": "Culture test"},
                {"label": "D", "text": "Nikolsky’s test"},
                {"label": "E", "text": "Diascopy"}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "หญิงอายุ 80 ปี เป็นโรค osteoporosis ฉีดยาทุก 6 เดือนมา 3 ปี ฉีดล่าสุดเดือนมกราคม ให้รูปรอยโรค white plaque สีขาวปนแดงบริเวณ vestibule ที่ฟันหน้าล่าง ไม่มีอาการใด ๆ",
            "proposition": None
        },
        {
            "question_text": "ให้รูป patho มา definitive diag ว่าเป็นอะไร",
            "choices": [
                {"label": "A", "text": "OSCC"},
                {"label": "B", "text": "Lichen planus"},
                {"label": "C", "text": "Epithelial dysplasia"},
                {"label": "D", "text": "Hairy leukoplakia"},
                {"label": "E", "text": "Hyperplastic leukoplakia"}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "หญิงอายุ 80 ปี เป็นโรค osteoporosis ฉีดยาทุก 6 เดือนมา 3 ปี ฉีดล่าสุดเดือนมกราคม ให้รูปรอยโรค white plaque สีขาวปนแดงบริเวณ vestibule ที่ฟันหน้าล่าง ไม่มีอาการใด ๆ",
            "proposition": None
        },
        {
            "question_text": "จากภาพ คิดว่าค่าในแนว Ant-post และ vertical ไหนผิดปกติ ( ช้อยเป็น SNA,SNB,ANB,WITTS…. อะไรพวกนี้สลับๆกัน)",
            "choices": [
                {"label": "A", "text": "SNA, SNB, ANB, Wits (ช้อยเดียวที่มี ANB)"},
                {"label": "B", "text": "SNB, SN-GN, FMA, Wits"},
                {"label": "C", "text": "SNB, SN-GN, FMA, สักอย่างชื่อยาวๆ (ช้อยเดียวที่มีอันนี้แล้วไม่มี Wits)"},
                {"label": "D", "text": "SNA, SN-GN, FMA, Wits"},
                {"label": "E", "text": "…"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมจัดฟัน",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ให้ภาพสบฟันแบบ pseudo ClassIII มีสองภาพ ภาพกัดปกติเป็น anterior crossbite กับภาพ retruded contact position เป็น edge to edge เด็กญ อายุ 13 ปี มีเสียงคลิกทั้ง2ข้าง ไม่มีอาการปวดข้อต่อขากรรไกรและกล้ามเนื้อ",
            "proposition": None
        },
        {
            "question_text": "สาเหตุ clicking sound น่าจะมาจากอะไร",
            "choices": [
                {"label": "A", "text": "Slide in centric"},
                {"label": "B", "text": "Anterior crossbite"},
                {"label": "C", "text": "Protrusive interference"},
                {"label": "D", "text": "Mixed dentition"},
                {"label": "E", "text": "…"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ให้ภาพสบฟันแบบ pseudo ClassIII มีสองภาพ ภาพกัดปกติเป็น anterior crossbite กับภาพ retruded contact position เป็น edge to edge เด็กญ อายุ 13 ปี มีเสียงคลิกทั้ง2ข้าง ไม่มีอาการปวดข้อต่อขากรรไกรและกล้ามเนื้อ",
            "proposition": None
        },
        {
            "question_text": "จะdiag เสียง ต้องส่งตรวจอะไรเพิ่มเติม",
            "choices": [
                {"label": "A", "text": "MRI"},
                {"label": "B", "text": "CBCT"},
                {"label": "C", "text": "lateral transcranial radiograph"},
                {"label": "D", "text": "…"},
                {"label": "E", "text": "…"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ให้ภาพสบฟันแบบ pseudo ClassIII มีสองภาพ ภาพกัดปกติเป็น anterior crossbite กับภาพ retruded contact position เป็น edge to edge เด็กญ อายุ 13 ปี มีเสียงคลิกทั้ง2ข้าง ไม่มีอาการปวดข้อต่อขากรรไกรและกล้ามเนื้อ",
            "proposition": None
        },
        {
            "question_text": "ถ้าเจอก่อนถอนฟันจะตรวจอะไรเพิ่ม",
            "choices": [
                {"label": "A", "text": "Dx splint"},
                {"label": "B", "text": "TMJ and Masticatory exam"},
                {"label": "C", "text": "CBCT"},
                {"label": "D", "text": "Psychi"},
                {"label": "E", "text": "…"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ผู้ป่วยชาย ปวดกราม 2 ข้าม เคยปวดหัวปวดฟันบน โดนถอนฟันไปแล้วไม่หายปวด",
            "proposition": None
        },
        {
            "question_text": "ผู้ป่วยมีอาการปวดจากอะไร",
            "choices": [
                {"label": "A", "text": "Muscle fibrosis"},
                {"label": "B", "text": "Muscle overuse"},
                {"label": "C", "text": "Muscle atrophy"},
                {"label": "D", "text": "Muscle inflammation"},
                {"label": "E", "text": "…"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ผู้ป่วยชาย ปวดกราม 2 ข้าม เคยปวดหัวปวดฟันบน โดนถอนฟันไปแล้วไม่หายปวด",
            "proposition": None
        },
        {
            "question_text": "น่าจะเป็นโรคอะไร",
            "choices": [
                {"label": "A", "text": "Cleidocranial dysplasia"},
                {"label": "B", "text": "Gardner syndrome"},
                {"label": "C", "text": "Ectodermal dysplasia"},
                {"label": "D", "text": "Hemifacial microsomia"},
                {"label": "E", "text": "Apert syndrome"}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "เด็กอายุ 15 ฟันน้ำนมเหลือเพียบ แต่ดูฟันเรียงสวยดีนะ Q3 หายไปซี่นึงแถว premolar",
            "proposition": None
        },
        {
            "question_text": "หากจะวางแผนการรักษาทางทันตกรรมจัดฟันควรส่งถ่ายภาพรังสีใด",
            "choices": [
                {"label": "A", "text": "Periapical full mouth"},
                {"label": "B", "text": "Lateral cephalogram, Periapical full mouth, Panoramic radiograph"},
                {"label": "C", "text": "Panoramic, Lateral cephalogram"},
                {"label": "D", "text": "Bitewing, Periapical full mouth"},
                {"label": "E", "text": "…"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมจัดฟัน",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "เด็กอายุ 15 ฟันน้ำนมเหลือเพียบ แต่ดูฟันเรียงสวยดีนะ Q3 หายไปซี่นึงแถว premolar",
            "proposition": None
        },
        {
            "question_text": "ถ้าผู้ป่วยไม่จัดฟันในผู้ป่วยรายนี้ควรจะบูรณะด้วยอะไรถึงเหมาะสมที่สุด",
            "choices": [
                {"label": "A", "text": "Bridge"},
                {"label": "B", "text": "Removable denture"},
                {"label": "C", "text": "Implant"},
                {"label": "D", "text": "fixed ortho denture"},
                {"label": "E", "text": "resin bond bridge"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมประดิษฐ์",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "เด็กอายุ 15 ฟันน้ำนมเหลือเพียบ แต่ดูฟันเรียงสวยดีนะ Q3 หายไปซี่นึงแถว premolar",
            "proposition": None
        },
        {
            "question_text": "ฟันเปลี่ยนสีจากอะไร",
            "choices": [
                {"label": "A", "text": "Pulp necrosis and pulp hemorrhage"},
                {"label": "B", "text": "Internal root resorption"},
                {"label": "C", "text": "Pulp obliteration"},
                {"label": "D", "text": "Secondary dentin"},
                {"label": "E", "text": "Tetracycline"}
            ],
            "correct_answer": None,
            "category": "วิทยาเอ็นโดดอนต์",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ผู้ป่วยหญิงอายุ 25 ปีเคยล้มเมื่อ10ปีก่อน แล้วจัดฟันมา 2 ปีถอดเหล็กเห็นอีกที43เปลี่ยนสี สีเทาเข้ม ตรวจeptเป็นลบ เคาะคลำไม่เจ็บ ภาพรังสีมีรอยโรคปลายราก canal ดูไม่ตีบตัน ฟันเปลี่ยนสี -ve EPT -ve to percussion and palpation",
            "proposition": None
        },
        {
            "question_text": "Dx pulp กับ peri",
            "choices": [
                {"label": "A", "text": "Traumatic injury with external root resorption"},
                {"label": "B", "text": "Traumatic injury with asymptomatic apical periodontitis"},
                {"label": "C", "text": "Traumatic injury with symptomatic apical periodontitis"},
                {"label": "D", "text": "Pulp necrosis with asymptomatic apical periodontitis"},
                {"label": "E", "text": "Pulp necrosis with symptomatic apical periodontitis"}
            ],
            "correct_answer": None,
            "category": "วิทยาเอ็นโดดอนต์",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ผู้ป่วยหญิงอายุ 25 ปีเคยล้มเมื่อ10ปีก่อน แล้วจัดฟันมา 2 ปีถอดเหล็กเห็นอีกที43เปลี่ยนสี สีเทาเข้ม ตรวจeptเป็นลบ เคาะคลำไม่เจ็บ ภาพรังสีมีรอยโรคปลายราก canal ดูไม่ตีบตัน ฟันเปลี่ยนสี -ve EPT -ve to percussion and palpation",
            "proposition": None
        },
        {
            "question_text": "รักษายังไง",
            "choices": [
                {"label": "A", "text": "Internal bleaching+CF"},
                {"label": "B", "text": "Extranal bleaching+CF"},
                {"label": "C", "text": "Ceramic veneer"},
                {"label": "D", "text": "Fiber post crown"},
                {"label": "E", "text": "Cast post crown"}
            ],
            "correct_answer": None,
            "category": "วิทยาเอ็นโดดอนต์",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ผู้ป่วยหญิงอายุ 25 ปีเคยล้มเมื่อ10ปีก่อน แล้วจัดฟันมา 2 ปีถอดเหล็กเห็นอีกที43เปลี่ยนสี สีเทาเข้ม ตรวจeptเป็นลบ เคาะคลำไม่เจ็บ ภาพรังสีมีรอยโรคปลายราก canal ดูไม่ตีบตัน ฟันเปลี่ยนสี -ve EPT -ve to percussion and palpation",
            "proposition": None
        },
        {
            "question_text": "หลังจาก initial treat ไป PD เหลือ 5mm ต้องทำไรต่อ",
            "choices": [
                {"label": "A", "text": "ปลูกกระดูก"},
                {"label": "B", "text": "Open flap debridement"},
                {"label": "C", "text": "OHI, F/U ล้าง chx + xray ดูทุก 3 เดือน"},
                {"label": "D", "text": "OHI, F/U ตรวจ+ขูดทุก 3-4 เดือน"},
                {"label": "E", "text": "OHI, F/U ดูทุก 6 เดือน"}
            ],
            "correct_answer": None,
            "category": "ปริทันตวิทยา",
            "task": "ขั้นตอนและวิธีการรักษา",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ผู้ป่วยชาย 50 ปี implant 22 มี PD 6 mm มี BOP มีประวัติรักษาปริทันต์อักเสบ ปักมา 3 ปี",
            "proposition": None
        },
        {
            "question_text": "เกิดไรขึ้นใน pocket",
            "choices": [
                {"label": "A", "text": "PMN ลด, RANKL ลด"},
                {"label": "B", "text": "Vascular proliferation ลด, TIMP ลด"},
                {"label": "C", "text": "Osteoclast function เพิ่ม, IL-1 เพิ่ม"},
                {"label": "D", "text": "Osteoblast เพิ่ม, MMP-8 เพิ่ม"},
                {"label": "E", "text": "vascular proliferation function เพิ่มขึ้น, OPG เพิ่มขึ้น"}
            ],
            "correct_answer": None,
            "category": "ปริทันตวิทยา",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ผู้ป่วยชาย 50 ปี implant 22 มี PD 6 mm มี BOP มีประวัติรักษาปริทันต์อักเสบ ปักมา 3 ปี",
            "proposition": None
        },
        {
            "question_text": "ให้ภาพ ตุ่มสีชมพูที่ palate",
            "choices": [
                {"label": "A", "text": "Papule"},
                {"label": "B", "text": "Plaque"},
                {"label": "C", "text": "Nodule"},
                {"label": "D", "text": "Ulcer"},
                {"label": "E", "text": "Vesicle"}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ผู้ป่วยชาย 50 ปี implant 22 มี PD 6 mm มี BOP มีประวัติรักษาปริทันต์อักเสบ ปักมา 3 ปี",
            "proposition": None
        },
        {
            "question_text": "ถ้าคนไข้ยังไม่สะดวกถอนฟัน จะทำฟันปลอมแบบใด",
            "choices": [
                {"label": "A", "text": "overdenture"},
                {"label": "B", "text": "transitional denture"},
                {"label": "C", "text": "MRPD"},
                {"label": "D", "text": "Bridge"},
                {"label": "E", "text": "Fix crown"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมประดิษฐ์",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ผู้ป่วยชายไทยอายุ 60 ปี ฟอกไตเป็นประจำ โรคประจำตัวเยอะแต่ที่ถามไม่ได้เกี่ยวข้องเลย เหลือฟันบนประมาณ 4-5 ซี่ ไม่มี rr มาด้วยเรื่องฟันโยก ไม่สามารถเคี้ยวอาหารได้ มีประวัติกำลังรักษาฟอกไตผ่านทางหน้าท้อง (peritoneal dialysis) ทุกวัน มีรูปคลินิกกับพาโนมาให้ - arch บน ฟันเหลือประมาณ 7 ซี่ไม่ติดกัน มี bone loss เยอะ จากฟิล์มดูเป็น hopeless ทุกซี่ บางซี่เป็น floating in the air แล้ว - arch ล่าง เหลือฟันประมาณ 11 ซี่ได้ มี bone loss แต่ส่วนใหญ่ moderate",
            "proposition": None
        },
        {
            "question_text": "พิมพ์ปากแล้ว alginate ลงคอสำลัก เอา alginate ออกมาแล้วคนไข้หมดสติ คลำชีพจรไม่ได้ ทำอะไรเป็นอันดับแรก",
            "choices": [
                {"label": "A", "text": "head tilt chin lift"},
                {"label": "B", "text": "back blow"},
                {"label": "C", "text": "chest compression"},
                {"label": "D", "text": "Heimlich maneuver"},
                {"label": "E", "text": "ใส่ท่อช่วยหายใจ"}
            ],
            "correct_answer": None,
            "category": "ศัลยศาสตร์ช่องปาก",
            "task": "ขั้นตอนและวิธีการรักษา",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ผู้ป่วยชายไทยอายุ 60 ปี ฟอกไตเป็นประจำ โรคประจำตัวเยอะแต่ที่ถามไม่ได้เกี่ยวข้องเลย เหลือฟันบนประมาณ 4-5 ซี่ ไม่มี rr มาด้วยเรื่องฟันโยก ไม่สามารถเคี้ยวอาหารได้ มีประวัติกำลังรักษาฟอกไตผ่านทางหน้าท้อง (peritoneal dialysis) ทุกวัน มีรูปคลินิกกับพาโนมาให้ - arch บน ฟันเหลือประมาณ 7 ซี่ไม่ติดกัน มี bone loss เยอะ จากฟิล์มดูเป็น hopeless ทุกซี่ บางซี่เป็น floating in the air แล้ว - arch ล่าง เหลือฟันประมาณ 11 ซี่ได้ มี bone loss แต่ส่วนใหญ่ moderate",
            "proposition": None
        },
        {
            "question_text": "ถอนฟันซี่ 14 ผุใหญ่ สองวันต่อมาบวมแก้ม เป็น buccal space infection จ่ายยาอะไรดี",
            "choices": [
                {"label": "A", "text": "amoxicillin"},
                {"label": "B", "text": "amoxicillin + clavulonic acid"},
                {"label": "C", "text": "clindamycin"},
                {"label": "D", "text": "Tetracycline"},
                {"label": "E", "text": "Metronidazole"}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ผู้ป่วยชายไทยอายุ 60 ปี ฟอกไตเป็นประจำ โรคประจำตัวเยอะแต่ที่ถามไม่ได้เกี่ยวข้องเลย เหลือฟันบนประมาณ 4-5 ซี่ ไม่มี rr มาด้วยเรื่องฟันโยก ไม่สามารถเคี้ยวอาหารได้ มีประวัติกำลังรักษาฟอกไตผ่านทางหน้าท้อง (peritoneal dialysis) ทุกวัน มีรูปคลินิกกับพาโนมาให้ - arch บน ฟันเหลือประมาณ 7 ซี่ไม่ติดกัน มี bone loss เยอะ จากฟิล์มดูเป็น hopeless ทุกซี่ บางซี่เป็น floating in the air แล้ว - arch ล่าง เหลือฟันประมาณ 11 ซี่ได้ มี bone loss แต่ส่วนใหญ่ moderate",
            "proposition": None
        },
        {
            "question_text": "ซี่ 48 แปลจากภาพรังสีโดยใช้ Pell and Gregory classification ได้ว่าอย่างไร",
            "choices": [
                {"label": "A", "text": "Class I position A"},
                {"label": "B", "text": "…"},
                {"label": "C", "text": "…"},
                {"label": "D", "text": "…"},
                {"label": "E", "text": "…"}
            ],
            "correct_answer": None,
            "category": "ศัลยศาสตร์ช่องปาก",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ผู้ป่วยหญิงอายุ 20 ปี มาพบทันตแพทย์เนื่องจากปวดฟันคุดล่างด้านขวา ให้ภาพรังสี Panoramic มา และรูป intraoral of hard palate",
            "proposition": None
        },
        {
            "question_text": "จากรอยโรคช่องปากบริเวณเพดาน จ่ายยาอะไรเบื้องต้น",
            "choices": [
                {"label": "A", "text": "Acyclovir"},
                {"label": "B", "text": "Nystatin"},
                {"label": "C", "text": "Triamcinolone"},
                {"label": "D", "text": "CHX"},
                {"label": "E", "text": "Solcoseryl"}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ผู้ป่วยหญิงอายุ 20 ปี มาพบทันตแพทย์เนื่องจากปวดฟันคุดล่างด้านขวา ให้ภาพรังสี Panoramic มา และรูป intraoral of hard palate",
            "proposition": None
        },
        {
            "question_text": "ถอนซี่ 26, 27 แล้วมีหนองออกมา จะจัดการใน visit นั้นอย่างไร ให้ภาพแผลถอนฟัน 26,27 มี OAC ขนาดไม่ใหญ่ ไม่เล็กอะ",
            "choices": [
                {"label": "A", "text": "ล้างแผลถอนฟันด้วย 0.12 CHX mouthwash"},
                {"label": "B", "text": "ใส่ Gelfoam แล้วเย็บปิดแผล figure of eight"},
                {"label": "C", "text": "Buccal advanced flap"},
                {"label": "D", "text": "Palatal rotation flap"},
                {"label": "E", "text": "พิมพ์ปากทำ obturator"}
            ],
            "correct_answer": None,
            "category": "ศัลยศาสตร์ช่องปาก",
            "task": "ขั้นตอนและวิธีการรักษา",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ผู้ป่วยชาย 40 ปี มีอาการปวดตื้อที่แก้มซ้าย เป็น ๆ หาย ๆ ตรวจพบ 26, 27 ผุทะลุโพรงประสาทฟัน ให้ภาพ Water’s view มา มี radiopacity แถว ๆ max sinus ซ้าย",
            "proposition": None
        },
        {
            "question_text": "อ่านภาพถ่ายรังสี",
            "choices": [
                {"label": "A", "text": "Opacity on left maxillary sinus with air fluid fill"},
                {"label": "B", "text": "Dome-like radiopacity of left maxillary sinus floor"},
                {"label": "C", "text": "Wide thickening of left maxillary sinus"},
                {"label": "D", "text": "…"},
                {"label": "E", "text": "…"}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ผู้ป่วยชาย 40 ปี มีอาการปวดตื้อที่แก้มซ้าย เป็น ๆ หาย ๆ ตรวจพบ 26, 27 ผุทะลุโพรงประสาทฟัน ให้ภาพ Water’s view มา มี radiopacity แถว ๆ max sinus ซ้าย",
            "proposition": None
        },
        {
            "question_text": "ซี่ 25 อุด amalgam และมีรอยราวที่ amalgam กับ palatal cusp ถ้าจะบูรณะฟันซี่นี้ควรคำนึงถึงอะไรเป็นสำคัญ",
            "choices": [
                {"label": "A", "text": "Cuspal coverage restoration"},
                {"label": "B", "text": "Adhesive restoration material selection"},
                {"label": "C", "text": "Restorative biocompatibility"},
                {"label": "D", "text": "High flexural strength restorative material"},
                {"label": "E", "text": "Restorative material with low modulus elasticity"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมบูรณะ/หัตถการ",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ผู้ป่วยชาย 40 ปี มีอาการปวดตื้อที่แก้มซ้าย เป็น ๆ หาย ๆ ตรวจพบ 26, 27 ผุทะลุโพรงประสาทฟัน ให้ภาพ Water’s view มา มี radiopacity แถว ๆ max sinus ซ้าย",
            "proposition": None
        },
        {
            "question_text": "รอยโรคเพดานรักษาอย่างไร",
            "choices": [
                {"label": "A", "text": "Acyclovia"},
                {"label": "B", "text": "Doxycycline"},
                {"label": "C", "text": "Triamcinolone actronide"},
                {"label": "D", "text": "miconazole"},
                {"label": "E", "text": "…"}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ผู้ป่วยเพศชาย อายุ 25 ปี เหงือกบวมและปวดบริเวณฟันกรามล่างขวา และเจ็บเพดานฝั่งขวา มี Right lymph node enlargement คลำเจ็บ ให้รูป X-ray OPG, รูปในช่องปากฟันบน มีแผลที่ palate ฝั่งขวาตรง attached gingiva รอยโค้ง palate ประมาณ 10 แผลเล็กๆ ตรงกับแนวของซี่ 14D-16M (รูปคล้ายเริม) และให้ตารางผลแล็บและค่าปกติมา เป็น High WBC (130,000), low RBC, low Platelet, low Hb และอีกหลายค่า",
            "proposition": None
        },
        {
            "question_text": "Classification 48 (impacted tooth)",
            "choices": [
                {"label": "A", "text": "Class II position A"},
                {"label": "B", "text": "Class II position B"},
                {"label": "C", "text": "Class I position A"},
                {"label": "D", "text": "Class I position B"},
                {"label": "E", "text": "Class III position A"}
            ],
            "correct_answer": None,
            "category": "ศัลยศาสตร์ช่องปาก",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ผู้ป่วยเพศชาย อายุ 25 ปี เหงือกบวมและปวดบริเวณฟันกรามล่างขวา และเจ็บเพดานฝั่งขวา มี Right lymph node enlargement คลำเจ็บ ให้รูป X-ray OPG, รูปในช่องปากฟันบน มีแผลที่ palate ฝั่งขวาตรง attached gingiva รอยโค้ง palate ประมาณ 10 แผลเล็กๆ ตรงกับแนวของซี่ 14D-16M (รูปคล้ายเริม) และให้ตารางผลแล็บและค่าปกติมา เป็น High WBC (130,000), low RBC, low Platelet, low Hb และอีกหลายค่า",
            "proposition": None
        },
        {
            "question_text": "จากผลตรวจเลือดเป็นโรคอะไร ให้ค่าเลือดมาก (WBC สูง MCV ปกติ )MCH HB HCt MCHV neutrophil lymphocyte blast ต่ำ",
            "choices": [
                {"label": "A", "text": "thrombocytopenia"},
                {"label": "B", "text": "lymphoma"},
                {"label": "C", "text": "Leukemia"},
                {"label": "D", "text": "Aplastic anemia"},
                {"label": "E", "text": "Hemophilia"}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ผู้ป่วยเพศชาย อายุ 25 ปี เหงือกบวมและปวดบริเวณฟันกรามล่างขวา และเจ็บเพดานฝั่งขวา มี Right lymph node enlargement คลำเจ็บ ให้รูป X-ray OPG, รูปในช่องปากฟันบน มีแผลที่ palate ฝั่งขวาตรง attached gingiva รอยโค้ง palate ประมาณ 10 แผลเล็กๆ ตรงกับแนวของซี่ 14D-16M (รูปคล้ายเริม) และให้ตารางผลแล็บและค่าปกติมา เป็น High WBC (130,000), low RBC, low Platelet, low Hb และอีกหลายค่า",
            "proposition": None
        },
        {
            "question_text": "อุด 14,16 ไปแต่คนไข้ไปกินของร้อนแล้วปวดมาก เลยสงสัย 15 ควรตรวจอะไรเพิ่ม",
            "choices": [
                {"label": "A", "text": "Cold test"},
                {"label": "B", "text": "Heat test"},
                {"label": "C", "text": "Ept"},
                {"label": "D", "text": "Percussion"},
                {"label": "E", "text": "Bite test"}
            ],
            "correct_answer": None,
            "category": "วิทยาเอ็นโดดอนต์",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ผู้ป่วยชายอายุ 50 ปี ให้ภาพ intraoral 14(OD) AF แตกตรง marginal ridge, 15(OD) AF อุดสวยงาม ขอบแนบ RF: 14(OD) ขอบแนบไม่มี overhang, 15(OD) radiopaque area deep into pulp",
            "proposition": None
        },
        {
            "question_text": "รื้อ AF ซี่ 14 ออก cavity gingival margin อยู่ใต้ขอบเหงือก 2 mm., ห่างจาก alveolar crest 3 mm. มี keratinized tissue 6 mm ถ้าจะบูรณะควรทำไงต่อ",
            "choices": [
                {"label": "A", "text": "Gingivectomy"},
                {"label": "B", "text": "Osterectomy"},
                {"label": "C", "text": "Coronally flap reposition"},
                {"label": "D", "text": "Gingival retraction"},
                {"label": "E", "text": "Orthodontic extrusion"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมบูรณะ/หัตถการ",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ผู้ป่วยชายอายุ 50 ปี ให้ภาพ intraoral 14(OD) AF แตกตรง marginal ridge, 15(OD) AF อุดสวยงาม ขอบแนบ RF: 14(OD) ขอบแนบไม่มี overhang, 15(OD) radiopaque area deep into pulp",
            "proposition": None
        },
        {
            "question_text": "สาเหตุที่ AF ซี่ 14 แตก",
            "choices": [
                {"label": "A", "text": "Cavity preparation ไม่ดี"},
                {"label": "B", "text": "Moisture control ระหว่างอุดไม่ดี"},
                {"label": "C", "text": "อัด amalgam ไม่แน่น"},
                {"label": "D", "text": "Overhang"},
                {"label": "E", "text": "…"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมบูรณะ/หัตถการ",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ผู้ป่วยชายอายุ 50 ปี ให้ภาพ intraoral 14(OD) AF แตกตรง marginal ridge, 15(OD) AF อุดสวยงาม ขอบแนบ RF: 14(OD) ขอบแนบไม่มี overhang, 15(OD) radiopaque area deep into pulp",
            "proposition": None
        },
        {
            "question_text": "สบฟันแบบไหน",
            "choices": [
                {"label": "A", "text": "Class II division 2,Anterior deep bite"},
                {"label": "B", "text": "Class II division 1,Anterior deep bite"},
                {"label": "C", "text": "Class I ,Anterior deep bite"},
                {"label": "D", "text": "…"},
                {"label": "E", "text": "…"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมจัดฟัน",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "เด็กอายุ 10 ปี นอนกัดฟัน ไม่มีอาการปวด (รูปไม่เห็นซี่ 6 แต่ฟันหน้า deep bite น่าจะimpinging และฟัน 11,21 ตั้งตรงและหลุบ เหมือน class II div2)",
            "proposition": None
        },
        {
            "question_text": "ทำยังไงกับภาวะนอนกัดฟัน",
            "choices": [
                {"label": "A", "text": "ส่งจัดฟัน"},
                {"label": "B", "text": "ส่งจิตแพทย์"},
                {"label": "C", "text": "ใส่ posterior bite plane"},
                {"label": "D", "text": "ใส่ splint"},
                {"label": "E", "text": "Parent observation"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมสำหรับเด็ก",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "เด็กอายุ 10 ปี นอนกัดฟัน ไม่มีอาการปวด (รูปไม่เห็นซี่ 6 แต่ฟันหน้า deep bite น่าจะimpinging และฟัน 11,21 ตั้งตรงและหลุบ เหมือน class II div2)",
            "proposition": None
        },
        {
            "question_text": "จะพบลักษณะความผิดปกติแบบใดได้ใน malocclusion นี้",
            "choices": [
                {"label": "A", "text": "Lower anterior attrition"},
                {"label": "B", "text": "Lower posterior attrition"},
                {"label": "C", "text": "Lower incisor gingival recession"},
                {"label": "D", "text": "Lower incisor root resorption"},
                {"label": "E", "text": "Upper posterior attrition"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมจัดฟัน",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "เด็กอายุ 10 ปี นอนกัดฟัน ไม่มีอาการปวด (รูปไม่เห็นซี่ 6 แต่ฟันหน้า deep bite น่าจะimpinging และฟัน 11,21 ตั้งตรงและหลุบ เหมือน class II div2)",
            "proposition": None
        },
        {
            "question_text": "ถ้า Floor of mouth วัดได้ 6 mm จะใส่ Major connector อะไรดี",
            "choices": [
                {"label": "A", "text": "Lingual bar"},
                {"label": "B", "text": "Labial bar"},
                {"label": "C", "text": "Lingual plate"},
                {"label": "D", "text": "Double lingual bar"},
                {"label": "E", "text": "Interrupted lingual bar"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมประดิษฐ์",
            "task": "ขั้นตอนและวิธีการรักษา",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "หญิง 50 ปี เคี้ยวอาหารไม่ละเอียด I/O บนไม่มี27 ล่างไม่มี37,47 ซ้ายมี28,38 ขวาไม่มี18,48 Arch ล่างมีซี่ 38, 36-46 (37หาย)",
            "proposition": None
        },
        {
            "question_text": "ฟันล่างจะทำ RPD วาง indirect retainer ซี่ไหน",
            "choices": [
                {"label": "A", "text": "32"},
                {"label": "B", "text": "34"},
                {"label": "C", "text": "36"},
                {"label": "D", "text": "43"},
                {"label": "E", "text": "45"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมประดิษฐ์",
            "task": "ขั้นตอนและวิธีการรักษา",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "หญิง 50 ปี เคี้ยวอาหารไม่ละเอียด I/O บนไม่มี27 ล่างไม่มี37,47 ซ้ายมี28,38 ขวาไม่มี18,48 Arch ล่างมีซี่ 38, 36-46 (37หาย)",
            "proposition": None
        },
        {
            "question_text": "ถ้าintrudeฟันซี่17 เพื่อใส่47 ปัจจัยข้อใดส่งผลต่อ stability ของฟันซี่17",
            "choices": [
                {"label": "A", "text": "retainer only"},
                {"label": "B", "text": "retainer and opposite tooth"},
                {"label": "C", "text": "interocclusal space"},
                {"label": "D", "text": "tongue position"},
                {"label": "E", "text": "tongue exercise"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมประดิษฐ์",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "หญิง 50 ปี เคี้ยวอาหารไม่ละเอียด I/O บนไม่มี27 ล่างไม่มี37,47 ซ้ายมี28,38 ขวาไม่มี18,48 Arch ล่างมีซี่ 38, 36-46 (37หาย)",
            "proposition": None
        },
        {
            "question_text": "ประเมินยังไงว่าจะ crownlength ดีไหม",
            "choices": [
                {"label": "A", "text": "ดูระยะห่าง margin-keratinized tissue"},
                {"label": "B", "text": "ดูระยะห่าง margin-crestal bone"},
                {"label": "C", "text": "ความหนา bone แนว B-L"},
                {"label": "D", "text": "ความหนาเหงือก"},
                {"label": "E", "text": "…"}
            ],
            "correct_answer": None,
            "category": "ปริทันตวิทยา",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "คุณลุง วัสดุซี่ฟันล่างซ้ายหลุด class II เบิ้ม ๆ margin เกือบเสมอ alveolar crest",
            "proposition": None
        },
        {
            "question_text": "พิมพ์ post & core ยังไง",
            "choices": [
                {"label": "A", "text": "single mixed putty technique"},
                {"label": "B", "text": "single light body"},
                {"label": "C", "text": "single alginate"},
                {"label": "D", "text": "poly sulfide"},
                {"label": "E", "text": "hydrocolloid"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมประดิษฐ์",
            "task": "ขั้นตอนและวิธีการรักษา",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "คุณลุง วัสดุซี่ฟันล่างซ้ายหลุด class II เบิ้ม ๆ margin เกือบเสมอ alveolar crest",
            "proposition": None
        },
        {
            "question_text": "Error endo ที่อาจจะเกิดได้ (ในรูปรากงอปลาย)",
            "choices": [
                {"label": "A", "text": "zipping"},
                {"label": "B", "text": "ledge"},
                {"label": "C", "text": "perforate"},
                {"label": "D", "text": "missing canal"},
                {"label": "E", "text": "gouging"}
            ],
            "correct_answer": None,
            "category": "วิทยาเอ็นโดดอนต์",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "คุณลุง วัสดุซี่ฟันล่างซ้ายหลุด class II เบิ้ม ๆ margin เกือบเสมอ alveolar crest",
            "proposition": None
        },
        {
            "question_text": "38จะทำการฉีดยาชาเฉพาะที่ยังไง",
            "choices": [
                {"label": "A", "text": "buccal และ lingual ของ socket"},
                {"label": "B", "text": "IAN"},
                {"label": "C", "text": "local infiltration"},
                {"label": "D", "text": "long buccal nerve block"},
                {"label": "E", "text": "IAN+BUCCAL INFILTRATION+LOCAL INFILTRATIONรอบๆรอยบวม"}
            ],
            "correct_answer": None,
            "category": "ศัลยศาสตร์ช่องปาก",
            "task": "ขั้นตอนและวิธีการรักษา",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ชายอายุ 50 ปี ถอนซี่ 46 ไปเมื่อ อาทิตย์ที่แล้ว มีอาการบวมเล็กน้อย มีหนองบวมที่socket",
            "proposition": None
        },
        {
            "question_text": "ต้องเคลียร์ช่องปากไรเป็นอย่างแรกก่อนทำrpd",
            "choices": [
                {"label": "A", "text": "ถอน 46"},
                {"label": "B", "text": "rct 46"},
                {"label": "C", "text": "ถอน 28"},
                {"label": "D", "text": "rct 35"},
                {"label": "E", "text": "อุด 36, 27"}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ผู้ป่วยเพศหญิง60 ปวดฟันกรามขวาล่าง เคี้ยวแล้วฟันยวบ เหงือกบวมๆหายๆ เคยรักษามะเร็งเต้านมด้วย เคมี ผ่าตัด รังสี เมื่อ 4 ปีที่แล้ว ตอนนี้ฉีด zoledronic acid รักษากระดูกพรุนมา 2 ปี [ให้รูปI/Oซี่46,47 Buccal viewมา เห็นเหงือกร่นแรงมาก เห็นรากลงมายาวๆ ดูเขรอะๆมากๆๆๆ] [รูปOPG เห็น46ฟันลอยๆ ไม่มีbone support มีผุdistal ลึกประมาณd2, 28 เห็นเป็นfully erupt non functional, 35 เห็นผุใหญ่มาก superimpose pulp มีรอยโรคปลายราก, 36 และ 27 เห็นผุdistal ลึกประมาณd2-3]",
            "proposition": None
        },
        {
            "question_text": "ก่อนถอน 46, 28 ต้องทำไร",
            "choices": [
                {"label": "A", "text": "ให้ pentoxifylline, tocopherol ก่อน 1 เดือน"},
                {"label": "B", "text": "หยุด Zolendronate แบบ holiday"},
                {"label": "C", "text": "HBOT 20 dive ก่อนถอน"},
                {"label": "D", "text": "นัด Follow up จนกว่า completely tissue healing"},
                {"label": "E", "text": "…"}
            ],
            "correct_answer": None,
            "category": "ศัลยศาสตร์ช่องปาก",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ผู้ป่วยเพศหญิง60 ปวดฟันกรามขวาล่าง เคี้ยวแล้วฟันยวบ เหงือกบวมๆหายๆ เคยรักษามะเร็งเต้านมด้วย เคมี ผ่าตัด รังสี เมื่อ 4 ปีที่แล้ว ตอนนี้ฉีด zoledronic acid รักษากระดูกพรุนมา 2 ปี [ให้รูปI/Oซี่46,47 Buccal viewมา เห็นเหงือกร่นแรงมาก เห็นรากลงมายาวๆ ดูเขรอะๆมากๆๆๆ] [รูปOPG เห็น46ฟันลอยๆ ไม่มีbone support มีผุdistal ลึกประมาณd2, 28 เห็นเป็นfully erupt non functional, 35 เห็นผุใหญ่มาก superimpose pulp มีรอยโรคปลายราก, 36 และ 27 เห็นผุdistal ลึกประมาณd2-3]",
            "proposition": None
        },
        {
            "question_text": "ถ้าจะถอนฟันซี่ 46 ถามว่าควรทำเดือนไหนดีสุด",
            "choices": [
                {"label": "A", "text": "มิถุนายน"},
                {"label": "B", "text": "พฤษภาคม"},
                {"label": "C", "text": "มีนาคม"},
                {"label": "D", "text": "มกราคม"}
            ],
            "correct_answer": None,
            "category": "ศัลยศาสตร์ช่องปาก",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ผู้ป่วยเพศหญิง60 ปวดฟันกรามขวาล่าง เคี้ยวแล้วฟันยวบ เหงือกบวมๆหายๆ เคยรักษามะเร็งเต้านมด้วย เคมี ผ่าตัด รังสี เมื่อ 4 ปีที่แล้ว ตอนนี้ฉีด zoledronic acid รักษากระดูกพรุนมา 2 ปี [ให้รูปI/Oซี่46,47 Buccal viewมา เห็นเหงือกร่นแรงมาก เห็นรากลงมายาวๆ ดูเขรอะๆมากๆๆๆ] [รูปOPG เห็น46ฟันลอยๆ ไม่มีbone support มีผุdistal ลึกประมาณd2, 28 เห็นเป็นfully erupt non functional, 35 เห็นผุใหญ่มาก superimpose pulp มีรอยโรคปลายราก, 36 และ 27 เห็นผุdistal ลึกประมาณd2-3]",
            "proposition": None
        },
        {
            "question_text": "ANB= -1 (Normal: 2-4) ให้ dx malocclusion",
            "choices": [
                {"label": "A", "text": "Skeletal class I with Angle Class III with ant crossbite"},
                {"label": "B", "text": "Skeletal class IIIwith Angle Class II with ant crossbite"},
                {"label": "C", "text": "Skeletal class III with Angle Class III with ant crossbite"},
                {"label": "D", "text": "…"},
                {"label": "E", "text": "…"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมจัดฟัน",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ให้รูป intraoral (Class III+anterior crossbite)",
            "proposition": None
        },
        {
            "question_text": "มี รอยขาวขุ่นกลมกว้างประมาณ 2-3 mm ตรง buccal 34 ประมาณรอยต่อ middle-cervical third ของ crown ถามว่าเกิดจากอะไร (เป็นซี่เดียว ซี่อื่นๆดูดี ดูปกติหมด)",
            "choices": [
                {"label": "A", "text": "Genetic"},
                {"label": "B", "text": "Enamel decalcification"},
                {"label": "C", "text": "Excess fluoride"},
                {"label": "D", "text": "Infection of 74"},
                {"label": "E", "text": "Poor oral hygiene"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมสำหรับเด็ก",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ให้รูป intraoral (Class III+anterior crossbite)",
            "proposition": None
        },
        {
            "question_text": "ให้การรักษา malocclusion ยังไง",
            "choices": [
                {"label": "A", "text": "High pull headgear"},
                {"label": "B", "text": "Straight pull headgear"},
                {"label": "C", "text": "Twinblock"},
                {"label": "D", "text": "RPE+facemask"},
                {"label": "E", "text": "Upper active plate + Modified U loop"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมจัดฟัน",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ให้รูป intraoral (Class III+anterior crossbite)",
            "proposition": None
        },
        {
            "question_text": "เครื่อง ept อยู่ที่ 0.5 bar หมายความว่า",
            "choices": [
                {"label": "A", "text": "ห่างจาก apical foramen 0.5 mm"},
                {"label": "B", "text": "ห่างจาก apical foramen 1 mm"},
                {"label": "C", "text": "อยู่ใกล้ apical construction"},
                {"label": "D", "text": "apical foramen"},
                {"label": "E", "text": "apical constriction"}
            ],
            "correct_answer": None,
            "category": "วิทยาเอ็นโดดอนต์",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ฟิล์มผุ 12 expose 11 missing",
            "proposition": None
        },
        {
            "question_text": "สาเหตุหลักที่ทำให้ Denture แตก",
            "choices": [
                {"label": "A", "text": "ขอบ flange ปีกบาง"},
                {"label": "B", "text": "Acrylic ตรง Palate บาง"},
                {"label": "C", "text": "แช่น้ำยาทำความสะอาดนาน"},
                {"label": "D", "text": "เคี้ยวแรง"},
                {"label": "E", "text": "…"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมประดิษฐ์",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ให้ภาพ Epulis fissuratum ที่บริเวณ 21-24 และมีภาพซ่อม denture มีรอยแตกตั้งแต่ frenum จนถึงประมาณกลาง palate",
            "proposition": None
        },
        {
            "question_text": "จัดการยังไงกับติ่งเนื้อไง",
            "choices": [
                {"label": "A", "text": "ตัดออก"},
                {"label": "B", "text": "จ่าย antibiotics"},
                {"label": "C", "text": "Massageตรงนั้น"},
                {"label": "D", "text": "กรอขอบที่โดนติ่งออก"},
                {"label": "E", "text": "…"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมประดิษฐ์",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ให้ภาพ Epulis fissuratum ที่บริเวณ 21-24 และมีภาพซ่อม denture มีรอยแตกตั้งแต่ frenum จนถึงประมาณกลาง palate",
            "proposition": None
        },
        {
            "question_text": "ติ่งเนื้อที่ vestibule เกิดจากอะไร",
            "choices": [
                {"label": "A", "text": "ฟันเทียมขอบสั้น และหลวม"},
                {"label": "B", "text": "เคี้ยวข้าวข้างเดียว"},
                {"label": "C", "text": "ขอบฟันปลอมบาง"},
                {"label": "D", "text": "เว้า frenum"},
                {"label": "E", "text": "…"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมประดิษฐ์",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL2 2026 PART 2",
            "stem": "ให้ภาพ Epulis fissuratum ที่บริเวณ 21-24 และมีภาพซ่อม denture มีรอยแตกตั้งแต่ frenum จนถึงประมาณกลาง palate",
            "proposition": None
        }
    ]
}

os.makedirs('/Users/admin/Downloads/NL Test/parsed_exams', exist_ok=True)
with open('/Users/admin/Downloads/NL Test/parsed_exams/NL2_2026_PART2.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
