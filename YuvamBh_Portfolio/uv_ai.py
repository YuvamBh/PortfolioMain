# uv_ai.py — concise answers, no repetition, robust intents + lightweight retrieval
import json, re, math
from collections import Counter, defaultdict
from pathlib import Path
from flask import Blueprint, request, jsonify, current_app

uv_ai_bp = Blueprint("uv_ai", __name__, url_prefix="/api")

# -----------------------
# Caches
# -----------------------
_PROFILE = None
_CORPUS = []
_VOCAB, _IDF, _DOCVECS = {}, {}, []

_STOP = set("""
a an the and or but if while of for to in on at by from with into over under
is are was were be been being have has had do does did can could should would will
this that these those here there it its i you he she they we me my your our their
""".split())

_tok_re = re.compile(r"[A-Za-z0-9']+")

# tolerate broken English: map common variants to canonical tokens
SYNONYMS = {
    # education + graduation
    "school":"education","college":"education","uni":"education","university":"education","asu":"education",
    "study":"education","studying":"education",
    "grad":"graduation","graduate":"graduation","passout":"graduation",
    # experience/internships
    "wrk":"experience","experiance":"experience","experiences":"experience","exp":"experience",
    "workexp":"experience","workexperience":"experience","job":"experience","jobs":"experience",
    "intern":"internships","internship":"internships",
    # projects + skills
    "proj":"projects","projs":"projects","portfolio":"projects",
    "skillz":"skills","skils":"skills","stack":"skills","tools":"skills","languages":"skills",
    # contact + resume
    "mail":"contact","email":"contact","linkedin":"contact","connect":"contact",
    "cv":"resume","resumme":"resume","resum":"resume",
}

def _tokenize(text: str):
    if not text:
        return []
    toks = [t.lower() for t in _tok_re.findall(text)]
    norm = [SYNONYMS.get(t, t) for t in toks]
    return [t for t in norm if t not in _STOP and len(t) > 1]

def _cosine(a: dict, b: dict) -> float:
    if not a or not b:
        return 0.0
    small, big = (a, b) if len(a) < len(b) else (b, a)
    dot = sum(small[t]*big.get(t, 0.0) for t in small)
    na = math.sqrt(sum(v*v for v in a.values()))
    nb = math.sqrt(sum(v*v for v in b.values()))
    return dot / (na*nb + 1e-12)

# -----------------------
# Greetings / small-talk
# -----------------------
GREETINGS_TOKENS  = {"hi", "hello", "hey", "howdy", "yo", "sup"}
GREETINGS_PHRASES = {"good morning", "good afternoon", "good evening"}
SMALLTALK_PATTERNS = [
    re.compile(r"\bhow\s+are\s+you\b", re.I),
    re.compile(r"\bare\s+you\s+ok(ay)?\b", re.I),
]

def _is_greeting(q: str) -> bool:
    ql = (q or "").lower().strip()
    for p in GREETINGS_PHRASES:
        if re.search(rf"\b{re.escape(p)}\b", ql):
            return True
    toks = {t.lower() for t in _tok_re.findall(ql)}
    return bool(GREETINGS_TOKENS & toks)

def _is_smalltalk(q: str) -> bool:
    return any(p.search(q or "") for p in SMALLTALK_PATTERNS)

# -----------------------
# Load profile + build corpus
# -----------------------
def _read_profile():
    root = Path(current_app.root_path)
    for p in [root/"static"/"Profile_data.json", root/"Profile_data.json"]:
        if p.exists():
            with p.open(encoding="utf-8") as f:
                return json.load(f)
    return {"responses": {}, "specificResponses": {}, "questionResponses": {}, "keywords": {}}

def _flatten_profile(d: dict):
    docs = []
    def add(section, key, text, meta=None):
        text = (text or "").strip()
        if not text: return
        docs.append({"id": f"{section}:{key}", "title": str(key), "section": section, "text": text, "meta": meta or {}})

    # responses (main answers)
    for k, v in (d.get("responses") or {}).items():
        add("responses", k, v)

    # specifics (nested)
    def walk(prefix, node):
        if isinstance(node, str):
            add("specific", prefix, node, {"path": prefix})
        elif isinstance(node, dict):
            for kk, vv in node.items():
                walk(f"{prefix}/{kk}", vv)
    walk("root", d.get("specificResponses") or {})

    # Q/A
    for k, v in (d.get("questionResponses") or {}).items():
        text = v.get("a") if isinstance(v, dict) else str(v)
        add("qa", k, text or "", {"qkey": k})

    # keywords (signals → map to responses later)
    for k, v in (d.get("keywords") or {}).items():
        text = " ".join(v) if isinstance(v, list) else str(v)
        add("keywords", k, text, {"map_to": k})

    return docs

