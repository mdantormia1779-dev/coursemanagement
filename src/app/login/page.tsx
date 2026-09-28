'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginAsRole, getRoleDashboardPath, UserRole } from '@/lib/authService';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('sarah.khan@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      let targetRole: UserRole = 'student';
      const em = email.toLowerCase();
      if (em.includes('admin') || em.includes('director')) {
        targetRole = 'admin';
      } else if (em.includes('instructor') || em.includes('john') || em.includes('teacher')) {
        targetRole = 'instructor';
      } else if (em.includes('org') || em.includes('corp') || em.includes('enterprise')) {
        targetRole = 'organization';
      }

      loginAsRole(targetRole, undefined, email);
      router.push(getRoleDashboardPath(targetRole));
    }, 600);
  };

  const handleQuickLogin = (role: UserRole) => {
    loginAsRole(role);
    router.push(getRoleDashboardPath(role));
  };

  return (
    <div className="min-h-screen bg-background-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 font-heading text-2xl font-bold tracking-tight text-foreground-950 mb-4">
          <span className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-soft-sm">
            <i className="ri-book-open-line text-xl" />
          </span>
          <span>
            Learn<span className="text-primary-600">X</span>
          </span>
        </Link>
        <h2 className="font-heading text-2xl font-extrabold text-foreground-950">
          Sign in to your account
        </h2>
        <p className="mt-1 text-xs text-foreground-500">
          Or{' '}
          <Link href="/register" className="font-bold text-primary-600 hover:underline">
            create a new student or instructor account
          </Link>
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-background-200 shadow-soft-xl space-y-6">
          
          {/* Quick Demo Role Logins */}
          <div className="p-3.5 rounded-xl bg-primary-50/70 border border-primary-100 space-y-2">
            <span className="text-[11px] font-bold text-primary-950 uppercase tracking-wider block">
              ⚡ Select Dedicated Role Dashboard:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('student')}
                className="py-2 px-2.5 rounded-lg bg-white border border-primary-200 hover:border-primary-400 font-bold text-primary-700 shadow-soft-sm text-left flex items-center gap-1.5 transition-all hover:scale-[1.02]"
              >
                <i className="ri-user-line" /> Student Role
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('instructor')}
                className="py-2 px-2.5 rounded-lg bg-white border border-indigo-200 hover:border-indigo-400 font-bold text-indigo-700 shadow-soft-sm text-left flex items-center gap-1.5 transition-all hover:scale-[1.02]"
              >
                <i className="ri-presentation-line" /> Instructor Role
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('organization')}
                className="py-2 px-2.5 rounded-lg bg-white border border-emerald-200 hover:border-emerald-400 font-bold text-emerald-700 shadow-soft-sm text-left flex items-center gap-1.5 transition-all hover:scale-[1.02]"
              >
                <i className="ri-building-line" /> Org Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="py-2 px-2.5 rounded-lg bg-white border border-rose-200 hover:border-rose-400 font-bold text-rose-700 shadow-soft-sm text-left flex items-center gap-1.5 transition-all hover:scale-[1.02]"
              >
                <i className="ri-shield-keyhole-line" /> Super Admin
              </button>
            </div>
            <p className="text-[10px] text-foreground-500 pt-0.5">
              * আপনি যে রোলে লগইন করবেন, শুধুমাত্র সেই ড্যাশবোর্ডের মেনু ও অপশন দেখতে পাবেন।
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-foreground-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm outline-none focus:border-primary-500 bg-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-foreground-700">
                  Password *
                </label>
                <Link href="/forgot-password" className="text-xs font-semibold text-primary-600 hover:underline">
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm outline-none focus:border-primary-500 bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-bold text-sm shadow-soft-sm transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In to Dashboard</span>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
