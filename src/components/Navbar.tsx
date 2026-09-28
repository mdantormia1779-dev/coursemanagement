'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCurrentUser, getRoleDashboardPath, AuthUser } from '@/lib/authService';

interface NavbarProps {
  onOpenSearch: () => void;
}

export default function Navbar({ onOpenSearch }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
    const onAuthChange = (e: any) => {
      setCurrentUser(e.detail || getCurrentUser());
    };
    window.addEventListener('learnx_auth_changed', onAuthChange);
    return () => window.removeEventListener('learnx_auth_changed', onAuthChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 16);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Courses', href: '/courses' },
    { label: 'Scholarship Exam 🎁', href: '/exam', badge: 'Hot' },
    { label: 'Categories', href: '/categories' },
    { label: 'Mentors', href: '/instructors' },
    { label: 'Admissions & Fees', href: '/pricing' },
    { label: 'About', href: '/about' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-200 bg-white/95 backdrop-blur-md ${
          scrolled
            ? 'shadow-soft-md border-b border-background-200/90 py-3.5'
            : 'border-b border-background-200/50 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 font-heading text-xl font-bold tracking-tight text-foreground-950 group shrink-0"
          >
            <span className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-700 via-primary-600 to-indigo-500 flex items-center justify-center text-white shadow-soft-sm group-hover:scale-105 transition-transform duration-200">
              <i className="ri-book-open-line text-xl" aria-hidden="true" />
            </span>
            <span className="flex items-center text-2xl tracking-tight">
              Learn<span className="text-primary-600 font-extrabold">X</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-foreground-600 hover:text-primary-600 hover:bg-primary-50/50 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2 sm:px-3 sm:py-2 rounded-lg text-foreground-600 hover:text-primary-600 hover:bg-background-100 transition-colors flex items-center gap-2 text-sm font-medium"
              aria-label="Open course search"
            >
              <i className="ri-search-line text-lg" aria-hidden="true" />
              <span className="hidden lg:inline text-xs text-foreground-400 bg-background-200/80 px-2 py-0.5 rounded border border-background-300">
                ⌘K
              </span>
            </button>

            {/* Desktop Auth Buttons */}
            <div className="hidden sm:flex items-center gap-2">
              {currentUser ? (
                <Link
                  href={getRoleDashboardPath(currentUser.role)}
                  className="px-4 py-2 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-soft-sm transition-all inline-flex items-center gap-2"
                >
                  <i className="ri-dashboard-line" />
                  <span>{currentUser.role.toUpperCase()} Dashboard</span>
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-semibold text-foreground-700 hover:text-primary-600 rounded-lg hover:bg-background-100 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 active:bg-primary-800 rounded-lg shadow-soft-sm hover:shadow-soft-md transition-all duration-150 inline-flex items-center gap-1.5"
                  >
                    <span>Get Started</span>
                    <i className="ri-arrow-right-line text-sm" aria-hidden="true" />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-foreground-700 hover:bg-background-100 transition-colors"
              aria-label={mobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
              aria-expanded={mobileMenuOpen}
            >
              <i className={`text-2xl ${mobileMenuOpen ? 'ri-close-line' : 'ri-menu-line'}`} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-40 bg-foreground-950/40 backdrop-blur-sm md:hidden animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-soft-xl p-6 flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-background-200">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 font-heading text-xl font-bold tracking-tight text-foreground-950"
                >
                  <span className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white">
                    <i className="ri-book-open-line text-base" />
                  </span>
                  <span>
                    Learn<span className="text-primary-600">X</span>
                  </span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-foreground-500 hover:text-foreground-900 rounded-lg hover:bg-background-100"
                  aria-label="Close menu"
                >
                  <i className="ri-close-line text-2xl" />
                </button>
              </div>

              <div className="mt-6 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3.5 py-2.5 rounded-lg text-base font-semibold text-foreground-700 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/instructor/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3.5 py-2.5 rounded-lg text-base font-semibold text-primary-700 hover:bg-primary-50 transition-colors flex items-center gap-2"
                >
                  <i className="ri-presentation-line text-lg" />
                  <span>Become an Instructor</span>
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-background-200 flex flex-col gap-3">
              {currentUser ? (
                <Link
                  href={getRoleDashboardPath(currentUser.role)}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-soft-sm transition-colors flex items-center justify-center gap-2"
                >
                  <i className="ri-dashboard-line" />
                  <span>{currentUser.role.toUpperCase()} Dashboard</span>
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 text-center text-sm font-semibold text-foreground-800 border border-background-300 rounded-lg hover:bg-background-50 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 text-center text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-soft-sm transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
