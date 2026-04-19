'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { 
  CloudArrowUpIcon, 
  DocumentIcon, 
  TrashIcon, 
  PlusIcon,
  AcademicCapIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

export default function TeacherMaterialsPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    class: '',
    section: '',
    subject: '',
    file: null as File | null
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [mRes, cRes] = await Promise.all([
        api.get('/teacher/materials'),
        api.get('/teacher/classes')
      ]);
      setMaterials(mRes.data.data || []);
      setClasses(cRes.data.data || []);
    } catch (err) {
      toast.error('Failed to load materials.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file) return toast.error('Please select a file.');

    const uploadData = new FormData();
    uploadData.append('title', formData.title);
    uploadData.append('description', formData.description);
    uploadData.append('class', formData.class);
    uploadData.append('section', formData.section);
    uploadData.append('subject', formData.subject);
    uploadData.append('file', formData.file);

    setUploading(true);
    try {
      await api.post('/teacher/materials', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Material uploaded successfully!');
      setShowModal(false);
      setFormData({ title: '', description: '', class: '', section: '', subject: '', file: null });
      fetchData();
    } catch (err) {
      toast.error('Failed to upload material.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-black text-gray-900 dark:text-white flex items-center gap-2">
            <AcademicCapIcon className="w-7 h-7 text-violet-600" />
            Study Materials
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Upload and manage learning resources for your students.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center justify-center gap-2 px-6"
        >
          <CloudArrowUpIcon className="w-5 h-5" />
          Upload New Material
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map((m) => (
          <div key={m.id} className="card p-6 flex flex-col group relative">
            <div className="flex items-start justify-between mb-4">
               <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/40 rounded-xl flex items-center justify-center text-primary-600">
                 <DocumentIcon className="w-6 h-6" />
               </div>
               <div className="flex gap-2">
                  <a href={m.downloadUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                    <ArrowDownTrayIcon className="w-5 h-5" />
                  </a>
               </div>
            </div>
            
            <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{m.title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 h-8 line-clamp-2">{m.description || 'No description'}</p>
            
            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-slate-800 flex flex-wrap gap-2">
               <span className="bg-violet-100 text-violet-700 px-2 py-0.5 rounded text-[10px] font-bold">
                 {m.subject}
               </span>
               <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold">
                 Class {m.class}{m.section || ''}
               </span>
            </div>
            
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg">
                 <TrashIcon className="w-4 h-4" />
               </button>
            </div>
          </div>
        ))}
        {materials.length === 0 && <div className="md:col-span-3 py-20 text-center text-gray-400">No materials uploaded yet.</div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-violet-100/50 dark:bg-violet-900/10 rounded-full -mr-16 -mt-16" />
             
             <h3 className="text-xl font-display font-black text-gray-900 dark:text-white mb-6 relative flex items-center gap-2">
               <CloudArrowUpIcon className="w-6 h-6 text-violet-600" /> Upload Material
             </h3>
             
             <form onSubmit={handleUpload} className="space-y-4 relative">
               <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Title</label>
                  <input 
                    type="text" required
                    className="input-field"
                    placeholder="e.g., Mathematics - Algebra Chapter 1"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
               </div>
               
               <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label>
                  <textarea 
                    rows={2}
                    className="input-field"
                    placeholder="Short description of the resource..."
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Class</label>
                    <select 
                      required
                      className="input-field"
                      value={formData.class}
                      onChange={e => {
                        const sel = classes.find(c => c.class === e.target.value);
                        setFormData({...formData, 
                          class: e.target.value, 
                          section: sel?.section || '',
                          subject: sel?.subjects[0] || ''
                        });
                      }}
                    >
                      <option value="">Select Class</option>
                      {classes.map(c => (
                        <option key={`${c.class}-${c.section}`} value={c.class}>Class {c.class} ({c.section})</option>
                      ))}
                    </select>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Subject</label>
                    <select 
                      required
                      className="input-field"
                      value={formData.subject}
                      onChange={e => setFormData({...formData, subject: e.target.value})}
                    >
                      <option value="">Select Subject</option>
                      {classes.find(c => c.class === formData.class)?.subjects.map((s: string) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                 </div>
               </div>

               <div>
                 <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">File</label>
                 <div className="relative">
                   <input 
                     type="file" required
                     onChange={e => setFormData({...formData, file: e.target.files?.[0] || null})}
                     className="block w-full text-xs text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 cursor-pointer"
                   />
                 </div>
                 <p className="text-[10px] text-gray-400 mt-2 italic">* Supported formats: PDF, DOC, Images (Max 10MB)</p>
               </div>

               <div className="flex gap-3 pt-4">
                 <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-6 py-3 rounded-xl border border-gray-200 dark:border-slate-800 text-gray-600 dark:text-gray-400 font-bold text-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-all">
                    Cancel
                 </button>
                 <button type="submit" disabled={uploading} className="flex-1 btn-primary flex items-center justify-center gap-2">
                    {uploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Uploading...
                      </>
                    ) : 'Upload File'}
                 </button>
               </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
