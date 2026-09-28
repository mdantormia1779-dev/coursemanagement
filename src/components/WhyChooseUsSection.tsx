import { WHY_CHOOSE_US } from '@/data/courses';

export default function WhyChooseUsSection() {
  return (
    <section className="w-full bg-background-50/60 py-16 sm:py-20 border-b border-background-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold uppercase tracking-wider mb-3">
            Platform Benefits
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground-950 tracking-tight">
            Everything You Need to Learn Better
          </h2>
          <p className="mt-3 text-base text-foreground-600">
            A learning experience crafted to turn ambitious learners into capable builders.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_CHOOSE_US.map((item) => (
            <div
              key={item.title}
              className="p-7 rounded-2xl bg-white border border-background-200 shadow-soft-sm hover:shadow-soft-md hover:border-primary-300 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-primary-50 border border-primary-100 text-primary-600 flex items-center justify-center mb-6 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                  <i className={`${item.icon} text-2xl`} aria-hidden="true" />
                </div>
                <h3 className="font-heading text-lg font-bold text-foreground-900 group-hover:text-primary-700 transition-colors">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-foreground-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-background-100 flex items-center gap-1 text-xs font-semibold text-primary-600">
                <span>Learn more</span>
                <i className="ri-arrow-right-s-line text-sm" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
