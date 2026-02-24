

from __future__ import annotations

import os
import sys
import re
from pathlib import Path
from typing import Final, List, Tuple
from datetime import date
from dotenv import load_dotenv
from groq import Groq


ENV_PATH = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=ENV_PATH)

SYSTEM_PROMPT: Final = """You are a careful analyst.

Rules:
- Summarize ONLY meaningful content changes.
- Ignore formatting, whitespace, timestamps, tracking IDs.
- Produce 3–5 bullet points max.
- If the change is trivial, say: "No meaningful content change detected."
"""

# --------------------------------------------------------------------------- #
# Model configuration                                                         #
# --------------------------------------------------------------------------- #
PRIMARY_MODEL: Final = "llama-3.3-70b-versatile"
FALLBACK_MODEL: Final = "gemma2-9b-it"
DEFAULT_MODEL: Final = PRIMARY_MODEL

# --------------------------------------------------------------------------- #
# Helpers                                                                     #
# --------------------------------------------------------------------------- #
def _get_api_key() -> str:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY not set")
    return api_key


def get_client_and_model() -> Tuple[Groq, str]:
    api_key = _get_api_key()
    model = os.getenv("GROQ_MODEL", DEFAULT_MODEL)
    return Groq(api_key=api_key), model


def extract_meaningful_changes(diff_text: str) -> str:
    added: List[str] = []
    removed: List[str] = []

    for line in diff_text.splitlines():
        if line.startswith("+") and not line.startswith("+++"):
            added.append(line[1:].strip())
        elif line.startswith("-") and not line.startswith("---"):
            removed.append(line[1:].strip())

    if not added and not removed:
        return ""

    parts: List[str] = []

    if removed:
        parts.append("REMOVED CONTENT:")
        parts.extend(f"- {r}" for r in removed)

    if added:
        parts.append("\nADDED CONTENT:")
        parts.extend(f"+ {a}" for a in added)

    return "\n".join(parts)






def _call_groq(
    client: Groq,
    model: str,
    system_prompt: str,
    user_prompt: str,
    temperature: float = 0.2,
    max_tokens: int = 350,
) -> str:
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=temperature,
        max_tokens=max_tokens,
    )

    if response.choices and response.choices[0].message.content:
        return response.choices[0].message.content.strip()
    return ""


# --------------------------------------------------------------------------- #
# Core function                                                               #
# --------------------------------------------------------------------------- #
def summarize_diff(diff_text: str) -> str:
    """
    Summarise webpage changes using Groq.

    The backend is the ONLY source of truth for timestamps.
    """

    if not diff_text or not diff_text.strip():
        return "No meaningful content change detected."

    cleaned_diff = extract_meaningful_changes(diff_text)

    if not cleaned_diff:
        return "No meaningful content change detected."

    client, model = get_client_and_model()

    user_prompt = f"""
Analyze the following webpage changes.

Lines starting with '-' were removed.
Lines starting with '+' were added.

{cleaned_diff}

Summarize the meaningful content changes in 3–5 bullet points.
Be specific about dates and times if they have changed and are meaningful.
Today is {date.today()}.
"""

    try:
        summary = _call_groq(client, model, SYSTEM_PROMPT, user_prompt)
        if summary:
            return summary
        return "No meaningful content change detected."

    except Exception as exc:
        from groq import BadRequestError

        if isinstance(exc, BadRequestError):
            err_body = getattr(exc, "body", {}) or {}
            if err_body.get("code") == "model_decommissioned":
                print(
                    f"[WARN] Model `{model}` decommissioned – retrying with `{FALLBACK_MODEL}`",
                    file=sys.stderr,
                )
                try:
                    summary = _call_groq(
                        client,
                        FALLBACK_MODEL,
                        SYSTEM_PROMPT,
                        user_prompt,
                    )
                    if summary:
                        return summary
                except Exception as fallback_exc:
                    print(
                        f"[ERROR] Fallback summarization failed: {fallback_exc}",
                        file=sys.stderr,
                    )

        print(f"[ERROR] Groq summarization error: {exc}", file=sys.stderr)
        return (
            "LLM summarization failed. "
            "Diff was detected and displayed successfully."
        )