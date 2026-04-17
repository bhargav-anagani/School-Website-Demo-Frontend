import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Academics — International High School', description: 'Explore courses, subjects, timetable and academic resources at International High School.' };

const streams = [
  { name: 'Science Stream', grades: 'Grades 11-12', subjects: ['Physics', 'Chemistry', 'Biology / Mathematics', 'English', 'Computer Science'], color: 'from-blue-500 to-cyan-500', icon: '🔬' },
  { name: 'Commerce Stream', grades: 'Grades 11-12', subjects: ['Accountancy', 'Business Studies', 'Economics', 'English', 'Mathematics'], color: 'from-emerald-500 to-teal-500', icon: '📊' },
  { name: 'Humanities Stream', grades: 'Grades 11-12', subjects: ['History', 'Geography', 'Political Science', 'English', 'Psychology'], color: 'from-violet-500 to-purple-600', icon: '📖' },
];

const timetable = [
  { period: 'Assembly', time: '8:00 – 8:15 AM' },
  { period: '1st Period', time: '8:15 – 9:00 AM' },
  { period: '2nd Period', time: '9:00 – 9:45 AM' },
  { period: '3rd Period', time: '9:45 – 10:30 AM' },
  { period: 'Break',     time: '10:30 – 10:50 AM' },
  { period: '4th Period', time: '10:50 – 11:35 AM' },
  { period: '5th Period', time: '11:35 – 12:20 PM' },
  { period: 'Lunch',     time: '12:20 – 1:00 PM' },
  { period: '6th Period', time: '1:00 – 1:45 PM' },
  { period: '7th Period', time: '1:45 – 2:30 PM' },
];

export default function AcademicsPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-hero text-white py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl sm:text-6xl font-display font-black mb-4">Academics</h1>
          <p className="text-xl text-white/75 max-w-2xl mx-auto">CBSE-affiliated curriculum that builds analytical minds and lifelong learners.</p>
        </div>
      </section>

      {/* Key Facts */}
      <section className="py-16 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[{ v:'CBSE', l:'Board Affiliation' },{ v:'1-12', l:'Grades Offered' },{ v:'50+', l:'Subjects & Electives' },{ v:'98%', l:'Board Pass Rate 2024' }].map(s => (
              <div key={s.l} className="card p-6 text-center">
                <div className="text-3xl font-display font-black text-primary-600 dark:text-primary-400 mb-1">{s.v}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{s.l}</div>
              </div>
            ))}
          </div>

          {/* Primary & Middle */}
          <div className="mb-16">
            <h2 className="section-heading mb-4">Primary & Middle School <span className="text-gradient">(Grades 1–10)</span></h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-3xl">A strong foundation in languages, mathematics, sciences, social studies, and arts. Regular assessments, project-based learning, and co-curricular activities ensure all-round development.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {['English Language & Literature','Hindi / Second Language','Mathematics','Science','Social Science','Computer Science','Physical Education','Art & Craft','Music'].map(sub => (
                <div key={sub} className="flex items-center gap-3 p-4 card text-sm">
                  <span className="text-primary-500 font-bold">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">{sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Senior Streams */}
          <div>
            <h2 className="section-heading mb-8">Senior Secondary Streams <span className="text-gradient">(Grades 11–12)</span></h2>
            <div className="grid md:grid-cols-3 gap-6">
              {streams.map(s => (
                <div key={s.name} className="card overflow-hidden">
                  <div className={`bg-gradient-to-r ${s.color} p-6 text-white`}>
                    <div className="text-4xl mb-3">{s.icon}</div>
                    <h3 className="font-display font-bold text-xl">{s.name}</h3>
                    <p className="text-white/80 text-sm mt-1">{s.grades}</p>
                  </div>
                  <div className="p-5">
                    <ul className="space-y-2">
                      {s.subjects.map(sub => (
                        <li key={sub} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                          {sub}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timetable */}
      <section className="py-16 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-heading text-center mb-10">Daily <span className="text-gradient">Schedule</span></h2>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-primary-600 text-white">
                    <th className="text-left px-6 py-4 font-semibold">Period</th>
                    <th className="text-left px-6 py-4 font-semibold">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {timetable.map((row, i) => (
                    <tr key={row.period} className={`border-b border-gray-100 dark:border-slate-700 ${
                      row.period.toLowerCase().includes('break') || row.period.toLowerCase().includes('lunch') || row.period.toLowerCase().includes('assembly')
                        ? 'bg-primary-50 dark:bg-primary-950/30'
                        : i % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-gray-50 dark:bg-slate-800/50'
                    }`}>
                      <td className="px-6 py-3 font-medium text-gray-900 dark:text-white text-sm">{row.period}</td>
                      <td className="px-6 py-3 text-gray-500 dark:text-gray-400 text-sm">{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* EdTech Programs */}
      <section className="py-16 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-heading">EdTech & Skill <span className="text-gradient">Programs</span></h2>
            <p className="section-sub mx-auto">Future-ready skills integrated into the academic calendar.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon:'💡', title:'Coding Bootcamp',    desc:'Python, Web Dev, App Dev starting from Grade 5.' },
              { icon:'🤖', title:'AI & Data Literacy', desc:'Machine learning concepts and data analysis projects.' },
              { icon:'🎨', title:'Digital Design',     desc:'Canva, Figma, and digital media creation.' },
              { icon:'🌐', title:'English Communication', desc:'Debate, MUN, public speaking, and writing clubs.' },
            ].map(p => (
              <div key={p.title} className="card p-6 text-center group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">{p.icon}</div>
                <h3 className="font-display font-bold text-gray-900 dark:text-white mb-2">{p.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
