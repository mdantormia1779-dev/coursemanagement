import Link from 'next/link';

export default function Footer() {
  const footerSections = {
    platform: [
      { label: 'About Us', href: '/about' },
      { label: 'Courses', href: '/courses' },
      { label: 'Mentors', href: '/instructors' },
      { label: 'Scholarship Exam 🎁', href: '/exam' },
      { label: 'Admissions & Seat Booking', href: '/pricing' },
    ],
    resources: [
      { label: 'Blog', href: '/blog' },
      { label: 'Help Center', href: '/help' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Certificate Verification', href: '#certificate' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Refund Policy', href: '/refund' },
      { label: 'Cookie Policy', href: '/cookies' },
    ],
  };

  const socials = [
    { name: 'Facebook', icon: 'ri-facebook-fill', href: 'https://facebook.com' },
    { name: 'LinkedIn', icon: 'ri-linkedin-fill', href: 'https://linkedin.com' },
    { name: 'YouTube', icon: 'ri-youtube-fill', href: 'https://youtube.com' },
    { name: 'Instagram', icon: 'ri-instagram-line', href: 'https://instagram.com' },
    { name: 'GitHub', icon: 'ri-github-fill', href: 'https://github.com' },
  ];

  return (
    <footer className="w-full bg-foreground-950 text-foreground-300 pt-16 pb-12 border-t border-foreground-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-foreground-900">
          
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-heading text-2xl font-bold tracking-tight text-white mb-4"
            >
              <span className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white">
                <i className="ri-book-open-line text-xl" />
              </span>
              <span>
                Learn<span className="text-primary-500">X</span>
              </span>
            </Link>

            <p className="text-sm text-foreground-400 leading-relaxed max-w-sm mb-6">
              Empowering learners worldwide with structured, career-focused online courses taught by active industry professionals. Build practical skills and earn verified certificates.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="w-9 h-9 rounded-lg bg-foreground-900 hover:bg-primary-600 text-foreground-300 hover:text-white flex items-center justify-center transition-all duration-200"
                >
                  <i className={`${s.icon} text-lg`} />
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-white mb-4">
              Platform
            </h4>
            <ul className="flex flex-col gap-2.5">
              {footerSections.platform.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-white mb-4">
              Resources
            </h4>
            <ul className="flex flex-col gap-2.5">
              {footerSections.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-white mb-4">
              Contact & Legal
            </h4>
            <div className="flex flex-col gap-2.5 text-sm text-foreground-400 mb-4">
              <p className="flex items-center gap-2">
                <i className="ri-mail-line text-primary-400" />
                <span>support@learnx.com</span>
              </p>
              <p className="flex items-center gap-2">
                <i className="ri-phone-line text-primary-400" />
                <span>+880 1700-000000</span>
              </p>
              <p className="flex items-center gap-2">
                <i className="ri-map-pin-line text-primary-400" />
                <span>Dhaka, Bangladesh</span>
              </p>
            </div>

            <div className="pt-3 border-t border-foreground-900 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-foreground-400">
              {footerSections.legal.map((link) => (
                <Link key={link.label} href={link.href} className="hover:text-white transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-foreground-500">
          <p>© 2026 LearnX. All rights reserved.</p>
          <p>Built for learners building skills for the future.</p>
        </div>

      </div>
    </footer>
  );
}
