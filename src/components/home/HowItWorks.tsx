import React from 'react';
import { Upload, Cpu, BookOpen, Activity, Stethoscope, Sparkles, CheckCircle2 } from 'lucide-react';
import { PulseLine } from '../common/PulseLine';
import { RevealOnScroll } from '../common/RevealOnScroll';

const steps = [
  {
    number: '01',
    title: 'Upload your report',
    description: 'Simply upload your laboratory report as a PDF, JPG, or PNG document. Secure and processed instantly.',
    icon: Upload,
    color: 'from-teal-600 to-emerald-600',
    lightBg: 'bg-teal-50 text-teal-700',
  },
  {
    number: '02',
    title: 'Intelligent AI Analysis',
    description: 'MediExplain extracts numeric results, standard reference ranges, and organizes tests into clear diagnostic panels.',
    icon: Cpu,
    color: 'from-cyan-600 to-teal-600',
    lightBg: 'bg-cyan-50 text-cyan-700',
  },
  {
    number: '03',
    title: 'Clear Understanding',
    description: 'Explore results in plain language, read simple medical definitions, and get informed questions to ask your doctor.',
    icon: BookOpen,
    color: 'from-blue-600 to-cyan-600',
    lightBg: 'bg-blue-50 text-blue-700',
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
    <div id="how-it-works" className="relative space-y-16 py-14 overflow-hidden">
      
      {/* Decorative pulse line separator at the start of section */}
      <RevealOnScroll direction="zoom">
        <PulseLine variant="divider" />
      </RevealOnScroll>

      {/* 3-Step Section */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <RevealOnScroll direction="down">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-teal-800 border border-teal-200/80">
              <Sparkles className="h-3.5 w-3.5 text-teal-600" />
              How it works
            </span>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Simple 3-step report simplification
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              From confusing medical papers to clear, digestible health literacy in seconds.
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 relative">
          {/* Subtle connecting gradient line for desktop */}
          <div className="hidden sm:block absolute top-1/2 left-12 right-12 h-0.5 bg-gradient-to-r from-teal-200 via-cyan-200 to-blue-200 -z-10 transform -translate-y-6" />

          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <RevealOnScroll key={item.number} direction="up" delay={index * 150}>
                <div className="glass-card glass-card-hover rounded-2xl p-7 relative overflow-hidden group h-full flex flex-col justify-between">
                  {/* Top glowing line on hover */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-black bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent group-hover:text-teal-700 transition-colors">
                        {item.number}
                      </span>
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.lightBg} shadow-2xs group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>

                    <h3 className="mt-5 text-lg font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
                      {item.title}
                    </h3>

                    <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Micro indicator */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-teal-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Automated & Instant</span>
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </section>

      {/* What can MediExplain help you understand? */}
      <section className="relative bg-gradient-to-b from-slate-50/80 via-teal-50/20 to-slate-50/80 border-y border-teal-100/70 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <RevealOnScroll direction="down">
            <div className="text-left mb-10">
              <div className="flex items-center gap-2 text-teal-800">
                <Stethoscope className="h-5 w-5 text-teal-600" />
                <span className="text-xs font-bold uppercase tracking-wider">Broad Diagnostics Coverage</span>
              </div>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                What can MediExplain help you understand?
              </h2>
              <p className="mt-2 text-sm text-slate-600 max-w-2xl">
                MediExplain accurately parses and simplifies common outpatient laboratory and blood test reports with stated reference ranges.
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {testCategories.map((cat, idx) => (
              <RevealOnScroll key={idx} direction="up" delay={idx * 75}>
                <div className="glass-card glass-card-hover rounded-2xl p-4 sm:p-5 h-full group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-200">
                        <Activity className="h-4 w-4" />
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-teal-800 transition-colors">
                        {cat.name}
                      </h4>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-slate-700 block">
                    {cat.label}
                  </span>

                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    {cat.detail}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          <RevealOnScroll direction="up" delay={400}>
            <div className="mt-8 text-center">
              <p className="text-xs text-slate-500 italic max-w-xl mx-auto">
                * MediExplain works with a wide variety of formatted PDF and image lab reports containing standard reference ranges.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
};
