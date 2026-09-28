import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-50/40 via-white to-white py-14 sm:py-20 lg:py-24 border-b border-background-200/60">
      {/* Background soft ambient blurs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-r from-primary-200/20 via-indigo-100/30 to-secondary-100/20 blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-primary-200 shadow-soft-sm text-primary-700 text-xs sm:text-sm font-semibold mb-6 animate-fade-in">
              <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-pulse"></span>
              <i className="ri-flashlight-fill text-accent-500 text-sm" aria-hidden="true" />
              <span>Learn Without Limits</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-foreground-950 tracking-tight leading-[1.1]">
              Build Skills That{' '}
              <span className="text-primary-600 relative inline-block">
                Move Your Career
                <svg
                  className="absolute left-0 -bottom-1 w-full text-primary-300 -z-10"
                  height="8"
                  viewBox="0 0 200 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 5.5C40 2 120 1.5 199 5.5"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{' '}
              Forward
            </h1>

            {/* Description */}
            <p className="mt-5 text-base sm:text-lg text-foreground-600 leading-relaxed max-w-xl">
              Learn practical skills from expert instructors through structured, flexible and career-focused online courses designed for real-world impact.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto">
              <Link
                href="/courses"
                className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-semibold text-sm shadow-soft-md hover:shadow-soft-lg transition-all duration-200 group"
              >
                <span>Explore Courses</span>
                <i className="ri-arrow-right-line text-base transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl border border-background-300 bg-white hover:bg-background-50 text-foreground-800 font-semibold text-sm shadow-soft-sm hover:border-primary-300 hover:text-primary-700 transition-all duration-200"
              >
                <span>Start Learning Free</span>
              </Link>
            </div>

            {/* Social Proof / Avatars */}
            <div className="mt-10 pt-8 border-t border-background-200/80 flex items-center gap-4 flex-wrap">
              <div className="flex -space-x-2.5 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                  src="https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20a%20smiling%20young%20woman%20student%20against%20a%20soft%20neutral%20background%2C%20natural%20lighting%2C%20editorial%20headshot&width=120&height=120&seq=hero-avatar-a&orientation=squarish"
                  alt="Student avatar 1"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                  src="https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20a%20smiling%20young%20man%20student%20against%20a%20soft%20neutral%20background%2C%20natural%20lighting%2C%20editorial%20headshot&width=120&height=120&seq=hero-avatar-b&orientation=squarish"
                  alt="Student avatar 2"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                  src="https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20a%20smiling%20woman%20with%20glasses%20student%20against%20a%20soft%20neutral%20background%2C%20natural%20lighting%2C%20editorial%20headshot&width=120&height=120&seq=hero-avatar-c&orientation=squarish"
                  alt="Student avatar 3"
                />
                <div className="h-9 w-9 rounded-full ring-2 ring-white bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold">
                  +12k
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1 text-accent-500 text-xs">
                  <i className="ri-star-fill" />
                  <i className="ri-star-fill" />
                  <i className="ri-star-fill" />
                  <i className="ri-star-fill" />
                  <i className="ri-star-fill" />
                  <span className="font-bold text-foreground-800 ml-1">4.9 / 5.0</span>
                </div>
                <p className="text-xs text-foreground-500 font-medium mt-0.5">
                  Trusted by 12,500+ active learners
                </p>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Composition */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg lg:max-w-none">
              
              {/* Main Course Card */}
              <div className="bg-white rounded-2xl shadow-soft-xl border border-background-200 overflow-hidden relative transition-all duration-300 hover:shadow-2xl">
                {/* Top Video / Thumbnail Preview */}
                <div className="relative h-56 sm:h-64 bg-background-900 overflow-hidden group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://readdy.ai/api/search-image?query=Clean%20minimal%20flat%20illustration%20of%20a%20web%20development%20course%20screen%20with%20code%20editor%20panels%20and%20indigo%20accent%20shapes%20on%20a%20soft%20light%20background%2C%20modern%20educational%20hero%20visual%2C%20no%20text&width=800&height=420&seq=hero-course-main&orientation=landscape"
                    alt="Course Preview"
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground-950/80 via-foreground-950/20 to-transparent flex items-end p-5">
                    <div>
                      <span className="inline-block px-2.5 py-1 rounded bg-primary-600/90 backdrop-blur-sm text-white text-xs font-semibold uppercase tracking-wider mb-2">
                        In Progress • Lesson 18 of 24
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
                        Complete Next.js Development
                      </h3>
                      <p className="text-xs text-background-300 mt-1">Instructor: John Doe • Senior Engineer</p>
                    </div>
                  </div>
                  {/* Play Button Icon */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-primary-600 shadow-soft-lg group-hover:scale-110 transition-transform">
                    <i className="ri-play-fill text-2xl ml-1" />
                  </div>
                </div>

                {/* Progress Details */}
                <div className="p-5 sm:p-6 bg-white">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-semibold text-foreground-700">Course Progress</span>
                    <span className="font-bold text-primary-600">72% Completed</span>
                  </div>
                  <div className="w-full h-2.5 bg-background-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-600 to-indigo-500 rounded-full"
                      style={{ width: '72%' }}
                    />
                  </div>

                  <div className="mt-5 flex items-center justify-between pt-4 border-t border-background-100">
                    <div className="flex items-center gap-2 text-xs text-foreground-500">
                      <i className="ri-time-line text-sm text-primary-500" />
                      <span>Next: Server Actions & Cache (14m)</span>
                    </div>
                    <Link
                      href="/courses/complete-nextjs-development"
                      className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-soft-sm"
                    >
                      <span>Continue Learning</span>
                      <i className="ri-arrow-right-s-line text-sm" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Floating Card 1: 12,540+ Students */}
              <div className="hidden sm:flex absolute -bottom-6 -left-6 bg-white p-3.5 sm:p-4 rounded-xl shadow-soft-lg border border-background-200 items-center gap-3 animate-fade-in">
                <div className="w-11 h-11 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                  <i className="ri-group-line text-2xl" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-foreground-900 leading-none">12,540+</div>
                  <div className="text-xs text-foreground-500 mt-1 font-medium">Students Enrolled</div>
                </div>
              </div>

              {/* Floating Card 2: 4.9 Rating */}
              <div className="hidden sm:flex absolute -top-5 -right-5 bg-white p-3 rounded-xl shadow-soft-lg border border-background-200 items-center gap-2.5 animate-fade-in">
                <div className="w-9 h-9 rounded-lg bg-accent-50 flex items-center justify-center text-accent-500 shrink-0">
                  <i className="ri-star-fill text-lg" />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-foreground-900 leading-none">4.9 ★ Rating</div>
                  <div className="text-[11px] text-foreground-500 mt-0.5">Top-rated LMS</div>
                </div>
              </div>

              {/* Floating Card 3: Certificate Earned */}
              <div className="hidden md:flex absolute top-1/2 -right-8 -translate-y-1/2 bg-white px-3.5 py-2.5 rounded-xl shadow-soft-lg border border-secondary-200 items-center gap-2 animate-fade-in">
                <div className="w-7 h-7 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-600 shrink-0">
                  <i className="ri-checkbox-circle-fill text-base" />
                </div>
                <div>
                  <span className="text-xs font-bold text-secondary-700">Certificate Earned ✓</span>
                  <p className="text-[10px] text-foreground-400">Verifiable credential</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
