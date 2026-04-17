'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { BanknotesIcon, CheckCircleIcon, ClockIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

declare global { interface Window { Razorpay: any; } }

export default function ParentFeesPage() {
  const [fees,    setFees]    = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying,  setPaying]  = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    api.get('/parent/child/fees').then(r => {
      setFees(r.data.data || []);
      setSummary(r.data.summary);
    }).catch(() => toast.error('Failed to load fees.')).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const loadRazorpay = () =>
    new Promise<boolean>(resolve => {
      if (window.Razorpay) { resolve(true); return; }
      const s = document.createElement('script');
      s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      s.onload  = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });

  const payFee = async (fee: any) => {
    setPaying(fee.id);
    try {
      const loaded = await loadRazorpay();
      if (!loaded) { toast.error('Payment gateway unavailable. Try again.'); return; }

      const { data } = await api.post('/parent/fees/create-order', { fee_id: fee.id });
      const order = data.data;

      const options = {
        key:         order.key_id,
        amount:      order.amount,
        currency:    order.currency,
        name:        'International High School',
        description: order.fee_type,
        order_id:    order.order_id,
        handler: async (response: any) => {
          try {
            await api.post('/parent/fees/verify-payment', {
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              fee_id: fee.id,
            });
            toast.success('Payment successful! ✅');
            load();
          } catch { toast.error('Payment verification failed. Contact admin.'); }
        },
        prefill:  { name: '', email: '', contact: '' },
        theme:    { color: '#10b981' }, 
        modal:    { ondismiss: () => setPaying(null) },
      };

      const rp = new window.Razorpay(options);
      rp.on('payment.failed', () => { toast.error('Payment failed. Please try again.'); setPaying(null); });
      rp.open();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to initiate payment.');
    } finally {
      setPaying(null);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Fees & Payments</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">View and pay your child's school fees securely via Razorpay.</p>
      </div>

      {/* Summary */}
      {summary && (
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="card p-6 border-l-4 border-rose-500">
            <div className="flex items-center gap-3 mb-2">
              <ExclamationCircleIcon className="w-5 h-5 text-rose-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Pending</span>
            </div>
            <div className="text-3xl font-display font-black text-rose-600 dark:text-rose-400">
              ₹{Number(summary.total_due).toLocaleString('en-IN')}
            </div>
          </div>
          <div className="card p-6 border-l-4 border-emerald-500">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Paid</span>
            </div>
            <div className="text-3xl font-display font-black text-emerald-600 dark:text-emerald-400">
              ₹{Number(summary.total_paid).toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      )}

      {/* Fee Records */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-slate-700 flex items-center gap-3">
          <BanknotesIcon className="w-5 h-5 text-emerald-500" />
          <h3 className="font-display font-bold text-gray-900 dark:text-white">Fee Records</h3>
        </div>
        {fees.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-5xl mb-4">💳</div>
            <p className="text-gray-400 dark:text-gray-500">No fee records found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700">
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">Fee Type</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">Amount</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">Due Date</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">Status</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
                {fees.map(fee => (
                  <tr key={fee.id} className="bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-4 font-medium text-gray-900 dark:text-white">{fee.fee_type}</td>
                    <td className="px-5 py-4 font-bold text-gray-900 dark:text-white">
                      ₹{Number(fee.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                      <ClockIcon className="w-4 h-4" />
                      {new Date(fee.due_date).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                    </td>
                    <td className="px-5 py-4">
                      {fee.paid ? (
                        <span className="badge bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400">
                          ✓ Paid
                        </span>
                      ) : new Date(fee.due_date) < new Date() ? (
                        <span className="badge bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400">
                          Overdue
                        </span>
                      ) : (
                        <span className="badge bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {!fee.paid ? (
                        <button
                          onClick={() => payFee(fee)}
                          disabled={paying === fee.id}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors py-1.5 px-4 text-xs font-bold"
                        >
                          {paying === fee.id ? (
                            <span className="flex items-center gap-1.5">
                              <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                              </svg>
                              Processing...
                            </span>
                          ) : 'Pay Now'}
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          Paid on {fee.paid_date ? new Date(fee.paid_date).toLocaleDateString('en-IN') : '—'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
        🔒 Payments are securely processed via Razorpay. Your card details are never stored on our servers.
      </p>
    </div>
  );
}
