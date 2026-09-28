import { TESTIMONIALS } from '@/data/courses';

export default function TestimonialsSection() {
  return (
    <section className="w-full bg-background-50/50 py-16 sm:py-20 border-b border-background-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold uppercase tracking-wider mb-3">
            Real Reviews
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground-950 tracking-tight">
            What Our Students Say
          </h2>
          <p className="mt-3 text-base text-foreground-600">
            Real stories from learners who turned new skills into career breakthroughs.
          </p>
        </div>

        {/* 4 Testimonial Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="p-6 rounded-2xl bg-white border border-background-200 shadow-soft-sm hover:shadow-soft-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-4" aria-label="5 out of 5 stars">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <i key={i} className="ri-star-fill text-sm" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm text-foreground-700 leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Student Info */}
              <div className="mt-6 pt-5 border-t border-background-100 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-background-200 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-foreground-950 truncate">
                    {t.name}
                  </h4>
                  <p className="text-xs text-foreground-500 truncate">
                    {t.role}
                  </p>
                  <p className="text-[11px] text-primary-600 font-medium truncate mt-0.5">
                    {t.course}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
