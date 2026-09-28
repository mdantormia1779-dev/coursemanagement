'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PortalLayout from '@/components/portal/PortalLayout';
import { INSTRUCTOR_NAV } from '@/data/portalNavs';
import {
  LiveClassItem,
  LiveClassPlatform,
  LiveClassStatus,
  COURSE_MODULES,
  getStoredLiveClasses,
  saveStoredLiveClasses,
  isValidMeetingUrl,
  savePublishedRecordingLesson,
  formatDuration,
} from '@/lib/liveClassService';
import { queueAndSendLiveClassEmails } from '@/lib/emailQueueService';

export default function InstructorLiveClassesPage() {
  const [classes, setClasses] = useState<LiveClassItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State for creating / scheduling new live class
  const [selectedModuleId, setSelectedModuleId] = useState(COURSE_MODULES[0].id);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [platform, setPlatform] = useState<LiveClassPlatform>('GOOGLE_MEET');
  const [meetingUrl, setMeetingUrl] = useState('');
  const [meetingId, setMeetingId] = useState('');
  const [meetingPassword, setMeetingPassword] = useState('');
  const [scheduledDate, setScheduledDate] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [startTime, setStartTime] = useState('20:00');
  const [endTime, setEndTime] = useState('21:30');
  const [timezone, setTimezone] = useState('Asia/Dhaka');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notificationBanner, setNotificationBanner] = useState<string | null>(null);

  // Load from persistent store
  useEffect(() => {
    setClasses(getStoredLiveClasses());
  }, []);

  const selectedModule =
    COURSE_MODULES.find((m) => m.id === selectedModuleId) || COURSE_MODULES[0];

  // Filtered live classes
  const filteredClasses = classes.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.sectionTitle.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (selectedCourseFilter !== 'ALL' && c.courseSlug !== selectedCourseFilter) return false;
    if (selectedStatusFilter !== 'ALL' && c.status !== selectedStatusFilter) return false;

    return true;
  });

  // Calculate Metrics
  const scheduledCount = classes.filter((c) => c.status === 'SCHEDULED').length;
  const liveCount = classes.filter((c) => c.status === 'LIVE').length;
  const completedCount = classes.filter((c) => c.status === 'COMPLETED').length;
  const publishedRecordingsCount = classes.filter((c) => c.recordingStatus === 'PUBLISHED').length;

  // Handle Create / Schedule Live Class
  const handleCreateLiveClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validate meeting URL
    const validation = isValidMeetingUrl(meetingUrl, platform);
    if (!validation.valid) {
      setFormError(validation.message || 'Invalid meeting URL');
      return;
    }

    setIsSubmitting(true);

    const newClass: LiveClassItem = {
      id: `lc-${Date.now()}`,
      courseId: selectedModule.courseId,
      courseTitle: selectedModule.courseTitle,
      courseSlug: selectedModule.courseSlug,
      sectionId: selectedModule.id,
      sectionTitle: selectedModule.title,
      instructorId: 'inst-current',
      instructorName: 'Tanvir Hossain',
      instructorEmail: 'tanvir@learnx.com',
      title,
      description,
      platform,
      meetingUrl: meetingUrl.trim(),
      meetingId: meetingId.trim() || undefined,
      meetingPassword: meetingPassword.trim() || undefined,
      scheduledDate,
      startTime,
      endTime,
      timezone,
      status: 'SCHEDULED',
      recordingStatus: 'NOT_AVAILABLE',
      isPublished: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      enrolledStudentsCount: 5,
      attendances: [],
      emailLogs: [],
    };

    // Dispatch automated email notifications to all enrolled students
    const emailLogs = await queueAndSendLiveClassEmails({
      liveClass: newClass,
      eventType: 'LIVE_CLASS_SCHEDULED',
    });

    newClass.emailLogs = emailLogs;

    const updatedList = [newClass, ...classes];
    setClasses(updatedList);
    saveStoredLiveClasses(updatedList);

    setIsSubmitting(false);
    setIsCreateModalOpen(false);

    // Reset Form
    setTitle('');
    setDescription('');
    setMeetingUrl('');
    setMeetingId('');
    setMeetingPassword('');

    setNotificationBanner(
      `Live Class "${newClass.title}" scheduled successfully! Automated emails queued and sent to ${emailLogs.length} enrolled students.`
    );
    setTimeout(() => setNotificationBanner(null), 6000);
  };

  // State Transition Handlers
  const handleStartClass = (id: string) => {
    const updated = classes.map((c) => {
      if (c.id === id) {
        if (c.status === 'CANCELLED') return c; // Invalid transition
        return { ...c, status: 'LIVE' as LiveClassStatus, updatedAt: new Date().toISOString() };
      }
      return c;
    });
    setClasses(updated);
    saveStoredLiveClasses(updated);
  };

  const handleEndClass = (id: string) => {
    const updated = classes.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          status: 'COMPLETED' as LiveClassStatus,
          recordingStatus: c.recordingStatus,
          updatedAt: new Date().toISOString(),
        };
      }
      return c;
    });
    setClasses(updated);
    saveStoredLiveClasses(updated);
  };

  const handleCancelClass = async (id: string) => {
    const target = classes.find((c) => c.id === id);
    if (!target) return;
    if (target.status === 'COMPLETED') {
      alert('A completed class cannot be cancelled.');
      return;
    }

    const reason = prompt('Please enter the cancellation reason for enrolled students:');
    if (reason === null) return;

    const emailLogs = await queueAndSendLiveClassEmails({
      liveClass: { ...target, status: 'CANCELLED', cancellationReason: reason },
      eventType: 'LIVE_CLASS_CANCELLED',
      customNote: reason,
    });

    const updated = classes.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          status: 'CANCELLED' as LiveClassStatus,
          cancelledAt: new Date().toISOString(),
          cancellationReason: reason,
          emailLogs: [...emailLogs, ...c.emailLogs],
          updatedAt: new Date().toISOString(),
        };
      }
      return c;
    });

    setClasses(updated);
    saveStoredLiveClasses(updated);
    setNotificationBanner(`Class cancelled. Cancellation emails dispatched to enrolled students.`);
    setTimeout(() => setNotificationBanner(null), 5000);
  };

  const handlePublishRecording = async (c: LiveClassItem) => {
    if (c.recordingStatus !== 'AVAILABLE') {
      alert('Recording must be ready and uploaded before publishing.');
      return;
    }

    // Save as course module lesson
    savePublishedRecordingLesson({
      id: `rec-lesson-${c.id}`,
      liveClassId: c.id,
      courseId: c.courseId,
      courseSlug: c.courseSlug,
      sectionId: c.sectionId,
      title: `${c.title} — Live Recording`,
      duration: formatDuration(c.recordingDuration || 3600),
      durationSeconds: c.recordingDuration || 3600,
      videoUrl: c.recordingUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: c.recordingThumbnail,
      instructorName: c.instructorName,
      publishedAt: new Date().toISOString(),
    });

    // Send email notification
    const emailLogs = await queueAndSendLiveClassEmails({
      liveClass: { ...c, recordingStatus: 'PUBLISHED', isPublished: true },
      eventType: 'RECORDING_PUBLISHED',
    });

    const updated = classes.map((item) => {
      if (item.id === c.id) {
        return {
          ...item,
          recordingStatus: 'PUBLISHED' as const,
          isPublished: true,
          emailLogs: [...emailLogs, ...item.emailLogs],
          updatedAt: new Date().toISOString(),
        };
      }
      return item;
    });

    setClasses(updated);
    saveStoredLiveClasses(updated);
    setNotificationBanner(
      `Recording published successfully! Added as a video lesson inside "${c.sectionTitle}" and email alerts sent to enrolled students.`
    );
    setTimeout(() => setNotificationBanner(null), 6000);
  };

  const getPlatformBadge = (platform: LiveClassPlatform) => {
    switch (platform) {
      case 'GOOGLE_MEET':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-green-50 text-green-700 border border-green-200">
            <i className="ri-video-chat-line text-green-600"></i> Google Meet
          </span>
        );
      case 'ZOOM':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
            <i className="ri-zoom-in-line text-blue-600"></i> Zoom Meeting
          </span>
        );
      case 'MS_TEAMS':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-purple-50 text-purple-700 border border-purple-200">
            <i className="ri-microsoft-line text-purple-600"></i> MS Teams
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-neutral-100 text-neutral-700 border border-neutral-200">
            <i className="ri-broadcast-line"></i> Web Meeting
          </span>
        );
    }
  };

  const getStatusBadge = (status: LiveClassStatus) => {
    switch (status) {
      case 'SCHEDULED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800">
            <i className="ri-calendar-check-line"></i> SCHEDULED
          </span>
        );
      case 'LIVE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-extrabold rounded-full bg-rose-600 text-white animate-pulse shadow-soft">
            <span className="w-2 h-2 rounded-full bg-white"></span> LIVE NOW
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800">
            <i className="ri-checkbox-circle-line"></i> COMPLETED
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full bg-neutral-200 text-neutral-700">
            <i className="ri-close-circle-line"></i> CANCELLED
          </span>
        );
    }
  };

  return (
    <PortalLayout
      role="instructor"
      userName="Tanvir Hossain"
      userRoleLabel="Lead Full-Stack Instructor"
      navItems={INSTRUCTOR_NAV}
    >
      <div className="space-y-6">
        {/* Notification Banner */}
        {notificationBanner && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-950 text-sm font-semibold flex items-center justify-between shadow-soft animate-scale-up">
            <div className="flex items-center gap-2.5">
              <i className="ri-checkbox-circle-fill text-emerald-600 text-lg"></i>
              <span>{notificationBanner}</span>
            </div>
            <button
              onClick={() => setNotificationBanner(null)}
              className="text-emerald-700 hover:text-emerald-900"
            >
              &times;
            </button>
          </div>
        )}

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                <i className="ri-broadcast-line mr-1 text-indigo-600"></i> Live Course Hub
              </span>
              <span className="text-xs text-foreground-500">Live Classes & Module Recordings</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground-900 mt-1">
              Live Class & Interactive Meeting Management
            </h1>
            <p className="text-sm text-foreground-600">
              Schedule interactive sessions, trigger automated student email notifications, and publish recordings directly to course modules.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-xl shadow-soft flex items-center gap-2 transition-all hover:scale-[1.01] self-start sm:self-auto"
          >
            <i className="ri-add-line text-lg"></i>
            <span>Schedule Live Class</span>
          </button>
        </div>

        {/* 4 KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-soft-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground-500 uppercase tracking-wider">
                Upcoming Sessions
              </span>
              <span className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <i className="ri-calendar-event-line text-lg"></i>
              </span>
            </div>
            <div className="text-2xl font-extrabold text-foreground-900 mt-2">{scheduledCount}</div>
            <p className="text-xs text-blue-600 mt-1">Ready with meeting links</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-soft-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground-500 uppercase tracking-wider">
                Live Now
              </span>
              <span className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <i className="ri-record-circle-line text-lg"></i>
              </span>
            </div>
            <div className="text-2xl font-extrabold text-rose-600 mt-2">{liveCount}</div>
            <p className="text-xs text-rose-500 mt-1">Active live classroom</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-soft-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground-500 uppercase tracking-wider">
                Completed Meetings
              </span>
              <span className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <i className="ri-history-line text-lg"></i>
              </span>
            </div>
            <div className="text-2xl font-extrabold text-foreground-900 mt-2">{completedCount}</div>
            <p className="text-xs text-emerald-600 mt-1">Attendance logs stored</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-soft-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground-500 uppercase tracking-wider">
                Published Recordings
              </span>
              <span className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <i className="ri-film-line text-lg"></i>
              </span>
            </div>
            <div className="text-2xl font-extrabold text-purple-700 mt-2">{publishedRecordingsCount}</div>
            <p className="text-xs text-purple-600 mt-1">Added to course modules</p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCourseFilter}
              onChange={(e) => setSelectedCourseFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold border border-neutral-200 rounded-xl bg-neutral-50 text-foreground-800 focus:ring-2 focus:ring-primary-500"
            >
              <option value="ALL">All Courses</option>
              <option value="full-stack-mern-development">Full Stack MERN Development</option>
              <option value="complete-nextjs-development">Complete Next.js Development</option>
              <option value="modern-react-masterclass">Modern React Masterclass</option>
            </select>

            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold border border-neutral-200 rounded-xl bg-neutral-50 text-foreground-800 focus:ring-2 focus:ring-primary-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="LIVE">Live Now</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div className="relative w-full md:w-72">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs"></i>
            <input
              type="text"
              placeholder="Search session title, course, module..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Live Classes Meeting Table */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-soft-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-xs font-bold text-foreground-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Live Class Topic & Course</th>
                  <th className="py-3.5 px-4">Module / Section</th>
                  <th className="py-3.5 px-4">Date & Schedule</th>
                  <th className="py-3.5 px-4">Platform & Link</th>
                  <th className="py-3.5 px-4">Class Status</th>
                  <th className="py-3.5 px-4">Recording</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredClasses.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-4 px-4 max-w-xs">
                      <Link
                        href={`/instructor/live-classes/${item.id}`}
                        className="font-bold text-foreground-900 hover:text-primary-600 line-clamp-1"
                      >
                        {item.title}
                      </Link>
                      <div className="text-xs text-foreground-500 line-clamp-1 mt-0.5">
                        {item.courseTitle}
                      </div>
                      <div className="text-[11px] text-foreground-400 mt-1 flex items-center gap-1.5">
                        <i className="ri-user-star-line text-neutral-400"></i>
                        <span>{item.enrolledStudentsCount} enrolled students notified</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-xs font-medium text-foreground-700 max-w-[200px]">
                      <span className="line-clamp-2">{item.sectionTitle}</span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-xs">
                      <div className="font-bold text-foreground-900">{item.scheduledDate}</div>
                      <div className="text-foreground-500 mt-0.5">
                        {item.startTime} — {item.endTime}
                      </div>
                      <div className="text-[10px] text-neutral-400 mt-0.5">{item.timezone}</div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      {getPlatformBadge(item.platform)}
                      <div className="mt-1">
                        <a
                          href={item.meetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-mono text-primary-600 hover:underline flex items-center gap-1 truncate max-w-[160px]"
                        >
                          <i className="ri-external-link-line"></i>
                          <span>{item.meetingUrl.replace('https://', '')}</span>
                        </a>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">{getStatusBadge(item.status)}</td>

                    <td className="py-4 px-4 whitespace-nowrap text-xs">
                      {item.recordingStatus === 'PUBLISHED' ? (
                        <span className="px-2.5 py-1 font-bold text-[11px] bg-purple-100 text-purple-800 rounded-full inline-flex items-center gap-1">
                          <i className="ri-checkbox-circle-fill text-purple-600"></i> Module Lesson
                        </span>
                      ) : item.recordingStatus === 'AVAILABLE' ? (
                        <button
                          onClick={() => handlePublishRecording(item)}
                          className="px-2.5 py-1 font-bold text-[11px] bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-full inline-flex items-center gap-1 transition-colors"
                        >
                          <i className="ri-upload-cloud-line"></i> Publish Recording
                        </button>
                      ) : item.recordingStatus === 'PROCESSING' ? (
                        <span className="px-2.5 py-1 text-[11px] font-semibold bg-neutral-100 text-neutral-700 rounded-full">
                          Processing Video...
                        </span>
                      ) : (
                        <span className="text-neutral-400 text-xs italic">Not Recorded</span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {item.status === 'SCHEDULED' && (
                          <button
                            onClick={() => handleStartClass(item.id)}
                            title="Start Class Now (Live)"
                            className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-soft flex items-center gap-1"
                          >
                            <i className="ri-play-line"></i>
                            <span>Start</span>
                          </button>
                        )}

                        {item.status === 'LIVE' && (
                          <button
                            onClick={() => handleEndClass(item.id)}
                            title="End Class"
                            className="px-2.5 py-1.5 bg-neutral-800 hover:bg-black text-white rounded-lg text-xs font-bold shadow-soft flex items-center gap-1"
                          >
                            <i className="ri-stop-line"></i>
                            <span>End</span>
                          </button>
                        )}

                        <Link
                          href={`/instructor/live-classes/${item.id}`}
                          title="Manage Meeting & Recording"
                          className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <i className="ri-settings-4-line"></i>
                          <span>Manage</span>
                        </Link>

                        {item.status === 'SCHEDULED' && (
                          <button
                            onClick={() => handleCancelClass(item.id)}
                            title="Cancel Class"
                            className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg transition-colors"
                          >
                            <i className="ri-close-circle-line text-base"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredClasses.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-foreground-500">
                      <i className="ri-broadcast-line text-3xl text-neutral-300 block mb-2"></i>
                      No live classes found matching criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Schedule New Live Class */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-soft-xl animate-scale-up space-y-4 max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                    <i className="ri-broadcast-line"></i>
                  </span>
                  <h3 className="text-lg font-bold text-foreground-900">
                    Schedule Live Class & Interactive Meeting
                  </h3>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-neutral-400 hover:text-neutral-600 text-xl leading-none"
                >
                  &times;
                </button>
              </div>

              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl">
                  {formError}
                </div>
              )}

              <form onSubmit={handleCreateLiveClass} className="space-y-4">
                {/* 1. Basic Information */}
                <div>
                  <h4 className="text-xs font-bold text-primary-700 uppercase tracking-wider mb-2">
                    1. Course & Module Selection
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-foreground-700 mb-1">
                        Course
                      </label>
                      <input
                        type="text"
                        disabled
                        value={selectedModule.courseTitle}
                        className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-xl bg-neutral-100 text-foreground-700 font-semibold cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-foreground-700 mb-1">
                        Select Module *
                      </label>
                      <select
                        required
                        value={selectedModuleId}
                        onChange={(e) => setSelectedModuleId(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 font-medium"
                      >
                        {COURSE_MODULES.map((mod) => (
                          <option key={mod.id} value={mod.id}>
                            [{mod.courseTitle.split(' ')[0]}] {mod.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground-700 mb-1">
                    Live Class Title *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. React Hooks — Live Session & State Management Deep Dive"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground-700 mb-1">
                    Description & Learning Outcomes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe the topics to be covered during this live class..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                  ></textarea>
                </div>

                {/* 2. Schedule */}
                <div className="border-t border-neutral-100 pt-3">
                  <h4 className="text-xs font-bold text-primary-700 uppercase tracking-wider mb-2">
                    2. Date, Time & Timezone
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-foreground-700 mb-1">
                        Scheduled Date *
                      </label>
                      <input
                        required
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-foreground-700 mb-1">
                        Start Time *
                      </label>
                      <input
                        required
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-foreground-700 mb-1">
                        End Time *
                      </label>
                      <input
                        required
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="block text-xs font-semibold text-foreground-700 mb-1">
                      Timezone
                    </label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="Asia/Dhaka">Asia/Dhaka (GMT+6 - Bangladesh Standard Time)</option>
                      <option value="Asia/Kolkata">Asia/Kolkata (GMT+5:30 - Indian Standard Time)</option>
                      <option value="UTC">UTC (Coordinated Universal Time)</option>
                      <option value="America/New_York">America/New_York (EST / EDT)</option>
                      <option value="Europe/London">Europe/London (GMT / BST)</option>
                    </select>
                  </div>
                </div>

                {/* 3. Meeting Platform & URL */}
                <div className="border-t border-neutral-100 pt-3">
                  <h4 className="text-xs font-bold text-primary-700 uppercase tracking-wider mb-2">
                    3. Meeting Platform & Credentials
                  </h4>

                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {[
                      { id: 'GOOGLE_MEET', label: 'Google Meet', icon: 'ri-video-chat-line' },
                      { id: 'ZOOM', label: 'Zoom', icon: 'ri-zoom-in-line' },
                      { id: 'MS_TEAMS', label: 'MS Teams', icon: 'ri-microsoft-line' },
                      { id: 'OTHER', label: 'Other', icon: 'ri-broadcast-line' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPlatform(p.id as LiveClassPlatform)}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                          platform === p.id
                            ? 'border-primary-600 bg-primary-50 text-primary-900 ring-1 ring-primary-500'
                            : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                        }`}
                      >
                        <i className={`${p.icon} text-base`}></i>
                        <span>{p.label}</span>
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground-700 mb-1">
                      Meeting URL *
                    </label>
                    <input
                      required
                      type="url"
                      placeholder={
                        platform === 'GOOGLE_MEET'
                          ? 'https://meet.google.com/xxx-xxxx-xxx'
                          : platform === 'ZOOM'
                          ? 'https://zoom.us/j/94827103829'
                          : 'https://teams.microsoft.com/...'
                      }
                      value={meetingUrl}
                      onChange={(e) => setMeetingUrl(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="block text-xs font-semibold text-foreground-700 mb-1">
                        Optional Meeting ID
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 948 2710 3829"
                        value={meetingId}
                        onChange={(e) => setMeetingId(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-foreground-700 mb-1">
                        Optional Meeting Password / Passcode
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. learnx2026"
                        value={meetingPassword}
                        onChange={(e) => setMeetingPassword(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Email Notification Notice */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2">
                  <i className="ri-mail-send-line text-blue-600 text-base mt-0.5"></i>
                  <div>
                    <strong>Automated Email Notification:</strong> All enrolled students will immediately receive
                    an email containing the class title, schedule, meeting instructions, and secure join link.
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl shadow-soft flex items-center gap-1.5 transition-transform hover:scale-105"
                  >
                    {isSubmitting ? (
                      <span>Queueing Emails...</span>
                    ) : (
                      <>
                        <i className="ri-send-plane-line"></i>
                        <span>Publish & Notify Enrolled Students</span>
                      </>
                    )}
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
