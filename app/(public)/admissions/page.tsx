'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import {
  UserIcon, CalendarIcon, AcademicCapIcon, PhoneIcon,
  EnvelopeIcon, HomeIcon, CheckCircleIcon, BriefcaseIcon,
  DocumentArrowUpIcon
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
  const [formType, setFormType]   = useState('admission'); // 'admission' or 'career'
  
  const [form, setForm] = useState({
    applicant_name: '', dob: '', class_applied: '',
    parent_name: '', email: '', phone: '',
    address: '', previous_school: '', resume_url: ''
  });

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/public/admissions', { ...form, form_type: formType });
      setSubmitted(true);
      toast.success(formType === 'career' ? 'Application submitted!' : 'Application submitted successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-hero text-white py-20 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h1 className="text-4xl sm:text-6xl font-display font-black mb-4">
            {formType === 'career' ? 'Join Our Team' : 'Admissions 2025–26'}
          </h1>
          <p className="text-xl text-white/75 max-w-2xl mx-auto">
            {formType === 'career' ? 'Be part of an institution that values excellence and innovation.' : 'Applications are now open. Join the IHS family and unlock your potential.'}
          </p>
        </div>
      </section>

      {/* Form Type Selector */}
      <div className="max-w-xl mx-auto px-4 -mt-8 relative z-20">
         <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 p-2 flex gap-2">
            <button 
              onClick={() => { setFormType('admission'); setSubmitted(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                formType === 'admission' ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800'
              }`}
            >
              <AcademicCapIcon className="w-5 h-5" /> Student Admission
            </button>
            <button 
              onClick={() => { setFormType('career'); setSubmitted(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                formType === 'career' ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800'
              }`}
            >
              <BriefcaseIcon className="w-5 h-5" /> Career Application
            </button>
         </div>
      </div>

      {formType === 'admission' && (
        <>
          {/* Process Steps */}
          <section className="py-14 bg-gray-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
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

          {/* Fee Structure */}
          <section className="py-16 bg-white dark:bg-slate-950">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid md:grid-cols-1 gap-12 max-w-4xl mx-auto">
                 <div>
                    <h2 className="section-heading mb-6 text-center">Fee <span className="text-gradient">Structure</span></h2>
                    <div className="card overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-primary-600 text-white">
                            <th className="text-left px-5 py-4">Class</th>
                            <th className="text-left px-5 py-4">Tuition (Annual)</th>
                            <th className="text-left px-5 py-4">Admission</th>
                            <th className="text-left px-5 py-4">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {feeStructure.map((f, i) => (
                            <tr key={f.class} className={`border-b border-gray-100 dark:border-slate-700 ${i % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-gray-50 dark:bg-slate-800/50'}`}>
                              <td className="px-5 py-4 font-bold text-gray-900 dark:text-white">{f.class}</td>
                              <td className="px-5 py-4 text-gray-600 dark:text-gray-400">{f.tuition}</td>
                              <td className="px-5 py-4 text-gray-600 dark:text-gray-400">{f.admission}</td>
                              <td className="px-5 py-4 font-black text-primary-600 dark:text-primary-400">{f.total}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <p className="text-xs text-gray-400 p-4 font-bold uppercase tracking-widest">* Fees are per academic year. Transportation charged separately.</p>
                    </div>
                 </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Application Form */}
      <section className="py-16 bg-gray-50 dark:bg-slate-900" id="apply">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="section-heading">{formType === 'career' ? 'Career' : 'Online'} <span className="text-gradient">Application</span></h2>
            <p className="section-sub mx-auto mt-3">
              {formType === 'career' ? 'Join our elite team of educators and professionals.' : 'Fill out the form below to begin your admission journey.'}
            </p>
          </div>

          {submitted ? (
            <div className="card p-12 text-center animate-fade-in shadow-2xl border-2 border-green-500/20">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircleIcon className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="font-display font-black text-2xl text-gray-900 dark:text-white mb-3">Application Submitted!</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">
                {formType === 'career' ? "Thank you for your interest! Our HR team will review your application and contact you if your profile matches our requirements." : "Thank you! We've received your application. Our admissions team will contact you within 3-5 working days."}
              </p>
              <button onClick={() => setSubmitted(false)} className="btn-primary px-8 py-3">
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="card p-8 space-y-6 shadow-2xl relative border-t-8 border-primary-600">
               <div className="absolute top-0 right-0 p-4">
                 <div className={`w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600`}>
                   {formType === 'career' ? <BriefcaseIcon className="w-6 h-6" /> : <AcademicCapIcon className="w-6 h-6" />}
                 </div>
               </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                    {formType === 'career' ? 'Full Name' : 'Student Name'} *
                  </label>
                  <input name="applicant_name" value={form.applicant_name} onChange={handle} required
                    className="input-field" placeholder={formType === 'career' ? "Your full name" : "Applicant full name"} />
                </div>
                {formType === 'admission' && (
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Date of Birth</label>
                    <input type="date" name="dob" value={form.dob} onChange={handle}
                      className="input-field" />
                  </div>
                )}
              </div>

              {formType === 'admission' ? (
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Class Applying For *</label>
                  <select name="class_applied" value={form.class_applied} onChange={handle} required className="input-field">
                    <option value="">Select Grade</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={`${i + 1}`}>Grade {i + 1}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Position Applied For *</label>
                  <select name="class_applied" value={form.class_applied} onChange={handle} required className="input-field">
                    <option value="">Select Position</option>
                    <option>Primary Teacher (PRT)</option>
                    <option>Secondary Teacher (TGT)</option>
                    <option>Sr. Secondary Teacher (PGT)</option>
                    <option>Administrative Staff</option>
                    <option>Sports Instructor</option>
                    <option>Other Support Staff</option>
                  </select>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-6">
                {formType === 'admission' && (
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Parent / Guardian Name *</label>
                    <input name="parent_name" value={form.parent_name} onChange={handle} required
                      className="input-field" placeholder="Father / Mother / Guardian" />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Phone Number *</label>
                  <input name="phone" value={form.phone} onChange={handle} required
                    className="input-field" placeholder="+91 98765 43210" />
                </div>
                {formType === 'career' && (
                   <div>
                     <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Email Address *</label>
                     <input type="email" name="email" value={form.email} onChange={handle} required
                       className="input-field" placeholder="your@email.com" />
                   </div>
                )}
              </div>

              {formType === 'admission' && (
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Email Address *</label>
                  <input type="email" name="email" value={form.email} onChange={handle} required
                    className="input-field" placeholder="parent@email.com" />
                </div>
              )}

              {formType === 'career' && (
                 <div>
                   <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                     <DocumentArrowUpIcon className="w-4 h-4 inline mr-1" /> Resume URL / Portfolio Link
                   </label>
                   <input name="resume_url" value={form.resume_url} onChange={handle}
                     className="input-field" placeholder="https://linkedin.com/in/... or Google Drive link" />
                 </div>
              )}

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                  {formType === 'career' ? 'Current/Latest Organization' : 'Previous School (if applicable)'}
                </label>
                <input name="previous_school" value={form.previous_school} onChange={handle}
                  className="input-field" placeholder="Institution name" />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Residential Address</label>
                <textarea name="address" value={form.address} onChange={handle} rows={3}
                  className="input-field resize-none" placeholder="Full address" />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full text-base py-4 shadow-xl">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                    Submitting...
                  </span>
                ) : `Submit ${formType === 'career' ? 'Application' : 'Admission Inquiry'}`}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
