'use client';

import { useState } from 'react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="w-full bg-background-50/70 py-16 sm:py-20 border-b border-background-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center mx-auto mb-4">
          <i className="ri-mail-send-line text-2xl" />
        </div>

        <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground-950 tracking-tight">
          Get Learning Updates
        </h2>
        <p className="mt-3 text-base text-foreground-600 max-w-xl mx-auto">
          Get new course announcements, free learning guides, and special platform offers delivered straight to your inbox.
        </p>

        {submitted ? (
          <div className="mt-8 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold max-w-md mx-auto flex items-center justify-center gap-2 animate-fade-in">
            <i className="ri-checkbox-circle-fill text-emerald-600 text-lg" />
            <span>Thank you for subscribing! Check your email for a welcome gift.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              aria-label="Email address for newsletter"
              className="w-full h-12 px-4 rounded-xl border border-background-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 bg-white text-sm font-medium text-foreground-900 outline-none transition-all shadow-soft-sm"
            />
            <button
              type="submit"
              className="h-12 px-6 rounded-xl bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-bold text-sm shadow-soft-sm hover:shadow-soft-md transition-all duration-200 shrink-0 cursor-pointer"
            >
              Subscribe
            </button>
          </form>
        )}

        <p className="mt-3 text-xs text-foreground-400">
          No spam. Unsubscribe anytime with a single click.
        </p>
      </div>
    </section>
  );
}
