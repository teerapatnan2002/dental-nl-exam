"""
Shared Thai Dental Licensing Exam (ศ.ป.ท. 2563) Table of Specifications (TOS) Blueprint.
Single source of truth used by both exam-bank analytics (/api/analytics/tos)
and personal readiness diagnostics (/api/analytics/my-readiness, /api/tracking/daily-plan).
"""

from datetime import datetime, timezone, timedelta

TZ_BKK = timezone(timedelta(hours=7))
MOCK_70_OPEN_TIME = datetime(2026, 9, 26, 13, 0, 0, tzinfo=TZ_BKK)


def is_mock_70_locked() -> bool:
    return datetime.now(TZ_BKK) < MOCK_70_OPEN_TIME

TOS_CATEGORIES = [
    {"category": "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก", "target_count": 35, "target_pct": 11.67},
    {"category": "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า", "target_count": 15, "target_pct": 5.00},
    {"category": "ศัลยศาสตร์ช่องปาก", "target_count": 42, "target_pct": 14.00},
    {"category": "ปริทันตวิทยา", "target_count": 35, "target_pct": 11.67},
    {"category": "ทันตกรรมบูรณะ/หัตถการ", "target_count": 35, "target_pct": 11.67},
    {"category": "วิทยาเอ็นโดดอนต์", "target_count": 23, "target_pct": 7.67},
    {"category": "ทันตกรรมประดิษฐ์", "target_count": 38, "target_pct": 12.67},
    {"category": "ทันตกรรมจัดฟัน", "target_count": 17, "target_pct": 5.67},
    {"category": "ทันตกรรมสำหรับเด็ก", "target_count": 35, "target_pct": 11.67},
    {"category": "ทันตกรรมชุมชน", "target_count": 25, "target_pct": 8.33},
    {"category": "กฎหมายและจรรยาบรรณ", "target_count": 30, "target_pct": 9.09},
]

TOS_TASKS = [
    {"task": "การสร้างเสริมสุขภาพและการป้องกัน", "target_count": 30, "target_pct": 10.00},
    {"task": "การเกิดและการดำเนินโรค", "target_count": 50, "target_pct": 16.67},
    {"task": "การวินิจฉัยโรค", "target_count": 88, "target_pct": 29.33},
    {"task": "การจัดการและการรักษาผู้ป่วย", "target_count": 92, "target_pct": 30.67},
    {"task": "ขั้นตอนและวิธีการรักษา", "target_count": 40, "target_pct": 13.33},
]

TOS_COGNITIVE = [
    {"level": "R", "name": "ความจำและความเข้าใจ (Recall)", "target_count": 52, "target_pct": 17.33},
    {"level": "A", "name": "การประยุกต์ใช้ (Application)", "target_count": 89, "target_pct": 29.67},
    {"level": "P", "name": "การวิเคราะห์และแก้ปัญหา (Problem Solving)", "target_count": 159, "target_pct": 53.00},
]

TOS_WEIGHT_MAP = {item["category"]: item["target_pct"] for item in TOS_CATEGORIES}
