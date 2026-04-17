'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import {
  PhoneIcon, EnvelopeIcon, IdentificationIcon,
  AcademicCapIcon, UserGroupIcon, CalendarDaysIcon, ClockIcon, BriefcaseIcon,
} from '@heroicons/react/24/outline';

// ─────────────────────────────────────────────
// Static school data — timetable, mentors, captains
// (Consistent with Student Portal)
// ─────────────────────────────────────────────

const SCHEDULE = [
  { period: 'Assembly',   time: '8:00 – 8:15 AM',  special: true },
  { period: '1st Period', time: '8:15 – 9:00 AM' },
  { period: '2nd Period', time: '9:00 – 9:45 AM' },
  { period: '3rd Period', time: '9:45 – 10:30 AM' },
  { period: 'Break',      time: '10:30 – 10:50 AM', special: true },
  { period: '4th Period', time: '10:50 – 11:35 AM' },
  { period: '5th Period', time: '11:35 – 12:20 PM' },
  { period: 'Lunch',      time: '12:20 – 1:00 PM',  special: true },
  { period: '6th Period', time: '1:00 – 1:45 PM' },
  { period: '7th Period', time: '1:45 – 2:30 PM' },
];

type SubjectMap = { [period: string]: string };

const TIMETABLE: { [grade: string]: SubjectMap } = {
  '6': { '1st Period': 'Mathematics', '2nd Period': 'Science', '3rd Period': 'English', '4th Period': 'Social Studies', '5th Period': 'Computer Science', '6th Period': 'Mathematics', '7th Period': 'Games' },
  '7': { '1st Period': 'Science', '2nd Period': 'Mathematics', '3rd Period': 'Social Studies', '4th Period': 'English', '5th Period': 'Computer Science', '6th Period': 'Science', '7th Period': 'Games' },
  '8': { '1st Period': 'English', '2nd Period': 'Mathematics', '3rd Period': 'Science', '4th Period': 'Computer Science', '5th Period': 'Social Studies', '6th Period': 'English', '7th Period': 'Games' },
  '9': { '1st Period': 'Social Studies', '2nd Period': 'Science', '3rd Period': 'Mathematics', '4th Period': 'English', '5th Period': 'Computer Science', '6th Period': 'Social Studies', '7th Period': 'Games' },
};

const MENTORS: { [grade: string]: { name: string; subject: string } } = {
  '6': { name: 'Ramesh Sir',    subject: 'Mathematics' },
  '7': { name: 'Lakshmi Madam', subject: 'Science' },
  '8': { name: 'Suresh Sir',    subject: 'English' },
  '9': { name: 'Kavitha Madam', subject: 'Social Studies' },
};

const CLASS_CAPTAINS: { [grade: string]: string } = {
  '6': 'Rahul Kumar', '7': 'Pooja Sharma', '8': 'Aditya Jain', '9': 'Neha Kapoor',
};

const SUBJECT_COLORS: { [sub: string]: string } = {
  'Mathematics':    'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  'Science':        'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
  'English':        'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300',
  'Social Studies': 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  'Computer Science':'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300',
  'Games':          'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300',
};

// ─────────────────────────────────────────────
// UI Helpers
// ─────────────────────────────────────────────

function GenderAvatar({ gender, size = 96, isParent = false }: { gender?: string; size?: number; isParent?: boolean }) {
  const isFemale = gender === 'female';
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-lg">
      <circle cx="50" cy="34" r="20" fill={isFemale ? '#f9a8d4' : '#93c5fd'} />
      {isFemale ? (
        <path d="M30 34 Q30 5 50 8 Q70 5 70 34 Q70 15 50 12 Q30 15 30 34Z" fill={isParent ? '#059669' : '#7c3aed'} />
      ) : (
        <path d="M32 30 Q30 10 50 10 Q70 10 68 30 Q62 18 50 16 Q38 18 32 30Z" fill={isParent ? '#047857' : '#1d4ed8'} />
      )}
      <circle cx="43" cy="32" r="2" fill="#374151" />
      <circle cx="57" cy="32" r="2" fill="#374151" />
      <path d="M44 41 Q50 46 56 41" stroke="#374151" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M28 95 Q28 65 50 62 Q72 65 72 95Z" fill={isFemale ? '#34d399' : '#10b981'} />
      <rect x="44" y="52" width="12" height="14" rx="4" fill={isFemale ? '#f9a8d4' : '#93c5fd'} />
    </svg>
  );
}

function DetailRow({ icon: Icon, label, value, colorClass = "text-emerald-600 dark:text-emerald-400" }: { icon: any; label: string; value: string; colorClass?: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 dark:border-slate-700/60 last:border-0">
      <div className={`w-8 h-8 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center shrink-0 mt-0.5`}>
        <Icon className={`w-4 h-4 ${colorClass}`} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="font-semibold text-gray-900 dark:text-white text-sm mt-0.5">{value || '—'}</p>
      </div>
    </div>
  );
}

