'use client';

import { useState } from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { STUDENT_NAV } from '@/data/portalNavs';

export default function StudentSettingsPage() {
  const [name, setName] = useState('Sarah Khan');
  const [email] = useState('sarah.khan@example.com');
  const [headline, setHeadline] = useState('Frontend Developer & Next.js Enthusiast');
  const [bio, setBio] = useState('Passionate about clean architecture, TypeScript, and modern web application development.');
  const [emailNotify, setEmailNotify] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <PortalLayout
      role="student"
      userName="Sarah Khan"
      userRoleLabel="Frontend Developer"
      navItems={STUDENT_NAV}
    >
      <div className="max-w-3xl space-y-6">
        <div>
          <h2 className="font-heading text-2xl font-extrabold text-foreground-950">
            Account & Profile Settings
          </h2>
          <p className="text-sm text-foreground-500 mt-1">
            Manage your personal learning credentials and certificate name format.
          </p>
        </div>

        <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-2xl bg-white border border-background-200 shadow-soft-sm space-y-6">
          {saved && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
              <i className="ri-checkbox-circle-fill text-emerald-600 text-base" />
              <span>Settings updated successfully!</span>
            </div>
          )}

          <div className="flex items-center gap-5 pb-6 border-b border-background-100">
            <div className="w-16 h-16 rounded-full bg-primary-600 text-white font-extrabold text-xl flex items-center justify-center">
              SK
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground-950">{name}</h4>
              <p className="text-xs text-foreground-500">{email}</p>
              <button type="button" className="mt-2 text-xs font-bold text-primary-600 hover:underline">
                Change Avatar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground-700 mb-1">Full Legal Name (For Certificates) *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm outline-none focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground-700 mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full h-11 px-3.5 rounded-xl border border-background-200 bg-background-100 text-sm text-foreground-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground-700 mb-1">Professional Headline</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground-700 mb-1">Student Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-background-300 text-sm outline-none focus:border-primary-500"
            />
          </div>

          <div className="pt-4 border-t border-background-100 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground-500">Notifications</h4>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotify}
                onChange={(e) => setEmailNotify(e.target.checked)}
                className="w-4 h-4 text-primary-600 rounded border-background-300 focus:ring-primary-500"
              />
              <span className="text-xs text-foreground-700 font-medium">
                Email me when instructor grades my assignment or answers my Q&A questions
              </span>
            </label>
          </div>

          <div className="flex justify-end pt-4 border-t border-background-100">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-colors shadow-soft-sm"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </PortalLayout>
  );
}
