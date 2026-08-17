import os
import sys
import time
import json
import asyncio
from typing import List, Tuple, Optional

from openai import OpenAI, AsyncOpenAI
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()

def get_system_prompt():
    prompt_path = os.path.join("Obsidian_NL_Exam", "AI_Tutor_Prompt.md")
    try:
        with open(prompt_path, "r", encoding="utf-8") as f:
            return f.read()
    except Exception:
        return "คุณเป็นผู้เชี่ยวชาญด้านทันตแพทย์ระดับสูง (อาจารย์ทันตแพทย์) หน้าที่ของคุณคือวิเคราะห์ข้อสอบและให้เฉลยที่ถูกต้องพร้อมคำอธิบายเชิงลึกเป็นภาษาไทย"


class ExplanationResult(BaseModel):
    correct_answer: str = Field(
        description="ป้ายกำกับ (label) ของตัวเลือกที่ถูกต้อง ต้องตรงกับ label หนึ่งในตัวเลือกที่ให้มาพอดิบพอดี เช่น '1', '2', 'ก', 'ข'"
    )
    core_principle: str = Field(
        description="อธิบายหลักการและกลไกที่เกี่ยวข้องกับเรื่องนี้อย่างละเอียด"
    )
    choice_explanations: dict = Field(
        description="Dictionary แจกแจงเหตุผลว่าแต่ละตัวเลือกถูกหรือผิดอย่างไร โดย key เป็น label ของตัวเลือก และ value เป็นคำอธิบาย"
    )
    future_prediction: str = Field(
        description="การเก็งข้อสอบหรือวิเคราะห์ว่าโจทย์ข้อนี้สามารถพลิกแพลงไปถามอะไรได้อีกในอนาคต พร้อมคำตอบ",
        default=""
    )


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


def _format_choices(choices: List[Tuple[str, str]]) -> str:
    return "\n".join(f"{label}. {text}" for label, text in choices)


def _parse_llm_output(text: str) -> ExplanationResult:
    """Extract JSON from LLM output (handles markdown code fences)."""
    # Try to find JSON block
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1:
        json_str = text[start:end+1]
        try:
            data = json.loads(json_str)
            return ExplanationResult(**data)
        except Exception:
            pass
    # Fallback: try to parse entire text as JSON
    try:
        data = json.loads(text)
        return ExplanationResult(**data)
    except Exception:
        # Last resort: return raw text
        return ExplanationResult(correct_answer="?", core_principle=text, choice_explanations={})


def explain_question(
    question_text: str,
    choices: List[Tuple[str, str]],
    category: str,
    task: str,
    model: str = "google/gemini-2.5-flash",
    max_retries: int = 3,
) -> ExplanationResult:
    """Call the LLM to produce a correct answer + Thai explanation for a question.

    Args:
        question_text: the stem + sub-question text
        choices: list of (label, text) tuples
        category: clinical category (Thai)
        task: professional task (Thai)
        model: OpenRouter model id
        max_retries: number of attempts on transient 429/5xx errors
    """
    from rag_engine import search_vault
    
    client = _build_client()
    choices_block = _format_choices(choices)
    fallback_models = [
        "tencent/hy3:free",
    ]

    # RAG: Retrieve context from Obsidian vault based on question content
    context_query = f"{category} {task} {question_text}"
    rag_context = search_vault(context_query, k=3)

    user_prompt = f"""ด้านล่างคือข้อสอบทันตแพทย์ กรุณาวิเคราะห์และระบุตัวเลือกที่ถูกต้องพร้อมคำอธิบาย

หมวดวิชา (Category): {category}
บทบาทหน้าที่ (Task): {task}

นี่คือข้อมูลความรู้และจุดเชื่อมโยง (Knowledge Context) ที่ดึงมาจาก Obsidian Knowledge Graph:
{rag_context if rag_context else 'ไม่มีข้อมูลอ้างอิงเพิ่มเติม'}

ข้อความคำถาม:
{question_text}

ตัวเลือกที่มีให้:
{choices_block}

กรุณาตอบกลับในรูปแบบ JSON เท่านั้น โดยมีโครงสร้างดังนี้:
{{
  "correct_answer": "ป้ายกำกับของตัวเลือกที่ถูกที่สุด",
  "core_principle": "อธิบายหลักการ ทฤษฎี หรือกลไกที่เกี่ยวข้องกับโรค/ปัญหาในข้อนี้อย่างละเอียด",
  "choice_explanations": {{
    "1": "เหตุผลที่ข้อ 1 ถูกหรือผิด",
    "2": "เหตุผลที่ข้อ 2 ถูกหรือผิด",
    "...": "ทำต่อไปจนครบทุกตัวเลือก"
  }},
  "future_prediction": "อธิบายการพลิกแพลงโจทย์ หรือเกร็ดความรู้ทริคจากอาจารย์ (Professor's Wisdom)"
}}"""

    last_err = None
    for attempt in range(max_retries):
        for mdl in fallback_models[attempt:]:
            try:
                response = client.chat.completions.create(
                    model=mdl,
                    messages=[
                        {"role": "system", "content": get_system_prompt()},
                        {"role": "user", "content": user_prompt},
                    ],
                    timeout=60,
                )
                content = response.choices[0].message.content
                return _parse_llm_output(content)
            except Exception as e:  # noqa: BLE001
                msg = str(e)
                last_err = e
                # Retry on rate-limit / transient; otherwise try next model
                if "429" in msg or "5" in msg[:3]:
                    print(f"[explainer] model {mdl} failed ({msg}); trying next...")
                    continue
                else:
                    raise
        # if we cycled models and all hit 429, wait before next attempt
        if attempt < max_retries - 1:
            time.sleep(15 * (attempt + 1))

    raise RuntimeError(f"All models failed. Last error: {last_err}")


