'use client';

import Link from 'next/link';
import PortalLayout from '@/components/portal/PortalLayout';
import { ADMIN_NAV } from '@/data/portalNavs';

export default function AdminSubscriptionsPage() {
  const plans = [
    {
      tier: 'Option 1',
      title: 'Seat Booking Deposit',
      price: '৳1,000',
      period: 'one-time deposit',
      desc: 'Minimum deposit to reserve an enrolled seat in upcoming live batch',
      features: [
        'Batch seat reservation',
        'Direct WhatsApp confirmation',
        'Preparatory materials',
        'Remaining fee in installments',
      ],
      badge: 'Popular',
    },
    {
      tier: 'Option 2',
      title: 'Scholarship Exam Pass',
      price: '৳5,000',
      period: 'discounted course fee',
      desc: 'Special rate for candidates who pass the 10-min scholarship exam at /exam',
      features: [
        'Save ৳3,000 from standard fee',
        'All live classes on Meet/Zoom',
        'HD recordings & code repo',
        'Mentor WhatsApp support',
      ],
      badge: 'Scholarship',
    },
    {
      tier: 'Option 3',
      title: 'Direct Full Course',
      price: '৳8,000',
      period: 'full course fee',
      desc: 'Upfront enrollment with full perks, lifetime updates, and job referral assistance',
      features: [
        'Immediate batch admission',
        '1-on-1 portfolio review',
        'Career mentoring & mock calls',
        'Verifiable certificate',
      ],
      badge: 'Standard',
    },
  ];

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
              Academy Admission Plans & Pricing Structure
            </h2>
            <p className="text-sm text-foreground-500 mt-1">
              Active fee structures for student course admissions, seat bookings, and scholarship qualification.
            </p>
          </div>
          <Link
            href="/admin/settings"
            className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-soft-sm transition-colors"
          >
            Configure Fees & Numbers
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div key={p.title} className="p-6 rounded-2xl bg-white border border-background-200 shadow-soft-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground-500 uppercase">{p.tier}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary-100 text-primary-800">
                  {p.badge}
                </span>
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground-950">{p.title}</h3>
              <div className="font-heading text-3xl font-extrabold text-foreground-950">
                {p.price} <span className="text-xs font-normal text-foreground-400">/{p.period}</span>
              </div>
              <p className="text-xs text-foreground-500">{p.desc}</p>
              <ul className="text-xs text-foreground-600 space-y-2 pt-3 border-t border-background-100">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-1.5">
                    <i className="ri-check-line text-emerald-600 font-bold" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/admin/settings"
                className="w-full py-2.5 rounded-xl border border-background-300 hover:bg-background-50 text-xs font-bold flex items-center justify-center transition-colors"
              >
                Modify Fee
              </Link>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
