'use client';

import PortalLayout from '@/components/portal/PortalLayout';
import { ORG_NAV } from '@/data/portalNavs';

const ORG_INSTRUCTORS = [
  { id: '1', name: 'John Doe', role: 'Lead Architect', courses: 4, students: 342, rating: 4.9, status: 'ACTIVE' },
  { id: '2', name: 'Mina Park', role: 'UI/UX Director', courses: 3, students: 215, rating: 4.8, status: 'ACTIVE' },
  { id: '3', name: 'David Adebayo', role: 'Data Scientist', courses: 2, students: 180, rating: 4.9, status: 'ACTIVE' },
  { id: '4', name: 'Emily Watson', role: 'Growth Specialist', courses: 3, students: 140, rating: 4.7, status: 'ACTIVE' },
];

export default function OrganizationInstructorsPage() {
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
              Academy Instructors (18 / 20 Seats)
            </h2>
            <p className="text-sm text-foreground-500 mt-1">
              Manage instructors permitted to publish courses under Apex Academy.
            </p>
          </div>
          <button
            onClick={() => alert('Add instructor modal')}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-soft-sm"
          >
            + Add Instructor Seat
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-background-200 shadow-soft-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-background-50 border-b border-background-200 text-foreground-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Instructor</th>
                <th className="p-4">Role</th>
                <th className="p-4">Assigned Courses</th>
                <th className="p-4">Students Taught</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-background-100">
              {ORG_INSTRUCTORS.map((inst) => (
                <tr key={inst.id} className="hover:bg-background-50/50">
                  <td className="p-4 font-bold text-foreground-950 text-sm">{inst.name}</td>
                  <td className="p-4 text-foreground-600 font-medium">{inst.role}</td>
                  <td className="p-4 font-bold text-foreground-900">{inst.courses}</td>
                  <td className="p-4 text-foreground-700">{inst.students}</td>
                  <td className="p-4 font-bold text-amber-500">★ {inst.rating}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {inst.status}
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
