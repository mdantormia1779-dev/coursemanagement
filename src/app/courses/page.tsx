'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CourseCard from '@/components/CourseCard';
import SearchModal from '@/components/SearchModal';
import { FEATURED_COURSES, POPULAR_COURSES, CATEGORIES } from '@/data/courses';

export default function CoursesDirectoryPage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSort, setSelectedSort] = useState<string>('POPULAR');
  const [searchQuery, setSearchQuery] = useState('');

  const allCourses = [...FEATURED_COURSES, ...POPULAR_COURSES];

  const filtered = allCourses.filter((course) => {
    if (selectedCategory !== 'ALL' && course.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        course.title.toLowerCase().includes(q) ||
        course.instructor.toLowerCase().includes(q) ||
        course.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-white text-foreground-900">
      <Navbar onOpenSearch={() => setSearchOpen(true)} />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} courses={allCourses} />

      <main className="flex-1 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">
              Explore Our Catalog
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground-950 tracking-tight mt-1">
              All Courses & Masterclasses
            </h1>
            <p className="mt-3 text-base text-foreground-600">
              Browse {allCourses.length}+ career-focused programs taught by active engineers, designers, and marketers.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="mt-8 p-4 rounded-2xl bg-background-50 border border-background-200 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <i className="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses or topics..."
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-background-300 bg-white text-sm outline-none focus:border-primary-500 shadow-soft-sm"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-11 px-3.5 rounded-xl border border-background-300 bg-white text-xs font-bold text-foreground-800 outline-none shadow-soft-sm cursor-pointer"
              >
                <option value="ALL">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="h-11 px-3.5 rounded-xl border border-background-300 bg-white text-xs font-bold text-foreground-800 outline-none shadow-soft-sm cursor-pointer"
              >
                <option value="POPULAR">Sort by: Popular</option>
                <option value="RATING">Highest Rated</option>
                <option value="PRICE_LOW">Price: Low to High</option>
                <option value="PRICE_HIGH">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 flex items-center justify-between text-xs text-foreground-500">
            <span>Showing <strong>{filtered.length}</strong> available courses</span>
            {selectedCategory !== 'ALL' && (
              <button
                onClick={() => setSelectedCategory('ALL')}
                className="text-primary-600 font-bold hover:underline"
              >
                Reset Filter ✕
              </button>
            )}
          </div>

          {/* Course Grid */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <i className="ri-search-line text-4xl text-foreground-300 mb-2 inline-block" />
              <h3 className="font-heading text-lg font-bold text-foreground-900">
                No courses match your filter criteria
              </h3>
              <p className="text-xs text-foreground-500 mt-1">
                Try selecting a different domain category or clearing your search keywords.
              </p>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
