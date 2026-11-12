import json
import re
from typing import Dict, List, Optional, Any
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, selectinload

import models
from database import get_db

router = APIRouter(prefix="/api/learning", tags=["learning"])

# ─────────────────────────────────────────────────────────────────────────────
# 1. ALL 83 MUST-KNOW TOPICS PEDAGOGICAL METADATA (THAI & ENGLISH)
# ─────────────────────────────────────────────────────────────────────────────
TOPIC_METADATA: Dict[str, Dict[str, str]] = {
    # วิทยาเอ็นโดดอนต์ (Endodontics)
    "Endo-Pulp-Periapical-Diagnosis": {
        "title_th": "การวินิจฉัยโรคของโพรงประสาทฟันและเนื้อเยื่อรอบปลายราก",
        "title_en": "Pulpal & Periapical Diagnosis (AAE Consensus Terminology)",
    },
    "Endo-Instrumentation-Obturation": {
        "title_th": "การขยายและอุดคลองรากฟันด้วยวัสดุชีวภาพ",
        "title_en": "Root Canal Instrumentation & Obturation Principles",
    },
    "Endo-Complications-Fractures": {
        "title_th": "ภาวะแทรกซ้อนทางเอ็นโดดอนต์และรากฟันแตกร้าว",
        "title_en": "Procedural Accidents, Perforations & Vertical Root Fractures",
    },
    "Endo-Vital-Pulp-Therapy": {
        "title_th": "การบำบัดรักษาโพรงประสาทฟันที่มีชีวิต (VPT)",
        "title_en": "Vital Pulp Therapy (IPC, DPC & Cvek Pulpotomy)",
    },
    "Endo-Resorption": {
        "title_th": "การละลายตัวของรากฟันภายในและภายนอก",
        "title_en": "Internal & External Root Resorption Pathophysiology",
    },
    "Endo-Canal-Anatomy-Access": {
        "title_th": "กายวิภาคคลองรากฟันและการกรอเปิดทางเข้า",
        "title_en": "Root Canal Morphology & Access Cavity Preparation",
    },
    "Endo-Open-Apex-Management": {
        "title_th": "การจัดการฟันแท้ปลายรากเปิดและการเหนี่ยวนำปลายราก",
        "title_en": "Apexogenesis, Apexification & Regenerative Endodontics",
    },
    "Endo-Microbiology-Infection": {
        "title_th": "จุลชีววิทยาในคลองรากฟันและการติดเชื้อซ้ำ",
        "title_en": "Endodontic Microbiology, Biofilms & E. faecalis",
    },
    "Endo-Pulp-Biology-Neurophysiology": {
        "title_th": "ชีววิทยาโพรงประสาทฟันและสรีรวิทยาความเจ็บปวด",
        "title_en": "Dentin-Pulp Complex Biology & Pain Neurophysiology (A-delta vs C)",
    },
    "Endo-Irrigants-Intracanal-Medication": {
        "title_th": "สารล้างคลองรากฟันและยาใส่ในคลองรากฟัน",
        "title_en": "Irrigant Chemistry (NaOCl, EDTA, CHX) & Intracanal Medicaments",
    },

    # ศัลยศาสตร์ช่องปาก (OMFS)
    "OMFS-Local-Anesthesia-Pharmacology": {
        "title_th": "เภสัชวิทยาของยาชาเฉพาะที่และการคำนวณขนาดยาสูงสุด (MRD)",
        "title_en": "Local Anesthetic Pharmacology, pKa & Maximum Recommended Dose",
    },
    "OMFS-Exodontia-Biomechanics": {
        "title_th": "ชีวกลศาสตร์การถอนฟัน เครื่องมือศัลยกรรม และการหายของแผล",
        "title_en": "Principles of Exodontia, Forceps/Elevators & Socket Healing",
    },
    "OMFS-Impacted-Teeth": {
        "title_th": "การจำแนกและการผ่าตัดฟันคุด",
        "title_en": "Impacted Teeth Classification (Pell & Gregory / Winter) & Surgery",
    },
    "OMFS-Anesthesia-Techniques": {
        "title_th": "เทคนิคการฉีดยาชาสกัดกั้นประสาทและภาวะแทรกซ้อน",
        "title_en": "Nerve Block Techniques (IANB, PSA, MSA, Gow-Gates) & Complications",
    },
    "OMFS-Fascial-Space-Infections": {
        "title_th": "การติดเชื้อในช่องว่างใบหน้าลำคอและภาวะ Ludwig's Angina",
        "title_en": "Odontogenic Fascial Space Infections & Ludwig's Angina",
    },
    "OMFS-Medical-Emergencies": {
        "title_th": "การจัดการภาวะฉุกเฉินทางการแพทย์ในคลินิกทันตกรรม",
        "title_en": "Medical Emergencies (Syncope, Anaphylaxis, Angina, LAST)",
    },
    "OMFS-Oroantral-Communication": {
        "title_th": "รูทะลุช่องปาก-โพรงอากาศข้างจมูกและการผ่าตัดปิดแผ่นเหงือก",
        "title_en": "Oroantral Communication (OAC), Fistula & Flap Closure",
    },
    "OMFS-Bone-Pathology-Necrosis": {
        "title_th": "ภาวะกระดูกขากรรไกรตายจากยาและรังสีรักษา (MRONJ & ORN)",
        "title_en": "Medication-Related Osteonecrosis of the Jaw (MRONJ) & ORN",
    },
    "OMFS-Maxillofacial-Trauma": {
        "title_th": "การบาดเจ็บและกระดูกใบหน้าขากรรไกรหัก",
        "title_en": "Maxillofacial Trauma, Mandibular & Le Fort Fractures",
    },

    # ปริทันตวิทยา (Periodontology)
    "Perio-Classification-2017": {
        "title_th": "ระบบจำแนกโรคปริทันต์และเนื้อเยื่อรอบรากเทียม 2017 (Staging & Grading)",
        "title_en": "2017 AAP/EFP World Workshop Classification of Periodontal Diseases",
    },
    "Perio-Examination-Indices": {
        "title_th": "การตรวจประเมินสภาวะปริทันต์ ค่า CAL และพยากรณ์โรค",
        "title_en": "Periodontal Probing, Clinical Attachment Loss (CAL) & Prognosis",
    },
    "Perio-Etiology-Microbiology": {
        "title_th": "คราบจุลินทรีย์ แบคทีเรียก่อโรคปริทันต์ และภูมิคุ้มกัน",
        "title_en": "Dental Biofilm, Socransky's Red Complex & Host Immune Response",
    },
    "Perio-Non-Surgical-Instrumentation": {
        "title_th": "การขูดหินน้ำลาย เกลารากฟัน และเครื่องมือปริทันต์ (Gracey Curettes)",
        "title_en": "Scaling, Root Planing & Periodontal Instrumentation Principles",
    },
    "Perio-Drug-Induced-Enlargement": {
        "title_th": "ภาวะเหงือกโตจากยาและโรคทางระบบ",
        "title_en": "Drug-Induced Gingival Enlargement (Phenytoin, CCBs, Cyclosporine)",
    },
    "Perio-Mucogingival-Root-Coverage": {
        "title_th": "ศัลยกรรมเหงือกและเยื่อเมือกและการปลูกถ่ายเนื้อเยื่อปิดรากฟัน",
        "title_en": "Mucogingival Defects (Cairo/Miller) & Connective Tissue Grafting",
    },
    "Perio-Biologic-Width-Crown-Lengthening": {
        "title_th": "ระยะความกว้างทางชีวภาพและการผ่าตัดเพิ่มความยาวตัวฟัน",
        "title_en": "Supracrestal Tissue Attachment (Biologic Width) & Crown Lengthening",
    },
    "Perio-Acute-Conditions-Abscess": {
        "title_th": "ภาวะเฉียบพลันทางปริทันต์ ฝีปริทันต์ และโรคเหงือกเนื้อตาย (NUG/NUP)",
        "title_en": "Periodontal Abscess, Necrotizing Periodontal Diseases & Endo-Perio",
    },
    "Perio-Regeneration-GTR": {
        "title_th": "การเหนี่ยวนำเนื้อเยื่อปริทันต์ใหม่และการปลูกกระดูก (GTR)",
        "title_en": "Guided Tissue Regeneration (GTR), Intrabony Defects & Bone Grafts",
    },
    "Perio-Periodontal-Surgery-Flaps": {
        "title_th": "หลักการผ่าตัดเปิดแผ่นเหงือกและศัลยกรรมกระดูกปริทันต์",
        "title_en": "Periodontal Flap Designs, Modified Widman & Osseous Surgery",
    },

    # ทันตกรรมบูรณะ/หัตถการ (Operative Dentistry)
    "Operative-Cariology-Pathology": {
        "title_th": "วิทยาโรคฟันผุ กระบวนการสูญเสียและคืนแร่ธาตุ และการประเมินความเสี่ยง",
        "title_en": "Cariology, Demineralization-Remineralization & Caries Management",
    },
    "Operative-Composite-Resins": {
        "title_th": "วัสดุเรซินคอมโพสิต ปัจจัย C-Factor และการฉายแสงบ่มตัว",
        "title_en": "Composite Resin Chemistry, C-Factor, Shrinkage Stress & Light Curing",
    },
    "Operative-Dental-Amalgam": {
        "title_th": "วัสดุอมัลกัมทางทันตกรรมและการเตรียมโพรงฟันแบบดั้งเดิม",
        "title_en": "Dental Amalgam Metallurgy, Creep, Zinc & Cavity Preparation",
    },
    "Operative-GIC-RMGIC": {
        "title_th": "วัสดุกลาสไอโอโนเมอร์ซิเมนต์และการยึดติดทางเคมี",
        "title_en": "Glass Ionomer Cement (GIC) & RMGIC Acid-Base Adhesion & Fluoride",
    },
    "Operative-NCCL-Hypersensitivity": {
        "title_th": "รอยโรคคอฟันสึกไร้รอยผุ (NCCLs) และภาวะเสียวฟันเนื้อฟัน",
        "title_en": "Non-Carious Cervical Lesions (Abfraction, Abrasion, Erosion) & Hypersensitivity",
    },
    "Operative-Adhesive-Systems": {
        "title_th": "ระบบสารยึดติดทางทันตกรรม ชั้นลูกผสม และโมโนเมอร์ 10-MDP",
        "title_en": "Dental Adhesive Systems (Etch-and-Rinse, Self-Etch, Universal 10-MDP)",
    },
    "Operative-Pulp-Protection-Deep-Caries": {
        "title_th": "การปกป้องโพรงประสาทฟัน ความหนาเนื้อฟันที่เหลือ (RDT) และการกรอผุเชิงอนุรักษ์",
        "title_en": "Remaining Dentin Thickness (RDT), Liners/Bases & Selective Caries Removal",
    },
    "Operative-Bleaching-Esthetics": {
        "title_th": "การฟอกสีฟัน กลไกออกซิเดชัน และทันตกรรมเพื่อความสวยงาม",
        "title_en": "Vital & Non-Vital Tooth Bleaching, Free Radical Inhibition & Veneers",
    },

    # ทันตกรรมประดิษฐ์ (Prosthodontics)
    "Pros-Jaw-Relations-Occlusion": {
        "title_th": "ความสัมพันธ์ของขากรรไกร มิติแนวดิ่ง (VDO/VDR) และการสบฟันเทียม",
        "title_en": "Maxillomandibular Relations (CR, MI, VDO, Freeway Space) & Occlusion",
    },
    "Pros-Complete-Denture-Anatomy": {
        "title_th": "กายวิภาคศาสตร์ช่องปากสำหรับฟันเทียมทั้งปากและพื้นที่รับแรงบดเคี้ยว",
        "title_en": "Complete Denture Anatomical Landmarks, Stress-Bearing & Relief Areas",
    },
    "Pros-RPD-Classification-Surveying": {
        "title_th": "การจำแนกประเภทฟันเทียมบางส่วนถอดได้ (Kennedy) และการสำรวจแนวใส่",
        "title_en": "Kennedy Classification, Applegate's Rules & Dental Cast Surveying",
    },
    "Pros-Fixed-Tooth-Preparation": {
        "title_th": "ชีวกลศาสตร์การกรอฟันหลักสำหรับครอบฟันและสะพานฟัน",
        "title_en": "Fixed Prosthodontic Tooth Preparation, TOC, Retention & Finish Lines",
    },
    "Pros-Fixed-Provisional-Impression": {
        "title_th": "การแยกเหงือก วัสดุพิมพ์ปากความละเอียดสูง และครอบฟันชั่วคราว",
        "title_en": "Tissue Management, Elastomeric Impression Materials & Provisionals",
    },
    "Pros-Dental-Implants": {
        "title_th": "ทันตกรรมรากเทียม การยึดติดกับกระดูก และการออกแบบฟันเทียมบนรากเทียม",
        "title_en": "Osseointegration, Implant Biomechanics & Prosthetic Restoration",
    },
    "Pros-RPD-Components-Biomechanics": {
        "title_th": "ชีวกลศาสตร์โครงสร้าง RPD ระบบตะขอ RPI และแถบเชื่อมใหญ่",
        "title_en": "RPD Biomechanics, Lever Systems, RPI Clasp & Major/Indirect Retainers",
    },
    "Pros-Pontic-Design": {
        "title_th": "การออกแบบฟันลอย (Pontic Design) และหลักการรับแรงของสะพานฟัน (Ante's Law)",
        "title_en": "Pontic Design Selection (Ovate, Modified Ridge Lap, Hygienic) & Ante's Law",
    },
    "Pros-Fixed-Cements-Post-Core": {
        "title_th": "การบูรณะเดือยฟันและแกนฟัน ปรากฏการณ์ปลอกรัด (Ferrule) และซิเมนต์ยึด",
        "title_en": "Post-and-Core Restoration, Ferrule Effect (1.5-2mm) & Luting Cements",
    },

    # ทันตกรรมสำหรับเด็ก (Pediatric Dentistry)
    "Pedia-Primary-Pulp-Therapy": {
        "title_th": "การบำบัดรักษาโพรงประสาทฟันน้ำนม (IPC, Pulpotomy, Pulpectomy)",
        "title_en": "Pulp Therapy in Primary Teeth & Stainless Steel Crowns",
    },
    "Pedia-Behavior-Guidance": {
        "title_th": "การประเมินและจัดการพฤติกรรมเด็กในคลินิกทันตกรรม",
        "title_en": "Pediatric Behavior Classification (Frankl) & Non-Pharmacologic Guidance",
    },
    "Pedia-Fluoride-Pharmacology-Toxicity": {
        "title_th": "เภสัชวิทยาของฟลูออไรด์ ขนาดยาเสริม และพิษวิทยาเฉียบพลัน (PTD)",
        "title_en": "Fluoride Therapy, Systemic Supplementation & Probable Toxic Dose (5 mg/kg)",
    },
    "Pedia-Space-Maintenance": {
        "title_th": "การจัดการช่องว่างในชุดฟันผสมและเครื่องมือกันที่ฟัน (Space Maintainers)",
        "title_en": "Primate/Leeway Spaces & Space Maintainers (Band & Loop, Distal Shoe, LLHA)",
    },
    "Pedia-Restorative-Techniques": {
        "title_th": "การบูรณะฟันน้ำนม ครอบฟันโลหะไร้สนิม (SSC) และการเคลือบหลุมร่องฟัน",
        "title_en": "Pediatric Restorative Dentistry, Hall Technique SSC & Pit/Fissure Sealants",
    },
    "Pedia-Dental-Traumatology": {
        "title_th": "การจัดการอุบัติเหตุต่อฟันน้ำนมและฟันแท้ตามเกณฑ์ IADT",
        "title_en": "Pediatric Dental Traumatology (Intrusion, Luxation & Avulsion Guidelines)",
    },
    "Pedia-Young-Permanent-Teeth": {
        "title_th": "การดูแลฟันแท้ซี่แรกขึ้นผิดที่ (Ectopic Eruption) และภาวะ MIH",
        "title_en": "Young Permanent Dentition, Ectopic Eruption & Molar-Incisor Hypomineralization",
    },

    # วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก (Oral Diagnosis & Medicine)
    "OralMed-Premalignant-Malignancy": {
        "title_th": "รอยโรคก่อนมะเร็ง (OPMDs) มะเร็งช่องปาก และการตรวจชิ้นเนื้อ",
        "title_en": "Oral Potentially Malignant Disorders (Leukoplakia, Erythroplakia, OLP) & OSCC",
    },
    "OralMed-Oral-Radiology-Physics": {
        "title_th": "ฟิสิกส์รังสีวิทยาช่องปาก การควบคุมคุณภาพภาพ และการป้องกันอันตรายจากรังสี",
        "title_en": "Oral Radiology Physics, Projection Geometry (SLOB Rule) & Radiation Dosimetry",
    },
    "OralMed-Vesiculobullous-Ulcers": {
        "title_th": "รอยโรคแผลถลอกและตุ่มพองจากภูมิคุ้มกันและการติดเชื้อไวรัสในช่องปาก",
        "title_en": "Vesiculobullous, Autoimmune Ulcerative & Viral Oral Lesions (Pemphigus, HSV)",
    },
    "OralMed-Medically-Compromised-Endo-Renal": {
        "title_th": "การจัดการผู้ป่วยโรคเบาหวาน ต่อมไทรอยด์ ไตวาย และภาวะกดภูมิคุ้มกัน/สเตียรอยด์",
        "title_en": "Dental Management of Endocrine (DM, Thyroid, Adrenal) & Renal Disease",
    },
    "OralMed-Salivary-Gland-Pathology": {
        "title_th": "พยาธิวิทยาของต่อมน้ำลาย ถุงน้ำเมือก เนื้องอกต่อมน้ำลาย และภาวะปากแห้ง",
        "title_en": "Salivary Gland Pathology (Mucocele, Sialolithiasis, Sjögren's, Pleomorphic Adenoma)",
    },
    "OralMed-Odontogenic-Cysts-Tumors": {
        "title_th": "ถุงน้ำและเนื้องอกที่มีกำเนิดจากเนื้อเยื่อสร้างฟัน (OKC, Dentigerous, Ameloblastoma)",
        "title_en": "Odontogenic Cysts & Tumors Pathogenesis, Radiology & Histopathology",
    },
    "OralMed-Medically-Compromised-Bleeding": {
        "title_th": "ความผิดปกติของการแข็งตัวของเลือด ยาต้านการแข็งตัวของเลือด และโลหิตวิทยา",
        "title_en": "Hemostasis Disorders, Anticoagulants (Warfarin INR) & Antiplatelet Management",
    },
    "OralMed-Medically-Compromised-CVD": {
        "title_th": "การดูแลผู้ป่วยโรคหัวใจและหลอดเลือด และเกณฑ์ป้องกันเยื่อบุหัวใจอักเสบ (AHA 2021)",
        "title_en": "Cardiovascular Disease Management & AHA 2021 Infective Endocarditis Prophylaxis",
    },

    # ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า (Occlusion & TMD)
    "TMD-DC-TMD-Diagnostic-Criteria": {
        "title_th": "เกณฑ์การตรวจวินิจฉัยความผิดปกติของข้อต่อขากรรไกรและกล้ามเนื้อบดเคี้ยว (DC/TMD)",
        "title_en": "DC/TMD Diagnostic Criteria (Myalgia, Myofascial Referral, DDwR, Closed Lock, DJD)",
    },
    "TMD-Masticatory-Muscle-Anatomy": {
        "title_th": "กายวิภาคศาสตร์และสรีรวิทยาของกล้ามเนื้อบดเคี้ยวและข้อต่อขากรรไกร (TMJ)",
        "title_en": "Functional Anatomy & Biomechanics of Masticatory Muscles & TMJ",
    },
    "TMD-Mandibular-Kinetics-Posselt": {
        "title_th": "จลนศาสตร์การเคลื่อนที่ของขากรรไกรล่างและแผนภูมิของ Posselt",
        "title_en": "Mandibular Border Movements, Posselt's Envelope of Motion & Determinants",
    },
    "TMD-Occlusal-Schemes-Splints": {
        "title_th": "รูปแบบการสบฟันตามอุดมคติและการรักษาด้วยเฝือกสบฟัน (Occlusal Splints)",
        "title_en": "Mutually Protected Occlusion, Stabilization Splint & Anterior Repositioning Splint",
    },
    "TMD-Orofacial-Pain-Neuropathic": {
        "title_th": "อาการปวดใบหน้าจากระบบประสาท (Trigeminal Neuralgia) และอาการปวดนอกระบบบดเคี้ยว",
        "title_en": "Neuropathic Orofacial Pain, Trigeminal Neuralgia & Non-Odontogenic Toothache",
    },

    # ทันตกรรมจัดฟัน (Orthodontics)
    "Ortho-Cephalometric-Analysis": {
        "title_th": "การวิเคราะห์ภาพรังสีกะโหลกศีรษะด้านข้าง (Cephalometric Analysis: SNA, SNB, ANB)",
        "title_en": "Cephalometric Landmarks, Skeletal/Dental Angles & Facial Profile Analysis",
    },
    "Ortho-Craniofacial-Growth": {
        "title_th": "การเจริญเติบโตของกะโหลกศีรษะและใบหน้า และกราฟการเติบโตของ Scammon",
        "title_en": "Craniofacial Growth Mechanisms, Scammon's Curves & Growth Modification Timing",
    },
    "Ortho-Space-Analysis-Appliances": {
        "title_th": "การวิเคราะห์ช่องว่างในแนวขากรรไกรและเครื่องมือจัดฟันชนิดถอดได้/ฟังก์ชันนัล",
        "title_en": "Mixed Dentition Space Analysis (Moyers / Tanaka-Johnston) & Functional Appliances",
    },
    "Ortho-Retention-Relapse": {
        "title_th": "การคงสภาพฟันหลังจัดฟัน (Retention) และสาเหตุของการคืนกลับ (Relapse)",
        "title_en": "Orthodontic Retention Protocols, Gingival Fiber Reorganization & Relapse",
    },
    "Ortho-Biomechanics-Tooth-Movement": {
        "title_th": "ชีวกลศาสตร์การเคลื่อนฟัน จุดศูนย์กลางความต้านทาน (Cres) และการสลายกระดูก",
        "title_en": "Biology of Tooth Movement (Frontal vs Undermining) & Moment-to-Force (M/F) Ratios",
    },
    "Ortho-Anchorage-TADs": {
        "title_th": "การควบคุมหลักยึดทางทันตกรรมจัดฟัน (Anchorage) และหมุดจัดฟันชั่วคราว (TADs)",
        "title_en": "Orthodontic Anchorage Control, Reciprocal Movement & Skeletal TADs",
    },

    # ทันตกรรมชุมชน (Community Dentistry)
    "Community-Biostatistics-Diagnostic-Tests": {
        "title_th": "ชีวสถิติคลินิก การประเมินชุดตรวจวินิจฉัย (Sensitivity, Specificity, PPV) และการติดเชื้อ",
        "title_en": "Clinical Biostatistics, Diagnostic Test Accuracy, Prevalence Effect & Sterilization",
    },
    "Community-Epidemiological-Indices": {
        "title_th": "วิทยาการระบาดและดัชนีวัดสภาวะสุขภาพช่องปาก (DMFT, CPI, Dean's Fluorosis)",
        "title_en": "Oral Epidemiology & WHO Survey Indices (DMFT/dmft, CPI, OHI-S, Dean's Index)",
    },
    "Community-Health-Promotion-Ottawa": {
        "title_th": "การสร้างเสริมสุขภาพตามกฎบัตรออตตาวา (Ottawa Charter) และระดับการป้องกันโรค",
        "title_en": "Ottawa Charter 5 Action Areas & Leavell and Clark's Levels of Prevention",
    },
    "Community-Health-Systems-Insurance": {
        "title_th": "ระบบบริการสาธารณสุข เศรษฐศาสตร์สาธารณสุข และกองทุนหลักประกันสุขภาพในไทย",
        "title_en": "Thai Health Care System, Universal Coverage (UCS, SSS, CSMBS) & Health Economics",
    },
    "Community-Study-Designs-Hypothesis": {
        "title_th": "รูปแบบการวิจัยทางคลินิก ระบาดวิทยาวิเคราะห์ (OR, RR) และการทดสอบสมมติฐาน",
        "title_en": "Epidemiological Study Designs (RCT, Cohort, Case-Control), Bias & Hypothesis Testing",
    },

    # กฎหมายและจรรยาบรรณ (Dental Law & Forensics)
    "Law-Dental-Profession-Act": {
        "title_th": "พระราชบัญญัติวิชาชีพทันตกรรม พ.ศ. 2537 และอำนาจหน้าที่ของทันตแพทยสภา",
        "title_en": "Dental Profession Act B.E. 2537 & (No. 2) B.E. 2559: Licensing & Disciplinary Procedure",
    },
    "Law-Sanatorium-Act": {
        "title_th": "พระราชบัญญัติสถานพยาบาล พ.ศ. 2541 ผู้รับอนุญาต ผู้ดำเนินการ และการโฆษณา",
        "title_en": "Sanatorium Act B.E. 2541 & B.E. 2559: Clinic Licensing, Operator & Advertising Rules",
    },
    "Law-Forensic-Odontology-DVI": {
        "title_th": "นิติทันตวิทยา การพิสูจน์เอกลักษณ์บุคคลภัยพิบัติ (INTERPOL DVI) และการประเมินอายุ",
        "title_en": "Forensic Odontology, INTERPOL DVI Primary Identifiers & Dental Age Estimation",
    },
    "Law-Ethics-Code-Advertising": {
        "title_th": "ข้อบังคับทันตแพทยสภาว่าด้วยจรรยาบรรณแห่งวิชาชีพทันตกรรม",
        "title_en": "Dental Council Code of Professional Ethics, Patient Rights & Advertising Conduct",
    },
    "Law-Dental-Nurses-MOPH-Scope": {
        "title_th": "ระเบียบกระทรวงสาธารณสุขว่าด้วยขอบเขตหน้าที่ของทันตาภิบาลและการมอบหมายงาน",
        "title_en": "MOPH Regulations on Dental Nurses Scope of Practice (Clause 4.3 & 4.3.3)",
    },
    "Law-Health-Acts-PDPA-Consent": {
        "title_th": "พ.ร.บ. สุขภาพแห่งชาติ หนังสือแสดงเจตนา (Living Will) ความลับผู้ป่วย และ PDPA",
        "title_en": "National Health Act Sec 12, Criminal Code Sec 323 Confidentiality & PDPA",
    },
}


