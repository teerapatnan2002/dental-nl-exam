import re
import json

text = """
Academic affairs, Dental Student Association of Thailand 2022
รวมขอ้ สอบประเมนิ ความรูท้ างวทิ ยาศาสตรก์ ารแพทยแ์ ละทันตแพทยพ์ นื ฐาน ครงั ที 1/2566
NL 2 Part 4 วนั อาทิตยท์ ี 15 มกราคม 2566 15:35 - 17:20 น.
STEM 1
คนไขเ้พศหญงิ อายุ 30 ปปฏิเสธโรคประจาํ ตัวและประวตั ิแพย้ า ชอบกินนาํ อัดลมระหวา่ งมอือาหาร สบู บุหรีดมื
แอลกอฮอล์เคยถอนฟน อุดฟน แต่ไมเ่ คยได้รบั OHI (ใหภ้ าพ x-ray bitewing มีmolar ผลุ ึก 2 ซี enamel caries
หลายตําแหนง่ )
1. Odontoblast cell สรา้งอะไรในการปอ งกัน pulp จากฟน ผุ
1. Mantle dentin
2. Secondary dentin
3. Reparative dentin
4. Reactionary dentin
5. Turbit
2. หลังอุดฟน เสรจ็ แนวทางการปอ งกันโรคทีเกิดขนึ ใหมค่ วรทําอะไร (ไมใ่ หเ้กิดฟน ผ)ุ
1. Diet counselling
2. Antiseptic mouthwash
3. Saliva stimulate
4. Deep pit and fissure sealant
5. ถ่าย bitewing ทกุ 3 เดือน
3. ระหวา่ งทําเหน็ แผลทีเพดานปาก ผปู้ ว ยรสู้ กึ อ่อนเพลีย เปน ต่มุ นาํ ครงึ palate แค่ฝง Q1 เรยีงยาวถึง range ควรทํา
อยา่ งไร
1. Antiseptic mouthwash
2. Antifungal medication
3. Antiviral medication
4. Topical steroid
5. Anesthetic mouthwash
STEM 2
ใหร้ ปู คนไขห้ นา้ด้านขา้งขากรรไกรล่างอ้าปาก มรีปู ด้านหนา้มแีผลถลอกเยอะ ๆ ฟน หนา้ openbite
คนไขช้ าย 30 ปประสบอุบตั ิรถชนมาเมอื 12 ชวั โมงก่อน ยงั มสีติดีจาํ เหตกุ ารณไ์ด้ anterior open bite, limited
mouth opening, ชารมิฝปากล่าง, sublingual hematoma, maxilla movable สว่ น piriform rim
4. จากภาพด้านขา้ง ขอ้ ใด้เปน ไปได้มากสดุ
1. Bilateral condylar fracture
2. Bilateral coronoid fracture
3. Fracture of ramus
4. Fracture at body of mandible
5. Fracture angle of mandible
5. ควรถ่ายภาพรบั สอี ะไรเพมิ เติม
1. PA mand, Lateral oblique of mand, Reverse Towne, Waters
2. PA mand, Waters
3. PA mand, Reverse Towne, Waters
4. Lateral oblique of mand, Reverse Towne, Waters
5. Lateral oblique of mand, Reverse Towne
6. ใชเ้กณฑ์อะไรประเมนิ brain injury
1. Glasgow coma score
2. Moscow coma score
3. ASA classification
4. APGAR score
5.
STEM 3
คนไขม้ าใสฟ่ น ในรปู เปน หายซี 36,37
35 occlusal สกึ มีRR หนา้ 38 กับให้opg มา คนไขต้ ้องการทําเปน bridge 35-38
7. หลังจาก periodontal hygienic phase แล้ว 15D ยงั มีPD 6 mm ทําอยา่ งไรต่อใน corrective phase (ไมม่ ซี ี
16, 17)
1. Rescaling & root planing
2. Resective osseous surgery
3. Regenerative surgery and bone graft
4. Coronally positioned flap
5. Gingivectomy
8. ใหอ้ อกแบบ Abutment 35
1. PFM (occlusal porcelain)
2. PFM (¾ occlusal metal)
3. Zirconia
4. Metal partial coverage
5. Ceramic partial coverage
9. อะไรมผี ลกับ Retention ของ Abutment
1. Height of abutment
2. Width of abutment
3. Total occlusal convergence
4. Deep margin
5. Smooth tooth surface
STEM 4
คนไขห้ ญงิ อายุ 30 ปtrauma ฟน หกั 21-23 หายไป ½-⅓ ซี (โจทยไ์มไ่ ด้บอกวา่ เกิดมานานยงั) ไมม่ อี าการทีฟน แต่มี
ตึง ๆ เหงือกนดิ หนอ่ ย มเีสยี วฟน ถ้าเปา ลม ใหร้ ปู ในชอ่ งปากมาสอบรปู เปน กัดฟน กับ arch บน (mucosa ปกติ) เหน็
21- 23 บนิ ไป
10. ใหร้ ปู เปด เหงือกด้าน Palate 21 มลีกู ศรชรี อย Crack บรรยายวา่ พบรอย Crack ยาวสนิ สดุ ที Bone ทีลกู ศรชีถ้า
อยากบูรณะ 21 ต้องกรอ bone ลงใหห้ า่ งจากรอย crack เท่าไร
1. 0.5 mm
2. 1 mm
3. 1.5 mm
4. 2 mm
5. 3 mm
11. ไมไ่ ด้ใหร้ ปู มา แต่บอกวา่ ทํา 23 เจอ Crack ด้าน Palatal วดั ไดล้ งไป 2.5 mm จากขอบเหงือก ทํา Bone
sounding พบวา่ ขอบ Bone อยูห่ า่ งจากขอบเหงือก 3 mm แผนการรกั ษาซี 23 ทําอยา่ งไร
1. Gingivectomy + 23 อุด resin composite
2. Gingivectomy + RCT 23 ทํา crown
3. Crown length + 23 อุด glass ionomer
4. Crown length + 23 crown
5. Crown length + 23 veneer facing
12. ถามวา่ ควรตรวจอะไรเพมิ
1. periapical, ตรวจฟน โยกไหม
2. Panoramic, EPT
3. Panoramic, Percussion
4. พมิ พป์ าก, ตรวจสบฟน
5. พมิ พป์ าก, ตรวจ Probing depth
STEM 5
หญงิอายุ 55 ปมอี าการปวดใบหนา้ขวาเวลาล้างหนา้ เคียวอาหาร แปล๊บ ๆ เปน แล้วหายภายใน 2 นาทีcrown 31 หลดุ
มาไมม่ อี าการ ถ่ายด้านหนา้เปน Ant Crossbite, Lower ant crowding, ซี 31 prep แล้วแต่ไมค่ ่อยมพี นื ที และซี 41
ติดกับตรงที prep
13. หลัง SCRP แล้วคนไขเ้สยี วฟน ทัง ปาก จะมวีธิกี ารจดั การเบอื งต้นอยา่ งไร
1. ใหใ้ชย้ าสฟี น Potassium nitrate
2. ใหใ้ชย้ าสฟี น Zinc nitrate
3. ทํา Mucogingival surgery
4. ทํา Occlusal splint
5. สอนคนไขใ้ชไ้หมขดั ฟน
14. ตรวจแล้ว 31 EPT positive ทําอะไรต่อ
1. เชค็ OVD เพราะคนไข้Loss VD
2. ทํา Facebow transfer เพอืประเมนิ Occlusal plane
3. ทํา Diagnostic-wax up รปู รา่ งฟน เพอืดรู ปู รา่ งของฟน
4. เชค็ ฟ ฟน เพอืดรู ะดับปลายฟน หนา้บน
5. วดั ระยะ Suprecrestal tissue attachment
15. ยาทีใชร้ กั ษาเปน ยากล่มุ อะไร
1. Anxiolytic drug
2. Anticonvulsant
3. Antidepressant
4. High dose corticosteroid
5. Muscle relaxant drug
STEM 6
รปู : ฟน แท้32,42 ขนึ ครงึนงึ Li ต่อ 72,82 | 36 deep Pit&fissure, 46 resin sealant ขนึ เต็ม
เด็กหญงิอายุ 10 ปฟน ขนึ ซอ้ น 72,82 ยก 2 degree
16. ฟน แท้ทีขนึ นเีกิดจากอะไร
1. 
2. 
3. 
4. 
5. 
17. Proper management
1. ถอน 72,82
2. Observe
3. ถอน 72,82 และจดั ฟน Fixed appliance
4. 
5. 
18. ซี 36 ควรปอ งกันฟน ผอุ ยา่ งไร
1. Resin sealant
2. GI sealant
3. Varnish
4. NaF mouthwash
5. CHX sealant
STEM 7
มโีรงเรยีนแหง่ หนงึนกั เรยีนฟน ผุ70% DMFT 3.8 นกั เรยีนชอบกินขนม ทันตแพทยเ์ลยเขา้ไปคยุ คณะครขู องโรงเรยีน
แล้วได้ขอ้ ตกลงวา่ จะไปพูดคยุ กับรา้นค้า เรอืงการขายขนม ซงึจะลดค่าเชา่ ใหถ้ ้าขายผลไม้
19. เปน ขนั ตอนไหนของ Ottawa Charter
1. สรา้งสงิ แวดล้อมทีสนบั สนนุ สขุ ภาพ
2. สรา้งความเขม้ แขง็ ใหก้ ับชุมชน
3. พฒั นานโยบายสาธารณะเพอืสขุ ภาพ
4. พฒั นาทักษะสว่ นบุคคล
5. ระบบบรกิ ารสขุ ภาพปรบั ทิศทาง
20. ขอ้ ใดเปน ปจจยั ความเสยี งรว่ ม
1. การเปลียนของสภาวะเศรษฐกิจกับการประเมนิ ผลของโครงการ
2. การประเมนิ ดัชนมี วลกายกับสภาวะสขุ ภาพชอ่ งปาก
3. การประเมนิ การเกิดรอยโรคฟน ผรุ ายบุคคลกับสภาวะสขุ ภาพชอ่ งปาก
4. การวเิคราะหส์ ภาวะสงั คมกับสภาวะจติ ใจรว่ มกัน
5. การวเิคราะหป์ จจยั นาํ ปจจยั เสรมิ ปจจยั เอือรว่ มกัน
21. เปน หนา้ทีของทันตแพทยด้ ์ านอะไร
1. Advocate
2. Mediate
3. Participation
4. Enable
5. Facilitation
STEM 8
เด็กอายุ 8 ขวบ ฟน หนา้ 11,21 crossbite กับซี 31,41 เมอื เขา้ CR พบวา่ มีpremature contact ที 11/31, 21/41
22. จะ Manage กับคนไขเ้ด็กด้วยวธิ ไีหน
1. Tell show do
2. Voice control
3. 
4. 
5. 
23. อาจสง่ ผลอยา่ งไรมากขนึ
1. Gingival recession of 31,41
2. 11,21 Mobility
3. Facial asymmetry
4. Arch deficiency
5. Early loss 73,83
24. สามารถแก้ไขได้อยา่ งไร
1. Self correct
2. Upper Removable plate with paddle spring
3. Fixed appliance ตอนโต
4. Growth modification with headgear
5. Lateral expansion arch ล่าง
STEM 9
คนไขช้ ายอายุ 35 ปมโีรคเบาหวาน ความดันสงู กินยาตามแพทยส์ งั มีgeneralized PD 4-6 mm
ใหร้ ปู ฟน หนา้ล่าง 43 - 33 มเีหงือกบวมที marginal และ IDP มีplaque ที 42
25. รกั ษา perio ยงัไง
1. OHI, SCRP,ปรกึษาแพทยเ์พอืถามชนดิ ยาและถามเรอืง status โรคเบาหวาน
2. OHI, ปรกึษาแพทยเ์พอืถามชนดิ ยาและถามเรอืงโรคเบาหวาน
3. OHI แล้วค่อยกลับมาประเมนิ เหงือกอีกครงั
4. Scaling and root planing และปรกึษาแพทยเ์พอืหยุดยา
5. Gingivectomy และปรกึษาแพทยเ์พอืหยุดยา
26. ควรซกั ประวตั ิอะไรเพมิ เติม
1. ประวตั ิครอบครวั
2. บุหรี
3. ชนดิ ยาความดัน
4. ชนดิ ยาลดนาํ ตาล
5. ปสสาวะบอ่ ย
27. Diagnosis ของเคสนี
1. Necrotizing periodontal disease
2. Aggressive periodontitis
3. Drug influenced gingival enlargement
4. Neurofibroblastoma
5. Pyogenic granuloma
STEM 10
ผปู้ ว ยหญงิอายุ 60 ปแสบในชอ่ งปากมา 3 สปั ดาห์และมแีผลในปาก และมีlesion NCCL เสยี วฟน โดยจะเสยี วมากขนึ
ตอนดืมนาํ เยน็
รปู ภาพ มแีผลแดงปนขาวในปาก แถวขอบเหงือกและ vestibule ดา้น buccal (เปน เยอะอยู)่ และมภี าพแผลนอกปาก
แถวๆ หางคิ
ว 2 ต่มุ (สคี ลําๆ กลมๆ papule มงั ) รปู ประมาณนีแต่เล็กกวา่ หนอ่ ย มี2 แผล ตรง preauricular
28. จะบรรเทาอาการเจบ็ ในชอ่ งปากเบอื งต้นอยา่ งไร
1. Dexamethasone mouthwash
2. Nystatin mouthwash
3. Normal saline solution
4. Chlorhexidine mouthwash
5. Steroid
29. สง่ ตรวจอะไรเพมิ
1. dsDNA antibody
2. Antinuclear antibody
3. Indirect immunofluorescence
4. direct immunofluorescence
5. 
30. อาการทีดืมนาํ เยน็ แล้วเกิดอาการเสยี วมากขนึ เรยีกวา่ อะไร
1. Allodynia
2. Hyperalgesia
3. Hyperesthesia
4. Paresthesia
5. 
STEM 11
ใหร้ ปู ซี 36B มี(บางคนบอก white lesion บางคนบอก fluorosis) ซี 26 DB cusp สบลงระหวา่ ง 36 กับ 37 อีกรปู
เปน รปู ตรวจนาํ ลายที 24, 48, 72 ชม เปนหลอด ขา้งในสเีขยี วความเขม้ ต่างกันทัง 3หลอด
31. รปู ทีเปน หลอดเขยี ว คือการวดั อะไรของนาํ ลาย
1. Salivary pH
2. Buffer capacity นาํ ลาย
3. เชอื S.mutans colony
4. Activity Lactobacillus
5. Salivary flow rate
32. White lesion ด้าน 36B เกิดจากอะไร
1. ความไมส่ มดลุ กันของ demin-remin
2. เชอืทีเกาะบนผวิฟน ทําใหเ้กิดการกระเจงิแสง
3. cabornate apatite ตกตะกอน
4. เกิดการสะสมของ Acquired pellicle เกาะ
5. การเพมิ ขนึ ของ cariogenic bacteria
33. ถ้าวดั PD ระหวา่ งซี 36,37 ได้7 mm คิดวา่ ปจจยั อะไรทีทําใหม้ กี ารดาํ เนนิ โรคมากขนึ
1. Plunger cusp
2. White lesion buccal 36-37
3. Insufficient keratinized tissue
4. Cervical enamel projection
5. Buccal cervical caries
STEM 12
รปู Lat. cep ชายอายุ 30 ปปวดหนา้หมู า 6 เดือน ล่างครอ่ มบน (Class III เวอ่ ) ขวามีreciprocal click rt. TMJ
34. Treatment for malocclusion
1. Growth modification with protraction facemask
2. Growth modification with chin cup
3. Removable appliance with sectional expansion screw
4. Orthodontic treatment with four premolars extraction
5. Orthodontic treatment with orthognathic surgery
35. ยนื ขกกล่างไปขา้งหนา้แล้วอ้าปากไมม่ คี ลิก อธบิ ายปรากฏการณน์ วี า่
1. Normal disc-condyle relation during mouth opening
2. Retrodiscal tissue adaptation
3. Hyperactivity of pterygoid muscle
4. 
5. 
36. ค่า Cep: SNA SNB ANB FMA Wit มคี ่า normal ให้
1. ANB = -6 นอ้ ยกวา่ norm
2. SNA = 90 มากกวา่ norm
3. SNB = 78 นอ้ ยกวา่ norm
4. Wits = -1
5. FMA = 26
STEM 13
เด็กอายุ 9 ปมฟี น หนา้ซอ้ น ในรปู เปน ซี 11 21 procline ออกมาเพราะมฟี น ซี 51 61 ขนึ กันทีดา้น lingual Frankl
behavior rating (-) IQ 40
37. ควรทําการรกั ษาอยา่ งไร
1. ถอนเมอืมอี าการ
2. ถอนเมอืฟน ซี 11 21 รากปด แล้ว
3. ถอนฟน ซที ีผดิ ปกติ
4. ถอนเมอื เด็กเจรญิ เติบโตเต็มที
5. Observe
38. ถ่ายภาพรงัสอี ะไรทีเหมาะสมสาํ หรบั การรกั ษาเคสนี
1. Occlusal topography
2. Occlusal cross-sectional
3. CBCT
4. Vertical shift tube
5. Periapical radiograph
39. Behavior management อยา่ งไร
1. Papoose board
2. Oral sedation
3. General anesthesia
4. Voice control
5. Parent absence
STEM 14
ชาย 40 ปไมม่ โีรคประจาํ ตัว มอี าการเสยี วฟน ซี 14 ตรวจในชอ่ งปากพบรอยโรคสแีดงใต้ฐานฟน ปลอม ไมม่ อี าการใด ๆ
ใหร้ ปู upper arch ไมม่ ซี ี 21 มรีอยแดงเปน รปู ฐานฟน ปลอม ซี 11 มวีสั ดอุ ุดด้าน MPa ขนาดใหญ่ สภาพไมดี ่ ขอบเยนิ
มเีงาดาํ ใต้วสั ดอุ ุด ซี 14 อุดอมลั กัมขนาดใหญ่ OMPa แต่ Mesial มวีสั ดแุ ละฟน แตก
40. Proper management ของฟน ปลอมทีหลวม
1. reline ด้วย tissue conditioner จนหายอักเสบ แล้วทําฟน ปลอมอันใหม่
2. reline ด้วย self-cure resin acrylic ใหฟ้ น ปลอมแนบ ใสจ่ นหายอักเสบ แล้วทําฟน ปลอมอันใหม่
3. ใส่ immediate-implant ทีฟน หนา้
4. ทําฟน ปลอมใหมด้ ่ วย soft acrylic resin ทีมสี ว่ นผสมของยาต้านเชอื รา
5. ทํา resin-bonded bridge
41. วางแผนการรกั ษาอยา่ งไร
1. Dental filling + antifungal + denture care instruction + OHI
2. Dental filling + antifungal + denture care instruction + CHX mouthwash
3. Dental filling + antifungal + topical steroid + OHI
4. Dental filling + antifungal + topical steroid + CHX mouthwash
5. Dental filling + topical steroid + denture care instruction + CHX mouthwash
42. ฟน ซี 14 แตกเพราะ
1. แต่งโพรงฟน ไมเ่ หมาะสมกับการบูรณะด้วยอะมลั กัม
2. ไมไ่ ด้รองพนื โพรงฟน ก่อนบูรณะ
3. ระหวา่ งทีบูรณะอมลั กัมมคี วามชนื มากไป
4. ตรงคอฟน ซี 14 มลี ักษณะ concavity
5. ไมท่ ํา retentive groove ที axio-pulpal line angle
STEM 15
ใหร้ ปู ทาง clinic กะ x-ray (PA) 46 47 เปน 46 ผุOD ละ 47ล้มๆ เขา้ไป, marginal ridge คนละเลเวล, มตี ่มุ หนองที
B mucosa 46/47 สว่ นภาพ PA เหน็ มีimpact 48/ 46มFีI 47ไมม่ /ี 46 bone loss ประมาณ ½ นงึ (C:R ~ 1:1) 47
bone level มากกวา่ 46 นดิ นงึ
43. ถามวา่ อะไรทําให้prognosis 46 47 แยล่ ง
1. Marginal ridge discrepancy
2. Furcation involvement
3. Crown : root ratio
4. Impact 48
5. Root proximity
44. จะสง่ ตรวจอะไรเพมิ
1. Gutta Percha tracing + EPT
2. Percussion
3. Probe
4. Periapical X-ray
5. 
45. ถาม diagnosis ซี 46
1. Pulp necrosis with acute apical abscess
2. Pulp necrosis with chronic apical abscess
3. Periodontal abscess
4. Pyogenic granuloma
5. Irritation fibroma
STEM 16
ให้Panoramic film มา มีlesion ที 36 edentulous area เปน corticated border with radiopaque (เปน
ก้อน ๆ อยูด้ ่ านใน คนไขเ้พศหญงิ ไมม่ อี าการไมบ่ วม
46. อะไรชว่ ยในการวนิ จิฉัยแยกโรคได้ดีทีสดุ
1. ลักษณะของรอยโรค
2. ขนาดของรอยโรค
3. ความทึบรงัสขีองรอยโรค
4. ตําแหนง่ ของรอยโรค
5. อายุเพศของคนไข้
47. จะทําอยา่ งไรต่อ
1. Incisional biopsy
2. Totally enucleation
3. ถ่าย periapical radiograph
4. ถ่าย cross-sectional radiograph
5. วดั vital ฟน ซขี า้ง ๆ เพอื แยกโรคทาง periapical
48. ถ้าอีก 2 ปต ่อมา คนไขม้ อี าการบวมแนว B-Li คิดวา่ เปน โรคอะไร
1. Florid cemento-osseous dysplasia
2. Ameloblastoma
3. Ossifying fibroma
4. Odontogenic myxoma
5. Compound odontoma
STEM 17
ผปู้ ว ยเพศหญงิอายุ 60 ปมาด้วยอาการแสบบรเิวณกระพุง้ แก้มและลิ
นเวลาทานอาหารรสจดั มา 2 เดอืน ใหภ้ าพเปน
white striae at left and right buccal mucosa
49. Diagnosis
1. Oral Lichen planus
2. Frictional keratosis
3. Pseudomembranous candidiasis
4. Leukoplakia
5. Discoid lupus erythematosus
50. ถ้ารอยโรคสขี าวเชด็ ไมอ่ อก ควรจดั การเบอื งต้นอยา่ งไร
1. Incisional biopsy
2. Brush biopsy
3. KOH preparation
4. OHI and observed
5. Topical antifungal
51. ใหภ้ าพ Histo ถามวา่ ในภาพพบลักษณะใด
1. Band of lymphocyte infiltration
2. Subepithelium vesicle
3. Keratin pearl
4. Ballooning degeneration
5. Hyperchromatism
STEM 18
คนไขห้ ญงิ 50 ปถกุ สง่ ตัวมารกั ษาโรคปรทิ ันต์ใหร้ ปู คลินกิ + peri มตี ิ
งเหงือกยนื ออกมาระหวา่ ง 21, 22 ฟน หนา้ซี 22
มีhorizontal bone loss ประมาณครงึรากทัว ๆ มีmesiodens ตรงกลาง
52. รอยโรค (perio) อยูข่ นั ไหนและ cell อะไรเยอะ
1. Established, Macrophage
2. Established, PMN
3. Advanced, Macrophage
4. Advanced, PMN
5. Advanced, B cell
53. Red complex ของ perio
1. T. Forsythia, T.denticola, and P. Gingivalis
2. T. Forsythia, T.denticola, and Aa
3. P. Intermedia, T. denticola, and T. Forsythia
4. P. Intermedia, T. denticola, and Aa
5. P. Gingivalis, T. Denticola, and Aa
54. ถ้าจะจดั การ mesiodens ตรวจอะไรได้ประโยชนส์ ดุ
1. Percussion
2. Probing depth
3. Vitality test
4. Shift tube radiograph
5. Panoramic film
STEM 19
ชาย 45 ปขบั รถรบั จา้ง รายได้ไมแ่ นน่ อน มาอุดฟน ฟน ผหุ ลายซีไมม่ ี46 47 ทันตแพทยก์ ็อุดฟน ซที ีต้องอุดเสรจ็ ก็
แนะนาํ ใหท้ ํารากเทียม 2 ซี เนอื งจากเปน แผนการรกั ษาทีดสีดุ ผปู้ ว ยขอคําแนะนาํ ทําฟน ปลอมถอดได้ทันตแพทยไ์มท่ ําให้
บอกวา่ ถ้าจะทําใหไ้ปทํากับหมอคนอืน
55. การรกั ษาต้องคํานกึ ถึงอะไร
1. อาชพี สถานภาพสมรส
2. อาชพี เพศ
3. เศรษฐานะ ความต้องการของคนไข้
4. รายได้กับเศรษฐานะ
5. เพศ กับการศึกษา
56. ทีหมอทําเหมาะสมมยั ตามแนวติดสขุ ภาพองค์รวม
1. ไมเ่ หมาะสม เพราะไมย่ อมวางแผนปอ งกันไปถึงอนาคตดว้ ย
2. ไมเ่ หมาะสม เพราะหวงั กําไรมากไป
3. ไมเ่ หมาะสม เพราะไมว่ างแผนรว่ มกับผปู้ ว ย
4. เหมาะสม เพราะสง่ ต่อไปใหผ้ เู้ชยี วชาญ
5. เหมาะสม เพราะเปน แผนการรกั ษาทีดีทีสดุ
57. สง่ เสรมิปอ งกันฟน ผอุ ยา่ งไร
1. เคียวหมากฝรงั ไซลิทอล
2. ทาฟลอู อไรด์วานชิ
3. ใชย้ าสฟี น 1500 ppm
4. เคลือบหลมุ รอ่ งฟน
5. แนะนาํ ใหใ้ช้CPP-ACP paste
STEM 20
เด็ก 9 ปใหฟ้ น บนล่าง mixed dentition space ฟน ซอ้ น หนา้บนและล่าง บน ขาด 3 mm space ล่างขาด 4 mm
22 cross bite
58. สาเหตทุ ีพบบอ่ ยของฟน หนา้ crowding
1. Tooth size-arch size discrepancy
2. Macrodontia ฟน หนา้
3. Early loss
4. Prolonged retention
5. Abnormal habit
59. สาเหตทุ ีเกิด crossbite
1. Swallowing habit
2. Unilateral chewing
3. Mouth breathing
4. Slide in centric, premature contact
5. 
60. OHI ยงัไง
1. Roll technique, Diet counseling, Fluoride mouthwash
2. Scrub, Floss, Fluoride mouthwash
3. Modified charter, Floss, Fluoride mouthwash
4. Modified charter, Floss, Diet
5. Modified bass, Floss, Fluoride mouthwash
STEM 21
คนไขเ้พศหญงิมสี ะพานฟน เก่าซี 21-12 ซี 12 มรีวั ดา้น Pa ทํามาแล้ว 10 ปไมม่ อี าการทางระบบบดเคียว (สดี ตู ือ ๆ กวา่
ฟน ธรรมชาติ)
ใหร้ ปู สบฟน MIP เปน class III แล้วก็ใหร้ ปู edge-to edge
61. เรยีกรปู การสบฟน แบบ edge to edge วา่ เปน การสบฟน อะไร
1. Retruded contact position
2. Protruded contact position
3. Maximum Intercuspation
4. Muscle contact position
5. Physiologic rest position
62. ถ้าต้องการเปลียนสะพานฟน ใหส้ ฟี น สวยขนึ ต้องทําอยา่ งไร
1. เตรยีมความหนาด้าน Labial ใหเ้พยี งพอสาํ หรบั วสั ดทุ ีมคี วามสวยงาม
2. กรอสะพานฟน เดิมด้าน la แล้วอุดด้วย composite แล้วอุดปด รอยรวั ดา้น pa
3. ทําใหส้ ะพานฟน สบแบบไม่ crossbite
4. เลือกสใีหม่ value ค่ามาก ๆ
5. Gingivectomy ใหซ้ ี 11,21 ระดับเท่ากัน
63. จะออกแบบ rpd ล่างยงัไงถ้าหากซี 38 ล้ม mesial เยอะ (ใหร้ ปู คนไขม้ ฟี น ซี 38, 35-47 แล้วซี 38 ล้ม)
1. 38 ring clasp + lingual plate
2. 38 long rest + lingual bar
3. 38 long rest + 47 ring clasp
4. 38 long rest + 44 indirect retainer
5. 38 ring clasp + 35 stress breaker
STEM 22
ทําโครงการสรา้งเสรมิสขุ ภาพชอ่ งปาก โดยมกี ิจกรรมคือ
● ใหค้ วามรโู้รคฟน ผแุ ก่เด็กและครู
● สรา้งความตระหนกั ความสาํ คัญของการแปรงฟน โดยละครหนุ่
● สรา้งสถานทีแปรงฟน หลังอาหารกลางวนั
64. การสรา้งเสรมิสขุ ภาพชอ่ งปากและการดาํ เนนิ การตามโครงการจดั อยูใ่ นขนั ใดของ natural history of disease
1. Stage of susceptibility
2. Stage of subclinical disease
3. Stage of clinical disease
4. Stage of recovery
5. Stage of disability
65. การดาํ เนนิ การขนั Impact ตาม PRECEDE-PROCEED คือขอ้ ใด
1. โรงเรยีนลดนาํ ตาลในอาหารกลางวนั
2. เด็กไมข่ าดเรยีน เพราะปวดฟน
3. ระดับคะแนนความตระหนกั ของครแู ละนกั เรยีนสงู ขนึ เกียวกับการดแู ลชอ่ งปาก
4. โรงเรยีนจดั ประชุมผปู้ กครอง
5. เด็กรวู้ า่ ต้องแปรงฟน ด้วยยาสฟี น ฟลอู อไรด์
66.
STEM 23
คนไขห้ ญงิ 70 ปมาด้วย CC ฟน ปลอมเก่าหกั และ ฟน ปลอมเดมิ หลวม ทํามานานแล้ว 20 ป
ใหร้ ปู denture ครงึซกี อีกครงึ edentulous ridge มเีนอืนนู ออกมามาตรงขอบ vestibule
67. Diagnosis
1. Epulis fissuratum
2. Irritating fibroma
3. 
4. 
5. 
68. สาเหตทุ ีเปน ไปได้มากทีสดุ
1. ฟน เทียมหกั
2. ฐานฟน ปลอมไมแ่ นบ
3. ฟน ปลอมเสยี ดสกี ับเนอื เยอื
4. ใสน่ อนตอนกลางคืน
5. 
69. ถ้าจะทําฟน ปลอมใหม่ ต้องทําอะไรก่อน
1. Surgical excision
2. Reline ด้วย soft tissue conditioner
3. เติมฟน ในฟน ปลอมเก่า
4. Ridge augmentation
5. จา่ ยยาฆา่ เชอื เฉพาะที
STEM 24
คนไขเ้พศหญงิ 60 ปมาด้วยเจบ็ เหงือกบรเิวณฟน กรามนอ้ ยบนซา้ยมา 2 เดอืน มกี ระดกู โผล่ตรงซี 26 ดา้น Buccal
2.5 mm กินยาไมท่ ราบชอืมาประมาณ 4 ปกินทกุ วนั และหมอแจง้ วา่ ตอนกินยาต้องนงั ก่อน 1 ชวั โมง ไมไ่ ดร้ บั การ
รกั ษาอยา่ งอืน
70. ต่อมาซกั ประวตั ิเพมิ วา่ ยาทีทานเปน Alendronate ยามีmechanism อยา่ งไร
1. Inhibit osteoclast function
2. Antiangiogenic
3. Anticancer property
4. Decrease uric acid level
5. Hormone replace
71. คิดวา่ โรคประจาํ ตัวคนไขเ้ปน อะไร
1. Osteoporosis
2. DM
3. Gout
4. Nasopharyngeal cancer
5. 
72. Diagnosis จากพยาธสิภาพในปาก
1. MRONJ
2. ORN
3. Osteomyelitis
4. Osteosarcoma
5. SCC
STEM 25
คนไขเ้พศหญงิ ปวดต๊บุ ๆ บรเิวณขมบั มเีสน้ เลือดปูด มอี าการมากขนึ ขณะเคียวอาหารและอากาศเยน็
73. diagnosis
1. Cluster headache
2. Trigeminal neuralgia
3. Temporal arteritis
4. Migraine with aura
5. 
74. รกั ษายงัไง
1. Moist heat application
2. Corticosteroid
3. Trigger point injection
4. Isotonic exercise
5. 
75. ปวดตือทีบนขวา (ใหร้ ปู acute apical abscess มา) ถามการรกั ษาฉกุ เฉินทีเหมาะสม
1. กรอลดฟน เพอืกันกระแทก
2. จา่ ย Ibuprofen
3. จา่ ย Tetracycline
4. ทา Minocycline ทีรอ่ งเหงือก
5. 
Stem ปรศิ นา
1. กลไกการตอบสนองต่อ caries ใหร้ ปู cariesเกือบถึง pulp
1. Reparative dentin
2. Reactionary dentin
3. Primary dentin
4. Secondary dentin
5. Mantle dentin
2. มหีนองออกมาตรงขอบเหงือกซี 3 บน ถาม proper treatment
1. LA + Sc/RP
2. ให้minocycline ใน pocket
3. 
4. 
5. 
3. ขอ้ เด็กนอ้ ย 5 ขวบ ล้มมา 1 ปแ ล้ว เพงิ มาหาหมอฟน ฟน หนา้ 51 61 สเีทาไปแล้ว ละก็ดมู รีอยโรคปลายรากใหญ่
ใหภ้ าพ intraoral ด้านหนา้กัดฟน ซี 51, 61 สเีทาทัง ซี เหงือกปกติ
ใหภ้ าพ occ topo 51, 61 ฟน หกั เขา้ pulp apical radiolucency ใหญ่ involve tooth bud 11,21
3.1 tx. อยา่ งไร
1. 51, 61 ext
2. 51 เก็บ 61 ถอน
3. 51 ถอน 61 เก็บ
4. 51 61 LSTR
3.2 อะไรเปน ปจจยั กําหนด tx
1. ระยะเวลากวา่ จะมาหาหมอฟน
2. อายุของฟน ขนึ
4. ฟน ซี 4 เปน class V ซเี ดียว คนไขม้ อี าการเสยี วฟน เมอืกินนาํ เยน็ อาการดงั กล่าวเรยีกวา่ อะไร
1. Hyperalgesia
2. Allodynia
3. Paraesthesia
4. Hyperesthesia
5. Dysesthesia
"""

