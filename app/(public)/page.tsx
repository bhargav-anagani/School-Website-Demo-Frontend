'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import {
  AcademicCapIcon, UserGroupIcon, TrophyIcon, BuildingLibraryIcon,
  ArrowRightIcon, StarIcon, ChevronRightIcon, BellAlertIcon,
} from '@heroicons/react/24/outline';

const stats = [
  { label: 'Students Enrolled', value: '3,500+', icon: UserGroupIcon, color: 'from-blue-500 to-cyan-500' },
  { label: 'Expert Faculty',    value: '180+',   icon: AcademicCapIcon, color: 'from-violet-500 to-purple-600' },
  { label: 'Years of Excellence',value: '26+',   icon: TrophyIcon,      color: 'from-amber-500 to-orange-500' },
  { label: 'Courses Offered',   value: '50+',    icon: BuildingLibraryIcon, color: 'from-emerald-500 to-teal-500' },
];

const testimonials = [
  { name: 'Anjali Sharma', role: 'Alumni, Class of 2022', text: 'IHS shaped my personality and gave me the confidence to pursue engineering at a top university. The teachers here truly care.', rating: 5 },
  { name: 'Rahul Mehta',   role: 'Parent',                text: 'The transparency with regular updates and the parent portal keeps me fully informed about my child\'s progress.', rating: 5 },
  { name: 'Priya Nair',    role: 'Student, Grade 11',     text: 'The labs, library and sports facilities here are world-class. I love coming to school every day.', rating: 5 },
];

export default function HomePage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    api.get('/public/announcements').then(r => setAnnouncements(r.data.data || [])).catch(() => {});
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center bg-hero">
        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent-600/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-8 animate-fade-in">
            <StarIcon className="w-4 h-4 text-gold-400" />
            <span className="text-sm text-white/90 font-medium">Ranked #1 in the Region for Academic Excellence</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-black text-white leading-tight mb-6 animate-slide-up">
            Shape Your Future at<br />
            <span className="bg-gradient-to-r from-gold-400 to-amber-300 bg-clip-text text-transparent">
              International High School
            </span>
          </h1>

          <p className="text-xl text-white/75 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Where knowledge meets character. Preparing tomorrow's leaders with world-class academics, technology, and values since 1998.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link href="/admissions" className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 hover:bg-primary-50 font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-base">
              Apply for Admission
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
            <Link href="/about" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 font-semibold px-8 py-4 rounded-2xl transition-all duration-300 text-base">
              Learn More
              <ChevronRightIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L1440 80L1440 30C1200 70 900 0 720 30C540 60 240 10 0 40L0 80Z" className="fill-white dark:fill-slate-950" />
          </svg>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="card p-6 text-center group cursor-default">
                <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <s.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-3xl font-display font-black text-gray-900 dark:text-white mb-1">{s.value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ANNOUNCEMENTS ─────────────────────────────────────── */}
      {announcements.length > 0 && (
        <section className="py-16 bg-gray-50 dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-950 rounded-xl flex items-center justify-center">
                  <BellAlertIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Latest Announcements</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Stay updated with school news</p>
                </div>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {announcements.slice(0, 3).map((a) => (
                <div key={a.id} className="card p-6">
                  <div className="text-xs text-primary-600 dark:text-primary-400 font-semibold uppercase tracking-wide mb-2">
                    {new Date(a.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <h3 className="font-display font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{a.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">{a.content}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── WHY IHS ───────────────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading">Why Choose <span className="text-gradient">International High School?</span></h2>
            <p className="section-sub mx-auto">We provide an environment where every student can thrive academically, socially, and personally.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'World-Class Curriculum', desc: 'CBSE-aligned curriculum enhanced with global perspectives, critical thinking, and 21st-century skills.', icon: '📚', color: 'bg-blue-50 dark:bg-blue-950' },
              { title: 'Digital Learning Labs', desc: 'State-of-the-art computer labs, smart classrooms, and coding bootcamps integrated into daily learning.', icon: '💻', color: 'bg-violet-50 dark:bg-violet-950' },
              { title: 'Holistic Development', desc: 'Sports, arts, music, drama, and leadership programs that nurture every dimension of student growth.', icon: '🎭', color: 'bg-amber-50 dark:bg-amber-950' },
              { title: 'Expert Faculty',      desc: '180+ dedicated educators with advanced degrees and decades of experience in student mentorship.', icon: '👩‍🏫', color: 'bg-emerald-50 dark:bg-emerald-950' },
              { title: 'Safe & Inclusive',    desc: 'A caring, zero-tolerance environment where every student feels safe, respected, and celebrated.', icon: '🤝', color: 'bg-pink-50 dark:bg-pink-950' },
              { title: 'Parent Partnership',  desc: 'Real-time ERP portal keeps parents fully informed about academics, attendance, fees, and growth.', icon: '👨‍👩‍👧', color: 'bg-cyan-50 dark:bg-cyan-950' },
            ].map((f) => (
              <div key={f.title} className="card p-7 group">
                <div className={`text-4xl mb-4 w-14 h-14 ${f.color} rounded-2xl flex items-center justify-center`}>{f.icon}</div>
                <h3 className="font-display font-bold text-gray-900 dark:text-white text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────── */}
      <section className="py-20 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-heading">What Our Community Says</h2>
            <p className="section-sub mx-auto">Real stories from students, parents, and alumni.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="card p-7">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <StarIcon key={i} className="w-4 h-4 text-gold-500 fill-gold-500" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">{t.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="py-20 bg-hero text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-display font-black text-white mb-4">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-white/75 text-lg mb-8">
            Applications for 2025-26 are open. Secure your child's future at International High School.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/admissions" className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 hover:bg-primary-50 font-bold px-8 py-4 rounded-2xl shadow-lg transition-all hover:scale-105">
              Apply Now <ArrowRightIcon className="w-5 h-5" />
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 border border-white/40 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-2xl transition-all">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
