import Link from 'next/link';

export default function BecomeInstructorSection() {
  return (
    <section className="w-full bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 py-16 sm:py-20 text-white relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Admissions Open — Upcoming Batch
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Book Your Seat with ৳1,000 or Qualify for ৳5,000 Scholarship
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
              Enroll in our academy's live masterclasses with industry mentors. Reserve your seat with a ৳1,000 deposit or take our 10-minute online test to unlock the special ৳5,000 scholarship fee.
            </p>

            <div className="mt-8 flex flex-wrap gap-3.5 w-full sm:w-auto">
              <Link
                href="/exam"
                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-sm shadow-soft-md transition-all duration-200 group"
              >
                <span>Take Scholarship Exam (৳5,000) 🎁</span>
                <i className="ri-arrow-right-line text-base transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm shadow-soft-sm transition-all duration-200"
              >
                <span>Book Seat (৳1,000)</span>
              </Link>
              <a
                href="https://wa.me/8801700000000?text=Hello%2C%20I%20want%20to%20know%20more%20about%20upcoming%20batch%20admission"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-12 px-5 rounded-xl border border-emerald-500/40 hover:border-emerald-400 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 font-semibold text-sm transition-all duration-200"
              >
                <i className="ri-whatsapp-line text-lg text-emerald-400" />
                <span>WhatsApp Admission</span>
              </a>
            </div>

            {/* 3 Value Propositions */}
            <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-3 gap-4 w-full max-w-lg">
              <div>
                <div className="font-heading text-xl sm:text-2xl font-extrabold text-white">৳1,000</div>
                <div className="text-xs text-slate-400 mt-1">Seat Booking Deposit</div>
              </div>
              <div>
                <div className="font-heading text-xl sm:text-2xl font-extrabold text-emerald-400">৳5,000</div>
                <div className="text-xs text-slate-400 mt-1">Exam Scholarship Pass</div>
              </div>
              <div>
                <div className="font-heading text-xl sm:text-2xl font-extrabold text-white">100%</div>
                <div className="text-xs text-slate-400 mt-1">Live Classes & Mentorship</div>
              </div>
            </div>
          </div>

          {/* Right Visual Composition: Academy Live Learning Preview */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-2 sm:p-3 shadow-soft-xl overflow-hidden group">
              <div className="rounded-xl overflow-hidden bg-slate-900 aspect-[16/11] relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://readdy.ai/api/search-image?query=A%20modern%20online%20live%20coding%20and%20tech%20mentorship%20classroom%20interface%20showing%20live%20video%20feed%20of%20instructor%2C%20student%20chat%2C%20and%20code%20editor%20on%20screen%2C%20dark%20aesthetic%2C%20clean%20SaaS%20UI&width=800&height=420&seq=academy-live-session&orientation=landscape"
                  alt="Academy Live Classroom Mentorship"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Floating Batch Status Tag */}
              <div className="absolute bottom-5 left-5 bg-slate-900 text-white p-3.5 rounded-xl shadow-soft-lg border border-slate-700 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
                  <i className="ri-broadcast-line" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Next Live Batch</div>
                  <div className="text-xs sm:text-sm font-extrabold text-white">Starting Next Sunday • Limited Seats</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
