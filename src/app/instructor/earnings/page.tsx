'use client';

import { useState } from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { INSTRUCTOR_NAV } from '@/data/portalNavs';

interface WithdrawalRecord {
  id: string;
  amount: number;
  method: string;
  account: string;
  date: string;
  status: 'COMPLETED' | 'PENDING' | 'REJECTED';
}

const SAMPLE_WITHDRAWALS: WithdrawalRecord[] = [
  { id: 'w1', amount: 35000, method: 'bKash Personal', account: '01712-XXXXXX', date: 'Sep 01, 2026', status: 'COMPLETED' },
  { id: 'w2', amount: 50000, method: 'Bank Transfer (City Bank)', account: 'A/C: 11029XXXX', date: 'Aug 01, 2026', status: 'COMPLETED' },
  { id: 'w3', amount: 20000, method: 'bKash Personal', account: '01712-XXXXXX', date: 'Jul 01, 2026', status: 'COMPLETED' },
];

export default function InstructorEarningsPage() {
  const [balance, setBalance] = useState(45000);
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('20000');
  const [method, setMethod] = useState('bKash');
  const [accountNo, setAccountNo] = useState('01712-345678');
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>(SAMPLE_WITHDRAWALS);

  const handleRequestWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount);
    if (amt > balance || amt <= 0) {
      alert('Withdrawal amount exceeds available balance.');
      return;
    }

    setBalance(balance - amt);
    setWithdrawals([
      {
        id: `w-${Date.now()}`,
        amount: amt,
        method: method,
        account: accountNo,
        date: 'Just now',
        status: 'PENDING'
      },
      ...withdrawals
    ]);
    setWithdrawModal(false);
  };

  return (
    <PortalLayout
      role="instructor"
      userName="John Doe"
      userRoleLabel="Senior Software Engineer & Lead Instructor"
      navItems={INSTRUCTOR_NAV}
    >
      <div className="space-y-8">
        <div>
          <h2 className="font-heading text-2xl font-extrabold text-foreground-950">
            Earnings & Payouts
          </h2>
          <p className="text-sm text-foreground-500 mt-1">
            Revenue tracking with 80/20 instructor split and secure mobile financial withdrawals.
          </p>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-background-200 shadow-soft-sm">
            <span className="text-xs font-bold text-foreground-500 uppercase">Available Balance</span>
            <div className="mt-2 font-heading text-3xl font-extrabold text-indigo-600">
              ৳{balance.toLocaleString()} BDT
            </div>
            <p className="mt-1 text-xs text-foreground-500">Ready for instant withdrawal request</p>
            <button
              onClick={() => setWithdrawModal(true)}
              className="mt-5 w-full py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-soft-sm transition-all"
            >
              Request Withdrawal
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-background-200 shadow-soft-sm">
            <span className="text-xs font-bold text-foreground-500 uppercase">Total Lifetime Sales</span>
            <div className="mt-2 font-heading text-3xl font-extrabold text-foreground-950">
              ৳677,500 BDT
            </div>
            <p className="mt-1 text-xs text-foreground-500">Gross student course enrollments</p>
            <div className="mt-5 pt-3 border-t border-background-100 flex items-center justify-between text-xs">
              <span className="text-foreground-500">Platform Commission (20%)</span>
              <span className="font-bold text-foreground-800">-৳135,500 BDT</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-background-200 shadow-soft-sm">
            <span className="text-xs font-bold text-foreground-500 uppercase">Total Paid Out</span>
            <div className="mt-2 font-heading text-3xl font-extrabold text-emerald-600">
              ৳497,000 BDT
            </div>
            <p className="mt-1 text-xs text-foreground-500">Successfully sent to your bank & bKash</p>
            <div className="mt-5 pt-3 border-t border-background-100 flex items-center justify-between text-xs">
              <span className="text-foreground-500">Payout Status</span>
              <span className="font-bold text-emerald-600">100% Up to date ✓</span>
            </div>
          </div>
        </div>

        {/* Withdrawal History Table */}
        <div className="space-y-4">
          <h3 className="font-heading text-lg font-bold text-foreground-950">
            Withdrawal Request History
          </h3>

          <div className="bg-white rounded-2xl border border-background-200 shadow-soft-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-background-50 border-b border-background-200 text-foreground-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Method</th>
                  <th className="p-4">Account Reference</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-background-100">
                {withdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-background-50/50">
                    <td className="p-4 text-foreground-600">{w.date}</td>
                    <td className="p-4 font-bold text-foreground-950">৳{w.amount.toLocaleString()}</td>
                    <td className="p-4 font-semibold text-foreground-800">{w.method}</td>
                    <td className="p-4 text-foreground-600 font-mono">{w.account}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          w.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {w.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Withdrawal Request Modal */}
        {withdrawModal && (
          <div className="fixed inset-0 z-50 bg-foreground-950/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-soft-xl border border-background-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-background-200">
                <h3 className="font-heading text-lg font-bold text-foreground-950">
                  Request Payout Withdrawal
                </h3>
                <button onClick={() => setWithdrawModal(false)} className="text-foreground-400 hover:text-foreground-800">
                  <i className="ri-close-line text-xl" />
                </button>
              </div>

              <form onSubmit={handleRequestWithdrawal} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-foreground-700 mb-1">
                    Withdrawal Amount (BDT ৳) *
                  </label>
                  <input
                    type="number"
                    max={balance}
                    min="500"
                    required
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-base font-bold outline-none focus:border-primary-500"
                  />
                  <span className="text-[11px] text-foreground-500 mt-1 block">
                    Available: ৳{balance.toLocaleString()} BDT
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground-700 mb-1">
                    Payout Channel *
                  </label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm font-semibold outline-none focus:border-primary-500 bg-white"
                  >
                    <option value="bKash">bKash (Mobile Wallet)</option>
                    <option value="Nagad">Nagad (Mobile Wallet)</option>
                    <option value="Bank Transfer">City Bank / BRAC Bank (Direct ACH)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground-700 mb-1">
                    Account / Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={accountNo}
                    onChange={(e) => setAccountNo(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm font-mono outline-none focus:border-primary-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-background-200">
                  <button
                    type="button"
                    onClick={() => setWithdrawModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-foreground-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-soft-sm"
                  >
                    Submit Withdrawal Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
