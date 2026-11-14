import os
import sys
import logging
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

# Ensure backend directory and root directory are in sys.path
BASE_DIR = Path(__file__).resolve().parent
ROOT_DIR = BASE_DIR.parent
for p in [str(BASE_DIR), str(ROOT_DIR)]:
    if p not in sys.path:
        sys.path.insert(0, p)

# Import models and services with fallback support
try:
    from models.report_models import ReportAnalysisResponse, AskReportRequest, AskReportResponse
    from services.report_parser import parse_report_document
    from services.ai_service import analyze_report_with_gemini, ask_report_question_with_gemini
except ImportError:
    from backend.models.report_models import ReportAnalysisResponse, AskReportRequest, AskReportResponse
    from backend.services.report_parser import parse_report_document
    from backend.services.ai_service import analyze_report_with_gemini, ask_report_question_with_gemini

# Load environment variables from backend/.env or parent directories
env_path = BASE_DIR / ".env"
load_dotenv(dotenv_path=env_path)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("mediexplain_backend")

app = FastAPI(
    title="MediExplain API",
    description="Educational Medical Report Simplification API",
    version="1.0.0"
)

# Configure CORS
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173")
origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]
for default_origin in ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173"]:
    if default_origin not in origins:
        origins.append(default_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "MediExplain API is active.",
        "status": "ok",
        "docs": "/docs",
        "health": "/api/health"
    }

@app.get("/api/health")
async def health_check():
    gemini_configured = bool(os.getenv("GEMINI_API_KEY", "").strip())
    return {
        "status": "ok",
        "service": "MediExplain Backend",
        "gemini_configured": gemini_configured
    }

@app.post("/api/analyze-report", response_model=ReportAnalysisResponse)
async def analyze_report_endpoint(file: UploadFile = File(...)):
    """
    Receives an actual medical report file (PDF, JPG, JPEG, PNG),
    extracts text and reference ranges, runs Gemini AI structuring,
    and returns a clean, educational analysis.
    """
    filename = file.filename or "medical_report"
    content_type = file.content_type or ""

    logger.info(f"Received file upload: {filename} (Content-Type: {content_type})")

    # Read uploaded bytes
    try:
        file_bytes = await file.read()
    except Exception as e:
        logger.error(f"Failed to read upload stream: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to read the uploaded file stream. Please try again."
        )

    # Format file size string
    size_bytes = len(file_bytes)
    formatted_size = f"{round(size_bytes / 1024, 1)} KB" if size_bytes < 1048576 else f"{round(size_bytes / 1048576, 2)} MB"

    # Step 1: Extract text and validate (with image fallback support)
    try:
        extracted_text, image_fallback_bytes, mime_type = parse_report_document(file_bytes, filename, content_type)
        logger.info(f"Extracted {len(extracted_text)} chars from {filename}. Image fallback present: {bool(image_fallback_bytes)}")
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err)
        )
    except Exception as e:
        logger.error(f"Document parsing error: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not read this report document: {str(e)}"
        )

    # Step 2: Analyze with Gemini AI (supporting text and multimodal image)
    try:
        analysis_result = analyze_report_with_gemini(
            extracted_text=extracted_text,
            image_bytes=image_fallback_bytes,
            mime_type=mime_type,
            filename=filename,
            filesize=formatted_size
        )
        return analysis_result
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err)
        )
    except Exception as e:
        logger.error(f"AI analysis exception: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="We couldn't analyze this report right now. Please check your API configuration and try again."
        )

@app.post("/api/ask-report", response_model=AskReportResponse)
async def ask_report_endpoint(request: AskReportRequest):
    """
    Answers user questions grounded in their actual uploaded report findings.
    """
    if not request.question.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide a question about your report."
        )

    try:
        answer = ask_report_question_with_gemini(request.question, request.report)
        return AskReportResponse(answer=answer)
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err)
        )
    except Exception as e:
        logger.error(f"Ask report exception: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to generate an answer at this time. Please try again."
        )

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run("main:app", host=host, port=port, reload=True)
