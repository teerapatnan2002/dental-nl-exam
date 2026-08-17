"""Master sweep: ingest EVERY unparsed PDF in the repo into exam_bank.db.

- Walks all *.pdf (excludes manual2020.pdf, node_modules, dotdirs).
- Fuzzy-matches each PDF against existing parsed_exams/*.json so already-ingested
  exams are skipped (no duplicates).
- For each pending PDF, runs import_pdf_safe.run() (extract -> LLM -> JSON -> DB).
- NLLaw PDFs are included too (they use the same schema; category auto-assigned
  by the LLM from the clinical-category enum).

Run from project root with venv active:
    python3 sweep_all_pdfs.py
"""
import os
import re
import sys

PROJ = os.path.dirname(os.path.abspath(__file__))

def norm(s):
    s = os.path.splitext(os.path.basename(s))[0]
    s = re.sub(r"[^0-9a-zก-๙]", "", s.lower())
    return s

def find_pdfs(root):
    out = []
    for dp, _, fs in os.walk(root):
        if "node_modules" in dp or os.path.basename(dp).startswith("."):
            continue
        for f in fs:
            if f.lower().endswith(".pdf") and f != "manual2020.pdf":
                out.append(os.path.join(dp, f))
    return sorted(out)

def main():
    from import_pdf_safe import run  # lazy import (heavy)
    parsed_dir = os.path.join(PROJ, "parsed_exams")
    os.makedirs(parsed_dir, exist_ok=True)
    done = {norm(f) for f in os.listdir(parsed_dir) if f.endswith(".json")}

    pdfs = find_pdfs(PROJ)
    pending = [p for p in pdfs if norm(p) not in done]
    print(f"Found {len(pdfs)} PDFs; {len(pdfs)-len(pending)} already parsed; {len(pending)} pending.")

    ok = 0
    for i, pdf in enumerate(pending, 1):
        print(f"\n===== [{i}/{len(pending)}] {pdf} =====")
        try:
            run(pdf)
            ok += 1
        except Exception as e:
            print(f"FAILED {pdf}: {e}")
    print(f"\n=== SWEEP DONE: {ok}/{len(pending)} PDFs ingested ===")

if __name__ == "__main__":
    sys.path.insert(0, PROJ)
    main()
