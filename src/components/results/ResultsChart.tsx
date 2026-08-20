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
      <div className="rounded-xl border border-slate-200 bg-white p-5 text-center">
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
    if (status === 'within_range') return '#047857'; // emerald-700
    if (status === 'needs_attention' || status === 'important') return '#b45309'; // amber-700
    return '#64748b'; // slate-500
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <BarChart2 className="h-4 w-4 text-teal-700" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            Selected Measured Results
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-700" /> Within range
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-700" /> Needs attention
          </span>
        </div>
      </div>

      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: '#475569' }}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              interval={0}
              angle={-10}
              textAnchor="end"
            />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-md text-xs space-y-1">
                      <p className="font-bold text-slate-900">{d.fullName}</p>
                      <p className="text-slate-600">
                        Result: <strong className="text-slate-900">{d.result} {d.unit}</strong>
                      </p>
                      <p className="text-slate-500">
                        Reference Range: {d.referenceRange} {d.unit}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="result" radius={[4, 4, 0, 0]} maxBarSize={40}>
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
