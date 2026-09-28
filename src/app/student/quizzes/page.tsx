'use client';

import { useState } from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { STUDENT_NAV } from '@/data/portalNavs';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const SAMPLE_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'By default, all components inside the Next.js App Router (app directory) are:',
    options: [
      'Client Components',
      'React Server Components (RSC)',
      'Static HTML without JavaScript',
      'Edge API Routes'
    ],
    correctIndex: 1,
    explanation: 'In the App Router, every component is a React Server Component by default unless explicitly designated with the "use client" directive.'
  },
  {
    id: 2,
    question: 'Which function is used to invalidate the cached data on-demand for a specific route path?',
    options: [
      'revalidatePath("/courses")',
      'purgeCache("/courses")',
      'router.refresh()',
      'cache.clear()'
    ],
    correctIndex: 0,
    explanation: 'revalidatePath("/path") allows you to purge the cached Data Cache and Full Route Cache on-demand from inside a Server Action or Route Handler.'
  },
  {
    id: 3,
    question: 'What is the primary purpose of Server Actions in Next.js?',
    options: [
      'To compile CSS styles on the server',
      'To execute asynchronous server-side code without manually defining API endpoints',
      'To replace client-side React useState entirely',
      'To render client animations at 60fps'
    ],
    correctIndex: 1,
    explanation: 'Server Actions allow asynchronous functions executed directly on the server to handle form submissions and data mutations seamlessly.'
  },
  {
    id: 4,
    question: 'Where should sensitive database credentials (e.g. DATABASE_URL) be kept in a production LMS SaaS?',
    options: [
      'In a public GitHub repository file',
      'In public Next.js environment variables prefixed with NEXT_PUBLIC_',
      'In server-only environment variables and secret managers',
      'In the client-side localStorage'
    ],
    correctIndex: 2,
    explanation: 'Database credentials must strictly remain in private server environment variables, never accessible to the browser client.'
  }
];

