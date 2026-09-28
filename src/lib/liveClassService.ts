// Live Course Management System — Service & Data Architecture
// Manages Live Classes, Meeting Links, Attendance, Recording Upload & Publishing, and Module Integration

export type LiveClassPlatform = 'GOOGLE_MEET' | 'ZOOM' | 'MS_TEAMS' | 'OTHER';
export type LiveClassStatus = 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'CANCELLED';
export type LiveRecordingStatus = 'NOT_AVAILABLE' | 'PROCESSING' | 'AVAILABLE' | 'PUBLISHED';
export type EmailDeliveryStatus = 'QUEUED' | 'PROCESSING' | 'SENT' | 'FAILED' | 'RETRYING';
export type EmailEventType =
  | 'LIVE_CLASS_SCHEDULED'
  | 'LIVE_CLASS_UPDATED'
  | 'LIVE_CLASS_CANCELLED'
  | 'LIVE_CLASS_REMINDER_24H'
  | 'LIVE_CLASS_REMINDER_1H'
  | 'RECORDING_PUBLISHED';

export interface LiveClassAttendanceRecord {
  id: string;
  liveClassId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentAvatar?: string;
  joinedAt: string;
  leftAt?: string;
  durationSeconds: number;
  deviceInfo: string;
}

export interface LiveClassEmailLogRecord {
  id: string;
  liveClassId: string;
  recipientEmail: string;
  recipientName: string;
  eventType: EmailEventType;
  status: EmailDeliveryStatus;
  attemptCount: number;
  errorReason?: string;
  sentAt?: string;
  createdAt: string;
}

export interface LiveClassItem {
  id: string;
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  sectionId: string;
  sectionTitle: string;
  instructorId: string;
  instructorName: string;
  instructorEmail: string;
  instructorAvatar?: string;
  title: string;
  description: string;
  platform: LiveClassPlatform;
  meetingUrl: string;
  meetingId?: string;
  meetingPassword?: string;
  scheduledDate: string; // YYYY-MM-DD
  startTime: string; // e.g. "20:00" or "8:00 PM"
  endTime: string; // e.g. "21:30" or "9:30 PM"
  timezone: string; // default "Asia/Dhaka"
  status: LiveClassStatus;
  recordingStatus: LiveRecordingStatus;
  recordingUrl?: string;
  recordingDuration?: number; // seconds
  recordingSize?: number; // bytes
  recordingThumbnail?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
  cancellationReason?: string;
  enrolledStudentsCount: number;
  attendances: LiveClassAttendanceRecord[];
  emailLogs: LiveClassEmailLogRecord[];
}

export interface CourseModuleOption {
  id: string;
  title: string;
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  instructorName: string;
}

export interface EnrolledStudentInfo {
  id: string;
  name: string;
  email: string;
  avatar: string;
  enrolledDate: string;
}

