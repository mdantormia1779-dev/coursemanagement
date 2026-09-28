'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PortalLayout from '@/components/portal/PortalLayout';
import { ADMIN_NAV } from '@/data/portalNavs';
import { INITIAL_BATCHES, CourseBatch } from '@/data/leadsAndBatches';
import {
  getPaymentRequests,
  approveManualPayment,
  rejectManualPayment,
  ManualPaymentRequest,
} from '@/lib/manualPaymentService';
import Link from 'next/link';

interface AdmissionReceipt {
  studentId: string;
  defaultPassword: string;
  name: string;
  phone: string;
  whatsapp: string;
  address: string;
  education: string;
  courseTitle: string;
  batchName: string;
  startDate: string;
  schedule: string;
  totalFee: number;
  paidAmount: number;
  dueAmount: number;
  paymentMethod: string;
  trxId: string;
  facebookGroupUrl: string;
  admittedAt: string;
}

function AdmissionForm() {
  const searchParams = useSearchParams();

  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [education, setEducation] = useState('');

  const [selectedBatchId, setSelectedBatchId] = useState<string>(INITIAL_BATCHES[0].id);
  const [paymentType, setPaymentType] = useState<'partial' | 'full'>('partial');
  const [customCourseFee, setCustomCourseFee] = useState<number>(5000);
  const [paidAmount, setPaidAmount] = useState<number>(1000);
  const [paymentMethod, setPaymentMethod] = useState<string>('bKash');
  const [trxId, setTrxId] = useState<string>('');
  const [reference, setReference] = useState<string>('');
  const [notes, setNotes] = useState<string>('Registered via WhatsApp Call confirmation');

  const [receipt, setReceipt] = useState<AdmissionReceipt | null>(null);

  // Pre-fill from query params if coming from Lead CRM
  useEffect(() => {
    const qName = searchParams.get('name');
    const qPhone = searchParams.get('phone');
    const qWhatsapp = searchParams.get('whatsapp');
    const qAddress = searchParams.get('address');
    const qEducation = searchParams.get('education');

    if (qName) setName(qName);
    if (qPhone) setPhone(qPhone);
    if (qWhatsapp) setWhatsapp(qWhatsapp);
    if (qAddress) setAddress(qAddress);
    if (qEducation) setEducation(qEducation);
  }, [searchParams]);

  const selectedBatch: CourseBatch =
    INITIAL_BATCHES.find((b) => b.id === selectedBatchId) || INITIAL_BATCHES[0];

  // Adjust default paid amount when switching payment type
  useEffect(() => {
    if (paymentType === 'partial') {
      setPaidAmount(1000);
    } else {
      setPaidAmount(customCourseFee);
    }
  }, [paymentType, customCourseFee]);

  const dueAmount = Math.max(0, customCourseFee - paidAmount);

  const handleManualRegister = (e: React.FormEvent) => {
    e.preventDefault();

    // Generate unique intermediate-style Student ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const generatedStudentId = `SID-2026-${randomSuffix}`;
    const defaultPassword = `std@${randomSuffix}`;

    const newReceipt: AdmissionReceipt = {
      studentId: generatedStudentId,
      defaultPassword,
      name,
      phone,
      whatsapp: whatsapp || phone,
      address,
      education,
      courseTitle: selectedBatch.courseTitle,
      batchName: selectedBatch.name,
      startDate: selectedBatch.startDate,
      schedule: selectedBatch.schedule,
      totalFee: customCourseFee,
      paidAmount,
      dueAmount,
      paymentMethod,
      trxId: trxId || `TRX${Date.now().toString().slice(-8)}`,
      facebookGroupUrl: selectedBatch.facebookGroupUrl,
      admittedAt: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };

    setReceipt(newReceipt);
  };

  const getWhatsAppMessage = (r: AdmissionReceipt) => {
    return encodeURIComponent(
      `🎉 অভিনন্দন ${r.name}! আপনার ভর্তি সফলভাবে কনফার্ম হয়েছে।\n\n` +
        `📚 কোর্স: ${r.courseTitle}\n` +
        `🏷️ ব্যাচ: ${r.batchName}\n` +
        `📅 ক্লাস শুরুর তারিখ: ${r.startDate}\n` +
        `⏰ ক্লাসের সময়: ${r.schedule}\n\n` +
        `🆔 আপনার Student ID: ${r.studentId}\n` +
        `🔑 ডিফল্ট পাসওয়ার্ড: ${r.defaultPassword}\n\n` +
        `💰 মোট কোর্স ফি: ৳${r.totalFee}\n` +
        `✅ সিট বুকিং / পরিশোধিত: ৳${r.paidAmount}\n` +
        `⚠️ বাকি ফি (Due): ৳${r.dueAmount} (ক্লাস শুরুর পূর্বে পরিশোধ করতে হবে)\n\n` +
        `🌐 ওয়েবসাইটে লগইন লিংক: http://localhost:3000/login\n\n` +
        `👥 অফিসিয়াল ফেসবুক সিক্রেট ব্যাচ গ্রুপ:\n${r.facebookGroupUrl}\n` +
        `*(গ্রুপে জয়েন করার সময় অবশ্যই আপনার Student ID: ${r.studentId} লিখবেন)*\n\n` +
        `ধন্যবাদ,\nLearnX LMS এডমিশন টিম`
    );
  };

  const tabFromQuery = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<'approvals' | 'registration'>(
    tabFromQuery === 'registration' ? 'registration' : 'approvals'
  );

  const [paymentRequests, setPaymentRequests] = useState<ManualPaymentRequest[]>([]);
  const [approvalsFilter, setApprovalsFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [approvalsSearch, setApprovalsSearch] = useState('');
  const [copiedTrx, setCopiedTrx] = useState<string | null>(null);
  const [adminFeedback, setAdminFeedback] = useState<string | null>(null);

  const refreshPaymentRequests = () => {
    setPaymentRequests(getPaymentRequests());
  };

  useEffect(() => {
    refreshPaymentRequests();
    const handleUpdate = () => refreshPaymentRequests();
    window.addEventListener('learnx_manual_payments_changed', handleUpdate);
    return () => window.removeEventListener('learnx_manual_payments_changed', handleUpdate);
  }, []);

  const pendingCount = paymentRequests.filter((r) => r.status === 'PENDING').length;
  const approvedCount = paymentRequests.filter((r) => r.status === 'APPROVED').length;
  const totalCollected = paymentRequests
    .filter((r) => r.status === 'APPROVED')
    .reduce((sum, r) => sum + (r.amount || 0), 0);

  const handleApprovePayment = (req: ManualPaymentRequest) => {
    const updated = approveManualPayment(req.id, 'Academy Director');
    if (updated) {
      refreshPaymentRequests();
      setAdminFeedback(`অনুমোদন সফল! ${req.studentName} এর জন্য কোর্স এক্সেস আনলক হয়েছে (Student ID: ${updated.studentId})`);
      setTimeout(() => setAdminFeedback(null), 4500);
    }
  };

  const handleRejectPayment = (req: ManualPaymentRequest) => {
    const reason = prompt('বাতিল করার কারণ লিখুন (যেমন: TrxID স্টেটমেন্টের সাথে মেলেনি):', 'Invalid Transaction ID');
    if (reason !== null) {
      rejectManualPayment(req.id, reason);
      refreshPaymentRequests();
      setAdminFeedback(`রিকুয়েস্ট বাতিল করা হয়েছে (${req.orderNumber})`);
      setTimeout(() => setAdminFeedback(null), 4500);
    }
  };

  const handleCopyTrx = (trx: string) => {
    navigator.clipboard.writeText(trx);
    setCopiedTrx(trx);
    setTimeout(() => setCopiedTrx(null), 2000);
  };

  const filteredRequests = paymentRequests.filter((r) => {
    if (approvalsFilter !== 'ALL' && r.status !== approvalsFilter) return false;
    if (approvalsSearch.trim()) {
      const q = approvalsSearch.toLowerCase();
      return (
        r.studentName.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        r.senderNumber.includes(q) ||
        r.trxId.toLowerCase().includes(q) ||
        r.orderNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getApprovalWhatsAppMessage = (r: ManualPaymentRequest) => {
    return encodeURIComponent(
      `🎉 অভিনন্দন ${r.studentName}! আপনার পেমেন্ট ভেরিফাই করে কোর্স এক্সেস অনুমোদন করা হয়েছে।\n\n` +
      `📚 কোর্স: ${r.courseTitle}\n` +
      `💳 পরিশোধিত ফি: ৳${r.amount} (${r.paymentMethod} TrxID: ${r.trxId})\n` +
      `🆔 আপনার Student ID: ${r.studentId || 'SID-2026-8492'}\n` +
      `📦 অর্ডার নম্বর: ${r.orderNumber}\n\n` +
      `🌐 সরাসরি কোর্স শুরু করতে লগইন করুন:\nhttp://localhost:3000/student/learning/${r.courseSlug}\n\n` +
      `যেকোনো প্রয়োজনে আমাদের জানাবেন। শুভকামনা!\nLearnX Academy টিম`
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-100 text-primary-800 border border-primary-200">
              <i className="ri-shield-check-line mr-1 text-primary-600"></i> Admission & Payments Command
            </span>
            <span className="text-xs text-foreground-500">Live TrxID Verification & Course Activation</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground-900 mt-1">
            Manual Payments & Student Admission Desk
          </h1>
          <p className="text-sm text-foreground-600">
            Verify bKash / Nagad / Rocket transaction IDs submitted from /checkout, approve access, or manually register walk-in students.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/settings"
            className="px-3.5 py-2 rounded-xl bg-white border border-background-300 hover:bg-background-50 text-foreground-700 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-soft-xs"
          >
            <i className="ri-settings-4-line text-primary-600" />
            <span>পেমেন্ট নম্বর পরিবর্তন (Settings)</span>
          </Link>
          <Link
            href="/admin/leads"
            className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <i className="ri-arrow-left-line"></i>
            <span>WhatsApp Leads</span>
          </Link>
        </div>
      </div>

      {/* Admin Action Toast */}
      {adminFeedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2.5 shadow-soft-xs animate-fade-in">
          <i className="ri-checkbox-circle-fill text-emerald-600 text-lg" />
          <span>{adminFeedback}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-background-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('approvals')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'approvals'
              ? 'bg-primary-600 text-white shadow-soft-sm'
              : 'bg-white text-foreground-600 hover:text-foreground-950 border border-background-200'
          }`}
        >
          <i className="ri-shield-check-line text-sm" />
          <span>Manual Payment Approvals (চেকআউট পেমেন্ট অনুমোদন)</span>
          {pendingCount > 0 ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-amber-950 animate-pulse">
              {pendingCount} Pending
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white">
              {paymentRequests.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('registration')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'registration'
              ? 'bg-primary-600 text-white shadow-soft-sm'
              : 'bg-white text-foreground-600 hover:text-foreground-950 border border-background-200'
          }`}
        >
          <i className="ri-user-add-line text-sm" />
          <span>Walk-in Student Registration (অফলাইন সরাসরি ভর্তি)</span>
        </button>
      </div>

      {activeTab === 'approvals' ? (
        <div className="space-y-6">
          {/* 4 Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-background-200 shadow-soft-xs">
              <span className="text-xs text-foreground-500 font-medium">মোট পেমেন্ট রিকোয়েস্ট</span>
              <div className="text-2xl font-extrabold font-heading text-foreground-950 mt-1">
                {paymentRequests.length}
              </div>
              <span className="text-[11px] text-foreground-400">Total Checkouts</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 shadow-soft-xs">
              <span className="text-xs text-amber-800 font-bold flex items-center gap-1.5">
                <i className="ri-time-line text-amber-600" />
                অপেক্ষমান অনুমোদন (Pending)
              </span>
              <div className="text-2xl font-extrabold font-heading text-amber-900 mt-1">
                {pendingCount}
              </div>
              <span className="text-[11px] text-amber-700">Needs TrxID check</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-soft-xs">
              <span className="text-xs text-emerald-800 font-bold flex items-center gap-1.5">
                <i className="ri-checkbox-circle-line text-emerald-600" />
                অনুমোদিত ও এক্টিভ (Approved)
              </span>
              <div className="text-2xl font-extrabold font-heading text-emerald-900 mt-1">
                {approvedCount}
              </div>
              <span className="text-[11px] text-emerald-700">Course unlocked</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-background-200 shadow-soft-xs">
              <span className="text-xs text-foreground-500 font-medium">মোট সংগৃহীত ফি</span>
              <div className="text-2xl font-extrabold font-heading text-primary-600 mt-1">
                ৳{totalCollected.toLocaleString()}
              </div>
              <span className="text-[11px] text-foreground-400">Approved deposits</span>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="p-4 rounded-2xl bg-white border border-background-200 shadow-soft-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setApprovalsFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  approvalsFilter === 'ALL'
                    ? 'bg-foreground-950 text-white'
                    : 'bg-background-100 text-foreground-600 hover:text-foreground-950'
                }`}
              >
                All ({paymentRequests.length})
              </button>
              <button
                type="button"
                onClick={() => setApprovalsFilter('PENDING')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  approvalsFilter === 'PENDING'
                    ? 'bg-amber-500 text-white'
                    : 'bg-amber-100/70 text-amber-900 hover:bg-amber-100'
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                type="button"
                onClick={() => setApprovalsFilter('APPROVED')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  approvalsFilter === 'APPROVED'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-100/70 text-emerald-900 hover:bg-emerald-100'
                }`}
              >
                Approved ({approvedCount})
              </button>
              <button
                type="button"
                onClick={() => setApprovalsFilter('REJECTED')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  approvalsFilter === 'REJECTED'
                    ? 'bg-rose-600 text-white'
                    : 'bg-rose-100/70 text-rose-900 hover:bg-rose-100'
                }`}
              >
                Rejected
              </button>
            </div>

            <div className="relative w-full sm:w-72">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-foreground-400 text-sm" />
              <input
                type="text"
                value={approvalsSearch}
                onChange={(e) => setApprovalsSearch(e.target.value)}
                placeholder="Search TrxID, Name, Phone..."
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-background-200 text-xs outline-none focus:border-primary-500 bg-background-50/50"
              />
            </div>
          </div>

          {/* Requests Table */}
          {filteredRequests.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-background-200 space-y-3">
              <i className="ri-inbox-line text-4xl text-foreground-300" />
              <h4 className="font-heading font-bold text-base text-foreground-900">কোনো পেমেন্ট রিকোয়েস্ট পাওয়া যায়নি</h4>
              <p className="text-xs text-foreground-500 max-w-sm mx-auto">
                শিক্ষার্থীরা যখন /checkout পেজে bKash বা Nagad TrxID সাবমিট করবে, তখন তা এখানে অনুমোদনের জন্য চলে আসবে।
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-background-200 shadow-soft-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-background-50 border-b border-background-200 text-foreground-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Student & Contact</th>
                      <th className="p-4">Course & Plan</th>
                      <th className="p-4">Amount & Gateway</th>
                      <th className="p-4">Sender & TrxID</th>
                      <th className="p-4">Date & Status</th>
                      <th className="p-4 text-right">Approval Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-background-100">
                    {filteredRequests.map((req) => {
                      const isPending = req.status === 'PENDING';
                      const isApproved = req.status === 'APPROVED';
                      const isRejected = req.status === 'REJECTED';

                      return (
                        <tr key={req.id} className="hover:bg-background-50/50 transition-colors">
                          <td className="p-4">
                            <div className="font-bold text-foreground-950 text-sm">{req.studentName}</div>
                            <div className="text-[11px] text-foreground-500">{req.email}</div>
                            <div className="flex items-center gap-1.5 mt-1 font-mono text-foreground-700">
                              <i className="ri-phone-line text-foreground-400" />
                              <span>{req.phone}</span>
                              <a
                                href={`https://wa.me/88${req.phone.replace(/[^0-9]/g, '').replace(/^88/, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-600 hover:text-emerald-700 ml-1"
                                title="Chat on WhatsApp"
                              >
                                <i className="ri-whatsapp-fill text-sm" />
                              </a>
                            </div>
                          </td>

                          <td className="p-4">
                            <div className="font-bold text-foreground-900">{req.courseTitle}</div>
                            <div className="text-[11px] text-primary-600 font-semibold">{req.planTitle}</div>
                            <div className="text-[10px] text-foreground-400 font-mono mt-0.5">{req.orderNumber}</div>
                          </td>

                          <td className="p-4">
                            <div className="font-heading font-extrabold text-sm text-foreground-950">
                              ৳{req.amount.toLocaleString()} BDT
                            </div>
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mt-1 ${
                                req.paymentMethod === 'bKash'
                                  ? 'bg-pink-100 text-pink-700 border border-pink-200'
                                  : req.paymentMethod === 'Nagad'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-purple-100 text-purple-700 border border-purple-200'
                              }`}
                            >
                              {req.paymentMethod}
                            </span>
                          </td>

                          <td className="p-4">
                            <div className="text-[11px] text-foreground-500">
                              Sender: <strong className="text-foreground-900 font-mono">{req.senderNumber}</strong>
                            </div>
                            <div className="mt-1 flex items-center gap-1.5">
                              <span className="px-2 py-1 rounded bg-slate-900 text-emerald-300 font-mono font-bold text-xs tracking-wider">
                                {req.trxId}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopyTrx(req.trxId)}
                                className="p-1 rounded hover:bg-background-200 text-foreground-500"
                                title="Copy TrxID"
                              >
                                <i className={copiedTrx === req.trxId ? 'ri-check-line text-emerald-600' : 'ri-file-copy-line'} />
                              </button>
                            </div>
                            {req.studentNote && (
                              <p className="text-[10px] text-foreground-400 mt-1 italic">
                                &quot;{req.studentNote}&quot;
                              </p>
                            )}
                          </td>

                          <td className="p-4">
                            <div className="text-[11px] text-foreground-500">
                              {new Date(req.submittedAt).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                            <div className="mt-1">
                              {isPending && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                                  Pending Review
                                </span>
                              )}
                              {isApproved && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  <i className="ri-checkbox-circle-fill text-emerald-600" />
                                  Approved & Active
                                </span>
                              )}
                              {isRejected && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                                  <i className="ri-close-circle-fill text-rose-600" />
                                  Rejected
                                </span>
                              )}
                            </div>
                            {req.studentId && (
                              <div className="text-[10px] text-primary-700 font-mono font-bold mt-1">
                                {req.studentId}
                              </div>
                            )}
                          </td>

                          <td className="p-4 text-right space-y-1.5">
                            {isPending ? (
                              <div className="flex flex-col sm:flex-row items-end sm:items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleApprovePayment(req)}
                                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-soft-xs flex items-center gap-1.5 transition-all hover:scale-[1.02]"
                                >
                                  <i className="ri-check-line text-sm" />
                                  <span>Approve & Unlock</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRejectPayment(req)}
                                  className="px-3 py-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-700 font-bold text-xs transition-colors"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : isApproved ? (
                              <div className="flex flex-col items-end gap-1.5">
                                <a
                                  href={`https://wa.me/88${req.phone.replace(/[^0-9]/g, '').replace(/^88/, '')}?text=${getApprovalWhatsAppMessage(req)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1.5 transition-colors shadow-soft-xs"
                                >
                                  <i className="ri-whatsapp-line" />
                                  <span>WhatsApp Confirm</span>
                                </a>
                                <Link
                                  href={`/student/learning/${req.courseSlug}`}
                                  className="text-[11px] text-primary-600 hover:text-primary-800 font-semibold"
                                >
                                  View Classroom →
                                </Link>
                              </div>
                            ) : (
                              <span className="text-[11px] text-rose-600 italic">
                                {req.rejectionReason || 'Rejected'}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Walk-in Student Registration Desk */
        <div>
          {!receipt ? (
        /* Manual Registration Form */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <form onSubmit={handleManualRegister} className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-soft-sm space-y-6">
              <div className="border-b border-neutral-100 pb-4">
                <h3 className="text-base font-bold text-foreground-900 flex items-center gap-2">
                  <i className="ri-user-smile-line text-primary-600 text-lg"></i>
                  1. Student Personal & Contact Details
                </h3>
                <p className="text-xs text-foreground-500 mt-0.5">
                  An LMS user account with intermediate-style Student ID will be generated automatically.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground-700 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Mahfuzur Rahman"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground-700 mb-1">
                    Primary Phone Number *
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
                  <label className="block text-xs font-semibold text-foreground-700 mb-1">
                    WhatsApp Number (For Instant Admission Message)
                  </label>
                  <input
                    type="text"
                    placeholder="017XXXXXXXX"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground-700 mb-1">
                    Academic Background / Education
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. HSC 2024 / CSE Graduate / Non-tech"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-foreground-700 mb-1">
                    Home Address / District
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. House 14, Road 5, Mirpur-10, Dhaka"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="border-t border-neutral-100 pt-6">
                <h3 className="text-base font-bold text-foreground-900 flex items-center gap-2">
                  <i className="ri-calendar-event-line text-primary-600 text-lg"></i>
                  2. Select Course Batch
                </h3>
                <p className="text-xs text-foreground-500 mt-0.5">
                  Select the batch the student is joining from WhatsApp discussion.
                </p>

                <div className="mt-4 grid grid-cols-1 gap-3">
                  {INITIAL_BATCHES.map((batch) => (
                    <label
                      key={batch.id}
                      className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedBatchId === batch.id
                          ? 'border-primary-500 bg-primary-50/40 ring-1 ring-primary-500'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="batch"
                        checked={selectedBatchId === batch.id}
                        onChange={() => {
                          setSelectedBatchId(batch.id);
                          setCustomCourseFee(batch.totalFee);
                        }}
                        className="mt-1 text-primary-600 focus:ring-primary-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-foreground-900 text-sm">{batch.name}</span>
                          <span className="text-xs font-bold text-primary-700 bg-primary-100 px-2 py-0.5 rounded-full">
                            Regular Fee: ৳{batch.totalFee}
                          </span>
                        </div>
                        <div className="text-xs text-foreground-600 mt-1">
                          <i className="ri-calendar-line text-neutral-400 mr-1"></i>
                          Class Starts: <strong className="text-foreground-800">{batch.startDate}</strong> | {batch.schedule}
                        </div>
                        <div className="text-[11px] text-foreground-500 mt-0.5">
                          Seats: {batch.bookedSeats}/{batch.totalSeats} booked | Instructor: {batch.instructor}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-neutral-100 pt-6">
                <h3 className="text-base font-bold text-foreground-900 flex items-center gap-2">
                  <i className="ri-wallet-3-line text-primary-600 text-lg"></i>
                  3. Payment Mode & Seat Booking
                </h3>
                <p className="text-xs text-foreground-500 mt-0.5">
                  Support partial ৳1,000 seat booking with auto due tracking or full payment.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {/* Payment Type Selection */}
                  <div
                    onClick={() => setPaymentType('partial')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentType === 'partial'
                        ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
                      <i className="ri-shield-check-line text-emerald-600 text-lg"></i>
                      ১০০০৳ দিয়ে সিট বুকিং (Seat Booking)
                    </div>
                    <p className="text-xs text-foreground-600 mt-1">
                      স্টুডেন্ট ১০০০৳ দিয়ে সিট বুক করে রাখবে, বাকি টাকা ক্লাস শুরুর আগে দিবে।
                    </p>
                  </div>

                  <div
                    onClick={() => setPaymentType('full')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentType === 'full'
                        ? 'border-primary-500 bg-primary-50/50 ring-1 ring-primary-500'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-sm text-primary-800">
                      <i className="ri-checkbox-circle-line text-primary-600 text-lg"></i>
                      এককালীন ফুল পেমেন্ট (Full Payment)
                    </div>
                    <p className="text-xs text-foreground-600 mt-1">
                      পুরো কোর্স ফি একবারে পরিশোধ করে তাৎক্ষণিক ফুল কোর্স এক্সেস পাবে।
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground-700 mb-1">
                      Course Agreed Fee (৳)
                    </label>
                    <input
                      type="number"
                      value={customCourseFee}
                      onChange={(e) => setCustomCourseFee(Number(e.target.value))}
                      className="w-full px-3.5 py-2 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground-700 mb-1">
                      Received Amount (৳) *
                    </label>
                    <input
                      required
                      type="number"
                      value={paidAmount}
                      onChange={(e) => setPaidAmount(Number(e.target.value))}
                      className="w-full px-3.5 py-2 text-sm border border-neutral-200 rounded-xl font-bold text-emerald-700 focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground-700 mb-1">
                      Remaining Due (৳)
                    </label>
                    <div className="px-3.5 py-2 text-sm font-bold bg-neutral-100 rounded-xl border border-neutral-200 text-amber-800">
                      ৳{dueAmount.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground-700 mb-1">
                      Payment Channel
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="bKash">bKash (বিকাশ)</option>
                      <option value="Nagad">Nagad (নগদ)</option>
                      <option value="Rocket">Rocket (রকেট)</option>
                      <option value="Cash">Cash (অফিস ক্যাশ)</option>
                      <option value="Bank">Bank Deposit</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground-700 mb-1">
                      Transaction ID (TrxID) *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 9XF84K12J"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 uppercase font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground-700 mb-1">
                      Payment Reference Note
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. WhatsApp Call #101"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-xl shadow-soft flex items-center gap-2 transition-all hover:scale-[1.01]"
                >
                  <i className="ri-check-double-line text-lg"></i>
                  Complete Admission & Generate Student ID Token
                </button>
              </div>
            </form>
          </div>

          {/* Right Summary Sidebar */}
          <div className="space-y-4">
            <div className="bg-neutral-900 text-white p-6 rounded-2xl shadow-soft space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-primary-500/20 text-primary-400 flex items-center justify-center font-bold">
                  <i className="ri-lightbulb-line"></i>
                </span>
                <h4 className="font-bold text-sm text-white">How Manual Admission Works</h4>
              </div>

              <ul className="text-xs text-neutral-300 space-y-2.5">
                <li className="flex items-start gap-2">
                  <i className="ri-checkbox-circle-fill text-emerald-400 mt-0.5"></i>
                  <span>
                    <strong>Auto Account:</strong> LMS student account created instantly with intermediate admission style Student ID (`SID-2026-XXXX`).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="ri-checkbox-circle-fill text-emerald-400 mt-0.5"></i>
                  <span>
                    <strong>৳1,000 Seat Booking:</strong> The student's seat in the batch is officially locked.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="ri-checkbox-circle-fill text-emerald-400 mt-0.5"></i>
                  <span>
                    <strong>Due Tracking:</strong> Outstanding due fee is tracked. Full course video modules unlock automatically upon full clearance.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="ri-checkbox-circle-fill text-emerald-400 mt-0.5"></i>
                  <span>
                    <strong>Facebook Batch Group:</strong> Student receives private Facebook group invitation link and uses Student ID to verify membership.
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-soft-sm">
              <h5 className="text-xs font-bold text-foreground-700 uppercase tracking-wider mb-3">
                Selected Batch Snapshot
              </h5>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-foreground-500">Batch:</span>
                  <span className="font-semibold text-foreground-900">{selectedBatch.name.split('—')[0]}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-foreground-500">Start Date:</span>
                  <span className="font-semibold text-primary-600">{selectedBatch.startDate}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-foreground-500">Schedule:</span>
                  <span className="font-semibold text-foreground-900 text-right">{selectedBatch.schedule}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-foreground-500">Facebook Group:</span>
                  <span className="font-mono text-primary-600 truncate max-w-[140px] text-right">
                    Secret Batch Group
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Printable Official Admission Receipt / Token */
        <div className="max-w-3xl mx-auto space-y-6 animate-scale-up">
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xl shadow-soft">
                <i className="ri-checkbox-circle-line"></i>
              </span>
              <div>
                <h4 className="font-bold text-emerald-950">Student Admission Confirmed Successfully!</h4>
                <p className="text-xs text-emerald-800">
                  Student account and official token have been generated. Send the confirmation to WhatsApp now.
                </p>
              </div>
            </div>
            <button
              onClick={() => setReceipt(null)}
              className="px-3.5 py-1.5 bg-white border border-emerald-300 text-emerald-900 text-xs font-semibold rounded-lg hover:bg-emerald-100 transition-colors"
            >
              + Register Another Student
            </button>
          </div>

          {/* Printable Admission Card */}
          <div className="bg-white rounded-2xl border-2 border-primary-200 shadow-soft-xl overflow-hidden p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-200 pb-5 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary-600 text-white font-extrabold text-xl flex items-center justify-center shadow-soft">
                  LX
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground-900">LearnX Learning Management System</h2>
                  <p className="text-xs text-foreground-500">Official Student Admission Slip & Token</p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                  SEAT CONFIRMED
                </span>
                <p className="text-[11px] text-foreground-500 mt-1">Issue Date: {receipt.admittedAt}</p>
              </div>
            </div>

            {/* Student ID & Password Banner */}
            <div className="bg-primary-50/70 border border-primary-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase text-primary-700 tracking-wider">
                  Official Student ID (লগইন ইউজার আইডি)
                </span>
                <div className="text-2xl font-extrabold text-primary-900 font-mono tracking-wider mt-0.5">
                  {receipt.studentId}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase text-primary-700 tracking-wider">
                  Default Login Password (ডিফল্ট পাসওয়ার্ড)
                </span>
                <div className="text-2xl font-extrabold text-primary-900 font-mono tracking-wider mt-0.5">
                  {receipt.defaultPassword}
                </div>
              </div>
            </div>

            {/* Admission Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/60">
                <span className="text-foreground-500 block mb-0.5">Student Name:</span>
                <strong className="text-foreground-900 text-sm">{receipt.name}</strong>
              </div>

              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/60">
                <span className="text-foreground-500 block mb-0.5">Contact Number:</span>
                <strong className="text-foreground-900 text-sm">{receipt.phone} (WhatsApp: {receipt.whatsapp})</strong>
              </div>

              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/60 sm:col-span-2">
                <span className="text-foreground-500 block mb-0.5">Course & Batch:</span>
                <strong className="text-foreground-900 text-sm block">{receipt.courseTitle}</strong>
                <span className="text-primary-700 font-semibold">{receipt.batchName}</span>
              </div>

              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/60">
                <span className="text-foreground-500 block mb-0.5">Class Start Date:</span>
                <strong className="text-emerald-700 text-sm">{receipt.startDate}</strong>
              </div>

              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/60">
                <span className="text-foreground-500 block mb-0.5">Class Schedule:</span>
                <strong className="text-foreground-900 text-sm">{receipt.schedule}</strong>
              </div>
            </div>

            {/* Payment & Due Accounting */}
            <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2">
              <h5 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Payment & Due Status Breakdown
              </h5>
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="p-2 bg-white rounded-lg border border-amber-100">
                  <span className="text-[11px] text-foreground-500 block">Total Course Fee</span>
                  <span className="text-sm font-bold text-foreground-900">৳{receipt.totalFee.toLocaleString()}</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-emerald-200">
                  <span className="text-[11px] text-emerald-700 font-semibold block">Paid (Seat Booked)</span>
                  <span className="text-sm font-extrabold text-emerald-800">৳{receipt.paidAmount.toLocaleString()}</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-rose-200">
                  <span className="text-[11px] text-rose-700 font-semibold block">Remaining Due</span>
                  <span className="text-sm font-extrabold text-rose-800">৳{receipt.dueAmount.toLocaleString()}</span>
                </div>
              </div>
              <p className="text-[11px] text-amber-800 italic pt-1">
                * বাকি বকেয়া টাকা ({receipt.dueAmount > 0 ? `৳${receipt.dueAmount}` : '০৳'}) ক্লাস শুরুর পূর্বে পরিশোধ করতে হবে।
              </p>
            </div>

            {/* Official Facebook Batch Group link */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                  <i className="ri-facebook-circle-fill text-blue-600 text-base"></i>
                  Official Secret Facebook Batch Group
                </span>
                <p className="text-xs text-blue-800 mt-0.5">
                  Join the exclusive batch group. Use your Student ID <strong>{receipt.studentId}</strong> to verify!
                </p>
              </div>
              <a
                href={receipt.facebookGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-soft flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Join FB Group</span>
                <i className="ri-external-link-line"></i>
              </a>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-neutral-200">
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <i className="ri-printer-line text-base"></i>
                Print Admission Slip
              </button>

              {/* Direct WhatsApp Share */}
              <a
                href={`https://wa.me/88${receipt.whatsapp.replace(/^0/, '')}?text=${getWhatsAppMessage(
                  receipt
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl shadow-soft flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
              >
                <i className="ri-whatsapp-line text-lg"></i>
                Send Instant Confirmation to WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
        </div>
      )}
    </div>
  );
}

export default function AdminAdmissionsPage() {
  return (
    <PortalLayout
      role="admin"
      userName="Hassan Mahmud"
      userRoleLabel="Super Admin / Admission Officer"
      navItems={ADMIN_NAV}
    >
      <Suspense fallback={<div className="p-8 text-center text-foreground-500">Loading Admission Desk...</div>}>
        <AdmissionForm />
      </Suspense>
    </PortalLayout>
  );
}
