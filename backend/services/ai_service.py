import os
import io
import sys
import json
import logging
from pathlib import Path
from typing import Dict, Any, Optional
from PIL import Image

BASE_DIR = Path(__file__).resolve().parent.parent
ROOT_DIR = BASE_DIR.parent
for p in [str(BASE_DIR), str(ROOT_DIR)]:
    if p not in sys.path:
        sys.path.insert(0, p)

try:
    from models.report_models import ReportAnalysisResponse, TestResultModel, MedicalTermModel
except ImportError:
    from backend.models.report_models import ReportAnalysisResponse, TestResultModel, MedicalTermModel

logger = logging.getLogger(__name__)

EXTRACTION_SYSTEM_PROMPT = """You are MediExplain, an educational medical-report simplification AI.
Your purpose is to help ordinary people understand the information contained in their laboratory/medical reports.

CRITICAL MEDICAL SAFETY & ACCURACY RULES:
1. Extract ONLY tests, values, units, and reference ranges that are ACTUALLY present in the report.
2. DO NOT invent or fabricate reference ranges. If a reference range is not stated in the report, output "Reference range unavailable" for referenceRange and set status to "reference_unavailable".
3. NEVER make definitive medical diagnoses (e.g. NEVER say "You have anemia" or "You have diabetes").
4. Instead, use calm educational language (e.g., "Your hemoglobin result is below the reference range shown on this report. There can be many reasons for an out-of-range result, so discuss it with a healthcare professional.").
5. An out-of-range result does NOT confirm a medical condition.
6. Do not prescribe treatments or medications.
7. Provide practical, clear questions the user could ask their doctor.
8. Identify any medical abbreviations, units, or terms and provide simple definitions.

STATUS DEFINITIONS:
- "within_range": Result is within the laboratory's stated reference bounds.
- "needs_attention": Result is mildly or moderately outside the laboratory's stated reference bounds.
- "important": Result is significantly outside reference limits, warranting prompt discussion with a doctor.
- "reference_unavailable": The report does not specify a reference range for this test.

You must respond with ONLY a valid JSON object adhering strictly to the following JSON structure:
{
  "reportTitle": "Name or panel title of the report (e.g., Complete Blood Count)",
  "reportDate": "Report date if found, or 'Not specified'",
  "labName": "Name of clinic/lab if found, or null",
  "summary": "Plain-language summary of what was tested and the overall picture in simple words.",
  "whatToLookAt": "A clear, concise summary of which results may need discussion with a doctor.",
  "testsAnalyzed": 0,
  "withinRange": 0,
  "needsAttention": 0,
  "important": 0,
  "referenceUnavailable": 0,
  "results": [
    {
      "name": "Test Name",
      "result": "Reported value string (e.g. '10.2' or 'Negative')",
      "numericValue": 10.2,
      "unit": "g/dL",
      "referenceRange": "12.0 - 16.0",
      "lowerBound": 12.0,
      "upperBound": 16.0,
      "status": "within_range",
      "whatIsThisTest": "Simple 1-2 sentence explanation of what this test measures.",
      "explanation": "Simple explanation of what this reported value means relative to the reference range.",
      "questionsForDoctor": [
        "What could explain this result?",
        "Should this test be repeated?"
      ]
    }
  ],
  "medicalTerms": [
    {
      "term": "Term or unit (e.g. g/dL, TSH, Platelets)",
      "definition": "Simple explanation of what this unit or term means."
    }
  ]
}
"""

QA_SYSTEM_PROMPT = """You are MediExplain's expert educational health information assistant.
You answer user questions directly and thoroughly based on their uploaded medical report findings.

FORMATTING & RESPONSE GUIDELINES:
1. Format your response cleanly like Gemini (using clear markdown, bolding key test values and medical numbers, using bullet points for lists, and concise section headings).
2. Base your response accurately on the patient's actual reported values and reference ranges from the provided report context.
3. If the user asks about a test (e.g. Hemoglobin, Glucose, Platelets, etc.), explain:
   - What this test measures in clear everyday terms.
   - The user's exact reported value compared to the laboratory's stated reference range.
   - What having a value in this range generally implies without diagnosing.
   - Clear, practical questions the patient can ask their doctor.
4. NEVER make a definitive clinical diagnosis (e.g. do not say "You have anemia" or "You have diabetes").
5. NEVER prescribe treatments or medications.
6. Maintain a calm, empathetic, and reassuring educational tone.
7. Always advise the patient to review these findings with their healthcare provider for personal clinical evaluation.
"""