// Initial realistic enrolled students for courses
export const ENROLLED_STUDENTS_SAMPLE: Record<string, EnrolledStudentInfo[]> = {
  'complete-nextjs-development': [
    { id: 'usr-sarah', name: 'Sarah Khan', email: 'sarah.khan@example.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop', enrolledDate: '2026-09-10' },
    { id: 'usr-tanvir', name: 'Tanvir Hossain', email: 'tanvir.learner@example.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop', enrolledDate: '2026-09-12' },
    { id: 'usr-mehedi', name: 'Mehedi Hasan', email: 'mehedi.dev@example.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop', enrolledDate: '2026-09-15' },
    { id: 'usr-nusrat', name: 'Nusrat Jahan', email: 'nusrat.jahan@example.com', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop', enrolledDate: '2026-09-18' },
    { id: 'usr-rakib', name: 'Rakibul Islam', email: 'rakibul.islam@example.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop', enrolledDate: '2026-09-22' },
  ],
  'full-stack-mern-development': [
    { id: 'usr-sarah', name: 'Sarah Khan', email: 'sarah.khan@example.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop', enrolledDate: '2026-09-11' },
    { id: 'usr-tanvir', name: 'Tanvir Hossain', email: 'tanvir.learner@example.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop', enrolledDate: '2026-09-14' },
    { id: 'usr-sadia', name: 'Sadia Sultana', email: 'sadia.cuet@example.com', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop', enrolledDate: '2026-09-19' },
  ],
  'modern-react-masterclass': [
    { id: 'usr-sarah', name: 'Sarah Khan', email: 'sarah.khan@example.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop', enrolledDate: '2026-09-05' },
    { id: 'usr-rakib', name: 'Rakibul Islam', email: 'rakibul.islam@example.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop', enrolledDate: '2026-09-20' },
  ],
};

// Course Modules / Sections definition
export const COURSE_MODULES: CourseModuleOption[] = [
  // complete-nextjs-development
  { id: 'mod-next-1', title: 'Section 1: Foundations & Next.js 14 Setup', courseId: 'course-nextjs', courseTitle: 'Complete Next.js Development', courseSlug: 'complete-nextjs-development', instructorName: 'John Doe' },
  { id: 'mod-next-2', title: 'Section 2: Server & Client Components Architecture', courseId: 'course-nextjs', courseTitle: 'Complete Next.js Development', courseSlug: 'complete-nextjs-development', instructorName: 'John Doe' },
  { id: 'mod-next-3', title: 'Section 3: Data Fetching, Server Actions & Caching', courseId: 'course-nextjs', courseTitle: 'Complete Next.js Development', courseSlug: 'complete-nextjs-development', instructorName: 'John Doe' },
  { id: 'mod-next-4', title: 'Section 4: Production Database & Authentication', courseId: 'course-nextjs', courseTitle: 'Complete Next.js Development', courseSlug: 'complete-nextjs-development', instructorName: 'John Doe' },

  // full-stack-mern-development
  { id: 'mod-mern-1', title: 'Module 1: Modern HTML5 & CSS3 Masterclass', courseId: 'course-mern', courseTitle: 'Full Stack MERN Development', courseSlug: 'full-stack-mern-development', instructorName: 'Tanvir Hossain' },
  { id: 'mod-mern-2', title: 'Module 2: Advanced JavaScript & ES6+ Patterns', courseId: 'course-mern', courseTitle: 'Full Stack MERN Development', courseSlug: 'full-stack-mern-development', instructorName: 'Tanvir Hossain' },
  { id: 'mod-mern-3', title: 'Module 3: React 18 Core, Hooks & State Management', courseId: 'course-mern', courseTitle: 'Full Stack MERN Development', courseSlug: 'full-stack-mern-development', instructorName: 'Tanvir Hossain' },
  { id: 'mod-mern-4', title: 'Module 4: Node.js, Express & MongoDB REST API', courseId: 'course-mern', courseTitle: 'Full Stack MERN Development', courseSlug: 'full-stack-mern-development', instructorName: 'Tanvir Hossain' },

  // modern-react-masterclass
  { id: 'mod-react-1', title: 'Module 1: React Fundamentals & JSX Syntax', courseId: 'course-react', courseTitle: 'Modern React Masterclass', courseSlug: 'modern-react-masterclass', instructorName: 'Sarah Ahmed' },
  { id: 'mod-react-2', title: 'Module 2: Hooks Deep Dive & Performance', courseId: 'course-react', courseTitle: 'Modern React Masterclass', courseSlug: 'modern-react-masterclass', instructorName: 'Sarah Ahmed' },
];

// Initial production-grade Seed Live Classes
export const INITIAL_LIVE_CLASSES: LiveClassItem[] = [
  {
    id: 'lc-101',
    courseId: 'course-nextjs',
    courseTitle: 'Complete Next.js Development',
    courseSlug: 'complete-nextjs-development',
    sectionId: 'mod-next-3',
    sectionTitle: 'Section 3: Data Fetching, Server Actions & Caching',
    instructorId: 'inst-john',
    instructorName: 'John Doe',
    instructorEmail: 'john.doe@learnx.com',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop',
    title: 'React Server Actions & Optimistic Mutations — Live Interactive Workshop',
    description: 'Deep dive into handling asynchronous form submissions, optimistic cache invalidation, and real-world error handling with useActionState & useOptimistic in Next.js 14.',
    platform: 'GOOGLE_MEET',
    meetingUrl: 'https://meet.google.com/qwa-trbv-xjk',
    meetingId: 'qwa-trbv-xjk',
    meetingPassword: 'nextjs-mastery',
    scheduledDate: '2026-09-30',
    startTime: '20:00',
    endTime: '21:30',
    timezone: 'Asia/Dhaka',
    status: 'SCHEDULED',
    recordingStatus: 'NOT_AVAILABLE',
    isPublished: false,
    createdAt: '2026-09-25T14:30:00Z',
    updatedAt: '2026-09-25T14:30:00Z',
    enrolledStudentsCount: 5,
    attendances: [],
    emailLogs: [
      {
        id: 'em-1',
        liveClassId: 'lc-101',
        recipientEmail: 'sarah.khan@example.com',
        recipientName: 'Sarah Khan',
        eventType: 'LIVE_CLASS_SCHEDULED',
        status: 'SENT',
        attemptCount: 1,
        sentAt: '2026-09-25T14:31:00Z',
        createdAt: '2026-09-25T14:30:30Z',
      },
      {
        id: 'em-2',
        liveClassId: 'lc-101',
        recipientEmail: 'tanvir.learner@example.com',
        recipientName: 'Tanvir Hossain',
        eventType: 'LIVE_CLASS_SCHEDULED',
        status: 'SENT',
        attemptCount: 1,
        sentAt: '2026-09-25T14:31:05Z',
        createdAt: '2026-09-25T14:30:30Z',
      },
    ],
  },
  {
    id: 'lc-102',
    courseId: 'course-mern',
    courseTitle: 'Full Stack MERN Development',
    courseSlug: 'full-stack-mern-development',
    sectionId: 'mod-mern-3',
    sectionTitle: 'Module 3: React 18 Core, Hooks & State Management',
    instructorId: 'inst-tanvir',
    instructorName: 'Tanvir Hossain',
    instructorEmail: 'tanvir@learnx.com',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop',
    title: 'React Custom Hooks & Redux Toolkit Architecture — Live Build',
    description: 'We will live code custom data-fetching hooks with abort controllers, debounce patterns, and integrate Redux Toolkit slices with async thunks.',
    platform: 'ZOOM',
    meetingUrl: 'https://zoom.us/j/94827103829',
    meetingId: '948 2710 3829',
    meetingPassword: 'mern-live-2026',
    scheduledDate: '2026-09-24',
    startTime: '21:00',
    endTime: '22:30',
    timezone: 'Asia/Dhaka',
    status: 'COMPLETED',
    recordingStatus: 'PUBLISHED',
    recordingUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    recordingDuration: 5320, // 1h 28m 40s
    recordingSize: 742180400, // 707 MB
    recordingThumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop',
    isPublished: true,
    createdAt: '2026-09-20T10:00:00Z',
    updatedAt: '2026-09-25T08:15:00Z',
    enrolledStudentsCount: 3,
    attendances: [
      {
        id: 'att-1',
        liveClassId: 'lc-102',
        studentId: 'usr-sarah',
        studentName: 'Sarah Khan',
        studentEmail: 'sarah.khan@example.com',
        studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop',
        joinedAt: '2026-09-24T21:02:14Z',
        leftAt: '2026-09-24T22:30:10Z',
        durationSeconds: 5276,
        deviceInfo: 'Chrome on macOS (Desktop)',
      },
      {
        id: 'att-2',
        liveClassId: 'lc-102',
        studentId: 'usr-tanvir',
        studentName: 'Tanvir Hossain',
        studentEmail: 'tanvir.learner@example.com',
        studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop',
        joinedAt: '2026-09-24T21:05:00Z',
        leftAt: '2026-09-24T22:28:40Z',
        durationSeconds: 5020,
        deviceInfo: 'Edge on Windows 11 (Desktop)',
      },
    ],
    emailLogs: [
      {
        id: 'em-rec-1',
        liveClassId: 'lc-102',
        recipientEmail: 'sarah.khan@example.com',
        recipientName: 'Sarah Khan',
        eventType: 'RECORDING_PUBLISHED',
        status: 'SENT',
        attemptCount: 1,
        sentAt: '2026-09-25T08:16:00Z',
        createdAt: '2026-09-25T08:15:30Z',
      },
    ],
  },
  {
    id: 'lc-103',
    courseId: 'course-mern',
    courseTitle: 'Full Stack MERN Development',
    courseSlug: 'full-stack-mern-development',
    sectionId: 'mod-mern-4',
    sectionTitle: 'Module 4: Node.js, Express & MongoDB REST API',
    instructorId: 'inst-tanvir',
    instructorName: 'Tanvir Hossain',
    instructorEmail: 'tanvir@learnx.com',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop',
    title: 'MongoDB Aggregation Pipelines & JWT Auth Architecture',
    description: 'Master $lookup, $group, $facet aggregations and build secure refreshToken & accessToken authentication middleware in Express.',
    platform: 'ZOOM',
    meetingUrl: 'https://zoom.us/j/91283746520',
    meetingId: '912 8374 6520',
    meetingPassword: 'jwt-mongo-live',
    scheduledDate: '2026-10-02',
    startTime: '21:00',
    endTime: '22:30',
    timezone: 'Asia/Dhaka',
    status: 'SCHEDULED',
    recordingStatus: 'NOT_AVAILABLE',
    isPublished: false,
    createdAt: '2026-09-26T09:00:00Z',
    updatedAt: '2026-09-26T09:00:00Z',
    enrolledStudentsCount: 3,
    attendances: [],
    emailLogs: [],
  },
  {
    id: 'lc-104',
    courseId: 'course-nextjs',
    courseTitle: 'Complete Next.js Development',
    courseSlug: 'complete-nextjs-development',
    sectionId: 'mod-next-2',
    sectionTitle: 'Section 2: Server & Client Components Architecture',
    instructorId: 'inst-john',
    instructorName: 'John Doe',
    instructorEmail: 'john.doe@learnx.com',
    title: 'React 19 Compiler, Actions & Streaming SSR Live Q&A',
    description: 'Interactive live Q&A clearing student doubts on suspense boundaries, streaming SSR, and edge middleware runtime.',
    platform: 'GOOGLE_MEET',
    meetingUrl: 'https://meet.google.com/xyz-abcd-efg',
    meetingId: 'xyz-abcd-efg',
    meetingPassword: 'qna-session',
    scheduledDate: '2026-09-21',
    startTime: '19:30',
    endTime: '21:00',
    timezone: 'Asia/Dhaka',
    status: 'COMPLETED',
    recordingStatus: 'AVAILABLE', // ready to be published!
    recordingUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    recordingDuration: 4800, // 1h 20m
    recordingSize: 612500000,
    recordingThumbnail: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop',
    isPublished: false,
    createdAt: '2026-09-18T10:00:00Z',
    updatedAt: '2026-09-22T08:00:00Z',
    enrolledStudentsCount: 5,
    attendances: [],
    emailLogs: [],
  },
];

// Persistent state management for live classes across browser sessions
const STORAGE_KEY = 'learnx_live_classes_v2';
const LESSON_RECORDINGS_KEY = 'learnx_lesson_recordings_v2';

export function getStoredLiveClasses(): LiveClassItem[] {
  if (typeof window === 'undefined') {
    return INITIAL_LIVE_CLASSES;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LIVE_CLASSES));
      return INITIAL_LIVE_CLASSES;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_LIVE_CLASSES;
  }
}

