import fitz
import json
import re

def fix_ocr(text):
    replacements = {
        '%': '้',
        "'": '่',
        '3': 'ั',
        'w': 'ั',
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
    
    # Simple regex based parsing
    stems = re.split(r'STEM\s+\d+', full_text)[1:]
    
    questions = []
    q_num = 1
    
    for stem in stems:
        lines = stem.strip().split('\n')
        stem_text = []
        q_blocks = []
        current_q = []
        
        for line in lines:
            line = line.strip()
            if not line or "Academic affair" in line or "รวมข้อสอบ" in line or "NL 2 Part 1" in line or re.match(r'^\d+$', line):
                continue
                
            if re.match(r'^\d+\.', line) and " " in line:
                # Check if it's a choice or a question
                num = int(line.split('.')[0])
                if num == q_num:
                    if current_q:
                        q_blocks.append(current_q)
                    current_q = [line]
                    q_num += 1
                elif num in [1, 2, 3, 4, 5] and current_q:
                    current_q.append(line)
                else:
                    if current_q:
                        current_q.append(line)
                    else:
                        stem_text.append(line)
            else:
                if current_q:
                    current_q.append(line)
                else:
                    stem_text.append(line)
                    
        if current_q:
            q_blocks.append(current_q)
            
        stem_str = " ".join(stem_text)
        
        for q_block in q_blocks:
            q_text = []
            choices = []
            for line in q_block:
                m = re.match(r'^([1-5])\.\s*(.*)', line)
                if m and len(q_text) > 0:
                    choices.append({
                        "label": m.group(1),
                        "text": m.group(2).strip()
                    })
                else:
                    q_text.append(line)
            
            q_full_text = f"{stem_str}\n" + " ".join(q_text)
            
            # Simple categorization
            cat = "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก"
            task = "การวินิจฉัยโรค"
            
            if "ชุมชน" in q_full_text or "พรบ" in q_full_text or "สิทธิ" in q_full_text or "จรรยาบรรณ" in q_full_text:
                cat = "ทันตกรรมชุมชน"
            elif "เด็ก" in q_full_text or "ขวบ" in q_full_text or "น้ำนม" in q_full_text:
                cat = "ทันตกรรมสำหรับเด็ก"
            elif "จัดฟัน" in q_full_text or "crossbite" in q_full_text or "skeletal" in q_full_text:
                cat = "ทันตกรรมจัดฟัน"
            elif "รักษาราก" in q_full_text or "RCT" in q_full_text or "pulp" in q_full_text:
                cat = "วิทยาเอ็นโดดอนต์"
            elif "ฟันปลอม" in q_full_text or "rpd" in q_full_text:
                cat = "ทันตกรรมประดิษฐ์"
            elif "ถอนฟัน" in q_full_text or "ผ่าตัด" in q_full_text:
                cat = "ศัลยศาสตร์ช่องปาก"
            elif "อุดฟัน" in q_full_text or "amalgam" in q_full_text or "composite" in q_full_text:
                cat = "ทันตกรรมบูรณะ/หัตถการ"
            elif "เหงือก" in q_full_text or "หินปูน" in q_full_text or "perio" in q_full_text:
                cat = "ปริทันตวิทยา"
                
            questions.append({
                "question_text": q_full_text.strip(),
                "choices": choices,
                "correct_answer": None,
                "category": cat,
                "task": task,
                "source_exam": "NL2_2022_part1.pdf"
            })
            
    with open('/Users/admin/Downloads/NL Test/parsed_exams/minified.json', 'w', encoding='utf-8') as f:
        json.dump({"questions": questions}, f, ensure_ascii=False, separators=(',', ':'))

if __name__ == "__main__":
    parse_pdf()
