import React from 'react';
import { Info } from 'lucide-react';
import { ReportData } from '../../types/report';

interface AISummaryCardProps {
  report: ReportData;
}

export const AISummaryCard: React.FC<AISummaryCardProps> = ({ report }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
          What should I look at?
        </h3>
        <p className="mt-2 text-sm sm:text-base text-slate-700 leading-relaxed">
          {report.whatToLookAt || report.summary}
        </p>
      </div>

      {report.summary && report.summary !== report.whatToLookAt && (
        <div className="rounded-lg bg-slate-50 p-4 border border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <span className="font-semibold text-slate-800 block mb-1">Report Overview:</span>
          {report.summary}
        </div>
      )}

      <div className="flex items-start gap-2 pt-2 text-xs text-slate-500 border-t border-slate-100">
        <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
        <span>An out-of-range result does not by itself confirm a medical condition. Always discuss these findings with a qualified doctor.</span>
      </div>
    </div>
  );
};
