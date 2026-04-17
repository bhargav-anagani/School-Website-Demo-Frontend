import type { Metadata } from 'next';
import { AcademicCapIcon, HeartIcon, LightBulbIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'About Us — International High School',
  description: 'Learn about the history, vision, mission, and leadership of International High School.',
};

const values = [
  { icon: AcademicCapIcon, title: 'Academic Excellence', desc: 'We hold ourselves to the highest standards in teaching, learning, and student achievement.', color: 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400' },
  { icon: HeartIcon,       title: 'Integrity & Ethics',  desc: 'We nurture honest, responsible citizens who lead with character and compassion.', color: 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400' },
  { icon: LightBulbIcon,   title: 'Innovation',          desc: 'We encourage curiosity, creativity, and critical thinking in every learner.', color: 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400' },
  { icon: GlobeAltIcon,    title: 'Global Citizenship',  desc: 'We prepare students to thrive in a diverse, interconnected world.', color: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400' },
];

const leadership = [
  { name: 'Dr. Rajendra Kumar', role: 'Principal', initials: 'RK', message: "At International High School, we believe every child is unique and talented. Our mission is to create an environment where curiosity thrives, character is built, and every student discovers their potential." },
  { name: 'Mrs. Sunitha Rao',   role: 'Vice Principal', initials: 'SR', message: 'We are committed to providing a safe, nurturing, and challenging learning environment that prepares students not just for exams, but for life.' },
];

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-hero text-white py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary-300/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-sm text-white/90 font-medium">Est. 1998 · 26 Years of Excellence</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-black mb-4">About Our School</h1>
          <p className="text-xl text-white/75 max-w-2xl mx-auto leading-relaxed">
            A legacy of excellence, a commitment to character, and a vision for the future.
          </p>
        </div>
      </section>

      {/* History */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="section-heading mb-5">Our <span className="text-gradient">Story</span></h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Founded in 1998 by a group of visionary educators, International High School began with a simple mission: to provide world-class education rooted in Indian values. What started as a small institution with 200 students has grown into one of the region's most respected schools, serving over 3,500 students across grades 1 through 12.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Over the decades, IHS has consistently achieved top results in Board examinations, produced national-level sports champions, and built alumni networks across the globe — from Silicon Valley to the Indian Space Research Organisation.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Today, IHS embraces a Digital School Ecosystem — combining traditional academic rigour with modern EdTech, coding bootcamps, AI literacy, and a transparent ERP portal that keeps parents fully informed.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { v:'1998', l:'Year Founded' }, { v:'3500+', l:'Students' },
                { v:'180+', l:'Faculty Members' }, { v:'98%', l:'Board Pass Rate' },
              ].map(s => (
                <div key={s.l} className="card p-6 text-center">
                  <div className="text-3xl font-display font-black text-primary-600 dark:text-primary-400 mb-1">{s.v}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card p-8 border-l-4 border-primary-600">
              <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">🎯 Our Vision</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                To be a globally recognised institution that produces compassionate, innovative, and responsible leaders who contribute meaningfully to society.
              </p>
            </div>
            <div className="card p-8 border-l-4 border-accent-600">
              <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">🚀 Our Mission</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                To deliver a holistic education experience that blends academic rigour with character development, advanced technology, and cultural sensitivity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-heading">Our Core <span className="text-gradient">Values</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="card p-6 text-center group">
                <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl ${v.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <v.icon className="w-7 h-7" />
                </div>
                <h3 className="font-display font-bold text-gray-900 dark:text-white mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-heading">Leadership <span className="text-gradient">Team</span></h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {leadership.map((l) => (
              <div key={l.name} className="card p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center text-white font-bold text-xl">
                    {l.initials}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-gray-900 dark:text-white text-lg">{l.name}</h3>
                    <p className="text-primary-600 dark:text-primary-400 text-sm font-medium">{l.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed italic">"{l.message}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-heading">World-Class <span className="text-gradient">Infrastructure</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {['Smart Classrooms', 'Science Laboratories', 'Computer Labs & Coding Centre', 'Olympic Sports Ground', 'Fully-Stocked Library', 'Performing Arts Auditorium', 'Medical & Counselling Centre', 'Dining Hall & Cafeteria', 'School Bus Fleet (GPS Tracked)'].map((item) => (
              <div key={item} className="flex items-center gap-3 p-4 card">
                <span className="text-primary-500 font-bold text-lg">✓</span>
                <span className="text-gray-700 dark:text-gray-300 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
