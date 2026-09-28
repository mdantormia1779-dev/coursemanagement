'use client';

import PortalLayout from '@/components/portal/PortalLayout';
import { ORG_NAV } from '@/data/portalNavs';

export default function OrganizationSubscriptionPage() {
  return (
    <PortalLayout
      role="organization"
      userName="Admin @ Apex Academy"
      userRoleLabel="Tenant Administrator"
      organizationName="Apex Academy LMS"
      navItems={ORG_NAV}
    >
      <div className="space-y-8">
        <div>
          <h2 className="font-heading text-2xl font-extrabold text-foreground-950">
            SaaS Plan & Subscription
          </h2>
          <p className="text-sm text-foreground-500 mt-1">
            Manage your organization LMS plan tiers, resource quotas, and billing cycle.
          </p>
        </div>

        {/* Current Plan Overview Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border-2 border-emerald-500 shadow-soft-md flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              Current Active Plan
            </span>
            <h3 className="font-heading text-2xl font-extrabold text-foreground-950">
              BUSINESS LMS TIER
            </h3>
            <p className="text-xs text-foreground-600 max-w-md">
              Includes 20 instructor seats, up to 5,000 active students, unlimited course uploads, custom branding, and automated PDF certification.
            </p>
            <div className="pt-2 text-xs font-mono text-foreground-500">
              Billing Cycle: <strong>$199 / month</strong> • Renews on <strong>October 26, 2026</strong>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => alert('Opening payment method update modal')}
              className="px-4 py-2.5 rounded-xl border border-background-300 hover:bg-background-50 text-xs font-bold text-foreground-700"
            >
              Update Payment Method
            </button>
            <button
              onClick={() => alert('Upgraded to Enterprise Tier!')}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-soft-sm"
            >
              Upgrade to Enterprise
            </button>
          </div>
        </div>

        {/* 4 Plan Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-background-200 shadow-soft-sm space-y-3">
            <h4 className="font-heading text-base font-bold text-foreground-950">FREE</h4>
            <div className="font-heading text-2xl font-extrabold text-foreground-900">$0</div>
            <ul className="text-xs text-foreground-600 space-y-1.5 pt-2 border-t border-background-100">
              <li>• 1 Instructor</li>
              <li>• 50 Students</li>
              <li>• 5 Courses</li>
              <li>• Basic Analytics</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-background-200 shadow-soft-sm space-y-3">
            <h4 className="font-heading text-base font-bold text-foreground-950">STARTER</h4>
            <div className="font-heading text-2xl font-extrabold text-foreground-900">$79/mo</div>
            <ul className="text-xs text-foreground-600 space-y-1.5 pt-2 border-t border-background-100">
              <li>• 5 Instructors</li>
              <li>• 500 Students</li>
              <li>• 50 Courses</li>
              <li>• Certificates</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/50 border-2 border-emerald-500 shadow-soft-md space-y-3 relative">
            <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-600 text-white">
              Current
            </span>
            <h4 className="font-heading text-base font-bold text-emerald-950">BUSINESS</h4>
            <div className="font-heading text-2xl font-extrabold text-emerald-950">$199/mo</div>
            <ul className="text-xs text-emerald-900 space-y-1.5 pt-2 border-t border-emerald-200">
              <li>• 20 Instructors</li>
              <li>• 5,000 Students</li>
              <li>• Unlimited Courses</li>
              <li>• Custom Branding</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-background-200 shadow-soft-sm space-y-3">
            <h4 className="font-heading text-base font-bold text-foreground-950">ENTERPRISE</h4>
            <div className="font-heading text-2xl font-extrabold text-foreground-900">$499/mo</div>
            <ul className="text-xs text-foreground-600 space-y-1.5 pt-2 border-t border-background-100">
              <li>• Unlimited Instructors</li>
              <li>• Unlimited Students</li>
              <li>• Custom Domain</li>
              <li>• 100% White-Label</li>
            </ul>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
