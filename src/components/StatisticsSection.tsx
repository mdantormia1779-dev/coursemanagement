import { STATISTICS } from '@/data/courses';

export default function StatisticsSection() {
  return (
    <section className="w-full bg-background-50 py-12 sm:py-16 border-b border-background-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {STATISTICS.map((stat) => (
            <div
              key={stat.label}
              className="p-6 sm:p-7 rounded-2xl bg-white border border-background-200 shadow-soft-sm hover:shadow-soft-md hover:border-primary-200 transition-all duration-200 flex flex-col items-center sm:items-start text-center sm:text-left group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                <i className={`${stat.icon} text-2xl`} aria-hidden="true" />
              </div>
              <div className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground-950 tracking-tight">
                {stat.value}
              </div>
              <p className="mt-1 text-sm font-medium text-foreground-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
