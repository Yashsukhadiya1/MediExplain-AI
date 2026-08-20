import React from 'react';
import { Info } from 'lucide-react';

interface DisclaimerProps {
  className?: string;
  compact?: boolean;
}

export const Disclaimer: React.FC<DisclaimerProps> = ({ className = '', compact = false }) => {
  if (compact) {
    return (
      <div className={`flex items-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 ${className}`}>
        <Info className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-800 font-semibold">Important:</strong> MediExplain provides educational explanations of information contained in medical reports. It does not diagnose medical conditions, prescribe treatment, or replace professional medical advice. An out-of-range result does not by itself confirm a medical condition.
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5 ${className}`}>
      <div className="flex items-start gap-3">
        <Info className="h-5 w-5 text-teal-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Important Medical Notice
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            MediExplain provides educational explanations of information contained in medical reports. It does not diagnose medical conditions, prescribe treatment, or replace professional medical advice.
          </p>
          <p className="text-xs text-slate-500 pt-0.5">
            An out-of-range result does not by itself confirm a medical condition. Always discuss your test results with a qualified healthcare professional.
          </p>
        </div>
      </div>
    </div>
  );
};
