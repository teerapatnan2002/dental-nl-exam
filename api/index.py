import sys
import os

# Ensure root directory is on Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import Request
from main import app

@app.middleware("http")
async def vercel_path_resolver(request: Request, call_next):
    # When Vercel rewrites to /api/index.py, original route is in x-matched-path or x-invoke-path
    original_path = request.headers.get("x-matched-path") or request.headers.get("x-invoke-path")
    if original_path and original_path != request.scope.get("path"):
        # Strip query string from path
        request.scope["path"] = original_path.split("?")[0]
    return await call_next(request)

@app.get("/api/index.py")
def debug_index(request: Request):
    return {
        "status": "ok",
        "scope_path": request.scope.get("path"),
        "headers": dict(request.headers),
    }
