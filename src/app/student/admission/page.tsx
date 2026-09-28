'use client';

import { useState, useEffect } from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { STUDENT_NAV } from '@/data/portalNavs';
import { INITIAL_BATCHES } from '@/data/leadsAndBatches';
import Link from 'next/link';
import { getPaymentRequests, ManualPaymentRequest } from '@/lib/manualPaymentService';

export default function StudentAdmissionPage() {
  const activeBatch = INITIAL_BATCHES[0];

  const [studentId, setStudentId] = useState('SID-2026-8492');
  const [totalFee] = useState(5000); // Standard live batch fee
  const [paidAmount, setPaidAmount] = useState(1000); // ৳1,000 seat booking
  const [isDuePaid, setIsDuePaid] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payChannel, setPayChannel] = useState<'bKash' | 'Nagad'>('bKash');
  const [trxId, setTrxId] = useState('');
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    const checkApprovedPayment = () => {
      const all = getPaymentRequests();
      const approved = all.find((r) => r.status === 'APPROVED' && r.plan === 'seat-booking');
      if (approved) {
        if (approved.studentId) setStudentId(approved.studentId);
        if (approved.amount) setPaidAmount(approved.amount);
      }
    };
    checkApprovedPayment();
    window.addEventListener('learnx_manual_payments_changed', checkApprovedPayment);
    window.addEventListener('learnx_course_unlocked', checkApprovedPayment);
    return () => {
      window.removeEventListener('learnx_manual_payments_changed', checkApprovedPayment);
      window.removeEventListener('learnx_course_unlocked', checkApprovedPayment);
    };
  }, []);

  const dueAmount = isDuePaid ? 0 : Math.max(0, totalFee - paidAmount);

  const handleCopyStudentId = () => {
    navigator.clipboard.writeText(studentId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handlePayDueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaidAmount(totalFee);
    setIsDuePaid(true);
    setIsPayModalOpen(false);
  };

  return (
    <PortalLayout
      role="student"
      userName="Tanvir Hossain"
      userRoleLabel="Verified Scholarship Learner"
      navItems={STUDENT_NAV}
    >
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <i className="ri-shield-check-line mr-1 text-emerald-600"></i> Seat Confirmed
              </span>
              <span className="text-xs text-foreground-500">Live Batch Onboarding</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground-900 mt-1">
              My Batch & Admission Details
            </h1>
            <p className="text-sm text-foreground-600">
              Track your confirmed seat, class schedule, due clearance, and join the secret Facebook batch group.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <i className="ri-printer-line"></i>
              Print Slip
            </button>
            <Link
              href={`/student/learning/${activeBatch.courseSlug}`}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-xl shadow-soft flex items-center gap-1.5 transition-colors"
            >
              <i className="ri-play-circle-line"></i>
              Go to Classroom
            </Link>
          </div>
        </div>

        {/* Student ID Token Card */}
        <div className="bg-gradient-to-r from-primary-900 via-primary-800 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-soft-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-primary-200 border border-white/20">
                🎓 National Tech Scholarship Winner (70% Off)
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold">{activeBatch.name}</h2>
              <p className="text-xs text-primary-200 flex items-center gap-4">
                <span>
                  <i className="ri-calendar-line mr-1 text-white"></i>
                  Starts: <strong>{activeBatch.startDate}</strong>
                </span>
                <span>
                  <i className="ri-time-line mr-1 text-white"></i>
                  {activeBatch.schedule}
                </span>
              </p>
            </div>

            {/* Official ID Display */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary-200">
                Official Student ID
              </span>
              <div className="text-2xl font-black font-mono tracking-widest text-white mt-1">
                {studentId}
              </div>
              <button
                onClick={handleCopyStudentId}
                className="mt-2 px-3 py-1 bg-white text-primary-900 text-xs font-bold rounded-lg shadow-soft flex items-center gap-1 hover:bg-primary-50 transition-colors"
              >
                <i className={copiedId ? 'ri-check-line text-emerald-600' : 'ri-file-copy-line'}></i>
                <span>{copiedId ? 'Copied ID!' : 'Copy Student ID'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Facebook Secret Batch Group & Trust Widget */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-soft-sm">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <i className="ri-facebook-circle-fill text-blue-600 text-2xl"></i>
              <h3 className="font-extrabold text-base text-blue-950">
                অফিসিয়াল সিক্রেট ফেসবুক ব্যাচ গ্রুপ (Official Batch Community)
              </h3>
            </div>
            <p className="text-xs text-blue-800 leading-relaxed">
              ক্লাসের সব গুরুত্বপূর্ণ জুম লিংক, অ্যাসাইনমেন্ট সাবমিশন ও মেন্টরদের সাথে সরাসরি আলোচনার জন্য
              অবশ্যই আপনার ব্যাচ গ্রুপে রিকোয়েস্ট পাঠান।
            </p>
            <div className="p-2.5 bg-white/90 border border-blue-200 rounded-xl text-xs text-blue-900 font-medium">
              <i className="ri-shield-user-line text-blue-600 mr-1.5"></i>
              গ্রুপ জয়েন রিকোয়েস্টে সিকিউরিটি প্রশ্নটিতে আপনার স্টুডেন্ট আইডি{' '}
              <strong className="font-mono bg-blue-100 text-blue-900 px-1.5 py-0.5 rounded">
                {studentId}
              </strong>{' '}
              উল্লেখ করুন। অন্যথায় রিকোয়েস্ট অ্যাপ্রুভ হবে না।
            </div>
          </div>

          <a
            href={activeBatch.facebookGroupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-soft flex items-center justify-center gap-2 flex-shrink-0 transition-transform hover:scale-105"
          >
            <i className="ri-user-add-line text-lg"></i>
            <span>Join Facebook Batch Group</span>
          </a>
        </div>

        {/* Payment & Due Status Card */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-soft-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-foreground-900">
                Payment Breakdown & Remaining Due
              </h3>
              <p className="text-xs text-foreground-500">
                Seat booking status and class commencement dues.
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                dueAmount === 0
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {dueAmount === 0 ? '✓ FULL PAYMENT COMPLETED' : 'SEAT BOOKED (DUE PENDING)'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-center">
              <span className="text-xs text-foreground-500 block">Total Agreed Course Fee</span>
              <span className="text-xl font-bold text-foreground-900 mt-1 block">
                ৳{totalFee.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold">(Scholarship Applied)</span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-center">
              <span className="text-xs text-emerald-700 font-semibold block">Paid So Far</span>
              <span className="text-2xl font-extrabold text-emerald-800 mt-1 block">
                ৳{paidAmount.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-600">bKash TrxID: 9XF84K12J</span>
            </div>

            <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 text-center">
              <span className="text-xs text-rose-700 font-semibold block">Remaining Due</span>
              <span className="text-2xl font-extrabold text-rose-800 mt-1 block">
                ৳{dueAmount.toLocaleString()}
              </span>
              <span className="text-[10px] text-rose-600">Due before {activeBatch.startDate}</span>
            </div>
          </div>

          {dueAmount > 0 ? (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-amber-900">
                <strong className="block font-bold text-sm mb-0.5">⚠️ বকেয়া পেমেন্ট নোটিশ:</strong>
                আপনার ক্লাসের সব মডিউল ও লাইভ ক্লাস ফুল এক্সেস পেতে ক্লাস শুরুর তারিখ{' '}
                <strong>{activeBatch.startDate}</strong> এর আগে বাকি <strong>৳{dueAmount}</strong> পরিশোধ করুন।
              </div>
              <button
                onClick={() => setIsPayModalOpen(true)}
                className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-soft flex items-center justify-center gap-1.5 flex-shrink-0 transition-transform hover:scale-105"
              >
                <i className="ri-secure-payment-line text-base"></i>
                <span>Pay Remaining Due (৳{dueAmount})</span>
              </button>
            </div>
          ) : (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-3">
              <i className="ri-checkbox-circle-fill text-emerald-600 text-xl flex-shrink-0"></i>
              <div>
                <strong>অল ক্লিয়ার! আপনার পুরো কোর্স ফি পরিশোধিত।</strong> আপনি ক্লাসের সমস্ত ভিডিও, লাইভ জুম ও
                মেন্টরশিপের সম্পূর্ণ এক্সেস পাবেন।
              </div>
            </div>
          )}
        </div>

        {/* Modal: Pay Due Amount */}
        {isPayModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-soft-xl animate-scale-up space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <h3 className="text-lg font-bold text-foreground-900">
                  Pay Remaining Due (৳{dueAmount})
                </h3>
                <button
                  onClick={() => setIsPayModalOpen(false)}
                  className="text-neutral-400 hover:text-neutral-600 text-xl leading-none"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handlePayDueSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground-700 mb-1">
                    Select Channel
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['bKash', 'Nagad'] as const).map((ch) => (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => setPayChannel(ch)}
                        className={`py-2 px-3 text-xs font-bold rounded-xl border ${
                          payChannel === ch
                            ? 'border-primary-600 bg-primary-50 text-primary-800'
                            : 'border-neutral-200 text-neutral-600'
                        }`}
                      >
                        {ch} Send Money
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs">
                  <div className="font-semibold text-foreground-800">{payChannel} Personal Number:</div>
                  <div className="font-mono text-base font-extrabold text-primary-700">01712-345678</div>
                  <div className="text-[11px] text-foreground-500 mt-1">
                    Amount: <strong>৳{dueAmount}</strong> | Reference: <strong>{studentId}</strong>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground-700 mb-1">
                    Enter Transaction ID (TrxID) *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. 9XF84K12J"
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl font-mono uppercase focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setIsPayModalOpen(false)}
                    className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-soft"
                  >
                    Confirm Due Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
