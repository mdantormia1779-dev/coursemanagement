'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FaqSection from '@/components/FaqSection';

export default function PricingPage() {
  const plans = [
    {
      name: 'Seat Booking Deposit',
      price: '৳1,000',
      period: 'one-time deposit',
      badge: 'Easy Start',
      description: 'Book your seat in the upcoming batch now. Pay the rest in easy installments.',
      features: [
        'Instant seat reservation in next live batch',
        'Official WhatsApp confirmation within 1 hour',
        'Early access to preparatory materials & roadmap',
        '1-on-1 consultation with course mentor',
        'Remaining fee payable before class orientation',
      ],
      cta: 'Book Seat (৳1,000)',
      href: '/checkout?plan=seat-booking&amount=1000',
      highlighted: false,
    },
    {
      name: 'Scholarship Exam Pass',
      price: '৳5,000',
      period: 'full course fee',
      badge: '⭐ Special Scholarship Offer',
      description: 'Take our 10-minute online test and qualify for the special ৳5,000 course fee (Regular ৳8,000).',
      features: [
        'Save ৳3,000 with online scholarship test',
        'Live interactive classes on Google Meet & Zoom',
        'Permanent access to recorded video sessions',
        'Dedicated WhatsApp group & 1-on-1 mentor support',
        'Real-world capstone projects for portfolio',
        'Verifiable Digital Certificate with QR code',
      ],
      cta: 'Take Scholarship Exam (৳5,000) 🎁',
      href: '/exam',
      highlighted: true,
    },
    {
      name: 'Direct Full Admission',
      price: '৳8,000',
      period: 'full upfront fee',
      badge: 'Complete Package',
      description: 'Direct enrollment with VIP mentor support and lifetime update guarantee.',
      features: [
        'Guaranteed instant admission to prime batch',
        'All live classes + complete recording archive',
        '1-on-1 portfolio review & CV critique',
        'Mock technical interviews & job referrals',
        'Lifetime access to all future course updates',
        'Verified Certificate with unique verification ID',
      ],
      cta: 'Enroll Now',
      href: '/courses',
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-foreground-900">
      <Navbar onOpenSearch={() => {}} />

      <main className="flex-1 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-wider border border-primary-200/60">
              Academy Course Fees & Admissions
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground-950 tracking-tight">
              Transparent, Flexible Admissions
            </h1>
            <p className="text-base sm:text-lg text-foreground-600 leading-relaxed">
              We believe quality tech education should be accessible. Reserve your seat with just <strong className="text-foreground-900">৳1,000</strong> or qualify for the special <strong className="text-primary-600">৳5,000 scholarship fee</strong> by taking our short online exam.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col justify-between p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${
                  plan.highlighted
                    ? 'bg-foreground-950 text-white border-foreground-900 shadow-soft-xl ring-2 ring-primary-500'
                    : 'bg-white text-foreground-950 border-background-200 shadow-soft-sm hover:shadow-soft-md'
                }`}
              >
                {/* Badge */}
                <div className="mb-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide ${
                      plan.highlighted
                        ? 'bg-primary-600 text-white shadow-soft-sm'
                        : 'bg-background-100 text-foreground-700'
                    }`}
                  >
                    {plan.badge}
                  </span>
                </div>

                <div>
                  <h3 className={`font-heading text-2xl font-bold ${plan.highlighted ? 'text-white' : 'text-foreground-950'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-xs mt-2 leading-relaxed ${plan.highlighted ? 'text-foreground-300' : 'text-foreground-500'}`}>
                    {plan.description}
                  </p>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className={`font-heading text-4xl sm:text-5xl font-extrabold ${plan.highlighted ? 'text-white' : 'text-foreground-950'}`}>
                      {plan.price}
                    </span>
                    <span className={`text-xs ${plan.highlighted ? 'text-foreground-400' : 'text-foreground-500'}`}>
                      {plan.period}
                    </span>
                  </div>

                  <ul className="mt-8 space-y-3.5 text-xs border-t border-background-200/20 pt-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <i className={`ri-checkbox-circle-fill text-base shrink-0 mt-0.5 ${plan.highlighted ? 'text-emerald-400' : 'text-emerald-600'}`} />
                        <span className={plan.highlighted ? 'text-foreground-200' : 'text-foreground-700'}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  <Link
                    href={plan.href}
                    className={`w-full py-3.5 rounded-xl text-center font-bold text-xs transition-all shadow-soft-sm flex items-center justify-center gap-2 ${
                      plan.highlighted
                        ? 'bg-primary-600 hover:bg-primary-500 text-white shadow-soft-md'
                        : 'bg-background-100 hover:bg-primary-50 hover:text-primary-700 text-foreground-900 border border-background-300'
                    }`}
                  >
                    <span>{plan.cta}</span>
                    <i className="ri-arrow-right-line text-sm" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* WhatsApp Direct Admission Help Banner */}
          <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 text-white shadow-soft-lg border border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <i className="ri-whatsapp-fill text-emerald-400 text-2xl" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Direct Admission via WhatsApp
                </span>
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-white">
                Prefer to speak with an admission counselor?
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/80 max-w-lg leading-relaxed">
                Many of our students confirm their admission and book their seat directly through WhatsApp. Our counseling team will answer your questions, assist with bKash/Nagad payments, and confirm your batch enrollment manually.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <a
                href="https://wa.me/8801700000000?text=Hello%2C%20I%20want%20to%20know%20more%20about%20course%20admission%20and%20seat%20booking"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-soft-md transition-all flex items-center justify-center gap-2"
              >
                <i className="ri-whatsapp-line text-lg" />
                <span>Chat on WhatsApp</span>
              </a>
              <Link
                href="/exam"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center justify-center gap-2"
              >
                <i className="ri-award-line text-base" />
                <span>Take Exam (৳5K)</span>
              </Link>
            </div>
          </div>

          {/* FAQ Section */}
          <FaqSection />

        </div>
      </main>

      <Footer />
    </div>
  );
}
