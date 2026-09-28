'use client';

import { useState } from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { ADMIN_NAV } from '@/data/portalNavs';

interface PayoutRequest {
  id: string;
  instructor: string;
  amount: number;
  method: string;
  account: string;
  requestedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

const SAMPLE_PAYOUTS: PayoutRequest[] = [
  { id: 'req-1', instructor: 'John Doe', amount: 20000, method: 'bKash Personal', account: '01712-345678', requestedAt: 'Today 11:20 AM', status: 'PENDING' },
  { id: 'req-2', instructor: 'Mina Park', amount: 35000, method: 'City Bank Transfer', account: 'A/C: 11029482', requestedAt: 'Yesterday 04:15 PM', status: 'PENDING' },
  { id: 'req-3', instructor: 'David Adebayo', amount: 42000, method: 'Nagad Personal', account: '01819-998877', requestedAt: 'Sep 24, 2026', status: 'APPROVED' },
  { id: 'req-4', instructor: 'Emily Watson', amount: 18000, method: 'bKash Personal', account: '01911-223344', requestedAt: 'Sep 22, 2026', status: 'APPROVED' },
];

export default function AdminWithdrawalsPage() {
  const [payouts, setPayouts] = useState<PayoutRequest[]>(SAMPLE_PAYOUTS);

  const handleApprovePayout = (id: string) => {
    setPayouts(
      payouts.map((p) => (p.id === id ? { ...p, status: 'APPROVED' } : p))
    );
  };

  const handleRejectPayout = (id: string) => {
    setPayouts(
      payouts.map((p) => (p.id === id ? { ...p, status: 'REJECTED' } : p))
    );
  };

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
            Instructor Withdrawal Approvals
          </h2>
          <p className="text-sm text-foreground-500 mt-1">
            Verify instructor revenue eligibility and authorize bKash, Nagad, and Bank disbursements.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-background-200 shadow-soft-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-background-50 border-b border-background-200 text-foreground-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Instructor</th>
                <th className="p-4">Payout Amount</th>
                <th className="p-4">Method & Account</th>
                <th className="p-4">Request Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-background-100">
              {payouts.map((p) => (
                <tr key={p.id} className="hover:bg-background-50/50">
                  <td className="p-4 font-bold text-foreground-950 text-sm">{p.instructor}</td>
                  <td className="p-4 font-heading font-extrabold text-base text-foreground-950">
                    ৳{p.amount.toLocaleString()} BDT
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-foreground-800">{p.method}</span>
                    <div className="text-foreground-500 font-mono text-[11px]">{p.account}</div>
                  </td>
                  <td className="p-4 text-foreground-500">{p.requestedAt}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {p.status === 'PENDING' ? (
                      <>
                        <button
                          onClick={() => handleRejectPayout(p.id)}
                          className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleApprovePayout(p.id)}
                          className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-soft-sm"
                        >
                          Approve Payout
                        </button>
                      </>
                    ) : (
                      <span className="text-foreground-400 font-semibold">Processed</span>
                    )}
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
