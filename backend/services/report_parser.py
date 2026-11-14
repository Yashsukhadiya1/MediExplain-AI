import sys
import logging
from pathlib import Path
from typing import Tuple, Optional

try:
    import pymupdf as fitz
except ImportError:
    import fitz

BASE_DIR = Path(__file__).resolve().parent.parent
ROOT_DIR = BASE_DIR.parent
for p in [str(BASE_DIR), str(ROOT_DIR)]:
    if p not in sys.path:
        sys.path.insert(0, p)

try:
    from services.ocr_service import extract_text_from_image_bytes
except ImportError:
    try:
        from ocr_service import extract_text_from_image_bytes
    except ImportError:
        from backend.services.ocr_service import extract_text_from_image_bytes

logger = logging.getLogger(__name__)

ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg"}
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB

def parse_report_document(file_bytes: bytes, filename: str, content_type: str) -> Tuple[str, Optional[bytes], str]:
    """
    Extracts text from a PDF or image medical report document.
    Returns a tuple: (extracted_text, raw_image_bytes_for_vision_fallback, mime_type)
    """
    if len(file_bytes) > MAX_FILE_SIZE_BYTES:
        raise ValueError("Please upload a file smaller than 10 MB.")

    filename_lower = filename.lower()
    is_pdf = filename_lower.endswith(".pdf") or "pdf" in content_type.lower()
    is_image = any(filename_lower.endswith(ext) for ext in [".png", ".jpg", ".jpeg"]) or "image" in content_type.lower()

    if not is_pdf and not is_image:
        raise ValueError("Unsupported file format. Please upload a PDF, JPG, JPEG, or PNG file.")

    extracted_text = ""
    image_bytes_fallback = None
    mime = content_type or ("application/pdf" if is_pdf else "image/jpeg")

    if is_pdf:
        try:
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            page_texts = []
            for page_num in range(len(doc)):
                page = doc[page_num]
                text = page.get_text("text")
                if text and text.strip():
                    page_texts.append(text.strip())
                else:
                    # If page has no selectable text, render pixmap directly for fast Gemini Vision
                    pix = page.get_pixmap(dpi=150)
                    img_bytes = pix.tobytes("png")
                    if image_bytes_fallback is None:
                        image_bytes_fallback = img_bytes
                        mime = "image/png"

            doc.close()
            extracted_text = "\n\n".join(page_texts).strip()
        except Exception as e:
            logger.error(f"Error reading PDF with PyMuPDF: {e}")
            raise ValueError(f"Unable to read this PDF document: {str(e)}")

    elif is_image:
        # Pass image bytes directly to Gemini Vision to bypass slow CPU Tesseract OCR (saves 15-20s)
        image_bytes_fallback = file_bytes
        extracted_text = ""
        if not mime or mime == "application/octet-stream":
            mime = "image/png" if filename_lower.endswith(".png") else "image/jpeg"

    # If neither text nor image fallback is usable
    if not extracted_text and not image_bytes_fallback:
        raise ValueError(
            "Unable to read this report. Please make sure the file is a clear, legible PDF or image and try again."
        )

    return extracted_text, image_bytes_fallback, mime
