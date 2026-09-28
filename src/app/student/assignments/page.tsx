'use client';

import { useState } from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { STUDENT_NAV } from '@/data/portalNavs';

interface AssignmentItem {
  id: string;
  course: string;
  title: string;
  deadline: string;
  totalMarks: number;
  status: 'SUBMITTED' | 'GRADED' | 'PENDING';
  grade?: number;
  feedback?: string;
}

const SAMPLE_ASSIGNMENTS: AssignmentItem[] = [
  {
    id: 'a1',
    course: 'Complete Next.js Development',
    title: 'Assignment 1: Build an Authenticated App Router Dashboard with Prisma',
    deadline: 'October 15, 2026',
    totalMarks: 100,
    status: 'GRADED',
    grade: 96,
    feedback: 'Excellent tenant isolation middleware implementation! Clean schema relationships and proper optimistic state handling.'
  },
  {
    id: 'a2',
    course: 'Complete Next.js Development',
    title: 'Capstone: Production LMS SaaS Full Stack Deployment',
    deadline: 'November 02, 2026',
    totalMarks: 100,
    status: 'PENDING',
  },
  {
    id: 'a3',
    course: 'UI/UX Design Fundamentals',
    title: 'Design System & Component Library in Figma',
    deadline: 'October 28, 2026',
    totalMarks: 100,
    status: 'SUBMITTED',
  }
];

export default function StudentAssignmentsPage() {
  const [submissionModal, setSubmissionModal] = useState<string | null>(null);
  const [repoUrl, setRepoUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmitAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      setSubmissionModal(null);
      setRepoUrl('');
      setNotes('');
    }, 1500);
  };

  return (
    <PortalLayout
      role="student"
      userName="Sarah Khan"
      userRoleLabel="Frontend Developer"
      navItems={STUDENT_NAV}
    >
      <div className="space-y-6">
        <div>
          <h2 className="font-heading text-2xl font-extrabold text-foreground-950">
            Practical Assignments
          </h2>
          <p className="text-sm text-foreground-500 mt-1">
            Submit portfolio projects and receive direct grading from your instructors.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {SAMPLE_ASSIGNMENTS.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-white border border-background-200 shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-primary-600">{item.course}</span>
                  <span className="text-foreground-300">•</span>
                  <span className="text-xs text-foreground-500 font-mono">Deadline: {item.deadline}</span>
                </div>
                <h3 className="font-heading text-base sm:text-lg font-bold text-foreground-950">
                  {item.title}
                </h3>
                {item.feedback && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-900">
                    <span className="font-bold">Instructor Feedback: </span>
                    {item.feedback}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 shrink-0">
                {item.status === 'GRADED' && (
                  <div className="text-right">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 inline-block">
                      Grade: {item.grade}/{item.totalMarks}
                    </span>
                    <p className="text-[11px] text-foreground-400 mt-1">Approved & Verified</p>
                  </div>
                )}
                {item.status === 'SUBMITTED' && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                    Under Review
                  </span>
                )}
                {item.status === 'PENDING' && (
                  <button
                    onClick={() => setSubmissionModal(item.id)}
                    className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-colors shadow-soft-sm"
                  >
                    Submit Assignment
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Submission Modal */}
        {submissionModal && (
          <div className="fixed inset-0 z-50 bg-foreground-950/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-soft-xl border border-background-200 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-background-200">
                <h3 className="font-heading text-lg font-bold text-foreground-950">
                  Submit Project Assignment
                </h3>
                <button
                  onClick={() => setSubmissionModal(null)}
                  className="text-foreground-400 hover:text-foreground-800"
                >
                  <i className="ri-close-line text-xl" />
                </button>
              </div>

              {successMsg ? (
                <div className="p-6 text-center text-emerald-600 font-bold text-sm">
                  ✓ Assignment submitted successfully for grading!
                </div>
              ) : (
                <form onSubmit={handleSubmitAssignment} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-foreground-700 mb-1">
                      GitHub Repository / Live Demo URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      placeholder="https://github.com/username/project"
                      className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm outline-none focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground-700 mb-1">
                      Submission Notes / Architecture Details
                    </label>
                    <textarea
                      rows={4}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Briefly describe key challenges solved and features completed..."
                      className="w-full p-3.5 rounded-xl border border-background-300 text-sm outline-none focus:border-primary-500"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-background-200">
                    <button
                      type="button"
                      onClick={() => setSubmissionModal(null)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-foreground-600 hover:bg-background-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-soft-sm"
                    >
                      Confirm Submission
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </PortalLayout>
  );
}
