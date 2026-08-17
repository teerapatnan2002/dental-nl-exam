"""Sequential driver: extract + import all unprocessed 2024-2026 NL2 PDFs.

Run from the project root with the venv active:
    python3 run_all_2024_2026.py

Each PDF is processed by import_pdf_safe.run(), which extracts text, calls the
LLM (rate-limited), writes parsed_exams/<name>.json, and imports into exam_bank.db
(WAL + busy_timeout safe). Already-process files are skipped.
"""
import os
import sys
import glob

TARGETS = [
    "NL2Test2024/NL2-2567 Part 2.pdf",
    "NL2Test2024/NL2-2567 Part 3.pdf",
    "NL2Test2024/NL2-2567 Part 4.pdf",
    "NL2Test2025/รวม NL 2 2025.pdf",
    "NL2Test2026/NL2 2026 PART1.pdf",
    "NL2Test2026/NL2 2026 PART 2.pdf",
    "NL2Test2026/NL2 2026 PART3.pdf",
    "NL2Test2026/NL2 2026 PART4.pdf",
]

def main():
    from import_pdf_safe import run
    total = len(TARGETS)
    done = 0
    for i, pdf in enumerate(TARGETS, 1):
        if not os.path.exists(pdf):
            print(f"[{i}/{total}] MISSING: {pdf} — skipping")
            continue
        print(f"\n===== [{i}/{total}] {pdf} =====")
        try:
            run(pdf)
            done += 1
        except Exception as e:
            print(f"[{i}/{total}] FAILED: {pdf}: {e}")
    print(f"\n=== DONE: {done}/{total} PDFs processed ===")

if __name__ == "__main__":
    main()
