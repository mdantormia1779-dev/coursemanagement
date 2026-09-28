'use client';

import PortalLayout from '@/components/portal/PortalLayout';
import { ORG_NAV } from '@/data/portalNavs';

const TENANT_STUDENTS = [
  { id: '1', name: 'Sarah Khan', email: 'sarah.khan@example.com', enrolled: 3, completed: 1, joined: 'Sep 2026', status: 'ACTIVE' },
  { id: '2', name: 'Tanvir Ahmed', email: 'tanvir@example.com', enrolled: 2, completed: 0, joined: 'Aug 2026', status: 'ACTIVE' },
  { id: '3', name: 'Nadia Rahman', email: 'nadia@example.com', enrolled: 4, completed: 2, joined: 'Jul 2026', status: 'ACTIVE' },
  { id: '4', name: 'Marcus Lee', email: 'marcus@example.com', enrolled: 1, completed: 0, joined: 'Sep 2026', status: 'ACTIVE' },
];

export default function OrganizationStudentsPage() {
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
              Tenant Student Body (1,250)
            </h2>
            <p className="text-sm text-foreground-500 mt-1">
              Isolated student records belonging strictly to Apex Academy.
            </p>
          </div>
          <button
            onClick={() => alert('Invite students modal')}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-soft-sm"
          >
            + Invite New Students
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-background-200 shadow-soft-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-background-50 border-b border-background-200 text-foreground-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Student Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Enrolled Courses</th>
                <th className="p-4">Completed</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-background-100">
              {TENANT_STUDENTS.map((st) => (
                <tr key={st.id} className="hover:bg-background-50/50">
                  <td className="p-4 font-bold text-foreground-950">{st.name}</td>
                  <td className="p-4 text-foreground-600">{st.email}</td>
                  <td className="p-4 font-bold text-foreground-900">{st.enrolled}</td>
                  <td className="p-4 font-bold text-emerald-600">{st.completed}</td>
                  <td className="p-4 text-foreground-500">{st.joined}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {st.status}
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