export default function ParentProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/parent/profile')
      .then(r => setProfile(r.data.data))
      .catch(() => toast.error('Failed to load profile.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full" />
    </div>
  );

  if (!profile) return (
    <div className="text-center py-20 text-gray-400">Profile data not found.</div>
  );

  const grade = profile.class?.toString() || '6';
  const mentor = MENTORS[grade] || { name: 'N/A', subject: 'N/A' };
  const captain = CLASS_CAPTAINS[grade] || 'N/A';
  const timetable = TIMETABLE[grade] || {};

  const formatDate = (d: string) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ── Hero Banner ── */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl overflow-hidden relative">
        <div className="absolute -right-6 -top-6 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute right-16 -bottom-8 w-24 h-24 bg-white/10 rounded-full" />
        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-28 h-28 bg-white/20 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/30 shrink-0">
            <GenderAvatar isParent={true} size={100} />
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight">{profile.name}</h2>
            <p className="text-white/80 mt-1 text-sm">
                Parent of <span className="font-bold text-white">{profile.child_name}</span> (Roll No: {profile.roll_no})
            </p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">👨‍👩‍👧 Parent Portal</span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium capitalize">{profile.relation || 'Parent'}</span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">Grade {grade} Child</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Personal/Parent Details ── */}
        <div className="card p-6 border-t-4 border-t-emerald-500">
          <h3 className="font-display font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <IdentificationIcon className="w-5 h-5 text-emerald-500" /> My Details
          </h3>
          <DetailRow icon={PhoneIcon} label="Contact Mobile" value={profile.phone} />
          <DetailRow icon={EnvelopeIcon} label="Email Address" value={profile.email} />
          <DetailRow icon={BriefcaseIcon} label="Occupation" value={profile.occupation} />
          <DetailRow icon={UserGroupIcon} label="Relationship" value={profile.relation ? profile.relation.charAt(0).toUpperCase() + profile.relation.slice(1) : '—'} />
        </div>

        {/* ── Child Overview ── */}
        <div className="card p-6 border-t-4 border-t-teal-500">
          <h3 className="font-display font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <AcademicCapIcon className="w-5 h-5 text-teal-500" /> Child's Profile
          </h3>
          <DetailRow icon={IdentificationIcon} label="Student Name" value={profile.child_name} colorClass="text-teal-600" />
          <DetailRow icon={AcademicCapIcon} label="Current Class" value={`Grade ${profile.class} - ${profile.section}`} colorClass="text-teal-600" />
          <DetailRow icon={CalendarDaysIcon} label="Date of Birth" value={formatDate(profile.dob)} colorClass="text-teal-600" />
          <DetailRow icon={EnvelopeIcon} label="School Email" value={profile.child_email} colorClass="text-teal-600" />
        </div>

        {/* ── Child's Support Team ── */}
        <div className="card p-6 border-t-4 border-t-amber-500">
          <h3 className="font-display font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <UserGroupIcon className="w-5 h-5 text-amber-500" /> Child's Support Team
          </h3>
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-100 dark:border-blue-800/40 mb-4">
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Class Mentor / Teacher</p>
            <p className="font-bold text-gray-900 dark:text-white">{mentor.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{mentor.subject} Faculty</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-100 dark:border-amber-800/40">
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mb-1">Class Captain (Peer Lead)</p>
            <p className="font-bold text-gray-900 dark:text-white">{captain}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Grade {grade} Student Representative</p>
          </div>
        </div>
      </div>

      {/* ── Daily Timetable ── */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-slate-700 flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
          <ClockIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <div>
            <h3 className="font-display font-bold text-gray-900 dark:text-white">Child's Daily Timetable</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Grade {grade} – Section {profile.section} (Academic Year 2025-26)</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700">
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400 w-36">Period</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400 w-44">Time</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">Subject</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
              {SCHEDULE.map((slot) => {
                const isSpecial = slot.special;
                const subject = timetable[slot.period];
                const subjectColor = subject ? SUBJECT_COLORS[subject] : '';
                return (
                  <tr key={slot.period} className={`transition-colors ${isSpecial ? 'bg-gray-50 dark:bg-slate-800/70' : 'bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800/50'}`}>
                    <td className={`px-5 py-3.5 font-medium ${isSpecial ? 'text-gray-500 dark:text-gray-500 italic text-xs' : 'text-gray-900 dark:text-white'}`}>{slot.period}</td>
                    <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 text-xs tabular-nums">{slot.time}</td>
                    <td className="px-5 py-3.5">
                      {subject ? (
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${subjectColor}`}>{subject}</span>
                      ) : isSpecial ? (
                        <span className="text-xs text-gray-400 dark:text-gray-500 italic">—</span>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            * Note: This reflects your child's regular school day structure. Please check Notice Board for any holiday adjustments.
          </p>
        </div>
      </div>
    </div>
  );
}
