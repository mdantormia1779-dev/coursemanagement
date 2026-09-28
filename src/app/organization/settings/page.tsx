'use client';

import { useState } from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { ORG_NAV } from '@/data/portalNavs';

export default function OrganizationSettingsPage() {
  const [email, setEmail] = useState('admin@apexacademy.com');
  const [phone, setPhone] = useState('+880 1800-112233');
  const [address, setAddress] = useState('Dhanmondi, Dhaka, Bangladesh');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <PortalLayout
      role="organization"
      userName="Admin @ Apex Academy"
      userRoleLabel="Tenant Administrator"
      organizationName="Apex Academy LMS"
      navItems={ORG_NAV}
    >
      <div className="max-w-3xl space-y-6">
        <div>
          <h2 className="font-heading text-2xl font-extrabold text-foreground-950">
            Tenant Configuration & Contact
          </h2>
          <p className="text-sm text-foreground-500 mt-1">
            General tenant information and official institutional details.
          </p>
        </div>

        <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-2xl bg-white border border-background-200 shadow-soft-sm space-y-6">
          {saved && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
              <i className="ri-checkbox-circle-fill text-emerald-600 text-base" />
              <span>Tenant contact details updated successfully!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground-700 mb-1">Official Contact Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground-700 mb-1">Contact Phone *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground-700 mb-1">Physical Campus / Office Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-background-100">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-soft-sm"
            >
              Save Tenant Details
            </button>
          </div>
        </form>
      </div>
    </PortalLayout>
  );
}
