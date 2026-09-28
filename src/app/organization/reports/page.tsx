'use client';

import PortalLayout from '@/components/portal/PortalLayout';
import { ORG_NAV } from '@/data/portalNavs';

export default function OrganizationReportsPage() {
  return (
    <PortalLayout
      role="organization"
      userName="Admin @ Apex Academy"
      userRoleLabel="Tenant Administrator"
      organizationName="Apex Academy LMS"
      navItems={ORG_NAV}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-extrabold text-foreground-950">
              Tenant Analytics & Reports
            </h2>
            <p className="text-sm text-foreground-500 mt-1">
              Monthly student enrollments, course completion rates, and gross revenue summaries.
            </p>
          </div>
          <button
            onClick={() => alert('Exporting tenant report CSV')}
            className="px-4 py-2 rounded-xl border border-background-300 hover:bg-background-50 text-xs font-bold text-foreground-800 flex items-center gap-1.5 shadow-soft-sm"
          >
            <i className="ri-file-excel-2-line text-emerald-600" />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-background-200 shadow-soft-sm">
            <span className="text-xs font-bold text-foreground-500 uppercase">Gross Enrollment Sales</span>
            <div className="mt-2 font-heading text-3xl font-extrabold text-foreground-950">
              ৳1,890,000 BDT
            </div>
            <p className="mt-1 text-xs text-emerald-600 font-semibold">+24% vs previous quarter</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-background-200 shadow-soft-sm">
            <span className="text-xs font-bold text-foreground-500 uppercase">Average Completion Rate</span>
            <div className="mt-2 font-heading text-3xl font-extrabold text-emerald-600">
              78.4%
            </div>
            <p className="mt-1 text-xs text-foreground-500">Above industry standard (42%)</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-background-200 shadow-soft-sm">
            <span className="text-xs font-bold text-foreground-500 uppercase">Graduation Certificates</span>
            <div className="mt-2 font-heading text-3xl font-extrabold text-primary-600">
              840
            </div>
            <p className="mt-1 text-xs text-foreground-500">Issued with unique verifiable IDs</p>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
