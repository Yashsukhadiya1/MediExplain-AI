import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from 'recharts';
import { BarChart2 } from 'lucide-react';
import { TestResult } from '../../types/report';

interface ResultsChartProps {
  results: TestResult[];
}

export const ResultsChart: React.FC<ResultsChartProps> = ({ results }) => {
  // Filter for valid numeric test results with defined bounds
  const numericResults = results.filter(
    (r) =>
      r.numericValue !== null &&
      r.numericValue !== undefined &&
      !isNaN(r.numericValue) &&
      r.lowerBound !== null &&
      r.upperBound !== null &&
      r.lowerBound !== undefined &&
      r.upperBound !== undefined
  );

  if (numericResults.length < 2) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center border border-white/90">
        <p className="text-xs text-slate-500">
          Not enough numeric data with stated reference ranges for chart visualization.
        </p>
      </div>
    );
  }

  const chartData = numericResults.slice(0, 8).map((item) => ({
    name: item.name.length > 16 ? item.name.substring(0, 14) + '…' : item.name,
    fullName: item.name,
    result: item.numericValue,
    unit: item.unit,
    referenceRange: item.referenceRange,
    status: item.status,
  }));

  const getColor = (status: string) => {
    if (status === 'within_range') return '#10b981'; // emerald-500
    if (status === 'needs_attention' || status === 'important') return '#f59e0b'; // amber-500
    return '#64748b'; // slate-500
  };

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-7 shadow-xl shadow-teal-950/5 border border-white/90 text-left">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
            <BarChart2 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">
              Numeric Results Distribution
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparison of reported numeric values (Green: Within range, Amber: Outside range)
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200/50 hidden sm:inline-block">
          Interactive Chart
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
              interval={0}
              angle={-20}
              textAnchor="end"
            />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="glass-card rounded-xl border border-teal-100 p-3 shadow-lg text-xs space-y-1">
                      <p className="font-extrabold text-slate-900">{data.fullName}</p>
                      <p className="text-slate-700">
                        Result: <span className="font-black text-teal-800">{data.result} {data.unit}</span>
                      </p>
                      <p className="text-slate-500 text-[11px]">
                        Reference: {data.referenceRange}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="result" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.status)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
