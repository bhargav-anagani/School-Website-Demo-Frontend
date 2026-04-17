'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { UsersIcon, BanknotesIcon, DocumentTextIcon, EnvelopeIcon, MegaphoneIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then(r => setStats(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full" /></div>;

  const statCards = [
    { label: 'Total Users', value: stats?.users || 0, icon: UsersIcon, color: 'from-blue-500 to-cyan-500', link: '/dashboard/admin/users' },
    { label: 'Admissions', value: stats?.admissions || 0, icon: DocumentTextIcon, color: 'from-violet-500 to-purple-600', link: '/dashboard/admin/admissions' },
    { label: 'Contacts', value: stats?.contacts || 0, icon: EnvelopeIcon, color: 'from-emerald-500 to-teal-500', link: '/dashboard/admin/contacts' },
    { label: 'Total Revenue', value: `₹${Number(stats?.revenue || 0).toLocaleString('en-IN')}`, icon: BanknotesIcon, color: 'from-rose-500 to-amber-500', link: '/dashboard/admin/fees' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-rose-600 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-display font-bold mb-1">System Overview 🛠️</h2>
        <p className="text-white/75 text-sm">Welcome back, {user?.name}. Here is what's happening today.</p>
      </div>

      {/* Stats Grid */}
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

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="font-display font-bold text-gray-900 dark:text-white mb-5">Quick Actions</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/dashboard/admin/announcements" className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors group">
            <MegaphoneIcon className="w-8 h-8 text-rose-500 group-hover:scale-110 transition-transform" />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">Announcements</p>
              <p className="text-xs text-gray-500">Post new notice</p>
            </div>
          </Link>
          <Link href="/dashboard/admin/users" className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors group">
            <UsersIcon className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform" />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">Manage Users</p>
              <p className="text-xs text-gray-500">Approve/Edit roles</p>
            </div>
          </Link>
          <Link href="/dashboard/admin/fees" className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors group">
            <BanknotesIcon className="w-8 h-8 text-amber-500 group-hover:scale-110 transition-transform" />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">Collect Fees</p>
              <p className="text-xs text-gray-500">View transactions</p>
            </div>
          </Link>
          <Link href="/dashboard/admin/admissions" className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors group">
            <DocumentTextIcon className="w-8 h-8 text-emerald-500 group-hover:scale-110 transition-transform" />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">Admissions</p>
              <p className="text-xs text-gray-500">Review applications</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
