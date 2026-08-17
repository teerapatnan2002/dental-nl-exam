import os
import json
import asyncio
from typing import List, Dict, Any
from openai import OpenAI, AsyncOpenAI
from dotenv import load_dotenv

load_dotenv()

def _build_client() -> OpenAI:
    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        raise RuntimeError("OPENROUTER_API_KEY environment variable not set.")
    return OpenAI(base_url="https://openrouter.ai/api/v1", api_key=api_key)

def _build_async_client() -> AsyncOpenAI:
    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        raise RuntimeError("OPENROUTER_API_KEY environment variable not set.")
    return AsyncOpenAI(base_url="https://openrouter.ai/api/v1", api_key=api_key)

def _parse_json_from_llm(text: str):
    start = text.find("{")
    end = text.rfind("}")
    start_list = text.find("[")
    end_list = text.rfind("]")
    
    # Check if it's a list or object
    if start_list != -1 and end_list != -1 and (start == -1 or start_list < start):
        try:
            return json.loads(text[start_list:end_list+1])
        except Exception:
            pass
            
    if start != -1 and end != -1:
        try:
            return json.loads(text[start:end+1])
        except Exception:
            pass
            
    try:
        return json.loads(text)
    except Exception as e:
        raise ValueError(f"Failed to parse JSON from LLM: {text}") from e

def predict_trends(stats_text: str, model: str = "openrouter/free") -> str:
    """Analyze the historical distribution of questions and predict trends."""
    client = _build_client()
    
    system_prompt = (
        "คุณเป็นผู้เชี่ยวชาญด้านการวิเคราะห์ข้อมูลและคณาจารย์ทันตแพทย์ระดับสูง "
        "หน้าที่ของคุณคือวิเคราะห์สถิติข้อสอบที่ผ่านมา และทำนายแนวโน้ม (Prediction) ว่าหัวข้อไหนมีโอกาสออกสอบมากที่สุด "
        "พร้อมให้คำแนะนำในการเตรียมตัวสอบ (Study Guide) อย่างละเอียด"
    )
    
    user_prompt = f"""นี่คือข้อมูลสถิติของข้อสอบ NL ทันตแพทย์ในระบบของเรา (แบ่งตามหมวดวิชาและบทบาทหน้าที่):

{stats_text}

กรุณาวิเคราะห์ข้อมูลนี้และเขียนรายงานในรูปแบบ Markdown โดยมีหัวข้อดังนี้:
1. ภาพรวมสถิติ (Overview)
2. หมวดวิชาและหัวข้อที่ออกสอบบ่อยที่สุด (Top Trending Topics)
3. การวิเคราะห์หมวดวิชากฎหมายและจรรยาบรรณ (Law & Ethics Analysis)
4. คำทำนายแนวโน้มข้อสอบในอนาคต (Future Trends Prediction)
5. คำแนะนำในการเตรียมตัวสอบ (Study Recommendations)"""

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        timeout=60,
    )
    return response.choices[0].message.content

