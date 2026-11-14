import os
import re
from typing import Any, Dict, List, Literal, Optional

from fastapi import APIRouter, Depends, HTTPException
from openai import AsyncOpenAI
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session, selectinload

import models
from auth import get_current_user
from database import get_db
from learning import (
    CANONICAL_TEXTBOOKS,
    TOPIC_METADATA,
    _extract_numeric_rules,
    _parse_explanation,
    get_topic_meta,
)
from pathways import CURATED_TOPIC_PATHWAYS, get_topic_pathways
from tos_blueprint import is_mock_70_locked

router = APIRouter(prefix="/api/tutor", tags=["tutor"])

OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")
MODEL = os.environ.get("TUTOR_MODEL", "openrouter/free")


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(..., max_length=4000)


class ChatRequest(BaseModel):
    question_id: Optional[int] = None
    topic_id: Optional[str] = None
    pathway_id: Optional[str] = None
    message: str = Field(..., min_length=1, max_length=3000)
    history: List[ChatMessage] = Field(default_factory=list)
    user_answer: Optional[str] = None


class ChatResponse(BaseModel):
    reply: str
    mode: str = "evidence_fallback"  # "llm" | "evidence_fallback"
    resolved_topic_id: Optional[str] = None
    suggested_tag: str = "สรุป AI Tutor"


def _build_async_client() -> AsyncOpenAI:
    if not OPENROUTER_API_KEY:
        raise RuntimeError("OPENROUTER_API_KEY environment variable not set.")
    return AsyncOpenAI(base_url="https://openrouter.ai/api/v1", api_key=OPENROUTER_API_KEY)


def _match_thai_protocols(topic_id: Optional[str], category: str) -> List[Dict[str, Any]]:
    matched: List[Dict[str, Any]] = []
    for tb in CANONICAL_TEXTBOOKS:
        if (topic_id and tb["id"] == topic_id) or (category and tb["specialty"] == category):
            matched.append(
                {
                    "id": tb["id"],
                    "title": tb["title"],
                    "specialty": tb["specialty"],
                    "thai_association": tb.get("thai_association", ""),
                    "thai_references": tb.get("thai_references", []),
                    "thai_protocol_highlights": tb.get("thai_protocol_highlights", []),
                }
            )
    return matched


def _format_pathway_summary(pathways_list: List[Dict[str, Any]], focus_pathway_id: Optional[str]) -> str:
    if not pathways_list:
        return ""
    ordered = list(pathways_list)
    if focus_pathway_id:
        ordered.sort(key=lambda p: 0 if p.get("id") == focus_pathway_id else 1)

    lines: List[str] = []
    for pw in ordered[:3]:
        lines.append(f"- **Pathway:** {pw.get('title', '')} ({pw.get('pathway_type', 'protocol')})")
        if pw.get("reference"):
            lines.append(f"  อ้างอิง: {pw['reference']}")
        for st in pw.get("steps", [])[:6]:
            line = f"  {st.get('step_num', '')}. [{st.get('stage', '')}] {st.get('title', '')}: {st.get('detail', '')}"
            lines.append(line)
            for br in st.get("branches", [])[:3]:
                lines.append(
                    f"     • ถ้า [{br.get('condition', '')}] → {br.get('outcome', '')}"
                )
    return "\n".join(lines)


def _infer_suggested_tag(message: str, ctx: Dict[str, Any]) -> str:
    msg_l = (message or "").lower()
    if any(k in msg_l for k in ("ไทย", "thai", "ทันตแพทยสภา", "กรมอนามัย", "มาตรา", "พรบ", "พ.ร.บ.")):
        return "พลาดแนวทางไทย"
    if any(k in msg_l for k in ("เลข", "โดส", "dose", "mg", "mm", "กี่", "%", "ระยะ")):
        return "ลืมตัวเลข"
    if (
        ctx.get("user_answer")
        and ctx.get("correct_answer")
        and str(ctx["user_answer"]).strip().upper() != str(ctx["correct_answer"]).strip().upper()
    ) or any(k in msg_l for k in ("ตัวลวง", "แยก", "ต่าง", "ผิด", "สับสน", "ทำไม")):
        return "โดนตัวลวง"
    if any(k in msg_l for k in ("นิยาม", "กลไก", "คืออะไร", "pathogenesis")):
        return "สับสนนิยาม"
    return "สรุป AI Tutor"


