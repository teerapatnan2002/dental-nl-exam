#!/usr/bin/env python3
"""
Script to export all registered users/applicant emails from SQLite database.
Supports CSV (with UTF-8 BOM for Excel) and JSON output formats.
"""

import os
import sqlite3
import csv
import json
from datetime import datetime

DB_PATH = os.environ.get("DATABASE_PATH", "data/exam_bank.db")
CSV_OUTPUT = "applicant_emails.csv"
JSON_OUTPUT = "applicant_emails.json"

def export_users():
    if not os.path.exists(DB_PATH):
        print(f"❌ Database file not found at: {DB_PATH}")
        return

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    query = """
        SELECT id, email, username, role, created_at
        FROM users
        ORDER BY id ASC
    """
    c.execute(query)
    rows = c.fetchall()
    conn.close()

    data = []
    for r in rows:
        created_str = "-"
        if r[4]:
            try:
                created_str = datetime.fromtimestamp(int(r[4])).strftime("%Y-%m-%d %H:%M:%S")
            except Exception:
                created_str = str(r[4])

        data.append({
            "id": r[0],
            "email": r[1],
            "username": r[2],
            "role": r[3],
            "registered_at": created_str,
        })

    # 1. Export CSV (with UTF-8 BOM so Thai characters & Excel display cleanly)
    with open(CSV_OUTPUT, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=["id", "email", "username", "role", "registered_at"])
        writer.writeheader()
        writer.writerows(data)

    # 2. Export JSON
    with open(JSON_OUTPUT, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"✅ สำเร็จ! ดึงข้อมูลผู้ใช้งานเรียบร้อยแล้ว {len(data)} บัญชี")
    print(f"📄 ไฟล์ CSV:  {os.path.abspath(CSV_OUTPUT)}")
    print(f"📄 ไฟล์ JSON: {os.path.abspath(JSON_OUTPUT)}")

if __name__ == "__main__":
    export_users()
