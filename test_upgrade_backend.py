"""Smoke test for the upgraded backend features (timer, bookmarks, notes, search, refresh token).
Run:  SECRET_KEY=testsecret python3 test_upgrade_backend.py
"""
import os
import time
import warnings

warnings.filterwarnings("ignore")
os.environ.setdefault("SECRET_KEY", "test-secret-key-for-import-check")
os.environ["DATABASE_URL"] = "sqlite:///./data/test_upgrade.db"
os.makedirs("data", exist_ok=True)

# Start from a clean test DB
if os.path.exists("data/test_upgrade.db"):
    os.remove("data/test_upgrade.db")

import main  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

# Seed one question so bookmark/note/search tests are deterministic
from database import SessionLocal  # noqa: E402
import models  # noqa: E402

_db = SessionLocal()
_q = models.Question(
    question_text="ผู้ป่วยมาด้วยอาการปวดฟัน ควรวินิจฉัยอย่างไร",
    category="วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก",
    task="การวินิจฉัยโรค",
    source_exam="TEST_SEED",
)
_db.add(_q)
_db.commit()
_db.refresh(_q)
_db.add(models.Choice(question_id=_q.id, label="1", text="ซักประวัติและตรวจคลินิก"))
_db.add(models.Choice(question_id=_q.id, label="2", text="สั่งยาปฏิชีวนะทันที"))
_db.commit()
_db.close()

c = TestClient(main.app)

PASSWORD = "Str0ng" + chr(33) + "Passw0rd"  # avoids shell history-expansion issues

# 1. Health
r = c.get("/api/health")
assert r.status_code == 200, r.text
print("1. health OK")

# 2. Register
r = c.post("/api/auth/register", json={
    "email": "t1@test.com", "username": "testuser1", "password": PASSWORD,
})
assert r.status_code == 200, r.text
print("2. register OK")

# 3. Login -> tokens
r = c.post("/api/auth/login", json={"email": "t1@test.com", "password": PASSWORD})
assert r.status_code == 200, r.text
tok = r.json()
assert "access_token" in tok and "refresh_token" in tok, tok.keys()
print("3. login OK (access + refresh issued)")

# 4. Refresh token flow
r = c.post("/api/auth/refresh", json={"refresh_token": tok["refresh_token"]})
assert r.status_code == 200, r.text
new_tok = r.json()
h = {"Authorization": "Bearer " + new_tok["access_token"]}
print("4. refresh OK")

# 5-7. Bookmark / notes / search (needs at least one question)
r = c.get("/api/questions", params={"limit": 1})
qs = r.json()
if qs:
    qid = qs[0]["id"]
    r = c.post("/api/bookmarks", json={"question_id": qid}, headers=h)
    assert r.status_code == 201, r.text
    r2 = c.post("/api/bookmarks", json={"question_id": qid}, headers=h)
    assert r2.status_code == 201  # idempotent
    r = c.get("/api/bookmarks", headers=h)
    assert r.status_code == 200 and len(r.json()) == 1, r.text
    print("5. bookmarks OK")

    r = c.put("/api/bookmarks/notes", json={"question_id": qid, "note_text": "test note"}, headers=h)
    assert r.status_code == 200, r.text
    r = c.get("/api/bookmarks/notes/" + str(qid), headers=h)
    assert r.json()["note_text"] == "test note"
    print("6. notes OK")

    r = c.get("/api/search", params={"q": "ปวดฟัน"})
    assert r.status_code == 200, r.text
    assert any(x["id"] == qid for x in r.json()), "Thai FTS search should find the seeded question"
    print("7. search OK (Thai substring match found), results:", len(r.json()))
else:
    print("5-7. skipped (no questions in test db)")

# 8. Session with timer fields
r = c.post("/api/tracking/session", json={
    "start_time": int(time.time()) - 600,
    "end_time": int(time.time()),
    "exam_type": "mock",
    "score": 0,
    "total_questions": 0,
    "time_limit_seconds": 600,
    "time_spent_seconds": 599,
    "answers": [],
}, headers=h)
assert r.status_code == 200, r.text
d = r.json()
assert d["time_limit_seconds"] == 600 and d["time_spent_seconds"] == 599, d
print("8. timed session OK")

print()
print("ALL BACKEND TESTS PASSED")