'use client';

import PortalLayout from '@/components/portal/PortalLayout';
import { ADMIN_NAV } from '@/data/portalNavs';

interface LogEntry {
  id: string;
  actor: string;
  action: string;
  resource: string;
  ipAddress: string;
  timestamp: string;
}

const SAMPLE_LOGS: LogEntry[] = [
  { id: 'l1', actor: 'Super Admin', action: 'ADMIN_APPROVED_COURSE', resource: 'Course: Scalable Node.js', ipAddress: '103.114.98.12', timestamp: '10 mins ago' },
  { id: 'l2', actor: 'Admin @ Apex Academy', action: 'TENANT_UPDATED_BRANDING', resource: 'Organization: Apex Academy', ipAddress: '103.205.71.4', timestamp: '35 mins ago' },
  { id: 'l3', actor: 'System Webhook', action: 'PAYMENT_VERIFIED_BKASH', resource: 'Order: ORD-2026-98124', ipAddress: '182.160.100.22', timestamp: '1 hour ago' },
  { id: 'l4', actor: 'Super Admin', action: 'ADMIN_APPROVED_WITHDRAWAL', resource: 'Instructor: David Adebayo', ipAddress: '103.114.98.12', timestamp: '3 hours ago' },
  { id: 'l5', actor: 'System Verification', action: 'CERTIFICATE_GENERATED', resource: 'Student: Sarah Khan (CERT-2026-000128)', ipAddress: 'Internal Event', timestamp: '5 hours ago' },
];

export default function AdminAuditLogsPage() {
  return (
    <PortalLayout
      role="admin"
      userName="Master Super Admin"
      userRoleLabel="Platform Operator"
      navItems={ADMIN_NAV}
    >
      <div className="space-y-6">
        <div>
          <h2 className="font-heading text-2xl font-extrabold text-foreground-950">
            System Security & Audit Trail
          </h2>
          <p className="text-sm text-foreground-500 mt-1">
            Immutable log of all administrative actions, financial transactions, and certificate operations.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-background-200 shadow-soft-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-background-50 border-b border-background-200 text-foreground-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Actor</th>
                <th className="p-4">Action Code</th>
                <th className="p-4">Target Resource</th>
                <th className="p-4 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-background-100 font-mono">
              {SAMPLE_LOGS.map((log) => (
                <tr key={log.id} className="hover:bg-background-50/50">
                  <td className="p-4 text-foreground-500 font-sans">{log.timestamp}</td>
                  <td className="p-4 font-bold text-foreground-900 font-sans">{log.actor}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-background-100 text-foreground-800 border border-background-300">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 text-foreground-700 font-sans">{log.resource}</td>
                  <td className="p-4 text-right text-foreground-500">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PortalLayout>
  );
}
