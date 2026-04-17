'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { BanknotesIcon, PencilSquareIcon, PlusIcon } from '@heroicons/react/24/outline';

const getStandardFee = (cls: string) => {
  const num = parseInt(cls.replace(/\D/g, ''), 10) || 1;
  if (num <= 5) return 55000;
  if (num <= 8) return 65000;
  if (num <= 10) return 77000;
  return 90000; // 11-12
};

export default function AdminFeesPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<any>(null);
  const [amount, setAmount] = useState<number>(0);
  const [dueDate, setDueDate] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = () => {
    setLoading(true);
    api.get('/admin/students-fees')
      .then(res => setStudents(res.data.data || []))
      .catch(() => toast.error('Failed to load students fee data.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const openAssignModal = (student: any) => {
    setCurrentStudent(student);
    setAmount(getStandardFee(student.class));
    // Default due date to 30 days from now
    const d = new Date();
    d.setDate(d.getDate() + 30);
    setDueDate(d.toISOString().split('T')[0]);
    setModalOpen(true);
  };

  const openEditModal = (student: any) => {
    setCurrentStudent(student);
    setAmount(Number(student.pending_amount));
    // When editing, due date isn't directly updatable via the current PUT /admin/fees/:id route but we can just use the provided amount.
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (currentStudent.fee_id) {
        // Update existing fee
        await api.put(`/admin/fees/${currentStudent.fee_id}`, { amount });
        toast.success("Pending fee updated successfully.");
      } else {
        // Assign new fee
        await api.post('/admin/fees', {
          student_id: currentStudent.student_id,
          fee_type: 'Annual Fee',
          amount,
          due_date: dueDate
        });
        toast.success("Annual fee assigned successfully.");
      }
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Action failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-8 animate-fade-in relative">
      <div>
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Fee Management</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage pending fees based on student grades.</p>
      </div>

      <div className="card overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <BanknotesIcon className="w-5 h-5 text-amber-500" />
            <h3 className="font-display font-bold text-gray-900 dark:text-white">Student Fees List</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700">
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">Student Name</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">Class</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">Standard Fee</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">Current Pending Fee</th>
                <th className="text-center px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
              {students.map((st, i) => {
                const stdFee = getStandardFee(st.class);
                return (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors bg-white dark:bg-slate-900">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-gray-900 dark:text-white">{st.student_name}</div>
                      <div className="text-xs text-gray-500">Roll No: {st.roll_no || 'N/A'}</div>
                    </td>
                    <td className="px-5 py-4 text-gray-600 dark:text-gray-400">
                      Standard {st.class}
                    </td>
                    <td className="px-5 py-4 font-medium text-gray-700 dark:text-gray-300">
                      ₹{stdFee.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-4">
                      {st.fee_id ? (
                        <span className="font-bold text-rose-600 dark:text-rose-400">
                          ₹{Number(st.pending_amount).toLocaleString('en-IN')}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">None Assigned</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-center">
                      {!st.fee_id ? (
                        <button onClick={() => openAssignModal(st)} className="btn-primary py-1.5 px-3 text-xs bg-amber-600 hover:bg-amber-700 mx-auto border-transparent shadow-md">
                          <PlusIcon className="w-3.5 h-3.5 inline mr-1" /> Assign Fee
                        </button>
                      ) : (
                        <button onClick={() => openEditModal(st)} className="btn-secondary py-1.5 px-3 text-xs mx-auto text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                          <PencilSquareIcon className="w-3.5 h-3.5 inline mr-1" /> Update
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {students.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-500">No students found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && currentStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-700">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800">
              <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">
                {currentStudent.fee_id ? 'Update Pending Fee' : 'Assign Annual Fee'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Student</label>
                <div className="px-3 py-2 bg-gray-50 dark:bg-slate-800 rounded-lg text-sm text-gray-600 dark:text-gray-400">
                  {currentStudent.student_name} (Class {currentStudent.class})
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (₹)</label>
                <input
                  type="number" required min="0" step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full input-field"
                />
                {!currentStudent.fee_id && (
                  <p className="text-xs text-amber-600 mt-1">Prefilled with standard fee format for Class {currentStudent.class}.</p>
                )}
              </div>

              {!currentStudent.fee_id && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
                  <input
                    type="date" required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full input-field"
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary px-5">Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary px-5 bg-amber-600 hover:bg-amber-700">
                  {submitting ? 'Saving...' : 'Save Fee Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
