'use client';
import { useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { PhoneIcon, EnvelopeIcon, MapPinIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function ContactPage() {
  const [form, setForm]       = useState({ name:'', email:'', phone:'', subject:'', message:'' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/public/contact', form);
      setSent(true);
      toast.success('Message sent! We\'ll get back to you soon.');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-hero text-white py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl sm:text-6xl font-display font-black mb-4">Contact Us</h1>
          <p className="text-xl text-white/75 max-w-2xl mx-auto">
            We're here to help. Reach out for admissions, queries, or feedback.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <h2 className="section-heading mb-8">Get In <span className="text-gradient">Touch</span></h2>
              <div className="space-y-6 mb-10">
                {[
                  { icon: MapPinIcon, title: 'Address', detail: '123 Education Avenue, Knowledge City\nHyderabad, Telangana — 500001', color: 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400' },
                  { icon: PhoneIcon, title: 'Phone', detail: '+91 98765 43210\n+91 40-2345 6789', color: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' },
                  { icon: EnvelopeIcon, title: 'Email', detail: 'info@ihs.edu.in\nadmissions@ihs.edu.in', color: 'bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400' },
                  { icon: ClockIcon, title: 'Office Hours', detail: 'Mon – Sat: 8:00 AM – 4:00 PM\nSunday: Closed', color: 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400' },
                ].map(c => (
                  <div key={c.title} className="card p-5 flex gap-4">
                    <div className={`w-12 h-12 rounded-xl ${c.color} flex items-center justify-center shrink-0`}>
                      <c.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{c.title}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm whitespace-pre-line">{c.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Google Maps Embed */}
              <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-slate-700 h-64">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243646.90521629478!2d78.24323074999999!3d17.4126329!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99daeaebd2c7%3A0xae93b78392bafbc2!2sHyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1698000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="International High School Location"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="section-heading mb-8">Send Us a <span className="text-gradient">Message</span></h2>

              {sent ? (
                <div className="card p-12 text-center">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircleIcon className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-3">Message Received!</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">Our team will respond within 24–48 hours.</p>
                  <button onClick={() => { setSent(false); setForm({ name:'', email:'', phone:'', subject:'', message:'' }); }} className="btn-secondary">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="card p-8 space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name *</label>
                      <input name="name" value={form.name} onChange={handle} required className="input" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                      <input name="phone" value={form.phone} onChange={handle} className="input" placeholder="+91 98765 43210" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address *</label>
                    <input type="email" name="email" value={form.email} onChange={handle} required className="input" placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                    <select name="subject" value={form.subject} onChange={handle} className="input">
                      <option value="">Select a subject</option>
                      <option>Admissions Enquiry</option>
                      <option>Fee Related</option>
                      <option>Academic Query</option>
                      <option>Technical Support</option>
                      <option>General Inquiry</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message *</label>
                    <textarea name="message" value={form.message} onChange={handle} required rows={5}
                      className="input resize-none" placeholder="Write your message here..." />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full text-base py-4">
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Sending...
                      </span>
                    ) : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
