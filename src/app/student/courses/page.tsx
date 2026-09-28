'use client';

import { useState } from 'react';
import Link from 'next/link';
import PortalLayout from '@/components/portal/PortalLayout';
import { STUDENT_NAV } from '@/data/portalNavs';

interface EnrolledCourse {
  id: string;
  slug: string;
  title: string;
  instructor: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  currentLesson: string;
  thumbnail: string;
  category: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
}

const MY_COURSES: EnrolledCourse[] = [
  {
    id: '1',
    slug: 'complete-nextjs-development',
    title: 'Complete Next.js Development',
    instructor: 'John Doe',
    progress: 72,
    totalLessons: 24,
    completedLessons: 18,
    currentLesson: 'Lesson 18: Server Actions & Cache Revalidation',
    thumbnail: 'https://readdy.ai/api/search-image?query=Clean%20minimal%20flat%20illustration%20of%20a%20developer%20frontend%20coding%20dashboard%20interface%20with%20code%20panels%20and%20indigo%20accent%20shapes%20on%20a%20soft%20light%20background%2C%20modern%20educational%20thumbnail%20style%2C%20no%20text&width=800&height=500&seq=course-nextjs-01&orientation=landscape',
    category: 'Web Development',
    status: 'IN_PROGRESS'
  },
  {
    id: '2',
    slug: 'ui-ux-design-fundamentals',
    title: 'UI/UX Design Fundamentals',
    instructor: 'Mina Park',
    progress: 38,
    totalLessons: 20,
    completedLessons: 8,
    currentLesson: 'Lesson 8: Wireframing with Figma Auto-layout',
    thumbnail: 'https://readdy.ai/api/search-image?query=Elegant%20flat%20illustration%20of%20a%20designer%20wireframe%20and%20color%20swatch%20palette%20on%20a%20tablet%20with%20pastel%20coral%20and%20soft%20neutral%20tones%20on%20a%20light%20background%2C%20modern%20design%20course%20thumbnail%20style%2C%20no%20text&width=800&height=500&seq=course-uiux-03&orientation=landscape',
    category: 'UI/UX Design',
    status: 'IN_PROGRESS'
  },
  {
    id: '3',
    slug: 'modern-react-masterclass',
    title: 'Modern React Masterclass',
    instructor: 'Sarah Ahmed',
    progress: 100,
    totalLessons: 22,
    completedLessons: 22,
    currentLesson: 'Course Completed! Verified Certificate Ready.',
    thumbnail: 'https://readdy.ai/api/search-image?query=Minimal%20flat%20illustration%20of%20reusable%20interface%20components%20and%20atomic%20design%20blocks%20assembling%20into%20an%20app%20layout%20with%20indigo%20and%20white%20tones%20on%20a%20light%20background%2C%20clean%20educational%20course%20thumbnail%2C%20no%20text&width=800&height=500&seq=course-react-02&orientation=landscape',
    category: 'Web Development',
    status: 'COMPLETED'
  }
];

export default function StudentCoursesPage() {
  const [filter, setFilter] = useState<'ALL' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');

  const filtered = MY_COURSES.filter((c) => {
    if (filter === 'ALL') return true;
    return c.status === filter;
  });

  return (
    <PortalLayout
      role="student"
      userName="Sarah Khan"
      userRoleLabel="Frontend Developer"
      navItems={STUDENT_NAV}
    >
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl font-extrabold text-foreground-950">
              My Courses
            </h2>
            <p className="text-sm text-foreground-500 mt-1">
              Manage and continue your active learning enrollments
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-white border border-background-200 rounded-xl shadow-soft-sm text-xs font-semibold">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filter === 'ALL' ? 'bg-primary-600 text-white' : 'text-foreground-600 hover:text-foreground-950'
              }`}
            >
              All ({MY_COURSES.length})
            </button>
            <button
              onClick={() => setFilter('IN_PROGRESS')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filter === 'IN_PROGRESS' ? 'bg-primary-600 text-white' : 'text-foreground-600 hover:text-foreground-950'
              }`}
            >
              In Progress (2)
            </button>
            <button
              onClick={() => setFilter('COMPLETED')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filter === 'COMPLETED' ? 'bg-primary-600 text-white' : 'text-foreground-600 hover:text-foreground-950'
              }`}
            >
              Completed (1)
            </button>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-background-200 overflow-hidden shadow-soft-sm hover:shadow-soft-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video bg-background-900 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-foreground-950/80 backdrop-blur-sm text-white">
                      {course.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    {course.status === 'COMPLETED' ? (
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500 text-white flex items-center gap-1 shadow-soft-sm">
                        <i className="ri-checkbox-circle-fill" /> Completed
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-primary-600 text-white">
                        {course.progress}%
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-heading text-base font-bold text-foreground-950 line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-xs text-foreground-500 mt-1">
                    Instructor: {course.instructor}
                  </p>

                  <div className="mt-4 pt-3 border-t border-background-100">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-foreground-500 font-medium">Lessons: {course.completedLessons}/{course.totalLessons}</span>
                      <span className="font-bold text-primary-600">{course.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-background-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${course.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-primary-600'}`}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-foreground-500 mt-2 truncate">
                      {course.currentLesson}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                {course.status === 'COMPLETED' ? (
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/student/learning/${course.slug}`}
                      className="flex-1 py-2 text-center rounded-xl bg-background-100 hover:bg-background-200 text-foreground-800 text-xs font-bold transition-colors"
                    >
                      Review Course
                    </Link>
                    <Link
                      href="/verify/certificate/CERT-2026-000128"
                      className="flex-1 py-2 text-center rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1"
                    >
                      <i className="ri-award-fill" /> Certificate
                    </Link>
                  </div>
                ) : (
                  <Link
                    href={`/student/learning/${course.slug}`}
                    className="w-full py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-soft-sm"
                  >
                    <i className="ri-play-fill text-sm" />
                    <span>Continue Learning</span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </PortalLayout>
  );
}
