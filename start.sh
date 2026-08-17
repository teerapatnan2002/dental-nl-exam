#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status
set -o errexit

PORT=${PORT:-10000}
echo "=== 🚀 Starting Dental NL Exam API on port $PORT ==="
exec python -m uvicorn main:app --host 0.0.0.0 --port "$PORT"
