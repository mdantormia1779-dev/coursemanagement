'use client';

import PortalLayout from '@/components/portal/PortalLayout';
import { INSTRUCTOR_NAV } from '@/data/portalNavs';

interface EnrolledStudent {
  id: string;
  name: string;
  email: string;
  course: string;
  enrolledDate: string;
  progress: number;
}

const ROSTER_STUDENTS: EnrolledStudent[] = [
  { id: 'st1', name: 'Sarah Khan', email: 'sarah.khan@example.com', course: 'Complete Next.js Development', enrolledDate: 'Sep 12, 2026', progress: 72 },
  { id: 'st2', name: 'Tanvir Ahmed', email: 'tanvir.ahmed@example.com', course: 'Complete Next.js Development', enrolledDate: 'Sep 14, 2026', progress: 54 },
  { id: 'st3', name: 'Nadia Rahman', email: 'nadia.r@example.com', course: 'Advanced TypeScript Patterns', enrolledDate: 'Aug 28, 2026', progress: 90 },
  { id: 'st4', name: 'Marcus Lee', email: 'marcus.lee@example.com', course: 'Advanced TypeScript Patterns', enrolledDate: 'Sep 01, 2026', progress: 30 },
];

export default function InstructorStudentsPage() {
  return (
    <PortalLayout
      role="instructor"
      userName="John Doe"
      userRoleLabel="Senior Software Engineer & Lead Instructor"
      navItems={INSTRUCTOR_NAV}
    >
      <div className="space-y-6">
        <div>
          <h2 className="font-heading text-2xl font-extrabold text-foreground-950">
            Student Roster ({ROSTER_STUDENTS.length})
          </h2>
          <p className="text-sm text-foreground-500 mt-1">
            Track student learning progress and course completion velocity.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-background-200 shadow-soft-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-background-50 border-b border-background-200 text-foreground-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Course Enrolled</th>
                  <th className="p-4">Enrolled Date</th>
                  <th className="p-4">Course Progress</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-background-100">
                {ROSTER_STUDENTS.map((st) => (
                  <tr key={st.id} className="hover:bg-background-50/50">
                    <td className="p-4 font-bold text-foreground-950 text-sm">{st.name}</td>
                    <td className="p-4 text-foreground-600">{st.email}</td>
                    <td className="p-4 font-semibold text-foreground-900">{st.course}</td>
                    <td className="p-4 text-foreground-500">{st.enrolledDate}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-background-200 rounded-full overflow-hidden">
                          <div className="h-full bg-primary-600 rounded-full" style={{ width: `${st.progress}%` }} />
                        </div>
                        <span className="font-bold text-foreground-800">{st.progress}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button className="px-2.5 py-1 rounded-lg border border-background-300 hover:bg-background-100 font-semibold text-foreground-700">
                        Message
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
