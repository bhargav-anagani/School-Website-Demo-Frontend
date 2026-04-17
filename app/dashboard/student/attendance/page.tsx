'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { CalendarIcon } from '@heroicons/react/24/outline';

const STATUS_STYLE: Record<string, string> = {
  present: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400',
  absent:  'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400',
  late:    'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400',
  holiday: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400',
};

export default function StudentAttendancePage() {
  const [data,    setData]    = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/student/attendance').then(r => {
      setData(r.data.data || []);
      setSummary(r.data.summary);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full" /></div>;

  const pct = parseFloat(summary?.percentage || 0);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Attendance</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Last 90 days record</p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid sm:grid-cols-4 gap-4">
          {[
            { label:'Total Days',  value: summary.total,   color:'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white' },
            { label:'Present',     value: summary.present, color:'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400' },
            { label:'Absent',      value: summary.absent,  color:'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400' },
            { label:'Late',        value: summary.late,    color:'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400' },
          ].map(s => (
            <div key={s.label} className={`card p-5 text-center ${s.color}`}>
              <div className="text-3xl font-display font-black mb-1">{s.value}</div>
              <div className="text-sm font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {summary && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-gray-900 dark:text-white">Overall Attendance</span>
            <span className={`text-xl font-display font-black ${pct >= 75 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {pct}%
            </span>
          </div>
          <div className="h-4 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${pct >= 75 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>
          {pct < 75 && (
            <p className="text-xs text-red-500 mt-2">⚠ Attendance below 75%. Please maintain regular attendance.</p>
          )}
        </div>
      )}

      {/* Records Table */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-slate-700 flex items-center gap-3">
          <CalendarIcon className="w-5 h-5 text-primary-500" />
          <h3 className="font-display font-bold text-gray-900 dark:text-white">Attendance Log</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700">
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">Date</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">Day</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">Status</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
              {data.map(row => (
                <tr key={row.id} className="bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                  <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">
                    {new Date(row.date).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}
                  </td>
                  <td className="px-5 py-3 text-gray-500 dark:text-gray-400">
                    {new Date(row.date).toLocaleDateString('en-IN', { weekday:'short' })}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`badge capitalize ${STATUS_STYLE[row.status]}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-400 dark:text-gray-500 text-xs">{row.remarks || '—'}</td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr><td colSpan={4} className="px-5 py-12 text-center text-gray-400">No attendance records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
