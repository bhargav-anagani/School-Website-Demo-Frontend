'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import {
  UserIcon, CalendarIcon, AcademicCapIcon, PhoneIcon,
  EnvelopeIcon, HomeIcon, CheckCircleIcon,
} from '@heroicons/react/24/outline';

const feeStructure = [
  { class: 'Grade 1–5',   tuition: '₹45,000', admission: '₹10,000', total: '₹55,000' },
  { class: 'Grade 6–8',   tuition: '₹55,000', admission: '₹10,000', total: '₹65,000' },
  { class: 'Grade 9–10',  tuition: '₹65,000', admission: '₹12,000', total: '₹77,000' },
  { class: 'Grade 11–12', tuition: '₹75,000', admission: '₹15,000', total: '₹90,000' },
];

const steps = ['Eligibility', 'Application', 'Review', 'Admission'];

export default function AdmissionsPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [form, setForm] = useState({
    applicant_name: '', dob: '', class_applied: '',
    parent_name: '', email: '', phone: '',
    address: '', previous_school: '',
  });

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/public/admissions', form);
      setSubmitted(true);
      toast.success('Application submitted successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-hero text-white py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl sm:text-6xl font-display font-black mb-4">Admissions 2025–26</h1>
          <p className="text-xl text-white/75 max-w-2xl mx-auto">Applications are now open. Join the IHS family and unlock your potential.</p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-14 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="section-heading text-center mb-10">Admission <span className="text-gradient">Process</span></h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                    {i + 1}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">{s}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden sm:block w-16 h-0.5 bg-primary-200 dark:bg-primary-800 mx-1 mb-5" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="py-16 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="section-heading mb-6">Eligibility <span className="text-gradient">Criteria</span></h2>
              <ul className="space-y-4">
                {[
                  { grade: 'Grade 1', age: '5–6 years as of 1st June 2025' },
                  { grade: 'Grade 6', age: 'Passed Grade 5 with 60%+' },
                  { grade: 'Grade 9', age: 'Passed Grade 8 with 55%+' },
                  { grade: 'Grade 11 (Science)', age: 'Passed Grade 10 with Science 70%+' },
                  { grade: 'Grade 11 (Commerce)', age: 'Passed Grade 10 with 60%+' },
                  { grade: 'Grade 11 (Humanities)', age: 'Passed Grade 10 with 50%+' },
                ].map(e => (
                  <li key={e.grade} className="flex gap-3 p-4 card">
                    <CheckCircleIcon className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-gray-900 dark:text-white">{e.grade}: </span>
                      <span className="text-gray-600 dark:text-gray-400">{e.age}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Fee Structure */}
            <div>
              <h2 className="section-heading mb-6">Fee <span className="text-gradient">Structure</span></h2>
              <div className="card overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-primary-600 text-white">
                      <th className="text-left px-5 py-3">Class</th>
                      <th className="text-left px-5 py-3">Tuition (Annual)</th>
                      <th className="text-left px-5 py-3">Admission</th>
                      <th className="text-left px-5 py-3">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feeStructure.map((f, i) => (
                      <tr key={f.class} className={`border-b border-gray-100 dark:border-slate-700 ${i % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-gray-50 dark:bg-slate-800/50'}`}>
                        <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">{f.class}</td>
                        <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{f.tuition}</td>
                        <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{f.admission}</td>
                        <td className="px-5 py-3 font-bold text-primary-600 dark:text-primary-400">{f.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-xs text-gray-400 dark:text-gray-500 p-4">* Fees are per academic year. Transportation and uniforms charged separately.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 bg-gray-50 dark:bg-slate-900" id="apply">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="section-heading">Online <span className="text-gradient">Application</span></h2>
            <p className="section-sub mx-auto mt-3">Fill out the form below to begin your admission journey.</p>
          </div>

          {submitted ? (
            <div className="card p-12 text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircleIcon className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="font-display font-bold text-2xl text-gray-900 dark:text-white mb-3">Application Submitted!</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Thank you! We've received your application. Our admissions team will contact you within 3-5 working days.
              </p>
              <button onClick={() => setSubmitted(false)} className="btn-secondary">
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="card p-8 space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <UserIcon className="w-4 h-4 inline mr-1" />Student Name *
                  </label>
                  <input name="applicant_name" value={form.applicant_name} onChange={handle} required
                    className="input" placeholder="Full name of applicant" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <CalendarIcon className="w-4 h-4 inline mr-1" />Date of Birth
                  </label>
                  <input type="date" name="dob" value={form.dob} onChange={handle}
                    className="input" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <AcademicCapIcon className="w-4 h-4 inline mr-1" />Class Applying For *
                </label>
                <select name="class_applied" value={form.class_applied} onChange={handle} required className="input">
                  <option value="">Select Class</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={`${i + 1}`}>Grade {i + 1}</option>
                  ))}
                </select>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <UserIcon className="w-4 h-4 inline mr-1" />Parent / Guardian Name *
                  </label>
                  <input name="parent_name" value={form.parent_name} onChange={handle} required
                    className="input" placeholder="Father / Mother / Guardian" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <PhoneIcon className="w-4 h-4 inline mr-1" />Phone Number *
                  </label>
                  <input name="phone" value={form.phone} onChange={handle} required
                    className="input" placeholder="+91 98765 43210" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <EnvelopeIcon className="w-4 h-4 inline mr-1" />Email Address *
                </label>
                <input type="email" name="email" value={form.email} onChange={handle} required
                  className="input" placeholder="parent@email.com" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <HomeIcon className="w-4 h-4 inline mr-1" />Previous School (if applicable)
                </label>
                <input name="previous_school" value={form.previous_school} onChange={handle}
                  className="input" placeholder="Name of previous school" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Residential Address</label>
                <textarea name="address" value={form.address} onChange={handle} rows={3}
                  className="input resize-none" placeholder="Full residential address" />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full text-base py-4">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Submitting...
                  </span>
                ) : 'Submit Application'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
