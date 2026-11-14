import React from 'react';
import { Activity, ShieldCheck, Heart } from 'lucide-react';
import { PageView } from '../../types/report';
import { PulseLine } from './PulseLine';

interface FooterProps {
  onNavigate?: (page: PageView) => void;
  onOpenHowItWorks?: () => void;
  onOpenAbout?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenHowItWorks,
  onOpenAbout,
}) => {
  return (
    <footer className="mt-20 border-t border-teal-100/70 bg-gradient-to-b from-white via-slate-50/60 to-teal-50/20 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        
        {/* Subtle decorative pulse line */}
        <PulseLine variant="compact" className="mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-left">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-700 to-cyan-600 text-white shadow-xs">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-base">MediExplain</span>
              <span className="text-xs text-slate-500 block font-medium">Making medical reports clearer and easier to understand.</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-600">
            <button
              onClick={() => {
                if (onNavigate) onNavigate('home');
                if (onOpenHowItWorks) onOpenHowItWorks();
              }}
              className="hover:text-teal-700 transition-colors"
            >
              How it works
            </button>
            <button
              onClick={() => {
                if (onNavigate) onNavigate('home');
                if (onOpenAbout) onOpenAbout();
              }}
              className="hover:text-teal-700 transition-colors"
            >
              About
            </button>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 flex items-center gap-1 font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
              Educational use only
            </span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200/60 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} MediExplain. Designed for medical literacy and clarity.</p>
          <p className="font-semibold text-slate-700 flex items-center gap-1">
            Developed with <Heart className="h-3 w-3 text-coral-500 fill-coral-500 inline" /> by <span className="text-teal-800 font-bold">Yash Sukhadiya</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
