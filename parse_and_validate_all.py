import fitz, re, json

files = [
    (1, './NLLaw/Mock exam ชุดที่ 1.pdf', 'DSAT Mock Law ชุดที่ 1 (2569)', 2400),
    (2, './NLLaw/Mock exam ชุดที่2.pdf', 'DSAT Mock Law ชุดที่ 2 (2569)', 2430),
    (3, './NLLaw/Mock exam ชุดที่3.pdf', 'DSAT Mock Law ชุดที่ 3 (2569)', 2460)
]

choice_letters = ['ก', 'ข', 'ค', 'ง', 'จ']

all_parsed = []

for set_num, filepath, source_name, start_id in files:
    doc = fitz.open(filepath)
    explanations = {}
    
    # 1. Parse Explanation pages (pages 14 to 23, index 13 to 22)
    for p in range(13, 23):
        txt = doc[p].get_text()
        lines = [l.strip() for l in txt.split('\n') if l.strip()]
        p_text = '\n'.join(lines)
        exp_blocks = re.split(r'\n(?=ข้อ\s*\d+\s*ตอบ\s*[ก-จ])', p_text)
        for b in exp_blocks:
            m = re.match(r'ข้อ\s*(\d+)\s*ตอบ\s*([ก-จ])\.\s*(.*?)(?=\nระดับ|\nเหตุผล|\nอ้างอิง|$)', b, re.DOTALL)
            if m:
                qnum = int(m.group(1))
                ans_letter = m.group(2)
                short_ans = m.group(3).strip()
                level_m = re.search(r'ระดับ\s*([A-Za-z\s]+)\s*·\s*TOS\s*([^\n]+)', b)
                level = level_m.group(1).strip() if level_m else ''
                tos = level_m.group(2).strip() if level_m else ''
                reason_m = re.search(r'เหตุผล\s*(.*?)(?=\nอ้างอิง|$)', b, re.DOTALL)
                reason = reason_m.group(1).strip() if reason_m else ''
                ref_m = re.search(r'อ้างอิง\s*(.*?)(?=\nโดยสมาพันธ์|\nหน้า|$)', b, re.DOTALL)
                ref = ref_m.group(1).strip() if ref_m else ''
                
                explanations[qnum] = {
                    'ans_letter': ans_letter,
                    'short_ans': short_ans,
                    'cognitive_level': level,
                    'tos_code': tos,
                    'reason': reason,
                    'reference': ref
                }
                
    # 2. Parse Question pages (pages 3 to 12, index 2 to 11)
    for p in range(2, 12):
        txt = doc[p].get_text()
        lines = [l.strip() for l in txt.split('\n') if l.strip()]
        stem_lines = []
        q_start_idx = -1
        for idx, line in enumerate(lines):
            if re.match(r'^\d+\.', line) and idx > 1:
                q_start_idx = idx
                break
            if idx >= 2 and not line.startswith('หน้า') and not line.startswith('โดยสมาพันธ์'):
                stem_lines.append(line)
        stem_text = ' '.join(stem_lines).strip()
        
        content_lines = lines[q_start_idx:]
        filtered = [l for l in content_lines if not l.startswith('หน้า') and not l.startswith('โดยสมาพันธ์')]
        
        q_blocks = []
        cur_block = []
        for l in filtered:
            if re.match(r'^\d+\.', l):
                if cur_block:
                    q_blocks.append(cur_block)
                cur_block = [l]
            else:
                cur_block.append(l)
        if cur_block:
            q_blocks.append(cur_block)
            
        for b in q_blocks:
            first = b[0]
            m = re.match(r'^(\d+)\.\s*(.*)', first)
            qnum = int(m.group(1))
            prop_lines = []
            if m.group(2).strip():
                prop_lines.append(m.group(2).strip())
                
            choices = []
            cur_ch_letter = None
            cur_ch_lines = []
            for l in b[1:]:
                ch_m = re.match(r'^([ก-จ])\.\s*(.*)', l)
                if ch_m:
                    if cur_ch_letter:
                        choices.append({'label': cur_ch_letter, 'text': ' '.join(cur_ch_lines).strip()})
                    cur_ch_letter = ch_m.group(1)
                    cur_ch_lines = [ch_m.group(2).strip()] if ch_m.group(2).strip() else []
                elif cur_ch_letter:
                    cur_ch_lines.append(l)
                else:
                    prop_lines.append(l)
            if cur_ch_letter:
                choices.append({'label': cur_ch_letter, 'text': ' '.join(cur_ch_lines).strip()})
                
            prop_text = ' '.join(prop_lines).strip()
            exp_data = explanations.get(qnum, {})
            
            # Build structured explanation
            correct_letter = exp_data.get('ans_letter', 'ก')
            short_ans = exp_data.get('short_ans', '')
            reason = exp_data.get('reason', '')
            ref = exp_data.get('reference', '')
            level = exp_data.get('cognitive_level', '')
            tos = exp_data.get('tos_code', '')
            
            # Construct choice explanations
            ch_exps = {}
            for c in choices:
                lbl = c['label']
                if lbl == correct_letter:
                    ch_exps[lbl] = f"✓ ถูกต้อง — {short_ans} ({reason[:100]}...)" if len(reason) > 100 else f"✓ ถูกต้อง — {short_ans}"
                else:
                    ch_exps[lbl] = f"✗ ไม่ถูกต้อง — ไม่ตรงตามหลักเกณฑ์ของ {tos.split(':')[0] if ':' in tos else tos}"
                    
            expl_dict = {
                "correct_answer": correct_letter,
                "key_takeaway": short_ans if short_ans else reason[:120],
                "core_principle": reason,
                "legal_citation": ref,
                "cognitive_level": level,
                "tos_code": tos,
                "common_pitfall": f"ข้อสอบระดับ {level} มักทดสอบความแม่นยำในเกณฑ์ {tos}",
                "choice_explanations": ch_exps,
                "future_prediction": f"ประเด็น {tos} เป็นข้อสอบมาตรฐานที่มักนำมาออกสอบสม่ำเสมอในการสอบความรู้ผู้ประกอบวิชาชีพทันตกรรม"
            }
            
            assigned_id = start_id + (qnum - 1)
            
            all_parsed.append({
                'id': assigned_id,
                'qnum': qnum,
                'set_num': set_num,
                'source_exam': source_name,
                'stem': stem_text,
                'proposition': prop_text,
                'question_text': f"{stem_text}\n\n{prop_text}" if stem_text else prop_text,
                'category': 'กฎหมายและจรรยาบรรณ',
                'task': 'กฎหมายและจรรยาบรรณ',
                'choices': choices,
                'correct_answer': correct_letter,
                'explanation': json.dumps(expl_dict, ensure_ascii=False)
            })

print(f"Total parsed: {len(all_parsed)} questions")
print(f"ID range: {all_parsed[0]['id']} to {all_parsed[-1]['id']}")

with open('./scratch/dsat_mock_parsed.json', 'w', encoding='utf-8') as f:
    json.dump(all_parsed, f, ensure_ascii=False, indent=2)

print("Saved to scratch/dsat_mock_parsed.json")
