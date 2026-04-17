'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { AcademicCapIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const ROLES = [
  { id: 'student', label: 'Student',  emoji: '👨‍🎓', desc: 'View results, attendance & fees',   color: 'from-blue-500 to-cyan-500',    active: 'ring-blue-500 bg-blue-50 dark:bg-blue-950' },
  { id: 'teacher', label: 'Teacher',  emoji: '👩‍🏫', desc: 'Manage attendance & results',        color: 'from-violet-500 to-purple-600', active: 'ring-violet-500 bg-violet-50 dark:bg-violet-950' },
  { id: 'parent',  label: 'Parent',   emoji: '👨‍👩‍👧', desc: 'Track your child\'s progress',       color: 'from-emerald-500 to-teal-500',  active: 'ring-emerald-500 bg-emerald-50 dark:bg-emerald-950' },
  { id: 'admin',   label: 'Admin',    emoji: '🛠️', desc: 'Full system control & management',   color: 'from-rose-500 to-orange-500',   active: 'ring-rose-500 bg-rose-50 dark:bg-rose-950' },
];

function LoginContent() {
  const router      = useRouter();
  const params      = useSearchParams();
  const { login, isAuthenticated, user } = useAuth();

  const [selectedRole, setSelectedRole] = useState(params.get('role') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace(`/dashboard/${user.role}`);
    }
  }, [isAuthenticated, user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) { toast.error('Please select your role first.'); return; }
    setLoading(true);
    try {
      await login(username, password, selectedRole);
      toast.success('Welcome back! Redirecting...');
      router.push(`/dashboard/${selectedRole}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-4">
      {/* Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <AcademicCapIcon className="w-7 h-7 text-white" />
          </div>
          <div className="text-left">
            <div className="font-display font-black text-gray-900 dark:text-white text-lg leading-tight">International</div>
            <div className="font-display font-black text-primary-600 dark:text-primary-400 text-lg leading-tight">High School</div>
          </div>
        </Link>
        <h1 className="mt-6 text-3xl font-display font-black text-gray-900 dark:text-white">Welcome Back</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to access your ERP portal</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        {/* Role Selector */}
        <div className="card p-6 mb-6">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">1. Select your role</p>
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map(role => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  selectedRole === role.id
                    ? `border-transparent ring-2 ${role.active}`
                    : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                }`}
              >
                <div className="text-2xl mb-2">{role.emoji}</div>
                <div className="font-semibold text-gray-900 dark:text-white text-sm">{role.label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">{role.desc}</div>
                {selectedRole === role.id && (
                  <div className={`absolute top-2 right-2 w-5 h-5 rounded-full bg-gradient-to-br ${role.color} flex items-center justify-center`}>
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <div className="card p-8">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-5">2. Enter your credentials</p>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Username</label>
              <input
                type="text" value={username} onChange={e => setUsername(e.target.value)} required
                className="input" placeholder="Your Username (e.g. 20201 or 20201_6)" id="login-username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)} required
                  className="input pr-12" placeholder="••••••••" id="login-password"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  {showPwd ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600 dark:text-gray-400 cursor-pointer">
                <input type="checkbox" className="rounded" /> Remember me
              </label>
              <Link href="/forgot-password" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full text-base py-3.5">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Signing In...
                </span>
              ) : `Sign In as ${selectedRole ? ROLES.find(r => r.id === selectedRole)?.label : '...'}`}
            </button>
          </form>


        </div>




        <p className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
            ← Back to main website
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"/></div>}>
      <LoginContent />
    </Suspense>
  );
}
