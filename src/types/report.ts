export type TestStatus = 'within_range' | 'needs_attention' | 'important' | 'reference_unavailable';

export interface TestResult {
  name: string;
  result: string;
  numericValue?: number | null;
  unit: string;
  referenceRange: string;
  lowerBound?: number | null;
  upperBound?: number | null;
  status: TestStatus | string;
  whatIsThisTest?: string;
  explanation: string;
  questionsForDoctor: string[];
}

export interface MedicalTerm {
  term: string;
  definition: string;
}

export interface ReportData {
  reportTitle: string;
  reportDate: string;
  labName?: string | null;
  summary: string;
  whatToLookAt: string;
  testsAnalyzed: number;
  withinRange: number;
  needsAttention: number;
  important: number;
  referenceUnavailable: number;
  results: TestResult[];
  medicalTerms: MedicalTerm[];
  fileName?: string | null;
  fileSize?: string | null;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export type PageView = 'home' | 'upload' | 'results';
