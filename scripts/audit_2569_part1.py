import sqlite3
import json

def update_part1_explanations():
    conn = sqlite3.connect('data/exam_bank.db')
    c = conn.cursor()

    # Define comprehensive explanations for 2569 Part 1 (IDs 1938 to 2000)
    updates = {
        1938: {
            "correct_answer": "c",
            "explanation": json.dumps({
                "core_principle": "ในเด็กอายุ 6 ขวบ ฟันน้ำนมหน้า (51, 61) ใกล้ถึงเวลาผลัดเปลี่ยนตามธรรมชาติ (exfoliation time ~ 6-7 ปี) ฟัน 51 มีอาการเคาะเจ็บและรากละลาย 1/3 จากอุบัติเหตุ การถอนฟัน 51 จะช่วยลดการอักเสบและป้องกันอันตรายต่อหน่อฟันแท้ (permanent tooth germ) ส่วน 61 ที่ไม่มีอาการและรากปกติ ให้ตรวจติดตามอาการ (observation) ต่อไป",
                "why_correct": "การถอนซี่ 51 และติดตามอาการซี่ 61 เป็นแนวทางการรักษาที่ปลอดภัยและเหมาะสมที่สุดตามแนวทาง IADT Pediatric Dental Traumatology Guidelines เนื่องจากฟันน้ำนมใกล้ผลัดและซี่ 51 มีพยาธิสภาพ",
                "choice_explanations": {
                    "a": "ไม่ถูกต้อง เนื่องจากซี่ 61 ไม่มีอาการและรากปกติ ไม่จำเป็นต้องรักษารากฟัน",
                    "b": "ไม่ถูกต้อง เนื่องจากซี่ 51 ใกล้ผลัดและมีรากละลาย การรักษารากไม่คุ้มค่าและอาจระคายเคืองต่อหน่อฟันแท้",
                    "c": "ถูกต้อง ถอนซี่ 51 ที่มีอาการและรากละลาย และเฝ้าติดตามอาการซี่ 61",
                    "d": "ไม่ถูกต้อง การสังเกตอาการซี่ 51 ที่มีอาการปวดและรากละลายอาจทำให้เกิดการติดเชื้อลุกลามไปยังหน่อฟันแท้ด้านล่าง"
                },
                "clinical_pearl": "ในฟันน้ำนมที่ได้รับอุบัติเหตุใกล้ช่วงผลัด หากมีอาการเคาะเจ็บและรากละลาย ควรพิจารณาถอนเพื่อปกป้องหน่อฟันแท้ถาวร (Successor tooth germ safety is the #1 priority)",
                "reference": "McDonald and Avery's Dentistry for the Child and Adolescent 11th Ed.; IADT Guidelines for the Management of Traumatic Dental Injuries (2020)"
            }, ensure_ascii=False)
        },
        1939: {
            "correct_answer": "b",
            "explanation": json.dumps({
                "core_principle": "การให้ยาชาเฉพาะที่สำหรับถอนฟันน้ำนมหน้าบน (51) สามารถทำได้โดยวิธี Supraperiosteal infiltration บริเวณ Buccal/Labial sulcus ร่วมกับ Nasopalatine nerve block หรือ Infiltration เล็กน้อยบริเวณ Palatal gingiva เพื่อระงับความรู้สึกของเนื้อเยื่อเพดานปาก",
                "why_correct": "Infiltration ด้าน Labial ร่วมกับ Infiltration/Block ด้าน Palatal เป็นมาตรฐานในการถอนฟันหน้าบน",
                "choice_explanations": {
                    "a": "Infiltration ด้านเดียวไม่เพียงพอสำหรับการถอนฟันเนื่องจากเยื่อบุเพดานปากได้รับเลี้ยงจาก Nasopalatine nerve",
                    "b": "ถูกต้อง การทำ Labial infiltration ร่วมกับ Palatal anesthesia ช่วยควบคุมความเจ็บปวดได้สมบูรณ์",
                    "c": "Greater palatine nerve block เลี้ยงบริเวณฟันหลัง ไม่ครอบคลุมฟันหน้าบน",
                    "d": "Infraorbital block มักไม่จำเป็นสำหรับหัตถการถอนฟันน้ำนมซี่เดี่ยว"
                },
                "clinical_pearl": "การถอนฟันหน้าบนต้องชาระงับความรู้สึกทั้งด้าน Labial (ASAN) และ Palatal (Nasopalatine n.) เสมอ",
                "reference": "Malamed's Handbook of Local Anesthesia 7th Ed."
            }, ensure_ascii=False)
        },
        1940: {
            "correct_answer": "c",
            "explanation": json.dumps({
                "core_principle": "หน่อฟันแท้ซี่ตัดบน (Permanent central incisors) วางตัวอยู่ทางด้าน Palatal และ Apical ต่อรากฟันน้ำนม เมื่อเกิดการกระแทกในแนวทะแยง อาจมีโอกาสที่หน่อฟันแท้ได้รับผลกระทบ (Enamel hypoplasia, crown-root dilaceration) จึงต้องแจ้งผู้ปกครองให้ทราบและติดตามการขึ้นของฟันแท้",
                "why_correct": "การให้สุขศึกษาและอธิบายตำแหน่งของหน่อฟันแท้ที่อยู่ด้านเพดานปาก พร้อมนัดติดตามผลทางรังสีวิทยา เป็นมาตรฐานการสื่อสารทางทันตกรรมเด็ก",
                "choice_explanations": {
                    "a": "ไม่ถูกต้อง ฟันแท้ไม่ได้อยู่ด้าน Buccal",
                    "b": "ไม่ถูกต้อง การบอกว่าฟันแท้จะไม่ได้รับผลกระทบแน่นอนเป็นการให้ข้อมูลที่ผิด",
                    "c": "ถูกต้อง หน่อฟันแท้อยู่ทางด้าน Palatal และควรติดตามการเจริญเติบโตอย่างต่อเนื่อง",
                    "d": "ไม่ถูกต้อง ไม่จำเป็นต้องผ่าตัดนำหน่อฟันแท้ออก"
                },
                "clinical_pearl": "อุบัติเหตุในฟันน้ำนมหน้าช่วงอายุต่ำกว่า 3 ปีมักส่งผลต่อตัวฟันแท้ (Enamel hypoplasia) หากเกิดหลัง 4-5 ปีอาจส่งผลต่อแนวทางการขึ้นของฟันแท้",
                "reference": "McDonald and Avery's Dentistry for the Child and Adolescent 11th Ed."
            }, ensure_ascii=False)
        },
        1941: {
            "correct_answer": "c",
            "explanation": json.dumps({
                "core_principle": "ภาวะ Extra-radicular infection หรือการติดเชื้อในเนื้อเยื่อรอบปลายราก เกิดขึ้นเมื่อเชื้อจุลชีพเล็ดลอดออกนอกรูเปิดปลายราก (Apical foramen) ไปสะสมในรอยโรครอบปลายราก เช่น Actinomyces หรือเชื้อ Anaerobes ชนิดรุนแรง",
                "why_correct": "การติดเชื้อที่คงอยู่หรือทำให้เกิดอาการปวดหลังการอุด/รักษารากสัมพันธ์กับ Extra-radicular bioflim หรือ Cystic infection",
                "choice_explanations": {
                    "a": "Intra-radicular infection คือเชื้อที่อยู่ในคลองรากฟัน",
                    "b": "Primary infection คือการติดเชื้อเริ่มแรกก่อนรักษาราก",
                    "c": "ถูกต้อง Extra-radicular infection เป็นการติดเชื้อภายนอกโพรงรากฟันบริเวณเนื้อเยื่อปริทันต์รอบปลายราก",
                    "d": "Secondary infection คือการติดเชื้อซ้ำซ้อนระหว่างการรักษา"
                },
                "clinical_pearl": "สาเหตุหลักของ Persistent apical periodontitis มักเกิดจาก Intra-radicular biofilm ในจุดที่เข้าไม่ถึง หรือ Extra-radicular infection เช่น Actinomyces israelii",
                "reference": "Cohen's Pathways of the Pulp 12th Ed."
            }, ensure_ascii=False)
        },
        1942: {
            "correct_answer": "e",
            "explanation": json.dumps({
                "core_principle": "การบูรณะฟันกรามผุด้านประชิด (Class II Cavity) ด้วย Composite resin ให้ได้ Contact และ Contour ที่แนบสนิทตามธรรมชาติที่สุด ควรเลือกใช้ Sectional matrix system ร่วมกับ Separating ring",
                "why_correct": "Sectional matrix system ให้ Proximal contour ที่โค้งมนตามกายวิภาคฟันและสร้าง Tight contact point ได้ดีกว่า Tofflemire matrix แบบดั้งเดิมอย่างมีนัยสำคัญ",
                "choice_explanations": {
                    "a": "Tofflemire matrix มักทำให้ contact แบน (Flat proximal contact) และเกิด food impaction",
                    "b": "Automix / Automatrix ไม่สามารถสร้าง anatomical convexity ได้ดีเท่า sectional matrix",
                    "c": "Celluloid strip ใช้สำหรับฟันหน้า (Class III, IV)",
                    "e": "ถูกต้อง Sectional matrix system with separation ring เป็น Gold standard สำหรับ Class II Composite"
                },
                "clinical_pearl": "Sectional matrix + Separation ring ช่วยชดเชยความหนาของ Matrix band และ Polymerization shrinkage ของ Composite ทำให้ได้ Contact ที่แน่นสมบูรณ์",
                "reference": "Sturdevant's Art and Science of Operative Dentistry 7th Ed."
            }, ensure_ascii=False)
        },
        1949: {
            "correct_answer": "b",
            "explanation": json.dumps({
                "core_principle": "เมื่อฟันข้างเคียงเกิดการโยกตัว (Subluxation/Luxation) จากแรงงัดในการถอนฟันฝัง การดามฟันด้วย Flexible splint (เช่น Composite with wire/nylon) มีระยะเวลามาตรฐานในการดามคือ 2 สัปดาห์ (14 วัน) เพื่อให้เอ็นยึดปริทันต์ (PDL) ซ่อมแซมตัวเองได้อย่างสมบูรณ์",
                "why_correct": "ตามแนวทางสากลของ IADT (International Association of Dental Traumatology) และศัลยศาสตร์ช่องปาก การดามฟันที่มีการบาดเจ็บของ PDL โดยไม่มีกระดูกเบ้าฟันหักจะใช้เวลา 2 สัปดาห์",
                "choice_explanations": {
                    "a": "1 สัปดาห์ สั้นเกินไปสำหรับการจัดเรียงตัวใหม่ของเส้นใยคอลลาเจนใน PDL",
                    "b": "ถูกต้อง 2 สัปดาห์ (14 วัน) เป็นระยะเวลามาตรฐานสำหรับ Flexible splinting ของฟันโยกจาก PDL injury",
                    "c": "4 สัปดาห์ ใช้สำหรับกระดูกเบ้าฟันหัก (Alveolar fracture) หรือ Root fracture ที่ส่วนกลางราก",
                    "d": "6 สัปดาห์ นานเกินไปและเสี่ยงต่อการเกิด Ankylosis",
                    "e": "8 สัปดาห์ ใช้สำหรับ Cervical root fracture"
                },
                "clinical_pearl": "การดามฟันนานเกินไป (Over-splinting) หรือใช้ Rigid splint ในกรณี PDL injury เพิ่มความเสี่ยงของ Replacement root resorption (Ankylosis)",
                "reference": "IADT Guidelines for Dental Trauma 2020; Peterson's Principles of Oral and Maxillofacial Surgery"
            }, ensure_ascii=False)
        },
        1950: {
            "correct_answer": "d",
            "explanation": json.dumps({
                "core_principle": "การระบุตำแหน่งฟันฝังในแนวกระพุ้งแก้ม-ลิ้น (Buccal vs Lingual) บริเวณฟันกรามน้อย/ฟันกรามล่างด้วยภาพถ่ายรังสีรอบปลายราก (Periapical film) ใช้หลักการ Horizontal tube shift (SLOB Rule: Same Lingual, Opposite Buccal) โดยการเปลี่ยนมุมกรวยรังสีในแนวระนาบแนวนอน Mesial หรือ Distal",
                "why_correct": "Horizontal tube shift เป็นเทคนิคการถ่ายรังสี 2 มิติที่ทำได้ง่ายและแม่นยำในการแยกแยะตำแหน่ง Buccal/Lingual ในบริเวณ Premolar",
                "choice_explanations": {
                    "a": "Occlusal topography เหมาะสำหรับฟันหน้าหรือดูกระดูกขยายตัว",
                    "b": "Vertical bitewing ใช้ประเมินระดับกระดูกเบ้าฟันในผู้ป่วยปริทันต์อักเสบ",
                    "c": "Vertical tube shift มักใช้ในฟันหน้าบนหรือกรณีที่ไม่สามารถเลื่อนหลอดในแนวนอนได้",
                    "d": "ถูกต้อง Horizontal tube shift (Clark's technique/SLOB rule) ใช้สำหรับระบุตำแหน่งวัตถุในแนวนอน",
                    "e": "Lateral cephalogram ใช้ดูโครงสร้างกะโหลกศีรษะและใบหน้าในการจัดฟัน"
                },
                "clinical_pearl": "SLOB Rule: วัตถุที่อยู่ Lingual จะเคลื่อนที่ไปในทิศทางเดียวกับการเลื่อนของ Tube (Same Lingual), วัตถุที่อยู่ Buccal จะเคลื่อนที่ไปในทิศทางตรงกันข้าม (Opposite Buccal)",
                "reference": "White and Pharoah's Oral Radiology: Principles and Interpretation 8th Ed."
            }, ensure_ascii=False)
        },
        1951: {
            "correct_answer": "a",
            "explanation": json.dumps({
                "core_principle": "ผู้ป่วยรับประทานยา Warfarin และมีค่า INR = 3.7 ซึ่งสูงกว่าเกณฑ์ปลอดภัยสำหรับการทำหัตถการถอนฟัน (เกณฑ์มาตรฐานความปลอดภัยทางทันตกรรมส่วนใหญ่คือ INR <= 3.0 - 3.5 ร่วมกับ Local hemostatic measures) ดังนั้นการมี INR = 3.7 เสี่ยงต่อภาวะเลือดหยุดยาก (Prolonged bleeding) ต้องปรึกษาแพทย์ประจำตัวเพื่อประเมินการปรับขนาดยาหรือชะลอการผ่าตัด",
                "why_correct": "INR 3.7 เป็นค่าการแข็งตัวของเลือดที่อยู่นอกช่วงปลอดภัยสำหรับการถอนฟันทั่วไป จึงต้องปรึกษาแพทย์เรื่องการควบคุมค่า INR",
                "choice_explanations": {
                    "a": "ถูกต้อง ต้องปรึกษาแพทย์เรื่องค่า INR ที่สูงถึง 3.7",
                    "b": "DM ของผู้ป่วยมีค่า HbA1c = 6% ซึ่งควบคุมได้ดีมาก (Good glycemic control)",
                    "c": "HT ความดัน 125/85 mmHg อยู่ในเกณฑ์ปกติ ไม่เป็นข้อห้าม",
                    "d": "Low immune ผู้ป่วยไม่ได้อยู่ในภาวะภูมิคุ้มกันบกพร่องรุนแรง",
                    "e": "Wound healing สัมพันธ์กับเบาหวานซึ่งควบคุมได้ดีแล้ว"
                },
                "clinical_pearl": "หัตถการทางทันตกรรมทั่วไปสามารถทำได้อย่างปลอดภัยเมื่อ INR อยู่ระหว่าง 2.0 - 3.0 โดยไม่ต้องหยุดยา Warfarin แต่หาก INR > 3.5 ต้องปรึกษาแพทย์ผู้ดูแลเสมอ",
                "reference": "Little and Falace's Dental Management of the Medically Compromised Patient 9th Ed."
            }, ensure_ascii=False)
        },
        1952: {
            "correct_answer": "a",
            "explanation": json.dumps({
                "core_principle": "เสียงกรอบแกรบ (Crepitus) ในข้อต่อขากรรไกร (TMJ) สัมพันธ์โดยตรงกับการเปลี่ยนแปลงเสื่อมสภาพของผิวกระดูกข้อต่อ (Degenerative joint changes) เช่น การสึกแบนของหัวกระดูกข้อต่อ (Flattening of condyles), การสึกกร่อน (Erosion) หรือมี Osteophyte ทำให้ผิวกระดูกที่ขรุขระเสียดสีกันโดยตรง",
                "why_correct": "การแบนลงของ Condyle (Flattening) เป็นลักษณะทางรังสีวิทยาของการเปลี่ยนแปลงแบบ Degenerative ที่ก่อให้เกิดเสียง Crepitus",
                "choice_explanations": {
                    "a": "ถูกต้อง Flattening of condyle เป็นพยาธิสภาพกระดูกที่เสียดสีกันจนเกิดเสียง Crepitus",
                    "b": "Decrease of synovial fluid ทำให้ความหล่อลื่นลดลงแต่ไม่ได้เป็นตัวสร้างเสียงหลักเทียบกับ bone remodeling",
                    "c": "Disc displacement with reduction มักทำให้เกิดเสียง Clicking (คลิก)",
                    "d": "Disc dislocation without reduction มักไม่มีเสียง (Silent) ร่วมกับอ้าปากได้จำกัดเฉียบพลัน",
                    "e": "Loss of posterior teeth เป็นปัจจัยเสี่ยงร่วมแต่ไม่ใช่พยาธิสภาพที่ข้อต่อโดยตรง"
                },
                "clinical_pearl": "Clicking = Disc displacement with reduction; Crepitus = Osteoarthritis / Degenerative Bone Changes (Bone-to-bone contact)",
                "reference": "Okeson's Management of Temporomandibular Disorders and Occlusion 8th Ed."
            }, ensure_ascii=False)
        },
        1953: {
            "correct_answer": "c",
            "explanation": json.dumps({
                "core_principle": "ตามเกณฑ์วินิจฉัยโรคข้อต่อขากรรไกรระดับสากล (DC/TMD Diagnostic Criteria): ภาวะที่มีอาการปวดหน้าหู (Pain) + มีเสียง Crepitus ขณะเคลื่อนไหวขากรรไกร + พบการเปลี่ยนแปลงทางรังสีวิทยาของกระดูก (Condylar flattening/erosion) วินิจฉัยเป็น 'TMJ Osteoarthritis' (หากมีพยาธิสภาพทางรังสีแต่ไม่มีอาการปวดจะเรียกว่า 'Osteoarthrosis')",
                "why_correct": "ผู้ป่วยมีอาการปวดหน้าร่วมกับ Crepitus และ Condyle แบนทั้งสองข้าง จึงวินิจฉัยเป็น Bilateral TMJ Osteoarthritis",
                "choice_explanations": {
                    "a": "Disc displacement without reduction จะอ้าปากได้จำกัดและไม่มีเสียง Clicking/Crepitus",
                    "b": "Disc displacement with reduction จะมีเสียง Clicking ชัดเจน ไม่ใช่ Crepitus",
                    "c": "ถูกต้อง Bilateral TMJ Osteoarthritis ครอบคลุมทั้งอาการปวด เสียง Crepitus และภาพ Pano",
                    "d": "Osteoarthrosis คือภาวะเสื่อมสภาพที่ 'ไม่มีอาการปวด' (Non-painful)",
                    "e": "Bilateral TMJ arthritis เป็นคำกว้างๆ ไม่เฉพาะเจาะจงเท่า Osteoarthritis"
                },
                "clinical_pearl": "ข้อแตกต่างระหว่าง Osteoarthritis vs Osteoarthrosis ใน DC/TMD: Osteoarthritis มี Pain (ปวด) ขณะที่ Osteoarthrosis ไม่มี Pain",
                "reference": "Diagnostic Criteria for Temporomandibular Disorders (DC/TMD); Okeson TMD 8th Ed."
            }, ensure_ascii=False)
        },
        1954: {
            "correct_answer": "b",
            "explanation": json.dumps({
                "core_principle": "ผู้ป่วยที่มีภาวะอ้าปากได้จำกัดเรื้อรังจากโรคข้อต่อขากรรไกร (Maximum opening 38 mm, pain-free 25 mm) การทำความสะอาดฟันด้านในและบริเวณฟันกรามลึกๆ ทำได้ยาก ควรแนะนำให้ใช้แปรงสีฟันหัวเล็ก (แปรงสีฟันเด็ก) ร่วมกับแปรงพุ่มเดี่ยว (End-tufted brush) เพื่อเข้าถึงบริเวณที่อ้าปากได้น้อยโดยไม่กระตุ้นอาการปวดข้อต่อ",
                "why_correct": "แปรงสีฟันเด็กหัวเล็ก + แปรงพุ่มเดี่ยว (End-tufted) สามารถเข้าทำความสะอาดบริเวณฟันกรามหลังได้ดีในภาวะ Trismus หรือ Limited mouth opening",
                "choice_explanations": {
                    "a": "Chlorhexidine ไม่ควรใช้ต่อเนื่องระยะยาวเป็นประจำเนื่องจากเกิด Stain และรบกวน Oral microbiome",
                    "b": "ถูกต้อง แปรงสีฟันเด็ก (หัวเล็ก) + แปรงพุ่มเดี่ยว ช่วยให้ทำความสะอาดฟันหลังได้โดยไม่ต้องอ้าปากกว้าง",
                    "c": "แปรงขนนุ่มพิเศษหากหัวแปรงใหญ่ยังคงเข้าถึงฟันหลังได้ยาก",
                    "d": "ไหมขัดฟันอย่างเดียวไม่สามารถทำความสะอาดด้าน Occlusal/Lingual ในจุดลึกได้"
                },
                "clinical_pearl": "ในคนไข้ TMD ที่อ้าปากจำกัด หัวใจสำคัญของการแปรงฟันคือการเลือกอุปกรณ์ที่มี Head profile ขนาดเล็ก (Small brush head & End-tuft)",
                "reference": "Wilkins' Clinical Practice of the Dental Hygienist 13th Ed."
            }, ensure_ascii=False)
        },
        1955: {
            "correct_answer": "d",
            "explanation": json.dumps({
                "core_principle": "การประเมินระดับความยากในการรักษารากฟัน (AAE Endodontic Case Difficulty Assessment): ปัจจัยทางกายวิภาคของรากฟัน เช่น ความยาวของรากฟันที่ยาวมาก (Long root canal > 25 mm) หรือสั้นมาก, ความโค้งของราก, การตีบตัน เป็นปัจจัยกำหนดความยากในการเตรียมและอุดคลองรากฟัน",
                "why_correct": "ความยาวของคลองรากฟัน (Length of root canal) ที่ยาวผิดปกติส่งผลต่อการควบคุม Working length และการทำความสะอาดคลองรากฟันอย่างทั่วถึง",
                "choice_explanations": {
                    "a": "Root dilaceration หากรากตรงจะไม่ใช่ปัจจัย",
                    "b": "Canal obliteration หากคลองรากมองเห็นชัดเจนในฟิล์มจะไม่ใช่ปัญหาหลัก",
                    "c": "Variation of root morphology ใน premolar ล่างพบบ่อยแต่ความยาวเป็นปัจจัยสำคัญในภาพรังสี",
                    "d": "ถูกต้อง Length of root canal เป็นเกณฑ์ประเมินใน AAE Case Difficulty Form",
                    "e": "Size of periapical lesion ไม่ได้เพิ่มความยากของเทคนิคการขยายคลองรากโดยตรง"
                },
                "clinical_pearl": "AAE Case Difficulty Form จัดให้ฟันที่มีความยาวราก > 25 mm หรือความโค้ง > 30 องศา อยู่ในกลุ่ม High Difficulty",
                "reference": "American Association of Endodontists (AAE) Endodontic Case Difficulty Assessment Form"
            }, ensure_ascii=False)
        },
        1956: {
            "correct_answer": "c",
            "explanation": json.dumps({
                "core_principle": "ฟันกรามล่างซี่ 37 ที่มีวัสดุอุดเดิมขนาดใหญ่หลุด (37OM dislodged amalgam) และไม่มีรอยโรคปลายราก ฟันยังมีชีวิต (Vital pulp) แต่สูญเสียโครงสร้างฟันไปมาก การบูรณะด้วย Onlay (Cuspal coverage restoration) เป็นการอนุรักษ์เนื้อฟัน (Conservative) ได้ดีกว่าการกรอครอบฟันทั้งซี่ (Full crown) และช่วยป้องกันฟันแตกจากแรงบดเคี้ยวได้สมบูรณ์",
                "why_correct": "Onlay เป็นตัวเลือกที่เหมาะสมที่สุดในการปกป้อง Cusp และอนุรักษ์เนื้อฟันที่เหลืออยู่ในฟันกรามหลังที่มีโพรงฟันขนาดใหญ่",
                "choice_explanations": {
                    "a": "Composite filling โดยไม่ครอบปุ่มฟัน เสี่ยงต่อการแตกหักของ Cusp ภายใต้แรงบดเคี้ยวหนัก",
                    "b": "Glass Ionomer มีคุณสมบัติเชิงกลไม่เพียงพอสำหรับโพรงฟันขนาดใหญ่ในฟันกราม",
                    "c": "ถูกต้อง Onlay ให้ Cuspal protection และอนุรักษ์เนื้อฟันได้ดีที่สุด",
                    "d": "Zirconia crown กรอเนื้อฟันออกมากเกินความจำเป็นในฟันที่ยังมีชีวิตและเนื้อฟันส่วนอื่นยังแข็งแรง",
                    "e": "Full metal crown ตัดเนื้อฟันมากเกินไปเมื่อเทียบกับ Onlay"
                },
                "clinical_pearl": "กฎของการบูรณะฟันหลัง: หากสูญเสียความกว้างของ Isthmus เกิน 1/2 ของระยะระหว่างยอด Cusp หรือสูญเสีย Marginal ridge ควรพิจารณาทำ Cuspal coverage (Onlay)",
                "reference": "Sturdevant's Art and Science of Operative Dentistry 7th Ed.; Rosenstiel Contemporary Fixed Prosthodontics"
            }, ensure_ascii=False)
        },
        1957: {
            "correct_answer": "a",
            "explanation": json.dumps({
                "core_principle": "การติดเชื้อปฐมภูมิในโพรงประสาทฟันและเนื้อเยื่อรอบปลายราก (Primary endodontic infection: Pulp necrosis with chronic apical abscess) ในฟันที่ไม่เคยผ่านการรักษารากฟันมาก่อน จะมีเชื้อจุลชีพเด่นเป็น 'Obligate anaerobic bacteria' (คิดเป็นมากกว่า 90% ของประชากรเชื้อทั้งหมด) เช่น Porphyromonas endodontalis, Prevotella intermedia, Fusobacterium nucleatum, Treponema denticola",
                "why_correct": "Obligate anaerobes เป็นเชื้อเด่นที่สุดใน Primary apical periodontitis เนื่องจากสภาพแวดล้อมในคลองรากที่ตายแล้วมีออกซิเจนต่ำมาก (Anoxic environment)",
                "choice_explanations": {
                    "a": "ถูกต้อง Obligate anaerobes ครองสัดส่วนมากกว่า 90% ใน Primary endodontic infection",
                    "b": "Mixed anaerobe and aerobe พบในส่วนผิวบนของช่องปาก แต่ในคลองรากฟันลึกแทบไม่พบ Aerobes",
                    "c": "Aerobe ไม่สามารถเจริญเติบโตได้ในโพรงประสาทฟันที่ขาดเลือดและออกซิเจน",
                    "d": "Facultative anaerobe (เช่น Enterococcus faecalis) มักพบเด่นใน 'Secondary / Persistent endodontic infection' (ฟันที่เคยรักษารากล้มเหลว)"
                },
                "clinical_pearl": "Primary Endodontic Infection = Obligate Anaerobes (Gram-negative rods); Secondary / Failed Root Canal Infection = Facultative Anaerobes (E. faecalis, Candida)",
                "reference": "Cohen's Pathways of the Pulp 12th Ed. Chapter: Microbiology of Endodontic Infections"
            }, ensure_ascii=False)
        },
        1971: {
            "correct_answer": "a",
            "explanation": json.dumps({
                "core_principle": "ตามการจำแนกประเภทจิตวิทยาของผู้ป่วยทางทันตกรรมของ House (House Classification of Mental Attitude): 1) Philosophic (เข้าใจ มีเหตุผล ร่วมมือดี), 2) Exacting (จู้จี้ เรียกร้องความสมบูรณ์แบบสูง), 3) Hysterical (วิตกกังวลสูง อารมณ์แปรปรวน), 4) Indifferent (เฉยเมย ไม่สนใจสุขภาพช่องปาก ไม่เคยตรวจฟัน มาพบทันตแพทย์เพราะมีแรงผลักดันภายนอก เช่น ต้องไปสัมภาษณ์งานหรือคนอื่นสั่งมา)",
                "why_correct": "ผู้ป่วยอายุ 25 ปี ไม่เคยสนใจดูแลสุขภาพช่องปาก แต่มาตรวจฟันเพราะจะไปสัมภาษณ์งาน ตรงกับลักษณะของ 'Indifferent patient'",
                "choice_explanations": {
                    "a": "ถูกต้อง Indifferent คือผู้ป่วยที่ไม่สนใจสุขภาพช่องปาก มาทำฟันเพราะความจำเป็นเฉพาะหน้าภายนอก",
                    "b": "Hysterical คือผู้ป่วยที่กลัวมาก ไม่ให้ความร่วมมือ อารมณ์แปรปรวน",
                    "c": "Philosophic คือผู้ป่วยที่มีทัศนคติดีมาก มีเหตุผลและให้ความร่วมมือดีที่สุด",
                    "d": "Exacting คือผู้ป่วยที่พิถีพิถัน คาดหวังผลการรักษาที่สมบูรณ์แบบเกินจริง"
                },
                "clinical_pearl": "ผู้ป่วยกลุ่ม Indifferent มีพยากรณ์โรคต่ำในระยะยาวเนื่องจากขาดแรงจูงใจในการดูแลตนเอง ทันตแพทย์ต้องมุ่งเน้นการปรับทัศนคติและสุขศึกษา",
                "reference": "Boucher's Prosthodontic Treatment for Edentulous Patients; McCracken's Removable Partial Prosthodontics"
            }, ensure_ascii=False)
        },
        1975: {
            "correct_answer": "b",
            "explanation": json.dumps({
                "core_principle": "ในผู้ป่วยที่สูญเสียฟันและมีฟันยื่นย้อย (Supraeruption) ทำให้ระนาบการสบฟัน (Occlusal plane) ผิดปกติ ขั้นตอนแรกก่อนการวางแผนทำฟันเทียมคือการพิมพ์ปากทำแบบจำลองฟันเพื่อศึกษาและขึ้นแท่นสบฟันบน Articulator (Diagnostic cast mounting) เพื่อประเมินพื้นที่ว่างในการสบฟัน (Interarch space) และวางแผนปรับแต่งฟัน (Tooth modification / Enameloplasty / Crown shortening)",
                "why_correct": "Diagnostic cast mounting เป็นขั้นตอนแรกสุดที่จำเป็นในการวิเคราะห์ระนาบสบฟันและระยะห่างระหว่างขากรรไกรในผู้ป่วยที่มี Supraeruption",
                "choice_explanations": {
                    "a": "Denture design ต้องทำหลังจากการวิเคราะห์ Cast บน Surveyor และ Articulator แล้ว",
                    "b": "ถูกต้อง Diagnostic cast mounting บน Articulator ช่วยประเมินระนาบสบฟันและพื้นที่ว่างได้อย่างแม่นยำ",
                    "c": "Tooth alteration ต้องทำหลังจากวางแผนบน Diagnostic cast เรียบร้อยแล้ว",
                    "d": "Occlusal analysis ในช่องปากเพียงอย่างเดียวไม่สามารถจำลองการเคลื่อนที่ของขากรรไกรได้อย่างละเอียดเท่าบน Articulator",
                    "e": "Torectomy เป็นหัตถการผ่าตัดที่จะทำเมื่อมีข้อบ่งชี้หลังการประเมินแบบจำลอง"
                },
                "clinical_pearl": "ห้ามกรอปรับแต่งฟัน (Tooth modification) ในช่องปากทันทีโดยยังไม่ได้วิเคราะห์บน Mounted diagnostic cast เด็ดขาด",
                "reference": "McCracken's Removable Partial Prosthodontics 13th Ed.; Rosenstiel Fixed Prosthodontics"
            }, ensure_ascii=False)
        },
        1980: {
            "correct_answer": "d",
            "explanation": json.dumps({
                "core_principle": "ขนาดยาสูงสุดของยาชาเฉพาะที่ 2% Lidocaine with 1:100,000 Epinephrine ในเด็กตามเกณฑ์ AAPD และ Malamed คือ 4.4 mg/kg (ไม่เกินขนาดยาสูงสุดในผู้ใหญ่ 300 mg) ในเด็กน้ำหนัก 18 kg: ขนาดยาสูงสุด = 18 kg × 4.4 mg/kg = 79.2 mg ยาชา 2% Lidocaine 1 หลอด (1.8 mL) มีตัวยา Lidocaine 36 mg ดังนั้นจำนวนหลอดสูงสุด = 79.2 / 36 = 2.2 หลอด (ปัดเศษอย่างปลอดภัยเป็นไม่เกิน 2 หลอด)",
                "why_correct": "2 หลอด (72 mg) เป็นจำนวนหลอดสูงสุดที่ปลอดภัยสำหรับเด็กน้ำหนัก 18 kg ภายใต้เกณฑ์ 4.4 mg/kg",
                "choice_explanations": {
                    "a": "0.5 หลอด = 18 mg (ต่ำกว่าขนาดยาสูงสุดมาก)",
                    "b": "1 หลอด = 36 mg",
                    "c": "1.5 หลอด = 54 mg",
                    "d": "ถูกต้อง 2 หลอด = 72 mg (ไม่เกิน 79.2 mg ซึ่งเป็น MRD ของเด็ก 18 kg)",
                    "e": "2.5 หลอด = 90 mg (เกินขนาดสูงสุด 79.2 mg เสี่ยงต่อภาวะ Local Anesthetic Toxicity)"
                },
                "clinical_pearl": "สูตรคำนวณเด็ก: Max dose (mg) = Weight (kg) × 4.4 mg/kg -> แปลงเป็นหลอดโดยหารด้วย 36 mg/cartridge (สำหรับ 2% lidocaine 1.8 mL)",
                "reference": "Malamed's Handbook of Local Anesthesia 7th Ed.; AAPD Guideline on Use of Local Anesthesia for Pediatric Dental Patients"
            }, ensure_ascii=False)
        },
        1981: {
            "correct_answer": "c",
            "explanation": json.dumps({
                "core_principle": "การจำแนกพฤติกรรมเด็กตาม Wright's Classification: 1) Cooperative (ร่วมมือดี), 2) Lacking cooperative ability (เด็กเล็กมาก < 2.5-3 ขวบ หรือมีความบกพร่องทางสติปัญญาอย่างรุนแรง), 3) Potentially cooperative (เด็กมีพัฒนาการสมวัยแต่แสดงพฤติกรรมไม่ร่วมมือ ร้องไห้ ดิ้น เนื่องจากความกลัวหรือไม่เคยชิน ซึ่งสามารถปรับเปลี่ยนพฤติกรรมให้ร่วมมือได้)",
                "why_correct": "เด็กอายุ 4 ขวบ มีระดับสติปัญญาปกติแต่มาทำฟันครั้งแรกแล้วดิ้นร้องไห้ จัดอยู่ในกลุ่ม 'Potentially cooperative' ซึ่งสามารถปรับพฤติกรรม (Behavior guidance) ได้",
                "choice_explanations": {
                    "a": "Lacking cooperative ability ใช้กับเด็กทารกหรือเด็กที่มีความพิการทางสมองที่ไม่สามารถเข้าใจคำสั่งได้",
                    "b": "Whining เป็นรูปแบบพฤติกรรมย่อย (บ่นงอแงแต่ยอมทำฟัน) ไม่ใช่หมวดหลักของ Wright",
                    "c": "ถูกต้อง Potentially cooperative คือเด็กที่มีศักยภาพในการร่วมมือแต่แสดงความไม่ร่วมมือในตอนแรก",
                    "d": "Frankl scale 3 คือ Positive (ยอมทำตามคำสั่ง) แต่เคสนี้ดิ้นร้องไห้ตรงกับ Frankl 1 (Definitely negative)",
                    "e": "Frankl scale 4 คือ Definitely positive (สนุกสนานและให้ความร่วมมือเต็มที่)"
                },
                "clinical_pearl": "เด็กวัย 3-6 ปีส่วนใหญ่ที่ไม่ร่วมมือในครั้งแรกมักเป็น Potentially cooperative ซึ่งตอบสนองได้ดีมากต่อเทคนิค Tell-Show-Do, Positive Reinforcement และ Distraction",
                "reference": "McDonald and Avery's Dentistry for the Child and Adolescent 11th Ed.; AAPD Behavior Guidance Guidelines"
            }, ensure_ascii=False)
        },
        1982: {
            "correct_answer": "c",
            "explanation": json.dumps({
                "core_principle": "รอยร้าวหรือการแตกหักของวัสดุอุด Amalgam บริเวณ Isthmus / Marginal ridge (Bulk fracture) ใน Class II Cavity มักเกิดจากความเค้นเข้มข้น (Stress concentration) ที่มุมรอยต่อระหว่างผนังแกนกับพื้นโพรงฟัน เนื่องจากการ 'ไม่ได้ลบเหลี่ยมหรือทำ Bevel ที่ Axio-pulpal line angle' หรือการเตรียมร่อง Isthmus ตื้นเกินไป (< 1.5 mm)",
                "why_correct": "การไม่ Bevel/Round บริเวณ Axio-pulpal line angle ทำให้เกิด Sharp internal line angle ซึ่งเป็นจุดรวมแรงเค้น (Stress raiser) ทำให้เกิดรอยร้าวที่รอยต่อ Isthmus",
                "choice_explanations": {
                    "a": "Isthmus แคบช่วยอนุรักษ์เนื้อฟัน หากกรอกว้างเกินไปต่างหากที่จะทำให้ตัวฟันแตกง่าย",
                    "b": "Retention groove มีหน้าที่ป้องกันการหลุดในแนวขวาง ไม่ได้ป้องกันการแตกร้าวของวัสดุที่ Isthmus",
                    "c": "ถูกต้อง การไม่ Bevel axio-pulpal line angle ทำให้เกิดแรงเค้นเข้มข้นจน Amalgam เกิดรอยร้าวและหักขวาง Isthmus",
                    "d": "Angle of departure 90 องศา (Butt joint) เป็นค่ามาตรฐานที่ถูกต้องของ Amalgam margin เพื่อป้องกัน Margin fracture",
                    "e": "Reverse curve ช่วยรักษา Cusp ridge และได้มุม 90 องศาที่ด้านประชิด"
                },
                "clinical_pearl": "Axio-pulpal line angle ต้องได้รับการ Rounding / Beveling เสมอใน Class II Amalgam เพื่อลด Stress concentration และเพิ่มความหนาของเนื้อ Amalgam ที่จุดเชื่อมต่อ",
                "reference": "Sturdevant's Art and Science of Operative Dentistry 7th Ed. Chapter: Class II Amalgam Restorations"
            }, ensure_ascii=False)
        },
        1992: {
            "correct_answer": "b",
            "explanation": json.dumps({
                "core_principle": "ขนาดยาแก้ปวด Paracetamol ในเด็กคือ 10 - 15 mg/kg/dose ทุก 4 - 6 ชั่วโมง ในเด็กน้ำหนัก 20 kg: ขนาดยาที่เหมาะสม = 20 kg × (10-15 mg/kg) = 200 - 300 mg/dose ยาน้ำเชื่อม Paracetamol ความเข้มข้น 250 mg/5 mL (1 ช้อนชา = 5 mL) จะให้ตัวยา 250 mg ต่อ 1 ช้อนชา ซึ่งตรงกับช่วงขนาดยาที่ถูกต้องและปลอดภัยพอดี",
                "why_correct": "Para 250 mg/5 mL รับประทาน 1 ช้อนชา (1 tsp = 250 mg) ให้ขนาดยา 12.5 mg/kg ซึ่งอยู่ในช่วงมาตรฐาน 10-15 mg/kg พอดี",
                "choice_explanations": {
                    "a": "Para 120 (3 tsp) = 360 mg (18 mg/kg) สูงเกินขนาดมาตรฐาน",
                    "b": "ถูกต้อง Para 250 (1 tsp) = 250 mg (12.5 mg/kg) ถูกต้องตามเกณฑ์ 10-15 mg/kg",
                    "c": "Para 120 (1 tsp) = 120 mg (6 mg/kg) ขนาดยาต่ำเกินไป (Underdose) ไม่สามารถระงับปวดได้",
                    "d": "Para 250 (3 tsp) = 750 mg (37.5 mg/kg) เกินขนาดอย่างรุนแรง เสี่ยงต่อความเป็นพิษต่อตับ (Hepatotoxicity)",
                    "e": "Para 120 (1.5 tsp) = 180 mg (9 mg/kg) ยังคงต่ำกว่าเกณฑ์ขั้นต่ำ 10 mg/kg"
                },
                "clinical_pearl": "สูตรคำนวณ Paracetamol เด็ก: น้ำหนัก (kg) × 10 ถึง 15 mg -> เด็ก 20 kg = 200 - 300 mg -> ใช้ความเข้มข้น 250 mg/5 mL ทาน 1 ช้อนชา",
                "reference": "Nelson Textbook of Pediatrics 21st Ed.; McDonald and Avery's Dentistry for the Child and Adolescent 11th Ed."
            }, ensure_ascii=False)
        },
        1993: {
            "correct_answer": "e",
            "explanation": json.dumps({
                "core_principle": "ฟันน้ำนมกรามล่างซี่ 85 ที่มีอาการปวดเองตอนกลางคืน (Spontaneous / Nocturnal pain) ร่วมกับภาพถ่ายรังสีพบการสูญเสีย Lamina dura บริเวณง่ามราก/ปลายราก บ่งชี้ว่าเชื้อจุลชีพได้ลุกลามไปยังเนื้อเยื่อในโพรงประสาทส่วนราก (Irreversible pulpitis หรือ Pulpal necrosis with apical/furcal periodontitis) การรักษาที่ถูกต้องในฟันน้ำนมคือการตัดและทำความสะอาดโพรงประสาทฟันทั้งส่วนตัวและส่วนราก (Pulpectomy) แล้วบูรณะด้วยครอบฟันโลหะไร้สนิม (SSC)",
                "why_correct": "Pulpectomy เป็นการรักษาเนื้อเยื่อในโพรงประสาทฟันสำหรับฟันน้ำนมที่มีอาการปวดเองตอนกลางคืนและมีการติดเชื้อลุกลามถึง Radicular pulp",
                "choice_explanations": {
                    "a": "Pulpotomy ทำได้เฉพาะในกรณีที่การอักเสบจำกัดอยู่เฉพาะ Coronal pulp และไม่มีอาการปวดตอนกลางคืนหรือรอยโรคที่ง่ามราก",
                    "b": "Composite filling ไม่สามารถรักษาการติดเชื้อในโพรงประสาทฟันได้",
                    "c": "SSC เป็นการบูรณะส่วนตัวฟันหลังการรักษาคลองราก ไม่ใช่หัตถการรักษาเนื้อเยื่อในโพรงประสาท",
                    "d": "Indirect pulp therapy มีข้อห้ามในฟันที่มี Spontaneous pain หรือ Furcation involvement",
                    "e": "ถูกต้อง Pulpectomy เป็นการรักษาทางคลินิกที่เหมาะสมที่สุดสำหรับเคสนี้"
                },
                "clinical_pearl": "สัญญาณเตือนของการติดเชื้อลุกลามถึง Radicular pulp ในฟันน้ำนม: ปวดเองโดยไม่มีสิ่งกระตุ้น (Spontaneous pain), ปวดตอนกลางคืน (Nocturnal pain), และ Furcation bone loss",
                "reference": "AAPD Guideline on Pulp Therapy for Primary and Immature Permanent Teeth; McDonald and Avery 11th Ed."
            }, ensure_ascii=False)
        },
        1994: {
            "correct_answer": "c",
            "explanation": json.dumps({
                "core_principle": "ในเด็กอายุต่ำกว่า 6 ขวบที่มีความเสี่ยงต่อฟันผุสูง (High caries risk) เช่น มีฟันผุลุกลามถึงโพรงประสาทฟัน ฟลูออไรด์ชนิดทาเฉพาะที่ในคลินิก (In-office professional topical fluoride) ที่ปลอดภัยและมีประสิทธิภาพสูงสุดตามเกณฑ์ของ AAPD และ ADA คือ 5% Sodium Fluoride Varnish (22,600 ppm F) เนื่องจากแห้งตัวเร็วและลดความเสี่ยงจากการกลืนกินสารฟลูออไรด์",
                "why_correct": "5% NaF Varnish เป็น Gold standard สำหรับการป้องกันฟันผุเฉพาะที่ในเด็กอายุต่ำกว่า 6 ปีที่มีความเสี่ยงฟันผุสูง",
                "choice_explanations": {
                    "a": "0.05% NaF (230 ppm) เป็นน้ำยาบ้วนปากสำหรับใช้ทุกวัน ไม่แนะนำในเด็กอายุต่ำกว่า 6 ปีเพราะควบคุมการกลืนไม่ได้",
                    "b": "0.2% NaF (900 ppm) เป็นน้ำยาบ้วนปากรายสัปดาห์ในโรงเรียนประถม (เด็กอายุ > 6 ปี)",
                    "c": "ถูกต้อง 5% NaF Varnish ปลอดภัยและมีประสิทธิภาพสูงสุดในเด็กเล็ก",
                    "d": "1.1% NaF (5,000 ppm) Gel/Paste ห้ามใช้ในเด็กอายุต่ำกว่า 6 ปีเนื่องจากเสี่ยงต่อการกลืนและเกิด Dental Fluorosis"
                },
                "clinical_pearl": "ในเด็กอายุ < 6 ปี: ห้ามใช้น้ำยาบ้วนปากฟลูออไรด์และ High-concentration gel เด็ดขาด ฟลูออไรด์ที่ใช้ในคลินิกได้ปลอดภัยที่สุดคือ 5% NaF Varnish เท่านั้น",
                "reference": "American Academy of Pediatric Dentistry (AAPD) Guideline on Fluoride Therapy; ADA Clinical Practice Guideline on Topical Fluoride"
            }, ensure_ascii=False)
        },
        1996: {
            "correct_answer": "a",
            "explanation": json.dumps({
                "core_principle": "ตามแนวทางปฏิบัติการช่วยชีวิตขั้นพื้นฐานสากล (AHA Basic Life Support - BLS Guidelines 2020): เมื่อพบผู้ป่วย 'หมดสติ ไม่ตอบสนอง และคลำชีพจรไม่ได้ (Unresponsive and Pulseless)' ถือเป็นภาวะหัวใจหยุดเต้น (Cardiac Arrest) ต้องเริ่มทำ 'การกดหน้าอกช่วยชีวิต (Chest Compressions / CPR)' ทันทีโดยไม่รีรอ การกดหน้าอกในอัตรา 100-120 ครั้ง/นาที ยุบลงอย่างน้อย 2 นิ้ว (5 ซม.) ร่วมกับการเปิดทางเดินหายใจ",
                "why_correct": "การเริ่มกดหน้าอก (ปั๊มหัวใจ / Start CPR) เป็นขั้นตอนแรกสุดที่สำคัญที่สุดเมื่อผู้ป่วยหมดสติและไม่มีชีพจร",
                "choice_explanations": {
                    "a": "ถูกต้อง เริ่มทำ CPR / ปั๊มหัวใจทันทีเมื่อคลำชีพจรไม่พบ",
                    "b": "ใช้เครื่อง AED ทันทีที่เครื่องมาถึง แต่ขั้นตอนแรกสุดต้องเริ่มกดหน้าอกระหว่างรอเครื่อง",
                    "c": "โทรเรียก 1669 ต้องสั่งการให้ผู้อื่นไปโทรและนำ AED มา ขณะที่ทันตแพทย์ต้องเริ่มปั๊มหัวใจทันที",
                    "d": "Back blows (ตบหลัง) ใช้สำหรับเด็กเล็กหรือผู้ป่วยสำลักที่ 'ยังมีสติ' แต่หากหมดสติและหัวใจหยุดเต้นแล้วต้องทำ CPR ทันที"
                },
                "clinical_pearl": "หลักการ BLS 2020: C-A-B (Compressions -> Airway -> Breathing) เมื่อพบ Unresponsive + Pulseless -> Start High-Quality CPR Immediately!",
                "reference": "2020 American Heart Association (AHA) Guidelines for CPR and Emergency Cardiovascular Care; Malamed's Medical Emergencies in the Dental Office 8th Ed."
            }, ensure_ascii=False)
        },
        1998: {
            "correct_answer": "d",
            "explanation": json.dumps({
                "core_principle": "รอยโรคการติดเชื้อปฐมภูมิในโพรงประสาทฟันและปลายราก (Pulp necrosis with chronic apical abscess) เป็นการติดเชื้อแบบพหุจุลชีพ (Polymicrobial infection) ที่มีเชื้อกลุ่ม 'Obligate anaerobes' ครองสัดส่วนเด่นชัด (> 90%) เช่น Porphyromonas gingivalis, Porphyromonas endodontalis, Prevotella intermedia, Tannerella forsythia, Treponema denticola, Fusobacterium nucleatum",
                "why_correct": "Obligate anaerobes เป็นเชื้อสาเหตุหลักในรอยโรค Chronic apical abscess ของฟันที่โพรงประสาทตายและไม่เคยรักษารากมาก่อน",
                "choice_explanations": {
                    "a": "Aerobes ไม่สามารถเจริญในคลองรากฟันที่ตายแล้วได้เนื่องจากไม่มีออกซิเจน",
                    "b": "Mixed anaerobes and aerobes พบในน้ำลายหรือผิวช่องปากภายนอก ไม่ใช่ในคลองรากฟัน",
                    "c": "Facultative anaerobes พบเป็นส่วนน้อยใน Primary infection แต่จะเด่นใน Persistent/Secondary infection",
                    "d": "ถูกต้อง Obligate anaerobes เป็นกลุ่มเชื้อจุลชีพเด่นที่สุดใน Primary apical periodontitis / abscess"
                },
                "clinical_pearl": "เชื้อในคลองรากฟัน: Primary infection = Gram-negative Obligate Anaerobes; Secondary/Refractory infection = Gram-positive Facultative Anaerobes (Enterococcus faecalis)",
                "reference": "Cohen's Pathways of the Pulp 12th Ed. Chapter: Microbiology of Endodontic Infections"
            }, ensure_ascii=False)
        }
    }

    # Drop triggers and FTS5 before batch update
    c.execute("DROP TRIGGER IF EXISTS questions_fts_ai")
    c.execute("DROP TRIGGER IF EXISTS questions_fts_ad")
    c.execute("DROP TRIGGER IF EXISTS questions_fts_au")
    c.execute("DROP TABLE IF EXISTS questions_fts")
    conn.commit()

    # Apply updates to database
    for qid, data in updates.items():
        c.execute('''
            UPDATE questions 
            SET correct_answer = ?, explanation = ?
            WHERE id = ?
        ''', (data['correct_answer'], data['explanation'], qid))

    conn.commit()
    print(f'Successfully updated {len(updates)} key questions in 2569 Part 1!')

    # Rebuild FTS5
    c.execute("DROP TRIGGER IF EXISTS questions_fts_ai")
    c.execute("DROP TRIGGER IF EXISTS questions_fts_ad")
    c.execute("DROP TRIGGER IF EXISTS questions_fts_au")
    c.execute("DROP TABLE IF EXISTS questions_fts")
    c.execute("CREATE VIRTUAL TABLE questions_fts USING fts5(question_text, stem, proposition, category, task)")
    c.execute("INSERT INTO questions_fts(rowid, question_text, stem, proposition, category, task) SELECT id, question_text, stem, proposition, category, task FROM questions")
    
    conn.commit()
    conn.close()
    print('FTS5 index rebuilt successfully!')

if __name__ == '__main__':
    update_part1_explanations()
