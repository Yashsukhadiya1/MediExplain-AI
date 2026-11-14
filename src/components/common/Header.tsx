import React, { useState } from 'react';
import { Menu, X, Upload, Activity, Sparkles } from 'lucide-react';
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
    <header className="sticky top-0 z-40 w-full border-b border-teal-100/60 bg-white/85 backdrop-blur-md shadow-xs transition-all duration-200">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo & Name */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 text-left focus:outline-hidden group"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-700 via-teal-600 to-cyan-600 text-white shadow-md shadow-teal-500/20 group-hover:scale-105 group-hover:shadow-teal-500/30 transition-all duration-300">
            <Activity className="h-5 w-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-sans text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-teal-950 to-cyan-900 bg-clip-text text-transparent">
                MediExplain
              </span>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-gradient-to-r from-teal-50 to-cyan-50 px-1.5 py-0.5 text-[10px] font-bold text-teal-700 border border-teal-200/60">
                <Sparkles className="h-2.5 w-2.5 text-cyan-600" />
                AI
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium -mt-0.5">
              Understand your medical report
            </span>
          </div>
        </button>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden items-center gap-8 sm:flex">
          <button
            onClick={() => {
              if (currentPage !== 'home') onNavigate('home');
              if (onOpenHowItWorks) onOpenHowItWorks();
            }}
            className="text-sm font-semibold text-slate-600 hover:text-teal-700 transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-teal-600 after:transition-all after:duration-200"
          >
            How it works
          </button>
          <button
            onClick={() => {
              if (currentPage !== 'home') onNavigate('home');
              if (onOpenAbout) onOpenAbout();
            }}
            className="text-sm font-semibold text-slate-600 hover:text-teal-700 transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-teal-600 after:transition-all after:duration-200"
          >
            About
          </button>
        </nav>

        {/* Action Button (Desktop) */}
        <div className="hidden sm:flex items-center gap-3">
          {currentPage !== 'upload' ? (
            <button
              onClick={() => onNavigate('upload')}
              className="btn-shimmer inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-600/20 hover:shadow-lg hover:shadow-teal-600/30 hover:scale-[1.02] active:scale-95 transition-all duration-200"
            >
              <Upload className="h-4 w-4" />
              Analyze my report
            </button>
          ) : (
            <button
              onClick={() => onNavigate('home')}
              className="rounded-xl border border-slate-200 bg-white/80 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-2xs active:scale-95"
            >
              Back to Home
            </button>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-teal-100 bg-teal-50/50 text-slate-700 hover:bg-teal-100/60 transition-colors sm:hidden focus:outline-hidden"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X className="h-5 w-5 text-teal-800" /> : <Menu className="h-5 w-5 text-teal-800" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown with slide animation */}
      {mobileMenuOpen && (
        <div className="border-b border-teal-100 bg-white/95 backdrop-blur-xl px-5 py-4 sm:hidden animate-in fade-in slide-in-from-top-2 duration-200 shadow-xl">
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
                if (onOpenHowItWorks) setTimeout(onOpenHowItWorks, 100);
              }}
              className="text-left py-2 text-sm font-semibold text-slate-700 hover:text-teal-700 transition-colors"
            >
              How it works
            </button>
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
                if (onOpenAbout) setTimeout(onOpenAbout, 100);
              }}
              className="text-left py-2 text-sm font-semibold text-slate-700 hover:text-teal-700 transition-colors"
            >
              About
            </button>
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  onNavigate('upload');
                  setMobileMenuOpen(false);
                }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-700 to-cyan-600 py-3 text-sm font-semibold text-white shadow-md shadow-teal-600/20"
              >
                <Upload className="h-4 w-4" />
                Analyze my report
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
