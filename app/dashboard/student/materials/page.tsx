'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { 
  DocumentIcon, 
  ArrowDownTrayIcon,
  AcademicCapIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline';

export default function StudentMaterialsPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await api.get('/student/materials');
      setMaterials(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load study materials.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-display font-black text-gray-900 dark:text-white flex items-center gap-2">
          <AcademicCapIcon className="w-7 h-7 text-primary-600" />
          Study Materials
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Download learning resources and notes uploaded by your teachers.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map((m) => (
          <div key={m.id} className="card p-6 flex flex-col h-full hover:shadow-lg transition-all group">
            <div className="flex items-start justify-between mb-4">
               <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/40 rounded-xl flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform">
                 <DocumentIcon className="w-6 h-6" />
               </div>
               <a 
                 href={m.downloadUrl} 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="p-2 bg-primary-600 text-white rounded-xl shadow-md hover:bg-primary-700 transition-colors flex items-center gap-1 text-xs font-bold px-3"
               >
                 <ArrowDownTrayIcon className="w-4 h-4" />
                 Download
               </a>
            </div>
            
            <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{m.title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 h-10 line-clamp-3">{m.description || 'No description provided.'}</p>
            
            <div className="mt-auto space-y-3 pt-4 border-t border-gray-100 dark:border-slate-800">
               <div className="flex items-center gap-2">
                 <span className="bg-primary-100 text-primary-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                   {m.subject}
                 </span>
               </div>
               <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-1">
                    <UserIcon className="w-3 h-3" />
                    {m.teacher_name}
                  </div>
                  <div className="flex items-center gap-1">
                    <ClockIcon className="w-3 h-3" />
                    {new Date(m.created_at).toLocaleDateString()}
                  </div>
               </div>
            </div>
          </div>
        ))}
        {materials.length === 0 && (
          <div className="md:col-span-3 py-20 text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <DocumentIcon className="w-10 h-10" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">No materials available for your class yet.</p>
            <p className="text-xs text-gray-400 mt-1">Check back later for updates from your teachers.</p>
          </div>
        )}
      </div>
    </div>
  );
}
