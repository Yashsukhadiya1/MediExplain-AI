# models package
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
ROOT_DIR = BASE_DIR.parent
for p in [str(BASE_DIR), str(ROOT_DIR)]:
    if p not in sys.path:
        sys.path.insert(0, p)

try:
    from models.report_models import (
        TestResultModel,
        MedicalTermModel,
        ReportAnalysisResponse,
        AskReportRequest,
        AskReportResponse,
    )
except ImportError:
    from backend.models.report_models import (
        TestResultModel,
        MedicalTermModel,
        ReportAnalysisResponse,
        AskReportRequest,
        AskReportResponse,
    )

__all__ = [
    "TestResultModel",
    "MedicalTermModel",
    "ReportAnalysisResponse",
    "AskReportRequest",
    "AskReportResponse",
]

