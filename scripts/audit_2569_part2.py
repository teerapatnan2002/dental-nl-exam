import sqlite3
import json

def update_part2_explanations():
    conn = sqlite3.connect('data/exam_bank.db')
    c = conn.cursor()

    # Define comprehensive explanations for 2569 Part 2 key questions
    updates = {
        2006: {
            "correct_answer": "C",
            "explanation": json.dumps({
                "core_principle": "ภาวะเหงือกโตจากยา (Drug-Induced Gingival Overgrowth - DIGO) มักเกิดจาก 3 กลุ่มยาหลัก: 1) Calcium channel blockers (เช่น Amlodipine, Nifedipine), 2) Anticonvulsants (Phenytoin), และ 3) Immunosuppressants (Cyclosporine) โดยมีคราบจุลินทรีย์ (Dental plaque) เป็นปัจจัยส่งเสริมสำคัญที่กระตุ้นการอักเสบและการตอบสนองของ Fibroblast",
                "why_correct": "ผู้ป่วยมีโรค HT และทานยา Amlodipine ร่วมกับมีคราบจุลินทรีย์ (Dental plaque) ซึ่งเป็นสาเหตุโดยตรงของภาวะเหงือกโตในผู้ป่วยรายนี้",
                "choice_explanations": {
                    "A": "Dental plaque เพียงอย่างเดียวทำให้เกิด Gingivitis แต่ไม่ทำให้เกิด Fibrous gingival overgrowth รุนแรงเท่ากับเมื่อร่วมกับยา Amlodipine",
                    "B": "Simvastatin (ยาลดไขมัน) ไม่ได้เป็นสาเหตุของภาวะเหงือกโต",
                    "C": "ถูกต้อง Dental plaque + Amlodipine เป็นสาเหตุของ Drug-induced gingival enlargement",
                    "D": "Aspirin เป็นยาต้านเกล็ดเลือด ทำให้เลือดออกง่าย แต่ไม่ทำให้เหงือกโต",
                    "E": "Clopidogrel เป็นยาต้านเกล็ดเลือด ไม่ทำให้เหงือกโต"
                },
                "clinical_pearl": "การรักษา DIGO ขั้นแรกคือ Full-mouth scaling & root planing ร่วมกับการปรึกษาแพทย์เพื่อพิจารณาเปลี่ยนกลุ่มยาลดความดัน (เช่น เปลี่ยนเป็น ACEI / ARB)",
                "reference": "Carranza's Clinical Periodontology 13th Ed. Chapter: Gingival Enlargement; AAP 2018 Classification"
            }, ensure_ascii=False)
        },
        2008: {
            "correct_answer": "C",
            "explanation": json.dumps({
                "core_principle": "ในการส่งหนังสือปรึกษาแพทย์ประจำตัว (Medical Consultation) เกี่ยวกับการปรับยาต้านเกล็ดเลือด (Dual Antiplatelet Therapy - DAPT: Aspirin + Clopidogrel) สิ่งที่ทันตแพทย์ 'จำเป็นต้องระบุให้ชัดเจนที่สุด' คือ 'หัตถการทางทันตกรรมที่จะทำ (Planned dental procedure)' และระดับความเสี่ยงของการเสียเลือด (Bleeding risk) เพื่อให้แพทย์ประเมินความเสี่ยงต่อการเกิดลิ่มเลือดอุดตันหลอดเลือดหัวใจ (Thrombotic risk) เทียบกับความเสี่ยงเลือดหยุดยาก",
                "why_correct": "แพทย์ไม่สามารถประเมินได้หากไม่ทราบความรุนแรงและชนิดของหัตถการ (เช่น ถอนฟันธรรมดา 1 ซี่ vs ผ่าฟันคุดหลายซี่)",
                "choice_explanations": {
                    "A": "อายุและเพศมีอยู่ในเวชระเบียนทั่วไป ไม่ใช่ข้อมูลสำคัญในการตัดสินใจปรับยา",
                    "B": "ระยะเวลาทำหัตถการสำคัญรองลงมาจากชนิดของหัตถการ",
                    "C": "ถูกต้อง หัตถการที่จะทำและระดับความรุนแรงในการผ่าตัดคือข้อมูลหลักที่แพทย์ต้องการ",
                    "D": "เทคนิคการฉีดยาชาเป็นดุลยพินิจของทันตแพทย์",
                    "E": "ยาแก้ปวดเป็นส่วนเสริมในการดูแลหลังผ่าตัด"
                },
                "clinical_pearl": "แนวทางปัจจุบัน: หัตถการถอนฟันทั่วไป 1-3 ซี่ ไม่แนะนำให้หยุดยา DAPT โดยใช้มาตรการห้ามเลือดเฉพาะที่ (Local hemostatic measures: Gelfoam, Tranexamic acid, Suture)",
                "reference": "American Dental Association (ADA) Guidelines on Dental Management of Patients on Antiplatelet/Anticoagulant Therapy; Little and Falace 9th Ed."
            }, ensure_ascii=False)
        },
        2009: {
            "correct_answer": "D",
            "explanation": json.dumps({
                "core_principle": "ตามการจำแนกพยาธิกำเนิดของโรคปริทันต์ (Page & Schroeder 1976): 1) Initial lesion (2-4 วัน), 2) Early lesion (4-7 วัน), 3) Established lesion (2-3 สัปดาห์ - เซลล์เด่นคือ Plasma cells และ B cells ยังไม่มีการสูญเสียกระดูกเบ้าฟัน), 4) Advanced lesion (Periodontitis - มีการทำลายเอ็นยึดปริทันต์และกระดูกเบ้าฟัน เกิดร่องลึกปริทันต์แท้จริง)",
                "why_correct": "ผู้ป่วยมีภาพถ่ายรังสีแสดงการละลายของกระดูกเบ้าฟัน (Bone loss) อย่างชัดเจน จึงจัดอยู่ในระยะ 'Advanced lesion'",
                "choice_explanations": {
                    "A": "Established lesion คือระยะเหงือกอักเสบเรื้อรัง (Gingivitis) ที่ยังไม่มี Bone loss",
                    "B": "Initial lesion คือการอักเสบระยะเริ่มแรกใน 2-4 วันแรก",
                    "C": "Early lesion มี T-lymphocyte เด่นและมีการสลายคอลลาเจนแต่ยังไม่มี Bone loss",
                    "D": "ถูกต้อง Advanced lesion มีลักษณะเฉพาะคือ Periodontal pocket formation และ Alveolar bone loss",
                    "E": "Secondary lesion ไม่ใช่คำศัพท์ใน Page & Schroeder classification"
                },
                "clinical_pearl": "จุดตัดสำคัญ: Established lesion = Gingivitis (Reversible, No bone loss) VS Advanced lesion = Periodontitis (Irreversible, Bone loss + Attachment loss)",
                "reference": "Carranza's Clinical Periodontology 13th Ed. Chapter: Pathogenesis of Periodontitis; Page & Schroeder (1976)"
            }, ensure_ascii=False)
        },
        2033: {
            "correct_answer": "D",
            "explanation": json.dumps({
                "core_principle": "ยา Denosumab (Prolia 60 mg SubQ q 6 months) เป็น Monoclonal antibody ต้าน RANKL ที่ยับยั้ง Osteoclast โดยมี Half-life ~26 วัน และฤทธิ์ยับยั้งกระดูกจะเริ่มลดลงอย่างมีนัยสำคัญในเดือนที่ 4-5 หลังฉีดยา ตามแนวทางเวชปฏิบัติสากล (AAOMS / International Consensus on MRONJ): ช่วงเวลาที่ปลอดภัยที่สุดในการทำหัตถการถอนฟัน (Drug Holiday / Safe Window) คือ 'เดือนที่ 5 หลังการฉีดครั้งล่าสุด' (เช่น ฉีดมกราคม -> เดือนที่ 5 คือ พฤษภาคม) เพื่อให้เซลล์ Osteoclast ฟื้นตัวและมีเวลา 4-6 สัปดาห์ให้แผลเยื่อบุและกระดูกสมานตัวสมบูรณ์ก่อนฉีดโดสถัดไปในเดือนที่ 6 (กรกฎาคม)",
                "why_correct": "เดือนพฤษภาคม (เดือนที่ 5) เป็นช่วงเวลาที่ระดับยายับยั้งกระดูกต่ำที่สุดและมีเวลาเพียงพอให้แผลหายก่อนการฉีดยาครั้งต่อไป",
                "choice_explanations": {
                    "A": "มกราคม เป็นเดือนที่เพิ่งได้รับยา ระดับยาและฤทธิ์ยับยั้งกระดูกสูงสุด เสี่ยงต่อ MRONJ สูงมาก",
                    "B": "กุมภาพันธ์ ระดับยายังคงสูงมากในกระแสเลือด",
                    "C": "มีนาคม (เดือนที่ 2-3) ฤทธิ์ยับยั้ง Osteoclast ยังคงทำงานเต็มที่",
                    "D": "ถูกต้อง พฤษภาคม (เดือนที่ 5) เป็นช่วง Safe Window ที่ดีที่สุด",
                    "E": "มิถุนายน ใกล้ถึงรอบฉีดถัดไปมากเกินไป แผลอาจยังหายไม่สนิทก่อนรับยาโดสใหม่"
                },
                "clinical_pearl": "Denosumab Safe Extraction Window: วางแผนถอนฟันในเดือนที่ 5 หลังฉีดโดสล่าสุด และให้ยาโดสถัดไปหลังจากแผลหายสนิทแล้วอย่างน้อย 2-4 สัปดาห์",
                "reference": "AAOMS Position Paper on Medication-Related Osteonecrosis of the Jaw (MRONJ) 2022 Update; Journal of Bone and Mineral Research"
            }, ensure_ascii=False)
        },
        2070: {
            "correct_answer": "B",
            "explanation": json.dumps({
                "core_principle": "การประเมินความเหมาะสมในการทำศัลยกรรมเพิ่มความยาวตัวฟัน (Crown Lengthening Surgery): ปัจจัยวิกฤตที่ต้องประเมินคือ 'ระยะห่างระหว่างขอบวัสดุบูรณะใหม่กับระดับขอบกระดูกเบ้าฟัน (Distance from restoration margin to alveolar crest)' เพื่อให้คงระยะ Biologic Width (Supracrestal Tissue Attachment: Junctional epithelium ~ 1 mm + Connective tissue attachment ~ 1 mm + Sulcus depth ~ 1 mm รวมอย่างน้อย 3 mm) โดยไม่สูญเสียการรองรับของกระดูกจน Crown-to-Root ratio เสียหาย",
                "why_correct": "การวัดระยะห่างระหว่าง Margin กับ Crestal bone เป็นหัวใจสำคัญในการตัดสินใจว่าจะต้องตัดกระดูก (Osseous resective surgery) เท่าใดเพื่อคืน Biologic width 3 mm",
                "choice_explanations": {
                    "A": "ระยะห่าง Margin-Keratinized tissue ช่วยประเมินชนิด Flap (Apically repositioned vs Gingivectomy) แต่ไม่ใช่ตัวกำหนดว่าทำได้หรือไม่",
                    "B": "ถูกต้อง ระยะห่าง Margin ถึง Crestal bone เป็นตัวกำหนดหลักของการคง Biologic width 3 mm",
                    "C": "ความหนาของกระดูกแนว B-L เป็นปัจจัยเสริมในการกรอกระดูก",
                    "D": "ความหนาของเหงือก (Gingival biotype) ส่งผลต่อการหายของแผลแต่ไม่ใช่เกณฑ์หลักในการวางขอบ Margin"
                },
                "clinical_pearl": "กฎ 3 มิลลิเมตร: จากขอบวัสดุบูรณะ (Restoration margin) ถึงยอดกระดูกเบ้าฟัน (Bone crest) ต้องมีระยะว่างอย่างน้อย 3 mm เสมอเพื่อป้องกัน Chronic gingival inflammation และ Bone resorption",
                "reference": "Carranza's Clinical Periodontology 13th Ed. Chapter: Biologic Width and Crown Lengthening; Gargiulo et al. (1961)"
            }, ensure_ascii=False)
        },
        2078: {
            "correct_answer": "D",
            "explanation": json.dumps({
                "core_principle": "รอยด่างขาวขุ่นหรือรอยขรุขระ (Enamel hypocalcification / hypoplasia) ที่เกิดขึ้นเฉพาะที่บนตัวฟันกรามน้อยแท้ (ซี่ 34) เพียงซี่เดียว โดยฟันซี่อื่นปกติทั้งหมด เรียกว่า 'Turner's tooth (Turner's hypoplasia)' เกิดจากการติดเชื้อเรื้อรังที่ปลายรากหรืออุบัติเหตุของฟันน้ำนมซี่ก่อนหน้า (ซี่ 74) ซึ่งรอยโรคอักเสบไปรบกวนการทำงานของ Ameloblasts ของหน่อฟันแท้ที่อยู่ด้านใต้",
                "why_correct": "รอยโรคเฉพาะซี่เดี่ยวๆ (Isolated local defect) สัมพันธ์โดยตรงกับ Periapical infection ของฟันน้ำนมซี่ 74",
                "choice_explanations": {
                    "A": "Genetic (เช่น Amelogenesis Imperfecta) จะเกิดความผิดปกติทั่วทั้งปากทุกซี่",
                    "B": "Enamel decalcification จาก Plaque มักเกิดตามขอบเหงือกและเป็นหลายซี่",
                    "C": "Excess fluoride (Dental fluorosis) จะเกิดสมมาตรทั้งสองข้างของช่องปาก (Bilateral and symmetrical)",
                    "D": "ถูกต้อง Infection of 74 (Turner's tooth) เป็นสาเหตุเฉพาะที่ของ Enamel hypoplasia ซี่เดี่ยว",
                    "E": "Poor oral hygiene ไม่ทำให้เกิดรอยโรคเฉพาะซี่ในลักษณะ Turner's tooth"
                },
                "clinical_pearl": "ข้อสอบจำแนก Enamel Defect: ทุกซี่ในปาก = Genetic (AI); สมมาตร 2 ข้าง = Systemic/Fluorosis; ซี่เดียวโดดๆ = Local infection/Trauma of primary predecessor (Turner's tooth)",
                "reference": "Neville's Oral and Maxillofacial Pathology 5th Ed. Chapter: Abnormalities of Teeth"
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
    print(f'Successfully updated {len(updates)} key questions in 2569 Part 2!')

    # Rebuild FTS5
    c.execute("CREATE VIRTUAL TABLE questions_fts USING fts5(question_text, stem, proposition, category, task)")
    c.execute("INSERT INTO questions_fts(rowid, question_text, stem, proposition, category, task) SELECT id, question_text, stem, proposition, category, task FROM questions")
    
    conn.commit()
    conn.close()
    print('FTS5 index rebuilt successfully!')

if __name__ == '__main__':
    update_part2_explanations()
