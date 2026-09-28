'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { INSTRUCTORS } from '@/data/courses';

export default function InstructorsDirectoryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-foreground-900">
      <Navbar onOpenSearch={() => {}} />

      <main className="flex-1 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">
              Faculty & Industry Experts
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground-950">
              Meet Our Expert Instructors
            </h1>
            <p className="text-base text-foreground-600">
              Learn directly from software engineers, product designers, and marketing directors actively leading teams at top technology companies.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {INSTRUCTORS.map((instructor) => (
              <div
                key={instructor.id}
                className="p-6 rounded-2xl bg-white border border-background-200 shadow-soft-sm hover:shadow-soft-md transition-all flex flex-col items-center text-center group"
              >
                <div className="w-28 h-28 rounded-2xl overflow-hidden mb-4 ring-4 ring-background-100 group-hover:ring-primary-100 transition-all">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={instructor.image}
                    alt={instructor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <h3 className="font-heading text-lg font-bold text-foreground-950 group-hover:text-primary-600 transition-colors">
                  {instructor.name}
                </h3>
                <p className="text-xs text-foreground-500 font-medium mt-0.5">
                  {instructor.expertise}
                </p>

                <div className="mt-5 w-full pt-4 border-t border-background-100 grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <div className="font-bold text-amber-500">★ {instructor.rating}</div>
                    <div className="text-[11px] text-foreground-400 mt-0.5">Rating</div>
                  </div>
                  <div>
                    <div className="font-bold text-foreground-900">{instructor.courses}</div>
                    <div className="text-[11px] text-foreground-400 mt-0.5">Courses</div>
                  </div>
                  <div>
                    <div className="font-bold text-foreground-900">{instructor.students}</div>
                    <div className="text-[11px] text-foreground-400 mt-0.5">Students</div>
                  </div>
                </div>

                <a
                  href={`/courses?instructor=${encodeURIComponent(instructor.name)}`}
                  className="mt-6 w-full py-2.5 rounded-xl border border-background-200 hover:border-primary-400 bg-background-50 hover:bg-white text-foreground-800 text-xs font-bold transition-all shadow-soft-sm text-center"
                >
                  View Taught Courses
                </a>
              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