def _build_tfidf():
    global _PROFILE, _CORPUS, _VOCAB, _IDF, _DOCVECS
    _PROFILE = _read_profile()
    _CORPUS  = _flatten_profile(_PROFILE)

    df = defaultdict(int)
    for d in _CORPUS:
        for t in set(_tokenize(d["text"])):
            df[t] += 1
    _VOCAB = dict(df)
    N = max(1, len(_CORPUS))
    _IDF = {t: math.log((N+1)/(df_t+1)) + 1.0 for t, df_t in df.items()}

    _DOCVECS = []
    for d in _CORPUS:
        tf = Counter(_tokenize(d["text"]))
        _DOCVECS.append({t: (tf[t]/max(1, len(tf))) * _IDF.get(t, 0.0) for t in tf})

def _ensure_ready():
    if _PROFILE is None or not _DOCVECS:
        _build_tfidf()

def _embed(text: str):
    tf = Counter(_tokenize(text))
    return {t: (tf[t]/max(1, len(tf))) * _IDF.get(t, 0.0) for t in tf}

# -----------------------
# Intents
# -----------------------
_INTENT_PATTERNS = {
    "resume":      re.compile(r"\b(resume|cv)\b", re.I),
    "contact":     re.compile(r"\b(contact|email|reach|connect|linkedin)\b", re.I),
    "skills":      re.compile(r"\b(skills?|tech\s*stack|technolog(y|ies)|tools?|languages?)\b", re.I),
    "education":   re.compile(r"\b(education|study|studying|degree|major|program|university|college|school|asu)\b", re.I),
    "projects":    re.compile(r"\b(projects?|portfolio|work\s*samples?)\b", re.I),
    "experience":  re.compile(r"\b(experience|work\s*exp|employment|roles?|positions?)\b", re.I),
    "internships": re.compile(r"\b(interns?|internship|internships)\b", re.I),
    "graduation":  re.compile(r"\b(when\s+do\s+you\s+grad(uat(e)?)?|grad(uat(e|ion))?)\b", re.I),
    "identity":    re.compile(r"\b(who\s+is\s+(yuvam|you)|who\s+are\s+you|your\s+name|introduce)\b", re.I),
}

_ALLOWED_BY_INTENT = {
    "internships": {"responses", "specific", "qa", "keywords"},
    "experience":  {"responses", "specific", "qa", "keywords"},
    "projects":    {"responses", "specific", "qa", "keywords"},
    "skills":      {"responses", "qa", "keywords"},
    "education":   {"responses", "qa", "keywords"},
    "graduation":  {"responses", "qa", "keywords"},
    "resume":      {"responses"},
    "contact":     {"responses"},
    "identity":    {"responses", "qa"},
    "general":     {"responses", "specific", "qa", "keywords"},
}

# Only map keywords to these response keys per intent (prevents cross-topic spam)
_TOPIC_KEYS = {
    "experience":  {"experience", "internships", "leadership"},
    "internships": {"experience", "internships"},
    "skills":      {"skills"},
    "education":   {"education"},
    "projects":    {"projects"},
    "graduation":  {"graduation", "education"},
    "identity":    {"identity"},
    "contact":     {"contactInfo"},
    "resume":      {"resume"},
}

def _classify_intent(q: str):
    if not q:
        return "general"
    for name, pat in _INTENT_PATTERNS.items():
        if pat.search(q):
            return name
    toks = set(_tokenize(q))
    for t in ("internships","experience","projects","skills","education","graduation","resume","contact"):
        if t in toks:
            return t
    if "who" in toks and "you" in toks:
        return "identity"
    return "general"

# -----------------------
# Concision & de-dup helpers
# -----------------------
def _sentences(text: str):
    parts = re.split(r'(?<=[.!?])\s+', (text or "").strip())
    return [p for p in parts if p]

def _first_sentences(text: str, n=2):
    return " ".join(_sentences(text)[:n])

def _norm(s: str):
    return re.sub(r"\s+", " ", (s or "").lower()).strip()

def _tokenset(s: str):
    return set(_tokenize(s))

