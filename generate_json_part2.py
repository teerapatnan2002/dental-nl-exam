import json
from enum import Enum

class ClinicalCategory(str, Enum):
    ORAL_DIAGNOSIS_AND_ORAL_MEDICINE = "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก"
    OCCLUSION_AND_OROFACIAL_PAIN = "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า"
    ORAL_SURGERY = "ศัลยศาสตร์ช่องปาก"
    PERIODONTICS = "ปริทันตวิทยา"
    RESTORATIVE_OPERATIVE_DENTISTRY = "ทันตกรรมบูรณะ/หัตถการ"
    ENDODONTICS = "วิทยาเอ็นโดดอนต์"
    PROSTHODONTICS = "ทันตกรรมประดิษฐ์"
    ORTHODONTICS = "ทันตกรรมจัดฟัน"
    PEDIATRIC_DENTISTRY = "ทันตกรรมสำหรับเด็ก"
    COMMUNITY_DENTISTRY = "ทันตกรรมชุมชน"

class ProfessionalTask(str, Enum):
    HEALTH_PROMOTION_AND_PREVENTION = "การสร้างเสริมสุขภาพและการป้องกัน"
    MECHANISM_OF_DISEASES = "การเกิดและการดำเนินโรค"
    DATA_GATHERING_AND_DIAGNOSIS = "การวินิจฉัยโรค"
    PATIENT_MANAGEMENT_AND_TREATMENT = "การจัดการและการรักษาผู้ป่วย"
    PROCEDURES = "ขั้นตอนและวิธีการรักษา"