def generate_mock_questions(
    category: str, 
    task: str, 
    count: int, 
    examples: List[Dict[str, Any]], 
    model: str = "openrouter/free"
) -> List[Dict[str, Any]]:
    """Generate new mock questions based on few-shot examples and Obsidian RAG context."""
    from rag_engine import search_vault
    
    client = _build_client()
    
    system_prompt = (
        "คุณเป็นกรรมการออกข้อสอบ NL ทันตแพทย์ระดับประเทศ "
        "คุณมีความเชี่ยวชาญในการเขียนข้อสอบแบบ Multiple Choice Question (MCQ) ที่มีตัวเลือก 5 ข้อ "
        "ข้อสอบต้องมีความท้าทาย สมจริง และสอดคล้องกับมาตรฐาน ศ.ป.ท. พ.ศ. 2563"
    )
    
    # Retrieve knowledge context from Obsidian Vault
    context_query = f"{category} {task}"
    rag_context = search_vault(context_query, k=3)
    
    examples_text = ""
    for i, ex in enumerate(examples):
        examples_text += f"\nตัวอย่างที่ {i+1}:\n"
        examples_text += f"คำถาม: {ex['question_text']}\n"
        examples_text += "ตัวเลือก:\n"
        for c in ex['choices']:
            examples_text += f"- {c['label']}: {c['text']}\n"
        examples_text += f"เฉลยที่ถูกต้อง: {ex['correct_answer']}\n"
    
    user_prompt = f"""กรุณาสร้างข้อสอบใหม่จำนวน {count} ข้อ 
สำหรับหมวดวิชา: "{category}" 
บทบาทหน้าที่ (Task): "{task}"

นี่คือข้อมูลความรู้และจุดเชื่อมโยง (Knowledge Context) ที่ดึงมาจาก Obsidian Knowledge Graph:
{rag_context if rag_context else 'ไม่มีข้อมูลอ้างอิงเพิ่มเติม'}

นี่คือตัวอย่างข้อสอบเก่าเพื่อให้คุณเห็นแนวทางการออกข้อสอบ ความยาก และรูปแบบคำถาม:
{examples_text}

จงสร้างข้อสอบใหม่ที่ 'ไม่ซ้ำ' กับตัวอย่าง แต่ยังคงรักษามาตรฐานและความยากในระดับเดียวกัน
กรุณาตอบกลับเป็นรูปแบบ JSON Array เท่านั้น โดยแต่ละข้อมีโครงสร้างดังนี้:
[
  {{
    "question_text": "เนื้อหาคำถามทั้งหมด (รวมถึง case scenario ถ้ามี)",
    "stem": "ส่วนของ Case scenario (ถ้าไม่มีให้เป็น null)",
    "proposition": "ส่วนของคำถามตรงๆ เช่น ข้อใดถูกต้อง (ถ้าไม่มีให้เป็น null)",
    "choices": [
      {{"label": "1", "text": "ตัวเลือกที่ 1"}},
      {{"label": "2", "text": "ตัวเลือกที่ 2"}},
      {{"label": "3", "text": "ตัวเลือกที่ 3"}},
      {{"label": "4", "text": "ตัวเลือกที่ 4"}},
      {{"label": "5", "text": "ตัวเลือกที่ 5"}}
    ],
    "correct_answer": "1",
    "explanation": "คำอธิบายเชิงลึกว่าทำไมข้อนี้ถึงถูก และทำไมข้ออื่นถึงผิด (สามารถใส่เป็นข้อความธรรมดาได้)"
  }}
]"""

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        timeout=120,
    )
    content = response.choices[0].message.content
    return _parse_json_from_llm(content)


# ── Async variants for FastAPI endpoints (non-blocking) ──

async def predict_trends_async(stats_text: str, model: str = "tencent/hy3:free") -> str:
    """Async variant of predict_trends."""
    client = _build_async_client()

    system_prompt = (
        "คุณเป็นผู้เชี่ยวชาญด้านการวิเคราะห์ข้อมูลและคณาจารย์ทันตแพทย์ระดับสูง "
        "หน้าที่ของคุณคือวิเคราะห์สถิติข้อสอบที่ผ่านมา และทำนายแนวโน้ม (Prediction) ว่าหัวข้อไหนมีโอกาสออกสอบมากที่สุด "
        "พร้อมให้คำแนะนำในการเตรียมตัวสอบ (Study Guide) อย่างละเอียด"
    )

    user_prompt = f"""นี่คือข้อมูลสถิติของข้อสอบ NL ทันตแพทย์ในระบบของเรา (แบ่งตามหมวดวิชาและบทบาทหน้าที่):

{stats_text}

กรุณาวิเคราะห์ข้อมูลนี้และเขียนรายงานในรูปแบบ Markdown โดยมีหัวข้อดังนี้:
1. ภาพรวมสถิติ (Overview)
2. หมวดวิชาและหัวข้อที่ออกสอบบ่อยที่สุด (Top Trending Topics)
3. การวิเคราะห์หมวดวิชากฎหมายและจรรยาบรรณ (Law & Ethics Analysis)
4. คำทำนายแนวโน้มข้อสอบในอนาคต (Future Trends Prediction)
5. คำแนะนำในการเตรียมตัวสอบ (Study Recommendations)"""

    response = await client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        timeout=60,
    )
    return response.choices[0].message.content


