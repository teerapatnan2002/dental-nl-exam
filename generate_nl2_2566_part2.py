import json

data = {
    "questions": [
        {
            "question_text": "STEM 1: ชาย 50 ปี มีกลิ่นปาก เป็น DM HbA1c 8.5% PD ทั่วๆไป 4-6 mm ให้รูป X-ray PA 14-17 มี bone loss ประมาณ 50% (16 no periapical lesion มั้ง มนจ)\n1. ถ้าที่อื่นในปากมีลักษณะคล้าย Q1 และมี 1 mobility ปัจจัยสำคัญที่ทำให้ผู้ป่วยเป็นมากขึ้นคืออะไร",
            "choices": [
                {"label": "1", "text": "Uncontrolled DM"},
                {"label": "2", "text": "ฟันมี mobility"},
                {"label": "3", "text": "ชนิดของเชื้อก่อโรค"},
                {"label": "4", "text": "ไม่ใช้ไหมขัดฟัน"},
                {"label": "5", "text": "แปรงฟันผิดวิธี"}
            ],
            "correct_answer": None,
            "category": "ปริทันตวิทยา",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 1: ชาย 50 ปี มีกลิ่นปาก เป็น DM HbA1c 8.5% PD ทั่วๆไป 4-6 mm ให้รูป X-ray PA 14-17 มี bone loss ประมาณ 50% (16 no periapical lesion มั้ง มนจ)\n2. ถ้าเอา Paperpoint จุ่มใน sulcus ซี่ 16M ที่มี bone loss เอาไปตรวจเชื้อจะพบเชื้อกลุ่มไหน",
            "choices": [
                {"label": "1", "text": "กลุ่มที่พบมากสุดคือ gram-ve facultative aerobe"},
                {"label": "2", "text": "กลุ่มที่พบมากสุดคือ gram+ve facultative aerobe"},
                {"label": "3", "text": "สัดส่วนเชื้อ gram-ve anaerobe > gram+ve anaerobe"},
                {"label": "4", "text": "สัดส่วนเชื้อ gram+ve anaerobe > gram-ve anaerobe"},
                {"label": "5", "text": "สัดส่วนเชื้อ gram-ve anaerobe > gram + anaerobe"}
            ],
            "correct_answer": None,
            "category": "ปริทันตวิทยา",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 1: ชาย 50 ปี มีกลิ่นปาก เป็น DM HbA1c 8.5% PD ทั่วๆไป 4-6 mm ให้รูป X-ray PA 14-17 มี bone loss ประมาณ 50% (16 no periapical lesion มั้ง มนจ)\n3. หลังขูดหินปูนคนไข้บอกว่าเสียวฟัน กลไกของ NaF gel ที่ทันตแพทย์ทาลดเสียวคืออะไร",
            "choices": [
                {"label": "1", "text": "Formation of tertiary dentin"},
                {"label": "2", "text": "Blocking of neural transmission signal"},
                {"label": "3", "text": "Nerve depolarization"},
                {"label": "4", "text": "Dentinal tubule obliteration"},
                {"label": "5", "text": "Precipitating of serum protein in dentinal fluid"}
            ],
            "correct_answer": None,
            "category": "ปริทันตวิทยา",
            "task": "ขั้นตอนและวิธีการรักษา",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 2: [รูปที่ 1: ให้รูปในปาก ฟันค่อนข้างเยอะ stain,calculusเยอะทั้งปาก มี NCCL แถวๆซี่ 3,4,5 ทุก quadrant] [รูปที่ 2: x-ray ซี่16 มีวัสดุอุด OM ใหญ่บึ้มๆ ลึกถึง pulp] ชายอายุ 60 ปี CC ปวดฟันกรามบนขวา 16 initial endodontic therapy มา\n4. รูปร่าง OC ของซี่ 16",
            "choices": [
                {"label": "1", "text": "สามเหลี่ยมด้านเท่า"},
                {"label": "2", "text": "สามเหลี่ยมที่ฐานอยู่ B"},
                {"label": "3", "text": "สามเหลี่ยมที่ฐานอยู่ Pa"},
                {"label": "4", "text": "สี่เหลี่ยมคางหมู"},
                {"label": "5", "text": "สี่เหลี่ยมผืนผ้า"}
            ],
            "correct_answer": None,
            "category": "วิทยาเอ็นโดดอนต์",
            "task": "ขั้นตอนและวิธีการรักษา",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 2: [รูปที่ 1: ให้รูปในปาก ฟันค่อนข้างเยอะ stain,calculusเยอะทั้งปาก มี NCCL แถวๆซี่ 3,4,5 ทุก quadrant] [รูปที่ 2: x-ray ซี่16 มีวัสดุอุด OM ใหญ่บึ้มๆ ลึกถึง pulp] ชายอายุ 60 ปี CC ปวดฟันกรามบนขวา 16 initial endodontic therapy มา\n5. Tx plan ทั้งปาก",
            "choices": [
                {"label": "1", "text": "Emergency endo -> ScRP -> Filling -> Endo tx."},
                {"label": "2", "text": "Emergency endo -> Endo tx. -> Filling -> ScRP"},
                {"label": "3", "text": "Endodontic treatment > Filling -> ScRP"},
                {"label": "4", "text": "Filling -> ScRP -> Endo tx"},
                {"label": "5", "text": "ScRP -> Endo tx. -> Filling"}
            ],
            "correct_answer": None,
            "category": "วิทยาเอ็นโดดอนต์",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 2: [รูปที่ 1: ให้รูปในปาก ฟันค่อนข้างเยอะ stain,calculusเยอะทั้งปาก มี NCCL แถวๆซี่ 3,4,5 ทุก quadrant] [รูปที่ 2: x-ray ซี่16 มีวัสดุอุด OM ใหญ่บึ้มๆ ลึกถึง pulp] ชายอายุ 60 ปี CC ปวดฟันกรามบนขวา 16 initial endodontic therapy มา\n6. ซี่ 16 ต้องทำการรักษาใดเป็นลำดับต่อไป",
            "choices": [
                {"label": "1", "text": "การบำบัดฉุกเฉิน"},
                {"label": "2", "text": "การรักษาคลองราก"},
                {"label": "3", "text": "จ่ายยา Amoxicillin 500 mg x 20 cap"},
                {"label": "4", "text": "จ่ายยา Ibuprofen 400 mg x 10 tab"},
                {"label": "5", "text": "ตรวจเพิ่มเติมเพื่อ definitive diagnosis"}
            ],
            "correct_answer": None,
            "category": "วิทยาเอ็นโดดอนต์",
            "task": "ขั้นตอนและวิธีการรักษา",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 3: ตรวจพบฟันซี่ 12-22 มี fremitus ขณะเคี้ยว และมีสภาพปริทันต์ดังรูป (ให้ภาพปากเยิน ๆ ฟันหน้าบน 4 ซี่ยังไม่มี black triangle)\n7. ให้การรักษาที่เหมาะสมอย่างไร",
            "choices": [
                {"label": "1", "text": "ขูดหินปูนและเกลารากฟัน"},
                {"label": "2", "text": "ขูดหินปูนและเกลารากฟัน ร่วมกับใช้ยาปฏิชีวนะเฉพาะที่"},
                {"label": "3", "text": "ขูดหินปูนและเกลารากฟัน แล้วยึดฟันด้วยลวดและคอมโพสิต"},
                {"label": "4", "text": "ขูดหินปูนและเกลารากฟันก่อน กรอแก้สบฟัน"},
                {"label": "5", "text": "กรอแก้สบฟันก่อน ขูดหินปูนและเกลารากฟัน"}
            ],
            "correct_answer": None,
            "category": "ปริทันตวิทยา",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 3: ตรวจพบฟันซี่ 12-22 มี fremitus ขณะเคี้ยว และมีสภาพปริทันต์ดังรูป (ให้ภาพปากเยิน ๆ ฟันหน้าบน 4 ซี่ยังไม่มี black triangle)\n8. หลังการขูดหินปูนในขั้น hygienic phase เป็นการหายแบบใด",
            "choices": [
                {"label": "1", "text": "Long junctional epithelium"},
                {"label": "2", "text": "New attachment"},
                {"label": "3", "text": "Reattachment"},
                {"label": "4", "text": "Regeneration"},
                {"label": "5", "text": "Recession"}
            ],
            "correct_answer": None,
            "category": "ปริทันตวิทยา",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 3: ตรวจพบฟันซี่ 12-22 มี fremitus ขณะเคี้ยว และมีสภาพปริทันต์ดังรูป (ให้ภาพปากเยิน ๆ ฟันหน้าบน 4 ซี่ยังไม่มี black triangle)\n9. ให้รูปหลังรักษาเสร็จ ถามว่า Black triangle ฟันหน้าบนเกิดจากอะไร (ให้ periapical 21-22 มามี bone loss ประมาณ 50%)",
            "choices": [
                {"label": "1", "text": "Improper dental zenith"},
                {"label": "2", "text": "Tooth size discrepancy"},
                {"label": "3", "text": "Vertical bone loss"},
                {"label": "4", "text": "Triangular shape tooth"},
                {"label": "5", "text": "Improper tooth contact"}
            ],
            "correct_answer": None,
            "category": "ปริทันตวิทยา",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 4: ผู้ป่วยหญิง อายุ 40 ปี มี fremitus ซี่ 22 ให้ภาพรังสีซี่ 22 bone loss ด้าน mesial ประมาณ ½ ราก\n10. มี Bone loss แบบไหน",
            "choices": [
                {"label": "1", "text": "Vertical bone loss > 50% ที่ด้าน mesial"},
                {"label": "2", "text": "Vertical bone loss < 50% ที่ด้าน mesial"},
                {"label": "3", "text": "Horizontal bone loss 50% ด้าน mesial"},
                {"label": "4", "text": "Circumferential bone loss 50%"},
                {"label": "5", "text": "มี Crestal bone ด้าน mesial"}
            ],
            "correct_answer": None,
            "category": "ปริทันตวิทยา",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 4: ผู้ป่วยหญิง อายุ 40 ปี มี fremitus ซี่ 22 ให้ภาพรังสีซี่ 22 bone loss ด้าน mesial ประมาณ ½ ราก\n11. ฟันหน้าบน pocket 5-8 mm ใช้เครื่องมือใดเหมาะสมที่สุด",
            "choices": [
                {"label": "1", "text": "Anterior sickle"},
                {"label": "2", "text": "Universal curette 4R/4L"},
                {"label": "3", "text": "Minifive gracey curette ¾"},
                {"label": "4", "text": "Gracey curette ⅞"},
                {"label": "5", "text": "Piezo ultrasonic scaler"}
            ],
            "correct_answer": None,
            "category": "ปริทันตวิทยา",
            "task": "ขั้นตอนและวิธีการรักษา",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 4: ผู้ป่วยหญิง อายุ 40 ปี มี fremitus ซี่ 22 ให้ภาพรังสีซี่ 22 bone loss ด้าน mesial ประมาณ ½ ราก\n12. ซี่ 22 มี boneloss ประมาณ 50% สาเหตุใดทำให้ฟันหน้าห่าง",
            "choices": [
                {"label": "1", "text": "Periodontal abscess"},
                {"label": "2", "text": "Primary occlusal trauma"},
                {"label": "3", "text": "Secondary occlusal trauma"},
                {"label": "4", "text": ""},
                {"label": "5", "text": ""}
            ],
            "correct_answer": None,
            "category": "ปริทันตวิทยา",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 5: ผู้ป่วยชาย อายุ 50 ปี ไม่มีโรคประจำตัว แพ้ยา มาด้วย bridge 13-15 หลุดไป 1 วัน ไม่มีอาการ ทำมาเป็น 10 ปีแล้ว ไม่เคยรักษารากทั้ง2 ซี่(15,13) ปฏิเสธการทำรากเทียมให้รูปในช่องปากมา 2 รูป\n13. ถ้าทำ bridge 13-16 design occlusion แบบไหน",
            "choices": [
                {"label": "1", "text": "Bilateral balanced"},
                {"label": "2", "text": "Group function"},
                {"label": "3", "text": "Unilateral balanced"},
                {"label": "4", "text": "Canine protected"},
                {"label": "5", "text": "Lingualized protected"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมประดิษฐ์",
            "task": "ขั้นตอนและวิธีการรักษา",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 5: ผู้ป่วยชาย อายุ 50 ปี ไม่มีโรคประจำตัว แพ้ยา มาด้วย bridge 13-15 หลุดไป 1 วัน ไม่มีอาการ ทำมาเป็น 10 ปีแล้ว ไม่เคยรักษารากทั้ง2 ซี่(15,13) ปฏิเสธการทำรากเทียมให้รูปในช่องปากมา 2 รูป\n14. ถ้าไม่ทำ bridge ทำไรดี",
            "choices": [
                {"label": "1", "text": "15 extract 13 crown RPD"},
                {"label": "2", "text": "15 extract resin bond bridge"},
                {"label": "3", "text": "15 RCT + metal coping 13 crown RPD"},
                {"label": "4", "text": "15 RCT + composite coping 13 crown ARPD"},
                {"label": "5", "text": "15 extract conventional bridge"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมประดิษฐ์",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 5: ผู้ป่วยชาย อายุ 50 ปี ไม่มีโรคประจำตัว แพ้ยา มาด้วย bridge 13-15 หลุดไป 1 วัน ไม่มีอาการ ทำมาเป็น 10 ปีแล้ว ไม่เคยรักษารากทั้ง2 ซี่(15,13) ปฏิเสธการทำรากเทียมให้รูปในช่องปากมา 2 รูป\n15. ให้ pa 16 มา ถามว่าซี่นี้แปลกยังไง",
            "choices": [
                {"label": "1", "text": "Taurodontia"},
                {"label": "2", "text": "Supernumerary root"},
                {"label": "3", "text": "Dilaceration"},
                {"label": "4", "text": "Enamel pearl"},
                {"label": "5", "text": "Concrescence"}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 6: ผู้ป่วยปฏิเสธโรคประจำตัว เจ็บเหงือกมา 2 week รูปเป็นเหงือก ลอก ๆ แดง ๆ (ตุ่มน้ำใส ๆ เหี่ยว ๆ ตรง vestibule ฟันหน้าล่างขวา)\n16. ให้ภาพ histo มา ถาม dx",
            "choices": [
                {"label": "1", "text": "Mucous membrane pemphigoid"},
                {"label": "2", "text": "Pemphigus vulgaris"},
                {"label": "3", "text": "Aphthous stomatitis"},
                {"label": "4", "text": "Oral lichen planus"},
                {"label": "5", "text": ""}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 6: ผู้ป่วยปฏิเสธโรคประจำตัว เจ็บเหงือกมา 2 week รูปเป็นเหงือก ลอก ๆ แดง ๆ (ตุ่มน้ำใส ๆ เหี่ยว ๆ ตรง vestibule ฟันหน้าล่างขวา)\n17. ซักประวัติอะไรเพิ่ม",
            "choices": [
                {"label": "1", "text": "ประวัติใช้ผลิตภัณฑ์ช่องปาก"},
                {"label": "2", "text": "ตรวจน้ำตาลในเลือด"},
                {"label": "3", "text": "ตรวจไต"},
                {"label": "4", "text": "น้ำลายน้อย"},
                {"label": "5", "text": ""}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 6: ผู้ป่วยปฏิเสธโรคประจำตัว เจ็บเหงือกมา 2 week รูปเป็นเหงือก ลอก ๆ แดง ๆ (ตุ่มน้ำใส ๆ เหี่ยว ๆ ตรง vestibule ฟันหน้าล่างขวา)\n18. ข้อใดสัมพันธ์กับโรคนี้",
            "choices": [
                {"label": "1", "text": "+ve Nikolsky’s sign"},
                {"label": "2", "text": "-ve Direct immunofluorescence"},
                {"label": "3", "text": "Target lesion"},
                {"label": "4", "text": ""},
                {"label": "5", "text": ""}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 7: หญิง 7 ปี 20 kg เป็น TOF (Tetralogy of Fallot) แพ้ penicillin ปวด 85 ให้รูป 75 84 ผุ occlusal caries 85 เคย pulpectomy แต่ในฟิล์มเหมือนไม่ได้อุด distal root\n19. ให้กิน antibiotics prophylaxis อะไรก่อนทำ 85",
            "choices": [
                {"label": "1", "text": "Cefazolin 1000 mg"},
                {"label": "2", "text": "Cephalexin 1000 mg"},
                {"label": "3", "text": "Ceftriaxone 1000 mg"},
                {"label": "4", "text": "Doxycycline 1000 mg"},
                {"label": "5", "text": "Ampicillin 1000 mg"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมสำหรับเด็ก",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 7: หญิง 7 ปี 20 kg เป็น TOF (Tetralogy of Fallot) แพ้ penicillin ปวด 85 ให้รูป 75 84 ผุ occlusal caries 85 เคย pulpectomy แต่ในฟิล์มเหมือนไม่ได้อุด distal root\n20. ถ้าหลังรักษารากน้อง 3 เดือน ไม่มีผุ ไม่มี plaque ดูแลทำความสะอาดช่องปากได้ดี ทำตามหมอหมด ถ่าย BW ยังไง",
            "choices": [
                {"label": "1", "text": "ทุก 6-12 เดือน"},
                {"label": "2", "text": "ทุก 6-18 เดือน"},
                {"label": "3", "text": "ทุก 12-24 เดือน"},
                {"label": "4", "text": "ทุก 18-36 เดือน"},
                {"label": "5", "text": "ทุก 24-36 เดือน"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมสำหรับเด็ก",
            "task": "ขั้นตอนและวิธีการรักษา",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 7: หญิง 7 ปี 20 kg เป็น TOF (Tetralogy of Fallot) แพ้ penicillin ปวด 85 ให้รูป 75 84 ผุ occlusal caries 85 เคย pulpectomy แต่ในฟิล์มเหมือนไม่ได้อุด distal root\n21. ควบคุมรอยผุที่เหลือในปาก",
            "choices": [
                {"label": "1", "text": "NaF gel"},
                {"label": "2", "text": "NaF varnish"},
                {"label": "3", "text": "APF"},
                {"label": "4", "text": "SDF"},
                {"label": "5", "text": "Chlorhexidine gel"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมสำหรับเด็ก",
            "task": "การสร้างเสริมสุขภาพและการป้องกัน",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 8: [รูป : Arch บน เหลือ15-25 ฟันเยิน ๆ ผุกับวัสดุอุดเยอะ ๆ, 11 กับ 24 เป็น RR arch ล่าง complete edentulous area] ผู้ป่วยหญิง 50 ปี สูบบุหรี่ 1 ซองต่อวัน ฉายรังสี h&n จาก scc เคมีและรังสีรักษามาเสร็จแล้ว มาทำฟันตรวจเช็ค 6 เดือน\n22. เป้าหมายของการรักษาเคสนี้",
            "choices": [
                {"label": "1", "text": "ผู้ป่วยสามารถทานอาหารได้"},
                {"label": "2", "text": "หายจากมะเร็ง"},
                {"label": "3", "text": "ไม่มีฟันผุเพิ่ม"},
                {"label": "4", "text": "ไม่มีฟันถอน"},
                {"label": "5", "text": ""}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมประดิษฐ์",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 8: [รูป : Arch บน เหลือ15-25 ฟันเยิน ๆ ผุกับวัสดุอุดเยอะ ๆ, 11 กับ 24 เป็น RR arch ล่าง complete edentulous area] ผู้ป่วยหญิง 50 ปี สูบบุหรี่ 1 ซองต่อวัน ฉายรังสี h&n จาก scc เคมีและรังสีรักษามาเสร็จแล้ว มาทำฟันตรวจเช็ค 6 เดือน\n23. น้ำลายน้อยจากอะไร",
            "choices": [
                {"label": "1", "text": "จากรังสีรักษา"},
                {"label": "2", "text": "อายุ"},
                {"label": "3", "text": "ฮอร์โมน"},
                {"label": "4", "text": "ติดเชื้อรา"},
                {"label": "5", "text": ""}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 8: [รูป : Arch บน เหลือ15-25 ฟันเยิน ๆ ผุกับวัสดุอุดเยอะ ๆ, 11 กับ 24 เป็น RR arch ล่าง complete edentulous area] ผู้ป่วยหญิง 50 ปี สูบบุหรี่ 1 ซองต่อวัน ฉายรังสี h&n จาก scc เคมีและรังสีรักษามาเสร็จแล้ว มาทำฟันตรวจเช็ค 6 เดือน\n24. ข้อใดเป็นการดำเนินการตาม common risk factor",
            "choices": [
                {"label": "1", "text": "รณรงค์เลิกสูบบุหรี่"},
                {"label": "2", "text": "สอนแปรงฟัน"},
                {"label": "3", "text": "ตรวจฟันทุก 3 เดือน"},
                {"label": "4", "text": ""},
                {"label": "5", "text": ""}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมชุมชน",
            "task": "การสร้างเสริมสุขภาพและการป้องกัน",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 9: ชายอายุ 80 ปี เจ็บฟันซี่ 38 abutment รูปก่อนรักษาเป็นสะพานฟัน 35-38 มี vertical bone loss ที่ mesial 38 (ในฟิล์ม 38 มันล้มๆ mesial shift ด้วย) ฟิล์มหลังรักษาคือรื้อ bridge ทำครอบ 38 ใหม่ ปัก implant ซี่ 36 37 ร่วมกับ crown lengthening ซี่ 38\n25. ซี่ 37 PD 4-5 mm with bleeding on probing diagnosis เป็นอะไร",
            "choices": [
                {"label": "1", "text": "Peri implant mucositis"},
                {"label": "2", "text": "Peri implantitis"},
                {"label": "3", "text": "Peri implant health"},
                {"label": "4", "text": "Lack of keratinized tissue"},
                {"label": "5", "text": "Soft and hard tissue deficiency"}
            ],
            "correct_answer": None,
            "category": "ปริทันตวิทยา",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 9: ชายอายุ 80 ปี เจ็บฟันซี่ 38 abutment รูปก่อนรักษาเป็นสะพานฟัน 35-38 มี vertical bone loss ที่ mesial 38 (ในฟิล์ม 38 มันล้มๆ mesial shift ด้วย) ฟิล์มหลังรักษาคือรื้อ bridge ทำครอบ 38 ใหม่ ปัก implant ซี่ 36 37 ร่วมกับ crown lengthening ซี่ 38\n26. หลังปัก implant คนไข้มีปัญหาเศษอาหารติดระหว่าง 37 38 หนักมากดังรูป (ให้รูปเป็นเศษอาหารติดด้าน lingual ของซี่ 37/ 38) แก้ปัญหาอย่างไร",
            "choices": [
                {"label": "1", "text": "ทำ crown 38 ใหม่ให้ contact area กว้างขึ้นในแนว buccolingual"},
                {"label": "2", "text": "แยกซี่ 36 กับ 37 (ไม่รู้ในฟิล์มเหมือน implant ซี่ 36 กับ 37 เค้าทำติดกันมั้ง)"},
                {"label": "3", "text": "เปลี่ยนการปัก implant เป็นแบบ screw retained"},
                {"label": "4", "text": "เปลี่ยนการปัก implant เป็นแบบ cement retained"},
                {"label": "5", "text": "ทำสะพานติดกันไปให้หมดเลย 36 37 38"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมประดิษฐ์",
            "task": "ขั้นตอนและวิธีการรักษา",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 9: ชายอายุ 80 ปี เจ็บฟันซี่ 38 abutment รูปก่อนรักษาเป็นสะพานฟัน 35-38 มี vertical bone loss ที่ mesial 38 (ในฟิล์ม 38 มันล้มๆ mesial shift ด้วย) ฟิล์มหลังรักษาคือรื้อ bridge ทำครอบ 38 ใหม่ ปัก implant ซี่ 36 37 ร่วมกับ crown lengthening ซี่ 38\n27. ปัจจัยเสริมข้อใดสำคัญสุดที่ทำให้ซี่ 38 Periodontium ดีขึ้น",
            "choices": [
                {"label": "1", "text": "Crown lengthening"},
                {"label": "2", "text": "Access ในการทำความสะอาดดีขึ้น"},
                {"label": "3", "text": "Reduce occlusal load"},
                {"label": "4", "text": "Shorten span"},
                {"label": "5", "text": ""}
            ],
            "correct_answer": None,
            "category": "ปริทันตวิทยา",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 10: คนไข้เพศหญิง 50 ปี ปฏิเสธโรคประจำตัว มาด้วยเจ็บแผลกระพุ้งแก้มซ้าย แสบร้อนเวลากินของเผ็ด ให้รูปซี่ 37ODB-AF รอยโรคขาวแดงที่ buccal mucosa\n28. Histo จะเจออะไร",
            "choices": [
                {"label": "1", "text": "Koilocytosis"},
                {"label": "2", "text": "Perivascular infiltration of lymphocytes"},
                {"label": "3", "text": "Band-like infiltration of lymphocytes"},
                {"label": "4", "text": "Increase mitotic activity of epithelium"},
                {"label": "5", "text": "Bulbous rete ridge"}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 10: คนไข้เพศหญิง 50 ปี ปฏิเสธโรคประจำตัว มาด้วยเจ็บแผลกระพุ้งแก้มซ้าย แสบร้อนเวลากินของเผ็ด ให้รูปซี่ 37ODB-AF รอยโรคขาวแดงที่ buccal mucosa\n29. Management",
            "choices": [
                {"label": "1", "text": "เปลี่ยนวัสดุอุด"},
                {"label": "2", "text": "ทำครอบฟัน"},
                {"label": "3", "text": "ส่งตรวจ antinuclear antibody ใน serum"},
                {"label": "4", "text": "Nystatin oral suspension"},
                {"label": "5", "text": ""}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 10: คนไข้เพศหญิง 50 ปี ปฏิเสธโรคประจำตัว มาด้วยเจ็บแผลกระพุ้งแก้มซ้าย แสบร้อนเวลากินของเผ็ด ให้รูปซี่ 37ODB-AF รอยโรคขาวแดงที่ buccal mucosa\n30. Diagnosis",
            "choices": [
                {"label": "1", "text": "Pemphigus vulgaris"},
                {"label": "2", "text": "Discoid lupus erythematosus"},
                {"label": "3", "text": "Oral lichenoid lesion"},
                {"label": "4", "text": "Chronic hyperplastic candidiasis"},
                {"label": "5", "text": ""}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 11: คนไข้อายุ 50 ปี เป็นcongenital aortic regurgitation ยังไม่ได้รับการแก้ไข เดิมไม่มีอาการ ล่าสุดมีหอบเหนื่อย เข้ารพ. เนื่องจากเป็นปอดบวม ออกกำลังกายหนักไม่ได้ เดินขึ้นบันได 2 ชั้นได้แต่เหนื่อย มีแพลนจะไปทำ valve ไม่มีประวัติแพ้ยา มีเบาหวาน FBS 153 กิน metformin, furosemide, enalapril ให้รูปฟันในปากมา กับ x-ray เห็น bone เหลือประมาณ 25% มีหินปูน plaque เยอะ หินปูนฟันหน้าล่างเป็นแผง\n31. จะถอนฟันต้องระวังอะไร",
            "choices": [
                {"label": "1", "text": "Post op infection"},
                {"label": "2", "text": "Post op bleeding"},
                {"label": "3", "text": "Congestive heart failure"},
                {"label": "4", "text": "Erythema? จมด ขึ้นต้นด้วยตัวE"},
                {"label": "5", "text": ""}
            ],
            "correct_answer": None,
            "category": "ศัลยศาสตร์ช่องปาก",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 11: คนไข้อายุ 50 ปี เป็นcongenital aortic regurgitation ยังไม่ได้รับการแก้ไข เดิมไม่มีอาการ ล่าสุดมีหอบเหนื่อย เข้ารพ. เนื่องจากเป็นปอดบวม ออกกำลังกายหนักไม่ได้ เดินขึ้นบันได 2 ชั้นได้แต่เหนื่อย มีแพลนจะไปทำ valve ไม่มีประวัติแพ้ยา มีเบาหวาน FBS 153 กิน metformin, furosemide, enalapril ให้รูปฟันในปากมา กับ x-ray เห็น bone เหลือประมาณ 25% มีหินปูน plaque เยอะ หินปูนฟันหน้าล่างเป็นแผง\n32. วางแผนขูดหินปูนยังไง",
            "choices": [
                {"label": "1", "text": "OHI, piezo ultrasonic, hand scaler"},
                {"label": "2", "text": "(มีช้อยส์ไม่มี OHI แต่มีขูดมือ/ ขูดเครื่อง สลับๆ กัน)"},
                {"label": "3", "text": ""},
                {"label": "4", "text": ""},
                {"label": "5", "text": ""}
            ],
            "correct_answer": None,
            "category": "ปริทันตวิทยา",
            "task": "ขั้นตอนและวิธีการรักษา",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 11: คนไข้อายุ 50 ปี เป็นcongenital aortic regurgitation ยังไม่ได้รับการแก้ไข เดิมไม่มีอาการ ล่าสุดมีหอบเหนื่อย เข้ารพ. เนื่องจากเป็นปอดบวม ออกกำลังกายหนักไม่ได้ เดินขึ้นบันได 2 ชั้นได้แต่เหนื่อย มีแพลนจะไปทำ valve ไม่มีประวัติแพ้ยา มีเบาหวาน FBS 153 กิน metformin, furosemide, enalapril ให้รูปฟันในปากมา กับ x-ray เห็น bone เหลือประมาณ 25% มีหินปูน plaque เยอะ หินปูนฟันหน้าล่างเป็นแผง\n33. หลังทำ valve มาแล้ว จะถอนฟัน ต้องให้ยาอะไร",
            "choices": [
                {"label": "1", "text": "Amoxicillin 2g ก่อน 60 นาที"},
                {"label": "2", "text": "มีฉีดด้วย"},
                {"label": "3", "text": ""},
                {"label": "4", "text": ""},
                {"label": "5", "text": ""}
            ],
            "correct_answer": None,
            "category": "ศัลยศาสตร์ช่องปาก",
            "task": "ขั้นตอนและวิธีการรักษา",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 12: ชาย 50 ปี มีรูป clinic ฝั่ง Li Q3 ขอบเหงือกดู bluish 37 โยก 1 pd ทาง D,Li 13 mm -ve EPT Peri distal bone ประมาณ 60% superimposed oblique ridge ปลายราก 37 distal root ดูมี periapical lesion (ดูมี J shape ~ VRF) ดูจะมี furcation involvement\n34.Diagnosis",
            "choices": [
                {"label": "1", "text": "Endo-periodontal lesion w/ root damage"},
                {"label": "2", "text": "Endo-periodontal lesion w/o root damage"},
                {"label": "3", "text": "Stage III periodontitis"},
                {"label": "4", "text": "Periapical abscess"},
                {"label": "5", "text": ""}
            ],
            "correct_answer": None,
            "category": "ปริทันตวิทยา",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 12: ชาย 50 ปี มีรูป clinic ฝั่ง Li Q3 ขอบเหงือกดู bluish 37 โยก 1 pd ทาง D,Li 13 mm -ve EPT Peri distal bone ประมาณ 60% superimposed oblique ridge ปลายราก 37 distal root ดูมี periapical lesion (ดูมี J shape ~ VRF) ดูจะมี furcation involvement\n35. 46 distal marginal ridge พบรอยร้าว ไม่มีอาการ เคาะไม่เจ็บ จะทำอะไร (ไม่แน่ใจว่า 36 หรือ 46)",
            "choices": [
                {"label": "1", "text": "ไม่ทำอะไร ติดตามอาการ"},
                {"label": "2", "text": "กรออุด ติดตามอาการ"},
                {"label": "3", "text": "ครอบชั่วคราว ติดตามอาการ"},
                {"label": "4", "text": "Stainless steel band"},
                {"label": "5", "text": "Reduce occlusion"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมบูรณะ/หัตถการ",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 12: ชาย 50 ปี มีรูป clinic ฝั่ง Li Q3 ขอบเหงือกดู bluish 37 โยก 1 pd ทาง D,Li 13 mm -ve EPT Peri distal bone ประมาณ 60% superimposed oblique ridge ปลายราก 37 distal root ดูมี periapical lesion (ดูมี J shape ~ VRF) ดูจะมี furcation involvement\n36. 37 prognosis",
            "choices": [
                {"label": "1", "text": "Good"},
                {"label": "2", "text": "Fair"},
                {"label": "3", "text": "Poor"},
                {"label": "4", "text": "Questionable"},
                {"label": "5", "text": "Hopeless"}
            ],
            "correct_answer": None,
            "category": "ปริทันตวิทยา",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 13: เด็กอายุ 4 ปี มาด้วยแผลบริเวณลิ้นและด้านในริมฝีปากเจ็บแสบปากมา 3 วัน ผู้ปกครองแจ้งว่าก่อนมีแผล เป็นไข้มาก่อน ลูกไม่ยอมให้แปรงฟัน (รูปคิดว่าเป็น herpes) ไม่มีรอยแผลที่ร่างกายบริเวณอื่น\n37. เป็นโรคอะไร",
            "choices": [
                {"label": "1", "text": "Candidiasis"},
                {"label": "2", "text": "Primary acute herpetic gingivostomatitis"},
                {"label": "3", "text": "Herpangina"},
                {"label": "4", "text": "Hand foot mouth"},
                {"label": "5", "text": ""}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมสำหรับเด็ก",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 13: เด็กอายุ 4 ปี มาด้วยแผลบริเวณลิ้นและด้านในริมฝีปากเจ็บแสบปากมา 3 วัน ผู้ปกครองแจ้งว่าก่อนมีแผล เป็นไข้มาก่อน ลูกไม่ยอมให้แปรงฟัน (รูปคิดว่าเป็น herpes) ไม่มีรอยแผลที่ร่างกายบริเวณอื่น\n38. โรคนี้เกิดจากเชื้ออะไร",
            "choices": [
                {"label": "1", "text": "Coxsackie A virus"},
                {"label": "2", "text": "Candida"},
                {"label": "3", "text": "Herpes simplex virus I"},
                {"label": "4", "text": "Immune response"},
                {"label": "5", "text": "S. aureus"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมสำหรับเด็ก",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 13: เด็กอายุ 4 ปี มาด้วยแผลบริเวณลิ้นและด้านในริมฝีปากเจ็บแสบปากมา 3 วัน ผู้ปกครองแจ้งว่าก่อนมีแผล เป็นไข้มาก่อน ลูกไม่ยอมให้แปรงฟัน (รูปคิดว่าเป็น herpes) ไม่มีรอยแผลที่ร่างกายบริเวณอื่น\n39. Tx อะไร",
            "choices": [
                {"label": "1", "text": "Acyclovir cream"},
                {"label": "2", "text": "Corticosteroid"},
                {"label": "3", "text": "Supportive treatment"},
                {"label": "4", "text": "Nystatin suspension"},
                {"label": "5", "text": "Chlorhexidine MW"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมสำหรับเด็ก",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 14: คนไข้เพศหญิง 30 ปี มาด้วยอาการฟันหน้าไม่สวย เคยอุดฟันไป 2 ปี ไม่มีอาการ ให้รูปคลินิกเป็น 11M มี marginal discoloration x-ray มี radiolucent รอบ ๆ วัสดุ\n40. สาเหตุ",
            "choices": [
                {"label": "1", "text": "Bonding degradation"},
                {"label": "2", "text": "Composite-bonding incompatibility"},
                {"label": "3", "text": "Residual caries"},
                {"label": "4", "text": "Traumatic occlusion"},
                {"label": "5", "text": "Poor adaptability"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมบูรณะ/หัตถการ",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 14: คนไข้เพศหญิง 30 ปี มาด้วยอาการฟันหน้าไม่สวย เคยอุดฟันไป 2 ปี ไม่มีอาการ ให้รูปคลินิกเป็น 11M มี marginal discoloration x-ray มี radiolucent รอบ ๆ วัสดุ\n41. หลังจากทำเสร็จ บ้านหมุน ใจสั่น ตาลาย",
            "choices": [
                {"label": "1", "text": "เจาะน้ำตาลปลายนิ้ว"},
                {"label": "2", "text": "ดมแอมโมเนีย"},
                {"label": "3", "text": "ดื่มน้ำหวาน"},
                {"label": "4", "text": "แหงนหน้าสุด ในท่ากึ่งนั่งกึ่งนอน"},
                {"label": "5", "text": "ปรับนอนราบ"}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 14: คนไข้เพศหญิง 30 ปี มาด้วยอาการฟันหน้าไม่สวย เคยอุดฟันไป 2 ปี ไม่มีอาการ ให้รูปคลินิกเป็น 11M มี marginal discoloration x-ray มี radiolucent รอบ ๆ วัสดุ\n42. มุมเข้าทำงาน",
            "choices": [
                {"label": "1", "text": "8 นาฬิกา"},
                {"label": "2", "text": "9 นาฬิกา"},
                {"label": "3", "text": "12 นาฬิกา"},
                {"label": "4", "text": "2 นาฬิกา"},
                {"label": "5", "text": "3 นาฬิกา"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมบูรณะ/หัตถการ",
            "task": "ขั้นตอนและวิธีการรักษา",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 15: คนไข้เพศหญิง 50 ปี มาด้วยแผลข้างลิ้น รูปก้อนชมพู มีขาว ๆ ก้อนข้างลิ้น\n43. Proper management",
            "choices": [
                {"label": "1", "text": "Surgical excision"},
                {"label": "2", "text": "Observe"},
                {"label": "3", "text": "ทา steroid"},
                {"label": "4", "text": ""},
                {"label": "5", "text": ""}
            ],
            "correct_answer": None,
            "category": "ศัลยศาสตร์ช่องปาก",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 15: คนไข้เพศหญิง 50 ปี มาด้วยแผลข้างลิ้น รูปก้อนชมพู มีขาว ๆ ก้อนข้างลิ้น\n44. จงให้ Clinical diagnosis",
            "choices": [
                {"label": "1", "text": "Irritation fibroma"},
                {"label": "2", "text": "SCC"},
                {"label": "3", "text": "Lymphangioma"},
                {"label": "4", "text": "Traumatic ulcer"},
                {"label": "5", "text": ""}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 15: คนไข้เพศหญิง 50 ปี มาด้วยแผลข้างลิ้น รูปก้อนชมพู มีขาว ๆ ก้อนข้างลิ้น\n45. อะไรแสดง progression โรค",
            "choices": [
                {"label": "1", "text": "Fix and rubbery LN"},
                {"label": "2", "text": "Soft and Tenderness LN"},
                {"label": "3", "text": "น้ำลายแห้ง"},
                {"label": "4", "text": ""},
                {"label": "5", "text": ""}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 16: ผู้ป่วยชาย อายุ 20 ปี ให้รูปฟัน crowding มาก ๆ บอกว่าจะรักษา rapid maxillary expansion รูปเป็น anterior open bite, 13 high canine ซี่ 12 ติดกับซี่ 14 เลยจ้า\n46. สาเหตุที่ 13 เป็นงั้น",
            "choices": [
                {"label": "1", "text": "Severe space deficiency"},
                {"label": "2", "text": "น้ำนมหลุดช้า"},
                {"label": "3", "text": "Prolonged retention"},
                {"label": "4", "text": "Tongue thrust"},
                {"label": "5", "text": "Thumb sucking"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมจัดฟัน",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 16: ผู้ป่วยชาย อายุ 20 ปี ให้รูปฟัน crowding มาก ๆ บอกว่าจะรักษา rapid maxillary expansion รูปเป็น anterior open bite, 13 high canine ซี่ 12 ติดกับซี่ 14 เลยจ้า\n47. หลังทำ ortho เสร็จแล้ว ข้อใดช่วยไม่ให้เกิดการ relapse",
            "choices": [
                {"label": "1", "text": "ใส่ retainer"},
                {"label": "2", "text": "ไม่ thumb sucking"},
                {"label": "3", "text": "สอนการวางลิ้น"},
                {"label": "4", "text": "Circumferential Fiberotomy"},
                {"label": "5", "text": "Tongue guard"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมจัดฟัน",
            "task": "ขั้นตอนและวิธีการรักษา",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 16: ผู้ป่วยชาย อายุ 20 ปี ให้รูปฟัน crowding มาก ๆ บอกว่าจะรักษา rapid maxillary expansion รูปเป็น anterior open bite, 13 high canine ซี่ 12 ติดกับซี่ 14 เลยจ้า\n48. ให้รูป pano เห็น 48 จุ่ม nerve ถ้าจะผ่าฟันคุด ต้องถ่ายไรเพิ่ม",
            "choices": [
                {"label": "1", "text": "CBCT"},
                {"label": "2", "text": "Lateral oblique mandible"},
                {"label": "3", "text": "Cross sec"},
                {"label": "4", "text": ""},
                {"label": "5", "text": ""}
            ],
            "correct_answer": None,
            "category": "ศัลยศาสตร์ช่องปาก",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 17: ฟิล์มฟันซี่ 31 ปลายรากมี unilocular well-defined border radiolucent lesion ใหญ่ ๆ ข้างใน lesion มี radiopaque เป็นเกล็ด ๆ รูปประมาณนี้แต่ไม่มี displacement ของฟันข้างเคียง\n49. ฟิล์มนี้มีลักษณะอะไรที่จะบอกวินิจฉัยเบื้องต้นของโรคนี้ได้ลักษณะทางภาพรังสีที่บ่งบอกโรค",
            "choices": [
                {"label": "1", "text": "Snowflake"},
                {"label": "2", "text": "Size of lesion"},
                {"label": "3", "text": "Location of lesion"},
                {"label": "4", "text": "Root resorption"},
                {"label": "5", "text": ""}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 17: ฟิล์มฟันซี่ 31 ปลายรากมี unilocular well-defined border radiolucent lesion ใหญ่ ๆ ข้างใน lesion มี radiopaque เป็นเกล็ด ๆ รูปประมาณนี้แต่ไม่มี displacement ของฟันข้างเคียง\n50. Diag",
            "choices": [
                {"label": "1", "text": "Adenomatoid odontogenic tumor"},
                {"label": "2", "text": "Central giant cell granuloma"},
                {"label": "3", "text": "Radicular cyst"},
                {"label": "4", "text": "Peripheral cemento-osseous dysplasia"},
                {"label": "5", "text": ""}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 17: ฟิล์มฟันซี่ 31 ปลายรากมี unilocular well-defined border radiolucent lesion ใหญ่ ๆ ข้างใน lesion มี radiopaque เป็นเกล็ด ๆ รูปประมาณนี้แต่ไม่มี displacement ของฟันข้างเคียง\n51. ตรวจอะไรเพิ่ม",
            "choices": [
                {"label": "1", "text": "EPT 3 ซี่หน้าล่าง"},
                {"label": "2", "text": "Needle aspiration"},
                {"label": "3", "text": "ถ่าย Topographic-occlusal view"},
                {"label": "4", "text": "Bite test"},
                {"label": "5", "text": ""}
            ],
            "correct_answer": None,
            "category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 18: เด็ก 1 ปี 6 เดือน 51 61 white lesion มี cavitate ด้วย ดูดนมแม่ ผู้ปกครองเช็ดฟันให้วันละครั้ง\n52. ทันตกรรมป้องกันที่เหมาะสม",
            "choices": [
                {"label": "1", "text": "เลิกดูดนมแม่"},
                {"label": "2", "text": "แปรงฟันโดยใช้ยาสีฟันผสมฟลูออไรด์"},
                {"label": "3", "text": "เช็ดฟันด้วย xylitol wipe"},
                {"label": "4", "text": "ให้น้ำผลไม้ไม่เกิน 4 ออนซ์ต่อวัน"},
                {"label": "5", "text": ""}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมสำหรับเด็ก",
            "task": "การสร้างเสริมสุขภาพและการป้องกัน",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 18: เด็ก 1 ปี 6 เดือน 51 61 white lesion มี cavitate ด้วย ดูดนมแม่ ผู้ปกครองเช็ดฟันให้วันละครั้ง\n53. อุด 51, 61ด้วยอะไร",
            "choices": [
                {"label": "1", "text": "Composite"},
                {"label": "2", "text": "Compomer"},
                {"label": "3", "text": "Giomer"},
                {"label": "4", "text": "GI"},
                {"label": "5", "text": "Zirconia crown"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมสำหรับเด็ก",
            "task": "ขั้นตอนและวิธีการรักษา",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 18: เด็ก 1 ปี 6 เดือน 51 61 white lesion มี cavitate ด้วย ดูดนมแม่ ผู้ปกครองเช็ดฟันให้วันละครั้ง\n54. เห็นขาวขุ่นที่ชั้นเคลือบฟัน เกิดรูพรุนมากในชั้นไหน",
            "choices": [
                {"label": "1", "text": "Translucent zone"},
                {"label": "2", "text": "Dark zone"},
                {"label": "3", "text": "Surface zone"},
                {"label": "4", "text": "Sclerosis zone"},
                {"label": "5", "text": "Body of lesion"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมสำหรับเด็ก",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 19: หญิง อายุ 50 ปี เสียวฟันขวาล่างเวลาดื่มน้ำเย็น ให้รูปคลินิกฟันสบ lateral view เห็นฟันด้าน buccal ของซี่ 13, 14, 15, 16, 17, 43, 44, 45, 47 (46 missing) โดยในรูปพบ 44B V-shape lesion at cervical 1/3 size 1-2 mm (แนว occ-cer) 4-5 mm (แนวMD line \u00e2 to line \u00e2) ลึก 1-2 mm และอยู่ประมาณขอบเหงือกพอดี มี lesion แค่ซี่ 44 ซี่เดียว ไม่พบที่ซี่ 45, 43 และพบซี่ 14, 44 สบแน่น แต่ซี่ 15, 45 ดูลอย ๆ สบไม่แน่น\n55. สาเหตุของพยาธิสภาพ",
            "choices": [
                {"label": "1", "text": "excessive transverse force"},
                {"label": "2", "text": "acidic food/beverage consumption"},
                {"label": "3", "text": "stiff bristle brush"},
                {"label": "4", "text": "detachment of cementum (ไม่แน่ใจมีอันนี้รึป่าว)"},
                {"label": "5", "text": ""}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 19: หญิง อายุ 50 ปี เสียวฟันขวาล่างเวลาดื่มน้ำเย็น ให้รูปคลินิกฟันสบ lateral view เห็นฟันด้าน buccal ของซี่ 13, 14, 15, 16, 17, 43, 44, 45, 47 (46 missing) โดยในรูปพบ 44B V-shape lesion at cervical 1/3 size 1-2 mm (แนว occ-cer) 4-5 mm (แนวMD line \u00e2 to line \u00e2) ลึก 1-2 mm และอยู่ประมาณขอบเหงือกพอดี มี lesion แค่ซี่ 44 ซี่เดียว ไม่พบที่ซี่ 45, 43 และพบซี่ 14, 44 สบแน่น แต่ซี่ 15, 45 ดูลอย ๆ สบไม่แน่น\n56. จะรักษาซี่ 44 จะจัดการ mucogingival problem ด้วยการตรวจอะไรเพิ่มเติม",
            "choices": [
                {"label": "1", "text": "vestibular depth, high frenum attachment"},
                {"label": "2", "text": "gingival recession type,keratinized tissue width"},
                {"label": "3", "text": "mobility, gingival phenotype"},
                {"label": "4", "text": "???, gingival phenotype"},
                {"label": "5", "text": "probing depth, location of CEJ"}
            ],
            "correct_answer": None,
            "category": "ปริทันตวิทยา",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 19: หญิง อายุ 50 ปี เสียวฟันขวาล่างเวลาดื่มน้ำเย็น ให้รูปคลินิกฟันสบ lateral view เห็นฟันด้าน buccal ของซี่ 13, 14, 15, 16, 17, 43, 44, 45, 47 (46 missing) โดยในรูปพบ 44B V-shape lesion at cervical 1/3 size 1-2 mm (แนว occ-cer) 4-5 mm (แนวMD line \u00e2 to line \u00e2) ลึก 1-2 mm และอยู่ประมาณขอบเหงือกพอดี มี lesion แค่ซี่ 44 ซี่เดียว ไม่พบที่ซี่ 45, 43 และพบซี่ 14, 44 สบแน่น แต่ซี่ 15, 45 ดูลอย ๆ สบไม่แน่น\n57. ต้องการคุณสมบัติอะไรของวัสดุบูรณะซี่ 44",
            "choices": [
                {"label": "1", "text": "high tensile strength"},
                {"label": "2", "text": "high creep"},
                {"label": "3", "text": "high translucency"},
                {"label": "4", "text": "low elastic modulus"},
                {"label": "5", "text": "low CTE"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมบูรณะ/หัตถการ",
            "task": "ขั้นตอนและวิธีการรักษา",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 20: คนไข้อายุ 40 ปี มีฟันผุที่คอฟันหน้าบน\n58. ใช้สารอะไรป้องกันสนิมที่หัวกรอตอน autoclave",
            "choices": [
                {"label": "1", "text": "Calcium carbonate"},
                {"label": "2", "text": "Chromium oxide"},
                {"label": "3", "text": "Silver bromide"},
                {"label": "4", "text": "Sodium nitrate"},
                {"label": "5", "text": "Potassium chloride"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมบูรณะ/หัตถการ",
            "task": "การสร้างเสริมสุขภาพและการป้องกัน",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 20: คนไข้อายุ 40 ปี มีฟันผุที่คอฟันหน้าบน\n59. หลังจากบูรณะ ให้สารอะไรป้องกันฟันผุใช้ที่บ้าน",
            "choices": [
                {"label": "1", "text": "1.23 APF gel"},
                {"label": "2", "text": "CHX gel"},
                {"label": "3", "text": "1500 NaF toothpaste"},
                {"label": "4", "text": "5000 NaF"},
                {"label": "5", "text": "F varnish"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมบูรณะ/หัตถการ",
            "task": "การสร้างเสริมสุขภาพและการป้องกัน",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 20: คนไข้อายุ 40 ปี มีฟันผุที่คอฟันหน้าบน\n60. อยากปลูกเหงือกฟันหน้า อยู่ใน phase ไหน",
            "choices": [
                {"label": "1", "text": "Preliminary phase"},
                {"label": "2", "text": "Systemic phase"},
                {"label": "3", "text": "Hygienic phase"},
                {"label": "4", "text": "Corrective phase"},
                {"label": "5", "text": "Maintenance phase"}
            ],
            "correct_answer": None,
            "category": "ปริทันตวิทยา",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 21: คนไข้ 70 ปีทำ CD บนทำมา 5 ปีหลวม มี 13 RR เหลือฟันหน้าล่างเป็น flabby ridge ฟันหลังล่างหายหมดแต่มี TP ฟันปลอมล่างเป็น Kennedy class I แต่คนไข้ไม่ค่อยใส่\n61. สาเหตุที่หลวม",
            "choices": [
                {"label": "1", "text": "Overextension"},
                {"label": "2", "text": "Combination syndrome"},
                {"label": "3", "text": "Alveolar resorption syndrome"},
                {"label": "4", "text": "Improper occlusion"},
                {"label": "5", "text": "Retained root"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมประดิษฐ์",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 21: คนไข้ 70 ปีทำ CD บนทำมา 5 ปีหลวม มี 13 RR เหลือฟันหน้าล่างเป็น flabby ridge ฟันหลังล่างหายหมดแต่มี TP ฟันปลอมล่างเป็น Kennedy class I แต่คนไข้ไม่ค่อยใส่\n62. ระหว่างรอทำฟันปลอมใหม่ต้องทำอย่างไร",
            "choices": [
                {"label": "1", "text": "เลิกใส่ cd บน 2 วีคแล้วมาดูอาการ"},
                {"label": "2", "text": "เช็ค occlusion tp ล่าง"},
                {"label": "3", "text": "reline cd บน"},
                {"label": "4", "text": "แพลนปัก implant 17,27"},
                {"label": "5", "text": "RCT 13 - coping"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมประดิษฐ์",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 21: คนไข้ 70 ปีทำ CD บนทำมา 5 ปีหลวม มี 13 RR เหลือฟันหน้าล่างเป็น flabby ridge ฟันหลังล่างหายหมดแต่มี TP ฟันปลอมล่างเป็น Kennedy class I แต่คนไข้ไม่ค่อยใส่\n63. สาเหตุที่ทำให้เกิด ridge defect บน",
            "choices": [
                {"label": "1", "text": "improper vertical dimension"},
                {"label": "2", "text": "tuberosity ย้อย"},
                {"label": "3", "text": "ไม่ใส่ฟันปลอมล่าง"},
                {"label": "4", "text": ""},
                {"label": "5", "text": ""}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมประดิษฐ์",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 22: ชายล้มฟันหัก ซี่ 23 มีฟิล์ม x-ray เคยทำ endo มาหักเป็น RR ประมาณ 2 mm เหนือ bone จากการประเมินแล้วต้องรักษารากฟันซ้ำ\n64.ถ้าไม่รักษารากฟันซ้ำจะทำให้เกิดการติดเชื้อแบบไหน",
            "choices": [
                {"label": "1", "text": "Primary infection"},
                {"label": "2", "text": "Secondary infection"},
                {"label": "3", "text": "Persistent infection"},
                {"label": "4", "text": ""},
                {"label": "5", "text": ""}
            ],
            "correct_answer": None,
            "category": "วิทยาเอ็นโดดอนต์",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 22: ชายล้มฟันหัก ซี่ 23 มีฟิล์ม x-ray เคยทำ endo มาหักเป็น RR ประมาณ 2 mm เหนือ bone จากการประเมินแล้วต้องรักษารากฟันซ้ำ\n65.ถ้าคนไข้ concern esthetic มากๆ ควรบูรณะฟันอย่างไร",
            "choices": [
                {"label": "1", "text": "Cast post + lithium disilicate crown"},
                {"label": "2", "text": "Prefab + lithium disilicate crown"},
                {"label": "3", "text": "Cast post + zirconia"},
                {"label": "4", "text": "Prefab + PFM"},
                {"label": "5", "text": ""}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมประดิษฐ์",
            "task": "ขั้นตอนและวิธีการรักษา",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 22: ชายล้มฟันหัก ซี่ 23 มีฟิล์ม x-ray เคยทำ endo มาหักเป็น RR ประมาณ 2 mm เหนือ bone จากการประเมินแล้วต้องรักษารากฟันซ้ำ\n66.ถ้าคนไข้ไม่มีเงินทำอย่างไร",
            "choices": [
                {"label": "1", "text": "Composite build up"},
                {"label": "2", "text": "Ext + removable bridge"},
                {"label": "3", "text": "Ext + \u2026."},
                {"label": "4", "text": "Metal coping + Resin bonded bridge"},
                {"label": "5", "text": "Composite coping + Acrylic partial denture"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมประดิษฐ์",
            "task": "ขั้นตอนและวิธีการรักษา",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 23: หญิง 40 ปี ปวดฟันหน้าบนมา 1 วัน VAS=2 ไม่สามารถระบุซี่ที่ปวดได้ เคาะเจ็บ (ภาพทางคลินิกเป็นรูป gutta percha tracing ที่sinus ตรงเพดานบริเวณ rugae Q1)\n67. จากภาพรังสี เห็น gutta percha tracing ไปสิ้นสุดที่ปลายราก 12 และซี่ 12 -ve to EPT จงให้ diagnosis ซี่ 12",
            "choices": [
                {"label": "1", "text": "Irreversible pulpitis with symptomatic apical periodontitis"},
                {"label": "2", "text": "Irreversible pulpitis with asymptomatic apical periodontitis"},
                {"label": "3", "text": "Pulp necrosis with acute apical abscess"},
                {"label": "4", "text": "Pulp necrosis with chronic apical abscess"},
                {"label": "5", "text": "Irritation fibroma"}
            ],
            "correct_answer": None,
            "category": "วิทยาเอ็นโดดอนต์",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 23: หญิง 40 ปี ปวดฟันหน้าบนมา 1 วัน VAS=2 ไม่สามารถระบุซี่ที่ปวดได้ เคาะเจ็บ (ภาพทางคลินิกเป็นรูป gutta percha tracing ที่sinus ตรงเพดานบริเวณ rugae Q1)\n68. จากการทำ gutta percha tracing ซี่ 12 จะต้องทำอย่างไรเพื่อบรรเทาอาการปวดของคนไข้",
            "choices": [
                {"label": "1", "text": "Open and drain"},
                {"label": "2", "text": "Open flap debridement"},
                {"label": "3", "text": "Soft tissue debridement"},
                {"label": "4", "text": "Analgesics prescription"},
                {"label": "5", "text": "Antibacterial prescription"}
            ],
            "correct_answer": None,
            "category": "วิทยาเอ็นโดดอนต์",
            "task": "ขั้นตอนและวิธีการรักษา",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 23: หญิง 40 ปี ปวดฟันหน้าบนมา 1 วัน VAS=2 ไม่สามารถระบุซี่ที่ปวดได้ เคาะเจ็บ (ภาพทางคลินิกเป็นรูป gutta percha tracing ที่sinus ตรงเพดานบริเวณ rugae Q1)\n69. ควรตรวจอะไรเพิ่มในเคสนี้",
            "choices": [
                {"label": "1", "text": "Bite test"},
                {"label": "2", "text": "Periapical radiographic"},
                {"label": "3", "text": "Probing depth"},
                {"label": "4", "text": "Fine-needle aspiration"},
                {"label": "5", "text": "ถ่าย Lateral cephalometrics"}
            ],
            "correct_answer": None,
            "category": "วิทยาเอ็นโดดอนต์",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 24: ให้ภาพถ่ายฟันเด็ก ไม่มี x-ray ที่เห็นคือ ฟันหน้า 11,21 (11/21 มี spacing), 32-42 ขึ้นแล้ว 6 ล่างขึ้นแล้วทั้ง 2 ข้าง 14,15 ยังไม่ขึ้น\n70. ใส่ space maintainer อะไร",
            "choices": [
                {"label": "1", "text": "Band & loop"},
                {"label": "2", "text": "ไม่ใส่เพราะซี่ 6 ขึ้นแล้ว"},
                {"label": "3", "text": "Lingual holding arch"},
                {"label": "4", "text": "ใส่ band and loop ก่อน แล้วค่อยเปลี่ยนเป็น lingual arch ตอนซี่ 3 ขึ้นแล้ว"},
                {"label": "5", "text": ""}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมสำหรับเด็ก",
            "task": "ขั้นตอนและวิธีการรักษา",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 24: ให้ภาพถ่ายฟันเด็ก ไม่มี x-ray ที่เห็นคือ ฟันหน้า 11,21 (11/21 มี spacing), 32-42 ขึ้นแล้ว 6 ล่างขึ้นแล้วทั้ง 2 ข้าง 14,15 ยังไม่ขึ้น\n71. น้องอายุเท่าไหร่",
            "choices": [
                {"label": "1", "text": "7-8"},
                {"label": "2", "text": "9-10"},
                {"label": "3", "text": "11-12"},
                {"label": "4", "text": "> 12"},
                {"label": "5", "text": ""}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมสำหรับเด็ก",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 24: ให้ภาพถ่ายฟันเด็ก ไม่มี x-ray ที่เห็นคือ ฟันหน้า 11,21 (11/21 มี spacing), 32-42 ขึ้นแล้ว 6 ล่างขึ้นแล้วทั้ง 2 ข้าง 14,15 ยังไม่ขึ้น\n72. Diastema ที่บริเวณฟันหน้าบน แก้ไขอย่างไร",
            "choices": [
                {"label": "1", "text": "อุดปิดด้วย resin composite"},
                {"label": "2", "text": "ไม่ตัองทำอะไร เดี๋ยวรอ canine ขึ้นมาก็ปิดได้เอง"},
                {"label": "3", "text": "ปิดด้วย fix appliances"},
                {"label": "4", "text": "ปิดด้วย finger spring"},
                {"label": "5", "text": ""}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมสำหรับเด็ก",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 25: เด็กมีตุ่มน้ำ ที่lipด้านใน ที่ลิ้น เป็นแผลขาวๆ มีสีเหลืองๆมาเกาะด้วยที่ลิ้น อาการเป็นไข้ กินไม่ได้ (รูปประมาณนี้)\n73. คนไข้เป็นอะไร",
            "choices": [
                {"label": "1", "text": "Primary herpetic simplex"},
                {"label": "2", "text": "Herpangina"},
                {"label": "3", "text": "Candidiasis"},
                {"label": "4", "text": ""},
                {"label": "5", "text": ""}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมสำหรับเด็ก",
            "task": "การวินิจฉัยโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 25: เด็กมีตุ่มน้ำ ที่lipด้านใน ที่ลิ้น เป็นแผลขาวๆ มีสีเหลืองๆมาเกาะด้วยที่ลิ้น อาการเป็นไข้ กินไม่ได้ (รูปประมาณนี้)\n74. เกิดจากเชื้ออะไร",
            "choices": [
                {"label": "1", "text": "Herpes simplex 1"},
                {"label": "2", "text": "Coxsackie"},
                {"label": "3", "text": "C. albicans"},
                {"label": "4", "text": ""},
                {"label": "5", "text": ""}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมสำหรับเด็ก",
            "task": "การเกิดและการดำเนินโรค",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        },
        {
            "question_text": "STEM 25: เด็กมีตุ่มน้ำ ที่lipด้านใน ที่ลิ้น เป็นแผลขาวๆ มีสีเหลืองๆมาเกาะด้วยที่ลิ้น อาการเป็นไข้ กินไม่ได้ (รูปประมาณนี้)\n75. การรักษาที่เหมาะสมกับผู้ป่วยรายนี้",
            "choices": [
                {"label": "1", "text": "Antiviral cream"},
                {"label": "2", "text": "Antiseptic mouthwash"},
                {"label": "3", "text": "Observe"},
                {"label": "4", "text": "Supportive treatment"},
                {"label": "5", "text": "Antifungal cream"}
            ],
            "correct_answer": None,
            "category": "ทันตกรรมสำหรับเด็ก",
            "task": "การจัดการและการรักษาผู้ป่วย",
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL_2_2566_Part_2"
        }
    ]
}

with open('/Users/admin/Downloads/NL Test/parsed_exams/NL_2_2566_Part_2.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

