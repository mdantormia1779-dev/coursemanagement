import Link from 'next/link';

export default function FinalCtaSection() {
  return (
    <section className="w-full bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-primary-900 via-primary-800 to-indigo-950 p-10 sm:p-16 lg:p-20 text-center overflow-hidden shadow-soft-xl">
          
          {/* Subtle decorative glow elements */}
          <div className="absolute top-0 left-1/4 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-primary-200 text-xs font-semibold uppercase tracking-wider mb-6 border border-white/15 backdrop-blur-sm">
              Start Your Journey Today
            </span>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Ready to Start Learning?
            </h2>

            <p className="mt-5 text-base sm:text-lg text-primary-100/90 leading-relaxed max-w-xl mx-auto">
              Build skills, learn from verified industry experts, and move closer to your goals today with full career confidence.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/courses"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-white hover:bg-primary-50 text-primary-950 font-bold text-sm shadow-soft-md transition-all duration-200 group"
              >
                <span>Explore Courses</span>
                <i className="ri-arrow-right-line text-base transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl border border-white/30 hover:border-white/60 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm backdrop-blur-sm transition-all duration-200"
              >
                <span>Create Free Account</span>
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 text-xs text-primary-200">
              <span className="flex items-center gap-1.5">
                <i className="ri-check-line text-accent-400 font-bold" />
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <i className="ri-check-line text-accent-400 font-bold" />
                Cancel anytime
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
