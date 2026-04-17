'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import {
  PhoneIcon, EnvelopeIcon, IdentificationIcon,
  AcademicCapIcon, UserGroupIcon, CalendarDaysIcon,
  ClockIcon, BookOpenIcon, StarIcon, BanknotesIcon, CheckBadgeIcon,
} from '@heroicons/react/24/outline';

// ─────────────────────────────────────────────────────────────
// Static supplementary data (not stored in DB)
// ─────────────────────────────────────────────────────────────

const TEACHER_STATIC: Record<string, {
  gender: string;
  qualification: string;
  mentorGrade: string | null;
}> = {
  '701': { gender: 'male',   qualification: 'M.Sc. Mathematics, B.Ed', mentorGrade: '6' },
  '702': { gender: 'female', qualification: 'M.Sc. Life Sciences, B.Ed', mentorGrade: '7' },
  '703': { gender: 'male',   qualification: 'M.A. English Literature, B.Ed', mentorGrade: '8' },
  '704': { gender: 'female', qualification: 'M.A. Social Sciences, B.Ed', mentorGrade: '9' },
  '705': { gender: 'male',   qualification: 'MCA, B.Ed, PGDCA', mentorGrade: null },
};

const CLASS_CAPTAINS: Record<string, string> = {
  '6': 'Rahul Kumar',
  '7': 'Pooja Sharma',
  '8': 'Aditya Jain',
  '9': 'Neha Kapoor',
};

// Teaching schedule per employee ID
// Each entry: { grade, period, time, subject }
const TEACHER_SCHEDULE: Record<string, { grade: string; period: string; time: string; subject: string }[]> = {
  '701': [ // Ramesh Sir — Mathematics
    { grade: '6', period: '1st Period', time: '8:15 – 9:00 AM',   subject: 'Mathematics' },
    { grade: '6', period: '6th Period', time: '1:00 – 1:45 PM',   subject: 'Mathematics' },
    { grade: '7', period: '2nd Period', time: '9:00 – 9:45 AM',   subject: 'Mathematics' },
    { grade: '8', period: '2nd Period', time: '9:00 – 9:45 AM',   subject: 'Mathematics' },
    { grade: '9', period: '3rd Period', time: '9:45 – 10:30 AM',  subject: 'Mathematics' },
  ],
  '702': [ // Lakshmi Madam — Science
    { grade: '6', period: '2nd Period', time: '9:00 – 9:45 AM',   subject: 'Science' },
    { grade: '7', period: '1st Period', time: '8:15 – 9:00 AM',   subject: 'Science' },
    { grade: '7', period: '6th Period', time: '1:00 – 1:45 PM',   subject: 'Science' },
    { grade: '8', period: '3rd Period', time: '9:45 – 10:30 AM',  subject: 'Science' },
    { grade: '9', period: '2nd Period', time: '9:00 – 9:45 AM',   subject: 'Science' },
  ],
  '703': [ // Suresh Sir — English
    { grade: '6', period: '3rd Period', time: '9:45 – 10:30 AM',  subject: 'English' },
    { grade: '7', period: '4th Period', time: '10:50 – 11:35 AM', subject: 'English' },
    { grade: '8', period: '1st Period', time: '8:15 – 9:00 AM',   subject: 'English' },
    { grade: '8', period: '6th Period', time: '1:00 – 1:45 PM',   subject: 'English' },
    { grade: '9', period: '4th Period', time: '10:50 – 11:35 AM', subject: 'English' },
  ],
  '704': [ // Kavitha Madam — Social Studies
    { grade: '6', period: '4th Period', time: '10:50 – 11:35 AM', subject: 'Social Studies' },
    { grade: '7', period: '3rd Period', time: '9:45 – 10:30 AM',  subject: 'Social Studies' },
    { grade: '8', period: '5th Period', time: '11:35 – 12:20 PM', subject: 'Social Studies' },
    { grade: '9', period: '1st Period', time: '8:15 – 9:00 AM',   subject: 'Social Studies' },
    { grade: '9', period: '6th Period', time: '1:00 – 1:45 PM',   subject: 'Social Studies' },
  ],
  '705': [ // Prakash Sir — Computer Science + Games
    { grade: '6', period: '5th Period', time: '11:35 – 12:20 PM', subject: 'Computer Science' },
    { grade: '6', period: '7th Period', time: '1:45 – 2:30 PM',   subject: 'Games' },
    { grade: '7', period: '5th Period', time: '11:35 – 12:20 PM', subject: 'Computer Science' },
    { grade: '7', period: '7th Period', time: '1:45 – 2:30 PM',   subject: 'Games' },
    { grade: '8', period: '4th Period', time: '10:50 – 11:35 AM', subject: 'Computer Science' },
    { grade: '8', period: '7th Period', time: '1:45 – 2:30 PM',   subject: 'Games' },
    { grade: '9', period: '5th Period', time: '11:35 – 12:20 PM', subject: 'Computer Science' },
    { grade: '9', period: '7th Period', time: '1:45 – 2:30 PM',   subject: 'Games' },
  ],
};

