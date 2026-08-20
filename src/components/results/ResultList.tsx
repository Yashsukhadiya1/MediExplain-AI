import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, HelpCircle, MessageSquare } from 'lucide-react';
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
      <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Results at a glance
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Summary table of tests detected in your report and stated lab reference ranges.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search tests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-teal-800 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => onSelectFilter('all')}
                className={`rounded-lg px-2.5 py-1 font-semibold transition-colors ${
                  selectedFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({results.length})
              </button>
              <button
                onClick={() => onSelectFilter('needs_attention')}
                className={`rounded-lg px-2.5 py-1 font-semibold transition-colors ${
                  selectedFilter === 'needs_attention'
                    ? 'bg-amber-800 text-white'
                    : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                Outside range
              </button>
              <button
                onClick={() => onSelectFilter('within_range')}
                className={`rounded-lg px-2.5 py-1 font-semibold transition-colors ${
                  selectedFilter === 'within_range'
                    ? 'bg-emerald-800 text-white'
                    : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                Within range
              </button>
            </div>
          </div>
        </div>

        {/* Clean Results Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-700 font-semibold">
                <th className="py-2.5 px-3">Test</th>
                <th className="py-2.5 px-3">Your result</th>
                <th className="py-2.5 px-3">Reference range</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-xs text-slate-500">
                    No test results matching this filter.
                  </td>
                </tr>
              ) : (
                filteredResults.map((test, index) => {
                  const statusInfo = getStatusDetails(test.status);
                  return (
                    <tr key={`row-${index}`} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {test.name}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900">
                        {test.result} <span className="font-normal text-slate-500 text-xs">{test.unit}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 font-medium">
                        {test.referenceRange} {test.unit && test.referenceRange !== 'Reference range unavailable' ? test.unit : ''}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold border ${statusInfo.badgeBg}`}>
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
        <div className="border-b border-slate-200 pb-2">
          <h3 className="text-lg font-bold text-slate-900">
            What do these results mean?
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Clear, educational explanations of individual test items.
          </p>
        </div>

        <div className="space-y-3">
          {filteredResults.map((test, index) => {
            const isExpanded = !!expandedTests[test.name];
            const statusInfo = getStatusDetails(test.status);

            return (
              <div
                key={`card-${test.name}-${index}`}
                className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs transition-colors"
              >
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-slate-900">
                        {test.name}
                      </h4>
                      <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold border ${statusInfo.badgeBg}`}>
                        <span>{statusInfo.symbol}</span>
                        <span>{statusInfo.label}</span>
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                      <span>
                        Result: <strong className="text-slate-900">{test.result} {test.unit}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Reference range: <span className="font-medium text-slate-700">{test.referenceRange} {test.unit && test.referenceRange !== 'Reference range unavailable' ? test.unit : ''}</span>
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleExpand(test.name)}
                    className="inline-flex items-center gap-1 self-start rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <span>{isExpanded ? 'Hide details' : 'Learn more'}</span>
                    {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>
                </div>

                {/* Simple explanation & Why it matters */}
                <div className="mt-3 text-xs sm:text-sm text-slate-700 bg-slate-50/70 p-3 rounded-lg border border-slate-200/70 space-y-1">
                  <p>
                    <strong className="text-slate-900">Simple explanation: </strong>
                    {test.explanation}
                  </p>
                  {test.whatIsThisTest && (
                    <p className="text-xs text-slate-600 pt-0.5">
                      <strong className="text-slate-800">What it measures: </strong>
                      {test.whatIsThisTest}
                    </p>
                  )}
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-4 text-xs sm:text-sm">
                    {test.questionsForDoctor && test.questionsForDoctor.length > 0 && (
                      <div className="rounded-lg bg-teal-50/60 border border-teal-200/80 p-3.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-900 mb-2">
                          <HelpCircle className="h-3.5 w-3.5 text-teal-800" />
                          Questions you could ask your doctor
                        </div>
                        <ul className="space-y-1 text-xs sm:text-sm text-slate-700">
                          {test.questionsForDoctor.map((q, qIdx) => (
                            <li key={qIdx} className="flex items-start gap-2">
                              <span className="text-teal-800 font-bold">•</span>
                              <span className="italic">"{q}"</span>
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
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 hover:text-teal-950 hover:underline"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          Ask a question about {test.name}
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
