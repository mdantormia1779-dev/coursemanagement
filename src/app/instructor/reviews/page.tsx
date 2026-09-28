'use client';

import { useState } from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { INSTRUCTOR_NAV } from '@/data/portalNavs';

interface ReviewItem {
  id: number;
  student: string;
  course: string;
  rating: number;
  date: string;
  comment: string;
  reply?: string;
}

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 1,
    student: 'Sarah Khan',
    course: 'Complete Next.js Development',
    rating: 5,
    date: '2 days ago',
    comment: 'The explanation on React Server Component boundaries and caching invalidation was clear and practical. Helped me build our agency portfolio with zero lag!',
    reply: 'Thank you Sarah! Keep building and don’t hesitate to ping in the Q&A section.'
  },
  {
    id: 2,
    student: 'Tanvir Ahmed',
    course: 'Complete Next.js Development',
    rating: 5,
    date: '4 days ago',
    comment: 'The assignment grading was really fast, and John provided detailed feedback on my Prisma schema.',
  },
  {
    id: 3,
    student: 'Marcus Lee',
    course: 'Advanced TypeScript Patterns',
    rating: 5,
    date: '1 week ago',
    comment: 'Generics and conditional types finally clicked for me after module 3.',
  }
];

export default function InstructorReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [replyText, setReplyText] = useState('');
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);

  const handleSendReply = (id: number) => {
    if (!replyText.trim()) return;
    setReviews(
      reviews.map((r) => (r.id === id ? { ...r, reply: replyText } : r))
    );
    setReplyText('');
    setActiveReplyId(null);
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
            Student Reviews & Feedback
          </h2>
          <p className="text-sm text-foreground-500 mt-1">
            Build student trust and respond directly to learner ratings.
          </p>
        </div>

        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="p-6 rounded-2xl bg-white border border-background-200 shadow-soft-sm space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-foreground-950 text-sm">{r.student}</h4>
                    <span className="text-foreground-300">•</span>
                    <span className="text-xs text-foreground-500">{r.course}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 text-xs mt-1">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <i key={i} className="ri-star-fill" />
                    ))}
                    <span className="text-foreground-400 text-[11px] ml-1">{r.date}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-foreground-700 leading-relaxed italic">
                &ldquo;{r.comment}&rdquo;
              </p>

              {r.reply ? (
                <div className="p-3.5 rounded-xl bg-primary-50 border border-primary-100 text-xs text-primary-950">
                  <span className="font-bold text-primary-700">Your Reply: </span>
                  {r.reply}
                </div>
              ) : activeReplyId === r.id ? (
                <div className="space-y-2 pt-2">
                  <textarea
                    rows={2}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a supportive reply..."
                    className="w-full p-3 rounded-xl border border-background-300 text-xs outline-none focus:border-primary-500"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setActiveReplyId(null)}
                      className="px-3 py-1.5 text-xs text-foreground-500 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSendReply(r.id)}
                      className="px-4 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold"
                    >
                      Post Reply
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setActiveReplyId(r.id);
                    setReplyText('');
                  }}
                  className="text-xs font-bold text-primary-600 hover:underline inline-flex items-center gap-1"
                >
                  <i className="ri-reply-line" /> Reply to student
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
