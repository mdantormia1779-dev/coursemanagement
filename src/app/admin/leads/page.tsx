'use client';

import { useState } from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { ADMIN_NAV } from '@/data/portalNavs';
import { INITIAL_LEADS, INITIAL_BATCHES, LeadItem, LeadStatus } from '@/data/leadsAndBatches';
import Link from 'next/link';

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadItem[]>(INITIAL_LEADS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'all' | 'calls' | 'excuses' | 'booked'>('all');

  // Modal states
  const [editModalLead, setEditModalLead] = useState<LeadItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Lead form state
  const [newLeadForm, setNewLeadForm] = useState({
    name: '',
    phone: '',
    whatsapp: '',
    address: '',
    education: '',
    source: 'WhatsApp Ad' as const,
    targetCourse: INITIAL_BATCHES[0].courseTitle,
    targetBatch: INITIAL_BATCHES[0].name.split('—')[0].trim(),
    status: 'CALL_RECEIVED' as LeadStatus,
    excuseOrReason: '',
    notes: '',
    followUpDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    assignedCounselor: 'Nahid Hasan',
  });

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      lead.whatsapp.includes(searchQuery) ||
      (lead.studentIdCode && lead.studentIdCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (lead.address && lead.address.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedStatus !== 'ALL' && lead.status !== selectedStatus) return false;

    if (activeTab === 'calls') {
      return ['CALL_RECEIVED', 'CALL_NOT_RECEIVED'].includes(lead.status);
    }
    if (activeTab === 'excuses') {
      return ['PRICE_PROBLEM', 'NEED_DISCOUNT', 'NEED_2_3_DAYS'].includes(lead.status);
    }
    if (activeTab === 'booked') {
      return ['SEAT_BOOKED', 'FULL_ENROLLED'].includes(lead.status);
    }

    return true;
  });

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'CALL_RECEIVED':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">কল রিসিভ হয়েছে</span>;
      case 'CALL_NOT_RECEIVED':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">ফোন ধরেনি / মিসড কল</span>;
      case 'PRICE_PROBLEM':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">টাকার সমস্যা</span>;
      case 'NEED_DISCOUNT':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">ডিসকাউন্ট চেয়েছিল</span>;
      case 'NEED_2_3_DAYS':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">২-৩ দিন সময় চেয়েছে</span>;
      case 'EXAM_PENDING':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">স্কলারশিপ এক্সাম বাকি</span>;
      case 'EXAM_COMPLETED':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-cyan-100 text-cyan-800">এক্সাম কমপ্লিট (সিট পেন্ডিং)</span>;
      case 'SEAT_BOOKED':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 font-bold">সিট বুকড (১০০০৳ পেইড)</span>;
      case 'FULL_ENROLLED':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-teal-100 text-teal-800 font-bold">ফুল পেমেন্ট কনফার্ম</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-100 text-rose-800">বাতিল / অনাগ্রহী</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-neutral-100 text-neutral-800">{status}</span>;
    }
  };

  const handleUpdateStatusAndExcuse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModalLead) return;

    setLeads((prev) =>
      prev.map((l) => (l.id === editModalLead.id ? { ...editModalLead } : l))
    );
    setEditModalLead(null);
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: LeadItem = {
      id: `lead-${Date.now()}`,
      ...newLeadForm,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setLeads([newEntry, ...leads]);
    setIsAddModalOpen(false);
    setNewLeadForm({
      name: '',
      phone: '',
      whatsapp: '',
      address: '',
      education: '',
      source: 'WhatsApp Ad',
      targetCourse: INITIAL_BATCHES[0].courseTitle,
      targetBatch: INITIAL_BATCHES[0].name.split('—')[0].trim(),
      status: 'CALL_RECEIVED',
      excuseOrReason: '',
      notes: '',
      followUpDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      assignedCounselor: 'Nahid Hasan',
    });
  };

  // Quick stats
  const totalLeads = leads.length;
  const callsNotReceived = leads.filter((l) => l.status === 'CALL_NOT_RECEIVED').length;
  const excuseLeads = leads.filter((l) => ['PRICE_PROBLEM', 'NEED_DISCOUNT', 'NEED_2_3_DAYS'].includes(l.status)).length;
  const seatBookedCount = leads.filter((l) => ['SEAT_BOOKED', 'FULL_ENROLLED'].includes(l.status)).length;

  return (
    <PortalLayout
      role="admin"
      userName="Hassan Mahmud"
      userRoleLabel="Super Admin / Admission Head"
      navItems={ADMIN_NAV}
    >
      <div className="space-y-6">
        {/* Top Header & CTAs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                <i className="ri-whatsapp-line mr-1 text-green-600"></i> WhatsApp Call Pipeline
              </span>
              <span className="text-xs text-foreground-500">Live Call & CRM Engine</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground-900 mt-1">
              WhatsApp Call & Lead Management
            </h1>
            <p className="text-sm text-foreground-600">
              Manage incoming calls, track student excuses, follow-ups, and convert leads into ৳1,000 seat bookings.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl shadow-soft flex items-center gap-2 transition-colors"
            >
              <i className="ri-user-add-line text-lg"></i>
              + New WhatsApp Lead
            </button>
            <Link
              href="/admin/admissions"
              className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl shadow-soft flex items-center gap-2 transition-colors"
            >
              <i className="ri-id-card-line text-lg"></i>
              Manual Admission Form
            </Link>
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-soft-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground-500 uppercase tracking-wider">Total Leads</span>
              <span className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <i className="ri-contacts-book-line text-lg"></i>
              </span>
            </div>
            <div className="text-2xl font-bold text-foreground-900 mt-2">{totalLeads}</div>
            <p className="text-xs text-foreground-500 mt-1">From Video Ads & WhatsApp</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-soft-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground-500 uppercase tracking-wider">Missed / Not Received</span>
              <span className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <i className="ri-phone-missed-line text-lg"></i>
              </span>
            </div>
            <div className="text-2xl font-bold text-amber-700 mt-2">{callsNotReceived}</div>
            <p className="text-xs text-amber-600 mt-1">Requires evening callback</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-soft-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground-500 uppercase tracking-wider">Price / Time Excuses</span>
              <span className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <i className="ri-time-line text-lg"></i>
              </span>
            </div>
            <div className="text-2xl font-bold text-purple-700 mt-2">{excuseLeads}</div>
            <p className="text-xs text-purple-600 mt-1">Offer ৳1,000 seat booking</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-soft-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground-500 uppercase tracking-wider">Seats Confirmed</span>
              <span className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <i className="ri-checkbox-circle-line text-lg"></i>
              </span>
            </div>
            <div className="text-2xl font-bold text-emerald-700 mt-2">{seatBookedCount}</div>
            <p className="text-xs text-emerald-600 mt-1">৳1,000 partial or full paid</p>
          </div>
        </div>

        {/* Filters, Tabs & Search */}
        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-soft-sm space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* View tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl overflow-x-auto">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'all'
                    ? 'bg-white text-foreground-900 shadow-soft-xs'
                    : 'text-foreground-600 hover:text-foreground-900'
                }`}
              >
                All Pipeline ({leads.length})
              </button>
              <button
                onClick={() => setActiveTab('calls')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'calls'
                    ? 'bg-white text-foreground-900 shadow-soft-xs'
                    : 'text-foreground-600 hover:text-foreground-900'
                }`}
              >
                📞 Call Log Tracker
              </button>
              <button
                onClick={() => setActiveTab('excuses')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'excuses'
                    ? 'bg-white text-foreground-900 shadow-soft-xs'
                    : 'text-foreground-600 hover:text-foreground-900'
                }`}
              >
                ⏳ Excuses & Need Time ({excuseLeads})
              </button>
              <button
                onClick={() => setActiveTab('booked')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'booked'
                    ? 'bg-white text-foreground-900 shadow-soft-xs'
                    : 'text-foreground-600 hover:text-foreground-900'
                }`}
              >
                ✅ Seats Booked ({seatBookedCount})
              </button>
            </div>

            {/* Status dropdown & Search */}
            <div className="flex items-center gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 text-xs font-medium border border-neutral-200 rounded-xl bg-neutral-50 text-foreground-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="CALL_RECEIVED">Call Received</option>
                <option value="CALL_NOT_RECEIVED">Call Not Received</option>
                <option value="PRICE_PROBLEM">Price Problem</option>
                <option value="NEED_DISCOUNT">Need Discount</option>
                <option value="NEED_2_3_DAYS">Need 2-3 Days Time</option>
                <option value="EXAM_COMPLETED">Exam Done</option>
                <option value="SEAT_BOOKED">Seat Booked (1000tk)</option>
                <option value="FULL_ENROLLED">Full Enrolled</option>
                <option value="REJECTED">Rejected</option>
              </select>

              <div className="relative w-64">
                <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-foreground-400 text-xs"></i>
                <input
                  type="text"
                  placeholder="Search name, phone, SID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-soft-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50/80 border-b border-neutral-200 text-xs font-semibold text-foreground-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Student & Contact</th>
                  <th className="py-3.5 px-4">Address & Education</th>
                  <th className="py-3.5 px-4">Target Course / Batch</th>
                  <th className="py-3.5 px-4">Call Status</th>
                  <th className="py-3.5 px-4">Excuse / Reason / Notes</th>
                  <th className="py-3.5 px-4">Follow-up</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-semibold text-foreground-900">{lead.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-foreground-600 flex items-center gap-1">
                          <i className="ri-phone-line text-neutral-400"></i> {lead.phone}
                        </span>
                        {lead.studentIdCode && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-primary-50 text-primary-700 border border-primary-200 rounded">
                            {lead.studentIdCode}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-xs">
                      <div className="text-foreground-800 font-medium">{lead.address || '—'}</div>
                      <div className="text-foreground-500 mt-0.5">{lead.education || 'Academic N/A'}</div>
                    </td>

                    <td className="py-4 px-4 text-xs">
                      <div className="font-medium text-foreground-900 line-clamp-1">{lead.targetCourse}</div>
                      <div className="text-primary-600 font-semibold mt-0.5">{lead.targetBatch}</div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      {getStatusBadge(lead.status)}
                      {lead.paidAmount ? (
                        <div className="text-[11px] font-bold text-emerald-700 mt-1">
                          Paid: ৳{lead.paidAmount.toLocaleString()} | Due: ৳{lead.dueAmount}
                        </div>
                      ) : null}
                    </td>

                    <td className="py-4 px-4 max-w-xs">
                      {lead.excuseOrReason ? (
                        <div className="text-xs bg-amber-50/80 border border-amber-200 text-amber-900 px-2.5 py-1.5 rounded-lg font-medium">
                          <span className="font-bold text-[10px] uppercase text-amber-700 block">Excuse / Call note:</span>
                          {lead.excuseOrReason}
                        </div>
                      ) : (
                        <span className="text-xs text-neutral-400">No excuse noted</span>
                      )}
                      {lead.notes && (
                        <div className="text-[11px] text-foreground-500 mt-1 italic line-clamp-1">
                          Note: {lead.notes}
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4 text-xs whitespace-nowrap">
                      <div className="font-semibold text-foreground-800">{lead.followUpDate}</div>
                      <div className="text-foreground-500 text-[11px]">Counselor: {lead.assignedCounselor}</div>
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* WhatsApp Direct Chat Button */}
                        <a
                          href={`https://wa.me/88${lead.whatsapp.replace(/^0/, '')}?text=${encodeURIComponent(
                            `হ্যালো ${lead.name}, LearnX LMS থেকে যোগাযোগ করছি আপনার কোর্স এডমিশন প্রসঙ্গে।`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open WhatsApp Chat"
                          className="w-8 h-8 rounded-lg bg-green-50 text-green-600 hover:bg-green-600 hover:text-white flex items-center justify-center transition-colors"
                        >
                          <i className="ri-whatsapp-line text-base"></i>
                        </a>

                        {/* Direct Phone Call Button */}
                        <a
                          href={`tel:${lead.phone}`}
                          title="Call Phone"
                          className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors"
                        >
                          <i className="ri-phone-line text-base"></i>
                        </a>

                        {/* Edit Status & Excuse */}
                        <button
                          onClick={() => setEditModalLead(lead)}
                          title="Update Excuse & Status"
                          className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white flex items-center justify-center transition-colors"
                        >
                          <i className="ri-edit-line text-base"></i>
                        </button>

                        {/* Convert to Manual Admission */}
                        <Link
                          href={`/admin/admissions?name=${encodeURIComponent(lead.name)}&phone=${encodeURIComponent(
                            lead.phone
                          )}&whatsapp=${encodeURIComponent(lead.whatsapp)}&address=${encodeURIComponent(
                            lead.address || ''
                          )}&education=${encodeURIComponent(lead.education || '')}&course=${encodeURIComponent(
                            lead.targetCourse || ''
                          )}`}
                          title="Register & Confirm Seat"
                          className="px-2.5 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-soft-xs transition-colors"
                        >
                          <i className="ri-user-follow-line text-xs"></i>
                          <span>Admit</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredLeads.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-foreground-500">
                      <i className="ri-inbox-line text-3xl text-neutral-300 block mb-2"></i>
                      No leads match the specified filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Edit Status & Excuse */}
        {editModalLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-soft-xl animate-scale-up space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <h3 className="text-lg font-bold text-foreground-900">
                  Update Call Status & Excuse — {editModalLead.name}
                </h3>
                <button
                  onClick={() => setEditModalLead(null)}
                  className="text-neutral-400 hover:text-neutral-600 text-xl leading-none"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleUpdateStatusAndExcuse} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground-700 mb-1">
                    Call / Lead Status
                  </label>
                  <select
                    value={editModalLead.status}
                    onChange={(e) =>
                      setEditModalLead({ ...editModalLead, status: e.target.value as LeadStatus })
                    }
                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="CALL_RECEIVED">কল রিসিভ হয়েছে (Call Received)</option>
                    <option value="CALL_NOT_RECEIVED">ফোন ধরেনি / মিসড কল (Call Not Received)</option>
                    <option value="PRICE_PROBLEM">টাকার সমস্যা (Price Problem)</option>
                    <option value="NEED_DISCOUNT">ডিসকাউন্ট চেয়েছিল (Need Discount)</option>
                    <option value="NEED_2_3_DAYS">২ বা ৩ দিন সময় চেয়েছে (Need 2-3 Days Time)</option>
                    <option value="EXAM_PENDING">স্কলারশিপ পরীক্ষা দিতে চায় (Exam Pending)</option>
                    <option value="EXAM_COMPLETED">পরীক্ষা শেষ, সিট বুকিং বাকি (Exam Completed)</option>
                    <option value="SEAT_BOOKED">১০০০৳ দিয়ে সিট বুক করেছে (Seat Booked)</option>
                    <option value="FULL_ENROLLED">ফুল পেমেন্ট করে এনরোল করেছে (Full Enrolled)</option>
                    <option value="REJECTED">ভর্তি হতে পারবে না / বাতিল (Rejected)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground-700 mb-1">
                    Student Excuse / Call Discussion Reason
                  </label>
                  <textarea
                    rows={3}
                    placeholder="যেমন: 'টাকার সমস্যা, ১০০০৳ দিয়ে সিট বুক করতে চায়', '২ দিন পর আব্বুর বেতন হলে জানাবে'..."
                    value={editModalLead.excuseOrReason || ''}
                    onChange={(e) =>
                      setEditModalLead({ ...editModalLead, excuseOrReason: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-foreground-700 mb-1">
                      Next Follow-up Date
                    </label>
                    <input
                      type="date"
                      value={editModalLead.followUpDate}
                      onChange={(e) =>
                        setEditModalLead({ ...editModalLead, followUpDate: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground-700 mb-1">
                      Assigned Counselor
                    </label>
                    <input
                      type="text"
                      value={editModalLead.assignedCounselor}
                      onChange={(e) =>
                        setEditModalLead({ ...editModalLead, assignedCounselor: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground-700 mb-1">
                    Internal Notes / Payment Reference
                  </label>
                  <input
                    type="text"
                    placeholder="bKash TrxID or special notes..."
                    value={editModalLead.notes || ''}
                    onChange={(e) => setEditModalLead({ ...editModalLead, notes: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setEditModalLead(null)}
                    className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-sm font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl shadow-soft"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Add New WhatsApp Lead */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-soft-xl animate-scale-up space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <h3 className="text-lg font-bold text-foreground-900">
                  Record New WhatsApp Call / Lead
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-neutral-400 hover:text-neutral-600 text-xl leading-none"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleCreateLead} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-foreground-700 mb-1">
                      Student Name *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Shakil Ahmed"
                      value={newLeadForm.name}
                      onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="017XXXXXXXX"
                      value={newLeadForm.phone}
                      onChange={(e) =>
                        setNewLeadForm({
                          ...newLeadForm,
                          phone: e.target.value,
                          whatsapp: newLeadForm.whatsapp ? newLeadForm.whatsapp : e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-foreground-700 mb-1">
                      WhatsApp Number
                    </label>
                    <input
                      type="text"
                      placeholder="017XXXXXXXX"
                      value={newLeadForm.whatsapp}
                      onChange={(e) => setNewLeadForm({ ...newLeadForm, whatsapp: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground-700 mb-1">
                      Address / City
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dhanmondi, Dhaka"
                      value={newLeadForm.address}
                      onChange={(e) => setNewLeadForm({ ...newLeadForm, address: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground-700 mb-1">
                    Education / Academic Background
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. HSC 2024 / CSE 2nd Year / Non-tech graduate"
                    value={newLeadForm.education}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, education: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-foreground-700 mb-1">
                      Target Course
                    </label>
                    <select
                      value={newLeadForm.targetCourse}
                      onChange={(e) => setNewLeadForm({ ...newLeadForm, targetCourse: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                    >
                      {INITIAL_BATCHES.map((b) => (
                        <option key={b.id} value={b.courseTitle}>
                          {b.courseTitle}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground-700 mb-1">
                      Target Batch
                    </label>
                    <select
                      value={newLeadForm.targetBatch}
                      onChange={(e) => setNewLeadForm({ ...newLeadForm, targetBatch: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                    >
                      {INITIAL_BATCHES.map((b) => (
                        <option key={b.id} value={b.name.split('—')[0].trim()}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground-700 mb-1">
                    Call Status
                  </label>
                  <select
                    value={newLeadForm.status}
                    onChange={(e) =>
                      setNewLeadForm({ ...newLeadForm, status: e.target.value as LeadStatus })
                    }
                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="CALL_RECEIVED">কল রিসিভ হয়েছে (Call Received)</option>
                    <option value="CALL_NOT_RECEIVED">ফোন ধরেনি / মিসড কল (Call Not Received)</option>
                    <option value="PRICE_PROBLEM">টাকার সমস্যা (Price Problem)</option>
                    <option value="NEED_DISCOUNT">ডিসকাউন্ট চেয়েছিল (Need Discount)</option>
                    <option value="NEED_2_3_DAYS">২ বা ৩ দিন সময় চেয়েছে (Need 2-3 Days Time)</option>
                    <option value="EXAM_PENDING">স্কলারশিপ পরীক্ষা দিতে চায় (Exam Pending)</option>
                    <option value="SEAT_BOOKED">১০০০৳ দিয়ে সিট বুক করেছে (Seat Booked)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground-700 mb-1">
                    Call Excuse / Reason / Special Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="ক্যান্ডিডেটের সমস্যা বা কোনো এক্সকিউজ থাকলে এখানে লিখুন..."
                    value={newLeadForm.excuseOrReason}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, excuseOrReason: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                  ></textarea>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-sm font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl shadow-soft"
                  >
                    Save Lead
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
