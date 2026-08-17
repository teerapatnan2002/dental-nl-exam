import json
import os

data = {
  "questions": [
    {
      "question_text": "คนไข้หญิง 40 ปี เคี้ยวข้าวไม่ถนัด มีประวัติ nasopharyngeal carcinoma after receiving radiotherapy 60 Gy ให้รูปฟันผุมากมายเหลือแต่ตอฟัน ตอนนี้ไม่มีอาการอะไร\nถ้าทำฟันปลอมให้คนไข้มันจะต่างจากเคสอื่นอย่างไร",
      "choices": [
        {"label": "A", "text": "Loose denture"},
        {"label": "B", "text": "Angular cheilitis"},
        {"label": "C", "text": "Osteoradionecrosis"},
        {"label": "D", "text": "Medical-related osteonecrosis of the jaw"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมประดิษฐ์",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "คนไข้หญิง 40 ปี เคี้ยวข้าวไม่ถนัด มีประวัติ nasopharyngeal carcinoma after receiving radiotherapy 60 Gy ให้รูปฟันผุมากมายเหลือแต่ตอฟัน ตอนนี้ไม่มีอาการอะไร\nจากรูปฟันผุบริเวณฟันหน้าเรียกว่าอะไร (ในรูปคือผุเยอะ ๆ ดำ ๆ บางซี่เหลือเป็น RR)",
      "choices": [
        {"label": "A", "text": "Rampant caries"},
        {"label": "B", "text": "Recurrent caries"},
        {"label": "C", "text": "Residual caries"},
        {"label": "D", "text": "Hidden caries"},
        {"label": "E", "text": "Meth mouth caries"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมบูรณะ/หัตถการ",
      "task": "การวินิจฉัยโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "คนไข้หญิง 40 ปี เคี้ยวข้าวไม่ถนัด มีประวัติ nasopharyngeal carcinoma after receiving radiotherapy 60 Gy ให้รูปฟันผุมากมายเหลือแต่ตอฟัน ตอนนี้ไม่มีอาการอะไร\nจะให้การรักษาเบื้องต้นได้อย่างไร",
      "choices": [
        {"label": "A", "text": "ให้ยาปฏิชีวนะ"},
        {"label": "B", "text": "ให้ยาแก้ปวด"},
        {"label": "C", "text": "ให้น้ำลายเทียม"},
        {"label": "D", "text": "Sodium fluoride mouthrinse"},
        {"label": "E", "text": "Chlorhexidine mouthwash"}
      ],
      "correct_answer": None,
      "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "ผู้ป่วยมาตรวจสุขภาพช่องปาก ไม่เคยปวด โจทย์ให้ฟิล์ม periapical films ถ่ายติด edentulous, 45, 44 มีเงาดำ ๆ ซ้อนอยู่ที่ปลายราก 45\nจะตรวจอะไรเพิ่มเพื่อวินิจฉัยรอยโรคปลายราก 45",
      "choices": [
        {"label": "A", "text": "EPT"},
        {"label": "B", "text": "Mobility"},
        {"label": "C", "text": "Heat test"},
        {"label": "D", "text": "Cold test"},
        {"label": "E", "text": "Percussion"}
      ],
      "correct_answer": None,
      "category": "วิทยาเอ็นโดดอนต์",
      "task": "การวินิจฉัยโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "ผู้ป่วยมาตรวจสุขภาพช่องปาก ไม่เคยปวด โจทย์ให้ฟิล์ม periapical films ถ่ายติด edentulous, 45, 44 มีเงาดำ ๆ ซ้อนอยู่ที่ปลายราก 45\nทำ RCT 45 แล้วระหว่างที่ล้าง NaOCl ในคลองราก หลังจากนั้น ผู้ป่วยรู้สึกปวดและเจ็บขึ้นมา การจัดการเบื้องต้นคืออะไร",
      "choices": [
        {"label": "A", "text": "ฉีดยาชา ล้าง NSS เพื่อเจือจาง NaOCl"},
        {"label": "B", "text": "ฉีดยาชาลงในคลองรากฟัน แล้วทำหัตถการต่อ"},
        {"label": "C", "text": "หยุดทำ รอจนกว่าคนไข้จะหายปวดค่อยทำต่อ"},
        {"label": "D", "text": "หยุดทำ จ่ายยาแก้ปวดแล้วให้คนไข้กลับบ้าน"},
        {"label": "E", "text": "หา Working length ใหม่เพราะขยายคลองรากฟันเกินปลายราก"}
      ],
      "correct_answer": None,
      "category": "วิทยาเอ็นโดดอนต์",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "ผู้ป่วยมาตรวจสุขภาพช่องปาก ไม่เคยปวด โจทย์ให้ฟิล์ม periapical films ถ่ายติด edentulous, 45, 44 มีเงาดำ ๆ ซ้อนอยู่ที่ปลายราก 45\nทำ RCT 45 MAF40 stepback มาจนถึงไฟล์ 60 ที่ working length 20 mm แล้วจะใช้อะไรขยายตรง canal orifice",
      "choices": [
        {"label": "A", "text": "Gate glidden เบอร์ 1"},
        {"label": "B", "text": "Gate glidden เบอร์ 2"},
        {"label": "C", "text": "Gate glidden เบอร์ 3"},
        {"label": "D", "text": "Gate glidden เบอร์ 4"},
        {"label": "E", "text": "Gate glidden เบอร์ 5"}
      ],
      "correct_answer": None,
      "category": "วิทยาเอ็นโดดอนต์",
      "task": "ขั้นตอนและวิธีการรักษา",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "คนไข้เพศหญิง อายุ 30 มาด้วย cc สีฟันคล้ำ I/O เห็นซี่ 4-6 คล้ำ อุดคอฟันที่ 34B ให้รูปในปากมาดังรูป\nมีวัสดุอุดคอฟันซี่ 34 สีไม่เหมือนคอฟัน (รูปดูไม่เหลืองเท่าคอฟัน) ถามว่าเลือกค่าอะไรผิด",
      "choices": [
        {"label": "A", "text": "Hue"},
        {"label": "B", "text": "Chroma"},
        {"label": "C", "text": "Value"},
        {"label": "D", "text": "Transparent"},
        {"label": "E", "text": "Translucent"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมบูรณะ/หัตถการ",
      "task": "การวินิจฉัยโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "คนไข้เพศหญิง อายุ 30 มาด้วย cc สีฟันคล้ำ I/O เห็นซี่ 4-6 คล้ำ อุดคอฟันที่ 34B ให้รูปในปากมาดังรูป\nความผิดปกตินี้เกิดขึ้นที่ stage ไหน",
      "choices": [
        {"label": "A", "text": "Bud stage"},
        {"label": "B", "text": "Cap stage"},
        {"label": "C", "text": "Bell stage"},
        {"label": "D", "text": "Advanced bell"},
        {"label": "E", "text": "Erupting stage"}
      ],
      "correct_answer": None,
      "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
      "task": "การเกิดและการดำเนินโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "คนไข้เพศหญิง อายุ 30 มาด้วย cc สีฟันคล้ำ I/O เห็นซี่ 4-6 คล้ำ อุดคอฟันที่ 34B ให้รูปในปากมาดังรูป\nความผิดปกตินี้เกิดขึ้นตอน อายุเท่าไหร่",
      "choices": [
        {"label": "A", "text": "1.5 - 3 ปี"},
        {"label": "B", "text": "3 - 8 ปี"},
        {"label": "C", "text": "6 - 9 เดือน"},
        {"label": "D", "text": "9 - 12 ปี"},
        {"label": "E", "text": "10 - 15 เดือน"}
      ],
      "correct_answer": None,
      "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
      "task": "การเกิดและการดำเนินโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "ให้ฟิล์มซี่ 24 RCT มาแล้ว 25 มีวัสดุอุด M มีเงาใต้วัสดุใกล้ pulp ปวดซี่ 25 มี lesion ปลายราก\nครอบซี่ 11,21 เหงือกร่นเห็นคอฟันเข้ม ๆ (เป็น NCCL) ทำอย่างไร",
      "choices": [
        {"label": "A", "text": "อุดด้วย resin composite สีเหมือนครอบ"},
        {"label": "B", "text": "ครอบใหม่ opaque ปิดสี"},
        {"label": "C", "text": "ครอบใหม่เลือกเฉดเข้มขึ้น"},
        {"label": "D", "text": "ครอบใหม่กรอให้ margin อยู่ครอบคลุมตำแหน่งที่สีเข้ม"},
        {"label": "E", "text": "ครอบใหม่ให้ metal extend ไปมากขึ้น"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมประดิษฐ์",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "ให้ฟิล์มซี่ 24 RCT มาแล้ว 25 มีวัสดุอุด M มีเงาใต้วัสดุใกล้ pulp ปวดซี่ 25 มี lesion ปลายราก\nเชื้อในคลองรากซี่ 24",
      "choices": [
        {"label": "A", "text": "Prevotella intermedia"},
        {"label": "B", "text": "Propionibacterium propionicum"},
        {"label": "C", "text": "Enterococcus faecalis"},
        {"label": "D", "text": "Actinomyces israeli"},
        {"label": "E", "text": "A. Viscosus"}
      ],
      "correct_answer": None,
      "category": "วิทยาเอ็นโดดอนต์",
      "task": "การเกิดและการดำเนินโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "ให้ฟิล์มซี่ 24 RCT มาแล้ว 25 มีวัสดุอุด M มีเงาใต้วัสดุใกล้ pulp ปวดซี่ 25 มี lesion ปลายราก\nสาเหตุรอยโรคซี่ 25",
      "choices": [
        {"label": "A", "text": "Dental caries"},
        {"label": "B", "text": "Traumatic occlusion"},
        {"label": "C", "text": "Filing material"},
        {"label": "D", "text": "Periodontitis"},
        {"label": "E", "text": "Attrition"}
      ],
      "correct_answer": None,
      "category": "วิทยาเอ็นโดดอนต์",
      "task": "การวินิจฉัยโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "ศูนย์เด็กเล็ก 2 - 4 ปี มี 50 คน จากการตรวจในรอบ 6 เดือนก่อน มีฟันผุ 35 คน dt = 0.3 ซี่/คน ft = 2.1 ซี่/คน ให้แปรงฟันหลังกินอาหารกลางวัน ไม่ให้เอาขวดนมเข้าศูนย์ ผู้ปกครองเด็กทำอาชีพรับจ้างและโรงงาน\nข้อใดสรุปประสบการณ์ฟันผุ",
      "choices": [
        {"label": "A", "text": "อุบัติการณ์เกิดฟันผุ ร้อยละ 70"},
        {"label": "B", "text": "ฟันผุเกิดใหม่มาก"},
        {"label": "C", "text": "ฟันผุเกิดใหม่น้อยมาก"},
        {"label": "D", "text": "ได้รับบริการทางทันตกรรมดี"},
        {"label": "E", "text": "เศรษฐานะมีผลกับฟันผุ"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมชุมชน",
      "task": "การวินิจฉัยโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "ศูนย์เด็กเล็ก 2 - 4 ปี มี 50 คน จากการตรวจในรอบ 6 เดือนก่อน มีฟันผุ 35 คน dt = 0.3 ซี่/คน ft = 2.1 ซี่/คน ให้แปรงฟันหลังกินอาหารกลางวัน ไม่ให้เอาขวดนมเข้าศูนย์ ผู้ปกครองเด็กทำอาชีพรับจ้างและโรงงาน\nใช้ index อะไรวัดผลโครงการ เทียบกับก่อนการให้ฟลูออไรด์ เพื่อ remineralization",
      "choices": [
        {"label": "A", "text": "ICDAS"},
        {"label": "B", "text": "DMFT"},
        {"label": "C", "text": "DMFS"},
        {"label": "D", "text": "DEFT"},
        {"label": "E", "text": "PSR"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมชุมชน",
      "task": "ขั้นตอนและวิธีการรักษา",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "ศูนย์เด็กเล็ก 2 - 4 ปี มี 50 คน จากการตรวจในรอบ 6 เดือนก่อน มีฟันผุ 35 คน dt = 0.3 ซี่/คน ft = 2.1 ซี่/คน ให้แปรงฟันหลังกินอาหารกลางวัน ไม่ให้เอาขวดนมเข้าศูนย์ ผู้ปกครองเด็กทำอาชีพรับจ้างและโรงงาน\nขั้นตอนแรกของ PROCEED-PRECEDE",
      "choices": [
        {"label": "A", "text": "วิเคราะห์บริบทของศูนย์เด็กและชุมชน"},
        {"label": "B", "text": "วิเคราะห์ปัจจัยร่วม"},
        {"label": "C", "text": "ตรวจฟันรายซี่"},
        {"label": "D", "text": "ประเมินความรู้ผู้ดูแล"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมชุมชน",
      "task": "การสร้างเสริมสุขภาพและการป้องกัน",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "ถอน 18 มีกระดูกติดมาเลือดไม่หยุด คนไข้เป็น ischemic heart disease กับ hypertension ตอนนี้กินยาอย่างต่อเนื่อง หลังจากกัด gauze แล้ว พบว่าเลือดยังไม่หยุดไหล และพบว่าเลือดไหลออกมาจากทั้งกระดูกและเนื้อเยื่ออ่อน ผู้ป่วยมี vital sign 130/90 PR 80\nสิ่งแรกที่ควรทำคืออะไร",
      "choices": [
        {"label": "A", "text": "ปักกลับติด Splint"},
        {"label": "B", "text": "ดู Oroantral communication"},
        {"label": "C", "text": "แต่งกระดูกแหลมคม"},
        {"label": "D", "text": "ไปถ่ายภาพ Panoramic"}
      ],
      "correct_answer": None,
      "category": "ศัลยศาสตร์ช่องปาก",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "ถอน 18 มีกระดูกติดมาเลือดไม่หยุด คนไข้เป็น ischemic heart disease กับ hypertension ตอนนี้กินยาอย่างต่อเนื่อง หลังจากกัด gauze แล้ว พบว่าเลือดยังไม่หยุดไหล และพบว่าเลือดไหลออกมาจากทั้งกระดูกและเนื้อเยื่ออ่อน ผู้ป่วยมี vital sign 130/90 PR 80\nที่เลือดไหลไม่หยุดน่าจะเกิดจากอะไร",
      "choices": [
        {"label": "A", "text": "ยา Antihypertensive drug"},
        {"label": "B", "text": "ยา Anticoagulant"},
        {"label": "C", "text": "ความดันสูง"},
        {"label": "D", "text": "Large artery tear"},
        {"label": "E", "text": "Tachycardia"}
      ],
      "correct_answer": None,
      "category": "ศัลยศาสตร์ช่องปาก",
      "task": "การเกิดและการดำเนินโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "ถอน 18 มีกระดูกติดมาเลือดไม่หยุด คนไข้เป็น ischemic heart disease กับ hypertension ตอนนี้กินยาอย่างต่อเนื่อง หลังจากกัด gauze แล้ว พบว่าเลือดยังไม่หยุดไหล และพบว่าเลือดไหลออกมาจากทั้งกระดูกและเนื้อเยื่ออ่อน ผู้ป่วยมี vital sign 130/90 PR 80\nถ้าคนไข้หมดสติ ในฐานะทันตแพทย์ จะทำอะไรอันดับแรก",
      "choices": [
        {"label": "A", "text": "คลำชีพจร"},
        {"label": "B", "text": "กดหน้าอกเลย"},
        {"label": "C", "text": "โทร 1669"}
      ],
      "correct_answer": None,
      "category": "ศัลยศาสตร์ช่องปาก",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "คนไข้มีฟันหน้ายื่นมาก ๆ class II Division 1\nถ้าต้องการ Max-Man skeleton A-P relation ต้องตรวจอะไรเพิ่มเติม",
      "choices": [
        {"label": "A", "text": "PA ceph"},
        {"label": "B", "text": "Lateral cephalometrics"},
        {"label": "C", "text": "Facial profile photo"},
        {"label": "D", "text": "Panoramic radiograph"},
        {"label": "E", "text": "Occlusal film"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมจัดฟัน",
      "task": "การวินิจฉัยโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "คนไข้มีฟันหน้ายื่นมาก ๆ class II Division 1\nถ้าเกิดอุบัติเหตุ ฟันเคลื่อนเข้าด้านเพดาน ควรให้การรักษาเบื้องต้นอย่างไร",
      "choices": [
        {"label": "A", "text": "Refer to orthodontist for reposition"},
        {"label": "B", "text": "Wire fixation with resin composite"},
        {"label": "C", "text": "Observe 1 month"},
        {"label": "D", "text": "Stabilization splint with wire and composite"},
        {"label": "E", "text": "RCT"}
      ],
      "correct_answer": None,
      "category": "ศัลยศาสตร์ช่องปาก",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "คนไข้มีฟันหน้ายื่นมาก ๆ class II Division 1\nคนไข้ลักษณะนี้มักพบอะไรร่วมด้วย",
      "choices": [
        {"label": "A", "text": "Severe attrition"},
        {"label": "B", "text": "Unilateral chewing"},
        {"label": "C", "text": "Sleep bruxism"},
        {"label": "D", "text": "Incompetent lip"},
        {"label": "E", "text": "Mouth Breathing"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมจัดฟัน",
      "task": "การวินิจฉัยโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "คนไข้เด็กอายุ 5 ปี เป็น Hemophilia A น้ำหนัก 20 กิโลกรัม ปวดฟันกรามล่างขวาตอนกลางคืนมา 2 คืน ทานยาแก้ปวดมาตลอด ในรูปให้มาเป็นซี่ 85 ผุ OD มาถึงกลางฟัน 84 ผุocclusal ใกล้กับ distal marginal ridge ซี่ 46 ยังไม่ขึ้นแต่ใกล้จะขึ้น\nรักษาซี่ 85 อย่างไร",
      "choices": [
        {"label": "A", "text": "Pulpectomy with ZOE and SSC"},
        {"label": "B", "text": "Pulpectomy with MTA and SSC"},
        {"label": "C", "text": "Extraction and distal shoe space maintainer"},
        {"label": "D", "text": "Pulpotomy with formocresol and SSC"},
        {"label": "E", "text": "Pulpotomy with CaOH2"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมสำหรับเด็ก",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "คนไข้เด็กอายุ 5 ปี เป็น Hemophilia A น้ำหนัก 20 กิโลกรัม ปวดฟันกรามล่างขวาตอนกลางคืนมา 2 คืน ทานยาแก้ปวดมาตลอด ในรูปให้มาเป็นซี่ 85 ผุ OD มาถึงกลางฟัน 84 ผุocclusal ใกล้กับ distal marginal ridge ซี่ 46 ยังไม่ขึ้นแต่ใกล้จะขึ้น\nให้ยาแก้ปวดอย่างไร",
      "choices": [
        {"label": "A", "text": "Paracetamol 325 mg 1 tab po prn for pain q4h"},
        {"label": "B", "text": "Paracetamol 120 mg/5 ml 10 ml po prn for pain q4h"},
        {"label": "C", "text": "Paracetamol 120 mg/5 ml 15 ml po prn for pain q4h"},
        {"label": "D", "text": "Paracetamol 500 mg 1 tab po prn for pain q4h"},
        {"label": "E", "text": "Paracetamol 120 mg/5 ml 5 ml po prn for pain q4h"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมสำหรับเด็ก",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "คนไข้เด็กอายุ 5 ปี เป็น Hemophilia A น้ำหนัก 20 กิโลกรัม ปวดฟันกรามล่างขวาตอนกลางคืนมา 2 คืน ทานยาแก้ปวดมาตลอด ในรูปให้มาเป็นซี่ 85 ผุ OD มาถึงกลางฟัน 84 ผุocclusal ใกล้กับ distal marginal ridge ซี่ 46 ยังไม่ขึ้นแต่ใกล้จะขึ้น\nก่อนให้การรักษาควรตรวจอะไรเพิ่มเติม",
      "choices": [
        {"label": "A", "text": "Von Willebrand factor"},
        {"label": "B", "text": "PT, INR"},
        {"label": "C", "text": "Factor IX"},
        {"label": "D", "text": "Thrombin time"},
        {"label": "E", "text": "Factor VIII"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมสำหรับเด็ก",
      "task": "การวินิจฉัยโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "ฟันกรามซ้ายล่างแตกมา 1 วัน เสียวฟัน เคี้ยวเจ็บ ให้ภาพคลินิก ซี่ 36O amalgam แต่มี crown fracture โดยที่ ML cusp แตกหายทั้ง cusp, ไม่เหลือML wall, gingival wall เสมอขอบเหงือก, cusp อื่นยังอยู่ อมัลกัมก็เหมือนจะยังอยู่ ยังไม่ dislodge มั้ง แตกแค่เนื้อฟัน\nDelayed expansion ของ amalgam จากความชื้นระหว่างอุดเกิดจากอะไร",
      "choices": [
        {"label": "A", "text": "Tin"},
        {"label": "B", "text": "Mercury"},
        {"label": "C", "text": "Silver"},
        {"label": "D", "text": "Copper"},
        {"label": "E", "text": "Zinc"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมบูรณะ/หัตถการ",
      "task": "การเกิดและการดำเนินโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "ฟันกรามซ้ายล่างแตกมา 1 วัน เสียวฟัน เคี้ยวเจ็บ ให้ภาพคลินิก ซี่ 36O amalgam แต่มี crown fracture โดยที่ ML cusp แตกหายทั้ง cusp, ไม่เหลือML wall, gingival wall เสมอขอบเหงือก, cusp อื่นยังอยู่ อมัลกัมก็เหมือนจะยังอยู่ ยังไม่ dislodge มั้ง แตกแค่เนื้อฟัน\nถ่ายเอกเรย์อะไรเพื่อดูรอยแตกซี่ 36 ชัดเจนที่สุด",
      "choices": [
        {"label": "A", "text": "Paralleling periapical technique"},
        {"label": "B", "text": "Shift tube periapical"},
        {"label": "C", "text": "Panoramic radiograph"},
        {"label": "D", "text": "Occlusal cross-sectional radiograph"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมบูรณะ/หัตถการ",
      "task": "การวินิจฉัยโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "ฟันกรามซ้ายล่างแตกมา 1 วัน เสียวฟัน เคี้ยวเจ็บ ให้ภาพคลินิก ซี่ 36O amalgam แต่มี crown fracture โดยที่ ML cusp แตกหายทั้ง cusp, ไม่เหลือML wall, gingival wall เสมอขอบเหงือก, cusp อื่นยังอยู่ อมัลกัมก็เหมือนจะยังอยู่ ยังไม่ dislodge มั้ง แตกแค่เนื้อฟัน\nตรวจอะไรเพิ่มเติม",
      "choices": [
        {"label": "A", "text": "Hot test"},
        {"label": "B", "text": "Bite test"},
        {"label": "C", "text": "Cold test"},
        {"label": "D", "text": "Percussion"},
        {"label": "E", "text": "EPT"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมบูรณะ/หัตถการ",
      "task": "การวินิจฉัยโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "ชายอายุ 50 ปี สูบบุหรี่ 10 มวน สูบมา 20 ปี ดื่มเหล้าเป็นประจำ ตรวจพบ plaque score 60 พบ Probing depth 5-7 mm โดยทั่วไป\nบุหรี่มีผลอย่างไรต่อสภาพปริทันต์",
      "choices": [
        {"label": "A", "text": "ไม่เพิ่มความเสี่ยงในการเกิดโรคปริทันต์"},
        {"label": "B", "text": "การดำเนินของโรคในคนสูบมาก (Heavy smoker) สูบน้อย (Light smoker) ไม่ต่างกัน"},
        {"label": "C", "text": "ทำให้ภูมิคุ้มกันทำงานได้ลดลง"},
        {"label": "D", "text": "ระยะเวลาการหายของโรคปริทันต์ไม่สัมพันธ์กับระยะเวลาหลังเลิกสูบบุหรี่"},
        {"label": "E", "text": "พบเชื้อ A. Actinomycetemcomitans มากขึ้นในร่องปริทันต์"}
      ],
      "correct_answer": None,
      "category": "ปริทันตวิทยา",
      "task": "การเกิดและการดำเนินโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "ชายอายุ 50 ปี สูบบุหรี่ 10 มวน สูบมา 20 ปี ดื่มเหล้าเป็นประจำ ตรวจพบ plaque score 60 พบ Probing depth 5-7 mm โดยทั่วไป\nคนสูบบุหรี่ช่องปากต่างจากคนปกติอย่างไร",
      "choices": [
        {"label": "A", "text": "BOP ลดลง"},
        {"label": "B", "text": "เหงือกแดงมากกว่า"},
        {"label": "C", "text": "เหงือกบวมมากกว่า"},
        {"label": "D", "text": "PD น้อยกว่า"},
        {"label": "E", "text": "Dental plaque เยอะขึ้น"}
      ],
      "correct_answer": None,
      "category": "ปริทันตวิทยา",
      "task": "การเกิดและการดำเนินโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "ชายอายุ 50 ปี สูบบุหรี่ 10 มวน สูบมา 20 ปี ดื่มเหล้าเป็นประจำ ตรวจพบ plaque score 60 พบ Probing depth 5-7 mm โดยทั่วไป\nรอยโรคในช่องปากเกิดจากสาเหตุใด",
      "choices": [
        {"label": "A", "text": "E-cigarette smoking"},
        {"label": "B", "text": "Cigarette smoking"},
        {"label": "C", "text": "Smokeless tobacco use"},
        {"label": "D", "text": "Alcohol consumption"},
        {"label": "E", "text": "Poor oral hygiene"}
      ],
      "correct_answer": None,
      "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
      "task": "การเกิดและการดำเนินโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "(แต่ดู position A กว่านี้ distal cusp ขึ้นมาเหนือเลย แต่เหลื่อมๆกะ ramus ประมาณนี้แหละ) หญิง 20 ปี ให้รูป OPG ติด brackets มี 38 horizontal impaction ตาม Pell and gregory’s classification\nDiagnosis of 38",
      "choices": [
        {"label": "A", "text": "Class II position B"},
        {"label": "B", "text": "Class II position C"},
        {"label": "C", "text": "Class I position C"},
        {"label": "D", "text": "Class III position B"},
        {"label": "E", "text": "Class III position A"}
      ],
      "correct_answer": None,
      "category": "ศัลยศาสตร์ช่องปาก",
      "task": "การวินิจฉัยโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "(แต่ดู position A กว่านี้ distal cusp ขึ้นมาเหนือเลย แต่เหลื่อมๆกะ ramus ประมาณนี้แหละ) หญิง 20 ปี ให้รูป OPG ติด brackets มี 38 horizontal impaction ตาม Pell and gregory’s classification\nให้รูปเปิด flap แบบเปิด distal ใหญ่เบิ้ม flap อยู่แค่บริเวณซี่ 8 ถามว่าปัจจัยอะไรถึงต้องเปิด flap แบบนี้ (ซี่ 7 มีติดเหล็กจัดฟัน)",
      "choices": [
        {"label": "A", "text": "Depth of impaction"},
        {"label": "B", "text": "Angulation of impaction"},
        {"label": "C", "text": "Limitation of mouth opening"},
        {"label": "D", "text": "Molar buccal tube"},
        {"label": "E", "text": "ID nerve approximation"}
      ],
      "correct_answer": None,
      "category": "ศัลยศาสตร์ช่องปาก",
      "task": "ขั้นตอนและวิธีการรักษา",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "(แต่ดู position A กว่านี้ distal cusp ขึ้นมาเหนือเลย แต่เหลื่อมๆกะ ramus ประมาณนี้แหละ) หญิง 20 ปี ให้รูป OPG ติด brackets มี 38 horizontal impaction ตาม Pell and gregory’s classification\nจะเอาออกแล้วจะแบ่งฟันอย่างไร",
      "choices": [
        {"label": "A", "text": "2 ชิ้น Buccal segment & Lingual segment"},
        {"label": "B", "text": "2 ชิ้น Mesial segment & Distal segment"},
        {"label": "C", "text": "2 ชิ้น Crown segment & Root segment"},
        {"label": "D", "text": "3 ชิ้น Crown 2 segments & 1 Root segment"},
        {"label": "E", "text": "4 ชิ้น Crown 2 segments & 2 Root segments"}
      ],
      "correct_answer": None,
      "category": "ศัลยศาสตร์ช่องปาก",
      "task": "ขั้นตอนและวิธีการรักษา",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "ให้ภาพคลินิกและ x-ray periapical film ฟันหน้าบนมา เด็ก 9 ขวบ ฟันซี่ 11 หักมาเมื่อเช้า enemel dentin expose pulp ในฟิล์มปลายรากยังเปิดอยู่ เคี้ยวเจ็บ เคาะคลำเจ็บ ไม่โยก\nรักษาอย่างไร",
      "choices": [
        {"label": "A", "text": "Direct pulp capping with CF"},
        {"label": "B", "text": "Apexogenesis"},
        {"label": "C", "text": "Apexification"},
        {"label": "D", "text": "Pulpectomy"},
        {"label": "E", "text": "RCT"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมสำหรับเด็ก",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "ให้ภาพคลินิกและ x-ray periapical film ฟันหน้าบนมา เด็ก 9 ขวบ ฟันซี่ 11 หักมาเมื่อเช้า enemel dentin expose pulp ในฟิล์มปลายรากยังเปิดอยู่ เคี้ยวเจ็บ เคาะคลำเจ็บ ไม่โยก\nรักษารากแล้วทำอะไรเป็น final restoration",
      "choices": [
        {"label": "A", "text": "Composite core crown"},
        {"label": "B", "text": "Composite filling"},
        {"label": "C", "text": "Porcelain fused metal crown"},
        {"label": "D", "text": "All ceramic crown"},
        {"label": "E", "text": "Post core crown"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมสำหรับเด็ก",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "ให้ภาพคลินิกและ x-ray periapical film ฟันหน้าบนมา เด็ก 9 ขวบ ฟันซี่ 11 หักมาเมื่อเช้า enemel dentin expose pulp ในฟิล์มปลายรากยังเปิดอยู่ เคี้ยวเจ็บ เคาะคลำเจ็บ ไม่โยก\nตรวจอะไรเพิ่มเติม",
      "choices": [
        {"label": "A", "text": "EPT"},
        {"label": "B", "text": "Probe"},
        {"label": "C", "text": "Hot test"},
        {"label": "D", "text": "Cold test"},
        {"label": "E", "text": "Mobility"}
      ],
      "correct_answer": None,
      "category": "วิทยาเอ็นโดดอนต์",
      "task": "การวินิจฉัยโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "หญิงแท้อายุ 50 ปี มาด้วยเสียวฟันบนขวา เป็นๆ หายๆ arch บนมีฟัน erosion ให้ฟิล์ม peri มี lesion ที่ 14 เป็นฟัน erosion เยอะ ๆ บางซี่ erosion ถึง dentine 14 RR 15 Erosion ให้ xray 14 รอยโรคปลายรากใหญ่ 15 รอยโรคปลายรากเล็กกว่า 14\nLesion ที่ arch บนเกิดจากอะไร",
      "choices": [
        {"label": "A", "text": "Hyposalivation"},
        {"label": "B", "text": "Acidic food"},
        {"label": "C", "text": "ฟันสบกัน"},
        {"label": "D", "text": "แปรงฟันแรง"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมบูรณะ/หัตถการ",
      "task": "การเกิดและการดำเนินโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "หญิงแท้อายุ 50 ปี มาด้วยเสียวฟันบนขวา เป็นๆ หายๆ arch บนมีฟัน erosion ให้ฟิล์ม peri มี lesion ที่ 14 เป็นฟัน erosion เยอะ ๆ บางซี่ erosion ถึง dentine 14 RR 15 Erosion ให้ xray 14 รอยโรคปลายรากใหญ่ 15 รอยโรคปลายรากเล็กกว่า 14\nถ้าจะรักษารากซี่ 15 เสร็จแล้วจะบูรณะด้วยอะไร (ในฟิล์ม periapical & คลินิก เป็น O erosion)",
      "choices": [
        {"label": "A", "text": "Direct RMGIC"},
        {"label": "B", "text": "Direct composite"},
        {"label": "C", "text": "Zirconia crown"},
        {"label": "D", "text": "All ceramic crown"},
        {"label": "E", "text": "Post core crown"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมประดิษฐ์",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "หญิงแท้อายุ 50 ปี มาด้วยเสียวฟันบนขวา เป็นๆ หายๆ arch บนมีฟัน erosion ให้ฟิล์ม peri มี lesion ที่ 14 เป็นฟัน erosion เยอะ ๆ บางซี่ erosion ถึง dentine 14 RR 15 Erosion ให้ xray 14 รอยโรคปลายรากใหญ่ 15 รอยโรคปลายรากเล็กกว่า 14\nรักษาราก 14 (ฟิล์มรากโค้ง) ต้องระวังอะไรตอนขยายคลองราก",
      "choices": [
        {"label": "A", "text": "Missing canal"},
        {"label": "B", "text": "Lateral canal"},
        {"label": "C", "text": "Root curvature"},
        {"label": "D", "text": "Calcified Orifice"},
        {"label": "E", "text": "Calcified canal"}
      ],
      "correct_answer": None,
      "category": "วิทยาเอ็นโดดอนต์",
      "task": "ขั้นตอนและวิธีการรักษา",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "หญิง 20 ปี ไม่มีโรคประจำตัว มาตรวจสุขภาพทุก 6 เดือน ให้ ฟิล์มฟันซี่ 44 - 47 มีรอยผุที่ 47 ผุ (inner ½ enamel) บางคนบอก (outer ½ enamel) และเห็นปลายรากซี่ 45 มีเงาดำ (แต่ไม่น่าใช่ lesion) แต่เงาดำใหญ่ตกฟิล์ม ฟัน ซี่ 46O มี radiolucent\n47M ควรรักษาอย่างไร",
      "choices": [
        {"label": "A", "text": "Buccal slot restoration with RMGIC"},
        {"label": "B", "text": "Occlusal slot restoration with composite"},
        {"label": "C", "text": "Tunnel preparation with composite"},
        {"label": "D", "text": "5000 ppm Fluoride toothpaste"},
        {"label": "E", "text": "OHI with motivation"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมบูรณะ/หัตถการ",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "หญิง 20 ปี ไม่มีโรคประจำตัว มาตรวจสุขภาพทุก 6 เดือน ให้ ฟิล์มฟันซี่ 44 - 47 มีรอยผุที่ 47 ผุ (inner ½ enamel) บางคนบอก (outer ½ enamel) และเห็นปลายรากซี่ 45 มีเงาดำ (แต่ไม่น่าใช่ lesion) แต่เงาดำใหญ่ตกฟิล์ม ฟัน ซี่ 46O มี radiolucent\nClassification ในฟิล์มลักษณะรอยผุ 47M",
      "choices": [
        {"label": "A", "text": "RA1"},
        {"label": "B", "text": "RA2"},
        {"label": "C", "text": "RA3"},
        {"label": "D", "text": "RB4"},
        {"label": "E", "text": "RC5"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมบูรณะ/หัตถการ",
      "task": "การวินิจฉัยโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "หญิง 20 ปี ไม่มีโรคประจำตัว มาตรวจสุขภาพทุก 6 เดือน ให้ ฟิล์มฟันซี่ 44 - 47 มีรอยผุที่ 47 ผุ (inner ½ enamel) บางคนบอก (outer ½ enamel) และเห็นปลายรากซี่ 45 มีเงาดำ (แต่ไม่น่าใช่ lesion) แต่เงาดำใหญ่ตกฟิล์ม ฟัน ซี่ 46O มี radiolucent\nถ้าต้องการข้อมูลเพิ่มเติมของเงาดำบริเวณปลายราก 45 ต้องถ่ายอะไรเพิ่ม",
      "choices": [
        {"label": "A", "text": "Premolar periapical radiograph"},
        {"label": "B", "text": "Premolar vertical bitewing"},
        {"label": "C", "text": "Occlusal topography"},
        {"label": "D", "text": "Panoramic radiograph"},
        {"label": "E", "text": "Premolar horizontal bitewing"}
      ],
      "correct_answer": None,
      "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
      "task": "การวินิจฉัยโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "เด็กผู้หญิง 10 ขวบ น้ำหนัก 30 kg คางซ้ายบวมโย้ ปวด เป็นไข้ อิดโรย ภาพคลินิก 36 ผุ OD เบิ้ม ๆ x-ray 36 ผุทะลุ มี lesion ปลายราก ดู 74, 75 บึ้ม ๆ\nเด็กมีอาการแย่ลงหลังให้ antibiotic ไปแล้ว 2 วัน จะ I&D ต้องระงับอย่างไรเพื่อระบายหนอง",
      "choices": [
        {"label": "A", "text": "GA with endotracheal tube"},
        {"label": "B", "text": "LA + IV ยา midazolam"},
        {"label": "C", "text": "LA + IV ยา fentanyl"},
        {"label": "D", "text": "LA + nitrous oxide"},
        {"label": "E", "text": "LA + oral chloral hydrate"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมสำหรับเด็ก",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "เด็กผู้หญิง 10 ขวบ น้ำหนัก 30 kg คางซ้ายบวมโย้ ปวด เป็นไข้ อิดโรย ภาพคลินิก 36 ผุ OD เบิ้ม ๆ x-ray 36 ผุทะลุ มี lesion ปลายราก ดู 74, 75 บึ้ม ๆ\nหลังรักษาราก 36 บูรณะยังไง",
      "choices": [
        {"label": "A", "text": "Composite Filling"},
        {"label": "B", "text": "Composite core + temporary crown"},
        {"label": "C", "text": "Composite core + PFM crown"},
        {"label": "D", "text": "Metal post + FMC crown"},
        {"label": "E", "text": "Metal post + PFM crown"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมสำหรับเด็ก",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "เด็กผู้หญิง 10 ขวบ น้ำหนัก 30 kg คางซ้ายบวมโย้ ปวด เป็นไข้ อิดโรย ภาพคลินิก 36 ผุ OD เบิ้ม ๆ x-ray 36 ผุทะลุ มี lesion ปลายราก ดู 74, 75 บึ้ม ๆ\nให้ยาแก้ปวดอะไร ถ้าจะถอน 74 75",
      "choices": [
        {"label": "A", "text": "Acetaminophen 250 mg po prn for pain q12h"},
        {"label": "B", "text": "Ibuprofen 250 mg po prn for pain q6h"},
        {"label": "C", "text": "Tramadol"},
        {"label": "D", "text": "Naproxen 300 mg po prn for pain q12h"},
        {"label": "E", "text": "Hydrocodone"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมสำหรับเด็ก",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "เด็ก 7 ขวบ กลัวการทำฟันมาก ไม่เคยทำฟันมาก่อน ฟันล่างซ้อน ให้รูป arch ล่าง ซี่ 1, 6 แท้ขึ้นแล้ว 32, 42 partial eruption ทาง Li ของ 72, 82 (น้ำนมโยก 2nd)\nสาเหตุของการเกิดคืออะไร",
      "choices": [
        {"label": "A", "text": "หน่อฟันแท้ขึ้น lingual ต่อฟันน้ำนม ซึ่งเป็นพัฒนาการที่ปกติ"},
        {"label": "B", "text": "แรงลิ้นดันเยอะกว่าแรงจากริมฝีปาก ทำให้ฟันน้ำนมล้มไปทาง LA"},
        {"label": "C", "text": "Canine แท้ 33, 43 ชน 32, 42"},
        {"label": "D", "text": "รากฟัน 72, 82 ละลายช้า"},
        {"label": "E", "text": "Arch ล่างเล็กเกิน ไม่พอขนาดฟัน"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมสำหรับเด็ก",
      "task": "การเกิดและการดำเนินโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "เด็ก 7 ขวบ กลัวการทำฟันมาก ไม่เคยทำฟันมาก่อน ฟันล่างซ้อน ให้รูป arch ล่าง ซี่ 1, 6 แท้ขึ้นแล้ว 32, 42 partial eruption ทาง Li ของ 72, 82 (น้ำนมโยก 2nd)\nProper management",
      "choices": [
        {"label": "A", "text": "รอหลุดตามธรรมชาติ"},
        {"label": "B", "text": "ถอน 72, 82"},
        {"label": "C", "text": "รอให้ 72, 82 โยก 3 degree แล้วค่อยถอน"},
        {"label": "D", "text": "ถอน 72, 82 ร่วมกับจัดฟัน"},
        {"label": "E", "text": "ถอน 72, 73, 82, 83"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมสำหรับเด็ก",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "เด็ก 7 ขวบ กลัวการทำฟันมาก ไม่เคยทำฟันมาก่อน ฟันล่างซ้อน ให้รูป arch ล่าง ซี่ 1, 6 แท้ขึ้นแล้ว 32, 42 partial eruption ทาง Li ของ 72, 82 (น้ำนมโยก 2nd)\nBehaviour management อย่างแรกที่ควรทำคือ",
      "choices": [
        {"label": "A", "text": "Tell show do"},
        {"label": "B", "text": "Voice control"},
        {"label": "C", "text": "Parent absence"},
        {"label": "D", "text": "Active restraint"},
        {"label": "E", "text": "Passive restraint"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมสำหรับเด็ก",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "คนไข้เพศหญิงอายุ 50 ปี ปวดหูทั้งสองข้าง เคยรับการรักษาจัดฟันร่วมกับผ่าตัดขากรรไกร ให้รูปฟันล่างมามีติด fixation ที่ mand และ max อยู่ ตอนนี้มีอาการปวดกล้ามเนื้อ ฟันสึกที่ non-functional cusp ทั่วไป มี frenum เกาะข้างค่อนสูง และridge มี bone loss\nถ้าจะดูรายละเอียดกระดูกข้อต่อขากรรไกรให้เหมือนจริงที่สุด จะถ่ายอะไรเพิ่ม",
      "choices": [
        {"label": "A", "text": "MRI TMJ"},
        {"label": "B", "text": "CBCT"},
        {"label": "C", "text": "Lateral transcranial"},
        {"label": "D", "text": "Reverse Towne's radiograph"}
      ],
      "correct_answer": None,
      "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
      "task": "การวินิจฉัยโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "คนไข้เพศหญิงอายุ 50 ปี ปวดหูทั้งสองข้าง เคยรับการรักษาจัดฟันร่วมกับผ่าตัดขากรรไกร ให้รูปฟันล่างมามีติด fixation ที่ mand และ max อยู่ ตอนนี้มีอาการปวดกล้ามเนื้อ ฟันสึกที่ non-functional cusp ทั่วไป มี frenum เกาะข้างค่อนสูง และridge มี bone loss\nจะให้การรักษาไรกับผู้ป่วยรายนี้",
      "choices": [
        {"label": "A", "text": "ประคบอุ่น"},
        {"label": "B", "text": "Occlusal adjustment"},
        {"label": "C", "text": "Self care และทำ occlusal splint"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "คนไข้เพศหญิงอายุ 50 ปี ปวดหูทั้งสองข้าง เคยรับการรักษาจัดฟันร่วมกับผ่าตัดขากรรไกร ให้รูปฟันล่างมามีติด fixation ที่ mand และ max อยู่ ตอนนี้มีอาการปวดกล้ามเนื้อ ฟันสึกที่ non-functional cusp ทั่วไป มี frenum เกาะข้างค่อนสูง และridge มี bone loss\nก่อน implant ต้องทำอะไร",
      "choices": [
        {"label": "A", "text": "Frenectomy + Gingival graft"},
        {"label": "B", "text": "Ridge augmentation + Frenectomy"},
        {"label": "C", "text": "Mucoperiosteal surgery"}
      ],
      "correct_answer": None,
      "category": "ปริทันตวิทยา",
      "task": "ขั้นตอนและวิธีการรักษา",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "ชาย 50 ปี มีหนอง บริเวณซี่ 36 มาเดือนนึงมีอาการปวด บวม รูปมี bone โผล่ เคยฉายรังสีรักษามะเร็ง H&N เมื่อ 5 ปี ก่อน บริเวณ head and neck ให้รูปสองรูปเป็น หนองบริเวณซี่ 36 และ รูปหลัง irrigate แล้วเห็นเป็น bone exposed\nล้าง Normal saline solution แล้วพบว่า buccal bone ขยับได้ ควรทำอย่างไร",
      "choices": [
        {"label": "A", "text": "เย็บปิด"},
        {"label": "B", "text": "ล้างด้วย hydrogen peroxide"},
        {"label": "C", "text": "เปิด flap เพื่อนำชิ้นกระดูกออก"},
        {"label": "D", "text": "ใส่ Alvogyl"},
        {"label": "E", "text": "ถ่าย panoramic radiograph"}
      ],
      "correct_answer": None,
      "category": "ศัลยศาสตร์ช่องปาก",
      "task": "ขั้นตอนและวิธีการรักษา",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "ชาย 50 ปี มีหนอง บริเวณซี่ 36 มาเดือนนึงมีอาการปวด บวม รูปมี bone โผล่ เคยฉายรังสีรักษามะเร็ง H&N เมื่อ 5 ปี ก่อน บริเวณ head and neck ให้รูปสองรูปเป็น หนองบริเวณซี่ 36 และ รูปหลัง irrigate แล้วเห็นเป็น bone exposed\ndiagnose ว่าอาจเป็นไปได้จากสาเหตุอะไร",
      "choices": [
        {"label": "A", "text": "ไม่ได้ให้ antibiotic"},
        {"label": "B", "text": "บาดเจ็บระหว่างถอน"},
        {"label": "C", "text": "Remaining granulation tissue"},
        {"label": "D", "text": "Oral hygiene status"},
        {"label": "E", "text": "Unknown systemic disease"}
      ],
      "correct_answer": None,
      "category": "ศัลยศาสตร์ช่องปาก",
      "task": "การเกิดและการดำเนินโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "ชาย 50 ปี มีหนอง บริเวณซี่ 36 มาเดือนนึงมีอาการปวด บวม รูปมี bone โผล่ เคยฉายรังสีรักษามะเร็ง H&N เมื่อ 5 ปี ก่อน บริเวณ head and neck ให้รูปสองรูปเป็น หนองบริเวณซี่ 36 และ รูปหลัง irrigate แล้วเห็นเป็น bone exposed\nปัจจัยเสริมเพื่อช่วยในการวินิจฉัย",
      "choices": [
        {"label": "A", "text": "ตำแหน่งที่เป็นมะเร็ง"},
        {"label": "B", "text": "ระยะเวลาหลังผ่าตัดมะเร็ง"},
        {"label": "C", "text": "ประวัติได้รับเคมีบำบัด"},
        {"label": "D", "text": "น้ำลายแห้ง"},
        {"label": "E", "text": "ต่อมน้ำเหลืองที่คอโต"}
      ],
      "correct_answer": None,
      "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
      "task": "การวินิจฉัยโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "คนไข้หญิง 65 ปี ไม่มีฟัน เคยทำงานรับจ้างที่กรุงเทพมาตลอด เกษียณแล้วกลับไปอยู่บ้านเกิด ไม่สนิทกับเพื่อนบ้าน เลยเป็นโรคซึมเศร้า และเจ็บป่วย\nสาเหตุที่ทำให้การเจ็บป่วย เกิดจากสุขภาพด้านใด",
      "choices": [
        {"label": "A", "text": "สังคม"},
        {"label": "B", "text": "กาย"},
        {"label": "C", "text": "ปัญญา"},
        {"label": "D", "text": "จิตใจ"},
        {"label": "E", "text": "จิตวิญญาณ"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมชุมชน",
      "task": "การเกิดและการดำเนินโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "คนไข้หญิง 65 ปี ไม่มีฟัน เคยทำงานรับจ้างที่กรุงเทพมาตลอด เกษียณแล้วกลับไปอยู่บ้านเกิด ไม่สนิทกับเพื่อนบ้าน เลยเป็นโรคซึมเศร้า และเจ็บป่วย\nทำโครงการอะไร ที่ใช้แนวคิดการมีส่วนร่วมของชุมชน",
      "choices": [
        {"label": "A", "text": "สร้างที่ออกกำลังกายในชุมชน"},
        {"label": "B", "text": "ให้อาสาสมัครนำยาซึมเศร้าให้ผู้ป่วยทุกเช้า"},
        {"label": "C", "text": "ให้เพื่อนบ้านชวนผู้ป่วยไปเข้าชมรมผู้สูงอายุ"},
        {"label": "D", "text": "จัดให้มีการตรวจคัดกรองโรคซึมเศร้า"},
        {"label": "E", "text": "จัดอบรมให้ความรู้โรคซึมเศร้า"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมชุมชน",
      "task": "การสร้างเสริมสุขภาพและการป้องกัน",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "คนไข้หญิง 65 ปี ไม่มีฟัน เคยทำงานรับจ้างที่กรุงเทพมาตลอด เกษียณแล้วกลับไปอยู่บ้านเกิด ไม่สนิทกับเพื่อนบ้าน เลยเป็นโรคซึมเศร้า และเจ็บป่วย\nไปหาหมอฟัน หมอฟันตรวจแล้วบอกว่าต้องทำฟันปลอม การรักษานี้จัดเป็นแบบไหน",
      "choices": [
        {"label": "A", "text": "Primordial care"},
        {"label": "B", "text": "Priparative care"},
        {"label": "C", "text": "Primary care"},
        {"label": "D", "text": "Secondary care"},
        {"label": "E", "text": "Tertiary care"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมชุมชน",
      "task": "การวินิจฉัยโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "ผู้ป่วยเพศหญิง อายุ 30 ปี มีปัญหาเสียวฟันหน้าซี่ 21 เวลากินน้ำเย็น เคยอุด 21M แล้วหลุดมาหลายครั้งแล้ว (ให้ periapical film ฟันหน้า มีวัสดุอุด composite 21M ขอบดูขรุขระ incisal ยื่นกว่าซี่ข้าง ๆ นิด ๆ)\nถ้าจะสร้าง Perikymata จะใช้หัวกรอใด",
      "choices": [
        {"label": "A", "text": "Needle-shaped tungsten bur"},
        {"label": "B", "text": "Round White stone bur"},
        {"label": "C", "text": "Silicone cup-shaped bur"},
        {"label": "D", "text": "Aluminum oxide finishing strip"},
        {"label": "E", "text": "Silicon carbide disc"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมบูรณะ/หัตถการ",
      "task": "ขั้นตอนและวิธีการรักษา",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "ผู้ป่วยเพศหญิง อายุ 30 ปี มีปัญหาเสียวฟันหน้าซี่ 21 เวลากินน้ำเย็น เคยอุด 21M แล้วหลุดมาหลายครั้งแล้ว (ให้ periapical film ฟันหน้า มีวัสดุอุด composite 21M ขอบดูขรุขระ incisal ยื่นกว่าซี่ข้าง ๆ นิด ๆ)\nถ้าจะอุดฟันใหม่ให้คนไข้ต้องคำนึงถึงสิ่งใดมากที่สุด",
      "choices": [
        {"label": "A", "text": "Occlusal scheme"},
        {"label": "B", "text": "Dietary Pattern"},
        {"label": "C", "text": "Enamel structure"},
        {"label": "D", "text": "OH"},
        {"label": "E", "text": "RDT"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมบูรณะ/หัตถการ",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "ผู้ป่วยเพศหญิง อายุ 30 ปี มีปัญหาเสียวฟันหน้าซี่ 21 เวลากินน้ำเย็น เคยอุด 21M แล้วหลุดมาหลายครั้งแล้ว (ให้ periapical film ฟันหน้า มีวัสดุอุด composite 21M ขอบดูขรุขระ incisal ยื่นกว่าซี่ข้าง ๆ นิด ๆ)\nถ้าพิจารณาถอนฟันซี่ 11 แล้วใช้ forcep ด้วยแรงที่เหมาะสมโยกจนหลวมแล้ว แต่ไม่สามารถนำฟันออกมาได้ จะทำอย่างไรต่อ",
      "choices": [
        {"label": "A", "text": "ใช้แรงที่มากขึ้น"},
        {"label": "B", "text": "ใช้ Luxator ขนาดใหญ่ ใส่ลงไปที่ด้าน Buccal bone"},
        {"label": "C", "text": "ใช้ Bayonet elevator งัด"},
        {"label": "D", "text": "ใช้ Root forceps"},
        {"label": "E", "text": "Surgical removal"}
      ],
      "correct_answer": None,
      "category": "ศัลยศาสตร์ช่องปาก",
      "task": "ขั้นตอนและวิธีการรักษา",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "ขัด amalgam (ที่ marginal ridge มันแหลมๆ ยังไม่ได้) ใช้หัวอะไร",
      "choices": [
        {"label": "A", "text": "Alumiumoxide disc"},
        {"label": "B", "text": "Round finishing bur"},
        {"label": "C", "text": "Abrasive strip"},
        {"label": "D", "text": "Tungsten needle"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมบูรณะ/หัตถการ",
      "task": "ขั้นตอนและวิธีการรักษา",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "คนไข้ชายอายุ 70 ปี รูป x-ray ฟัน molar มี caries nearly exposed pulp จะ remove caries ด้วยเทคนิคใด",
      "choices": [
        {"label": "A", "text": "Stepwise technique"},
        {"label": "B", "text": "Selective caries removal to soft dentin"},
        {"label": "C", "text": "Non-selective caries removal"}
      ],
      "correct_answer": None,
      "category": "ทันตกรรมบูรณะ/หัตถการ",
      "task": "ขั้นตอนและวิธีการรักษา",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "ฟันซี่15 มี PD ด้าน distal 6 mm หลัง ScRp แล้วยังมี PD เหลือ จะทำอะไรในขั้น corrective phase ให้รูป x-ray มาด้วย เป็น horizontal bone loss ไม่มีซี่ 16",
      "choices": [
        {"label": "A", "text": "Distal wedge"},
        {"label": "B", "text": "Bone graft"},
        {"label": "C", "text": "Resective bone"},
        {"label": "D", "text": "Frenectomy+ridge augmentation"},
        {"label": "E", "text": "soft tissue graft"},
        {"label": "F", "text": "ridge augmentation"}
      ],
      "correct_answer": None,
      "category": "ปริทันตวิทยา",
      "task": "การจัดการและการรักษาผู้ป่วย",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "ผู้ป่วยหญิงทานของเผ็ดแล้วแสบร้อนมา 2 เดือน ให้รูปเป็นรอยขาวแดงข้างแก้ม\nถามว่ามันคืออะไร",
      "choices": [
        {"label": "A", "text": "Oral lichen planus"}
      ],
      "correct_answer": None,
      "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
      "task": "การวินิจฉัยโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    },
    {
      "question_text": "ผู้ป่วยหญิงทานของเผ็ดแล้วแสบร้อนมา 2 เดือน ให้รูปเป็นรอยขาวแดงข้างแก้ม\nให้รูป histo OLP ถามว่าลักษณะยังไง",
      "choices": [
        {"label": "A", "text": "band-like infiltration of lymphocytes"},
        {"label": "B", "text": "increase mitotic activity"},
        {"label": "C", "text": "hyperchromatism"}
      ],
      "correct_answer": None,
      "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
      "task": "การวินิจฉัยโรค",
      "explanation": None,
      "image_paths": [],
      "source_exam": "NL 2 2566 part 3.pdf"
    }
  ]
}

target_file = '/Users/admin/Downloads/NL Test/parsed_exams/NL_2_2566_Part_3.json'
os.makedirs(os.path.dirname(target_file), exist_ok=True)
with open(target_file, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
print("JSON saved successfully.")
