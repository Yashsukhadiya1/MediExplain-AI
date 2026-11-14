import React from 'react';
import { Upload, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { SamplePreview } from './SamplePreview';
import { PulseLine } from '../common/PulseLine';
import { RevealOnScroll } from '../common/RevealOnScroll';

interface HeroProps {
  onUploadClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onUploadClick }) => {
  return (
    <section className="relative pt-10 pb-16 sm:pt-16 sm:pb-24 overflow-hidden medical-mesh-bg border-b border-teal-100/60">
      {/* Decorative ambient glowing orbs */}
      <div className="absolute top-10 left-1/4 -z-10 h-72 w-72 rounded-full bg-teal-300/30 blur-3xl animate-blob pointer-events-none" />
      <div className="absolute top-24 right-1/4 -z-10 h-80 w-80 rounded-full bg-cyan-300/25 blur-3xl animate-blob animation-delay-2000 pointer-events-none" />
      <div className="absolute -bottom-10 left-1/2 -z-10 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl animate-blob animation-delay-4000 pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
          
          {/* Left Column (Content) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <RevealOnScroll direction="down" delay={100}>
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-50 to-cyan-50 px-3.5 py-1.5 text-xs font-semibold text-teal-800 border border-teal-200/80 shadow-2xs">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                </span>
                <ShieldCheck className="h-3.5 w-3.5 text-teal-700" />
                <span>Educational & Private Report Explanation</span>
              </div>
            </RevealOnScroll>

            <RevealOnScroll direction="up" delay={200}>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-5xl leading-tight sm:leading-tight">
                Understand your medical report. <br className="hidden sm:inline" />
                <span className="gradient-text-vibrant inline-flex items-center flex-wrap">
                  Without the jargon
                  <PulseLine variant="inline" />
                </span>
              </h1>
            </RevealOnScroll>

            <RevealOnScroll direction="up" delay={300}>
              <p className="text-base text-slate-600 sm:text-lg leading-relaxed max-w-xl">
                Upload a blood test or laboratory report and get a clear, educational explanation of the results in simple language with visual ranges and questions for your doctor.
              </p>
            </RevealOnScroll>

            <RevealOnScroll direction="up" delay={400}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                <button
                  onClick={onUploadClick}
                  className="btn-shimmer inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-teal-700/25 hover:shadow-xl hover:shadow-teal-700/35 hover:scale-[1.02] active:scale-95 transition-all duration-200"
                >
                  <Upload className="h-5 w-5" />
                  <span>Analyze my report</span>
                  <ArrowRight className="h-4 w-4 opacity-80" />
                </button>

                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium px-2 py-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  <span>Free • No login required</span>
                </div>
              </div>
            </RevealOnScroll>

            {/* Key benefits list with subtle animations */}
            <RevealOnScroll direction="up" delay={500}>
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/60 border border-white/80 shadow-2xs">
                  <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
                  <span>Clear reference ranges</span>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/60 border border-white/80 shadow-2xs">
                  <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
                  <span>Simple definitions</span>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/60 border border-white/80 shadow-2xs">
                  <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
                  <span>Doctor questions</span>
                </div>
              </div>
            </RevealOnScroll>
          </div>

          {/* Right Column: Interactive Sample Preview */}
          <div className="lg:col-span-5">
            <RevealOnScroll direction="left" delay={300}>
              <div className="animate-float">
                <SamplePreview />
              </div>
            </RevealOnScroll>
          </div>

        </div>
      </div>
    </section>
  );
};
