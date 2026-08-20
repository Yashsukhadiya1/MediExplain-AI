import React from 'react';
import { Upload, Cpu, BookOpen, Activity, Stethoscope } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Upload',
    description: 'Upload your PDF or image report.',
    icon: Upload,
  },
  {
    number: '02',
    title: 'Analyze',
    description: 'MediExplain organizes the information and explains it.',
    icon: Cpu,
  },
  {
    number: '03',
    title: 'Understand',
    description: 'See the important results in plain language.',
    icon: BookOpen,
  },
];

const testCategories = [
  { name: 'CBC', label: 'Complete Blood Count', detail: 'Hemoglobin, WBC, Platelets, RBC' },
  { name: 'Blood Glucose', label: 'Diabetes & Sugar Tests', detail: 'Fasting Glucose, HbA1c, PPBS' },
  { name: 'Lipid Profile', label: 'Cholesterol & Heart Health', detail: 'Total Cholesterol, HDL, LDL, Triglycerides' },
  { name: 'Liver Function Tests', label: 'LFT Panel', detail: 'ALT, AST, Bilirubin, ALP, Albumin' },
  { name: 'Kidney Function Tests', label: 'KFT Panel', detail: 'Creatinine, Urea, BUN, eGFR' },
  { name: 'Thyroid Tests', label: 'Thyroid Panel', detail: 'TSH, Free T3, Free T4' },
  { name: 'Other Lab Reports', label: 'General Diagnostics', detail: 'Vitamins, Electrolytes, Urine analysis & more' },
];

export const HowItWorks: React.FC = () => {
  return (
    <div id="how-it-works" className="space-y-12 py-12">
      {/* 3-Step Section */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
            How it works
          </span>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Simple 3-step report simplification
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.number}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-extrabold text-teal-800">{item.number}</span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-800">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* What can MediExplain help you understand? */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-left mb-8">
            <div className="flex items-center gap-2 text-teal-800">
              <Stethoscope className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Capabilities</span>
            </div>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              What can MediExplain help you understand?
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              MediExplain can parse and simplify common outpatient laboratory and blood test reports.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {testCategories.map((cat, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="h-4 w-4 text-teal-700 shrink-0" />
                  <h4 className="text-sm font-bold text-slate-900">{cat.name}</h4>
                </div>
                <span className="text-xs font-medium text-slate-700 block">{cat.label}</span>
                <p className="text-[11px] text-slate-500 mt-1">{cat.detail}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs text-slate-500 text-center italic">
            * MediExplain works with a wide variety of formatted PDF and image lab reports containing standard reference ranges.
          </p>
        </div>
      </section>
    </div>
  );
};