const SUBJECT_COLORS: Record<string, string> = {
  'Mathematics':    'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  'Science':        'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
  'English':        'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300',
  'Social Studies': 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  'Computer Science': 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300',
  'Games':          'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300',
};

// ─────────────────────────────────────────────────────────────
// Gender Avatar SVG
// ─────────────────────────────────────────────────────────────
function GenderAvatar({ gender, size = 96 }: { gender: string; size?: number }) {
  const isFemale = gender === 'female';
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size} height={size}
      viewBox="0 0 100 100"
      className="drop-shadow-lg"
    >
      <circle cx="50" cy="34" r="20" fill={isFemale ? '#f9a8d4' : '#93c5fd'} />
      {isFemale ? (
        <path d="M30 34 Q30 5 50 8 Q70 5 70 34 Q70 15 50 12 Q30 15 30 34Z" fill="#7c3aed" />
      ) : (
        <path d="M32 30 Q30 10 50 10 Q70 10 68 30 Q62 18 50 16 Q38 18 32 30Z" fill="#1d4ed8" />
      )}
      <circle cx="43" cy="32" r="2" fill="#374151" />
      <circle cx="57" cy="32" r="2" fill="#374151" />
      <path d="M44 41 Q50 46 56 41" stroke="#374151" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Teacher mortar board hat */}
      <rect x="36" y="12" width="28" height="4" rx="2" fill={isFemale ? '#6d28d9' : '#1e40af'} />
      <rect x="47" y="8" width="6" height="6" rx="1" fill={isFemale ? '#6d28d9' : '#1e40af'} />
      <path d="M28 95 Q28 65 50 62 Q72 65 72 95Z" fill={isFemale ? '#818cf8' : '#3b82f6'} />
      <rect x="44" y="52" width="12" height="14" rx="4" fill={isFemale ? '#f9a8d4' : '#93c5fd'} />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Detail Row
