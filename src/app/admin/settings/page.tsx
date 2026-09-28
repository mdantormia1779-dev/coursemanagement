'use client';

import { useState, useEffect } from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { ADMIN_NAV } from '@/data/portalNavs';
import { getPaymentSettings, savePaymentSettings, PaymentSettings } from '@/lib/manualPaymentService';

export default function AdminSettingsPage() {
  const [seatDeposit, setSeatDeposit] = useState('1000');
  const [scholarshipFee, setScholarshipFee] = useState('5000');
  const [whatsappNumber, setWhatsappNumber] = useState('01318964063');
  const [bkashNumber, setBkashNumber] = useState('01318964063');
  const [nagadNumber, setNagadNumber] = useState('01318964063');
  const [rocketNumber, setRocketNumber] = useState('01318964063');
  const [accountType, setAccountType] = useState<'Personal (Send Money)' | 'Merchant (Payment)' | 'Agent (Cash In)'>('Personal (Send Money)');
  const [instructionsBangla, setInstructionsBangla] = useState('');
  const [isManualPaymentActive, setIsManualPaymentActive] = useState(true);
  const [defaultPlatform, setDefaultPlatform] = useState('GOOGLE_MEET');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const s: PaymentSettings = getPaymentSettings();
    setBkashNumber(s.bkashNumber || '01318964063');
    setNagadNumber(s.nagadNumber || '01318964063');
    setRocketNumber(s.rocketNumber || '01318964063');
    setAccountType(s.accountType || 'Personal (Send Money)');
    setSeatDeposit(String(s.seatBookingAmount || 1000));
    setWhatsappNumber(s.whatsappSupportNumber || '01318964063');
    setInstructionsBangla(s.instructionsBangla || '');
    setIsManualPaymentActive(s.isManualPaymentActive !== false);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    savePaymentSettings({
      bkashNumber: bkashNumber.trim(),
      nagadNumber: nagadNumber.trim(),
      rocketNumber: rocketNumber.trim(),
      accountType,
      seatBookingAmount: Number(seatDeposit) || 1000,
      whatsappSupportNumber: whatsappNumber.trim(),
      instructionsBangla,
      isManualPaymentActive,
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <PortalLayout
      role="admin"
      userName="Academy Director"
      userRoleLabel="Academy Administrator"
      navItems={ADMIN_NAV}
    >
      <div className="max-w-4xl space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-100 text-primary-800">
              System Settings
            </span>
            <span className="text-xs text-foreground-500">Live Academy Configuration</span>
          </div>
          <h2 className="font-heading text-2xl font-extrabold text-foreground-950">
            Academy System, Admission & Manual Payment Settings
          </h2>
          <p className="text-sm text-foreground-500 mt-1">
            Configure seat booking deposits, official bKash / Nagad payment numbers (shown on /checkout), WhatsApp support hotline, and admission instructions.
          </p>
        </div>

        <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-2xl bg-white border border-background-200 shadow-soft-sm space-y-8">
          {saved && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 shadow-soft-xs animate-fade-in">
              <i className="ri-checkbox-circle-fill text-emerald-600 text-lg" />
              <span>Academy and Manual Payment numbers updated successfully! Changes are live on the /checkout page.</span>
            </div>
          )}

          {/* SECTION 1: Manual Payment Gateway Numbers */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-background-100 pb-3">
              <div>
                <h3 className="font-heading text-base font-bold text-foreground-950 flex items-center gap-2">
                  <i className="ri-hand-coin-line text-primary-600 text-lg" />
                  <span>Manual Payment Numbers (চেকআউট পেজে প্রদর্শিত নম্বর)</span>
                </h3>
                <p className="text-xs text-foreground-500 mt-0.5">
                  যে নম্বরে শিক্ষার্থীরা ৳১,০০০ সিট বুকিং বা কোর্স ফি পাঠাবে (ডিফল্ট: 01318964063)।
                </p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-foreground-700">
                <input
                  type="checkbox"
                  checked={isManualPaymentActive}
                  onChange={(e) => setIsManualPaymentActive(e.target.checked)}
                  className="rounded text-primary-600 focus:ring-primary-500 w-4 h-4"
                />
                <span>Manual Payment Active</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-foreground-700 mb-1">
                  bKash Payment Number *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-600 font-extrabold text-xs">bKash</span>
                  <input
                    type="text"
                    required
                    value={bkashNumber}
                    onChange={(e) => setBkashNumber(e.target.value)}
                    placeholder="01318964063"
                    className="w-full h-11 pl-16 pr-3.5 rounded-xl border border-background-300 text-sm font-mono font-bold outline-none focus:border-pink-500 bg-white"
                  />
                </div>
                <span className="text-[11px] text-foreground-400 mt-1 block">
                  Checkout পেজে এই bKash নম্বরটি কপি করার অপশনসহ দেখাবে
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground-700 mb-1">
                  Nagad Payment Number *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-600 font-extrabold text-xs">Nagad</span>
                  <input
                    type="text"
                    required
                    value={nagadNumber}
                    onChange={(e) => setNagadNumber(e.target.value)}
                    placeholder="01318964063"
                    className="w-full h-11 pl-16 pr-3.5 rounded-xl border border-background-300 text-sm font-mono font-bold outline-none focus:border-amber-500 bg-white"
                  />
                </div>
                <span className="text-[11px] text-foreground-400 mt-1 block">
                  Checkout পেজে এই Nagad নম্বরটি প্রদর্শন করবে
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground-700 mb-1">
                  Rocket Payment Number
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-600 font-extrabold text-xs">Rocket</span>
                  <input
                    type="text"
                    value={rocketNumber}
                    onChange={(e) => setRocketNumber(e.target.value)}
                    placeholder="01318964063"
                    className="w-full h-11 pl-16 pr-3.5 rounded-xl border border-background-300 text-sm font-mono font-bold outline-none focus:border-purple-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground-700 mb-1">
                  Account Type (একাউন্টের ধরন) *
                </label>
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value as any)}
                  className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm bg-white outline-none focus:border-primary-500 font-bold"
                >
                  <option value="Personal (Send Money)">Personal (Send Money) - পার্সোনাল সেন্ড মানি</option>
                  <option value="Merchant (Payment)">Merchant (Payment) - মার্চেন্ট পেমেন্ট</option>
                  <option value="Agent (Cash In)">Agent (Cash In) - এজেন্ট ক্যাশ ইন</option>
                </select>
                <span className="text-[11px] text-foreground-400 mt-1 block">
                  শিক্ষার্থীদের অ্যাপে কোন অপশন ব্যবহার করতে হবে তা নির্দেশ করবে
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground-700 mb-1">
                পেমেন্ট নির্দেশিকা নোট (Bangla Instructions on Checkout)
              </label>
              <textarea
                rows={3}
                value={instructionsBangla}
                onChange={(e) => setInstructionsBangla(e.target.value)}
                placeholder="১. Send Money অপশনে যান..."
                className="w-full p-3 rounded-xl border border-background-300 text-xs outline-none focus:border-primary-500 leading-relaxed font-sans"
              />
            </div>
          </div>

          {/* SECTION 2: General Admission & Fees */}
          <div className="space-y-4 pt-4 border-t border-background-100">
            <h3 className="font-heading text-base font-bold text-foreground-950 flex items-center gap-2">
              <i className="ri-money-dollar-circle-line text-emerald-600 text-lg" />
              <span>Admission Fees & Support Hotline</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-foreground-700 mb-1">
                  Seat Booking Deposit (BDT ৳) *
                </label>
                <input
                  type="number"
                  value={seatDeposit}
                  onChange={(e) => setSeatDeposit(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm font-bold outline-none focus:border-primary-500"
                />
                <span className="text-[11px] text-foreground-400 mt-1 block">
                  /checkout?plan=seat-booking রুটে ডিফল্ট ডিপোজিট পরিমাণ (e.g. ৳1,000)
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground-700 mb-1">
                  Scholarship Exam Course Fee (BDT ৳) *
                </label>
                <input
                  type="number"
                  value={scholarshipFee}
                  onChange={(e) => setScholarshipFee(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm font-bold outline-none focus:border-primary-500"
                />
                <span className="text-[11px] text-foreground-400 mt-1 block">
                  Discounted price for students who score ≥70% on /exam (e.g. ৳5,000)
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground-700 mb-1">
                  Official WhatsApp & Call Support Hotline *
                </label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="01318964063"
                  className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm font-bold outline-none focus:border-primary-500"
                />
                <span className="text-[11px] text-foreground-400 mt-1 block">
                  Students will be directed to this WhatsApp number for verification & inquiries
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground-700 mb-1">
                  Default Live Class Platform
                </label>
                <select
                  value={defaultPlatform}
                  onChange={(e) => setDefaultPlatform(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm bg-white outline-none focus:border-primary-500 font-bold"
                >
                  <option value="GOOGLE_MEET">Google Meet (Recommended for Live Batches)</option>
                  <option value="ZOOM">Zoom Meeting</option>
                  <option value="MS_TEAMS">Microsoft Teams</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-background-100">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-soft-sm transition-colors flex items-center gap-2"
            >
              <i className="ri-save-line" />
              <span>Save Academy & Payment Settings</span>
            </button>
          </div>
        </form>
      </div>
    </PortalLayout>
  );
}
