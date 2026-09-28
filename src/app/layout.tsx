import type { Metadata, Viewport } from 'next';
import './globals.css';
import PWAInstallBanner from '@/components/pwa/PWAInstallBanner';

export const viewport: Viewport = {
  themeColor: '#4F46E5',
};

export const metadata: Metadata = {
  title: 'LearnX — Online Courses & Certificates for Career Skills',
  description: 'LearnX is a modern online learning platform with 500+ expert-led courses in development, design, data science and marketing. Learn at your pace and earn verified certificates.',
  manifest: '/manifest.json',
  keywords: 'online courses, e-learning platform, web development course, UI UX design course, data science course, digital marketing course, online certification',
  openGraph: {
    title: 'LearnX — Build Skills That Move Your Career Forward',
    description: 'Learn practical skills from expert instructors through structured, flexible and career-focused online courses. Start learning free today.',
    url: 'https://learnx.com',
    siteName: 'LearnX',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.5.0/remixicon.min.css"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#4F46E5" />
      </head>
      <body className="min-h-screen bg-white text-foreground-900 antialiased selection:bg-primary-100 selection:text-primary-800">
        {children}
        <PWAInstallBanner />
      </body>
    </html>
  );
}
