import Link from 'next/link';
import { AcademicCapIcon, PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <AcademicCapIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-display font-bold text-white text-sm">International</div>
                <div className="font-display font-bold text-primary-400 text-sm">High School</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Empowering students with knowledge, values, and skills for a global future since 1998.
            </p>
            <div className="flex gap-3 mt-5">
              {['facebook', 'twitter', 'instagram', 'youtube'].map((s) => (
                <a key={s} href="#" aria-label={s}
                  className="w-9 h-9 bg-slate-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                  <span className="text-xs capitalize text-gray-400 hover:text-white">{s[0].toUpperCase()}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-white mb-5">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: '/about',      label: 'About Us' },
                { href: '/academics',  label: 'Academics' },
                { href: '/admissions', label: 'Admissions' },
                { href: '/gallery',    label: 'Gallery' },
                { href: '/contact',    label: 'Contact Us' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 bg-primary-500 rounded-full" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h3 className="font-display font-semibold text-white mb-5">ERP Portals</h3>
            <ul className="space-y-2">
              {[
                { href: '/login?role=student', label: 'Student Portal' },
                { href: '/login?role=teacher', label: 'Teacher Portal' },
                { href: '/login?role=parent',  label: 'Parent Portal' },
                { href: '/login?role=admin',   label: 'Admin Portal' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 bg-accent-500 rounded-full" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display font-semibold text-white mb-5">Contact</h3>
            <ul className="space-y-3">
              <li className="flex gap-3 text-sm text-gray-400">
                <MapPinIcon className="w-4 h-4 text-primary-400 shrink-0 mt-0.5" />
                123 Education Avenue, Knowledge City, IN 500001
              </li>
              <li className="flex gap-3 text-sm text-gray-400">
                <PhoneIcon className="w-4 h-4 text-primary-400 shrink-0" />
                +91 98765 43210
              </li>
              <li className="flex gap-3 text-sm text-gray-400">
                <EnvelopeIcon className="w-4 h-4 text-primary-400 shrink-0" />
                info@ihs.edu.in
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} International High School. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Built with ♥ for excellence in education
          </p>
        </div>
      </div>
    </footer>
  );
}