questions = []
current_stem = ""
current_q = None

# A simple heuristic based categorizer
def categorize(text):
    text_lower = text.lower()
    
    # Clinical Category
    if any(w in text_lower for w in ["perio", "pocket", "scrp", "bone loss", "gingiva", "plaque", "calculus", "pd "]):
        cat = "ปริทันตวิทยา"
    elif any(w in text_lower for w in ["caries", "อุด", "amalgam", "composite", "pulp", "dentin"]):
        cat = "วิทยาเอ็นโดดอนต์" if "pulp" in text_lower or "endo" in text_lower else "ทันตกรรมบูรณะ/หัตถการ"
    elif any(w in text_lower for w in ["bridge", "crown", "rpd", "denture", "abutment", "implant", "reline"]):
        cat = "ทันตกรรมประดิษฐ์"
    elif any(w in text_lower for w in ["ortho", "crossbite", "space", "crowding", "mixed dentition"]):
        cat = "ทันตกรรมจัดฟัน"
    elif any(w in text_lower for w in ["child", "เด็ก", "อายุ 8 ขวบ", "อายุ 9 ป", "5 ขวบ", "51 61"]):
        cat = "ทันตกรรมสำหรับเด็ก"
    elif any(w in text_lower for w in ["surgery", "extract", "fracture", "condylar", "mronj"]):
        cat = "ศัลยศาสตร์ช่องปาก"
    elif any(w in text_lower for w in ["lesion", "ulcer", "striae", "lichen", "blood", "headache", "diagnosis"]):
        cat = "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก"
    elif any(w in text_lower for w in ["community", "fluoride", "school", "project", "โรงเรียน", "โครงการ"]):
        cat = "ทันตกรรมชุมชน"
    elif any(w in text_lower for w in ["tmj", "muscle", "joint", "occlusal splint", "click", "masticat"]):
        cat = "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า"
    else:
        cat = "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก"
        
    # Task
    if "treatment" in text_lower or "รักษา" in text_lower or "manage" in text_lower or "ทําอะไร" in text_lower or "ควรทำ" in text_lower:
        task = "การจัดการและการรักษาผู้ป่วย"
    elif "diagnosis" in text_lower or "ตรวจ" in text_lower or "วินิจฉัย" in text_lower or "รังสี" in text_lower or "ภาพ" in text_lower:
        task = "การวินิจฉัยโรค"
    elif "สาเหตุ" in text_lower or "เกิดจาก" in text_lower or "mechanism" in text_lower or "เพราะ" in text_lower or "ผล" in text_lower:
        task = "การเกิดและการดำเนินโรค"
    elif "prevent" in text_lower or "ป้องกัน" in text_lower or "ohi" in text_lower or "promotion" in text_lower:
        task = "การสร้างเสริมสุขภาพและการป้องกัน"
    elif "step" in text_lower or "ขั้นตอน" in text_lower or "procedure" in text_lower or "กรอ" in text_lower:
        task = "ขั้นตอนและวิธีการรักษา"
    else:
        task = "การวินิจฉัยโรค"
        
    return cat, task

