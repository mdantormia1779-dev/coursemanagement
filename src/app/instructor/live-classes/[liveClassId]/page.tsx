'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import PortalLayout from '@/components/portal/PortalLayout';
import { INSTRUCTOR_NAV } from '@/data/portalNavs';
import {
  LiveClassItem,
  LiveClassStatus,
  getStoredLiveClasses,
  saveStoredLiveClasses,
  savePublishedRecordingLesson,
  formatDuration,
  formatFileSize,
  ENROLLED_STUDENTS_SAMPLE,
} from '@/lib/liveClassService';
import { queueAndSendLiveClassEmails } from '@/lib/emailQueueService';

export default function MeetingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const liveClassId = params?.liveClassId as string;

  const [liveClass, setLiveClass] = useState<LiveClassItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Recording upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedVideoFile, setUploadedVideoFile] = useState<{
    name: string;
    size: number;
    url: string;
  } | null>(null);

  // Load live class
  useEffect(() => {
    const list = getStoredLiveClasses();
    const found = list.find((c) => c.id === liveClassId);
    if (found) {
      setLiveClass(found);
    }
  }, [liveClassId]);

  if (!liveClass) {
    return (
      <PortalLayout
        role="instructor"
        userName="Tanvir Hossain"
        userRoleLabel="Lead Instructor"
        navItems={INSTRUCTOR_NAV}
      >
        <div className="bg-white p-12 rounded-2xl border border-neutral-200 text-center space-y-4">
          <i className="ri-error-warning-line text-4xl text-amber-500"></i>
          <h2 className="text-xl font-bold text-foreground-900">Meeting Record Not Found</h2>
          <p className="text-xs text-foreground-500">
            The requested live class does not exist or has been removed.
          </p>
          <Link
            href="/instructor/live-classes"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-semibold"
          >
            ← Back to Live Classes
          </Link>
        </div>
      </PortalLayout>
    );
  }

  const handleCopyMeetingUrl = () => {
    navigator.clipboard.writeText(liveClass.meetingUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleStatusChange = (newStatus: LiveClassStatus) => {
    // Check invalid transitions
    if (liveClass.status === 'CANCELLED' && newStatus === 'LIVE') {
      alert('A cancelled class cannot be transitioned to LIVE.');
      return;
    }
    if (liveClass.status === 'COMPLETED' && newStatus === 'SCHEDULED') {
      alert('A completed class cannot be reverted to SCHEDULED.');
      return;
    }

    const updated = {
      ...liveClass,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };

    setLiveClass(updated);
    const list = getStoredLiveClasses();
    const updatedList = list.map((c) => (c.id === updated.id ? updated : c));
    saveStoredLiveClasses(updatedList);

    setNotificationMsg(`Class status updated to ${newStatus}`);
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  // Recording Video Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Invalid format. Please upload MP4, WebM, or MOV video.');
      return;
    }

    // Limit check: 2GB
    if (file.size > 2 * 1024 * 1024 * 1024) {
      setUploadError('File size exceeds 2 GB limit.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    // Simulate progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);

          const sampleVideoUrl =
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
          setUploadedVideoFile({
            name: file.name,
            size: file.size,
            url: sampleVideoUrl,
          });

          // Mark recording as AVAILABLE (ready to publish)
          const updated: LiveClassItem = {
            ...liveClass,
            recordingStatus: 'AVAILABLE',
            recordingUrl: sampleVideoUrl,
            recordingDuration: 5120, // ~1h 25m
            recordingSize: file.size,
            recordingThumbnail:
              'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop',
            updatedAt: new Date().toISOString(),
          };

          setLiveClass(updated);
          const list = getStoredLiveClasses();
          saveStoredLiveClasses(list.map((c) => (c.id === updated.id ? updated : c)));

          return 100;
        }
        return prev + 20;
      });
    }, 400);
  };

  // Publish Recording to Module Content
  const handlePublishRecording = async () => {
    if (liveClass.recordingStatus !== 'AVAILABLE') {
      alert('Recording must be uploaded and processed before publishing.');
      return;
    }

    // 1. Inject recording as lesson inside the selected course module
    savePublishedRecordingLesson({
      id: `rec-lesson-${liveClass.id}`,
      liveClassId: liveClass.id,
      courseId: liveClass.courseId,
      courseSlug: liveClass.courseSlug,
      sectionId: liveClass.sectionId,
      title: `${liveClass.title} — Live Recording`,
      duration: formatDuration(liveClass.recordingDuration || 3600),
      durationSeconds: liveClass.recordingDuration || 3600,
      videoUrl: liveClass.recordingUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: liveClass.recordingThumbnail,
      instructorName: liveClass.instructorName,
      publishedAt: new Date().toISOString(),
    });

    // 2. Dispatch automated email notifications to all enrolled students
    const emailLogs = await queueAndSendLiveClassEmails({
      liveClass: { ...liveClass, recordingStatus: 'PUBLISHED', isPublished: true },
      eventType: 'RECORDING_PUBLISHED',
    });

    // 3. Update live class status
    const updated: LiveClassItem = {
      ...liveClass,
      recordingStatus: 'PUBLISHED',
      isPublished: true,
      emailLogs: [...emailLogs, ...liveClass.emailLogs],
      updatedAt: new Date().toISOString(),
    };

    setLiveClass(updated);
    const list = getStoredLiveClasses();
    saveStoredLiveClasses(list.map((c) => (c.id === updated.id ? updated : c)));

    setNotificationMsg(
      `Recording published successfully! Added as a video lesson inside "${liveClass.sectionTitle}" and emails sent to enrolled students.`
    );
  };

  const enrolledStudents =
    ENROLLED_STUDENTS_SAMPLE[liveClass.courseSlug] ||
    ENROLLED_STUDENTS_SAMPLE['complete-nextjs-development'];

  return (
    <PortalLayout
      role="instructor"
      userName="Tanvir Hossain"
      userRoleLabel="Lead Instructor"
      navItems={INSTRUCTOR_NAV}
    >
      <div className="space-y-6">
        {/* Breadcrumb & Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground-500">
            <Link href="/instructor/live-classes" className="hover:text-primary-600">
              Live Classes
            </Link>
            <span>/</span>
            <span className="text-foreground-800 line-clamp-1">{liveClass.title}</span>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {liveClass.status === 'SCHEDULED' && (
              <button
                onClick={() => handleStatusChange('LIVE')}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-soft flex items-center gap-1.5 transition-colors"
              >
                <i className="ri-play-line text-sm"></i>
                <span>Start Class Now</span>
              </button>
            )}

            {liveClass.status === 'LIVE' && (
              <button
                onClick={() => handleStatusChange('COMPLETED')}
                className="px-4 py-2 bg-neutral-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-soft flex items-center gap-1.5 transition-colors"
              >
                <i className="ri-stop-line text-sm"></i>
                <span>End Class Session</span>
              </button>
            )}

            <a
              href={liveClass.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-soft flex items-center gap-1.5 transition-colors"
            >
              <i className="ri-external-link-line"></i>
              <span>Join Live Meeting</span>
            </a>
          </div>
        </div>

        {notificationMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-950 text-sm font-semibold flex items-center justify-between shadow-soft animate-scale-up">
            <div className="flex items-center gap-2">
              <i className="ri-checkbox-circle-fill text-emerald-600 text-lg"></i>
              <span>{notificationMsg}</span>
            </div>
            <button
              onClick={() => setNotificationMsg(null)}
              className="text-emerald-700 hover:text-emerald-900"
            >
              &times;
            </button>
          </div>
        )}

        {/* Meeting Header Banner */}
        <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-soft-sm p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                liveClass.status === 'LIVE'
                  ? 'bg-rose-600 text-white animate-pulse'
                  : liveClass.status === 'SCHEDULED'
                  ? 'bg-blue-100 text-blue-800'
                  : liveClass.status === 'COMPLETED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-neutral-200 text-neutral-700'
              }`}
            >
              {liveClass.status === 'LIVE' ? '● LIVE NOW' : liveClass.status}
            </span>

            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-neutral-100 text-neutral-800">
              {liveClass.platform}
            </span>

            <span className="text-xs text-foreground-500 font-medium">
              Created on {new Date(liveClass.createdAt).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground-900">
            {liveClass.title}
          </h1>

          <p className="text-sm text-foreground-600 max-w-3xl leading-relaxed">
            {liveClass.description || 'No description provided for this session.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-neutral-100 text-xs">
            <div>
              <span className="text-foreground-500 block">Course:</span>
              <strong className="text-foreground-900 text-sm">{liveClass.courseTitle}</strong>
            </div>

            <div>
              <span className="text-foreground-500 block">Module / Section:</span>
              <strong className="text-primary-700 text-sm">{liveClass.sectionTitle}</strong>
            </div>

            <div>
              <span className="text-foreground-500 block">Date & Time:</span>
              <strong className="text-foreground-900 text-sm">
                {liveClass.scheduledDate} ({liveClass.startTime} — {liveClass.endTime})
              </strong>
              <div className="text-[11px] text-neutral-400">{liveClass.timezone}</div>
            </div>

            <div>
              <span className="text-foreground-500 block">Enrolled Students:</span>
              <strong className="text-emerald-700 text-sm">{enrolledStudents.length} Students</strong>
            </div>
          </div>
        </div>

        {/* Meeting Credentials & Join Link Card */}
        <div className="bg-neutral-900 text-white rounded-2xl p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <i className="ri-shield-keyhole-line text-primary-400 text-xl"></i>
              <h3 className="font-bold text-sm text-white">Live Meeting Access Credentials</h3>
            </div>
            <span className="text-xs text-neutral-400">Protected for Enrolled Students Only</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 md:col-span-2 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase text-neutral-400 block font-sans">
                  Meeting URL
                </span>
                <span className="text-primary-300 font-bold truncate block">{liveClass.meetingUrl}</span>
              </div>
              <button
                onClick={handleCopyMeetingUrl}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-sans text-xs rounded-lg transition-colors flex items-center gap-1 shrink-0"
              >
                <i className={copiedLink ? 'ri-check-line text-emerald-400' : 'ri-file-copy-line'}></i>
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-[10px] uppercase text-neutral-400 block font-sans">
                Passcode / ID
              </span>
              <span className="text-white font-bold">
                {liveClass.meetingPassword || liveClass.meetingId || 'None required'}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION: Recording Upload & Module Publishing */}
        <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-soft-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <i className="ri-film-line text-primary-600 text-xl"></i>
                <h3 className="text-lg font-bold text-foreground-900">
                  Class Recording & Module Content Integration
                </h3>
              </div>
              <p className="text-xs text-foreground-500 mt-0.5">
                Upload the class recording after the session concludes. When published, it immediately appears
                inside &quot;{liveClass.sectionTitle}&quot; for students.
              </p>
            </div>

            <span
              className={`px-3 py-1 text-xs font-bold rounded-full self-start sm:self-auto ${
                liveClass.recordingStatus === 'PUBLISHED'
                  ? 'bg-purple-100 text-purple-800'
                  : liveClass.recordingStatus === 'AVAILABLE'
                  ? 'bg-emerald-100 text-emerald-800'
                  : liveClass.recordingStatus === 'PROCESSING'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-neutral-100 text-neutral-600'
              }`}
            >
              Recording: {liveClass.recordingStatus}
            </span>
          </div>

          {liveClass.recordingStatus === 'PUBLISHED' ? (
            /* Published View */
            <div className="p-5 bg-purple-50/70 border border-purple-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-purple-200 text-purple-900 rounded-md">
                  Active Module Lesson
                </span>
                <h4 className="font-bold text-sm text-purple-950">
                  Recording is Published in {liveClass.sectionTitle}
                </h4>
                <p className="text-xs text-purple-800">
                  Duration: {formatDuration(liveClass.recordingDuration || 3600)} &bull; File Size: {formatFileSize(liveClass.recordingSize || 742180400)}
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <Link
                  href={`/student/learning/${liveClass.courseSlug}`}
                  target="_blank"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-soft flex items-center gap-1.5 transition-colors"
                >
                  <i className="ri-play-circle-line"></i>
                  <span>Preview in Student Classroom</span>
                </Link>
              </div>
            </div>
          ) : liveClass.recordingStatus === 'AVAILABLE' ? (
            /* Uploaded & Ready to Publish View */
            <div className="p-6 bg-emerald-50/70 border border-emerald-300 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xl shadow-soft">
                    <i className="ri-check-line"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-emerald-950">
                      Recording Uploaded & Ready for Publishing
                    </h4>
                    <p className="text-xs text-emerald-800">
                      File processed successfully. Click Publish to release this video lesson to students.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handlePublishRecording}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-soft flex items-center gap-1.5 transition-transform hover:scale-105"
                >
                  <i className="ri-upload-cloud-line"></i>
                  <span>Publish to Course Module & Notify</span>
                </button>
              </div>

              {/* Video Player Preview */}
              <div className="rounded-xl overflow-hidden bg-black max-w-xl">
                <video
                  controls
                  className="w-full h-64 object-cover"
                  src={liveClass.recordingUrl}
                />
              </div>
            </div>
          ) : (
            /* Upload Dropzone */
            <div className="space-y-4">
              <div className="border-2 border-dashed border-neutral-300 hover:border-primary-500 rounded-2xl p-8 text-center transition-colors bg-neutral-50/50">
                <input
                  type="file"
                  id="video-upload"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
                <label
                  htmlFor="video-upload"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center text-2xl shadow-soft-sm">
                    <i className="ri-video-upload-line"></i>
                  </div>
                  <span className="font-bold text-sm text-foreground-900">
                    Click to Choose Video or Drag & Drop
                  </span>
                  <p className="text-xs text-foreground-500 max-w-sm">
                    Upload MP4, WebM, or MOV class recordings (up to 2 GB). Automatically prepared for streaming.
                  </p>
                </label>

                {isUploading && (
                  <div className="mt-4 max-w-md mx-auto space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-primary-700">
                      <span>Uploading Recording...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-primary-600 h-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {uploadError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl">
                  {uploadError}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Enrolled Students & Attendance Log */}
        <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-soft-sm p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-foreground-900">
                Enrolled Students & Attendance Records
              </h3>
              <p className="text-xs text-foreground-500">
                Students authorized to attend and their session join telemetry.
              </p>
            </div>
            <span className="text-xs font-bold text-primary-700 bg-primary-50 px-3 py-1 rounded-full border border-primary-200">
              {enrolledStudents.length} Active Enrollments
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 text-xs font-bold text-foreground-600 uppercase">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Enrolled Date</th>
                  <th className="py-3 px-4">Attendance Status</th>
                  <th className="py-3 px-4">Join Time</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Device</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs">
                {enrolledStudents.map((st) => {
                  const att = liveClass.attendances?.find((a) => a.studentId === st.id);
                  return (
                    <tr key={st.id} className="hover:bg-neutral-50">
                      <td className="py-3 px-4">
                        <div className="font-bold text-foreground-900">{st.name}</div>
                        <div className="text-[11px] text-foreground-500">{st.email}</div>
                      </td>
                      <td className="py-3 px-4 text-foreground-600">{st.enrolledDate}</td>
                      <td className="py-3 px-4">
                        {att ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            ✓ ATTENDED
                          </span>
                        ) : liveClass.status === 'COMPLETED' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-600">
                            ABSENT
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                            ENROLLED
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-foreground-700">
                        {att ? new Date(att.joinedAt).toLocaleTimeString() : '—'}
                      </td>
                      <td className="py-3 px-4 text-foreground-700">
                        {att ? formatDuration(att.durationSeconds) : '—'}
                      </td>
                      <td className="py-3 px-4 text-foreground-500">{att ? att.deviceInfo : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Email Notification Audit Log */}
        <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-soft-sm p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-foreground-900">Email Notification Audit Logs</h3>
              <p className="text-xs text-foreground-500">
                Automated delivery tracking, retries, and dispatch timestamps.
              </p>
            </div>
            <span className="text-xs font-semibold text-foreground-600">
              {liveClass.emailLogs?.length || 0} Total Notifications Logged
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 text-xs font-bold text-foreground-600 uppercase">
                <tr>
                  <th className="py-3 px-4">Recipient</th>
                  <th className="py-3 px-4">Event Type</th>
                  <th className="py-3 px-4">Delivery Status</th>
                  <th className="py-3 px-4">Attempts</th>
                  <th className="py-3 px-4">Sent At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs">
                {liveClass.emailLogs?.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-50">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-foreground-900">{log.recipientName}</div>
                      <div className="text-[11px] text-foreground-500">{log.recipientEmail}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] font-bold text-primary-700">
                      {log.eventType}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-foreground-700">{log.attemptCount}</td>
                    <td className="py-3 px-4 text-foreground-500">
                      {log.sentAt ? new Date(log.sentAt).toLocaleString() : 'Queued'}
                    </td>
                  </tr>
                ))}

                {(!liveClass.emailLogs || liveClass.emailLogs.length === 0) && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-neutral-400">
                      No notifications have been queued for this meeting yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
