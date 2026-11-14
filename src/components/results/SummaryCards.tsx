import React from 'react';
import { ReportData } from '../../types/report';
import { CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

interface SummaryCardsProps {
  report: ReportData;
  selectedFilter: string;
  onSelectFilter: (filter: string) => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  report,
  selectedFilter,
  onSelectFilter,
}) => {
  const cards = [
    {
      id: 'all',
      label: 'Tests analyzed',
      count: report.testsAnalyzed,
      detail: 'Total tests found in report',
      icon: FileText,
      accentColor: 'text-teal-700 bg-teal-50 border-teal-200/80',
      activeRing: 'ring-2 ring-teal-600 border-teal-500 bg-teal-50/40',
    },
    {
      id: 'within_range',
      label: 'Within range',
      count: report.withinRange,
      detail: 'Matches reference range',
      icon: CheckCircle2,
      accentColor: 'text-emerald-700 bg-emerald-50 border-emerald-200/80',
      activeRing: 'ring-2 ring-emerald-600 border-emerald-500 bg-emerald-50/40',
    },
    {
      id: 'needs_attention',
      label: 'Needs attention',
      count: report.needsAttention + (report.important || 0),
      detail: 'Outside reference range',
      icon: AlertTriangle,
      accentColor: 'text-amber-700 bg-amber-50 border-amber-200/80',
      activeRing: 'ring-2 ring-amber-600 border-amber-500 bg-amber-50/40',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4">
      {cards.map((card) => {
        const isSelected = selectedFilter === card.id;
        const Icon = card.icon;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectFilter(card.id)}
            className={`text-left rounded-xl sm:rounded-2xl border p-2.5 sm:p-5 transition-all duration-300 glass-card glass-card-hover group relative overflow-hidden ${
              isSelected ? card.activeRing : 'border-slate-200/80 bg-white/80'
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block truncate">
                {card.label}
              </span>
              <div className={`flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg sm:rounded-xl border ${card.accentColor} shadow-2xs group-hover:scale-110 transition-transform shrink-0`}>
                <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
              </div>
            </div>

            <span className="text-lg sm:text-3xl font-black tracking-tight text-slate-900 mt-1 sm:mt-2 block">
              {card.count}
            </span>

            <div className="flex items-center justify-between mt-1 sm:mt-1.5 pt-1.5 sm:pt-2 border-t border-slate-100">
              <span className="hidden sm:block text-xs text-slate-500 font-medium truncate">
                {card.detail}
              </span>
              <span className={`text-[9px] sm:text-[11px] font-bold ${isSelected ? 'text-teal-700 font-extrabold' : 'text-slate-400 group-hover:text-slate-600'} transition-colors truncate`}>
                {isSelected ? 'Active' : 'Filter'}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
