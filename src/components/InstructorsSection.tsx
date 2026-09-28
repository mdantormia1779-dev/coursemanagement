import Link from 'next/link';
import { INSTRUCTORS } from '@/data/courses';

export default function InstructorsSection() {
  return (
    <section className="w-full bg-white py-16 sm:py-20 border-b border-background-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold uppercase tracking-wider mb-3">
              Top Mentors
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground-950 tracking-tight">
              Learn From Industry Experts
            </h2>
            <p className="mt-2 text-base text-foreground-600">
              Meet instructors who bring real-world experience into every lesson.
            </p>
          </div>

          <Link
            href="/instructors"
            className="inline-flex items-center gap-2 h-11 px-5 rounded-xl border border-background-300 bg-white hover:border-primary-400 hover:text-primary-600 text-sm font-semibold text-foreground-800 transition-all duration-200 shadow-soft-sm whitespace-nowrap self-start sm:self-auto group"
          >
            <span>All Instructors</span>
            <i className="ri-arrow-right-line text-sm transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>

        {/* 4 Instructor Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INSTRUCTORS.map((instructor) => (
            <div
              key={instructor.id}
              className="p-6 rounded-2xl bg-white border border-background-200 shadow-soft-sm hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group"
            >
              {/* Profile Image with subtle ring */}
              <div className="relative w-28 h-28 rounded-2xl overflow-hidden mb-5 ring-4 ring-background-100 group-hover:ring-primary-100 transition-all duration-300">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={instructor.image}
                  alt={instructor.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Name & Role */}
              <h3 className="font-heading text-lg font-bold text-foreground-950 group-hover:text-primary-600 transition-colors">
                {instructor.name}
              </h3>
              <p className="mt-1 text-xs text-foreground-500 font-medium">
                {instructor.expertise}
              </p>

              {/* Stats: Rating, Courses, Students */}
              <div className="mt-5 w-full pt-4 border-t border-background-100 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <div className="flex items-center justify-center gap-1 text-amber-500 font-bold">
                    <i className="ri-star-fill text-xs" />
                    <span>{instructor.rating}</span>
                  </div>
                  <div className="text-[11px] text-foreground-400 mt-0.5">Rating</div>
                </div>
                <div>
                  <div className="font-bold text-foreground-900">{instructor.courses}</div>
                  <div className="text-[11px] text-foreground-400 mt-0.5">Courses</div>
                </div>
                <div>
                  <div className="font-bold text-foreground-900">{instructor.students}</div>
                  <div className="text-[11px] text-foreground-400 mt-0.5">Students</div>
                </div>
              </div>

              {/* Action Button */}
              <Link
                href={`/instructors/${instructor.id}`}
                className="mt-6 w-full py-2.5 rounded-xl border border-background-200 hover:border-primary-400 bg-background-50 hover:bg-white text-foreground-800 hover:text-primary-700 text-xs font-bold transition-all duration-200 shadow-soft-sm"
              >
                View Profile
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
