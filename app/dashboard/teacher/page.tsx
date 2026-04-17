'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { UsersIcon, CalendarIcon, ChartBarIcon, BellAlertIcon, ClockIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [profile, setProfile]   = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [notices,  setNotices]  = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/teacher/profile'),
      api.get('/teacher/students'),
      api.get('/teacher/announcements'),
    ]).then(([p, s, n]) => {
      setProfile(p.data.data);
      setStudents(s.data.data || []);
      setNotices(n.data.data?.slice(0, 3) || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-display font-bold mb-1">Good day, {user?.name?.split(' ')[0]}! 👩‍🏫</h2>
        <p className="text-white/75 text-sm">
          {profile ? `Subject: ${profile.subject || 'N/A'} · Employee ID: ${profile.employee_id || 'N/A'}` : 'Loading profile...'}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Students', value: students.length, icon: UsersIcon,      color: 'from-blue-500 to-cyan-500',    link: '/dashboard/teacher/students' },
          { label: 'Mark Attendance', value: 'Today',         icon: CalendarIcon,   color: 'from-violet-500 to-purple-600', link: '/dashboard/teacher/attendance' },
          { label: 'Upload Results',  value: 'New',           icon: ChartBarIcon,   color: 'from-emerald-500 to-teal-500',  link: '/dashboard/teacher/results' },
        ].map(s => (
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
        {/* Recent Students */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <UsersIcon className="w-5 h-5 text-violet-500" /> My Students
            </h3>
            <Link href="/dashboard/teacher/students" className="text-sm text-violet-600 dark:text-violet-400 hover:underline">View All</Link>
          </div>
          <div className="space-y-2">
            {students.slice(0, 6).map(s => (
              <div key={s.student_id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
                <div className="w-9 h-9 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                  {s.name?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{s.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Class {s.class}-{s.section} · Roll {s.roll_no || '—'}</p>
                </div>
              </div>
            ))}
            {students.length === 0 && <p className="text-gray-400 text-sm text-center py-6">No students assigned yet.</p>}
          </div>
        </div>

        {/* Notices */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <BellAlertIcon className="w-5 h-5 text-amber-500" />
            <h3 className="font-display font-bold text-gray-900 dark:text-white">Notices</h3>
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
                    <button className="text-[10px] font-black text-violet-600 dark:text-violet-400 uppercase tracking-widest hover:underline leading-none">
                      Read Full
                    </button>
                  </div>
                </div>
              );
            })}
            {notices.length === 0 && <p className="text-gray-400 text-sm text-center py-6">No notices.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
