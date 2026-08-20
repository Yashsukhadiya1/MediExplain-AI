import React, { useState } from 'react';
import { FileText, Menu, X, Upload } from 'lucide-react';
import { PageView } from '../../types/report';

interface HeaderProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  onOpenHowItWorks?: () => void;
  onOpenAbout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  onOpenHowItWorks,
  onOpenAbout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white/95 backdrop-blur-xs">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 text-left focus:outline-none group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-800 text-white shadow-xs group-hover:bg-teal-900 transition-colors">
            <FileText className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-lg font-bold tracking-tight text-slate-900">
              MediExplain
            </span>
            <span className="text-[11px] text-slate-500 font-normal -mt-0.5">
              Understand your medical report
            </span>
          </div>
        </button>

        {/* Navigation Links */}
        <nav className="hidden items-center gap-6 sm:flex">
          <button
            onClick={() => {
              if (currentPage !== 'home') onNavigate('home');
              if (onOpenHowItWorks) onOpenHowItWorks();
            }}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            How it works
          </button>
          <button
            onClick={() => {
              if (currentPage !== 'home') onNavigate('home');
              if (onOpenAbout) onOpenAbout();
            }}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            About
          </button>
        </nav>

        {/* Action Button */}
        <div className="hidden sm:flex items-center gap-3">
          {currentPage !== 'upload' ? (
            <button
              onClick={() => onNavigate('upload')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-teal-800 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-teal-900 transition-colors"
            >
              <Upload className="h-4 w-4" />
              Analyze my report
            </button>
          ) : (
            <button
              onClick={() => onNavigate('home')}
              className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Back to Home
            </button>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 sm:hidden"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 py-3 sm:hidden">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
                if (onOpenHowItWorks) setTimeout(onOpenHowItWorks, 100);
              }}
              className="text-left py-1.5 text-sm font-medium text-slate-700"
            >
              How it works
            </button>
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
                if (onOpenAbout) setTimeout(onOpenAbout, 100);
              }}
              className="text-left py-1.5 text-sm font-medium text-slate-700"
            >
              About
            </button>
            <button
              onClick={() => {
                onNavigate('upload');
                setMobileMenuOpen(false);
              }}
              className="mt-1 flex items-center justify-center gap-1.5 rounded-lg bg-teal-800 py-2 text-sm font-semibold text-white"
            >
              <Upload className="h-4 w-4" />
              Analyze my report
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
