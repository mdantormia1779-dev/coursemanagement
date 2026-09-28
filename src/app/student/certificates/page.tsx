'use client';

import Link from 'next/link';
import PortalLayout from '@/components/portal/PortalLayout';
import { STUDENT_NAV } from '@/data/portalNavs';

interface StudentCert {
  id: string;
  courseTitle: string;
  instructor: string;
  issueDate: string;
  certificateId: string;
  status: 'ACTIVE' | 'REVOKED';
}

const EARNED_CERTIFICATES: StudentCert[] = [
  {
    id: 'c1',
    courseTitle: 'Modern React Masterclass',
    instructor: 'Sarah Ahmed',
    issueDate: 'August 14, 2026',
    certificateId: 'CERT-2026-000128',
    status: 'ACTIVE'
  },
  {
    id: 'c2',
    courseTitle: 'UI/UX Design Systems in Figma',
    instructor: 'Mina Park',
    issueDate: 'July 20, 2026',
    certificateId: 'CERT-2026-000084',
    status: 'ACTIVE'
  }
];

export default function StudentCertificatesPage() {
  return (
    <PortalLayout
      role="student"
      userName="Sarah Khan"
      userRoleLabel="Frontend Developer"
      navItems={STUDENT_NAV}
    >
      <div className="space-y-6">
        <div>
          <h2 className="font-heading text-2xl font-extrabold text-foreground-950">
            Earned Certificates
          </h2>
          <p className="text-sm text-foreground-500 mt-1">
            Verifiable credentials you can attach to your LinkedIn profile, CV, and portfolios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {EARNED_CERTIFICATES.map((cert) => (
            <div
              key={cert.id}
              className="p-6 rounded-2xl bg-white border border-background-200 shadow-soft-sm hover:shadow-soft-md transition-all flex flex-col justify-between space-y-5"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <i className="ri-award-fill text-2xl" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <i className="ri-checkbox-circle-fill" /> Verified
                </span>
              </div>

              <div>
                <span className="text-[11px] font-mono text-primary-600 font-bold uppercase">
                  ID: {cert.certificateId}
                </span>
                <h3 className="font-heading text-lg font-bold text-foreground-950 mt-1">
                  {cert.courseTitle}
                </h3>
                <p className="text-xs text-foreground-500 mt-1">
                  Lead Instructor: {cert.instructor} • Issued: {cert.issueDate}
                </p>
              </div>

              <div className="pt-4 border-t border-background-100 flex items-center gap-3">
                <Link
                  href={`/verify/certificate/${cert.certificateId}`}
                  className="flex-1 py-2 text-center rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-colors shadow-soft-sm flex items-center justify-center gap-1.5"
                >
                  <i className="ri-shield-check-line" />
                  <span>Public Verification</span>
                </Link>

                <button
                  onClick={() => alert(`Downloading Certificate PDF for ${cert.certificateId}`)}
                  className="p-2 rounded-xl border border-background-300 hover:bg-background-50 text-foreground-700"
                  title="Download PDF"
                >
                  <i className="ri-download-2-line text-base" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
