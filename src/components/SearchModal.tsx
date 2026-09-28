'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { Course } from '@/data/courses';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  courses: Course[];
}

const POPULAR_TAGS = ['React', 'Next.js', 'Python', 'UI/UX', 'Marketing', 'TypeScript', 'Data Science'];

export default function SearchModal({ open, onClose, courses }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(timer);
    } else {
      setQuery('');
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [open, onClose]);

  const filteredCourses = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return [];
    return courses.filter(
      (c) =>
        c.title.toLowerCase().includes(cleanQuery) ||
        c.category.toLowerCase().includes(cleanQuery) ||
        c.instructor.toLowerCase().includes(cleanQuery)
    );
  }, [query, courses]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search courses"
      className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-foreground-950/60 backdrop-blur-sm transition-all duration-200 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-soft-xl border border-background-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-background-200 bg-background-50/50">
          <i className="ri-search-line text-xl text-foreground-400 shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by course name, category, or instructor..."
            className="w-full text-base bg-transparent border-none outline-none text-foreground-900 placeholder:text-foreground-400 font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-foreground-400 hover:text-foreground-700 rounded-md transition-colors"
              aria-label="Clear search"
            >
              <i className="ri-close-line text-lg" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold text-foreground-500 bg-background-200 rounded border border-background-300">
            ESC
          </kbd>
        </div>

        {/* Quick Tag Pills */}
        <div className="px-5 py-3 border-b border-background-100 bg-background-100/40 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-foreground-500 font-medium">Quick search:</span>
          {POPULAR_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-2.5 py-1 rounded-full bg-white border border-background-300 text-foreground-700 hover:border-primary-400 hover:text-primary-600 transition-colors font-medium shadow-soft-sm"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search Results Area */}
        <div className="max-h-96 overflow-y-auto p-3">
          {query.trim() === '' ? (
            <div className="py-12 text-center text-foreground-400">
              <i className="ri-book-read-line text-4xl mb-2 inline-block text-primary-300" />
              <p className="text-sm font-medium">Type something to search through 500+ courses</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="py-12 text-center text-foreground-500">
              <i className="ri-search-eye-line text-4xl mb-2 inline-block text-foreground-300" />
              <p className="text-sm font-medium">No courses found matching &quot;{query}&quot;</p>
              <p className="text-xs text-foreground-400 mt-1">Try searching for &quot;React&quot;, &quot;Next.js&quot; or &quot;Design&quot;</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-semibold uppercase text-foreground-400 px-3 py-1">
                Found {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
              </p>
              {filteredCourses.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-primary-50/70 border border-transparent hover:border-primary-100 transition-all duration-150 group"
                >
                  <div className="w-14 h-11 rounded-lg overflow-hidden bg-background-200 shrink-0 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground-900 truncate group-hover:text-primary-700">
                      {course.title}
                    </h4>
                    <p className="text-xs text-foreground-500 flex items-center gap-2 mt-0.5">
                      <span>{course.category}</span>
                      <span>•</span>
                      <span>By {course.instructor}</span>
                      <span>•</span>
                      <span className="text-accent-600 font-medium">★ {course.rating}</span>
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-foreground-900">৳{course.price.toLocaleString()}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
