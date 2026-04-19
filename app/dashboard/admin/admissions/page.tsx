'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { 
  ClipboardDocumentCheckIcon, 
  UserIcon, 
  BriefcaseIcon, 
  AcademicCapIcon, 
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export default function AdminAdmissionsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('admission'); // 'admission' or 'career'
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/admin/admissions');
      setApplications(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load applications.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await api.put(`/admin/admissions/${id}`, { status });
      toast.success(`Application marked as ${status}`);
      fetchApplications();
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  const filtered = applications.filter(a => 
    a.form_type === filter && 
    (a.applicant_name?.toLowerCase().includes(search.toLowerCase()) || 
     a.email?.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-black text-gray-900 dark:text-white flex items-center gap-2">
            <ClipboardDocumentCheckIcon className="w-7 h-7 text-rose-600" />
            Applications & Requests
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Review student admissions and career applications.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-slate-800">
        <button 
          onClick={() => setFilter('admission')}
          className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${
            filter === 'admission' ? 'border-rose-600 text-rose-600' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <div className="flex items-center gap-2">
            <AcademicCapIcon className="w-4 h-4" />
            Admissions
          </div>
        </button>
        <button 
          onClick={() => setFilter('career')}
          className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${
            filter === 'career' ? 'border-rose-600 text-rose-600' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <div className="flex items-center gap-2">
            <BriefcaseIcon className="w-4 h-4" />
            Careers
          </div>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input 
          type="text"
          placeholder="Search by name or email..."
          className="input-field pl-11"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* List */}
      <div className="grid gap-6">
        {filtered.map((a) => (
          <div key={a.id} className="card p-6 group hover:border-rose-200 transition-all">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  a.form_type === 'career' ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'
                }`}>
                  {a.form_type === 'career' ? <BriefcaseIcon className="w-6 h-6" /> : <UserIcon className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">{a.applicant_name}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
                    <span>{a.email}</span>
                    <span>{a.phone}</span>
                    {a.form_type === 'admission' && <span className="font-bold text-rose-600">Grade {a.class_applied}</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                      a.status === 'approved' ? 'bg-green-100 text-green-700' :
                      a.status === 'rejected' ? 'bg-rose-100 text-rose-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {a.status}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1">
                      <ClockIcon className="w-3 h-3" />
                      {new Date(a.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {a.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => handleStatusUpdate(a.id, 'approved')}
                      className="btn-primary bg-green-600 hover:bg-green-700 text-xs px-4 py-2"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(a.id, 'rejected')}
                      className="btn-secondary text-xs px-4 py-2"
                    >
                      Reject
                    </button>
                  </>
                )}
                {a.resume_url && (
                  <a 
                    href={a.resume_url} target="_blank" rel="noopener noreferrer"
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    View Resume
                  </a>
                )}
              </div>
            </div>

            {/* Details Grid */}
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-800 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                {a.parent_name && (
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Parent/Guardian</label>
                    <p className="text-gray-900 dark:text-white font-medium">{a.parent_name}</p>
                  </div>
                )}
                {a.dob && (
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Date of Birth</label>
                    <p className="text-gray-900 dark:text-white font-medium">{new Date(a.dob).toLocaleDateString()}</p>
                  </div>
                )}
                {a.previous_school && (
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Previous School</label>
                    <p className="text-gray-900 dark:text-white font-medium">{a.previous_school}</p>
                  </div>
                )}
                <div className="sm:col-span-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Address</label>
                    <p className="text-gray-600 dark:text-gray-400">{a.address || 'Not provided'}</p>
                </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-20 text-center text-gray-400">
            No {filter} applications found.
          </div>
        )}
      </div>
    </div>
  );
}
