import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, HelpCircle, MessageSquare, Activity } from 'lucide-react';
import { TestResult } from '../../types/report';
import { getStatusDetails } from '../../utils/reportUtils';

interface ResultListProps {
  results: TestResult[];
  selectedFilter: string;
  onSelectFilter: (filter: string) => void;
  onAskAboutTest?: (testName: string) => void;
}

export const ResultList: React.FC<ResultListProps> = ({
  results,
  selectedFilter,
  onSelectFilter,
  onAskAboutTest,
}) => {
  const [expandedTests, setExpandedTests] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const toggleExpand = (testName: string) => {
    setExpandedTests((prev) => ({
      ...prev,
      [testName]: !prev[testName],
    }));
  };

  const filteredResults = results.filter((test) => {
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'within_range') return test.status === 'within_range';
    if (selectedFilter === 'needs_attention') {
      return test.status === 'needs_attention' || test.status === 'important' || test.status === 'above_range' || test.status === 'below_range';
    }
    if (selectedFilter === 'reference_unavailable') {
      return test.status === 'reference_unavailable';
    }
    return true;
  });

  return (
    <div className="space-y-8 text-left">
      {/* SECTION 1: RESULTS AT A GLANCE (TABLE) */}
      <div className="glass-card rounded-2xl p-5 sm:p-7 shadow-xl shadow-teal-950/5 border border-white/90 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <Activity className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">
                Results at a glance
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Summary table of tests detected in your report and stated lab reference ranges.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search tests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-xl border border-slate-200/90 bg-white/80 pl-9 pr-3.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden transition-all"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={() => onSelectFilter('all')}
                className={`rounded-xl px-3 py-1.5 font-bold transition-all ${
                  selectedFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({results.length})
              </button>
              <button
                onClick={() => onSelectFilter('needs_attention')}
                className={`rounded-xl px-3 py-1.5 font-bold transition-all ${
                  selectedFilter === 'needs_attention'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-amber-50 text-amber-900 hover:bg-amber-100/80 border border-amber-200/60'
                }`}
              >
                Outside range
              </button>
              <button
                onClick={() => onSelectFilter('within_range')}
                className={`rounded-xl px-3 py-1.5 font-bold transition-all ${
                  selectedFilter === 'within_range'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100/80 border border-emerald-200/60'
                }`}
              >
                Within range
              </button>
            </div>
          </div>
        </div>

        {/* Clean Modern Results Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white/60">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Test</th>
                <th className="py-3 px-4">Your result</th>
                <th className="py-3 px-4">Reference range</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-xs text-slate-500">
                    No test results matching this filter.
                  </td>
                </tr>
              ) : (
                filteredResults.map((test, index) => {
                  const statusInfo = getStatusDetails(test.status);
                  return (
                    <tr key={`row-${index}`} className="hover:bg-teal-50/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {test.name}
                      </td>
                      <td className="py-3.5 px-4 font-black text-slate-900">
                        {test.result} <span className="font-normal text-slate-500 text-xs">{test.unit}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {test.referenceRange} {test.unit && test.referenceRange !== 'Reference range unavailable' ? test.unit : ''}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold border ${statusInfo.badgeBg} shadow-2xs`}>
                          <span>{statusInfo.symbol}</span>
                          <span>{statusInfo.label}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: WHAT DO THESE RESULTS MEAN? */}
      <div className="space-y-4">
        <div className="border-b border-slate-200/80 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">
              What do these results mean?
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Clear, educational explanations of individual test items.
            </p>
          </div>
          <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200/60">
            {filteredResults.length} Tests
          </span>
        </div>

        <div className="space-y-3.5">
          {filteredResults.map((test, index) => {
            const isExpanded = !!expandedTests[test.name];
            const statusInfo = getStatusDetails(test.status);

            return (
              <div
                key={`card-${test.name}-${index}`}
                className="glass-card rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-teal-200 transition-all duration-200 border border-white/90"
              >
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-extrabold text-slate-900">
                        {test.name}
                      </h4>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold border ${statusInfo.badgeBg} shadow-2xs`}>
                        <span>{statusInfo.symbol}</span>
                        <span>{statusInfo.label}</span>
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                      <span>
                        Result: <strong className="text-slate-900 font-extrabold">{test.result} {test.unit}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Reference range: <span className="font-semibold text-slate-700">{test.referenceRange} {test.unit && test.referenceRange !== 'Reference range unavailable' ? test.unit : ''}</span>
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleExpand(test.name)}
                    className="inline-flex items-center gap-1.5 self-start rounded-xl border border-slate-200 bg-white/90 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-2xs active:scale-95"
                  >
                    <span>{isExpanded ? 'Hide details' : 'Learn more'}</span>
                    {isExpanded ? <ChevronUp className="h-3.5 w-3.5 text-teal-700" /> : <ChevronDown className="h-3.5 w-3.5 text-teal-700" />}
                  </button>
                </div>

                {/* Simple explanation & Why it matters */}
                <div className="mt-3.5 text-xs sm:text-sm text-slate-700 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/70 space-y-1.5">
                  <p>
                    <strong className="text-slate-900 font-bold">Simple explanation: </strong>
                    {test.explanation}
                  </p>
                  {test.whatIsThisTest && (
                    <p className="text-xs text-slate-600 pt-0.5">
                      <strong className="text-slate-800 font-semibold">What it measures: </strong>
                      {test.whatIsThisTest}
                    </p>
                  )}
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-4 text-xs sm:text-sm animate-in fade-in duration-200">
                    {test.questionsForDoctor && test.questionsForDoctor.length > 0 && (
                      <div className="rounded-xl bg-teal-50/70 border border-teal-200/80 p-4 shadow-2xs">
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-900 mb-2.5">
                          <HelpCircle className="h-4 w-4 text-teal-700" />
                          Questions you could ask your doctor
                        </div>
                        <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                          {test.questionsForDoctor.map((q, qIdx) => (
                            <li key={qIdx} className="flex items-start gap-2">
                              <span className="text-teal-600 font-bold">•</span>
                              <span className="italic font-medium">"{q}"</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {onAskAboutTest && (
                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => onAskAboutTest(test.name)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 hover:underline transition-all"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          Ask AI about {test.name}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
