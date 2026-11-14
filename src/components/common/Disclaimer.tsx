import React from 'react';
import { Info, ShieldAlert } from 'lucide-react';

interface DisclaimerProps {
  className?: string;
  compact?: boolean;
}

export const Disclaimer: React.FC<DisclaimerProps> = ({ className = '', compact = false }) => {
  if (compact) {
    return (
      <div className={`flex items-start gap-3 rounded-xl border border-slate-200/90 bg-white/70 backdrop-blur-md p-3.5 text-xs text-slate-600 shadow-2xs ${className}`}>
        <Info className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-800 font-bold">Important:</strong> MediExplain provides educational explanations of information contained in medical reports. It does not diagnose medical conditions, prescribe treatment, or replace professional medical advice. An out-of-range result does not by itself confirm a medical condition.
        </p>
      </div>
    );
  }

  return (
    <div className={`glass-card rounded-2xl p-5 sm:p-6 border border-teal-100/80 shadow-xs text-left ${className}`}>
      <div className="flex items-start gap-3.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700 shrink-0 mt-0.5 border border-teal-200/60 shadow-2xs">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
            Important Medical Notice & Safety
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            MediExplain provides educational explanations of information contained in medical reports. It does not diagnose medical conditions, prescribe treatment, or replace professional medical advice.
          </p>
          <p className="text-xs text-slate-500 pt-0.5 leading-relaxed">
            An out-of-range result does not by itself confirm a medical condition. Always discuss your laboratory test results with a qualified healthcare professional.
          </p>
        </div>
      </div>
    </div>
  );
};
