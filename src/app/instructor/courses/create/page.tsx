'use client';

import { useState } from 'react';
import Link from 'next/link';
import PortalLayout from '@/components/portal/PortalLayout';
import { INSTRUCTOR_NAV } from '@/data/portalNavs';

interface BuilderLesson {
  id: string;
  title: string;
  type: 'VIDEO' | 'ARTICLE' | 'PDF';
  duration: string;
}

interface BuilderSection {
  id: string;
  title: string;
  lessons: BuilderLesson[];
}

export default function CourseBuilderPage() {
  const [activeStep, setActiveStep] = useState<'info' | 'curriculum' | 'pricing'>('info');

  // Course Basic Info
  const [title, setTitle] = useState('Scalable Node.js & Microservices Masterclass');
  const [category, setCategory] = useState('Programming');
  const [level, setLevel] = useState('INTERMEDIATE');
  const [price, setPrice] = useState('2499');
  const [discountPrice, setDiscountPrice] = useState('1799');
  const [shortDesc, setShortDesc] = useState('Build event-driven microservices with Node.js, RabbitMQ, Docker and Redis.');

  // Curriculum State
  const [sections, setSections] = useState<BuilderSection[]>([
    {
      id: 's1',
      title: 'Module 1: Microservices Architecture Fundamentals',
      lessons: [
        { id: 'l1', title: 'Monolith vs Microservices: When and Why to decouple', type: 'VIDEO', duration: '14:20' },
        { id: 'l2', title: 'Designing Clean API Gateways with Express & Fastify', type: 'VIDEO', duration: '18:40' },
      ],
    },
    {
      id: 's2',
      title: 'Module 2: Event-Driven Messaging with RabbitMQ',
      lessons: [
        { id: 'l3', title: 'Publish/Subscribe & Exchange Patterns', type: 'VIDEO', duration: '22:15' },
        { id: 'l4', title: 'RabbitMQ Resilience & Dead Letter Queues', type: 'VIDEO', duration: '19:50' },
      ],
    },
  ]);

  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [submittedStatus, setSubmittedStatus] = useState(false);

  const addSection = () => {
    if (!newSectionTitle.trim()) return;
    setSections([
      ...sections,
      {
        id: `s-${Date.now()}`,
        title: newSectionTitle,
        lessons: [
          { id: `l-${Date.now()}`, title: 'New Lesson: Introduction & Setup', type: 'VIDEO', duration: '10:00' },
        ],
      },
    ]);
    setNewSectionTitle('');
  };

  const addLessonToSection = (sectionId: string) => {
    const lessonTitle = prompt('Enter Lesson Title:');
    if (!lessonTitle) return;
    setSections(
      sections.map((sec) => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            lessons: [
              ...sec.lessons,
              {
                id: `l-${Date.now()}`,
                title: lessonTitle,
                type: 'VIDEO',
                duration: '15:00',
              },
            ],
          };
        }
        return sec;
      })
    );
  };

  const removeSection = (sectionId: string) => {
    setSections(sections.filter((s) => s.id !== sectionId));
  };

  const handleSubmitForReview = () => {
    setSubmittedStatus(true);
  };

  return (
    <PortalLayout
      role="instructor"
      userName="John Doe"
      userRoleLabel="Senior Software Engineer & Lead Instructor"
      navItems={INSTRUCTOR_NAV}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-background-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-primary-600 mb-1">
              <Link href="/instructor/courses" className="hover:underline">Courses</Link>
              <span>/</span>
              <span>Course Builder</span>
            </div>
            <h2 className="font-heading text-2xl font-extrabold text-foreground-950">
              Interactive Course & Curriculum Builder
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Course draft saved to database successfully!')}
              className="px-4 py-2 rounded-xl border border-background-300 hover:bg-background-50 text-foreground-800 text-xs font-bold"
            >
              Save Draft
            </button>
            <button
              onClick={handleSubmitForReview}
              className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-soft-sm"
            >
              Submit for Admin Review
            </button>
          </div>
        </div>

        {submittedStatus && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm font-semibold flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <i className="ri-checkbox-circle-fill text-emerald-600 text-lg" />
              <span>Course submitted! Status changed to <strong>PENDING REVIEW</strong>. The Super Admin team has been notified.</span>
            </div>
            <button onClick={() => setSubmittedStatus(false)} className="text-xs text-emerald-700 font-bold hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {/* Builder Step Tabs */}
        <div className="flex items-center gap-2 border-b border-background-200">
          <button
            onClick={() => setActiveStep('info')}
            className={`px-5 py-3 font-heading text-sm font-bold border-b-2 transition-colors ${
              activeStep === 'info'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-foreground-500 hover:text-foreground-800'
            }`}
          >
            1. Basic Information
          </button>
          <button
            onClick={() => setActiveStep('curriculum')}
            className={`px-5 py-3 font-heading text-sm font-bold border-b-2 transition-colors ${
              activeStep === 'curriculum'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-foreground-500 hover:text-foreground-800'
            }`}
          >
            2. Curriculum Builder ({sections.length} Sections)
          </button>
          <button
            onClick={() => setActiveStep('pricing')}
            className={`px-5 py-3 font-heading text-sm font-bold border-b-2 transition-colors ${
              activeStep === 'pricing'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-foreground-500 hover:text-foreground-800'
            }`}
          >
            3. Pricing & Certificate
          </button>
        </div>

        {/* Step 1: Basic Information */}
        {activeStep === 'info' && (
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-background-200 shadow-soft-sm space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-foreground-700 mb-1">Course Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground-700 mb-1">Domain Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm outline-none focus:border-primary-500 bg-white"
                >
                  <option value="Programming">Programming</option>
                  <option value="Web Development">Web Development</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="Business">Business</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground-700 mb-1">Difficulty Level *</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm outline-none focus:border-primary-500 bg-white"
                >
                  <option value="ALL_LEVELS">All Levels</option>
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-foreground-700 mb-1">Short Description (Summary) *</label>
                <input
                  type="text"
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm outline-none focus:border-primary-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-foreground-700 mb-1">Course Thumbnail Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-background-100">
              <button
                type="button"
                onClick={() => setActiveStep('curriculum')}
                className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold"
              >
                Next: Build Curriculum →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Curriculum Builder */}
        {activeStep === 'curriculum' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                placeholder="Enter new Section name (e.g. Module 3: Redis Distributed Caching)"
                className="flex-1 h-11 px-4 rounded-xl border border-background-300 text-sm outline-none focus:border-primary-500"
              />
              <button
                type="button"
                onClick={addSection}
                className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shrink-0 flex items-center justify-center gap-1.5 shadow-soft-sm"
              >
                <i className="ri-add-line" /> Add Section
              </button>
            </div>

            <div className="space-y-4">
              {sections.map((section, sIdx) => (
                <div key={section.id} className="p-5 rounded-2xl bg-white border border-background-200 shadow-soft-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-background-100">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center">
                        {sIdx + 1}
                      </span>
                      <h3 className="font-heading text-base font-bold text-foreground-950">{section.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => addLessonToSection(section.id)}
                        className="px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 text-xs font-bold"
                      >
                        + Add Lesson
                      </button>
                      <button
                        onClick={() => removeSection(section.id)}
                        className="p-1.5 text-foreground-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Delete Section"
                      >
                        <i className="ri-delete-bin-line text-base" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {section.lessons.map((lesson) => (
                      <div key={lesson.id} className="p-3 rounded-xl bg-background-50 border border-background-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <i className="ri-video-line text-primary-600" />
                          <span className="text-xs font-semibold text-foreground-900">{lesson.title}</span>
                          <span className="text-[10px] text-foreground-400 font-mono">({lesson.duration})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="text-xs text-foreground-500 hover:text-foreground-900">Edit</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4 border-t border-background-200">
              <button
                type="button"
                onClick={() => setActiveStep('info')}
                className="px-5 py-2.5 rounded-xl border border-background-300 text-xs font-bold text-foreground-700"
              >
                ← Back to Basic Info
              </button>
              <button
                type="button"
                onClick={() => setActiveStep('pricing')}
                className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold"
              >
                Next: Pricing & Verification →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Pricing & Certificate */}
        {activeStep === 'pricing' && (
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-background-200 shadow-soft-sm space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-foreground-700 mb-1">Standard Price (BDT ৳) *</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm outline-none focus:border-primary-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground-700 mb-1">Discount Offer Price (BDT ৳)</label>
                <input
                  type="number"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-background-300 text-sm outline-none focus:border-primary-500 font-bold text-emerald-600"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-background-50 border border-background-200 space-y-3">
              <h4 className="font-heading text-sm font-bold text-foreground-950">Certificate Credential Setting</h4>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-primary-600 rounded" />
                <span className="text-xs font-semibold text-foreground-800">
                  Enable automated certificate generation upon 100% course completion and quiz pass
                </span>
              </label>
            </div>

            <div className="flex justify-between pt-4 border-t border-background-100">
              <button
                type="button"
                onClick={() => setActiveStep('curriculum')}
                className="px-5 py-2.5 rounded-xl border border-background-300 text-xs font-bold text-foreground-700"
              >
                ← Back to Curriculum
              </button>
              <button
                type="button"
                onClick={handleSubmitForReview}
                className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-soft-sm"
              >
                Submit Course for Admin Review
              </button>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
