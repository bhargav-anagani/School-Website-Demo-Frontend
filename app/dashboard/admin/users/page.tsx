'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import {
  UsersIcon, UserIcon, AcademicCapIcon, BanknotesIcon,
  CalendarDaysIcon, MagnifyingGlassIcon, PlusIcon,
  CheckCircleIcon, XCircleIcon, ClockIcon, InformationCircleIcon
} from '@heroicons/react/24/outline';

type Tab = 'students' | 'faculty' | 'parents';

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState<Tab>('students');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showSalaryModal, setShowSalaryModal] = useState<any>(null);
  const [salaryAmount, setSalaryAmount] = useState('45000');

  const fetchData = async (tab: Tab) => {
    setLoading(true);
    try {
      // Map frontend tab name to backend role query
      const role = tab === 'faculty' ? 'teacher' : tab === 'students' ? 'student' : 'parent';
      const r = await api.get(`/admin/users/detailed?role=${role}`);
      setData(r.data.data);
    } catch (err) {
      toast.error('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const handlePaySalary = async () => {
    if (!showSalaryModal) return;
    const month = new Date().toLocaleString('en-US', { month: 'long' });
    const year = new Date().getFullYear();
    try {
      await api.post('/admin/salary/pay', {
        teacher_id: showSalaryModal.teacher_id,
        amount: Number(salaryAmount),
        month,
        year,
        remarks: 'Monthly salary credited by Admin'
      });
      toast.success(`Salary paid to ${showSalaryModal.name}`);
      setShowSalaryModal(null);
      fetchData('faculty');
    } catch (err) {
      toast.error('Payment failed.');
    }
  };

  const filteredData = data.filter(item => 
    item.name?.toLowerCase().includes(search.toLowerCase()) || 
    item.email?.toLowerCase().includes(search.toLowerCase()) ||
    item.employee_id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-display font-black text-gray-900 dark:text-white">User Management</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Monitor and manage all school stakeholders</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-rose-200 dark:shadow-none">
          <PlusIcon className="w-5 h-5" /> Add New User
        </button>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-gray-100 dark:bg-slate-800 rounded-2xl w-fit">
        {[
          { id: 'students', label: 'Students', icon: AcademicCapIcon },
          { id: 'faculty', label: 'Faculty', icon: UserIcon },
          { id: 'parents', label: 'Parents', icon: UsersIcon },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as Tab)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === t.id
                ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Search & Stats */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
          />
        </div>
        <div className="flex gap-4">
           <div className="px-6 py-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl">
              <span className="text-xs text-gray-500 block">Total {activeTab}</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">{filteredData.length}</span>
           </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700">
                <th className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300">Name / Identity</th>
                {activeTab === 'students' && (
                  <>
                    <th className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300">Grade & Sec</th>
                    <th className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300">Class Teacher (Mentor)</th>
                  </>
                )}
                {activeTab === 'faculty' && (
                  <>
                    <th className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300">Subject</th>
                    <th className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300 text-center">Current Month Salary</th>
                  </>
                )}
                {activeTab === 'parents' && (
                  <>
                    <th className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300">Relationship</th>
                    <th className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300">Child Enrolled</th>
                  </>
                )}
                <th className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
              {loading ? (
                <tr>
                   <td colSpan={5} className="py-20 text-center">
                      <div className="inline-block animate-spin w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full" />
                   </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                   <td colSpan={5} className="py-20 text-center text-gray-400">No records found.</td>
                </tr>
              ) : (
                filteredData.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800 rounded-xl flex items-center justify-center font-bold text-gray-500">
                          {item.name?.[0]}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.email || item.employee_id || item.phone}</p>
                        </div>
                      </div>
                    </td>

                    {activeTab === 'students' && (
                      <>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-bold uppercase">
                            Grade {item.class} - {item.section}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                             <UserIcon className="w-4 h-4 text-gray-400" />
                             <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{item.mentor_name || 'Not Assigned'}</span>
                          </div>
                        </td>
                      </>
                    )}

                    {activeTab === 'faculty' && (
                      <>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 rounded-lg text-xs font-bold">
                            {item.subject || 'Faculty'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {item.salary_status === 'paid' ? (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-bold">
                               <CheckCircleIcon className="w-4 h-4" /> Paid
                            </div>
                          ) : (
                            <button 
                              onClick={() => setShowSalaryModal(item)}
                              className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded-full text-xs font-bold hover:bg-amber-200 dark:hover:bg-amber-900/60 transition-all"
                            >
                               <ClockIcon className="w-4 h-4" /> Pending
                            </button>
                          )}
                        </td>
                      </>
                    )}

                    {activeTab === 'parents' && (
                      <>
                        <td className="px-6 py-4 capitalize text-gray-600 dark:text-gray-400 font-medium">
                          {item.relation}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                             <AcademicCapIcon className="w-4 h-4 text-rose-500" />
                             <div>
                               <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{item.child_name}</p>
                               <p className="text-[10px] text-gray-400">Grade {item.child_class}</p>
                             </div>
                          </div>
                        </td>
                      </>
                    )}

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {activeTab === 'faculty' && (
                           <button className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all" title="View Attendance">
                              <CalendarDaysIcon className="w-5 h-5" />
                           </button>
                        )}
                        <button className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all">
                          <InformationCircleIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Salary Modal */}
      {showSalaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md p-8 shadow-2xl animate-scale-in">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/40 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                <BanknotesIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-display font-black text-gray-900 dark:text-white">Pay Monthly Salary</h3>
              <p className="text-sm text-gray-500 mt-2">Processing payment for <b>{showSalaryModal.name}</b> for {new Date().toLocaleString('en-US', { month: 'long' })} {new Date().getFullYear()}.</p>
              
              <div className="space-y-4 mt-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Base Amount (₹)</label>
                    <input 
                      type="number" 
                      value={salaryAmount} 
                      onChange={(e) => setSalaryAmount(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 text-xl font-black text-gray-900 dark:text-white outline-none ring-2 ring-transparent focus:ring-rose-500/20"
                    />
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Standard structural deductions (PF/Tax) will be applied by bank automatically.</p>
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-8">
                <button 
                  onClick={() => setShowSalaryModal(null)}
                  className="px-6 py-4 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handlePaySalary}
                  className="px-6 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-sm font-bold shadow-lg shadow-rose-200 dark:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  <BanknotesIcon className="w-5 h-5" /> Pay Salary
                </button>
              </div>
          </div>
        </div>
      )}
    </div>
  );
}
