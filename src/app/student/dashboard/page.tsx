'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PortalLayout from '@/components/portal/PortalLayout';
import { STUDENT_NAV } from '@/data/portalNavs';
import { getUnlockedCourses, UnlockedEnrollment } from '@/lib/manualPaymentService';
import { getCurrentUser } from '@/lib/authService';
import { FEATURED_COURSES, POPULAR_COURSES } from '@/data/courses';

export default function StudentDashboardPage() {
  const [currentUser, setCurrentUser] = useState({ name: 'Sarah Khan', roleLabel: 'Frontend Developer' });
  const [enrolledCourses, setEnrolledCourses] = useState<UnlockedEnrollment[]>([]);
  const [isClientLoaded, setIsClientLoaded] = useState(false);

  useEffect(() => {
    setIsClientLoaded(true);
    const user = getCurrentUser();
    if (user && user.role === 'student') {
      setCurrentUser({ name: user.name, roleLabel: user.roleLabel });
    }

    const loadEnrolled = () => {
      const list = getUnlockedCourses();
      setEnrolledCourses(list);
    };

    loadEnrolled();

    // Listen for real-time course approvals from admin
    const handleUnlock = () => loadEnrolled();
    const handlePaymentChange = () => loadEnrolled();

    window.addEventListener('learnx_course_unlocked', handleUnlock);
    window.addEventListener('learnx_manual_payments_changed', handlePaymentChange);
    window.addEventListener('storage', handleUnlock);

    return () => {
      window.removeEventListener('learnx_course_unlocked', handleUnlock);
      window.removeEventListener('learnx_manual_payments_changed', handlePaymentChange);
      window.removeEventListener('storage', handleUnlock);
    };
  }, []);

  // Helper to find course metadata from catalog
  const allCatalogCourses = [...FEATURED_COURSES, ...POPULAR_COURSES];
  const getCourseDetails = (slug: string, fallbackTitle: string) => {
    const found = allCatalogCourses.find((c) => c.slug === slug);
    return {
      title: found?.title || fallbackTitle,
      instructor: found?.instructor || 'John Doe',
      image:
        found?.image ||
        'https://readdy.ai/api/search-image?query=Clean%20minimal%20flat%20illustration%20of%20a%20developer%20frontend%20coding%20dashboard%20interface%20with%20code%20panels%20and%20indigo%20accent%20shapes%20on%20a%20soft%20light%20background%2C%20modern%20educational%20thumbnail%20style%2C%20no%20text&width=800&height=500&seq=course-nextjs-01&orientation=landscape',
      category: found?.category || 'Web Development',
    };
  };

  const primaryEnrolled = enrolledCourses.length > 0 ? enrolledCourses[0] : null;
  const primaryCourseDetails = primaryEnrolled
    ? getCourseDetails(primaryEnrolled.courseSlug, primaryEnrolled.courseTitle)
    : null;

  return (
    <PortalLayout
      role="student"
      userName={currentUser.name}
      userRoleLabel={currentUser.roleLabel}
      navItems={STUDENT_NAV}
    >
      <div className="space-y-8">
        
        {/* Welcome Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-primary-900 via-primary-800 to-indigo-900 text-white p-6 sm:p-8 shadow-soft-lg flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="relative z-10 max-w-xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-primary-200 text-xs font-semibold mb-3 border border-white/10">
              <i className="ri-fire-fill text-accent-400" />
              <span>3-Day Learning Streak! Keep it up!</span>
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {currentUser.name}! 👋
            </h2>
            <p className="mt-2 text-sm text-primary-100/90 leading-relaxed">
              {enrolledCourses.length > 0
                ? `You have ${enrolledCourses.length} active course${enrolledCourses.length > 1 ? 's' : ''} in your classroom. Continue your learning streak today!`
                : 'আপনার কোনো কোর্স এখনো একটিভ নেই। সিট বুকিং করে সহজেই লাইভ ব্যাচে যুক্ত হোন।'}
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            {primaryEnrolled ? (
              <Link
                href={`/student/learning/${primaryEnrolled.courseSlug}`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-primary-50 text-primary-950 font-bold text-sm shadow-soft-md transition-all group"
              >
                <span>Resume Learning</span>
                <i className="ri-arrow-right-line transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <Link
                href="/checkout?plan=seat-booking&amount=1000"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-accent-500 hover:bg-accent-600 text-white font-bold text-sm shadow-soft-md transition-all group"
              >
                <span>Book a Seat (৳১,০০০)</span>
                <i className="ri-arrow-right-line transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </div>

          <div className="absolute right-0 top-0 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Live Batch & Admission Status Banner */}
        {primaryEnrolled && (
          <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-soft-xs">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xl flex-shrink-0 shadow-soft">
                <i className="ri-id-card-line"></i>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-blue-900">
                    Batch 24 — {primaryCourseDetails?.title || primaryEnrolled.courseTitle}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-extrabold bg-blue-200 text-blue-900 rounded-md font-mono">
                    {primaryEnrolled.studentId || 'SID-2026-8492'}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-md border border-emerald-200 flex items-center gap-1">
                    <i className="ri-checkbox-circle-fill text-emerald-600"></i>
                    <span>ভর্তি অনুমোদিত (Enrolled & Approved)</span>
                  </span>
                </div>
                <p className="text-xs text-blue-700 mt-1">
                  Class Starts: <strong>15 October, 2026</strong> | Schedule: রবি, মঙ্গল, বৃহস্পতি রাত ৯:০০ টা
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-shrink-0">
              <a
                href="https://facebook.com/groups/learnx-mern-batch24"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-soft flex items-center gap-1.5 transition-colors"
              >
                <i className="ri-facebook-circle-fill"></i>
                <span>Join Secret FB Group</span>
              </a>
              <Link
                href="/student/admission"
                className="px-3.5 py-2 bg-white hover:bg-blue-100 border border-blue-300 text-blue-900 text-xs font-bold rounded-xl shadow-soft-xs flex items-center gap-1.5 transition-colors"
              >
                <span>View Admission Slip</span>
                <i className="ri-arrow-right-line"></i>
              </Link>
            </div>
          </div>
        )}

        {/* 4 Quick Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 rounded-2xl bg-white border border-background-200 shadow-soft-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground-500">Enrolled Courses</span>
              <span className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                <i className="ri-book-open-line text-lg" />
              </span>
            </div>
            <div className="mt-3 font-heading text-2xl sm:text-3xl font-extrabold text-foreground-950">
              {isClientLoaded ? enrolledCourses.length : 1}
            </div>
            <p className="mt-1 text-xs text-emerald-600 font-medium flex items-center gap-1">
              <i className="ri-check-line" /> {enrolledCourses.length > 0 ? `${enrolledCourses.length} active course(s)` : 'No active courses'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-background-200 shadow-soft-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground-500">Live Classes</span>
              <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <i className="ri-broadcast-line text-lg" />
              </span>
            </div>
            <div className="mt-3 font-heading text-2xl sm:text-3xl font-extrabold text-foreground-950">
              {enrolledCourses.length > 0 ? 12 : 0}
            </div>
            <p className="mt-1 text-xs text-foreground-500 font-medium">3 classes this week</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-background-200 shadow-soft-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground-500">Certificates Earned</span>
              <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <i className="ri-award-line text-lg" />
              </span>
            </div>
            <div className="mt-3 font-heading text-2xl sm:text-3xl font-extrabold text-foreground-950">1</div>
            <Link href="/student/certificates" className="mt-1 text-xs text-primary-600 hover:underline font-semibold block">
              View Credentials →
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-background-200 shadow-soft-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground-500">Average Quiz Score</span>
              <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <i className="ri-bar-chart-box-line text-lg" />
              </span>
            </div>
            <div className="mt-3 font-heading text-2xl sm:text-3xl font-extrabold text-foreground-950">94%</div>
            <p className="mt-1 text-xs text-emerald-600 font-medium">Passed all quizzes</p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DEDICATED "MY CLASS (আমার ক্লাস)" SECTION */}
        {/* Only displays courses that have been taken/enrolled by the student */}
        {/* ========================================================================= */}
        <div id="my-class" className="scroll-mt-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-background-200">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-primary-600 text-white flex items-center justify-center shadow-soft">
                  <i className="ri-presentation-fill text-lg"></i>
                </span>
                <h3 className="font-heading text-xl font-extrabold text-foreground-950">
                  My Class (আমার ক্লাসসমূহ)
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-50 text-primary-700 border border-primary-200">
                  {enrolledCourses.length} টি কোর্স নেওয়া আছে
                </span>
              </div>
              <p className="text-xs text-foreground-500 mt-1">
                আপনার ভর্তি নিশ্চিত হওয়া কোর্সসমূহের লাইভ ক্লাস, রুটিন এবং সরাসরি ক্লাসরুম
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/student/my-class"
                className="px-3.5 py-1.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-soft transition-colors"
              >
                <i className="ri-list-check-2"></i>
                <span>সব ক্লাস দেখুন (All Classes)</span>
              </Link>
              <Link
                href="/student/live-classes"
                className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1.5 transition-colors"
              >
                <i className="ri-broadcast-line text-emerald-600"></i>
                <span>Live Hub</span>
              </Link>
            </div>
          </div>

          {/* If student has enrolled courses: Render each taken course */}
          {enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 gap-5">
              {enrolledCourses.map((enrollment, idx) => {
                const details = getCourseDetails(enrollment.courseSlug, enrollment.courseTitle);
                return (
                  <div
                    key={`${enrollment.courseSlug}-${idx}`}
                    className="p-6 rounded-3xl bg-white border border-primary-100 shadow-soft-md hover:shadow-soft-lg transition-all relative overflow-hidden"
                  >
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                      
                      {/* Left: Course thumbnail & Basic Info */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 flex-1 min-w-0">
                        <div className="w-full sm:w-44 aspect-video rounded-2xl bg-background-900 overflow-hidden relative shrink-0 shadow-soft-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={details.image}
                            alt={details.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-foreground-950/30 flex items-center justify-center group cursor-pointer">
                            <span className="w-10 h-10 rounded-full bg-white/90 text-primary-700 flex items-center justify-center text-xl shadow-soft">
                              <i className="ri-play-fill"></i>
                            </span>
                          </div>
                          <span className="absolute bottom-2 left-2 px-2 py-0.5 text-[10px] font-bold rounded bg-black/70 text-white backdrop-blur-sm">
                            Batch 24
                          </span>
                        </div>

                        <div className="space-y-2 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                              <i className="ri-checkbox-circle-fill text-emerald-500"></i>
                              <span>ভর্তি অনুমোদিত (Enrolled & Approved)</span>
                            </span>
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-blue-100 text-blue-800">
                              {enrollment.studentId || 'SID-2026-8492'}
                            </span>
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-background-100 text-foreground-600">
                              {details.category}
                            </span>
                          </div>

                          <h4 className="font-heading text-lg font-bold text-foreground-950 truncate">
                            {details.title}
                          </h4>

                          <p className="text-xs text-foreground-500 flex items-center gap-3">
                            <span><i className="ri-user-line text-primary-600 mr-1"></i>মেন্টর: {details.instructor}</span>
                            <span>•</span>
                            <span><i className="ri-calendar-line text-primary-600 mr-1"></i>অনুমোদন: {new Date(enrollment.unlockedAt || Date.now()).toLocaleDateString('bn-BD')}</span>
                          </p>

                          {/* Routine Box */}
                          <div className="p-2.5 rounded-xl bg-background-50 border border-background-200 text-xs text-foreground-700 flex flex-wrap items-center gap-4">
                            <span className="font-semibold text-primary-700 flex items-center gap-1">
                              <i className="ri-time-line"></i>
                              <span>ক্লাস রুটিন: রবি, মঙ্গল, বৃহস্পতি রাত ৯:০০ টা</span>
                            </span>
                            <span className="text-foreground-500 flex items-center gap-1">
                              <i className="ri-video-line text-emerald-600"></i>
                              <span>Google Meet Live</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-row lg:flex-col items-center lg:items-stretch gap-2.5 shrink-0 w-full lg:w-48 pt-4 lg:pt-0 border-t lg:border-t-0 border-background-100">
                        <Link
                          href={`/student/learning/${enrollment.courseSlug}`}
                          className="flex-1 lg:flex-none px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold text-center transition-all shadow-soft flex items-center justify-center gap-1.5"
                        >
                          <i className="ri-play-circle-line text-base"></i>
                          <span>Enter Classroom</span>
                        </Link>

                        <Link
                          href="/student/live-classes"
                          className="flex-1 lg:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold text-center transition-all shadow-soft flex items-center justify-center gap-1.5"
                        >
                          <i className="ri-broadcast-line text-base"></i>
                          <span>Join Live Class</span>
                        </Link>

                        <Link
                          href="/student/admission"
                          className="flex-1 lg:flex-none px-4 py-2 rounded-xl bg-background-100 hover:bg-background-200 text-foreground-700 text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1"
                        >
                          <i className="ri-id-card-line"></i>
                          <span>Admission Slip</span>
                        </Link>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State when no course is taken/enrolled */
            <div className="p-8 sm:p-12 rounded-3xl bg-white border border-dashed border-background-300 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center text-3xl shadow-soft-xs">
                <i className="ri-book-open-line"></i>
              </div>
              <div className="max-w-md mx-auto">
                <h4 className="font-heading text-lg font-bold text-foreground-950">
                  আপনার কোনো কোর্স বা ক্লাস এখনো নেওয়া নেই
                </h4>
                <p className="text-xs text-foreground-500 mt-1.5 leading-relaxed">
                  আপনি যে কোর্সগুলোতে ভর্তি হবেন বা সিট বুকিং করবেন, এডমিন অনুমোদনের পর শুধুমাত্র সেই কোর্সগুলো এখানে &quot;My Class&quot;-এ দৃশ্যমান হবে।
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/checkout?plan=seat-booking&amount=1000"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-soft transition-all"
                >
                  <i className="ri-add-line text-sm"></i>
                  <span>সিট বুকিং দিন (৳১,০০০) / কোর্স ব্রাউজ করুন</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* 2-Column Split: Active Courses & Upcoming Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Courses List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold text-foreground-950">
                My Enrolled Courses ({enrolledCourses.length})
              </h3>
              <Link href="/student/courses" className="text-xs font-bold text-primary-600 hover:underline">
                View All Courses →
              </Link>
            </div>

            {enrolledCourses.length > 0 ? (
              enrolledCourses.map((item, i) => {
                const det = getCourseDetails(item.courseSlug, item.courseTitle);
                return (
                  <div
                    key={`enrolled-row-${item.courseSlug}-${i}`}
                    className="p-4 rounded-2xl bg-white border border-background-200 shadow-soft-sm flex items-center gap-4"
                  >
                    <div className="w-16 h-12 rounded-lg bg-background-100 overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={det.image}
                        alt={det.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-foreground-950 truncate">{det.title}</h4>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 shrink-0">
                          Active
                        </span>
                      </div>
                      <div className="mt-1.5 w-full h-1.5 bg-background-200 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-600 rounded-full" style={{ width: '72%' }} />
                      </div>
                    </div>
                    <Link
                      href={`/student/learning/${item.courseSlug}`}
                      className="px-3 py-1.5 rounded-lg bg-background-100 hover:bg-primary-50 hover:text-primary-700 text-xs font-bold text-foreground-700 transition-colors shrink-0"
                    >
                      Continue →
                    </Link>
                  </div>
                );
              })
            ) : (
              <div className="p-6 rounded-2xl bg-white border border-background-200 text-center text-xs text-foreground-500">
                কোনো একটিভ কোর্স নেই। সিট বুকিং সম্পন্ন করুন।
              </div>
            )}
          </div>

          {/* Upcoming Quizzes & Deadlines */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-bold text-foreground-950">
              Upcoming Deadlines
            </h3>

            <div className="p-5 rounded-2xl bg-white border border-background-200 shadow-soft-sm space-y-4">
              <div className="flex items-start gap-3 pb-3 border-b border-background-100">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <i className="ri-questionnaire-line text-lg" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-foreground-950">Module 4 Comprehensive Quiz</h5>
                  <p className="text-[11px] text-foreground-500 mt-0.5">Next.js Development • 15 questions</p>
                  <Link href="/student/quizzes" className="text-xs text-primary-600 font-bold hover:underline mt-1 inline-block">
                    Start Quiz Now →
                  </Link>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <i className="ri-file-upload-line text-lg" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-foreground-950">Capstone Project Submission</h5>
                  <p className="text-[11px] text-foreground-500 mt-0.5">Due in 5 days • Full Stack App</p>
                  <Link href="/student/assignments" className="text-xs text-primary-600 font-bold hover:underline mt-1 inline-block">
                    View Instructions →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </PortalLayout>
  );
}