data = {
    "questions": [
        {
            "question_text": "Stem 1: ผู้ป่วยเด็กอายุ 10 ปี มีฟันหน้าห่าง 2 mm ตรวจแล้วไม่พบพฤติกรรมกลืนด้วยลิ้น (รูปประมาณนี้ในปากไม่มีฟันผุเลย ตำแหน่งฟันทุกซี่ดีมาก ยกเว้น 11, 21 ฟันครบทุกซี่ canine แท้ยังไม่ขึ้น)\n1. ถ้าต้องการตรวจเพิ่มควรส่งถ่ายอะไร",
            "choices": [{"label": "ก", "text": "Periapical 11-21"}, {"label": "ข", "text": "Water’s"}, {"label": "ค", "text": "Towne’s"}, {"label": "ง", "text": "CBCT"}],
            "correct_answer": None,
            "category": ClinicalCategory.PEDIATRIC_DENTISTRY.value,
            "task": ProfessionalTask.DATA_GATHERING_AND_DIAGNOSIS.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 1: ผู้ป่วยเด็กอายุ 10 ปี มีฟันหน้าห่าง 2 mm ตรวจแล้วไม่พบพฤติกรรมกลืนด้วยลิ้น (รูปประมาณนี้ในปากไม่มีฟันผุเลย ตำแหน่งฟันทุกซี่ดีมาก ยกเว้น 11, 21 ฟันครบทุกซี่ canine แท้ยังไม่ขึ้น)\n2. คิดว่าเกิดอะไรได้มากที่สุด",
            "choices": [{"label": "ก", "text": "พฤติกรรมดูดนิ้ว"}, {"label": "ข", "text": "พฤติกรรมกัดดินสอ"}, {"label": "ค", "text": "Mouth breathing"}, {"label": "ง", "text": "Mesiodens"}],
            "correct_answer": None,
            "category": ClinicalCategory.PEDIATRIC_DENTISTRY.value,
            "task": ProfessionalTask.DATA_GATHERING_AND_DIAGNOSIS.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 1: ผู้ป่วยเด็กอายุ 10 ปี มีฟันหน้าห่าง 2 mm ตรวจแล้วไม่พบพฤติกรรมกลืนด้วยลิ้น (รูปประมาณนี้ในปากไม่มีฟันผุเลย ตำแหน่งฟันทุกซี่ดีมาก ยกเว้น 11, 21 ฟันครบทุกซี่ canine แท้ยังไม่ขึ้น)\n3. ให้การรักษาเคสนี้ยังไง",
            "choices": [{"label": "ก", "text": "Active plate with finger spring"}, {"label": "ข", "text": "Fixed orthodontic appliance"}, {"label": "ค", "text": "Functional appliance"}, {"label": "ง", "text": "Observe รอฟัน canine ขึ้น"}],
            "correct_answer": None,
            "category": ClinicalCategory.PEDIATRIC_DENTISTRY.value,
            "task": ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 2: ผู้ป่วยชายอายุ 55 ปีต้องการทำฟันปลอม ไม่เคยประสบอุบัติทางใบหน้าและขากรรไกร ไม่เคยมีอาการเสียวหรือปวดฟันบริเวณใดรูปช่องปาก ฟันบนครบ ฟันล่างหายซี่ 36\n1. ผู้ป่วยทานยา Nifedipine 30 mg วันละ 2 ครั้ง (Ca channel blocker) ต้องซักประวัติอะไรเพิ่มเติม",
            "choices": [{"label": "ก", "text": "เหงือกโตตำแหน่งอื่นๆ"}, {"label": "ข", "text": "น้ำลายน้อยและรสชาติเปลี่ยน"}, {"label": "ค", "text": "ผิวมีจ้ำเลือด"}, {"label": "ง", "text": "ติดเชื้อฉวยโอกาส/แผลหายช้า"}, {"label": "จ", "text": "เคยเคมีบำบัด"}],
            "correct_answer": None,
            "category": ClinicalCategory.ORAL_DIAGNOSIS_AND_ORAL_MEDICINE.value,
            "task": ProfessionalTask.DATA_GATHERING_AND_DIAGNOSIS.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 2: ผู้ป่วยชายอายุ 55 ปีต้องการทำฟันปลอม ไม่เคยประสบอุบัติทางใบหน้าและขากรรไกร ไม่เคยมีอาการเสียวหรือปวดฟันบริเวณใดรูปช่องปาก ฟันบนครบ ฟันล่างหายซี่ 36\n2. มีเหงือกกลมๆเล็กๆ ตรงfrenumอยู่ตรงระหว่างซี่ 11,21 สีเหมือนเหงือก จะตัดแต่งเพื่อความสวยงาม",
            "choices": [{"label": "ก", "text": "Frenotomy"}, {"label": "ข", "text": "Gingivectomy"}, {"label": "ค", "text": "Gingivoplasty"}, {"label": "ง", "text": "APF"}, {"label": "จ", "text": "Coronally positioned flap"}],
            "correct_answer": None,
            "category": ClinicalCategory.PERIODONTICS.value,
            "task": ProfessionalTask.PROCEDURES.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 2: ผู้ป่วยชายอายุ 55 ปีต้องการทำฟันปลอม ไม่เคยประสบอุบัติทางใบหน้าและขากรรไกร ไม่เคยมีอาการเสียวหรือปวดฟันบริเวณใดรูปช่องปาก ฟันบนครบ ฟันล่างหายซี่ 36\n3. จะทำ bridge 35-37 โดย 35 ดู sound tooth recession 1 mm, 36 missing มี flabby ridge, 37OB AF ดูโอเค มีrecession ประมาณ 2-3 mm periapical 37 เห็น O radiopaque มี base GI ถึง middle 1/3 dentin distal root widening PDL spaces crown root ratio ประมาณ 1:2 moderate horizontal bone loss ถามว่าจะทำอย่างไรกับ 37 ก่อนทำ bridge",
            "choices": [{"label": "ก", "text": "RCT + post core"}, {"label": "ข", "text": "Remove AF เปลี่ยนเป็น Composite"}, {"label": "ค", "text": "ScRP"}, {"label": "ง", "text": "Bone graft"}, {"label": "จ", "text": "5.ทำ P/C/C ก่อน"}],
            "correct_answer": None,
            "category": ClinicalCategory.PROSTHODONTICS.value,
            "task": ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 3: เด็กอายุ 7 ปี ล้มฟันหน้าหลุด พี่อายุ 15 ปี เก็บฟันห่อกระดาษทิชชู่พามาหาทันตแพทย์ ตรวจในช่องปากพบยังมีเลือดออกที่ socket พี่ให้ข้อมูลว่าน้องเป็นโรคเลือดหยุดยาก ไม่ทราบชื่อโรค ติดต่อพ่อแม่ไม่ได้\n1. Management 11",
            "choices": [{"label": "ก", "text": "ล้างแผลและฟันด้วยน้ำเกลือ และใส่กลับเข้าที่"}, {"label": "ข", "text": "ล้างแผลและฟันด้วยน้ำเกลือ ใส่กลับเข้าที่ splint 2 weeks"}, {"label": "ค", "text": "ล้างแผลและฟันด้วยน้ำเกลือ ใส่กลับเข้าที่ นัดมารักษารากใน 2 weeks"}, {"label": "ง", "text": "หยุดเลือด ล้างแผล แนะนำใส่ฟันเทียม"}, {"label": "จ", "text": "RCT นอกปากแล้วใส่เข้าที่"}],
            "correct_answer": None,
            "category": ClinicalCategory.PEDIATRIC_DENTISTRY.value,
            "task": ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 3: เด็กอายุ 7 ปี ล้มฟันหน้าหลุด พี่อายุ 15 ปี เก็บฟันห่อกระดาษทิชชู่พามาหาทันตแพทย์ ตรวจในช่องปากพบยังมีเลือดออกที่ socket พี่ให้ข้อมูลว่าน้องเป็นโรคเลือดหยุดยาก ไม่ทราบชื่อโรค ติดต่อพ่อแม่ไม่ได้\n2. ทันตแพทย์ควรทำอย่างไร",
            "choices": [{"label": "ก", "text": "ให้การรักษาตามมาตรฐาน"}, {"label": "ข", "text": "ให้พี่เซ็นยินยอมรับการรักษาแทน"}, {"label": "ค", "text": "โทรหาญาติที่บรรลุนิติภาวะ"}, {"label": "ง", "text": "รอติดต่อพ่อแม่"}, {"label": "จ", "text": "ให้ไปรักษาที่สถานพยาบาลของรัฐ"}],
            "correct_answer": None,
            "category": ClinicalCategory.COMMUNITY_DENTISTRY.value,
            "task": ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 3: เด็กอายุ 7 ปี ล้มฟันหน้าหลุด พี่อายุ 15 ปี เก็บฟันห่อกระดาษทิชชู่พามาหาทันตแพทย์ ตรวจในช่องปากพบยังมีเลือดออกที่ socket พี่ให้ข้อมูลว่าน้องเป็นโรคเลือดหยุดยาก ไม่ทราบชื่อโรค ติดต่อพ่อแม่ไม่ได้\n3. น้องมีโรคประจำตัวเป็นอะไร ตรวจ normal PTT, normochromic mild microcytic RBC",
            "choices": [{"label": "ก", "text": "Pernicious anemia"}, {"label": "ข", "text": "hemophilia"}, {"label": "ค", "text": "Leukemia"}, {"label": "ง", "text": "Polycythemia"}, {"label": "จ", "text": "thrombocytopenia"}],
            "correct_answer": None,
            "category": ClinicalCategory.ORAL_DIAGNOSIS_AND_ORAL_MEDICINE.value,
            "task": ProfessionalTask.DATA_GATHERING_AND_DIAGNOSIS.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 4: หญิง 20 ปี ปวดฟันกรามน้อยบนซ้าย ให้รูป Pa มา 25OD ผุลึก exposed pulp มี lesion ปลายราก involved floor of maxillary sinus (maxillary sinus opaque density ขาวขุ่น) 47 ผุทะลุ pulp มี lesion ที่ปลายราก widening PDL space, Lamina dura หาย, Opaque lesion ที่ปลายรากใหญ่ทั้ง M, D root และซี่ 37O ผุถึง middle 1/3 of dentin\n1. ถอน 25 แล้วตอน curette ไม่มี bone สอดเครื่องมือได้ลึก มีหนองไหลออกมา การจัดการที่เหมาะสม",
            "choices": [{"label": "ก", "text": "Valsava test"}, {"label": "ข", "text": "ล้างน้ำเกลือ เย็บแผล"}, {"label": "ค", "text": "เย็บ figure eight กัดก๊อซ"}, {"label": "ง", "text": "Gel form กัดก๊อซ"}, {"label": "จ", "text": "ส่งถ่าย Water view"}],
            "correct_answer": None,
            "category": ClinicalCategory.ORAL_SURGERY.value,
            "task": ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 4: หญิง 20 ปี ปวดฟันกรามน้อยบนซ้าย ให้รูป Pa มา 25OD ผุลึก exposed pulp มี lesion ปลายราก involved floor of maxillary sinus (maxillary sinus opaque density ขาวขุ่น) 47 ผุทะลุ pulp มี lesion ที่ปลายราก widening PDL space, Lamina dura หาย, Opaque lesion ที่ปลายรากใหญ่ทั้ง M, D root และซี่ 37O ผุถึง middle 1/3 of dentin\n2. มีลูกศรชี้ตรงรากซี่ 47 มีรอยสีขาวๆตรงปลายราก ฟิล์ม caries expose pulp เป็นไร",
            "choices": [{"label": "ก", "text": "Condensing osteitis"}, {"label": "ข", "text": "Osteoma"}, {"label": "ค", "text": "Fibrous dysplasia"}, {"label": "ง", "text": "Cemento osseous dysplasia"}, {"label": "จ", "text": "Periapical cyst"}],
            "correct_answer": None,
            "category": ClinicalCategory.ORAL_DIAGNOSIS_AND_ORAL_MEDICINE.value,
            "task": ProfessionalTask.DATA_GATHERING_AND_DIAGNOSIS.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 4: หญิง 20 ปี ปวดฟันกรามน้อยบนซ้าย ให้รูป Pa มา 25OD ผุลึก exposed pulp มี lesion ปลายราก involved floor of maxillary sinus (maxillary sinus opaque density ขาวขุ่น) 47 ผุทะลุ pulp มี lesion ที่ปลายราก widening PDL space, Lamina dura หาย, Opaque lesion ที่ปลายรากใหญ่ทั้ง M, D root และซี่ 37O ผุถึง middle 1/3 of dentin\n3. ซี่ 37 ผุ O ใหญ่ๆมี proximal มั้ยไม่แน่ใจ แต่ยังเห็น enamel band อยู่ตรงด้าน occlusal จะ management ยังไง",
            "choices": [{"label": "ก", "text": "Partial caries remove"}, {"label": "ข", "text": "Complete remove"}, {"label": "ค", "text": "Remove แล้ว temp"}, {"label": "ง", "text": "Hall technique"}, {"label": "จ", "text": "Nonselective remove to dentine"}],
            "correct_answer": None,
            "category": ClinicalCategory.RESTORATIVE_OPERATIVE_DENTISTRY.value,
            "task": ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 5: ผู้ป่วยชาย 65 ปี ถอนฟันซี่ 16 ไป 2 weeks แล้วกลับมาด้วยอาการปวดแผลถอนฟัน ปวดมากขึ้นตอนก้มศีรษะ เป็น hypertension แพ้ penicillin ให้ฟิล์ม 16 periapical เห็นเป็น socket ซี่ 16 และใน sinus ขุ่น\n1. ภาวะ hypertension ตัดที่ค่าเท่าไหร่ ช้อยเป็นค่า systolic กับ diastolic",
            "choices": [{"label": "ก", "text": "Systolic >140 mmHg Diastolic > 100 mmHg"}, {"label": "ข", "text": "Systolic >130 mmHg Diastolic > 100 mmHg"}, {"label": "ค", "text": "Systolic >140 mmHg Diastolic > 90 mmHg"}, {"label": "ง", "text": "Systolic >130 mmHg Diastolic > 90 mmHg"}, {"label": "จ", "text": "Systolic >150 mmHg Diastolic > 95 mmHg"}],
            "correct_answer": None,
            "category": ClinicalCategory.ORAL_DIAGNOSIS_AND_ORAL_MEDICINE.value,
            "task": ProfessionalTask.DATA_GATHERING_AND_DIAGNOSIS.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 5: ผู้ป่วยชาย 65 ปี ถอนฟันซี่ 16 ไป 2 weeks แล้วกลับมาด้วยอาการปวดแผลถอนฟัน ปวดมากขึ้นตอนก้มศีรษะ เป็น hypertension แพ้ penicillin ให้ฟิล์ม 16 periapical เห็นเป็น socket ซี่ 16 และใน sinus ขุ่น\n2. Acute sinusitis manage ในเบื้องต้นอย่างไร",
            "choices": [{"label": "ก", "text": "สอนล้าง sinus ด้วยน้ำเกลือ ผ่านรูถอนฟัน"}, {"label": "ข", "text": "Curette and irrigate with NSS"}, {"label": "ค", "text": "จ่าย Clindamycin 14 วัน"}, {"label": "ง", "text": "Buccal advancement flap ปิดแผล"}, {"label": "จ", "text": "ทำ infra antrostomy เพื่อระบายหนอง"}],
            "correct_answer": None,
            "category": ClinicalCategory.ORAL_SURGERY.value,
            "task": ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 5: ผู้ป่วยชาย 65 ปี ถอนฟันซี่ 16 ไป 2 weeks แล้วกลับมาด้วยอาการปวดแผลถอนฟัน ปวดมากขึ้นตอนก้มศีรษะ เป็น hypertension แพ้ penicillin ให้ฟิล์ม 16 periapical เห็นเป็น socket ซี่ 16 และใน sinus ขุ่น\n3. รอนานแค่ไหนก่อนทำ RPD",
            "choices": [{"label": "ก", "text": "1 สัปดาห์"}, {"label": "ข", "text": "1 เดือน"}, {"label": "ค", "text": "2 เดือน"}, {"label": "ง", "text": "6 เดือน"}, {"label": "จ", "text": "ทำเลยจ้า"}],
            "correct_answer": None,
            "category": ClinicalCategory.PROSTHODONTICS.value,
            "task": ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 6: เด็กอายุ 8 ขวบ มาถอนฟันน้ำนมไปเมื่อ 3 เดือนก่อน ถ่าย x ray ไปเมื่อ 6 เดือนก่อนไม่มีฟันผุ ตรวจในปากฟันซี่ 5 เป็น flush ฟันซี่ 6 เป็น edge to edge รูปทางคลินิกเห็นถอนฟันซี่ 64 ในปากมีช่องว่างแค่ของซี่ 64 ซี่เดียว ไปแล้ว มี torus palatinus ไม่ใหญ่มาก แม่มีประวัติ missing tooth\n1. ถ้าฟันซี่ 63 ของคนไข้รากละลายเหลือ 1/3 จะจัดการกับช่องว่าของ 64 อย่างไร",
            "choices": [{"label": "ก", "text": "Space regainer"}, {"label": "ข", "text": "Band and loop"}, {"label": "ค", "text": "Nance holding arch"}, {"label": "ง", "text": "Lingual holding arch"}, {"label": "จ", "text": "Quad helix"}],
            "correct_answer": None,
            "category": ClinicalCategory.PEDIATRIC_DENTISTRY.value,
            "task": ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 6: เด็กอายุ 8 ขวบ มาถอนฟันน้ำนมไปเมื่อ 3 เดือนก่อน ถ่าย x ray ไปเมื่อ 6 เดือนก่อนไม่มีฟันผุ ตรวจในปากฟันซี่ 5 เป็น flush ฟันซี่ 6 เป็น edge to edge รูปทางคลินิกเห็นถอนฟันซี่ 64 ในปากมีช่องว่างแค่ของซี่ 64 ซี่เดียว ไปแล้ว มี torus palatinus ไม่ใหญ่มาก แม่มีประวัติ missing tooth\n2. ฟันแบบนี้จะส่งผลให้เกิดอะไรในอนาคต",
            "choices": [{"label": "ก", "text": "Space loss and midline shift"}, {"label": "ข", "text": "Space loss and Lateral tongue thrust"}, {"label": "ค", "text": "generalized crowding and tongue thrusting"}],
            "correct_answer": None,
            "category": ClinicalCategory.PEDIATRIC_DENTISTRY.value,
            "task": ProfessionalTask.MECHANISM_OF_DISEASES.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 6: เด็กอายุ 8 ขวบ มาถอนฟันน้ำนมไปเมื่อ 3 เดือนก่อน ถ่าย x ray ไปเมื่อ 6 เดือนก่อนไม่มีฟันผุ ตรวจในปากฟันซี่ 5 เป็น flush ฟันซี่ 6 เป็น edge to edge รูปทางคลินิกเห็นถอนฟันซี่ 64 ในปากมีช่องว่างแค่ของซี่ 64 ซี่เดียว ไปแล้ว มี torus palatinus ไม่ใหญ่มาก แม่มีประวัติ missing tooth\n3. จะตรวจอย่างไรเพิ่มเติม",
            "choices": [{"label": "ก", "text": "Panoramic"}, {"label": "ข", "text": "คลำ tooth bud"}, {"label": "ค", "text": "Panoramic+bitewing+คลำtoothbud"}, {"label": "ง", "text": "Observeแล้วตรวจmobilityของฟันน้ำนมที่เหลือ"}],
            "correct_answer": None,
            "category": ClinicalCategory.PEDIATRIC_DENTISTRY.value,
            "task": ProfessionalTask.DATA_GATHERING_AND_DIAGNOSIS.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 7: ผู้ป่วยหญิงไทย อายุ 21 ปี พ่อเป็นข้าราชการ ทำงานเป็นครูสอนพิเศษ ไม่มีนายจ้าง มีอาการเสียวฟัน จึงไปหาทันตแพทย์ที่รพ.สังกัดกระทรวงสาธารณสุข พบฟันผุ ต้องอุดฟัน 5 ซี่\n1. โรงพยาบาลที่ไปรักษา มีช่องพิเศษสำหรับเจ้าหน้าที่ของโรงพยาบาลเพื่อรับการรักษาก่อน จากเหตุการณ์ข้างต้นพบว่ามีความเป็นธรรม (Equity) และความเท่าเทียม (Equality)อย่างไร",
            "choices": [{"label": "ก", "text": "เป็นธรรมและเท่าเทียม"}, {"label": "ข", "text": "ไม่เป็นธรรมแต่เทียมเทียม"}, {"label": "ค", "text": "ไม่เป็นธรรมและไม่เท่าเทียม"}, {"label": "ง", "text": "ประเมินความเป็นธรรมไม่ได้และเท่าเทียม"}, {"label": "จ", "text": "ประเมินทั้งความเป็นธรรมและความเท่าเทียมไม่ได้"}],
            "correct_answer": None,
            "category": ClinicalCategory.COMMUNITY_DENTISTRY.value,
            "task": ProfessionalTask.HEALTH_PROMOTION_AND_PREVENTION.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 7: ผู้ป่วยหญิงไทย อายุ 21 ปี พ่อเป็นข้าราชการ ทำงานเป็นครูสอนพิเศษ ไม่มีนายจ้าง มีอาการเสียวฟัน จึงไปหาทันตแพทย์ที่รพ.สังกัดกระทรวงสาธารณสุข พบฟันผุ ต้องอุดฟัน 5 ซี่\n2. สิทธิการรักษา",
            "choices": [{"label": "ก", "text": "สวัสดิการรักษาข้าราชการ"}, {"label": "ข", "text": "กองทุนประกันสังคม"}, {"label": "ค", "text": "กองทุนทันตกรรมแห่งชาติ"}, {"label": "ง", "text": "ไม่มีสิทธิการรักษา เนื่องจากอายุเกิน 20 ปี"}, {"label": "จ", "text": "หลักประกันสุขภาพแห่งชาติ"}],
            "correct_answer": None,
            "category": ClinicalCategory.COMMUNITY_DENTISTRY.value,
            "task": ProfessionalTask.HEALTH_PROMOTION_AND_PREVENTION.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 7: ผู้ป่วยหญิงไทย อายุ 21 ปี พ่อเป็นข้าราชการ ทำงานเป็นครูสอนพิเศษ ไม่มีนายจ้าง มีอาการเสียวฟัน จึงไปหาทันตแพทย์ที่รพ.สังกัดกระทรวงสาธารณสุข พบฟันผุ ต้องอุดฟัน 5 ซี่\n3. หลังรักษาฟันแล้ว ยังมีอาการเสียวฟัน จึงไปหาคลิกนิกทันตกรรมอีกแห่ง ทันตแพทย์ตรวจพบว่าฟันทั้ง5ซี่อุดไม่แนบโพรงประสาทฟัน ทันตแพทย์จึงแนะนำให้กลับไปรักษาที่เดิม แต่ผู้ป่วยปฎิเสธที่จะกลับไปรักษาที่เดิม เพื่อไม่ให้ผิดจรรยาบรรณวิชาชีพ ควรปฎิบัติตัวอย่างไร",
            "choices": [{"label": "ก", "text": "วิจารณ์งานตามที่เห็น"}, {"label": "ข", "text": "ชักชวนให้มาทำฟันกับตนเป็นประจำ"}, {"label": "ค", "text": "อุดฟันให้ แล้วคิดค่าบริการตามปกติ"}, {"label": "ง", "text": "แนะนำให้แก้เสียวฟันด้วยการรักษารากฟัน"}, {"label": "จ", "text": "ปฎิเสธการรักษา เนื่องจากไม่ได้รักษาตั้งแต่แรก"}],
            "correct_answer": None,
            "category": ClinicalCategory.COMMUNITY_DENTISTRY.value,
            "task": ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 8: คนไข้ cc มีเศษอาหารติดระหว่าง 16, 17 ให้ film BW ผุ 16D ½ enamel, ภาพ intraoral 18O ดูดำๆ (lesion น่าจะ active อยู่) 16,17 ดู sound แต่มีดำๆที่ proximal นิดหน่อย\n1. treatment for 18 คืออะไร",
            "choices": [{"label": "ก", "text": "Composite filling"}, {"label": "ข", "text": "Amalgam filling"}, {"label": "ค", "text": "Sealant"}, {"label": "ง", "text": "Follow up"}],
            "correct_answer": None,
            "category": ClinicalCategory.RESTORATIVE_OPERATIVE_DENTISTRY.value,
            "task": ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 8: คนไข้ cc มีเศษอาหารติดระหว่าง 16, 17 ให้ film BW ผุ 16D ½ enamel, ภาพ intraoral 18O ดูดำๆ (lesion น่าจะ active อยู่) 16,17 ดู sound แต่มีดำๆที่ proximal นิดหน่อย\n2. มีภาพ x ray 16D radiolucent extended to 1/3 outer of dentin มั้ง (class II one surface) lesion ห่างจาก marginal ridge ประมาณ 2 mm จะอุดคอมโพสิต ต้อง preparation อย่างไร",
            "choices": [{"label": "ก", "text": "กรอ cental pit เป็น classII conservative"}, {"label": "ข", "text": "กรอ D pit เป็น tunnel preparation"}, {"label": "ค", "text": "กรอจาก Marginal ridge เป็น vertical slot"}, {"label": "ง", "text": "กรอจาก Disto-buccal line angle เป็น horizontal slot"}, {"label": "จ", "text": "กรอจาก Disto-palatal line angle เป็น horizontal slot"}],
            "correct_answer": None,
            "category": ClinicalCategory.RESTORATIVE_OPERATIVE_DENTISTRY.value,
            "task": ProfessionalTask.PROCEDURES.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 8: คนไข้ cc มีเศษอาหารติดระหว่าง 16, 17 ให้ film BW ผุ 16D ½ enamel, ภาพ intraoral 18O ดูดำๆ (lesion น่าจะ active อยู่) 16,17 ดู sound แต่มีดำๆที่ proximal นิดหน่อย\n3. ให้ภาพ film x ray (ภาพจริง ซี่8 ซ้อนกับซี่7 มากกว่านี้และเป็น vertical angulation มากกว่า) ถ้าตรวจพบว่า 47 pulp necrosis จะทำอะไร",
            "choices": [{"label": "ก", "text": "RCT 47"}, {"label": "ข", "text": "Surgical removal 48 + RCT 47"}, {"label": "ค", "text": "Filling 47"}],
            "correct_answer": None,
            "category": ClinicalCategory.ENDODONTICS.value,
            "task": ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 9: ให้รูป full metal crown ฟันกรามมาดูมีรอยๆตรง proximal รู้สึก contact area ค่อนข้างใหญ่\n1. ข้อใดถูกเกี่ยวกับการแก้ proximal contact",
            "choices": [{"label": "ก", "text": "เช็ค contact ด้วย shimstock"}, {"label": "ข", "text": "กรอตกแต่ง contact ด้วย carborundum disk ชนิดละเอียด"}, {"label": "ค", "text": "ถ้า floss แล้วผ่านโดยไม่มีแรงต้านแสดงว่า contact แน่นดีแล้ว"}, {"label": "ง", "text": "ถ้าเช็คแล้วติด contact ทั้ง2ด้านให้กรอแก้ไปพร้อมๆกันเลย"}],
            "correct_answer": None,
            "category": ClinicalCategory.PROSTHODONTICS.value,
            "task": ProfessionalTask.PROCEDURES.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 9: ให้รูป full metal crown ฟันกรามมาดูมีรอยๆตรง proximal รู้สึก contact area ค่อนข้างใหญ่\n2. ลักษณะของครอบฟันในข้อใดที่ส่งผลต่อ biologic width",
            "choices": [{"label": "ก", "text": "Open margin"}, {"label": "ข", "text": "Overextended margin"}, {"label": "ค", "text": "Steep cusp inclination"}, {"label": "ง", "text": "Too tight contact"}, {"label": "จ", "text": "Overcontour"}],
            "correct_answer": None,
            "category": ClinicalCategory.PROSTHODONTICS.value,
            "task": ProfessionalTask.MECHANISM_OF_DISEASES.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 9: ให้รูป full metal crown ฟันกรามมาดูมีรอยๆตรง proximal รู้สึก contact area ค่อนข้างใหญ่\n3. ถ้าจะยึดครอบนี้ด้วย resin cement ต้องมี primer ที่มีส่วนประกอบของอะไร",
            "choices": [{"label": "ก", "text": "HEMA"}, {"label": "ข", "text": "Bis-GMA"}, {"label": "ค", "text": "MDP"}, {"label": "ง", "text": "HF"}, {"label": "จ", "text": "EDTA"}],
            "correct_answer": None,
            "category": ClinicalCategory.PROSTHODONTICS.value,
            "task": ProfessionalTask.PROCEDURES.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 10: เด็กอายุ 8 ขวบ เป็นโรคดาวน์ซินโดรม สติปัญญาอ่อนน้อย ปวดฟันซ้ายล่าง (ให้ภาพในช่องปาก x-ray เป็นรูปฟันซี่ 74, 75 ผุเยอะมาก มี radiolucent area ใหญ่ๆ ตั้งแต่ตรง furcation ของฟันไปจนถึงหน่อฟันแท้ข้างใต้ ภาพในช่องปากเป็นฟันผุเยอะและมีเหงือกบวม) มีประวัติเป็น atrial septal defect เคยมาทำฟันและไม่ค่อยให้ความร่วมมือ (potentially co-operative)\n1. ถ้าจะถอนฟันต้องให้ยายังไง",
            "choices": [{"label": "ก", "text": "Amoxicillin ก่อนรักษา"}, {"label": "ข", "text": "Amoxicillin ก่อนและหลังรักษา"}, {"label": "ค", "text": "Paracetamol หลังรักษา"}, {"label": "ง", "text": "Paracetamol และ amoxicillin หลังรักษา"}, {"label": "จ", "text": "Ibuprofen หลังรักษา"}],
            "correct_answer": None,
            "category": ClinicalCategory.PEDIATRIC_DENTISTRY.value,
            "task": ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 10: เด็กอายุ 8 ขวบ เป็นโรคดาวน์ซินโดรม สติปัญญาอ่อนน้อย ปวดฟันซ้ายล่าง (ให้ภาพในช่องปาก x-ray เป็นรูปฟันซี่ 74, 75 ผุเยอะมาก มี radiolucent area ใหญ่ๆ ตั้งแต่ตรง furcation ของฟันไปจนถึงหน่อฟันแท้ข้างใต้ ภาพในช่องปากเป็นฟันผุเยอะและมีเหงือกบวม) มีประวัติเป็น atrial septal defect เคยมาทำฟันและไม่ค่อยให้ความร่วมมือ (potentially co-operative)\n2. วิธีปรับพฤติกรรมที่เหมาะสม",
            "choices": [{"label": "ก", "text": "Hand over mouth exercise"}, {"label": "ข", "text": "Parental absent"}, {"label": "ค", "text": "Voice control"}, {"label": "ง", "text": "Tell show do"}, {"label": "จ", "text": "Distraction"}],
            "correct_answer": None,
            "category": ClinicalCategory.PEDIATRIC_DENTISTRY.value,
            "task": ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 10: เด็กอายุ 8 ขวบ เป็นโรคดาวน์ซินโดรม สติปัญญาอ่อนน้อย ปวดฟันซ้ายล่าง (ให้ภาพในช่องปาก x-ray เป็นรูปฟันซี่ 74, 75 ผุเยอะมาก มี radiolucent area ใหญ่ๆ ตั้งแต่ตรง furcation ของฟันไปจนถึงหน่อฟันแท้ข้างใต้ ภาพในช่องปากเป็นฟันผุเยอะและมีเหงือกบวม) มีประวัติเป็น atrial septal defect เคยมาทำฟันและไม่ค่อยให้ความร่วมมือ (potentially co-operative)\n3. ซี่ 36 (Partial erupted) Non cavitated carious lesion at occlusal aspect ทำการบูรณะด้วยอะไร",
            "choices": [{"label": "ก", "text": "PRR"}, {"label": "ข", "text": "Amalgam"}, {"label": "ค", "text": "Sealant Resin"}, {"label": "ง", "text": "Sealant GI"}, {"label": "จ", "text": "รอฟันขึ้นเต็มซี่แล้วอุด"}],
            "correct_answer": None,
            "category": ClinicalCategory.PEDIATRIC_DENTISTRY.value,
            "task": ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 11: ผู้ป่วย 60 ปี ฟันไม่มีอาการ ฟันหน้าล่างโยก มีเคี้ยวแล้วเจ็บบางครั้ง ให้ภาพคลินิก + x ray\n1. ซี่ 44 มี pd 5 mm mobility 1 ถาม prognosis (ในฟิล์มเห็น horizontal bone loss ประมาณ 25-50%)",
            "choices": [{"label": "ก", "text": "Good"}, {"label": "ข", "text": "Fair"}, {"label": "ค", "text": "Poor"}, {"label": "ง", "text": "Questionable"}, {"label": "จ", "text": "Hopeless"}],
            "correct_answer": None,
            "category": ClinicalCategory.PERIODONTICS.value,
            "task": ProfessionalTask.DATA_GATHERING_AND_DIAGNOSIS.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 11: ผู้ป่วย 60 ปี ฟันไม่มีอาการ ฟันหน้าล่างโยก มีเคี้ยวแล้วเจ็บบางครั้ง ให้ภาพคลินิก + x ray\n2. ซี่ 44 (ภาพ rct tooth ทีมีรอยโรคปลายรากมั้ง) เป็น infection แบบไหน",
            "choices": [{"label": "ก", "text": "Monoinfection"}, {"label": "ข", "text": "Primary"}, {"label": "ค", "text": "Secondary"}, {"label": "ง", "text": "Extraradicular"}, {"label": "จ", "text": "Persistent"}],
            "correct_answer": None,
            "category": ClinicalCategory.ENDODONTICS.value,
            "task": ProfessionalTask.MECHANISM_OF_DISEASES.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 11: ผู้ป่วย 60 ปี ฟันไม่มีอาการ ฟันหน้าล่างโยก มีเคี้ยวแล้วเจ็บบางครั้ง ให้ภาพคลินิก + x ray\n3. เก็บซี่ 12 ทำ coping เพราะอะไร",
            "choices": [{"label": "ก", "text": "ป้องกันการละลายของกระดูกเบ้าฟันเพิ่ม"}, {"label": "ข", "text": "เพิ่มความแข็งแรงของฟันเทียมถอดได้"}, {"label": "ค", "text": "ลดความเสี่ยงของ periodontitis"}, {"label": "ง", "text": "ลดค่าใช้จ่าย"}, {"label": "จ", "text": "เพื่อช่วยการออกเสียง"}],
            "correct_answer": None,
            "category": ClinicalCategory.PROSTHODONTICS.value,
            "task": ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 12: คนไข้ Cd ให้รูป cd เยิน ๆ แล้วก็เพดานมีจุดแดง ๆ ตรง posterior palate หลวมอยากทำใหม่ คนไข้สูบบุหรี่ ใส่ทั้งวันทั้งคืน ไม่ถอดฟันปลอมมาหลายปี\n1. Contributing factor",
            "choices": [{"label": "ก", "text": "Candida albicans"}, {"label": "ข", "text": "Smoking"}, {"label": "ค", "text": "Allergy"}, {"label": "ง", "text": "Mechanical Traumatic"}, {"label": "จ", "text": "Xerostomia"}],
            "correct_answer": None,
            "category": ClinicalCategory.ORAL_DIAGNOSIS_AND_ORAL_MEDICINE.value,
            "task": ProfessionalTask.MECHANISM_OF_DISEASES.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 12: คนไข้ Cd ให้รูป cd เยิน ๆ แล้วก็เพดานมีจุดแดง ๆ ตรง posterior palate หลวมอยากทำใหม่ คนไข้สูบบุหรี่ ใส่ทั้งวันทั้งคืน ไม่ถอดฟันปลอมมาหลายปี\n2. Diagnosis",
            "choices": [{"label": "ก", "text": "Denture stomatitis"}, {"label": "ข", "text": "Ulcer assoc. denture"}, {"label": "ค", "text": "LE"}, {"label": "ง", "text": "nicotinic stomatitis"}, {"label": "จ", "text": "Erythroplakia"}],
            "correct_answer": None,
            "category": ClinicalCategory.ORAL_DIAGNOSIS_AND_ORAL_MEDICINE.value,
            "task": ProfessionalTask.DATA_GATHERING_AND_DIAGNOSIS.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 12: คนไข้ Cd ให้รูป cd เยิน ๆ แล้วก็เพดานมีจุดแดง ๆ ตรง posterior palate หลวมอยากทำใหม่ คนไข้สูบบุหรี่ ใส่ทั้งวันทั้งคืน ไม่ถอดฟันปลอมมาหลายปี\n3. จะทำฟันปลอมใหม่ต้องตรวจอะไรเพื่มเติม",
            "choices": [{"label": "ก", "text": "Panoramic"}, {"label": "ข", "text": "Salivary flow rate"}, {"label": "ค", "text": "Sialogram"}, {"label": "ง", "text": "CBCT"}, {"label": "จ", "text": "Cephalometric"}],
            "correct_answer": None,
            "category": ClinicalCategory.PROSTHODONTICS.value,
            "task": ProfessionalTask.DATA_GATHERING_AND_DIAGNOSIS.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 13: ผู้ป่วย ญ 50 ปี ฉายรังสีศีรษะและลำคอ มีฟันผุทั่วไป อ้าปากได้น้อยป่วยมะเร็งได้รับการฉายรังสี ฟันหน้าสึกผุ ปลายฟัน palatal หลายซี่ อ้าปากได้แค่ 2 cm\n1. ถามว่าเกิดจากปัจจัยเสริมใด",
            "choices": [{"label": "ก", "text": "Xerostomia"}, {"label": "ข", "text": "Dysphagia"}, {"label": "ค", "text": "ความหนาแน่นbone"}, {"label": "ง", "text": "low fluoride intake"}, {"label": "จ", "text": "Limit mount opening"}],
            "correct_answer": None,
            "category": ClinicalCategory.ORAL_DIAGNOSIS_AND_ORAL_MEDICINE.value,
            "task": ProfessionalTask.MECHANISM_OF_DISEASES.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 13: ผู้ป่วย ญ 50 ปี ฉายรังสีศีรษะและลำคอ มีฟันผุทั่วไป อ้าปากได้น้อยป่วยมะเร็งได้รับการฉายรังสี ฟันหน้าสึกผุ ปลายฟัน palatal หลายซี่ อ้าปากได้แค่ 2 cm\n2. ปลายฟันหน้าควรอุดด้วยอะไร",
            "choices": [{"label": "ก", "text": "Small particle hybrid composite"}, {"label": "ข", "text": "Microfilled composite"}, {"label": "ค", "text": "Flowable composite"}, {"label": "ง", "text": "Conven GI"}, {"label": "จ", "text": "RMGI"}],
            "correct_answer": None,
            "category": ClinicalCategory.RESTORATIVE_OPERATIVE_DENTISTRY.value,
            "task": ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 13: ผู้ป่วย ญ 50 ปี ฉายรังสีศีรษะและลำคอ มีฟันผุทั่วไป อ้าปากได้น้อยป่วยมะเร็งได้รับการฉายรังสี ฟันหน้าสึกผุ ปลายฟัน palatal หลายซี่ อ้าปากได้แค่ 2 cm\n3. Permanent side effect ของการฉายรังสีคือ",
            "choices": [{"label": "ก", "text": "Fungal infection"}, {"label": "ข", "text": "Radiation caries"}, {"label": "ค", "text": "Nausea"}, {"label": "ง", "text": "Ulcer"}, {"label": "จ", "text": "gingival hemorrhage"}],
            "correct_answer": None,
            "category": ClinicalCategory.ORAL_DIAGNOSIS_AND_ORAL_MEDICINE.value,
            "task": ProfessionalTask.MECHANISM_OF_DISEASES.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 14: หญิงอายุ 30 ปี มาผ่าฟันคุดซี่ 38 ในภาพ panoramic เห็นซี่ 38 superimpose with IAN canal\n1. ผู้ป่วยมาติดตามแผล 1 สัปดาห์ถัดมา บอกว่ายังมีอาการชาอยู่ ถามว่าน่าจะชาตรงไหน",
            "choices": [{"label": "ก", "text": "แก้มด้านซ้าย"}, {"label": "ข", "text": "ลิ้นด้านซ้าย"}, {"label": "ค", "text": "ผิวหนังมุมขากรรไกรซ้าย"}, {"label": "ง", "text": "ผิวหนังคางซ้าย"}, {"label": "จ", "text": "เหงือกบริเวณซี่ 37"}],
            "correct_answer": None,
            "category": ClinicalCategory.ORAL_SURGERY.value,
            "task": ProfessionalTask.DATA_GATHERING_AND_DIAGNOSIS.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 14: หญิงอายุ 30 ปี มาผ่าฟันคุดซี่ 38 ในภาพ panoramic เห็นซี่ 38 superimpose with IAN canal\n2. จะเลือกการรักษาระหว่าง surgical removal กับ coronectomy จะส่งถ่ายอะไรเพิ่มเติม",
            "choices": [{"label": "ก", "text": "Postero-anterior ceph"}, {"label": "ข", "text": "Lateral ceph"}, {"label": "ค", "text": "CBCT"}, {"label": "ง", "text": "Left lateral oblique"}, {"label": "จ", "text": "Periapical technique with shift tube"}],
            "correct_answer": None,
            "category": ClinicalCategory.ORAL_SURGERY.value,
            "task": ProfessionalTask.DATA_GATHERING_AND_DIAGNOSIS.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 14: หญิงอายุ 30 ปี มาผ่าฟันคุดซี่ 38 ในภาพ panoramic เห็นซี่ 38 superimpose with IAN canal\n3. ในภาพ pano เห็นซี่ 36 มีอุด amalgam OM มีเงาดำที่ gingival margin ถามว่าจะทำอะไรเป็นลำดับถัดไป",
            "choices": [{"label": "ก", "text": "ถ่าย bitewing"}, {"label": "ข", "text": "Fluoride varnish แล้ว observe"}, {"label": "ค", "text": "Repair with GIC"}, {"label": "ง", "text": "Refilling with resin composite"}, {"label": "จ", "text": "ทำครอบฟัน"}],
            "correct_answer": None,
            "category": ClinicalCategory.RESTORATIVE_OPERATIVE_DENTISTRY.value,
            "task": ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 15: ผู้ป่วยเพศหญิง อายุ 60 ปี ฟันปลอมหลวมบนล่าง ความดัน 130/90 ชีพจร 69 กินยา asa 81 mg metoprolol 50 mg เหลือฟัน 33, 34, 43, 44 เหลือ bone ประมาณ 25%\n1. หากจะถอนฟัน ต้องจัดการยังไงจะเหมาะสม",
            "choices": [{"label": "ก", "text": "หยุด asa 7 วัน"}, {"label": "ข", "text": "ให้ Amox 1 ชม"}, {"label": "ค", "text": "ถอน under conscious sedation"}, {"label": "ง", "text": "ถอนทีละ Q"}, {"label": "จ", "text": "ส่งปรึกษาแพทย์"}],
            "correct_answer": None,
            "category": ClinicalCategory.ORAL_SURGERY.value,
            "task": ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 15: ผู้ป่วยเพศหญิง อายุ 60 ปี ฟันปลอมหลวมบนล่าง ความดัน 130/90 ชีพจร 69 กินยา asa 81 mg metoprolol 50 mg เหลือฟัน 33, 34, 43, 44 เหลือ bone ประมาณ 25%\n2. ข้อมูลใดสำคัญสุดในการวางแผนการทำฟันปลอมใหม่",
            "choices": [{"label": "ก", "text": "ความหนาแน่นกระดูก"}, {"label": "ข", "text": "สภาพฟันที่เหลือ"}, {"label": "ค", "text": "VDR ฟันปลอมเดิม"}, {"label": "ง", "text": "Occ plane ฟันปลอมเดิม"}, {"label": "จ", "text": "Max-mand relationship"}],
            "correct_answer": None,
            "category": ClinicalCategory.PROSTHODONTICS.value,
            "task": ProfessionalTask.DATA_GATHERING_AND_DIAGNOSIS.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 15: ผู้ป่วยเพศหญิง อายุ 60 ปี ฟันปลอมหลวมบนล่าง ความดัน 130/90 ชีพจร 69 กินยา asa 81 mg metoprolol 50 mg เหลือฟัน 33, 34, 43, 44 เหลือ bone ประมาณ 25%\n3. ป้องกัน combination syndrome ทำไร",
            "choices": [{"label": "ก", "text": "ถอนหมด ทำฟันปลอมบนล่างใหม่"}, {"label": "ข", "text": "ถอน43, 44 RCT33, 34 ทำ survey crown ทำฟันปลอมบนล่างใหม่"}, {"label": "ค", "text": "Implant ล่าง ทำฟันปลอมบนใหม่"}, {"label": "ง", "text": "เก็บฟันไว้เป็น abut ทำฟันปลอมบนล่างใหม่"}, {"label": "จ", "text": "เสริมกระดูกบน ทำฟันปลอมใหม่บนล่าง"}],
            "correct_answer": None,
            "category": ClinicalCategory.PROSTHODONTICS.value,
            "task": ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 16: ผู้ป่วยชายอายุ 65 ปี เคยทำรังสีรักษามะเร็งบริเวณโคนลิ้น ปัจจุบันทานยา aspirin, beta blocker, bisphosphonate (ให้รูป root caries ซี่ 46,47 มา) (ช้อยทุกข้อจะมีพวกวิธีการทามาให้ด้วย)\n1. Professional apply ที่จะให้",
            "choices": [{"label": "ก", "text": "38% SDF"}, {"label": "ข", "text": "1.23% F gel"}, {"label": "ค", "text": "Tricalcium phosphates"}, {"label": "ง", "text": "5% F vanish 2-3 นาทีแล้วล้าง"}, {"label": "จ", "text": "ให้ยาสีฟัน 5000 ppm ไปใช้ที่บ้าน"}],
            "correct_answer": None,
            "category": ClinicalCategory.RESTORATIVE_OPERATIVE_DENTISTRY.value,
            "task": ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 16: ผู้ป่วยชายอายุ 65 ปี เคยทำรังสีรักษามะเร็งบริเวณโคนลิ้น ปัจจุบันทานยา aspirin, beta blocker, bisphosphonate (ให้รูป root caries ซี่ 46,47 มา) (ช้อยทุกข้อจะมีพวกวิธีการทามาให้ด้วย)\n2. วัสดุบูรณะวันที่ไม่จำเป็นต้องใช้สารยึดติด",
            "choices": [{"label": "ก", "text": "compomer"}, {"label": "ข", "text": "giomer"}, {"label": "ค", "text": "RMGIC"}, {"label": "ง", "text": "resin composite contain fluoride"}, {"label": "จ", "text": "polyacidic modified resin composite"}],
            "correct_answer": None,
            "category": ClinicalCategory.RESTORATIVE_OPERATIVE_DENTISTRY.value,
            "task": ProfessionalTask.PROCEDURES.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 16: ผู้ป่วยชายอายุ 65 ปี เคยทำรังสีรักษามะเร็งบริเวณโคนลิ้น ปัจจุบันทานยา aspirin, beta blocker, bisphosphonate (ให้รูป root caries ซี่ 46,47 มา) (ช้อยทุกข้อจะมีพวกวิธีการทามาให้ด้วย)\n3. ข้อที่ต้องพิจารณาก่อนการอุดฟันซี่ 46,47 คืออะไร",
            "choices": [{"label": "ก", "text": "รอให้หายปากแห้งก่อนค่อยรักษา"}, {"label": "ข", "text": "เลือกใช้วัสดุที่ทำให้เกิด remineralization เพื่อป้องกันกันการเกิด osteonecrosis"}, {"label": "ค", "text": "Consult หมอ ป้องกันการเกิด osteonecrosis"}, {"label": "ง", "text": "รักษาได้ตามปกติแต่ระวังการใช้ยาชาที่มี vasoconstriction"}],
            "correct_answer": None,
            "category": ClinicalCategory.ORAL_DIAGNOSIS_AND_ORAL_MEDICINE.value,
            "task": ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 17: หญิงไทย อายุ 30 ปี มีตุ่มหนองที่เหงือกฟันล่างซ้าย เจ็บแปล๊บเมื่อกัดอาหารแข็ง มีประวัติมีแผลในกระเพาะอาหาร ลักษณะทางคลินิกและภาพรังสีดังรูป (ซี่ 35 มีตุ่มหนอง ภาพ x-ray มี 35 periapical radiolucent lesion)\n1. ผู้ป่วยมี VAS 5/10 ให้ยาแก้ปวดอะไร",
            "choices": [{"label": "ก", "text": "diclofenac"}, {"label": "ข", "text": "mefenemic acid"}, {"label": "ค", "text": "tramadol"}, {"label": "ง", "text": "celecoxib"}, {"label": "จ", "text": "ibuprofen"}],
            "correct_answer": None,
            "category": ClinicalCategory.ORAL_DIAGNOSIS_AND_ORAL_MEDICINE.value,
            "task": ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 17: หญิงไทย อายุ 30 ปี มีตุ่มหนองที่เหงือกฟันล่างซ้าย เจ็บแปล๊บเมื่อกัดอาหารแข็ง มีประวัติมีแผลในกระเพาะอาหาร ลักษณะทางคลินิกและภาพรังสีดังรูป (ซี่ 35 มีตุ่มหนอง ภาพ x-ray มี 35 periapical radiolucent lesion)\n2. เพื่อให้ได้การวินิจฉัยที่ถูกต้องในฟันซี่ 35 ควรตรวจอะไรเพิ่มเติม",
            "choices": [{"label": "ก", "text": "Bite test"}, {"label": "ข", "text": "Cold test"}, {"label": "ค", "text": "Heat test"}, {"label": "ง", "text": "EPT test"}, {"label": "จ", "text": "Mobility test"}],
            "correct_answer": None,
            "category": ClinicalCategory.ENDODONTICS.value,
            "task": ProfessionalTask.DATA_GATHERING_AND_DIAGNOSIS.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 17: หญิงไทย อายุ 30 ปี มีตุ่มหนองที่เหงือกฟันล่างซ้าย เจ็บแปล๊บเมื่อกัดอาหารแข็ง มีประวัติมีแผลในกระเพาะอาหาร ลักษณะทางคลินิกและภาพรังสีดังรูป (ซี่ 35 มีตุ่มหนอง ภาพ x-ray มี 35 periapical radiolucent lesion)\n3. การรักษาที่เหมาะสมในผู้ป่วยรายนี้คือ",
            "choices": [{"label": "ก", "text": "single visit RCT"}, {"label": "ข", "text": "pulpectomy"}, {"label": "ค", "text": "multiple visit RCT"}, {"label": "ง", "text": "pulpotomy"}, {"label": "จ", "text": "open and drain"}],
            "correct_answer": None,
            "category": ClinicalCategory.ENDODONTICS.value,
            "task": ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 18: ผู้ป่วยหญิง 30 ปี ผ่าฟันคุดซี่38 ไปแล้ว 1 อาทิตย์ มีอาการชาไม่หาย ให้ film op เหมือน impact ด้าน B-LI แบบว่าลึกมาก\n1. คนไข้ชาไม่หายหลังผ่า 1 สัปดาห์น่าจะชาบริเวณไหน",
            "choices": [{"label": "ก", "text": "ผิวหนังบริเวณคางซ้าย"}, {"label": "ข", "text": "แก้มซ้าย"}, {"label": "ค", "text": "ลิ้นซ้าย"}, {"label": "ง", "text": "ผิวหนังบริเวณกรามด้านซ้าย"}, {"label": "จ", "text": "เหงือกซี่ 37"}],
            "correct_answer": None,
            "category": ClinicalCategory.ORAL_SURGERY.value,
            "task": ProfessionalTask.DATA_GATHERING_AND_DIAGNOSIS.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 18: ผู้ป่วยหญิง 30 ปี ผ่าฟันคุดซี่38 ไปแล้ว 1 อาทิตย์ มีอาการชาไม่หาย ให้ film op เหมือน impact ด้าน B-LI แบบว่าลึกมาก\n2. ถ้าอยากตัดสินใจว่าจะ coronectomy หรือ surgical remove 38 ต้องตรวจอะไร",
            "choices": [{"label": "ก", "text": "CBCT"}, {"label": "ข", "text": "Lateral cep"}, {"label": "ค", "text": "Lateral oblique"}, {"label": "ง", "text": "MRI"}, {"label": "จ", "text": "Periapical"}],
            "correct_answer": None,
            "category": ClinicalCategory.ORAL_SURGERY.value,
            "task": ProfessionalTask.DATA_GATHERING_AND_DIAGNOSIS.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 18: ผู้ป่วยหญิง 30 ปี ผ่าฟันคุดซี่38 ไปแล้ว 1 อาทิตย์ มีอาการชาไม่หาย ให้ film op เหมือน impact ด้าน B-LI แบบว่าลึกมาก\n3. shift tube จากฟิล์มพบเงาใต้วัสดุอุดซี่ 36 ต้องทำอย่างไร",
            "choices": [{"label": "ก", "text": "Bitewing"}, {"label": "ข", "text": "Repair with composite"}, {"label": "ค", "text": "ทำ crown"}],
            "correct_answer": None,
            "category": ClinicalCategory.RESTORATIVE_OPERATIVE_DENTISTRY.value,
            "task": ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 19: ภาพฟันเด็กซี่ 84 ผุ MOD ใหญ่ มีอาการปวดเมื่อเคี้ยวอาหาร (รูปนี้เป๊ะเลย)\n1. ตรวจอะไรเพิ่มเพื่อ dx",
            "choices": [{"label": "ก", "text": "EPT"}, {"label": "ข", "text": "Percussion"}, {"label": "ค", "text": "Periapical radio"}, {"label": "ง", "text": "BW film"}, {"label": "จ", "text": "Hot test"}],
            "correct_answer": None,
            "category": ClinicalCategory.PEDIATRIC_DENTISTRY.value,
            "task": ProfessionalTask.DATA_GATHERING_AND_DIAGNOSIS.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 19: ภาพฟันเด็กซี่ 84 ผุ MOD ใหญ่ มีอาการปวดเมื่อเคี้ยวอาหาร (รูปนี้เป๊ะเลย)\n2. ถามว่าฉีดยาชาเพื่อทำการรักษาซี่ 84 โดน nerve ไหนบ้าง",
            "choices": [{"label": "ก", "text": "IAN + long buccal nerve + lingual nerve"}, {"label": "ข", "text": "IAN + lingual nerve"}, {"label": "ค", "text": "IAN + long buccal nerve"}, {"label": "ง", "text": "PSA + .."}],
            "correct_answer": None,
            "category": ClinicalCategory.ORAL_SURGERY.value,
            "task": ProfessionalTask.PROCEDURES.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 19: ภาพฟันเด็กซี่ 84 ผุ MOD ใหญ่ มีอาการปวดเมื่อเคี้ยวอาหาร (รูปนี้เป๊ะเลย)\n3. ถามว่าจะบูรณะด้วยอะไร",
            "choices": [{"label": "ก", "text": "SSC"}, {"label": "ข", "text": "GI"}, {"label": "ค", "text": "Resin composite filling"}, {"label": "ง", "text": "Amalgam filling"}, {"label": "จ", "text": "Interim"}],
            "correct_answer": None,
            "category": ClinicalCategory.PEDIATRIC_DENTISTRY.value,
            "task": ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 20: ผู้ป่วยชายไทย 60 ปี ปวดฟัน 45 มา 5 วัน เป็นโรค hypertension, coronary artery disease dyslipidemia เคยทำ balloon with stent 5ปีก่อน ทานยา propranolol simvastatin clopidogrel\n1. ถ้าจะถอนฟัน (ให้ภาพ x ray 46 severe perio) ต้องหยุดยา มั้ย",
            "choices": [{"label": "ก", "text": "หยุด clopidogrel ตอนเช้าก่อนทำฟัน"}, {"label": "ข", "text": "หยุด clopidogrel ก่อนทำฟัน 3 วัน"}, {"label": "ค", "text": "หยุด clopidogrel ก่อนทำฟัน 7 วัน"}, {"label": "ง", "text": "ไม่หยุด ถอน แล้ว iv tranexamic acid"}, {"label": "จ", "text": "ทำฟันปกติ"}],
            "correct_answer": None,
            "category": ClinicalCategory.ORAL_SURGERY.value,
            "task": ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 20: ผู้ป่วยชายไทย 60 ปี ปวดฟัน 45 มา 5 วัน เป็นโรค hypertension, coronary artery disease dyslipidemia เคยทำ balloon with stent 5ปีก่อน ทานยา propranolol simvastatin clopidogrel\n2. ซี่ 24 ในรูปในช่องปาก ฟันเปลี่ยนสีมีวัสดุอุดamalgam เคยรักษารากมาแล้ว ถามว่าจะทำอะไรต่อ",
            "choices": [{"label": "ก", "text": "ทำ post core crown"}, {"label": "ข", "text": "ทำ intracoronal bleaching แล้วทำcrown"}, {"label": "ค", "text": "ทำ intracoronal bleaching แล้ว เปลี่ยนเป็น composite"}, {"label": "ง", "text": "ทำ intracoronal bleaching แล้วอุดamalgam"}, {"label": "จ", "text": "รื้อ amalgam เปลี่ยนเป็น composite"}],
            "correct_answer": None,
            "category": ClinicalCategory.RESTORATIVE_OPERATIVE_DENTISTRY.value,
            "task": ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 20: ผู้ป่วยชายไทย 60 ปี ปวดฟัน 45 มา 5 วัน เป็นโรค hypertension, coronary artery disease dyslipidemia เคยทำ balloon with stent 5ปีก่อน ทานยา propranolol simvastatin clopidogrel\n3. ผลข้างเคียง tramadol",
            "choices": [{"label": "ก", "text": "Diarrhea and nausea"}, {"label": "ข", "text": "Dizziness and headache"}, {"label": "ค", "text": "Neusea and head"}, {"label": "ง", "text": "Heartburn and headache"}],
            "correct_answer": None,
            "category": ClinicalCategory.ORAL_DIAGNOSIS_AND_ORAL_MEDICINE.value,
            "task": ProfessionalTask.MECHANISM_OF_DISEASES.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 21: ชายอายุ 50 ปี ต้องการมาทำฟันปลอมใหม่เนื่องจากฟันปลอมหลวม พบรอยแดงที่เพดาน คราบน้ำลายหินปูนและฟันผุ ไม่มีฟันโยกผิดปกติ\n1. การจัดการซี่ 35 ที่เหมาะสม (ฟิล์มเป็นฟันรักษารากมาแล้วอุด composite)",
            "choices": [{"label": "ก", "text": "Refilling with composite"}, {"label": "ข", "text": "Rest seat preparation on old restoration"}, {"label": "ค", "text": "Survey crown"}, {"label": "ง", "text": "Core build with crown"}, {"label": "จ", "text": "Cast post and core with survey crown"}],
            "correct_answer": None,
            "category": ClinicalCategory.PROSTHODONTICS.value,
            "task": ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 21: ชายอายุ 50 ปี ต้องการมาทำฟันปลอมใหม่เนื่องจากฟันปลอมหลวม พบรอยแดงที่เพดาน คราบน้ำลายหินปูนและฟันผุ ไม่มีฟันโยกผิดปกติ\n2. ฟันซี่ 23 จะให้การรักษาที่เหมาะสมอย่างไร (ให้ภาพทางคลินิกมาเป็น post & core with crown ภาพรังสี ไม่มีรอยโรครอบปลายราก รักษารากมาแล้วอุดดี post seal แต่ว่าทางด้าน distal ตรงแถวขอบครอบฟันมี radiolucent)",
            "choices": [{"label": "ก", "text": "รื้อทำ crown ใหม่ ใช้ post&core เดิม"}, {"label": "ข", "text": "รื้อทำ post&core with crown ใหม่"}, {"label": "ค", "text": "รื้อ crown อุด distal ทำ crown ใหม่"}, {"label": "ง", "text": "เปิด flap อุด distal"}, {"label": "จ", "text": "retreat endo และทำ post&core with crown ใหม่"}],
            "correct_answer": None,
            "category": ClinicalCategory.RESTORATIVE_OPERATIVE_DENTISTRY.value,
            "task": ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 21: ชายอายุ 50 ปี ต้องการมาทำฟันปลอมใหม่เนื่องจากฟันปลอมหลวม พบรอยแดงที่เพดาน คราบน้ำลายหินปูนและฟันผุ ไม่มีฟันโยกผิดปกติ\n3. ให้ยาอะไรรักษารอยแดงที่เพดาน",
            "choices": [{"label": "ก", "text": "nystatin"}, {"label": "ข", "text": "triamxinolone"}, {"label": "ค", "text": "miconazole"}, {"label": "ง", "text": "minocycline"}, {"label": "จ", "text": "metronizole"}],
            "correct_answer": None,
            "category": ClinicalCategory.ORAL_DIAGNOSIS_AND_ORAL_MEDICINE.value,
            "task": ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 22: ผู้ป่วยป่วยหญิง 45 ปี มาด้วยเศษอาหารติดฟันด้านซ้ายล่าง มี BOP ที่ฟันซี่ 34 35 36 ภาพในช่องปากฟันซี่ 35 ขึ้นผิดที่ไปทาง lingual 34 และ 36 ชิดกัน\n1. ทำฟันมา 3 ชม. มีอาการปวดเมื่อยกล้ามเนื้อ แนะนำเบื้องต้นยังไง",
            "choices": [{"label": "ก", "text": "ให้กินยาคลายกล้ามเนื้อ"}, {"label": "ข", "text": "ให้คนไข้งดเคี้ยวข้างที่ปวด"}, {"label": "ค", "text": "ให้คนไข้ประคบอุ่น"}, {"label": "ง", "text": "ให้คนไข้นวดกล้ามเนื้อ"}, {"label": "จ", "text": "ให้คนไข้เคี้ยวหมากฝรั่ง"}],
            "correct_answer": None,
            "category": ClinicalCategory.ORAL_DIAGNOSIS_AND_ORAL_MEDICINE.value,
            "task": ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 22: ผู้ป่วยป่วยหญิง 45 ปี มาด้วยเศษอาหารติดฟันด้านซ้ายล่าง มี BOP ที่ฟันซี่ 34 35 36 ภาพในช่องปากฟันซี่ 35 ขึ้นผิดที่ไปทาง lingual 34 และ 36 ชิดกัน\n2. จะ Preparation margin แบบไหนถ้าจะทำครอบฟันชนิด Pressable ceramic crown",
            "choices": [{"label": "ก", "text": "Heavy chamfer"}, {"label": "ข", "text": "Light chamfer"}, {"label": "ค", "text": "Feather edge"}, {"label": "ง", "text": "Shoulder with bevel"}, {"label": "จ", "text": "Chamfer with bevel"}],
            "correct_answer": None,
            "category": ClinicalCategory.PROSTHODONTICS.value,
            "task": ProfessionalTask.PROCEDURES.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 22: ผู้ป่วยป่วยหญิง 45 ปี มาด้วยเศษอาหารติดฟันด้านซ้ายล่าง มี BOP ที่ฟันซี่ 34 35 36 ภาพในช่องปากฟันซี่ 35 ขึ้นผิดที่ไปทาง lingual 34 และ 36 ชิดกัน\n3. ถ้าจะถอนฟันซี่ 35 จะใช้เครื่องมืออะไร",
            "choices": [{"label": "ก", "text": "Forcep no.151"}, {"label": "ข", "text": "Forcep no.151s"}, {"label": "ค", "text": "Elevator no.190-191"}, {"label": "ง", "text": "Luxator"}, {"label": "จ", "text": "Root tip pick elevator"}],
            "correct_answer": None,
            "category": ClinicalCategory.ORAL_SURGERY.value,
            "task": ProfessionalTask.PROCEDURES.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 23: หญิง 60 ปี เป็นโรคหัวใจและความดันสูง BP 130/90 mmHg PR 69 bpm กินยา ASA 81 mg metoprolol 50 mg (ให้รูปในช่องปากเหลือซี่ 33-34 และ 43-44 ให้ OPG มา ทั้ง 4 ซี่bone loss มากๆ เหลือ bone อยู่ปลายราก) เคยใส่ฟันปลอม UCD + Lower ARPD ใส่มาหลายปีต้องการมาทำฟันปลอมใหม่ เนื่องจากฟันปลอมเก่าหลวม\n1. ข้อใดควรพิจารณาในการทำฟันปลอมใหม่",
            "choices": [{"label": "ก", "text": "สภาพฟันที่เหลืออยู่"}, {"label": "ข", "text": "ความสัมพันธ์ของขากรรไกรบนล่าง"}, {"label": "ค", "text": "Interarch space"}, {"label": "ง", "text": "Rest vertical dimension ฟันปลอมเดิม"}, {"label": "จ", "text": "Occlusal plane ฟันปลอมเดิม"}],
            "correct_answer": None,
            "category": ClinicalCategory.PROSTHODONTICS.value,
            "task": ProfessionalTask.DATA_GATHERING_AND_DIAGNOSIS.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 23: หญิง 60 ปี เป็นโรคหัวใจและความดันสูง BP 130/90 mmHg PR 69 bpm กินยา ASA 81 mg metoprolol 50 mg (ให้รูปในช่องปากเหลือซี่ 33-34 และ 43-44 ให้ OPG มา ทั้ง 4 ซี่bone loss มากๆ เหลือ bone อยู่ปลายราก) เคยใส่ฟันปลอม UCD + Lower ARPD ใส่มาหลายปีต้องการมาทำฟันปลอมใหม่ เนื่องจากฟันปลอมเก่าหลวม\n2. ไม่ให้เกิด combination syndrome ทำอย่างไร",
            "choices": [{"label": "ก", "text": "ถอนฟันที่เหลือ ทำฟันปลอมใหม่บนล่าง"}, {"label": "ข", "text": "ถอน 43-44 รักษาราก 33-34 ไว้เป็นหลักยึดแล้วทำฟันปลอมใหม่บนล่าง"}, {"label": "ค", "text": "เก็บไว้เป็นหลักยึดทำฟันปลอมใหม่"}],
            "correct_answer": None,
            "category": ClinicalCategory.PROSTHODONTICS.value,
            "task": ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 23: หญิง 60 ปี เป็นโรคหัวใจและความดันสูง BP 130/90 mmHg PR 69 bpm กินยา ASA 81 mg metoprolol 50 mg (ให้รูปในช่องปากเหลือซี่ 33-34 และ 43-44 ให้ OPG มา ทั้ง 4 ซี่bone loss มากๆ เหลือ bone อยู่ปลายราก) เคยใส่ฟันปลอม UCD + Lower ARPD ใส่มาหลายปีต้องการมาทำฟันปลอมใหม่ เนื่องจากฟันปลอมเก่าหลวม\n3. จะถอนฟัน ต้องเตรียมตัวอย่างไร",
            "choices": [{"label": "ก", "text": "งด ASA 7 วัน"}, {"label": "ข", "text": "ถอนทีละ quadrant"}, {"label": "ค", "text": "Consult หมอ"}, {"label": "ง", "text": "ให้ premed amoxicillin 2 g 60 นาทีก่อนทำ"}],
            "correct_answer": None,
            "category": ClinicalCategory.ORAL_SURGERY.value,
            "task": ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 24: ผู้ป่วย 25 ปี เพศหญิง มาด้วย cc ครอบฟันซี่ 22 หลุด gutta percha exposed ไม่มีอาการ จึงอุดชั่วคราวให้ ให้เอกซเรย์มาอย่างเดียว เอกซเรย์คือ gutta percha ส่วนบนๆดูไม่แน่น clinical crown สั้นๆ สูงกว่า bone ด้าน mesial ประมาณ 3 mm ด้าน distal 4mm\n1. ครอบฟันหลุดมา 1 สัปดาห์ gutta percha เผยผึ่งต่อมาได้อุดชั่วคราวไปแล้ว ควรมีการรักษาที่เหมาะสมอย่างไร",
            "choices": [{"label": "ก", "text": "observe ค่อยเริ่มการรักษาเมื่อรอยโรครอบปลายรากหาย"}, {"label": "ข", "text": "long-term provisional restoration เพื่อ observe รอยโรครอบปลายราก"}, {"label": "ค", "text": "retreat แล้ว ทำ post core with crown"}, {"label": "ง", "text": "ประเมิน C:R ratio เพื่อพิจารณาเพิ่มความยาวตัวฟัน"}, {"label": "จ", "text": "จำไม่ได้"}],
            "correct_answer": None,
            "category": ClinicalCategory.ENDODONTICS.value,
            "task": ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 24: ผู้ป่วย 25 ปี เพศหญิง มาด้วย cc ครอบฟันซี่ 22 หลุด gutta percha exposed ไม่มีอาการ จึงอุดชั่วคราวให้ ให้เอกซเรย์มาอย่างเดียว เอกซเรย์คือ gutta percha ส่วนบนๆดูไม่แน่น clinical crown สั้นๆ สูงกว่า bone ด้าน mesial ประมาณ 3 mm ด้าน distal 4mm\n2. เชื้อที่อยู่ปลายรากของฟันที่ดังกล่าวคืออะไร",
            "choices": [{"label": "ก", "text": "S.mutans"}, {"label": "ข", "text": "S.aureus"}, {"label": "ค", "text": "P.gingivilis"}, {"label": "ง", "text": "E.faecelis"}],
            "correct_answer": None,
            "category": ClinicalCategory.ENDODONTICS.value,
            "task": ProfessionalTask.MECHANISM_OF_DISEASES.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 24: ผู้ป่วย 25 ปี เพศหญิง มาด้วย cc ครอบฟันซี่ 22 หลุด gutta percha exposed ไม่มีอาการ จึงอุดชั่วคราวให้ ให้เอกซเรย์มาอย่างเดียว เอกซเรย์คือ gutta percha ส่วนบนๆดูไม่แน่น clinical crown สั้นๆ สูงกว่า bone ด้าน mesial ประมาณ 3 mm ด้าน distal 4mm\n3. intracanal irrigation ที่เหมาะสม ในการใช้รักษาคลองรากฟันซี่ 22",
            "choices": [{"label": "ก", "text": "2.5 % Sodium hypochrolite"}, {"label": "ข", "text": "5 NaOCl"}, {"label": "ค", "text": "0.12% CHX"}, {"label": "ง", "text": "CHX"}, {"label": "จ", "text": "17% EDTA"}],
            "correct_answer": None,
            "category": ClinicalCategory.ENDODONTICS.value,
            "task": ProfessionalTask.PROCEDURES.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 25: ผู้ป่วยหญิงไทย อายุ 60 ปี พบหินน้ำลายเเละร่องลึกปริทันต์โดยทั่วไปเฉลี่ย 4-6 mm ให้ภาพถ่ายมา 2 ภาพ : ภาพที่ 1 : เป็นภาพในช่องปากด้านข้างของ Q1/Q4 กัดสบกัน Q1 เป็น edentulous area, Q4 มีฟันครบ มีเหงือกร่นเล็กน้อย พบ KG อยู่บ้าง ภาพที่ 2 : x-ray Q4 เห็น radiopaque restorative material ที่ occlusal 46 สภาพดี เเละ OD 45 ขอบด้าน distal มี overhang restoration, มี horizontal bone loss ทั้งเเถบใน x ray\n1. ถามว่าสาเหตุการเกิดโรคปริทันต์ขากรรไกรล่างด้านขวา คือ",
            "choices": [{"label": "ก", "text": "Overhanging restoration"}, {"label": "ข", "text": "Dental calculus"}, {"label": "ค", "text": "Inadequate KG"}, {"label": "ง", "text": "Biofilm"}, {"label": "จ", "text": "Crowding"}],
            "correct_answer": None,
            "category": ClinicalCategory.PERIODONTICS.value,
            "task": ProfessionalTask.MECHANISM_OF_DISEASES.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 25: ผู้ป่วยหญิงไทย อายุ 60 ปี พบหินน้ำลายเเละร่องลึกปริทันต์โดยทั่วไปเฉลี่ย 4-6 mm ให้ภาพถ่ายมา 2 ภาพ : ภาพที่ 1 : เป็นภาพในช่องปากด้านข้างของ Q1/Q4 กัดสบกัน Q1 เป็น edentulous area, Q4 มีฟันครบ มีเหงือกร่นเล็กน้อย พบ KG อยู่บ้าง ภาพที่ 2 : x-ray Q4 เห็น radiopaque restorative material ที่ occlusal 46 สภาพดี เเละ OD 45 ขอบด้าน distal มี overhang restoration, มี horizontal bone loss ทั้งเเถบใน x ray\n2. อะไรทำให้เกิดผลเสียต่อซี่ 45",
            "choices": [{"label": "ก", "text": "ไม่กรอ gingival wall ให้เรียบและตั้งฉากกับแกนฟันทำให้ไม่มี resistance form"}, {"label": "ข", "text": "ไม่กรอ cavity preparation pulpal wall เป็นconventional ทำให้ไม่มี retention form"}, {"label": "ค", "text": "ทำเป็น slot prepation ทำให้ longitivity ไม่ดี"}, {"label": "ง", "text": "ไม่ได้อุดด้วย composite resin ทำให้ไม่มีความเข็งแรง"}, {"label": "จ", "text": "ไม่ทำ pulp protectionก่อนอุด amalgam"}],
            "correct_answer": None,
            "category": ClinicalCategory.RESTORATIVE_OPERATIVE_DENTISTRY.value,
            "task": ProfessionalTask.PROCEDURES.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 25: ผู้ป่วยหญิงไทย อายุ 60 ปี พบหินน้ำลายเเละร่องลึกปริทันต์โดยทั่วไปเฉลี่ย 4-6 mm ให้ภาพถ่ายมา 2 ภาพ : ภาพที่ 1 : เป็นภาพในช่องปากด้านข้างของ Q1/Q4 กัดสบกัน Q1 เป็น edentulous area, Q4 มีฟันครบ มีเหงือกร่นเล็กน้อย พบ KG อยู่บ้าง ภาพที่ 2 : x-ray Q4 เห็น radiopaque restorative material ที่ occlusal 46 สภาพดี เเละ OD 45 ขอบด้าน distal มี overhang restoration, มี horizontal bone loss ทั้งเเถบใน x ray\n3. ก่อนทำ post and core with crown ต้องทำการรักษาอะไรก่อน (gutta ที่อุดมาห่างปลายราก 5-6 มม.)",
            "choices": [{"label": "ก", "text": "retreat endo ก่อน"}, {"label": "ข", "text": "อุดด้วยวัสดุชั่วคราวก่อนแล้วสังเกตอาการต่อ"}],
            "correct_answer": None,
            "category": ClinicalCategory.ENDODONTICS.value,
            "task": ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 26: เด็ก 9 ขวบ มี space ระหว่าง 24 กับ 26 ให้รูป cast ortho บนล่างตอนอายุ 6 ขวบมา แล้วก็ภาพ mesial 26 ที่มี white spot lesion\n1. ใช้อะไรรักษา white spot lesion 26",
            "choices": [{"label": "ก", "text": "2% F varnish"}, {"label": "ข", "text": "1.23 APF gel"}, {"label": "ค", "text": "38% SDF"}, {"label": "ง", "text": "5% F varnish"}, {"label": "จ", "text": "Stannous F gel"}],
            "correct_answer": None,
            "category": ClinicalCategory.PEDIATRIC_DENTISTRY.value,
            "task": ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 26: เด็ก 9 ขวบ มี space ระหว่าง 24 กับ 26 ให้รูป cast ortho บนล่างตอนอายุ 6 ขวบมา แล้วก็ภาพ mesial 26 ที่มี white spot lesion\n2. ถาม icdas เท่าไหร่ ประมาณในภาพ",
            "choices": [{"label": "ก", "text": "0"}, {"label": "ข", "text": "1"}, {"label": "ค", "text": "2"}, {"label": "ง", "text": "3"}, {"label": "จ", "text": "4"}],
            "correct_answer": None,
            "category": ClinicalCategory.PEDIATRIC_DENTISTRY.value,
            "task": ProfessionalTask.DATA_GATHERING_AND_DIAGNOSIS.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 27: ผู้ป่วย 70 ปี ทำ CD U/L ไป 3 เดือน อันล่างหลวม (ในรูปสันเหงือกบน u-shaped อูมนูน แต่แอบเตี้ยนิดนึง คิดว่านะ55)\n1. ใช้ถาดพิมพ์และวัสดุพิมพ์อะไร",
            "choices": [{"label": "ก", "text": "Close fitting tray, Polysulfide medium body"}, {"label": "ข", "text": "Close fitting tray, Polyvinyl siloxane light body"}, {"label": "ค", "text": "Space tray, Polysulfide light body"}, {"label": "ง", "text": "Space tray, Polyvinyl siloxane light body"}, {"label": "จ", "text": "Space tray, zinc oxide paste"}],
            "correct_answer": None,
            "category": ClinicalCategory.PROSTHODONTICS.value,
            "task": ProfessionalTask.PROCEDURES.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 28: เด็ก 4 ขวบ 51 ฟันหลุด แม่แช่นม มาหาหมอใน 1 ชม 61 extrusion โยกระดับ 2\n1. ถ่าย x ray อะไร",
            "choices": [{"label": "ก", "text": "Orthopanto"}, {"label": "ข", "text": "Lateral intra-extra oral"}, {"label": "ค", "text": "Occlusal topo"}, {"label": "ง", "text": "Occlusal radiograph with horizontal shift tube"}, {"label": "จ", "text": "Periapical radiograph with horizontal shift tube"}],
            "correct_answer": None,
            "category": ClinicalCategory.PEDIATRIC_DENTISTRY.value,
            "task": ProfessionalTask.DATA_GATHERING_AND_DIAGNOSIS.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 28: เด็ก 4 ขวบ 51 ฟันหลุด แม่แช่นม มาหาหมอใน 1 ชม 61 extrusion โยกระดับ 2\n2. มีโอกาสเกิดอะไรกับ 11, 21",
            "choices": [{"label": "ก", "text": "MIH"}, {"label": "ข", "text": "Molttle enamel"}, {"label": "ค", "text": "Enamel hypoplasia"}, {"label": "ง", "text": "Missing"}, {"label": "จ", "text": "fusion"}],
            "correct_answer": None,
            "category": ClinicalCategory.PEDIATRIC_DENTISTRY.value,
            "task": ProfessionalTask.MECHANISM_OF_DISEASES.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 28: เด็ก 4 ขวบ 51 ฟันหลุด แม่แช่นม มาหาหมอใน 1 ชม 61 extrusion โยกระดับ 2\n3. การรักษาซี่ 51,61",
            "choices": [{"label": "ก", "text": "51 no tx"}, {"label": "ข", "text": "61 no tx / reposition with splint / ext"}, {"label": "ค", "text": "51 replant with splint"}, {"label": "ง", "text": "61 reposition with splint"}, {"label": "จ", "text": "61 ext"}],
            "correct_answer": None,
            "category": ClinicalCategory.PEDIATRIC_DENTISTRY.value,
            "task": ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 29: 1. มีรูป x ray ให้ ผุ class I ไม่ใกล้ pulp ถามว่าจะ remove caries ยังไง",
            "choices": [{"label": "ก", "text": "complete remove caries"}, {"label": "ข", "text": "เหลือ caries"}, {"label": "ค", "text": "Nonselective hard caries removal something"}, {"label": "ง", "text": "Hall technique"}],
            "correct_answer": None,
            "category": ClinicalCategory.RESTORATIVE_OPERATIVE_DENTISTRY.value,
            "task": ProfessionalTask.PROCEDURES.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        },
        {
            "question_text": "Stem 29: 2. มีภาพ x ray ซี่ 46 มีรอย Amalgam + ผุ OM expose pulp ให้ รอยโรคปลายราก",
            "choices": [{"label": "ก", "text": "Condensing osteitis"}, {"label": "ข", "text": "Cemento-osseous dysplasia"}, {"label": "ค", "text": "Fibrous dysplasia"}, {"label": "ง", "text": "Periapical cyst"}, {"label": "จ", "text": "Odontoma"}],
            "correct_answer": None,
            "category": ClinicalCategory.ENDODONTICS.value,
            "task": ProfessionalTask.DATA_GATHERING_AND_DIAGNOSIS.value,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2021 Part 2"
        }
    ]
}

with open('/Users/admin/Downloads/NL Test/parsed_exams/NL_2_2021_Part_2.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False)
