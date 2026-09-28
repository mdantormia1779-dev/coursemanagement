'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PortalLayout from '@/components/portal/PortalLayout';
import { STUDENT_NAV } from '@/data/portalNavs';
import {
  LiveClassItem,
  LiveClassStatus,
  getStoredLiveClasses,
  formatDuration,
  saveWatchProgress,
  getWatchProgress,
} from '@/lib/liveClassService';

export default function StudentLiveClassesPage() {
  const [classes, setClasses] = useState<LiveClassItem[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'recordings'>('upcoming');
  const [selectedRecording, setSelectedRecording] = useState<LiveClassItem | null>(null);

  // Video Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState('1x');
  const [watchedSeconds, setWatchedSeconds] = useState(0);
  const [duration, setDuration] = useState(5320); // sample duration
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setClasses(getStoredLiveClasses());
  }, []);

  // Filter classes
  const upcomingClasses = classes.filter(
    (c) => c.status === 'SCHEDULED' || c.status === 'LIVE'
  );
  const recordedClasses = classes.filter(
    (c) => c.recordingStatus === 'PUBLISHED' || c.recordingStatus === 'AVAILABLE'
  );

  // Generate Google Calendar Add Link
  const getGoogleCalendarUrl = (item: LiveClassItem) => {
    const title = encodeURIComponent(`Live Class: ${item.title} — ${item.courseTitle}`);
    const details = encodeURIComponent(
      `Course: ${item.courseTitle}\nModule: ${item.sectionTitle}\nInstructor: ${item.instructorName}\nPlatform: ${item.platform}\nJoin Link: ${item.meetingUrl}\nPasscode: ${item.meetingPassword || 'None'}`
    );
    const location = encodeURIComponent(item.meetingUrl);
    // Rough date formatting YYYYMMDD
    const dateFormatted = item.scheduledDate.replace(/-/g, '');
    const startHour = item.startTime.replace(':', '');
    const endHour = item.endTime.replace(':', '');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateFormatted}T${startHour}00Z/${dateFormatted}T${endHour}00Z&details=${details}&location=${location}`;
  };

  const handleOpenRecording = (item: LiveClassItem) => {
    setSelectedRecording(item);
    const prev = getWatchProgress('usr-sarah', item.id);
    if (prev) {
      setWatchedSeconds(prev.watchedSeconds);
      setIsCompleted(prev.completed);
    } else {
      setWatchedSeconds(0);
      setIsCompleted(false);
    }
  };

  // Video progress tracker
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    const current = Math.floor(video.currentTime);
    const total = Math.floor(video.duration) || duration;
    setWatchedSeconds(current);
    setDuration(total);

    const percentage = Math.round((current / total) * 100);
    const completed = percentage >= 75;
    if (completed && !isCompleted) {
      setIsCompleted(true);
    }

    if (selectedRecording) {
      saveWatchProgress({
        studentId: 'usr-sarah',
        liveClassId: selectedRecording.id,
        lessonId: `rec-lesson-${selectedRecording.id}`,
        watchedSeconds: current,
        durationSeconds: total,
        percentage,
        completed,
        lastPosition: current,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const handleSpeedChange = (speed: string) => {
    setPlaybackSpeed(speed);
    const video = document.getElementById('recording-player') as HTMLVideoElement;
    if (video) {
      video.playbackRate = parseFloat(speed.replace('x', ''));
    }
  };

  return (
    <PortalLayout
      role="student"
      userName="Sarah Khan"
      userRoleLabel="Enrolled Student"
      navItems={STUDENT_NAV}
    >
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-100 text-primary-800 border border-primary-200">
                <i className="ri-broadcast-line mr-1 text-primary-600"></i> Live Interactive Classroom
              </span>
              <span className="text-xs text-foreground-500">Live Video Classes & Recorded Archives</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground-900 mt-1">
              Live Classes & Recordings
            </h1>
            <p className="text-sm text-foreground-600">
              Join live instructor video sessions, ask questions in real-time, and catch up on recorded classes.
            </p>
          </div>

          <Link
            href="/student/courses"
            className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <i className="ri-book-open-line"></i>
            <span>My Enrolled Courses</span>
          </Link>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 p-1.5 bg-neutral-100 rounded-2xl max-w-md">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'upcoming'
                ? 'bg-white text-foreground-900 shadow-soft-xs'
                : 'text-foreground-600 hover:text-foreground-900'
            }`}
          >
            <i className="ri-calendar-event-line text-sm text-primary-600"></i>
            <span>Upcoming & Live ({upcomingClasses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('recordings')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'recordings'
                ? 'bg-white text-foreground-900 shadow-soft-xs'
                : 'text-foreground-600 hover:text-foreground-900'
            }`}
          >
            <i className="ri-film-line text-sm text-purple-600"></i>
            <span>Recorded Classes ({recordedClasses.length})</span>
          </button>
        </div>

        {/* UPCOMING & LIVE TAB */}
        {activeTab === 'upcoming' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingClasses.map((item) => {
              const isLive = item.status === 'LIVE';

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-3xl border transition-all p-6 sm:p-7 flex flex-col justify-between shadow-soft-sm hover:shadow-soft-md ${
                    isLive
                      ? 'border-rose-400 ring-2 ring-rose-300'
                      : 'border-neutral-200/80 hover:border-primary-300'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
                          isLive
                            ? 'bg-rose-600 text-white animate-pulse'
                            : 'bg-primary-100 text-primary-800'
                        }`}
                      >
                        {isLive && <span className="w-2 h-2 rounded-full bg-white"></span>}
                        {isLive ? 'LIVE NOW' : 'UPCOMING CLASS'}
                      </span>

                      <span className="text-xs font-bold text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-lg">
                        {item.platform}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-primary-700 uppercase tracking-wider block">
                        {item.courseTitle}
                      </span>
                      <h3 className="text-lg font-bold text-foreground-900 mt-0.5">
                        {item.title}
                      </h3>
                      <div className="text-xs font-semibold text-foreground-500 mt-1">
                        Module: {item.sectionTitle}
                      </div>
                    </div>

                    <p className="text-xs text-foreground-600 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-foreground-500">Instructor:</span>
                        <strong className="text-foreground-900">{item.instructorName}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-foreground-500">Date:</span>
                        <strong className="text-foreground-900">{item.scheduledDate}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-foreground-500">Time:</span>
                        <strong className="text-foreground-900">
                          {item.startTime} — {item.endTime} ({item.timezone})
                        </strong>
                      </div>
                      {item.meetingPassword && (
                        <div className="flex items-center justify-between pt-1 border-t border-neutral-200/60 font-mono">
                          <span className="text-foreground-500">Meeting Passcode:</span>
                          <strong className="text-primary-700">{item.meetingPassword}</strong>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
                    <a
                      href={getGoogleCalendarUrl(item)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-3.5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <i className="ri-calendar-2-line"></i>
                      <span>Add to Google Calendar</span>
                    </a>

                    <a
                      href={item.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold shadow-soft flex items-center justify-center gap-2 transition-transform hover:scale-105 ${
                        isLive
                          ? 'bg-rose-600 hover:bg-rose-700 text-white animate-bounce'
                          : 'bg-primary-600 hover:bg-primary-700 text-white'
                      }`}
                    >
                      <i className="ri-video-chat-line text-base"></i>
                      <span>Join Live Class</span>
                    </a>
                  </div>
                </div>
              );
            })}

            {upcomingClasses.length === 0 && (
              <div className="col-span-2 bg-white rounded-3xl p-12 border border-neutral-200 text-center space-y-3">
                <i className="ri-calendar-check-line text-4xl text-neutral-300"></i>
                <h3 className="text-base font-bold text-foreground-800">
                  No live classes scheduled at this moment.
                </h3>
                <p className="text-xs text-foreground-500">
                  Your instructors will notify you by email whenever a new live workshop or Q&A session is announced.
                </p>
              </div>
            )}
          </div>
        )}

        {/* RECORDED SESSIONS TAB */}
        {activeTab === 'recordings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recordedClasses.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-neutral-200/80 shadow-soft-sm overflow-hidden flex flex-col justify-between hover:shadow-soft-md transition-all"
              >
                <div className="relative aspect-video bg-neutral-900 group cursor-pointer" onClick={() => handleOpenRecording(item)}>
                  <img
                    src={
                      item.recordingThumbnail ||
                      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop'
                    }
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center text-xl shadow-soft group-hover:scale-110 transition-transform">
                      <i className="ri-play-fill ml-0.5"></i>
                    </span>
                  </div>

                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-bold font-mono">
                    {formatDuration(item.recordingDuration || 3600)}
                  </span>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                      Module Recording
                    </span>
                    <h4 className="font-bold text-sm text-foreground-900 line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="text-xs text-foreground-500 line-clamp-1">{item.courseTitle}</p>
                    <div className="text-[11px] text-primary-700 font-semibold">{item.sectionTitle}</div>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-foreground-500">
                      Instructor: <strong>{item.instructorName}</strong>
                    </span>

                    <button
                      onClick={() => handleOpenRecording(item)}
                      className="px-3.5 py-1.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-soft flex items-center gap-1 transition-colors"
                    >
                      <i className="ri-play-circle-line"></i>
                      <span>Watch</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {recordedClasses.length === 0 && (
              <div className="col-span-3 bg-white rounded-3xl p-12 border border-neutral-200 text-center space-y-3">
                <i className="ri-film-line text-4xl text-neutral-300"></i>
                <h3 className="text-base font-bold text-foreground-800">
                  No class recordings published yet.
                </h3>
                <p className="text-xs text-foreground-500">
                  Completed live classes will be published here as soon as the instructor finishes processing them.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Modal: Interactive Video Player with Watch Progress Tracking */}
        {selectedRecording && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-neutral-900 text-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-soft-2xl animate-scale-up space-y-4">
              <div className="flex items-center justify-between p-4 px-6 border-b border-neutral-800">
                <div>
                  <span className="text-[10px] font-bold text-primary-400 uppercase tracking-wider block">
                    {selectedRecording.courseTitle} &bull; {selectedRecording.sectionTitle}
                  </span>
                  <h3 className="text-base font-bold text-white line-clamp-1">
                    {selectedRecording.title} — Recorded Live Class
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedRecording(null)}
                  className="text-neutral-400 hover:text-white text-2xl leading-none"
                >
                  &times;
                </button>
              </div>

              {/* Video Player */}
              <div className="px-6">
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-video shadow-soft-lg">
                  <video
                    id="recording-player"
                    controls
                    autoPlay
                    onTimeUpdate={handleTimeUpdate}
                    className="w-full h-full object-contain"
                    src={selectedRecording.recordingUrl}
                  />
                </div>
              </div>

              {/* Player Telemetry & Speed Controls */}
              <div className="p-4 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-neutral-800 text-xs text-neutral-300">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-400">Watch Progress:</span>
                    <strong className="text-emerald-400">
                      {Math.round((watchedSeconds / duration) * 100)}%
                    </strong>
                    {isCompleted && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        ✓ LESSON COMPLETED
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-neutral-400">Speed:</span>
                  {(['1x', '1.25x', '1.5x', '2x'] as const).map((spd) => (
                    <button
                      key={spd}
                      onClick={() => handleSpeedChange(spd)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        playbackSpeed === spd
                          ? 'bg-primary-600 text-white'
                          : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                      }`}
                    >
                      {spd}
                    </button>
                  ))}
                  <button
                    onClick={() => setSelectedRecording(null)}
                    className="ml-2 px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
