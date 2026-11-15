import json
import math
import random
import re
import time
from typing import Dict, List, Optional, Any, Tuple
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session, selectinload

import models
from auth import _decode_token, get_current_user, _check_rate_limit, _get_client_ip
from database import get_db
from pathways import CURATED_TOPIC_PATHWAYS, get_topic_pathways
from tos_blueprint import is_mock_70_locked

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
        "title_th": "ระบบจำแนกโรคปริทันต์และเนื้อเยื่อรอบรากเทียม (AAP/EFP 2018 & TAP E-book 2023)",
        "title_en": "AAP/EFP 2018 Classification, TAP E-book 2023 & TAP Prognosis 2025",
    },
    "Perio-Examination-Indices": {
        "title_th": "การตรวจประเมินสภาวะปริทันต์ ค่า CAL, %RBL (2 mm ใต้ CEJ) และพยากรณ์โรค (TAP 2025)",
        "title_en": "Periodontal Probing, CAL, %RBL & TAP Guideline 2025 Prognosis",
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
# 2. CANONICAL GOLD-STANDARD TEXTBOOKS & THAI ASSOCIATION EVIDENCE REGISTRY
# ─────────────────────────────────────────────────────────────────────────────
CANONICAL_TEXTBOOKS = [
    {
        "id": "cohen-endodontics",
        "title": "Cohen's Pathways of the Pulp (12th ed.) & สมาคมวิทยาเอ็นโดดอนต์ไทย (TAE)",
        "specialty": "วิทยาเอ็นโดดอนต์",
        "icon": "🦷",
        "color": "#ec4899",
        "patterns": ["cohen", "pathways of the pulp", "hargreaves", "berman", "aae", "american association of endodontists", "ingle", "torabinejad", "สมาคมวิทยาเอ็นโดดอนต์ไทย"],
        "description": "ตำรามาตรฐานระดับโลกด้านวิทยาเอ็นโดดอนต์ ร่วมกับแนวทางเวชปฏิบัติของสมาคมวิทยาเอ็นโดดอนต์ไทย (TAE) และราชวิทยาลัยทันตแพทย์แห่งประเทศไทย ครอบคลุมการวินิจฉัยพัลพ์และปลายรากตามเกณฑ์ AAE, VPT, สารล้างคลองราก และการอุดคลองรากฟัน",
        "thai_association": "สมาคมวิทยาเอ็นโดดอนต์ไทย (Thai Association of Endodontists — TAE) & ราชวิทยาลัยทันตแพทย์แห่งประเทศไทย",
        "thai_references": [
            "แนวทางเวชปฏิบัติทางวิทยาเอ็นโดดอนต์ สมาคมวิทยาเอ็นโดดอนต์ไทย (TAE) และทันตแพทยสภา",
            "ตำราวิทยาเอ็นโดดอนต์ คณะทันตแพทยศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย / มหาวิทยาลัยมหิดล / มหาวิทยาลัยเชียงใหม่",
            "เกณฑ์การวินิจฉัยโรคของเนื้อเยื่อในและเนื้อเยื่อรอบปลายรากฟัน (AAE Consensus ที่โรงเรียนทันตแพทย์ไทยใช้เป็นมาตรฐานข้อสอบ ศ.ท.ส.)"
        ],
        "thai_protocol_highlights": [
            "ข้อสอบ ศ.ท.ส. ใช้คำศัพท์การวินิจฉัยตาม AAE Consensus 2009/2013 เป็นมาตรฐานเดียวทั้ง 18 สถาบัน (เช่น Symptomatic/Asymptomatic Irreversible Pulpitis, Symptomatic/Asymptomatic Apical Periodontitis)",
            "การทำ Vital Pulp Therapy (Direct Pulp Capping / Partial Pulpotomy) ในแนวทางไทยปัจจุบันเน้นการใส่ Rubber dam, เช็ดหยุดเลือดด้วย NaOCl ภายใน 5–10 นาที และปิดทับด้วย Calcium Silicate Cement (MTA หรือ Biodentine) แทน Ca(OH)2 ดั้งเดิมในเคส Carious exposure",
            "ตามเกณฑ์การใช้ยาอย่างสมเหตุผลในงานทันตกรรม (RDU Thailand) ห้ามจ่ายยาปฏิชีวนะในเคส Reversible/Irreversible Pulpitis หรือ Localized Acute Apical Abscess ที่ระบายหนองได้แล้วและไม่มีไข้/Cellulitis"
        ]
    },
    {
        "id": "hupp-omfs",
        "title": "Hupp's Contemporary OMFS (7th ed.) & สมาคมศัลยศาสตร์ช่องปากฯ (TAOMS)",
        "specialty": "ศัลยศาสตร์ช่องปาก",
        "icon": "🔪",
        "color": "#f59e0b",
        "patterns": ["hupp", "ellis", "tucker", "contemporary oral and maxillofacial", "peterson", "fonseca", "aaoms", "สมาคมศัลยศาสตร์ช่องปาก"],
        "description": "ตำราหลักด้านศัลยศาสตร์ช่องปากและแม็กซิลโลเฟเชียล ร่วมกับแนวทางเวชปฏิบัติราชวิทยาลัยทันตแพทย์ฯ และสมาคมศัลยศาสตร์ช่องปากและแม็กซิลโลเฟเชียลแห่งประเทศไทย ในพระบรมราชูปถัมภ์ (TAOMS)",
        "thai_association": "สมาคมศัลยศาสตร์ช่องปากและแม็กซิลโลเฟเชียลแห่งประเทศไทย ในพระบรมราชูปถัมภ์ (TAOMS) & ราชวิทยาลัยทันตแพทย์แห่งประเทศไทย",
        "thai_references": [
            "แนวทางเวชปฏิบัติทางศัลยศาสตร์ช่องปากและแม็กซิลโลเฟเชียล ราชวิทยาลัยทันตแพทย์แห่งประเทศไทย และ TAOMS",
            "แนวทางการจัดการผู้ป่วยที่ได้รับยาต้านการแข็งตัวของเลือดและยาต้านเกล็ดเลือดในงานทันตกรรม (ทันตแพทยสภา & สมาคมโลหิตวิทยาแห่งประเทศไทย)",
            "ตำราศัลยศาสตร์ช่องปากและแม็กซิลโลเฟเชียล คณะทันตแพทยศาสตร์ จุฬาฯ / มหิดล / ขอนแก่น / สงขลานครินทร์"
        ],
        "thai_protocol_highlights": [
            "โปรโตคอลถอนฟันผู้ป่วยรับประทาน Warfarin ในโรงพยาบาลไทย: เจาะตรวจ INR ภายใน 24–72 ชม. หาก INR ≤ 3.0–3.5 สามารถถอนฟันไม่ซับซ้อน (1–3 ซี่) ได้โดยไม่ต้องหยุดยา Warfarin ร่วมกับการห้ามเลือดเฉพาะที่: ใส่ Gelfoam/Surgicel + เย็บแผล Figure-of-eight + อมบ้วนปากด้วย 5% Tranexamic acid mouthwash ครั้งละ 10 mL นาน 2 นาที วันละ 4 ครั้ง นาน 2–5 วัน",
            "ผู้ป่วยที่ได้รับ Dual Antiplatelet Therapy (Aspirin + Clopidogrel) หลังใส่ขดลวดหัวใจ (Coronary Stent): ห้ามหยุดยาเองเด็ดขาด และควรชะลอหัตถการศัลยกรรมที่ไม่ฉุกเฉินในช่วง 6–12 เดือนแรกหลังใส่ Drug-eluting stent",
            "การจำแนกฟันคุดและการส่งต่อผู้ป่วยติดเชื้อ Ludwig's angina / Deep neck infection ในระบบบริการสุขภาพไทย เน้นการประเมินทางเดินหายใจ (Airway patency: Stridor, Dysphagia, Trismus, ยกลิ้นตึง) เป็นอันดับแรกก่อนส่งห้องฉุกเฉิน รพ.ศูนย์/รพ.ทั่วไป"
        ]
    },
    {
        "id": "malamed-anesthesia-emergencies",
        "title": "Malamed's Local Anesthesia & แนวทางช่วยชีวิตฉุกเฉินในคลินิกทันตกรรมไทย",
        "specialty": "ศัลยศาสตร์ช่องปาก",
        "icon": "💉",
        "color": "#f97316",
        "patterns": ["malamed", "handbook of local anesthesia", "medical emergencies in the dental office", "ยาชาเฉพาะที่"],
        "description": "คัมภีร์เภสัชวิทยาของยาชาเฉพาะที่และการจัดการภาวะฉุกเฉินในคลินิกทันตกรรม อ้างอิงขนาดหลอดยาชามาตรฐานในประเทศไทย (1.8 mL) และแนวทางช่วยชีวิตขั้นพื้นฐานของสมาคมแพทย์โรคหัวใจแห่งประเทศไทยฯ",
        "thai_association": "ราชวิทยาลัยทันตแพทย์แห่งประเทศไทย & คณะกรรมการช่วยชีวิต สมาคมแพทย์โรคหัวใจแห่งประเทศไทย ในพระบรมราชูปถัมภ์",
        "thai_references": [
            "ตำรายาชาเฉพาะที่ทางทันตกรรม คณะทันตแพทยศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย / มหาวิทยาลัยมหิดล",
            "แนวปฏิบัติการช่วยชีวิตขั้นพื้นฐานและภาวะฉุกเฉินในคลินิกทันตกรรม (ทันตแพทยสภา & สมาคมแพทย์โรคหัวใจแห่งประเทศไทยฯ)",
            "Malamed's Handbook of Local Anesthesia (7th ed.) & Medical Emergencies in the Dental Office (8th ed.)"
        ],
        "thai_protocol_highlights": [
            "มาตรฐานการคำนวณยาชาในข้อสอบใบประกอบวิชาชีพไทย (ศ.ท.ส.): หากโจทย์ไม่ระบุปริมาตรหลอดยาชา ให้ใช้ปริมาตรมาตรฐานในประเทศไทยคือ 1.8 mL/หลอด (Cartridge) เสมอ (2% Lidocaine = 36 mg/หลอด, Epinephrine 1:100,000 = 0.018 mg/หลอด; ยกเว้นโจทย์ระบุ 1.7 mL)",
            "เกณฑ์ขนาดยาชาสูงสุด (MRD) ที่ใช้เป็นมาตรฐานในข้อสอบไทย: 2% Lidocaine = 4.4 mg/kg (สูงสุดไม่เกิน 300 mg ตามเกณฑ์ Malamed หรือ 7.0 mg/kg ไม่เกิน 500 mg ตาม FDA — ในข้อสอบไทยเน้นตัวเลข 4.4 mg/kg ของ Malamed ในการคำนวณความปลอดภัยโดยเฉพาะในเด็ก), 3% Mepivacaine = 4.4 mg/kg (สูงสุด 300 mg), 4% Articaine = 7.0 mg/kg",
            "การจัดการ Anaphylaxis เฉียบพลันในคลินิกทันตกรรมไทย: ฉีด Epinephrine 1:1,000 (1 mg/mL) เข้ากล้ามเนื้อต้นขาด้านนอก (IM Vastus lateralis) ขนาดผู้ใหญ่ 0.3–0.5 mg (เด็ก 0.01 mg/kg สูงสุดไม่เกิน 0.3 mg) ซ้ำได้ทุก 5–15 นาที ร่วมกับโทรแจ้งสายด่วนการแพทย์ฉุกเฉิน 1669"
        ]
    },
    {
        "id": "carranza-lindhe-perio",
        "title": "Newman & Carranza's Periodontology, AAP/EFP 2018 (TAP E-book 2023) & พยากรณ์โรค (TAP Guideline 2025)",
        "specialty": "ปริทันตวิทยา",
        "icon": "🌿",
        "color": "#10b981",
        "patterns": ["carranza", "newman", "takei", "klokkevold", "lindhe", "lang", "caton", "kwok", "2017 world workshop", "tonetti", "papapanou", "chapple", "herrera", "hamp", "mcguire", "gargiulo", "tap", "2023", "2025", "unfavorable", "favorable", "prognosis shifter", "สมาคมปริทันตวิทยา"],
        "description": "องค์ความรู้บูรณาการระหว่างเอกสารฉันทามติของสมาคมปริทันตวิทยาแห่งประเทศไทยทั้ง 2 ฉบับล่าสุด: (1) Workshop E-book 2023 (การวินิจฉัยและจำแนกโรคปริทันต์/รอบรากเทียม AAP/EFP 2018 พร้อม 5 ข้อยกเว้น CAL) และ (2) TAP Guideline 2025 (พยากรณ์โรคปริทันต์ระดับซี่ฟัน 4 ระดับ และระดับผู้ป่วย 3 ระดับ + 4 Shifters) ร่วมกับตำรา Newman & Carranza / Lindhe",
        "thai_association": "สมาคมปริทันตวิทยาแห่งประเทศไทย (Thai Association of Periodontology — TAP) & ราชวิทยาลัยทันตแพทย์แห่งประเทศไทย",
        "thai_references": [
            "Thai Association of Periodontology Guideline 2025: \"An Update in Periodontal Prognosis 2025\" สมาคมปริทันตวิทยาแห่งประเทศไทย (พ.ศ. 2568)",
            "Workshop: Update on New Classification of Periodontal Diseases and Conditions (E-book 2023 / พ.ศ. 2562) สมาคมปริทันตวิทยาแห่งประเทศไทย (TAP)",
            "ตำราปริทันตวิทยา คณะทันตแพทยศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย / มหาวิทยาลัยมหิดล / มหาวิทยาลัยเชียงใหม่",
            "Newman and Carranza's Clinical Periodontology (13th ed.) & Lindhe's Clinical Periodontology and Implant Dentistry"
        ],
        "thai_protocol_highlights": [
            "เกณฑ์วินิจฉัยและจำแนกโรคปริทันต์ (TAP E-book 2023 — AAP/EFP 2018): Periodontitis Case Definition ต้องพบ Interdental CAL ≥ 2 ซี่ที่ไม่ติดกัน หรือ Buccal/Oral CAL ≥ 3 mm + PD > 3 mm ≥ 2 ซี่ โดยต้องไม่อยู่ใน 5 ข้อยกเว้น (Traumatic recession, Cervical caries, CAL ด้าน Distal ฟันกรามซี่ 2 จากฟันคุดซี่ 3 เช่น 37D จาก 38, Endo lesion drainage, VRF); Gingivitis มี BOP ≥ 10% แยก Intact vs Reduced periodontium ส่วน Health on a stable reduced periodontium มี BOP < 10% และ PD ≤ 4 mm (โดยไม่มีจุด PD = 4 mm ที่ BOP+)",
            "จุดเชื่อมโยงสำคัญระหว่าง TAP 2023 กับ TAP 2025: (1) ทั้งสองฉบับยึดระดับกระดูกปกติ (Normal bone level = 100%) ที่ตำแหน่ง 2 mm ใต้ CEJ เพื่อคำนวณ %RBL = A/B × 100, (2) ใช้ตัวปรับเสี่ยงร่วมกันคือ สูบบุหรี่ ≥ 10 มวน/วัน และเบาหวาน HbA1C ≥ 7.0% (Grade C ใน 2023 / ปรับ Questionable → Unfavorable ใน 2025), (3) Vertical defect ≥ 3 mm ที่ทำ Regeneration ได้ เป็นข้อยกเว้นสำคัญทั้งในการคง Stage และการคงระดับ Questionable แม้ RBL > 66%, (4) ขอบเขต Stage IV (<20 ซี่) เชื่อมตรงสู่ 1 ใน 4 Prognosis Shifters ระดับผู้ป่วย",
            "จุดปรับปรุงล่าสุดของ TAP Guideline 2025 เหนือ E-book 2023: 1) Tooth-level Prognosis (Kwok & Caton 2007 เน้น Periodontal Stability) ใช้ 4 ระดับเท่านั้นคือ Favorable, Questionable, Unfavorable, Hopeless (ยกเลิกคำว่า Fair/Poor ในระดับซี่ฟัน และปรับปรุงคำพยากรณ์ Endo-perio จาก 'hopeless, poor หรือ favorable' ใน TAP 2023 หน้า 25 เป็น: ไม่มี Root damage = Questionable; มี Root damage = Unfavorable [ตรวจเพิ่ม/ส่งต่อ] หรือ Hopeless [ถอน]), 2) Stage (2023) คงที่ตลอดชีวิตไม่ลดขั้น แต่ Prognosis (2025) ต้องประเมิน Re-prognosis ทุกครั้งที่รักษา",
            "Patient-level Prognosis (TAP 2025 — แทน Overall prognosis เดิม พ.ศ. 2556 เชื่อมตรง AAP/EFP 2018) แบ่ง 3 ระดับ: Good (Health, Gingivitis, Stage I–II), Fair (Stage III), Poor (Stage IV หรือ Molar-Incisor pattern) พร้อม 4 Prognosis Shifters (Systemic, Compliance/SPT, Parafunction, Occlusal stability <20 ซี่/<10 คู่สบ) ลดระดับลง 1 ขั้น (Health/Gingivitis คง ≥ Fair; รากเทียมไม่ลด Patient-level prognosis แต่นับรวมเป็นคู่สบได้)",
            "เกณฑ์มาตรฐานคลินิกปริทันต์ในโรงเรียนทันตแพทย์ไทย: Re-evaluation หลัง SRP ที่ 4–6 สัปดาห์, O'Leary Plaque Score ≤ 10–20% ก่อนผ่าตัดปริทันต์, ใช้ Cairo Recession Type (RT1–RT3) ร่วมกับ Gingival Phenotype และ Supracrestal Tissue Attachment (STA ~2 mm, Crown lengthening ≥ 3 mm จากขอบครอบฟันถึง Alveolar crest)"
        ]
    },
    {
        "id": "sturdevant-operative",
        "title": "Sturdevant's Operative, Phillips' Materials & สมาคมทันตกรรมหัตถการแห่งประเทศไทย (TODS)",
        "specialty": "ทันตกรรมบูรณะ/หัตถการ",
        "icon": "✨",
        "color": "#6366f1",
        "patterns": ["sturdevant", "ritter", "boushell", "summitt", "phillips", "anusavice", "shen", "rawls", "fejerskov", "kidd", "brännström", "สมาคมทันตกรรมหัตถการ"],
        "description": "ตำรามาตรฐานด้านทันตกรรมหัตถการและวัสดุทันตกรรม ร่วมกับแนวทางสมาคมทันตกรรมหัตถการแห่งประเทศไทย (TODS) และแนวทางลดการใช้อมัลกัมตามอนุสัญญามินามาตะของกรมอนามัย",
        "thai_association": "สมาคมทันตกรรมหัตถการแห่งประเทศไทย (Thai Operative Dentistry Society — TODS) & กรมอนามัย กระทรวงสาธารณสุข",
        "thai_references": [
            "แนวทางเวชปฏิบัติทางทันตกรรมหัตถการและการจัดการโรคฟันผุเชิงอนุรักษ์ สมาคมทันตกรรมหัตถการแห่งประเทศไทย (TODS)",
            "แนวทางการลดการใช้วัสดุอมัลกัมทางทันตกรรมตามอนุสัญญามินามาตะว่าด้วยปรอท สำนักทันตสาธารณสุข กรมอนามัย และทันตแพทยสภา",
            "ตำราทันตกรรมหัตถการและทันตวัสดุศาสตร์ คณะทันตแพทยศาสตร์ จุฬาฯ / มหิดล / เชียงใหม่ / ขอนแก่น"
        ],
        "thai_protocol_highlights": [
            "แนวทาง Minimal Intervention Dentistry (MID) ของสมาคมทันตกรรมหัตถการแห่งประเทศไทย: ในฟันที่มีรอยผุลึกใกล้โพรงประสาทฟันและพัลพ์ปกติ/Reversible pulpitis แนะนำ Selective Caries Removal to Soft/Firm Dentin บริเวณผนังใกล้พัลพ์ (Pulpal/Axial wall) แต่ต้องกำจัดรอยผุให้ถึง Sound enamel/Hard dentin บริเวณขอบรอบนอก (Peripheral seal zone 1.5–2 mm)",
            "เกณฑ์การปกป้องโพรงประสาทฟันตาม Remaining Dentin Thickness (RDT): หาก RDT ≥ 2.0 mm ไม่จำเป็นต้องใส่ Liner/Base ใต้เรซินคอมโพสิต; หาก RDT < 0.5 mm และใกล้ทะลุพัลพ์ ให้แต้มเฉพาะจุดด้วย Calcium Hydroxide หรือ Calcium Silicate Cement แล้วทับด้วย RMGIC liner",
            "แนวทางอนุสัญญามินามาตะในประเทศไทย (กรมอนามัย & ทันตแพทยสภา): ให้หลีกเลี่ยงการใช้วัสดุอมัลกัมในการบูรณะฟันน้ำนม, เด็กอายุต่ำกว่า 15 ปี, หญิงตั้งครรภ์ และหญิงให้นมบุตร ยกเว้นมีข้อบ่งชี้ทางคลินิกที่จำเป็น"
        ]
    },
    {
        "id": "prostho-zarb-mccracken-rosenstiel",
        "title": "Rosenstiel, McCracken, Zarb & สมาคมทันตกรรมประดิษฐ์ไทย (TPA)",
        "specialty": "ทันตกรรมประดิษฐ์",
        "icon": "👑",
        "color": "#38bdf8",
        "patterns": ["rosenstiel", "shillingburg", "mccracken", "carr", "zarb", "hobkirk", "boucher", "misch", "prosthodontic", "สมาคมทันตกรรมประดิษฐ์"],
        "description": "3 ตำราเสาหลักแห่งทันตกรรมประดิษฐ์ ร่วมกับมาตรฐานการออกแบบของสมาคมทันตกรรมประดิษฐ์ไทย (TPA) และเกณฑ์โครงการฟันเทียมและรากฟันเทียมพระราชทานของกระทรวงสาธารณสุข",
        "thai_association": "สมาคมทันตกรรมประดิษฐ์ไทย (Thai Prosthodontic Association — TPA) & ราชวิทยาลัยทันตแพทย์แห่งประเทศไทย",
        "thai_references": [
            "แนวทางเวชปฏิบัติทางทันตกรรมประดิษฐ์ สมาคมทันตกรรมประดิษฐ์ไทย (TPA) และราชวิทยาลัยทันตแพทย์แห่งประเทศไทย",
            "คู่มือการให้บริการฟันเทียมและรากฟันเทียมพระราชทาน สำนักทันตสาธารณสุข กรมอนามัย และ สปสช.",
            "ตำราฟันเทียมติดแน่น ฟันเทียมบางส่วนถอดได้ และฟันเทียมทั้งปาก คณะทันตแพทยศาสตร์ จุฬาฯ / มหิดล / เชียงใหม่"
        ],
        "thai_protocol_highlights": [
            "เกณฑ์ความจำเป็นในการใส่ฟันเทียมของผู้สูงอายุไทย (กรมอนามัย / สปสช.): ประเมินจากสภาวะการสูญเสียฟันและการมีคู่สบฟันหลัง (Posterior Occluding Pairs) หากผู้สูงอายุมีฟันแท้เหลือน้อยกว่า 20 ซี่ หรือมีคู่สบฟันหลังน้อยกว่า 4 คู่สบ จะส่งผลต่อสมรรถภาพการบดเคี้ยวและเป็นข้อบ่งชี้ในการใส่ฟันเทียม",
            "มาตรฐานการออกแบบ RPD ในโรงเรียนทันตแพทย์ไทย (Kennedy Class I & II Distal Extension): เน้นแนวคิด Stress-releasing clasp เช่น RPI system (Mesial rest + Distal guide plane + I-bar เหนือหรือที่จุดป่องสุดส่วนกลาง/ใกล้กลาง) เพื่อเปลี่ยนคานงัด Class I lever ให้กลายเป็น Class II lever ลดแรงงัดต่อฟันหลัก",
            "การบูรณะฟันที่รักษาคลองรากฟันแล้วด้วยเดือยฟันและแกนฟัน (Post & Core): ต้องมีเนื้อฟันธรรมชาติโดยรอบเหนือขอบครอบฟันอย่างน้อยสูง 1.5–2.0 mm และหนา ≥ 1.0 mm (360-degree Ferrule Effect) เพื่อป้องกันรากฟันแตกแนวดิ่ง (Vertical root fracture)"
        ]
    },
    {
        "id": "pedo-mcdonald-nowak-aapd",
        "title": "McDonald & Avery, AAPD & สมาคมทันตกรรมสำหรับเด็กแห่งประเทศไทย (TSPD)",
        "specialty": "ทันตกรรมสำหรับเด็ก",
        "icon": "🧸",
        "color": "#8b5cf6",
        "patterns": ["mcdonald", "avery", "dean", "nowak", "pinkham", "casamassimo", "aapd", "american academy of pediatric dentistry", "สมาคมทันตกรรมสำหรับเด็ก", "ชมรมทันตกรรมสำหรับเด็ก"],
        "description": "ตำราและแนวทางเวชปฏิบัติ AAPD ร่วมกับแนวทางการใช้ฟลูออไรด์และการดูแลสุขภาพช่องปากเด็กของสมาคมทันตกรรมสำหรับเด็กแห่งประเทศไทย (TSPD) ทันตแพทยสภา และกรมอนามัย",
        "thai_association": "สมาคมทันตกรรมสำหรับเด็กแห่งประเทศไทย (TSPD / ชมรมทันตกรรมสำหรับเด็กแห่งประเทศไทย) & สำนักทันตสาธารณสุข กรมอนามัย",
        "thai_references": [
            "แนวทางการใช้ฟลูออไรด์สำหรับเด็ก ชมรม/สมาคมทันตกรรมสำหรับเด็กแห่งประเทศไทย และทันตแพทยสภา (ฉบับปรับปรุง พ.ศ. 2560 / พ.ศ. 2566)",
            "แนวทางการประเมินความเสี่ยงต่อโรคฟันผุและการจัดการโรคฟันผุในเด็กปฐมวัย สมาคมทันตกรรมสำหรับเด็กแห่งประเทศไทย & กรมอนามัย",
            "McDonald and Avery's Dentistry for the Child and Adolescent (11th ed.) & AAPD Reference Manual"
        ],
        "thai_protocol_highlights": [
            "🇹🇭 เกณฑ์การใช้ยาสีฟันผสมฟลูออไรด์ในประเทศไทย (TSPD & ทันตแพทยสภา): แนะนำยาสีฟันฟลูออไรด์ความเข้มข้น 1,000 ppm (หรือ 1,000–1,500 ppm) ตั้งแต่ฟันน้ำนมซี่แรกขึ้น! โดยแบ่งปริมาณตามอายุ: (1) อายุ < 3 ปี: แตะพอเปียกแปรง / เท่าเมล็ดข้าวสาร (~0.1 g) ผู้ปกครองแปรงให้และเช็ดฟองออก, (2) อายุ 3 ถึง < 6 ปี: เท่าเมล็ดถั่วเขียว / ความกว้างแปรง (~0.25 g), (3) อายุ ≥ 6 ปี: ตามความยาวแปรง (1–2 cm หรือ ~0.5–1 g)",
            "🇹🇭 ตารางฟลูออไรด์เสริมชนิดรับประทาน (Systemic Fluoride Supplement) ของประเทศไทย: พิจารณาจ่ายเฉพาะเด็กที่มีความเสี่ยงต่อฟันผุสูง (High caries risk) ตั้งแต่อายุ 6 เดือน – 16 ปี เท่านั้น โดยอ้างอิงปริมาณฟลูออไรด์ในน้ำดื่มของไทย 3 ช่วง คือ < 0.3 ppm, 0.3–0.6 ppm, และ > 0.6 ppm (หากอายุ < 6 เดือน หรือน้ำดื่มมีฟลูออไรด์ > 0.6 ppm งดจ่ายฟลูออไรด์เสริมทุกกรณี!)",
            "🇹🇭 การใช้ฟลูออไรด์โดยทันตบุคลากรในไทย: เด็กอายุ < 6 ปีที่มีความเสี่ยงฟันผุสูง ให้ใช้ 5% NaF Varnish (22,600 ppm F) ทุก 3–6 เดือน; ส่วน 1.23% APF Gel (12,300 ppm F) ใช้เฉพาะในเด็กอายุ ≥ 6 ปีที่ควบคุมการกลืนได้แล้วเท่านั้นเพื่อป้องกันพิษเฉียบพลัน (PTD = 5 mg F/kg)"
        ]
    },
    {
        "id": "iadt-traumatology",
        "title": "IADT Guidelines (2020) & แนวทางจัดการฟันได้รับอุบัติเหตุในคลินิกทันตกรรมไทย",
        "specialty": "ทันตกรรมสำหรับเด็ก",
        "icon": "🚑",
        "color": "#c084fc",
        "patterns": ["iadt", "international association of dental traumatology", "traumatic dental injuries", "andreasen", "bourguignon", "day pf"],
        "description": "แนวทางมาตรฐานสากล IADT 2020 ร่วมกับแนวปฏิบัติของสมาคมทันตกรรมสำหรับเด็กแห่งประเทศไทย และสมาคมวิทยาเอ็นโดดอนต์ไทย สำหรับการจัดการอุบัติเหตุในฟันน้ำนมและฟันแท้",
        "thai_association": "สมาคมทันตกรรมสำหรับเด็กแห่งประเทศไทย (TSPD) & สมาคมวิทยาเอ็นโดดอนต์ไทย (TAE)",
        "thai_references": [
            "IADT Guidelines for the Management of Traumatic Dental Injuries (2020 Revision)",
            "คู่มือการจัดการอุบัติเหตุทางทันตกรรม สมาคมทันตกรรมสำหรับเด็กแห่งประเทศไทย และสมาคมวิทยาเอ็นโดดอนต์ไทย"
        ],
        "thai_protocol_highlights": [
            "กฎเหล็กฟันน้ำนมหลุดออกจากเบ้า (Primary Tooth Avulsion): ห้ามใส่กลับเข้าเบ้าฟัน (Do NOT replant) เด็ดขาด เพื่อป้องกันอันตรายต่อหน่อฟันแท้ข้างใต้ (Succedaneous tooth germ)",
            "ฟันแท้หลุดออกจากเบ้า (Permanent Tooth Avulsion — IADT 2020): สื่อแช่ฟันที่ดีที่สุดในบริบทคลินิกและโรงเรียนในไทยหากใส่กลับทันทีไม่ได้ คือ นมจืดพาสเจอร์ไรส์แช่เย็น (Cold Milk) หรือ HBSS หรือน้ำเกลือปราศจากเชื้อ (NSS) ห้ามแช่น้ำเปล่า! หลังใส่กลับให้ยึดด้วย Flexible splint นาน 2 สัปดาห์ (หรือ 4 สัปดาห์หากมีกระดูกเบ้าฟันหักร่วมด้วย)",
            "ในฟันแท้รากปิดที่เกิด Avulsion: ต้องเริ่มเปิดคลองรากฟัน (Initiate RCT) ภายใน 7–10 วันหลัง Replantation (ก่อนถอด Splint) และใส่ Calcium Hydroxide นานสูงสุด 1 เดือนเพื่อป้องกัน External inflammatory root resorption"
        ]
    },
    {
        "id": "neville-oral-pathology-radiology",
        "title": "Neville's Oral Pathology, White & Pharoah Radiology & แนวทางคัดกรองมะเร็งช่องปากไทย",
        "specialty": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
        "icon": "🔬",
        "color": "#a855f7",
        "patterns": ["neville", "damm", "allen", "oral and maxillofacial pathology", "white", "pharoah", "mallya", "oral radiology", "regezi", "woo", "สมาคมพยาธิวิทยาช่องปาก", "สมาคมรังสีวิทยาช่องปาก"],
        "description": "ตำราหลักด้านพยาธิวิทยาและรังสีวิทยาช่องปาก ร่วมกับแนวทางการตรวจคัดกรองรอยโรคก่อนมะเร็งช่องปาก (OPMDs) ของกรมอนามัย สถาบันมะเร็งแห่งชาติ และสมาคมพยาธิวิทยาช่องปากแห่งประเทศไทย",
        "thai_association": "สมาคมพยาธิวิทยาช่องปากและแม็กซิลโลเฟเชียลแห่งประเทศไทย, สมาคมรังสีวิทยาช่องปากฯ & สถาบันมะเร็งแห่งชาติ กรมการแพทย์",
        "thai_references": [
            "แนวทางการตรวจคัดกรองและส่งต่อรอยโรคก่อนมะเร็งช่องปาก (OPMDs) สำนักทันตสาธารณสุข กรมอนามัย และสถาบันมะเร็งแห่งชาติ",
            "มาตรฐานความปลอดภัยทางรังสีในคลินิกทันตกรรม สมาคมรังสีวิทยาช่องปากและแม็กซิลโลเฟเชียลแห่งประเทศไทย & กรมวิทยาศาสตร์การแพทย์",
            "Neville's Oral and Maxillofacial Pathology (5th ed.) & White and Pharoah's Oral Radiology (8th ed.)"
        ],
        "thai_protocol_highlights": [
            "🇹🇭 บริบทระบาดวิทยามะเร็งช่องปากในประเทศไทย: ปัจจัยเสี่ยงสำคัญในผู้สูงอายุไทย (โดยเฉพาะภาคตะวันออกเฉียงเหนือและภาคเหนือ) คือ 'การเคี้ยวหมากพลูร่วมกับยาเส้น/ยาฉุน' (Betel quid & smokeless tobacco) ทำให้พบรอยโรคที่กระพุ้งแก้ม (Buccal mucosa) และริมฝีปากล่างในสัดส่วนที่สูงกว่าชาวตะวันตก ทั้งในรูป Oral Submucous Fibrosis (OSMF — มี Fibrous bands อ้าปากจำกัด), Erythroplakia, Leukoplakia และ Verrucous Carcinoma",
            "เกณฑ์การเลือกทำ Biopsy ในแนวทางคัดกรองมะเร็งช่องปากของไทย: รอยโรคขาว/แดงที่ไม่หายไปภายใน 2 สัปดาห์หลังจากกำจัดสาเหตุระคายเคืองเฉพาะที่แล้ว ต้องทำ Incisional biopsy (หากรอยโรคขนาดใหญ่ > 1–2 cm หรือสงสัยมะเร็ง ให้ตัดบริเวณขอบรอยโรคที่ติดกับเนื้อเยื่อปกติ ไม่ตัดตรงกลางเนื้อตาย Necrotic center)",
            "มาตรฐานการป้องกันอันตรายจากรังสีในคลินิกทันตกรรมไทย (กรมวิทยาศาสตร์การแพทย์): ยึดหลัก ALARA (As Low As Reasonably Achievable), ใช้ Rectangular collimation ร่วมกับฟิล์มความไวสูง (E/F-speed) หรือ Digital receptor และให้ผู้ป่วยสวมเสื้อตะกั่วพร้อมปลอกคอป้องกันต่อมไทรอยด์ (Thyroid collar)"
        ]
    },
    {
        "id": "little-falace-burket-aha",
        "title": "Little & Falace, AHA 2021 & คู่มือการใช้ยาอย่างสมเหตุผลในงานทันตกรรมไทย (RDU & NLEM)",
        "specialty": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
        "icon": "❤️‍🩹",
        "color": "#d946ef",
        "patterns": ["little", "falace", "medically compromised", "burket", "glick", "greenberg", "wilson", "american heart association", "aha", "infective endocarditis", "rdu", "บัญชียาหลักแห่งชาติ"],
        "description": "ตำรามาตรฐานการจัดการผู้ป่วยโรคทางระบบในงานทันตกรรม ร่วมกับคู่มือการใช้ยาอย่างสมเหตุผลในงานทันตกรรมของประเทศไทย (RDU Thailand), บัญชียาหลักแห่งชาติ (NLEM) และเกณฑ์ AHA 2021",
        "thai_association": "ชมรมเวชศาสตร์ช่องปากแห่งประเทศไทย, คณะอนุกรรมการส่งเสริมการใช้ยาอย่างสมเหตุผล (RDU Thailand) & ทันตแพทยสภา",
        "thai_references": [
            "คู่มือการใช้ยาอย่างสมเหตุผลในงานทันตกรรม (Rational Drug Use in Dentistry) กระทรวงสาธารณสุข และทันตแพทยสภา",
            "บัญชียาหลักแห่งชาติ (National List of Essential Medicines — NLEM) สำหรับงานทันตกรรม",
            "Little and Falace's Dental Management of the Medically Compromised Patient (10th ed.) & AHA 2021 IE Prophylaxis Guidelines"
        ],
        "thai_protocol_highlights": [
            "🇹🇭 แนวทางการใช้ยาปฏิชีวนะอย่างสมเหตุผลในประเทศไทย (RDU in Dentistry): ยาปฏิชีวนะทางเลือกแรก (First-line) สำหรับการติดเชื้อเฉียบพลันจากฟันที่มีอาการลุกลามคือ Amoxicillin 500 mg รับประทานครั้งละ 1 แคปซูล วันละ 3 ครั้ง หลังอาหารและก่อนนอน (หรือ 875–1,000 mg วันละ 2–3 ครั้ง) นาน 3–5 วันแล้วนัดประเมินซ้ำ หากอาการรุนแรงหรือไม่ตอบสนองใน 48 ชม. ให้เพิ่ม Metronidazole 400 mg วันละ 3 ครั้ง หรือเปลี่ยนเป็น Amoxicillin/Clavulanate",
            "🇹🇭 การปรับเปลี่ยนเกณฑ์ป้องกันเยื่อบุหัวใจอักเสบติดเชื้อ (IE Prophylaxis — AHA 2021 ที่ใช้สอบในไทยปัจจุบัน): ผู้ป่วยที่แพ้ Penicillin 'ห้ามจ่าย Clindamycin' อีกต่อไป (เนื่องจากความเสี่ยง C. difficile colitis) ให้เปลี่ยนเป็น Azithromycin 500 mg หรือ Clarithromycin 500 mg หรือ Cephalexin 2 g (กรณีไม่ใช่แพ้รุนแรงแบบ Anaphylaxis/Angioedema/Urticaria) หรือ Doxycycline 100 mg รับประทาน 30–60 นาทีก่อนทำหัตถการ",
            "🇹🇭 เกณฑ์ความดันโลหิตและน้ำตาลในเลือดก่อนทำหัตถการในคลินิกทันตกรรมไทย: หาก BP ≥ 180/110 mmHg ให้ชะลอการรักษาทางทันตกรรมที่ไม่ฉุกเฉิน (Elective dental care) และส่งพบแพทย์; ผู้ป่วยเบาหวานควรมี Fasting Blood Sugar (FBS) < 180–200 mg/dL หรือ Random BS < 200 mg/dL ก่อนทำศัลยกรรมช่องปาก และนัดทำฟันช่วงเช้าหลังรับประทานอาหารเช้าและยาตามปกติ"
        ]
    },
    {
        "id": "okeson-dc-tmd",
        "title": "Okeson's TMD & Occlusion (8th ed.), DC/TMD & ชมรมทันตกรรมบดเคี้ยวแห่งประเทศไทย",
        "specialty": "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า",
        "icon": "⚡",
        "color": "#06b6d4",
        "patterns": ["okeson", "temporomandibular", "dc/tmd", "schiffman", "dawson", "posselt", "orofacial pain", "ชมรมทันตกรรมบดเคี้ยว"],
        "description": "ตำราหลักด้านระบบบดเคี้ยวและอาการปวดใบหน้า ร่วมกับแนวทางเวชปฏิบัติของชมรมทันตกรรมบดเคี้ยวและความเจ็บปวดช่องปากใบหน้าแห่งประเทศไทย และเกณฑ์ DC/TMD ฉบับภาษาไทย",
        "thai_association": "ชมรมทันตกรรมบดเคี้ยวและความเจ็บปวดช่องปากใบหน้าแห่งประเทศไทย & ราชวิทยาลัยทันตแพทย์แห่งประเทศไทย",
        "thai_references": [
            "เกณฑ์การวินิจฉัยความผิดปกติของข้อต่อขากรรไกรและกล้ามเนื้อบดเคี้ยว (DC/TMD ฉบับภาษาไทย) ชมรมทันตกรรมบดเคี้ยวฯ",
            "แนวทางเวชปฏิบัติการดูแลผู้ป่วยความผิดปกติของระบบบดเคี้ยว (TMD) ราชวิทยาลัยทันตแพทย์แห่งประเทศไทย",
            "Okeson's Management of Temporomandibular Disorders and Occlusion (8th ed.)"
        ],
        "thai_protocol_highlights": [
            "แนวทางเวชปฏิบัติไทยเน้น Conservative & Reversible Therapy เป็นลำดับแรกเสมอในผู้ป่วย TMD (การให้ความรู้ผู้ป่วย, การพักขากรรไกร, อาหารอ่อน, ประคบอุ่นคลายกล้ามเนื้อ, กายภาพบำบัดบริหารขากรรไกร และ Stabilization Splint ชนิดอะคริลิกแข็งคลุมเต็มขากรรไกร) ห้ามกรอปรับสบฟันถาวร (Occlusal equilibration) เป็นการรักษาเริ่มต้น",
            "เกณฑ์ DC/TMD ที่ใช้ในโรงเรียนทันตแพทย์ไทย: แยก Myalgia (ปวดเฉพาะจุดที่กด), Myofascial pain with spreading (ปวดร้าวแต่ยังอยู่ในขอบเขตกล้ามเนื้อมัดนั้น) และ Myofascial pain with referral (ปวดร้าวข้ามออกนอกขอบเขตกล้ามเนื้อมัดที่กด เช่น กด Masseter แล้วปวดร้าวไปที่ฟันกราม) โดยต้องกดค้างนาน 5 วินาทีเพื่อตรวจอาการปวดร้าว",
            "การแยกอาการปวดฟันจากเส้นประสาท Trigeminal Neuralgia (ปวดแปลบเหมือนไฟช็อต นานเป็นวินาที มี Trigger zone ยาทางเลือกแรกคือ Carbamazepine ซึ่งในคนไทยควรระวังการแพ้ยารุนแรง SJS/TEN ที่สัมพันธ์กับยีน HLA-B*15:02!)"
        ]
    },
    {
        "id": "proffit-orthodontics",
        "title": "Proffit's Contemporary Orthodontics (6th ed.) & สมาคมทันตแพทย์จัดฟันแห่งประเทศไทย (TAO)",
        "specialty": "ทันตกรรมจัดฟัน",
        "icon": "📐",
        "color": "#f472b6",
        "patterns": ["proffit", "fields", "sarver", "contemporary orthodontics", "graber", "cephalometric", "scammon", "moyers", "สมาคมทันตแพทย์จัดฟัน"],
        "description": "ตำรามาตรฐานโลกด้านทันตกรรมจัดฟัน ร่วมกับค่ามาตรฐานกะโหลกศีรษะใบหน้าของคนไทย (Thai Cephalometric Norms) และแนวทางสมาคมทันตแพทย์จัดฟันแห่งประเทศไทย (TAO)",
        "thai_association": "สมาคมทันตแพทย์จัดฟันแห่งประเทศไทย (Thai Association of Orthodontists — TAO) & ราชวิทยาลัยทันตแพทย์แห่งประเทศไทย",
        "thai_references": [
            "ค่ามาตรฐานภาพรังสีกะโหลกศีรษะด้านข้างในคนไทย (Thai Cephalometric Norms) คณะทันตแพทยศาสตร์ จุฬาฯ / มหิดล / เชียงใหม่",
            "แนวทางการคัดกรองและส่งต่อผู้ป่วยทันตกรรมจัดฟัน สมาคมทันตแพทย์จัดฟันแห่งประเทศไทย (TAO)",
            "Proffit's Contemporary Orthodontics (6th ed.)"
        ],
        "thai_protocol_highlights": [
            "🇹🇭 จุดเน้นสำคัญในข้อสอบไทย — ค่าปกติ Cephalometric Norms ของคนไทย เทียบกับ Caucasian (Steiner): คนไทยมีลักษณะโครงสร้างใบหน้าและฟันหน้าที่ยื่นกว่าชาวตะวันตกตามธรรมชาติ (Normal Bimaxillary Protrusion tendency) โดยค่าเฉลี่ยคนไทยคือ SNA ≈ 84°–85° (Caucasian 82°), SNB ≈ 81° (Caucasian 80°), ANB ≈ 3°–4° (Caucasian 2°), มุมฟันหน้าล่าง L1-MP ≈ 96°–98° (Caucasian 90°), และมุม Interincisal angle แคบกว่า (≈ 120°–125° เทียบกับ Caucasian 131°)",
            "ดังนั้นในการอ่านผล Cephalometrics ในข้อสอบไทย ต้องดูค่า Norm ที่โจทย์กำหนดมาให้ในวงเล็บเสมอเพื่อตัดสินว่าผู้ป่วยไทยรายนั้นมีความผิดปกติแบบ Skeletal Class I, II หรือ III",
            "แนวทางทันตแพทยสภาและ สคบ. สำหรับการจัดฟันในประเทศไทย: ห้ามให้บริการจัดฟันแฟชั่น และการจัดฟันด้วยเครื่องมือใส (Clear aligner) ต้องอยู่ภายใต้การตรวจวินิจฉัยและวางแผนการรักษาโดยทันตแพทย์ที่มีใบอนุญาตเท่านั้น ไม่สามารถขายตรงให้ผู้ป่วยพิมพ์ปากเองที่บ้านโดยไม่มีทันตแพทย์ตรวจรักษา"
        ]
    },
    {
        "id": "community-burt-who-cdc",
        "title": "Burt & Eklund, WHO & สำนักทันตสาธารณสุข กรมอนามัย กระทรวงสาธารณสุข (Thailand)",
        "specialty": "ทันตกรรมชุมชน",
        "icon": "🌍",
        "color": "#059669",
        "patterns": ["burt", "eklund", "community", "world health organization", "who", "ottawa charter", "cdc", "spaulding", "infection control", "gordis", "biostatistics", "กรมอนามัย", "สปสช", "สำรวจสภาวะสุขภาพช่องปาก"],
        "description": "ตำราและมาตรฐานสากลด้านทันตสาธารณสุข ร่วมกับรายงานการสำรวจสภาวะสุขภาพช่องปากแห่งชาติ กรมอนามัย กระทรวงสาธารณสุข, สิทธิประโยชน์ 3 กองทุนสุขภาพไทย (บัตรทอง/ประกันสังคม/ข้าราชการ) และเกณฑ์ควบคุมการติดเชื้อของทันตแพทยสภา",
        "thai_association": "สำนักทันตสาธารณสุข กรมอนามัย กระทรวงสาธารณสุข, สำนักงานหลักประกันสุขภาพแห่งชาติ (สปสช.) & ชมรมทันตสาธารณสุขแห่งประเทศไทย",
        "thai_references": [
            "รายงานผลการสำรวจสภาวะสุขภาพช่องปากแห่งชาติ ครั้งที่ 8 (พ.ศ. 2560) และ ครั้งที่ 9 (พ.ศ. 2566) สำนักทันตสาธารณสุข กรมอนามัย กระทรวงสาธารณสุข",
            "คู่มือสิทธิประโยชน์ด้านทันตกรรมในระบบหลักประกันสุขภาพแห่งชาติ (สปสช. บัตรทอง), ประกันสังคม และสวัสดิการข้าราชการ",
            "แนวทางการควบคุมและป้องกันการติดเชื้อในคลินิกทันตกรรม ทันตแพทยสภา และกรมอนามัย",
            "Burt and Eklund's Dentistry, Dental Practice, and the Community & WHO Oral Health Surveys Basic Methods (5th ed.)"
        ],
        "thai_protocol_highlights": [
            "🇹🇭 การสำรวจสภาวะสุขภาพช่องปากแห่งชาติของไทย (กรมอนามัย): กลุ่มอายุดัชนีมาตรฐานที่ใช้สำรวจในไทย ได้แก่ อายุ 3 ปี, 5 ปี (ฟันน้ำนม), 12 ปี (ตัวแทนฟันแท้เด็กและการเปรียบเทียบระหว่างประเทศ), 15 ปี (เริ่มประเมินร่องลึกปริทันต์), 35–44 ปี (วัยทำงาน), 60–74 ปี (ผู้สูงอายุ เป้าหมายมีฟันแท้ใช้งานได้อย่างน้อย 20 ซี่ และมีคู่สบฟันหลัง ≥ 4 คู่) และ 80–85 ปี",
            "🇹🇭 ระบบประกันสุขภาพ 3 กองทุนหลักของประเทศไทยที่ออกสอบบ่อย: (1) สิทธิหลักประกันสุขภาพแห่งชาติ (บัตรทอง UCS — สปสช.) ครอบคลุมประชากรไทยที่ไม่มีสิทธิอื่น ใช้จ่ายงบเหมาจ่ายรายหัว (Capitation) ร่วมกับจ่ายตามรายการบริการ (Fee schedule) ในงานส่งเสริมป้องกันและฟันเทียม, (2) สิทธิประกันสังคม (SSS ม.33/ม.39) เบิกงานทันตกรรมพื้นฐาน (ขูด อุด ถอน ผ่าฟันคุด) ได้ตามจริงไม่เกินวงเงินที่กำหนดต่อปี (900 บาท/ปี) โดยไม่ต้องสำรองจ่ายในสถานพยาบาลที่ทำความตกลง, (3) สิทธิสวัสดิการรักษาพยาบาลข้าราชการ (CSMBS กรมบัญชีกลาง) เบิกจ่ายแบบ Fee-for-service ตามอัตราที่กรมบัญชีกลางกำหนด",
            "🇹🇭 มาตรฐานฟลูออไรด์ในน้ำบริโภคของประเทศไทย (ประกาศกระทรวงสาธารณสุข): น้ำบริโภคและน้ำประปามาตรฐานต้องมีฟลูออไรด์ไม่เกิน 0.7 mg/L (ppm) โดยพื้นที่เสี่ยงฟลูออไรด์ในน้ำใต้ดินสูงตามธรรมชาติในไทย (Endemic dental fluorosis) พบมากในภาคเหนือ (แอ่งเชียงใหม่–ลำพูน) และบางพื้นที่ภาคกลาง/ตะวันตก; ส่วนการรณรงค์แปรงฟันของกรมอนามัยใช้หลัก 'แปรงฟันสูตร 2-2-2' (วันละ 2 ครั้ง เช้า-ก่อนนอน ด้วยยาสีฟันฟลูออไรด์, นานครั้งละ ≥ 2 นาที, งดอาหารหลังแปรงฟัน 2 ชั่วโมง)"
        ]
    },
    {
        "id": "thai-dental-laws-interpol",
        "title": "พ.ร.บ. วิชาชีพทันตกรรม, พ.ร.บ. สถานพยาบาล, จรรยาบรรณทันตแพทยสภา & INTERPOL DVI",
        "specialty": "กฎหมายและจรรยาบรรณ",
        "icon": "⚖️",
        "color": "#f43f5e",
        "patterns": ["พ.ร.บ.", "พระราชบัญญัติ", "ข้อบังคับทันตแพทยสภา", "ระเบียบกระทรวงสาธารณสุข", "จรรยาบรรณ", "interpol", "dvi", "forensic", "gustafson", "demirjian", "ประมวลกฎหมาย", "ทันตแพทยสภา"],
        "description": "ประมวลกฎหมายทันตกรรมไทยฉบับสมบูรณ์ที่ใช้สอบ ศ.ท.ส. ครอบคลุม พ.ร.บ.วิชาชีพทันตกรรม 2537/2559, พ.ร.บ.สถานพยาบาล 2541/2559, ระเบียบทันตาภิบาล, จรรยาบรรณทันตแพทยสภา, PDPA และการพิสูจน์อัตลักษณ์บุคคล DVI",
        "thai_association": "ทันตแพทยสภา (Dental Council of Thailand), กรมสนับสนุนบริการสุขภาพ (สบส. กระทรวงสาธารณสุข) & ชมรมนิติทันตวิทยาแห่งประเทศไทย",
        "thai_references": [
            "พระราชบัญญัติวิชาชีพทันตกรรม พ.ศ. 2537 และที่แก้ไขเพิ่มเติม (ฉบับที่ 2) พ.ศ. 2559",
            "พระราชบัญญัติสถานพยาบาล พ.ศ. 2541 และที่แก้ไขเพิ่มเติม (ฉบับที่ 4) พ.ศ. 2559",
            "ข้อบังคับทันตแพทยสภา ว่าด้วยจรรยาบรรณแห่งวิชาชีพทันตกรรม พ.ศ. 2560 และระเบียบกระทรวงสาธารณสุขว่าด้วยเจ้าพนักงานทันตสาธารณสุข (ทันตาภิบาล)",
            "พระราชบัญญัติสุขภาพแห่งชาติ พ.ศ. 2550 (มาตรา 12), พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) และมาตรฐาน INTERPOL DVI / TTVI"
        ],
        "thai_protocol_highlights": [
            "🇹🇭 พ.ร.บ. วิชาชีพทันตกรรม พ.ศ. 2537: มาตรา 28 ห้ามมิให้ผู้ใดประกอบวิชาชีพทันตกรรมโดยไม่ได้ขึ้นทะเบียนและรับใบอนุญาต (ฝ่าฝืนมีโทษจำคุกไม่เกิน 3 ปี หรือปรับไม่เกิน 30,000 บาท หรือทั้งจำทั้งปรับ); มาตรา 43 ผู้ประกอบวิชาชีพที่ถูกสั่งพักใช้ใบอนุญาตแต่ยังแอบทำฟัน มีโทษจำคุกไม่เกิน 2 ปี หรือปรับไม่เกิน 20,000 บาท หรือทั้งจำทั้งปรับ; อายุความกล่าวหา/กล่าวโทษจรรยาบรรณต้องยื่นภายใน 1 ปีนับแต่วันที่รู้เรื่องและรู้ตัวผู้ประพฤติผิด",
            "🇹🇭 พ.ร.บ. สถานพยาบาล พ.ศ. 2541 (แก้ไข 2559): ใบอนุญาตให้ประกอบกิจการสถานพยาบาลมีอายุ 10 ปี (นับแต่วันที่ออกใบอนุญาต); ใบอนุญาตให้ดำเนินการสถานพยาบาลมีอายุ 2 ปี (สิ้นสุดวันที่ 31 ธันวาคมของปีที่สอง); การโฆษณาสถานพยาบาลต้องได้รับอนุมัติข้อความ/ภาพ/เสียงจากผู้อนุญาต (สบส./สสจ.) ก่อนเผยแพร่ และห้ามโฆษณาโอ้อวดเกินจริงหรือลดแลกแจกแถมชักจูงใจ",
            "🇹🇭 ระเบียบกระทรวงสาธารณสุขว่าด้วยทันตาภิบาล: ทันตาภิบาลสามารถถอนฟันน้ำนม, ขูดหินน้ำลาย, อุดฟันถาวร Class I และ Class V ที่ไม่ซับซ้อน ภายใต้การควบคุมของทันตแพทย์ แต่ 'ห้ามถอนฟันคุด ห้ามผ่าตัด ห้ามรักษาคลองรากฟัน และห้ามทำฟันเทียมติดแน่น'"
        ]
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


_NUM_RULE_REGEX = re.compile(
    r"(?:"
    r"(?:มาตรา|ม\.)\s*\d+(?:\s*/\s*\d+)?(?:\s*\(\d+\))?"
    r"|หมวด\s*\d+(?:\s*ข้อ\s*\d+)?"
    r"|พ\.ร\.บ\.[^,\.\n()]{2,38}?พ\.ศ\.\s*\d{4}"
    r"|(?<![A-Za-z0-9])CN\s*(?:XII|XI|IX|X|VIII|VII|VI|IV|V|III|II|I)(?![A-Za-z0-9])"
    r"|(?<![A-Za-z0-9])1\s*:\s*(?:50|80|100|200),000(?:\s*epinephrine)?(?![A-Za-z0-9])"
    r"|(?:[<>≤≥≈]\s*)?\d+(?:,\d{3})*(?:\.\d+)?(?:\s*(?:[–\-~]|ถึง)\s*\d+(?:,\d{3})*(?:\.\d+)?)?"
    r"(?:\s*(?:mg\s*F/kg|mg/kg/dose|mg/kg/day|mg/kg|mL/min|ml/min|mg/dL|mg/L|mm/yr|mcg|µg|mg|g|kg|mL|ml|mmHg|mm|มม\.|cm|ซม\.|µm|ppm|%|°|องศา|สัปดาห์|อาทิตย์|วัน|เดือน|ปี|ขวบ|นาที|ชั่วโมง|ชม\.|บาท|ซี่|คู่สบ|เท่า|สถาน|หน่วยกิต|รอบ|INR|RDT)"
    r"(?:/\s*(?:\d+(?:\.\d+)?\s*)?(?:ml|mL|cc|day|dose|hr|วัน|ชม\.))?)"
    r"|(?<![A-Za-z0-9])(?:Stage\s*(?:IV|III|II|I|[1-4])|Grade\s*[A-D]|Class\s*(?:IV|III|II|I|[1-5]))(?![A-Za-z0-9])"
    r")",
    re.IGNORECASE,
)

_EN_TERM_REGEX = re.compile(
    r"(?<![A-Za-z0-9])"
    r"([A-Z][A-Za-z0-9'\-/]{1,}"
    r"(?:\s+(?:[A-Z][A-Za-z0-9'\-/]*|[a-z]{2,}(?:-[a-z]+)?)){0,4})"
    r"(?![A-Za-z0-9])"
)

_CLOZE_SKIP_EN_TERMS = {
    "The", "And", "For", "With", "This", "That", "From", "Into", "Only", "Most",
    "More", "Less", "High", "Low", "Normal", "Common", "Severe", "Mild", "Moderate",
    "Acute", "Chronic", "Primary", "Secondary", "Type", "Stage", "Class", "Grade",
    "Group", "Step", "Note", "Case", "Stem", "Patient", "Dental", "Dentist",
    "Treatment", "Management", "Diagnosis", "Clinical", "Oral", "Tooth", "Teeth",
    "Root", "Bone", "Pain", "Risk", "Care", "Time", "Day", "Days", "Week", "Weeks",
    "Month", "Months", "Year", "Years", "Age", "Old", "Male", "Female", "Right",
    "Left", "Upper", "Lower", "Before", "After", "First", "Second", "Third",
    "However", "Therefore", "Because", "Although", "Often", "Usually", "Always",
    "Never", "Should", "Must", "Could", "Would", "Might", "Likely", "Unknown",
    "Other", "Another", "Both", "Each", "Every", "All", "None", "Some", "Many",
    "Very", "Much", "Well", "Good", "Best", "Bad", "Poor", "True", "False",
    "Correct", "Incorrect", "Wrong", "Answer", "Option", "Choice", "Question",
    "Check", "Test", "Exam", "Rule", "Law", "Act", "Section", "Code", "Standard",
    "Level", "Rate", "Score", "Index", "Value", "Area", "Zone", "Point", "Side",
    "Part", "Line", "Form", "Size", "Shape", "Color", "Red", "White", "Blue",
    "Black", "Yellow", "Green", "Dark", "Light", "Soft", "Hard", "Deep", "Shallow",
    "Small", "Large", "Long", "Short", "Fast", "Slow", "Early", "Late", "New",
    "Same", "Different", "Similar", "Specific", "General", "Direct", "Indirect",
    "Active", "Passive", "Local", "Systemic", "Routine", "Emergency", "Urgent",
    "Elective", "Immediate", "Delayed", "Complete", "Partial", "Total", "Single",
    "Double", "Multiple", "Simple", "Complex", "Major", "Minor", "Main", "Basic",
    "Key", "Core", "Real", "High-Yield", "Pearl", "Takeaway", "Pitfall",
    "NL", "NL2", "Stem", "Figure", "Image", "Table", "Example", "History",
    "Finding", "Findings", "Symptom", "Symptoms", "Sign", "Signs", "Lesion",
    "Lesions", "Disease", "Condition", "Disorder", "Procedure", "Therapy",
    "Method", "Technique", "Factor", "Factors", "Cause", "Causes", "Effect",
    "Effects", "Result", "Results", "Outcome", "Option", "Options", "Study",
    "Studies", "Report", "Data", "Level", "Levels", "Dose", "Dosage", "Amount",
    "Number", "Range", "Mean", "Average", "Limit", "Max", "Min", "Normal range",
    "Primary stress", "Lower complete", "Upper complete", "Known complication",
}

_CLOZE_EN_TRAILING_NOISE = {
    "is", "are", "was", "were", "be", "been", "being", "has", "have", "had",
    "can", "could", "may", "might", "must", "should", "will", "would", "do", "does",
    "and", "or", "for", "with", "from", "into", "that", "which", "who", "whom",
    "when", "where", "while", "during", "after", "before", "under", "over",
    "between", "among", "through", "about", "against", "without", "within",
    "also", "very", "more", "most", "often", "usually", "always", "never",
    "typically", "commonly", "frequently", "primarily", "mainly", "especially",
    "drastically", "significantly", "reduces", "increases", "causes", "leads",
    "prevents", "protects", "helps", "shows", "indicates", "suggests", "requires",
}

_RULE_THRESHOLD_CUE_RE = re.compile(
    r"(?:[<>≤≥≈]|ไม่เกิน|อย่างน้อย|ตั้งแต่|เกินอายุ|หลังอายุ|ก่อนอายุ|จนถึงอายุ|จนกระทั่งอายุ|"
    r"อายุความ|ต่ออายุ|กำหนดเวลา|ครบรอบ|1\s*รอบ|ภายใน|พ้นกำหนด|ระวางโทษ|"
    r"จำคุก|ปรับ|พักใช้|เพิกถอน|ช่วงอายุ|เกณฑ์|ค่าปกติ|ตัดยอด|จุดตัด|เพดาน|"
    r"(?<![ก-์])เป้าหมาย|(?<![ก-์])ปลอดภัย|สูงสุด|ต่ำสุด|เฉลี่ย|cut[\s\-]?off|threshold|target|limit|normal|ptd|mrd|cltd|std|"
    r"ใบอนุญาต|สัญญา|ฟ้อง|บังคับ|ขึ้นไป|ต่ำกว่า|สูงกว่า|น้อยกว่า|มากกว่า|เท่ากับ)",
    re.IGNORECASE,
)
_AGE_PATIENT_CUE_RE = re.compile(r"(?:อายุ|วัย|ขวบ|เด็ก|ทารก|ผู้ป่วย|ชาย|หญิง|คนไข้|นักเรียน|สามเณร|ประถม)")
_VIGNETTE_HISTORY_CUE_RE = re.compile(
    r"(?:เมื่อ\s*$|เมื่อ\s+\S+\s*$|มานาน|เป็นเวลา|นาน\s*$|มาแล้ว\s*$|มาตรวจ|มาหา|มาด้วย|มา\s*$|"
    r"ผ่าหัวใจ|ผ่าตัด.{0,12}เมื่อ|ถอนฟัน.{0,12}เมื่อ|ใส่ฟัน.{0,12}เมื่อ|ทำครอบ.{0,8}มา|ล้ม.{0,18}ใน\s*$)"
)
_SENTENCE_SPLIT_RE = re.compile(r"(?<=[.\n!?])\s+|\n+|(?<=ครับ)\s+|(?<=ค่ะ)\s+")


def _split_clean_sentences(text: str) -> List[str]:
    """Split explanation text into clean, readable sentences without breaking decimals or Thai abbreviations."""
    clean = re.sub(r"\s+", " ", (text or "")).strip()
    if not clean:
        return []
    # Protect common Thai legal & metric abbreviations and decimal numbers from splitting on '.'
    protected = re.sub(r"(?i)(พ\.ร\.บ\.|พ\.ร\.ฎ\.|พ\.ศ\.|ค\.ศ\.|ป\.พ\.พ\.|ป\.วิ\.พ\.|ป\.วิ\.อ\.|ป\.อ\.|พ\.ร\.ก\.|สสจ\.|สบส\.|สปสช\.|รพ\.สต\.|รพ\.|กทม\.|สธ\.|อย\.|etc\.|e\.g\.|i\.e\.|vs\.|approx\.|มม\.|ซม\.|ชม\.|กก\.|ม\.|ด\.ร\.|ผศ\.|รศ\.|ศ\.|นพ\.|ทพ\.|ทพญ\.|อสม\.|ฯลฯ)", lambda m: m.group(0).replace(".", "\u0000"), clean)
    protected = re.sub(r"(?<=\d)\.(?=\d)", "\u0000", protected)
    raw_parts = re.split(r"(?<=[.!?])\s+|\s+(?=ดังนั้น|สรุป|สรุปคือ|หลักการคือ|กล่าวคือ|โดยมีเกณฑ์|หาก\s|ในกรณีที่)", protected)
    out = [p.replace("\u0000", ".").strip() for p in raw_parts if len(p.strip()) >= 12]
    return out if out else [clean]


def _trim_to_sentence_window(sentence: str, blank_start: int, blank_end: int, max_len: int = 285) -> str:
    """Keep a complete, grammatical sentence or word-boundary window around the blank—never slice mid-word."""
    s = re.sub(r"\s+", " ", sentence).strip()
    if len(s) <= max_len:
        return s

    center = (blank_start + blank_end) // 2
    half = (max_len - 12) // 2
    win_start = max(0, min(center - half, blank_start - 35))
    win_end = min(len(s), max(win_start + max_len, blank_end + 35))
    if win_end - win_start > max_len:
        win_start = max(0, blank_end + 40 - max_len) if blank_end > max_len - 40 else 0
        win_end = min(len(s), win_start + max_len)

    prefix = ""
    suffix = ""
    if win_start > 0:
        # Snap forward to the next space so we never start mid-word
        sp = s.find(" ", win_start)
        if sp != -1 and sp < blank_start - 4:
            win_start = sp + 1
        prefix = "..."
    if win_end < len(s):
        # Snap backward to the previous space so we never end mid-word
        sp = s.rfind(" ", max(blank_end + 1, win_start), win_end)
        if sp != -1 and sp >= blank_end:
            win_end = sp
        suffix = "..."

    return f"{prefix}{s[win_start:win_end].strip()}{suffix}"


_CLOZE_EN_MID_BREAK = {
    "is", "are", "was", "were", "be", "been", "being", "has", "have", "had",
    "can", "could", "may", "might", "must", "should", "will", "would", "do", "does",
    "that", "which", "who", "whom", "when", "where", "while", "because", "although",
    "often", "usually", "always", "never", "typically", "commonly", "frequently",
    "primarily", "mainly", "especially", "drastically", "significantly",
    "reduces", "increases", "causes", "leads", "prevents", "protects", "helps",
    "shows", "indicates", "suggests", "requires", "remains", "occurs", "presents",
    "predisposes", "resulting", "including",
}


def _clean_en_term(text: str, start: int, end: int) -> Tuple[int, int, str]:
    """Truncate at prose verbs/adverbs and strip trailing prepositions so clinical phrases stay intact."""
    raw = text[start:end].strip()
    parts = raw.split()
    for idx in range(1, len(parts)):
        if parts[idx].lower().rstrip(",.;:") in _CLOZE_EN_MID_BREAK:
            parts = parts[:idx]
            break
    while len(parts) > 1 and parts[-1].lower().rstrip(",.;:") in _CLOZE_EN_TRAILING_NOISE:
        parts.pop()
    while len(parts) > 1 and parts[0].lower() in _CLOZE_EN_TRAILING_NOISE:
        parts.pop(0)
    raw = " ".join(parts).strip()
    if not raw:
        return start, end, ""
    new_start = text.find(raw, max(0, start - 2), end + 2)
    if new_start == -1:
        return start, end, raw
    return new_start, new_start + len(raw), raw


def _is_vignette_number(text: str, start: int, end: int, match_str: str) -> bool:
    """Return True if a matched number is non-memorable vignette/patient data (age, weight, BP, history)."""
    ms = (match_str or "").strip()
    if len(ms) < 2:
        return True
    before = text[max(0, start - 36):start]
    after = text[end:min(len(text), end + 28)]
    combined_ctx = f"{before} {ms} {after}"

    has_threshold_cue = bool(_RULE_THRESHOLD_CUE_RE.search(before[-28:])) or bool(
        re.search(r"^(?:\s*(?:ขึ้นไป|ต่อรอบ|ต่อปี|ต่อวัน|ต่อสัปดาห์|ก่อนทำหัตถการ|อย่างน้อย|ไม่เกิน))", after)
    ) or bool(re.match(r"^[<>≤≥≈]", ms))

    # 1. Patient-specific vitals/labs measured with '=' or ':' without threshold operator (e.g., "eGFR = 88 ml/min", "BP 140/96 mmHg")
    if re.search(r"(?:BP|ความดัน|ชีพจร|eGFR|CrCl|FBS|HbA1c|Hb|INR)\s*(?:ได้|คือ)?\s*[=:]?\s*$", before[-24:], re.IGNORECASE) and not has_threshold_cue:
        return True
    if "=" in before[-8:] and not has_threshold_cue:
        return True

    # 2. Explicit legal statutes/sections & cranial nerves/classes/doses per kg are always rules
    if re.search(r"^(?:มาตรา|ม\.|หมวด|พ\.ร\.บ\.|CN\s*[IVX]+|1\s*:|Stage|Grade|Class)", ms, re.IGNORECASE):
        return False
    if re.search(r"(?:mg/kg|mg\s*F/kg|mL/min|ml/min|mg/dL|mg/L|mm/yr|ppm|หน่วยกิต|สถาน|INR|RDT|epinephrine)", ms, re.IGNORECASE):
        return False

    # 3. Reject bare unit counts for teeth lost/affected ("2 ซี่", "1 ซี่") unless total dentition ("20 ซี่", "32 ซี่")
    if re.search(r"ซี่$", ms):
        num_m = re.match(r"(\d+)", ms)
        if num_m and int(num_m.group(1)) not in (20, 28, 32):
            return True

    # 4. Patient weight ("เด็กหนัก 8 kg", "น้ำหนัก 50 kg", "20 kg") is vignette data, never drug dosing
    if re.search(r"(?:^|\d\s*)kg$", ms, re.IGNORECASE):
        if re.search(r"(?:น้ำหนัก|หนัก|เด็ก|ผู้ป่วย)", before[-22:]) or not has_threshold_cue:
            return True

    # 5. Patient/cohort age ("ผู้ป่วยหญิงอายุ 60 ปี", "เด็กอายุ 12 ปี", "วัย 15 เดือน", "เด็กประถม... มีอายุ 11-12 ปี")
    if re.search(r"(?:ปี|ขวบ|เดือน)$", ms):
        is_license_age = "ใบอนุญาต" in combined_ctx and re.search(r"(?:อายุ|ต่ออายุ|ปี)", combined_ctx)
        if is_license_age:
            return False
        if _AGE_PATIENT_CUE_RE.search(before[-34:]) and not has_threshold_cue:
            return True
        if re.search(r"^(?:\s*ก่อน)", after):
            return True
        if _VIGNETTE_HISTORY_CUE_RE.search(before[-28:]) and not has_threshold_cue:
            return True

    # 6. Case symptom durations ("2-3 วัน", "มา 3 วัน", "30 นาทีก่อน") without rule framing
    if re.search(r"(?:วัน|สัปดาห์|อาทิตย์|นาที|ชั่วโมง|ชม\.)$", ms):
        if _VIGNETTE_HISTORY_CUE_RE.search(before[-28:]) and not has_threshold_cue:
            return True
        if re.search(r"^(?:\s*ก่อน)", after) and "ก่อนทำหัตถการ" not in after and "ก่อนนอน" not in after:
            return True

    # 7. Case-specific lesion/gap measurements ("ช่องว่างฟันหน้า 2 มม.", "ขนาด 2 mm")
    if re.search(r"(?:mmHg|mm|มม\.|cm|ซม\.|ml|mL|บาท)$", ms, re.IGNORECASE):
        if re.search(r"(?:วัดได้|ขนาด|ช่องว่าง|แผล|ก้อน|ร่องลึก|ลึก\s*=|กว้าง)\s*[=:]?\s*$", before[-28:], re.IGNORECASE) and not has_threshold_cue:
            return True

    return False


_KNOWN_SHORT_CLINICAL_TERMS = {
    "RMGIC", "GIC", "MTA", "NaOCl", "EDTA", "CHX", "MRONJ", "CBCT",
    "ANUG", "DMFT", "ICDAS", "PRGF", "PRF", "DNA", "BOP", "CEJ", "CAL",
}


def _score_en_candidate(text: str, start: int, end: int, term: str) -> int:
    """Score pedagogical value of an English clinical term, heavily penalizing parenthetical gloss leaks."""
    t_clean = term.strip()
    t_low = t_clean.lower()
    if t_clean in _CLOZE_SKIP_EN_TERMS or t_low in {s.lower() for s in _CLOZE_SKIP_EN_TERMS}:
        return -100

    before_all = text[:start]
    last_open = before_all.rfind("(")
    last_close = before_all.rfind(")")
    in_parens = last_open > last_close and ")" in text[end:min(len(text), end + 30)]

    is_known_short = t_clean in _KNOWN_SHORT_CLINICAL_TERMS or t_clean.upper() in _KNOWN_SHORT_CLINICAL_TERMS
    if len(t_clean) < 5 and (in_parens or not is_known_short):
        return -100
    if " " not in t_clean and len(t_clean) < 6 and not is_known_short and not re.search(r"(?:oma|itis|osis|cillin|azole|farin|mg|pulp|cyst|nerve|duct|apex|root|gland)$", t_low):
        return -50

    before = text[max(0, start - 35):start]
    after = text[end:min(len(text), end + 20)]

    score = 22
    if is_known_short:
        score += 18
    if " " in t_clean:
        score += 12  # Multi-word named conditions/nerves/pathogens
    if len(t_clean) >= 12:
        score += 8

    # High-yield clinical/anatomic/pharmacologic morphology bonus
    if re.search(
        r"(?:itis|osis|oma|pathy|algia|penia|emia|plasia|necrosis|stomatitis|candid|"
        r"neuralgia|caries|hypoplasia|dysplasia|hypertrophy|atrophy|keratosis|leukoplakia|"
        r"erythroplakia|ameloblastoma|osteomyelitis|osteoradionecrosis|abscess|cyst|ulcer|"
        r"syndrome|nerve|artery|vein|muscle|gland|duct|sinus|foramen|fossa|ligament|suture|"
        r"cillin|mycin|azole|zepine|profen|statin|farin|caine|prednisolone|paracetamol|"
        r"amoxicillin|chlorhexidine|fluoride|calcium|epinephrine|lidocaine|mepivacaine|"
        r"rmgic|gic|mta|biodentine|zirconia|amalgam|composite|sealant|varnish|prognosis|"
        r"candida|streptococcus|staphylococcus|actinomyces|porphyromonas|herpetic|viral|fungal|"
        r"denture|pulpitis|periodontitis|gingivitis|periapical|apical|condylar|hemorrhage|thromb)",
        t_low,
    ):
        score += 22

    # Diagnostic/causal Thai cue immediately preceding the term
    if re.search(
        r"(?:เกิดจาก|สาเหตุ|ติดเชื้อ|เชื้อรา|แบคทีเรีย|ไวรัส|วินิจฉัย|เข้าได้กับ|สงสัย|"
        r"ลักษณะของ|ภาวะ|โรค|กลุ่มอาการ|ต่อ|กดทับ|เส้นประสาท|บริเวณ|กล้ามเนื้อ|ด้วย|"
        r"ประเมิน|ยาทางเลือก|ให้ยา|เลือกใช้|ใช้ยา|รักษาคือ|รักษาด้วย|เรียกว่า|คือ|ตามหลัก|ดัชนี)\s*$",
        before,
    ):
        score += 18

    # Check if term sits inside parentheses "(...)" — usually a Thai-to-English gloss or alias!
    if in_parens:
        pre_paren = text[max(0, last_open - 22):last_open].strip()
        # Preceded by Thai words right outside '(' -> strong giveaway probability (e.g., "ปากแห้ง (Xerostomia)")
        if re.search(r"[\u0E00-\u0E7F]$", pre_paren):
            score -= 80
        else:
            score -= 45

    # Penalize if immediately followed by a short parenthetical acronym/brand that leaks the blank ("Aspirin (ASA)")
    if re.match(r"^\s*\([A-Za-z0-9\s\-/]{2,20}\)", after):
        score -= 14

    return score


def _score_num_candidate(text: str, start: int, end: int, match_str: str) -> int:
    """Score pedagogical value of a numeric/legal match."""
    ms = match_str.strip()
    if _is_vignette_number(text, start, end, ms):
        return -100

    before = text[max(0, start - 30):start]
    score = 32
    if re.search(r"มาตรา|ม\.|หมวด|พ\.ร\.บ\.|หน่วยกิต|สถาน", ms):
        score += 28
    elif re.search(r"mg/kg|mg\s*F/kg|mL/min|ml/min|mg/dL|ppm|INR|1\s*:", ms, re.IGNORECASE):
        score += 26
    elif re.search(r"[–\-~]|ถึง|[<>≤≥≈]", ms):
        score += 18
    elif re.search(r"^(?:Stage|Grade|Class|CN)\s", ms, re.IGNORECASE):
        score += 16

    if _RULE_THRESHOLD_CUE_RE.search(before):
        score += 12
    # Down-rank bare % ("25%", "60%") inside quoted ad examples or non-cutoff prose
    if re.fullmatch(r"\d+(?:\.\d+)?%", ms):
        if re.match(r"^\s+[A-Za-z]", text[end:end + 15]):
            score -= 16
        elif "'" in before[-20:] or "เช่น" in before[-24:] or not re.search(r"[<>≤≥]|เกณฑ์|อย่างน้อย|ไม่เกิน", before):
            score -= 20
    return score


def _extract_numeric_rules(texts: List[str]) -> List[Dict[str, Any]]:
    """Extract clinical thresholds, doses, durations, and legal sections with their surrounding rule sentence."""
    extracted: List[Dict[str, Any]] = []
    seen_vals = set()
    for q_id, txt, ref in texts:
        if not txt:
            continue
        for sent in _split_clean_sentences(txt):
            matches = [
                m.group(0).strip()
                for m in _NUM_RULE_REGEX.finditer(sent)
                if not _is_vignette_number(sent, m.start(), m.end(), m.group(0))
            ]
            if not matches:
                continue
            highlight_val = " | ".join(dict.fromkeys(matches[:3]))
            norm_key = highlight_val.lower() + "::" + re.sub(r"\s+", " ", sent[:50]).lower()
            if norm_key in seen_vals:
                continue
            seen_vals.add(norm_key)
            first_m = _NUM_RULE_REGEX.search(sent)
            b_start, b_end = (first_m.start(), first_m.end()) if first_m else (0, min(40, len(sent)))
            extracted.append({
                "question_id": q_id,
                "highlight_value": highlight_val,
                "context": _trim_to_sentence_window(sent, b_start, b_end, max_len=260),
                "reference": ref,
            })
            if len(extracted) >= 35:
                return extracted
    return extracted


def _pick_best_cloze_span(text: str) -> Optional[Dict[str, Any]]:
    """Pick the single highest-yield Cloze blank (start, end, target, kind, score) inside a clean sentence."""
    candidates: List[Dict[str, Any]] = []

    for m in _NUM_RULE_REGEX.finditer(text):
        target = m.group(0).strip()
        sc = _score_num_candidate(text, m.start(), m.end(), target)
        if sc > 0:
            # Map exact trimmed span inside text
            t_start = text.find(target, m.start(), m.end() + 1)
            if t_start != -1:
                candidates.append({
                    "start": t_start,
                    "end": t_start + len(target),
                    "target": target,
                    "kind": "numeric_law",
                    "score": sc,
                })

    for m in _EN_TERM_REGEX.finditer(text):
        c_start, c_end, target = _clean_en_term(text, m.start(), m.end())
        if not target:
            continue
        sc = _score_en_candidate(text, c_start, c_end, target)
        if sc > 0:
            candidates.append({
                "start": c_start,
                "end": c_end,
                "target": target,
                "kind": "clinical_term",
                "score": sc,
            })

    if not candidates:
        return None
    candidates.sort(key=lambda c: (c["score"], len(c["target"])), reverse=True)
    return candidates[0]


def _build_cloze_flashcard(
    q_id: int,
    card_type: str,
    source_text: str,
    question_prompt: str,
    correct_choice_text: str,
    ref_str: str,
    cog: str,
    task_name: str,
) -> Optional[Dict[str, Any]]:
    """Build an interactive Active Recall Flashcard using high-yield Cloze logic (never blinding patient ages)."""
    clean_text = re.sub(r"\s+", " ", (source_text or "")).strip()
    if len(clean_text) < 20:
        return None

    sentences = _split_clean_sentences(clean_text)
    chosen_sent = sentences[0] if sentences else clean_text
    best_span: Optional[Dict[str, Any]] = None
    for sent in sentences:
        sp = _pick_best_cloze_span(sent)
        if sp and (not best_span or sp["score"] > best_span["score"]):
            best_span = sp
            chosen_sent = sent

    hidden_answers: List[str] = []
    if best_span:
        window = _trim_to_sentence_window(chosen_sent, best_span["start"], best_span["end"], max_len=260)
        target = best_span["target"]
        if target in window:
            masked_front = window.replace(target, "【 ____?____ 】", 1)
            hidden_answers = [target]
            back_text = window
        else:
            masked_front = window
            back_text = window
    else:
        back_text = _trim_to_sentence_window(chosen_sent, 0, min(40, len(chosen_sent)), max_len=260)
        masked_front = back_text

    mode = "cloze" if hidden_answers else "q_to_rule"
    if mode == "q_to_rule":
        q_clean = re.sub(r"\s+", " ", (question_prompt or "")).strip()
        if not q_clean or len(q_clean) < 10:
            return None
        q_win = _trim_to_sentence_window(q_clean, 0, min(30, len(q_clean)), max_len=190)
        masked_front = f"❓ โจทย์ถามว่า: \"{q_win}\"\n\n💡 จงนึกหลักการตัดสินและคำตอบก่อนเปิดดู!"
        hidden_answers = [correct_choice_text] if correct_choice_text else []

    return {
        "id": f"fc-{card_type}-{q_id}",
        "question_id": q_id,
        "card_type": card_type,
        "mode": mode,
        "cognitive_level": cog,
        "task": task_name,
        "front": masked_front,
        "hidden_terms": hidden_answers,
        "back": back_text,
        "correct_choice_text": correct_choice_text,
        "reference": ref_str,
    }


# ─────────────────────────────────────────────────────────────────────────────
# 3. API ENDPOINTS: EXAM-DRIVEN LEARNING & TEXTBOOK PEDAGOGY
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/overview")
def get_learning_overview(request: Request, db: Session = Depends(get_db)):
    """Return all 83 Must-Know Topics and Gold-Standard Textbooks extracted from the real NL exam questions."""
    _check_rate_limit(f"learning-overview:ip:{_get_client_ip(request)}", max_attempts=60, window_seconds=300)
    query = (
        db.query(
            models.Question.id,
            models.Question.category,
            models.Question.task,
            models.Question.must_know_topic,
            models.Question.cognitive_level,
            models.Question.explanation,
            models.Question.source_exam,
        )
        .filter(models.Question.exam_origin == "real_exam")
    )
    if is_mock_70_locked():
        query = query.filter(~models.Question.source_exam.like("%2570%"))
    questions = query.all()

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
            "thai_association": tb_data.get("thai_association", ""),
            "thai_references": tb_data.get("thai_references", []),
            "thai_protocol_highlights": tb_data.get("thai_protocol_highlights", []),
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
    flashcards: List[Dict[str, Any]] = []
    triggers_map: List[Dict[str, Any]] = []
    number_sources: List[Any] = []

    seen_principles = set()
    seen_pearls = set()
    seen_pitfalls = set()
    seen_flashcards = set()
    seen_triggers = set()

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
        actual_correct = (exp.get("correct_answer") or q.correct_answer or "").strip()
        choice_text_map = {c.label.strip().upper(): c.text for c in q.choices}
        correct_choice_text = choice_text_map.get(actual_correct.upper(), "")

        if key_takeaway:
            number_sources.append((q.id, key_takeaway, ref_str or tb_info["title"]))
        if clinical_pearl:
            number_sources.append((q.id, clinical_pearl, ref_str or tb_info["title"]))
        if core_principle:
            number_sources.append((q.id, core_principle, ref_str or tb_info["title"]))

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

        # 2b. Build Active Recall Cloze Flashcards & 1-Line Exam Triggers
        if len(flashcards) < 40 and key_takeaway:
            norm_fc = re.sub(r"\s+", " ", key_takeaway[:75]).lower()
            if norm_fc not in seen_flashcards:
                seen_flashcards.add(norm_fc)
                card = _build_cloze_flashcard(
                    q_id=q.id,
                    card_type="takeaway",
                    source_text=key_takeaway,
                    question_prompt=q_display,
                    correct_choice_text=correct_choice_text,
                    ref_str=ref_str or tb_info["title"],
                    cog=cog,
                    task_name=task_name,
                )
                if card:
                    flashcards.append(card)

        if len(triggers_map) < 30 and q_display and (correct_choice_text or key_takeaway):
            norm_tr = re.sub(r"\s+", " ", (key_takeaway or correct_choice_text)[:60]).lower()
            if norm_tr not in seen_triggers:
                seen_triggers.add(norm_tr)
                clue_stem = (q.stem or "").strip()
                cue = q_display if len(q_display) >= 20 else clue_stem
                triggers_map.append({
                    "question_id": q.id,
                    "cognitive_level": cog,
                    "trigger_clue": cue[:160] + ("..." if len(cue) > 160 else ""),
                    "target_answer": correct_choice_text or actual_correct,
                    "rule_summary": key_takeaway,
                    "reference": ref_str or tb_info["title"],
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
        actual_ans = actual_correct.upper()
        if choice_exps and isinstance(choice_exps, dict) and len(differential_items) < 30:
            breakdown = []
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
        topic_meta = get_topic_meta(q.must_know_topic or "", q.category or category)
        guided_cases.append({
            "id": q.id,
            "category": q.category,
            "task": task_name,
            "must_know_topic": q.must_know_topic,
            "topic_title_th": topic_meta["title_th"],
            "cognitive_level": cog,
            "source_exam": q.source_exam,
            "image_path": q.image_path,
            "correct_choice_text": correct_choice_text,
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
                "correct_choice_text": correct_choice_text,
                "key_takeaway": key_takeaway,
                "common_pitfall": common_pitfall,
                "choice_explanations": choice_exps if isinstance(choice_exps, dict) else {},
            },
            # Raw question object for compatibility with practice mode (answers loaded dynamically via /api/explain)
            "raw_question": {
                "id": q.id,
                "question_text": q.question_text,
                "stem": q.stem,
                "proposition": q.proposition,
                "category": q.category,
                "task": q.task,
                "correct_answer": None,
                "explanation": None,
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

    # Match Thai Specialty Associations, Thai Textbooks & Thailand-specific Protocols
    matched_thai_protocols = []
    for tb in CANONICAL_TEXTBOOKS:
        if tb["id"] == module_id or tb["specialty"] == category:
            matched_thai_protocols.append({
                "id": tb["id"],
                "title": tb["title"],
                "specialty": tb["specialty"],
                "icon": tb["icon"],
                "color": tb["color"],
                "thai_association": tb.get("thai_association", ""),
                "thai_references": tb.get("thai_references", []),
                "thai_protocol_highlights": tb.get("thai_protocol_highlights", []),
            })

    must_know_numbers = _extract_numeric_rules(number_sources)
    pathways_list = get_topic_pathways(
        module_id=module_id,
        category=category,
        questions=sorted_questions,
        title_th=title_th,
        parse_fn=_parse_explanation,
        classify_tb_fn=classify_textbook,
    )

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
        "thai_protocols": matched_thai_protocols,
        "textbook_references": sorted_citations[:15],
        "task_modules": task_modules_sorted,
        "differential_comparisons": differential_items,
        "pearls": pearls_list,
        "pitfalls": pitfalls_list,
        "guided_cases": guided_cases,
        "flashcards": flashcards,
        "pathways": pathways_list,
        "high_yield_sheet": {
            "must_know_numbers": must_know_numbers,
            "triggers_map": triggers_map,
        },
    }


@router.get("/mistake-clinic")
def get_mistake_clinic(
    request: Request,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Analyze the logged-in student's past wrong answers and due spaced-repetition reviews to prescribe targeted lessons and parallel twin drills."""
    _check_rate_limit(f"learning-clinic:u:{current_user.id}", max_attempts=60, window_seconds=300)
    ua_query = (
        db.query(models.UserAnswer, models.Question)
        .join(models.ExamSession, models.ExamSession.id == models.UserAnswer.session_id)
        .join(models.Question, models.Question.id == models.UserAnswer.question_id)
        .filter(
            models.ExamSession.user_id == current_user.id,
            models.Question.exam_origin != "duplicate_archive",
        )
    )
    if is_mock_70_locked():
        ua_query = ua_query.filter(~models.Question.source_exam.like("%2570%"))
    user_answers = ua_query.order_by(models.UserAnswer.id.desc()).all()

    topic_stats: Dict[str, Dict[str, Any]] = {}
    wrong_cases: List[Dict[str, Any]] = []
    seen_wrong_q = set()
    answered_q_ids = set()

    for ua, q in user_answers:
        answered_q_ids.add(q.id)
        tid = q.must_know_topic or "General-Clinical-Concept"
        meta = get_topic_meta(tid, q.category or "")
        if tid not in topic_stats:
            topic_stats[tid] = {
                "topic_id": tid,
                "title_th": meta["title_th"],
                "title_en": meta["title_en"],
                "category": q.category or "อื่นๆ",
                "total_attempts": 0,
                "wrong_count": 0,
                "correct_count": 0,
                "wrong_question_ids": [],
            }
        ts = topic_stats[tid]
        ts["total_attempts"] += 1
        if ua.is_correct == 1:
            ts["correct_count"] += 1
        else:
            ts["wrong_count"] += 1
            if q.id not in seen_wrong_q:
                seen_wrong_q.add(q.id)
                ts["wrong_question_ids"].append(q.id)
                exp = _parse_explanation(q.explanation)
                ref_str = (exp.get("reference") or exp.get("legal_citation") or "").strip()
                tb_info = classify_textbook(ref_str, q.category or "")
                choice_exps = exp.get("choice_explanations") or {}
                user_choice = (ua.selected_choice or "").strip()
                correct_ans = (exp.get("correct_answer") or q.correct_answer or "").strip()
                wrong_cases.append({
                    "question_id": q.id,
                    "topic_id": tid,
                    "topic_title_th": meta["title_th"],
                    "category": q.category,
                    "task": q.task,
                    "cognitive_level": q.cognitive_level or "A",
                    "source_exam": q.source_exam,
                    "question_preview": (q.proposition or q.question_text or q.stem or "")[:180],
                    "selected_choice": user_choice or "ไม่ตอบ",
                    "correct_answer": correct_ans,
                    "key_takeaway": (exp.get("key_takeaway") or exp.get("why_correct") or "").strip(),
                    "common_pitfall": (exp.get("common_pitfall") or "").strip(),
                    "selected_choice_reason": (
                        "ข้ามข้อ / ไม่ได้เลือกคำตอบในรอบนั้น"
                        if not user_choice
                        else str(choice_exps.get(user_choice, ""))
                    ),
                    "correct_choice_reason": str(choice_exps.get(correct_ans, "")),
                    "reference": ref_str or tb_info["title"],
                })

    weak_topics = []
    for tid, ts in topic_stats.items():
        if ts["wrong_count"] > 0:
            acc = round((ts["correct_count"] / ts["total_attempts"]) * 100) if ts["total_attempts"] > 0 else 0
            weak_topics.append({
                **ts,
                "accuracy_pct": acc,
            })

    weak_topics.sort(key=lambda x: (-x["wrong_count"], x["accuracy_pct"]))

    # Find parallel twin questions in top 3 weak topics that the user hasn't mastered yet
    parallel_questions = []
    top_weak_ids = [t["topic_id"] for t in weak_topics[:3]]
    if top_weak_ids:
        cand_query = (
            db.query(models.Question)
            .options(selectinload(models.Question.choices))
            .filter(
                models.Question.must_know_topic.in_(top_weak_ids),
                models.Question.exam_origin == "real_exam",
            )
        )
        if is_mock_70_locked():
            cand_query = cand_query.filter(~models.Question.source_exam.like("%2570%"))
        candidates = cand_query.limit(40).all()
        # Prefer unseen questions first, then previously missed
        candidates.sort(key=lambda q: (0 if q.id not in answered_q_ids else (1 if q.id in seen_wrong_q else 2), q.id))
        for pq in candidates[:12]:
            revealed = pq.id in answered_q_ids or current_user.role == "admin"
            parallel_questions.append({
                "id": pq.id,
                "question_text": pq.question_text,
                "stem": pq.stem,
                "proposition": pq.proposition,
                "category": pq.category,
                "task": pq.task,
                "correct_answer": pq.correct_answer if revealed else None,
                "explanation": pq.explanation if revealed else None,
                "source_exam": pq.source_exam,
                "image_path": pq.image_path,
                "cognitive_level": pq.cognitive_level,
                "must_know_topic": pq.must_know_topic,
                "choices": [{"label": c.label, "text": c.text} for c in pq.choices],
            })

    # Count Spaced Repetition due questions
    now_ts = int(time.time())
    due_count = (
        db.query(models.UserQuestionStat)
        .filter(
            models.UserQuestionStat.user_id == current_user.id,
            models.UserQuestionStat.next_review_date <= now_ts,
        )
        .count()
    )

    return {
        "has_history": len(user_answers) > 0,
        "total_answered": len(user_answers),
        "total_wrong_unique": len(wrong_cases),
        "due_review_count": due_count,
        "weak_topics": weak_topics[:15],
        "wrong_cases": wrong_cases[:30],
        "parallel_drill_questions": parallel_questions,
    }


@router.get("/topic/{topic_id}")
def get_topic_learning_module(
    topic_id: str,
    request: Request,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Extract and synthesize a complete Textbook & Evidence teaching module from all exam questions in a Must-Know Topic."""
    _check_rate_limit(f"learning-topic:u:{current_user.id}", max_attempts=90, window_seconds=300)
    _check_rate_limit(f"learning-topic:ip:{_get_client_ip(request)}", max_attempts=120, window_seconds=300)
    query = (
        db.query(models.Question)
        .options(selectinload(models.Question.choices))
        .filter(
            models.Question.must_know_topic == topic_id,
            models.Question.exam_origin == "real_exam",
        )
    )
    if is_mock_70_locked():
        query = query.filter(~models.Question.source_exam.like("%2570%"))
    questions = query.all()

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
    request: Request,
    topic: Optional[str] = Query(None),
    limit: int = Query(120, gt=0, le=300),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Extract and synthesize a teaching module for a specific Gold-Standard Textbook / Evidence Guideline."""
    _check_rate_limit(f"learning-textbook:u:{current_user.id}", max_attempts=60, window_seconds=300)
    _check_rate_limit(f"learning-textbook:ip:{_get_client_ip(request)}", max_attempts=90, window_seconds=300)
    tb_meta = next((t for t in CANONICAL_TEXTBOOKS if t["id"] == textbook_id), None)
    if not tb_meta:
        raise HTTPException(status_code=404, detail=f"Textbook '{textbook_id}' not found")

    query = (
        db.query(models.Question)
        .options(selectinload(models.Question.choices))
        .filter(models.Question.exam_origin == "real_exam")
    )
    if is_mock_70_locked():
        query = query.filter(~models.Question.source_exam.like("%2570%"))
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


@router.get("/pathway/{topic_id}")
def get_topic_pathway_endpoint(
    topic_id: str,
    request: Request,
    db: Session = Depends(get_db),
):
    """Lightweight endpoint returning curated & auto-extracted Pathways/Protocols for a Must-Know Topic."""
    _check_rate_limit(f"learning-pathway:ip:{_get_client_ip(request)}", max_attempts=90, window_seconds=300)
    if topic_id in CURATED_TOPIC_PATHWAYS:
        meta = get_topic_meta(topic_id)
        return {
            "topic_id": topic_id,
            "title_th": meta["title_th"],
            "pathways": CURATED_TOPIC_PATHWAYS[topic_id],
        }

    p_query = (
        db.query(models.Question)
        .filter(
            models.Question.must_know_topic == topic_id,
            models.Question.exam_origin == "real_exam",
        )
    )
    if is_mock_70_locked():
        p_query = p_query.filter(~models.Question.source_exam.like("%2570%"))
    questions = p_query.limit(12).all()
    if not questions:
        raise HTTPException(status_code=404, detail=f"Pathway for topic '{topic_id}' not found")

    cat = questions[0].category or ""
    meta = get_topic_meta(topic_id, cat)
    pathways_list = get_topic_pathways(
        module_id=topic_id,
        category=cat,
        questions=questions,
        title_th=meta["title_th"],
        parse_fn=_parse_explanation,
        classify_tb_fn=classify_textbook,
    )
    return {
        "topic_id": topic_id,
        "title_th": meta["title_th"],
        "pathways": pathways_list,
    }


def _classify_visual_modality(q: models.Question, exp: Dict[str, Any]) -> str:
    """Classify image-backed exam question into radiograph, cast_chart, or clinical_lesion."""
    combined = " ".join(
        filter(
            None,
            [
                q.question_text,
                q.stem,
                q.proposition,
                q.must_know_topic,
                exp.get("core_principle", ""),
                exp.get("key_takeaway", ""),
            ],
        )
    ).lower()

    radiograph_kw = [
        "ภาพรังสี",
        "ฟิล์ม",
        "รังสี",
        "x-ray",
        "xray",
        "radiograph",
        "panoramic",
        "opg",
        "periapical",
        "bitewing",
        "cbct",
        "radioluc",
        "radiopaq",
        "เงาดำ",
        "เงาทึบ",
        "oral-radiology",
        "cephalometric",
    ]
    if any(k in combined for k in radiograph_kw):
        return "radiograph"

    cast_chart_kw = [
        "แบบจำลอง",
        "study cast",
        "cast",
        "surveyor",
        "surveying",
        "posselt",
        "กราฟ",
        "diagram",
        "แผนภาพ",
        "ตาราง",
        "tracing",
        "curve of spee",
        "curve of wilson",
        "chart",
    ]
    if any(k in combined for k in cast_chart_kw):
        return "cast_chart"

    return "clinical_lesion"


_MODALITY_LABELS_TH = {
    "radiograph": "ภาพรังสีวินิจฉัย (Radiograph)",
    "clinical_lesion": "ภาพคลินิก / รอยโรค (Clinical)",
    "cast_chart": "แบบจำลอง / กราฟ / แผนภาพ",
}


@router.get("/visual-atlas")
def get_visual_atlas(
    request: Request,
    category: Optional[str] = Query(None),
    modality: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return Visual Spot-Diagnosis & Radiograph Atlas items across all image-backed NL questions."""
    _check_rate_limit(f"visual-atlas:u:{current_user.id}", max_attempts=60, window_seconds=300)
    _check_rate_limit(f"visual-atlas:{_get_client_ip(request)}", max_attempts=90, window_seconds=300)
    query = (
        db.query(models.Question)
        .options(selectinload(models.Question.choices))
        .filter(models.Question.exam_origin == "real_exam")
        .filter(models.Question.image_path.isnot(None))
        .filter(models.Question.image_path != "")
    )
    if is_mock_70_locked():
        query = query.filter(~models.Question.source_exam.like("%2570%"))

    rows = query.order_by(models.Question.id.asc()).all()

    stats_by_category: Dict[str, int] = {}
    stats_by_modality: Dict[str, int] = {
        "radiograph": 0,
        "clinical_lesion": 0,
        "cast_chart": 0,
    }
    all_items: List[Dict[str, Any]] = []

    for q in rows:
        exp = _parse_explanation(q.explanation)
        mod = _classify_visual_modality(q, exp)
        cat = q.category or "อื่นๆ"
        stats_by_category[cat] = stats_by_category.get(cat, 0) + 1
        stats_by_modality[mod] = stats_by_modality.get(mod, 0) + 1

        topic_id = q.must_know_topic or ""
        meta = get_topic_meta(topic_id, cat) if topic_id else {"title_th": cat, "title_en": ""}
        correct_letter = (q.correct_answer or "").strip().upper()
        correct_choice_text = ""
        for ch in q.choices or []:
            if (ch.label or "").strip().upper() == correct_letter:
                correct_choice_text = ch.text
                break

        stem_raw = (q.proposition or q.question_text or "").strip()
        all_items.append(
            {
                "id": q.id,
                "image_path": q.image_path,
                "category": cat,
                "must_know_topic": topic_id,
                "topic_title_th": meta["title_th"],
                "source_exam": q.source_exam or "",
                "cognitive_level": q.cognitive_level or "A",
                "task": q.task or "",
                "modality": mod,
                "modality_label_th": _MODALITY_LABELS_TH.get(mod, mod),
                "stem_preview": stem_raw,
                "question_text": (q.question_text or "").strip(),
                "correct_answer": correct_letter,
                "correct_choice_text": correct_choice_text,
                "core_principle": (exp.get("core_principle") or "").strip(),
                "key_takeaway": (exp.get("key_takeaway") or exp.get("why_correct") or "").strip(),
                "common_pitfall": (exp.get("common_pitfall") or "").strip(),
                "reference": (exp.get("reference") or exp.get("legal_citation") or "").strip(),
            }
        )

    filtered = all_items
    if category and category != "ทั้งหมด":
        filtered = [item for item in filtered if item["category"] == category]
    if modality and modality != "all":
        filtered = [item for item in filtered if item["modality"] == modality]
    if search and search.strip():
        s = search.strip().lower()
        filtered = [
            item
            for item in filtered
            if s in item["stem_preview"].lower()
            or s in item["topic_title_th"].lower()
            or s in item["category"].lower()
            or s in item["key_takeaway"].lower()
            or s in item["core_principle"].lower()
            or s in item["correct_choice_text"].lower()
            or s in str(item["id"])
        ]

    return {
        "total_pool": len(all_items),
        "total_items": len(filtered),
        "stats_by_category": stats_by_category,
        "stats_by_modality": stats_by_modality,
        "items": filtered,
    }


# ─────────────────────────────────────────────────────────────────────────────
# 7. PHASE 3: CLOZE DELETION & PITFALL ELIMINATION ARENA
# ─────────────────────────────────────────────────────────────────────────────

def _resolve_optional_user(request: Request, db: Session) -> Optional[models.User]:
    """Best-effort Bearer token resolution so Cloze Arena works anonymously or personalized."""
    auth_header = (request.headers.get("authorization") or "").strip()
    if not auth_header.lower().startswith("bearer "):
        return None
    token = auth_header[7:].strip()
    if not token:
        return None
    try:
        payload = _decode_token(token, expected_type="access")
        username = payload.get("sub")
        if not username:
            return None
        return db.query(models.User).filter(models.User.username == username).first()
    except Exception:
        return None


def _serialize_cloze_sm2_row(row: Optional[models.UserCardReview], now_ts: int) -> Optional[Dict[str, Any]]:
    if not row:
        return None
    days_until_due = (
        max(0, math.ceil((row.next_review_date - now_ts) / 86400))
        if row.next_review_date > now_ts
        else 0
    )
    return {
        "card_key": row.card_key,
        "card_type": row.card_type,
        "repetitions": row.repetitions,
        "interval": row.interval,
        "ease_factor": row.ease_factor,
        "last_quality": row.last_quality,
        "lapse_count": row.lapse_count or 0,
        "mastery_status": row.mastery_status,
        "next_review_date": row.next_review_date,
        "days_until_due": days_until_due,
        "is_due": row.next_review_date <= now_ts,
    }


def _format_num_like(val: float, ref_str: str, dec_places: int) -> str:
    """Format a number matching the decimal precision and comma style of ref_str."""
    use_comma = "," in ref_str
    if dec_places > 0:
        out = f"{round(val, dec_places):.{dec_places}f}"
    else:
        out = str(int(round(val)))
    if use_comma and "." not in out:
        out = f"{int(out):,}"
    elif use_comma and "." in out:
        whole, frac = out.split(".")
        out = f"{int(whole):,}.{frac}"
    return out


def _perturb_numeric_answer(answer: str, rng: random.Random) -> List[str]:
    """Generate plausible clinical/legal distractors preserving unit, scale, and range validity."""
    ans_clean = (answer or "").strip()

    # 1. Roman numerals / dental classifications / epinephrine ratios / cranial nerves
    ep_m = re.match(r"^1\s*:\s*(50|80|100|200),000(.*)$", ans_clean, re.IGNORECASE)
    if ep_m:
        orig_dil, suf = ep_m.group(1), ep_m.group(2)
        pool = [f"1:{d},000{suf}" for d in ("50", "80", "100", "200") if d != orig_dil]
        rng.shuffle(pool)
        return pool[:3]

    cn_m = re.match(r"^CN\s*(XII|XI|IX|X|VIII|VII|VI|IV|V|III|II|I)$", ans_clean, re.IGNORECASE)
    if cn_m:
        orig_cn = cn_m.group(1).upper()
        cns = [f"CN {c}" for c in ("III", "V", "VII", "IX", "X", "XI", "XII") if c != orig_cn]
        rng.shuffle(cns)
        return cns[:3]

    cls_m = re.match(r"^(Stage|Class|Grade)\s*(IV|III|II|I|V|[A-D]|[1-5])$", ans_clean, re.IGNORECASE)
    if cls_m:
        kind, val = cls_m.group(1).capitalize(), cls_m.group(2).upper()
        if val in ("I", "II", "III", "IV", "V"):
            choices = ["I", "II", "III", "IV"] + (["V"] if kind == "Class" else [])
        elif val in ("A", "B", "C", "D"):
            choices = ["A", "B", "C", "D"]
        else:
            choices = ["1", "2", "3", "4"] + (["5"] if kind == "Class" else [])
        pool = [f"{kind} {c}" for c in choices if c != val]
        rng.shuffle(pool)
        return pool[:3]

    # 2. Numeric range (e.g. "0.5–0.7 mL/min", "10-15 mg/kg/dose", "4-6 ชั่วโมง")
    rng_m = re.match(
        r"^(.*?)(\d+(?:,\d{3})*(?:\.\d+)?)(\s*(?:[–\-~]|ถึง)\s*)(\d+(?:,\d{3})*(?:\.\d+)?)(.*)$",
        ans_clean,
    )
    if rng_m:
        prefix, lo_s, sep, hi_s, suffix = rng_m.groups()
        try:
            lo = float(lo_s.replace(",", ""))
            hi = float(hi_s.replace(",", ""))
        except ValueError:
            lo, hi = 0.0, 0.0
        if hi > lo:
            dec_lo = len(lo_s.split(".")[1]) if "." in lo_s else 0
            dec_hi = len(hi_s.split(".")[1]) if "." in hi_s else 0
            dec_places = max(dec_lo, dec_hi)
            span = max(hi - lo, abs(lo) * 0.3, 0.1 if dec_places > 0 else 1.0)
            is_percent = "%" in suffix or "เปอร์เซ็นต์" in suffix
            shifts: List[Tuple[float, float]] = []
            for mult in (0.5, 1.5, 2.0, 2.5):
                shifts.append((lo * mult, hi * mult))
            for k in (-2, -1, 1, 2, 3):
                shifts.append((lo + k * span, hi + k * span))
            rng.shuffle(shifts)
            distractors: List[str] = []
            seen = {ans_clean.lower()}
            for n_lo, n_hi in shifts:
                if n_lo <= 0 and lo > 0:
                    continue
                if n_lo < 0:
                    continue
                if is_percent and n_hi > 100:
                    continue
                f_lo = _format_num_like(n_lo, lo_s, dec_places)
                f_hi = _format_num_like(n_hi, hi_s, dec_places)
                if float(f_hi.replace(",", "")) <= float(f_lo.replace(",", "")):
                    continue
                cand = f"{prefix}{f_lo}{sep}{f_hi}{suffix}".strip()
                if cand.lower() not in seen:
                    seen.add(cand.lower())
                    distractors.append(cand)
                if len(distractors) >= 3:
                    return distractors
            if distractors:
                return distractors

    # 3. Single scalar numeric value (or year / section)
    match = re.search(r"(\d+(?:,\d{3})*(?:\.\d+)?)", ans_clean)
    if not match:
        return []
    prefix = ans_clean[: match.start()]
    num_str = match.group(1)
    suffix = ans_clean[match.end() :]
    is_percent = "%" in suffix or "เปอร์เซ็นต์" in suffix
    is_thai_year = "พ.ศ." in prefix or "พ.ศ." in ans_clean or (2470 <= float(num_str.replace(",", "")) <= 2580 and "/" not in suffix)
    is_section = "มาตรา" in prefix or "ม." in prefix or "หมวด" in prefix
    dec_places = len(num_str.split(".")[1]) if "." in num_str else 0
    try:
        orig_val = float(num_str.replace(",", ""))
    except ValueError:
        return []

    raw_candidates: List[float] = []
    if is_thai_year:
        for delta in (-10, -5, -3, -2, 2, 3, 5, 10, 12):
            raw_candidates.append(orig_val + delta)
    elif is_section:
        deltas = (-3, -2, -1, 1, 2, 3, 5, 10)
        for d in deltas:
            raw_candidates.append(orig_val + d)
    elif dec_places > 0:
        for mult in (0.5, 1.5, 2.0, 0.25, 2.5):
            raw_candidates.append(orig_val * mult)
        for delta in (-1.0, 1.0, -0.5, 0.5, 2.0):
            raw_candidates.append(orig_val + delta)
    elif orig_val <= 15:
        for delta in (-2, -1, 1, 2, 3, 5, -3):
            raw_candidates.append(orig_val + delta)
        raw_candidates.extend([orig_val * 2, orig_val * 3])
    else:
        for mult in (0.5, 1.5, 2.0):
            raw_candidates.append(round(orig_val * mult))
        for delta in (-10, -5, 5, 10, 20, -20, 1, -1):
            raw_candidates.append(orig_val + delta)

    rng.shuffle(raw_candidates)
    distractors = []
    seen_vals = {num_str.replace(",", "")}
    for cand_val in raw_candidates:
        if cand_val <= 0 and orig_val > 0:
            continue
        if is_percent and cand_val > 100:
            continue
        if is_thai_year and (cand_val < 2475 or cand_val > 2569):
            continue
        formatted_num = _format_num_like(cand_val, num_str, dec_places)
        if dec_places == 0 and int(round(cand_val)) <= 0 and orig_val > 0:
            continue
        norm_cmp = formatted_num.replace(",", "")
        if norm_cmp in seen_vals:
            continue
        seen_vals.add(norm_cmp)
        cand_full = f"{prefix}{formatted_num}{suffix}".strip()
        if cand_full and cand_full.lower() != ans_clean.lower():
            distractors.append(cand_full)
        if len(distractors) >= 3:
            break
    return distractors


_THAI_KEY_CONCEPT_REGEX = re.compile(
    r"(?:ความรับผิดทางแพ่ง|ความรับผิดทางอาญา|ความรับผิดทางวินัย|จรรยาบรรณแห่งวิชาชีพทันตกรรม|"
    r"จรรยาบรรณวิชาชีพ|นิยามวิชาชีพทันตกรรม|หนังสือให้ความยินยอม|สิทธิของผู้ป่วย|สิทธิผู้ป่วย|"
    r"ความลับของผู้ป่วย|พ\.ร\.บ\.\s*วิชาชีพทันตกรรม|พ\.ร\.บ\.\s*สถานพยาบาล|"
    r"พ\.ร\.บ\.\s*สุขภาพแห่งชาติ|พ\.ร\.บ\.\s*ข้อมูลข่าวสารของราชการ|พ\.ร\.บ\.\s*ยา|"
    r"ประมาทเลินเล่ออย่างร้ายแรง|การกล่าวโทษต่อทันตแพทยสภา|ใบอนุญาตประกอบวิชาชีพ|"
    r"หน่วยกิตการศึกษาต่อเนื่อง|ว่ากล่าวตักเตือน|พักใช้ใบอนุญาต|เพิกถอนใบอนุญาต|ภาคทัณฑ์|"
    r"สำเนาเวชระเบียน|การส่งต่อผู้ป่วย|ยาสีฟันผสมฟลูออไรด์|ท่าเข่าชนเข่า|"
    r"น้ำตาลอิสระ|คาร์โบไฮเดรตเหนียวติดฟัน|ทันตกรรมป้องกัน|การขูดหินปูนและเกลารากฟัน|"
    r"ภาวะปากแห้งจากรังสี|ภาวะเยื่อเมือกช่องปากอักเสบ|สุขอนามัยช่องปาก|การควบคุมคราบจุลินทรีย์)"
)

_THAI_FALLBACK_CONCEPTS = [
    "ว่ากล่าวตักเตือน",
    "ภาคทัณฑ์",
    "พักใช้ใบอนุญาต",
    "เพิกถอนใบอนุญาต",
    "ความรับผิดทางแพ่ง",
    "ความรับผิดทางอาญา",
    "ความรับผิดทางวินัย",
    "หนังสือให้ความยินยอม",
    "สิทธิผู้ป่วย",
    "ความลับของผู้ป่วย",
    "นิยามวิชาชีพทันตกรรม",
    "สำเนาเวชระเบียน",
    "การส่งต่อผู้ป่วย",
    "ประมาทเลินเล่ออย่างร้ายแรง",
    "ยาสีฟันผสมฟลูออไรด์",
    "น้ำตาลอิสระ",
    "ท่าเข่าชนเข่า",
    "ทันตกรรมป้องกัน",
]

_VIGNETTE_SENTENCE_START_RE = re.compile(
    r"^(?:จากประวัติ|จาก\s*(?:case|เคส|โจทย์)|ผู้ป่วย(?:ชาย|หญิง|เด็ก|สูงอายุ)?|"
    r"คนไข้(?:เพศ)?(?:ชาย|หญิง)?|เด็ก(?:ชาย|หญิง|เล็ก|วัย|อายุ)?|ในกรณีตัวอย่างนี้|stem\b)",
    re.IGNORECASE,
)
_RULE_SENTENCE_BOOST_RE = re.compile(
    r"(?:สรุป|ดังนั้น|หลักการ|เกณฑ์|มาตรฐาน|ตาม\s*พ\.ร\.บ\.|มาตรา\s*\d+|คำตอบ|"
    r"เกิดจาก|สาเหตุหลัก|กลไก|รักษาคือ|ควรเลือก|ข้อห้าม|ห้ามทำ|วินิจฉัย|เข้าได้กับ|สงสัย)"
)


def _trim_core_excerpt(core_text: str, max_len: int = 260) -> str:
    """Return the first non-vignette rule sentence from core_principle for post-answer context."""
    sents = _split_clean_sentences(core_text)
    if not sents:
        return ""
    for sent in sents:
        if not _VIGNETTE_SENTENCE_START_RE.match(sent):
            return _trim_to_sentence_window(sent, 0, min(40, len(sent)), max_len=max_len)
    last_s = sents[-1]
    return _trim_to_sentence_window(last_s, 0, min(40, len(last_s)), max_len=max_len)


def _extract_cloze_candidate(q: models.Question, exp: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Select the single highest-yield Cloze deletion span across explanation fields without leaking hints."""
    source_specs: List[Tuple[str, int, str]] = [
        ("key_takeaway", 38, (exp.get("key_takeaway") or "").strip()),
        ("why_correct", 24, (exp.get("why_correct") or "").strip()),
        ("core_principle", 20, (exp.get("core_principle") or "").strip()),
        ("clinical_pearl", 14, (exp.get("clinical_pearl") or "").strip()),
    ]

    best_choice: Optional[Dict[str, Any]] = None

    for src_name, base_bonus, raw in source_specs:
        if len(raw) < 24:
            continue
        sentences = _split_clean_sentences(raw)
        for idx, sent in enumerate(sentences):
            if len(sent) < 24:
                continue
            sent_bonus = base_bonus
            # Penalize vignette recap sentences in core_principle unless they carry strong rules
            if src_name == "core_principle" and (
                idx == 0 and _VIGNETTE_SENTENCE_START_RE.match(sent)
            ):
                sent_bonus -= 24
            if _RULE_SENTENCE_BOOST_RE.search(sent):
                sent_bonus += 8
            # Slightly down-weight pure English pearls when clean Thai+EN bilingual rules exist
            if src_name == "clinical_pearl" and not re.search(r"[\u0E00-\u0E7F]", sent):
                sent_bonus -= 12

            # Try high-yield numeric/legal or clinical EN term first
            span = _pick_best_cloze_span(sent)
            if not span:
                # Fallback to structured Thai legal/clinical concepts only for Thai-only rules
                tm = _THAI_KEY_CONCEPT_REGEX.search(sent)
                if tm:
                    span = {
                        "start": tm.start(),
                        "end": tm.end(),
                        "target": tm.group(0).strip(),
                        "kind": "thai_rule",
                        "score": 18,
                    }

            if not span:
                continue

            b_start, b_end = span["start"], span["end"]
            target = span["target"]

            # If target is an EN term immediately followed by a parenthetical acronym/brand like "(Tegretol)" or "(ASA)",
            # mask the full span so the acronym doesn't leak the hidden drug/condition!
            if span["kind"] == "clinical_term":
                alias_m = re.match(r"^\s*\([A-Za-z0-9\s.\-/]{2,22}\)", sent[b_end:])
                if alias_m:
                    cand_end = b_end + alias_m.end()
                    combined = sent[b_start:cand_end].strip()
                    if len(combined) <= 46:
                        b_end = cand_end
                        target = combined

            total_score = span["score"] + sent_bonus
            if best_choice is None or total_score > best_choice["total_score"]:
                best_choice = {
                    "sent": sent,
                    "b_start": b_start,
                    "b_end": b_end,
                    "target": target,
                    "kind": span["kind"],
                    "total_score": total_score,
                    "src_name": src_name,
                }

    if not best_choice or best_choice["total_score"] < 26:
        return None

    sent = best_choice["sent"]
    b_start = best_choice["b_start"]
    b_end = best_choice["b_end"]
    target = best_choice["target"]

    # Trim around the chosen span strictly on sentence/word boundaries (zero mid-word cuts)
    full_clean = re.sub(r"\s+", " ", sent).strip()
    if len(full_clean) <= 285:
        window = full_clean
        local_start = b_start
        local_end = b_end
    else:
        window = _trim_to_sentence_window(full_clean, b_start, b_end, max_len=285)
        t_pos = window.find(target)
        if t_pos == -1:
            return None
        local_start = t_pos
        local_end = t_pos + len(target)

    if window[local_start:local_end] != target:
        t_pos = window.find(target)
        if t_pos == -1:
            return None
        local_start, local_end = t_pos, t_pos + len(target)

    prompt_masked = f"{window[:local_start]}【 ____?____ 】{window[local_end:]}"
    return {
        "prompt_masked": prompt_masked,
        "missing_answer": target,
        "blank_kind": best_choice["kind"],
        "full_explanation": window,
        "source_field": best_choice["src_name"],
        "extra_insight": _trim_core_excerpt(exp.get("core_principle") or ""),
    }


@router.get("/cloze-arena")
def get_cloze_pitfall_arena(
    request: Request,
    category: Optional[str] = Query(None),
    mode: str = Query("mixed", pattern="^(mixed|cloze|pitfall)$"),
    limit: int = Query(30, ge=5, le=80),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Build interactive Cloze Deletion & Pitfall Elimination Arena items with SM-2 & wrong-answer prioritization."""
    _check_rate_limit(f"cloze-arena:u:{current_user.id}", max_attempts=60, window_seconds=300)
    _check_rate_limit(f"cloze-arena:{_get_client_ip(request)}", max_attempts=90, window_seconds=300)
    user = current_user
    now_ts = int(time.time())

    wrong_q_ids = set()
    sm2_map: Dict[str, models.UserCardReview] = {}
    if user:
        wrong_rows = (
            db.query(models.UserAnswer.question_id)
            .join(models.ExamSession, models.ExamSession.id == models.UserAnswer.session_id)
            .filter(models.ExamSession.user_id == user.id, models.UserAnswer.is_correct == 0)
            .distinct()
            .all()
        )
        wrong_q_ids = {r[0] for r in wrong_rows}

        review_rows = (
            db.query(models.UserCardReview)
            .filter(
                models.UserCardReview.user_id == user.id,
                models.UserCardReview.card_type == "cloze",
            )
            .all()
        )
        sm2_map = {r.card_key: r for r in review_rows}

    locked = is_mock_70_locked()
    rows = (
        db.query(models.Question)
        .options(selectinload(models.Question.choices))
        .filter(models.Question.exam_origin == "real_exam")
        .order_by(models.Question.id.asc())
        .all()
    )

    categories_set = set()
    unlocked_rows: List[models.Question] = []
    term_pool_by_cat: Dict[str, List[str]] = {}
    num_pool_by_cat: Dict[str, List[str]] = {}
    thai_pool_by_cat: Dict[str, List[str]] = {}

    for q in rows:
        if locked and q.source_exam and "2570" in q.source_exam:
            continue
        cat = q.category or "อื่นๆ"
        categories_set.add(cat)
        unlocked_rows.append(q)

        exp = _parse_explanation(q.explanation)
        blob = " ".join(
            [
                (exp.get("key_takeaway") or ""),
                (exp.get("core_principle") or ""),
                (exp.get("clinical_pearl") or ""),
            ]
        )
        for nm_m in _NUM_RULE_REGEX.finditer(blob):
            nm_clean = nm_m.group(0).strip()
            if not _is_vignette_number(blob, nm_m.start(), nm_m.end(), nm_clean):
                bucket = num_pool_by_cat.setdefault(cat, [])
                if nm_clean not in bucket and len(bucket) < 100:
                    bucket.append(nm_clean)
        for en_m in _EN_TERM_REGEX.finditer(blob):
            c_start, c_end, en_clean = _clean_en_term(blob, en_m.start(), en_m.end())
            if en_clean and _score_en_candidate(blob, c_start, c_end, en_clean) >= 18:
                bucket = term_pool_by_cat.setdefault(cat, [])
                if en_clean not in bucket and len(bucket) < 120:
                    bucket.append(en_clean)
        for th_m in _THAI_KEY_CONCEPT_REGEX.finditer(blob):
            th_clean = th_m.group(0).strip()
            bucket = thai_pool_by_cat.setdefault(cat, [])
            if th_clean not in bucket and len(bucket) < 80:
                bucket.append(th_clean)

    global_fallback_terms = [
        "Irreversible pulpitis",
        "Necrotic pulp",
        "Symptomatic apical periodontitis",
        "Osteoradionecrosis",
        "Biologic width (STA)",
        "Bisphosphonate MRONJ",
        "Ameloblastoma",
        "Dentigerous cyst",
        "Erythroplakia",
        "Pseudomembranous candidiasis",
        "Primary herpetic gingivostomatitis",
        "Mucous membrane pemphigoid",
    ]

    cloze_items: List[Dict[str, Any]] = []
    pitfall_items: List[Dict[str, Any]] = []
    active_cat = (category or "").strip()

    for q in unlocked_rows:
        cat = q.category or "อื่นๆ"
        if active_cat and active_cat not in ("ทั้งหมด", "all") and cat != active_cat:
            continue

        exp = _parse_explanation(q.explanation)
        tid = q.must_know_topic or ""
        meta = get_topic_meta(tid, cat) if tid else {"title_th": cat, "title_en": ""}
        ref_str = (exp.get("reference") or exp.get("legal_citation") or "").strip()
        is_wrong = q.id in wrong_q_ids

        # 1) Build Cloze Deletion item
        if mode in ("mixed", "cloze"):
            cloze_data = _extract_cloze_candidate(q, exp)
            if cloze_data:
                rng = random.Random(f"cloze-arena-{q.id}")
                ans = cloze_data["missing_answer"]
                ans_low = ans.lower()
                bkind = cloze_data["blank_kind"]
                full_lower = cloze_data["full_explanation"].lower()
                distractors: List[str] = []

                if bkind == "numeric_law":
                    cat_nums = list(num_pool_by_cat.get(cat, []))
                    rng.shuffle(cat_nums)
                    if ans.startswith("พ.ร.บ."):
                        same_acts = [c for c in cat_nums if c.startswith("พ.ร.บ.")]
                        for cand in same_acts:
                            if len(distractors) >= 2:
                                break
                            c_low = cand.lower()
                            if c_low != ans_low and c_low not in full_lower and cand not in distractors:
                                distractors.append(cand)
                        distractors.extend(_perturb_numeric_answer(ans, rng))
                    else:
                        distractors.extend(_perturb_numeric_answer(ans, rng))
                    pool_nums = [c for c in cat_nums if not c.startswith("พ.ร.บ.")] if not ans.startswith("พ.ร.บ.") else cat_nums
                    for cand in pool_nums:
                        if len(distractors) >= 3:
                            break
                        c_low = cand.lower()
                        if c_low != ans_low and c_low not in full_lower and cand not in distractors:
                            distractors.append(cand)
                elif bkind == "thai_rule":
                    pool_th = list(thai_pool_by_cat.get(cat, []))
                    rng.shuffle(pool_th)
                    for cand in pool_th + _THAI_FALLBACK_CONCEPTS:
                        if len(distractors) >= 3:
                            break
                        c_low = cand.lower()
                        if (
                            c_low != ans_low
                            and c_low not in ans_low
                            and ans_low not in c_low
                            and c_low not in full_lower
                            and cand not in distractors
                        ):
                            distractors.append(cand)
                else:
                    pool_en = list(term_pool_by_cat.get(cat, []))
                    rng.shuffle(pool_en)
                    for cand in pool_en + global_fallback_terms:
                        if len(distractors) >= 3:
                            break
                        c_low = cand.lower()
                        if (
                            c_low != ans_low
                            and c_low not in ans_low
                            and ans_low not in c_low
                            and c_low not in full_lower
                            and cand not in distractors
                        ):
                            distractors.append(cand)

                distractors = distractors[:3]
                if len(distractors) >= 3:
                    options = [ans] + distractors
                    rng.shuffle(options)
                    ckey = f"cloze-{q.id}"
                    kt_clean = (exp.get("key_takeaway") or "").strip()
                    wc_clean = (exp.get("why_correct") or "").strip()
                    pearl_clean = (exp.get("clinical_pearl") or "").strip()
                    extra_insight = cloze_data.get("extra_insight") or ""
                    if not wc_clean and extra_insight and extra_insight != kt_clean:
                        wc_clean = extra_insight
                    cloze_items.append(
                        {
                            "item_type": "cloze",
                            "card_key": ckey,
                            "question_id": q.id,
                            "category": cat,
                            "topic_id": tid,
                            "topic_title_th": meta["title_th"],
                            "cognitive_level": q.cognitive_level or "A",
                            "prompt_masked": cloze_data["prompt_masked"],
                            "missing_answer": ans,
                            "blank_kind": bkind,
                            "options": options,
                            "full_explanation": cloze_data["full_explanation"],
                            "why_correct": wc_clean,
                            "clinical_pearl": pearl_clean,
                            "common_pitfall": (exp.get("common_pitfall") or "").strip(),
                            "key_takeaway": kt_clean,
                            "reference": ref_str,
                            "prioritized_wrong": is_wrong,
                            "sm2_state": _serialize_cloze_sm2_row(sm2_map.get(ckey), now_ts),
                        }
                    )

        # 2) Build Pitfall Elimination item
        if mode in ("mixed", "pitfall"):
            pitfall_txt = (exp.get("common_pitfall") or "").strip()
            choice_expls = exp.get("choice_explanations")
            correct_label = (q.correct_answer or "").strip()
            choices_list = list(q.choices or [])
            if (
                len(pitfall_txt) >= 15
                and isinstance(choice_expls, dict)
                and len(choice_expls) >= 2
                and len(choices_list) >= 3
                and any((c.label or "").strip() == correct_label for c in choices_list)
            ):
                label_order = {"ก": 0, "ข": 1, "ค": 2, "ง": 3, "A": 0, "B": 1, "C": 2, "D": 3}
                choices_list.sort(key=lambda c: label_order.get((c.label or "").strip(), 99))
                formatted_choices = [
                    {
                        "label": (c.label or "").strip(),
                        "text": (c.text or "").strip(),
                        "explanation": str(choice_expls.get((c.label or "").strip(), "")).strip(),
                    }
                    for c in choices_list
                ]
                ckey = f"pitfall-{q.id}"
                pitfall_items.append(
                    {
                        "item_type": "pitfall",
                        "card_key": ckey,
                        "question_id": q.id,
                        "category": cat,
                        "topic_id": tid,
                        "topic_title_th": meta["title_th"],
                        "cognitive_level": q.cognitive_level or "A",
                        "stem": (q.question_text or "").strip(),
                        "choices": formatted_choices,
                        "correct_answer": correct_label,
                        "common_pitfall": pitfall_txt,
                        "why_correct": (exp.get("why_correct") or "").strip(),
                        "key_takeaway": (exp.get("key_takeaway") or "").strip(),
                        "reference": ref_str,
                        "prioritized_wrong": is_wrong,
                        "sm2_state": _serialize_cloze_sm2_row(sm2_map.get(ckey), now_ts),
                    }
                )

    def _priority_key(item: Dict[str, Any]):
        sm2 = item.get("sm2_state")
        is_due = 1 if (sm2 and sm2.get("is_due")) else 0
        is_wrong_flag = 1 if item.get("prioritized_wrong") else 0
        is_unseen = 1 if not sm2 else 0
        numeric_bonus = 1 if item.get("blank_kind") == "numeric_law" else 0
        return (-is_wrong_flag, -is_due, -is_unseen, -numeric_bonus, (item["question_id"] * 2654435761) % 997)

    cloze_items.sort(key=_priority_key)
    pitfall_items.sort(key=_priority_key)

    final_items: List[Dict[str, Any]] = []
    if mode == "cloze":
        final_items = cloze_items[:limit]
    elif mode == "pitfall":
        final_items = pitfall_items[:limit]
    else:
        seen_qids = set()
        # Urgent items (past wrong answers or overdue SM-2 reviews) always lead the queue
        urgent_items = [
            it
            for it in (cloze_items + pitfall_items)
            if it["prioritized_wrong"] or (it["sm2_state"] and it["sm2_state"].get("is_due"))
        ]
        urgent_items.sort(key=_priority_key)
        for u_item in urgent_items:
            if len(final_items) >= limit:
                break
            if u_item["question_id"] not in seen_qids:
                final_items.append(u_item)
                seen_qids.add(u_item["question_id"])

        ci, pi = 0, 0
        while len(final_items) < limit and (ci < len(cloze_items) or pi < len(pitfall_items)):
            added_any = False
            while ci < len(cloze_items):
                c_item = cloze_items[ci]
                ci += 1
                if c_item["question_id"] not in seen_qids:
                    final_items.append(c_item)
                    seen_qids.add(c_item["question_id"])
                    added_any = True
                    break
            if len(final_items) >= limit:
                break
            while pi < len(pitfall_items):
                p_item = pitfall_items[pi]
                pi += 1
                if p_item["question_id"] not in seen_qids:
                    final_items.append(p_item)
                    seen_qids.add(p_item["question_id"])
                    added_any = True
                    break
            if not added_any:
                break

    return {
        "items": final_items,
        "summary": {
            "total_available": len(cloze_items) + len(pitfall_items),
            "cloze_available": len(cloze_items),
            "pitfall_available": len(pitfall_items),
            "returned_count": len(final_items),
            "prioritized_wrong_count": sum(1 for it in final_items if it["prioritized_wrong"]),
            "due_sm2_count": sum(
                1 for it in final_items if it["sm2_state"] and it["sm2_state"].get("is_due")
            ),
            "categories": sorted(categories_set),
        },
    }