export function saveStoredLiveClasses(classes: LiveClassItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(classes));
  } catch (e) {
    console.error('Failed to save live classes to storage:', e);
  }
}

// Storage for published recording lessons attached to course modules
export interface PublishedRecordingLesson {
  id: string;
  liveClassId: string;
  courseId: string;
  courseSlug: string;
  sectionId: string;
  title: string;
  duration: string;
  durationSeconds: number;
  videoUrl: string;
  thumbnail?: string;
  instructorName: string;
  publishedAt: string;
}

export function getPublishedRecordingLessons(): PublishedRecordingLesson[] {
  if (typeof window === 'undefined') {
    return [
      {
        id: 'rec-lesson-102',
        liveClassId: 'lc-102',
        courseId: 'course-mern',
        courseSlug: 'full-stack-mern-development',
        sectionId: 'mod-mern-3',
        title: 'React Custom Hooks & Redux Toolkit Architecture — Live Recording',
        duration: '01:28:40',
        durationSeconds: 5320,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop',
        instructorName: 'Tanvir Hossain',
        publishedAt: '2026-09-25T08:15:00Z',
      },
    ];
  }
  try {
    const raw = localStorage.getItem(LESSON_RECORDINGS_KEY);
    if (!raw) {
      const initial = [
        {
          id: 'rec-lesson-102',
          liveClassId: 'lc-102',
          courseId: 'course-mern',
          courseSlug: 'full-stack-mern-development',
          sectionId: 'mod-mern-3',
          title: 'React Custom Hooks & Redux Toolkit Architecture — Live Recording',
          duration: '01:28:40',
          durationSeconds: 5320,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop',
          instructorName: 'Tanvir Hossain',
          publishedAt: '2026-09-25T08:15:00Z',
        },
      ];
      localStorage.setItem(LESSON_RECORDINGS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function savePublishedRecordingLesson(lesson: PublishedRecordingLesson): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getPublishedRecordingLessons();
    const updated = [lesson, ...existing.filter((l) => l.liveClassId !== lesson.liveClassId)];
    localStorage.setItem(LESSON_RECORDINGS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save published recording lesson:', e);
  }
}

// Student watch progress tracking for live recordings
const PROGRESS_STORAGE_KEY = 'learnx_recording_progress_v2';

export interface WatchProgressItem {
  studentId: string;
  liveClassId: string;
  lessonId: string;
  watchedSeconds: number;
  durationSeconds: number;
  percentage: number;
  completed: boolean;
  lastPosition: number;
  updatedAt: string;
}

export function getWatchProgress(studentId: string, liveClassId: string): WatchProgressItem | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return null;
    const items: WatchProgressItem[] = JSON.parse(raw);
    return items.find((i) => i.studentId === studentId && i.liveClassId === liveClassId) || null;
  } catch (e) {
    return null;
  }
}

export function saveWatchProgress(progress: WatchProgressItem): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    const items: WatchProgressItem[] = raw ? JSON.parse(raw) : [];
    const filtered = items.filter(
      (i) => !(i.studentId === progress.studentId && i.liveClassId === progress.liveClassId)
    );
    filtered.push(progress);
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to save progress:', e);
  }
}

