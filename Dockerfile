# Use Python 3.12 as base
FROM python:3.12-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install uv for backend
RUN curl -LsSf https://astral.sh/uv/install.sh | sh
ENV PATH="/root/.local/bin/:$PATH"

WORKDIR /app

# Copy root contents
COPY . .

# Setup Backend
WORKDIR /app/Backend
RUN uv sync

# Setup Frontend
WORKDIR /app/Frontend
RUN npm install

# Back to root
WORKDIR /app

# Create a startup script
RUN echo '#!/bin/sh\n\
cd /app/Backend && uv run main.py &\n\
cd /app/Frontend && npm run dev -- --host\n\
wait' > /app/start.sh && chmod +x /app/start.sh

# Expose ports
EXPOSE 5173 8000

# Start services
CMD ["/app/start.sh"]