# ─────────────────────────────────────────────────────────────────────────────
# 2. CANONICAL GOLD-STANDARD TEXTBOOKS & EVIDENCE REGISTRY
# ─────────────────────────────────────────────────────────────────────────────
CANONICAL_TEXTBOOKS = [
    {
        "id": "cohen-endodontics",
        "title": "Cohen's Pathways of the Pulp (12th ed.) & AAE Consensus",
        "specialty": "วิทยาเอ็นโดดอนต์",
        "icon": "🦷",
        "color": "#ec4899",
        "patterns": ["cohen", "pathways of the pulp", "hargreaves", "berman", "aae", "american association of endodontists", "ingle", "torabinejad"],
        "description": "ตำรามาตรฐานทองคำระดับโลกด้านวิทยาเอ็นโดดอนต์ ครอบคลุมการวินิจฉัยพัลพ์และปลายรากตามเกณฑ์ AAE, ชีววิทยาความเจ็บปวด, การบำบัดพัลพ์มีชีวิต (VPT), สารล้างคลองราก และการอุดคลองรากฟัน"
    },
    {
        "id": "hupp-omfs",
        "title": "Hupp, Ellis & Tucker: Contemporary Oral and Maxillofacial Surgery (7th ed.)",
        "specialty": "ศัลยศาสตร์ช่องปาก",
        "icon": "🔪",
        "color": "#f59e0b",
        "patterns": ["hupp", "ellis", "tucker", "contemporary oral and maxillofacial", "peterson", "fonseca", "aaoms"],
        "description": "ตำราหลักด้านศัลยศาสตร์ช่องปากและแม็กซิลโลเฟเชียล ครอบคลุมชีวกลศาสตร์การถอนฟัน, การผ่าตัดฟันคุด, การติดเชื้อ Fascial spaces & Ludwig's angina, รูทะลุไซนัส (OAC), MRONJ และกระดูกใบหน้าหัก"
    },
    {
        "id": "malamed-anesthesia-emergencies",
        "title": "Malamed's Handbook of Local Anesthesia & Medical Emergencies",
        "specialty": "ศัลยศาสตร์ช่องปาก",
        "icon": "💉",
        "color": "#f97316",
        "patterns": ["malamed", "handbook of local anesthesia", "medical emergencies in the dental office"],
        "description": "คัมภีร์เภสัชวิทยาของยาชาเฉพาะที่ (pKa, Lipid solubility, การคำนวณ MRD), เทคนิคการฉีดสกัดกั้นเส้นประสาท และการจัดการภาวะฉุกเฉินช่วยชีวิตในคลินิกทันตกรรม"
    },
    {
        "id": "carranza-lindhe-perio",
        "title": "Newman & Carranza's Clinical Periodontology (13th ed.) & AAP/EFP 2017",
        "specialty": "ปริทันตวิทยา",
        "icon": "🌿",
        "color": "#10b981",
        "patterns": ["carranza", "newman", "takei", "klokkevold", "lindhe", "lang", "caton", "2017 world workshop", "tonetti", "papapanou", "mcguire", "gargiulo"],
        "description": "ตำราอ้างอิงหลักและฉันทามติโลก AAP/EFP 2017 ครอบคลุม Staging & Grading ของโรคปริทันต์อักเสบ, จุลชีววิทยา Red Complex, ระยะชีวภาพ (Biologic width), การเกลารากฟัน และศัลยกรรมปริทันต์"
    },
    {
        "id": "sturdevant-operative",
        "title": "Sturdevant's Art and Science of Operative Dentistry & Phillips' Materials",
        "specialty": "ทันตกรรมบูรณะ/หัตถการ",
        "icon": "✨",
        "color": "#6366f1",
        "patterns": ["sturdevant", "ritter", "boushell", "summitt", "phillips", "anusavice", "shen", "rawls", "fejerskov", "kidd", "brännström"],
        "description": "ตำรามาตรฐานด้านทันตกรรมหัตถการและชีววัสดุทันตกรรม ครอบคลุมวิทยาโรคฟันผุ, ระบบสารยึดติด 10-MDP, เรซินคอมโพสิตและ C-Factor, การปกป้องพัลพ์ตามค่า RDT, GIC และอมัลกัม"
    },
    {
        "id": "prostho-zarb-mccracken-rosenstiel",
        "title": "Rosenstiel (Fixed), McCracken (RPD) & Zarb (Complete Dentures)",
        "specialty": "ทันตกรรมประดิษฐ์",
        "icon": "👑",
        "color": "#38bdf8",
        "patterns": ["rosenstiel", "shillingburg", "mccracken", "carr", "zarb", "hobkirk", "boucher", "misch", "prosthodontic"],
        "description": "3 ตำราเสาหลักแห่งทันตกรรมประดิษฐ์: ฟันเทียมติดแน่น (Rosenstiel/Shillingburg: TOC, Ferrule), ฟันเทียมบางส่วนถอดได้ (McCracken: Kennedy, RPI) และฟันเทียมทั้งปาก (Zarb: Stress-bearing areas, VDO)"
    },
    {
        "id": "pedo-mcdonald-nowak-aapd",
        "title": "McDonald & Avery's, Nowak's Pediatric Dentistry & AAPD Reference Manual",
        "specialty": "ทันตกรรมสำหรับเด็ก",
        "icon": "🧸",
        "color": "#8b5cf6",
        "patterns": ["mcdonald", "avery", "dean", "nowak", "pinkham", "casamassimo", "aapd", "american academy of pediatric dentistry"],
        "description": "ตำราและแนวทางเวชปฏิบัติ AAPD สำหรับทันตกรรมเด็ก ครอบคลุมการรักษาโพรงประสาทฟันน้ำนม, การจัดการพฤติกรรมเด็ก, เภสัชวิทยาและพิษฟลูออไรด์ (PTD 5 mg/kg), และเครื่องมือกันที่ฟัน"
    },
    {
        "id": "iadt-traumatology",
        "title": "IADT Guidelines for the Management of Traumatic Dental Injuries (2020)",
        "specialty": "ทันตกรรมสำหรับเด็ก",
        "icon": "🚑",
        "color": "#c084fc",
        "patterns": ["iadt", "international association of dental traumatology", "traumatic dental injuries", "andreasen", "bourguignon", "day pf"],
        "description": "แนวทางมาตรฐานสากล IADT 2020 สำหรับการจัดการอุบัติเหตุทางทันตกรรมทั้งในฟันน้ำนมและฟันแท้ (Avulsion, Intrusion, Luxation, Root Fracture & Flexible Splinting)"
    },
    {
        "id": "neville-oral-pathology-radiology",
        "title": "Neville's Oral and Maxillofacial Pathology (5th ed.) & White & Pharoah Radiology",
        "specialty": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
        "icon": "🔬",
        "color": "#a855f7",
        "patterns": ["neville", "damm", "allen", "oral and maxillofacial pathology", "white", "pharoah", "mallya", "oral radiology", "regezi", "woo"],
        "description": "ตำราหลักด้านพยาธิวิทยาช่องปากและรังสีวิทยา ครอบคลุมรอยโรคก่อนมะเร็ง (OPMDs), มะเร็งช่องปาก (OSCC), ถุงน้ำและเนื้องอก (OKC, Ameloblastoma), โรคเยื่อบุช่องปาก และฟิสิกส์รังสี"
    },
    {
        "id": "little-falace-burket-aha",
        "title": "Little & Falace's Medically Compromised Patient, Burket's Oral Med & AHA 2021",
        "specialty": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
        "icon": "❤️‍🩹",
        "color": "#d946ef",
        "patterns": ["little", "falace", "medically compromised", "burket", "glick", "greenberg", "wilson", "american heart association", "aha", "infective endocarditis"],
        "description": "ตำรามาตรฐานการจัดการผู้ป่วยโรคทางระบบในงานทันตกรรม (โรคหัวใจ, ความดันโลหิตสูง, เบาหวาน, ไตวาย, ยาต้านการแข็งตัวของเลือด Warfarin INR <= 3.5) และเกณฑ์ AHA 2021 (ยกเลิก Clindamycin)"
    },
    {
        "id": "okeson-dc-tmd",
        "title": "Okeson's Management of TMD and Occlusion (8th ed.) & DC/TMD Criteria",
        "specialty": "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า",
        "icon": "⚡",
        "color": "#06b6d4",
        "patterns": ["okeson", "temporomandibular", "dc/tmd", "schiffman", "dawson", "posselt", "orofacial pain"],
        "description": "ตำราหลักด้านระบบบดเคี้ยวและอาการปวดใบหน้า ครอบคลุมกายวิภาคกล้ามเนื้อบดเคี้ยว, จลนศาสตร์ Posselt, เกณฑ์วินิจฉัย DC/TMD (Myalgia, DDwR, Closed Lock, DJD) และเฝือกสบฟัน"
    },
    {
        "id": "proffit-orthodontics",
        "title": "Proffit's Contemporary Orthodontics (6th ed.)",
        "specialty": "ทันตกรรมจัดฟัน",
        "icon": "📐",
        "color": "#f472b6",
        "patterns": ["proffit", "fields", "sarver", "contemporary orthodontics", "graber", "cephalometric", "scammon", "moyers"],
        "description": "ตำรามาตรฐานโลกด้านทันตกรรมจัดฟัน ครอบคลุมการเจริญเติบโตของใบหน้าและกราฟ Scammon, การวิเคราะห์ภาพรังสี Cephalometrics, ชีวกลศาสตร์การเคลื่อนฟัน (Cres, M/F ratio) และเครื่องมือจัดฟัน"
    },
    {
        "id": "community-burt-who-cdc",
        "title": "Burt & Eklund's Community Dentistry, WHO Oral Health Surveys & CDC",
        "specialty": "ทันตกรรมชุมชน",
        "icon": "🌍",
        "color": "#059669",
        "patterns": ["burt", "eklund", "community", "world health organization", "who", "ottawa charter", "cdc", "spaulding", "infection control", "gordis", "biostatistics"],
        "description": "ตำราและมาตรฐานสากลด้านทันตสาธารณสุข ครอบคลุมชีวสถิติการแพทย์ (Sensitivity, Specificity, PPV), ดัชนีระบาดวิทยา (DMFT, CPI), กฎบัตรออตตาวา และการควบคุมการติดเชื้อตามเกณฑ์ CDC/Spaulding"
    },
    {
        "id": "thai-dental-laws-interpol",
        "title": "พ.ร.บ. วิชาชีพทันตกรรม, พ.ร.บ. สถานพยาบาล, จรรยาบรรณวิชาชีพ & INTERPOL DVI",
        "specialty": "กฎหมายและจรรยาบรรณ",
        "icon": "⚖️",
        "color": "#f43f5e",
        "patterns": ["พ.ร.บ.", "พระราชบัญญัติ", "ข้อบังคับทันตแพทยสภา", "ระเบียบกระทรวงสาธารณสุข", "จรรยาบรรณ", "interpol", "dvi", "forensic", "gustafson", "demirjian", "ประมวลกฎหมาย"],
        "description": "ประมวลกฎหมายทันตกรรมไทยและมาตรฐานนิติทันตวิทยาสากล ครอบคลุม พ.ร.บ.วิชาชีพทันตกรรม 2537/2559, พ.ร.บ.สถานพยาบาล 2541/2559, ขอบเขตทันตาภิบาล, จรรยาบรรณ และการพิสูจน์เอกลักษณ์บุคคล DVI"
    },
]


