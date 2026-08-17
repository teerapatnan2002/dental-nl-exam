import os
import time
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

CATEGORIES = [
    {
        "name": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
        "en": "Oral Diagnosis and Oral Medicine",
        "filename": "EBD_01_Oral_Diagnosis.md",
        "references": "Ibsen & Phelan (Oral Pathology), Greenberg & Glick (Burket's Oral Medicine), Neville et al. (Oral and Maxillofacial Pathology)"
    },
    {
        "name": "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า",
        "en": "Occlusion and Orofacial Pain / TMD",
        "filename": "EBD_02_Occlusion_TMD.md",
        "references": "Okeson (Management of Temporomandibular Disorders), AAO (American Academy of Orofacial Pain Guidelines), DeBoever & Carlsson"
    },
    {
        "name": "ศัลยศาสตร์ช่องปาก",
        "en": "Oral and Maxillofacial Surgery",
        "filename": "EBD_03_Oral_Surgery.md",
        "references": "Hupp, Ellis & Tucker (Contemporary Oral and Maxillofacial Surgery), Fonseca (Oral and Maxillofacial Surgery), AAOMS Guidelines"
    },
    {
        "name": "ปริทันตวิทยา",
        "en": "Periodontics",
        "filename": "EBD_04_Periodontics.md",
        "references": "Newman, Takei & Carranza (Carranza's Clinical Periodontology), Lindhe (Clinical Periodontology), AAP 2017 Classification of Periodontal Diseases"
    },
    {
        "name": "ทันตกรรมบูรณะ/หัตถการ",
        "en": "Restorative and Operative Dentistry",
        "filename": "EBD_05_Operative.md",
        "references": "Sturdevant's (Art and Science of Operative Dentistry), Roberson, Heymann & Swift, ADA Caries Guideline"
    },
    {
        "name": "วิทยาเอ็นโดดอนต์",
        "en": "Endodontics",
        "filename": "EBD_06_Endodontics.md",
        "references": "Cohen & Hargreaves (Pathways of the Pulp 11th ed), Ingle's Endodontics, AAE Guidelines and Position Statements"
    },
    {
        "name": "ทันตกรรมประดิษฐ์",
        "en": "Prosthodontics",
        "filename": "EBD_07_Prosthodontics.md",
        "references": "Zarb & Bolender (Prosthodontic Treatment for Edentulous Patients), Phoenix, Cagna & DeFreest, ACP Guidelines"
    },
    {
        "name": "ทันตกรรมจัดฟัน",
        "en": "Orthodontics",
        "filename": "EBD_08_Orthodontics.md",
        "references": "Proffit, Fields & Sarver (Contemporary Orthodontics 6th ed), Graber et al., AAO Clinical Practice Guidelines"
    },
    {
        "name": "ทันตกรรมสำหรับเด็ก",
        "en": "Pediatric Dentistry",
        "filename": "EBD_09_Pediatric.md",
        "references": "Pinkham (Pediatric Dentistry - Infancy through Adolescence), AAPD Guidelines (American Academy of Pediatric Dentistry), Casamassimo et al."
    },
    {
        "name": "ทันตกรรมชุมชน",
        "en": "Community Dentistry and Dental Public Health",
        "filename": "EBD_10_Community.md",
        "references": "Petersen & Ogawa (WHO Oral Health), Jong's Community Dental Health, APHA Guidelines"
    },
    {
        "name": "กฎหมายและจรรยาบรรณ",
        "en": "Dental Law and Ethics",
        "filename": "EBD_11_Law_Ethics.md",
        "references": "พระราชบัญญัติวิชาชีพทันตกรรม พ.ศ. 2537, ADA Code of Professional Conduct, ข้อบังคับทันตแพทยสภาว่าด้วยจรรยาบรรณ พ.ศ. 2538"
    },
]

SYSTEM_PROMPT = """คุณเป็นคณาจารย์ทันตแพทย์ระดับศาสตราจารย์และนักวิจัยทางการแพทย์ 
คุณเชี่ยวชาญการเขียนบทความวิชาการทันตแพทยศาสตร์แบบ Evidence-Based ที่ถูกต้อง ครบถ้วน และมีการอ้างอิงแหล่งข้อมูลที่น่าเชื่อถือ
รูปแบบการเขียนต้องชัดเจน เป็นระบบ และเหมาะสำหรับการนำไปใช้ประกอบการสอบ NL ทันตแพทย์ของประเทศไทย"""

