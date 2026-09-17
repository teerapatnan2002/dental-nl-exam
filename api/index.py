import sys
import os

# Ensure root directory is on Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import Request
from main import app

@app.middleware("http")
async def ensure_api_prefix(request: Request, call_next):
    raw_path = request.scope.get("path", "")
    
    # If Vercel stripped /api (e.g. sent /health or /categories), restore /api prefix
    if raw_path and not raw_path.startswith("/api") and raw_path != "/" and not raw_path.endswith(".py"):
        request.scope["path"] = f"/api{raw_path}"
        
    return await call_next(request)

@app.get("/api/index.py")
@app.get("/api/debug")
def debug_vercel(request: Request):
    return {
        "status": "ok",
        "url_path": request.url.path,
        "scope_path": request.scope.get("path"),
        "headers": dict(request.headers),
    }
