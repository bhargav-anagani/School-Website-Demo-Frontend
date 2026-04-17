'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { CalendarIcon, UserGroupIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function AttendancePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState<Record<string, string>>({}); 
  const [markedDates, setMarkedDates] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
     if (!selectedDate) {
         api.get('/teacher/attendance').then(res => {
            const dates = new Set<string>();
            res.data.data.forEach((r: any) => {
                if (r.date) {
                    const d = new Date(r.date);
                    const yyyy = d.getFullYear();
                    const mm = String(d.getMonth() + 1).padStart(2, '0');
                    const dd = String(d.getDate()).padStart(2, '0');
                    dates.add(`${yyyy}-${mm}-${dd}`);
                }
            });
            setMarkedDates(dates);
         }).catch(console.error);
     }
  }, [selectedDate, currentDate]);
  
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const handleSelectDate = async (day: number) => {
    const yyyy = currentDate.getFullYear();
    const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    const targetDate = new Date(`${dateStr}T00:00:00`);
    
    // 0 is Sunday, 6 is Saturday
    if (targetDate.getDay() === 0 || targetDate.getDay() === 6) {
        toast.error("Cannot mark attendance on weekends (Holiday)");
        return;
    }
    
    setSelectedDate(dateStr);
    setLoading(true);
    try {
      const stRes = await api.get('/teacher/students');
      if (stRes.data.data.length === 0) {
         toast.error("You are not assigned to a class or have no students.");
      }
      setStudents(stRes.data.data);
      
      const atRes = await api.get(`/teacher/attendance?date=${dateStr}`);
      const newAtt: Record<string, string> = {};
      
      stRes.data.data.forEach((s: any) => {
         const existing = atRes.data.data.find((a: any) => a.student_id === s.student_id);
         newAtt[s.student_id] = existing ? existing.status : 'present';
      });
      setAttendanceData(newAtt);
    } catch (e: any) {
       toast.error(e.response?.data?.message || 'Failed to fetch attendance data');
    } finally {
      setLoading(false);
    }
  };

  const saveAttendance = async () => {
     if (!selectedDate) return;
     setSaving(true);
     
     const records = students.map(s => ({
        student_id: s.student_id,
        date: selectedDate,
        status: attendanceData[s.student_id] || 'present'
     }));
     
     try {
       const res = await api.post('/teacher/attendance', { records });
       toast.success(res.data.message);
       setSelectedDate(null);
     } catch(e: any) {
       toast.error(e.response?.data?.message || 'Failed to save attendance');
     } finally {
       setSaving(false);
     }
  };

  const renderCalendar = () => {
      const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => <div key={`blank-${i}`} className="p-4" />);
      const days = Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const yyyy = currentDate.getFullYear();
          const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
          const dd = String(day).padStart(2, '0');
          const dateStr = `${yyyy}-${mm}-${dd}`;
          const isWeekend = new Date(`${dateStr}T00:00:00`).getDay() === 0 || new Date(`${dateStr}T00:00:00`).getDay() === 6;
          const isMarked = markedDates.has(dateStr);
          
          return (
             <button
                key={day}
                onClick={() => handleSelectDate(day)}
                className={`p-4 rounded-xl font-medium flex flex-col items-center justify-center transition-all ${
                   isWeekend ? 'bg-gray-100 dark:bg-slate-800 text-gray-400 cursor-not-allowed border border-dashed border-gray-200 dark:border-slate-700 opacity-50' : 
                   isMarked ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700 shadow-sm hover:shadow-md' : 
                   'bg-white dark:bg-slate-900 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] hover:shadow-lg hover:border-violet-500 border border-transparent dark:border-slate-700 text-gray-900 dark:text-white'
                }`}
             >
               <span className="text-xl">{day}</span>
               {isWeekend ? <span className="text-[10px] uppercase tracking-wider mt-1 text-red-500">Holiday</span> : 
                isMarked ? <span className="text-[10px] uppercase tracking-wider mt-1 font-bold text-emerald-600 dark:text-emerald-400">Marked</span> : null}
             </button>
          )
      });
      
      return (
         <div className="card p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
               <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium text-gray-600 dark:text-gray-300">
                  &larr; Prev
               </button>
               <h3 className="font-display font-bold text-2xl text-gray-900 dark:text-white">
                  {currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
               </h3>
               <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium text-gray-600 dark:text-gray-300">
                  Next &rarr;
               </button>
            </div>
            
            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-sm font-bold text-gray-400 uppercase tracking-widest">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => <div key={d} className={i === 0 || i === 6 ? 'text-red-400/70' : ''}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-4">
                {blanks}
                {days}
            </div>
         </div>
      );
  };

  return (
    <div className="space-y-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <CalendarIcon className="w-6 h-6" />
              </div>
              <div>
                  <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Attendance Register</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">View your class roster and manage daily attendance.</p>
              </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
            {!selectedDate ? (
                <motion.div key="calendar" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}>
                   {renderCalendar()}
                </motion.div>
            ) : (
                <motion.div key="list" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-6">
                    <div className="flex items-center justify-between">
                       <button onClick={() => setSelectedDate(null)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow">
                          <ArrowLeftIcon className="w-4 h-4" /> Back to Calendar
                       </button>
                       <div className="px-6 py-2.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800/50 rounded-xl font-bold shadow-sm inline-flex items-center gap-2">
                          <CalendarIcon className="w-5 h-5"/>
                          {new Date(selectedDate).toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}
                       </div>
                    </div>
                    
                    <div className="card p-6 border-t-4 border-t-violet-500">
                       {loading ? (
                          <div className="py-20 flex justify-center"><div className="animate-spin w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full" /></div>
                       ) : students.length === 0 ? (
                          <div className="py-20 text-center text-gray-500">
                             <UserGroupIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-slate-700 mb-4" />
                             <h3 className="text-xl font-display font-bold text-gray-900 dark:text-gray-300">No Students Found</h3>
                             <p className="mt-1">You are not assigned to a class, or there are no students in your class.</p>
                          </div>
                       ) : (
                          <>
                             <div className="flex justify-between items-center mb-6 px-2">
                               <h3 className="font-display font-bold text-lg">Class Roster</h3>
                               <span className="text-sm bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full text-gray-600 dark:text-gray-400 font-medium">Total: {students.length}</span>
                             </div>

                             <div className="space-y-4 mb-8">
                                {students.map((s) => (
                                   <div key={s.student_id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50/50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700 hover:border-violet-200 dark:hover:border-violet-800 transition-colors gap-4">
                                       <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner">
                                                {s.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white text-lg">{s.name}</p>
                                                <p className="text-sm text-gray-500 flex gap-2 mt-0.5">
                                                  <span className="bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-gray-200 dark:border-slate-700">Roll: {s.roll_no}</span>
                                                  <span className="bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-gray-200 dark:border-slate-700">Class: {s.class}-{s.section}</span>
                                                </p>
                                            </div>
                                       </div>
                                       
                                       <div className="flex items-center bg-white dark:bg-slate-900 rounded-xl p-1 shadow-sm border border-gray-200/60 dark:border-slate-700">
                                            <button 
                                                onClick={() => setAttendanceData({...attendanceData, [s.student_id]: 'present'})}
                                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${attendanceData[s.student_id] === 'present' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
                                            >
                                                Present
                                            </button>
                                            <button 
                                                onClick={() => setAttendanceData({...attendanceData, [s.student_id]: 'absent'})}
                                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${attendanceData[s.student_id] === 'absent' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
                                            >
                                                Absent
                                            </button>
                                       </div>
                                   </div>
                                ))}
                             </div>
                             
                             <div className="flex justify-end pt-6 border-t border-gray-100 dark:border-slate-800 relative">
                                 <button 
                                    onClick={saveAttendance}
                                    disabled={saving}
                                    className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-violet-600/30 transition-all active:scale-95 disabled:opacity-70 flex items-center gap-2"
                                 >
                                     {saving ? (
                                       <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
                                     ) : 'Save Attendance'}
                                 </button>
                             </div>
                          </>
                       )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
}