lines = text.split('\n')
i = 0
while i < len(lines):
    line = lines[i].strip()
    if not line:
        i += 1
        continue
    
    if line.startswith("STEM ") or line.startswith("Stem "):
        stem_text = line + "\n"
        i += 1
        while i < len(lines) and not re.match(r'^\d+\.', lines[i].strip()):
            if lines[i].strip():
                stem_text += lines[i].strip() + "\n"
            i += 1
        current_stem = stem_text.strip()
        continue
        
    m = re.match(r'^(\d+(\.\d+)?)\.\s*(.*)', line)
    if m:
        if current_q:
            questions.append(current_q)
        
        q_num = m.group(1)
        q_text = m.group(3)
        # Check if question spans multiple lines
        i += 1
        while i < len(lines) and not re.match(r'^\d+\.', lines[i].strip()):
            if lines[i].strip():
                q_text += " " + lines[i].strip()
            i += 1
            
        full_q_text = current_stem + "\n" + q_text if current_stem else q_text
        cat, task = categorize(full_q_text)
        
        current_q = {
            "question_text": q_text,
            "choices": [],
            "correct_answer": None,
            "category": cat,
            "task": task,
            "explanation": None,
            "image_paths": [],
            "source_exam": "NL 2 2566 part 4"
        }
        
        if current_stem:
            current_q["question_text"] = current_stem + "\n" + q_text
            
        # Choices should follow immediately
        # Backtrack 1 line to re-evaluate it
        i -= 1
        
    elif current_q and re.match(r'^[1-5]\.\s*(.*)', line):
        m2 = re.match(r'^([1-5])\.\s*(.*)', line)
        labels = {"1": "A", "2": "B", "3": "C", "4": "D", "5": "E"}
        choice_text = m2.group(2)
        if choice_text:
            current_q["choices"].append({
                "label": labels[m2.group(1)],
                "text": choice_text
            })
    
    i += 1