def _is_redundant(new_text: str, existing_list):
    """Check redundancy vs a list of strings using containment and Jaccard."""
    n = _norm(new_text)
    nt = _tokenset(new_text)
    for ex in existing_list:
        e = _norm(ex)
        if not n or not e:
            return True if not n else False
        if n == e or n in e or e in n:
            return True
        et = _tokenset(ex)
        if et:
            j = len(nt & et) / (len(nt | et) + 1e-12)
            if j >= 0.6:
                return True
    return False

# -----------------------
# Intent answers (no enrichment for core intents)
# -----------------------
def _answer_for_intent(intent: str, q: str = ""):
    r = (_PROFILE.get("responses") or {})
    t = (_PROFILE.get("responseTemplate") or {})
    basic = (t.get("basicInfo") or {})
    edu   = (t.get("education") or {})
    ql = (q or "").lower()

    if intent == "resume":
        basic_email = (basic.get("email") or "hi@yuvambhargav.com").strip()
        msg = (r.get("resume")
               or f"I'm glad you requested my resume. Please email me at {basic_email} if you have any questions.")
        resume_url = (basic.get("resumeUrl") or "/static/YuvamBhargav_Resume.pdf").strip()
        # Token will be replaced by a real button on the frontend; includes URL to download
        return f"{msg} [[GET_RESUME:{resume_url}]]"

    if intent == "contact":
        parts = []
        if basic.get("email"):
            parts.append(f"Email: {basic['email']}")
        if basic.get("linkedin"):
            parts.append(f"LinkedIn: {basic['linkedin']}")
        if parts:
            return " · ".join(parts)
        return r.get("contactInfo") or "You can reach me through the Connect links."
    if intent == "graduation":
        return r.get("graduation") or edu.get("expectedGraduation") or "May 2027."
    if intent == "education":
        if any(w in ql for w in ["where","which"]) and any(k in ql for k in ["study","studying","university","college","school","asu"]):
            inst=edu.get("institution");deg=edu.get("degree");grad=edu.get("expectedGraduation")
            if inst and deg and grad: return f"{inst} — {deg}; graduating {grad}."
            if inst and deg:          return f"{inst} — {deg}."
            if inst:                  return inst + "."
        inst=edu.get("institution");deg=edu.get("degree");grad=edu.get("expectedGraduation")
        if inst and deg and grad:     return f"{deg} at {inst}; graduating {grad}."
        return _first_sentences(r.get("education",""), 2)
    if intent == "skills":
        return _first_sentences(r.get("skills",""), 2)
    if intent == "projects":
        return _first_sentences(r.get("projects",""), 2)
    if intent == "identity":
        return _first_sentences(r.get("identity") or r.get("introduction",""), 2)
    if intent in {"experience","internships"}:
        base = _first_sentences(r.get("experience",""), 2)
        specs = _PROFILE.get("specificResponses", {}) or {}
        bullets=[]
        if "internships" in specs and isinstance(specs["internships"], dict):
            bullets += list(specs["internships"].values())
        if intent == "experience" and "campusRoles" in specs and isinstance(specs["campusRoles"], dict):
            cr = list(specs["campusRoles"].values())
            if cr:
                bullets.append("Campus roles: " + "; ".join(_first_sentences(x,1) for x in cr[:2]))
        # build unique bullet list (no repeats)
        uniq=[] 
        for b in bullets:
            if not _is_redundant(b, uniq):
                uniq.append(b)
        return base + ("\n" + "\n".join("• "+s for s in uniq[:4]) if uniq else "")
    return None

# -----------------------
# Retrieval (used for general queries only)
# -----------------------
_SECTION_WEIGHTS = {"qa":1.25,"responses":1.15,"specific":1.10,"smalltalk":0.9,"keywords":0.55}

def _search(q: str, k=4, intent="general"):
    vec = _embed(q)
    allowed = _ALLOWED_BY_INTENT.get(intent, _ALLOWED_BY_INTENT["general"])
    scored=[]
    for i,docv in enumerate(_DOCVECS):
        sec=_CORPUS[i]["section"]
        if sec not in allowed: 
            continue
        base=_cosine(vec, docv)
        if base<=0: 
            continue
        title=(_CORPUS[i]["title"] or "").lower()
        if intent in {"internships","experience","projects","skills","education"} and title in {"identity","introduction"}:
            continue
        w=_SECTION_WEIGHTS.get(sec,1.0)
        scored.append((base*w, i))
    scored.sort(reverse=True,key=lambda x:x[0])
    return [(_CORPUS[i],score) for score,i in scored[:k]]

