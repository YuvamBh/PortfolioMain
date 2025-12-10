# uv_ai.py — OpenAI Powered Portfolio Assistant
import json
import os
from pathlib import Path
from flask import Blueprint, request, jsonify, current_app
from dotenv import load_dotenv
from openai import OpenAI

uv_ai_bp = Blueprint("uv_ai", __name__, url_prefix="/api")

# Load environment variables
load_dotenv()

# Initialize OpenAI Client
client = None
if os.getenv("OPENAI_API_KEY"):
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# -----------------------
# System Prompt & Context
# -----------------------
SYSTEM_PROMPT = ""

def _load_profile():
    global SYSTEM_PROMPT
    root = Path(current_app.root_path)
    profile_path = root / "static" / "Profile_data.json"
    
    if not profile_path.exists():
        # Fallback path if needed
        profile_path = root / "Profile_data.json"

    data = {}
    if profile_path.exists():
        with open(profile_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            
    # Construct System Prompt
    # We dump the entire JSON into the context so the model can query it intelligently.
    # You can optimize this by summarizing if the JSON is huge, but for a portfolio it's usually fine.
    profile_str = json.dumps(data, indent=2)
    
    SYSTEM_PROMPT = f"""
You are an advanced AI assistant for Yuvam Bhargav's personal portfolio website.
Your goal is to answer visitor questions about Yuvam professionally, concisely, and accurately based ONLY on the provided JSON profile data.

Here is Yuvam's Profile Data:
```json
{profile_str}
```

Instructions:
1.  **Role**: You are Yuvam's digital representative. Be polite, professional, and helpful.
2.  **Context**: Use the provided JSON to answer questions about education, skills, projects, experience, etc.
3.  **Unknowns**: If the answer is not in the data, politely say you don't have that information and suggest contacting Yuvam directly. Do NOT halluncinate facts.
4.  **Tone**: Professional but approachable.
5.  **Conciseness**: Keep answers brief and to the point (2-3 sentences max) unless the user asks for details.
6.  **Formatting**: You can use basic markdown (bold, lists) if helpful, but avoid complex formatting that might break the chat UI.
7.  **Resume**: If asked for a resume, ALWAYS include this exact token in your response: `[[GET_RESUME:/static/YuvamBhargav_Resume.pdf]]`. Also mention: "If you turn on gesture control from the top right and show a victory sign (✌️), you can also access my resume."
8.  **Contact**: If asked for contact info, provide the email or LinkedIn from the Basic Info section.

Start every interaction by giving a short introduction of Yuvam from the profile data.
"""

# Power up logic - run once on request to ensure context is loaded if app reloaded
def _ensure_context():
    global SYSTEM_PROMPT, client
    if not SYSTEM_PROMPT:
        _load_profile()
    # Re-check client in case env was loaded late? 
    # Usually env is loaded at module level, but safe to check.
    if not client and os.getenv("OPENAI_API_KEY"):
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# -----------------------
# Routes
# -----------------------
@uv_ai_bp.route("/health", methods=["GET"])
def health():
    try:
        _ensure_context()
        status = "active" if client else "configured_but_no_key"
        return jsonify({"ok": True, "status": status}), 200
    except Exception as e:
        current_app.logger.exception("health error")
        return jsonify({"ok": False, "error": str(e)}), 500

@uv_ai_bp.route("/chat", methods=["POST"])
def chat():
    _ensure_context()
    
    # Check for API Key FIRST
    if not client:
        return jsonify({
            "message": "I'm currently undergoing maintenance. Please contact Yuvam directly via email or LinkedIn."
        }), 503

    try:
        data = request.get_json(silent=True) or {}
        user_message = (data.get("question") or "").strip()
        
        # Handle message history if sent
        # The frontend might send specific structure, but for now we look for 'question' or extract from 'messages'
        if not user_message and isinstance(data.get("messages"), list):
             # Simple extraction of last user message
             msgs = [m for m in data["messages"] if m.get("role") == "user" and m.get("content")]
             if msgs: user_message = msgs[-1]["content"].strip()

        if not user_message:
            return jsonify({"message": "I didn't catch that. Could you ask again?"}), 400

        # Call OpenAI
        response = client.chat.completions.create(
            model="gpt-3.5-turbo", # Or gpt-4o-mini if available/preferred for speed/cost
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message}
            ],
            temperature=0.7,
            max_tokens=150
        )
        
        ai_reply = response.choices[0].message.content.strip()
        return jsonify({"message": ai_reply}), 200

    except Exception as e:
        current_app.logger.exception("OpenAI Chat Error")
        return jsonify({"message": "I'm having trouble connecting to my brain right now. Please try again later."}), 500