def classify_textbook(ref_str: str, category: str = "") -> Dict[str, str]:
    """Match a raw reference string to a canonical Gold-Standard Textbook."""
    if not ref_str:
        ref_str = ""
    low = ref_str.lower()
    for tb in CANONICAL_TEXTBOOKS:
        for pat in tb["patterns"]:
            if pat in low:
                return {"id": tb["id"], "title": tb["title"], "icon": tb["icon"], "color": tb["color"]}

    # Fallback by specialty category
    for tb in CANONICAL_TEXTBOOKS:
        if tb["specialty"] == category:
            return {"id": tb["id"], "title": tb["title"], "icon": tb["icon"], "color": tb["color"]}

    return {
        "id": "cohen-endodontics",
        "title": "Gold Standard Dental Textbooks & Clinical Guidelines",
        "icon": "📚",
        "color": "#6366f1",
    }


def get_topic_meta(topic_id: str, category: str = "") -> Dict[str, str]:
    if topic_id in TOPIC_METADATA:
        return TOPIC_METADATA[topic_id]
    # Humanize fallback
    clean = topic_id.replace("-", " ")
    return {
        "title_th": f"บทเรียนเจาะลึก: {clean}",
        "title_en": clean,
    }


def _parse_explanation(exp_raw: Optional[str]) -> Dict[str, Any]:
    if not exp_raw:
        return {}
    if isinstance(exp_raw, dict):
        return exp_raw
    try:
        d = json.loads(exp_raw)
        return d if isinstance(d, dict) else {"core_principle": str(exp_raw)}
    except Exception:
        return {"core_principle": str(exp_raw)}


