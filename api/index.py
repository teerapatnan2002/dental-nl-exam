import sys
import os

# Ensure root directory is on Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import Request
from main import app

@app.middleware("http")
async def ensure_api_prefix(request: Request, call_next):
    # Vercel might pass path as /health, /categories (stripping /api)
    # or as /api/index.py with x-matched-path or x-invoke-path header
    matched = request.headers.get("x-matched-path") or request.headers.get("x-invoke-path")
    if matched:
        path = matched.split("?")[0]
    else:
        path = request.scope.get("path", "")

    # Ensure path starts with /api if it doesn't already
    if not path.startswith("/api") and path != "/":
        path = "/api" + path

    request.scope["path"] = path
    return await call_next(request)