def get_gemini_api_key() -> str:
    from dotenv import load_dotenv
    env_path = BASE_DIR / ".env"
    if env_path.exists():
        load_dotenv(dotenv_path=env_path, override=True)
    key = os.getenv("GEMINI_API_KEY", "").strip()
    return key

def _safe_str(val: Any, default: str = "") -> str:
    if val is None:
        return default
    s = str(val).strip()
    return s if s else default

def _safe_float(val: Any) -> Optional[float]:
    if val is None:
        return None
    try:
        if isinstance(val, (int, float)):
            return float(val)
        s = str(val).strip()
        if not s:
            return None
        return float(s)
    except (ValueError, TypeError):
        return None

def normalize_report_json(data: Any, filename: str = "", filesize: str = "") -> dict:
    if not isinstance(data, dict):
        data = {}

    title = _safe_str(data.get("reportTitle"), "Medical Laboratory Report")
    date = _safe_str(data.get("reportDate"), "Not specified")
    lab = data.get("labName")
    lab_name = _safe_str(lab, "") if lab is not None else None
    if lab_name == "":
        lab_name = None

    summary = _safe_str(data.get("summary"), "Report analyzed successfully.")
    what_to_look_at = _safe_str(data.get("whatToLookAt"), "Review any values marked as outside the reference range with your healthcare provider.")

    raw_results = data.get("results")
    if not isinstance(raw_results, list):
        raw_results = []

    normalized_results = []
    within_count = 0
    attention_count = 0
    important_count = 0
    unavail_count = 0

    for item in raw_results:
        if not isinstance(item, dict):
            continue

        name = _safe_str(item.get("name"), "Unnamed Test")
        res_val = _safe_str(item.get("result"), "Not stated")
        unit_val = _safe_str(item.get("unit"), "")
        ref_val = _safe_str(item.get("referenceRange"), "Reference range unavailable")

        status_val = _safe_str(item.get("status"), "within_range").lower()
        if status_val not in ["within_range", "needs_attention", "important", "reference_unavailable", "above_range", "below_range"]:
            status_val = "within_range"

        if status_val == "within_range":
            within_count += 1
        elif status_val in ["needs_attention", "above_range", "below_range"]:
            attention_count += 1
        elif status_val == "important":
            important_count += 1
        elif status_val == "reference_unavailable":
            unavail_count += 1

        num_val = _safe_float(item.get("numericValue"))
        low_bound = _safe_float(item.get("lowerBound"))
        up_bound = _safe_float(item.get("upperBound"))

        what_is = _safe_str(item.get("whatIsThisTest"), "")
        explanation = _safe_str(item.get("explanation"), f"Result: {res_val} {unit_val}".strip())

        raw_questions = item.get("questionsForDoctor")
        questions = []
        if isinstance(raw_questions, list):
            for q in raw_questions:
                q_str = _safe_str(q)
                if q_str:
                    questions.append(q_str)

        norm_item = {
            "name": name,
            "result": res_val,
            "numericValue": num_val,
            "unit": unit_val,
            "referenceRange": ref_val,
            "lowerBound": low_bound,
            "upperBound": up_bound,
            "status": status_val,
            "whatIsThisTest": what_is,
            "explanation": explanation,
            "questionsForDoctor": questions
        }
        normalized_results.append(norm_item)

    raw_terms = data.get("medicalTerms")
    normalized_terms = []
    if isinstance(raw_terms, list):
        for t in raw_terms:
            if isinstance(t, dict):
                term_name = _safe_str(t.get("term"))
                term_def = _safe_str(t.get("definition"))
                if term_name and term_def:
                    normalized_terms.append({"term": term_name, "definition": term_def})

    return {
        "reportTitle": title,
        "reportDate": date,
        "labName": lab_name,
        "summary": summary,
        "whatToLookAt": what_to_look_at,
        "testsAnalyzed": len(normalized_results),
        "withinRange": within_count,
        "needsAttention": attention_count,
        "important": important_count,
        "referenceUnavailable": unavail_count,
        "results": normalized_results,
        "medicalTerms": normalized_terms,
        "fileName": filename if filename else None,
        "fileSize": filesize if filesize else None
    }

