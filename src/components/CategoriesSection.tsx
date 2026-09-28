import Link from 'next/link';
import { CATEGORIES } from '@/data/courses';

export default function CategoriesSection() {
  return (
    <section className="w-full bg-white py-16 sm:py-20 border-b border-background-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold uppercase tracking-wider mb-3">
            Browse by Domain
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground-950 tracking-tight">
            Explore Popular Categories
          </h2>
          <p className="mt-3 text-base text-foreground-600">
            Find the right skills and start learning today with industry-curated roadmaps.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/categories/${cat.slug}`}
              className="group flex items-center justify-between p-5 rounded-2xl bg-background-50 border border-background-200 hover:border-primary-400 hover:bg-white hover:shadow-soft-md transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <span className="w-12 h-12 rounded-xl bg-white border border-background-200 text-primary-600 flex items-center justify-center shrink-0 group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 transition-all duration-200 shadow-soft-sm">
                  <i className={`${cat.icon} text-2xl`} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-heading text-base font-bold text-foreground-900 group-hover:text-primary-700 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-foreground-500 font-medium mt-0.5">
                    {cat.courses} Courses
                  </p>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full flex items-center justify-center text-foreground-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all duration-200">
                <i className="ri-arrow-right-line text-lg" aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
