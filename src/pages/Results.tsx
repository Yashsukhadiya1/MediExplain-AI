import React, { useState } from 'react';
import { Calendar, Building2, FileText, ArrowLeft, Upload, Share2, Check, Stethoscope, HelpCircle, Sparkles, Bot } from 'lucide-react';
import { ReportData } from '../types/report';
import { SummaryCards } from '../components/results/SummaryCards';
import { AISummaryCard } from '../components/results/AISummaryCard';
import { ResultList } from '../components/results/ResultList';
import { ResultsChart } from '../components/results/ResultsChart';
import { MedicalTerms } from '../components/results/MedicalTerms';
import { ReportChat } from '../components/results/ReportChat';
import { Disclaimer } from '../components/common/Disclaimer';
import { RevealOnScroll } from '../components/common/RevealOnScroll';

interface ResultsProps {
  report: ReportData | null;
  onAnalyzeAnother: () => void;
}

export const Results: React.FC<ResultsProps> = ({ report, onAnalyzeAnother }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activeQuestionTarget, setActiveQuestionTarget] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // If no report analyzed yet
  if (!report) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="glass-card rounded-2xl p-8 sm:p-12 shadow-xl border border-white/90">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 mx-auto mb-4 border border-teal-200/60 shadow-2xs">
            <FileText className="h-7 w-7 text-teal-700" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            No report analyzed yet
          </h2>
          <p className="mt-2 text-sm text-slate-600 max-w-sm mx-auto">
            Upload a laboratory or medical report to see your structured explanation and results here.
          </p>
          <button
            onClick={onAnalyzeAnother}
            className="btn-shimmer mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-700 to-cyan-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-teal-700/25 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
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
    setIsChatOpen(true);
  };

  // Collect doctor questions and key observations from out-of-range results
  const outOfRangeResults = report.results.filter(
    (r) => r.status === 'needs_attention' || r.status === 'important' || r.status === 'above_range' || r.status === 'below_range'
  );

  const allDoctorQuestions = Array.from(
    new Set(report.results.flatMap((r) => r.questionsForDoctor || []))
  ).filter(Boolean);

  return (
    <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-8 text-left">
      {/* Background ambient orbs */}
      <div className="absolute top-10 right-10 -z-10 h-72 w-72 rounded-full bg-teal-400/15 blur-3xl pointer-events-none" />
      <div className="absolute top-96 left-10 -z-10 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl pointer-events-none" />

      {/* Top Banner */}
      <div className="glass-card rounded-2xl p-6 sm:p-7 shadow-xl shadow-teal-950/5 border border-white/90">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/60 inline-flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-cyan-600" />
                Report Analysis
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Your report, explained
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Educational explanation based on the findings detected in your uploaded report document.
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3.5">
              <span className="font-extrabold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">{report.reportTitle}</span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 font-medium">
                <Calendar className="h-3.5 w-3.5 text-teal-600" />
                Date: {report.reportDate}
              </span>
              {report.labName && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1 font-medium">
                    <Building2 className="h-3.5 w-3.5 text-teal-600" />
                    {report.labName}
                  </span>
                </>
              )}
              {report.fileName && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1 font-medium">
                    <FileText className="h-3.5 w-3.5 text-teal-600" />
                    {report.fileName}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Top Actions: Ask Assistant, Share, Analyze Another */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start">
            <button
              type="button"
              onClick={() => setIsChatOpen(true)}
              className="btn-shimmer inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-700 to-cyan-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-teal-700/20 hover:shadow-lg hover:scale-[1.02] transition-all active:scale-95"
            >
              <Bot className="h-4 w-4" />
              <span>Ask Assistant</span>
            </button>
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-2xs active:scale-95"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-teal-700" /> : <Share2 className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
            <button
              type="button"
              onClick={onAnalyzeAnother}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white/90 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-2xs active:scale-95"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Analyze another</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Interactive Filter Cards */}
      <RevealOnScroll direction="up">
        <SummaryCards
          report={report}
          selectedFilter={selectedFilter}
          onSelectFilter={setSelectedFilter}
        />
      </RevealOnScroll>

      {/* Report AI Overview & Summary */}
      <RevealOnScroll direction="up" delay={100}>
        <AISummaryCard report={report} />
      </RevealOnScroll>

      {/* Results at a glance & What do these results mean */}
      <RevealOnScroll direction="up" delay={150}>
        <ResultList
          results={report.results}
          selectedFilter={selectedFilter}
          onSelectFilter={setSelectedFilter}
          onAskAboutTest={handleAskAboutTest}
        />
      </RevealOnScroll>

      {/* Interactive Visual Distribution Chart */}
      <RevealOnScroll direction="up" delay={200}>
        <ResultsChart results={report.results} />
      </RevealOnScroll>

      {/* SECTION: Things worth discussing with your doctor */}
      <RevealOnScroll direction="up" delay={200}>
        <div className="glass-card rounded-2xl p-6 sm:p-7 shadow-xl shadow-teal-950/5 border border-white/90 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Stethoscope className="h-4 w-4" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                Things worth discussing with your doctor
              </h3>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
              {outOfRangeResults.length} Out-of-range
            </span>
          </div>

          {outOfRangeResults.length > 0 ? (
            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-slate-600">
                The following values were reported outside your laboratory's stated reference limits:
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                {outOfRangeResults.map((r, i) => (
                  <li key={i} className="rounded-xl bg-amber-50/50 p-3.5 border border-amber-200/70 hover:bg-amber-50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between font-bold text-slate-900 gap-1">
                      <span className="text-amber-950">{r.name}: <strong className="text-amber-800 font-black">{r.result} {r.unit}</strong></span>
                      <span className="text-xs text-slate-500 font-medium">Reference: {r.referenceRange}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 font-normal leading-relaxed">{r.explanation}</p>
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
      </RevealOnScroll>

      {/* SECTION: Questions you may want to ask */}
      {allDoctorQuestions.length > 0 && (
        <RevealOnScroll direction="up" delay={250}>
          <div className="glass-card rounded-2xl p-6 sm:p-7 shadow-xl shadow-teal-950/5 border border-white/90 space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <HelpCircle className="h-4 w-4" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                Questions you may want to ask your doctor
              </h3>
            </div>

            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
              {allDoctorQuestions.slice(0, 5).map((q, idx) => (
                <li key={idx} className="flex items-start gap-3 rounded-xl bg-teal-50/50 p-3 border border-teal-100/80 hover:bg-teal-50/80 transition-colors">
                  <span className="text-teal-600 font-black text-sm mt-0.5">•</span>
                  <span className="font-semibold text-slate-900">"{q}"</span>
                </li>
              ))}
            </ul>
          </div>
        </RevealOnScroll>
      )}

      {/* Medical Terms Glossary */}
      {report.medicalTerms && report.medicalTerms.length > 0 && (
        <RevealOnScroll direction="up" delay={300}>
          <MedicalTerms terms={report.medicalTerms} />
        </RevealOnScroll>
      )}

      {/* Action Button: Analyze another report */}
      <div className="pt-6 flex justify-center">
        <button
          type="button"
          onClick={onAnalyzeAnother}
          className="btn-shimmer inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-700 to-cyan-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-700/25 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Upload className="h-4 w-4" />
          Analyze another report
        </button>
      </div>

      {/* Medical Safety Disclaimer */}
      <Disclaimer />

      {/* Floating Action Button (FAB) at Bottom-Right */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setIsChatOpen(true)}
          className="btn-shimmer flex items-center gap-2.5 rounded-full bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 px-5 py-3.5 text-sm font-black text-white shadow-2xl shadow-teal-900/40 hover:shadow-teal-900/60 hover:scale-105 active:scale-95 transition-all duration-300 border border-white/40 group"
          title="Open MediExplain AI Assistant"
        >
          <div className="relative flex h-5 w-5 items-center justify-center">
            <Bot className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
          </div>
          <span className="hidden sm:inline">Ask AI Assistant</span>
          <span className="sm:hidden">Ask AI</span>
        </button>
      </div>

      {/* Slide-over Resizable Right Chat Assistant */}
      <ReportChat
        report={report}
        initialQuestion={activeQuestionTarget}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
};