MODELS_TO_TRY = ["gemini-3.5-flash-lite", "gemini-3.6-flash", "gemini-3.8-flash"]

_cached_client = None

def get_genai_client(api_key: str):
    """
    Returns a cached Gemini client to avoid repeated TLS handshake overhead.
    """
    global _cached_client
    if _cached_client is None:
        from google import genai
        _cached_client = genai.Client(api_key=api_key)
    return _cached_client

def optimize_image_bytes(image_bytes: bytes, max_dim: int = 1600, quality: int = 85) -> tuple[bytes, str]:
    """
    Optimizes large images in-memory (downscales if >1600px, JPEG quality 85).
    Runs in <0.04s, reducing payload from 5-10MB to ~200KB for near-instant upload and vision inference.
    """
    try:
        from PIL import ImageOps
        img = Image.open(io.BytesIO(image_bytes))
        img = ImageOps.exif_transpose(img)
        if img.mode not in ("RGB", "L"):
            img = img.convert("RGB")
        w, h = img.size
        if max(w, h) > max_dim:
            scale = max_dim / max(w, h)
            new_w, new_h = int(w * scale), int(h * scale)
            img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
        out_buf = io.BytesIO()
        img.save(out_buf, format="JPEG", quality=quality, optimize=True)
        return out_buf.getvalue(), "image/jpeg"
    except Exception as e:
        logger.warning(f"Could not optimize image, sending raw bytes: {e}")
        return image_bytes, "image/jpeg"

