"""Automated unit & integration tests for Admin Backend Dashboard (Phase 1)."""

import csv
import io
import json
import os
import tempfile
import time
import unittest

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

import models
from auth import _password_fingerprint, create_access_token
from database import Base, get_db
from main import app


class AdminDashboardPhase1Tests(unittest.TestCase):
    def setUp(self):
        self._tmp = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
        self._tmp.close()
        self.db_path = self._tmp.name
        self.engine = create_engine(
            f"sqlite:///{self.db_path}",
            connect_args={"check_same_thread": False},
        )
        Base.metadata.create_all(bind=self.engine)
        self.TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)

        def _override_get_db():
            db = self.TestingSessionLocal()
            try:
                yield db
            finally:
                db.close()

        app.dependency_overrides[get_db] = _override_get_db
        self.client = TestClient(app)
        self._seed_data()

    def tearDown(self):
        app.dependency_overrides.clear()
        self.engine.dispose()
        try:
            os.remove(self.db_path)
        except OSError:
            pass

    def _auth_headers(self, user: models.User) -> dict:
        token = create_access_token(
            {"sub": user.username, "pwd_sig": _password_fingerprint(user.hashed_password)}
        )
        return {"Authorization": f"Bearer {token}"}

    def _seed_data(self):
        now_ts = int(time.time())
        db = self.TestingSessionLocal()
        try:
            # 1. Users (admin, active student with formula injection display_name, inactive student)
            self.admin_user = models.User(
                email="admin@example.com",
                username="admin_tester",
                hashed_password="$2b$12$fakehashforadminonly1234567890",
                created_at=now_ts - 86400 * 5,
                role="admin",
                display_name="Dr. Admin",
                target_exam_session="NL 1/2570",
                subscription_tier="early_access",
                subscription_status="active",
                two_factor_enabled=1,
                totp_secret_enc="SUPER_SECRET_ENC_VALUE",
                totp_backup_codes='["hash1","hash2"]',
            )
            self.student_active = models.User(
                email="student1@example.com",
                username="student_one",
                hashed_password="$2b$12$fakehashforstudent1234567890",
                created_at=now_ts - 86400 * 3,
                role="user",
                display_name="=CMD('calc')",
                dental_school="CU Dent",
                target_exam_session="ครั้งที่ 1 ปี 2570",
                subscription_tier="early_access",
                subscription_status="active",
                two_factor_enabled=0,
            )
            self.student_inactive = models.User(
                email="student2@example.com",
                username="student_two",
                hashed_password="$2b$12$fakehashforstudent2234567890",
                created_at=now_ts - 86400 * 2,
                role="user",
                display_name="Student Two",
                target_exam_session="NL 1/2570",
                subscription_tier="free",
                subscription_status="active",
                two_factor_enabled=0,
            )
            db.add_all([self.admin_user, self.student_active, self.student_inactive])
            db.flush()

            # 2. Questions (1 healthy Law, 1 tricky distractor Perio, 1 broken integrity Endo)
            q1 = models.Question(
                question_text="กฎหมายวิชาชีพทันตกรรม มาตรา 28 ว่าด้วยเรื่องใด",
                correct_answer="A",
                category="กฎหมายและจรรยาบรรณ",
                task="พ.ร.บ. วิชาชีพทันตกรรม พ.ศ. 2537",
                explanation=json.dumps({"correct_reason": "มาตรา 28 กำหนดห้ามผู้ไม่ได้ขึ้นทะเบียนประกอบวิชาชีพ"}),
                source_exam="NL 2568",
                exam_origin="real_exam",
                cognitive_level="R",
                must_know_topic="มาตรา 28 การประกอบวิชาชีพ",
            )
            q2 = models.Question(
                question_text="ผู้ป่วยปริทันต์อักเสบระยะ III ควรเริ่มการรักษาขั้นใดก่อน",
                correct_answer="A",
                category="ปริทันตวิทยา",
                task="การจัดการและการรักษาผู้ป่วย",
                explanation="เริ่มด้วย Step 1 และ Step 2 non-surgical therapy",
                source_exam="NL 2568",
                exam_origin="real_exam",
                cognitive_level="P",
                must_know_topic="Stepwise Periodontal Therapy",
            )
            q3 = models.Question(
                question_text="โจทย์มีปัญหาข้อมูลไม่สมบูรณ์",
                correct_answer="Z",  # invalid: not in choices
                category="วิทยาเอ็นโดดอนต์",
                task="การวินิจฉัยโรค",
                explanation="{broken-json",  # invalid JSON explanation
                source_exam="NL 2567",
                exam_origin="real_exam",
                cognitive_level=None,
                must_know_topic=None,  # missing must_know_topic
                image_path="../etc/passwd",  # invalid image path traversal
            )
            q4 = models.Question(
                question_text="โจทย์ไม่มีคำอธิบายและตัวเลือกน้อย",
                correct_answer="A",
                category="ศัลยศาสตร์ช่องปาก",
                task="ขั้นตอนและวิธีการรักษา",
                explanation="",  # missing explanation
                source_exam="DSAT Mock 1",
                exam_origin="dsat_mock",
                cognitive_level="A",
                must_know_topic="Exodontia",
            )
            db.add_all([q1, q2, q3, q4])
            db.flush()

            # Choices
            for q in (q1, q2):
                for lbl in ("A", "B", "C", "D"):
                    db.add(models.Choice(question_id=q.id, label=lbl, text=f"ตัวเลือก {lbl} ของข้อ {q.id}"))
            for lbl in ("A", "B", "C", "D"):
                db.add(models.Choice(question_id=q3.id, label=lbl, text=f"ตัวเลือก {lbl}"))
            for lbl in ("A", "B"):  # only 2 choices -> triggers low_choice_count
                db.add(models.Choice(question_id=q4.id, label=lbl, text=f"ตัวเลือก {lbl}"))

            # 3. Exam sessions & user_answers
            s1 = models.ExamSession(
                user_id=self.student_active.id,
                start_time=now_ts - 7200,
                end_time=now_ts - 6600,
                exam_type="exam",
                score=2,
                total_questions=6,
                time_limit_seconds=3600,
                time_spent_seconds=600,
            )
            s2 = models.ExamSession(
                user_id=self.admin_user.id,
                start_time=(now_ts - 3600) * 1000,  # legacy millisecond timestamp regression check
                end_time=(now_ts - 3000) * 1000,
                exam_type="practice",
                score=1,
                total_questions=3,
                time_limit_seconds=None,
                time_spent_seconds=300,
            )
            db.add_all([s1, s2])
            db.flush()

            # Answers for q1 (Law): 3 answered (2 right, 1 wrong), 2 blank; timing includes 12000s outlier
            db.add_all([
                models.UserAnswer(session_id=s1.id, question_id=q1.id, selected_choice="A", is_correct=1, time_spent_seconds=40, confidence="confident"),
                models.UserAnswer(session_id=s1.id, question_id=q1.id, selected_choice="A", is_correct=1, time_spent_seconds=60),
                models.UserAnswer(session_id=s2.id, question_id=q1.id, selected_choice="B", is_correct=0, time_spent_seconds=12000),  # >600s outlier
                models.UserAnswer(session_id=s1.id, question_id=q1.id, selected_choice=None, is_correct=0, time_spent_seconds=None),
                models.UserAnswer(session_id=s1.id, question_id=q1.id, selected_choice="", is_correct=0, time_spent_seconds=None),
            ])
            # Answers for q2 (Perio): 4 answered — choice B picked 3x, keyed A picked 1x -> distractor alert!
            db.add_all([
                models.UserAnswer(session_id=s1.id, question_id=q2.id, selected_choice="B", is_correct=0, time_spent_seconds=50),
                models.UserAnswer(session_id=s1.id, question_id=q2.id, selected_choice="B", is_correct=0, time_spent_seconds=70),
                models.UserAnswer(session_id=s2.id, question_id=q2.id, selected_choice="B", is_correct=0, time_spent_seconds=80),
                models.UserAnswer(session_id=s2.id, question_id=q2.id, selected_choice="A", is_correct=1, time_spent_seconds=90),
            ])

            # 4. Bookmarks, Notes, SM-2, Presence, Reports (2 reports on same q2 -> repeat!)
            db.add(models.Bookmark(user_id=self.student_active.id, question_id=q1.id, created_at=now_ts - 1000))
            db.add(models.UserNote(user_id=self.student_active.id, question_id=q1.id, note_text="จดสรุป", updated_at=now_ts - 900))
            db.add(
                models.UserQuestionStat(
                    user_id=self.student_active.id,
                    question_id=q2.id,
                    repetitions=1,
                    interval=1,
                    ease_factor=230,
                    next_review_date=now_ts - 500,  # overdue
                    lapse_count=2,
                    last_reviewed_at=now_ts - 5000,
                )
            )
            db.add(
                models.ActivePresence(
                    session_key="sess_abc123",
                    identity_key=f"u:{self.admin_user.id}",
                    last_seen_at=now_ts - 10,
                )
            )
            db.add_all([
                models.ReportedQuestion(
                    question_id=q2.id,
                    user_id=self.student_active.id,
                    issue_type="wrong_answer",
                    description="น่าจะตอบ B มากกว่าครับ",
                    status="pending",
                    created_at=now_ts - 86400 * 3,
                ),
                models.ReportedQuestion(
                    question_id=q2.id,
                    user_id=self.student_inactive.id,
                    issue_type="wrong_answer",
                    description="แจ้งซ้ำข้อเดียวกัน",
                    status="reviewing",
                    created_at=now_ts - 86400 * 1,
                ),
                models.ReportedQuestion(
                    question_id=q1.id,
                    user_id=self.student_active.id,
                    issue_type="typo",
                    description="แก้แล้ว",
                    status="resolved",
                    admin_reply="แก้ไขเรียบร้อยแล้วครับ",
                    created_at=now_ts - 86400 * 4,
                ),
            ])

            db.commit()
            self.admin_headers = self._auth_headers(self.admin_user)
            self.student_headers = self._auth_headers(self.student_active)
            self.q1_id, self.q2_id, self.q3_id, self.q4_id = q1.id, q2.id, q3.id, q4.id
            self.admin_id = self.admin_user.id
            self.student_id = self.student_active.id
        finally:
            db.close()

    def test_rbac_blocks_anonymous_and_non_admin(self):
        endpoints = [
            "/api/admin/overview",
            "/api/admin/users",
            "/api/admin/users/export",
            "/api/admin/psychometrics",
            "/api/admin/content-health",
            "/api/admin/ai-tutor",
            "/api/admin/security",
            "/api/admin/audit-logs",
            "/api/admin/audit-logs/export",
            "/api/admin/question-edits",
            "/api/admin/question-edits/export-sync",
            "/api/reports/summary",
        ]
        for ep in endpoints:
            r_anon = self.client.get(ep)
            self.assertEqual(r_anon.status_code, 401, f"Expected 401 for anonymous on {ep}")
            r_user = self.client.get(ep, headers=self.student_headers)
            self.assertEqual(r_user.status_code, 403, f"Expected 403 for non-admin on {ep}")
            r_admin = self.client.get(ep, headers=self.admin_headers)
            self.assertEqual(r_admin.status_code, 200, f"Expected 200 for admin on {ep}: {r_admin.text}")

    def test_overview_kpis_and_cohort_normalization(self):
        res = self.client.get("/api/admin/overview?days=14", headers=self.admin_headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()

        self.assertEqual(data["db_backend_label"], "Local SQLite")
        kpis = data["kpis"]
        self.assertEqual(kpis["total_users"], 3)
        self.assertEqual(kpis["active_users_all_time"], 2)
        self.assertEqual(kpis["online_users_now"], 1)
        self.assertEqual(kpis["total_answer_rows"], 9)
        self.assertEqual(kpis["answered_count"], 7)
        self.assertEqual(kpis["blank_count"], 2)
        # 3 correct out of 7 truly answered = 42.9% (NOT 3/9 = 33.3%)
        self.assertAlmostEqual(kpis["true_accuracy_pct"], 42.9, places=1)
        self.assertEqual(kpis["open_reports_count"], 2)

        # Both "NL 1/2570" and "ครั้งที่ 1 ปี 2570" merge into a single normalized cohort
        self.assertEqual(len(data["cohorts"]), 1)
        self.assertEqual(data["cohorts"][0]["label"], "ครั้งที่ 1 ปี 2570")
        self.assertEqual(data["cohorts"][0]["count"], 3)
        self.assertEqual(len(data["daily_series"]), 14)
        self.assertEqual(len(data["peak_hours"]), 24)

    def test_users_engagement_no_secrets_and_self_demotion_guard(self):
        res = self.client.get("/api/admin/users?sort=answered", headers=self.admin_headers)
        self.assertEqual(res.status_code, 200)
        body = res.json()
        self.assertEqual(body["summary"]["total_users"], 3)
        self.assertEqual(body["summary"]["active_count"], 2)

        for item in body["items"]:
            for forbidden in ("hashed_password", "totp_secret_enc", "totp_pending_secret_enc", "totp_backup_codes"):
                self.assertNotIn(forbidden, item)

        # Self-demotion blocked with 400
        res_self = self.client.patch(
            f"/api/admin/users/{self.admin_id}",
            json={"role": "user"},
            headers=self.admin_headers,
        )
        self.assertEqual(res_self.status_code, 400)

        # Valid update on another user succeeds
        future_exp = int(time.time()) + 86400 * 30
        res_upd = self.client.patch(
            f"/api/admin/users/{self.student_id}",
            json={
                "subscription_tier": "pro_monthly",
                "subscription_status": "active",
                "subscription_expires_at": future_exp,
            },
            headers=self.admin_headers,
        )
        self.assertEqual(res_upd.status_code, 200)
        self.assertEqual(res_upd.json()["subscription_tier"], "pro_monthly")
        self.assertEqual(res_upd.json()["subscription_expires_at"], future_exp)

        # Explicit expiry reset
        res_clear = self.client.patch(
            f"/api/admin/users/{self.student_id}",
            json={"clear_subscription_expires_at": True},
            headers=self.admin_headers,
        )
        self.assertEqual(res_clear.status_code, 200)
        self.assertIsNone(res_clear.json()["subscription_expires_at"])

    def test_csv_export_formula_injection_and_bom(self):
        res = self.client.get("/api/admin/users/export", headers=self.admin_headers)
        self.assertEqual(res.status_code, 200)
        text = res.content.decode("utf-8")
        self.assertTrue(text.startswith("\ufeff"))
        self.assertNotIn("SUPER_SECRET_ENC_VALUE", text)
        self.assertNotIn("fakehashforstudent", text)

        rows = list(csv.DictReader(io.StringIO(text.lstrip("\ufeff"))))
        student_row = next(r for r in rows if r["username"] == "student_one")
        self.assertEqual(student_row["display_name"], "'=CMD('calc')")
        self.assertEqual(student_row["answered_count"], "4")
        self.assertEqual(student_row["total_answer_rows"], "6")

    def test_psychometrics_blank_exclusion_outliers_and_distractors(self):
        res = self.client.get("/api/admin/psychometrics?days=90&min_attempts=3", headers=self.admin_headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()

        law_cat = next(c for c in data["categories"] if c["category"] == "กฎหมายและจรรยาบรรณ")
        self.assertEqual(law_cat["total_rows"], 5)
        self.assertEqual(law_cat["answered_count"], 3)
        self.assertEqual(law_cat["blank_count"], 2)
        self.assertAlmostEqual(law_cat["answered_rate_pct"], 60.0, places=1)
        # 2/3 truly answered = 66.7%
        self.assertAlmostEqual(law_cat["true_accuracy_pct"], 66.7, places=1)
        # Times: [40, 60, 12000] -> median 60.0, capped (<=300) avg = (40+60)/2 = 50.0, 1 outlier >600s
        self.assertAlmostEqual(law_cat["median_time_sec"], 60.0, places=1)
        self.assertAlmostEqual(law_cat["capped_avg_time_sec"], 50.0, places=1)
        self.assertEqual(law_cat["outlier_count_gt_600s"], 1)

        # Distractor alert flags q2 where choice B (3) > keyed A (1)
        self.assertEqual(len(data["distractor_alerts"]), 1)
        alert = data["distractor_alerts"][0]
        self.assertEqual(alert["question_id"], self.q2_id)
        self.assertEqual(alert["correct_answer"], "A")
        self.assertEqual(alert["top_distractor_label"], "B")
        self.assertEqual(alert["top_distractor_count"], 3)

    def test_content_health_detects_all_integrity_issues_and_sm2(self):
        res = self.client.get("/api/admin/content-health", headers=self.admin_headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()

        checks = {c["key"]: c for c in data["integrity_checks"]}
        self.assertIn(self.q3_id, checks["invalid_correct_answer"]["sample_ids"])
        self.assertIn(self.q3_id, checks["invalid_explanation_json"]["sample_ids"])
        self.assertIn(self.q3_id, checks["missing_must_know_topic"]["sample_ids"])
        self.assertIn(self.q3_id, checks["invalid_image_path"]["sample_ids"])
        self.assertIn(self.q4_id, checks["missing_explanation"]["sample_ids"])
        self.assertIn(self.q4_id, checks["low_choice_count"]["sample_ids"])

        fa = data["feature_adoption"]
        self.assertEqual(fa["bookmarks"]["total"], 1)
        self.assertEqual(fa["user_notes"]["total"], 1)
        self.assertEqual(fa["confidence_tagging"]["tagged_answers"], 1)
        self.assertEqual(fa["sm2_health"]["total_tracked"], 1)
        self.assertEqual(fa["sm2_health"]["overdue_count"], 1)
        self.assertEqual(fa["sm2_health"]["lapsed_count"], 1)

    def test_reports_enriched_list_and_summary(self):
        r_sum = self.client.get("/api/reports/summary", headers=self.admin_headers)
        self.assertEqual(r_sum.status_code, 200)
        s = r_sum.json()
        self.assertEqual(s["counts"]["pending"], 1)
        self.assertEqual(s["counts"]["reviewing"], 1)
        self.assertEqual(s["counts"]["resolved"], 1)
        self.assertEqual(s["counts"]["open"], 2)
        self.assertEqual(s["repeat_questions_count"], 1)
        self.assertGreaterEqual(s["oldest_open_age_days"], 2)

        r_list = self.client.get("/api/reports?status=pending", headers=self.admin_headers)
        self.assertEqual(r_list.status_code, 200)
        items = r_list.json()
        self.assertEqual(len(items), 1)
        rep = items[0]
        self.assertEqual(rep["question_id"], self.q2_id)
        self.assertEqual(len(rep["choices"]), 4)
        self.assertEqual(rep["total_reports_on_question"], 2)
        self.assertEqual(rep["open_reports_on_question"], 2)
        self.assertGreaterEqual(rep["age_days"], 2)
        self.assertTrue(rep["explanation_preview"])

    def test_phase2_ai_tutor_telemetry_and_analytics(self):
        now_ts = int(time.time())
        db = self.TestingSessionLocal()
        try:
            db.add_all([
                models.AiTutorLog(
                    user_id=self.student_id,
                    question_id=self.q1_id,
                    topic_id="มาตรา 28 การประกอบวิชาชีพ",
                    category="กฎหมายและจรรยาบรรณ",
                    mode="llm",
                    model_used="google/gemini-2.5-flash",
                    suggested_tag="พลาดแนวทางไทย",
                    prompt_chars=1200,
                    response_chars=650,
                    prompt_tokens=300,
                    completion_tokens=180,
                    total_tokens=480,
                    latency_ms=850,
                    status="ok",
                    created_at=now_ts - 600,
                ),
                models.AiTutorLog(
                    user_id=self.student_id,
                    question_id=self.q2_id,
                    topic_id="Stepwise Periodontal Therapy",
                    category="ปริทันตวิทยา",
                    mode="evidence_fallback",
                    model_used="evidence_fallback",
                    suggested_tag="โดนตัวลวง",
                    prompt_chars=900,
                    response_chars=500,
                    latency_ms=45,
                    status="fallback_error",
                    error_code="APITimeoutError",
                    created_at=now_ts - 300,
                ),
            ])
            db.commit()
        finally:
            db.close()

        res = self.client.get("/api/admin/ai-tutor?days=14", headers=self.admin_headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        kpis = data["kpis"]
        self.assertEqual(kpis["total_requests"], 2)
        self.assertEqual(kpis["llm_count"], 1)
        self.assertEqual(kpis["fallback_count"], 1)
        self.assertEqual(kpis["error_count"], 1)
        self.assertEqual(kpis["total_tokens"], 480)
        self.assertAlmostEqual(kpis["fallback_rate_pct"], 50.0, places=1)
        self.assertEqual(len(data["daily_series"]), 14)
        self.assertEqual(len(data["recent_logs"]), 2)

    def test_phase2_security_events_and_suspicious_ip(self):
        from observability import mask_identifier, record_auth_event

        self.assertEqual(mask_identifier("teerapat@gmail.com"), "te***@gmail.com")
        self.assertEqual(mask_identifier("admin"), "ad***")

        db = self.TestingSessionLocal()
        try:
            now_ts = int(time.time())
            for i in range(5):
                db.add(
                    models.AuthEvent(
                        identifier_masked=f"u{i}***@example.com",
                        event_type="login_fail",
                        success=0,
                        ip_address="203.0.113.99",
                        detail="invalid_credentials",
                        created_at=now_ts - 100 - i,
                    )
                )
            db.add(
                models.AuthEvent(
                    user_id=self.student_id,
                    identifier_masked="st***",
                    event_type="login_success",
                    success=1,
                    ip_address="198.51.100.10",
                    detail="password",
                    created_at=now_ts - 50,
                )
            )
            db.commit()
        finally:
            db.close()

        res = self.client.get("/api/admin/security?days=7", headers=self.admin_headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["kpis"]["login_fail"], 5)
        self.assertEqual(data["kpis"]["login_success"], 1)
        self.assertEqual(data["kpis"]["suspicious_ips_count"], 1)
        self.assertEqual(data["suspicious_ips"][0]["ip_address"], "203.0.113.99")
        self.assertEqual(data["suspicious_ips"][0]["severity"], "high")
        self.assertEqual(data["suspicious_ips"][0]["distinct_targets"], 5)

    def test_phase2_question_quick_edit_audit_and_sync_queue(self):
        # 1. Invalid correct_answer not in choices -> 400
        bad = self.client.patch(
            f"/api/admin/questions/{self.q2_id}",
            json={"correct_answer": "Z", "edit_reason": "test invalid key"},
            headers=self.admin_headers,
        )
        self.assertEqual(bad.status_code, 400)

        # 2. Valid key edit + auto-resolve linked report
        rep_list = self.client.get("/api/reports?status=pending", headers=self.admin_headers).json()
        pending_rep_id = rep_list[0]["id"]

        ok = self.client.patch(
            f"/api/admin/questions/{self.q2_id}",
            json={
                "correct_answer": "B",
                "edit_reason": "ปรับเฉลยตามแนวทางปริทันต์ 2025",
                "report_id": pending_rep_id,
                "resolve_report": True,
                "admin_reply": "ปรับเฉลยเป็น B เรียบร้อยครับ",
            },
            headers=self.admin_headers,
        )
        self.assertEqual(ok.status_code, 200)
        body = ok.json()
        self.assertEqual(body["sync_status"], "pending_sync")
        self.assertEqual(body["resolved_report_id"], pending_rep_id)
        self.assertIn("correct_answer", body["updated_fields"])

        # 3. Check sync queue list & export bundle
        q_edits = self.client.get("/api/admin/question-edits?sync_status=pending_sync", headers=self.admin_headers).json()
        self.assertEqual(q_edits["counts"]["pending_sync"], 1)
        edit_id = q_edits["items"][0]["id"]
        self.assertEqual(q_edits["items"][0]["field_changes"]["correct_answer"]["before"], "A")
        self.assertEqual(q_edits["items"][0]["field_changes"]["correct_answer"]["after"], "B")

        bundle_res = self.client.get("/api/admin/question-edits/export-sync", headers=self.admin_headers)
        self.assertEqual(bundle_res.status_code, 200)
        bundle = bundle_res.json()
        self.assertIn(edit_id, bundle["pending_edit_ids"])
        self.assertEqual(bundle["affected_question_count"], 1)

        # 4. Mark synced
        ms = self.client.post(
            "/api/admin/question-edits/mark-synced",
            json={"edit_ids": [edit_id]},
            headers=self.admin_headers,
        )
        self.assertEqual(ms.status_code, 200)
        self.assertEqual(ms.json()["marked_count"], 1)

        # 5. Verify immutable Admin Audit Trail & CSV export recorded actions
        aud = self.client.get("/api/admin/audit-logs?days=30", headers=self.admin_headers).json()
        actions = {it["action"] for it in aud["items"]}
        self.assertIn("admin_question_edit", actions)
        self.assertIn("admin_question_sync_export", actions)
        self.assertIn("admin_question_sync_marked", actions)

        aud_csv = self.client.get("/api/admin/audit-logs/export", headers=self.admin_headers)
        self.assertEqual(aud_csv.status_code, 200)
        self.assertTrue(aud_csv.content.decode("utf-8").startswith("\ufeff"))

    def test_phase2_live_hooks_auth_and_tutor(self):
        # Failed login automatically logs masked auth_event
        r_bad = self.client.post(
            "/api/auth/login",
            json={"email": "student1@example.com", "password": "WrongPassword!99"},
        )
        self.assertEqual(r_bad.status_code, 401)
        sec = self.client.get("/api/admin/security?days=7", headers=self.admin_headers).json()
        self.assertGreaterEqual(sec["kpis"]["login_fail"], 1)
        self.assertTrue(any(ev["identifier_masked"] == "st***@example.com" for ev in sec["recent_events"]))

        # Live tutor chat automatically logs ai_tutor_logs entry (even without external API key)
        import tutor as tutor_mod
        prev_key = tutor_mod.OPENROUTER_API_KEY
        tutor_mod.OPENROUTER_API_KEY = None
        try:
            r_chat = self.client.post(
                "/api/tutor/chat",
                json={"question_id": self.q1_id, "message": "อธิบายมาตรา 28 และแนวทางทันตแพทยสภาไทยหน่อยครับ"},
                headers=self.student_headers,
            )
            self.assertEqual(r_chat.status_code, 200)
            self.assertEqual(r_chat.json()["mode"], "evidence_fallback")
        finally:
            tutor_mod.OPENROUTER_API_KEY = prev_key

        ai_stats = self.client.get("/api/admin/ai-tutor?days=7", headers=self.admin_headers).json()
        self.assertEqual(ai_stats["kpis"]["total_requests"], 1)
        self.assertEqual(ai_stats["kpis"]["fallback_count"], 1)
        self.assertEqual(ai_stats["recent_logs"][0]["question_id"], self.q1_id)

    def test_zero_cost_ai_kill_switch_protects_paid_endpoints(self):
        prev_flag = os.environ.get("ENABLE_LIVE_AI")
        os.environ["ENABLE_LIVE_AI"] = "false"
        try:
            # 1. Non-admin cannot access /api/prediction or /api/mock/generate (403)
            self.assertEqual(self.client.get("/api/prediction", headers=self.student_headers).status_code, 403)
            self.assertEqual(
                self.client.post(
                    "/api/mock/generate",
                    json={"category": "ปริทันตวิทยา", "task": "การวินิจฉัยโรค", "count": 1},
                    headers=self.student_headers,
                ).status_code,
                403,
            )

            # 2. Admin gets 503 while ENABLE_LIVE_AI=false
            self.assertEqual(self.client.get("/api/prediction", headers=self.admin_headers).status_code, 503)
            self.assertEqual(
                self.client.post(
                    "/api/mock/generate",
                    json={"category": "ปริทันตวิทยา", "task": "การวินิจฉัยโรค", "count": 1},
                    headers=self.admin_headers,
                ).status_code,
                503,
            )

            # 3. Cached /api/explain still works 100% free for regular users (200)
            r_cached = self.client.post(
                "/api/explain",
                json={
                    "question_id": self.q1_id,
                    "question_text": "q1",
                    "choices": [{"label": "A", "text": "a"}],
                    "category": "กฎหมายและจรรยาบรรณ",
                    "task": "พ.ร.บ. วิชาชีพทันตกรรม พ.ศ. 2537",
                },
                headers=self.student_headers,
            )
            self.assertEqual(r_cached.status_code, 200)
            self.assertTrue(r_cached.json()["cached"])

            # 4. Uncached /api/explain (q4 has empty explanation) blocked: 403 for user, 503 for admin
            uncached_body = {
                "question_id": self.q4_id,
                "question_text": "q4",
                "choices": [{"label": "A", "text": "a"}],
                "category": "ศัลยศาสตร์ช่องปาก",
                "task": "ขั้นตอนและวิธีการรักษา",
            }
            self.assertEqual(
                self.client.post("/api/explain", json=uncached_body, headers=self.student_headers).status_code,
                403,
            )
            self.assertEqual(
                self.client.post("/api/explain", json=uncached_body, headers=self.admin_headers).status_code,
                503,
            )

            # 5. /api/tutor/chat never calls external LLM even if API key is set when ENABLE_LIVE_AI=false
            import tutor as tutor_mod
            prev_key = tutor_mod.OPENROUTER_API_KEY
            tutor_mod.OPENROUTER_API_KEY = "sk-fake-key-must-never-be-used"
            try:
                r_tut = self.client.post(
                    "/api/tutor/chat",
                    json={"question_id": self.q1_id, "message": "สรุปกฎ 3 ข้อ"},
                    headers=self.student_headers,
                )
                self.assertEqual(r_tut.status_code, 200)
                self.assertEqual(r_tut.json()["mode"], "evidence_fallback")
            finally:
                tutor_mod.OPENROUTER_API_KEY = prev_key
        finally:
            if prev_flag is None:
                os.environ.pop("ENABLE_LIVE_AI", None)
            else:
                os.environ["ENABLE_LIVE_AI"] = prev_flag


if __name__ == "__main__":
    unittest.main()
