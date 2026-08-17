import os
import sys
import json
import time
import re
from typing import List

import fitz  # PyMuPDF
from openai import OpenAI
from schema import ExamBank, ExamQuestion, ExamChoice, ClinicalCategory, ProfessionalTask
from dotenv import load_dotenv

load_dotenv()

# All capable FREE chat models on OpenRouter (user: use every free model, rotate
# when one is throttled). Ordered strongest-first. Excludes code-only (qwen-coder,
# lyria audio), tiny 1-3b, reasoning models, and models confirmed 404 "unavailable
# for free" (openai/gpt-oss-120b:free, google/gemma-4-31b-it:free).
MODEL_ROTATION = [
    "meta-llama/llama-3.3-70b-instruct:free",
    "nousresearch/hermes-3-llama-3.1-405b:free",
    "nvidia/nemotron-3-super-120b-a12b:free",
    "qwen/qwen3-next-80b-a3b-instruct:free",
    "tencent/hy3:free",
    "nvidia/nemotron-nano-9b-v2:free",
    "meta-llama/llama-3.2-3b-instruct:free",
    "liquid/lfm-2.5-1.2b-instruct:free",
]
PRIMARY_MODEL = MODEL_ROTATION[0]
FALLBACK_MODELS = MODEL_ROTATION[1:]

# Space LLM calls to stay under the free-tier RPM (seconds between calls).
RATE_LIMIT_SLEEP = 18.0
_last_call_ts = 0.0

CATEGORY_VALUES = [c.value for c in ClinicalCategory]
TASK_VALUES = [t.value for t in ProfessionalTask]

SYSTEM_PROMPT = (
    "You are an expert Thai dental licensing exam (ข้อสอบ NL ทันตแพทย์) data extractor. "
    "Extract multiple-choice questions from the given exam text and return ONLY a JSON object "
    "with a 'questions' array. Each question object must have exactly these keys:\n"
    "  question_text: string (the full stem + proposition text, in Thai)\n"
    "  choices: array of {label: string, text: string}\n"
    "  correct_answer: string or null (the correct choice label if shown in the text, else null)\n"
    "  category: string (MUST be one of the ClinicalCategory values below)\n"
    "  task: string (MUST be one of the ProfessionalTask values below)\n"
    "  explanation: string or null\n"
    "  image_paths: array of strings (usually empty)\n"
    "  source_exam: string (the provided source exam name)\n\n"
    "ClinicalCategory values:\n" + "\n".join(f"  - {c}" for c in CATEGORY_VALUES) + "\n\n"
    "ProfessionalTask values:\n" + "\n".join(f"  - {t}" for t in TASK_VALUES) + "\n\n"
    "Only output the JSON object. No markdown fences, no commentary."
)

def extract_pages_from_pdf(pdf_path: str) -> List[str]:
    """Returns a list of per-page text strings."""
    pages = []
    try:
        with fitz.open(pdf_path) as doc:
            for page in doc:
                pages.append(page.get_text())
    except Exception as e:
        print(f"Error reading PDF {pdf_path}: {e}")
        sys.exit(1)
    return pages

def _call_llm(messages, max_retries: int = 6):
    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        raise RuntimeError("OPENROUTER_API_KEY environment variable not set.")
    client = OpenAI(base_url="https://openrouter.ai/api/v1", api_key=api_key,
                    timeout=45, max_retries=0)
    models = [PRIMARY_MODEL] + FALLBACK_MODELS
    last_err = None
    for model in models:
        for attempt in range(max_retries):
            try:
                # Free tier has very low RPM — space calls out to avoid 429 storms.
                global _last_call_ts
                elapsed = time.time() - _last_call_ts
                if elapsed < RATE_LIMIT_SLEEP:
                    time.sleep(RATE_LIMIT_SLEEP - elapsed)
                resp = client.chat.completions.create(
                    model=model,
                    messages=messages,
                    temperature=0.0,
                )
                _last_call_ts = time.time()
                return resp.choices[0].message.content or ""
            except Exception as e:
                last_err = e
                # If this model is upstream-throttled (429 with Retry-After /
                # "rate-limited upstream"), don't burn all retries on it —
                # fall through to the next model quickly.
                err_str = str(e)
                is_throttled = (
                    "rate-limited upstream" in err_str
                    or (getattr(e, "response", None) is not None
                        and e.response.headers.get("Retry-After"))
                )
                # Honor the API's own Retry-After when present.
                retry_after = None
                try:
                    if getattr(e, "response", None) is not None:
                        h = e.response.headers.get("Retry-After")
                        if h:
                            retry_after = float(h)
                    if retry_after is None:
                        m = re.search(r"retry_after_seconds['\"]?\s*[:=]\s*([\d.]+)", err_str)
                        if m:
                            retry_after = float(m.group(1))
                except Exception:
                    retry_after = None
                if is_throttled and model != models[-1]:
                    # skip to next model; still respect the suggested wait.
                    wait = max(retry_after or 0, 2.0)
                    print(f"  [model {model}] upstream-throttled; trying next model after {wait:.0f}s")
                    time.sleep(wait)
                    break
                wait = max(min(2 ** attempt * 6, 30), retry_after or 0)
                print(f"  [model {model}] call failed (attempt {attempt+1}): {e}; sleeping {wait:.0f}s")
                time.sleep(wait)
    raise RuntimeError(f"All models failed. Last error: {last_err}")

def _parse_json(content: str):
    """Extract a JSON object from model output (handles fences / prose)."""
    if not content:
        return None
    cleaned = content.strip()
    # strip ```json ... ``` fences
    m = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", cleaned, re.DOTALL)
    if m:
        cleaned = m.group(1)
    else:
        # find first { and last }
        s, e = cleaned.find("{"), cleaned.rfind("}")
        if s != -1 and e != -1 and e > s:
            cleaned = cleaned[s:e+1]
    try:
        return json.loads(cleaned)
    except Exception:
        return None