export default function StudentQuizzesPage() {
  const [activeQuiz, setActiveQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (questionId: number, optionIdx: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const calculateScore = () => {
    let correct = 0;
    SAMPLE_QUIZ_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    return {
      correct,
      total: SAMPLE_QUIZ_QUESTIONS.length,
      percentage: Math.round((correct / SAMPLE_QUIZ_QUESTIONS.length) * 100),
      passed: (correct / SAMPLE_QUIZ_QUESTIONS.length) >= 0.7
    };
  };

  const results = submitted ? calculateScore() : null;

  return (
    <PortalLayout
      role="student"
      userName="Sarah Khan"
      userRoleLabel="Frontend Developer"
      navItems={STUDENT_NAV}
    >
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl font-extrabold text-foreground-950">
              Quizzes & Assessments
            </h2>
            <p className="text-sm text-foreground-500 mt-1">
              Verify your comprehension and earn badges towards your official course certificates.
            </p>
          </div>
        </div>

        {!activeQuiz ? (
          /* Available Quizzes List */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-background-200 shadow-soft-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700">
                  Ready to Take
                </span>
                <span className="text-xs text-foreground-400 font-mono">15 Mins • 4 Questions</span>
              </div>

              <div>
                <h3 className="font-heading text-lg font-bold text-foreground-950">
                  Next.js 14 Architecture & Server Components Quiz
                </h3>
                <p className="text-xs text-foreground-600 mt-1">
                  Covers App Router principles, Server Actions, caching strategies, and data mutation lifecycle.
                </p>
              </div>

              <div className="pt-3 border-t border-background-100 flex items-center justify-between text-xs text-foreground-500">
                <span>Passing Grade: <strong>70%</strong></span>
                <span>Attempts: <strong>Unlimited</strong></span>
              </div>

              <button
                onClick={() => {
                  setActiveQuiz(true);
                  setSelectedAnswers({});
                  setSubmitted(false);
                }}
                className="w-full py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-soft-sm"
              >
                <i className="ri-play-circle-line text-base" />
                <span>Start Quiz Now</span>
              </button>
            </div>

            {/* Completed Quiz 1 */}
            <div className="p-6 rounded-2xl bg-white border border-background-200 shadow-soft-sm space-y-4 opacity-90">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 flex items-center gap-1">
                  <i className="ri-checkbox-circle-fill" /> Passed (100%)
                </span>
                <span className="text-xs text-foreground-400">Completed 3 days ago</span>
              </div>

              <div>
                <h3 className="font-heading text-lg font-bold text-foreground-950">
                  React 18 Hooks & Concurrency Assessment
                </h3>
                <p className="text-xs text-foreground-600 mt-1">
                  Tested useTransition, useDeferredValue, and custom state synchronization hooks.
                </p>
              </div>

              <div className="pt-3 border-t border-background-100 flex items-center justify-between text-xs text-foreground-500">
                <span>Score: <strong className="text-emerald-600">10 / 10 (100%)</strong></span>
                <span className="text-emerald-600 font-bold">Requirement Fulfilled ✓</span>
              </div>

              <button
                onClick={() => {
                  setActiveQuiz(true);
                  setSelectedAnswers({ 1: 1, 2: 0, 3: 1, 4: 2 });
                  setSubmitted(true);
                }}
                className="w-full py-2.5 rounded-xl bg-background-100 hover:bg-background-200 text-foreground-800 font-bold text-xs transition-colors"
              >
                Review Completed Questions
              </button>
            </div>
          </div>
        ) : (
          /* Active Interactive Quiz Taker */
          <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-white border border-background-200 shadow-soft-xl space-y-8 animate-fade-in">
            {/* Top Quiz Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-background-200">
              <div>
                <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">Active Assessment</span>
                <h3 className="font-heading text-xl font-bold text-foreground-950">
                  Next.js 14 Architecture & Server Components
                </h3>
              </div>
              <button
                onClick={() => setActiveQuiz(false)}
                className="text-xs font-semibold text-foreground-500 hover:text-foreground-900"
              >
                ✕ Exit
              </button>
            </div>

            {/* Results Banner when submitted */}
            {submitted && results && (
              <div
                className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in ${
                  results.passed
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <i
                      className={`text-2xl ${
                        results.passed ? 'ri-checkbox-circle-fill text-emerald-600' : 'ri-error-warning-fill text-rose-600'
                      }`}
                    />
                    <h4 className="font-heading text-lg font-bold">
                      {results.passed ? 'Congratulations! You Passed!' : 'Needs Improvement'}
                    </h4>
                  </div>
                  <p className="text-xs mt-1 text-foreground-700">
                    You answered {results.correct} out of {results.total} questions correctly ({results.percentage}%).
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedAnswers({});
                    setSubmitted(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-white border border-background-300 hover:bg-background-50 text-xs font-bold shadow-soft-sm shrink-0"
                >
                  Retry Quiz
                </button>
              </div>
            )}

            {/* Questions List */}
            <div className="space-y-8">
              {SAMPLE_QUIZ_QUESTIONS.map((q, qIndex) => {
                const isSelected = selectedAnswers[q.id];
                return (
                  <div key={q.id} className="p-5 rounded-2xl bg-background-50 border border-background-200/90 space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-lg bg-primary-100 text-primary-700 font-bold text-xs flex items-center justify-center shrink-0">
                        0{qIndex + 1}
                      </span>
                      <h4 className="font-heading text-sm sm:text-base font-bold text-foreground-950 leading-snug">
                        {q.question}
                      </h4>
                    </div>

                    <div className="space-y-2 pl-10">
                      {q.options.map((option, optIdx) => {
                        const chosen = isSelected === optIdx;
                        let optionStyle = 'bg-white border-background-200 hover:border-primary-400 text-foreground-800';

                        if (submitted) {
                          if (optIdx === q.correctIndex) {
                            optionStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold';
                          } else if (chosen && optIdx !== q.correctIndex) {
                            optionStyle = 'bg-rose-50 border-rose-400 text-rose-950 line-through';
                          }
                        } else if (chosen) {
                          optionStyle = 'bg-primary-50 border-primary-500 text-primary-900 font-semibold ring-1 ring-primary-400';
                        }

                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => handleSelect(q.id, optIdx)}
                            className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm flex items-center gap-3 transition-all ${optionStyle}`}
                          >
                            <span
                              className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                                chosen ? 'border-primary-600 bg-primary-600 text-white' : 'border-background-300'
                              }`}
                            >
                              {chosen && '•'}
                            </span>
                            <span>{option}</span>
                          </button>
                        );
                      })}
                    </div>

                    {submitted && (
                      <div className="ml-10 p-3.5 rounded-xl bg-white border border-background-200 text-xs text-foreground-600 space-y-1">
                        <span className="font-bold text-foreground-900">Explanation:</span>
                        <p>{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Submit Action */}
            {!submitted && (
              <div className="pt-4 border-t border-background-200 flex justify-end">
                <button
                  onClick={() => setSubmitted(true)}
                  disabled={Object.keys(selectedAnswers).length < SAMPLE_QUIZ_QUESTIONS.length}
                  className="px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold text-sm shadow-soft-sm transition-all"
                >
                  Submit & Evaluate Quiz
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </PortalLayout>
  );
}
