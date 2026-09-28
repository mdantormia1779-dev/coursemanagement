'use client';

import Link from 'next/link';
import PortalLayout from '@/components/portal/PortalLayout';
import { ADMIN_NAV } from '@/data/portalNavs';

export default function AdminOrganizationsPage() {
  return (
    <PortalLayout
      role="admin"
      userName="Academy Director"
      userRoleLabel="Academy Administrator"
      navItems={ADMIN_NAV}
    >
      <div className="max-w-2xl mx-auto py-12 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center text-3xl mx-auto">
          <i className="ri-building-line" />
        </div>
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary-100 text-primary-800 uppercase tracking-wider">
            Dedicated Academy Instance
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground-950">
            Single Academy LMS Mode
          </h2>
          <p className="text-sm text-foreground-600 max-w-md mx-auto leading-relaxed">
            This platform is configured strictly for our own internal Academy usage. Multi-tenant external organization management is disabled so you can focus on our own courses, students, and live batches.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            href="/admin/dashboard"
            className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-soft-sm transition-colors"
          >
            Go to Academy Dashboard
          </Link>
          <Link
            href="/admin/courses"
            className="px-5 py-2.5 rounded-xl bg-background-100 hover:bg-background-200 text-foreground-800 font-bold text-xs border border-background-300 transition-colors"
          >
            Manage Our Courses
          </Link>
        </div>
      </div>
    </PortalLayout>
  );
}
