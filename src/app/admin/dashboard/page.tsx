'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PortalLayout from '@/components/portal/PortalLayout';
import { ADMIN_NAV } from '@/data/portalNavs';
import { getPaymentRequests, ManualPaymentRequest } from '@/lib/manualPaymentService';

export default function AcademyAdminDashboardPage() {
  const [paymentRequests, setPaymentRequests] = useState<ManualPaymentRequest[]>([]);

  useEffect(() => {
    setPaymentRequests(getPaymentRequests());
    const onUpdate = () => setPaymentRequests(getPaymentRequests());
    window.addEventListener('learnx_manual_payments_changed', onUpdate);
    return () => window.removeEventListener('learnx_manual_payments_changed', onUpdate);
  }, []);

  const pendingApprovalsCount = paymentRequests.filter((r) => r.status === 'PENDING').length;

  return (
    <PortalLayout
      role="admin"
      userName="Academy Director"
      userRoleLabel="Academy Administrator"
      navItems={ADMIN_NAV}
    >
      <div className="space-y-8">
        
        {/* Academy Welcome Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white shadow-soft-lg flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary-500/20 text-primary-300 border border-primary-500/30 uppercase tracking-wider">
                Internal Academy LMS
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-500/30">
                All Classes & Systems Active
              </span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold mt-2">
              Academy Operations & Student Command
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Centralized management for our courses, scheduled live classes, WhatsApp calling CRM, manual student admissions (৳1,000 seat bookings), and scholarship exam candidates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/admin/admissions?tab=approvals"
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs shadow-soft-md transition-all flex items-center gap-2"
            >
              <i className="ri-shield-check-line text-sm" />
              <span>
                Payment Approvals ({pendingApprovalsCount})
              </span>
            </Link>
            <Link
              href="/admin/leads"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-soft-md transition-all flex items-center gap-2"
            >
              <i className="ri-customer-service-2-line text-sm" />
              <span>WhatsApp CRM</span>
            </Link>
            <Link
              href="/admin/admissions?tab=registration"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs shadow-soft-md transition-all flex items-center gap-2"
            >
              <i className="ri-user-add-line text-sm text-primary-600" />
              <span>New Admission (৳1K / Full)</span>
            </Link>
          </div>
        </div>

        {/* Pending Manual Payments Alert Banner */}
        {pendingApprovalsCount > 0 && (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 shadow-soft-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-amber-950 flex items-center justify-center text-xl shrink-0 font-bold">
                <i className="ri-time-line" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-950">
                  {pendingApprovalsCount}টি ম্যানুয়াল পেমেন্ট অনুমোদনের জন্য অপেক্ষমান রয়েছে
                </h4>
                <p className="text-xs text-amber-800 mt-0.5">
                  শিক্ষার্থীরা /checkout থেকে ৳১,০০০ সিট বুকিং বা কোর্স ফির TrxID সাবমিট করেছেন। যাচাই করে অনুমোদন দিন।
                </p>
              </div>
            </div>

            <Link
              href="/admin/admissions?tab=approvals"
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-soft-xs flex items-center gap-1.5 self-start sm:self-auto transition-colors"
            >
              <span>Review & Approve Now</span>
              <i className="ri-arrow-right-line" />
            </Link>
          </div>
        )}

        {/* 4 Academy KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 rounded-2xl bg-white border border-background-200 shadow-soft-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground-500">Total Course Revenue</span>
              <i className="ri-wallet-3-line text-emerald-600 text-lg" />
            </div>
            <div className="mt-2 font-heading text-2xl sm:text-3xl font-extrabold text-foreground-950">
              ৳1,840,000
            </div>
            <p className="mt-1 text-xs text-emerald-600 font-semibold">Direct enrollments & seat deposits</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-background-200 shadow-soft-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground-500">WhatsApp Calling Leads</span>
              <i className="ri-whatsapp-line text-emerald-500 text-lg" />
            </div>
            <div className="mt-2 font-heading text-2xl sm:text-3xl font-extrabold text-indigo-600">
              142 Leads
            </div>
            <p className="mt-1 text-xs text-foreground-500">Active calling & follow-up pipeline</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-background-200 shadow-soft-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground-500">Booked Seats (৳1,000)</span>
              <i className="ri-bookmark-3-line text-amber-500 text-lg" />
            </div>
            <div className="mt-2 font-heading text-2xl sm:text-3xl font-extrabold text-foreground-950">
              48 Booked
            </div>
            <p className="mt-1 text-xs text-amber-600 font-semibold">Confirmed via WhatsApp call</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-background-200 shadow-soft-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground-500">Active Enrolled Students</span>
              <i className="ri-user-star-line text-primary-600 text-lg" />
            </div>
            <div className="mt-2 font-heading text-2xl sm:text-3xl font-extrabold text-foreground-950">
              1,240
            </div>
            <p className="mt-1 text-xs text-primary-600 font-semibold">Across all academy batches</p>
          </div>
        </div>

        {/* 2 Operations Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent WhatsApp Leads & Call Statuses */}
          <div className="p-6 rounded-2xl bg-white border border-background-200 shadow-soft-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-background-100">
              <div>
                <h3 className="font-heading text-base font-bold text-foreground-950 flex items-center gap-2">
                  <i className="ri-customer-service-2-line text-emerald-600" />
                  <span>Recent WhatsApp Calls & Inquiries</span>
                </h3>
                <p className="text-xs text-foreground-500">Follow-up status and excuses tracking</p>
              </div>
              <Link href="/admin/leads" className="text-xs font-bold text-primary-600 hover:underline">
                View CRM →
              </Link>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-background-50 border border-background-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-foreground-950">Sabbir Hossain</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Confirmed (৳1,000 Paid)
                    </span>
                  </div>
                  <p className="text-[11px] text-foreground-500 mt-0.5">
                    📱 01712-345678 • Full Stack Next.js • Call Received
                  </p>
                </div>
                <Link
                  href="/admin/admissions"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-soft-sm"
                >
                  Admit
                </Link>
              </div>

              <div className="p-3.5 rounded-xl bg-background-50 border border-background-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-foreground-950">Nusrat Jahan</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      Need 2 Days Time
                    </span>
                  </div>
                  <p className="text-[11px] text-foreground-500 mt-0.5">
                    📱 01823-987654 • UI/UX Design • Waiting for salary
                  </p>
                </div>
                <Link
                  href="/admin/leads"
                  className="px-3 py-1.5 rounded-lg bg-background-200 hover:bg-background-300 text-foreground-800 text-xs font-bold"
                >
                  Call Again
                </Link>
              </div>

              <div className="p-3.5 rounded-xl bg-background-50 border border-background-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-foreground-950">Mehedi Hasan</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                      Passed Exam (৳5K)
                    </span>
                  </div>
                  <p className="text-[11px] text-foreground-500 mt-0.5">
                    📱 01911-554433 • Python & AI • Score: 90%
                  </p>
                </div>
                <Link
                  href="/admin/admissions"
                  className="px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-soft-sm"
                >
                  Enroll
                </Link>
              </div>
            </div>
          </div>

          {/* Today's Live Class Hub */}
          <div className="p-6 rounded-2xl bg-white border border-background-200 shadow-soft-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-background-100">
              <div>
                <h3 className="font-heading text-base font-bold text-foreground-950 flex items-center gap-2">
                  <i className="ri-broadcast-line text-rose-600" />
                  <span>Live Classes & Mentor Sessions</span>
                </h3>
                <p className="text-xs text-foreground-500">Google Meet & Zoom classes today</p>
              </div>
              <Link href="/instructor/live-classes" className="text-xs font-bold text-primary-600 hover:underline">
                Manage Hub →
              </Link>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-primary-50/50 border border-primary-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <h4 className="text-xs font-bold text-foreground-950">Next.js 14 Server Actions Deep Dive</h4>
                  </div>
                  <p className="text-[11px] text-foreground-500 mt-0.5">
                    Batch 12 • 08:30 PM (BDT) • Google Meet • 84 Enrolled
                  </p>
                </div>
                <Link
                  href="/instructor/live-classes"
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-soft-sm"
                >
                  Start Class
                </Link>
              </div>

              <div className="p-3.5 rounded-xl bg-background-50 border border-background-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-foreground-950">Figma Auto-Layout & Design System</h4>
                  <p className="text-[11px] text-foreground-500 mt-0.5">
                    Batch 08 • Tomorrow 09:00 PM • Zoom Meeting
                  </p>
                </div>
                <Link
                  href="/instructor/live-classes"
                  className="px-3 py-1.5 rounded-lg bg-background-200 hover:bg-background-300 text-foreground-800 text-xs font-bold"
                >
                  View
                </Link>
              </div>

              <div className="p-3.5 rounded-xl bg-background-50 border border-background-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-foreground-950">Scholarship Exam Portal</h4>
                  <p className="text-[11px] text-foreground-500 mt-0.5">
                    Active Test: ৳5,000 Course Fee Scholarship (10 min timer)
                  </p>
                </div>
                <Link
                  href="/exam"
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-soft-sm"
                >
                  View Exam
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </PortalLayout>
  );
}
