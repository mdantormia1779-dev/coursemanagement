'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [roleTab, setRoleTab] = useState<'student' | 'instructor' | 'organization'>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [extraField, setExtraField] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (roleTab === 'student') router.push('/student/dashboard');
    if (roleTab === 'instructor') router.push('/instructor/dashboard');
    if (roleTab === 'organization') router.push('/organization/dashboard');
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
          Create an account
        </h2>
        <p className="mt-1 text-xs text-foreground-500">
          Already registered?{' '}
          <Link href="/login" className="font-bold text-primary-600 hover:underline">
            Sign in here
          </Link>
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-background-200 shadow-soft-xl space-y-6">
          
          {/* Role Tabs */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-background-100 rounded-xl text-xs font-bold text-center">
            <button
              type="button"
              onClick={() => setRoleTab('student')}
              className={`py-2 rounded-lg transition-colors ${
                roleTab === 'student' ? 'bg-white text-primary-600 shadow-soft-sm' : 'text-foreground-600'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRoleTab('instructor')}
              className={`py-2 rounded-lg transition-colors ${
                roleTab === 'instructor' ? 'bg-white text-primary-600 shadow-soft-sm' : 'text-foreground-600'
              }`}
            >
              Instructor
            </button>
            <button
              type="button"
              onClick={() => setRoleTab('organization')}
              className={`py-2 rounded-lg transition-colors ${
                roleTab === 'organization' ? 'bg-white text-primary-600 shadow-soft-sm' : 'text-foreground-600'
              }`}
            >
              Organization LMS
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-foreground-700 mb-1">
                {roleTab === 'organization' ? 'Organization / Institute Name *' : 'Full Name *'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={roleTab === 'organization' ? 'e.g. Apex Coding Academy' : 'e.g. Sarah Khan'}
                className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground-700 mb-1">
                Work or Personal Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm outline-none focus:border-primary-500"
              />
            </div>

            {roleTab === 'instructor' && (
              <div>
                <label className="block text-xs font-bold text-foreground-700 mb-1">
                  Primary Domain Expertise *
                </label>
                <input
                  type="text"
                  required
                  value={extraField}
                  onChange={(e) => setExtraField(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer, Next.js & React"
                  className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm outline-none focus:border-primary-500"
                />
              </div>
            )}

            {roleTab === 'organization' && (
              <div>
                <label className="block text-xs font-bold text-foreground-700 mb-1">
                  Expected Student Enrollees *
                </label>
                <select
                  value={extraField}
                  onChange={(e) => setExtraField(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm outline-none focus:border-primary-500 bg-white"
                >
                  <option value="50">Up to 50 students (Free Tier)</option>
                  <option value="500">Up to 500 students (Starter)</option>
                  <option value="5000">Up to 5,000 students (Business)</option>
                  <option value="unlimited">5,000+ students (Enterprise)</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-foreground-700 mb-1">Password *</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm outline-none focus:border-primary-500"
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-soft-sm transition-all"
            >
              Register as {roleTab.charAt(0).toUpperCase() + roleTab.slice(1)}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
