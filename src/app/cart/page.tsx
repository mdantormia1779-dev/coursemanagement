'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface CartItem {
  id: string;
  title: string;
  slug: string;
  instructor: string;
  price: number;
  oldPrice: number;
  thumbnail: string;
}

const INITIAL_CART: CartItem[] = [
  {
    id: '1',
    title: 'Complete Next.js Development',
    slug: 'complete-nextjs-development',
    instructor: 'John Doe',
    price: 1999,
    oldPrice: 3999,
    thumbnail: 'https://readdy.ai/api/search-image?query=Clean%20minimal%20flat%20illustration%20of%20a%20developer%20frontend%20coding%20dashboard%20interface%20with%20code%20panels%20and%20indigo%20accent%20shapes%20on%20a%20soft%20light%20background%2C%20modern%20educational%20thumbnail%20style%2C%20no%20text&width=800&height=500&seq=course-nextjs-01&orientation=landscape'
  },
  {
    id: '2',
    title: 'UI/UX Design Fundamentals',
    slug: 'ui-ux-design-fundamentals',
    instructor: 'Mina Park',
    price: 1499,
    oldPrice: 2499,
    thumbnail: 'https://readdy.ai/api/search-image?query=Elegant%20flat%20illustration%20of%20a%20designer%20wireframe%20and%20color%20swatch%20palette%20on%20a%20tablet%20with%20pastel%20coral%20and%20soft%20neutral%20tones%20on%20a%20light%20background%2C%20modern%20design%20course%20thumbnail%20style%2C%20no%20text&width=800&height=500&seq=course-uiux-03&orientation=landscape'
  }
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART);
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponMsg, setCouponMsg] = useState('');

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'LEARNX20') {
      setAppliedDiscount(20);
      setCouponMsg('Coupon LEARNX20 applied! (20% off)');
    } else {
      setAppliedDiscount(0);
      setCouponMsg('Invalid coupon code. Try LEARNX20');
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const discountAmount = Math.round((subtotal * appliedDiscount) / 100);
  const total = subtotal - discountAmount;

  return (
    <div className="min-h-screen flex flex-col bg-white text-foreground-900">
      <Navbar onOpenSearch={() => {}} />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground-950 mb-8">
            Shopping Cart ({cartItems.length})
          </h1>

          {cartItems.length === 0 ? (
            <div className="py-20 text-center bg-background-50 rounded-2xl border border-background-200">
              <i className="ri-shopping-cart-line text-4xl text-foreground-300 mb-2 inline-block" />
              <h3 className="font-heading text-lg font-bold text-foreground-900">Your cart is empty</h3>
              <p className="text-xs text-foreground-500 mt-1">Explore our courses and start learning today!</p>
              <Link
                href="/courses"
                className="mt-4 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary-600 text-white font-bold text-xs"
              >
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              
              {/* Cart Items List */}
              <div className="lg:col-span-8 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-white border border-background-200 shadow-soft-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-16 rounded-xl bg-background-900 overflow-hidden shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <Link href={`/courses/${item.slug}`} className="font-heading text-sm font-bold text-foreground-950 hover:text-primary-600">
                          {item.title}
                        </Link>
                        <p className="text-xs text-foreground-500 mt-0.5">By {item.instructor}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-background-100">
                      <div>
                        <div className="font-heading text-base font-extrabold text-foreground-950">
                          ৳{item.price.toLocaleString()}
                        </div>
                        <div className="text-xs text-foreground-400 line-through">
                          ৳{item.oldPrice.toLocaleString()}
                        </div>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary & Checkout Box */}
              <div className="lg:col-span-4 p-6 sm:p-7 rounded-2xl bg-background-50 border border-background-200 shadow-soft-md space-y-5">
                <h3 className="font-heading text-lg font-bold text-foreground-950 pb-3 border-b border-background-200">
                  Order Summary
                </h3>

                <div className="space-y-3 text-xs text-foreground-700">
                  <div className="flex justify-between">
                    <span>Original Price:</span>
                    <span className="font-semibold">৳{subtotal.toLocaleString()}</span>
                  </div>

                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Discount ({appliedDiscount}% off):</span>
                      <span>-৳{discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between pt-3 border-t border-background-200 font-heading text-base font-extrabold text-foreground-950">
                    <span>Total Amount:</span>
                    <span className="text-primary-600">৳{total.toLocaleString()} BDT</span>
                  </div>
                </div>

                {/* Coupon Code Input */}
                <form onSubmit={handleApplyCoupon} className="space-y-2 pt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Coupon Code (e.g. LEARNX20)"
                      className="flex-1 h-10 px-3.5 rounded-xl border border-background-300 text-xs uppercase outline-none focus:border-primary-500 bg-white"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-foreground-950 hover:bg-foreground-800 text-white font-bold text-xs"
                    >
                      Apply
                    </button>
                  </div>
                  {couponMsg && (
                    <p className={`text-[11px] font-semibold ${appliedDiscount > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {couponMsg}
                    </p>
                  )}
                </form>

                {/* Proceed to Checkout CTA */}
                <Link
                  href="/checkout"
                  className="w-full py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs text-center block transition-all shadow-soft-sm"
                >
                  Proceed to Secure Checkout →
                </Link>

                <p className="text-[11px] text-center text-foreground-400">
                  SSLCommerz & Stripe 256-Bit Encrypted Payments
                </p>
              </div>

            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