// ─────────────────────────────────────────────────────────────
function DetailRow({ icon: Icon, label, value, color = 'text-primary-600 dark:text-primary-400' }: {
  icon: any; label: string; value: string; color?: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 dark:border-slate-700/60 last:border-0">
      <div className="w-8 h-8 bg-gray-50 dark:bg-slate-800 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="font-semibold text-gray-900 dark:text-white text-sm mt-0.5 break-all">{value || '—'}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Grade badge colour
// ─────────────────────────────────────────────────────────────
const GRADE_COLORS: Record<string, string> = {
  '6': 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  '7': 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300',
  '8': 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
  '9': 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300',
};

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────
export default function TeacherProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/teacher/profile')
      .then(r => setProfile(r.data.data))
      .catch(() => toast.error('Failed to load profile.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full" />
    </div>
  );

  if (!profile) return (
    <div className="text-center py-20 text-gray-400">Profile not found.</div>
  );

  const empId    = profile.employee_id || '';
  const staticData = TEACHER_STATIC[empId] || { gender: 'male', qualification: 'B.Ed', mentorGrade: null };
  const { gender, qualification, mentorGrade } = staticData;

  const schedule = TEACHER_SCHEDULE[empId] || [];
  const captain  = mentorGrade ? CLASS_CAPTAINS[mentorGrade] : null;
  const isFemale = gender === 'female';
  const gradColor = isFemale ? 'from-violet-500 to-purple-600' : 'from-indigo-500 to-blue-600';

  // Group schedule by grade for display
  const gradeGroups = schedule.reduce<Record<string, typeof schedule>>((acc, s) => {
    if (!acc[s.grade]) acc[s.grade] = [];
    acc[s.grade].push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ── Hero Banner ── */}
      <div className={`bg-gradient-to-r ${gradColor} rounded-2xl p-6 sm:p-8 text-white shadow-xl overflow-hidden relative`}>
        <div className="absolute -right-6 -top-6 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute right-16 -bottom-8 w-24 h-24 bg-white/10 rounded-full" />
        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="w-28 h-28 bg-white/20 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/30 shrink-0">
            <GenderAvatar gender={gender} size={100} />
          </div>
          {/* Info */}
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight">
              {profile.name}
            </h2>
            <p className="text-white/80 mt-1 text-sm">
              Faculty ID: {profile.employee_id}  ·  {profile.subject}
            </p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium capitalize">
                {isFemale ? '👩‍🏫 Female' : '👨‍🏫 Male'}
              </span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                🎓 Faculty
              </span>
              {mentorGrade && (
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                  ⭐ Class Mentor — Grade {mentorGrade}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* ── Personal Details ── */}
        <div className="card p-6">
          <h3 className="font-display font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <IdentificationIcon className="w-5 h-5 text-indigo-500" /> Personal Details
          </h3>
          <DetailRow icon={IdentificationIcon} label="Employee ID"    value={profile.employee_id} color="text-indigo-500" />
          <DetailRow icon={PhoneIcon}          label="Mobile"         value={profile.phone} color="text-indigo-500" />
          <DetailRow icon={EnvelopeIcon}       label="Email"          value={profile.email || `${empId}@ihs.edu`} color="text-indigo-500" />
          <DetailRow icon={AcademicCapIcon}    label="Qualification"  value={qualification} color="text-indigo-500" />
          <DetailRow icon={BookOpenIcon}       label="Subject"        value={profile.subject || '—'} color="text-indigo-500" />
          <DetailRow icon={CalendarDaysIcon}   label="Joined On"      value={profile.joining_date
            ? new Date(profile.joining_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
            : 'June 2020'} color="text-indigo-500" />
        </div>

        {/* ── Mentor Info & Captain ── */}
        <div className="card p-6">
          <h3 className="font-display font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <StarIcon className="w-5 h-5 text-amber-500" /> Class Responsibility
          </h3>

          {mentorGrade ? (
            <>
              {/* Mentor Grade */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800/40 mb-4">
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-1">Mentor / Class Teacher Of</p>
                <p className="font-bold text-gray-900 dark:text-white text-lg">Grade {mentorGrade}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Responsible for all academic activities of Grade {mentorGrade}
                </p>
              </div>

              {/* Class Captain */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-100 dark:border-amber-800/40">
                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mb-1">Grade {mentorGrade} Class Captain</p>
                <p className="font-bold text-gray-900 dark:text-white">{captain}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Student Leader</p>
              </div>
            </>
          ) : (
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This faculty member is a floating teacher and does not have a dedicated mentor class.
                He teaches across all grades.
              </p>
            </div>
          )}
        </div>

        {/* ── Teaching Stats ── */}
        <div className="card p-6">
          <h3 className="font-display font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BookOpenIcon className="w-5 h-5 text-emerald-500" /> Teaching Overview
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
              <span className="text-sm text-gray-600 dark:text-gray-400">Grades Assigned</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {Object.keys(gradeGroups).length}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Periods / Day</span>
              <span className="font-bold text-gray-900 dark:text-white">{schedule.length}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
              <span className="text-sm text-gray-600 dark:text-gray-400">Subject(s)</span>
              <span className="font-bold text-gray-900 dark:text-white text-xs text-right">
                {[...new Set(schedule.map(s => s.subject))].join(', ')}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
              <span className="text-sm text-gray-600 dark:text-gray-400">Role</span>
              <span className={`font-bold text-xs px-2 py-1 rounded-lg ${mentorGrade ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300' : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300'}`}>
                {mentorGrade ? `Mentor – Gr. ${mentorGrade}` : 'Floating Faculty'}
              </span>
            </div>
          </div>
        </div>

        {/* ── Salary Status ── */}
        <div className="card p-6 border-t-4 border-t-emerald-500">
          <h3 className="font-display font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BanknotesIcon className="w-5 h-5 text-emerald-500" /> Finance & Salary
          </h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current Month ({new Date().toLocaleString('en-US', { month: 'long' })})</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 dark:text-white capitalize">
                  {profile.salary_status === 'paid' ? 'Credited ✅' : 'Pending ⏳'}
                </span>
                {profile.salary_status === 'paid' && (
                  <CheckBadgeIcon className="w-6 h-6 text-emerald-500" />
                )}
              </div>
            </div>
            {profile.salary_status === 'paid' && (
              <div className="flex justify-between items-center py-2 px-1 border-b border-gray-50 dark:border-slate-800">
                <span className="text-xs text-gray-500">Paid On</span>
                <span className="text-xs font-bold text-gray-900 dark:text-white">
                  {new Date(profile.salary_paid_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            )}
             <div className="flex justify-between items-center py-2 px-1 border-b border-gray-50 dark:border-slate-800">
                <span className="text-xs text-gray-500">Basic Pay</span>
                <span className="text-xs font-bold text-gray-900 dark:text-white">
                  ₹{Number(profile.salary_amount || 45000).toLocaleString('en-IN')}
                </span>
              </div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 italic mt-2">
              * Official payslips are sent to your registered email address monthly.
            </p>
          </div>
        </div>
      </div>

      {/* ── Teaching Schedule ── */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-slate-700 flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
          <ClockIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <div>
            <h3 className="font-display font-bold text-gray-900 dark:text-white">
              Daily Teaching Schedule
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Monday – Friday · All periods are held daily
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700">
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">Period</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">Time</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">Grade</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">Subject</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400">Days</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
              {schedule.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-400">No schedule data available.</td>
                </tr>
              )}
              {schedule.map((slot, idx) => (
                <tr key={idx} className="bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">{slot.period}</td>
                  <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 text-xs tabular-nums">{slot.time}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${GRADE_COLORS[slot.grade] || 'bg-gray-100 text-gray-700'}`}>
                      Grade {slot.grade}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${SUBJECT_COLORS[slot.subject] || 'bg-gray-100 text-gray-700'}`}>
                      {slot.subject}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-gray-500 dark:text-gray-400">Mon – Fri</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            * Schedule is subject to change. Assembly (8:00–8:15) and Lunch (12:20–1:00) are not included above.
          </p>
        </div>
      </div>
    </div>
  );
}
