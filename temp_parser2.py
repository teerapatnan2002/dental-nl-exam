import fitz
import json
import re
import os

def fix_ocr(text):
    text = text.replace('ฟ3น', 'ฟัน')
    text = text.replace('ฝ3wง', 'ฝั่ง')
    text = text.replace('ป3จจัย', 'ปัจจัย')
    text = text.replace('ป3สสาวะ', 'ปัสสาวะ')
    text = text.replace('ป/', 'ปี')
    
    replacements = {
        '%': '้',
        "'": '่',
        ']': '์',
        'ë': '็',
        'û': '้',
        'N': '่'
    }
    for k, v in replacements.items():
        text = text.replace(k, v)
    return text

def parse_pdf():
    doc = fitz.open('/Users/admin/Downloads/NL Test/NL2Test2022/NL2_2022_part1.pdf')
    full_text = ""
    for page in doc:
        full_text += page.get_text()
        
    full_text = fix_ocr(full_text)
    lines = full_text.split('\n')
    
    questions = []
    
    current_stem = []
    current_q_text = []
    current_choices = []
    
    state = "STEM"
    last_choice = 0
    
    for line in lines:
        line = line.strip()
        if not line or "Academic affair" in line or "รวมข้อสอบ" in line or "NL 2 Part 1" in line or re.match(r'^\d+$', line):
            continue
            
        if re.match(r'(?i)^STEM\s+\d+', line):
            # Save previous if exists
            if current_q_text:
                cat = "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก"
                task = "การวินิจฉัยโรค"
                q_full = " ".join(current_stem) + "\n" + " ".join(current_q_text)
                questions.append({
                    "question_text": q_full.strip(),
                    "choices": current_choices,
                    "correct_answer": None,
                    "category": cat,
                    "task": task,
                    "source_exam": "NL2_2022_part1.pdf"
                })
                current_q_text = []
                current_choices = []
                
            current_stem = [line]
            state = "STEM"
            continue
            
        m = re.match(r'^(\d+)\.\s+(.*)', line)
        if m:
            num = int(m.group(1))
            text = m.group(2)
            
            is_question = False
            is_choice = False
            
            if state == "STEM":
                is_question = True
            elif state == "QUESTION":
                if num == 1:
                    is_choice = True
                else:
                    is_question = True
            elif state == "CHOICES":
                if num == last_choice + 1 or (num <= 5 and num > last_choice):
                    is_choice = True
                else:
                    is_question = True
                    
            if is_question:
                if current_q_text:
                    cat = "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก"
                    task = "การวินิจฉัยโรค"
                    q_full = " ".join(current_stem) + "\n" + " ".join(current_q_text)
                    questions.append({
                        "question_text": q_full.strip(),
                        "choices": current_choices,
                        "correct_answer": None,
                        "category": cat,
                        "task": task,
                        "source_exam": "NL2_2022_part1.pdf"
                    })
                current_q_text = [f"{num}. {text}"]
                current_choices = []
                state = "QUESTION"
                last_choice = 0
            elif is_choice:
                current_choices.append({
                    "label": str(num),
                    "text": text
                })
                state = "CHOICES"
                last_choice = num
        else:
            if state == "STEM":
                current_stem.append(line)
            elif state == "QUESTION":
                current_q_text.append(line)
            elif state == "CHOICES" and current_choices:
                current_choices[-1]["text"] += " " + line

    if current_q_text:
        cat = "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก"
        task = "การวินิจฉัยโรค"
        q_full = " ".join(current_stem) + "\n" + " ".join(current_q_text)
        questions.append({
            "question_text": q_full.strip(),
            "choices": current_choices,
            "correct_answer": None,
            "category": cat,
            "task": task,
            "source_exam": "NL2_2022_part1.pdf"
        })

    # Basic categorization
    for q in questions:
        q_full = q["question_text"]
        if "ชุมชน" in q_full or "พรบ" in q_full or "สิทธิ" in q_full or "จรรยาบรรณ" in q_full or "ottwa" in q_full or "inform consent" in q_full or "common risk" in q_full:
            q["category"] = "ทันตกรรมชุมชน"
        elif "เด็ก" in q_full or "ขวบ" in q_full or "น้ำนม" in q_full or "primary tooth" in q_full:
            q["category"] = "ทันตกรรมสำหรับเด็ก"
        elif "จัดฟัน" in q_full or "crossbite" in q_full or "skeletal" in q_full or "space" in q_full or "arch" in q_full or "frenum" in q_full:
            q["category"] = "ทันตกรรมจัดฟัน"
        elif "รักษาราก" in q_full or "RCT" in q_full or "pulp" in q_full or "apical" in q_full or "root canal" in q_full:
            q["category"] = "วิทยาเอ็นโดดอนต์"
        elif "ฟันปลอม" in q_full or "rpd" in q_full or "abutment" in q_full or "facebow" in q_full:
            q["category"] = "ทันตกรรมประดิษฐ์"
        elif "ถอนฟัน" in q_full or "ผ่าตัด" in q_full or "ชา" in q_full or "curette" in q_full or "dry socket" in q_full:
            q["category"] = "ศัลยศาสตร์ช่องปาก"
        elif "อุดฟัน" in q_full or "amalgam" in q_full or "composite" in q_full or "erosion" in q_full or "caries" in q_full or "sealant" in q_full:
            q["category"] = "ทันตกรรมบูรณะ/หัตถการ"
        elif "เหงือก" in q_full or "หินปูน" in q_full or "perio" in q_full or "pocket" in q_full or "gingival" in q_full:
            q["category"] = "ปริทันตวิทยา"

        if "วินิจฉัย" in q_full or "x-ray" in q_full or "diag" in q_full.lower():
            q["task"] = "การวินิจฉัยโรค"
        elif "รักษา" in q_full or "จัดการ" in q_full or "tx" in q_full.lower():
            q["task"] = "การจัดการและการรักษาผู้ป่วย"
        elif "สาเหตุ" in q_full or "เกิดจาก" in q_full:
            q["task"] = "การเกิดและการดำเนินโรค"
        elif "ป้องกัน" in q_full or "แนะนำ" in q_full:
            q["task"] = "การสร้างเสริมสุขภาพและการป้องกัน"
        else:
            q["task"] = "ขั้นตอนและวิธีการรักษา"

    out_file = '/Users/admin/Downloads/NL Test/parsed_exams/final.json'
    os.makedirs(os.path.dirname(out_file), exist_ok=True)
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump({"questions": questions}, f, ensure_ascii=False, indent=2)
        
    print(f"Parsed {len(questions)} questions")

if __name__ == "__main__":
    parse_pdf()
