import Link from 'next/link';
import { PRICING_PLANS } from '@/data/courses';

export default function PricingSection() {
  return (
    <section id="pricing" className="w-full bg-background-50/60 py-16 sm:py-24 border-b border-background-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold uppercase tracking-wider mb-3">
            Academy Admissions & Fees
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground-950 tracking-tight">
            Flexible Admission Options
          </h2>
          <p className="mt-3 text-base text-foreground-600">
            Book your seat in the upcoming batch with ৳1,000, take our scholarship test for ৳5,000, or enroll directly.
          </p>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {PRICING_PLANS.map((plan) => {
            const planHref = plan.highlighted
              ? '/exam'
              : plan.name.includes('Seat')
              ? '/checkout?plan=seat-booking&amount=1000'
              : '/courses';

            return (
              <div
                key={plan.name}
                className={`relative flex flex-col p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
                  plan.highlighted
                    ? 'bg-foreground-950 text-white border-foreground-900 shadow-soft-xl ring-2 ring-primary-500'
                    : 'bg-white text-foreground-950 border-background-200 shadow-soft-sm hover:shadow-soft-md'
                }`}
              >
                {/* Most Popular Pill */}
                {plan.highlighted && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-primary-600 text-white text-xs font-extrabold tracking-wide uppercase shadow-soft-sm">
                    ⭐ Scholarship Offer
                  </span>
                )}

                {/* Header */}
                <div>
                  <h3 className={`font-heading text-xl font-bold ${plan.highlighted ? 'text-white' : 'text-foreground-950'}`}>
                    {plan.name}
                  </h3>
                  <p className={`mt-2 text-xs leading-relaxed ${plan.highlighted ? 'text-foreground-300' : 'text-foreground-500'}`}>
                    {plan.description}
                  </p>

                  {/* Price Display */}
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className={`font-heading text-4xl sm:text-5xl font-extrabold ${plan.highlighted ? 'text-white' : 'text-foreground-950'}`}>
                      {plan.price}
                    </span>
                    <span className={`text-sm font-medium ${plan.highlighted ? 'text-foreground-400' : 'text-foreground-500'}`}>
                      {plan.period}
                    </span>
                  </div>
                </div>

                {/* Feature Checklist */}
                <div className="mt-8 pt-6 border-t border-background-200/20 flex-1">
                  <p className={`text-xs font-bold uppercase tracking-wider mb-4 ${plan.highlighted ? 'text-primary-300' : 'text-foreground-500'}`}>
                    Included Features
                  </p>
                  <ul className="flex flex-col gap-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm">
                        <i
                          className={`ri-check-line text-base font-bold ${
                            plan.highlighted ? 'text-secondary-400' : 'text-secondary-600'
                          }`}
                        />
                        <span className={plan.highlighted ? 'text-foreground-200' : 'text-foreground-700'}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <div className="mt-8 pt-4">
                  <Link
                    href={planHref}
                    className={`w-full h-12 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-200 shadow-soft-sm ${
                      plan.highlighted
                        ? 'bg-primary-600 hover:bg-primary-500 text-white'
                        : 'bg-background-100 hover:bg-primary-50 text-foreground-900 hover:text-primary-700 border border-background-300'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
