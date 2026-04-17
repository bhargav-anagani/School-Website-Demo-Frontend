'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import {
  SunIcon, MoonIcon, Bars3Icon, XMarkIcon, AcademicCapIcon,
} from '@heroicons/react/24/outline';

const publicLinks = [
  { href: '/',           label: 'Home' },
  { href: '/about',      label: 'About' },
  { href: '/academics',  label: 'Academics' },
  { href: '/admissions', label: 'Admissions' },
  { href: '/gallery',    label: 'Gallery' },
  { href: '/contact',    label: 'Contact' },
];

export default function Navbar() {
  const pathname  = usePathname();
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:border-slate-700/50'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <AcademicCapIcon className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="font-display font-bold text-gray-900 dark:text-white text-sm leading-tight">
                International
              </div>
              <div className="font-display font-bold text-primary-600 dark:text-primary-400 text-sm leading-tight">
                High School
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  isActive(link.href)
                    ? 'bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggle}
              id="theme-toggle"
              aria-label="Toggle theme"
              className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
            >
              {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href={`/dashboard/${user?.role}`}
                  className="btn-ghost text-sm"
                >
                  Dashboard
                </Link>
                <button onClick={logout} className="btn-secondary text-sm px-4 py-2">
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="hidden md:block btn-primary text-sm px-5 py-2.5">
                Login
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              {mobileOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 animate-slide-down">
            <div className="flex flex-col gap-1 mb-4">
              {publicLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                    isActive(link.href)
                      ? 'bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            {isAuthenticated ? (
              <div className="flex flex-col gap-2 pt-4 border-t border-gray-100 dark:border-slate-700">
                <Link href={`/dashboard/${user?.role}`} onClick={() => setMobileOpen(false)} className="btn-ghost text-sm w-full text-center">
                  Go to Dashboard
                </Link>
                <button onClick={logout} className="btn-secondary text-sm w-full">
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-100 dark:border-slate-700">
                <Link href="/login" onClick={() => setMobileOpen(false)} className="btn-primary text-sm w-full block text-center">
                  Login
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
