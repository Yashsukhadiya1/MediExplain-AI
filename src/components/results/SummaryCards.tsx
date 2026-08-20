import React from 'react';
import { ReportData } from '../../types/report';

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
    },
    {
      id: 'within_range',
      label: 'Within range',
      count: report.withinRange,
      detail: 'Matches reference range',
    },
    {
      id: 'needs_attention',
      label: 'Needs attention',
      count: report.needsAttention + (report.important || 0),
      detail: 'Outside reference range',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card) => {
        const isSelected = selectedFilter === card.id;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectFilter(card.id)}
            className={`text-left rounded-xl border p-4 transition-colors ${
              isSelected
                ? 'border-teal-700 bg-teal-50/40 ring-1 ring-teal-700'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <span className="text-xs font-semibold text-slate-500 block">
              {card.label}
            </span>
            <span className="text-2xl font-bold tracking-tight text-slate-900 mt-1 block">
              {card.count}
            </span>
            <span className="text-xs text-slate-500 mt-0.5 block">
              {card.detail}
            </span>
          </button>
        );
      })}
    </div>
  );
};
