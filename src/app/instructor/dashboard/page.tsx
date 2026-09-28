'use client';

import Link from 'next/link';
import PortalLayout from '@/components/portal/PortalLayout';
import { INSTRUCTOR_NAV } from '@/data/portalNavs';

export default function InstructorDashboardPage() {
  return (
    <PortalLayout
      role="instructor"
      userName="John Doe"
      userRoleLabel="Senior Software Engineer & Lead Instructor"
      navItems={INSTRUCTOR_NAV}
    >
      <div className="space-y-8">
        
        {/* Welcome & Create Course Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950 via-primary-900 to-indigo-900 text-white shadow-soft-lg flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-primary-200 border border-white/10 uppercase tracking-wider">
              Instructor Studio
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold mt-2">
              Welcome back, John! 🚀
            </h2>
            <p className="text-sm text-primary-100/90 mt-1 max-w-lg">
              You earned <strong className="text-white">৳28,400 BDT</strong> this week across your 3 published masterclasses. 14 new students joined today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/instructor/live-classes"
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-soft-md transition-all flex items-center gap-1.5"
            >
              <i className="ri-broadcast-line text-base" />
              <span>Live Classes Hub</span>
            </Link>

            <Link
              href="/instructor/courses/create"
              className="px-5 py-3 rounded-xl bg-white hover:bg-primary-50 text-indigo-950 font-bold text-xs shadow-soft-md transition-all flex items-center gap-1.5"
            >
              <i className="ri-add-circle-fill text-base text-primary-600" />
              <span>Create New Course</span>
            </Link>
          </div>
        </div>

        {/* Next Scheduled Live Class Notification */}
        <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-soft-xs">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-lg flex-shrink-0 shadow-soft">
              <i className="ri-broadcast-line"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-950">Next Scheduled Live Session</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-indigo-200 text-indigo-900">
                  Google Meet
                </span>
              </div>
              <p className="text-xs text-indigo-800 font-semibold mt-0.5">
                React Server Actions & Optimistic Mutations Workshop &bull; 30 September, 2026 at 8:00 PM
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href="/instructor/live-classes/lc-101"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-soft flex items-center gap-1.5 transition-colors"
            >
              <i className="ri-settings-4-line"></i>
              <span>Manage Meeting</span>
            </Link>
          </div>
        </div>

        {/* 4 Instructor KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 rounded-2xl bg-white border border-background-200 shadow-soft-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground-500">Total Revenue</span>
              <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <i className="ri-money-dollar-circle-line text-lg" />
              </span>
            </div>
            <div className="mt-3 font-heading text-2xl sm:text-3xl font-extrabold text-foreground-950">
              ৳542,000
            </div>
            <p className="mt-1 text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <i className="ri-arrow-up-line" /> Net after 20% platform share
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-background-200 shadow-soft-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground-500">Active Students</span>
              <span className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center font-bold">
                <i className="ri-group-line text-lg" />
              </span>
            </div>
            <div className="mt-3 font-heading text-2xl sm:text-3xl font-extrabold text-foreground-950">
              342
            </div>
            <p className="mt-1 text-xs text-primary-600 font-semibold">Across 3 active courses</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-background-200 shadow-soft-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground-500">Average Rating</span>
              <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <i className="ri-star-fill text-lg" />
              </span>
            </div>
            <div className="mt-3 font-heading text-2xl sm:text-3xl font-extrabold text-foreground-950">
              4.9 ★
            </div>
            <p className="mt-1 text-xs text-foreground-500 font-medium">From 218 student reviews</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-background-200 shadow-soft-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground-500">Available Payout</span>
              <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <i className="ri-wallet-3-line text-lg" />
              </span>
            </div>
            <div className="mt-3 font-heading text-2xl sm:text-3xl font-extrabold text-indigo-600">
              ৳45,000
            </div>
            <Link href="/instructor/earnings" className="mt-1 text-xs text-indigo-700 font-bold hover:underline block">
              Request Withdrawal →
            </Link>
          </div>
        </div>

        {/* 2-Column Split: Course Performance & Recent Reviews */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Published Courses Performance */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold text-foreground-950">
                Course Performance
              </h3>
              <Link href="/instructor/courses" className="text-xs font-bold text-primary-600 hover:underline">
                Manage Courses →
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-background-200 shadow-soft-sm divide-y divide-background-100 overflow-hidden">
              <div className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm shrink-0">
                    Next
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-foreground-950 truncate">Complete Next.js Development</h4>
                    <p className="text-xs text-foreground-500">182 students • ৳363,818 Gross Sales</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 shrink-0">
                  Published
                </span>
              </div>

              <div className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                    TS
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-foreground-950 truncate">Advanced TypeScript Patterns</h4>
                    <p className="text-xs text-foreground-500">96 students • ৳153,504 Gross Sales</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 shrink-0">
                  Published
                </span>
              </div>

              <div className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm shrink-0">
                    Node
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-foreground-950 truncate">Scalable Node.js & Microservices</h4>
                    <p className="text-xs text-foreground-500">Curriculum complete • Under review by admin</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 shrink-0">
                  Pending Review
                </span>
              </div>
            </div>
          </div>

          {/* Recent Student Feedback */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-bold text-foreground-950">
              Recent Reviews
            </h3>

            <div className="p-5 rounded-2xl bg-white border border-background-200 shadow-soft-sm space-y-4">
              <div className="space-y-1.5 pb-3 border-b border-background-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground-950">Sarah Khan</span>
                  <span className="text-amber-500 font-bold">★★★★★</span>
                </div>
                <p className="text-xs text-foreground-600 italic">
                  &ldquo;The deep-dive on Server Actions and optimistic updates is the best explanation on the internet.&rdquo;
                </p>
                <span className="text-[10px] text-foreground-400">Complete Next.js Development</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground-950">Tanvir Ahmed</span>
                  <span className="text-amber-500 font-bold">★★★★★</span>
                </div>
                <p className="text-xs text-foreground-600 italic">
                  &ldquo;Practical, zero fluff. Landed my developer role in 3 months.&rdquo;
                </p>
                <span className="text-[10px] text-foreground-400">Modern React Masterclass</span>
              </div>

              <Link
                href="/instructor/reviews"
                className="w-full py-2 rounded-xl bg-background-50 hover:bg-background-100 text-center text-xs font-bold text-foreground-700 block transition-colors"
              >
                View All Reviews & Reply
              </Link>
            </div>
          </div>
        </div>

      </div>
    </PortalLayout>
  );
}
