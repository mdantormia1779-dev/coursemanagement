'use client';

import { useState } from 'react';
import Link from 'next/link';
import PortalLayout from '@/components/portal/PortalLayout';
import { ADMIN_NAV } from '@/data/portalNavs';

interface ApprovalCourse {
  id: string;
  title: string;
  instructor: string;
  category: string;
  price: number;
  sectionsCount: number;
  lessonsCount: number;
  submittedDate: string;
  status: 'PENDING_REVIEW' | 'PUBLISHED' | 'REJECTED';
  rejectionReason?: string;
}

const INITIAL_QUEUE: ApprovalCourse[] = [
  {
    id: 'c-rev-1',
    title: 'Scalable Node.js & Microservices Masterclass',
    instructor: 'John Doe',
    category: 'Programming',
    price: 2499,
    sectionsCount: 4,
    lessonsCount: 28,
    submittedDate: 'Sep 25, 2026',
    status: 'PENDING_REVIEW'
  },
  {
    id: 'c-rev-2',
    title: 'Data Engineering with Apache Spark & BigQuery',
    instructor: 'David Adebayo',
    category: 'Data Science',
    price: 2999,
    sectionsCount: 5,
    lessonsCount: 32,
    submittedDate: 'Sep 24, 2026',
    status: 'PENDING_REVIEW'
  },
  {
    id: 'c-rev-3',
    title: 'Design Systems Architecture with Figma Tokens',
    instructor: 'Mina Park',
    category: 'UI/UX Design',
    price: 1799,
    sectionsCount: 3,
    lessonsCount: 19,
    submittedDate: 'Sep 22, 2026',
    status: 'PENDING_REVIEW'
  }
];

export default function AdminCoursesApprovalPage() {
  const [queue, setQueue] = useState<ApprovalCourse[]>(INITIAL_QUEUE);
  const [rejectModalCourse, setRejectModalCourse] = useState<ApprovalCourse | null>(null);
  const [rejectReason, setRejectReason] = useState('Please ensure all video lessons have captions and include source code downloads.');

  const handleApprove = (id: string) => {
    setQueue(
      queue.map((c) => (c.id === id ? { ...c, status: 'PUBLISHED' } : c))
    );
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalCourse) return;
    setQueue(
      queue.map((c) =>
        c.id === rejectModalCourse.id
          ? { ...c, status: 'REJECTED', rejectionReason: rejectReason }
          : c
      )
    );
    setRejectModalCourse(null);
  };

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
              Academy Course Catalog & Publishing
            </h2>
            <p className="text-sm text-foreground-500 mt-1">
              Manage academy courses, publish new live batches, configure modules, and assign faculty mentors.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/instructor/live-classes"
              className="px-4 py-2 rounded-xl border border-background-300 hover:bg-background-50 text-foreground-800 text-xs font-bold transition-colors"
            >
              <i className="ri-broadcast-line text-rose-600 mr-1.5" />
              <span>Live Classes Hub</span>
            </Link>
            <Link
              href="/instructor/courses/create"
              className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-soft-sm transition-colors"
            >
              <i className="ri-add-line mr-1.5" />
              <span>Create Course</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {queue.map((course) => (
            <div
              key={course.id}
              className="p-6 rounded-2xl bg-white border border-background-200 shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-rose-600">{course.category}</span>
                  <span className="text-foreground-300">•</span>
                  <span className="text-foreground-500">Instructor: <strong>{course.instructor}</strong></span>
                  <span className="text-foreground-300">•</span>
                  <span className="text-foreground-400 font-mono">Submitted: {course.submittedDate}</span>
                </div>

                <h3 className="font-heading text-lg font-bold text-foreground-950">
                  {course.title}
                </h3>

                <p className="text-xs text-foreground-600">
                  Curriculum: <strong>{course.sectionsCount} Sections</strong> • <strong>{course.lessonsCount} Video Lessons</strong> • Target Price: <strong>৳{course.price.toLocaleString()} BDT</strong>
                </p>

                {course.rejectionReason && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 mt-2">
                    <span className="font-bold">Rejection Reason Sent: </span>
                    {course.rejectionReason}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {course.status === 'PENDING_REVIEW' ? (
                  <>
                    <button
                      onClick={() => setRejectModalCourse(course)}
                      className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors"
                    >
                      Reject with Reason
                    </button>
                    <button
                      onClick={() => handleApprove(course.id)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-soft-sm transition-colors flex items-center gap-1.5"
                    >
                      <i className="ri-check-line text-base" />
                      <span>Approve & Publish</span>
                    </button>
                  </>
                ) : course.status === 'PUBLISHED' ? (
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <i className="ri-checkbox-circle-fill" /> Published Live
                  </span>
                ) : (
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 flex items-center gap-1">
                    <i className="ri-close-circle-fill" /> Rejected
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Reject Dialog */}
        {rejectModalCourse && (
          <div className="fixed inset-0 z-50 bg-foreground-950/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-soft-xl border border-background-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-background-200">
                <h3 className="font-heading text-lg font-bold text-foreground-950">
                  Reject Course Submission
                </h3>
                <button onClick={() => setRejectModalCourse(null)} className="text-foreground-400 hover:text-foreground-800">
                  <i className="ri-close-line text-xl" />
                </button>
              </div>

              <p className="text-xs text-foreground-600">
                Course: <strong>{rejectModalCourse.title}</strong> by {rejectModalCourse.instructor}
              </p>

              <form onSubmit={handleConfirmReject} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-foreground-700 mb-1">
                    Reason for Rejection / Modification Request *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-background-300 text-xs outline-none focus:border-rose-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-background-200">
                  <button
                    type="button"
                    onClick={() => setRejectModalCourse(null)}
                    className="px-4 py-2 text-xs font-semibold text-foreground-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-soft-sm"
                  >
                    Send Rejection & Return to Draft
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
