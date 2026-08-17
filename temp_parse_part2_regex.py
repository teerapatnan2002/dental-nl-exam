import fitz
import re
import json

CAT_PED = "ทันตกรรมสำหรับเด็ก"
CAT_SURG = "ศัลยศาสตร์ช่องปาก"
CAT_PERIO = "ปริทันตวิทยา"
CAT_RESTO = "ทันตกรรมบูรณะ/หัตถการ"
CAT_PROSTHO = "ทันตกรรมประดิษฐ์"
CAT_ORTHO = "ทันตกรรมจัดฟัน"
CAT_COMM = "ทันตกรรมชุมชน"
CAT_DIAG = "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก"
CAT_ENDO = "วิทยาเอ็นโดดอนต์"
CAT_OCCLUSION = "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า"

TASK_PROMO = "การสร้างเสริมสุขภาพและการป้องกัน"
TASK_MECH = "การเกิดและการดำเนินโรค"
TASK_DIAG = "การวินิจฉัยโรค"
TASK_TREAT = "การจัดการและการรักษาผู้ป่วย"
TASK_PROC = "ขั้นตอนและวิธีการรักษา"

def assign_cat_task(text):
    text = text.lower()
    if any(w in text for w in ["ortho", "profile", "crowding", "cross bite", "cephalometric", "skeletal", "le fort", "osteotomy"]):
        return CAT_ORTHO, TASK_TREAT
    if any(w in text for w in ["pediatric", "child", "เด็ก", "อายุ 7 ขวบ", "ssc", "pulpotomy", "fluoride varnish", "อายุ 5 ขวบ", "อายุ 9 ปี"]):
        return CAT_PED, TASK_TREAT
    if any(w in text for w in ["extract", "ถอน", "surgery", "impacted", "implant", "blood", "ulcer", "biopsy", "flap", "suturing", "sinus lift", "oac", "ramus"]):
        return CAT_SURG, TASK_PROC
    if any(w in text for w in ["perio", "probing", "pocket", "bone loss", "mobility", "scaling", "root planing", "gingiva", "frenectomy", "widman"]):
        return CAT_PERIO, TASK_DIAG
    if any(w in text for w in ["amalgam", "composite", "filling", "caries", "ผุ", "บูรณะ", "inlay", "onlay", "resin", "sealant"]):
        return CAT_RESTO, TASK_TREAT
    if any(w in text for w in ["denture", "partial", "crown", "bridge", "rpd", "cd", "ฟันปลอม", "abutment", "clasp", "post", "core"]):
        return CAT_PROSTHO, TASK_TREAT
    if any(w in text for w in ["endo", "pulp", "root canal", "rct", "periapical", "canal"]):
        return CAT_ENDO, TASK_TREAT
    if any(w in text for w in ["pain", "tmj", "muscle", "occlusal", "bite", "บดเคี้ยว", "ปวดหน้าหู", "masseter", "temporomandibular"]):
        return CAT_OCCLUSION, TASK_DIAG
    if any(w in text for w in ["community", "โครงการ", "ส่งเสริมสุขภาพ", "precede", "proceed"]):
        return CAT_COMM, TASK_PROMO
    return CAT_DIAG, TASK_DIAG

def run():
    pdf_path = "/Users/admin/Downloads/NL Test/NL2Test2024/NL2-2567 Part 2.pdf"
    out_path = "/Users/admin/Downloads/NL Test/parsed_exams/NL2_2567_Part_2.json"
    
    with fitz.open(pdf_path) as doc:
        text = ""
        for page in doc:
            text += page.get_text() + "\n"
            
    # Normalize spaces
    text = re.sub(r'(\d+)\.\s+', r'\1.', text)
    
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    
    questions = []
    
    expected_q_num = 1
    
    current_stem = ""
    accum_stem = []
    
    current_q_text = []
    current_choices = []
    current_choice_label = None
    current_choice_text = []
    
    state = "STEM"
    
    def save_q():
        if not current_q_text:
            return
        if current_choice_label:
            current_choices.append({
                "label": current_choice_label,
                "text": " ".join(current_choice_text).strip()
            })
            
        q_str = " ".join(current_q_text).strip()
        cat, task = assign_cat_task(current_stem + " " + q_str)
        
        lbl_map = {"1": "A", "2": "B", "3": "C", "4": "D", "5": "E", "6": "F"}
        mapped_c = []
        for c in current_choices:
            mapped_c.append({
                "label": lbl_map.get(c["label"], c["label"]),
                "text": c["text"]
            })
            
        questions.append({
            "question_text": q_str,
            "choices": mapped_c,
            "correct_answer": None,
            "category": cat,
            "task": task,
            "source_exam": "NL2-2567 Part 2.pdf",
            "stem": current_stem.strip(),
            "proposition": q_str,
            "explanation": None,
            "image_paths": []
        })
        
    for line in lines:
        if line.startswith("Academic affair") or "NL 2 Part 2" in line or "รวมข้อสอบประเมิน" in line:
            continue
            
        if line.startswith("STEM"):
            if state != "STEM":
                save_q()
                current_q_text = []
                current_choices = []
                current_choice_label = None
                current_choice_text = []
                accum_stem = []
            state = "STEM"
            accum_stem.append(line)
            continue
            
        m_q = re.match(r'^(\d+)\.(.*)', line)
        if m_q:
            num = int(m_q.group(1))
            rest = m_q.group(2).strip()
            
            # Since some questions might be missing (e.g. they skipped a number),
            # we should allow `num` to be anything between `expected_q_num` and `expected_q_num + 5`
            if expected_q_num <= num <= expected_q_num + 5:
                save_q()
                if state == "STEM":
                    current_stem = " ".join(accum_stem)
                current_q_text = [rest] if rest else []
                current_choices = []
                current_choice_label = None
                current_choice_text = []
                expected_q_num = num + 1
                state = "QUESTION"
                continue
                
            if state == "QUESTION" or state == "CHOICES":
                if 1 <= num <= 6:
                    if current_choice_label:
                        current_choices.append({
                            "label": current_choice_label,
                            "text": " ".join(current_choice_text).strip()
                        })
                    current_choice_label = str(num)
                    current_choice_text = [rest] if rest else []
                    state = "CHOICES"
                    continue
        
        if state == "STEM":
            accum_stem.append(line)
        elif state == "QUESTION":
            current_q_text.append(line)
        elif state == "CHOICES":
            if current_choice_label:
                current_choice_text.append(line)
                
    save_q()
    
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump({"questions": questions}, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    run()
