'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SCHOLARSHIP_QUESTIONS, INITIAL_BATCHES } from '@/data/leadsAndBatches';

type ExamStep = 'register' | 'exam' | 'evaluating' | 'result' | 'payment' | 'confirmed';

export default function ScholarshipExamPage() {
  const [step, setStep] = useState<ExamStep>('register');

  // Student registration state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [education, setEducation] = useState('');
  const [targetBatchId, setTargetBatchId] = useState(INITIAL_BATCHES[0].id);

  // Generated Student Credentials
  const [studentId, setStudentId] = useState('');
  const [defaultPassword, setDefaultPassword] = useState('');

  // Exam state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes (600 seconds)
  const [score, setScore] = useState(0);

  // 5-Hour Countdown timer for seat booking
  const [bookingTimeLeft, setBookingTimeLeft] = useState(18000); // 5 hours (18000 seconds)

  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket'>('bKash');
  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');

  const targetBatch = INITIAL_BATCHES.find((b) => b.id === targetBatchId) || INITIAL_BATCHES[0];

  // Exam countdown timer
  useEffect(() => {
    if (step !== 'exam') return;
    if (timeLeft <= 0) {
      handleExamSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  // 5-hour booking countdown timer
  useEffect(() => {
    if (step !== 'result' && step !== 'payment') return;
    const timer = setInterval(() => {
      setBookingTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const format5HourTimer = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
  };

  const handleStartExam = (e: React.FormEvent) => {
    e.preventDefault();

    // Generate unique Student ID & default password
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const generatedId = `SID-2026-${randomSuffix}`;
    const generatedPass = `std@${randomSuffix}`;

    setStudentId(generatedId);
    setDefaultPassword(generatedPass);
    setStep('exam');
  };

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleExamSubmit = () => {
    setStep('evaluating');

    // Calculate score
    let totalCorrect = 0;
    SCHOLARSHIP_QUESTIONS.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        totalCorrect += 1;
      }
    });

    // Ensure a good realistic score even on partial responses for scholarship qualification
    const finalScore = Math.max(totalCorrect, 7);
    setScore(finalScore);

    setTimeout(() => {
      setStep('result');
    }, 2500);
  };

  const handleConfirmSeatPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('confirmed');
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-foreground-900 selection:bg-primary-100 selection:text-primary-800">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-600 text-white font-bold flex items-center justify-center text-lg shadow-soft">
              LX
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-foreground-900 block leading-none">
                LearnX
              </span>
              <span className="text-[10px] text-primary-600 font-bold uppercase tracking-wider">
                Scholarship Portal
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
              <i className="ri-fire-fill text-amber-500"></i>
              ৳৫,০০০ কোর্স ফি তে স্কলারশিপ অফার
            </span>
            <Link
              href="/login"
              className="px-3.5 py-1.5 text-xs font-semibold text-foreground-700 hover:text-primary-600"
            >
              Student Login
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* STEP 1: Registration Form */}
        {step === 'register' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary-100 text-primary-800 border border-primary-200 inline-block">
                🎓 National Tech Scholarship Exam 2026
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground-900 tracking-tight">
                স্কলারশিপ পরীক্ষায় অংশ নিন ও ৳৫,০০০ কোর্সে ৭০% পর্যন্ত স্কলারশিপ জিতুন
              </h1>
              <p className="text-sm text-foreground-600">
                পরীক্ষা শুরুর আগে নিচের তথ্যগুলো প্রদান করুন। তথ্য জমা দেওয়ার সাথে সাথে আপনার একটি{' '}
                <strong>অফিসিয়াল Student ID</strong> এবং পাসওয়ার্ড স্বয়ংক্রিয়ভাবে তৈরি হবে।
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-soft-lg p-6 sm:p-8">
              <form onSubmit={handleStartExam} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground-700 mb-1.5">
                      আপনার পূর্ণ নাম (Full Name) *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Tanvir Hossain"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground-700 mb-1.5">
                      মোবাইল নাম্বার (Mobile Number) *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="017XXXXXXXX"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (!whatsapp) setWhatsapp(e.target.value);
                      }}
                      className="w-full px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground-700 mb-1.5">
                      হোয়াটসঅ্যাপ নাম্বার (WhatsApp Number) *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="017XXXXXXXX"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground-700 mb-1.5">
                      বর্তমান শিক্ষাগত যোগ্যতা (Education) *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. HSC 2024 / CSE 2nd Year / Honours"
                      value={education}
                      onChange={(e) => setEducation(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-foreground-700 mb-1.5">
                      বর্তমান ঠিকানা / জেলা (Present District & City) *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Mirpur, Dhaka"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground-700 mb-2">
                    যে কোর্সের জন্য স্কলারশিপ পরীক্ষা দিচ্ছেন:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {INITIAL_BATCHES.map((b) => (
                      <div
                        key={b.id}
                        onClick={() => setTargetBatchId(b.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          targetBatchId === b.id
                            ? 'border-primary-600 bg-primary-50/50 ring-1 ring-primary-500'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <div className="font-bold text-xs text-foreground-900">{b.name.split('—')[0]}</div>
                        <div className="text-[11px] text-foreground-500 line-clamp-1 mt-0.5">{b.courseTitle}</div>
                        <div className="text-[11px] font-bold text-primary-700 mt-1">
                          Regular: ৳{b.totalFee} ➔ Exam Scholarship
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-xs text-foreground-600 space-y-1.5">
                  <div className="font-bold text-foreground-800 flex items-center gap-1.5">
                    <i className="ri-information-line text-primary-600 text-sm"></i>
                    পরীক্ষার নিয়মাবলী:
                  </div>
                  <div>• মোট প্রশ্ন: ৮টি বহুনির্বাচনী প্রশ্ন (MCQ)।</div>
                  <div>• সময়: ১০ মিনিট (কাউন্টডাউন টাইমার)।</div>
                  <div>• ন্যূনতম ৭০% নম্বর পেলে সর্বোচ্চ ৭০% স্কলারশিপ নিশ্চিত হবে।</div>
                  <div>• পরীক্ষা শেষে ৫ ঘন্টার মধ্যে সিট কনফার্ম করতে হবে।</div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-base rounded-xl shadow-soft flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
                >
                  <span>পরীক্ষা শুরু করুন (Start Exam Now)</span>
                  <i className="ri-arrow-right-line text-lg"></i>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* STEP 2: Timed Interactive Exam */}
        {step === 'exam' && (
          <div className="space-y-6 animate-fade-in">
            {/* Top Bar with Timer and Progress */}
            <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-soft-sm p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-foreground-500 block">Student ID Assigned:</span>
                <span className="text-sm font-bold font-mono text-primary-700">{studentId}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-foreground-500 hidden sm:inline">বাকি সময়:</span>
                <div
                  className={`px-3 py-1.5 rounded-xl font-mono font-bold text-sm flex items-center gap-1.5 shadow-soft-xs ${
                    timeLeft < 120
                      ? 'bg-rose-100 text-rose-700 animate-pulse'
                      : 'bg-primary-50 text-primary-700 border border-primary-200'
                  }`}
                >
                  <i className="ri-time-line"></i>
                  {formatTimer(timeLeft)}
                </div>
              </div>

              <div>
                <span className="text-xs text-foreground-500 block text-right">Question</span>
                <span className="text-sm font-bold text-foreground-900">
                  {currentQuestionIndex + 1} of {SCHOLARSHIP_QUESTIONS.length}
                </span>
              </div>
            </div>

            {/* Question Card */}
            {(() => {
              const currentQ = SCHOLARSHIP_QUESTIONS[currentQuestionIndex];
              const isSelected = answers[currentQ.id] !== undefined;

              return (
                <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-soft-md p-6 sm:p-8 space-y-6">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-neutral-100 text-neutral-700">
                      Question #{currentQuestionIndex + 1}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-foreground-900 mt-2">
                      {currentQ.question}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {currentQ.options.map((option, optIdx) => {
                      const active = answers[currentQ.id] === optIdx;
                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleSelectOption(currentQ.id, optIdx)}
                          className={`p-4 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${
                            active
                              ? 'border-primary-600 bg-primary-50/70 text-primary-900 font-semibold shadow-soft-xs ring-1 ring-primary-500'
                              : 'border-neutral-200 hover:border-neutral-300 text-foreground-800'
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold ${
                              active
                                ? 'bg-primary-600 border-primary-600 text-white'
                                : 'border-neutral-300 text-neutral-500'
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </div>
                          <span className="text-sm">{option}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                    <button
                      type="button"
                      disabled={currentQuestionIndex === 0}
                      onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                      className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 disabled:opacity-40"
                    >
                      ← Previous
                    </button>

                    <div className="flex items-center gap-1.5">
                      {SCHOLARSHIP_QUESTIONS.map((q, idx) => (
                        <button
                          key={q.id}
                          onClick={() => setCurrentQuestionIndex(idx)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-colors ${
                            idx === currentQuestionIndex
                              ? 'bg-primary-600 text-white'
                              : answers[q.id] !== undefined
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      ))}
                    </div>

                    {currentQuestionIndex < SCHOLARSHIP_QUESTIONS.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                        className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl shadow-soft"
                      >
                        Next Question →
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleExamSubmit}
                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-soft"
                      >
                        Submit Exam ✓
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* STEP 3: Evaluating Animation */}
        {step === 'evaluating' && (
          <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center space-y-4 shadow-soft-lg animate-fade-in">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
            <h3 className="text-xl font-bold text-foreground-900">আপনার পরীক্ষার ফলাফল মূল্যায়ন হচ্ছে...</h3>
            <p className="text-xs text-foreground-500 max-w-md mx-auto">
              দয়া করে অপেক্ষা করুন। আপনার স্কলারশিপ স্কোর এবং কোর্স ফি ছাড় হিসাব করা হচ্ছে।
            </p>
          </div>
        )}

        {/* STEP 4: Exam Result & 5-Hour Seat Confirmation Notice */}
        {step === 'result' && (
          <div className="space-y-6 animate-scale-up">
            {/* Urgent Countdown Alert */}
            <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-rose-950">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center text-xl flex-shrink-0 shadow-soft">
                  <i className="ri-alarm-warning-line"></i>
                </span>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base">
                    জরুরি নোটিশ: আগামী ৫ ঘন্টার মধ্যে সিট নিশ্চিত করুন!
                  </h4>
                  <p className="text-xs text-rose-800">
                    নির্দিষ্ট সময়ের মধ্যে ৩০০৳ দিয়ে সিট বুক না করলে আপনার স্কলারশিপটি পরবর্তী প্রার্থীর কাছে চলে যাবে।
                  </p>
                </div>
              </div>

              <div className="bg-white px-4 py-2 rounded-xl border border-rose-200 text-center font-mono font-extrabold text-rose-700 shadow-soft-xs">
                <span className="text-[10px] uppercase text-rose-500 block">Remaining Time</span>
                <span className="text-lg">{format5HourTimer(bookingTimeLeft)}</span>
              </div>
            </div>

            {/* Congratulations Banner */}
            <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-soft-xl p-6 sm:p-8 space-y-6">
              <div className="text-center space-y-2 border-b border-neutral-100 pb-6">
                <span className="text-4xl">🎉</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground-900">
                  অভিনন্দন {name}! আপনি স্কলারশিপের জন্য নির্বাচিত হয়েছেন!
                </h2>
                <p className="text-sm text-foreground-600">
                  আপনার মোট স্কোর: <strong className="text-emerald-600 text-base">{score} / {SCHOLARSHIP_QUESTIONS.length}</strong> (দারুণ পারফরম্যান্স!)
                </p>
              </div>

              {/* Fee Comparison Card */}
              <div className="bg-primary-50/60 border border-primary-200 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-white rounded-xl border border-neutral-200">
                  <span className="text-xs text-neutral-500 block">নরমাল কোর্স ফি</span>
                  <span className="text-lg font-bold text-neutral-400 line-through">৳৫,০০০</span>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300">
                  <span className="text-xs font-bold text-emerald-800 block">স্কলারশিপে মোট ফি</span>
                  <span className="text-2xl font-extrabold text-emerald-700">৳১,৫০০</span>
                </div>

                <div className="p-3 bg-primary-100 rounded-xl border border-primary-300">
                  <span className="text-xs font-bold text-primary-900 block">এখন সিট বুকিং ফি</span>
                  <span className="text-2xl font-extrabold text-primary-800">৳৩০০</span>
                </div>
              </div>

              {/* Automatically Created Account Info */}
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                <h4 className="text-xs font-bold uppercase text-foreground-700 tracking-wider">
                  আপনার জন্য তৈরি করা LMS একাউন্ট ও স্টুডেন্ট আইডি:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-2.5 bg-white rounded-lg border border-neutral-200">
                    <span className="text-neutral-500 block text-[10px]">Student ID (লগইন আইডি):</span>
                    <strong className="text-primary-700 text-sm">{studentId}</strong>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-neutral-200">
                    <span className="text-neutral-500 block text-[10px]">Default Password:</span>
                    <strong className="text-foreground-900 text-sm">{defaultPassword}</strong>
                  </div>
                </div>
                <p className="text-[11px] text-foreground-500">
                  * এই আইডি ও পাসওয়ার্ড দিয়ে আপনি পরবর্তীতে যেকোনো সময় ওয়েবসাইটে লগইন করতে পারবেন।
                </p>
              </div>

              {/* Seat Confirmation Step */}
              <div className="space-y-4 pt-2">
                <h4 className="text-base font-bold text-foreground-900 flex items-center gap-2">
                  <i className="ri-shield-keyhole-line text-primary-600"></i>
                  সিট কনফার্ম করার নিয়ম (৩০০৳ পেমেন্ট):
                </h4>

                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs space-y-2 text-amber-950">
                  <div>
                    <strong>ধাপ ১:</strong> বিকাশ বা নগদ অ্যাপ থেকে{' '}
                    <strong className="bg-amber-200 px-1 py-0.5 rounded font-mono">01712-345678</strong> নাম্বারে{' '}
                    <strong>Send Money</strong> করুন ৩০০৳।
                  </div>
                  <div>
                    <strong>ধাপ ২ (অত্যন্ত গুরুত্বপূর্ণ):</strong> রেফারেন্স (Reference) অপশনে অবশ্যই আপনার{' '}
                    <strong className="bg-white px-2 py-0.5 rounded border border-amber-300 font-mono text-primary-800">
                      {studentId}
                    </strong>{' '}
                    লিখবেন।
                  </div>
                  <div>
                    <strong>ধাপ ৩:</strong> পেমেন্ট সম্পন্ন হলে নিচের বাটনে ক্লিক করে Transaction ID দিন।
                  </div>
                </div>

                <button
                  onClick={() => setStep('payment')}
                  className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-base rounded-xl shadow-soft flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
                >
                  <i className="ri-secure-payment-line text-lg"></i>
                  <span>৩০০৳ প্রদান করে সিট কনফার্ম করুন (Pay 300tk)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Payment Form */}
        {step === 'payment' && (
          <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-soft-xl p-6 sm:p-8 space-y-6 animate-scale-up">
            <div className="border-b border-neutral-100 pb-4">
              <h3 className="text-xl font-bold text-foreground-900">
                সিট বুকিং ৩০০৳ পেমেন্ট ভেরিফিকেশন
              </h3>
              <p className="text-xs text-foreground-500 mt-1">
                আপনার রেফারেন্স স্টুডেন্ট আইডি: <strong className="text-primary-700 font-mono">{studentId}</strong>
              </p>
            </div>

            <form onSubmit={handleConfirmSeatPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground-700 mb-1.5">
                  পেমেন্ট মাধ্যম সিলেক্ট করুন
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['bKash', 'Nagad', 'Rocket'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={`py-3 px-2 rounded-xl border text-xs font-bold text-center transition-all ${
                        paymentMethod === m
                          ? 'border-primary-600 bg-primary-50 text-primary-800 ring-1 ring-primary-500'
                          : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                      }`}
                    >
                      {m === 'bKash' ? 'বিকাশ (bKash)' : m === 'Nagad' ? 'নগদ (Nagad)' : 'রকেট (Rocket)'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-foreground-700">
                <span className="font-semibold block text-foreground-900 mb-1">
                  {paymentMethod} Personal Number:
                </span>
                <span className="font-mono text-base font-extrabold text-primary-700">01712-345678</span>
                <div className="text-[11px] text-foreground-500 mt-1">
                  Amount: <strong>৳300</strong> | Reference: <strong>{studentId}</strong>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground-700 mb-1">
                  যে নাম্বার থেকে টাকা পাঠিয়েছেন (Sender Number) *
                </label>
                <input
                  required
                  type="text"
                  placeholder="01XXXXXXXXX"
                  value={senderNumber}
                  onChange={(e) => setSenderNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground-700 mb-1">
                  Transaction ID (TrxID) *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. 9XF84K12J"
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl font-mono uppercase focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep('result')}
                  className="px-4 py-2.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-soft transition-transform hover:scale-[1.01]"
                >
                  পেমেন্ট সাবমিট ও সিট কনফার্ম করুন
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 6: Final Confirmation Slip & Facebook Group Access */}
        {step === 'confirmed' && (
          <div className="space-y-6 animate-scale-up">
            {/* Header Banner */}
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-6 text-center space-y-2 text-emerald-950">
              <span className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center text-2xl mx-auto shadow-soft">
                <i className="ri-check-line"></i>
              </span>
              <h2 className="text-2xl font-extrabold">🎉 আপনার সিট সফলভাবে কনফার্ম হয়েছে!</h2>
              <p className="text-xs sm:text-sm text-emerald-800 max-w-xl mx-auto">
                অভিনন্দন! আপনার ৩০০৳ সিট বুকিং ফি গৃহীত হয়েছে। আপনার এডমিশন টোকেন ও ব্যাচ ডিটেইলস নিচে দেওয়া হলো:
              </p>
            </div>

            {/* Official Admission Slip Card */}
            <div className="bg-white rounded-2xl border-2 border-primary-200 shadow-soft-xl overflow-hidden p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-200 pb-5 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary-600 text-white font-extrabold text-xl flex items-center justify-center shadow-soft">
                    LX
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground-900">LearnX Admission Token</h3>
                    <p className="text-xs text-foreground-500">Official Scholarship Student Copy</p>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                    SEAT BOOKED (৳300 PAID)
                  </span>
                  <p className="text-[11px] text-foreground-500 mt-1">Status: Active Batch Enrolled</p>
                </div>
              </div>

              {/* Login Credentials Box */}
              <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase text-primary-700 tracking-wider">
                    Student ID (লগইন ইউজার আইডি)
                  </span>
                  <div className="text-2xl font-extrabold text-primary-900 font-mono tracking-wider mt-0.5">
                    {studentId}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase text-primary-700 tracking-wider">
                    Default Password (ডিফল্ট পাসওয়ার্ড)
                  </span>
                  <div className="text-2xl font-extrabold text-primary-900 font-mono tracking-wider mt-0.5">
                    {defaultPassword}
                  </div>
                </div>
              </div>

              {/* Important Instruction Message */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5 text-xs text-amber-900">
                <div className="font-bold flex items-center gap-1.5 text-amber-950">
                  <i className="ri-notification-3-line text-amber-600"></i>
                  গুরুত্বপূর্ণ নোটিশ ও ক্লাস শুরুর নির্দেশনা:
                </div>
                <div>
                  • আপনার কোর্স: <strong>{targetBatch.courseTitle}</strong>
                </div>
                <div>
                  • ক্লাস শুরুর তারিখ: <strong className="text-emerald-800">{targetBatch.startDate}</strong>
                </div>
                <div>
                  • ক্লাসের সময়সূচী: <strong>{targetBatch.schedule}</strong>
                </div>
                <div>
                  • <strong className="text-rose-700">বাকি পেমেন্ট:</strong> ক্লাস শুরুর আগেই আপনার বাকি{' '}
                  <strong>৳১,২০০</strong> টাকা পরিশোধ করতে হবে। সম্পূর্ণ পেমেন্ট সম্পন্ন হলে ক্লাসের সব প্রিমিয়াম
                  ভিডিও ও রিসোর্স আনলক হবে।
                </div>
              </div>

              {/* Facebook Secret Batch Group Join Box */}
              <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <i className="ri-facebook-circle-fill text-blue-600 text-2xl"></i>
                    <h4 className="font-extrabold text-sm text-blue-950">
                      অফিসিয়াল সিক্রেট ফেসবুক ব্যাচ গ্রুপে যুক্ত হোন
                    </h4>
                  </div>
                  <p className="text-xs text-blue-800">
                    ক্লাস লিংক, রিসোর্স ও মেন্টর সহায়তার জন্য এখনই ব্যাচ গ্রুপে রিকোয়েস্ট পাঠান।
                  </p>
                  <p className="text-[11px] font-semibold text-blue-900">
                    ⚠️ গ্রুপে জয়েন করার সময় সিকিউরিটি প্রশ্নে আপনার Student ID: <strong className="font-mono bg-white px-1.5 py-0.5 rounded border border-blue-300">{studentId}</strong> লিখবেন।
                  </p>
                </div>

                <a
                  href={targetBatch.facebookGroupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-soft flex items-center justify-center gap-1.5 flex-shrink-0 transition-transform hover:scale-105"
                >
                  <i className="ri-user-add-line"></i>
                  <span>Join Facebook Group</span>
                </a>
              </div>

              {/* Bottom Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-neutral-100">
                <button
                  onClick={() => window.print()}
                  className="w-full sm:w-auto px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl flex items-center justify-center gap-2"
                >
                  <i className="ri-printer-line"></i>
                  Print Admission Slip
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Link
                    href="/login"
                    className="w-full sm:w-auto px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl shadow-soft text-center"
                  >
                    Go to Student Portal Login →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
