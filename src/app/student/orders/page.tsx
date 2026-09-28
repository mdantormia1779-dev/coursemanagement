'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PortalLayout from '@/components/portal/PortalLayout';
import { STUDENT_NAV } from '@/data/portalNavs';
import { getStudentOrders, StudentOrderRecord } from '@/lib/manualPaymentService';

interface OrderRecord {
  id: string;
  orderNumber: string;
  date: string;
  course: string;
  amount: number;
  paymentMethod: string;
  status: 'PAID' | 'PENDING' | 'REFUNDED';
}

const SAMPLE_ORDERS: OrderRecord[] = [
  {
    id: 'ord-1',
    orderNumber: 'ORD-2026-98124',
    date: 'Sep 12, 2026',
    course: 'Complete Next.js Development',
    amount: 1000,
    paymentMethod: 'bKash Manual (TrxID: 9X8A1239)',
    status: 'PAID',
  },
  {
    id: 'ord-2',
    orderNumber: 'ORD-2026-87110',
    date: 'Jul 04, 2026',
    course: 'UI/UX Design Fundamentals',
    amount: 1499,
    paymentMethod: 'SSLCommerz (Card)',
    status: 'PAID',
  },
  {
    id: 'ord-3',
    orderNumber: 'ORD-2026-65421',
    date: 'May 18, 2026',
    course: 'Modern React Masterclass',
    amount: 1799,
    paymentMethod: 'bKash (TrxID: 7M219801)',
    status: 'PAID',
  },
];

export default function StudentOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>(SAMPLE_ORDERS);

  const loadOrders = () => {
    const custom = getStudentOrders();
    // Merge custom with sample, preventing duplicate order numbers
    const existingOrderNos = new Set(custom.map((c) => c.orderNumber));
    const merged = [...custom, ...SAMPLE_ORDERS.filter((s) => !existingOrderNos.has(s.orderNumber))];
    setOrders(merged);
  };

  useEffect(() => {
    loadOrders();
    const handleUpdate = () => loadOrders();
    window.addEventListener('learnx_manual_payments_changed', handleUpdate);
    window.addEventListener('learnx_course_unlocked', handleUpdate);
    return () => {
      window.removeEventListener('learnx_manual_payments_changed', handleUpdate);
      window.removeEventListener('learnx_course_unlocked', handleUpdate);
    };
  }, []);

  return (
    <PortalLayout
      role="student"
      userName="Sarah Khan"
      userRoleLabel="Frontend Developer"
      navItems={STUDENT_NAV}
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl font-extrabold text-foreground-950">
              Order & Purchase History
            </h2>
            <p className="text-sm text-foreground-500 mt-1">
              Official snapshots for all manual payments, seat bookings, and enrolled courses.
            </p>
          </div>

          <Link
            href="/checkout?plan=seat-booking&amount=1000"
            className="px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-soft-sm flex items-center gap-1.5 self-start sm:self-auto transition-colors"
          >
            <i className="ri-add-circle-line text-sm" />
            <span>New Seat Booking (৳1,000)</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-background-200 shadow-soft-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-background-50 border-b border-background-200 text-foreground-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Order #</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Course Item</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-background-100">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-background-50/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-foreground-900">{ord.orderNumber}</td>
                    <td className="p-4 text-foreground-600">{ord.date}</td>
                    <td className="p-4 font-bold text-foreground-950">{ord.course}</td>
                    <td className="p-4 text-foreground-600 font-mono">{ord.paymentMethod}</td>
                    <td className="p-4 font-bold text-foreground-950">৳{ord.amount.toLocaleString()} BDT</td>
                    <td className="p-4">
                      {ord.status === 'PAID' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          PAID & ENROLLED
                        </span>
                      ) : ord.status === 'PENDING' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                          ⏳ PENDING APPROVAL
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          {ord.status}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {ord.status === 'PAID' ? (
                        <Link
                          href="/student/learning/complete-nextjs-development"
                          className="px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-bold text-[11px] inline-flex items-center gap-1 shadow-soft-xs"
                        >
                          <i className="ri-play-circle-line" />
                          <span>Start Course</span>
                        </Link>
                      ) : (
                        <button
                          onClick={() => alert(`আপনার পেমেন্টটি এডমিন ভেরিফিকেশনের জন্য অপেক্ষমান আছে। ভেরিফাই হলেই কোর্স স্টার্ট করতে পারবেন।`)}
                          className="px-2.5 py-1 rounded-lg border border-amber-300 bg-amber-50 text-amber-800 font-bold text-[11px]"
                        >
                          Pending Review
                        </button>
                      )}

                      <button
                        onClick={() => alert(`Downloading Official Invoice Receipt: ${ord.orderNumber}`)}
                        className="px-2.5 py-1 rounded-lg border border-background-300 hover:bg-background-100 font-semibold text-foreground-700 inline-flex items-center gap-1"
                      >
                        <i className="ri-file-text-line" /> PDF
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
