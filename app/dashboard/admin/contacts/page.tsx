'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { 
  EnvelopeIcon, 
  EnvelopeOpenIcon, 
  TrashIcon, 
  UserIcon, 
  PhoneIcon,
  TagIcon,
  MagnifyingGlassIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export default function AdminContactsPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await api.get('/admin/contacts');
      setMessages(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load messages.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, isRead: boolean) => {
    try {
      await api.put(`/admin/contacts/${id}`, { is_read: isRead });
      fetchMessages();
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await api.delete(`/admin/contacts/${id}`);
      toast.success('Message deleted.');
      fetchMessages();
    } catch (err) {
      toast.error('Failed to delete message.');
    }
  };

  const filtered = messages.filter(m => 
    m.name?.toLowerCase().includes(search.toLowerCase()) || 
    m.email?.toLowerCase().includes(search.toLowerCase()) ||
    m.subject?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-display font-black text-gray-900 dark:text-white flex items-center gap-2">
          <EnvelopeIcon className="w-7 h-7 text-rose-600" />
          Contact Submissions
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage inquiries and feedback from the public website.</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input 
          type="text"
          placeholder="Search by name, email or subject..."
          className="input-field pl-11"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {filtered.map((m) => (
          <div key={m.id} className={`card p-6 transition-all border-l-4 ${m.is_read ? 'border-gray-200 opacity-60' : 'border-rose-500 shadow-md'}`}>
            <div className="flex flex-col lg:flex-row justify-between gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                   <h3 className={`font-bold text-gray-900 dark:text-white ${m.is_read ? 'text-base' : 'text-lg'}`}>{m.subject || 'No Subject'}</h3>
                   {!m.is_read && <span className="bg-rose-100 text-rose-600 text-[10px] font-black uppercase px-2 py-0.5 rounded">New</span>}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-line bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl mb-4 italic">
                  "{m.message}"
                </p>
                <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-500">
                  <span className="flex items-center gap-1.5"><UserIcon className="w-4 h-4" /> {m.name}</span>
                  <span className="flex items-center gap-1.5"><EnvelopeIcon className="w-4 h-4" /> {m.email}</span>
                  {m.phone && <span className="flex items-center gap-1.5"><PhoneIcon className="w-4 h-4" /> {m.phone}</span>}
                  <span className="flex items-center gap-1.5"><ClockIcon className="w-4 h-4" /> {new Date(m.created_at).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 lg:self-start lg:mt-1">
                <button 
                  onClick={() => handleStatusUpdate(m.id, !m.is_read)}
                  className={`p-2 rounded-xl border transition-all ${
                    m.is_read ? 'text-gray-400 border-gray-100 hover:text-rose-600' : 'text-rose-600 border-rose-100 hover:bg-rose-50'
                  }`}
                  title={m.is_read ? 'Mark as Unread' : 'Mark as Read'}
                >
                  {m.is_read ? <EnvelopeOpenIcon className="w-5 h-5" /> : <EnvelopeIcon className="w-5 h-5" />}
                </button>
                <button 
                  onClick={() => handleDelete(m.id)}
                  className="p-2 text-gray-400 hover:text-rose-600 border border-gray-100 hover:border-rose-100 rounded-xl transition-all"
                  title="Delete Message"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-20 text-center text-gray-400">
            No messages found.
          </div>
        )}
      </div>
    </div>
  );
}