def _compose_answer(q: str, hits, intent="general"):
    if not hits:
        return (_PROFILE.get("responses") or {}).get("introduction") or "Ask me about internships, experience, skills, education, or projects."

    CLEAN_TITLES={"fallback","introduction"}
    mapped=[]
    seen_ids=set()

    for doc,score in hits:
        title=(doc["title"] or "").lower()
        if title in CLEAN_TITLES and intent!="identity":
            continue

        if doc["section"]=="keywords":
            key=(doc.get("meta") or {}).get("map_to","").strip()
            if key and key in _TOPIC_KEYS.get(intent, {key}):
                text = (_PROFILE.get("responses") or {}).get(key)
                if text:
                    vid = f"responses:{key}"
                    if vid in seen_ids: 
                        continue
                    seen_ids.add(vid)
                    mapped.append(({"id":vid,"title":key,"section":"responses","text":text,"meta":{"mapped_from":"keywords"}}, score*0.9))
            continue

        if doc["id"] in seen_ids:
            continue
        seen_ids.add(doc["id"])
        mapped.append((doc,score))

    if not mapped:
        return (_PROFILE.get("responses") or {}).get("introduction") or "Ask me about internships, experience, skills, education, or projects."

    # keep 1–2 unique snippets (no semantic duplicates)
    out=[]
    for doc,_s in mapped:
        cand=_first_sentences(doc["text"], 2)
        if not _is_redundant(cand, out):
            out.append(cand)
        if len(out)>=2:
            break
    return "\n".join(out) if out else _first_sentences(mapped[0][0]["text"], 2)

# -----------------------
# Main reply
# -----------------------
def _best_reply(question: str):
    _ensure_ready()
    q = (question or "").strip()
    if not q:
        return "Please ask me something about my background, projects, or experience."

    if _is_greeting(q) and len(q) <= 30:
        return (_PROFILE.get("conversationalResponses", {}) or {}).get(
            "greeting", "Hi! Ask me about my projects, internships, skills, or education."
        )
    if _is_smalltalk(q):
        return (_PROFILE.get("conversationalResponses", {}) or {}).get(
            "howAreYou", "I'm doing well—thanks for asking! What would you like to know about my background or projects?"
        )

    toks=_tokenize(q); vowel_tokens=sum(any(ch in "aeiou" for ch in t) for t in toks)
    if not toks or (vowel_tokens/max(1,len(toks))<0.35):
        return "I didn’t quite get that, please try again."

    intent=_classify_intent(q)
    canned=_answer_for_intent(intent, q)

    # Do NOT enrich core intents (prevents repetition/bragging)
    NO_ENRICH = {"identity","resume","contact","graduation","education","skills","internships","experience","projects"}
    if canned and intent in NO_ENRICH:
        return canned

    # Otherwise (general queries) allow retrieval
    if canned:
        hits=_search(q, k=4, intent=intent)
        if hits and hits[0][1] >= 0.22:
            enriched=_compose_answer(q, hits, intent=intent)
            # add only if not redundant with canned
            if not _is_redundant(enriched, [canned]):
                return f"{canned}\n\n{enriched}"
        return canned

    hits=_search(q, k=4, intent=intent)
    if hits and hits[0][1] >= 0.20:
        return _compose_answer(q, hits, intent=intent)

    return "I didn’t quite get that, please try again."

# -----------------------
# Routes
# -----------------------
@uv_ai_bp.route("/health", methods=["GET"])
def health():
    try:
        _ensure_ready()
        return jsonify({"ok": True, "docs": len(_CORPUS)}), 200
    except Exception as e:
        current_app.logger.exception("health error")
        return jsonify({"ok": False, "error": str(e)}), 500

@uv_ai_bp.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json(silent=True) or {}
        question = (data.get("question") or "").strip()
        if not question and isinstance(data.get("messages"), list):
            msgs = [m for m in data["messages"] if m.get("role") == "user" and m.get("content")]
            if msgs: question = msgs[-1]["content"].strip()
        if not question:
            return jsonify({"message": "Please ask me something about my background, projects, or experience."}), 400
        return jsonify({"message": _best_reply(question)}), 200
    except Exception:
        current_app.logger.exception("chat error")
        return jsonify({"message": "Sorry—something went wrong on my side."}), 500
