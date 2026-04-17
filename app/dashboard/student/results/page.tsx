'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { ChartBarIcon } from '@heroicons/react/24/outline';

const GRADE_COLOR: Record<string, string> = {
  'A+': 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400',
  'A':  'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400',
  'B':  'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400',
  'C':  'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400',
  'D':  'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400',
  'F':  'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400',
};

export default function StudentResultsPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('all');

  useEffect(() => {
    api.get('/student/results').then(r => setResults(r.data.data || [])).finally(() => setLoading(false));
  }, []);

  const examTypes = ['all', ...Array.from(new Set(results.map(r => r.exam_type)))];
  const filtered  = filter === 'all' ? results : results.filter(r => r.exam_type === filter);
  const avgPct    = results.length ? (results.reduce((s, r) => s + (r.marks / r.max_marks) * 100, 0) / results.length).toFixed(1) : null;

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Results & Marks</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {results.length} records · {avgPct ? `Average: ${avgPct}%` : ''}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {examTypes.map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
                filter === t ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}>
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Average Score Card */}
      {avgPct && (
        <div className="card p-6 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-950/40 dark:to-accent-950/40 border-primary-100 dark:border-primary-900">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-600 rounded-2xl flex items-center justify-center">
              <ChartBarIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overall Average Score</p>
              <p className="text-4xl font-display font-black text-primary-600 dark:text-primary-400">{avgPct}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Results Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700">
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">Subject</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">Exam Type</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">Marks</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">Percentage</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">Grade</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">Teacher</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
              {filtered.map(r => {
                const pct = ((r.marks / r.max_marks) * 100).toFixed(1);
                return (
                  <tr key={r.id} className="bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-3 font-semibold text-gray-900 dark:text-white">{r.subject}</td>
                    <td className="px-5 py-3 text-gray-500 dark:text-gray-400 capitalize">{r.exam_type?.replace('_',' ')}</td>
                    <td className="px-5 py-3 font-bold text-gray-900 dark:text-white">{r.marks}<span className="text-gray-400 font-normal">/{r.max_marks}</span></td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-100 dark:bg-slate-700 rounded-full max-w-[80px]">
                          <div className={`h-full rounded-full ${parseFloat(pct)>=75?'bg-emerald-500':parseFloat(pct)>=50?'bg-amber-500':'bg-red-500'}`} style={{width:`${pct}%`}} />
                        </div>
                        <span className="text-xs text-gray-500">{pct}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`badge font-bold ${GRADE_COLOR[r.grade] || 'bg-gray-100 text-gray-600'}`}>{r.grade}</span>
                    </td>
                    <td className="px-5 py-3 text-gray-500 dark:text-gray-400 text-xs">{r.teacher_name}</td>
                    <td className="px-5 py-3 text-gray-500 dark:text-gray-400 text-xs">
                      {r.exam_date ? new Date(r.exam_date).toLocaleDateString('en-IN') : '—'}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-400">No results found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
