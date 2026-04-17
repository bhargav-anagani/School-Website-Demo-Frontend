'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
  CalendarIcon, ChartBarIcon, BanknotesIcon, BellAlertIcon,
  CheckCircleIcon, XCircleIcon, ClockIcon,
} from '@heroicons/react/24/outline';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [profile,    setProfile]    = useState<any>(null);
  const [attendance, setAttendance] = useState<any>(null);
  const [results,    setResults]    = useState<any[]>([]);
  const [fees,       setFees]       = useState<any>(null);
  const [notices,    setNotices]    = useState<any[]>([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/student/profile'),
      api.get('/student/attendance'),
      api.get('/student/results'),
      api.get('/student/fees'),
      api.get('/student/announcements'),
    ]).then(([p, a, r, f, n]) => {
      setProfile(p.data.data);
      setAttendance(a.data.summary);
      setResults(r.data.data?.slice(0, 5) || []);
      setFees(f.data.summary);
      setNotices(n.data.data?.slice(0, 3) || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full" />
    </div>
  );

  const statCards = [
    { label: 'Attendance %',    value: attendance ? `${attendance.percentage}%` : '—', icon: CalendarIcon, color: 'from-blue-500 to-cyan-500',    link: '/dashboard/student/attendance' },
    { label: 'Present Days',    value: attendance?.present ?? '—',                      icon: CheckCircleIcon, color: 'from-emerald-500 to-teal-500', link: '/dashboard/student/attendance' },
    { label: 'Absent Days',     value: attendance?.absent ?? '—',                       icon: XCircleIcon, color: 'from-rose-500 to-red-500',       link: '/dashboard/student/attendance' },
    { label: 'Pending Fees',    value: fees ? `₹${fees.total_due.toLocaleString()}` : '—', icon: BanknotesIcon, color: 'from-amber-500 to-orange-500', link: '/dashboard/student/fees' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-display font-bold mb-1">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h2>
        <p className="text-white/75 text-sm">
          {profile ? `Class ${profile.class}-${profile.section} · Roll No. ${profile.roll_no || 'N/A'}` : 'Loading your details...'}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(s => (
          <Link key={s.label} href={s.link} className="card p-5 group hover:shadow-lg transition-all">
            <div className={`w-12 h-12 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md`}>
              <s.icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-display font-black text-gray-900 dark:text-white">{s.value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Results */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <ChartBarIcon className="w-5 h-5 text-primary-500" /> Recent Results
            </h3>
            <Link href="/dashboard/student/results" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">View All</Link>
          </div>
          {results.length === 0 ? (
            <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-8">No results recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {results.map(r => (
                <div key={r.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{r.subject}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{r.exam_type?.replace('_', ' ')}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-bold ${r.grade === 'F' ? 'text-red-500' : r.grade === 'A+' || r.grade === 'A' ? 'text-emerald-500' : 'text-primary-600 dark:text-primary-400'}`}>
                      {r.grade}
                    </span>
                    <p className="text-xs text-gray-400">{r.marks}/{r.max_marks}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notices */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BellAlertIcon className="w-5 h-5 text-amber-500" /> Notices
            </h3>
          </div>
          {notices.length === 0 ? (
            <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-8">No notices.</p>
          ) : (
            <div className="space-y-4">
              {notices.map(n => {
                const isExam = n.category === 'Exams';
                const isEvent = n.category === 'Events' || n.category === 'Sports';
                return (
                  <div key={n.id} className={`p-4 border-l-4 rounded-xl transition-all hover:translate-x-1 ${
                    isExam ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-500' :
                    isEvent ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500' :
                    'bg-amber-50 dark:bg-amber-950/20 border-amber-500'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-black uppercase tracking-wider ${
                        isExam ? 'text-rose-600' : isEvent ? 'text-emerald-600' : 'text-amber-600'
                      }`}>{n.category || 'General'}</span>
                    </div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm mb-1">{n.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{n.content}</p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-black/5 dark:border-white/5">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">
                        {new Date(n.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </span>
                      <button className="text-[10px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest hover:underline leading-none">
                        Read Full
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
