'use client';

import { useState } from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { INSTRUCTOR_NAV } from '@/data/portalNavs';

export default function InstructorSettingsPage() {
  const [name, setName] = useState('John Doe');
  const [expertise, setExpertise] = useState('Senior Software Engineer & Lead Architect');
  const [bio, setBio] = useState('Over 10 years of software engineering experience. Specializing in high-throughput Node.js microservices, Next.js, and TypeScript.');
  const [payoutMethod, setPayoutMethod] = useState('bKash');
  const [accountNo, setAccountNo] = useState('01712-345678');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <PortalLayout
      role="instructor"
      userName="John Doe"
      userRoleLabel="Senior Software Engineer & Lead Instructor"
      navItems={INSTRUCTOR_NAV}
    >
      <div className="max-w-3xl space-y-6">
        <div>
          <h2 className="font-heading text-2xl font-extrabold text-foreground-950">
            Instructor Studio Settings
          </h2>
          <p className="text-sm text-foreground-500 mt-1">
            Update your public instructor profile, biography, and withdrawal payout destination.
          </p>
        </div>

        <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-2xl bg-white border border-background-200 shadow-soft-sm space-y-6">
          {saved && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
              <i className="ri-checkbox-circle-fill text-emerald-600 text-base" />
              <span>Instructor settings updated successfully!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground-700 mb-1">Instructor Public Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground-700 mb-1">Headline / Expertise *</label>
              <input
                type="text"
                required
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm outline-none focus:border-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground-700 mb-1">Detailed Instructor Biography *</label>
            <textarea
              rows={4}
              required
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-background-300 text-sm outline-none focus:border-primary-500"
            />
          </div>

          <div className="pt-4 border-t border-background-100 space-y-4">
            <h4 className="font-heading text-sm font-bold text-foreground-950">Default Payout Receiving Wallet</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-foreground-700 mb-1">Payout Channel</label>
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm bg-white outline-none focus:border-primary-500"
                >
                  <option value="bKash">bKash Personal</option>
                  <option value="Nagad">Nagad Personal</option>
                  <option value="Bank">Direct Bank Transfer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground-700 mb-1">Wallet / Account Details</label>
                <input
                  type="text"
                  required
                  value={accountNo}
                  onChange={(e) => setAccountNo(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm font-mono outline-none focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-background-100">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-colors shadow-soft-sm"
            >
              Save Instructor Profile
            </button>
          </div>
        </form>
      </div>
    </PortalLayout>
  );
}
