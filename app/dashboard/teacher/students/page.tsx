'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { UserGroupIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async (query = '') => {
    setLoading(true);
    try {
      const res = await api.get(`/teacher/students${query ? `?search=${query}` : ''}`);
      setStudents(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStudents(search);
  };

  if (loading && students.length === 0) {
    return <div className="flex justify-center py-20"><div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Class Students</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            List of students in your assigned class
          </p>
        </div>
        <form onSubmit={handleSearch} className="relative max-w-sm w-full">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
          />
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((s) => (
          <div key={s.student_id} className="card p-5 group hover:border-primary-300 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-gray-100 dark:border-slate-700">
                {s.photo_url ? (
                  <img src={s.photo_url} alt={s.name} className="w-full h-full object-cover" />
                ) : (
                  <UserGroupIcon className="w-8 h-8 text-gray-300" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">
                  {s.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Roll No: {s.roll_no}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-[10px] font-bold uppercase rounded">
                    Class {s.class}-{s.section}
                  </span>
                  <span className="text-xs text-gray-400 capitalize">{s.gender}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50 dark:border-slate-800 flex justify-between items-center text-xs">
              <span className="text-gray-400">{s.email || 'No email'}</span>
              <button className="text-primary-600 font-bold hover:underline">View Profile</button>
            </div>
          </div>
        ))}
      </div>

      {!loading && students.length === 0 && (
        <div className="card p-12 text-center">
          <UserGroupIcon className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">No students found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