// URL Validation Helper
export function isValidMeetingUrl(url: string, platform: LiveClassPlatform): { valid: boolean; message?: string } {
  if (!url || !url.trim()) {
    return { valid: false, message: 'Meeting URL is required' };
  }
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { valid: false, message: 'Meeting URL must start with https://' };
    }
  } catch (e) {
    return { valid: false, message: 'Please provide a valid URL format' };
  }

  if (platform === 'GOOGLE_MEET') {
    if (!trimmed.includes('meet.google.com/')) {
      return { valid: false, message: 'Google Meet URL should be in the format https://meet.google.com/xxx-xxxx-xxx' };
    }
  } else if (platform === 'ZOOM') {
    if (!trimmed.includes('zoom.us/')) {
      return { valid: false, message: 'Zoom URL should be in the format https://zoom.us/j/...' };
    }
  } else if (platform === 'MS_TEAMS') {
    if (!trimmed.includes('teams.microsoft.com/') && !trimmed.includes('teams.live.com/')) {
      return { valid: false, message: 'Microsoft Teams URL should be a valid teams.microsoft.com meeting link' };
    }
  }

  return { valid: true };
}

// Helper to format duration in seconds to human readable e.g. "1h 28m"
export function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) {
    return `${hrs}h ${mins.toString().padStart(2, '0')}m`;
  }
  return `${mins}m ${secs.toString().padStart(2, '0')}s`;
}

// Helper to format file size in bytes
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
