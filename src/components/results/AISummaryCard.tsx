import React from 'react';
import { Info, Sparkles } from 'lucide-react';
import { ReportData } from '../../types/report';

interface AISummaryCardProps {
  report: ReportData;
}

export const AISummaryCard: React.FC<AISummaryCardProps> = ({ report }) => {
  return (
    <div className="glass-card rounded-2xl border border-teal-100/80 p-6 sm:p-7 shadow-xl shadow-teal-950/5 space-y-5 text-left relative overflow-hidden">
      {/* Decorative top accent line */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 text-teal-700 border border-teal-200/60 shadow-2xs">
            <Sparkles className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">
            What should I look at?
          </h3>
        </div>

        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200/50">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
          AI Educational Synthesis
        </span>
      </div>

      <div className="space-y-4">
        <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal">
          {report.whatToLookAt || report.summary}
        </p>

        {report.summary && report.summary !== report.whatToLookAt && (
          <div className="rounded-xl bg-gradient-to-r from-teal-50/50 to-cyan-50/30 p-4.5 border border-teal-100/70 text-xs sm:text-sm text-slate-700 leading-relaxed shadow-2xs">
            <span className="font-bold text-slate-900 block mb-1 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-600" />
              Report Overview:
            </span>
            {report.summary}
          </div>
        )}
      </div>

      <div className="flex items-start gap-2.5 pt-3 text-xs text-slate-500 border-t border-slate-100">
        <Info className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
        <span>An out-of-range result does not by itself confirm a medical condition. Always discuss these findings with a qualified doctor.</span>
      </div>
    </div>
  );
};
