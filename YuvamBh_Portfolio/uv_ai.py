import json
import os
from pathlib import Path
from flask import Blueprint, request, jsonify, current_app
from dotenv import load_dotenv
from openai import OpenAI
from datetime import datetime, timedelta

uv_ai_bp = Blueprint("uv_ai", __name__, url_prefix="/api")

load_dotenv()

client = None
if os.getenv("OPENAI_API_KEY"):
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

SYSTEM_PROMPT = ""

RATE_LIMIT_DATA = {}
MAX_REQUESTS_PER_SESSION = 2
BLOCK_DURATION_MINUTES = 26
SESSION_IDLE_TIMEOUT_HOURS = 1

def _load_profile():
    global SYSTEM_PROMPT
    root = Path(current_app.root_path)
    profile_path = root / "static" / "Profile_data.json"
    
    if not profile_path.exists():
        profile_path = root / "Profile_data.json"

    data = {}
    if profile_path.exists():
        with open(profile_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            
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

def _ensure_context():
    global SYSTEM_PROMPT, client
    if not SYSTEM_PROMPT:
        _load_profile()
    if not client and os.getenv("OPENAI_API_KEY"):
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def _check_rate_limit(ip_address):
    now = datetime.now()
    user_data = RATE_LIMIT_DATA.get(ip_address)

    if not user_data:
        RATE_LIMIT_DATA[ip_address] = {
            'count': 1,
            'last_request': now,
            'blocked_until': None
        }
        return True, None

    # Check if currently blocked
    if user_data['blocked_until']:
        if now < user_data['blocked_until']:
            wait_time = (user_data['blocked_until'] - now).seconds // 60 + 1
            return False, f"You have reached the message limit. Please wait {wait_time} minutes."
        else:
            # Block expired, reset
            user_data['blocked_until'] = None
            user_data['count'] = 1
            user_data['last_request'] = now
            return True, None

    # Check session idle timeout (reset count if idle for too long)
    if now - user_data['last_request'] > timedelta(hours=SESSION_IDLE_TIMEOUT_HOURS):
        user_data['count'] = 1
        user_data['last_request'] = now
        return True, None

    # Check limit
    if user_data['count'] >= MAX_REQUESTS_PER_SESSION:
        user_data['blocked_until'] = now + timedelta(minutes=BLOCK_DURATION_MINUTES)
        return False, f"You have reached the message limit. Please wait {BLOCK_DURATION_MINUTES} minutes."

    # Update count
    user_data['count'] += 1
    user_data['last_request'] = now
    return True, None

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
    
    # 1. Check Rate Limit
    client_ip = request.remote_addr
    allowed, error_message = _check_rate_limit(client_ip)
    if not allowed:
        return jsonify({"message": error_message}), 429
    
    if not client:
        return jsonify({
            "message": "I'm currently undergoing maintenance. Please contact Yuvam directly via email or LinkedIn."
        }), 503

    try:
        data = request.get_json(silent=True) or {}
        user_message = (data.get("question") or "").strip()
        
        if not user_message and isinstance(data.get("messages"), list):
             msgs = [m for m in data["messages"] if m.get("role") == "user" and m.get("content")]
             if msgs: user_message = msgs[-1]["content"].strip()

        if not user_message:
            return jsonify({"message": "I didn't catch that. Could you ask again?"}), 400

        response = client.chat.completions.create(
            model="gpt-3.5-turbo", 
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
