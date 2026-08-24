import { ReportData } from '../types/report';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

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
    if (error.message && !error.message.includes('Failed to fetch')) {
      throw error;
    }
    throw new Error(
      'Could not connect to the analysis service. Please ensure the MediExplain backend is running on port 8000.'
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
    if (error.message && !error.message.includes('Failed to fetch')) {
      throw error;
    }
    throw new Error(
      'Could not reach the question assistant. Please verify the backend server is active.'
    );
  }
}

function jsonSafeStringify(obj: any): string {
  return JSON.stringify(obj);
}
