import { TRUST_BRANDS } from '@/data/courses';

export default function TrustSection() {
  return (
    <section className="w-full bg-white py-10 sm:py-12 border-b border-background-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-foreground-500">
          Trusted by learners building skills for the future
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-6 sm:gap-x-12 md:gap-x-16">
          {TRUST_BRANDS.map((brand) => (
            <div
              key={brand.name}
              className="flex items-center gap-2 text-foreground-400 hover:text-foreground-700 transition-colors duration-200 select-none cursor-default"
            >
              <i className={`${brand.icon} text-2xl`} aria-hidden="true" />
              <span className="font-heading text-lg sm:text-xl font-bold tracking-tight">
                {brand.name}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs text-foreground-400">
          Illustrative examples — not current brand partners.
        </p>
      </div>
    </section>
  );
}
