'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CATEGORIES } from '@/data/courses';

export default function CategoriesOverviewPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-foreground-900">
      <Navbar onOpenSearch={() => {}} />

      <main className="flex-1 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">
              Knowledge Domains
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground-950">
              Explore Popular Categories
            </h1>
            <p className="text-base text-foreground-600">
              Structured roadmaps curated by senior industry practitioners to help you master modern career skills.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={`/courses?category=${encodeURIComponent(cat.name)}`}
                className="group p-6 rounded-2xl bg-background-50 border border-background-200 hover:border-primary-400 hover:bg-white hover:shadow-soft-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-white border border-background-200 text-primary-600 flex items-center justify-center text-3xl mb-4 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-soft-sm">
                    <i className={cat.icon} />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-foreground-950 group-hover:text-primary-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-foreground-500 mt-1">
                    {cat.courses} active courses and roadmaps
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-background-200/60 flex items-center justify-between text-xs font-bold text-primary-600">
                  <span>Browse programs</span>
                  <i className="ri-arrow-right-line text-sm transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
