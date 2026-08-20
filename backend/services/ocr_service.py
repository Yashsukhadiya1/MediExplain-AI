import io
import logging
from PIL import Image

logger = logging.getLogger(__name__)

def extract_text_from_image_bytes(image_bytes: bytes) -> str:
    """
    Extracts text from image bytes using PIL and pytesseract.
    Handles image formatting and handles OCR exceptions gracefully.
    """
    try:
        image = Image.open(io.BytesIO(image_bytes))
        # Convert to RGB if necessary
        if image.mode not in ("L", "RGB"):
            image = image.convert("RGB")
        
        try:
            import pytesseract
            text = pytesseract.image_to_string(image)
            return text.strip()
        except ImportError:
            logger.warning("pytesseract is not installed.")
            return ""
        except Exception as e:
            logger.warning(f"Tesseract OCR execution error: {e}")
            return ""
    except Exception as e:
        logger.error(f"Failed to open image for OCR: {e}")
        return ""
