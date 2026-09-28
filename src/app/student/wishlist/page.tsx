'use client';

import { useState } from 'react';
import Link from 'next/link';
import PortalLayout from '@/components/portal/PortalLayout';
import { STUDENT_NAV } from '@/data/portalNavs';

interface WishlistItem {
  id: number;
  title: string;
  slug: string;
  instructor: string;
  rating: number;
  students: string;
  price: number;
  oldPrice: number;
  image: string;
  category: string;
}

const INITIAL_WISHLIST: WishlistItem[] = [
  {
    id: 4,
    slug: 'full-stack-mern-development',
    title: 'Full Stack MERN Development',
    instructor: 'Tanvir Hossain',
    category: 'Web Development',
    rating: 4.8,
    students: '3,890',
    price: 2199,
    oldPrice: 4299,
    image: 'https://readdy.ai/api/search-image?query=Clean%20flat%20illustration%20of%20a%20full%20stack%20architecture%20diagram%20with%20database%20server%20and%20client%20layers%20in%20teal%20and%20indigo%20tones%20on%20a%20soft%20light%20background%2C%20modern%20coding%20course%20thumbnail%2C%20no%20text&width=800&height=500&seq=course-mern-04&orientation=landscape'
  },
  {
    id: 6,
    slug: 'python-for-data-science',
    title: 'Python for Data Science',
    instructor: 'David Adebayo',
    category: 'Data Science',
    rating: 4.9,
    students: '5,100',
    price: 1899,
    oldPrice: 3499,
    image: 'https://readdy.ai/api/search-image?query=Clean%20flat%20illustration%20of%20data%20visualization%20charts%20scatter%20plots%20and%20code%20notebook%20panels%20in%20teal%20and%20indigo%20accents%20on%20a%20soft%20light%20background%2C%20modern%20data%20science%20thumbnail%2C%20no%20text&width=800&height=500&seq=course-python-06&orientation=landscape'
  }
];

export default function StudentWishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>(INITIAL_WISHLIST);

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <PortalLayout
      role="student"
      userName="Sarah Khan"
      userRoleLabel="Frontend Developer"
      navItems={STUDENT_NAV}
    >
      <div className="space-y-6">
        <div>
          <h2 className="font-heading text-2xl font-extrabold text-foreground-950">
            My Wishlist ({items.length})
          </h2>
          <p className="text-sm text-foreground-500 mt-1">
            Courses saved for later review and checkout.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-background-200">
            <i className="ri-heart-line text-4xl text-foreground-300" />
            <h3 className="font-heading text-base font-bold text-foreground-900 mt-2">
              Your wishlist is empty
            </h3>
            <p className="text-xs text-foreground-500 mt-1">
              Explore our catalogue and bookmark skills you wish to learn next!
            </p>
            <Link
              href="/courses"
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-600 text-white text-xs font-bold"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-background-200 overflow-hidden shadow-soft-sm flex flex-col justify-between"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-44 aspect-video sm:aspect-auto bg-background-900 shrink-0 relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-4 flex-1">
                    <span className="text-[10px] font-bold text-primary-600 uppercase">
                      {course.category}
                    </span>
                    <h3 className="font-heading text-sm font-bold text-foreground-950 mt-0.5 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-xs text-foreground-500 mt-1">
                      By {course.instructor} • ★ {course.rating}
                    </p>

                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="font-heading text-base font-extrabold text-foreground-950">
                        ৳{course.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-foreground-400 line-through">
                        ৳{course.oldPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-background-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => removeItem(course.id)}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-800"
                  >
                    Remove
                  </button>
                  <Link
                    href="/cart"
                    className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-colors shadow-soft-sm flex items-center gap-1.5"
                  >
                    <i className="ri-shopping-cart-2-line" />
                    <span>Move to Cart</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
