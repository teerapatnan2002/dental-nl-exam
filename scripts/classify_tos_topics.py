#!/usr/bin/env python3
"""
TOS Topic & Cognitive Level Classification Engine
Maps all 2,443 questions to official 'Must Know' topics from manual2020.pdf
and assigns Bloom's Taxonomy Cognitive Levels (R: Recall, A: Application, P: Problem-solving).
Syncs results to SQLite and Supabase PostgreSQL.
"""

import sqlite3
import json
import re
import os
import psycopg

# ---------------------------------------------------------
# 1. Must Know Topic Definitions & Keyword Matchers
# ---------------------------------------------------------

TOPIC_RULES = {
    "วิทยาเอ็นโดดอนต์": [
        ("Endo-Pulp-Periapical-Diagnosis", ["diagnosis", "วินิจฉัย", "cold test", "ept", "percussion", "เคาะเจ็บ", "reversible pulpitis", "irreversible pulpitis", "pulp necrosis", "apical periodontitis", "acute apical abscess", "chronic apical abscess", "sinus tract"]),
        ("Endo-Vital-Pulp-Therapy", ["vital pulp", "vpt", "capping", "direct pulp capping", "indirect pulp capping", "pulpotomy", "cvek", "apexogenesis", "biodentine", "mta"]),
        ("Endo-Open-Apex-Management", ["open apex", "ปลายรากเปิด", "apexification", "revascularization", "rep", "regenerative endodontic", "scap", "immature permanent"]),
        ("Endo-Canal-Anatomy-Access", ["mb2", "radix entomolaris", "canal anatomy", "access", "รูปร่างคลองราก", "fast break", "vertucci", "strip perforation", "danger zone"]),
        ("Endo-Pulp-Biology-Neurophysiology", ["a-delta", "c fiber", "dentin-pulp complex", "neurophysiology", "pain mechanism", "hydrodynamic"]),
        ("Endo-Irrigants-Intracanal-Medication", ["naocl", "sodium hypochlorite", "edta", "chlorhexidine", "chx", "smear layer", "naocl accident", "ca(oh)2", "calcium hydroxide", "intracanal medicament"]),
        ("Endo-Microbiology-Infection", ["e. faecalis", "enterococcus", "biofilm", "microbiology", "anaerobes", "persistent infection"]),
        ("Endo-Instrumentation-Obturation", ["working length", "apex locator", "eal", "obturation", "gutta-percha", "tug-back", "spreader", "lateral condensation", "sealer"]),
        ("Endo-Complications-Fractures", ["vertical root fracture", "vrf", "cracked tooth", "tooth slooth", "instrument separation", "file หัก", "ledge", "perforation"]),
        ("Endo-Resorption", ["resorption", "การละลายของราก", "internal resorption", "external cervical resorption", "heithersay", "pink tooth"])
    ],
    "ศัลยศาสตร์ช่องปาก": [
        ("OMFS-Local-Anesthesia-Pharmacology", ["ยาชา", "lidocaine", "articaine", "mepivacaine", "bupivacaine", "prilocaine", "pka", "lipid solubility", "epinephrine", "mrd", "last", "methemoglobinemia", "vasoconstrictor"]),
        ("OMFS-Anesthesia-Techniques", ["ianb", "inferior alveolar", "gow-gates", "vazirani", "akinosi", "psa", "mental nerve", "lingual nerve", "ฉีดยาชา", "bell's palsy"]),
        ("OMFS-Exodontia-Biomechanics", ["elevator", "คานงัด", "คีมถอนฟัน", "forceps", "exodontia", "wedge", "wheel and axle", "ถอนฟัน"]),
        ("OMFS-Impacted-Teeth", ["ฟันคุด", "impacted", "winter", "pell and gregory", "mesioangular", "distoangular", "coronectomy", "odontectomy", "flap"]),
        ("OMFS-Fascial-Space-Infections", ["fascial space", "submandibular", "sublingual", "submental", "ludwig", "angina", "cavernous sinus", "trismus", "mylohyoid", "cellulitis"]),
        ("OMFS-Maxillofacial-Trauma", ["le fort", "mandibular fracture", "กระดูกหัก", "trauma", "atls", "zmc", "blowout", "condyle fracture", "symphysis"]),
        ("OMFS-Oroantral-Communication", ["oac", "oaf", "oroantral", "ไซนัสทะลุ", "buccal flap", "maxillary sinus", "sinus perforation"]),
        ("OMFS-Bone-Pathology-Necrosis", ["mronj", "bisphosphonate", "osteoradionecrosis", "orn", "hbo", "กระดูกตาย", "radiation"]),
        ("OMFS-Medical-Emergencies", ["syncope", "เป็นลม", "anaphylaxis", "ฉุกเฉิน", "angina", "nitroglycerin", "cpr", "bls", "hypoglycemia", "asthma"])
    ],
    "ทันตกรรมประดิษฐ์": [
        ("Pros-Complete-Denture-Anatomy", ["complete denture", "cd", "buccal shelf", "retromolar pad", "hard palate", "border molding", "stress bearing", "relief", "พิมพ์ปากฟันปลอม"]),
        ("Pros-Jaw-Relations-Occlusion", ["vdo", "vdr", "freeway space", "centric relation", "cr", "balanced occlusion", "christensen", "vertical dimension"]),
        ("Pros-CD-Post-Insertion-Problems", ["เจ็บฟันปลอม", "cheek biting", "กัดแก้ม", "swallowing", "กลืนเจ็บ", "whistling", "lisping", "post-insertion"]),
        ("Pros-RPD-Classification-Surveying", ["kennedy", "applegate", "rpd", "surveying", "path of insertion", "undercut", "surveyor"]),
        ("Pros-RPD-Components-Biomechanics", ["major connector", "lingual bar", "lingual plate", "rpi", "i-bar", "rest seat", "clasp", "indirect retainer", "combination clasp"]),
        ("Pros-Fixed-Tooth-Preparation", ["preparation", "taper", "toc", "convergence", "chamfer", "shoulder", "knife edge", "margin", "ferrule", "กรอฟัน"]),
        ("Pros-Fixed-Provisional-Impression", ["pvs", "polyether", "impression", "retraction cord", "temp crown", "provisional", "พิมพ์ปาก"]),
        ("Pros-Fixed-Cements-Post-Core", ["post and core", "เดือยฟัน", "ferrule effect", "resin cement", "zinc phosphate", "rmgic cement", "luting"]),
        ("Pros-Pontic-Design", ["pontic", "hygienic", "modified ridge lap", "ovate pontic", "ข้อต่อฟันปลอม"]),
        ("Pros-Dental-Implants", ["implant", "รากเทียม", "osseointegration", "screw-retained", "cement-retained", "platform switching", "cantilever"])
    ],
    "ปริทันตวิทยา": [
        ("Perio-Classification-2017", ["staging", "grading", "classification 2017", "periodontitis stage", "cal", "bone loss", "gingivitis"]),
        ("Perio-Etiology-Microbiology", ["red complex", "p. gingivalis", "orange complex", "a. actinomycetemcomitans", "plaque", "biofilm", "lps", "mmp", "pathogenesis"]),
        ("Perio-Examination-Indices", ["probing depth", "pd", "cal", "furcation", "nabers", "mobility", "miller", "bop", "bleeding on probing"]),
        ("Perio-Non-Surgical-Instrumentation", ["gracey", "curette", "scaler", "srp", "ขูดหินน้ำลาย", "ultrasonic", "root planing", "long junctional epithelium"]),
        ("Perio-Biologic-Width-Crown-Lengthening", ["biologic width", "supracrestal tissue", "crown lengthening", "cls", "ตัดเหงือกเพิ่มความยาว", "ostectomy", "osteoplasty"]),
        ("Perio-Periodontal-Surgery-Flaps", ["gingivectomy", "flap surgery", "modified widman", "full thickness", "partial thickness", "แผ่นเหงือก"]),
        ("Perio-Regeneration-GTR", ["gtr", "guided tissue regeneration", "bone graft", "emdogain", "emd", "infrabony defect", "3-wall"]),
        ("Perio-Mucogingival-Root-Coverage", ["fgg", "sctg", "root coverage", "เหงือกร่น", "free gingival graft", "connective tissue graft", "cairo", "miller class"]),
        ("Perio-Drug-Induced-Enlargement", ["digo", "เหงือกโต", "phenytoin", "nifedipine", "amlodipine", "cyclosporine", "gingival overgrowth"]),
        ("Perio-Acute-Conditions-Abscess", ["periodontal abscess", "periapical abscess", "nug", "nup", "necrotizing", "ฝีปริทันต์"])
    ],
    "ทันตกรรมบูรณะ/หัตถการ": [
        ("Operative-Cariology-Pathology", ["caries", "ฟันผุ", "icdas", "cambra", "infected dentin", "affected dentin", "enamel caries", "demineralization"]),
        ("Operative-Adhesive-Systems", ["etch-and-rinse", "self-etch", "universal adhesive", "10-mdp", "hybrid layer", "phosphoric acid", "mmp"]),
        ("Operative-Composite-Resins", ["composite", "เรซินคอมโพสิต", "c-factor", "camphorquinone", "photoinitiator", "filler", "shrinkage", "bulk-fill", "curing"]),
        ("Operative-Dental-Amalgam", ["amalgam", "อมัลกัม", "gamma", "sn8hg", "high-copper", "trituration", "gv black", "cavity prep"]),
        ("Operative-GIC-RMGIC", ["gic", "glass ionomer", "rmgic", "fluoroaluminosilicate", "polyacrylic acid", "chemical adhesion", "chelation", "fluoride release"]),
        ("Operative-Pulp-Protection-Deep-Caries", ["rdt", "remaining dentin", "pulp protection", "indirect pulp capping", "selective caries", "stepwise", "liner", "base", "biodentine"]),
        ("Operative-NCCL-Hypersensitivity", ["nccl", "abfraction", "abrasion", "erosion", "hypersensitivity", "เสียวฟัน", "hydrodynamic", "tubule"]),
        ("Operative-Bleaching-Esthetics", ["bleaching", "ฟอกสีฟัน", "carbamide peroxide", "hydrogen peroxide", "post-bleaching bonding delay", "walking bleach"])
    ],
    "ทันตกรรมสำหรับเด็ก": [
        ("Pedia-Behavior-Guidance", ["frankl", "พฤติกรรมเด็ก", "tsd", "voice control", "nitrous oxide", "laughing gas", "papoose board", "protective stabilization"]),
        ("Pedia-Primary-Pulp-Therapy", ["pulpotomy", "pulpectomy", "primary tooth", "ฟันน้ำนม", "formocresol", "ferric sulfate", "mta", "dpc ห้ามทำ"]),
        ("Pedia-Young-Permanent-Teeth", ["young permanent", "apexogenesis", "cvek", "apexification", "immature", "ฟันแท้ปลายรากเปิด"]),
        ("Pedia-Space-Maintenance", ["space maintainer", "band and loop", "distal shoe", "nance", "llha", "lower lingual", "primate space", "leeway space"]),
        ("Pedia-Dental-Traumatology", ["trauma ฟันน้ำนม", "intrusion", "avulsion", "replantation", "iadt", "ห้ามปลูกฟันน้ำนมกลับ"]),
        ("Pedia-Fluoride-Pharmacology-Toxicity", ["fluoride", "ฟลูออไรด์", "varnish", "sdf", "apf", "systemic fluoride", "ptd", "fluorosis"]),
        ("Pedia-Restorative-Techniques", ["ssc", "stainless steel crown", "ครอบฟันสแตนเลส", "hall technique", "strip crown", "crimping"]),
        ("Pedia-Local-Anesthesia-Dosage", ["ขนาดยาชาเด็ก", "mrd เด็ก", "mepivacaine เด็ก", "lidocaine เด็ก", "กัดปาก"])
    ],
    "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก": [
        ("OralMed-Premalignant-Malignancy", ["opmd", "leukoplakia", "erythroplakia", "oscc", "มะเร็งช่องปาก", "lichen planus", "olp", "wickham", "dysplasia"]),
        ("OralMed-Odontogenic-Cysts-Tumors", ["okc", "odontogenic keratocyst", "gorlin", "ameloblastoma", "dentigerous", "radicular cyst", "ถุงน้ำ"]),
        ("OralMed-Vesiculobullous-Ulcers", ["ras", "แผลร้อนใน", "aphthous", "herpes", "hsv", "zoster", "pemphigus", "pemphigoid", "nikolsky", "dif"]),
        ("OralMed-Salivary-Gland-Pathology", ["mucocele", "ranula", "sialolith", "wharton", "sjogren", "pleomorphic", "mucoepidermoid", "ต่อมน้ำลาย"]),
        ("OralMed-Oral-Radiology-Physics", ["radiology", "x-ray", "panoramic", "paralleling", "bisecting", "ghost image", "stafne", "pcod", "alara"]),
        ("OralMed-Medically-Compromised-CVD", ["infective endocarditis", "ie prophylaxis", "amoxicillin 2g", "hypertension", "ความดันโลหิตสูง", "โรคหัวใจ"]),
        ("OralMed-Medically-Compromised-Bleeding", ["warfarin", "inr", "aspirin", "clopidogrel", "doac", "เลือดหยุดยาก", "เกล็ดเลือด"]),
        ("OralMed-Medically-Compromised-Endo-Renal", ["diabetes", "เบาหวาน", "hba1c", "hemodialysis", "ไตวาย", "adrenal", "corticosteroid"])
    ],
    "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า": [
        ("TMD-DC-TMD-Diagnostic-Criteria", ["dc/tmd", "myalgia", "myofascial pain", "ddwr", "ddwor", "disc displacement", "clicking", "crepitus", "เสียงคลิก", "ขากรรไกรค้าง"]),
        ("TMD-Masticatory-Muscle-Anatomy", ["lateral pterygoid", "กล้ามเนื้อบดเคี้ยว", "masseter", "temporalis", "medial pterygoid", "superior head"]),
        ("TMD-Mandibular-Kinetics-Posselt", ["posselt", "envelope of motion", "bennett", "centric relation", "cr-co slide", "movement"]),
        ("TMD-Occlusal-Schemes-Splints", ["splint", "stabilization splint", "anterior repositioning", "เฝือกสบฟัน", "canine guidance", "group function"]),
        ("TMD-Orofacial-Pain-Neuropathic", ["trigeminal neuralgia", "neuropathic pain", "ปวดใบหน้า", "burning mouth", "central sensitization"])
    ],
    "ทันตกรรมจัดฟัน": [
        ("Ortho-Craniofacial-Growth", ["scammon", "growth curve", "synchondrosis", "spheno-occipital", "growth rotation", "การเจริญเติบโตใบหน้า"]),
        ("Ortho-Cephalometric-Analysis", ["cephalometric", "sna", "snb", "anb", "fma", "impa", "wits", "class ii", "class iii", "ภาพรังสีจัดฟัน"]),
        ("Ortho-Biomechanics-Tooth-Movement", ["center of resistance", "center of rotation", "tipping", "translation", "torque", "moment", "resorption"]),
        ("Ortho-Anchorage-TADs", ["anchorage", "หลักยึด", "tad", "miniscrew", "skeletal anchorage"]),
        ("Ortho-Space-Analysis-Appliances", ["moyers", "tanaka", "bolton", "removable appliance", "เครื่องมือจัดฟัน", "twin block", "expansion"]),
        ("Ortho-Retention-Relapse", ["retention", "relapse", "supracrestal", "pericision", "retainer", "hawley", "การคืนกลับ"])
    ],
    "ทันตกรรมชุมชน": [
        ("Community-Epidemiological-Indices", ["dmft", "dmfs", "cpi", "cpitn", "dean's fluorosis", "ohi-s", "ดัชนีทางทันตสาธารณสุข"]),
        ("Community-Biostatistics-Diagnostic-Tests", ["sensitivity", "specificity", "ppv", "npv", "odds ratio", "relative risk", "or", "rr"]),
        ("Community-Study-Designs-Hypothesis", ["cross-sectional", "case-control", "cohort", "rct", "t-test", "anova", "chi-square", "สถิติ"]),
        ("Community-Health-Promotion-Ottawa", ["ottawa charter", "health promotion", "การสร้างเสริมสุขภาพ", "primary prevention", "leavell and clark"]),
        ("Community-Health-Systems-Insurance", ["บัตรทอง", "ประกันสังคม", "ข้าราชการ", "ucs", "sss", "csmbs", "ระบบหลักประกันสุขภาพ"]),
        ("Community-Infection-Control-Sterilization", ["infection control", "autoclave", "spaulding", "g. stearothermophilus", "b. atrophaeus", "pep", "ขยะติดเชื้อ"])
    ],
    "กฎหมายและจรรยาบรรณ": [
        ("Law-Dental-Profession-Act", ["พรบ. วิชาชีพทันตกรรม", "พ.ร.บ. วิชาชีพทันตกรรม", "มาตรา 28", "มาตรา 50", "มาตรา 39", "หมอเถื่อน", "ขอบเขตวิชาชีพทันตกรรม"]),
        ("Law-Dental-Nurses-MOPH-Scope", ["ทันตาภิบาล", "ข้อ 4.3", "4.3.3", "ลายลักษณ์อักษร", "ระเบียบกระทรวงสาธารณสุข", "ผู้ช่วยทันตแพทย์"]),
        ("Law-Sanatorium-Act", ["พรบ. สถานพยาบาล", "พ.ร.บ. สถานพยาบาล", "ผู้ดำเนินการ", "ผู้รับอนุญาต", "มาตรา 38", "โฆษณาคลินิก", "อายุใบอนุญาตสถานพยาบาล"]),
        ("Law-Ethics-Code-Advertising", ["จรรยาบรรณ", "ข้อบังคับทันตแพทยสภา", "before-after", "ความลับผู้ป่วย", "ทับถม", "การโฆษณาโอ้อวด"]),
        ("Law-Health-Acts-PDPA-Consent", ["living will", "มาตรา 12", "พรบ. สุขภาพแห่งชาติ", "pdpa", "ข้อมูลสุขภาพ", "informed consent", "ความยินยอม"]),
        ("Law-Forensic-Odontology-DVI", ["dvi", "interpol", "พิสูจน์เอกลักษณ์", "gustafson", "demirjian", "อายุฟัน", "รอยกัด", "bite mark", "นิติทันต"])
    ]
}

