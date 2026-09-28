'use client';

import Link from 'next/link';
import PortalLayout from '@/components/portal/PortalLayout';
import { INSTRUCTOR_NAV } from '@/data/portalNavs';

interface InstructorCourse {
  id: string;
  title: string;
  slug: string;
  category: string;
  price: number;
  students: number;
  status: 'PUBLISHED' | 'PENDING_REVIEW' | 'DRAFT';
  rating: number;
}

const INSTRUCTOR_COURSES: InstructorCourse[] = [
  {
    id: 'c1',
    title: 'Complete Next.js Development',
    slug: 'complete-nextjs-development',
    category: 'Web Development',
    price: 1999,
    students: 182,
    status: 'PUBLISHED',
    rating: 4.9
  },
  {
    id: 'c2',
    title: 'Advanced TypeScript Patterns',
    slug: 'advanced-typescript-patterns',
    category: 'Programming',
    price: 1599,
    students: 96,
    status: 'PUBLISHED',
    rating: 4.9
  },
  {
    id: 'c3',
    title: 'Scalable Node.js & Microservices',
    slug: 'scalable-nodejs-microservices',
    category: 'Backend',
    price: 2499,
    students: 0,
    status: 'PENDING_REVIEW',
    rating: 0
  },
  {
    id: 'c4',
    title: 'Docker & Kubernetes for Frontend Engineers',
    slug: 'docker-kubernetes-frontend',
    category: 'DevOps',
    price: 1499,
    students: 0,
    status: 'DRAFT',
    rating: 0
  }
];

export default function InstructorCoursesPage() {
  return (
    <PortalLayout
      role="instructor"
      userName="John Doe"
      userRoleLabel="Senior Software Engineer & Lead Instructor"
      navItems={INSTRUCTOR_NAV}
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl font-extrabold text-foreground-950">
              Course Management ({INSTRUCTOR_COURSES.length})
            </h2>
            <p className="text-sm text-foreground-500 mt-1">
              Create, edit, organize curriculum, and submit courses for admin verification.
            </p>
          </div>

          <Link
            href="/instructor/courses/create"
            className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs transition-all shadow-soft-sm flex items-center gap-1.5 self-start sm:self-auto"
          >
            <i className="ri-add-line text-base" />
            <span>Create New Course</span>
          </Link>
        </div>

        {/* Courses Table */}
        <div className="bg-white rounded-2xl border border-background-200 shadow-soft-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-background-50 border-b border-background-200 text-foreground-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Course Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Students</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-background-100">
                {INSTRUCTOR_COURSES.map((course) => (
                  <tr key={course.id} className="hover:bg-background-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-foreground-950 text-sm">{course.title}</div>
                      <span className="text-[11px] text-foreground-400 font-mono">/courses/{course.slug}</span>
                    </td>
                    <td className="p-4 text-foreground-600 font-medium">{course.category}</td>
                    <td className="p-4 font-bold text-foreground-950">৳{course.price.toLocaleString()}</td>
                    <td className="p-4 text-foreground-700 font-semibold">{course.students}</td>
                    <td className="p-4">
                      {course.rating > 0 ? (
                        <span className="text-amber-500 font-bold flex items-center gap-1">
                          <i className="ri-star-fill text-xs" /> {course.rating}
                        </span>
                      ) : (
                        <span className="text-foreground-400">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          course.status === 'PUBLISHED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : course.status === 'PENDING_REVIEW'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-background-200 text-foreground-700'
                        }`}
                      >
                        {course.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link
                        href={`/courses/${course.slug}`}
                        className="px-2.5 py-1 rounded-lg border border-background-300 hover:bg-background-100 font-semibold text-foreground-700"
                      >
                        Preview
                      </Link>
                      <Link
                        href={`/instructor/courses/create?edit=${course.id}`}
                        className="px-2.5 py-1 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 font-bold"
                      >
                        Curriculum
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