async def generate_mock_questions_async(
    category: str,
    task: str,
    count: int,
    examples: List[Dict[str, Any]],
    model: str = "tencent/hy3:free",
) -> List[Dict[str, Any]]:
    """Async variant of generate_mock_questions."""
    from rag_engine import search_vault

    client = _build_async_client()

    system_prompt = (
        "คุณเป็นกรรมการออกข้อสอบ NL ทันตแพทย์ระดับประเทศ "
        "คุณมีความเชี่ยวชาญในการเขียนข้อสอบแบบ Multiple Choice Question (MCQ) ที่มีตัวเลือก 5 ข้อ "
        "ข้อสอบต้องมีความท้าทาย สมจริง และสอดคล้องกับมาตรฐาน ศ.ป.ท. พ.ศ. 2563"
    )

    context_query = f"{category} {task}"
    rag_context = await asyncio.to_thread(search_vault, context_query, 3)

    examples_text = ""
    for i, ex in enumerate(examples):
        examples_text += f"\nตัวอย่างที่ {i+1}:\n"
        examples_text += f"คำถาม: {ex['question_text']}\n"
        examples_text += "ตัวเลือก:\n"
        for c in ex['choices']:
            examples_text += f"- {c['label']}: {c['text']}\n"
        examples_text += f"เฉลยที่ถูกต้อง: {ex['correct_answer']}\n"

    user_prompt = f"""กรุณาสร้างข้อสอบใหม่จำนวน {count} ข้อ 
สำหรับหมวดวิชา: "{category}" 
บทบาทหน้าที่ (Task): "{task}"

นี่คือข้อมูลความรู้และจุดเชื่อมโยง (Knowledge Context) ที่ดึงมาจาก Obsidian Knowledge Graph:
{rag_context if rag_context else 'ไม่มีข้อมูลอ้างอิงเพิ่มเติม'}

นี่คือตัวอย่างข้อสอบเก่าเพื่อให้คุณเห็นแนวทางการออกข้อสอบ ความยาก และรูปแบบคำถาม:
{examples_text}

จงสร้างข้อสอบใหม่ที่ 'ไม่ซ้ำ' กับตัวอย่าง แต่ยังคงรักษามาตรฐานและความยากในระดับเดียวกัน
กรุณาตอบกลับเป็นรูปแบบ JSON Array เท่านั้น โดยแต่ละข้อมีโครงสร้างดังนี้:
[
  {{
    "question_text": "เนื้อหาคำถามทั้งหมด (รวมถึง case scenario ถ้ามี)",
    "stem": "ส่วนของ Case scenario (ถ้าไม่มีให้เป็น null)",
    "proposition": "ส่วนของคำถามตรงๆ เช่น ข้อใดถูกต้อง (ถ้าไม่มีให้เป็น null)",
    "choices": [
      {{"label": "1", "text": "ตัวเลือกที่ 1"}},
      {{"label": "2", "text": "ตัวเลือกที่ 2"}},
      {{"label": "3", "text": "ตัวเลือกที่ 3"}},
      {{"label": "4", "text": "ตัวเลือกที่ 4"}},
      {{"label": "5", "text": "ตัวเลือกที่ 5"}}
    ],
    "correct_answer": "1",
    "explanation": "คำอธิบายเชิงลึกว่าทำไมข้อนี้ถึงถูก และทำไมข้ออื่นถึงผิด (สามารถใส่เป็นข้อความธรรมดาได้)"
  }}
]"""

    response = await client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        timeout=120,
    )
    content = response.choices[0].message.content
    return _parse_json_from_llm(content)

