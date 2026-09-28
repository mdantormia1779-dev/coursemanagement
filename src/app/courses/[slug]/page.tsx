'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchModal from '@/components/SearchModal';
import { FEATURED_COURSES, POPULAR_COURSES } from '@/data/courses';

interface PageProps {
  params: { slug: string };
}

export default function CourseDetailsPage({ params }: PageProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'curriculum' | 'instructor' | 'reviews'>('curriculum');
  const [expandedSection, setExpandedSection] = useState<number | null>(0);

  const allCourses = [...FEATURED_COURSES, ...POPULAR_COURSES];
  const course = allCourses.find((c) => c.slug === params.slug) || allCourses[0];

  const syllabus = [
    {
      title: 'Module 1: Foundations & Architecture Essentials',
      lessonsCount: 4,
      duration: '45 mins',
      lessons: [
        'Introduction & Mental Model for Modern Architecture',
        'Directory Structure & Conventions',
        'Configuration & Environment Variables',
        'Module 1 Knowledge Check'
      ]
    },
    {
      title: 'Module 2: Server & Client Components Deep-Dive',
      lessonsCount: 6,
      duration: '1 hr 20 mins',
      lessons: [
        'React Server Components (RSC) Paradigm',
        'When to use Client Components vs Server Components',
        'Composition Patterns & Interleaving',
        'Client-side state synchronization',
        'Streaming HTML with Suspense boundaries',
        'Module 2 Hands-on Lab'
      ]
    },
    {
      title: 'Module 3: Data Fetching, Mutations & Server Actions',
      lessonsCount: 5,
      duration: '1 hr 10 mins',
      lessons: [
        'Server Actions for Mutations',
        'revalidatePath and Cache Invalidation',
        'Optimistic Updates with useOptimistic',
        'Error Handling & Form Validation with Zod',
        'Assignment 1: Data Mutator Project'
      ]
    },
    {
      title: 'Module 4: PostgreSQL Database & Prisma Integration',
      lessonsCount: 5,
      duration: '1 hr 35 mins',
      lessons: [
        'Relational Database Modeling with Prisma',
        'Multi-tenant Schema Architecture',
        'Database Migrations & Seed Scripts',
        'Query Performance & Indexing',
        'Graduation Capstone Submission'
      ]
    }
  ];

  const outcomes = [
    'Master production-grade full-stack architecture from ground up',
    'Write clean, type-safe, maintainable TypeScript and React code',
    'Implement multi-tenant database isolation and server authorization',
    'Build and deploy real-world commercial SaaS apps to production',
    'Earn an official verified certificate for your professional portfolio'
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-foreground-900">
      <Navbar onOpenSearch={() => setSearchOpen(true)} />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} courses={allCourses} />

      {/* Dark Hero Banner */}
      <section className="bg-foreground-950 text-white py-12 sm:py-16 border-b border-foreground-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Course Summary */}
            <div className="lg:col-span-8 space-y-4">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground-400">
                <Link href="/" className="hover:text-white">Home</Link>
                <span>/</span>
                <Link href="/courses" className="hover:text-white">Courses</Link>
                <span>/</span>
                <span className="text-primary-400">{course.category}</span>
              </div>

              <span className="inline-block px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-amber-400 text-amber-950">
                {course.badge || 'Bestseller'}
              </span>

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {course.title}
              </h1>

              <p className="text-base sm:text-lg text-foreground-300 leading-relaxed max-w-2xl">
                A structured, hands-on masterclass designed to take you from foundational concepts to architecting and deploying production-grade commercial software.
              </p>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-foreground-400 pt-2">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <i className="ri-star-fill text-sm" />
                  <span>{course.rating} / 5.0</span>
                  <span className="text-foreground-400 font-normal">({course.students} reviews)</span>
                </div>
                <div>Created by <strong className="text-white">{course.instructor}</strong></div>
                <div><i className="ri-time-line mr-1" /> Last updated Sep 2026</div>
                <div><i className="ri-global-line mr-1" /> English</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Content Layout with Sticky Right Purchase Box */}
      <section className="py-10 sm:py-14 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Content Column */}
            <div className="lg:col-span-8 space-y-10">
              
              {/* What You'll Learn Box */}
              <div className="p-6 sm:p-8 rounded-2xl bg-background-50 border border-background-200">
                <h3 className="font-heading text-xl font-bold text-foreground-950 mb-4">
                  What You&apos;ll Learn
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {outcomes.map((item) => (
                    <div key={item} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground-800">
                      <span className="w-5 h-5 rounded-full bg-secondary-100 text-secondary-600 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                        ✓
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Navigation Tabs */}
              <div className="border-b border-background-200 flex gap-6 text-sm font-bold">
                <button
                  onClick={() => setActiveTab('curriculum')}
                  className={`pb-3 border-b-2 transition-colors ${
                    activeTab === 'curriculum'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-foreground-500 hover:text-foreground-900'
                  }`}
                >
                  Curriculum & Syllabus
                </button>
                <button
                  onClick={() => setActiveTab('instructor')}
                  className={`pb-3 border-b-2 transition-colors ${
                    activeTab === 'instructor'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-foreground-500 hover:text-foreground-900'
                  }`}
                >
                  Instructor
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-3 border-b-2 transition-colors ${
                    activeTab === 'reviews'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-foreground-500 hover:text-foreground-900'
                  }`}
                >
                  Reviews ({course.students})
                </button>
              </div>

              {/* Tab: Curriculum Accordion */}
              {activeTab === 'curriculum' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-foreground-500">
                    <span>4 Modules • 20 Lessons • 4h 50m Total Duration</span>
                    <button
                      onClick={() => setExpandedSection(expandedSection === null ? 0 : null)}
                      className="text-primary-600 font-bold hover:underline"
                    >
                      {expandedSection === null ? 'Expand all' : 'Collapse all'}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {syllabus.map((section, idx) => {
                      const isOpen = expandedSection === idx;
                      return (
                        <div key={section.title} className="rounded-2xl border border-background-200 bg-white overflow-hidden shadow-soft-sm">
                          <button
                            type="button"
                            onClick={() => setExpandedSection(isOpen ? null : idx)}
                            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-background-50 transition-colors"
                          >
                            <div>
                              <h4 className="font-heading text-sm sm:text-base font-bold text-foreground-950">
                                {section.title}
                              </h4>
                              <p className="text-xs text-foreground-500 mt-0.5">
                                {section.lessonsCount} lessons • {section.duration}
                              </p>
                            </div>
                            <span className="w-8 h-8 rounded-full bg-background-100 flex items-center justify-center text-foreground-600">
                              <i className={`ri-arrow-down-s-line text-lg transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                            </span>
                          </button>

                          {isOpen && (
                            <div className="px-5 pb-5 pt-1 space-y-2 border-t border-background-100 bg-background-50/50">
                              {section.lessons.map((lesson, lIdx) => (
                                <div key={lesson} className="flex items-center justify-between text-xs py-1.5 text-foreground-700">
                                  <div className="flex items-center gap-2.5">
                                    <i className="ri-play-circle-line text-primary-600 text-sm" />
                                    <span>{lesson}</span>
                                  </div>
                                  <span className="text-[11px] text-foreground-400 font-mono">
                                    {lIdx === 0 ? 'Preview Free' : 'Lesson'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab: Instructor Info */}
              {activeTab === 'instructor' && (
                <div className="p-6 rounded-2xl bg-white border border-background-200 shadow-soft-sm space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-700 font-bold text-xl flex items-center justify-center">
                      {course.instructor.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-bold text-foreground-950">{course.instructor}</h3>
                      <p className="text-xs text-foreground-500">Lead Senior Engineer & Architecture Mentor</p>
                      <div className="flex items-center gap-3 text-xs text-foreground-600 mt-1">
                        <span>★ 4.9 Rating</span>
                        <span>•</span>
                        <span>18,000+ Students</span>
                        <span>•</span>
                        <span>12 Courses</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-foreground-600 leading-relaxed pt-3 border-t border-background-100">
                    Over a decade of hands-on experience building enterprise web applications, real-time distributed backends, and cloud microservices. John has mentored thousands of successful software engineers worldwide.
                  </p>
                </div>
              )}

              {/* Tab: Reviews */}
              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-background-50 border border-background-200 flex items-center gap-4">
                    <div className="text-center shrink-0 pr-4 border-r border-background-200">
                      <div className="font-heading text-4xl font-extrabold text-foreground-950">4.9</div>
                      <div className="text-amber-500 text-xs">★★★★★</div>
                      <div className="text-[10px] text-foreground-400 mt-0.5">Course Rating</div>
                    </div>
                    <p className="text-xs text-foreground-600 leading-relaxed">
                      98% of students rated this course 5 stars. Reviewed for depth, clarity, and portfolio-ready assignments.
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Right Sticky Purchase & Enrollment Card */}
            <div className="lg:col-span-4 lg:sticky lg:top-24">
              <div className="rounded-2xl bg-white border border-background-200 shadow-soft-xl overflow-hidden">
                {/* Thumbnail / Video Preview Canvas */}
                <div className="relative aspect-video bg-background-900 overflow-hidden group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-foreground-950/40 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white text-primary-600 flex items-center justify-center shadow-soft-lg group-hover:scale-110 transition-transform">
                      <i className="ri-play-fill text-2xl ml-1" />
                    </div>
                  </div>
                  <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-bold bg-foreground-950/80 text-white">
                    Preview Course Video (3m)
                  </span>
                </div>

                <div className="p-6 space-y-6">
                  {/* Price */}
                  <div className="flex items-baseline gap-3">
                    <span className="font-heading text-3xl font-extrabold text-foreground-950">
                      ৳{course.price.toLocaleString()} BDT
                    </span>
                    <span className="text-sm text-foreground-400 line-through">
                      ৳{course.oldPrice.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      50% OFF
                    </span>
                  </div>

                  {/* CTAs */}
                  <div className="space-y-2.5">
                    <Link
                      href="/checkout"
                      className="w-full py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm text-center block transition-all shadow-soft-md"
                    >
                      Enroll Now — Instant Access
                    </Link>
                    <Link
                      href="/cart"
                      className="w-full py-3 rounded-xl border border-background-300 hover:bg-background-50 text-foreground-800 font-bold text-xs text-center block transition-colors"
                    >
                      Add to Shopping Cart
                    </Link>
                  </div>

                  <p className="text-[11px] text-center text-foreground-400">
                    30-Day Money-Back Guarantee • Full Lifetime Access
                  </p>

                  {/* Included List */}
                  <div className="pt-4 border-t border-background-100 space-y-2.5 text-xs text-foreground-700">
                    <div className="font-bold text-foreground-900 mb-2">This course includes:</div>
                    <div className="flex items-center gap-2">
                      <i className="ri-video-line text-primary-600" />
                      <span>24 hours on-demand video</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="ri-file-download-line text-primary-600" />
                      <span>18 downloadable code resources</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="ri-infinity-line text-primary-600" />
                      <span>Full lifetime access to updates</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="ri-smartphone-line text-primary-600" />
                      <span>Access on mobile, tablet & desktop</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="ri-award-line text-amber-500" />
                      <span>Verifiable Certificate of completion</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
