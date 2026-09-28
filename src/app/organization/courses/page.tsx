'use client';

import Link from 'next/link';
import PortalLayout from '@/components/portal/PortalLayout';
import { ORG_NAV } from '@/data/portalNavs';

const TENANT_COURSES = [
  { id: '1', title: 'Complete Next.js Development', instructor: 'John Doe', category: 'Web Development', students: 182, price: 1999, status: 'PUBLISHED' },
  { id: '2', title: 'UI/UX Design Fundamentals', instructor: 'Mina Park', category: 'Design', students: 215, price: 1499, status: 'PUBLISHED' },
  { id: '3', title: 'Python for Data Science', instructor: 'David Adebayo', category: 'Data Science', students: 180, price: 1899, status: 'PUBLISHED' },
  { id: '4', title: 'Digital Marketing Masterclass', instructor: 'Emily Watson', category: 'Marketing', students: 140, price: 1399, status: 'PUBLISHED' },
];

export default function OrganizationCoursesPage() {
  return (
    <PortalLayout
      role="organization"
      userName="Admin @ Apex Academy"
      userRoleLabel="Tenant Administrator"
      organizationName="Apex Academy LMS"
      navItems={ORG_NAV}
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl font-extrabold text-foreground-950">
              Academy Course Catalog ({TENANT_COURSES.length})
            </h2>
            <p className="text-sm text-foreground-500 mt-1">
              Courses published under Apex Academy branding.
            </p>
          </div>
          <Link
            href="/instructor/courses/create"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-soft-sm"
          >
            + Create Academy Course
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-background-200 shadow-soft-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-background-50 border-b border-background-200 text-foreground-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Course</th>
                <th className="p-4">Assigned Instructor</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Students</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-background-100">
              {TENANT_COURSES.map((c) => (
                <tr key={c.id} className="hover:bg-background-50/50">
                  <td className="p-4 font-bold text-foreground-950 text-sm">{c.title}</td>
                  <td className="p-4 text-foreground-700">{c.instructor}</td>
                  <td className="p-4 text-foreground-600">{c.category}</td>
                  <td className="p-4 font-bold text-foreground-900">৳{c.price.toLocaleString()}</td>
                  <td className="p-4 font-bold text-foreground-900">{c.students}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PortalLayout>
  );
}
