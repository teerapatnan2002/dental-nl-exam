import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv(dotenv_path="/Users/admin/Downloads/NL Test/.env")
client = OpenAI(base_url="https://openrouter.ai/api/v1", api_key=os.environ["OPENROUTER_API_KEY"])

SYSTEM = """คุณเป็นคณาจารย์ทันตแพทย์ระดับศาสตราจารย์ ผู้เชี่ยวชาญด้านทันตกรรมจัดฟัน 
คุณเชี่ยวชาญการเขียนบทความวิชาการแบบ Evidence-Based ที่ถูกต้อง ครบถ้วน และมีการอ้างอิงแหล่งข้อมูลที่น่าเชื่อถือ
รูปแบบการเขียนต้องชัดเจน เป็นระบบ เหมาะสำหรับการสอบ NL ทันตแพทย์ประเทศไทย"""

PROMPT = """เขียนบทความสรุปองค์ความรู้แบบ Evidence-Based สำหรับวิชา ทันตกรรมจัดฟัน (Orthodontics) ใช้ภาษาไทยผสมอังกฤษเฉพาะคำศัพท์เฉพาะทาง อ้างอิงจาก Proffit Contemporary Orthodontics 6th ed และ AAO Guidelines

ครอบคลุมหัวข้อต่อไปนี้อย่างละเอียด:

1. Core Concepts - นิยาม Malocclusion, Angle Classification Class I II III, skeletal vs dental
2. Etiology - genetic, environmental factors, habits (thumb sucking, mouth breathing)
3. Diagnosis - cephalometric analysis (SNA, SNB, ANB), model analysis, arch length discrepancy
4. Treatment Planning - extraction vs non-extraction, timing (early vs comprehensive), growth modification
5. Orthodontic Mechanics - fixed appliance, clear aligner, space closure, anchorage
6. Retention - retainer types, relapse prevention
7. High-Yield NL exam points - common mistakes, key decision points
8. References with edition numbers"""

models = [
    "deepseek/deepseek-r1-0528:free",
    "meta-llama/llama-3.3-70b-instruct:free", 
    "microsoft/phi-4-reasoning:free",
    "google/gemma-3-27b-it:free",
]

output_path = "/Users/admin/Downloads/NL Test/Obsidian_NL_Exam/Evidence_Based_Knowledge/EBD_08_Orthodontics.md"

for model in models:
    try:
        print(f"Trying: {model}...")
        resp = client.chat.completions.create(
            model=model,
            messages=[{"role": "system", "content": SYSTEM}, {"role": "user", "content": PROMPT}],
            timeout=120,
        )
        content = resp.choices[0].message.content or ""
        if len(content) > 2000 and "!!!" not in content and content.count("\n") > 20:
            print(f"✅ Success! {len(content)} chars, {content.count(chr(10))} lines")
            with open(output_path, "w", encoding="utf-8") as f:
                f.write(content)
            print("Saved!")
            break
        else:
            print(f"❌ Bad output ({len(content)} chars), trying next...")
    except Exception as e:
        print(f"❌ Error: {e}")
