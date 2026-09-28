export interface Course {
  id: number;
  slug: string;
  title: string;
  instructor: string;
  category: string;
  rating: number;
  students: string;
  price: number;
  oldPrice: number;
  badge?: string;
  image: string;
}

export interface Category {
  name: string;
  courses: number;
  icon: string;
  slug: string;
}

export interface Instructor {
  id: number;
  name: string;
  expertise: string;
  rating: number;
  courses: number;
  students: string;
  image: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  course: string;
  rating: number;
  image: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const TRUST_BRANDS = [
  { name: 'Northwind', icon: 'ri-building-4-line' },
  { name: 'Acme Labs', icon: 'ri-flask-line' },
  { name: 'Vertex', icon: 'ri-shape-2-line' },
  { name: 'Bluepeak', icon: 'ri-triangle-line' },
  { name: 'Orbita', icon: 'ri-global-line' },
  { name: 'Coreline', icon: 'ri-stack-line' },
];

export const STATISTICS = [
  { value: '10K+', label: 'Active Students', icon: 'ri-group-line' },
  { value: '500+', label: 'Expert Courses', icon: 'ri-book-2-line' },
  { value: '100+', label: 'Instructors', icon: 'ri-user-star-line' },
  { value: '50K+', label: 'Certificates Earned', icon: 'ri-award-line' },
];

export const CATEGORIES: Category[] = [
  { name: 'Web Development', courses: 120, icon: 'ri-code-s-slash-line', slug: 'web-development' },
  { name: 'Programming', courses: 96, icon: 'ri-terminal-box-line', slug: 'programming' },
  { name: 'UI/UX Design', courses: 74, icon: 'ri-palette-line', slug: 'ui-ux-design' },
  { name: 'Data Science', courses: 88, icon: 'ri-bar-chart-box-line', slug: 'data-science' },
  { name: 'Digital Marketing', courses: 63, icon: 'ri-megaphone-line', slug: 'digital-marketing' },
  { name: 'Business', courses: 51, icon: 'ri-briefcase-4-line', slug: 'business' },
  { name: 'Photography', courses: 42, icon: 'ri-camera-lens-line', slug: 'photography' },
  { name: 'Mobile Development', courses: 58, icon: 'ri-smartphone-line', slug: 'mobile-development' },
];

export const FEATURED_COURSES: Course[] = [
  {
    id: 1,
    slug: 'complete-nextjs-development',
    title: 'Complete Next.js Development',
    instructor: 'John Doe',
    category: 'Web Development',
    rating: 4.9,
    students: '3,240',
    price: 1999,
    oldPrice: 3999,
    badge: 'Bestseller',
    image: 'https://readdy.ai/api/search-image?query=Clean%20minimal%20flat%20illustration%20of%20a%20developer%20frontend%20coding%20dashboard%20interface%20with%20code%20panels%20and%20indigo%20accent%20shapes%20on%20a%20soft%20light%20background%2C%20modern%20educational%20thumbnail%20style%2C%20no%20text&width=800&height=500&seq=course-nextjs-01&orientation=landscape'
  },
  {
    id: 2,
    slug: 'modern-react-masterclass',
    title: 'Modern React Masterclass',
    instructor: 'Sarah Ahmed',
    category: 'Web Development',
    rating: 4.8,
    students: '2,870',
    price: 1799,
    oldPrice: 3299,
    badge: 'Popular',
    image: 'https://readdy.ai/api/search-image?query=Minimal%20flat%20illustration%20of%20reusable%20interface%20components%20and%20atomic%20design%20blocks%20assembling%20into%20an%20app%20layout%20with%20indigo%20and%20white%20tones%20on%20a%20light%20background%2C%20clean%20educational%20course%20thumbnail%2C%20no%20text&width=800&height=500&seq=course-react-02&orientation=landscape'
  },
  {
    id: 3,
    slug: 'ui-ux-design-fundamentals',
    title: 'UI/UX Design Fundamentals',
    instructor: 'Mina Park',
    category: 'UI/UX Design',
    rating: 4.9,
    students: '4,120',
    price: 1499,
    oldPrice: 2499,
    badge: 'Bestseller',
    image: 'https://readdy.ai/api/search-image?query=Elegant%20flat%20illustration%20of%20a%20designer%20wireframe%20and%20color%20swatch%20palette%20on%20a%20tablet%20with%20pastel%20coral%20and%20soft%20neutral%20tones%20on%20a%20light%20background%2C%20modern%20design%20course%20thumbnail%20style%2C%20no%20text&width=800&height=500&seq=course-uiux-03&orientation=landscape'
  },
  {
    id: 4,
    slug: 'full-stack-mern-development',
    title: 'Full Stack MERN Development',
    instructor: 'Tanvir Hossain',
    category: 'Web Development',
    rating: 4.8,
    students: '3,890',
    price: 2199,
    oldPrice: 4299,
    badge: 'Popular',
    image: 'https://readdy.ai/api/search-image?query=Clean%20flat%20illustration%20of%20a%20full%20stack%20architecture%20diagram%20with%20database%20server%20and%20client%20layers%20in%20teal%20and%20indigo%20tones%20on%20a%20soft%20light%20background%2C%20modern%20coding%20course%20thumbnail%2C%20no%20text&width=800&height=500&seq=course-mern-04&orientation=landscape'
  },
  {
    id: 5,
    slug: 'digital-marketing-masterclass',
    title: 'Digital Marketing Masterclass',
    instructor: 'Emily Watson',
    category: 'Digital Marketing',
    rating: 4.7,
    students: '2,450',
    price: 1399,
    oldPrice: 2499,
    badge: 'New',
    image: 'https://readdy.ai/api/search-image?query=Minimal%20flat%20illustration%20of%20marketing%20funnel%20growth%20charts%20and%20social%20engagement%20icons%20in%20warm%20amber%20and%20neutral%20tones%20on%20a%20light%20background%2C%20clean%20business%20course%20thumbnail%2C%20no%20text&width=800&height=500&seq=course-marketing-05&orientation=landscape'
  },
  {
    id: 6,
    slug: 'python-for-data-science',
    title: 'Python for Data Science',
    instructor: 'David Adebayo',
    category: 'Data Science',
    rating: 4.9,
    students: '5,100',
    price: 1899,
    oldPrice: 3499,
    badge: 'Bestseller',
    image: 'https://readdy.ai/api/search-image?query=Clean%20flat%20illustration%20of%20data%20visualization%20charts%20scatter%20plots%20and%20code%20notebook%20panels%20in%20teal%20and%20indigo%20accents%20on%20a%20soft%20light%20background%2C%20modern%20data%20science%20thumbnail%2C%20no%20text&width=800&height=500&seq=course-python-06&orientation=landscape'
  },
  {
    id: 7,
    slug: 'commercial-photography-basics',
    title: 'Commercial Photography Basics',
    instructor: 'Liam Becker',
    category: 'Photography',
    rating: 4.6,
    students: '1,820',
    price: 1299,
    oldPrice: 2199,
    badge: 'New',
    image: 'https://readdy.ai/api/search-image?query=Minimal%20flat%20illustration%20of%20a%20camera%20lens%20and%20composition%20grid%20frames%20in%20warm%20neutral%20and%20amber%20tones%20on%20a%20light%20background%2C%20clean%20photography%20course%20thumbnail%2C%20no%20text&width=800&height=500&seq=course-photo-07&orientation=landscape'
  },
  {
    id: 8,
    slug: 'flutter-mobile-app-development',
    title: 'Flutter Mobile App Development',
    instructor: 'Rahul Sen',
    category: 'Mobile Development',
    rating: 4.8,
    students: '2,980',
    price: 1999,
    oldPrice: 3699,
    badge: 'Popular',
    image: 'https://readdy.ai/api/search-image?query=Clean%20flat%20illustration%20of%20mobile%20app%20screens%20floating%20beside%20a%20phone%20mockup%20in%20indigo%20and%20teal%20tones%20on%20a%20soft%20light%20background%2C%20modern%20mobile%20development%20thumbnail%2C%20no%20text&width=800&height=500&seq=course-flutter-08&orientation=landscape'
  }
];

export const POPULAR_COURSES: Course[] = [
  {
    id: 9,
    slug: 'advanced-typescript-patterns',
    title: 'Advanced TypeScript Patterns',
    instructor: 'John Doe',
    category: 'Development',
    rating: 4.9,
    students: '2,340',
    price: 1599,
    oldPrice: 2999,
    badge: 'Popular',
    image: 'https://readdy.ai/api/search-image?query=Minimal%20flat%20illustration%20of%20generic%20type%20blocks%20and%20code%20structure%20diagram%20in%20indigo%20tones%20on%20a%20light%20background%2C%20clean%20programming%20course%20thumbnail%2C%20no%20text&width=800&height=500&seq=pop-typescript-09&orientation=landscape'
  },
  {
    id: 10,
    slug: 'motion-design-with-after-effects',
    title: 'Motion Design with After Effects',
    instructor: 'Mina Park',
    category: 'Design',
    rating: 4.8,
    students: '1,980',
    price: 1499,
    oldPrice: 2799,
    badge: 'Popular',
    image: 'https://readdy.ai/api/search-image?query=Clean%20flat%20illustration%20of%20animation%20timeline%20keyframes%20and%20easing%20curves%20in%20coral%20and%20neutral%20tones%20on%20a%20light%20background%2C%20modern%20motion%20design%20thumbnail%2C%20no%20text&width=800&height=500&seq=pop-motion-10&orientation=landscape'
  },
  {
    id: 11,
    slug: 'data-driven-seo-growth-strategies',
    title: 'Data-Driven SEO Growth Strategies',
    instructor: 'Emily Watson',
    category: 'Marketing',
    rating: 4.7,
    students: '2,150',
    price: 1399,
    oldPrice: 2499,
    badge: 'Popular',
    image: 'https://readdy.ai/api/search-image?query=Minimal%20flat%20illustration%20of%20search%20ranking%20charts%20and%20keyword%20tags%20in%20amber%20and%20neutral%20tones%20on%20a%20light%20background%2C%20clean%20marketing%20course%20thumbnail%2C%20no%20text&width=800&height=500&seq=pop-seo-11&orientation=landscape'
  },
  {
    id: 12,
    slug: 'financial-modeling-for-startups',
    title: 'Financial Modeling for Startups',
    instructor: 'Marcus Vance',
    category: 'Business',
    rating: 4.8,
    students: '1,720',
    price: 1699,
    oldPrice: 3199,
    badge: 'Popular',
    image: 'https://readdy.ai/api/search-image?query=Clean%20flat%20illustration%20of%20financial%20charts%20cash%20flow%20diagrams%20and%20calculator%20in%20teal%20and%20neutral%20tones%20on%20a%20light%20background%2C%20modern%20business%20course%20thumbnail%2C%20no%20text&width=800&height=500&seq=pop-finance-12&orientation=landscape'
  }
];

export const WHY_CHOOSE_US = [
  {
    title: 'Expert Instructors',
    description: 'Learn from experienced professionals who work in the industry every day.',
    icon: 'ri-user-star-line'
  },
  {
    title: 'Learn at Your Own Pace',
    description: 'Access lessons whenever and wherever you want, on any device you own.',
    icon: 'ri-time-line'
  },
  {
    title: 'Practical Learning',
    description: 'Build portfolio-ready projects and practice with real-world industry tasks.',
    icon: 'ri-code-box-line'
  },
  {
    title: 'Certificates',
    description: 'Earn verifiable digital certificates to demonstrate your mastery to employers.',
    icon: 'ri-award-line'
  }
];

export const HOW_IT_WORKS = [
  {
    number: '01',
    title: 'Choose a Course',
    description: 'Browse hundreds of practical courses across the skills you need most.'
  },
  {
    number: '02',
    title: 'Learn at Your Pace',
    description: 'Watch lessons, complete quizzes and assignments, and track your progress.'
  },
  {
    number: '03',
    title: 'Earn Your Certificate',
    description: 'Complete your course, submit your final capstone and receive a verified certificate.'
  }
];

export const LEARNING_FEATURES = [
  'Structured video lessons',
  'Interactive quizzes',
  'Practical assignments',
  'Progress tracking',
  'Personal notes',
  'Course discussions',
  'Downloadable resources',
  'Certificates'
];

export const INSTRUCTORS: Instructor[] = [
  {
    id: 1,
    name: 'John Doe',
    expertise: 'Senior Software Engineer',
    rating: 4.9,
    courses: 12,
    students: '18K',
    image: 'https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20a%20friendly%20male%20software%20engineer%20in%20a%20smart%20casual%20shirt%20against%20a%20clean%20soft%20neutral%20studio%20background%2C%20warm%20even%20lighting%2C%20editorial%20headshot%20style&width=500&height=500&seq=instructor-john-01&orientation=squarish'
  },
  {
    id: 2,
    name: 'Mina Park',
    expertise: 'Lead Product Designer',
    rating: 4.9,
    courses: 9,
    students: '14K',
    image: 'https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20a%20confident%20female%20product%20designer%20with%20short%20dark%20hair%20against%20a%20clean%20soft%20neutral%20studio%20background%2C%20warm%20even%20lighting%2C%20editorial%20headshot%20style&width=500&height=500&seq=instructor-mina-02&orientation=squarish'
  },
  {
    id: 3,
    name: 'David Adebayo',
    expertise: 'Principal Data Scientist',
    rating: 4.8,
    courses: 11,
    students: '16K',
    image: 'https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20a%20friendly%20black%20male%20data%20scientist%20wearing%20glasses%20against%20a%20clean%20soft%20neutral%20studio%20background%2C%20warm%20even%20lighting%2C%20editorial%20headshot%20style&width=500&height=500&seq=instructor-david-03&orientation=squarish'
  },
  {
    id: 4,
    name: 'Emily Watson',
    expertise: 'VP of Growth & Marketing',
    rating: 4.8,
    courses: 8,
    students: '12K',
    image: 'https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20a%20warm%20smiling%20asian%20female%20marketing%20director%20against%20a%20clean%20soft%20neutral%20studio%20background%2C%20warm%20even%20lighting%2C%20editorial%20headshot%20style&width=500&height=500&seq=instructor-emily-04&orientation=squarish'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: 'Courses are structured really well and the practical projects helped me understand the concepts much faster than I expected.',
    name: 'Sarah Khan',
    role: 'Frontend Developer',
    course: 'Modern React Masterclass',
    rating: 5,
    image: 'https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20a%20young%20smiling%20woman%20developer%20against%20a%20soft%20neutral%20background%2C%20natural%20lighting%2C%20friendly%20editorial%20headshot&width=200&height=200&seq=student-sarah-01&orientation=squarish'
  },
  {
    quote: 'The step-by-step guidance on real-world datasets helped me land my first job as a junior data analyst in just 4 months.',
    name: 'Tanvir Ahmed',
    role: 'Data Analyst',
    course: 'Python for Data Science',
    rating: 5,
    image: 'https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20a%20confident%20young%20man%20analyst%20against%20a%20soft%20neutral%20background%2C%20natural%20lighting%2C%20friendly%20editorial%20headshot&width=200&height=200&seq=student-tanvir-02&orientation=squarish'
  },
  {
    quote: 'The UI/UX course was transformative. I revamped my portfolio and immediately started getting client interviews on LinkedIn.',
    name: 'Nadia Rahman',
    role: 'Product Designer',
    course: 'UI/UX Design Fundamentals',
    rating: 5,
    image: 'https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20a%20creative%20young%20woman%20designer%20against%20a%20soft%20neutral%20background%2C%20natural%20lighting%2C%20friendly%20editorial%20headshot&width=200&height=200&seq=student-nadia-03&orientation=squarish'
  },
  {
    quote: 'Clear pacing, zero fluff, and great assignments. The certificate verification feature was a huge plus when applying to agencies.',
    name: 'Marcus Lee',
    role: 'Growth Specialist',
    course: 'Digital Marketing Masterclass',
    rating: 5,
    image: 'https://readdy.ai/api/search-image?query=Professional%20portrait%20of%20a%20friendly%20young%20man%20marketer%20in%20a%20shirt%20against%20a%20soft%20neutral%20background%2C%20natural%20lighting%2C%20editorial%20headshot&width=200&height=200&seq=student-marcus-04&orientation=squarish'
  }
];

export const CERTIFICATE_FEATURES = [
  { text: 'Verified certificates', icon: 'ri-checkbox-circle-line' },
  { text: 'Unique certificate ID', icon: 'ri-fingerprint-line' },
  { text: 'QR verification', icon: 'ri-qr-code-line' },
  { text: 'Downloadable PDF', icon: 'ri-file-download-line' }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: 'Seat Booking Deposit',
    price: '৳1,000',
    period: 'one-time deposit',
    description: 'Book your seat in the upcoming batch now. Pay remainder in easy installments.',
    features: ['Instant seat reservation in next live batch', 'Official WhatsApp confirmation', 'Preparatory materials & roadmap', 'Pay remainder before batch start'],
    cta: 'Book Seat (৳1,000)',
    highlighted: false
  },
  {
    name: 'Scholarship Exam Pass',
    price: '৳5,000',
    period: 'full course fee',
    description: 'Take our 10-minute online test and qualify for the special ৳5,000 course fee.',
    features: ['Save ৳3,000 via online test', 'Live classes on Google Meet/Zoom', 'Class recordings & project files', 'WhatsApp mentor support', 'Verified Certificate on completion'],
    cta: 'Take Exam (৳5,000)',
    highlighted: true
  },
  {
    name: 'Direct Full Admission',
    price: '৳8,000',
    period: 'full upfront fee',
    description: 'Direct enrollment with VIP mentor support and lifetime update guarantee.',
    features: ['Immediate batch admission', 'Complete recording archive', '1-on-1 portfolio review', 'Lifetime course access', 'Career guidance & job referrals'],
    cta: 'Enroll Now',
    highlighted: false
  }
];

