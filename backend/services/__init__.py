# services package
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
ROOT_DIR = BASE_DIR.parent
for p in [str(BASE_DIR), str(ROOT_DIR)]:
    if p not in sys.path:
        sys.path.insert(0, p)

try:
    from services.ai_service import analyze_report_with_gemini, ask_report_question_with_gemini
    from services.ocr_service import extract_text_from_image_bytes
    from services.report_parser import parse_report_document
except ImportError:
    from backend.services.ai_service import analyze_report_with_gemini, ask_report_question_with_gemini
    from backend.services.ocr_service import extract_text_from_image_bytes
    from backend.services.report_parser import parse_report_document

__all__ = [
    "analyze_report_with_gemini",
    "ask_report_question_with_gemini",
    "extract_text_from_image_bytes",
    "parse_report_document",
]
