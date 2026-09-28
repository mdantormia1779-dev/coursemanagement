'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  getPaymentSettings,
  submitManualPayment,
  getPaymentRequests,
  ManualPaymentRequest,
  PaymentSettings,
  DEFAULT_PAYMENT_SETTINGS,
} from '@/lib/manualPaymentService';

function CheckoutContent() {
  const searchParams = useSearchParams();

  // URL query params
  const rawPlan = searchParams.get('plan') || 'seat-booking';
  const rawAmount = searchParams.get('amount');
  const courseParam = searchParams.get('course') || 'complete-nextjs-development';

  // Determine plan details
  const isSeatBooking = rawPlan === 'seat-booking' || rawPlan.toLowerCase().includes('seat');
  const isScholarship = rawPlan === 'scholarship' || rawPlan.toLowerCase().includes('exam');

  const defaultFee = isSeatBooking ? 1000 : isScholarship ? 5000 : 1999;
  const planAmount = rawAmount && !isNaN(Number(rawAmount)) ? Number(rawAmount) : defaultFee;

  const planTitle = isSeatBooking
    ? 'Seat Booking Deposit (Batch 24)'
    : isScholarship
    ? 'Scholarship Exam Pass Admission'
    : 'Complete Next.js Development (Full Course)';

  // Settings from admin panel
  const [settings, setSettings] = useState<PaymentSettings>(DEFAULT_PAYMENT_SETTINGS);

  // Tab: 'MANUAL' | 'GATEWAY'
  const [paymentTab, setPaymentTab] = useState<'MANUAL' | 'GATEWAY'>('MANUAL');

  // Manual payment provider: 'BKASH' | 'NAGAD' | 'ROCKET'
  const [selectedMethod, setSelectedMethod] = useState<'bKash' | 'Nagad' | 'Rocket'>('bKash');

  // Form inputs
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [reference, setReference] = useState('');
  const [studentNote, setStudentNote] = useState('');

  // UI state
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<ManualPaymentRequest | null>(null);
  const [gatewayProcessing, setGatewayProcessing] = useState(false);
  const [gatewayCompleted, setGatewayCompleted] = useState(false);

  // Load payment settings and check for existing pending/approved requests
  useEffect(() => {
    const s = getPaymentSettings();
    setSettings(s);

    const onSettingsChange = (e: any) => {
      if (e.detail) setSettings(e.detail);
    };
    window.addEventListener('learnx_manual_payment_settings_changed', onSettingsChange);

    // Check if user already submitted a request recently
    const requests = getPaymentRequests();
    const existing = requests.find(
      (r) => r.plan === rawPlan || r.courseSlug === courseParam
    );
    if (existing && existing.status === 'PENDING') {
      setSubmittedRequest(existing);
    }

    // Listen for live approval from admin
    const onPaymentsChanged = (e: any) => {
      const all: ManualPaymentRequest[] = e.detail || getPaymentRequests();
      if (submittedRequest) {
        const found = all.find((r) => r.id === submittedRequest.id);
        if (found) setSubmittedRequest(found);
      }
    };

    const onCourseUnlocked = (e: any) => {
      if (submittedRequest && e.detail?.courseSlug === submittedRequest.courseSlug) {
        setSubmittedRequest((prev) => (prev ? { ...prev, status: 'APPROVED' } : null));
      }
    };

    window.addEventListener('learnx_manual_payments_changed', onPaymentsChanged);
    window.addEventListener('learnx_course_unlocked', onCourseUnlocked);

    return () => {
      window.removeEventListener('learnx_manual_payment_settings_changed', onSettingsChange);
      window.removeEventListener('learnx_manual_payments_changed', onPaymentsChanged);
      window.removeEventListener('learnx_course_unlocked', onCourseUnlocked);
    };
  }, [rawPlan, courseParam, submittedRequest?.id]);

  // Current payment number according to selected provider
  const currentReceiverNumber =
    selectedMethod === 'bKash'
      ? settings.bkashNumber || '01318964063'
      : selectedMethod === 'Nagad'
      ? settings.nagadNumber || '01318964063'
      : settings.rocketNumber || '01318964063';

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(currentReceiverNumber);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !studentPhone || !senderNumber || !trxId) {
      alert('দয়া করে আপনার নাম, মোবাইল নম্বর, প্রেরক নম্বর ও TrxID পূরণ করুন।');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const req = submitManualPayment({
        studentName,
        email: studentEmail || `${studentPhone}@student.learnx.com`,
        phone: studentPhone,
        whatsapp: studentPhone,
        plan: rawPlan,
        planTitle,
        courseTitle: 'Complete Next.js Development',
        courseSlug: 'complete-nextjs-development',
        amount: planAmount,
        paymentMethod: selectedMethod,
        accountType: settings.accountType || 'Personal (Send Money)',
        receiverNumber: currentReceiverNumber,
        senderNumber,
        trxId: trxId.trim().toUpperCase(),
        reference: reference || 'Batch 24 Seat',
        studentNote,
      });

      setSubmitting(false);
      setSubmittedRequest(req);
    }, 600);
  };

  const handleGatewayPay = (e: React.FormEvent) => {
    e.preventDefault();
    setGatewayProcessing(true);
    setTimeout(() => {
      setGatewayProcessing(false);
      setGatewayCompleted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-50/50 text-foreground-900">
      <Navbar onOpenSearch={() => {}} />

      <main className="flex-1 py-10 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

          {/* Page Heading */}
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-100 text-primary-800 border border-primary-200">
                {isSeatBooking ? '৳1,000 Seat Booking' : 'Admission Checkout'}
              </span>
              <span className="text-xs text-foreground-500">Fast & Verified Enrollment</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground-950">
              {isSeatBooking ? 'Reserve Your Batch Seat' : 'Secure Course Checkout'}
            </h1>
            <p className="text-sm text-foreground-600 mt-1">
              {isSeatBooking
                ? 'পরবর্তী লাইভ ব্যাচে আপনার সিট নিশ্চিত করতে ৳১,০০০ টাকা বুকিং ডিপোজিট প্রদান করুন।'
                : 'Complete payment to activate instant access to your course and live classes.'}
            </p>
          </div>

          {/* If manual payment is approved */}
          {submittedRequest && submittedRequest.status === 'APPROVED' ? (
            <div className="p-8 sm:p-12 rounded-3xl bg-white border border-emerald-200 shadow-soft-xl text-center space-y-6 animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-4xl shadow-soft">
                <i className="ri-checkbox-circle-fill" />
              </div>
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  🎉 পেমেন্ট অনুমোদিত (Payment Approved)
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground-950">
                  অভিনন্দন {submittedRequest.studentName}! আপনার ভর্তি নিশ্চিত হয়েছে।
                </h2>
                <p className="text-sm text-foreground-600 max-w-lg mx-auto leading-relaxed">
                  এডমিন আপনার TrxID <strong className="text-foreground-950 font-mono">({submittedRequest.trxId})</strong> ভেরিফাই করে অনুমোদন দিয়েছেন। আপনার স্টুডেন্ট আইডি: <strong className="text-primary-700 font-mono">{submittedRequest.studentId || 'SID-2026-8492'}</strong>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 max-w-md mx-auto text-left text-xs space-y-1.5 text-emerald-900">
                <div className="flex justify-between">
                  <span className="text-emerald-700">কোর্সের নাম:</span>
                  <span className="font-bold">{submittedRequest.courseTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700">পরিশোধিত ফি:</span>
                  <span className="font-bold">৳{submittedRequest.amount.toLocaleString()} BDT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700">অর্ডার নম্বর:</span>
                  <span className="font-mono font-bold">{submittedRequest.orderNumber}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
                <Link
                  href={`/student/learning/${submittedRequest.courseSlug}`}
                  className="px-6 py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-soft-md flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5"
                >
                  <i className="ri-play-circle-line text-lg" />
                  <span>Start Learning Now (কোর্স শুরু করুন) →</span>
                </Link>
                <Link
                  href="/student/dashboard"
                  className="px-6 py-3.5 rounded-xl border border-background-300 text-foreground-800 font-bold text-sm hover:bg-background-50 flex items-center justify-center gap-2"
                >
                  <i className="ri-dashboard-line" />
                  <span>Student Dashboard</span>
                </Link>
              </div>
            </div>
          ) : submittedRequest && submittedRequest.status === 'PENDING' ? (
            /* Pending Admin Verification Screen */
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-amber-200 shadow-soft-xl space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-background-100">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl flex-shrink-0 animate-pulse">
                    <i className="ri-time-line" />
                  </div>
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      ⏳ ভেরিফিকেশন অপেক্ষমান (Pending Admin Approval)
                    </span>
                    <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-foreground-950 mt-1">
                      পেমেন্ট রিকোয়েস্ট সফলভাবে জমা হয়েছে
                    </h2>
                    <p className="text-xs text-foreground-500 mt-0.5">
                      Order No: <strong className="font-mono text-foreground-900">{submittedRequest.orderNumber}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                  </span>
                  <span className="text-xs font-semibold text-amber-800">এডমিন রিভিউ চলছে...</span>
                </div>
              </div>

              {/* Submitted Details Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-background-50 border border-background-200 text-xs">
                <div>
                  <span className="text-foreground-500 block">শিক্ষার্থীর নাম:</span>
                  <strong className="text-foreground-900 text-sm font-heading">{submittedRequest.studentName}</strong>
                </div>
                <div>
                  <span className="text-foreground-500 block">পেমেন্ট মেথড:</span>
                  <strong className="text-foreground-900 text-sm font-heading">{submittedRequest.paymentMethod}</strong>
                </div>
                <div>
                  <span className="text-foreground-500 block">প্রেরক নাম্বার:</span>
                  <strong className="text-foreground-900 text-sm font-mono">{submittedRequest.senderNumber}</strong>
                </div>
                <div>
                  <span className="text-foreground-500 block">Transaction ID (TrxID):</span>
                  <strong className="text-primary-700 text-sm font-mono tracking-wider">{submittedRequest.trxId}</strong>
                </div>
              </div>

              {/* Explanatory Message */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 space-y-2">
                <div className="flex items-start gap-2.5">
                  <i className="ri-information-line text-lg text-blue-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold">কীভাবে অনুমোদন সম্পন্ন হবে?</p>
                    <p className="text-blue-800 leading-relaxed">
                      ১. আমাদের এডমিন টিম আপনার দেওয়া TrxID <strong>({submittedRequest.trxId})</strong> bKash/Nagad স্টেটমেন্টের সাথে যাচাই করবেন।<br />
                      ২. এডমিন ড্যাশবোর্ড থেকে Approve করলেই আপনার কোর্স এক্সেস আনলক হয়ে যাবে এবং এই পেজ স্বয়ংক্রিয়ভাবে এক্টিভ হয়ে যাবে।<br />
                      ৩. জরুরি যেকোনো প্রয়োজনে আমাদের অফিসিয়াল হোয়াটসঅ্যাপ <strong>{settings.whatsappSupportNumber || '01318964063'}</strong> নম্বরে যোগাযোগ করুন।
                    </p>
                  </div>
                </div>
              </div>

              {/* Live Status Controls */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                <a
                  href={`https://wa.me/88${(settings.whatsappSupportNumber || '01318964063').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `হ্যালো এডমিন! আমি ${submittedRequest.amount} টাকা পাঠিয়েছি। নাম: ${submittedRequest.studentName}, TrxID: ${submittedRequest.trxId}, অর্ডার: ${submittedRequest.orderNumber}। দয়া করে আমার কোর্সটি অনুমোদন করে দিন।`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-soft-sm transition-colors"
                >
                  <i className="ri-whatsapp-line text-base" />
                  <span>WhatsApp এ এডমিনকে জানান</span>
                </a>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const all = getPaymentRequests();
                      const current = all.find((r) => r.id === submittedRequest.id);
                      if (current) setSubmittedRequest(current);
                    }}
                    className="px-4 py-2.5 rounded-xl border border-background-300 hover:bg-background-100 text-foreground-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <i className="ri-refresh-line" />
                    <span>Check Status</span>
                  </button>
                  <Link
                    href="/student/orders"
                    className="px-4 py-2.5 rounded-xl border border-background-300 hover:bg-background-100 text-foreground-700 text-xs font-bold transition-colors"
                  >
                    View in Order History
                  </Link>
                </div>
              </div>
            </div>
          ) : gatewayCompleted ? (
            /* Gateway Completed Screen */
            <div className="p-8 sm:p-12 rounded-3xl bg-white border border-background-200 shadow-soft-xl text-center space-y-5 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl">
                <i className="ri-checkbox-circle-fill" />
              </div>
              <h2 className="font-heading text-2xl font-extrabold text-foreground-950">
                Payment Verified & Course Enrolled!
              </h2>
              <p className="text-sm text-foreground-600 max-w-md mx-auto leading-relaxed">
                Order <strong className="text-foreground-900">ORD-2026-98124</strong> has been confirmed. Your access to <strong className="text-foreground-900">{planTitle}</strong> is active.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                <Link
                  href="/student/learning/complete-nextjs-development"
                  className="px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-soft-md"
                >
                  Start Learning Now →
                </Link>
                <Link
                  href="/student/dashboard"
                  className="px-6 py-3 rounded-xl border border-background-300 text-foreground-800 font-bold text-xs hover:bg-background-50"
                >
                  Go to Student Dashboard
                </Link>
              </div>
            </div>
          ) : (
            /* Active Checkout Form */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Payment Method & Submission Column */}
              <div className="lg:col-span-7 space-y-6">

                {/* Mode Selector: Manual vs Gateway */}
                <div className="bg-white p-2 rounded-2xl border border-background-200 shadow-soft-xs flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentTab('MANUAL')}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      paymentTab === 'MANUAL'
                        ? 'bg-primary-600 text-white shadow-soft-sm'
                        : 'text-foreground-600 hover:text-foreground-900 hover:bg-background-50'
                    }`}
                  >
                    <i className="ri-hand-coin-line text-base" />
                    <span>ম্যানুয়াল পেমেন্ট (bKash/Nagad/Rocket)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400 text-amber-950 font-extrabold uppercase">
                      Direct
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentTab('GATEWAY')}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      paymentTab === 'GATEWAY'
                        ? 'bg-primary-600 text-white shadow-soft-sm'
                        : 'text-foreground-600 hover:text-foreground-900 hover:bg-background-50'
                    }`}
                  >
                    <i className="ri-bank-card-line text-base" />
                    <span>কার্ড / অনলাইন গেটওয়ে</span>
                  </button>
                </div>

                {/* MANUAL PAYMENT FLOW */}
                {paymentTab === 'MANUAL' && (
                  <div className="space-y-6">

                    {/* Step 1: Provider selection & instructions */}
                    <div className="p-6 rounded-2xl bg-white border border-background-200 shadow-soft-sm space-y-5">
                      <div className="flex items-center justify-between border-b border-background-100 pb-3">
                        <h3 className="font-heading text-sm font-bold text-foreground-950 flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-primary-600 text-white text-[11px] flex items-center justify-center font-bold">1</span>
                          পেমেন্ট মাধ্যম বেছে নিন ও টাকা পাঠান
                        </h3>
                        <span className="text-xs text-foreground-500 font-semibold">
                          পরিমাণ: <strong className="text-primary-600 font-heading">৳{planAmount.toLocaleString()} BDT</strong>
                        </span>
                      </div>

                      {/* Provider Buttons */}
                      <div className="grid grid-cols-3 gap-3">
                        {/* bKash */}
                        <button
                          type="button"
                          onClick={() => setSelectedMethod('bKash')}
                          className={`p-3.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                            selectedMethod === 'bKash'
                              ? 'border-pink-500 bg-pink-50/70 ring-2 ring-pink-500/20 text-pink-700 font-extrabold shadow-soft-xs'
                              : 'border-background-200 hover:border-background-300 bg-white text-foreground-700 font-medium'
                          }`}
                        >
                          <span className="text-base font-extrabold text-pink-600">bKash</span>
                          <span className="text-[10px] text-pink-600/80 font-medium">Send Money</span>
                        </button>

                        {/* Nagad */}
                        <button
                          type="button"
                          onClick={() => setSelectedMethod('Nagad')}
                          className={`p-3.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                            selectedMethod === 'Nagad'
                              ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/20 text-amber-800 font-extrabold shadow-soft-xs'
                              : 'border-background-200 hover:border-background-300 bg-white text-foreground-700 font-medium'
                          }`}
                        >
                          <span className="text-base font-extrabold text-amber-600">Nagad</span>
                          <span className="text-[10px] text-amber-700/80 font-medium">Send Money</span>
                        </button>

                        {/* Rocket */}
                        <button
                          type="button"
                          onClick={() => setSelectedMethod('Rocket')}
                          className={`p-3.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                            selectedMethod === 'Rocket'
                              ? 'border-purple-500 bg-purple-50/70 ring-2 ring-purple-500/20 text-purple-800 font-extrabold shadow-soft-xs'
                              : 'border-background-200 hover:border-background-300 bg-white text-foreground-700 font-medium'
                          }`}
                        >
                          <span className="text-base font-extrabold text-purple-600">Rocket</span>
                          <span className="text-[10px] text-purple-700/80 font-medium">Send Money</span>
                        </button>
                      </div>

                      {/* Number Card */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-soft space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-300 flex items-center gap-1.5">
                            <i className="ri-smartphone-line text-emerald-400" />
                            অফিশিয়াল {selectedMethod} একাউন্ট নম্বর:
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white">
                            {settings.accountType || 'Personal (Send Money)'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between bg-white/10 p-3 rounded-xl border border-white/10">
                          <span className="text-xl sm:text-2xl font-mono font-extrabold tracking-wider text-emerald-300">
                            {currentReceiverNumber}
                          </span>
                          <button
                            type="button"
                            onClick={handleCopyNumber}
                            className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold flex items-center gap-1 transition-all"
                          >
                            <i className={copiedNumber ? 'ri-check-line text-emerald-600' : 'ri-file-copy-line'} />
                            <span>{copiedNumber ? 'কপি হয়েছে!' : 'কপি করুন'}</span>
                          </button>
                        </div>

                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          ⚠️ দয়া করে আপনার {selectedMethod} অ্যাপ থেকে <strong>Send Money</strong> করে ঠিক <strong>৳{planAmount.toLocaleString()}</strong> টাকা পাঠান। টাকা পাঠানোর পর ট্রানজেকশন আইডি (TrxID) নিচে দিন।
                        </p>
                      </div>
                    </div>

                    {/* Step 2: Submission Form */}
                    <form onSubmit={handleManualSubmit} className="p-6 sm:p-8 rounded-2xl bg-white border border-background-200 shadow-soft-sm space-y-5">
                      <div className="border-b border-background-100 pb-3">
                        <h3 className="font-heading text-sm font-bold text-foreground-950 flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-primary-600 text-white text-[11px] flex items-center justify-center font-bold">2</span>
                          পেমেন্ট তথ্য প্রদান করুন (এডমিন ভেরিফিকেশনের জন্য)
                        </h3>
                        <p className="text-[11px] text-foreground-500 mt-0.5">
                          সঠিক TrxID ও নম্বর দিলে এডমিন তা চেক করে সাথে সাথে কোর্স এক্সেস অ্যাপ্রুভ করবেন।
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-foreground-700 mb-1">
                            আপনার পুরো নাম (Full Name) *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Mahfuzur Rahman"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm outline-none focus:border-primary-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-foreground-700 mb-1">
                            আপনার মোবাইল / WhatsApp নম্বর *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="017XXXXXXXX"
                            value={studentPhone}
                            onChange={(e) => setStudentPhone(e.target.value)}
                            className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm outline-none focus:border-primary-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-foreground-700 mb-1">
                            যে নম্বর থেকে টাকা পাঠিয়েছেন (Sender Number) *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="01XXXXXXXXX"
                            value={senderNumber}
                            onChange={(e) => setSenderNumber(e.target.value)}
                            className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm font-mono outline-none focus:border-primary-500"
                          />
                          <span className="text-[10px] text-foreground-400 mt-1 block">
                            আপনার bKash বা Nagad একাউন্ট নম্বরটি দিন
                          </span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-foreground-700 mb-1">
                            Transaction ID (TrxID) *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 9X8A1239 বা BL49X01"
                            value={trxId}
                            onChange={(e) => setTrxId(e.target.value)}
                            className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm font-mono uppercase tracking-wider outline-none focus:border-primary-500 font-bold text-primary-700"
                          />
                          <span className="text-[10px] text-foreground-400 mt-1 block">
                            লেনদেনের মেসেজ বা অ্যাপ থেকে TrxID কপি করে দিন
                          </span>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-foreground-700 mb-1">
                            ইমেইল এড্রেস (Account Login & Invoicing)
                          </label>
                          <input
                            type="email"
                            placeholder="student@example.com"
                            value={studentEmail}
                            onChange={(e) => setStudentEmail(e.target.value)}
                            className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm outline-none focus:border-primary-500"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-foreground-700 mb-1">
                            অতিরিক্ত নোট বা রেফারেন্স (ঐচ্ছিক)
                          </label>
                          <input
                            type="text"
                            placeholder="যেমন: ব্যাচ ২৪ সিট বুকিং"
                            value={studentNote}
                            onChange={(e) => setStudentNote(e.target.value)}
                            className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm outline-none focus:border-primary-500"
                          />
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                        <i className="ri-shield-user-line text-lg text-amber-600 shrink-0 mt-0.5" />
                        <span>
                          <strong>অটোমেটিক এডমিন নোটিফিকেশন:</strong> সাবমিট করার সাথে সাথেই এডমিন প্যানেলে আপনার পেমেন্ট ভেরিফিকেশন রিকোয়েস্ট চলে যাবে। এডমিন ট্রানজেকশন যাচাই করে অ্যাপ্রুভ করলেই আপনার কোর্স শুরু করতে পারবেন।
                        </span>
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full h-12 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-bold text-sm shadow-soft-md transition-all flex items-center justify-center gap-2"
                      >
                        {submitting ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>জমা দেওয়া হচ্ছে...</span>
                          </>
                        ) : (
                          <>
                            <i className="ri-send-plane-fill" />
                            <span>পেমেন্ট সাবমিট করুন (Submit for Approval)</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}

                {/* AUTOMATED GATEWAY FLOW */}
                {paymentTab === 'GATEWAY' && (
                  <form onSubmit={handleGatewayPay} className="p-6 sm:p-8 rounded-2xl bg-white border border-background-200 shadow-soft-sm space-y-6">
                    <h3 className="font-heading text-base font-bold text-foreground-950 pb-3 border-b border-background-100">
                      Choose Instant Gateway
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 rounded-xl border border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20 text-left">
                        <div className="font-heading font-extrabold text-sm text-blue-600">SSLCommerz</div>
                        <span className="text-[11px] text-foreground-500 mt-2 block">Visa, Mastercard, Internet Banking</span>
                      </div>
                      <div className="p-4 rounded-xl border border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-500/20 text-left">
                        <div className="font-heading font-extrabold text-sm text-indigo-600">Stripe Global</div>
                        <span className="text-[11px] text-foreground-500 mt-2 block">International Cards & Apple Pay</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-primary-50/60 border border-primary-100 text-xs text-primary-950 flex items-start gap-2.5">
                      <i className="ri-shield-check-line text-lg text-primary-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Instant Automated Enrollment:</strong> Payments via credit/debit card are processed in real-time with instant webhook activation.
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={gatewayProcessing}
                      className="w-full h-12 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-bold text-sm shadow-soft-md transition-all flex items-center justify-center gap-2"
                    >
                      {gatewayProcessing ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Processing Gateway...</span>
                        </>
                      ) : (
                        <span>Pay ৳{planAmount.toLocaleString()} BDT & Enroll Instantly</span>
                      )}
                    </button>
                  </form>
                )}

              </div>

              {/* Order Summary Column */}
              <div className="lg:col-span-5 space-y-5">
                <div className="p-6 rounded-2xl bg-white border border-background-200 shadow-soft-sm space-y-4">
                  <h3 className="font-heading text-base font-bold text-foreground-950 pb-3 border-b border-background-100 flex items-center justify-between">
                    <span>Order Summary</span>
                    <span className="text-xs font-normal text-foreground-500 font-mono">
                      {isSeatBooking ? 'SEAT-BOOK' : 'DIRECT-ENROLL'}
                    </span>
                  </h3>

                  <div className="flex items-center gap-3.5">
                    <div className="w-16 h-14 rounded-xl bg-background-900 overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://readdy.ai/api/search-image?query=Clean%20minimal%20flat%20illustration%20of%20a%20developer%20frontend%20coding%20dashboard%20interface%20with%20code%20panels%20and%20indigo%20accent%20shapes%20on%20a%20soft%20light%20background%2C%20modern%20educational%20thumbnail%20style%2C%20no%20text&width=800&height=500&seq=course-nextjs-01&orientation=landscape"
                        alt="Next.js"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground-950 leading-tight">
                        Complete Next.js Development
                      </h4>
                      <p className="text-[11px] text-primary-600 font-semibold mt-0.5">
                        {planTitle}
                      </p>
                      <p className="text-[10px] text-foreground-400">Instructor: John Doe & Mentors</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-background-100 space-y-2 text-xs text-foreground-600">
                    <div className="flex justify-between">
                      <span>Regular Course Fee:</span>
                      <span className="line-through text-foreground-400">৳3,999 BDT</span>
                    </div>

                    {isSeatBooking ? (
                      <>
                        <div className="flex justify-between text-emerald-600 font-semibold">
                          <span>Deposit Option:</span>
                          <span>Seat Booking Only</span>
                        </div>
                        <div className="flex justify-between text-xs text-foreground-500">
                          <span>Remaining Balance (Due):</span>
                          <span>৳2,999 BDT (Pay before batch)</span>
                        </div>
                      </>
                    ) : isScholarship ? (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>Scholarship Discount:</span>
                        <span>-৳3,000 BDT</span>
                      </div>
                    ) : (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>Special Discount:</span>
                        <span>-৳2,000 BDT</span>
                      </div>
                    )}

                    <div className="flex justify-between pt-3 border-t border-background-200 font-heading text-base font-extrabold text-foreground-950">
                      <span>Total Amount Payable:</span>
                      <span className="text-primary-600 text-lg">৳{planAmount.toLocaleString()} BDT</span>
                    </div>
                  </div>
                </div>

                {/* Admission Support Box */}
                <div className="p-5 rounded-2xl bg-primary-50/70 border border-primary-200 space-y-2.5 text-xs text-primary-950">
                  <div className="font-bold flex items-center gap-2">
                    <i className="ri-customer-service-2-line text-primary-700 text-base" />
                    <span>ভর্তি সহায়তা ও সরাসরি যোগাযোগ</span>
                  </div>
                  <p className="text-primary-900 leading-relaxed text-[11px]">
                    পেমেন্ট করতে কোনো সমস্যা হলে বা ট্রানজেকশন সংক্রান্ত সাহায্যের জন্য আমাদের অফিসিয়াল নম্বরে কল বা হোয়াটসঅ্যাপ মেসেজ করুন:
                  </p>
                  <a
                    href={`tel:${settings.bkashNumber || '01318964063'}`}
                    className="inline-flex items-center gap-2 font-mono font-bold text-primary-700 bg-white px-3 py-1.5 rounded-lg border border-primary-300 text-xs shadow-soft-xs"
                  >
                    <i className="ri-phone-fill text-emerald-600" />
                    <span>{settings.bkashNumber || '01318964063'}</span>
                  </a>
                </div>

              </div>

            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background-50/50">
          <div className="text-center space-y-3">
            <span className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin inline-block" />
            <p className="text-xs font-bold text-foreground-600">Loading Checkout...</p>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