async def explain_question_async(
    question_text: str,
    choices: List[Tuple[str, str]],
    category: str,
    task: str,
    max_retries: int = 3,
) -> ExplanationResult:
    """Async variant of explain_question for use in FastAPI endpoints.

    Uses AsyncOpenAI so the event loop is not blocked while waiting on the
    LLM — critical under concurrent web traffic.
    """
    from rag_engine import search_vault

    client = _build_async_client()
    choices_block = _format_choices(choices)
    fallback_models = [
        "tencent/hy3:free",
    ]

    context_query = f"{category} {task} {question_text}"
    # search_vault is CPU-bound-ish (embedding model); run in a thread to stay async-friendly
    rag_context = await asyncio.to_thread(search_vault, context_query, 3)

    user_prompt = f"""ด้านล่างคือข้อสอบทันตแพทย์ กรุณาวิเคราะห์และระบุตัวเลือกที่ถูกต้องพร้อมคำอธิบาย

หมวดวิชา (Category): {category}
บทบาทหน้าที่ (Task): {task}

นี่คือข้อมูลความรู้และจุดเชื่อมโยง (Knowledge Context) ที่ดึงมาจาก Obsidian Knowledge Graph:
{rag_context if rag_context else 'ไม่มีข้อมูลอ้างอิงเพิ่มเติม'}

ข้อความคำถาม:
{question_text}

ตัวเลือกที่มีให้:
{choices_block}

กรุณาตอบกลับในรูปแบบ JSON เท่านั้น โดยมีโครงสร้างดังนี้:
{{
  "correct_answer": "ป้ายกำกับของตัวเลือกที่ถูกที่สุด",
  "core_principle": "อธิบายหลักการ ทฤษฎี หรือกลไกที่เกี่ยวข้องกับโรค/ปัญหาในข้อนี้อย่างละเอียด",
  "choice_explanations": {{
    "1": "เหตุผลที่ข้อ 1 ถูกหรือผิด",
    "2": "เหตุผลที่ข้อ 2 ถูกหรือผิด",
    "...": "ทำต่อไปจนครบทุกตัวเลือก"
  }},
  "future_prediction": "อธิบายการพลิกแพลงโจทย์ หรือเกร็ดความรู้ทริคจากอาจารย์ (Professor's Wisdom)"
}}"""

    last_err = None
    for attempt in range(max_retries):
        for mdl in fallback_models[attempt:]:
            try:
                response = await client.chat.completions.create(
                    model=mdl,
                    messages=[
                        {"role": "system", "content": get_system_prompt()},
                        {"role": "user", "content": user_prompt},
                    ],
                    timeout=60,
                )
                content = response.choices[0].message.content
                return _parse_llm_output(content)
            except Exception as e:  # noqa: BLE001
                msg = str(e)
                last_err = e
                if "429" in msg or "5" in msg[:3]:
                    print(f"[explainer] model {mdl} failed ({msg}); trying next...")
                    continue
                else:
                    raise
        if attempt < max_retries - 1:
            await asyncio.sleep(15 * (attempt + 1))

    raise RuntimeError(f"All models failed. Last error: {last_err}")


if __name__ == "__main__":
    # Quick smoke test
    res = explain_question(
        "ผู้ป่วยอายุ 20 ปี ฟันซ้อนเก ต้องการจัดฟัน แพทย์แนะนำถอนฟันกรามน้อย 4 ซี่",
        [("1", "พักใช้ใบอนุญาต"), ("2", "เพิกถอนใบอนุญาต"),
         ("3", "ภาคทัณฑ์"), ("4", "ปรับไม่เกิน 20,000 บาท"), ("5", "จำคุก 3 ปี")],
        "ทันตกรรมชุมชน",
        "ขั้นตอนและวิธีการรักษา",
    )
    print("correct:", res.correct_answer)
    print("core_principle:", res.core_principle[:200])
    print("choices:", res.choice_explanations)
