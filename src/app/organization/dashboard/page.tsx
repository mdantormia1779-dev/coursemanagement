'use client';

import Link from 'next/link';
import PortalLayout from '@/components/portal/PortalLayout';
import { ORG_NAV } from '@/data/portalNavs';

export default function OrganizationDashboardPage() {
  return (
    <PortalLayout
      role="organization"
      userName="Admin @ Apex Academy"
      userRoleLabel="Tenant Administrator"
      organizationName="Apex Academy LMS"
      navItems={ORG_NAV}
    >
      <div className="space-y-8">
        
        {/* Organization Tenant Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-900 text-white shadow-soft-lg flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-emerald-200 border border-white/10 uppercase tracking-wider">
                Multi-Tenant Organization
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-400 text-emerald-950">
                Business Plan Active
              </span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold mt-2">
              Apex Academy LMS Portal
            </h2>
            <p className="text-sm text-emerald-100/90 mt-1 max-w-lg">
              Manage your private academy faculty, students, custom branding, and student graduation certificates.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/organization/branding"
              className="px-5 py-3 rounded-xl bg-white hover:bg-emerald-50 text-emerald-950 font-bold text-xs shadow-soft-md transition-all flex items-center gap-1.5"
            >
              <i className="ri-palette-line text-base text-emerald-600" />
              <span>White-Label Branding</span>
            </Link>
          </div>
        </div>

        {/* 4 Tenant KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 rounded-2xl bg-white border border-background-200 shadow-soft-sm">
            <span className="text-xs font-semibold text-foreground-500">Enrolled Students</span>
            <div className="mt-2 font-heading text-3xl font-extrabold text-foreground-950">1,250</div>
            <p className="mt-1 text-xs text-emerald-600 font-medium">+18% this month</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-background-200 shadow-soft-sm">
            <span className="text-xs font-semibold text-foreground-500">Active Instructors</span>
            <div className="mt-2 font-heading text-3xl font-extrabold text-foreground-950">18</div>
            <p className="mt-1 text-xs text-foreground-500 font-medium">Limit: 20 instructors</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-background-200 shadow-soft-sm">
            <span className="text-xs font-semibold text-foreground-500">Academy Courses</span>
            <div className="mt-2 font-heading text-3xl font-extrabold text-foreground-950">28</div>
            <p className="mt-1 text-xs text-foreground-500 font-medium">Unlimited courses enabled</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-background-200 shadow-soft-sm">
            <span className="text-xs font-semibold text-foreground-500">Certificates Issued</span>
            <div className="mt-2 font-heading text-3xl font-extrabold text-foreground-950">840</div>
            <p className="mt-1 text-xs text-emerald-600 font-medium">100% Verified</p>
          </div>
        </div>

        {/* Organization Features & Settings Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-background-200 shadow-soft-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-background-100">
              <h3 className="font-heading text-base font-bold text-foreground-950">
                Custom Domain & White-Label Status
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                Connected & SSL Active
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-background-50 border border-background-200">
                <div>
                  <div className="font-bold text-foreground-900">Custom Domain Hostname</div>
                  <div className="text-foreground-500 font-mono">academy.apexacademy.com</div>
                </div>
                <span className="font-mono text-emerald-600 font-bold">DNS Verified ✓</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-background-50 border border-background-200">
                <div>
                  <div className="font-bold text-foreground-900">Primary Brand Accent</div>
                  <div className="text-foreground-500">Hex: #059669 (Emerald)</div>
                </div>
                <div className="w-6 h-6 rounded-lg bg-emerald-600 shadow-soft-sm" />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-background-50 border border-background-200">
                <div>
                  <div className="font-bold text-foreground-900">Platform Watermark Status</div>
                  <div className="text-foreground-500">White-label enterprise mode</div>
                </div>
                <span className="font-bold text-primary-600">LearnX Branding Hidden ✓</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-background-200 shadow-soft-sm space-y-4">
            <h3 className="font-heading text-base font-bold text-foreground-950">
              SaaS Plan Limits
            </h3>
            <div className="space-y-3 text-xs text-foreground-600">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Student Quota:</span>
                  <span className="font-bold text-foreground-900">1,250 / 5,000 (25%)</span>
                </div>
                <div className="w-full h-2 bg-background-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '25%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Instructor Seats:</span>
                  <span className="font-bold text-foreground-900">18 / 20 (90%)</span>
                </div>
                <div className="w-full h-2 bg-background-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '90%' }} />
                </div>
              </div>

              <Link
                href="/organization/subscription"
                className="mt-4 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs text-center block transition-colors"
              >
                Upgrade Plan Tier
              </Link>
            </div>
          </div>
        </div>

      </div>
    </PortalLayout>
  );
}
