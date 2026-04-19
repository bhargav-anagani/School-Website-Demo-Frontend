'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { 
  ChevronRightIcon, 
  AcademicCapIcon, 
  ClipboardDocumentCheckIcon,
  CheckBadgeIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const EXAM_TYPES = ['unit_test', 'mid_term', 'final', 'assignment'];

export default function TeacherResultsPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1); // 1: Class, 2: Exam Info, 3: Marks

  // Exam Info State
  const [examInfo, setExamInfo] = useState({
    subject: '',
    exam_type: 'unit_test',
    max_marks: '100',
    exam_date: new Date().toISOString().split('T')[0]
  });

  // Marks State
  const [marksData, setMarksData] = useState<Record<number, { marks: string, remarks: string }>>({});

  useEffect(() => {
    api.get('/teacher/classes')
      .then(res => setClasses(res.data.data || []))
      .finally(() => setLoading(false));
  }, []);

  const handleSelectClass = (cls: any) => {
    setSelectedClass(cls);
    setExamInfo(prev => ({ ...prev, subject: cls.subjects[0] || '' })); // Default to first available subject
    setLoading(true);
    api.get(`/teacher/students?class=${cls.class}&section=${cls.section}`)
      .then(res => {
        setStudents(res.data.data || []);
        setStep(2);
      })
      .finally(() => setLoading(false));
  };

  const handleExamInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examInfo.subject) return toast.error('Subject is required');
    
    // Fetch existing marks if any to pre-fill
    setLoading(true);
    api.get(`/teacher/results?class=${selectedClass.class}&section=${selectedClass.section}&subject=${examInfo.subject}&exam_type=${examInfo.exam_type}`)
      .then(res => {
        const existing = res.data.data || [];
        const initialMarks: any = {};
        existing.forEach((r: any) => {
          initialMarks[r.student_id] = { marks: r.marks.toString(), remarks: r.remarks || '' };
        });
        setMarksData(initialMarks);
        setStep(3);
      })
      .finally(() => setLoading(false));
  };

  const handleMarkChange = (studentId: number, field: 'marks' | 'remarks', value: string) => {
    setMarksData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const saveResults = async () => {
    setLoading(true);
    try {
      const results = students.map(s => ({
        student_id: s.student_id,
        subject: examInfo.subject,
        exam_type: examInfo.exam_type,
        marks: marksData[s.student_id]?.marks || '0',
        max_marks: examInfo.max_marks,
        exam_date: examInfo.exam_date,
        remarks: marksData[s.student_id]?.remarks || ''
      }));

      await api.post('/teacher/results', { results });
      toast.success('Results saved successfully!');
      // Optional: go back to step 1 or 2
    } catch (err) {
      toast.error('Failed to save results');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && step === 1) return <div className="flex justify-center py-20"><div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Exam Results Management</h2>
          <nav className="flex items-center gap-2 mt-2 text-sm text-gray-400">
            <span className={step >= 1 ? 'text-primary-600 font-bold' : ''}>Select Class</span>
            <ChevronRightIcon className="w-4 h-4" />
            <span className={step >= 2 ? 'text-primary-600 font-bold' : ''}>Exam Details</span>
            <ChevronRightIcon className="w-4 h-4" />
            <span className={step >= 3 ? 'text-primary-600 font-bold' : ''}>Assign Marks</span>
          </nav>
        </div>
        {step > 1 && (
          <button 
            onClick={() => setStep(step - 1)}
            className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
          >
            ← Back
          </button>
        )}
      </div>

      {/* Step 1: Select Class */}
      {step === 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls, idx) => (
            <button 
              key={idx} 
              onClick={() => handleSelectClass(cls)}
              className="card p-6 text-left hover:border-primary-500 hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <AcademicCapIcon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Class {cls.class}</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Section {cls.section}</p>
              <div className="mt-4 flex items-center text-primary-600 font-bold text-sm">
                Manage Results <ChevronRightIcon className="w-4 h-4 ml-1" />
              </div>
            </button>
          ))}
          {classes.length === 0 && (
            <div className="col-span-full card p-12 text-center">
              <ClipboardDocumentCheckIcon className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500">You are not assigned to any classes for results management.</p>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Exam Details */}
      {step === 2 && (
        <div className="max-w-2xl mx-auto">
          <div className="card p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <ClipboardDocumentCheckIcon className="w-6 h-6 text-primary-600" />
              Enter Exam Details for Class {selectedClass.class}-{selectedClass.section}
            </h3>
            <form onSubmit={handleExamInfoSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                  <select 
                    value={examInfo.subject}
                    onChange={e => setExamInfo({ ...examInfo, subject: e.target.value })}
                    className="input-field"
                  >
                    <option value="" disabled>Select Subject</option>
                    {selectedClass?.subjects?.map((s: string) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Exam Type</label>
                  <select 
                    value={examInfo.exam_type}
                    onChange={e => setExamInfo({ ...examInfo, exam_type: e.target.value })}
                    className="input-field"
                  >
                    {EXAM_TYPES.map(t => (
                      <option key={t} value={t}>{t.replace('_', ' ').toUpperCase()}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Total Marks</label>
                  <input 
                    type="number" 
                    value={examInfo.max_marks}
                    onChange={e => setExamInfo({ ...examInfo, max_marks: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Exam Date</label>
                  <input 
                    type="date" 
                    value={examInfo.exam_date}
                    onChange={e => setExamInfo({ ...examInfo, exam_date: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full btn btn-primary py-3 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
              >
                Continue to Student List <ChevronRightIcon className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Step 3: Mark Entry */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="card p-6 bg-primary-600 text-white flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-primary-100 text-sm">Now Entering Marks for:</p>
              <h3 className="text-2xl font-display font-black">
                {examInfo.subject} — {examInfo.exam_type?.replace('_',' ').toUpperCase()}
              </h3>
              <p className="text-primary-100 mt-1 uppercase text-xs font-bold tracking-wider">
                Class {selectedClass.class}-{selectedClass.section} · Total Marks: {examInfo.max_marks}
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                 onClick={() => setStep(2)}
                 className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition-all"
              >
                Change Exam Info
              </button>
              <button 
                onClick={saveResults}
                disabled={loading}
                className="px-6 py-2 bg-white text-primary-600 hover:bg-primary-50 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95"
              >
                {loading ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <CheckBadgeIcon className="w-4 h-4" />}
                Save All Results
              </button>
            </div>
          </div>

          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700">
                  <th className="text-left px-5 py-4 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs w-20">Roll No</th>
                  <th className="text-left px-5 py-4 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Student Name</th>
                  <th className="text-left px-5 py-4 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs w-40">Marks Obtd.</th>
                  <th className="text-left px-5 py-4 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Remarks/Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
                {students.map(s => (
                  <tr key={s.student_id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-gray-400">{s.roll_no}</td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-gray-900 dark:text-white">{s.name}</p>
                      <p className="text-xs text-gray-400">{s.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <input 
                          type="number" 
                          max={examInfo.max_marks}
                          placeholder="00"
                          value={marksData[s.student_id]?.marks || ''}
                          onChange={e => handleMarkChange(s.student_id, 'marks', e.target.value)}
                          className="w-20 px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-center font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                        <span className="text-gray-400 font-medium">/ {examInfo.max_marks}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <input 
                        type="text" 
                        placeholder="Good progress, keep it up!"
                        value={marksData[s.student_id]?.remarks || ''}
                        onChange={e => handleMarkChange(s.student_id, 'remarks', e.target.value)}
                        className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-600 dark:text-gray-400 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              onClick={saveResults}
              disabled={loading}
              className="px-10 py-4 bg-primary-600 text-white rounded-2xl font-bold shadow-xl shadow-primary-200 dark:shadow-none hover:bg-primary-700 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
            >
              {loading && <ArrowPathIcon className="w-5 h-5 animate-spin" />}
              Save & Finalize Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
