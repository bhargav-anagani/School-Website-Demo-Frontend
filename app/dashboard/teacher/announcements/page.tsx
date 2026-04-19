'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { BellAlertIcon, PlusIcon, MegaphoneIcon, AcademicCapIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function TeacherNoticesPage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    target_class: '',
    target_section: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [nRes, cRes] = await Promise.all([
        api.get('/teacher/announcements'),
        api.get('/teacher/classes')
      ]);
      setNotices(nRes.data.data || []);
      setClasses(cRes.data.data || []);
    } catch (err) {
      toast.error('Failed to load notices.');
    } finally {
      setLoading(false);
    }
  };

  const handlePostNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/teacher/announcements', newNotice);
      toast.success('Notice posted successfully!');
      setShowModal(false);
      setNewNotice({ title: '', content: '', target_class: '', target_section: '' });
      fetchData();
    } catch (err) {
      toast.error('Failed to post notice.');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-black text-gray-900 dark:text-white flex items-center gap-2">
            <BellAlertIcon className="w-7 h-7 text-primary-600" />
            Notices & Announcements
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">View official school notices and post academic updates for your classes.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center justify-center gap-2 px-6"
        >
          <PlusIcon className="w-5 h-5" />
          Post Academic Notice
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notices.map((n) => {
          const isAcademic = n.category === 'Academic';
          const isExam = n.category === 'Exams';
          
          return (
            <div key={n.id} className="card p-6 flex flex-col h-full border-l-4 border-primary-500">
               <div className="flex items-center gap-2 mb-3">
                 <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                   isExam ? 'bg-rose-100 text-rose-600' : 'bg-primary-100 text-primary-600'
                 }`}>
                   {n.category || 'General'}
                 </span>
                 {n.target_class && (
                   <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold">
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

      {/* Post Notice Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100/50 dark:bg-primary-900/10 rounded-full -mr-16 -mt-16" />
             
             <h3 className="text-xl font-display font-black text-gray-900 dark:text-white mb-6 relative flex items-center gap-2">
               <PlusIcon className="w-6 h-6 text-primary-600" /> Post Academic Notice
             </h3>
             
             <form onSubmit={handlePostNotice} className="space-y-4 relative">
               <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Notice Title</label>
                  <input 
                    type="text" required
                    className="input-field"
                    placeholder="e.g., Mathematics Assignment - Unit 3"
                    value={newNotice.title}
                    onChange={e => setNewNotice({...newNotice, title: e.target.value})}
                  />
               </div>
               
               <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label>
                  <textarea 
                    required rows={4}
                    className="input-field"
                    placeholder="Provide details about the assignment or update..."
                    value={newNotice.content}
                    onChange={e => setNewNotice({...newNotice, content: e.target.value})}
                  />
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Target Class</label>
                    <select 
                      required
                      className="input-field"
                      value={newNotice.target_class}
                      onChange={e => {
                        const sel = classes.find(c => c.class === e.target.value);
                        setNewNotice({...newNotice, target_class: e.target.value, target_section: sel?.section || ''});
                      }}
                    >
                      <option value="">Select Class</option>
                      {classes.map(c => (
                        <option key={`${c.class}-${c.section}`} value={c.class}>Class {c.class} ({c.section})</option>
                      ))}
                    </select>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
                    <div className="input-field bg-gray-50 flex items-center text-gray-500">
                      <AcademicCapIcon className="w-4 h-4 mr-2" /> Academic
                    </div>
                 </div>
               </div>

               <div className="flex gap-3 pt-4">
                 <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-6 py-3 rounded-xl border border-gray-200 dark:border-slate-800 text-gray-600 dark:text-gray-400 font-bold text-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-all">
                    Cancel
                 </button>
                 <button type="submit" className="flex-1 btn-primary">
                    Post Notice
                 </button>
               </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
