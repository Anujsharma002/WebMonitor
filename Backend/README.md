# WebMonitor Backend

This is the FastAPI backend for the WebMonitor application. It handles URL management, content fetching, diffing, and AI summarization.

## Setup

1. **Install Dependencies**:
   This project uses `uv` for lightning-fast Python package management.
   ```bash
   uv sync
   ```

2. **Environment Variables**:
   Create a `.env` file in this directory:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   GROQ_MODEL=llama-3.3-70b-versatile (optional)
   ```

3. **Run Application**:
   ```bash
   uv run main.py
   ```

## Key Modules

- **`main.py`**: API routes (`/links`, `/check/{id}`, `/history/{id}`).
- **`llm.py`**: Diff cleaning and Groq API orchestration.
- **`fetcher.py`**: Logic for fetching and cleaning HTML content.
- **`db.py` & `models.py`**: SQLAlchemy setup and SQLite schema.

## Database

Uses SQLite (`data.db`) by default.
- `links`: Stores URLs being monitored.
- `checks`: Stores history of fetched content, diffs, and summaries.
