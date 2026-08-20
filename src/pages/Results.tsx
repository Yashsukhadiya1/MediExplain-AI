import React, { useState } from 'react';
import { Calendar, Building2, FileText, ArrowLeft, Upload, Share2, Check, Stethoscope, HelpCircle } from 'lucide-react';
import { ReportData } from '../types/report';
import { SummaryCards } from '../components/results/SummaryCards';
import { AISummaryCard } from '../components/results/AISummaryCard';
import { ResultList } from '../components/results/ResultList';
import { MedicalTerms } from '../components/results/MedicalTerms';
import { ReportChat } from '../components/results/ReportChat';
import { Disclaimer } from '../components/common/Disclaimer';

interface ResultsProps {
  report: ReportData | null;
  onAnalyzeAnother: () => void;
}

export const Results: React.FC<ResultsProps> = ({ report, onAnalyzeAnother }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activeQuestionTarget, setActiveQuestionTarget] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // If no report analyzed yet
  if (!report) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="rounded-xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm">
          <FileText className="h-10 w-10 text-slate-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900">
            No report analyzed yet
          </h2>
          <p className="mt-2 text-sm text-slate-600 max-w-sm mx-auto">
            Upload a medical report to see your results here.
          </p>
          <button
            onClick={onAnalyzeAnother}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-teal-800 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-teal-900"
          >
            <Upload className="h-4 w-4" />
            Upload a Report
          </button>
        </div>
      </div>
    );
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAskAboutTest = (testName: string) => {
    setActiveQuestionTarget(testName);
    const chatEl = document.getElementById('report-chat-section');
    if (chatEl) {
      chatEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Collect doctor questions and key observations from out-of-range results
  const outOfRangeResults = report.results.filter(
    (r) => r.status === 'needs_attention' || r.status === 'important' || r.status === 'above_range' || r.status === 'below_range'
  );

  const allDoctorQuestions = Array.from(
    new Set(report.results.flatMap((r) => r.questionsForDoctor || []))
  ).filter(Boolean);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-8 text-left">
      {/* Top Banner */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
              Report Analysis
            </span>
            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Your report, explained
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
              Educational explanation based on the information detected in your uploaded report.
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <span className="font-semibold text-slate-900">{report.reportTitle}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                Date: {report.reportDate}
              </span>
              {report.labName && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5 text-slate-400" />
                    {report.labName}
                  </span>
                </>
              )}
              {report.fileName && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5 text-slate-400" />
                    {report.fileName}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-teal-700" /> : <Share2 className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
            <button
              type="button"
              onClick={onAnalyzeAnother}
              className="inline-flex items-center gap-1.5 rounded-lg bg-teal-800 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-teal-900 transition-colors shadow-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Analyze another report
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCards
        report={report}
        selectedFilter={selectedFilter}
        onSelectFilter={setSelectedFilter}
      />

      {/* Report Overview & Summary */}
      <AISummaryCard report={report} />

      {/* Results at a glance & What do these results mean */}
      <ResultList
        results={report.results}
        selectedFilter={selectedFilter}
        onSelectFilter={setSelectedFilter}
        onAskAboutTest={handleAskAboutTest}
      />

      {/* SECTION: Things worth discussing with your doctor */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Stethoscope className="h-5 w-5 text-teal-800" />
          <h3 className="text-base font-bold text-slate-900">
            Things worth discussing with your doctor
          </h3>
        </div>

        {outOfRangeResults.length > 0 ? (
          <div className="space-y-2.5">
            <p className="text-xs sm:text-sm text-slate-600">
              The following values were reported outside your laboratory's stated reference limits:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm">
              {outOfRangeResults.map((r, i) => (
                <li key={i} className="rounded-lg bg-slate-50 p-3 border border-slate-200/80">
                  <div className="flex items-center justify-between font-semibold text-slate-900">
                    <span>{r.name}: <strong className="text-teal-900">{r.result} {r.unit}</strong></span>
                    <span className="text-xs text-slate-500 font-normal">Reference: {r.referenceRange}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{r.explanation}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-slate-600">
            All reported test values appear to fall within your laboratory's stated reference ranges. Even with normal values, you can review your general health with your doctor.
          </p>
        )}
      </div>

      {/* SECTION: Questions you may want to ask */}
      {allDoctorQuestions.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <HelpCircle className="h-5 w-5 text-teal-800" />
            <h3 className="text-base font-bold text-slate-900">
              Questions you may want to ask
            </h3>
          </div>

          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            {allDoctorQuestions.slice(0, 5).map((q, idx) => (
              <li key={idx} className="flex items-start gap-2.5 rounded-lg bg-teal-50/40 p-2.5 border border-teal-100/80">
                <span className="text-teal-800 font-bold">•</span>
                <span className="font-medium text-slate-900">"{q}"</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Medical Terms Glossary */}
      {report.medicalTerms && report.medicalTerms.length > 0 && (
        <MedicalTerms terms={report.medicalTerms} />
      )}

      {/* Ask About Your Report Chat */}
      <div id="report-chat-section">
        <ReportChat
          report={report}
          initialQuestion={activeQuestionTarget}
        />
      </div>

      {/* Action Button: Analyze another report */}
      <div className="pt-4 flex justify-center">
        <button
          type="button"
          onClick={onAnalyzeAnother}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-800 px-6 py-3 text-sm font-semibold text-white shadow-xs hover:bg-teal-900 transition-colors"
        >
          <Upload className="h-4 w-4" />
          Analyze another report
        </button>
      </div>

      {/* Medical Safety Disclaimer */}
      <Disclaimer />
    </div>
  );
};
