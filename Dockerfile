# ── Stage 1: Build React Frontend ──
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# ── Stage 2: Python Backend & Production Runtime ──
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend files and static assets
COPY . .
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose port (Render uses $PORT)
ENV PORT=8000
EXPOSE 8000

# Start FastAPI server
CMD ["./start.sh"]