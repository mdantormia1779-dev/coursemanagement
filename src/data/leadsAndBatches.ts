export interface CourseBatch {
  id: string;
  name: string;
  courseTitle: string;
  courseSlug: string;
  startDate: string;
  schedule: string;
  totalFee: number;
  scholarshipFee: number;
  minSeatBookingFee: number;
  facebookGroupUrl: string;
  totalSeats: number;
  bookedSeats: number;
  instructor: string;
}

export type LeadStatus =
  | 'CALL_RECEIVED'
  | 'CALL_NOT_RECEIVED'
  | 'PRICE_PROBLEM'
  | 'NEED_DISCOUNT'
  | 'NEED_2_3_DAYS'
  | 'EXAM_PENDING'
  | 'EXAM_COMPLETED'
  | 'SEAT_BOOKED'
  | 'FULL_ENROLLED'
  | 'REJECTED';

export interface LeadItem {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  address: string;
  education: string;
  source: 'WhatsApp Ad' | 'YouTube Video' | 'Facebook Ad' | 'Direct Call' | 'Referral';
  targetCourse: string;
  targetBatch: string;
  status: LeadStatus;
  excuseOrReason?: string;
  notes: string;
  followUpDate: string;
  assignedCounselor: string;
  studentIdCode?: string;
  paidAmount?: number;
  dueAmount?: number;
  createdAt: string;
}

export interface ExamQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const INITIAL_BATCHES: CourseBatch[] = [
  {
    id: 'batch-24',
    name: 'Batch 24 — Full Stack Next.js & MERN Masterclass',
    courseTitle: 'Full-Stack Next.js 14, React & Node.js Masterclass',
    courseSlug: 'fullstack-nextjs-masterclass',
    startDate: '15 October, 2026',
    schedule: 'রবি, মঙ্গল, বৃহস্পতি — রাত ৯:০০ টা (Live Zoom)',
    totalFee: 5000,
    scholarshipFee: 1500,
    minSeatBookingFee: 1000,
    facebookGroupUrl: 'https://facebook.com/groups/learnx-mern-batch24',
    totalSeats: 60,
    bookedSeats: 48,
    instructor: 'Tanvir Ahmed',
  },
  {
    id: 'batch-18',
    name: 'Batch 18 — Python, AI & Data Science Career Track',
    courseTitle: 'Python for Data Science, AI & Machine Learning Bootcamp',
    courseSlug: 'python-data-science-bootcamp',
    startDate: '20 October, 2026',
    schedule: 'শনি, সোম, বুধ — রাত ৮:৩০ টা (Live Zoom)',
    totalFee: 5000,
    scholarshipFee: 1600,
    minSeatBookingFee: 1000,
    facebookGroupUrl: 'https://facebook.com/groups/learnx-python-batch18',
    totalSeats: 50,
    bookedSeats: 39,
    instructor: 'Mahmudul Hasan',
  },
  {
    id: 'batch-12',
    name: 'Batch 12 — UI/UX Design to Production Systems',
    courseTitle: 'UI/UX Design Systems: Figma to Production in 2026',
    courseSlug: 'uiux-design-systems-figma',
    startDate: '25 October, 2026',
    schedule: 'রবি, বুধ, শুক্র — রাত ৯:৩০ টা (Live Zoom)',
    totalFee: 5000,
    scholarshipFee: 1400,
    minSeatBookingFee: 1000,
    facebookGroupUrl: 'https://facebook.com/groups/learnx-uiux-batch12',
    totalSeats: 45,
    bookedSeats: 41,
    instructor: 'Sabrina Rahman',
  },
];