def classify_topic(cat, text):
    rules = TOPIC_RULES.get(cat, [])
    text_lower = text.lower()
    
    # Priority matching
    best_topic = None
    best_score = 0
    
    for topic_name, keywords in rules:
        score = sum(1 for kw in keywords if kw.lower() in text_lower)
        if score > best_score:
            best_score = score
            best_topic = topic_name
            
    if not best_topic and rules:
        best_topic = rules[0][0] # Fallback to first major topic of the specialty
    elif not best_topic:
        best_topic = f"{cat}-General"
        
    return best_topic

def classify_cognitive_level(task, stem, prop, qtext, cat):
    q_str = f"{stem or ''} {prop or ''} {qtext or ''}"
    q_lower = q_str.lower()
    
    has_patient = any(w in q_lower for w in ['ผู้ป่วย', 'คนไข้', 'เด็กชาย', 'เด็กหญิง', 'หญิงอายุ', 'ชายอายุ', ' pt ', ' case ', ' chief complaint', 'มารับการรักษา', 'มาด้วยอาการ', 'ตรวจพบ'])
    has_exam_data = any(w in q_lower for w in ['ภาพรังสี', 'x-ray', 'radiograph', 'periapical', 'คลินิก', 'อาการ', 'บวม', 'เจ็บ', 'ปวด', 'เคาะ', 'โยก', 'vitality', 'wbc', 'inr', 'ผลตรวจ', 'ภาพถ่าย', 'รอยโรค'])
    has_management = any(w in q_lower for w in ['การรักษาที่เหมาะสม', 'การจัดการที่เหมาะสม', 'ขั้นตอนแรก', 'ควรทำสิ่งใดต่อไป', 'การวินิจฉัยที่ถูกต้อง', 'next step', 'management', 'plan', 'การรักษาลำดับแรก', 'ควรเลือกวิธีใดในการรักษา'])
    
    # 1. Problem Solving (P): Full clinical vignette with patient + exam/decision, or complex treatment planning
    if has_patient and (has_exam_data or has_management) and len(q_str) >= 50:
        return 'P'
    elif task == 'การจัดการและการรักษาผู้ป่วย' and (has_patient or has_management):
        return 'P'
    # 2. Recall (R): Foundational knowledge, definitions, microbiology, disease mechanisms, statutes
    elif task in ['การเกิดและการดำเนินโรค', 'การสร้างเสริมสุขภาพและการป้องกัน'] and not has_patient:
        return 'R'
    elif cat == 'กฎหมายและจรรยาบรรณ' and not has_patient:
        return 'R'
    elif not has_patient and any(w in q_lower for w in ['คืออะไร', 'หมายถึง', 'ข้อใดคือ', 'หน้าที่ของ', 'ข้อใดไม่ใช่', 'ข้อใดถูกต้อง', 'เชื้อ', 'สาร', 'เครื่องมือ', 'สูตร', 'นิยาม', 'กี่ปี', 'กี่วัน']):
        return 'R'
    # 3. Application (A): Applied dental procedures, materials, specific rules
    else:
        return 'A'