def _build_evidence_fallback_reply(
    req: ChatRequest,
    ctx: Dict[str, Any],
    fallback_reason: str,
) -> str:
    """Deterministic, high-yield Socratic + Evidence fallback when OpenRouter is unconfigured or offline."""
    msg_l = req.message.lower()
    exp: Dict[str, Any] = ctx.get("exp") or {}
    pathways_list: List[Dict[str, Any]] = ctx.get("pathways") or []
    thai_protocols: List[Dict[str, Any]] = ctx.get("thai_protocols") or []
    sample_exps: List[Dict[str, Any]] = ctx.get("topic_sample_exps") or []

    parts: List[str] = []
    title_label = (
        f"ข้อสอบ #{req.question_id} — {ctx.get('topic_title_th') or ctx.get('category', '')}"
        if req.question_id
        else f"หัวข้อ {ctx.get('topic_title_th') or req.topic_id} ({ctx.get('category', '')})"
    )
    parts.append(f"### 🎓 อาจารย์พี่เลี้ยง (Evidence & Pathway Mentor) — {title_label}")

    asks_distractor = any(
        k in msg_l for k in ("ตัวลวง", "เทียบ", "ผิด", "แยก", "ทำไม", "ข้อ", "choice", "socratic")
    )
    asks_thai = any(
        k in msg_l for k in ("ไทย", "thai", "ทันตแพทยสภา", "ราชวิทยาลัย", "กรมอนามัย", "สมาคม", "ต่างจาก")
    )
    asks_three_rules = any(
        k in msg_l for k in ("3 ข้อ", "กฎ", "สรุป", "จำ", "mnemonic", "ก่อนเข้าห้องสอบ")
    )
    asks_twist = any(k in msg_l for k in ("พลิกแพลง", "เปลี่ยน", "สมมติ", "เงื่อนไข"))

    # 1) Thai Protocol focus
    if asks_thai:
        if thai_protocols:
            parts.append("**🇹🇭 เกณฑ์มาตรฐานทันตแพทย์ไทยเทียบกับหลักสากล:**")
            for tp in thai_protocols[:2]:
                if tp.get("thai_association"):
                    parts.append(f"- **องค์กรอ้างอิงไทย:** {tp['thai_association']}")
                for hl in (tp.get("thai_protocol_highlights") or [])[:4]:
                    parts.append(f"- {hl}")
                if tp.get("thai_references"):
                    parts.append(f"- **ตำรา/CPG ไทย:** {'; '.join(tp['thai_references'][:2])}")
        else:
            parts.append("- หัวข้อนี้ยึดตามเกณฑ์สากลควบคู่จรรยาบรรณทันตแพทยสภา และบริบทระบบบริการสุขภาพช่องปากไทย")

    # 2) Distractor & differential breakdown
    elif asks_distractor and (exp.get("choice_explanations") or pathways_list):
        if ctx.get("correct_answer"):
            parts.append(f"**✅ จุดตัดสินคำตอบที่ถูก ({ctx['correct_answer']}):**")
            parts.append(exp.get("why_correct") or exp.get("core_principle") or "ดูหลักฐานคลินิกด้านล่าง")
        ce = exp.get("choice_explanations")
        if isinstance(ce, dict) and ce:
            parts.append("\n**⚖️ เปรียบเทียบจุดตัดรายตัวเลือก (Elimination Matrix):**")
            user_ans = (req.user_answer or "").strip().upper()
            for lbl, detail in ce.items():
                marker = " ← *(ตัวเลือกที่คุณตอบ)*" if user_ans and lbl.strip().upper() == user_ans else ""
                parts.append(f"- **{lbl}.**{marker} {detail}")
        elif pathways_list:
            parts.append("\n**🔀 เกณฑ์แยกทางตัดสินใจจาก Pathway:**")
            for pw in pathways_list[:2]:
                for st in pw.get("steps", []):
                    for br in st.get("branches", []):
                        parts.append(f"- **ถ้า {br.get('condition')}** → {br.get('outcome')}")

    # 3) Three rules before entering exam room
    elif asks_three_rules:
        parts.append("**⚡ กฎ 3 ข้อจำให้ขึ้นใจก่อนเข้าห้องสอบ:**")
        rules: List[str] = []
        core = (exp.get("core_principle") or "").strip()
        takeaway = (exp.get("key_takeaway") or "").strip()
        pitfall = (exp.get("common_pitfall") or "").strip()
        if core:
            rules.append(f"**หลักการแกนกลาง:** {core}")
        if takeaway and takeaway != core:
            rules.append(f"**คีย์ลัดตัดสินคำตอบ:** {takeaway}")
        if pitfall:
            rules.append(f"**ระวังตัวลวงอันดับ 1:** {pitfall}")

        for sexp in sample_exps:
            if len(rules) >= 3:
                break
            kt = (sexp.get("key_takeaway") or sexp.get("core_principle") or "").strip()
            if kt and kt not in rules:
                rules.append(f"**ประเด็นออกซ้ำบ่อย:** {kt}")

        for pw in pathways_list:
            if len(rules) >= 3:
                break
            for st in pw.get("steps", []):
                if st.get("node_type") in ("decision", "warning", "action") and len(rules) < 3:
                    rules.append(f"**{st.get('title')}:** {st.get('detail')}")

        for idx, r in enumerate(rules[:3], 1):
            parts.append(f"{idx}. {r}")

    # 4) Condition twist / General Socratic teaching
    else:
        core = (exp.get("core_principle") or exp.get("why_correct") or "").strip()
        if core:
            parts.append(f"**✅ หลักการตั้งต้น:**\n{core}")
        elif sample_exps:
            parts.append("**✅ สรุปหลักการสำคัญของหัวข้อนี้:**")
            for idx, sexp in enumerate(sample_exps[:2], 1):
                txt = (sexp.get("core_principle") or sexp.get("key_takeaway") or "").strip()
                if txt:
                    parts.append(f"{idx}. {txt}")

        if asks_twist and pathways_list:
            parts.append("\n**🔄 หากโจทย์พลิกเงื่อนไข (Branching Scenarios):**")
            for pw in pathways_list[:2]:
                for st in pw.get("steps", []):
                    for br in st.get("branches", []):
                        parts.append(f"- ถ้าผู้ป่วยเปลี่ยนเป็น **{br.get('condition')}** → แนวทางจะเปลี่ยนเป็น: **{br.get('outcome')}**")
        elif pathways_list:
            pw0 = pathways_list[0]
            parts.append(f"\n**🔀 ลำดับตัดสินใจสำคัญ ({pw0.get('title')}):**")
            for st in pw0.get("steps", [])[:4]:
                parts.append(f"- **ขั้น {st.get('step_num')}. {st.get('title')}:** {st.get('detail')}")

        pitfall = (exp.get("common_pitfall") or "").strip()
        if pitfall:
            parts.append(f"\n**💣 จุดหลอกที่ห้ามพลาด:** {pitfall}")

    # Add Thai highlight note + Numeric cutoffs if helpful
    if not asks_thai and thai_protocols and thai_protocols[0].get("thai_protocol_highlights"):
        parts.append(f"\n**🇹🇭 ทิปมาตรฐานไทย:** {thai_protocols[0]['thai_protocol_highlights'][0]}")

    # Closing Socratic check question
    socratic_q = "ลองทบทวนกับตัวเองดูครับ: ถ้าคนไข้มีโรคประจำตัวเพิ่ม หรือเปลี่ยนเกณฑ์ตัวเลข/อายุในโจทย์ ข้อแรกที่คุณต้องเช็กก่อนลงมือรักษาคืออะไร?"
    if pathways_list:
        for st in pathways_list[0].get("steps", []):
            if st.get("branches"):
                cond0 = st["branches"][0].get("condition", "")
                socratic_q = f"ลองเช็กความเข้าใจแบบ Socratic: จากกรณีนี้ หากพบเงื่อนไข **\"{cond0}\"** คุณจะเลือกจัดการขั้นตอนถัดไปอย่างไรครับ?"
                break
    parts.append(f"\n> ❓ **คำถามเช็กความเข้าใจ:** {socratic_q}")
    parts.append(f"\n*(ℹ️ {fallback_reason})*")
    return "\n".join(parts)


