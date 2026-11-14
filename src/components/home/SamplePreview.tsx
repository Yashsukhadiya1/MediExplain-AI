import React from 'react';
import { Activity, ShieldCheck } from 'lucide-react';
import { PulseLine } from '../common/PulseLine';

export const SamplePreview: React.FC = () => {
  return (
    <div className="relative w-full max-w-md mx-auto group">
      {/* Ambient background glow behind card */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-teal-500/30 via-cyan-500/30 to-emerald-500/30 blur-xl opacity-70 group-hover:opacity-100 transition duration-500 animate-pulse-slow" />

      {/* Main Glass Card */}
      <div className="relative rounded-2xl border border-white/80 bg-white/90 backdrop-blur-xl p-5 sm:p-6 shadow-xl shadow-teal-900/5 transition-all duration-300">
        
        {/* Header with Live Status & Icon */}
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-700 border border-teal-200/60 shadow-2xs">
              <Activity className="h-4 w-4 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 flex items-center gap-1">
                Sample Illustration
              </span>
              <h4 className="text-sm font-extrabold text-slate-900">Blood Test Report</h4>
            </div>
          </div>
          
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 bg-teal-50/80 px-2.5 py-1 rounded-full border border-teal-200/50">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-ping" />
            Lab Document
          </span>
        </div>

        {/* Mini ECG Heartbeat line graph right inside sample card */}
        <div className="my-2 py-1">
          <PulseLine variant="compact" />
        </div>

        {/* Results List */}
        <div className="space-y-2.5 font-sans text-xs">
          {/* Row 1: Hemoglobin */}
          <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-3 hover:bg-amber-50 transition-colors">
            <div className="flex justify-between items-center font-bold text-slate-900">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Hemoglobin
              </span>
              <span className="text-amber-800 font-extrabold bg-amber-100/80 px-2 py-0.5 rounded-md text-xs">
                10.2 g/dL
              </span>
            </div>
            <div className="flex justify-between text-slate-500 text-[11px] mt-1.5">
              <span>Standard Range</span>
              <span className="font-medium text-slate-700">12.0 – 16.0 g/dL</span>
            </div>
            {/* Visual range bar */}
            <div className="mt-2 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full transition-all duration-1000" style={{ width: '42%' }}></div>
            </div>
          </div>

          {/* Row 2: Vitamin D */}
          <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-3 hover:bg-amber-50 transition-colors">
            <div className="flex justify-between items-center font-bold text-slate-900">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Vitamin D
              </span>
              <span className="text-amber-800 font-extrabold bg-amber-100/80 px-2 py-0.5 rounded-md text-xs">
                21 ng/mL
              </span>
            </div>
            <div className="flex justify-between text-slate-500 text-[11px] mt-1.5">
              <span>Standard Range</span>
              <span className="font-medium text-slate-700">30 – 100 ng/mL</span>
            </div>
            {/* Visual range bar */}
            <div className="mt-2 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full transition-all duration-1000" style={{ width: '30%' }}></div>
            </div>
          </div>

          {/* Row 3: White Blood Cells */}
          <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-3 hover:bg-emerald-50 transition-colors">
            <div className="flex justify-between items-center font-bold text-slate-900">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                White Blood Cells
              </span>
              <span className="text-emerald-800 font-extrabold bg-emerald-100/80 px-2 py-0.5 rounded-md text-xs">
                7,200 /µL
              </span>
            </div>
            <div className="flex justify-between text-slate-500 text-[11px] mt-1.5">
              <span>Standard Range</span>
              <span className="font-medium text-slate-700">4,000 – 11,000 /µL</span>
            </div>
            {/* Visual range bar */}
            <div className="mt-2 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>

        {/* Footer info note */}
        <p className="mt-3.5 text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
          <span>Visual example of laboratory format. Upload your actual report for analysis.</span>
        </p>
      </div>
    </div>
  );
};
