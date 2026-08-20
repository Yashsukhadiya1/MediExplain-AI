import React from 'react';

export const SamplePreview: React.FC = () => {
  return (
    <div className="w-full max-w-md mx-auto rounded-xl border border-slate-300 bg-white p-5 shadow-xs">
      <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Sample Illustration</span>
          <h4 className="text-sm font-bold text-slate-900">Blood Test Report</h4>
        </div>
        <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
          Lab Document
        </span>
      </div>

      <div className="mt-4 space-y-3 font-mono text-xs">
        {/* Row 1 */}
        <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-2.5">
          <div className="flex justify-between font-bold text-slate-900">
            <span>Hemoglobin</span>
            <span className="text-amber-800 font-bold">10.2 g/dL</span>
          </div>
          <div className="flex justify-between text-slate-500 text-[11px] mt-0.5">
            <span>Reference</span>
            <span>12.0 – 16.0 g/dL</span>
          </div>
        </div>

        {/* Row 2 */}
        <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-2.5">
          <div className="flex justify-between font-bold text-slate-900">
            <span>Vitamin D</span>
            <span className="text-amber-800 font-bold">21 ng/mL</span>
          </div>
          <div className="flex justify-between text-slate-500 text-[11px] mt-0.5">
            <span>Reference</span>
            <span>30 – 100 ng/mL</span>
          </div>
        </div>

        {/* Row 3 */}
        <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-2.5">
          <div className="flex justify-between font-bold text-slate-900">
            <span>White Blood Cells</span>
            <span className="text-emerald-700 font-bold">7,200 /µL</span>
          </div>
          <div className="flex justify-between text-slate-500 text-[11px] mt-0.5">
            <span>Reference</span>
            <span>4,000 – 11,000 /µL</span>
          </div>
        </div>
      </div>

      <p className="mt-3 text-[11px] text-slate-400 text-center">
        *Visual example of laboratory format. Upload your actual report for analysis.
      </p>
    </div>
  );
};
