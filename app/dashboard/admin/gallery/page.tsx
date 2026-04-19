'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { 
  PhotoIcon, 
  PlusIcon, 
  TrashIcon, 
  CloudArrowUpIcon,
  TagIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

export default function AdminGalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('All');
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'Events',
    file: null as File | null
  });

  const categories = ['Events', 'Campus', 'Sports', 'Academic', 'Extra-Curricular'];

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await api.get('/public/gallery');
      setImages(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load gallery.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file) return toast.error('Please select an image.');

    const uploadData = new FormData();
    uploadData.append('title', formData.title);
    uploadData.append('category', formData.category);
    uploadData.append('file', formData.file);

    setUploading(true);
    try {
      await api.post('/admin/gallery', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Image added to gallery!');
      setShowModal(false);
      setFormData({ title: '', category: 'Events', file: null });
      fetchImages();
    } catch (err) {
      toast.error('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    try {
      await api.delete(`/admin/gallery/${id}`);
      toast.success('Image deleted.');
      fetchImages();
    } catch (err) {
      toast.error('Failed to delete image.');
    }
  };

  const filtered = filter === 'All' ? images : images.filter(img => img.category === filter);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-black text-gray-900 dark:text-white flex items-center gap-2">
            <PhotoIcon className="w-7 h-7 text-rose-600" />
            Website Gallery
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage images displayed in the public website gallery.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center justify-center gap-2 px-6"
        >
          <PlusIcon className="w-5 h-5" />
          Add New Image
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {['All', ...categories].map(cat => (
          <button 
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              filter === cat ? 'bg-rose-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-gray-500 hover:bg-gray-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((img) => (
          <div key={img.id} className="group relative aspect-square bg-gray-100 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-slate-800">
            <img 
              src={img.image_url} 
              alt={img.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
               <h4 className="text-white font-bold text-sm truncate">{img.title}</h4>
               <p className="text-white/60 text-[10px] uppercase font-bold tracking-widest mt-1">{img.category}</p>
               
               <button 
                 onClick={() => handleDelete(img.id)}
                 className="absolute top-3 right-3 p-2 bg-rose-600 text-white rounded-xl shadow-lg hover:bg-rose-700 transition-all scale-75 group-hover:scale-100"
               >
                 <TrashIcon className="w-4 h-4" />
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100/50 dark:bg-rose-900/10 rounded-full -mr-16 -mt-16" />
             
             <h3 className="text-xl font-display font-black text-gray-900 dark:text-white mb-6 relative flex items-center gap-2">
               <CloudArrowUpIcon className="w-6 h-6 text-rose-600" /> Upload to Gallery
             </h3>
             
             <form onSubmit={handleUpload} className="space-y-4 relative">
               <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Title</label>
                  <input 
                    type="text" required
                    className="input-field"
                    placeholder="e.g., Annual Sports Day 2024"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
               </div>
               
               <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
                  <select 
                    required
                    className="input-field"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
               </div>

               <div>
                 <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Image File</label>
                 <div className="relative">
                   <input 
                     type="file" required accept="image/*"
                     onChange={e => setFormData({...formData, file: e.target.files?.[0] || null})}
                     className="block w-full text-xs text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 cursor-pointer"
                   />
                 </div>
               </div>

               <div className="flex gap-3 pt-4">
                 <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-6 py-3 rounded-xl border border-gray-200 dark:border-slate-800 text-gray-600 dark:text-gray-400 font-bold text-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-all">
                    Cancel
                 </button>
                 <button type="submit" disabled={uploading} className="flex-1 btn-primary bg-rose-600 hover:bg-rose-700 flex items-center justify-center gap-2">
                    {uploading ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading...</>
                    ) : 'Publish Image'}
                 </button>
               </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
