import { HOW_IT_WORKS } from '@/data/courses';

export default function HowItWorksSection() {
  return (
    <section className="w-full bg-white py-16 sm:py-20 border-b border-background-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold uppercase tracking-wider mb-3">
            How It Works
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground-950 tracking-tight">
            Start Learning in 3 Simple Steps
          </h2>
          <p className="mt-3 text-base text-foreground-600">
            From choosing a course to earning your verified certificate — the entire path is structured for clarity.
          </p>
        </div>

        {/* 3 Steps with Desktop Connecting Line */}
        <div className="relative">
          {/* Desktop Connecting Line */}
          <div
            className="hidden lg:block absolute top-10 left-[18%] right-[18%] h-[2px] bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200 -z-0"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 relative z-10">
            {HOW_IT_WORKS.map((step) => (
              <div
                key={step.number}
                className="flex flex-col items-center text-center p-8 rounded-2xl bg-white border border-background-200/90 shadow-soft-sm hover:shadow-soft-md transition-all duration-300"
              >
                {/* Step Number Circle */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-700 to-indigo-500 text-white font-heading text-xl font-extrabold flex items-center justify-center shadow-soft-md mb-6 ring-8 ring-primary-50">
                  {step.number}
                </div>

                <h3 className="font-heading text-xl font-bold text-foreground-950">
                  {step.title}
                </h3>
                
                <p className="mt-3 text-sm text-foreground-600 leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
