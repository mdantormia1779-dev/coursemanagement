import Link from 'next/link';
import { LEARNING_FEATURES } from '@/data/courses';

export default function LearningExperienceSection() {
  return (
    <section className="w-full bg-background-50/50 py-16 sm:py-24 border-b border-background-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Interactive Learning Experience UI Mockup */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl bg-white border border-background-300 shadow-soft-xl overflow-hidden">
              {/* Fake Browser/App Bar */}
              <div className="h-10 bg-background-100 border-b border-background-200 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                </div>
                <div className="px-3 py-0.5 rounded-md bg-white border border-background-200 text-[11px] text-foreground-500 font-mono">
                  learnx.com/learn/nextjs-mastery
                </div>
                <div className="w-10" />
              </div>

              {/* Main Screenshot/UI Visual */}
              <div className="relative aspect-[16/10] bg-background-950 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://readdy.ai/api/search-image?query=Clean%20minimal%20flat%20illustration%20of%20an%20online%20learning%20video%20player%20interface%20with%20lesson%20list%20and%20progress%20sidebar%20in%20indigo%20and%20white%20tones%20on%20a%20light%20background%2C%20modern%20LMS%20dashboard%20mockup%2C%20no%20text&width=800&height=460&seq=learning-experience-ui&orientation=landscape"
                  alt="Learning Platform Interface"
                  className="w-full h-full object-cover opacity-95"
                />
              </div>

              {/* Bottom Feature Snippet within UI */}
              <div className="p-4 sm:p-5 bg-white border-t border-background-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">
                    <i className="ri-play-circle-line text-xl" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-foreground-900">
                      Module 4: Optimizing Images & Fonts
                    </h4>
                    <p className="text-[11px] text-foreground-500">
                      Video Lesson • 12 mins • Quiz ready
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold shrink-0">
                  Completed ✓
                </span>
              </div>
            </div>

            {/* Subtle floating badge */}
            <div className="hidden sm:flex absolute -bottom-5 -right-5 bg-white px-4 py-3 rounded-xl shadow-soft-lg border border-background-200 items-center gap-3">
              <i className="ri-award-fill text-2xl text-amber-500" />
              <div>
                <p className="text-xs font-bold text-foreground-900">Interactive Code Sandbox</p>
                <p className="text-[11px] text-foreground-500">Hands-on browser coding</p>
              </div>
            </div>
          </div>

          {/* Right: Feature Checklist & Headline */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-50 text-secondary-700 text-xs font-semibold uppercase tracking-wider mb-3">
              Designed For Focus
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground-950 tracking-tight leading-tight">
              Everything You Need in One Learning Experience
            </h2>
            <p className="mt-4 text-base text-foreground-600 leading-relaxed">
              From high-definition video lessons to interactive quizzes and verified graduation certificates, every single learning tool lives in one modern, distraction-free environment.
            </p>

            {/* 8 Feature Bullets with Emerald Checkmarks */}
            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 w-full">
              {LEARNING_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm font-medium text-foreground-800">
                  <span className="w-5 h-5 rounded-full bg-secondary-100 text-secondary-600 flex items-center justify-center shrink-0">
                    <i className="ri-check-line text-xs font-bold" aria-hidden="true" />
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <div className="mt-10">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 h-12 px-7 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm shadow-soft-md hover:shadow-soft-lg transition-all duration-200 group"
              >
                <span>Explore Learning Experience</span>
                <i className="ri-arrow-right-line text-base transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
