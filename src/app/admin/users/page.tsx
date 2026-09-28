'use client';

import { useState } from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { ADMIN_NAV } from '@/data/portalNavs';

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';
  department?: string;
  joined: string;
  status: 'ACTIVE' | 'SUSPENDED';
}

const SAMPLE_USERS: UserItem[] = [
  { id: 'u1', name: 'Academy Director', email: 'director@academy.com', role: 'ADMIN', department: 'Management', joined: 'Jan 2026', status: 'ACTIVE' },
  { id: 'u2', name: 'Operations Lead', email: 'admissions@academy.com', role: 'ADMIN', department: 'Admissions & CRM', joined: 'Feb 2026', status: 'ACTIVE' },
  { id: 'u3', name: 'John Doe', email: 'john@example.com', role: 'INSTRUCTOR', department: 'Web Development', joined: 'Mar 2026', status: 'ACTIVE' },
  { id: 'u4', name: 'Mina Park', email: 'mina@example.com', role: 'INSTRUCTOR', department: 'UI/UX Design', joined: 'Mar 2026', status: 'ACTIVE' },
  { id: 'u5', name: 'Sarah Khan', email: 'sarah.khan@example.com', role: 'STUDENT', joined: 'Apr 2026', status: 'ACTIVE' },
  { id: 'u6', name: 'Tanvir Ahmed', email: 'tanvir@example.com', role: 'STUDENT', joined: 'May 2026', status: 'ACTIVE' },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>(SAMPLE_USERS);
  const [filterRole, setFilterRole] = useState<string>('ALL');

  const toggleUserStatus = (id: string) => {
    setUsers(
      users.map((u) =>
        u.id === id ? { ...u, status: u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } : u
      )
    );
  };

  const filtered = users.filter((u) => (filterRole === 'ALL' ? true : u.role === filterRole));

  return (
    <PortalLayout
      role="admin"
      userName="Academy Director"
      userRoleLabel="Academy Administrator"
      navItems={ADMIN_NAV}
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl font-extrabold text-foreground-950">
              Academy Staff & Students Directory
            </h2>
            <p className="text-sm text-foreground-500 mt-1">
              Directory of Academy Administrators, Faculty Mentors, and Enrolled Students.
            </p>
          </div>

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 rounded-xl border border-background-300 text-xs font-bold outline-none bg-white"
          >
            <option value="ALL">All Roles ({users.length})</option>
            <option value="ADMIN">Academy Admins</option>
            <option value="INSTRUCTOR">Faculty Mentors</option>
            <option value="STUDENT">Students</option>
          </select>
        </div>

        <div className="bg-white rounded-2xl border border-background-200 shadow-soft-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-background-50 border-b border-background-200 text-foreground-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Department / Batch</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-background-100">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-background-50/50">
                    <td className="p-4">
                      <div className="font-bold text-foreground-950 text-sm">{u.name}</div>
                      <div className="text-foreground-500 text-[11px]">{u.email}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary-100 text-primary-800">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-foreground-600 font-medium">{u.department || 'Academy'}</td>
                    <td className="p-4 text-foreground-500">{u.joined}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {u.role !== 'ADMIN' && (
                        <button
                          onClick={() => toggleUserStatus(u.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                            u.status === 'ACTIVE'
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                        </button>
                      )}
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