export const INITIAL_LEADS: LeadItem[] = [
  {
    id: 'lead-101',
    name: 'Rakibul Islam',
    phone: '01711223344',
    whatsapp: '01711223344',
    address: 'Mirpur-10, Dhaka',
    education: 'HSC 2024 (Science)',
    source: 'YouTube Video',
    targetCourse: 'Full-Stack Next.js 14, React & Node.js Masterclass',
    targetBatch: 'Batch 24',
    status: 'SEAT_BOOKED',
    excuseOrReason: '১০০০৳ বিকাশ করে সিট বুক করেছে, বাকি টাকা ক্লাস শুরুর আগে দিবে',
    notes: 'খুব আগ্রহী। bKash TrxID: 9XF84K12J। Student ID জেনারেট করে দেয়া হয়েছে।',
    followUpDate: '2026-10-12',
    assignedCounselor: 'Nahid Hasan',
    studentIdCode: 'SID-2026-8492',
    paidAmount: 1000,
    dueAmount: 500,
    createdAt: '2026-09-24',
  },
  {
    id: 'lead-102',
    name: 'Sadia Sultana',
    phone: '01899887766',
    whatsapp: '01899887766',
    address: 'Chittagong Sadar, Chittagong',
    education: 'BSc in CSE (2nd Year, CUET)',
    source: 'WhatsApp Ad',
    targetCourse: 'Full-Stack Next.js 14, React & Node.js Masterclass',
    targetBatch: 'Batch 24',
    status: 'PRICE_PROBLEM',
    excuseOrReason: '৫০০০৳ পুরো দিতে পারবে না। স্কলারশিপ চেয়েছিল। বলেছে ১০০০৳ দিয়ে সিট বুক করা যাবে কি না।',
    notes: 'তাকে স্কলারশিপ এক্সাম লিংক পাঠানো হয়েছে। ৩ দিন সময় নিয়েছে।',
    followUpDate: '2026-09-29',
    assignedCounselor: 'Ayesha Siddika',
    createdAt: '2026-09-25',
  },
  {
    id: 'lead-103',
    name: 'Mehedi Hasan Babu',
    phone: '01655443322',
    whatsapp: '01655443322',
    address: 'Rajshahi University Area',
    education: 'BBA 3rd Year',
    source: 'Facebook Ad',
    targetCourse: 'Python for Data Science, AI & Machine Learning Bootcamp',
    targetBatch: 'Batch 18',
    status: 'NEED_2_3_DAYS',
    excuseOrReason: 'বলছে ২ দিন পর আব্বুর স্যালারি হলে কনফার্ম করবে। টাকার ব্যবস্থা হচ্ছে।',
    notes: 'পজিটিভ ক্যান্ডিডেট। ২৯ সেপ্টেম্বর সকালে কল ব্যাক দিতে হবে।',
    followUpDate: '2026-09-29',
    assignedCounselor: 'Nahid Hasan',
    createdAt: '2026-09-26',
  },
  {
    id: 'lead-104',
    name: 'Tanvir Hossain',
    phone: '01911447788',
    whatsapp: '01911447788',
    address: 'Dhanmondi 27, Dhaka',
    education: 'Diploma in Engineering (Computer)',
    source: 'Direct Call',
    targetCourse: 'Full-Stack Next.js 14, React & Node.js Masterclass',
    targetBatch: 'Batch 24',
    status: 'EXAM_COMPLETED',
    excuseOrReason: 'স্কলারশিপ এক্সামে ৮৫% পেয়েছে। এখন সিট বুকিংয়ের ৩০০৳ পেমেন্ট পেন্ডিং।',
    notes: 'এসএমএস ও হোয়াটসঅ্যাপে পেমেন্ট ইনস্ট্রাকশন পাঠানো হয়েছে। ৫ ঘন্টার মধ্যে কনফার্ম করবে।',
    followUpDate: '2026-09-27',
    assignedCounselor: 'Ayesha Siddika',
    studentIdCode: 'SID-2026-3912',
    createdAt: '2026-09-27',
  },
  {
    id: 'lead-105',
    name: 'Farhan Kabir',
    phone: '01522336699',
    whatsapp: '01522336699',
    address: 'Sylhet Ambarkhana',
    education: 'HSC 2023',
    source: 'YouTube Video',
    targetCourse: 'UI/UX Design Systems: Figma to Production in 2026',
    targetBatch: 'Batch 12',
    status: 'CALL_NOT_RECEIVED',
    excuseOrReason: 'কল দেয়া হয়েছিল ২ বার, রিং হয়ে কেটে গেছে। হোয়াটসঅ্যাপে মেসেজ দেয়া আছে।',
    notes: 'সন্ধ্যার পর ফ্রি হবে মেসেজে জানিয়েছে। সন্ধ্যা ৭টায় আবার কল দেওয়া লাগবে।',
    followUpDate: '2026-09-27',
    assignedCounselor: 'Nahid Hasan',
    createdAt: '2026-09-26',
  },
  {
    id: 'lead-106',
    name: 'Nusrat Jahan',
    phone: '01733221100',
    whatsapp: '01733221100',
    address: 'Khulna Gollamari',
    education: 'BA Honors (English)',
    source: 'Facebook Ad',
    targetCourse: 'UI/UX Design Systems: Figma to Production in 2026',
    targetBatch: 'Batch 12',
    status: 'FULL_ENROLLED',
    excuseOrReason: 'ফুল পেমেন্ট কমপ্লিট। কোনো এক্সকিউজ নেই।',
    notes: 'বিকাশ ফুল পেমেন্ট কমপ্লিট। ফেসবুক সিক্রেট ব্যাচ গ্রুপে যুক্ত হয়েছে।',
    followUpDate: '2026-10-15',
    assignedCounselor: 'Ayesha Siddika',
    studentIdCode: 'SID-2026-7731',
    paidAmount: 1400,
    dueAmount: 0,
    createdAt: '2026-09-23',
  },
  {
    id: 'lead-107',
    name: 'Shimul Ahmed',
    phone: '01812345678',
    whatsapp: '01812345678',
    address: 'Gazipur Chourasta',
    education: 'HSC Candidate 2025',
    source: 'WhatsApp Ad',
    targetCourse: 'Full-Stack Next.js 14, React & Node.js Masterclass',
    targetBatch: 'Batch 24',
    status: 'REJECTED',
    excuseOrReason: 'বাসায় ল্যাপটপ বা কম্পিউটার নেই, শুধু মোবাইল আছে। তাই ভর্তি হতে পারবে না।',
    notes: 'ভবিষ্যতে ডিভাইস নিলে যোগাযোগ করতে বলা হয়েছে।',
    followUpDate: '2026-12-01',
    assignedCounselor: 'Nahid Hasan',
    createdAt: '2026-09-22',
  },
];

