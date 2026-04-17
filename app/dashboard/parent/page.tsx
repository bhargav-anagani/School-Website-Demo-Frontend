'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { AcademicCapIcon, BanknotesIcon, CalendarIcon, ChartBarIcon, BellAlertIcon, ClockIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function ParentDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/parent/profile'),
      api.get('/parent/announcements')
    ]).then(([p, a]) => {
      setProfile(p.data.data);
      setNotices(a.data.data?.slice(0, 4) || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-display font-bold mb-1">Welcome, {user?.name?.split(' ')[0]}! 👨‍👩‍👧</h2>
        <p className="text-white/75 text-sm">
          Parent of: <span className="font-semibold text-white">{profile?.name || 'Loading...'}</span>
          {profile && ` (Class ${profile.class}-${profile.section} · Roll No. ${profile.roll_no || 'N/A'})`}
        </p>
      </div>

      {/* Quick Access */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Child Attendance', icon: CalendarIcon, color: 'from-blue-500 to-cyan-500',    link: '/dashboard/parent/attendance' },
          { label: 'Results & Report', icon: ChartBarIcon, color: 'from-emerald-500 to-teal-500',  link: '/dashboard/parent/results' },
          { label: 'Pay Fees',         icon: BanknotesIcon,color: 'from-amber-500 to-orange-500', link: '/dashboard/parent/fees' },
        ].map(s => (
          <Link key={s.label} href={s.link} className="card p-5 group hover:shadow-lg transition-all flex items-center gap-4">
            <div className={`w-14 h-14 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-md`}>
              <s.icon className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="font-display font-bold text-gray-900 dark:text-white text-lg">{s.label}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Click to view details</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Profile & Notices */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-display font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-5">
            <AcademicCapIcon className="w-5 h-5 text-emerald-500" /> Child Details
          </h3>
          {profile ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  {profile.name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg">{profile.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Class {profile.class}-{profile.section}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-slate-700/50">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Roll Number</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{profile.roll_no || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Admission No.</p>
                  <p className="font-semibold text-gray-900 dark:text-white">IHS-2025-{String(profile.student_id || '').substring(0,4)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Address</p>
                  <p className="text-sm text-gray-900 dark:text-white">{profile.address || '—'}</p>
                </div>
              </div>
            </div>
          ) : (
             <p className="text-gray-500 text-sm">No child mapped to your account yet. Contact admin.</p>
          )}
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BellAlertIcon className="w-5 h-5 text-amber-500" /> Notice Board
            </h3>
          </div>
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
                    <button className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest hover:underline leading-none">
                      Read Full
                    </button>
                  </div>
                </div>
              );
            })}
            {notices.length === 0 && <p className="text-gray-400 text-sm text-center py-6">No new notices.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