# ─────────────────────────────────────────────────────────────────────────────
# 3. API ENDPOINTS: EXAM-DRIVEN LEARNING & TEXTBOOK PEDAGOGY
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/overview")
def get_learning_overview(db: Session = Depends(get_db)):
    """Return all 83 Must-Know Topics and Gold-Standard Textbooks extracted from the 2,443 exam questions."""
    questions = db.query(
        models.Question.id,
        models.Question.category,
        models.Question.task,
        models.Question.must_know_topic,
        models.Question.cognitive_level,
        models.Question.explanation,
        models.Question.source_exam,
    ).all()

    topics_map: Dict[str, Dict[str, Any]] = {}
    textbooks_map: Dict[str, Dict[str, Any]] = {
        tb["id"]: {
            **tb,
            "question_count": 0,
            "topics": set(),
            "sample_citations": set(),
        }
        for tb in CANONICAL_TEXTBOOKS
    }

    cog_totals = {"R": 0, "A": 0, "P": 0}

    for q in questions:
        topic_id = q.must_know_topic or "General-Clinical-Concept"
        cat = q.category or "อื่นๆ"
        cog = (q.cognitive_level or "A").strip().upper()
        if cog not in cog_totals:
            cog = "A"
        cog_totals[cog] += 1

        exp = _parse_explanation(q.explanation)
        ref_str = exp.get("reference") or exp.get("legal_citation") or ""
        tb_match = classify_textbook(ref_str, cat)
        tb_id = tb_match["id"]

        if tb_id in textbooks_map:
            textbooks_map[tb_id]["question_count"] += 1
            textbooks_map[tb_id]["topics"].add(topic_id)
            if ref_str and len(textbooks_map[tb_id]["sample_citations"]) < 6:
                textbooks_map[tb_id]["sample_citations"].add(ref_str[:140])

        if topic_id not in topics_map:
            meta = get_topic_meta(topic_id, cat)
            topics_map[topic_id] = {
                "id": topic_id,
                "title_th": meta["title_th"],
                "title_en": meta["title_en"],
                "category": cat,
                "question_count": 0,
                "cognitive_counts": {"R": 0, "A": 0, "P": 0},
                "tasks": {},
                "textbook_counts": {},
                "sample_references": [],
            }

        t_entry = topics_map[topic_id]
        t_entry["question_count"] += 1
        t_entry["cognitive_counts"][cog] = t_entry["cognitive_counts"].get(cog, 0) + 1
        if q.task:
            t_entry["tasks"][q.task] = t_entry["tasks"].get(q.task, 0) + 1
        t_entry["textbook_counts"][tb_match["title"]] = t_entry["textbook_counts"].get(tb_match["title"], 0) + 1
        if ref_str and len(t_entry["sample_references"]) < 3 and ref_str not in t_entry["sample_references"]:
            t_entry["sample_references"].append(ref_str)

    # Format topics list sorted by question_count desc
    topics_list = []
    for tid, tdata in sorted(topics_map.items(), key=lambda x: -x[1]["question_count"]):
        top_tbs = [
            {"title": k, "count": v}
            for k, v in sorted(tdata["textbook_counts"].items(), key=lambda x: -x[1])[:3]
        ]
        topics_list.append({
            "id": tdata["id"],
            "title_th": tdata["title_th"],
            "title_en": tdata["title_en"],
            "category": tdata["category"],
            "question_count": tdata["question_count"],
            "cognitive_counts": tdata["cognitive_counts"],
            "tasks": tdata["tasks"],
            "top_textbooks": top_tbs,
            "sample_references": tdata["sample_references"],
        })

    # Format textbooks list
    textbooks_list = []
    for tb_id, tb_data in textbooks_map.items():
        if tb_data["question_count"] == 0:
            continue
        topic_items = []
        for tid in sorted(tb_data["topics"]):
            if tid in topics_map:
                topic_items.append({
                    "id": tid,
                    "title_th": topics_map[tid]["title_th"],
                    "title_en": topics_map[tid]["title_en"],
                    "count": topics_map[tid]["question_count"],
                })
        topic_items.sort(key=lambda x: -x["count"])
        textbooks_list.append({
            "id": tb_data["id"],
            "title": tb_data["title"],
            "specialty": tb_data["specialty"],
            "icon": tb_data["icon"],
            "color": tb_data["color"],
            "description": tb_data["description"],
            "question_count": tb_data["question_count"],
            "topic_count": len(topic_items),
            "topics": topic_items,
            "sample_citations": list(tb_data["sample_citations"]),
        })

    textbooks_list.sort(key=lambda x: -x["question_count"])

    return {
        "summary": {
            "total_questions": len(questions),
            "total_topics": len(topics_list),
            "total_textbooks": len(textbooks_list),
            "cognitive_counts": cog_totals,
        },
        "topics": topics_list,
        "textbooks": textbooks_list,
    }


