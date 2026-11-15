from typing import List, Optional, Any
from pydantic import BaseModel, Field, field_validator

class TestResultModel(BaseModel):
    model_config = {"extra": "ignore"}

    name: str = Field("Unnamed Test", description="Name of the medical or laboratory test")
    result: str = Field("", description="Reported result value as a string (e.g. '10.2' or 'Negative')")
    numericValue: Optional[float] = Field(None, description="Numeric parsed value if applicable")
    unit: str = Field("", description="Measurement unit (e.g. 'g/dL', 'mg/dL', 'µL')")
    referenceRange: str = Field(
        "Reference range unavailable",
        description="Reference range stated by the laboratory on this report, or 'Reference range unavailable'"
    )
    lowerBound: Optional[float] = Field(None, description="Lower bound of reference range if numeric")
    upperBound: Optional[float] = Field(None, description="Upper bound of reference range if numeric")
    status: str = Field(
        "within_range",
        description="Status based on stated reference range: 'within_range', 'needs_attention', 'important', or 'reference_unavailable'"
    )
    whatIsThisTest: str = Field(
        "",
        description="Simple educational explanation of what this test measures in everyday language"
    )
    explanation: str = Field(
        "No explanation provided.",
        description="Educational explanation of what this result means relative to the stated reference range without diagnosing"
    )
    questionsForDoctor: List[str] = Field(
        default_factory=list,
        description="Practical questions the patient could discuss with their healthcare provider"
    )

    @field_validator("name", "result", "unit", "referenceRange", "status", "whatIsThisTest", "explanation", mode="before")
    @classmethod
    def coerce_str(cls, v: Any, info) -> str:
        if v is None:
            if info.field_name == "referenceRange":
                return "Reference range unavailable"
            elif info.field_name == "name":
                return "Unnamed Test"
            elif info.field_name == "explanation":
                return "No explanation provided."
            elif info.field_name == "status":
                return "within_range"
            return ""
        return str(v).strip()

class MedicalTermModel(BaseModel):
    model_config = {"extra": "ignore"}

    term: str = Field("", description="Medical term, acronym, or unit used in the report")
    definition: str = Field("", description="Simple, clear educational definition")

    @field_validator("term", "definition", mode="before")
    @classmethod
    def coerce_str(cls, v: Any) -> str:
        if v is None:
            return ""
        return str(v).strip()

class ReportAnalysisResponse(BaseModel):
    model_config = {"extra": "ignore"}

    reportTitle: str = Field("Medical Laboratory Report", description="Identified report title or panel name")
    reportDate: str = Field("Not specified", description="Date of the report if found, or 'Recent'")
    labName: Optional[str] = Field(None, description="Laboratory or clinic name if found")
    summary: str = Field("Report analyzed successfully.", description="Overall plain-language summary of the report")
    whatToLookAt: str = Field("Review any values marked as outside the reference range with your healthcare provider.", description="Key focal points or out-of-range observations to discuss with a doctor")
    testsAnalyzed: int = Field(0, description="Total number of tests identified")
    withinRange: int = Field(0, description="Count of tests within stated reference range")
    needsAttention: int = Field(0, description="Count of tests outside reference range")
    important: int = Field(0, description="Count of significantly out-of-range tests needing prompt doctor discussion")
    referenceUnavailable: int = Field(0, description="Count of tests without stated reference range")
    results: List[TestResultModel] = Field(default_factory=list, description="List of extracted test results")
    medicalTerms: List[MedicalTermModel] = Field(default_factory=list, description="Glossary of key terms and units")
    fileName: Optional[str] = Field(None, description="Original uploaded file name")
    fileSize: Optional[str] = Field(None, description="Formatted size of uploaded file")

    @field_validator("reportTitle", "reportDate", "summary", "whatToLookAt", mode="before")
    @classmethod
    def coerce_str(cls, v: Any, info) -> str:
        if v is None:
            if info.field_name == "reportTitle":
                return "Medical Laboratory Report"
            elif info.field_name == "reportDate":
                return "Not specified"
            elif info.field_name == "summary":
                return "Report analyzed successfully."
            elif info.field_name == "whatToLookAt":
                return "Review your results with a healthcare provider."
            return ""
        return str(v).strip()

class AskReportRequest(BaseModel):
    model_config = {"extra": "ignore"}

    question: str
    report: ReportAnalysisResponse

class AskReportResponse(BaseModel):
    answer: str