def main():
    print("Connecting to local SQLite database...")
    db_path = "data/exam_bank.db"
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    
    cur.execute("SELECT id, category, task, stem, proposition, question_text, explanation FROM questions")
    rows = cur.fetchall()
    total_q = len(rows)
    print(f"Loaded {total_q} questions.")
    
    updates = []
    cog_stats = {"R": 0, "A": 0, "P": 0}
    topic_stats = {}
    
    for row in rows:
        qid, cat, task, stem, prop, qtext, expl_raw = row
        
        # Combine explanation text for deep keyword matching
        expl_text = ""
        if expl_raw:
            try:
                expl_obj = json.loads(expl_raw)
                expl_text = f"{expl_obj.get('core_principle', '')} {expl_obj.get('key_takeaway', '')} {expl_obj.get('clinical_pearl', '')}"
            except:
                expl_text = str(expl_raw)
                
        full_text_for_topic = f"{stem or ''} {prop or ''} {qtext or ''} {expl_text}"
        topic = classify_topic(cat, full_text_for_topic)
        cog = classify_cognitive_level(task, stem, prop, qtext, cat)
        
        updates.append((cog, topic, qid))
        cog_stats[cog] += 1
        topic_stats[topic] = topic_stats.get(topic, 0) + 1
        
    print("\nApplying updates to SQLite...")
    cur.executemany("UPDATE questions SET cognitive_level = ?, must_know_topic = ? WHERE id = ?", updates)
    conn.commit()
    conn.close()
    print("SQLite update complete!")
    
    print("\n=== CLASSIFICATION SUMMARY ===")
    print("Cognitive Level Distribution:")
    for k, v in cog_stats.items():
        pct = v / total_q * 100
        target_pct = {"R": 17.3, "A": 29.7, "P": 53.0}[k]
        print(f"  {k}: {v:4d} ({pct:5.1f}%) | Target: {target_pct:5.1f}%")
        
    print(f"\nUnique Must Know Topics classified: {len(topic_stats)}")
    print("Top 15 Must Know Topics in Exam Bank:")
    for t, c in sorted(topic_stats.items(), key=lambda x: -x[1])[:15]:
        print(f"  {t:38s}: {c:3d} questions")
        
    # Sync to Supabase PostgreSQL
    print("\nSyncing updates to Supabase PostgreSQL...")
    conn_str = "postgresql://postgres.fgexylhuyaaedmtnplra:HuBAfgLaZ5IGeqpm@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require"
    try:
        with psycopg.connect(conn_str, prepare_threshold=None) as pg_conn:
            with pg_conn.cursor() as pg_cur:
                pg_cur.executemany("UPDATE questions SET cognitive_level = %s, must_know_topic = %s WHERE id = %s", updates)
                pg_conn.commit()
        print("Supabase sync completed successfully!")
    except Exception as e:
        print(f"Error syncing to Supabase: {e}")

if __name__ == "__main__":
    main()
