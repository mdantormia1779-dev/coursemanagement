'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PortalLayout from '@/components/portal/PortalLayout';
import { STUDENT_NAV } from '@/data/portalNavs';
import { getUnlockedCourses, UnlockedEnrollment } from '@/lib/manualPaymentService';
import { getCurrentUser } from '@/lib/authService';

interface ClassSession {
  id: string;
  classNumber: number;
  title: string;
  moduleName: string;
  duration: string;
  type: 'video' | 'live' | 'quiz' | 'assignment';
  status: 'COMPLETED' | 'IN_PROGRESS' | 'UPCOMING' | 'LOCKED';
  date?: string;
  liveMeetingUrl?: string;
  platform?: string;
  description: string;
  hasResources?: boolean;
}

export default function StudentMyClassPage() {
  const [currentUser, setCurrentUser] = useState({ name: 'Sarah Khan', roleLabel: 'Frontend Developer' });
  const [enrolledCourses, setEnrolledCourses] = useState<UnlockedEnrollment[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'live' | 'video' | 'practice'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('all');

  useEffect(() => {
    const user = getCurrentUser();
    if (user && user.role === 'student') {
      setCurrentUser({ name: user.name, roleLabel: user.roleLabel });
    }

    const loadEnrolled = () => {
      const list = getUnlockedCourses();
      setEnrolledCourses(list);
    };

    loadEnrolled();
    window.addEventListener('learnx_course_unlocked', loadEnrolled);
    window.addEventListener('learnx_manual_payments_changed', loadEnrolled);

    return () => {
      window.removeEventListener('learnx_course_unlocked', loadEnrolled);
      window.removeEventListener('learnx_manual_payments_changed', loadEnrolled);
    };
  }, []);

  const primaryCourse = enrolledCourses[0] || {
    courseSlug: 'complete-nextjs-development',
    courseTitle: 'Complete Next.js Development',
    studentId: 'SID-2026-8492',
  };

  // Full 24 classes curriculum for the enrolled course
  const classList: ClassSession[] = [
    // Module 1
    {
      id: 'cls-1',
      classNumber: 1,
      title: 'Course Overview, Prerequisites & VS Code Setup',
      moduleName: 'Module 1: Foundations & Next.js 14 Setup',
      duration: '45 mins',
      type: 'video',
      status: 'COMPLETED',
      description: 'Orientation, course roadmap, Node.js runtime, Git setup, and extensions.',
      hasResources: true,
    },
    {
      id: 'cls-2',
      classNumber: 2,
      title: 'Next.js 14 App Router Architecture & Directory Conventions',
      moduleName: 'Module 1: Foundations & Next.js 14 Setup',
      duration: '52 mins',
      type: 'video',
      status: 'COMPLETED',
      description: 'Understanding app directory, layout.tsx, page.tsx, template.tsx and loading.tsx.',
      hasResources: true,
    },
    {
      id: 'cls-3',
      classNumber: 3,
      title: 'TypeScript Integration & Responsive Tailwind Layouts',
      moduleName: 'Module 1: Foundations & Next.js 14 Setup',
      duration: '48 mins',
      type: 'video',
      status: 'COMPLETED',
      description: 'Configuring strict TypeScript types, Tailwind design tokens, and components.',
      hasResources: true,
    },

    // Module 2
    {
      id: 'cls-4',
      classNumber: 4,
      title: 'React Server Components (RSC) Mental Model',
      moduleName: 'Module 2: Server & Client Components Architecture',
      duration: '58 mins',
      type: 'video',
      status: 'COMPLETED',
      description: 'Zero bundle size components, streaming HTML, and server-side rendering benefits.',
      hasResources: true,
    },
    {
      id: 'cls-5',
      classNumber: 5,
      title: 'When to Use "use client" vs Server Components',
      moduleName: 'Module 2: Server & Client Components Architecture',
      duration: '42 mins',
      type: 'video',
      status: 'COMPLETED',
      description: 'Interleaving client and server components without leaking secrets.',
      hasResources: true,
    },
    {
      id: 'cls-6',
      classNumber: 6,
      title: 'Section 2 Knowledge Check & Architecture Quiz',
      moduleName: 'Module 2: Server & Client Components Architecture',
      duration: '15 Questions',
      type: 'quiz',
      status: 'COMPLETED',
      description: 'Test your grasp of RSC lifecycle, hydration boundaries, and client state.',
    },

    // Module 3
    {
      id: 'cls-7',
      classNumber: 7,
      title: 'Data Fetching with Fetch API & Server Actions',
      moduleName: 'Module 3: Data Fetching, Server Actions & Caching',
      duration: '55 mins',
      type: 'video',
      status: 'COMPLETED',
      description: 'Async server components, request memoization, and form mutations.',
      hasResources: true,
    },
    {
      id: 'cls-8',
      classNumber: 8,
      title: 'revalidatePath & Cache Tag Invalidation Strategies',
      moduleName: 'Module 3: Data Fetching, Server Actions & Caching',
      duration: '46 mins',
      type: 'video',
      status: 'COMPLETED',
      description: 'On-demand revalidation, time-based ISR, and Full Route Cache purging.',
      hasResources: true,
    },
    {
      id: 'cls-9',
      classNumber: 9,
      title: 'Optimistic UI Updates with useOptimistic Hook',
      moduleName: 'Module 3: Data Fetching, Server Actions & Caching',
      duration: '50 mins',
      type: 'video',
      status: 'IN_PROGRESS',
      description: 'Building instant feedback UI before server resolves with automatic rollback.',
      hasResources: true,
    },
    {
      id: 'cls-10',
      classNumber: 10,
      title: 'Live Workshop: Real-world Form Mutations & Error Handling',
      moduleName: 'Module 3: Data Fetching, Server Actions & Caching',
      duration: '1h 30m',
      type: 'live',
      status: 'UPCOMING',
      date: 'Tonight (রবিবার) রাত ৯:০০ টা',
      liveMeetingUrl: 'https://meet.google.com/abc-defg-hij',
      platform: 'Google Meet Live',
      description: 'Hands-on interactive live coding session with Q&A and code review.',
    },

    // Module 4
    {
      id: 'cls-11',
      classNumber: 11,
      title: 'Prisma ORM with PostgreSQL & Neon Serverless DB',
      moduleName: 'Module 4: Database, Auth & Cloud Storage',
      duration: '60 mins',
      type: 'video',
      status: 'UPCOMING',
      description: 'Database schema modeling, migrations, connection pooling, and relations.',
      hasResources: true,
    },
    {
      id: 'cls-12',
      classNumber: 12,
      title: 'Multi-tenant Authentication with NextAuth.js v5 (Auth.js)',
      moduleName: 'Module 4: Database, Auth & Cloud Storage',
      duration: '65 mins',
      type: 'video',
      status: 'UPCOMING',
      description: 'JWT sessions, credentials login, Google OAuth, and middleware route guards.',
      hasResources: true,
    },
    {
      id: 'cls-13',
      classNumber: 13,
      title: 'Cloud Storage & Signed Uploads (AWS S3 & Cloudinary)',
      moduleName: 'Module 4: Database, Auth & Cloud Storage',
      duration: '45 mins',
      type: 'video',
      status: 'UPCOMING',
      description: 'Direct browser-to-cloud file uploads, image optimization, and validation.',
    },
    {
      id: 'cls-14',
      classNumber: 14,
      title: 'Live Review: Mid-Term Capstone Project Submission',
      moduleName: 'Module 4: Database, Auth & Cloud Storage',
      duration: '1h 30m',
      type: 'live',
      status: 'UPCOMING',
      date: 'মঙ্গলবার রাত ৯:০০ টা',
      liveMeetingUrl: 'https://meet.google.com/xyz-uvw-rst',
      platform: 'Google Meet Live',
      description: 'Live presentation and mentor grading of student database-backed apps.',
    },

    // Module 5
    {
      id: 'cls-15',
      classNumber: 15,
      title: 'Manual Payment Integration (bKash, Nagad) & Webhooks',
      moduleName: 'Module 5: Payments, Security & Performance',
      duration: '55 mins',
      type: 'video',
      status: 'UPCOMING',
      description: 'Implementing custom TrxID verification, order state machine, and invoices.',
      hasResources: true,
    },
    {
      id: 'cls-16',
      classNumber: 16,
      title: 'Dynamic Open Graph Images with @vercel/og & SEO Metadata',
      moduleName: 'Module 5: Payments, Security & Performance',
      duration: '40 mins',
      type: 'video',
      status: 'UPCOMING',
      description: 'Automated social share cards, canonical tags, and structured JSON-LD data.',
    },
    {
      id: 'cls-17',
      classNumber: 17,
      title: 'Core Web Vitals Optimization, LCP & Bundle Splitting',
      moduleName: 'Module 5: Payments, Security & Performance',
      duration: '50 mins',
      type: 'video',
      status: 'UPCOMING',
      description: 'Lighthouse 100/100 score, dynamic imports, font optimization, and script tags.',
    },
    {
      id: 'cls-18',
      classNumber: 18,
      title: 'Live Problem-Solving: Security, CSRF & Rate Limiting',
      moduleName: 'Module 5: Payments, Security & Performance',
      duration: '1h 30m',
      type: 'live',
      status: 'UPCOMING',
      date: 'বৃহস্পতিবার রাত ৯:০০ টা',
      liveMeetingUrl: 'https://meet.google.com/opq-rst-uvw',
      platform: 'Google Meet Live',
      description: 'Hardening Next.js API endpoints against brute force and DDoS attacks.',
    },

    // Module 6
    {
      id: 'cls-19',
      classNumber: 19,
      title: 'Full Stack LMS E-Commerce Application Architecture',
      moduleName: 'Module 6: Capstone Project & Deployment',
      duration: '70 mins',
      type: 'video',
      status: 'UPCOMING',
      description: 'Building complete multi-tier courses platform with cart, checkout & portal.',
      hasResources: true,
    },
    {
      id: 'cls-20',
      classNumber: 20,
      title: 'Dockerizing Next.js for Self-Hosted VPS Deployment',
      moduleName: 'Module 6: Capstone Project & Deployment',
      duration: '50 mins',
      type: 'video',
      status: 'UPCOMING',
      description: 'Multi-stage Dockerfile, standalone output, and Nginx reverse proxy configuration.',
    },
    {
      id: 'cls-21',
      classNumber: 21,
      title: 'Vercel Edge vs AWS ECS Serverless Production Deploy',
      moduleName: 'Module 6: Capstone Project & Deployment',
      duration: '55 mins',
      type: 'video',
      status: 'UPCOMING',
      description: 'CI/CD pipeline with GitHub Actions, preview branches, and env secret management.',
    },
    {
      id: 'cls-22',
      classNumber: 22,
      title: 'Live Code Review & Bug Squashing Marathon',
      moduleName: 'Module 6: Capstone Project & Deployment',
      duration: '2 Hours',
      type: 'live',
      status: 'UPCOMING',
      date: 'রবিবার রাত ৯:০০ টা',
      liveMeetingUrl: 'https://meet.google.com/live-marathon',
      platform: 'Google Meet Live',
      description: 'Live debugging of student code bases and production deployment fixes.',
    },
    {
      id: 'cls-23',
      classNumber: 23,
      title: 'Final Capstone Project Evaluation & Grading',
      moduleName: 'Module 6: Capstone Project & Deployment',
      duration: 'Project Review',
      type: 'assignment',
      status: 'UPCOMING',
      description: 'Submitting final live deployed project for verified certificate issuance.',
    },
    {
      id: 'cls-24',
      classNumber: 24,
      title: 'Grand Finale: Portfolio, Resume & Tech Job Interview Prep',
      moduleName: 'Module 6: Capstone Project & Deployment',
      duration: '2 Hours',
      type: 'live',
      status: 'UPCOMING',
      date: 'সমাপনী লাইভ সেশন',
      liveMeetingUrl: 'https://meet.google.com/grand-finale',
      platform: 'Google Meet Live',
      description: 'Career guidelines, client acquisition, remote jobs, and course certificate award.',
    },
  ];

  // Filtering logic
  const filteredClasses = classList.filter((item) => {
    // Type tab filter
    if (activeTab === 'live' && item.type !== 'live') return false;
    if (activeTab === 'video' && item.type !== 'video') return false;
    if (activeTab === 'practice' && item.type !== 'quiz' && item.type !== 'assignment') return false;

    // Module filter
    if (selectedModule !== 'all' && !item.moduleName.includes(selectedModule)) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.moduleName.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const completedCount = classList.filter((c) => c.status === 'COMPLETED').length;
  const liveCount = classList.filter((c) => c.type === 'live').length;
  const videoCount = classList.filter((c) => c.type === 'video').length;

  return (
    <PortalLayout
      role="student"
      userName={currentUser.name}
      userRoleLabel={currentUser.roleLabel}
      navItems={STUDENT_NAV}
    >
      <div className="space-y-8">
        
        {/* ========================================================================= */}
        {/* 1. TOP HEADER BANNER - ENROLLED BATCH INFO */}
        {/* ========================================================================= */}
        <div className="rounded-3xl bg-gradient-to-r from-primary-950 via-primary-900 to-indigo-950 text-white p-6 sm:p-8 shadow-soft-lg relative overflow-hidden border border-white/10">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full bg-red-600/90 text-white text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-soft">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  <span>My Class Hub (আমার সকল ক্লাস)</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-white/10 text-primary-200 border border-white/15">
                  {primaryCourse.studentId}
                </span>
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ভর্তি অনুমোদিত (Enrolled & Active)
                </span>
              </div>

              <div>
                <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  Batch 24 — {primaryCourse.courseTitle}
                </h1>
                <p className="text-xs sm:text-sm text-primary-100/80 mt-1">
                  মেন্টর: <strong>John Doe (Lead Full Stack Engineer)</strong> • রুটিন: রবি, মঙ্গল, বৃহস্পতি রাত ৯:০০ টা
                </p>
              </div>

              {/* Progress Summary Strip */}
              <div className="pt-2 flex items-center gap-4 text-xs">
                <div className="flex-1 max-w-xs">
                  <div className="flex justify-between text-[11px] text-primary-200 mb-1">
                    <span>কোর্স প্রগ্রেস</span>
                    <span className="font-bold">{completedCount} of {classList.length} Classes ({Math.round((completedCount / classList.length) * 100)}%)</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-primary-400 rounded-full"
                      style={{ width: `${(completedCount / classList.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Classroom Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 z-10">
              <Link
                href={`/student/learning/${primaryCourse.courseSlug}`}
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-primary-50 text-primary-950 font-bold text-xs shadow-soft-md transition-all flex items-center justify-center gap-2 group"
              >
                <i className="ri-play-circle-fill text-lg text-primary-600 transition-transform group-hover:scale-110" />
                <span>Go to Classroom (ক্লাসরুম প্লেয়ার)</span>
              </Link>

              <Link
                href="/student/live-classes"
                className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-soft flex items-center justify-center gap-2 transition-all"
              >
                <i className="ri-broadcast-line text-base" />
                <span>Live Meeting Hub</span>
              </Link>
            </div>

          </div>

          <div className="absolute right-0 top-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* ========================================================================= */}
        {/* 2. STATS OVERVIEW CARDS */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-background-200 shadow-soft-sm">
            <div className="flex items-center justify-between text-xs text-foreground-500 font-semibold">
              <span>মোট ক্লাস (Total Classes)</span>
              <span className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                <i className="ri-presentation-line text-lg" />
              </span>
            </div>
            <div className="mt-2 font-heading text-2xl sm:text-3xl font-extrabold text-foreground-950">
              {classList.length} টি
            </div>
            <p className="text-[11px] text-foreground-500 mt-1">পূর্ণাঙ্গ ফুলস্ট্যাক সিলেবাস</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-background-200 shadow-soft-sm">
            <div className="flex items-center justify-between text-xs text-foreground-500 font-semibold">
              <span>সম্পন্ন হয়েছে (Completed)</span>
              <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <i className="ri-checkbox-circle-line text-lg" />
              </span>
            </div>
            <div className="mt-2 font-heading text-2xl sm:text-3xl font-extrabold text-emerald-600">
              {completedCount} টি
            </div>
            <p className="text-[11px] text-emerald-600 mt-1">সবগুলো ভিডিও দেখা শেষ</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-background-200 shadow-soft-sm">
            <div className="flex items-center justify-between text-xs text-foreground-500 font-semibold">
              <span>লাইভ সেশন (Live Classes)</span>
              <span className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <i className="ri-broadcast-line text-lg" />
              </span>
            </div>
            <div className="mt-2 font-heading text-2xl sm:text-3xl font-extrabold text-rose-600">
              {liveCount} টি
            </div>
            <p className="text-[11px] text-rose-600 mt-1">গুগল মিটে সরাসরি মেন্টরিং</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-background-200 shadow-soft-sm">
            <div className="flex items-center justify-between text-xs text-foreground-500 font-semibold">
              <span>ভিডিও লেকচার (Recorded)</span>
              <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <i className="ri-film-line text-lg" />
              </span>
            </div>
            <div className="mt-2 font-heading text-2xl sm:text-3xl font-extrabold text-indigo-600">
              {videoCount} টি
            </div>
            <p className="text-[11px] text-foreground-500 mt-1">২৪/৭ যে কোনো সময় প্লে করুন</p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. FILTER TABS & SEARCH BAR */}
        {/* ========================================================================= */}
        <div className="bg-white border border-background-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-soft-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
              {[
                { id: 'all', label: `সব ক্লাস (${classList.length})`, icon: 'ri-apps-line' },
                { id: 'live', label: `লাইভ ক্লাস (${liveCount})`, icon: 'ri-broadcast-line' },
                { id: 'video', label: `ভিডিও ক্লাস (${videoCount})`, icon: 'ri-video-line' },
                { id: 'practice', label: 'কুইজ ও অ্যাসাইনমেন্ট', icon: 'ri-task-line' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === tab.id
                      ? 'bg-primary-600 text-white shadow-soft'
                      : 'bg-background-50 hover:bg-background-100 text-foreground-600'
                  }`}
                >
                  <i className={tab.icon} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <i className="ri-search-line absolute left-3.5 top-2.5 text-foreground-400 text-sm" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ক্লাস বা টপিক খুঁজুন..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-background-50 border border-background-200 text-xs focus:outline-none focus:border-primary-500 focus:bg-white transition-all text-foreground-900"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-foreground-400 hover:text-foreground-700"
                >
                  <i className="ri-close-circle-fill" />
                </button>
              )}
            </div>

          </div>

          {/* Module Selector Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-background-100 no-scrollbar text-xs">
            <span className="text-foreground-500 font-semibold shrink-0">মডিউল ফিল্টার:</span>
            {[
              { id: 'all', label: 'সকল মডিউল' },
              { id: 'Module 1', label: 'Module 1 (Foundations)' },
              { id: 'Module 2', label: 'Module 2 (Server Components)' },
              { id: 'Module 3', label: 'Module 3 (Server Actions & Cache)' },
              { id: 'Module 4', label: 'Module 4 (Database & Auth)' },
              { id: 'Module 5', label: 'Module 5 (Security & Perf)' },
              { id: 'Module 6', label: 'Module 6 (Projects & Deploy)' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedModule(m.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors shrink-0 ${
                  selectedModule === m.id
                    ? 'bg-primary-100 text-primary-800 font-bold border border-primary-200'
                    : 'bg-background-100 text-foreground-600 hover:bg-background-200'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. CLASS ROSTER LIST */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold text-foreground-950 flex items-center gap-2">
              <i className="ri-list-check-2 text-primary-600" />
              <span>ক্লাস তালিকা ({filteredClasses.length}টি দৃশ্যমান)</span>
            </h2>
            <span className="text-xs text-foreground-500">
              যেকোনো ক্লাসে ক্লিক করে সরাসরি পড়া বা লাইভে যুক্ত হওয়া যাবে
            </span>
          </div>

          {filteredClasses.length > 0 ? (
            <div className="grid grid-cols-1 gap-3.5">
              {filteredClasses.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 sm:p-5 rounded-2xl bg-white border transition-all hover:shadow-soft-md ${
                    item.status === 'IN_PROGRESS'
                      ? 'border-primary-400 bg-primary-50/20 ring-1 ring-primary-300'
                      : item.status === 'COMPLETED'
                      ? 'border-background-200'
                      : 'border-background-200 hover:border-primary-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    
                    {/* Left: Class Number, Title, Module, Description */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      
                      {/* Number Badge with Type Icon */}
                      <div
                        className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 font-mono font-bold shadow-soft-xs ${
                          item.type === 'live'
                            ? 'bg-rose-50 text-rose-600 border border-rose-200'
                            : item.status === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                            : item.status === 'IN_PROGRESS'
                            ? 'bg-primary-600 text-white'
                            : 'bg-background-100 text-foreground-600 border border-background-200'
                        }`}
                      >
                        <span className="text-[10px] uppercase font-bold tracking-tight">
                          {item.type === 'live' ? 'LIVE' : 'CLASS'}
                        </span>
                        <span className="text-base font-extrabold leading-none mt-0.5">
                          {item.classNumber < 10 ? `0${item.classNumber}` : item.classNumber}
                        </span>
                      </div>

                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded">
                            {item.moduleName}
                          </span>

                          {/* Status Tag */}
                          {item.status === 'COMPLETED' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                              <i className="ri-checkbox-circle-fill text-emerald-600" />
                              <span>সম্পন্ন (Completed)</span>
                            </span>
                          )}

                          {item.status === 'IN_PROGRESS' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-100 text-primary-800 flex items-center gap-1">
                              <i className="ri-play-circle-fill text-primary-600" />
                              <span>চলমান ক্লাস (Current)</span>
                            </span>
                          )}

                          {item.type === 'live' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 flex items-center gap-1 animate-pulse">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                              <span>লাইভ ক্লাস • {item.date || 'আসন্ন'}</span>
                            </span>
                          )}

                          <span className="text-[11px] font-mono text-foreground-500 flex items-center gap-1">
                            <i className="ri-time-line text-xs" />
                            {item.duration}
                          </span>
                        </div>

                        <h3 className="font-heading text-sm sm:text-base font-bold text-foreground-950 truncate">
                          {item.title}
                        </h3>

                        <p className="text-xs text-foreground-500 line-clamp-1">
                          {item.description}
                        </p>
                      </div>

                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-background-100">
                      {item.type === 'live' ? (
                        <a
                          href={item.liveMeetingUrl || 'https://meet.google.com'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-soft flex items-center gap-1.5 transition-all"
                        >
                          <i className="ri-video-chat-fill text-base" />
                          <span>Join Live Class</span>
                        </a>
                      ) : (
                        <Link
                          href={`/student/learning/${primaryCourse.courseSlug}`}
                          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-soft flex items-center gap-1.5 ${
                            item.status === 'IN_PROGRESS'
                              ? 'bg-primary-600 hover:bg-primary-700 text-white'
                              : 'bg-background-100 hover:bg-primary-600 hover:text-white text-foreground-800'
                          }`}
                        >
                          <i className="ri-play-fill text-base" />
                          <span>{item.status === 'COMPLETED' ? 'Watch Again' : 'Start Class'}</span>
                        </Link>
                      )}

                      {item.hasResources && (
                        <Link
                          href={`/student/learning/${primaryCourse.courseSlug}`}
                          className="p-2.5 rounded-xl bg-background-100 hover:bg-background-200 text-foreground-600 hover:text-foreground-900 transition-colors"
                          title="Download Class Source Code & Resources"
                        >
                          <i className="ri-download-cloud-line text-base" />
                        </Link>
                      )}
                    </div>

                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 rounded-2xl bg-white border border-dashed border-background-300 text-center space-y-3">
              <i className="ri-search-line text-3xl text-foreground-400" />
              <h4 className="text-sm font-bold text-foreground-900">কোনো ক্লাস পাওয়া যায়নি</h4>
              <p className="text-xs text-foreground-500">আপনার ফিল্টার বা সার্চ কিওয়ার্ড পরিবর্তন করে আবার চেষ্টা করুন।</p>
            </div>
          )}
        </div>

      </div>
    </PortalLayout>
  );
}
