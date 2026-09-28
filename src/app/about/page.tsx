'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StatisticsSection from '@/components/StatisticsSection';
import WhyChooseUsSection from '@/components/WhyChooseUsSection';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-foreground-900">
      <Navbar onOpenSearch={() => {}} />

      <main className="flex-1 py-12 sm:py-20 space-y-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">
              Our Vision & Mission
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground-950 tracking-tight leading-tight">
              Empowering Millions to Learn, Build, and Earn Without Limits
            </h1>
            <p className="text-base sm:text-lg text-foreground-600 leading-relaxed">
              LearnX was founded with a singular purpose: bridge the gap between academic theory and high-demand commercial software engineering, product design, and digital business skills.
            </p>
          </div>

          <div className="mt-12 rounded-3xl overflow-hidden aspect-[21/9] bg-background-900 relative shadow-soft-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://readdy.ai/api/search-image?query=Clean%20minimal%20flat%20illustration%20of%20a%20web%20development%20course%20screen%20with%20code%20editor%20panels%20and%20indigo%20accent%20shapes%20on%20a%20soft%20light%20background%2C%20modern%20educational%20hero%20visual%2C%20no%20text&width=800&height=420&seq=hero-course-main&orientation=landscape"
              alt="LearnX Office & Team"
              className="w-full h-full object-cover opacity-90"
            />
          </div>

        </div>

        <StatisticsSection />
        <WhyChooseUsSection />
      </main>

      <Footer />
    </div>
  );
}
