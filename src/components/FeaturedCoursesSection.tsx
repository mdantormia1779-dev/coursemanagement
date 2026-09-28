import Link from 'next/link';
import { FEATURED_COURSES } from '@/data/courses';
import CourseCard from './CourseCard';

export default function FeaturedCoursesSection() {
  return (
    <section className="w-full bg-background-50/50 py-16 sm:py-20 border-b border-background-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Title and "View All Courses" Action */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold uppercase tracking-wider mb-3">
              Curated Selection
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground-950 tracking-tight">
              Learn From Our Featured Courses
            </h2>
            <p className="mt-2 text-base text-foreground-600">
              Practical courses designed to help you build real-world skills.
            </p>
          </div>

          <Link
            href="/courses"
            className="inline-flex items-center gap-2 h-11 px-5 rounded-xl border border-background-300 bg-white hover:border-primary-400 hover:text-primary-600 text-sm font-semibold text-foreground-800 transition-all duration-200 shadow-soft-sm whitespace-nowrap self-start sm:self-auto group"
          >
            <span>View All Courses</span>
            <i className="ri-arrow-right-line text-sm transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>

        {/* 4-Column Responsive Grid (Desktop: 4, Tablet: 2, Mobile: 1) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_COURSES.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

      </div>
    </section>
  );
}
