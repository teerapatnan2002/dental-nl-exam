import re
import json

schema_categories = [
    "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
    "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า",
    "ศัลยศาสตร์ช่องปาก",
    "ปริทันตวิทยา",
    "ทันตกรรมบูรณะ/หัตถการ",
    "วิทยาเอ็นโดดอนต์",
    "ทันตกรรมประดิษฐ์",
    "ทันตกรรมจัดฟัน",
    "ทันตกรรมสำหรับเด็ก",
    "ทันตกรรมชุมชน"
]

schema_tasks = [
    "การสร้างเสริมสุขภาพและการป้องกัน",
    "การเกิดและการดำเนินโรค",
    "การวินิจฉัยโรค",
    "การจัดการและการรักษาผู้ป่วย",
    "ขั้นตอนและวิธีการรักษา"
]

ocr_text = """Stem 1
คนไข้เพศหญิง อายุ 40 ปี มีด้วยมีอาการปวดเหงือกขวาล่าง หลังถอนฟันซี่ 45 มา 2 สัปดาห์ ปฏิเสธ 
โรคประจำตัว แพ้ยาแพ้อาหาร แผลถอนฟันหายดี 46 -ve to percussion, +ve to EPT 
กระดูกล่างขวาขยาย มี mild swelling, มี warmness, tenderness ให้ pano lesion อยู่ 44-46
1. จากฟิล์ม lesion เป็นอะไร 
ก. Tennis racket
ข. Honey comb
ค. Soap bubble
ง. Unilocular 
จ. Multulocular
2. Diff DX อะไร
ก. OKC, Ameloblastoma
ข. OKC, ABC
ค. Ameloblastoma, ABC
ง. Residual cyst, Peripheral giant cell granuloma
จ. Radicular cyst, Odontogenic myxoma
3. จะทำอะไร
ก. เปิด Buccal flap แล้ว incisional biopsy
ข. ถอน 46 แล้วทำ incisional biopsy 
ค. ถอน 44, 46 แล้ว enucleation และ biopsy
ง. ถอน 46 แล้ว enucleation
จ. marsupialization แล้ว enucleation
Stem 2
1. คุณภาพชีวิตในมิติสุขภาพช่องปาก กับคุณภาพชีวิตใน precede-procede model 
มีความเหมือนกันอย่างไร
ก. เป้าหมายสูงสุดของการปฏิบัตงาน
ข. ตัวชี้วัดของงาน
ค. แนะนำโดย ottawa
ง. ต้องมีการมีส่วนร่วมของชุมชน
จ. คำนึงถึง common risk
2. การกระทำใดที่แสดงให้เห็นถึงการพัฒนา QoL
ของชาวบ้านผ่านการพูดคุยเพื่อเรียนรู้ปัญหาในคลินิกทันตกรรม 
ก. ทำฟันปลอมให้ชาวบ้านที่เคี้ยวไม่ถนัด
ข. สอน ohi เพื่อกันไม่ให้ปวดฟัน
ค. ขูดหินปูนให้คนที่หินปูนหนา
ง. สอนคนไข้ให้เลิกบุหรี่เพื่อปริทันต์ที่ดี
3. จำคำถามไม่ได้ น่าจะประมาณการให้บริการทางทันตกรรมใดที่ช่วยพัฒนาคุณภาพชีวิตให้คนไข้มั้ง?
ก. ผ่าฟันคุดเพื่อไม่ให้ปวดบวมภายหลัง
ข. ขูดหินปูนเพื่อให้มีสุขภาพช่องปากที่ดี
ค. สอนแปรงฟันหลังขูดหินปูนเพื่อให้มีสุขภาพช่องปากที่ดีขึ้น
ง. อุดคอฟันสึกที่ยังไม่มีอาการเพื่อกันเสียว
จ. ทำฟันปลอมเนื่องจากคนไข้เคี้ยวไม่สะดวก
Stem 3
เคสคนไข้ชาย อายุ 60 ปี มาด้วยฟันปลอมบนหลวม มีหินปูนเต็มฟันปลอม ภายในช่องปาก 
เป็นรอยแดงตามฐานฟันปลอม ฟันบนที่เหลือเป็นฟันหลังซึ่งเป็น RR ทุกซี่ มีเหงือกมาปิดคลุมที่ฟัน RR 
และเหงือกทั่วไปอักเสบมาก เหงือกที่เพดานปกติ แค่แดงเหมือน candida stomatitis type II มีfrenum
เกาะสูงที่ posterior ของ Q2
1. ข้อใดถูกต้องในการเตรียมช่องปากคนไข้ ก่อนทำฟันปลอมบนชุดใหม่
ก. ถอนฟัน rr ทุกซี่, แต่ง soft tissue บริเวณ alveolar process 
ข. ถอนฟัน rr ทุกซี่, แต่ง soft tissue บริเวณ alveolar process, frenectomy
ค. ถอนฟัน rr ทุกซี่, frenectomy
ง. ถอนฟัน rr ทุกซี่, แต่ง soft tissue บริเวณเพดาน 
จ. ถอนฟัน rr ทุกซี่, แต่ง soft tissue บริเวณเพดานและบริเวณ alveolar process
2. จะจัดการกับรอยอักเสบบนเพดานอย่างไร
ก. แช่ฟันปลอมในน้ำส้มสายชู + แปรงด้วยยาสีฟัน
ข. ไม่ใส่ฟันปลอม 2 สัปดาห์ นัดดูอาการ
ค. ทำ tissue conditioner ไม่ให้ฟันปลอมหลวม
ง. เติม flange ฟันปลอม
จ. แช่ฟันปลอมใน sodium hypochlorite ตอนกลางคืน
3. สาเหตุที่ฟันปลอมหลวม
ก. ไม่ได้ทำ posterior palatal seal
ข. ทำความสะอาดฟันเทียมไม่ดี มี calculus เกาะ
ค. การสูญเสียฟันหลัก direct abutment
ง. ไม่มี labial และ buccal flange ที่ยาวเพียงพอ
จ. ผู้ป่วยสูงอายุมีภาวะ xerostomia
Stem 4 
คนไข้ 60 ปี เป็นโรคหัวใจ กินยา coumadin มาทำฟันปลอม ให้รูป clinic+OPG ในปากเหลือฟันแค่ 
45-46 ไม่ล้ม แต่มี recess เยอะ ในฟิลม์เห็น 13 embbed 45-46 bone loss ประมาณครึ่งนึง ให้ภาพ สัน
เหงือกบนไม่มีฟันแต่สันเหงือกแถว 13จะดูเต็มๆกว่าบริเวณอื่น สันเหงือกล่าง มีฟันซี่ 45และ46เหงือกร่น
ประมาณ2-3มม (ประมาณจากสายตา) ให้ภาพ x ray เป็น panpanoramic มันฟันฝังซี่ 13 ในขากรรไกรบน
ขากรรไกรล่างมีฟัน 2 ซี่ คือ 45 และ46 bone support ประมาณ 50%
1. ถ้าจะผ่า embbed 13 ต้องซักประวัติอะไร
ก. INR
ข. Hospitalization
ค. ยาอื่นๆ
ง. การแพ้ยา
จ. ประวัติผ่าตัดหัวใจ
2. mechanism of disease ของโรค perio 46 : RANKL RANK OPG อันไหนปกติ/เพิ่ม/ลด
ก. Increase RANKL increase LANK increase OPG
ข. Increase RANKL decrease LANK normal OPG
ค. Normal RANKL increase LANK decrease OPG
ง. Increase RANKL normal LANK decrease OPG
จ. Decrease RANKL increase LANK increase OPG
3. คนไข้ไม่อยากถอน 45, 46 จะทำ RRD ล่างยังไง 
ก. reverse aker 45 เพราะ 45 เป็น true stress breaker
ข. ring clasp 45
ค. multiple circlet 45-46 เพื่อช่วยกันรับแรง
ง. ทำ rpd คู่ cd ไม่ได้
จ. ไม่วางตะขอ
Stem 5
เพศชาย อายุ 25 ปี มาตรวจฟันและต้องการขูดหินปูน ให้ภาพ intraoral 2 รูป มีจุดแดง ๆ หลายจุด 
จาก gingival margin 14-16 ถึง mid palate
1. Diagnosis
ก. Herpes simplex infection
ข. Herpes zoster infection
ค. Traumatic ulcer
ง. Apthous ulcer
จ. Erosive lichen planus
2. คำแนะนำที่เหมาะสมสำหรับคนไข้
ก. เลี่ยงแปรงฟัน 1 สัปดาห์
ข. เลี่ยงไหมขัดฟัน 1 สัปดาห์
ค. บ้วน CHX หลัง แปรงฟันทุกครั้ง
ง. เลี่ยงอาหารหวาน
จ. เลี่ยงใช้ช้วนส้อมและแก้วน้ำร่วมกับผู้อื่น
3. การจัดการคนไข้
ก. ขูดหินปูนได้เลย
ข. บ้วน CHX ก่อนขูดหินปูน
ค. บ้วน .... elicix ก่อนขูดหินปูน
ง. ทา steroid หายแล้วค่อยมาขูด
จ. จ่ายยาต้านไวรัส หายแล้วค่อยมาขูด
Stem 6 
หญิง 60 ปี มาด้วยอาการเจ็บแปลบใต้ปีกจมูกขวา เป็นมา 1 เดือน เป็นเฉพาะเวลาลูบและล้างหน้า 
NRS 10/10 เป็นนาน 1-2 นาที ลักษณะทางคลินิกและภาพรังสีดังแสดง (ซี่ 11 สีคล้ำ ไม่มีรอยฟันผุทางคลินิก 
ภาพรังสีมีรอยโรคปลายราก)
1. สาเหตุของฟันเปลี่ยนสี
ก. Dental caries
ข. Internal resorption
ค. External stain
ง. Dental trauma 
จ. Traumatic occlusion
2. วิธีแยก non-odontogenic origin
ก. Local anesthesia
ข. CBC
ค. MRI
ง. CBCT
จ. Water’s view
3. วิธีตรวจแยกโรคที่เหมาะสม
ก. Allodynia test กับ purcussion test
ข. Hot test กับ purcussion test
ค. Cold test กับ purcussion test
ง. EPT กับ purcussion test
จ. EPT กับ inferior alveolar nerve block
Stem 7
คนไข้มาด้วยฟันฟลอมหลวม ขยับได้คนไข้กินยา warfarin, enapril, astrovaststin ให้รูปในปากมา
มีติ่งเนื้อที่ vestibule ฟันบนตามขอบฟันปลอม
1. ติ่งเนื้อที่ขึ้นเกิดจากสาเหตุใด
ก. ฟันปลอมหลวม
ข. กินยาที่ทำให้เหงือกโต
ค. เชื้อรา
ง. ภูมิคุ้มกันบกพร่อง
2. จะทำอย่างไรเป็นอย่างแรก
ก. reline ฟันปลอมด้วย soft liner
ข. ปรึกษาแพทย์เรื่องยา 
ค. ทำฟันปลอมใหม่
ง. ตัดติ่งเนื้อ
จ. Antifungal drug
3. Dx ว่าอะไร
ก. Epulis fissuratum
ข. Denture stomatitis
Stem 8
หญิง 70 ปี เป็นผู้ป่วยติดเตียง ให้อาหารผ่านสายยาง มีฟันหน้าถึงฟันกรามน้อยทั้งบนล่าง แปรงฟัน
เองไม่ได้ ลูกสาวอายุ 50ปีเป็นคนดูแล ตรวจช่องแปากพบคราบจุลินทรีย์จำนวนมากยกเว้นด้าน labial ของ
ฟันหน้า
1. การมอบหมายให้ทันตาภิบาล รพ. สต. ใกล้บ้าน เป็นผู้ดำเนินการป้องกันโรค ทำได้ไหม
ก. ทำได้ ไม่ขัดต่อระเบียบ
ข. ทำได้ แต่ทันตแพทย์ต้องไปด้วย
ค. ทำได้เฉพาะทันตาภิบาลปริญญาสาธารณสุข
ง. ทำไม่ได้ เพราะเป็นฟันแท้
จ. ทำไม่ได้ เพราะต้องทำในสถานที่พยาบาลเท่านั้น
2. ในฐานะทีมสหวิชาชีพ จะทำยังไง
ก. สอนลูกสาวควบคุมคราบจุลินทรีย์
ข. ป้องกันแผลกดทับ
ค. ฟื้นฟูกล้ามเนื้อขากรรไกรและใบหน้า
3. ทันตแพทย์ จะป้องกันยังไง
ก. ป้องกันปอดติดเชื้อ
ข. ป้องกันการติดเชื้อในกระแสเลือด
ค. ป้องกันโรคฟันผุ
ง. ป้องการการสูญเสียฟัน
Stem 9
ให้รูป fluctuant swelling, dome-shaped อยู่ใต้ลิ้น บริเวณ Floor of mouth
1. Dx
ก. Mucocele
ข. Ranula
ค. Mucoepidermoid carcinoma
ง. Gingival cyst
2. เกี่ยวกับ structure อะไร
ก. Sublingual gland
ข. Subman gland
ค. Wharton duct
ง. Minor salivary gland
จ. Lingual vein
3. กำจัดอย่างไร
ก. Excisional biopsy
ข. Needle aspiration
ค. Marsupialization
Stem 10 
คนไข้อายุ 40 ปีมาด้วยอาการบวมใต้ปีกจมูกด้านซ้าย มา 2 วัน กดเจ็บในปาก ตั้งแต่ซี่ 21-23 ตรวจซี่ 
22 เคาะเจ็บ EPT negative, 21,23 ตรวจแล้วปกติดี, vestibule บวม 10*15 mm. 
ให้รูป xray 21-23 มีรอยโรค radiolucent มี center ที่ปลายรากซี่ 22 
1. Diag 22
ก. Pulp necrosis with acute apical abscess
ข. Irreversible pulpitis with asymptomatic apical periodontitis
ค. Pulp necrosis with vestibular abscess
ง. Pulp necrosis with symptomatic apical periodontitis
จ. Symptomatic irreversible pulpitis with apical abscess
2. Treatment ยังไง
ก. Incision and drain, ATB, RCT
ข. ATB, RCT
ค. Open and drain, ATB, RCT
ง. Enucleation, Incision and drain, ATB
จ. Extraction, ATB
3. ถามว่าตรงปีกจมูกบวมขึ้นมาได้ยังไง
ก. ทะลุผ่าน labial plate ไปเหนือ levator anguli oris
ข. ทะลุผ่าน labial plate ไปใต้ quadratus labii superioris
ค. ทะลุ palatal plate ไปที่ sinus
ง. ติดเชื้อร่วมกับการมีบาดแผลที่ริมฝีปาก
จ. สัมพันธ์กับการบาดเจ็บบริเวณแก้มซ้าย
Stem 11
ผู้ป่วยหญิงอายุ 55 ปี ปวดหน้าหูด้านซ้ายเวลาขยับขากรรไกร คลำเจ็บ และบวม มีโรคกระดูกพรุน 
ให้ภาพ transcranial ของ joint มา (น่าจะ OA)
1. จะปัก implant ซี่ 36,46 ต้องการดูความหนาแน่นของกระดูกต้องประเมินจากอะไร
ก. Periapical film
ข. Panoramic
ค. MRI
ง. CBCT
2. หลังจากให้การรักษาแบบ conservative ไปแล้วแต่ยังมีอาการปวด จะให้การจัดการยังไงต่อ
ก. Occlusal adjustment
ข. Arthrocentesis
ค. Arthroplasty
ง. arthroscopy 
จ. joint replacement 
3. ลักษณะทางคลินิกที่พบ
ก. Cripitation
ข. Deflection jaw
ค. Closed lock
ง. Unilateral posterior openbite
จ. Bilateral posterior openbite
Stem 12
ชายอายุ 60 ปี มาด้วยอาการเหงือกบวมๆ มีเลือดออกเวลาแปรงฟัน
1. ยาที่มีความสัมพันธ์กับสภาพเหงือกของคนไข้ (ช้อยเป็นชื่อยาความดันทั้ง 5 กลุ่มเลย หาที่เป็น 
CCB อ่ะ) 
ก. Nifedipine
ข. Enalapril
ค. Propanolol
ง. Thiazide
จ. Lozartan
2. จะ Manage ยังไง 
ก. ตัดเหงือกที่บวมตาม cc
ข. ให้ยาปฏิชีวนะ
ค. ซักประวัติยาที่กินและโรคประจำตัว
ง. น้ำยาบ้วนปากเพื่อฆ่าและสอนแปรงฟัน
จ. OHI 
3. ตอนตรวจคนไข้พบว่า mouth mirror ติดกระพุ้งแก้มคนไข้ ก็อซก็ติดเหมือนกัน 
ดูที่ก็อซพบว่ามีเนื้อเยื่อหลุดลอกมาด้วย ควรตรวจอะไรเพิ่มเติม
ก. Sialogram
ข. Sialolith sonography
ค. Salivary flow rate
ง. Salivary pH
จ. Salivary buffer capacity
Stem 13
ผู้ป่วยหญิงทํางานในโรงงานแบตเตอรี กินยาแก้แพ้ ฟันผุหลายซี่ ชอบดื่มน้ำมะนาวโซดา กินยา 
citririzine รูปช่องปาก erosion คอฟันทั้งปาก 
1. ฟันผุเพราะอะไร
ก. กินของหวานบ่อย
ข. กินเครื่องดื่มกรด
ค. Occupational hazard
ง. น้ำลายน้อย
จ. Parafunctinal habit
2. แนะนําสาร remin อะไร
ก. APF
ข. NaF
ค. Silver diamine fluoride
ง. Tricalcium phosphate fluoride varnish
จ. -CHX mounthrinse
3. การทำ gingivectomy เพื่อบูรณะซี่23 ต้องดูอะไร (ในรูปที่ให้ซี่23 ผุคอฟันลงใต้เหงือก)
ก. ระยะระหว่าง zenith กับ IDP
ข. High frenum attachment
ค. ความนูนของรากซี่23
ง. ความลึกของ intrabony defect
จ. ความกว้างของ keratined gingiva
Stem 14
ผู้ป่วยอายุ 70 ปฏิเสธโรคประจำตัวและการแพ้ยา ไม่มีประวัติสูบบุหรี่ ดื่มสุรา เคี้ยวหมาก 
มีรอยโรคสีขาวเช็ดไม่ออกที่สันเหงือกล่าง ไม่มีอาการใดๆ (เป็นรูป edentulous ridge no posterior 
support ฟันบนมีแค่ 15 ฟันล่างมีแค่ 42, 43 ประมาณนี้มั้ง รอยขาวที่สัน ridge ล่าง ตรงกับที่ 15 สบลง)
1. โรคที่เป็นไปได้
ก. Leukoedema
ข. Oral submucous fibrosis
ค. Chronic hyperplastic candidiasis
ง. Frictional keratosis
จ. Oral lichen planus
2. หลังขูดหินปูนและเกลารากฟัน การหายของเหงือกเป็นแบบไหน
ก. Long junctional epithelial 
ข. Reattachment
ค. New attachment
ง. Scar tissue
จ. Regeneration
3. อุดฟัน 15M ด้วยอะไร (ในภาพเป็น ซี่ 15 recessionประมาณ 4 mm มี active root caries 
ที่ด้าน mesial อยู่เหนือเหงือกประมาณ 0.5 mm)
ก. Flowable composite
ข. Microhybrid compost
ค. Nanafilled composite
ง. GI
จ. Amalgam
Stem 15
ก เป็นเพื่อนกับ ข โดย ก ไปจัดฟันแฟชั่นมา พบว่าหลังจัดฟัน ฟันเรียงผิดปกติ เหงือกอักเสบ bleed 
ง่าย, ข คิดว่าควรไปให้ทันตแพทย์เป็นคนจัดฟันให้ดีกว่า จึงไปขอให้ทันตแพทย์ a จัดฟันให้ โดยทันตแพทย์ a 
ตรวจฟันพบว่าฟัน ข ปกติดี
1. ทันตแพทย์ a ปฏิเสธที่จะจัดฟันให้ ควรอ้างอะไร
ก. สิทธิผู้ป่วย
ข. คุ้มครองผู้บริโภค
ค. นิยามวิชาชีพทันตกรรม
ง. โฆษณา
จ. พรบ สถานพยาบาล
2. จากโจทย์ อะไรแสดงถึง social determinant of health 
ก. พฤติกรรมเพื่อนกำหนดพฤติกรรม
ข. จรรยาบรรณกำหนดพฤติกรรมหมอ
ค. พฤติกรรมส่งผลสุขภาพ
3. สาเหตุที่ทำให้ ก เหงือก bleed เยอะ
ก. เพิ่ม local contributing factor
ข. แรงที่ให้ผิดขนาดและทิศทาง
ค. แพ้เครื่องมือและวัสดุจัดฟัน
ง. ไม่มี self-cleansing จากริมฝีปากและแก้ม
Stem 16
ญ 40 ปี เศษอาหารติดระหว่าง 23/24, 24 pd 8-10 mm โดยรอบ 24, 26 3degree mobility 
(Xray 24M bone loss แบบ vertical ไม่เห็นเงา bone ด้าน Pa และ B)
1. 24M bone defect แบบไหน
ก. Circum
ข. Horizontal bone loss
ค. One wall
ง. Two wall
จ. Three wall
2. 24,26 tx แบบไหน
ก. GTR
ข. Bone graft
ค. Extraction
ง. Tooth stabilization 
จ. 5 Occlusal adjust
3. เศษอาหารส่งผลยังไงกับการละลายของกระดูก
ก. เศษอาหารอัดติดเป็นปัจจัยหลักให้กระดูกละลาย
ข. เศษอาหารอัดติดเป็นปัจจัยเสริมให้กระดูกละลาย
ค. ไม้จิ้มฟันทำให้ trauma และกระดูกละลาย
ง. ปริมาณเศษอาหารที่ติดทำให้ trauma และกระดูกละลาย
จ. กรดจากเศษอาหารทำให้กระดูกละลาย
Stem 17 
คนไข้เพศชาย อายุ 30 ปี มี Food impaction ปวดตอนดื่มน้ำเย็น ตรวจ +ve to ept +ve to 
percussion (ให้ภาพ x-ray ซี่ 15OM ผุ)
1. ถ้าจะทำ OC emer ใช้น้ำยา irrigant และ medication ด้วยอะไร
ก. NSS with caoh2
ข. NSS with oil of clove
ค. Naocl with caoh2
ง. Naocl with oil of clove
จ. Chx with oil of clove
2. อะไรมีผลต่อการกำหนด MAF ตอนทำ MI
ก. Main cone ที่ทันตแพทย์มี
ข. ความโค้งของรากฟัน
ค. ความรุนแรงของความปวด
ง. ชนิดซี่ฟัน หน้า หลัง
จ. ขนาดpost ที่จะใช้
3. Crown lengthening ซี่ 15 จะพิจารณาอะไร
ก. รื้อจนถึง apical margin ของเนื้อฟันดี + crestal bone
ข. รื้อจนถึง apical marginของเนื้อฟันดี + ความยาวราก
ค. ขอบผุใน xray + รื้อจนถึง apical margin ของเนื้อฟันดี 
ง. ขอบผุในxray +crestal bone
จ. ขอบผุใน xray + ความยาวราก
Stem 18
ให้ภาพฟันซี่ 25 26 ,26 มีอะมัลกัม ODL ขอบไม่ดีแล้ว 26OM มีcavity slot เล็กๆ แคบๆ แพลน
จะรื้อแล้วอุดด้วยวัสดุcomposite ให้ภาพหลังรื้ออะมัลกัมมา มีBase ข้างใต้แล้วเหลือเนื้อฟันบางๆ
ประมาณ1mm คั่นระหว่าง slot กับ cavity ของอะมัลกัมเดิม
1. จำเป็นต้องรื้อ base เดิมออกหมดมั๊ย
ก. ไม่จำเป็น เพราะไม่ต้องการให้dentine สัมผัสกับสิ่งแวดล้อมภายนอก
ข. ไม่จำเป็น เพราะสามารถรื้อแค่บางส่วน
ค. ไม่จำเป็น เพราะ.....
ง. จำเป็น เพราะอาจมีเนื้อฟันผุข้างใต้base เดิม
จ. จำเป็น เพราะ......
2. จากภาพขอบเหงือกซี่25,26 ดูแดงเล็กน้อย เป็นประมาณ mild gingivitis โจทย์ถามว่าจะพบเซลล์
อะไรมากที่สุดที่บริเวณขอบเหงือกนี้
ก. Eosinophil
ข. Monocyte
ค. Basophil
ง. PMN
จ. Plasma cell
3. ต้องตัด enamel ที่คั่นระหว่าง cavity ออกมั๊ย
ก. ไม่ตัด เพราะเสียเนื้อฟัน
ข. ไม่ตัด เพราะ enamel เป็น substrate ที่ดีสำหรับการ bonding
ค. ไม่ตัด เพราะจะทำให้อุดด้วย composite เยอะขึ้น เกิด shrinkage มากขึ้น
ง. ตัด เพราะช่วยให้เข้าไป removed caries ได้ดีและบูรณะฟันได้สะดวก
จ. ตัด เพราะจะได้resistance form
Stem 19
ให้ภาพ 16 dry socket คนไข้มาด้วยปวด 
1. ถามถอนฟันนานแค่ไหน ใส่ฟันปลอมได้
ก. ใส่ได้เลย
ข. 2wks
ค. 4wks
ง. 8wks
จ. 6เดือน
Stem 20
หญิง 45 กดเจ็บใต้ปีกจมูกซ้าย ไม่บวม มีประวัติ RCT ซี่ 23 มา 1 ปี ให้ x-ray มา 1 รูป เป็น RCT ซี่ 
23 อุดไม่เต็ม ห่างจากปลายราก 2-3 มม
1. เกิดความผิดพลาดในขั้นตอนใดถึงทำให้ RCT fail
ก. LT MI
ข. LT FRC
ค. MI FRC
ง. OC MI
จ. OC FRC
2. เชื้อที่ทำให้ RCT fail
ก. Aerobes
ข. Facultative anaerobes
ค. Strict anaerobes
ง. Candida spp
3. ระหว่างซี่ 44/45 มี narrow gingival sulcus ซี่ 45M มี PD 5 mm ควรใช้เครื่องมืออะไรในการ
เกลารากฟัน
ก. Minifive Gracey Currette 11/12
ข. Afterfive Gracey Currette 11/12
ค. Posterior sickle
ง. Gracey sickle 7/8
Stem 21
ซี่ 15, 16 หาย 26 FMC มี mesial rest แต่ซี่ข้าง ๆ ไม่หาย ฟันล่าง 37, 38 หาย, 35, 36 PFM, 44 
มี classV 46 overlay ใส่ฟันปลอมบนล่าง 
1. check abutment xrayอะไร
ก. Peri 14,17,46 bw ข้างซ้าย
ข. Peri 26,35,26 bw ข้างขวา
ค. Peri 14,17,26,35,36,44,46
ง. Peri ทุกซี่
จ. Peri + bw fm
2. 36 จะใส่ครอบแบบ pressable all ceramic จะใช้ margin แบบใด
ก. chamfer
ข. Sholder with bevel
ค. Heavy chamfer
ง. ....with bevel
จ. Feather edge
Stem 22
ซี่ 12 เนื้อฟันเหลือน้อย รักษา RCT มาแล้ว บูรณะเป็น metal post with PFM วัสดุ shorten 
มีรอยโรค เคาะเจ็บ
1. diagnosis ของฟันซี่นี้
ก. Previously treated with acute apical abscess
ข. Previously-initiated
2. จะ restore อย่างไร
ก. Post and core with pfm
ข. Metal coping
ค. Frefab post 
ง. Composite crown
จ. PFM crown
Stem 23
ชาย 20 ปี ปวดบริเวณแก้มด้านขวาขณะจัดฟัน +ve palpation at right masseter muscle, เป็น 
localized pain 
1. ให้วินิจฉัยรอยโรคและแนวทางการรักษาฟันซี่ 38 (ให้รูปฟันผุสีดำตาม groove ไม่มี plaque)
ก. ICDAS 2, inactive, observe 6 เดือน
ข. ICDAS 2, active, sealant
ค. ICDAS 3, inactive, sealant
ง. ICDAS 3, active, PRR
จ. ICDAS 4, active, PRR
2. รักษาอาการปวดกล้ามเนื้อยังไง
ก. ประคบอุ่นและหยุดเคลื่อนฟันก่อน
ข. Spray and stretch
ค. Trigger point injection
ง. ถอดเหล็กจัดฟันและใส่ splint
3. Pseudopocket 4 mm. ด้าน labial ฟันหน้าล่าง
ก. Observe 6 เดือน
ข. ย้ายตำแหน่ง bracket
ค. Gingivectomy
ง. Crown lengthening
จ. Sc&RP, OHI
Stem 24
ผู้ป่วยหญิงอายุ30 ปีปฏิเสธโรคประจำตัว ให้รูปในช่องปาก กับฟิล์มซี่ 31 มีรอยโรคปลายราก
1. Error ที่มักเกิดในการรักษารากฟันซี่ 31
ก. OC ทะลุด้าน Li
ข. OC ทะลุด้าน La
ค. MI แล้วเกิด apical zip
ง. Apical perforation
2. การบูรณะหลังรักษารากซี่ 31 เสร็จ
ก. ครอบฟัน
ข. Composite filling
ค. veneer
3. ซี่ 32 ที่ midLa เหงือกร่น2 mm probing depth 3 mm CAL เท่าไหร
ก. 1
ข. 2
ค. 3
ง. 5
จ. 7
Stem 25
ให้รูปฟันในช่องปาก ฟันขาวขุ่น โดยทั่ว เด็กอายุ 15 ปี
1. รอยโรคขาวขุ่นที่พบบนผิวเคลือบฟัน เกิดจากความผิดปกติเกิดรูพรุนในชั้นไหน
ก. Surface zone
ข. Subsurface zone
ค. Translucent zone
ง. Subtransparent zone
จ. Dark zone
2. รักษารอยโรคยังไง
ก. Fluoride varnish
ข. Fluoride gel
ค. CPP-ACP
ง. ทา silver diamine
จ. Acidurated phosphate
3. คาดว่าสาเหตุเกิดจากอะไร
ก. ชอบกินจุบจิบ
ข. พันธุกรรม
ค. กลืนฟลูออไรด์มากเกินตอนเด็ก
ง. ตอนแม่ท้องกินยา
จ. ฟันน้ำนมผุทะลุ pulp หลายซี่
Stem 26
ชายอายุ 50 ปี 36 วัสดุอุดแตก 35 อุดชั่วคราวไว้ มีประวัติรักษารากมา 1 ปี (ภาพรังสี 35 มาดูอุด
แน่นดี อุดไม่เกิน แต่มีรอยโรคปลายราก)
1. การรื้อกัตตาเปอร์ชาซี่ 35 วิธีที่เหมาะสมคืออะไร
ก. ใช้ gate glidden รื้อตลอดทั้งราก
ข. ใช้ solvent รื้อตลอดราก
ค. ใช้ gate ส่วนcoronal ใช้solvent ส่วนปลายราก
ง. ใช้ gate ส่วนcoronal ใช้file ส่วนปลายราก
จ. ใช้เครื่องมือที่ให้ความร้อนรื้อส่วน coronal, solvent ส่วนปลายราก
2. ซี่ 23 ภายหลังการใส่ฟันปลอม ควรระวังเรื่องอะไรเป็นพิเศษ (ในรูป ซี่ 23 เป็น abutment ของ 
RPD บน ใส่ฟันแค่ 24, 25 มี cingulum rest และมี aker’s clasp ที่อยู่ชิดเหงือก)
ก. Gingival recession
ข. Dental caries
ค. Tooth movement
ง. Tooth mobility
จ. Tooth fracture
3. บูรณะซี่ 34 35 36 ใช้ articulator แบบไหน
ก. Hinge arti
ข. Arcon arti
ค. Small nonadjustable
ง. Fully adjustable
Stem 27
ผ่าฟันคุดซี่ 38 ไป หลังตัดไหม 2 สัปดาห์ มีก้อนบริเวณที่ถอนฟัน (ก้อนดำ ๆ ม่วง ๆ แดง ๆ ) มี
เลือดออกตอนเคี้ยวอาหาร
1. x ray แล้วไม่พบความผิดปกติ จะตรวจอะไรเพิ่มเติม
ก. ซักประวัติโรค chronic liver disease ตรวจ Liver function test CBC BUN/Cr
ข. ซักประวัติการทานยาแก้ปวด ตรวจ Bleeding time PT/PTT
ค. ซักประวัติทานยา anticoagulant ตรวจ Bleeding time
ง. ซักประวัติ chronic disease เช่น ปอด ตรวจ CBC CXR
5. ซักประวัติทางพันธุกรรม ตรวจ CBC Liver function test2. ให้การวินิจฉัยเบื้องต้นว่าอะไร
ก. hemangioma
ข. delayed wound healing
ค. clot in the socket
ง. pyogenic granuloma
จ. infected wound
3. ถ้าการส่งตรวจ CBC PT PTT BT ปกติ จะวินิจฉัยว่าเป็นโรคอะไร
ก. mild hemophilia A
ข. delay fibrinolytic
ค. pseudocyst of jaw
ง. benign tumor of the jaw
จ. von Willi band disease
Stem 28
นาง ก. ไปหาทันตแพทย์A เพื่อขูดหินปูน ทันตแพทย์A บอกว่าเป็น gen perio นาง ก. ไม่พอใจ
เนื่องจากไปขูดหินปูนกับทันตแพทย์B เป็นประจำทุกๆ 6 เดือน
1. นางก. ขอเปลี่ยนมารักษากับทันตแพทย์เอ แต่ทันตแพทย์เอบอกว่าต้องให้ทันตแพทย์บีอนุมัติก่อน
(ประมาณว่าต้องให้ทพ.บีอนุญาตก่อน) นโยบายของคลินิกนี้ขัดกับหลักอะไร
พรบ.สถานพยาบาล, สิทธิผู้ป่วย, พรบ.วิชาชีพ, พรบ.สถานพยาบาล, จรรยาบรรณวิชาชีพ
(สลับกันไปมา โดยในช้อยส์ข้อนึงจะมี3 อย่าง)
2. ผู้ป่วยอยากจะฟ้องเอาค่าเสียหายจากทพ A ต้องไปฟ้องที่ไหน
ก. ศาลคุ้มครองผู้บริโภค (อันนี้มั้ง??)
ข. ศาลแพ่ง
ค. ศาลอาญา
ง. ทพสภา 
จ. สถานีตำรวจใกล้คลินิก
3. ทพ. A ไม่ได้ตรวจอะไรตามหลักของการรักษาปริทันต
ก. opg radiograph
ข. plaque index
ค. function occlusion
ง. hypersensitivity
จ. sensibility
Stem 29
ทันตแพทย์โรงพยาบาลชุมชน ทำโครงการกับผู้สูงอายุ 200 คน เรื่องการป้องกันโรคโดยหลักการ
กำจัดปัจจัยเสี่ยงร่วม (common risk factor)
1. ความเครียดเกี่ยวกับการป้องกันโรคอย่างไร
ก. ความเครียดทำให้ไม่อยากแปรงฟัน
ข. ความเครียดส่งผลต่อการเกิดโรคปริทันต์
ค. ความเครียดทำให้อยากกินน้ำตาลเพิ่มขึ้น
ง. ความเครียดทำให้สูบบุหรี่
จ. ไม่เกี่ยวกัน
2. หลักการของหลักการกำจัดปัจจัยเสี่ยงร่วมคืออะไร
ก. ลดโรคทางระบบ สามารถลดโรคช่องปากได้
ข. ลดโรคช่องปาก สามารถลดโรคทางระบบ
ค. จัดการปัจจัยเสี่ยงบางอย่าง สามารถลดการเกิดโรคได้หลายโรค
3. เป้าหมายสูงสุดของ proced-preced คืออไร
ก. คุณภาพชีวิตของผู้สูงอายุดีขึ้น
ข. พฤติกรรมสุขภาพดีขึ้น
ค. ทำให้นโยบายสุขภาพเกิดขึ้น
ง. ความรุนแรงของโรคปริทันต์ลดลง"""