export const SCHOLARSHIP_QUESTIONS: ExamQuestion[] = [
  {
    id: 1,
    question: 'HTML এ সবচেয়ে বড় হেডিং ট্যাগ কোনটি?',
    options: ['<h6>', '<head>', '<h1>', '<header>'],
    correctAnswer: 2,
    explanation: 'HTML ডকুমেন্টে <h1> ট্যাগ সর্বোচ্চ গুরুত্বের প্রধান হেডিং তৈরি করতে ব্যবহৃত হয়।',
  },
  {
    id: 2,
    question: 'CSS-এ কোনো উপাদানকে স্ক্রিনের মাঝখানে অনুভূমিক ও উল্লম্বভাবে আনতে আধুনিক কোন ডিসপ্লে পদ্ধতি সবচেয়ে সহজ?',
    options: ['display: block; float: left;', 'display: flex; justify-content: center; align-items: center;', 'position: relative; left: 50%;', 'display: inline;'],
    correctAnswer: 1,
    explanation: 'Flexbox এ justify-content এবং align-items: center দিয়ে সহজেই যে কোনো উপাদান সেন্টার করা যায়।',
  },
  {
    id: 3,
    question: 'JavaScript এ একটি ভ্যারিয়েবল যার ভ্যালু পরবর্তীতে পরিবর্তন করা যাবে না, তা কীভাবে ডিক্লেয়ার করা হয়?',
    options: ['var', 'let', 'const', 'static'],
    correctAnswer: 2,
    explanation: 'const কি-ওয়ার্ড ব্যবহার করে অপরিবর্তনীয় কনস্ট্যান্ট ভ্যারিয়েবল ডিক্লেয়ার করা হয়।',
  },
  {
    id: 4,
    question: 'React অ্যাপ্লিকেশনে স্টেট (State) ম্যানেজ করার জন্য কোন হুক সবচেয়ে বেশি ব্যবহৃত হয়?',
    options: ['useEffect', 'useState', 'useRef', 'useContext'],
    correctAnswer: 1,
    explanation: 'useState হুকের মাধ্যমে ফাংশনাল কম্পোনেন্টে রিয়্যাক্টিভ স্টেট ডিক্লেয়ার ও আপডেট করা হয়।',
  },
  {
    id: 5,
    question: 'ক্লাউড ডেপ্লয়মেন্ট ও ভার্সন কন্ট্রোলের জন্য ডেভেলপাররা বিশ্বব্যাপী কোন প্ল্যাটফর্মটি ব্যবহার করেন?',
    options: ['GitHub', 'Photoshop', 'Microsoft Word', 'Notepad'],
    correctAnswer: 0,
    explanation: 'Git এবং GitHub হল কোড ভার্সন কন্ট্রোল এবং কোলাবোরেশনের বিশ্বমানের ইন্ডাস্ট্রি স্ট্যান্ডার্ড।',
  },
  {
    id: 6,
    question: 'Next.js ফ্রেমওয়ার্কের মূল সুবিধা কী?',
    options: ['শুধুমাত্র মোবাইল অ্যাপ বানানো', 'Server-Side Rendering (SSR) ও চমৎকার SEO অপটিমাইজেশন', 'ফটো এডিটিং করা', 'অফলাইন ক্যালকুলেটর বানানো'],
    correctAnswer: 1,
    explanation: 'Next.js ফুল-স্ট্যাক রিয়্যাক্ট ফ্রেমওয়ার্ক যাতে বিল্ট-ইন SSR, SSG ও হাই পারফরম্যান্স সার্চ ইঞ্জিন অপটিমাইজেশন থাকে।',
  },
  {
    id: 7,
    question: 'একটি ফাংশন যা অন্য একটি ফাংশনকে আর্গুমেন্ট হিসেবে গ্রহণ করে বা রিটার্ন করে, তাকে কী বলা হয়?',
    options: ['Arrow Function', 'Higher-Order Function', 'Anonymous Function', 'Recursive Function'],
    correctAnswer: 1,
    explanation: 'Higher-Order Function (HOF) অন্য ফাংশনকে প্যারামিটার হিসেবে নেয় অথবা অন্য ফাংশন রিটার্ন করে।',
  },
  {
    id: 8,
    question: 'ওয়েব ব্রাউজার এবং ওয়েব সার্ভারের মধ্যে নিরাপদ ও এনক্রিপ্টেড যোগাযোগের জন্য কোন প্রোটোকল ব্যবহৃত হয়?',
    options: ['HTTP', 'FTP', 'HTTPS (SSL/TLS)', 'SMTP'],
    correctAnswer: 2,
    explanation: 'HTTPS ডেটা এনক্রিপ্ট করে সিকিউর চ্যানেলে ব্রাউজার ও সার্ভারের ডেটা আদান-প্রদান নিশ্চিত করে।',
  },
];
