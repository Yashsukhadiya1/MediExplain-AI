import { ReportData } from '../types/report';

function getApiBaseUrl(): string {
  // 1. Explicit environment variable override (direct access for Vite static replacement)
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    return envUrl;
  }

  // 2. When running locally in browser (localhost / 127.0.0.1)
  if (typeof window !== 'undefined') {
    const { hostname } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8000';
    }
  }

  // 3. Live Render production backend URL
  return 'https://mediexplain-ai-ru78.onrender.com';
}

const API_BASE_URL = getApiBaseUrl();

export async function analyzeReport(file: File): Promise<ReportData> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze-report`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = 'Unable to analyze this medical report.';
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          errorMessage = errorData.detail;
        }
      } catch {
        // use default message
      }
      throw new Error(errorMessage);
    }

    const data: ReportData = await response.json();
    return data;
  } catch (error: any) {
    if (error.message && !error.message.includes('Failed to fetch') && !error.message.includes('NetworkError')) {
      throw error;
    }
    throw new Error(
      `Could not connect to the analysis service at ${API_BASE_URL}. Please ensure the MediExplain backend is running on port 8000.`
    );
  }
}

export async function askAboutReport(question: string, report: ReportData): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ask-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonSafeStringify({ question, report }),
    });

    if (!response.ok) {
      let errorMessage = 'Unable to answer this question at the moment.';
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          errorMessage = errorData.detail;
        }
      } catch {
        // use default message
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.answer || 'No answer could be generated.';
  } catch (error: any) {
    if (error.message && !error.message.includes('Failed to fetch') && !error.message.includes('NetworkError')) {
      throw error;
    }
    throw new Error(
      `Could not reach the question assistant at ${API_BASE_URL}. Please verify the backend server is active.`
    );
  }
}

function jsonSafeStringify(obj: any): string {
  return JSON.stringify(obj);
}
