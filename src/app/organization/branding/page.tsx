'use client';

import { useState } from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { ORG_NAV } from '@/data/portalNavs';

export default function OrganizationBrandingPage() {
  const [orgName, setOrgName] = useState('Apex Academy LMS');
  const [domain, setDomain] = useState('academy.apexacademy.com');
  const [primaryColor, setPrimaryColor] = useState('#059669');
  const [secondaryColor, setSecondaryColor] = useState('#10B981');
  const [hideWatermark, setHideWatermark] = useState(true);
  const [certTitle, setCertTitle] = useState('Apex Academy Official Certificate of Completion');
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
            White-Label & Branding Settings
          </h2>
          <p className="text-sm text-foreground-500 mt-1">
            Customize your academy&apos;s colors, domain, email footer, and certificate styling.
          </p>
        </div>

        <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-2xl bg-white border border-background-200 shadow-soft-sm space-y-6">
          {saved && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
              <i className="ri-checkbox-circle-fill text-emerald-600 text-base" />
              <span>Branding settings updated and deployed across tenant instance!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground-700 mb-1">Organization Display Name *</label>
              <input
                type="text"
                required
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground-700 mb-1">Custom Domain Hostname</label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="academy.yourdomain.com"
                className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm font-mono outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground-700 mb-1">Primary Theme Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-11 h-11 rounded-xl border border-background-300 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm font-mono outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground-700 mb-1">Secondary Accent Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-11 h-11 rounded-xl border border-background-300 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm font-mono outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-foreground-700 mb-1">Certificate Title Template</label>
            <input
              type="text"
              value={certTitle}
              onChange={(e) => setCertTitle(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm outline-none focus:border-emerald-500"
            />
          </div>

          <div className="p-4 rounded-xl bg-background-50 border border-background-200 space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={hideWatermark}
                onChange={(e) => setHideWatermark(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <span className="text-xs font-bold text-foreground-900">
                Hide &quot;Powered by LearnX&quot; (White-label Enterprise Mode)
              </span>
            </label>
            <p className="text-[11px] text-foreground-500 pl-7">
              Removes platform branding from learner dashboards, emails, and certificate watermarks.
            </p>
          </div>

          <div className="flex justify-end pt-4 border-t border-background-100">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-soft-sm transition-colors"
            >
              Save White-Label Changes
            </button>
          </div>
        </form>
      </div>
    </PortalLayout>
  );
}