async def call_openrouter_chat(
    system_prompt: str,
    history: List[ChatMessage],
    user_prompt: str,
) -> Optional[str]:
    """Non-blocking multi-turn OpenRouter chat call. Returns None when unconfigured or on error."""
    if not OPENROUTER_API_KEY:
        return None
    client = _build_async_client()
    messages: List[Dict[str, str]] = [{"role": "system", "content": system_prompt}]
    for h in history[-10:]:
        content = (h.content or "").strip()
        if content:
            messages.append({"role": h.role, "content": content})
    messages.append({"role": "user", "content": user_prompt})

    try:
        response = await client.chat.completions.create(
            model=MODEL,
            messages=messages,
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
        return None


def _collect_tutor_context(req: ChatRequest, db: Session) -> Dict[str, Any]:
    if not req.question_id and not (req.topic_id or "").strip():
        raise HTTPException(
            status_code=400,
            detail="Either question_id or topic_id must be provided.",
        )

    question: Optional[models.Question] = None
    exp: Dict[str, Any] = {}
    category = ""
    topic_id = (req.topic_id or "").strip() or None
    topic_sample_exps: List[Dict[str, Any]] = []
    unlocked_q_rows: List[models.Question] = []

    if req.question_id is not None:
        question = (
            db.query(models.Question)
            .options(selectinload(models.Question.choices))
            .filter(models.Question.id == req.question_id)
            .first()
        )
        if not question:
            raise HTTPException(status_code=404, detail="Question not found")
        if is_mock_70_locked() and question.source_exam and "2570" in question.source_exam:
            raise HTTPException(status_code=403, detail="Mock 2570 exam question is locked")
        exp = _parse_explanation(question.explanation)
        category = question.category or ""
        topic_id = topic_id or question.must_know_topic

    if topic_id:
        q_rows = (
            db.query(models.Question)
            .filter(models.Question.must_know_topic == topic_id)
            .order_by(models.Question.id.asc())
            .limit(8)
            .all()
        )
        locked = is_mock_70_locked()
        unlocked_q_rows = [
            q for q in q_rows if not (locked and q.source_exam and "2570" in q.source_exam)
        ]
        if not question and not unlocked_q_rows and topic_id not in TOPIC_METADATA and topic_id not in CURATED_TOPIC_PATHWAYS:
            raise HTTPException(status_code=404, detail=f"Topic '{topic_id}' not found")
        if not category and unlocked_q_rows:
            category = unlocked_q_rows[0].category or ""
        for sq in unlocked_q_rows[:5]:
            sexp = _parse_explanation(sq.explanation)
            if sexp:
                topic_sample_exps.append(sexp)

    meta = get_topic_meta(topic_id, category) if topic_id else {"title_th": category, "title_en": ""}
    title_th = meta.get("title_th") or category
    pathways_list = (
        get_topic_pathways(
            topic_id,
            category,
            unlocked_q_rows if unlocked_q_rows else ([question] if question else []),
            title_th,
            parse_fn=_parse_explanation,
        )
        if topic_id
        else []
    )
    thai_protocols = _match_thai_protocols(topic_id, category)

    return {
        "question": question,
        "exp": exp,
        "category": category,
        "topic_id": topic_id,
        "topic_title_th": meta.get("title_th") or category,
        "topic_title_en": meta.get("title_en") or "",
        "pathways": pathways_list,
        "thai_protocols": thai_protocols,
        "topic_sample_exps": topic_sample_exps,
        "user_answer": req.user_answer,
        "correct_answer": question.correct_answer if question else None,
    }


def _build_system_prompt(req: ChatRequest, ctx: Dict[str, Any]) -> str:
    prompt_path = os.path.join("Obsidian_NL_Exam", "AI_Tutor_Prompt.md")
    try:
        with open(prompt_path, "r", encoding="utf-8") as f:
            professor_prompt = f.read()
    except Exception:
        professor_prompt = "คุณคืออาจารย์ทันตแพทย์ผู้เชี่ยวชาญ (Professor Doctor of Dentistry)"

    context_blocks: List[str] = []
    if ctx["category"]:
        context_blocks.append(f"หมวดวิชา: {ctx['category']}")
    if ctx["topic_id"]:
        context_blocks.append(
            f"หัวข้อ Must-Know: {ctx['topic_id']} — {ctx['topic_title_th']} ({ctx['topic_title_en']})"
        )

    q: Optional[models.Question] = ctx.get("question")
    if q:
        if q.task:
            context_blocks.append(f"บทบาทหน้าที่ (Task): {q.task}")
        if q.cognitive_level:
            context_blocks.append(f"ระดับพุทธิพิสัย: {q.cognitive_level}")
        if q.stem:
            context_blocks.append(f"โจทย์หลัก: {q.stem}")
        context_blocks.append(f"คำถาม: {q.proposition or q.question_text}")
        choices_txt = "\n".join(f"{c.label}. {c.text}" for c in q.choices)
        context_blocks.append(f"ตัวเลือก:\n{choices_txt}")
        context_blocks.append(f"เฉลยที่ถูกต้อง: {q.correct_answer}")
        if req.user_answer:
            context_blocks.append(f"คำตอบที่นักศึกษาเลือก: {req.user_answer}")
        if q.explanation:
            context_blocks.append(f"คำอธิบายและหลักฐานทางวิชาการ: {q.explanation}")
    elif ctx["topic_sample_exps"]:
        snippets = []
        for idx, sexp in enumerate(ctx["topic_sample_exps"][:3], 1):
            cp = (sexp.get("core_principle") or sexp.get("key_takeaway") or "").strip()
            pf = (sexp.get("common_pitfall") or "").strip()
            if cp:
                snippets.append(f"{idx}. {cp}" + (f" [Pitfall: {pf}]" if pf else ""))
        if snippets:
            context_blocks.append("ประเด็นสำคัญที่ออกสอบในหัวข้อนี้:\n" + "\n".join(snippets))

    pw_summary = _format_pathway_summary(ctx["pathways"], req.pathway_id)
    if pw_summary:
        context_blocks.append(f"Clinical Decision Pathways ที่เกี่ยวข้อง:\n{pw_summary}")

    if ctx["thai_protocols"]:
        tp_lines: List[str] = []
        for tp in ctx["thai_protocols"][:2]:
            tp_lines.append(f"- องค์กรไทย: {tp.get('thai_association', '')}")
            for hl in (tp.get("thai_protocol_highlights") or [])[:5]:
                tp_lines.append(f"  * {hl}")
            if tp.get("thai_references"):
                tp_lines.append(f"  อ้างอิงไทย: {', '.join(tp['thai_references'][:3])}")
        context_blocks.append("เกณฑ์และแนวทางทันตแพทย์เฉพาะทางประเทศไทย:\n" + "\n".join(tp_lines))

    full_context = "\n".join(context_blocks)
    return f"""{professor_prompt}

คุณกำลังสอนนักศึกษาทันตแพทย์แบบ Socratic Multi-turn Dialogue (ถาม-ตอบต่อเนื่อง เชื่อมโยง Clinical Pathway และมาตรฐานทันตแพทย์ไทย):
---
{full_context}
---
แนวทางการตอบ:
1. ตอบตรงคำถามของนักศึกษาอย่างกระชับ ชัดเจน เป็นระบบ เข้าใจง่าย ใช้คำศัพท์แพทย์/ทันตแพทย์ภาษาอังกฤษคู่คำอธิบายภาษาไทย
2. เปรียบเทียบจุดตัด (Decision Cutoff) กับตัวลวง และชี้ให้เห็นหากแนวทางทันตแพทย์ไทย/กรมอนามัย/ทันตแพทยสภา มีจุดเน้นเฉพาะ
3. ปิดท้ายด้วยคำถามเช็กความเข้าใจแบบ Socratic 1 คำถามสั้นๆ เพื่อกระตุ้นให้นักศึกษาคิดต่อ (ยกเว้นเมื่อนักศึกษาขอแค่สรุปกฎท่องจำก่อนเข้าห้องสอบ)
"""


@router.post("/chat", response_model=ChatResponse)
async def chat_with_tutor(
    req: ChatRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    ctx = _collect_tutor_context(req, db)
    system_prompt = _build_system_prompt(req, ctx)
    suggested_tag = _infer_suggested_tag(req.message, ctx)

    llm_reply = await call_openrouter_chat(system_prompt, req.history, req.message)
    if llm_reply:
        return {
            "reply": llm_reply,
            "mode": "llm",
            "resolved_topic_id": ctx.get("topic_id"),
            "suggested_tag": suggested_tag,
        }

    fallback_note = (
        "ตอบโดยคลังหลักฐานวิชาการ, Clinical Pathway และแนวทางทันตแพทย์ไทยของระบบ (เนื่องจากยังไม่ได้ตั้งค่า OPENROUTER_API_KEY)"
        if not OPENROUTER_API_KEY
        else "ตอบโดยคลังหลักฐานวิชาการของระบบชั่วคราว เนื่องจากไม่สามารถเชื่อมต่อโมเดล AI ภายนอกได้"
    )
    fallback_reply = _build_evidence_fallback_reply(req, ctx, fallback_note)
    return {
        "reply": fallback_reply,
        "mode": "evidence_fallback",
        "resolved_topic_id": ctx.get("topic_id"),
        "suggested_tag": suggested_tag,
    }
