'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function CourseLiveClassesRedirect() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.courseId as string;

  useEffect(() => {
    // Redirect to main live classes view with course filter
    router.replace(`/instructor/live-classes`);
  }, [courseId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 text-foreground-500">
      Loading course live classes...
    </div>
  );
}
