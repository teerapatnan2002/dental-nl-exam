import fitz
import json
import re
import os

def fix_ocr(text):
    replacements = {
        'ฟ3น': 'ฟัน', 'ฝ3wง': 'ฝั่ง', 'ป3จจัย': 'ปัจจัย', 'ป3สสาวะ': 'ปัสสาวะ',
        '%': '้', "'": '่', ']': '์', 'ë': '็', 'û': '้', 'N': '่',
        'ื่': 'ื่อ'
    }
    for k, v in replacements.items():
        text = text.replace(k, v)
    return text

def parse_pdf():
    doc = fitz.open('/Users/admin/Downloads/NL Test/NL2Test2025/รวม NL 2 2025.pdf')
    lines = []
    for page in doc:
        text = page.get_text()
        text = fix_ocr(text)
        for line in text.split('\n'):
            line = line.strip()
            if line:
                lines.append(line)
                
    questions = []
    current_stem = []
    current_q_text = []
    current_choices = []
    
    state = "STEM"
    last_choice = 0
    
    def add_question():
        if current_q_text:
            q_full = " ".join(current_stem) + "\n" + " ".join(current_q_text)
            
            cat = "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก"
            task = "การวินิจฉัยโรค"
            
            q_lower = q_full.lower()
            if any(k in q_lower for k in ["ชุมชน", "พรบ", "สิทธิ", "จรรยาบรรณ", "ottwa", "inform consent", "common risk", "หลักประกัน", "กฎหมาย", "ระเบียบ", "อนามัย", "ทพ.", "ทันตแพทย์", "ประชาคม", "รณรงค์"]):
                cat = "ทันตกรรมชุมชน"
            elif any(k in q_lower for k in ["เด็ก", "ขวบ", "น้ำนม", "primary tooth", "pedo", "นม"]):
                cat = "ทันตกรรมสำหรับเด็ก"
            elif any(k in q_lower for k in ["จัดฟัน", "crossbite", "skeletal", "space", "arch", "frenum", "ortho", "profile", "relapse", "cephalometric", "ceph"]):
                cat = "ทันตกรรมจัดฟัน"
            elif any(k in q_lower for k in ["รักษาราก", "rct", "pulp", "apical", "root canal", "endo", "canal", "pulpectomy", "pulpotomy", "irreversible", "reversible"]):
                cat = "วิทยาเอ็นโดดอนต์"
            elif any(k in q_lower for k in ["ฟันปลอม", "rpd", "abutment", "facebow", "denture", "crown", "post", "core", "kennedy", "clasp", "implant", "bridge"]):
                cat = "ทันตกรรมประดิษฐ์"
            elif any(k in q_lower for k in ["ถอนฟัน", "ผ่าตัด", "ชา", "curette", "dry socket", "extraction", "surgeon", "nerve block", "space infection", "cyst", "suture", "bleeding"]):
                cat = "ศัลยศาสตร์ช่องปาก"
            elif any(k in q_lower for k in ["อุดฟัน", "amalgam", "composite", "erosion", "caries", "sealant", "filling", "gic", "veneer", "attrition"]):
                cat = "ทันตกรรมบูรณะ/หัตถการ"
            elif any(k in q_lower for k in ["เหงือก", "หินปูน", "perio", "pocket", "gingival", "srp", "plaque", "calculus", "attachment", "recession"]):
                cat = "ปริทันตวิทยา"
                
            if any(k in q_lower for k in ["วินิจฉัย", "x-ray", "diag", "ตรวจ", "ประเมิน", "panoramic", "film", "cbct", "ลักษณะ"]):
                task = "การวินิจฉัยโรค"
            elif any(k in q_lower for k in ["รักษา", "จัดการ", "tx", "ทำอย่างไร", "แผนการ"]):
                task = "การจัดการและการรักษาผู้ป่วย"
            elif any(k in q_lower for k in ["สาเหตุ", "เกิดจาก", "เพราะ", "ปัจจัย", "พยาธิ"]):
                task = "การเกิดและการดำเนินโรค"
            elif any(k in q_lower for k in ["ป้องกัน", "แนะนำ", "แปรงฟัน", "ส่งเสริม", "อนามัย"]):
                task = "การสร้างเสริมสุขภาพและการป้องกัน"
            else:
                task = "ขั้นตอนและวิธีการรักษา"
                
            questions.append({
                "question_text": q_full.strip(),
                "choices": current_choices,
                "correct_answer": None,
                "category": cat,
                "task": task,
                "source_exam": "รวม NL 2 2025.pdf",
                "stem": "\n".join(current_stem).strip(),
                "proposition": "\n".join(current_q_text).strip()
            })

    for line in lines:
        if "Academic affair" in line or "รวมข้อสอบ" in line or "NL 2 Part" in line or "NL 1 Part" in line or "วันเสาร์ที่" in line or re.match(r'^\d+$', line) or line.strip() in ["1.", "2.", "3.", "4.", "5.", "6."]:
            if re.match(r'^[1-6]\.$', line.strip()):
                pass
            else:
                continue
            
        if re.match(r'(?i)^stem\s+\d+', line):
            add_question()
            current_q_text = []
            current_choices = []
            current_stem = [line]
            state = "STEM"
            continue
            
        m = re.match(r'^([1-9A-Ea-e])\.\s*(.*)', line)
        if m:
            label = m.group(1)
            text = m.group(2)
            
            is_question = False
            is_choice = False
            
            if state == "STEM":
                is_question = True
            elif state == "QUESTION":
                if label in ['1', 'A', 'a']:
                    is_choice = True
                else:
                    is_question = True
            elif state == "CHOICES":
                if label.isdigit():
                    num = int(label)
                    if isinstance(last_choice, int):
                        if num > last_choice and num <= last_choice + 2:
                            is_choice = True
                        else:
                            is_question = True
                    else:
                        is_question = True
                else:
                    is_choice = True
                    
            if is_question:
                add_question()
                current_q_text = [f"{label}. {text}"]
                current_choices = []
                state = "QUESTION"
                last_choice = 0
            elif is_choice:
                current_choices.append({
                    "label": label,
                    "text": text
                })
                state = "CHOICES"
                if label.isdigit():
                    last_choice = int(label)
                else:
                    last_choice = label
        else:
            if state == "STEM":
                current_stem.append(line)
            elif state == "QUESTION":
                current_q_text.append(line)
            elif state == "CHOICES" and current_choices:
                current_choices[-1]["text"] += " " + line

    add_question()
    
    # filter out bad questions
    final_questions = [q for q in questions if len(q['choices']) > 0]
    
    out_dict = {"questions": final_questions}
    json_str = json.dumps(out_dict, ensure_ascii=False, indent=2)
    print(f"Num questions: {len(final_questions)}")
    print(f"JSON length: {len(json_str)}")
    
    out_file = '/Users/admin/Downloads/NL Test/parsed_exams/NL_2_2025.json'
    os.makedirs(os.path.dirname(out_file), exist_ok=True)
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write(json_str)

if __name__ == "__main__":
    parse_pdf()
