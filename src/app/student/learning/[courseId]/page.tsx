'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  getStoredLiveClasses,
  getPublishedRecordingLessons,
  LiveClassItem,
  PublishedRecordingLesson,
} from '@/lib/liveClassService';

interface LessonItem {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'quiz' | 'assignment' | 'live_class' | 'live_recording';
  completed: boolean;
  videoUrl?: string;
  liveMeetingUrl?: string;
  platform?: string;
  isLiveNow?: boolean;
}

interface SectionItem {
  id: string;
  title: string;
  lessons: LessonItem[];
}

export default function StudentLearningPage() {
  const params = useParams();
  const courseId = (params?.courseId as string) || 'complete-nextjs-development';

  // Video element and ambient background video refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrubBarRef = useRef<HTMLDivElement>(null);

  const [activeLessonId, setActiveLessonId] = useState('3-3');
  const [completedLessons, setCompletedLessons] = useState<string[]>([
    '1-1', '1-2', '1-3', '2-1', '2-2', '2-3', '3-1', '3-2'
  ]);
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'discussion' | 'resources' | 'schedule'>('overview');

  // Sidebar Collapse / Theater Mode state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  // Accordion Section Collapse state
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    'mod-next-1': true,
  });

  // Curriculum search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Live classes and published recordings state
  const [liveClasses, setLiveClasses] = useState<LiveClassItem[]>([]);
  const [publishedRecordings, setPublishedRecordings] = useState<PublishedRecordingLesson[]>([]);

  // =========================================================================
  // YOUTUBE PREMIUM PLAYER CUSTOM CONTROLS STATE
  // =========================================================================
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedTime, setBufferedTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState('1x');
  const [videoQuality, setVideoQuality] = useState('1080p HD Premium');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [areControlsVisible, setAreControlsVisible] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsView, setSettingsView] = useState<'main' | 'speed' | 'quality'>('main');
  const [isAutoplayNext, setIsAutoplayNext] = useState(true);
  const [isCCActive, setIsCCActive] = useState(false);
  const [isAmbientMode, setIsAmbientMode] = useState(true);
  const [centerAnimation, setCenterAnimation] = useState<'play' | 'pause' | 'rewind' | 'forward' | null>(null);
  const [scrubHoverTime, setScrubHoverTime] = useState<number | null>(null);
  const [scrubHoverX, setScrubHoverX] = useState<number>(0);
  const [watchProgressPercent, setWatchProgressPercent] = useState(0);

  // Video aspect ratio & fit mode (contain for original aspect, cover for fill)
  const [isVerticalVideo, setIsVerticalVideo] = useState(false);
  const [videoFitMode, setVideoFitMode] = useState<'contain' | 'cover'>('contain');

  // Student Notes state
  const [notes, setNotes] = useState(
    'useOptimistic creates immediate feedback for the user before server mutation resolves. Always handle rollback on failure!\n\nNote: Use revalidatePath inside Server Actions to purge client router cache.'
  );
  const [savedStatus, setSavedStatus] = useState(false);

  // Discussion state
  const [discussions, setDiscussions] = useState([
    {
      id: 1,
      author: 'Tanvir Ahmed',
      role: 'Student',
      time: '2 hours ago',
      question: 'Does revalidatePath purge the Full Route Cache on the client as well?',
      reply:
        'Yes, calling revalidatePath inside a Server Action updates the server cache and sends a fresh payload to re-render the client without a full page reload. — John Doe (Lead Instructor)',
    },
    {
      id: 2,
      author: 'Nabila Karim',
      role: 'Student',
      time: 'Yesterday',
      question: 'When should I use Server Actions instead of Route Handlers (API routes)?',
      reply:
        'Use Server Actions for form submissions, data mutations, and close component integration. Use Route Handlers when building public webhooks, mobile API endpoints, or file streams.',
    },
  ]);
  const [newQuestion, setNewQuestion] = useState('');

  // Load persistent live classes and published recordings
  useEffect(() => {
    setLiveClasses(getStoredLiveClasses());
    setPublishedRecordings(getPublishedRecordingLessons());
  }, []);

  // Upcoming live class for this course
  const upcomingLiveClass = liveClasses.find(
    (c) =>
      (c.courseSlug === courseId || courseId.includes('nextjs')) &&
      (c.status === 'SCHEDULED' || c.status === 'LIVE')
  );

  // Build merged course sections with lessons
  const sections = useMemo((): SectionItem[] => {
    const defaultLocalVideo = '/course-video.mp4';

    const baseSections: SectionItem[] = [
      {
        id: 'mod-next-1',
        title: 'Section 1: Foundations & Next.js 14 Setup',
        lessons: [
          { id: '1-1', title: '1. Course Overview & Prerequisites', duration: '08:20', type: 'video', completed: true, videoUrl: defaultLocalVideo },
          { id: '1-2', title: '2. Setting Up Next.js 14 with TypeScript & Tailwind', duration: '14:45', type: 'video', completed: true, videoUrl: defaultLocalVideo },
          { id: '1-3', title: '3. Understanding App Router Directory Conventions', duration: '18:10', type: 'video', completed: true, videoUrl: defaultLocalVideo },
        ],
      },
      {
        id: 'mod-next-2',
        title: 'Section 2: Server & Client Components Architecture',
        lessons: [
          { id: '2-1', title: '4. React Server Components Mental Model', duration: '22:30', type: 'video', completed: true, videoUrl: defaultLocalVideo },
          { id: '2-2', title: '5. When to use "use client" vs Server Components', duration: '15:15', type: 'video', completed: true, videoUrl: defaultLocalVideo },
          { id: '2-3', title: '6. Section 2 Knowledge Check Quiz', duration: '10 Qs', type: 'quiz', completed: true },
        ],
      },
      {
        id: 'mod-next-3',
        title: 'Section 3: Data Fetching, Server Actions & Caching',
        lessons: [
          { id: '3-1', title: '7. Server Actions for Form Submissions & Mutations', duration: '19:40', type: 'video', completed: true, videoUrl: defaultLocalVideo },
          { id: '3-2', title: '8. revalidatePath and revalidateTag Strategies', duration: '16:05', type: 'video', completed: true, videoUrl: defaultLocalVideo },
          { id: '3-3', title: '9. Optimistic UI Updates with useOptimistic', duration: '21:10', type: 'video', completed: false, videoUrl: defaultLocalVideo },
        ],
      },
      {
        id: 'mod-next-4',
        title: 'Section 4: Production Database & Authentication',
        lessons: [
          { id: '4-1', title: '10. Prisma ORM with PostgreSQL Setup', duration: '24:50', type: 'video', completed: false, videoUrl: defaultLocalVideo },
          { id: '4-2', title: '11. Multi-tenant Tenant Isolation Middleware', duration: '26:15', type: 'video', completed: false, videoUrl: defaultLocalVideo },
          { id: '4-3', title: '12. Mid-Term Capstone Assignment', duration: 'Project', type: 'assignment', completed: false },
        ],
      },
    ];

    // Inject live classes into respective sections
    liveClasses.forEach((lc) => {
      const targetSec = baseSections.find((s) => s.id === lc.sectionId) || baseSections[baseSections.length - 1];
      if (targetSec && (lc.status === 'SCHEDULED' || lc.status === 'LIVE')) {
        targetSec.lessons.push({
          id: `live-${lc.id}`,
          title: `[Live Class] ${lc.title}`,
          duration: `${lc.startTime} (${lc.scheduledDate})`,
          type: 'live_class',
          completed: false,
          liveMeetingUrl: lc.meetingUrl,
          platform: lc.platform,
          isLiveNow: lc.status === 'LIVE',
        });
      }
    });

    // Inject published recordings into respective sections
    publishedRecordings.forEach((rec) => {
      const targetSec = baseSections.find((s) => s.id === rec.sectionId) || baseSections[2];
      if (targetSec) {
        targetSec.lessons.push({
          id: `rec-${rec.id}`,
          title: `[Live Recording] ${rec.title}`,
          duration: rec.duration,
          type: 'live_recording',
          completed: completedLessons.includes(`rec-${rec.id}`),
          videoUrl: rec.videoUrl || defaultLocalVideo,
        });
      }
    });

    return baseSections;
  }, [liveClasses, publishedRecordings, completedLessons]);

  // Flattened lesson list
  const allLessons = useMemo(() => sections.flatMap((s) => s.lessons), [sections]);
  const activeIndex = allLessons.findIndex((l) => l.id === activeLessonId);
  const activeLesson = allLessons[activeIndex] || allLessons[0];
  const prevLesson = activeIndex > 0 ? allLessons[activeIndex - 1] : null;
  const nextLesson = activeIndex < allLessons.length - 1 ? allLessons[activeIndex + 1] : null;

  const totalCompletedCount = completedLessons.length;
  const totalLessonsCount = allLessons.length;
  const progressPercent = Math.min(100, Math.round((totalCompletedCount / Math.max(1, totalLessonsCount)) * 100));

  // Time formatter: mm:ss or hh:mm:ss
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Trigger brief center animation (play/pause/seek)
  const triggerCenterAnimation = (type: 'play' | 'pause' | 'rewind' | 'forward') => {
    setCenterAnimation(type);
    setTimeout(() => setCenterAnimation(null), 500);
  };

  // Play / Pause toggle with background sync
  const togglePlayPause = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      bgVideoRef.current?.play().catch(() => {});
      setIsPlaying(true);
      triggerCenterAnimation('play');
    } else {
      videoRef.current.pause();
      bgVideoRef.current?.pause();
      setIsPlaying(false);
      triggerCenterAnimation('pause');
    }
  }, []);

  // Seek relative seconds (+10s or -10s)
  const seekRelative = useCallback((seconds: number) => {
    if (!videoRef.current) return;
    const newTime = Math.min(Math.max(0, videoRef.current.currentTime + seconds), videoRef.current.duration || 0);
    videoRef.current.currentTime = newTime;
    if (bgVideoRef.current) bgVideoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    triggerCenterAnimation(seconds > 0 ? 'forward' : 'rewind');
  }, []);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  // Picture in Picture toggle
  const togglePictureInPicture = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (e) {
      console.error('PiP error:', e);
    }
  };

  // Volume & Mute handling
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      videoRef.current.muted = newVol === 0;
      setIsMuted(newVol === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.muted = false;
      videoRef.current.volume = volume || 0.8;
      setIsMuted(false);
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  // Playback speed change
  const handleSetSpeed = (spd: string) => {
    setPlaybackSpeed(spd);
    const rate = parseFloat(spd.replace('x', '').replace('Normal', '1'));
    if (videoRef.current && !isNaN(rate)) {
      videoRef.current.playbackRate = rate;
      if (bgVideoRef.current) bgVideoRef.current.playbackRate = rate;
    }
    setIsSettingsOpen(false);
  };

  // Next / Previous Lesson
  const handleNextLesson = useCallback(() => {
    if (nextLesson) {
      if (!completedLessons.includes(activeLessonId)) {
        setCompletedLessons((prev) => [...prev, activeLessonId]);
      }
      setActiveLessonId(nextLesson.id);
      const parentSection = sections.find((s) => s.lessons.some((l) => l.id === nextLesson.id));
      if (parentSection && collapsedSections[parentSection.id]) {
        setCollapsedSections((prev) => ({ ...prev, [parentSection.id]: false }));
      }
    }
  }, [nextLesson, completedLessons, activeLessonId, sections, collapsedSections]);

  const handlePrevLesson = () => {
    if (prevLesson) {
      setActiveLessonId(prevLesson.id);
      const parentSection = sections.find((s) => s.lessons.some((l) => l.id === prevLesson.id));
      if (parentSection && collapsedSections[parentSection.id]) {
        setCollapsedSections((prev) => ({ ...prev, [parentSection.id]: false }));
      }
    }
  };

  // Scrubber scrubbing click & hover
  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrubBarRef.current || !videoRef.current) return;
    const rect = scrubBarRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const targetTime = pos * (duration || 0);
    videoRef.current.currentTime = targetTime;
    if (bgVideoRef.current) bgVideoRef.current.currentTime = targetTime;
    setCurrentTime(targetTime);
  };

  const handleScrubberMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrubBarRef.current) return;
    const rect = scrubBarRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setScrubHoverTime(pos * (duration || 0));
    setScrubHoverX(e.clientX - rect.left);
  };

  // Metadata loaded (detect vertical video)
  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const v = e.currentTarget;
    setDuration(v.duration || 0);
    const isPortrait = v.videoHeight > v.videoWidth;
    setIsVerticalVideo(isPortrait);
  };

  // Video timeupdate & progress
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 1;
    setCurrentTime(cur);
    setDuration(dur);

    // Sync ambient background video if slight drift
    if (bgVideoRef.current && Math.abs(bgVideoRef.current.currentTime - cur) > 0.3) {
      bgVideoRef.current.currentTime = cur;
    }

    // Buffer tracking
    if (videoRef.current.buffered.length > 0) {
      try {
        const bufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
        setBufferedTime(bufferedEnd);
      } catch {}
    }

    const pct = Math.min(100, Math.round((cur / dur) * 100));
    setWatchProgressPercent(pct);

    // Auto mark as completed at 80%
    if (pct >= 80 && !completedLessons.includes(activeLessonId)) {
      setCompletedLessons((prev) => [...prev, activeLessonId]);
    }
  };

  // Video ended - auto play next lesson if autoplay enabled
  const handleVideoEnded = () => {
    setIsPlaying(false);
    if (!completedLessons.includes(activeLessonId)) {
      setCompletedLessons((prev) => [...prev, activeLessonId]);
    }
    if (isAutoplayNext && nextLesson) {
      handleNextLesson();
    }
  };

  // Controls auto-hide on inactivity
  const handleMouseMovePlayer = () => {
    setAreControlsVisible(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        if (!isSettingsOpen) {
          setAreControlsVisible(false);
        }
      }, 2500);
    }
  };

  // Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // YouTube Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'j':
        case 'arrowleft':
          e.preventDefault();
          seekRelative(-10);
          break;
        case 'l':
        case 'arrowright':
          e.preventDefault();
          seekRelative(10);
          break;
        case 'arrowup':
          e.preventDefault();
          handleVolumeChange(Math.min(1, volume + 0.1));
          break;
        case 'arrowdown':
          e.preventDefault();
          handleVolumeChange(Math.max(0, volume - 0.1));
          break;
        case 't':
          e.preventDefault();
          setIsTheaterMode((prev) => !prev);
          break;
        case 'c':
          e.preventDefault();
          setIsCCActive((prev) => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayPause, toggleFullscreen, seekRelative, volume]);

  const toggleSection = (sectionId: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleToggleAllSections = (expand: boolean) => {
    const newState: Record<string, boolean> = {};
    sections.forEach((s) => {
      newState[s.id] = !expand;
    });
    setCollapsedSections(newState);
  };

  const toggleComplete = (id: string) => {
    if (completedLessons.includes(id)) {
      setCompletedLessons((prev) => prev.filter((item) => item !== id));
    } else {
      setCompletedLessons((prev) => [...prev, id]);
    }
  };

  const handleSaveNotes = () => {
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    setDiscussions((prev) => [
      {
        id: Date.now(),
        author: 'Sarah Khan (You)',
        role: 'Enrolled Student',
        time: 'Just now',
        question: newQuestion,
        reply: 'Thank you for your question! Your instructor John Doe will review and respond shortly.',
      },
      ...prev,
    ]);
    setNewQuestion('');
  };

  const filteredSections = sections.map((sec) => {
    if (!searchQuery.trim()) return sec;
    const query = searchQuery.toLowerCase();
    const matchedLessons = sec.lessons.filter(
      (l) => l.title.toLowerCase().includes(query) || sec.title.toLowerCase().includes(query)
    );
    return { ...sec, lessons: matchedLessons };
  }).filter((sec) => sec.lessons.length > 0 || !searchQuery.trim());

  // Percentage calculations
  const playedPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedPercent = duration > 0 ? (bufferedTime / duration) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#090d16] text-white flex flex-col font-sans selection:bg-red-600 selection:text-white">
      
      {/* ========================================================================= */}
      {/* 1. TOP LEARNING NAVIGATION BAR */}
      {/* ========================================================================= */}
      <header className="h-16 bg-[#0c121e]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-40 shadow-soft-sm">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <Link
            href="/student/dashboard"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-neutral-300 hover:text-white transition-all border border-white/10 shrink-0"
            title="Back to Student Dashboard"
          >
            <i className="ri-arrow-left-line text-base text-primary-400" />
            <span className="hidden md:inline">Dashboard</span>
          </Link>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary-500/20 text-primary-400 border border-primary-500/30">
                Batch 24
              </span>
              <h1 className="text-xs sm:text-sm font-bold text-white truncate max-w-[180px] sm:max-w-xs md:max-w-md">
                Complete Next.js Development
              </h1>
            </div>
            <p className="text-[11px] text-neutral-400 hidden lg:block truncate mt-0.5">
              Current: <span className="text-white font-medium">{activeLesson?.title}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
            <div className="text-right">
              <div className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Progress</div>
              <div className="text-xs font-extrabold text-primary-400">{progressPercent}% ({totalCompletedCount}/{totalLessonsCount})</div>
            </div>
            <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-600 via-primary-500 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <Link
            href="/student/live-classes"
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-soft"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span className="hidden sm:inline">Live Classes</span>
          </Link>

          <button
            onClick={() => setIsTheaterMode(!isTheaterMode)}
            className={`p-2 rounded-xl border transition-all text-xs font-medium flex items-center gap-1.5 ${
              isTheaterMode
                ? 'bg-red-600 text-white border-red-500 shadow-soft'
                : 'bg-white/5 hover:bg-white/10 text-neutral-300 border-white/10'
            }`}
            title={isTheaterMode ? 'Exit Theater Mode' : 'Theater Mode (Focus Canvas)'}
          >
            <i className={isTheaterMode ? 'ri-tv-line' : 'ri-aspect-ratio-line'} />
            <span className="hidden xl:inline">{isTheaterMode ? 'Normal View' : 'Theater'}</span>
          </button>

          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
              isSidebarCollapsed
                ? 'bg-primary-600 hover:bg-primary-500 text-white border-primary-400 shadow-soft animate-pulse'
                : 'bg-white/5 hover:bg-white/10 text-neutral-200 border-white/10'
            }`}
            title={isSidebarCollapsed ? 'সিলেবাস খুলুন (Expand Syllabus)' : 'সাইডবার কলাপ্স করুন (Collapse Syllabus)'}
          >
            <i className={`text-base ${isSidebarCollapsed ? 'ri-layout-right-fill' : 'ri-layout-right-line'}`} />
            <span className="font-medium">
              {isSidebarCollapsed ? 'Show Curriculum' : 'Collapse Sidebar'}
            </span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. UPCOMING LIVE CLASS BANNER */}
      {/* ========================================================================= */}
      {upcomingLiveClass && (
        <div className="bg-gradient-to-r from-primary-950 via-indigo-950 to-primary-950 border-b border-primary-500/30 px-4 sm:px-6 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-soft-sm">
          <div className="flex items-center gap-3">
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-soft ${
                upcomingLiveClass.status === 'LIVE'
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-primary-500 text-white'
              }`}
            >
              <i className="ri-broadcast-fill text-xs" />
              <span>{upcomingLiveClass.status === 'LIVE' ? 'LIVE NOW' : 'UPCOMING LIVE'}</span>
            </span>
            <div className="truncate">
              <span className="font-bold text-white">{upcomingLiveClass.title}</span>
              <span className="text-primary-300 ml-2 hidden md:inline">
                &bull; {upcomingLiveClass.scheduledDate} ({upcomingLiveClass.startTime} - {upcomingLiveClass.endTime})
              </span>
            </div>
          </div>

          <a
            href={upcomingLiveClass.meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-1.5 bg-white hover:bg-primary-50 text-primary-950 font-extrabold rounded-xl shadow-soft flex items-center gap-1.5 shrink-0 transition-transform hover:scale-105 self-start sm:self-auto"
          >
            <i className="ri-video-chat-fill text-base text-primary-600" />
            <span>Join Live Meeting Room</span>
          </a>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MAIN LEARNING STUDIO (YOUTUBE PREMIUM PLAYER + SYLLABUS) */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Left Side: Video & Tabs */}
        <div className={`flex-1 flex flex-col overflow-y-auto bg-[#090d16] transition-all duration-300 ${isTheaterMode ? 'w-full' : ''}`}>
          
          {/* ===================================================================== */}
          {/* YOUTUBE-STYLE CUSTOM VIDEO PLAYER CONTAINER */}
          {/* ===================================================================== */}
          <div
            ref={playerContainerRef}
            onMouseMove={handleMouseMovePlayer}
            onMouseLeave={() => isPlaying && setAreControlsVisible(false)}
            className={`relative bg-black w-full flex items-center justify-center overflow-hidden select-none border-b border-white/5 ${
              isFullscreen ? 'fixed inset-0 z-50 h-screen w-screen' : ''
            }`}
          >
            
            {/* Ambient Background Video Blur for Vertical / 9:16 Video - Eliminates boring black sidebars */}
            {isAmbientMode && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
                <video
                  ref={bgVideoRef}
                  muted
                  playsInline
                  loop
                  className="w-full h-full object-cover blur-3xl opacity-40 scale-125 transition-opacity duration-700"
                  src={activeLesson?.videoUrl || '/course-video.mp4'}
                >
                  <source src="/course-video.mp4" type="video/mp4" />
                  <source src="/WhatsApp Video 2026-09-27 at 8.33.07 PM.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
              </div>
            )}

            <div className={`w-full relative flex items-center justify-center ${
              isFullscreen
                ? 'h-screen'
                : isTheaterMode
                ? 'aspect-[21/9] max-h-[78vh]'
                : 'aspect-video max-h-[70vh]'
            }`}>
              
              {/* HTML5 Video Element in Center */}
              <video
                ref={videoRef}
                key={activeLesson?.id}
                playsInline
                onClick={togglePlayPause}
                onDoubleClick={toggleFullscreen}
                onPlay={() => {
                  setIsPlaying(true);
                  bgVideoRef.current?.play().catch(() => {});
                }}
                onPause={() => {
                  setIsPlaying(false);
                  bgVideoRef.current?.pause();
                }}
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleVideoEnded}
                className={`relative z-10 w-full h-full cursor-pointer bg-transparent transition-all duration-300 ${
                  videoFitMode === 'cover' ? 'object-cover' : 'object-contain drop-shadow-2xl'
                }`}
                src={activeLesson?.videoUrl || '/course-video.mp4'}
                poster="https://readdy.ai/api/search-image?query=Clean%20minimal%20flat%20illustration%20of%20a%20developer%20frontend%20coding%20dashboard%20interface%20with%20code%20panels%20and%20indigo%20accent%20shapes%20on%20a%20soft%20light%20background%2C%20modern%20educational%20thumbnail%20style%2C%20no%20text&width=800&height=500&seq=course-nextjs-01&orientation=landscape"
              >
                <source src="/course-video.mp4" type="video/mp4" />
                <source src="/WhatsApp Video 2026-09-27 at 8.33.07 PM.mp4" type="video/mp4" />
              </video>

              {/* Central Ripple Feedback Animation on click (YouTube style) */}
              {centerAnimation && (
                <div className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center text-4xl pointer-events-none animate-ping z-20">
                  {centerAnimation === 'play' && <i className="ri-play-fill ml-1" />}
                  {centerAnimation === 'pause' && <i className="ri-pause-fill" />}
                  {centerAnimation === 'rewind' && (
                    <div className="text-center font-bold text-xs">
                      <i className="ri-replay-10-line text-2xl block" />
                      <span>-10s</span>
                    </div>
                  )}
                  {centerAnimation === 'forward' && (
                    <div className="text-center font-bold text-xs">
                      <i className="ri-forward-10-line text-2xl block" />
                      <span>+10s</span>
                    </div>
                  )}
                </div>
              )}

              {/* YouTube Captions Subtitle Demo Overlay */}
              {isCCActive && isPlaying && (
                <div className="absolute bottom-16 left-0 right-0 text-center pointer-events-none px-4 z-20">
                  <span className="inline-block bg-black/85 text-white font-medium text-xs sm:text-sm px-3 py-1 rounded shadow-lg border border-white/10">
                    [English CC] Welcome to Lesson {activeLesson?.title}
                  </span>
                </div>
              )}

              {/* Top Gradient Overlay with YouTube Premium Badge & Title */}
              <div
                className={`absolute top-0 left-0 right-0 p-4 sm:p-5 flex items-center justify-between bg-gradient-to-b from-black/85 via-black/40 to-transparent transition-opacity duration-300 pointer-events-none z-20 ${
                  areControlsVisible || !isPlaying ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="flex items-center gap-2.5 pointer-events-auto">
                  {/* YouTube Premium Style Logo */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 shadow-lg">
                    <span className="w-5 h-4 bg-red-600 rounded-md flex items-center justify-center text-white text-[10px] shadow-sm">
                      <i className="ri-play-fill ml-0.5" />
                    </span>
                    <span className="font-heading font-extrabold text-xs tracking-tight text-white">
                      LearnX
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-400 to-red-400 bg-clip-text text-transparent">
                      Premium
                    </span>
                  </div>

                  <span className="text-xs text-white/90 font-medium truncate max-w-xs sm:max-w-md hidden sm:inline">
                    {activeLesson?.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 pointer-events-auto">
                  {/* Aspect Ratio Toggle (Fit / Fill) for vertical videos */}
                  {isVerticalVideo && (
                    <button
                      onClick={() => setVideoFitMode(videoFitMode === 'contain' ? 'cover' : 'contain')}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-black/60 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md transition-all flex items-center gap-1 shadow-md"
                      title={videoFitMode === 'contain' ? 'Fill screen' : 'Fit original portrait'}
                    >
                      <i className={videoFitMode === 'contain' ? 'ri-fullscreen-line' : 'ri-aspect-ratio-line'} />
                      <span>{videoFitMode === 'contain' ? 'Fill Screen' : 'Fit Original'}</span>
                    </button>
                  )}

                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-emerald-400 border border-emerald-500/30">
                    1080p 60fps
                  </span>
                </div>
              </div>

              {/* =================================================================== */}
              {/* BOTTOM CONTROLS OVERLAY (YOUTUBE SIGNATURE LOOK) */}
              {/* =================================================================== */}
              <div
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent px-3 sm:px-5 pb-3 pt-8 transition-opacity duration-300 z-20 ${
                  areControlsVisible || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                
                {/* 1. YouTube Signature Red Scrubber Bar */}
                <div
                  ref={scrubBarRef}
                  onClick={handleScrubberClick}
                  onMouseMove={handleScrubberMouseMove}
                  onMouseLeave={() => setScrubHoverTime(null)}
                  className="relative w-full h-3 cursor-pointer flex items-center group/scrub mb-2"
                >
                  {/* Hover Floating Timestamp Tooltip */}
                  {scrubHoverTime !== null && (
                    <div
                      className="absolute -top-7 -translate-x-1/2 px-2 py-0.5 bg-black/90 text-white text-[11px] font-mono font-bold rounded border border-white/20 pointer-events-none shadow-md z-30"
                      style={{ left: `${scrubHoverX}px` }}
                    >
                      {formatTime(scrubHoverTime)}
                    </div>
                  )}

                  {/* Base Track */}
                  <div className="w-full h-[3px] group-hover/scrub:h-[5px] bg-white/20 rounded-full overflow-hidden transition-all relative">
                    {/* Buffer Bar */}
                    <div
                      className="absolute top-0 bottom-0 left-0 bg-white/35 rounded-full"
                      style={{ width: `${bufferedPercent}%` }}
                    />
                    {/* Played Bar (YouTube Red) */}
                    <div
                      className="absolute top-0 bottom-0 left-0 bg-[#ff0000] rounded-full"
                      style={{ width: `${playedPercent}%` }}
                    />
                  </div>

                  {/* Scrubber Knob Handle (Centered on track) */}
                  <div
                    className={`absolute w-3.5 h-3.5 bg-[#ff0000] rounded-full shadow-lg -translate-x-1/2 top-1/2 -translate-y-1/2 pointer-events-none transition-transform ${
                      areControlsVisible || scrubHoverTime !== null ? 'scale-100' : 'scale-0'
                    }`}
                    style={{ left: `${Math.min(99.5, Math.max(0.5, playedPercent))}%` }}
                  />
                </div>

                {/* 2. Control Buttons Bar */}
                <div className="flex items-center justify-between gap-3 text-white">
                  
                  {/* Left Controls: Play/Pause, Next, Volume, Time */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* Play / Pause Toggle */}
                    <button
                      onClick={togglePlayPause}
                      className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center text-white hover:text-red-500 transition-colors"
                      title={isPlaying ? 'Pause (k / space)' : 'Play (k / space)'}
                    >
                      <i className={`text-2xl ${isPlaying ? 'ri-pause-fill' : 'ri-play-fill'}`} />
                    </button>

                    {/* Next Video */}
                    <button
                      onClick={handleNextLesson}
                      disabled={!nextLesson}
                      className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center text-white/80 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                      title="Next lesson (Shift+N)"
                    >
                      <i className="ri-skip-forward-fill text-xl" />
                    </button>

                    {/* Volume Group with Expandable Slider - FIX: prevent range thumb from leaking when collapsed */}
                    <div className="flex items-center group/vol relative">
                      <button
                        onClick={toggleMute}
                        className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center text-white/90 hover:text-white transition-colors"
                        title={isMuted ? 'Unmute (m)' : 'Mute (m)'}
                      >
                        <i
                          className={`text-xl ${
                            isMuted || volume === 0
                              ? 'ri-volume-mute-fill text-red-500'
                              : volume < 0.5
                              ? 'ri-volume-down-fill'
                              : 'ri-volume-up-fill'
                          }`}
                        />
                      </button>
                      
                      {/* Container with overflow-hidden and w-0 ensures the range thumb is 100% hidden when not hovering */}
                      <div className="w-0 group-hover/vol:w-20 overflow-hidden transition-all duration-200 flex items-center">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={isMuted ? 0 : volume}
                          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                          className="w-20 h-1 accent-[#ff0000] cursor-pointer ml-1.5"
                        />
                      </div>
                    </div>

                    {/* Time Stamp */}
                    <div className="text-[11px] sm:text-xs font-mono text-white/90 font-medium select-none ml-1">
                      <span>{formatTime(currentTime)}</span>
                      <span className="mx-1 text-white/40">/</span>
                      <span className="text-white/60">{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Right Controls: Autoplay, CC, Settings, PiP, Theater, Fullscreen */}
                  <div className="flex items-center gap-1.5 sm:gap-2 relative">
                    
                    {/* Autoplay Toggle Switch */}
                    <button
                      onClick={() => setIsAutoplayNext(!isAutoplayNext)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                        isAutoplayNext
                          ? 'bg-red-600/30 text-red-400 border border-red-500/40'
                          : 'bg-white/10 text-neutral-400 hover:text-white'
                      }`}
                      title={isAutoplayNext ? 'Autoplay is ON' : 'Autoplay is OFF'}
                    >
                      <i className={`text-xs ${isAutoplayNext ? 'ri-play-circle-fill' : 'ri-pause-circle-line'}`} />
                      <span className="hidden sm:inline">Autoplay</span>
                    </button>

                    {/* Subtitles / CC Toggle */}
                    <button
                      onClick={() => setIsCCActive(!isCCActive)}
                      className={`w-7 h-7 rounded flex items-center justify-center text-xs font-extrabold border transition-colors ${
                        isCCActive
                          ? 'border-red-600 bg-red-600 text-white'
                          : 'border-white/30 text-white/70 hover:text-white hover:border-white'
                      }`}
                      title="Subtitles / Closed Captions (c)"
                    >
                      CC
                    </button>

                    {/* Settings Button */}
                    <div className="relative">
                      <button
                        onClick={() => {
                          setIsSettingsOpen(!isSettingsOpen);
                          setSettingsView('main');
                        }}
                        className={`w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center text-white/90 hover:text-white transition-transform ${
                          isSettingsOpen ? 'rotate-45 text-red-400' : ''
                        }`}
                        title="Settings"
                      >
                        <i className="ri-settings-3-fill text-lg" />
                      </button>

                      {/* YouTube Settings Pop-up Menu */}
                      {isSettingsOpen && (
                        <div className="absolute right-0 bottom-11 w-60 bg-[#1f1f1f]/95 backdrop-blur-md rounded-2xl border border-white/10 p-2 text-xs shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                          {settingsView === 'main' ? (
                            <div className="space-y-1">
                              <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                                Playback Settings
                              </div>

                              {/* Speed row */}
                              <button
                                onClick={() => setSettingsView('speed')}
                                className="w-full px-3 py-2 rounded-xl hover:bg-white/10 flex items-center justify-between text-left transition-colors"
                              >
                                <span className="flex items-center gap-2">
                                  <i className="ri-speed-line text-neutral-400" />
                                  <span>Playback Speed</span>
                                </span>
                                <span className="text-neutral-400 font-mono text-[11px] flex items-center">
                                  {playbackSpeed}
                                  <i className="ri-arrow-right-s-line text-base ml-1" />
                                </span>
                              </button>

                              {/* Quality row */}
                              <button
                                onClick={() => setSettingsView('quality')}
                                className="w-full px-3 py-2 rounded-xl hover:bg-white/10 flex items-center justify-between text-left transition-colors"
                              >
                                <span className="flex items-center gap-2">
                                  <i className="ri-hd-line text-neutral-400" />
                                  <span>Quality</span>
                                </span>
                                <span className="text-neutral-400 font-mono text-[11px] flex items-center">
                                  {videoQuality}
                                  <i className="ri-arrow-right-s-line text-base ml-1" />
                                </span>
                              </button>

                              {/* Ambient Mode Toggle */}
                              <button
                                onClick={() => setIsAmbientMode(!isAmbientMode)}
                                className="w-full px-3 py-2 rounded-xl hover:bg-white/10 flex items-center justify-between text-left transition-colors"
                              >
                                <span className="flex items-center gap-2">
                                  <i className="ri-sun-line text-neutral-400" />
                                  <span>Ambient Lighting</span>
                                </span>
                                <span className={`text-[11px] font-bold ${isAmbientMode ? 'text-emerald-400' : 'text-neutral-400'}`}>
                                  {isAmbientMode ? 'On' : 'Off'}
                                </span>
                              </button>
                            </div>
                          ) : settingsView === 'speed' ? (
                            <div className="space-y-1">
                              <button
                                onClick={() => setSettingsView('main')}
                                className="w-full px-3 py-1.5 rounded-lg hover:bg-white/10 flex items-center gap-1.5 text-neutral-300 font-bold border-b border-white/10 mb-1"
                              >
                                <i className="ri-arrow-left-s-line text-base" />
                                <span>Playback Speed</span>
                              </button>
                              {['0.5x', '0.75x', 'Normal', '1.25x', '1.5x', '2x'].map((spd) => (
                                <button
                                  key={spd}
                                  onClick={() => handleSetSpeed(spd === 'Normal' ? '1x' : spd)}
                                  className={`w-full px-3 py-1.5 rounded-lg text-left flex items-center justify-between text-xs ${
                                    playbackSpeed === (spd === 'Normal' ? '1x' : spd)
                                      ? 'text-red-400 font-bold bg-white/5'
                                      : 'hover:bg-white/10 text-neutral-300'
                                  }`}
                                >
                                  <span>{spd}</span>
                                  {playbackSpeed === (spd === 'Normal' ? '1x' : spd) && (
                                    <i className="ri-check-line text-base" />
                                  )}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <button
                                onClick={() => setSettingsView('main')}
                                className="w-full px-3 py-1.5 rounded-lg hover:bg-white/10 flex items-center gap-1.5 text-neutral-300 font-bold border-b border-white/10 mb-1"
                              >
                                <i className="ri-arrow-left-s-line text-base" />
                                <span>Quality</span>
                              </button>
                              {['1080p HD Premium', '720p 60fps', '480p SD', 'Auto'].map((q) => (
                                <button
                                  key={q}
                                  onClick={() => {
                                    setVideoQuality(q);
                                    setIsSettingsOpen(false);
                                  }}
                                  className={`w-full px-3 py-1.5 rounded-lg text-left flex items-center justify-between text-xs ${
                                    videoQuality === q
                                      ? 'text-red-400 font-bold bg-white/5'
                                      : 'hover:bg-white/10 text-neutral-300'
                                  }`}
                                >
                                  <span>{q}</span>
                                  {videoQuality === q && <i className="ri-check-line text-base" />}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Picture in Picture */}
                    <button
                      onClick={togglePictureInPicture}
                      className="w-9 h-9 rounded-full hover:bg-white/10 hidden sm:flex items-center justify-center text-white/90 hover:text-white transition-colors"
                      title="Picture in Picture (Miniplayer)"
                    >
                      <i className="ri-picture-in-picture-2-line text-lg" />
                    </button>

                    {/* Theater Mode Button */}
                    <button
                      onClick={() => setIsTheaterMode(!isTheaterMode)}
                      className="w-9 h-9 rounded-full hover:bg-white/10 hidden sm:flex items-center justify-center text-white/90 hover:text-white transition-colors"
                      title={isTheaterMode ? 'Default view (t)' : 'Theater mode (t)'}
                    >
                      <i className={`text-lg ${isTheaterMode ? 'ri-tv-line text-red-500' : 'ri-aspect-ratio-line'}`} />
                    </button>

                    {/* Fullscreen Toggle */}
                    <button
                      onClick={toggleFullscreen}
                      className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center text-white/90 hover:text-white transition-colors"
                      title={isFullscreen ? 'Exit full screen (f)' : 'Full screen (f)'}
                    >
                      <i className={`text-xl ${isFullscreen ? 'ri-fullscreen-exit-line' : 'ri-fullscreen-line'}`} />
                    </button>

                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Lesson Metadata Sub-bar */}
          <div className="p-4 sm:p-6 bg-[#0c121e] border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-red-600/20 text-red-400 border border-red-500/30 flex items-center gap-1">
                  <i className="ri-youtube-fill text-xs" />
                  <span>YouTube Premium Player</span>
                </span>
                
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <i className="ri-file-video-fill text-emerald-400 text-xs" />
                  <span>public/course-video.mp4</span>
                </span>

                {watchProgressPercent > 0 && (
                  <span className="text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full font-mono">
                    {watchProgressPercent}% Watched
                  </span>
                )}
              </div>

              <h2 className="font-heading text-lg sm:text-xl font-bold text-white truncate">
                {activeLesson?.title || 'Optimistic UI Updates with useOptimistic'}
              </h2>
            </div>

            {/* Previous, Mark Complete & Next Buttons */}
            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              <button
                onClick={handlePrevLesson}
                disabled={!prevLesson}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:pointer-events-none text-neutral-300 border border-white/10 transition-colors flex items-center gap-1.5"
                title="Previous Lesson"
              >
                <i className="ri-arrow-left-s-line text-base" />
                <span className="hidden sm:inline">Prev</span>
              </button>

              <button
                onClick={() => toggleComplete(activeLessonId)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-soft ${
                  completedLessons.includes(activeLessonId)
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-neutral-200 border border-white/10'
                }`}
              >
                <i
                  className={
                    completedLessons.includes(activeLessonId)
                      ? 'ri-checkbox-circle-fill text-white'
                      : 'ri-checkbox-blank-circle-line'
                  }
                />
                <span>{completedLessons.includes(activeLessonId) ? 'Completed ✓' : 'Mark Complete'}</span>
              </button>

              <button
                onClick={handleNextLesson}
                disabled={!nextLesson}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:pointer-events-none text-white transition-all shadow-soft flex items-center gap-1.5"
                title="Next Lesson"
              >
                <span className="hidden sm:inline">Next</span>
                <i className="ri-arrow-right-s-line text-base" />
              </button>
            </div>
          </div>

          {/* Interactive Learning Tabs */}
          <div className="flex border-b border-white/10 px-4 sm:px-6 bg-[#0c121e]/60 overflow-x-auto no-scrollbar">
            {(
              [
                { id: 'overview', label: 'Overview', icon: 'ri-information-line' },
                { id: 'notes', label: 'My Notes', icon: 'ri-edit-line' },
                { id: 'discussion', label: 'Q&A Discussion', icon: 'ri-chat-3-line' },
                { id: 'resources', label: 'Resources & Code', icon: 'ri-download-cloud-line' },
                { id: 'schedule', label: 'Batch Routine', icon: 'ri-calendar-event-line' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`py-3.5 px-4 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === t.id
                    ? 'border-red-600 text-red-400 bg-white/5'
                    : 'border-transparent text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <i className={t.icon} />
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content Panes */}
          <div className="p-4 sm:p-6 text-sm text-neutral-300 leading-relaxed max-w-4xl">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-heading text-base font-bold text-white">About this session</h3>
                  <p className="mt-1 text-xs text-neutral-300">
                    In this session, you will learn how to handle React 19 / Next.js 14 optimistic UI state updates,
                    seamlessly updating the client before server response with automatic rollback on failure.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#0c121e] rounded-2xl border border-white/10 space-y-2">
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <i className="ri-lightbulb-line text-amber-400" />
                      <span>Key Takeaways & Concept</span>
                    </div>
                    <ul className="text-xs space-y-1.5 text-neutral-400 list-disc list-inside">
                      <li>`useOptimistic` hook with async transitions</li>
                      <li>Server Actions cache revalidation (`revalidatePath`)</li>
                      <li>Full Route Cache and client Router Cache lifecycle</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-[#0c121e] rounded-2xl border border-white/10 space-y-2">
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <i className="ri-keyboard-line text-red-400" />
                      <span>Keyboard Shortcuts</span>
                    </div>
                    <div className="text-xs space-y-1 text-neutral-400 grid grid-cols-2 gap-1">
                      <div><kbd className="px-1 py-0.5 rounded bg-white/10 font-mono text-[10px]">Space / K</kbd> Play/Pause</div>
                      <div><kbd className="px-1 py-0.5 rounded bg-white/10 font-mono text-[10px]">F</kbd> Fullscreen</div>
                      <div><kbd className="px-1 py-0.5 rounded bg-white/10 font-mono text-[10px]">M</kbd> Mute/Unmute</div>
                      <div><kbd className="px-1 py-0.5 rounded bg-white/10 font-mono text-[10px]">J / L</kbd> -10s / +10s</div>
                      <div><kbd className="px-1 py-0.5 rounded bg-white/10 font-mono text-[10px]">T</kbd> Theater Mode</div>
                      <div><kbd className="px-1 py-0.5 rounded bg-white/10 font-mono text-[10px]">C</kbd> Toggle CC</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-base">My Private Notes</h3>
                    <p className="text-xs text-neutral-400">Notes are auto-saved to your student account</p>
                  </div>
                  {savedStatus && (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                      Saved Successfully ✓
                    </span>
                  )}
                </div>
                <textarea
                  rows={8}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Take notes while watching the lesson..."
                  className="w-full p-4 rounded-2xl bg-[#0c121e] border border-white/10 text-neutral-200 text-xs focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 leading-relaxed"
                />
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-neutral-500">Character count: {notes.length}</span>
                  <button
                    onClick={handleSaveNotes}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow-soft flex items-center gap-2 transition-all"
                  >
                    <i className="ri-save-line" />
                    <span>Save Notes</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'discussion' && (
              <div className="space-y-6 max-w-2xl">
                <form onSubmit={handleAskQuestion} className="space-y-3">
                  <label className="text-xs font-bold text-white block">
                    Ask a Question to Instructor & Batchmates
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Write your question here (e.g. How does cache revalidation work?)..."
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      className="flex-1 p-3 rounded-xl bg-[#0c121e] border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow-soft shrink-0 transition-colors"
                    >
                      Post
                    </button>
                  </div>
                </form>

                <div className="space-y-3.5">
                  {discussions.map((d) => (
                    <div key={d.id} className="p-4 rounded-2xl bg-[#0c121e] border border-white/10 text-xs space-y-2">
                      <div className="flex items-center justify-between text-neutral-400">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-red-600/30 text-red-400 flex items-center justify-center font-bold text-[10px]">
                            {d.author.charAt(0)}
                          </span>
                          <strong className="text-white">{d.author}</strong>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-white/5">{d.role}</span>
                        </div>
                        <span className="text-[11px]">{d.time}</span>
                      </div>
                      <p className="text-neutral-200 pl-8">{d.question}</p>
                      {d.reply && (
                        <div className="mt-2 ml-8 p-3 rounded-xl bg-red-950/40 border border-red-500/20 text-red-200 text-xs space-y-1">
                          <div className="font-bold text-[11px] text-red-400 flex items-center gap-1">
                            <i className="ri-reply-fill" />
                            <span>Instructor Response</span>
                          </div>
                          <p>{d.reply}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="space-y-4 max-w-xl">
                <h3 className="font-bold text-white text-base">Downloadable Lesson Assets</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-[#0c121e] rounded-2xl border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center text-xl">
                        <i className="ri-file-zip-line" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Next14-Optimistic-UI-Source.zip</div>
                        <div className="text-[11px] text-neutral-400">TypeScript & Tailwind Components • 12.4 MB</div>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-colors">
                      Download
                    </button>
                  </div>

                  <div className="p-4 bg-[#0c121e] rounded-2xl border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center text-xl">
                        <i className="ri-file-pdf-line" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Server-Actions-Cheatsheet.pdf</div>
                        <div className="text-[11px] text-neutral-400">Architecture & Cache Summary • 2.8 MB</div>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-colors">
                      Download
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="space-y-4 max-w-xl">
                <h3 className="font-bold text-white text-base">Batch 24 Live Class Schedule</h3>
                <div className="p-4 rounded-2xl bg-[#0c121e] border border-white/10 space-y-3 text-xs">
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-neutral-400">ক্লাসের দিন:</span>
                    <span className="font-bold text-white">রবিবার, মঙ্গলবার, বৃহস্পতিবার</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-neutral-400">ক্লাসের সময়:</span>
                    <span className="font-bold text-emerald-400">রাত ৯:০০ টা — ১০:৩০ টা</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-neutral-400">প্ল্যাটফর্ম:</span>
                    <span className="font-bold text-white">Google Meet & Zoom Live</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-neutral-400">রেকর্ডিং আপলোড:</span>
                    <span className="font-bold text-white">ক্লাস শেষ হওয়ার ২ ঘণ্টার মধ্যে</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. COLLAPSIBLE COURSE CURRICULUM SIDEBAR */}
        {/* ========================================================================= */}
        <div
          className={`bg-[#0c121e] border-l border-white/10 flex flex-col shrink-0 transition-all duration-300 z-30 ${
            isSidebarCollapsed ? 'w-0 lg:w-0 overflow-hidden border-l-0 opacity-0 pointer-events-none' : 'w-full lg:w-96 opacity-100'
          }`}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#0e1626]">
            <div>
              <h3 className="font-heading font-extrabold text-sm text-white flex items-center gap-2">
                <i className="ri-book-read-line text-red-500" />
                <span>Course Curriculum</span>
              </h3>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                {totalCompletedCount} of {totalLessonsCount} completed ({progressPercent}%)
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleToggleAllSections(true)}
                className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-[10px] font-bold text-neutral-300"
                title="Expand all module sections"
              >
                Expand
              </button>
              <button
                onClick={() => handleToggleAllSections(false)}
                className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-[10px] font-bold text-neutral-300"
                title="Collapse all module sections"
              >
                Collapse
              </button>
              <button
                onClick={() => setIsSidebarCollapsed(true)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white transition-colors"
                title="Hide Curriculum Sidebar"
              >
                <i className="ri-close-line text-base" />
              </button>
            </div>
          </div>

          {/* Search / Filter lessons */}
          <div className="p-3 border-b border-white/10 bg-[#090d16]">
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-2.5 text-xs text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search lessons or topics..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-xs text-neutral-400 hover:text-white"
                >
                  <i className="ri-close-circle-fill" />
                </button>
              )}
            </div>
          </div>

          {/* Module Sections Accordion List */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/10 custom-scrollbar">
            {filteredSections.map((section) => {
              const isCollapsed = collapsedSections[section.id];
              const sectionCompleted = section.lessons.filter((l) => completedLessons.includes(l.id)).length;
              const hasActiveLesson = section.lessons.some((l) => l.id === activeLessonId);

              return (
                <div key={section.id} className="transition-colors">
                  
                  {/* Accordion Module Header */}
                  <button
                    onClick={() => toggleSection(section.id)}
                    className={`w-full p-3.5 text-left flex items-center justify-between gap-2.5 transition-colors ${
                      hasActiveLesson
                        ? 'bg-red-950/30 text-red-200'
                        : 'bg-[#0e1626]/80 hover:bg-[#121c30] text-neutral-200'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-neutral-300">
                          {sectionCompleted}/{section.lessons.length}
                        </span>
                        <h4 className="text-xs font-bold text-white truncate">
                          {section.title}
                        </h4>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5 text-neutral-400">
                      <i className={`text-base transition-transform duration-200 ${isCollapsed ? 'ri-arrow-down-s-line' : 'ri-arrow-up-s-line'}`} />
                    </div>
                  </button>

                  {/* Lessons List inside this Section */}
                  {!isCollapsed && (
                    <div className="p-2 space-y-1 bg-[#090d16]/70">
                      {section.lessons.map((lesson) => {
                        const isActive = lesson.id === activeLessonId;
                        const isCompleted = completedLessons.includes(lesson.id);

                        return (
                          <div
                            key={lesson.id}
                            onClick={() => setActiveLessonId(lesson.id)}
                            className={`p-2.5 rounded-xl cursor-pointer flex items-center justify-between gap-3 text-xs transition-all ${
                              isActive
                                ? 'bg-red-600 text-white font-bold shadow-soft'
                                : 'hover:bg-white/5 text-neutral-300'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {lesson.type === 'live_class' ? (
                                <span className="w-5 h-5 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 text-xs shadow-soft">
                                  <i className="ri-broadcast-line" />
                                </span>
                              ) : lesson.type === 'live_recording' ? (
                                <span className="w-5 h-5 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 text-xs shadow-soft">
                                  <i className="ri-film-line" />
                                </span>
                              ) : lesson.type === 'quiz' ? (
                                <span className="w-5 h-5 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0 text-xs shadow-soft">
                                  <i className="ri-questionnaire-line" />
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleComplete(lesson.id);
                                  }}
                                  className="text-base text-neutral-500 hover:text-emerald-400 shrink-0 transition-colors"
                                  title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
                                >
                                  <i
                                    className={
                                      isCompleted
                                        ? 'ri-checkbox-circle-fill text-emerald-400'
                                        : 'ri-checkbox-blank-circle-line'
                                    }
                                  />
                                </button>
                              )}

                              <span className="truncate">{lesson.title}</span>
                            </div>

                            <div className="shrink-0 flex items-center gap-1.5 font-mono text-[10px] text-neutral-400">
                              {lesson.isLiveNow && (
                                <span className="px-1.5 py-0.5 rounded bg-rose-500 text-white font-extrabold uppercase animate-pulse">
                                  LIVE
                                </span>
                              )}
                              <span>{lesson.duration}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>

        {/* Floating Button to re-open sidebar when collapsed */}
        {isSidebarCollapsed && (
          <button
            onClick={() => setIsSidebarCollapsed(false)}
            className="fixed bottom-6 right-6 z-40 px-4 py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-2xl shadow-soft-xl flex items-center gap-2 transition-all hover:scale-105 border border-white/20 backdrop-blur-md"
            title="Expand Curriculum Sidebar"
          >
            <i className="ri-layout-right-line text-lg" />
            <span>Open Syllabus ({progressPercent}%)</span>
          </button>
        )}

      </div>

    </div>
  );
}
