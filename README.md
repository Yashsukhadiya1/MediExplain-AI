# MediExplain — Understand Your Medical Report

MediExplain is a calm, trustworthy educational medical-report simplification web application. It processes actual uploaded laboratory reports (PDF or images), extracts biomarkers and stated reference bounds, and delivers clear, plain-language explanations with actionable questions for your doctor.

---

## 🌟 Architecture & Workflow

```
[User Uploads PDF/Image]
         │
         ▼
[React Frontend (Port 3000)]
         │  Multipart Form-Data POST
         ▼
[FastAPI Backend (Port 8000)]
         │
         ├─► [PyMuPDF / fitz] ──► Selectable text extraction
         ├─► [Pillow / OCR]   ──► Image & Scanned PDF processing
         │
         ▼
[Google Gemini API] ──────────► Structured JSON (biomarkers, stated ranges, simple explanations)
         │
         ▼
[MediExplain Results Dashboard]
   • "What should I look at?" plain-language overview
   • 3-Metric Summary (Tests analyzed, Within range, Needs attention)
   • Vertical Result List with expandable "Learn more" details
   • Questions to ask your doctor
   • Medical Terms Glossary
   • Biomarker visualization
   • Contextual Report Q&A
```

---

## 🚀 Quick Start Guide

### 1. Backend Setup (FastAPI)

1. Navigate to the `backend/` directory or run from root:
   ```bash
   pip install -r backend/requirements.txt
   ```

2. Configure your Google Gemini API Key:
   - Copy `backend/.env.example` to `backend/.env`:
     ```bash
     cp backend/.env.example backend/.env
     ```
   - Open `backend/.env` and add your API key:
     ```env
     GEMINI_API_KEY=your_google_gemini_api_key_here
     ```
   *(Get an API key free at [Google AI Studio](https://aistudio.google.com/))*

3. Start the FastAPI backend:
   ```bash
   python -m uvicorn backend.main:app --port 8000 --reload
   ```
   The backend will be available at `http://localhost:8000` (API documentation at `http://localhost:8000/docs`).

---

### 2. Frontend Setup (React + Vite)

1. Install frontend dependencies (if not already done):
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your web browser.

---

## 🔒 Medical Disclaimer & Safety

**Important:** MediExplain provides educational explanations of information contained in medical reports. It does not diagnose medical conditions, prescribe treatment, or replace professional medical advice. An out-of-range result does not by itself confirm a medical condition. Always discuss test results with a qualified healthcare professional.
