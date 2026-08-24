import React from 'react';
import { FileText } from 'lucide-react';
import { PageView } from '../../types/report';

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
    <footer className="mt-16 border-t border-slate-200 bg-white py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-left">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-teal-700 text-white">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm">MediExplain</span>
              <span className="text-xs text-slate-500 block">Making medical reports easier to understand.</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600">
            <button
              onClick={() => {
                if (onNavigate) onNavigate('home');
                if (onOpenHowItWorks) onOpenHowItWorks();
              }}
              className="hover:text-slate-900 transition-colors"
            >
              How it works
            </button>
            <button
              onClick={() => {
                if (onNavigate) onNavigate('home');
                if (onOpenAbout) onOpenAbout();
              }}
              className="hover:text-slate-900 transition-colors"
            >
              About
            </button>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500">Educational use only</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} MediExplain. Developed by Yash Sukhadiya. Designed for medical literacy and clarity.</p>
        </div>
      </div>
    </footer>
  );
};
