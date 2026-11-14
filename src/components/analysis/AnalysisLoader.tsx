import React, { useEffect, useState } from 'react';
import { Check, Loader2, Activity, FileText, Sparkles } from 'lucide-react';
import { PulseLine } from '../common/PulseLine';

interface AnalysisLoaderProps {
  fileName?: string;
}

const STEPS = [
  { id: 1, label: 'Reading your report...' },
  { id: 2, label: 'Extracting the results & reference ranges...' },
  { id: 3, label: 'Structuring educational explanation...' },
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
    <div className="relative mx-auto max-w-md py-14 px-4 text-left">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-72 w-72 rounded-full bg-teal-400/20 blur-3xl pointer-events-none" />

      <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-xl shadow-teal-950/10 border border-white/90">
        
        {/* Animated Scanner Ring Header */}
        <div className="flex items-center gap-4">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-600 to-cyan-500 text-white shadow-md shadow-teal-600/30 shrink-0">
            <Activity className="h-6 w-6 animate-pulse" />
            <span className="absolute -inset-1 rounded-2xl border-2 border-teal-400/40 animate-ping opacity-50" />
          </div>

          <div>
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-1.5">
              <span>{STEPS.find((s) => s.id === currentStep)?.label || 'Analyzing report...'}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-cyan-600" />
              <span>AI processing • Usually takes 5-10 seconds</span>
            </p>
          </div>
        </div>

        {/* Live Pulse Waveform line */}
        <div className="my-4 py-1">
          <PulseLine variant="compact" />
        </div>

        {fileName && (
          <div className="rounded-xl bg-slate-50/90 px-3.5 py-2.5 text-xs text-slate-600 truncate border border-slate-200/80 flex items-center gap-2">
            <FileText className="h-4 w-4 text-teal-700 shrink-0" />
            <span className="truncate">
              Document: <span className="font-bold text-slate-800">{fileName}</span>
            </span>
          </div>
        )}

        {/* Progress Steps Checklist */}
        <div className="mt-6 space-y-3.5 border-t border-slate-100 pt-5">
          {STEPS.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 text-xs sm:text-sm font-medium transition-all duration-300 ${
                  isCurrent
                    ? 'text-teal-900 font-bold scale-[1.01]'
                    : isCompleted
                    ? 'text-slate-700'
                    : 'text-slate-400'
                }`}
              >
                {isCompleted ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </div>
                ) : isCurrent ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                    <Loader2 className="h-4 w-4 animate-spin text-teal-700" />
                  </div>
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-slate-200 bg-white" />
                )}

                <span className="flex-1">{step.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
