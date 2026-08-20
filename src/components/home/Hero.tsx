import React from 'react';
import { Upload, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { SamplePreview } from './SamplePreview';

interface HeroProps {
  onUploadClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onUploadClick }) => {
  return (
    <section className="pt-8 pb-12 sm:pt-12 sm:pb-16 bg-white border-b border-slate-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left column */}
          <div className="lg:col-span-7 space-y-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800 border border-teal-200">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-700" />
              Educational & Private Report Explanation
            </span>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-tight">
              Understand your medical report. <br className="hidden sm:inline" />
              <span className="text-teal-800 font-extrabold">Without the medical jargon.</span>
            </h1>

            <p className="text-base text-slate-600 sm:text-lg leading-relaxed max-w-xl">
              Upload a blood test or laboratory report and get a clear, educational explanation of the results in simple language.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
              <button
                onClick={onUploadClick}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-800 px-6 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-teal-900 transition-colors"
              >
                <Upload className="h-5 w-5" />
                Analyze my report
              </button>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              No account required • Your report is processed for this analysis
            </p>

            {/* Key benefits */}
            <div className="pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-teal-700 shrink-0" />
                <span>Clear reference ranges</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-teal-700 shrink-0" />
                <span>Simple definitions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-teal-700 shrink-0" />
                <span>Doctor discussion questions</span>
              </div>
            </div>
          </div>

          {/* Right column: Visual representation of a medical report */}
          <div className="lg:col-span-5">
            <SamplePreview />
          </div>
        </div>
      </div>
    </section>
  );
};
