"""TOTP (RFC 6238), encrypted secret storage, backup codes, and local SVG QR helpers."""

import base64
import hashlib
import hmac
import io
import json
import os
import secrets
import struct
import time
import urllib.parse
from typing import Optional

import qrcode
import qrcode.image.svg
from cryptography.fernet import Fernet, InvalidToken

TOTP_ISSUER = "NL Dental Treasury"
TOTP_PERIOD_SECONDS = 30
TOTP_DIGITS = 6
BACKUP_CODE_COUNT = 8
BACKUP_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"  # excludes ambiguous 0/O, 1/I


def _derive_fernet(secret_material: str) -> Fernet:
    """Derive a domain-separated Fernet key from TOTP_ENCRYPTION_KEY or app secret."""
    explicit_key = (os.environ.get("TOTP_ENCRYPTION_KEY") or "").strip()
    if explicit_key:
        try:
            return Fernet(explicit_key.encode("utf-8"))
        except Exception:
            pass
    digest = hashlib.sha256(f"nl-dental-totp-v1:{secret_material}".encode("utf-8")).digest()
    return Fernet(base64.urlsafe_b64encode(digest))


def encrypt_totp_secret(secret_b32: str, secret_material: str) -> str:
    """Encrypt a Base32 TOTP secret at rest using authenticated Fernet encryption."""
    fernet = _derive_fernet(secret_material)
    return fernet.encrypt(secret_b32.encode("utf-8")).decode("ascii")


def decrypt_totp_secret(encrypted_secret: Optional[str], secret_material: str) -> Optional[str]:
    """Decrypt a stored TOTP secret; returns None if missing or tampered."""
    if not encrypted_secret:
        return None
    fernet = _derive_fernet(secret_material)
    try:
        return fernet.decrypt(encrypted_secret.encode("ascii")).decode("utf-8")
    except (InvalidToken, ValueError, Exception):
        return None


def generate_totp_secret() -> str:
    """Generate a cryptographically random 160-bit Base32 secret (without padding)."""
    return base64.b32encode(secrets.token_bytes(20)).decode("ascii").rstrip("=")


def _normalize_b32_key(secret_b32: str) -> bytes:
    cleaned = secret_b32.strip().upper().replace(" ", "")
    padding = (-len(cleaned)) % 8
    return base64.b32decode(cleaned + ("=" * padding), casefold=True)


def compute_totp_for_step(secret_b32: str, step_index: int) -> str:
    """Compute a 6-digit RFC 6238 HMAC-SHA1 TOTP code for a specific 30s time step."""
    key = _normalize_b32_key(secret_b32)
    counter_bytes = struct.pack(">Q", step_index)
    digest = hmac.new(key, counter_bytes, hashlib.sha1).digest()
    offset = digest[-1] & 0x0F
    binary = struct.unpack(">I", digest[offset : offset + 4])[0] & 0x7FFFFFFF
    return f"{binary % (10 ** TOTP_DIGITS):0{TOTP_DIGITS}d}"


def verify_totp_code(
    secret_b32: str,
    submitted_code: str,
    last_used_step: Optional[int] = None,
    valid_window: int = 1,
    now_ts: Optional[float] = None,
) -> Optional[int]:
    """Verify a 6-digit TOTP code with ±1 window tolerance and replay protection.

    Returns the matched integer time-step on success, or None if invalid/replayed.
    """
    clean_code = "".join(ch for ch in (submitted_code or "") if ch.isdigit())
    if len(clean_code) != TOTP_DIGITS or len((submitted_code or "").strip().replace(" ", "").replace("-", "")) != TOTP_DIGITS:
        return None

    current_step = int((now_ts if now_ts is not None else time.time()) // TOTP_PERIOD_SECONDS)
    for offset in range(-valid_window, valid_window + 1):
        step = current_step + offset
        # Reject codes from the same or earlier 30s time-step to prevent single-window replay
        if last_used_step is not None and step <= last_used_step:
            continue
        expected = compute_totp_for_step(secret_b32, step)
        if hmac.compare_digest(clean_code, expected):
            return step
    return None


def build_otpauth_uri(account_label: str, secret_b32: str) -> str:
    """Build standard otpauth://totp URI compatible with Google/Apple/Microsoft Authenticator."""
    safe_label = (account_label or "member").strip()
    label = urllib.parse.quote(f"{TOTP_ISSUER}:{safe_label}", safe=":@")
    issuer_q = urllib.parse.quote(TOTP_ISSUER, safe="")
    return (
        f"otpauth://totp/{label}"
        f"?secret={secret_b32}"
        f"&issuer={issuer_q}"
        f"&algorithm=SHA1"
        f"&digits={TOTP_DIGITS}"
        f"&period={TOTP_PERIOD_SECONDS}"
    )


def render_qr_svg_data_uri(uri: str) -> str:
    """Render an otpauth URI to a crisp inline SVG data URI without external network calls."""
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=8,
        border=2,
    )
    qr.add_data(uri)
    qr.make(fit=True)
    img = qr.make_image(image_factory=qrcode.image.svg.SvgPathImage)
    buf = io.BytesIO()
    img.save(buf)
    b64_svg = base64.b64encode(buf.getvalue()).decode("ascii")
    return f"data:image/svg+xml;base64,{b64_svg}"


def _normalize_backup_code(code: str) -> str:
    return "".join(ch for ch in (code or "").upper() if ch.isalnum())


def _hash_backup_entry(normalized_code: str, salt_hex: Optional[str] = None) -> str:
    salt = salt_hex or secrets.token_hex(8)
    digest = hashlib.sha256(f"{salt}:{normalized_code}".encode("utf-8")).hexdigest()
    return f"{salt}${digest}"


def generate_backup_codes(count: int = BACKUP_CODE_COUNT) -> tuple[list[str], str]:
    """Generate human-readable XXXX-XXXX recovery codes alongside salted JSON hashes."""
    plaintext_codes: list[str] = []
    hashed_entries: list[str] = []
    for _ in range(count):
        chars = "".join(secrets.choice(BACKUP_ALPHABET) for _ in range(8))
        formatted = f"{chars[:4]}-{chars[4:]}"
        plaintext_codes.append(formatted)
        hashed_entries.append(_hash_backup_entry(chars))
    return plaintext_codes, json.dumps(hashed_entries)


def consume_backup_code(encoded_json: Optional[str], submitted_code: str) -> tuple[bool, Optional[str]]:
    """Verify and atomically remove a single-use recovery code from stored hashes."""
    normalized = _normalize_backup_code(submitted_code)
    if not encoded_json or len(normalized) < 8:
        return False, encoded_json

    try:
        entries = json.loads(encoded_json)
    except Exception:
        return False, encoded_json
    if not isinstance(entries, list) or not entries:
        return False, encoded_json

    matched_idx = -1
    for idx, entry in enumerate(entries):
        if not isinstance(entry, str) or "$" not in entry:
            continue
        salt, expected_digest = entry.split("$", 1)
        candidate = _hash_backup_entry(normalized, salt_hex=salt)
        _, candidate_digest = candidate.split("$", 1)
        if hmac.compare_digest(candidate_digest, expected_digest) and matched_idx == -1:
            matched_idx = idx

    if matched_idx == -1:
        return False, encoded_json

    remaining = [entry for idx, entry in enumerate(entries) if idx != matched_idx]
    return True, json.dumps(remaining)
