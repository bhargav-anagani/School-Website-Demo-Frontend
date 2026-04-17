'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import {
  MegaphoneIcon, PlusIcon, PencilSquareIcon, TrashIcon,
  MagnifyingGlassIcon, FunnelIcon, CalendarDaysIcon,
  TagIcon, GlobeAltIcon, EyeIcon, BeakerIcon, 
  AcademicCapIcon, TrophyIcon, MusicalNoteIcon
} from '@heroicons/react/24/outline';

const CATEGORIES = [
  { id: 'General',   icon: MegaphoneIcon,   color: 'text-gray-500',   bg: 'bg-gray-100' },
  { id: 'Exams',     icon: AcademicCapIcon, color: 'text-rose-500',   bg: 'bg-rose-100' },
  { id: 'Events',    icon: CalendarDaysIcon, color: 'text-emerald-500', bg: 'bg-emerald-100' },
  { id: 'Sports',    icon: TrophyIcon,      color: 'text-blue-500',    bg: 'bg-blue-100' },
  { id: 'Culturals', icon: MusicalNoteIcon, color: 'text-purple-500',  bg: 'bg-purple-100' },
  { id: 'Science',   icon: BeakerIcon,      color: 'text-cyan-500',    bg: 'bg-cyan-100' },
];

const AUDIENCES = ['all', 'student', 'teacher', 'parent', 'admin'];

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General',
    target_role: 'all',
    is_public: false
  });

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const r = await api.get('/admin/announcements');
      setAnnouncements(r.data.data);
    } catch (err) {
      toast.error('Failed to load announcements.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const resetForm = () => {
    setFormData({ title: '', content: '', category: 'General', target_role: 'all', is_public: false });
    setEditingItem(null);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      content: item.content,
      category: item.category || 'General',
      target_role: item.target_role,
      is_public: !!item.is_public
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/admin/announcements/${editingItem.id}`, formData);
        toast.success('Announcement updated!');
      } else {
        await api.post('/admin/announcements', formData);
        toast.success('Announcement posted!');
      }
      setShowModal(false);
      resetForm();
      fetchAnnouncements();
    } catch (err) {
      toast.error('Failed to save announcement.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await api.delete(`/admin/announcements/${id}`);
      toast.success('Announcement deleted.');
      fetchAnnouncements();
    } catch (err) {
      toast.error('Delete failed.');
    }
  };

  const filtered = announcements.filter(a => 
    (a.title.toLowerCase().includes(search.toLowerCase()) || a.content.toLowerCase().includes(search.toLowerCase())) &&
    (filter === 'all' || a.category === filter)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-display font-black text-gray-900 dark:text-white">Notice Board Management</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Create and manage school-wide announcements</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-rose-200 dark:shadow-none"
        >
          <PlusIcon className="w-5 h-5" /> New Announcement
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search notices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
          />
        </div>
        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-slate-800 rounded-2xl">
          {['all', ...CATEGORIES.map(c => c.id)].map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === c 
                  ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {c === 'all' ? 'All' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Announcements List */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center">
            <div className="inline-block animate-spin w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-20 card text-center text-gray-400">No announcements found.</div>
        ) : (
          filtered.map(a => {
            const cat = CATEGORIES.find(c => c.id === a.category) || CATEGORIES[0];
            return (
              <div key={a.id} className="card p-6 flex flex-col h-full group hover:shadow-xl transition-all border-t-4 border-t-transparent data-[exam=true]:border-t-rose-500" data-exam={a.category === 'Exams'}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 ${cat.bg} ${cat.color} rounded-xl flex items-center justify-center shrink-0 shadow-sm`}>
                    <cat.icon className="w-5 h-5" />
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleOpenEdit(a)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all">
                      <PencilSquareIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(a.id)} className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-all">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">{a.category}</span>
                    <span className="text-[10px] text-gray-300">•</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{a.target_role === 'all' ? 'Everyone' : a.target_role}</span>
                  </div>
                  <h4 className="text-lg font-display font-black text-gray-900 dark:text-white leading-tight group-hover:text-rose-600 transition-colors">{a.title}</h4>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-6 flex-grow">{a.content}</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center font-bold text-[10px] text-gray-500">
                      {a.author_name?.[0]}
                    </div>
                    <span className="text-[11px] text-gray-500 font-medium">{a.author_name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <ClockIcon className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase">{new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scale-in">
              <div className="p-8 border-b border-gray-100 dark:border-slate-800 flex items-center gap-4 bg-gray-50/50 dark:bg-slate-800/50">
                <div className="w-12 h-12 bg-rose-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200 dark:shadow-none">
                   <MegaphoneIcon className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="text-xl font-display font-black text-gray-900 dark:text-white">{editingItem ? 'Edit Announcement' : 'Post New Notice'}</h3>
                   <p className="text-sm text-gray-500">Share important updates with the school community</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Category</label>
                      <select 
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-3 text-sm font-bold text-gray-900 dark:text-white outline-none ring-2 ring-transparent focus:ring-rose-500/20"
                      >
                         {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Target Audience</label>
                      <select 
                        value={formData.target_role}
                        onChange={(e) => setFormData({...formData, target_role: e.target.value})}
                        className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-3 text-sm font-bold text-gray-900 dark:text-white outline-none ring-2 ring-transparent focus:ring-rose-500/20 capitalize"
                      >
                         {AUDIENCES.map(a => <option key={a} value={a}>{a === 'all' ? 'Everyone' : a}</option>)}
                      </select>
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Notice Title</label>
                   <input 
                      type="text"
                      required
                      placeholder="e.g., Final Examination Dates Announced"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-3 text-sm font-bold text-gray-900 dark:text-white outline-none ring-2 ring-transparent focus:ring-rose-500/20"
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Description / Content</label>
                   <textarea 
                      required
                      rows={5}
                      placeholder="Type the full details of the announcement here..."
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 outline-none ring-2 ring-transparent focus:ring-rose-500/20 resize-none"
                   />
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl">
                   <input 
                    type="checkbox"
                    id="is_public"
                    checked={formData.is_public}
                    onChange={(e) => setFormData({...formData, is_public: e.target.checked})}
                    className="w-5 h-5 rounded-lg border-none bg-white dark:bg-slate-700 text-rose-600 focus:ring-rose-500/20"
                   />
                   <label htmlFor="is_public" className="text-sm font-bold text-gray-700 dark:text-gray-300">Display on Public Website Home Page</label>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-100 dark:border-slate-800">
                    <button 
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-6 py-4 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all font-display"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-6 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-sm font-black shadow-xl shadow-rose-200 dark:shadow-none transition-all font-display"
                    >
                      {editingItem ? 'Update Announcement' : 'Post Announcement Now'}
                    </button>
                </div>
              </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ClockIcon({ className }: { className: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}
