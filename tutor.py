import os

from fastapi import APIRouter, Depends, HTTPException
from openai import AsyncOpenAI
from pydantic import BaseModel
from sqlalchemy.orm import Session

import models
from auth import get_current_user
from database import get_db

router = APIRouter(prefix="/api/tutor", tags=["tutor"])

OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")
MODEL = os.environ.get("TUTOR_MODEL", "openrouter/free")


class ChatRequest(BaseModel):
    question_id: int
    message: str


class ChatResponse(BaseModel):
    reply: str


def _build_async_client() -> AsyncOpenAI:
    if not OPENROUTER_API_KEY:
        raise RuntimeError("OPENROUTER_API_KEY environment variable not set.")
    return AsyncOpenAI(base_url="https://openrouter.ai/api/v1", api_key=OPENROUTER_API_KEY)


async def call_openrouter_chat(system_prompt: str, user_prompt: str) -> str:
    """Non-blocking chat call via AsyncOpenAI (does not stall the event loop)."""
    if not OPENROUTER_API_KEY:
        return "ระบบติวเตอร์ AI สดต้องตั้งค่า `OPENROUTER_API_KEY` บนเซิร์ฟเวอร์ก่อนครับ แต่คุณยังสามารถศึกษาคำอธิบายเชิงลึกจากคลัง Textbook & Evidence และเปรียบเทียบตัวเลือกด้านบนได้ครบทุกข้อครับ"
    client = _build_async_client()
    try:
        response = await client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3,
            timeout=30,
            extra_headers={
                "HTTP-Referer": "http://localhost:8000",
                "X-Title": "NL Dental Exam Tutor",
            },
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error calling OpenRouter: {e}")
        return "ขออภัย ระบบไม่สามารถตอบกลับได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง"


@router.post("/chat", response_model=ChatResponse)
async def chat_with_tutor(
    req: ChatRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    question = db.query(models.Question).filter(models.Question.id == req.question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    # Construct rich pedagogical context
    context = f"หมวดวิชา: {question.category}\n"
    if question.task:
        context += f"บทบาทหน้าที่ (Task): {question.task}\n"
    if question.cognitive_level:
        context += f"ระดับพุทธิพิสัย: {question.cognitive_level}\n"
    if question.must_know_topic:
        context += f"หัวข้อ Must-Know: {question.must_know_topic}\n"
    if question.stem:
        context += f"โจทย์หลัก: {question.stem}\n"
    context += f"คำถาม: {question.proposition or question.question_text}\n"
    context += "ตัวเลือก:\n"
    for c in question.choices:
        context += f"{c.label}. {c.text}\n"
    context += f"เฉลยที่ถูกต้อง: {question.correct_answer}\n"
    if question.explanation:
        context += f"คำอธิบายและหลักฐานทางวิชาการเดิม: {question.explanation}\n"

    # Read the Professor Prompt from Obsidian
    prompt_path = os.path.join("Obsidian_NL_Exam", "AI_Tutor_Prompt.md")
    try:
        with open(prompt_path, "r", encoding="utf-8") as f:
            professor_prompt = f.read()
    except Exception:
        professor_prompt = "คุณคืออาจารย์ทันตแพทย์ผู้เชี่ยวชาญ (Professor Doctor of Dentistry)"

    system_prompt = f"""{professor_prompt}

คุณกำลังให้คำปรึกษานักศึกษาเกี่ยวกับข้อสอบข้อนี้ (อ้างอิงตามมาตรฐานทันตแพทย์ไทย ทันตแพทยสภา และสมาคมวิชาชีพเฉพาะทางด้วยเมื่อเกี่ยวข้อง):
---
{context}
---
จงตอบคำถามของนักศึกษาอย่างกระชับ ชัดเจน เป็นระบบเข้าใจง่าย แบบอาจารย์สอนศิษย์ พร้อมช่วยเทียบจุดตัดความจำสำหรับเข้าห้องสอบ
"""

    reply = await call_openrouter_chat(system_prompt, req.message)
    return {"reply": reply}