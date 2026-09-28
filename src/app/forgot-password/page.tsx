'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
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
          Reset your password
        </h2>
        <p className="mt-1 text-xs text-foreground-500">
          Enter your email to receive a password reset link
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-background-200 shadow-soft-xl space-y-6">
          {sent ? (
            <div className="text-center space-y-3">
              <i className="ri-mail-check-line text-4xl text-emerald-600 inline-block" />
              <h3 className="font-heading text-base font-bold text-foreground-950">Password Reset Link Dispatched</h3>
              <p className="text-xs text-foreground-500">
                If an account exists for <strong className="text-foreground-800">{email}</strong>, you will receive password reset instructions shortly.
              </p>
              <Link href="/login" className="mt-4 inline-block text-xs font-bold text-primary-600 hover:underline">
                ← Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground-700 mb-1">Registered Account Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm outline-none focus:border-primary-500"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-soft-sm transition-all"
              >
                Send Password Reset Email
              </button>

              <div className="text-center pt-2">
                <Link href="/login" className="text-xs font-bold text-foreground-500 hover:text-foreground-900">
                  ← Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
