import React from 'react';
import { BookOpen } from 'lucide-react';
import { MedicalTerm } from '../../types/report';

interface MedicalTermsProps {
  terms: MedicalTerm[];
}

export const MedicalTerms: React.FC<MedicalTermsProps> = ({ terms }) => {
  if (!terms || terms.length === 0) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <BookOpen className="h-4 w-4 text-teal-700" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
          Medical terms used in this report
        </h3>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {terms.map((item, index) => (
          <div
            key={`${item.term}-${index}`}
            className="rounded-lg bg-slate-50 p-3.5 border border-slate-100"
          >
            <span className="font-bold text-xs text-slate-900 block font-mono">
              {item.term}
            </span>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              {item.definition}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
