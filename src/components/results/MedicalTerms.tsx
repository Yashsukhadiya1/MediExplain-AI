import React from 'react';
import { BookOpen } from 'lucide-react';
import { MedicalTerm } from '../../types/report';

interface MedicalTermsProps {
  terms: MedicalTerm[];
}

export const MedicalTerms: React.FC<MedicalTermsProps> = ({ terms }) => {
  if (!terms || terms.length === 0) return null;

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-7 shadow-xl shadow-teal-950/5 border border-white/90 text-left">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
            <BookOpen className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">
            Medical terms used in this report
          </h3>
        </div>
        <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200/50">
          {terms.length} Definitions
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {terms.map((item, index) => (
          <div
            key={`${item.term}-${index}`}
            className="rounded-xl bg-slate-50/80 p-4 border border-slate-200/70 hover:border-teal-200 hover:bg-white transition-all shadow-2xs"
          >
            <span className="font-extrabold text-xs text-teal-900 block font-mono bg-teal-50/60 inline-block px-2 py-0.5 rounded-md border border-teal-200/60">
              {item.term}
            </span>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {item.definition}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
