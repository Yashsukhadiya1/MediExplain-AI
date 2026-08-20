import React, { useEffect, useState } from 'react';
import { Check, Loader2, Circle } from 'lucide-react';

interface AnalysisLoaderProps {
  fileName?: string;
}

const STEPS = [
  { id: 1, label: 'Reading your report...' },
  { id: 2, label: 'Extracting the results...' },
  { id: 3, label: 'Preparing your explanation...' },
];

export const AnalysisLoader: React.FC<AnalysisLoaderProps> = ({
  fileName = 'medical_report.pdf',
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  // Advance steps smoothly while backend completes
  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(2), 1500);
    const timer2 = setTimeout(() => setCurrentStep(3), 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="mx-auto max-w-md py-12 px-4 text-left">
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-teal-800 shrink-0" />
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {STEPS.find((s) => s.id === currentStep)?.label || 'Analyzing report...'}
            </h2>
            <p className="text-xs text-slate-500">
              This usually takes 5-10 seconds.
            </p>
          </div>
        </div>

        {fileName && (
          <div className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600 truncate border border-slate-200/80">
            Document: <span className="font-semibold text-slate-800">{fileName}</span>
          </div>
        )}

        <div className="mt-6 space-y-3 border-t border-slate-100 pt-5">
          {STEPS.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 text-xs sm:text-sm ${
                  isCurrent
                    ? 'text-slate-900 font-bold'
                    : isCompleted
                    ? 'text-slate-700'
                    : 'text-slate-400'
                }`}
              >
                <div className="shrink-0">
                  {isCompleted ? (
                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-teal-800 text-white">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                  ) : isCurrent ? (
                    <div className="flex h-4 w-4 items-center justify-center">
                      <span className="h-2 w-2 rounded-full bg-teal-800 animate-pulse" />
                    </div>
                  ) : (
                    <Circle className="h-4 w-4 text-slate-300" />
                  )}
                </div>
                <span>{step.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
