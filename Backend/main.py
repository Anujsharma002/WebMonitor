from fastapi import FastAPI, HTTPException, Depends, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from difflib import unified_diff
import uvicorn
from datetime import datetime
from db import SessionLocal, engine
from models import Link, Check
from fetcher import fetch_clean_text
from llm import summarize_diff
from db import Base
from dotenv import load_dotenv, dotenv_values
import os

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Web Monitor + Summary")

@app.get("/test-page")
def test_page():
    # Force fresh date on every request
    now = datetime.now()
    now_date = now.strftime("%b %d, %Y")
    now_time = now.strftime("%H:%M:%S")
    html = f"""
    <html>
        <head><title>Web Monitor Test</title></head>
        <body>
            <h1>Web Monitor Test Page</h1>
            <p>Pricing Page</p>
            <ul>
                <li>Pro Plan: $100/ month</li>
                <li>Projects: 10</li>
            </ul>
            <p>Last updated: {now_date} at {now_time}</p>
            <p style="color: gray; font-size: 0.8rem;">Current Server Time: {now_time}</p>
        </body>
    </html>
    """
    return Response(content=html, media_type="text/html")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/links")
def add_link(url: str, db: Session = Depends(get_db)):
    existing = db.query(Link).filter(Link.url == url).first()
    if existing:
        return {"message": "Link already exists", "id": existing.id}
    link = Link(url=url)
    db.add(link)
    db.commit()
    return {"message": "Link added", "id": link.id}

@app.get("/links")
def list_links():
    db = SessionLocal()
    return db.query(Link).all()

@app.post("/check/{link_id}")
async def check_link(link_id: int):
    db: Session = SessionLocal()

    link = db.query(Link).get(link_id)
    if not link:
        raise HTTPException(404, "Link not found")

    new_text = await fetch_clean_text(link.url)

    last_check = (
        db.query(Check)
        .filter(Check.link_id == link_id)
        .order_by(Check.fetched_at.asc())  # IMPORTANT
        .first()
    )

    # --------------------------------------------------
    # BASELINE: first-ever check → NO CHANGE
    # --------------------------------------------------
    if not last_check:
        baseline = Check(
            link_id=link_id,
            raw_text=new_text,
            diff_text="",
            summary="Initial baseline created. No change detected.",
            changed=False,
            fetched_at=datetime.now(),
        )
        db.add(baseline)
        db.commit()

        return {
            "changed": False,
            "summary": baseline.summary,
            "diff_text": "",
        }

    # --------------------------------------------------
    # NORMAL DIFF CHECK
    # --------------------------------------------------
    prev = (
        db.query(Check)
        .filter(Check.link_id == link_id)
        .order_by(Check.fetched_at.desc())
        .first()
    )

    diff = "\n".join(
        unified_diff(
            prev.raw_text.splitlines(),
            new_text.splitlines(),
            lineterm=""
        )
    )

    changed = bool(diff.strip())
    summary = summarize_diff(diff) if changed else "No change detected."

    check = Check(
        link_id=link_id,
        raw_text=new_text,
        diff_text=diff,
        summary=summary,
        changed=changed,
        fetched_at=datetime.now(),
    )

    db.add(check)

    # Keep only last 5 checks
    all_checks = (
        db.query(Check)
        .filter(Check.link_id == link_id)
        .order_by(Check.fetched_at.desc())
        .all()
    )
    for c in all_checks[5:]:
        db.delete(c)

    db.commit()

    return {
        "changed": changed,
        "summary": summary,
        "diff_text": diff,
    }

@app.get("/history/{link_id}")
def history(link_id: int):
    db = SessionLocal()
    return (
        db.query(Check)
        .filter(Check.link_id == link_id)
        .order_by(Check.fetched_at.desc())
        .all()
    )

@app.get("/status")
def status():
    try:
        # Check environment first, then .env
        key = os.getenv("GROQ_API_KEY")
        if not key:
            load_dotenv()
            key = os.getenv("GROQ_API_KEY")
        
        ok = bool(key)
        llm = "ok" if ok else "error: GROQ_API_KEY not set"
    except Exception as e:
        llm = f"error: {e}"

    return {
        "backend": "ok",
        "database": "ok",
        "llm": llm
    }
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)