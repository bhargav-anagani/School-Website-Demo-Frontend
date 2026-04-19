'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import {
  HomeIcon, UserIcon, ChartBarIcon, CalendarIcon, BanknotesIcon,
  UsersIcon, BellAlertIcon, ClipboardDocumentListIcon, PhotoIcon,
  Bars3Icon, XMarkIcon, AcademicCapIcon, ArrowRightOnRectangleIcon,
  SunIcon, MoonIcon, ChevronRightIcon,
} from '@heroicons/react/24/outline';

const NAV_LINKS: Record<string, { href: string; label: string; icon: any }[]> = {
  student: [
    { href: '/dashboard/student',            label: 'Dashboard',  icon: HomeIcon },
    { href: '/dashboard/student/profile',    label: 'My Profile', icon: UserIcon },
    { href: '/dashboard/student/results',    label: 'Results',    icon: ChartBarIcon },
    { href: '/dashboard/student/attendance', label: 'Attendance', icon: CalendarIcon },
    { href: '/dashboard/student/fees',       label: 'Fees',       icon: BanknotesIcon },
    { href: '/dashboard/student/materials',  label: 'Materials',  icon: ClipboardDocumentListIcon },
  ],
  teacher: [
    { href: '/dashboard/teacher',              label: 'Dashboard',  icon: HomeIcon },
    { href: '/dashboard/teacher/profile',      label: 'My Profile', icon: UserIcon },
    { href: '/dashboard/teacher/students',     label: 'Students',   icon: UsersIcon },
    { href: '/dashboard/teacher/attendance',   label: 'Attendance', icon: CalendarIcon },
    { href: '/dashboard/teacher/results',      label: 'Results',    icon: ChartBarIcon },
    { href: '/dashboard/teacher/materials',    label: 'Materials',  icon: ClipboardDocumentListIcon },
    { href: '/dashboard/teacher/announcements',label: 'Notices',    icon: BellAlertIcon },
  ],
  admin: [
    { href: '/dashboard/admin',               label: 'Dashboard',    icon: HomeIcon },
    { href: '/dashboard/admin/users',         label: 'Users',        icon: UsersIcon },
    { href: '/dashboard/admin/admissions',    label: 'Admissions',   icon: ClipboardDocumentListIcon },
    { href: '/dashboard/admin/announcements', label: 'Announcements',icon: BellAlertIcon },
    { href: '/dashboard/admin/fees',          label: 'Fees',         icon: BanknotesIcon },
    { href: '/dashboard/admin/gallery',       label: 'Gallery',      icon: PhotoIcon },
    { href: '/dashboard/admin/contacts',      label: 'Contacts',     icon: BellAlertIcon },
  ],
  parent: [
    { href: '/dashboard/parent',              label: 'Dashboard',   icon: HomeIcon },
    { href: '/dashboard/parent/profile',      label: 'Profile',     icon: UserIcon },
    { href: '/dashboard/parent/results',      label: 'Child Results',    icon: ChartBarIcon },
    { href: '/dashboard/parent/attendance',   label: 'Child Attendance', icon: CalendarIcon },
    { href: '/dashboard/parent/fees',         label: 'Fees & Payment',   icon: BanknotesIcon },
    { href: '/dashboard/parent/materials',    label: 'Study Materials',  icon: ClipboardDocumentListIcon },
    { href: '/dashboard/parent/announcements',label: 'Notices',          icon: BellAlertIcon },
  ],
};

const ROLE_COLORS: Record<string, string> = {
  student: 'from-blue-500 to-cyan-500',
  teacher: 'from-violet-500 to-purple-600',
  admin:   'from-rose-500 to-orange-500',
  parent:  'from-emerald-500 to-teal-500',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const role  = user?.role || 'student';
  const links = NAV_LINKS[role] || [];
  const grad  = ROLE_COLORS[role] || 'from-primary-500 to-accent-500';

  const isActive = (href: string) =>
    href === `/dashboard/${role}` ? pathname === href : pathname.startsWith(href) && href !== `/dashboard/${role}`;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="p-5 border-b border-gray-100 dark:border-slate-700">
        <Link href="/" className="flex items-center gap-3">
          <div className={`w-10 h-10 bg-gradient-to-br ${grad} rounded-xl flex items-center justify-center shadow-md`}>
            <AcademicCapIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-display font-bold text-gray-900 dark:text-white text-xs leading-tight">International</div>
            <div className={`font-display font-bold text-xs leading-tight bg-gradient-to-r ${grad} bg-clip-text text-transparent`}>High School</div>
          </div>
        </Link>
      </div>

      {/* User Info */}
      <div className="p-4 mx-3 mt-4 rounded-xl bg-gray-50 dark:bg-slate-800">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 bg-gradient-to-br ${grad} rounded-xl flex items-center justify-center text-white font-bold text-sm`}>
            {user?.name?.[0] || 'U'}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role} Portal</p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-3 mt-2 space-y-0.5 overflow-y-auto">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
              isActive(link.href)
                ? `bg-gradient-to-r ${grad} text-white shadow-md`
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <link.icon className="w-5 h-5 shrink-0" />
            <span className="flex-1">{link.label}</span>
            {isActive(link.href) && <ChevronRightIcon className="w-4 h-4 opacity-70" />}
          </Link>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-gray-100 dark:border-slate-700 space-y-1">
        <button onClick={toggle}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all">
          {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all">
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-slate-950">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800 flex-col fixed h-full z-30 shadow-sm">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-72 h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700">
              <XMarkIcon className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 flex items-center gap-4 px-4 sm:px-6 sticky top-0 z-20 shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700">
            <Bars3Icon className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-display font-bold text-gray-900 dark:text-white capitalize">
              {role} Portal
            </h1>
            <p className="text-xs text-gray-400 dark:text-gray-500">International High School ERP</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggle} className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700">
              {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
            <div className={`w-8 h-8 bg-gradient-to-br ${grad} rounded-xl flex items-center justify-center text-white font-bold text-sm ml-2`}>
              {user?.name?.[0] || 'U'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
