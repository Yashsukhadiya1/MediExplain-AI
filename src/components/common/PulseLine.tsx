import React from 'react';

interface PulseLineProps {
  className?: string;
  variant?: 'divider' | 'inline' | 'compact';
  animated?: boolean;
}

export const PulseLine: React.FC<PulseLineProps> = ({
  className = '',
  variant = 'divider',
  animated = true,
}) => {
  if (variant === 'inline') {
    return (
      <span className={`inline-flex items-center align-middle mx-2 ${className}`}>
        <svg
          className="w-16 h-5 overflow-visible"
          viewBox="0 0 100 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 12 L25 12 L32 4 L38 20 L45 2 L52 16 L56 12 L100 12"
            stroke="url(#inline-ecg-gradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={animated ? 'animate-ecg' : ''}
          />
          <circle
            cx="45"
            cy="2"
            r="3"
            fill="#14b8a6"
            className="animate-ping origin-center"
            style={{ transformOrigin: '45px 2px' }}
          />
          <defs>
            <linearGradient id="inline-ecg-gradient" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#10b981" />
              <stop offset="0.5" stopColor="#06b6d4" />
              <stop offset="1" stopColor="#0d9488" />
            </linearGradient>
          </defs>
        </svg>
      </span>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`relative flex items-center justify-center overflow-hidden py-1 ${className}`}>
        <svg
          className="w-full max-w-[200px] h-6 overflow-visible"
          viewBox="0 0 200 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 15 L50 15 L62 7 L72 23 L85 2 L98 25 L106 15 L200 15"
            stroke="url(#compact-ecg-gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={animated ? 'animate-ecg' : ''}
          />
          <circle
            cx="85"
            cy="2"
            r="3"
            fill="#06b6d4"
            className="animate-pulse"
          />
          <defs>
            <linearGradient id="compact-ecg-gradient" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#34d399" />
              <stop offset="0.5" stopColor="#06b6d4" />
              <stop offset="1" stopColor="#0d9488" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // Full-width divider variant with pulsing heart nodes
  return (
    <div className={`relative w-full flex items-center justify-center py-6 overflow-hidden ${className}`}>
      {/* Background ambient glow line */}
      <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-teal-300/40 to-transparent" />

      {/* Center Waveform Graph */}
      <div className="relative z-10 flex items-center gap-3 px-6 py-1.5 rounded-full glass-card border border-teal-100 shadow-xs">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
        </span>

        <svg
          className="w-36 sm:w-48 h-7 overflow-visible"
          viewBox="0 0 200 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 15 L50 15 L62 6 L72 24 L85 2 L98 26 L108 15 L200 15"
            stroke="url(#divider-ecg-gradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={animated ? 'animate-ecg' : ''}
          />
          <circle
            cx="85"
            cy="2"
            r="3.5"
            fill="#0d9488"
            className="animate-ping"
            style={{ transformOrigin: '85px 2px' }}
          />
          <defs>
            <linearGradient id="divider-ecg-gradient" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#10b981" />
              <stop offset="0.4" stopColor="#14b8a6" />
              <stop offset="0.8" stopColor="#06b6d4" />
              <stop offset="1" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>

        <span className="text-[11px] font-semibold text-teal-800 tracking-wider uppercase hidden sm:inline">
          Live Medical AI
        </span>
      </div>
    </div>
  );
};