export const FAQS: FaqItem[] = [
  {
    question: 'What types of courses are available?',
    answer: 'We offer courses across web development, programming, UI/UX design, data science, digital marketing, business, photography and mobile development — all created to be practical, structured and career-focused.'
  },
  {
    question: 'How does the ৳1,000 seat booking work?',
    answer: 'You can reserve your seat in any upcoming live batch by paying a deposit of ৳1,000 via bKash, Nagad, or card. Our team will confirm your seat via WhatsApp call and provide preparatory materials.'
  },
  {
    question: 'How can I get the ৳5,000 scholarship course fee?',
    answer: 'Visit our /exam page and take our 10-minute online scholarship test. Scoring 70% or higher automatically qualifies you for the special ৳5,000 course fee (saving ৳3,000 from the regular ৳8,000 fee).'
  },
  {
    question: 'Can I confirm my admission via WhatsApp?',
    answer: 'Yes! Our admission counselors are active on WhatsApp to answer course questions, verify bKash/Nagad transactions, and manually register you in your preferred batch.'
  },
  {
    question: 'Do courses include live classes and recordings?',
    answer: 'Yes. All our courses include scheduled live interactive classes on Google Meet and Zoom. High-definition recordings of every class are uploaded to your student portal within 2 hours.'
  },
  {
    question: 'Do courses include certificates?',
    answer: 'Yes. Upon successfully completing all video lessons, quizzes, and project assignments of a course, you receive a shareable, verifiable digital certificate.'
  },
  {
    question: 'How can I verify a certificate?',
    answer: 'Every certificate comes with a unique Certificate ID (e.g., CERT-2026-000128) and QR code. Anyone can verify its authenticity using our Certificate Verification page.'
  },
  {
    question: 'What payment methods are supported?',
    answer: 'We support major credit and debit cards, mobile financial services (bKash, Nagad, Rocket), SSLCommerz, and Stripe for seamless and secure payments.'
  }
];