if current_q:
    questions.append(current_q)

# Filter out choices without text
for q in questions:
    q["choices"] = [c for c in q["choices"] if c["text"].strip() != ""]

# Fix some specifics based on schema enums
cat_mapping = {
    "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
    "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า": "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า",
    "ศัลยศาสตร์ช่องปาก": "ศัลยศาสตร์ช่องปาก",
    "ปริทันตวิทยา": "ปริทันตวิทยา",
    "ทันตกรรมบูรณะ/หัตถการ": "ทันตกรรมบูรณะ/หัตถการ",
    "วิทยาเอ็นโดดอนต์": "วิทยาเอ็นโดดอนต์",
    "ทันตกรรมประดิษฐ์": "ทันตกรรมประดิษฐ์",
    "ทันตกรรมจัดฟัน": "ทันตกรรมจัดฟัน",
    "ทันตกรรมสำหรับเด็ก": "ทันตกรรมสำหรับเด็ก",
    "ทันตกรรมชุมชน": "ทันตกรรมชุมชน"
}

out_data = {"questions": questions}

with open("/Users/admin/Downloads/NL Test/parsed_exams/NL_2_2566_Part_4.json", "w", encoding="utf-8") as f:
    json.dump(out_data, f, ensure_ascii=False, indent=2)

print("Saved to /Users/admin/Downloads/NL Test/parsed_exams/NL_2_2566_Part_4.json")
