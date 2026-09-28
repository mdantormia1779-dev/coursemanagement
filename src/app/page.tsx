'use client';

import { useState, useEffect } from 'react';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import SearchModal from '@/components/SearchModal';
import HeroSection from '@/components/HeroSection';
import TrustSection from '@/components/TrustSection';
import StatisticsSection from '@/components/StatisticsSection';
import CategoriesSection from '@/components/CategoriesSection';
import FeaturedCoursesSection from '@/components/FeaturedCoursesSection';
import PopularCoursesSection from '@/components/PopularCoursesSection';
import WhyChooseUsSection from '@/components/WhyChooseUsSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import LearningExperienceSection from '@/components/LearningExperienceSection';
import InstructorsSection from '@/components/InstructorsSection';
import BecomeInstructorSection from '@/components/BecomeInstructorSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import CertificateSection from '@/components/CertificateSection';
import PricingSection from '@/components/PricingSection';
import FaqSection from '@/components/FaqSection';
import NewsletterSection from '@/components/NewsletterSection';
import FinalCtaSection from '@/components/FinalCtaSection';
import Footer from '@/components/Footer';
import { FEATURED_COURSES, POPULAR_COURSES } from '@/data/courses';

export default function HomePage() {
  const [searchOpen, setSearchOpen] = useState(false);

  // Global keyboard shortcut (Cmd+K / Ctrl+K) to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const allCourses = [...FEATURED_COURSES, ...POPULAR_COURSES];

  return (
    <div className="min-h-screen flex flex-col bg-white text-foreground-900">
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Sticky Navbar */}
      <Navbar onOpenSearch={() => setSearchOpen(true)} />

      {/* Search Modal */}
      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        courses={allCourses}
      />

      <main className="flex-1">
        {/* 3. Hero Section */}
        <HeroSection />

        {/* 4. Trust / Brand Section */}
        <TrustSection />

        {/* 5. Statistics */}
        <StatisticsSection />

        {/* 6. Popular Categories */}
        <CategoriesSection />

        {/* 7. Featured Courses */}
        <FeaturedCoursesSection />

        {/* 8. Popular Courses */}
        <PopularCoursesSection />

        {/* 9. Why Choose Us */}
        <WhyChooseUsSection />

        {/* 10. How It Works */}
        <HowItWorksSection />

        {/* 11. Learning Experience Showcase */}
        <LearningExperienceSection />

        {/* 12. Expert Instructors */}
        <InstructorsSection />

        {/* 13. Become an Instructor CTA */}
        <BecomeInstructorSection />

        {/* 14. Student Testimonials */}
        <TestimonialsSection />

        {/* 15. Certificate Showcase & Verification CTA */}
        <CertificateSection />

        {/* 16. Pricing / Membership Preview */}
        <PricingSection />

        {/* 17. FAQ Accordion */}
        <FaqSection />

        {/* 18. Newsletter */}
        <NewsletterSection />

        {/* 19. Final CTA */}
        <FinalCtaSection />
      </main>

      {/* 20. Footer */}
      <Footer />
    </div>
  );
}
