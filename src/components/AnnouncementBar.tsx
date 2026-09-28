import Link from 'next/link';

export default function AnnouncementBar() {
  return (
    <div className="w-full bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 text-white text-xs md:text-sm py-2 px-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-500"></span>
          </span>
          <p className="font-medium text-primary-100">
            <span className="text-amber-300 font-bold">🎓 Scholarship Alert:</span> Take the 10-minute online exam & get up to 70% off on ৳5,000 courses!
          </p>
        </div>
        <Link
          href="/exam"
          className="hidden sm:inline-flex items-center gap-1 font-bold text-amber-300 hover:text-white transition-colors shrink-0 group bg-white/10 px-2.5 py-0.5 rounded-full"
        >
          <span>Take Scholarship Exam</span>
          <i className="ri-arrow-right-line text-xs transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