def generate_ebd_article(category: dict, retries: int = 3) -> str:
    api_key = os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        raise RuntimeError("GOOGLE_API_KEY environment variable not set.")
    
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(
        model_name="gemini-2.0-flash",
        system_instruction=SYSTEM_PROMPT
    )
    
    prompt = f"""กรุณาเขียนบทความสรุปองค์ความรู้แบบ Evidence-Based สำหรับวิชา **{category['name']} ({category['en']})** 
ในบริบทของการสอบ NL ทันตแพทย์ประเทศไทย

**กรุณาเขียนให้ครอบคลุมหัวข้อเหล่านี้ในรูปแบบ Markdown:**

# {category['name']} - Evidence-Based Summary

## 1. Core Concepts & Definitions (แนวคิดหลักและนิยาม)
- คำนิยามและหลักการพื้นฐานที่สำคัญที่สุด
- Classification ที่ใช้ในปัจจุบัน

## 2. Disease Mechanisms (กลไกการเกิดโรค)
- Pathophysiology ที่ต้องรู้
- Risk factors และ Etiology

## 3. Clinical Features & Diagnosis (ลักษณะทางคลินิกและการวินิจฉัย)
- Signs & Symptoms สำคัญ
- Diagnostic criteria ที่ใช้อ้างอิง

## 4. Evidence-Based Treatment (การรักษาที่มีหลักฐานเชิงประจักษ์)
- First-line treatment ตาม Guidelines ปัจจุบัน
- Clinical Decision Points ที่ต้องตัดสินใจ

## 5. High-Yield Exam Points (จุดที่มักออกสอบ)
- ข้อสังเกตที่มักพบในข้อสอบ NL
- Common pitfalls และความเข้าใจผิดที่พบบ่อย

## 6. References & Evidence Sources
อ้างอิงจาก: {category['references']}
- ระบุปีพิมพ์และ Edition ที่ใช้อ้างอิง (ถ้ามี)
- ระบุ Level of Evidence (ถ้าเป็น Guideline)

**ข้อกำหนด:**
- ใช้ภาษาไทยเป็นหลัก สลับคำศัพท์ภาษาอังกฤษในวงเล็บสำหรับคำเฉพาะทาง
- เนื้อหาต้องมีความยาวพอเหมาะ ครอบคลุม และเป็น High-Yield สำหรับการสอบ NL
- ต้องอ้างอิงแหล่งข้อมูลที่ระบุ ห้ามอ้างแบบกว้างๆ"""

    for attempt in range(retries):
        try:
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            err_str = str(e)
            if "429" in err_str:
                if attempt < retries - 1:
                    wait = 60 * (attempt + 1)
                    print(f"  ⏳ Rate limited on Google. Waiting {wait}s before retry {attempt+2}/{retries}...")
                    time.sleep(wait)
                else:
                    # Google quota fully exhausted — fallback to OpenRouter
                    print(f"  🔄 Google quota exhausted. Falling back to OpenRouter...")
                    return _generate_via_openrouter(prompt)
            else:
                raise
    raise RuntimeError("All retries exhausted.")


def _generate_via_openrouter(prompt: str) -> str:
    """Fallback generator using OpenRouter free model."""
    from openai import OpenAI
    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        raise RuntimeError("OPENROUTER_API_KEY not set for fallback.")
    client = OpenAI(base_url="https://openrouter.ai/api/v1", api_key=api_key)
    response = client.chat.completions.create(
        model="tencent/hy3:free",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        timeout=120,
    )
    return response.choices[0].message.content


def enrich_evidence():
    vault_dir = "Obsidian_NL_Exam"
    ebd_dir = os.path.join(vault_dir, "Evidence_Based_Knowledge")
    os.makedirs(ebd_dir, exist_ok=True)
    
    print(f"🔬 Starting Evidence-Based Knowledge Enrichment")
    print(f"📁 Output directory: {ebd_dir}")
    print(f"📚 Total categories: {len(CATEGORIES)}\n")
    
    for i, category in enumerate(CATEGORIES, 1):
        print(f"[{i}/{len(CATEGORIES)}] Writing: {category['name']}...")
        
        filepath = os.path.join(ebd_dir, category['filename'])
        
        # Skip only if file exists AND is not an ERROR placeholder
        if os.path.exists(filepath):
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            if "ERROR" not in content and len(content) > 500:
                print(f"  ⏭️  Already exists (clean), skipping.")
                continue
            else:
                print(f"  🔄 Found ERROR placeholder, regenerating...")
        
        try:
            article = generate_ebd_article(category)
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(article)
            print(f"  ✅ Done! ({len(article)} chars)")
            
            # Be polite to the API - wait 3 seconds between requests
            if i < len(CATEGORIES):
                time.sleep(3)
                
        except Exception as e:
            print(f"  ❌ Failed: {e}")
            # Write error placeholder
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(f"# {category['name']}\n\n> ERROR: Failed to generate: {e}\n")
    
    print("\n" + "="*50)
    print("✅ Evidence enrichment complete!")
    print(f"📂 Articles saved to: {ebd_dir}")
    print(f"\n🔄 Next step: Run `python build_knowledge_base.py` to update the AI memory with new knowledge!")


if __name__ == "__main__":
    enrich_evidence()
