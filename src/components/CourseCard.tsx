'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Course } from '@/data/courses';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const discountPercent = Math.round(
    ((course.oldPrice - course.price) / course.oldPrice) * 100
  );

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-background-200 overflow-hidden shadow-soft-sm hover:shadow-soft-lg hover:-translate-y-1.5 transition-all duration-300">
      
      {/* Thumbnail Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-background-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={course.image}
          alt={course.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Badge (Bestseller, Popular, New) */}
        {course.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase shadow-soft-sm ${
                course.badge === 'Bestseller'
                  ? 'bg-amber-400 text-amber-950'
                  : course.badge === 'New'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-primary-600 text-white'
              }`}
            >
              {course.badge}
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-foreground-700 hover:text-red-500 hover:bg-white flex items-center justify-center shadow-soft-sm transition-all duration-200"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <i
            className={`text-base ${
              isWishlisted ? 'ri-heart-fill text-red-500 scale-110' : 'ri-heart-line'
            } transition-transform duration-200`}
          />
        </button>

        {/* Category Pill Tag */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="px-2.5 py-0.5 rounded-full bg-foreground-950/70 backdrop-blur-md text-white text-[11px] font-medium">
            {course.category}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <Link href={`/courses/${course.slug}`}>
            <h3 className="font-heading text-base sm:text-lg font-bold text-foreground-950 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug">
              {course.title}
            </h3>
          </Link>

          {/* Instructor */}
          <p className="mt-1.5 text-xs text-foreground-500 font-medium">
            By <span className="text-foreground-700">{course.instructor}</span>
          </p>

          {/* Rating & Students */}
          <div className="mt-3 flex items-center justify-between text-xs text-foreground-500 pt-3 border-t border-background-100">
            <div className="flex items-center gap-1.5">
              <span className="flex items-center text-amber-500">
                <i className="ri-star-fill text-sm" />
              </span>
              <span className="font-bold text-foreground-900">{course.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <i className="ri-user-line text-xs" />
              <span>{course.students} students</span>
            </div>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-4 pt-3 border-t border-background-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-lg font-extrabold text-foreground-950">
                ৳{course.price.toLocaleString()}
              </span>
              {course.oldPrice > course.price && (
                <span className="text-xs text-foreground-400 line-through">
                  ৳{course.oldPrice.toLocaleString()}
                </span>
              )}
            </div>
            {discountPercent > 0 && (
              <span className="text-[11px] font-bold text-emerald-600">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          <Link
            href={`/courses/${course.slug}`}
            className="px-3.5 py-2 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-600 hover:text-white text-xs font-bold transition-all duration-200 shadow-soft-sm whitespace-nowrap"
          >
            View Course
          </Link>
        </div>

      </div>
    </div>
  );
}
