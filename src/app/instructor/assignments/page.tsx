'use client';

import { useState } from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { INSTRUCTOR_NAV } from '@/data/portalNavs';

interface PendingSubmission {
  id: string;
  student: string;
  course: string;
  assignment: string;
  submittedAt: string;
  repoUrl: string;
  status: 'PENDING' | 'GRADED';
  grade?: number;
}

const SAMPLE_PENDING: PendingSubmission[] = [
  {
    id: 'sub-1',
    student: 'Tanvir Ahmed',
    course: 'Complete Next.js Development',
    assignment: 'Assignment 1: Build an Authenticated App Router Dashboard',
    submittedAt: 'Today at 02:40 PM',
    repoUrl: 'https://github.com/tanvir/nextjs-saas-dashboard',
    status: 'PENDING'
  },
  {
    id: 'sub-2',
    student: 'Nadia Rahman',
    course: 'Advanced TypeScript Patterns',
    assignment: 'Type-Safe State Machine Project',
    submittedAt: 'Yesterday at 06:15 PM',
    repoUrl: 'https://github.com/nadia/ts-state-machine',
    status: 'PENDING'
  }
];

export default function InstructorAssignmentsPage() {
  const [submissions, setSubmissions] = useState(SAMPLE_PENDING);
  const [selectedSub, setSelectedSub] = useState<PendingSubmission | null>(null);
  const [gradeInput, setGradeInput] = useState('95');
  const [feedbackInput, setFeedbackInput] = useState('Superb work on types and clean modular breakdown.');

  const handleGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;
    setSubmissions(
      submissions.map((s) =>
        s.id === selectedSub.id
          ? { ...s, status: 'GRADED', grade: parseInt(gradeInput) }
          : s
      )
    );
    setSelectedSub(null);
  };

  return (
    <PortalLayout
      role="instructor"
      userName="John Doe"
      userRoleLabel="Senior Software Engineer & Lead Instructor"
      navItems={INSTRUCTOR_NAV}
    >
      <div className="space-y-6">
        <div>
          <h2 className="font-heading text-2xl font-extrabold text-foreground-950">
            Assignment Grading Queue
          </h2>
          <p className="text-sm text-foreground-500 mt-1">
            Review student project code repositories, assign grades, and provide feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className="p-6 rounded-2xl bg-white border border-background-200 shadow-soft-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-primary-600">{sub.course}</span>
                  <span className="text-foreground-300">•</span>
                  <span className="text-foreground-500">{sub.submittedAt}</span>
                </div>
                <h3 className="font-heading text-base font-bold text-foreground-950 mt-1">
                  {sub.assignment}
                </h3>
                <p className="text-xs text-foreground-600 mt-0.5">
                  Submitted by: <strong>{sub.student}</strong>
                </p>
                <a
                  href={sub.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-indigo-600 font-mono hover:underline mt-2 inline-flex items-center gap-1"
                >
                  <i className="ri-github-fill" /> {sub.repoUrl} ↗
                </a>
              </div>

              <div className="shrink-0">
                {sub.status === 'PENDING' ? (
                  <button
                    onClick={() => setSelectedSub(sub)}
                    className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-all shadow-soft-sm"
                  >
                    Grade Submission
                  </button>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    Graded: {sub.grade}/100 ✓
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Grading Modal */}
        {selectedSub && (
          <div className="fixed inset-0 z-50 bg-foreground-950/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-soft-xl border border-background-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-background-200">
                <h3 className="font-heading text-lg font-bold text-foreground-950">
                  Grade Student Submission
                </h3>
                <button onClick={() => setSelectedSub(null)} className="text-foreground-400 hover:text-foreground-800">
                  <i className="ri-close-line text-xl" />
                </button>
              </div>

              <p className="text-xs text-foreground-600">
                Student: <strong>{selectedSub.student}</strong> • {selectedSub.assignment}
              </p>

              <form onSubmit={handleGrade} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-foreground-700 mb-1">
                    Grade Score (Out of 100) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={gradeInput}
                    onChange={(e) => setGradeInput(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm font-bold outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground-700 mb-1">
                    Instructor Feedback & Recommendations *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-background-300 text-xs outline-none focus:border-primary-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-background-200">
                  <button
                    type="button"
                    onClick={() => setSelectedSub(null)}
                    className="px-4 py-2 text-xs font-semibold text-foreground-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-soft-sm"
                  >
                    Save Grade & Notify Student
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