def _build_pedagogical_module(questions: List[models.Question], title_th: str, title_en: str, category: str, module_id: str) -> Dict[str, Any]:
    """Synthesize extracted exam explanations into a structured Textbook & Evidence teaching curriculum."""
    cog_counts = {"R": 0, "A": 0, "P": 0}
    citations_counter: Dict[str, Dict[str, Any]] = {}
    task_groups: Dict[str, List[Dict[str, Any]]] = {}
    pearls_list: List[Dict[str, Any]] = []
    pitfalls_list: List[Dict[str, Any]] = []
    differential_items: List[Dict[str, Any]] = []
    guided_cases: List[Dict[str, Any]] = []

    seen_principles = set()
    seen_pearls = set()
    seen_pitfalls = set()

    # Order questions pedagogically: R (Recall/Foundation) -> A (Application) -> P (Problem Solving)
    cog_order = {"R": 1, "A": 2, "P": 3}
    sorted_questions = sorted(
        questions,
        key=lambda q: (cog_order.get((q.cognitive_level or "A").strip().upper(), 2), q.id)
    )

    for q in sorted_questions:
        cog = (q.cognitive_level or "A").strip().upper()
        if cog not in cog_counts:
            cog = "A"
        cog_counts[cog] += 1

        exp = _parse_explanation(q.explanation)
        core_principle = (exp.get("core_principle") or "").strip()
        key_takeaway = (exp.get("key_takeaway") or exp.get("why_correct") or "").strip()
        common_pitfall = (exp.get("common_pitfall") or "").strip()
        clinical_pearl = (exp.get("clinical_pearl") or exp.get("future_prediction") or "").strip()
        ref_str = (exp.get("reference") or exp.get("legal_citation") or "").strip()
        choice_exps = exp.get("choice_explanations") or {}

        tb_info = classify_textbook(ref_str, q.category or category)

        # 1. Track textbook & guideline citations
        cite_key = ref_str if ref_str else tb_info["title"]
        if cite_key not in citations_counter:
            citations_counter[cite_key] = {
                "citation": cite_key,
                "textbook_id": tb_info["id"],
                "textbook_title": tb_info["title"],
                "icon": tb_info["icon"],
                "color": tb_info["color"],
                "count": 0,
            }
        citations_counter[cite_key]["count"] += 1

        # 2. Group synthesized textbook concepts by clinical task
        task_name = q.task or "หลักการทางคลินิกทั่วไป"
        if task_name not in task_groups:
            task_groups[task_name] = []

        # Deduplicate near-identical core_principle strings while keeping richest lessons
        norm_core = re.sub(r"\s+", " ", core_principle[:120]).lower()
        q_display = (q.proposition or q.question_text or q.stem or "").strip()

        if core_principle and norm_core not in seen_principles:
            seen_principles.add(norm_core)
            task_groups[task_name].append({
                "question_id": q.id,
                "source_exam": q.source_exam,
                "cognitive_level": cog,
                "task": task_name,
                "reference": ref_str or tb_info["title"],
                "textbook_title": tb_info["title"],
                "textbook_color": tb_info["color"],
                "core_principle": core_principle,
                "key_takeaway": key_takeaway,
                "clinical_pearl": clinical_pearl,
                "common_pitfall": common_pitfall,
                "question_preview": q_display[:180] + ("..." if len(q_display) > 180 else ""),
            })

        # 3. Collect unique High-Yield Clinical Pearls & Exam Pitfalls
        if clinical_pearl:
            norm_p = re.sub(r"\s+", " ", clinical_pearl[:90]).lower()
            if norm_p not in seen_pearls and len(pearls_list) < 25:
                seen_pearls.add(norm_p)
                pearls_list.append({
                    "question_id": q.id,
                    "pearl": clinical_pearl,
                    "reference": ref_str or tb_info["title"],
                    "key_takeaway": key_takeaway,
                })

        if common_pitfall:
            norm_pit = re.sub(r"\s+", " ", common_pitfall[:90]).lower()
            if norm_pit not in seen_pitfalls and len(pitfalls_list) < 25:
                seen_pitfalls.add(norm_pit)
                pitfalls_list.append({
                    "question_id": q.id,
                    "pitfall": common_pitfall,
                    "key_takeaway": key_takeaway,
                    "reference": ref_str or tb_info["title"],
                })

        # 4. Build Differential Diagnosis & Choice Comparison items
        choices_serialized = [{"label": c.label, "text": c.text} for c in q.choices]
        if choice_exps and isinstance(choice_exps, dict) and len(differential_items) < 30:
            breakdown = []
            actual_ans = (exp.get("correct_answer") or q.correct_answer or "").strip().upper()
            choice_text_map = {c.label.strip().upper(): c.text for c in q.choices}
            for lbl, expl_text in choice_exps.items():
                lbl_clean = str(lbl).strip().upper()
                breakdown.append({
                    "label": lbl_clean,
                    "choice_text": choice_text_map.get(lbl_clean, ""),
                    "explanation": str(expl_text),
                    "is_correct": lbl_clean == actual_ans,
                })
            if breakdown:
                differential_items.append({
                    "question_id": q.id,
                    "cognitive_level": cog,
                    "task": task_name,
                    "question_summary": q_display,
                    "correct_answer": actual_ans,
                    "reference": ref_str or tb_info["title"],
                    "key_takeaway": key_takeaway,
                    "choices_breakdown": breakdown,
                })

        # 5. Build 4-Step Interactive Case-Based Teaching Lesson
        actual_correct = (exp.get("correct_answer") or q.correct_answer or "").strip()
        guided_cases.append({
            "id": q.id,
            "category": q.category,
            "task": task_name,
            "must_know_topic": q.must_know_topic,
            "cognitive_level": cog,
            "source_exam": q.source_exam,
            "image_path": q.image_path,
            # Step 1: Teach from Textbook & Evidence FIRST
            "step1_textbook_lesson": {
                "textbook_title": tb_info["title"],
                "textbook_icon": tb_info["icon"],
                "textbook_color": tb_info["color"],
                "reference": ref_str or tb_info["title"],
                "core_principle": core_principle,
                "clinical_pearl": clinical_pearl,
            },
            # Step 2 & 3: Clinical Case Vignette & Interactive Question
            "step2_clinical_case": {
                "stem": q.stem,
                "proposition": q.proposition,
                "question_text": q.question_text,
                "choices": choices_serialized,
            },
            # Step 4: Evidence-Based Differential Resolution
            "step3_evidence_resolution": {
                "correct_answer": actual_correct,
                "key_takeaway": key_takeaway,
                "common_pitfall": common_pitfall,
                "choice_explanations": choice_exps if isinstance(choice_exps, dict) else {},
            },
            # Raw question object for compatibility with practice mode
            "raw_question": {
                "id": q.id,
                "question_text": q.question_text,
                "stem": q.stem,
                "proposition": q.proposition,
                "category": q.category,
                "task": q.task,
                "correct_answer": actual_correct,
                "explanation": q.explanation,
                "source_exam": q.source_exam,
                "image_path": q.image_path,
                "cognitive_level": q.cognitive_level,
                "must_know_topic": q.must_know_topic,
                "choices": choices_serialized,
            }
        })

    # Order task modules logically
    task_order = [
        "การเกิดและการดำเนินโรค",
        "การวินิจฉัยโรค",
        "การจัดการและการรักษาผู้ป่วย",
        "ขั้นตอนและวิธีการรักษา",
        "การสร้างเสริมสุขภาพและการป้องกัน",
        "พ.ร.บ. วิชาชีพทันตกรรม พ.ศ. 2537",
        "จรรยาบรรณแห่งวิชาชีพทันตกรรม",
        "พ.ร.บ. สถานพยาบาล พ.ศ. 2541",
        "กฎหมายอื่นๆ ที่เกี่ยวข้อง",
    ]
    task_modules_sorted = []
    for t_name in task_order:
        if t_name in task_groups and task_groups[t_name]:
            task_modules_sorted.append({
                "task": t_name,
                "lesson_count": len(task_groups[t_name]),
                "lessons": task_groups.pop(t_name),
            })
    for t_name, lessons in task_groups.items():
        if lessons:
            task_modules_sorted.append({
                "task": t_name,
                "lesson_count": len(lessons),
                "lessons": lessons,
            })

    sorted_citations = sorted(citations_counter.values(), key=lambda x: -x["count"])

    return {
        "module_info": {
            "id": module_id,
            "title_th": title_th,
            "title_en": title_en,
            "category": category,
            "total_questions": len(questions),
            "synthesized_lessons_count": sum(m["lesson_count"] for m in task_modules_sorted),
            "cognitive_counts": cog_counts,
        },
        "textbook_references": sorted_citations[:15],
        "task_modules": task_modules_sorted,
        "differential_comparisons": differential_items,
        "pearls": pearls_list,
        "pitfalls": pitfalls_list,
        "guided_cases": guided_cases,
    }


