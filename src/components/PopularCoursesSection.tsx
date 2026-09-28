import Link from 'next/link';
import { POPULAR_COURSES } from '@/data/courses';
import CourseCard from './CourseCard';

export default function PopularCoursesSection() {
  return (
    <section className="w-full bg-white py-16 sm:py-20 border-b border-background-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-50 text-accent-800 text-xs font-semibold uppercase tracking-wider mb-3">
              Trending Now
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground-950 tracking-tight">
              Popular With Students
            </h2>
            <p className="mt-2 text-base text-foreground-600">
              High-enrollment topics chosen by aspiring professionals this semester.
            </p>
          </div>

          <Link
            href="/courses?filter=popular"
            className="inline-flex items-center gap-2 h-11 px-5 rounded-xl border border-background-300 bg-white hover:border-primary-400 hover:text-primary-600 text-sm font-semibold text-foreground-800 transition-all duration-200 shadow-soft-sm whitespace-nowrap self-start sm:self-auto group"
          >
            <span>Explore All Trending</span>
            <i className="ri-arrow-right-line text-sm transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>

        {/* 4-Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {POPULAR_COURSES.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

      </div>
    </section>
  );
}
