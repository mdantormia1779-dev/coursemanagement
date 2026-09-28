'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Enterprise LMS Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-foreground-900">
      <Navbar onOpenSearch={() => {}} />

      <main className="flex-1 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">
                Support & Inquiries
              </span>
              <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground-950">
                Get in Touch With Us
              </h1>
              <p className="text-sm text-foreground-600 leading-relaxed">
                Have questions regarding institutional enterprise licensing, custom domain onboarding, instructor faculty applications, or student billing? Our team is here to assist.
              </p>

              <div className="space-y-4 pt-4 border-t border-background-200 text-xs text-foreground-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center text-lg">
                    <i className="ri-mail-line" />
                  </div>
                  <div>
                    <div className="font-bold text-foreground-900">Direct Email Support</div>
                    <div>support@learnx.com</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
                    <i className="ri-phone-line" />
                  </div>
                  <div>
                    <div className="font-bold text-foreground-900">Phone Assistance</div>
                    <div>+880 1700-000000</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg">
                    <i className="ri-map-pin-line" />
                  </div>
                  <div>
                    <div className="font-bold text-foreground-900">Headquarters</div>
                    <div>Gulshan-2, Dhaka, Bangladesh</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="p-6 sm:p-8 rounded-2xl bg-background-50 border border-background-200 shadow-soft-sm">
                {submitted ? (
                  <div className="py-12 text-center space-y-3">
                    <i className="ri-checkbox-circle-fill text-4xl text-emerald-600 inline-block" />
                    <h3 className="font-heading text-lg font-bold text-foreground-950">Message Sent Successfully!</h3>
                    <p className="text-xs text-foreground-500 max-w-sm mx-auto">
                      Our customer support team will review your inquiry and follow up within 24 business hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-foreground-700 mb-1">Your Name *</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full h-11 px-3.5 rounded-xl border border-background-300 bg-white text-sm outline-none focus:border-primary-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-foreground-700 mb-1">Your Email Address *</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full h-11 px-3.5 rounded-xl border border-background-300 bg-white text-sm outline-none focus:border-primary-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground-700 mb-1">Inquiry Subject *</label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl border border-background-300 bg-white text-sm outline-none focus:border-primary-500"
                      >
                        <option value="Enterprise LMS Inquiry">Enterprise Multi-Tenant LMS Inquiry</option>
                        <option value="Instructor Application">Instructor Faculty Application</option>
                        <option value="Billing & Invoicing">Student Billing & Invoicing</option>
                        <option value="Certificate Verification">Certificate Verification Assistance</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground-700 mb-1">Message Details *</label>
                      <textarea
                        rows={5}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us about your organization or inquiry..."
                        className="w-full p-3.5 rounded-xl border border-background-300 bg-white text-sm outline-none focus:border-primary-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-soft-sm transition-all"
                    >
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