exam_bank = {"questions": []}

text = re.sub(r'Stem (\d+)', r'STEM_START \1', ocr_text)
stems = text.split('STEM_START ')

for stem_part in stems[1:]:
    lines = stem_part.strip().split('\n')
    stem_num = lines[0].strip()
    
    stem_text_lines = []
    q_blocks = []
    current_q = []
    
    for line in lines[1:]:
        line = line.strip()
        if not line:
            continue
        if re.match(r'^\d+\.', line):
            if current_q:
                q_blocks.append(current_q)
            current_q = [line]
        elif current_q:
            current_q.append(line)
        else:
            stem_text_lines.append(line)
            
    if current_q:
        q_blocks.append(current_q)
        
    stem_text = " ".join(stem_text_lines)
    
    for q_block in q_blocks:
        q_text_lines = []
        choices = []
        
        for line in q_block:
            choice_match = re.match(r'^([กขคงจ])\.\s*(.*)', line)
            if choice_match:
                choices.append({
                    "label": choice_match.group(1),
                    "text": choice_match.group(2).strip()
                })
            else:
                q_text_lines.append(line)
                
        question_text = f"Stem {stem_num}: {stem_text}\n" + "\n".join(q_text_lines)
        
        cat = "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก"
        task = "การวินิจฉัยโรค"
        
        if any(w in stem_text for w in ["ผุ", "amalgam", "composite", "cavity", "ครอบ", "บูรณะ", "เคลือบฟัน", "remin", "erosion", "ICDAS"]):
            cat = "ทันตกรรมบูรณะ/หัตถการ"
        if any(w in stem_text.lower() for w in ["เหงือก", "perio", "pocket", "cal ", "gingivitis", "ร่น"]):
            cat = "ปริทันตวิทยา"
        if any(w in stem_text for w in ["ถอน", "ผ่า", "lesion", "บวม", "dry socket", "cyst"]):
            cat = "ศัลยศาสตร์ช่องปาก"
        if any(w in stem_text.lower() for w in ["ฟันปลอม", "denture", "rpd", "implant", "rest ", "clasp"]):
            cat = "ทันตกรรมประดิษฐ์"
        if any(w in stem_text.lower() for w in ["rct", "รากฟัน", "pulp", "apical", "ept", "ซี่ 22", "ซี่ 31"]):
            cat = "วิทยาเอ็นโดดอนต์"
        if any(w in stem_text for w in ["จัดฟัน", "bracket"]):
            cat = "ทันตกรรมจัดฟัน"
        if any(w in stem_text for w in ["เด็ก", "น้ำนม", "15 ปี"]):
            cat = "ทันตกรรมสำหรับเด็ก"
        if any(w in stem_text.lower() for w in ["ชุมชน", "อนามัย", "โครงการ", "นโยบาย", "qol", "คุณภาพชีวิต", "precede"]):
            cat = "ทันตกรรมชุมชน"
        if any(w in stem_text.lower() for w in ["joint", "ขากรรไกร", "oa"]):
            cat = "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า"

        q_lower = " ".join(q_text_lines).lower()
        if any(w in q_lower for w in ["วินิจฉัย", "diagnosis", "dx", "diag", "x ray", "ตรวจ", "ประเมิน"]):
            task = "การวินิจฉัยโรค"
        elif any(w in q_lower for w in ["รักษา", "จัดการ", "manage", "treatment", "tx"]):
            task = "การจัดการและการรักษาผู้ป่วย"
        elif any(w in q_lower for w in ["สาเหตุ", "เกิดจาก", "mechanism", "error", "เชื้อ", "ผล", "ทำให้", "ส่งผล"]):
            task = "การเกิดและการดำเนินโรค"
        elif any(w in q_lower for w in ["ป้องกัน", "แนะนำ", "คุณภาพชีวิต", "qol", "risk", "preced", "เป้าหมาย"]):
            task = "การสร้างเสริมสุขภาพและการป้องกัน"
        elif any(w in q_lower for w in ["เครื่องมือ", "วัสดุ", "เตรียม", "รื้อ", "ตัด", "margin", "บูรณะ"]):
            task = "ขั้นตอนและวิธีการรักษา"

        if not choices and "พรบ" in q_lower:
            choices = [{"label": "ก", "text": "พรบ.สถานพยาบาล, สิทธิผู้ป่วย, พรบ.วิชาชีพ, พรบ.สถานพยาบาล, จรรยาบรรณวิชาชีพ (สลับกันไปมา)"}]
            
        exam_bank["questions"].append({
            "question_text": question_text,
            "choices": choices,
            "correct_answer": None,
            "category": cat,
            "task": task,
            "source_exam": "NL 2 2021 Part 4"
        })

import os
out_path = '/Users/admin/Downloads/NL Test/parsed_exams/NL_2_2021_Part_4.json'
os.makedirs(os.path.dirname(out_path), exist_ok=True)
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(exam_bank, f, ensure_ascii=False, indent=2)

print("Parsed and saved successfully.")