def _coerce_enum(value, allowed):
    if not value:
        return allowed[0]
    v = str(value).strip()
    if v in allowed:
        return v
    # fuzzy: pick the allowed value that is a substring of v or vice versa
    for a in allowed:
        if a in v or v in a:
            return a
    return allowed[0]

def _build_questions(raw_list, source_exam):
    out = []
    seen = set()
    for item in raw_list:
        try:
            qt = str(item.get("question_text", "")).strip()
            if not qt or qt in seen:
                continue
            seen.add(qt)
            choices = []
            for c in item.get("choices", []) or []:
                label = str(c.get("label", "")).strip()
                text = str(c.get("text", "")).strip()
                if label or text:
                    choices.append(ExamChoice(label=label, text=text))
            if not choices:
                continue
            q = ExamQuestion(
                question_text=qt,
                choices=choices,
                correct_answer=(str(item.get("correct_answer")) if item.get("correct_answer") else None),
                category=_coerce_enum(item.get("category"), CATEGORY_VALUES),
                task=_coerce_enum(item.get("task"), TASK_VALUES),
                explanation=(str(item.get("explanation")) if item.get("explanation") else None),
                image_paths=item.get("image_paths") or [],
                source_exam=source_exam,
            )
            out.append(q)
        except Exception as e:
            print(f"  skipping malformed question: {e}")
    return out

def _call_llm_timeout(messages, hard=90):
    """Run _call_llm in a thread; if it exceeds `hard` seconds, raise TimeoutError.

    The free OpenRouter tier occasionally hangs a connection with no socket
    error. A thread-based wall-clock guard guarantees we never block forever
    on one chunk — the caller can skip and continue.
    """
    import threading
    result = {}
    def target():
        try:
            result["val"] = _call_llm(messages)
        except Exception as e:  # captured, re-raised by caller
            result["err"] = e
    t = threading.Thread(target=target, daemon=True)
    t.start()
    t.join(hard)
    if t.is_alive():
        raise TimeoutError(f"LLM call exceeded {hard}s hard timeout")
    if "err" in result:
        raise result["err"]
    return result["val"]

def categorize_pdf(pdf_path: str, source_exam: str) -> ExamBank:
    """Extract + categorize questions from a PDF, chunked by pages to bound output size."""
    pages = extract_pages_from_pdf(pdf_path)
    print(f"Extracted {len(pages)} pages from {source_exam}")
    # group pages into chunks of ~2 pages (smaller calls finish faster on the throttled free tier)
    chunk_size = 2
    chunks = []
    for i in range(0, len(pages), chunk_size):
        chunk = "\n\n===PAGE BREAK===\n\n".join(pages[i:i+chunk_size])
        if chunk.strip():
            chunks.append(chunk)
    print(f"Split into {len(chunks)} chunks")

    collected = []
    for idx, chunk in enumerate(chunks):
        print(f"  Processing chunk {idx+1}/{len(chunks)}...")
        user_prompt = (
            f"Source exam name: {source_exam}\n\n"
            f"Extract ONLY multiple-choice questions that are COMPLETELY contained in the excerpt below. "
            f"If a question is cut off at the start or end of the excerpt, skip it.\n\n"
            f"EXCERPT:\n{chunk}"
            )
        for attempt in range(2):
            try:
                content = _call_llm_timeout([
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt},
                ], hard=150)
                data = _parse_json(content)
                if data and isinstance(data.get("questions"), list):
                    qs = _build_questions(data["questions"], source_exam)
                    print(f"    chunk {idx+1}: {len(qs)} questions parsed")
                    collected.extend(qs)
                    break
                else:
                    print(f"    chunk {idx+1}: no parseable questions (attempt {attempt+1})")
            except Exception as e:
                print(f"    chunk {idx+1} error (attempt {attempt+1}): {e}")
                time.sleep(5)
    bank = ExamBank(questions=collected)
    print(f"Total extracted: {len(bank.questions)} questions")
    return bank

# Backwards-compatible single-text entrypoint (used by some scripts).
def categorize_exam_questions(text: str, source_exam: str) -> ExamBank:
    return _categorize_from_text(text, source_exam)

def _categorize_from_text(text: str, source_exam: str) -> ExamBank:
    chunk_size = 4000
    chunks = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
    collected = []
    for idx, chunk in enumerate(chunks):
        user_prompt = (
            f"Source exam name: {source_exam}\n\n"
            f"Extract ONLY multiple-choice questions completely contained in the excerpt.\n\nEXCERPT:\n{chunk}"
        )
        for attempt in range(3):
            try:
                content = _call_llm([
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt},
                ])
                data = _parse_json(content)
                if data and isinstance(data.get("questions"), list):
                    collected.extend(_build_questions(data["questions"], source_exam))
                    break
            except Exception as e:
                print(f"chunk {idx+1} error: {e}")
                time.sleep(5)
    return ExamBank(questions=collected)

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 ai_categorizer.py <pdf_path> [output_json]")
        sys.exit(1)
    pdf_path = sys.argv[1]
    out = sys.argv[2] if len(sys.argv) > 2 else "exam_bank.json"
    source_exam = os.path.basename(pdf_path)
    bank = categorize_pdf(pdf_path, source_exam)
    with open(out, "w", encoding="utf-8") as f:
        json.dump(bank.model_dump(), f, ensure_ascii=False, indent=2)
    print(f"Saved {len(bank.questions)} questions to {out}")

if __name__ == "__main__":
    main()
