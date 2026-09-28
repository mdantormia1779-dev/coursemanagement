'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CERTIFICATE_FEATURES } from '@/data/courses';

export default function CertificateSection() {
  const [certId, setCertId] = useState('CERT-2026-000128');
  const router = useRouter();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = certId.trim();
    if (cleanId) {
      router.push(`/verify/certificate/${encodeURIComponent(cleanId)}`);
    }
  };

  return (
    <section id="certificate" className="w-full bg-white py-16 sm:py-24 border-b border-background-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Split Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Realistic Certificate Preview */}
          <div className="lg:col-span-6 relative">
            {/* Certificate Container with decorative border & subtle shadow */}
            <div className="relative rounded-2xl bg-white border-2 border-primary-200 p-6 sm:p-8 shadow-soft-xl ring-8 ring-primary-50/50">
              
              {/* Certificate Inner Frame */}
              <div className="border border-background-300 rounded-xl p-5 sm:p-6 bg-gradient-to-br from-white via-background-50 to-white text-center relative overflow-hidden">
                
                {/* Subtle watermark / corner accents */}
                <div className="absolute top-2 left-2 text-primary-200 text-xs font-mono">✦</div>
                <div className="absolute top-2 right-2 text-primary-200 text-xs font-mono">✦</div>
                <div className="absolute bottom-2 left-2 text-primary-200 text-xs font-mono">✦</div>
                <div className="absolute bottom-2 right-2 text-primary-200 text-xs font-mono">✦</div>

                {/* Platform Logo */}
                <div className="inline-flex items-center gap-2 mb-4">
                  <span className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white text-sm">
                    <i className="ri-book-open-line" />
                  </span>
                  <span className="font-heading font-extrabold text-lg text-foreground-950 tracking-tight">
                    Learn<span className="text-primary-600">X</span>
                  </span>
                </div>

                <div className="text-[11px] font-bold uppercase tracking-widest text-primary-700">
                  Certificate of Achievement
                </div>

                <p className="mt-2 text-xs text-foreground-500">This certifies that</p>
                <div className="mt-1 font-heading text-xl sm:text-2xl font-extrabold text-foreground-950">
                  Alex Morgan
                </div>

                <p className="mt-2 text-xs text-foreground-500">has successfully completed all coursework for</p>
                <div className="mt-1 font-heading text-sm sm:text-base font-bold text-primary-700 max-w-sm mx-auto">
                  Complete Next.js Development Masterclass
                </div>

                {/* Signatures & Seal */}
                <div className="mt-6 pt-5 border-t border-background-200 grid grid-cols-3 gap-2 items-center text-left">
                  <div>
                    <div className="text-[10px] text-foreground-400 uppercase">Instructor</div>
                    <div className="text-xs font-bold text-foreground-800">John Doe</div>
                    <div className="text-[10px] text-foreground-500">Lead Architect</div>
                  </div>

                  {/* Gold Seal */}
                  <div className="flex justify-center">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 via-amber-300 to-amber-500 p-0.5 shadow-soft-md">
                      <div className="w-full h-full rounded-full border-2 border-dashed border-amber-800/40 flex flex-col items-center justify-center text-amber-950">
                        <i className="ri-medal-fill text-lg leading-none" />
                        <span className="text-[8px] font-extrabold uppercase mt-0.5">Verified</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-foreground-400 uppercase">Issue Date</div>
                    <div className="text-xs font-bold text-foreground-800">March 2026</div>
                    <div className="text-[10px] text-emerald-600 font-bold">100% Verified</div>
                  </div>
                </div>

                {/* Footer metadata & QR preview */}
                <div className="mt-5 pt-3 border-t border-background-200 flex items-center justify-between text-xs text-foreground-500">
                  <div className="flex items-center gap-1.5 font-mono text-[11px]">
                    <i className="ri-shield-check-fill text-emerald-600" />
                    <span>ID: <strong className="text-foreground-800">CERT-2026-000128</strong></span>
                  </div>
                  <div className="w-8 h-8 rounded border border-background-300 bg-white flex items-center justify-center text-foreground-700">
                    <i className="ri-qr-code-line text-lg" />
                  </div>
                </div>

              </div>
            </div>

            {/* Subtle floating badge */}
            <div className="hidden sm:flex absolute -top-4 -right-4 bg-white px-3.5 py-2 rounded-xl shadow-soft-md border border-secondary-200 items-center gap-2">
              <i className="ri-check-double-line text-secondary-600 text-lg" />
              <span className="text-xs font-bold text-foreground-800">Cryptographically Signed</span>
            </div>
          </div>

          {/* Right: Headline & Features */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-50 text-accent-800 text-xs font-semibold uppercase tracking-wider mb-3">
              Official Credentials
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground-950 tracking-tight leading-tight">
              Learn. Complete. Get Certified.
            </h2>
            <p className="mt-4 text-base text-foreground-600 leading-relaxed">
              Showcase your achievements with verifiable certificates you can share with employers, attach to LinkedIn, and include in job applications with zero doubts.
            </p>

            {/* 4 Feature Items */}
            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {CERTIFICATE_FEATURES.map((item) => (
                <li key={item.text} className="flex items-center gap-3 p-3.5 rounded-xl bg-background-50 border border-background-200">
                  <span className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
                    <i className={`${item.icon} text-base`} />
                  </span>
                  <span className="text-sm font-semibold text-foreground-800">{item.text}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <a
                href="#verify-certificate-box"
                className="inline-flex items-center gap-2 h-12 px-7 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm shadow-soft-md transition-all duration-200"
              >
                <span>Verify a Certificate</span>
                <i className="ri-arrow-down-line text-base" />
              </a>
            </div>
          </div>

        </div>

        {/* Section 23: Certificate Verification CTA Interactive Box */}
        <div id="verify-certificate-box" className="mt-16 pt-12 border-t border-background-200">
          <div className="max-w-3xl mx-auto rounded-2xl bg-gradient-to-br from-background-50 via-white to-primary-50/30 p-8 sm:p-10 border border-background-300 shadow-soft-md text-center">
            <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center mx-auto mb-4">
              <i className="ri-shield-keyhole-line text-2xl" />
            </div>
            
            <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground-950">
              Have a Certificate?
            </h3>
            <p className="mt-2 text-sm text-foreground-600 max-w-md mx-auto">
              Enter any student Certificate ID below to instantly confirm legitimacy, graduation date, and syllabus coverage.
            </p>

            <form onSubmit={handleVerify} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <div className="relative flex-1">
                <i className="ri-fingerprint-line absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-400 text-lg" />
                <input
                  type="text"
                  value={certId}
                  onChange={(e) => setCertId(e.target.value)}
                  placeholder="e.g. CERT-2026-000128"
                  aria-label="Certificate ID"
                  className="w-full h-12 pl-10 pr-4 rounded-xl border border-background-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 bg-white text-sm font-semibold text-foreground-900 outline-none transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                className="h-12 px-6 rounded-xl bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-bold text-sm shadow-soft-sm transition-all duration-200 whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Verify Certificate</span>
                <i className="ri-arrow-right-line" />
              </button>
            </form>

            <p className="mt-3 text-xs text-foreground-400">
              Links directly to verified record: <code className="bg-background-200/70 px-1.5 py-0.5 rounded text-foreground-600 font-mono">/verify/certificate/{certId || '[certificateId]'}</code>
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