@router.get("/topic/{topic_id}")
def get_topic_learning_module(
    topic_id: str,
    db: Session = Depends(get_db),
):
    """Extract and synthesize a complete Textbook & Evidence teaching module from all exam questions in a Must-Know Topic."""
    questions = (
        db.query(models.Question)
        .options(selectinload(models.Question.choices))
        .filter(models.Question.must_know_topic == topic_id)
        .all()
    )

    if not questions:
        raise HTTPException(status_code=404, detail=f"Topic '{topic_id}' not found")

    cat = questions[0].category or ""
    meta = get_topic_meta(topic_id, cat)
    return _build_pedagogical_module(
        questions=questions,
        title_th=meta["title_th"],
        title_en=meta["title_en"],
        category=cat,
        module_id=topic_id,
    )


@router.get("/textbook/{textbook_id}")
def get_textbook_learning_module(
    textbook_id: str,
    topic: Optional[str] = Query(None),
    limit: int = Query(120, gt=0, le=300),
    db: Session = Depends(get_db),
):
    """Extract and synthesize a teaching module for a specific Gold-Standard Textbook / Evidence Guideline."""
    tb_meta = next((t for t in CANONICAL_TEXTBOOKS if t["id"] == textbook_id), None)
    if not tb_meta:
        raise HTTPException(status_code=404, detail=f"Textbook '{textbook_id}' not found")

    query = db.query(models.Question).options(selectinload(models.Question.choices))
    if topic:
        query = query.filter(models.Question.must_know_topic == topic)

    all_q = query.all()
    matched_q = []
    for q in all_q:
        exp = _parse_explanation(q.explanation)
        ref_str = exp.get("reference") or exp.get("legal_citation") or ""
        tb_match = classify_textbook(ref_str, q.category or "")
        if tb_match["id"] == textbook_id:
            matched_q.append(q)
            if len(matched_q) >= limit:
                break

    if not matched_q:
        raise HTTPException(status_code=404, detail="No questions found for this textbook filter")

    return _build_pedagogical_module(
        questions=matched_q,
        title_th=f"เรียนจากตำรา: {tb_meta['title']}",
        title_en=tb_meta["description"],
        category=tb_meta["specialty"],
        module_id=textbook_id,
    )
