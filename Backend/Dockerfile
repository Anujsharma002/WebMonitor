# Production Backend Dockerfile
FROM python:3.12-slim

# Install uv
RUN apt-get update && apt-get install -y curl && \
    curl -LsSf https://astral.sh/uv/install.sh | sh && \
    apt-get clean && rm -rf /var/lib/apt/lists/*
ENV PATH="/root/.local/bin/:$PATH"

WORKDIR /app

# Copy dependency files
COPY pyproject.toml uv.lock ./

# Install dependencies
RUN uv sync

# Copy source code
COPY . .

# Expose backend port
EXPOSE 8000

# Start backend
CMD ["uv", "run", "main.py"]
