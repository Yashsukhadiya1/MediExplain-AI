import { TestStatus } from '../types/report';

export interface StatusStyle {
  label: string;
  badgeBg: string;
  badgeDot: string;
  borderAccent: string;
  textAccent: string;
  symbol: string;
}

export function getStatusDetails(status: TestStatus | string): StatusStyle {
  switch (status) {
    case 'within_range':
      return {
        label: 'Within range',
        badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        badgeDot: 'bg-emerald-500',
        borderAccent: 'border-emerald-200',
        textAccent: 'text-emerald-700',
        symbol: '✓'
      };
    case 'above_range':
      return {
        label: 'Above range',
        badgeBg: 'bg-amber-50 text-amber-900 border-amber-200',
        badgeDot: 'bg-amber-500',
        borderAccent: 'border-amber-200',
        textAccent: 'text-amber-800',
        symbol: '↑'
      };
    case 'below_range':
      return {
        label: 'Below range',
        badgeBg: 'bg-amber-50 text-amber-900 border-amber-200',
        badgeDot: 'bg-amber-500',
        borderAccent: 'border-amber-200',
        textAccent: 'text-amber-800',
        symbol: '↓'
      };
    case 'needs_attention':
    case 'important':
      return {
        label: 'Outside range',
        badgeBg: 'bg-amber-50 text-amber-900 border-amber-300',
        badgeDot: 'bg-amber-600',
        borderAccent: 'border-amber-300',
        textAccent: 'text-amber-900',
        symbol: '!'
      };
    case 'reference_unavailable':
    default:
      return {
        label: 'Not available',
        badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
        badgeDot: 'bg-slate-400',
        borderAccent: 'border-slate-200',
        textAccent: 'text-slate-600',
        symbol: '?'
      };
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}
