'use client';

import { useState } from 'react';
import { FAQS } from '@/data/courses';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-white py-16 sm:py-24 border-b border-background-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold uppercase tracking-wider mb-3">
            Got Questions?
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground-950 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-base text-foreground-600">
            Everything you might want to know before beginning your learning journey with us.
          </p>
        </div>

        {/* Accessible Accordion List */}
        <div className="flex flex-col gap-3.5">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="rounded-2xl border border-background-200 bg-white overflow-hidden shadow-soft-sm transition-all duration-200"
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => toggleIndex(index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                    className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left hover:bg-background-50/70 transition-colors cursor-pointer"
                  >
                    <span className="font-heading text-base sm:text-lg font-bold text-foreground-950">
                      {faq.question}
                    </span>
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen
                          ? 'bg-primary-600 text-white rotate-180'
                          : 'bg-background-100 text-foreground-600'
                      }`}
                    >
                      <i className="ri-arrow-down-s-line text-lg" />
                    </span>
                  </button>
                </h3>

                {isOpen && (
                  <div
                    id={`faq-answer-${index}`}
                    role="region"
                    className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-foreground-600 leading-relaxed border-t border-background-100"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