def analyze_report_with_gemini(
    extracted_text: str = "",
    image_bytes: Optional[bytes] = None,
    mime_type: str = "image/jpeg",
    filename: str = "report.pdf",
    filesize: str = ""
) -> ReportAnalysisResponse:
    """
    Sends extracted report text or optimized image to Gemini and parses structured JSON response.
    """
    api_key = get_gemini_api_key()
    if not api_key or api_key == "your_key_here":
        raise ValueError(
            "Gemini API key is not configured. Add GEMINI_API_KEY to backend/.env."
        )

    raw_response_text = ""

    try:
        from google.genai import types
        client = get_genai_client(api_key)

        contents = [EXTRACTION_SYSTEM_PROMPT]
        if image_bytes:
            # Optimize image size in-memory for instant transmission and vision processing
            opt_bytes, opt_mime = optimize_image_bytes(image_bytes)
            image_part = types.Part.from_bytes(data=opt_bytes, mime_type=opt_mime)
            contents.append(image_part)
            if extracted_text and len(extracted_text.strip()) > 10:
                contents.append(
                    f"Please inspect and analyze this medical report image thoroughly according to your instructions.\n"
                    f"Supplementary text extracted from document:\n{extracted_text}\n\n"
                    f"Return structured JSON adhering strictly to the required schema."
                )
            else:
                contents.append(
                    "Please inspect and analyze this medical report image thoroughly according to your instructions and return structured JSON."
                )
        else:
            user_prompt = f"Please analyze the following extracted medical report text and return the structured JSON analysis:\n\n--- REPORT TEXT START ---\n{extracted_text}\n--- REPORT TEXT END ---"
            contents.append(user_prompt)

        last_error = None
        for model_name in MODELS_TO_TRY:
            try:
                logger.info(f"Attempting report analysis using model: {model_name}")
                response = client.models.generate_content(
                    model=model_name,
                    contents=contents,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        temperature=0.1
                    )
                )
                if response and response.text:
                    raw_response_text = response.text
                    logger.info(f"Successfully received analysis from {model_name}")
                    break
            except Exception as e_model:
                logger.warning(f"Model {model_name} failed: {e_model}. Trying next candidate...")
                last_error = e_model
                continue

        if not raw_response_text and last_error:
            raise last_error

    except Exception as e_new:
        logger.warning(f"google.genai attempt failed: {e_new}. Trying fallback...")
        try:
            import google.generativeai as genai_legacy
            genai_legacy.configure(api_key=api_key)
            last_leg_error = None
            for model_name in MODELS_TO_TRY:
                try:
                    model = genai_legacy.GenerativeModel(
                        model_name=model_name,
                        generation_config={"response_mime_type": "application/json", "temperature": 0.1}
                    )
                    if image_bytes:
                        pil_img = Image.open(io.BytesIO(image_bytes))
                        response = model.generate_content([
                            EXTRACTION_SYSTEM_PROMPT,
                            pil_img,
                            "Analyze this medical report image and return structured JSON adhering to the required schema."
                        ])
                    else:
                        user_prompt = f"Please analyze the following extracted medical report text and return the structured JSON analysis:\n\n--- REPORT TEXT START ---\n{extracted_text}\n--- REPORT TEXT END ---"
                        response = model.generate_content([EXTRACTION_SYSTEM_PROMPT + "\n\n" + user_prompt])
                    if response and response.text:
                        raw_response_text = response.text
                        break
                except Exception as leg_m_err:
                    last_leg_error = leg_m_err
                    continue
            if not raw_response_text and last_leg_error:
                raise last_leg_error
        except Exception as e_leg:
            logger.error(f"Gemini API request failed. Technical details: {e_new} | {e_leg}")
            if "API key not valid" in str(e_new) or "API_KEY_INVALID" in str(e_new) or "400" in str(e_new) or "INVALID_ARGUMENT" in str(e_new):
                raise ValueError("AI analysis couldn't be completed. Please check the Gemini API configuration in backend/.env and try again.")
            raise ValueError(f"AI analysis couldn't be completed: {str(e_new)}")

    # Clean and parse JSON
    try:
        cleaned_text = raw_response_text.strip()
        if cleaned_text.startswith("```json"):
            cleaned_text = cleaned_text[7:]
        if cleaned_text.startswith("```"):
            cleaned_text = cleaned_text[3:]
        if cleaned_text.endswith("```"):
            cleaned_text = cleaned_text[:-3]
        cleaned_text = cleaned_text.strip()

        data = json.loads(cleaned_text)
        normalized = normalize_report_json(data, filename=filename, filesize=filesize)
        return ReportAnalysisResponse(**normalized)
    except Exception as e:
        logger.error(f"Failed to parse Gemini response JSON: {e}. Raw: {raw_response_text[:300]}")
        raise ValueError(f"Unable to structure the medical report results: {str(e)}")

def ask_report_question_with_gemini(question: str, report: ReportAnalysisResponse) -> str:
    """
    Answers user questions using the actual report context with fast flash inference.
    """
    api_key = get_gemini_api_key()
    if not api_key or api_key == "your_key_here":
        raise ValueError(
            "Gemini API key is not configured. Add GEMINI_API_KEY to backend/.env."
        )

    report_context = json.dumps(report.model_dump(), indent=2)
    prompt = f"""{QA_SYSTEM_PROMPT}

REPORT DATA CONTEXT:
{report_context}

USER QUESTION:
{question}

Please provide a clear, educational, and empathetic response grounded in this report:"""

    try:
        from google.genai import types
        client = get_genai_client(api_key)
        for model_name in MODELS_TO_TRY:
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        temperature=0.2
                    )
                )
                if response and response.text:
                    return response.text.strip()
            except Exception as e_m:
                logger.warning(f"QA attempt with {model_name} failed: {e_m}")
                continue
        raise ValueError("Could not get an answer from available Gemini models.")
    except Exception as e_new:
        try:
            import google.generativeai as genai_legacy
            genai_legacy.configure(api_key=api_key)
            for model_name in MODELS_TO_TRY:
                try:
                    model = genai_legacy.GenerativeModel(model_name=model_name)
                    response = model.generate_content(prompt)
                    if response and response.text:
                        return response.text.strip()
                except Exception:
                    continue
            raise ValueError("All fallback legacy models failed.")
        except Exception as e_leg:
            logger.error(f"Gemini QA error: {e_leg}")
            raise ValueError("Unable to generate an answer at this time. Please check the Gemini API configuration and try again.")
