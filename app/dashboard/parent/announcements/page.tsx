'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { BellAlertIcon, MegaphoneIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function ParentNoticesPage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await api.get('/parent/announcements');
      setNotices(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load notices.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-display font-black text-gray-900 dark:text-white flex items-center gap-2">
          <BellAlertIcon className="w-7 h-7 text-emerald-600" />
          School Notices
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Stay updated with official school announcements and class updates.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notices.map((n) => {
          const isExam = n.category === 'Exams';
          const isAcademic = n.category === 'Academic';
          
          return (
            <div key={n.id} className="card p-6 flex flex-col h-full border-l-4 border-emerald-500">
               <div className="flex items-center gap-2 mb-3">
                 <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                   isExam ? 'bg-rose-100 text-rose-600' : 
                   isAcademic ? 'bg-primary-100 text-primary-600' :
                   'bg-amber-100 text-amber-600'
                 }`}>
                   {n.category || 'General'}
                 </span>
                 {n.target_class && (
                   <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">
                     Class {n.target_class}{n.target_section || ''}
                   </span>
                 )}
               </div>
               <h3 className="font-bold text-gray-900 dark:text-white mb-2">{n.title}</h3>
               <p className="text-sm text-gray-600 dark:text-gray-400 flex-1 line-clamp-4">{n.content}</p>
               
               <div className="mt-5 pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">
                 <div className="flex items-center gap-1">
                   <MegaphoneIcon className="w-3 h-3" />
                   {n.author_name || 'Admin'}
                 </div>
                 <div className="flex items-center gap-1">
                   <ClockIcon className="w-3 h-3" />
                   {new Date(n.created_at).toLocaleDateString()}
                 </div>
               </div>
            </div>
          );
        })}
        {notices.length === 0 && <div className="md:col-span-3 py-20 text-center text-gray-400">No notices found.</div>}
      </div>
    </div>
  );
}
