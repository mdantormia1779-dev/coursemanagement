// Manual Payment & Admin Approval System Service
// Supports bKash, Nagad, Rocket manual payments, custom merchant/personal numbers, TrxID validation, and Course Unlock on Admin Approval.

export interface PaymentSettings {
  bkashNumber: string;
  nagadNumber: string;
  rocketNumber: string;
  accountType: 'Personal (Send Money)' | 'Merchant (Payment)' | 'Agent (Cash In)';
  instructionsBangla: string;
  seatBookingAmount: number;
  whatsappSupportNumber: string;
  isManualPaymentActive: boolean;
  bankDetails?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    branch: string;
    routingNumber: string;
  };
}

export const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
  bkashNumber: '01318964063',
  nagadNumber: '01318964063',
  rocketNumber: '01318964063',
  accountType: 'Personal (Send Money)',
  instructionsBangla:
    '১. আপনার bKash / Nagad অ্যাপে যান এবং "Send Money" নির্বাচন করুন।\n২. প্রাপক নাম্বার হিসেবে আমাদের অফিশিয়াল নাম্বার দিন।\n৩. উল্লেখিত পরিমাণ টাকা সেন্ড মানি করুন।\n৪. সফল ট্রানজেকশনের পর TrxID এবং প্রেরক নাম্বার নিচের ফর্মে লিখে সাবমিট করুন।\n৫. এডমিন অনুমোদন দেওয়ার সাথে সাথেই আপনার কোর্স শুরু করতে পারবেন।',
  seatBookingAmount: 1000,
  whatsappSupportNumber: '01318964063',
  isManualPaymentActive: true,
  bankDetails: {
    bankName: 'City Bank Ltd.',
    accountName: 'LearnX Academy Ltd.',
    accountNumber: '1502938472001',
    branch: 'Dhanmondi Branch',
    routingNumber: '225272341',
  },
};

export type ManualPaymentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ManualPaymentRequest {
  id: string;
  orderNumber: string;
  studentName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  plan: string;
  planTitle: string;
  courseTitle: string;
  courseSlug: string;
  amount: number;
  paymentMethod: 'bKash' | 'Nagad' | 'Rocket' | 'Bank';
  accountType: string;
  receiverNumber: string;
  senderNumber: string;
  trxId: string;
  reference?: string;
  studentNote?: string;
  status: ManualPaymentStatus;
  studentId?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

const SETTINGS_STORAGE_KEY = 'learnx_manual_payment_settings_v1';
const REQUESTS_STORAGE_KEY = 'learnx_manual_payment_requests_v1';
const ENROLLED_COURSES_KEY = 'learnx_enrolled_courses_v1';
const STUDENT_ORDERS_KEY = 'learnx_student_orders_v1';

const INITIAL_REQUESTS: ManualPaymentRequest[] = [
  {
    id: 'MPAY-84920',
    orderNumber: 'ORD-2026-98124',
    studentName: 'Sarah Khan',
    email: 'sarah.khan@example.com',
    phone: '01712-345678',
    whatsapp: '01712-345678',
    plan: 'seat-booking',
    planTitle: 'Seat Booking Deposit (Batch 24)',
    courseTitle: 'Complete Next.js Development',
    courseSlug: 'complete-nextjs-development',
    amount: 1000,
    paymentMethod: 'bKash',
    accountType: 'Personal (Send Money)',
    receiverNumber: '01318964063',
    senderNumber: '01712345678',
    trxId: '9X8A1239',
    reference: 'Seat Book Batch 24',
    status: 'APPROVED',
    studentId: 'SID-2026-8492',
    submittedAt: '2026-09-26T10:15:00.000Z',
    reviewedAt: '2026-09-26T10:25:00.000Z',
    reviewedBy: 'Super Admin',
  },
  {
    id: 'MPAY-84921',
    orderNumber: 'ORD-2026-98125',
    studentName: 'Kamrul Hasan',
    email: 'kamrul.hasan@example.com',
    phone: '01819-876543',
    whatsapp: '01819-876543',
    plan: 'seat-booking',
    planTitle: 'Seat Booking Deposit (Batch 24)',
    courseTitle: 'Complete Next.js Development',
    courseSlug: 'complete-nextjs-development',
    amount: 1000,
    paymentMethod: 'bKash',
    accountType: 'Personal (Send Money)',
    receiverNumber: '01318964063',
    senderNumber: '01819876543',
    trxId: 'BL9M481023',
    reference: 'Batch 24 Seat',
    studentNote: 'Sent 1000tk via bKash personal send money',
    status: 'PENDING',
    submittedAt: '2026-09-27T08:30:00.000Z',
  },
];

// Helper to get payment settings
export function getPaymentSettings(): PaymentSettings {
  if (typeof window === 'undefined') {
    return DEFAULT_PAYMENT_SETTINGS;
  }
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_PAYMENT_SETTINGS));
      return DEFAULT_PAYMENT_SETTINGS;
    }
    return { ...DEFAULT_PAYMENT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_PAYMENT_SETTINGS;
  }
}

// Helper to save payment settings
export function savePaymentSettings(newSettings: Partial<PaymentSettings>): PaymentSettings {
  const current = getPaymentSettings();
  const updated: PaymentSettings = {
    ...current,
    ...newSettings,
  };
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('learnx_manual_payment_settings_changed', { detail: updated }));
    } catch (e) {
      console.error('Failed to save payment settings:', e);
    }
  }
  return updated;
}

// Helper to get all manual payment requests
export function getPaymentRequests(): ManualPaymentRequest[] {
  if (typeof window === 'undefined') {
    return INITIAL_REQUESTS;
  }
  try {
    const raw = localStorage.getItem(REQUESTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(INITIAL_REQUESTS));
      return INITIAL_REQUESTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_REQUESTS;
  }
}

// Save payment requests array
function savePaymentRequests(requests: ManualPaymentRequest[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(requests));
    window.dispatchEvent(new CustomEvent('learnx_manual_payments_changed', { detail: requests }));
  } catch (e) {
    console.error('Failed to save payment requests:', e);
  }
}

// Submit a new manual payment request from Checkout
export function submitManualPayment(data: {
  studentName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  plan: string;
  planTitle: string;
  courseTitle: string;
  courseSlug: string;
  amount: number;
  paymentMethod: 'bKash' | 'Nagad' | 'Rocket' | 'Bank';
  accountType: string;
  receiverNumber: string;
  senderNumber: string;
  trxId: string;
  reference?: string;
  studentNote?: string;
}): ManualPaymentRequest {
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const newRequest: ManualPaymentRequest = {
    ...data,
    id: `MPAY-${randomSuffix}`,
    orderNumber: `ORD-2026-${randomSuffix}`,
    status: 'PENDING',
    submittedAt: new Date().toISOString(),
  };

  const requests = getPaymentRequests();
  const updated = [newRequest, ...requests];
  savePaymentRequests(updated);

  // Record this order in student orders storage as PENDING
  recordStudentOrder({
    id: newRequest.id,
    orderNumber: newRequest.orderNumber,
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    course: newRequest.courseTitle,
    amount: newRequest.amount,
    paymentMethod: `${newRequest.paymentMethod} (TrxID: ${newRequest.trxId})`,
    status: 'PENDING',
  });

  return newRequest;
}

// Admin approves a manual payment request
export function approveManualPayment(requestId: string, adminName: string = 'Academy Admin'): ManualPaymentRequest | null {
  const requests = getPaymentRequests();
  const index = requests.findIndex((r) => r.id === requestId);
  if (index === -1) return null;

  const target = requests[index];
  const randomId = Math.floor(1000 + Math.random() * 9000);
  const generatedStudentId = target.studentId || `SID-2026-${randomId}`;

  const updatedTarget: ManualPaymentRequest = {
    ...target,
    status: 'APPROVED',
    studentId: generatedStudentId,
    reviewedAt: new Date().toISOString(),
    reviewedBy: adminName,
  };

  requests[index] = updatedTarget;
  savePaymentRequests(requests);

  // Activate course enrollment
  unlockCourseForStudent({
    courseSlug: target.courseSlug,
    courseTitle: target.courseTitle,
    studentId: generatedStudentId,
    studentName: target.studentName,
    studentEmail: target.email,
    unlockedAt: new Date().toISOString(),
  });

  // Update student order status to PAID
  updateStudentOrderStatus(target.orderNumber, 'PAID');

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('learnx_course_unlocked', {
        detail: {
          courseSlug: target.courseSlug,
          studentId: generatedStudentId,
          orderNumber: target.orderNumber,
        },
      })
    );
  }

  return updatedTarget;
}

// Admin rejects a manual payment request
export function rejectManualPayment(requestId: string, reason: string = 'Invalid Transaction ID'): ManualPaymentRequest | null {
  const requests = getPaymentRequests();
  const index = requests.findIndex((r) => r.id === requestId);
  if (index === -1) return null;

  const target = requests[index];
  const updatedTarget: ManualPaymentRequest = {
    ...target,
    status: 'REJECTED',
    rejectionReason: reason,
    reviewedAt: new Date().toISOString(),
  };

  requests[index] = updatedTarget;
  savePaymentRequests(requests);

  updateStudentOrderStatus(target.orderNumber, 'REFUNDED');
  return updatedTarget;
}

// Student Order record interface
export interface StudentOrderRecord {
  id: string;
  orderNumber: string;
  date: string;
  course: string;
  amount: number;
  paymentMethod: string;
  status: 'PAID' | 'PENDING' | 'REFUNDED';
}

export function getStudentOrders(): StudentOrderRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STUDENT_ORDERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function recordStudentOrder(order: StudentOrderRecord): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getStudentOrders();
    const updated = [order, ...existing.filter((o) => o.orderNumber !== order.orderNumber)];
    localStorage.setItem(STUDENT_ORDERS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to record student order:', e);
  }
}

function updateStudentOrderStatus(orderNumber: string, status: 'PAID' | 'PENDING' | 'REFUNDED'): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getStudentOrders();
    const updated = existing.map((o) => (o.orderNumber === orderNumber ? { ...o, status } : o));
    localStorage.setItem(STUDENT_ORDERS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update order status:', e);
  }
}

// Enrolled course unlock tracker
export interface UnlockedEnrollment {
  courseSlug: string;
  courseTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  unlockedAt: string;
}

export function getUnlockedCourses(): UnlockedEnrollment[] {
  if (typeof window === 'undefined') {
    return [
      {
        courseSlug: 'complete-nextjs-development',
        courseTitle: 'Complete Next.js Development',
        studentId: 'SID-2026-8492',
        studentName: 'Sarah Khan',
        studentEmail: 'sarah.khan@example.com',
        unlockedAt: '2026-09-26T10:25:00.000Z',
      },
    ];
  }
  try {
    const raw = localStorage.getItem(ENROLLED_COURSES_KEY);
    if (!raw) {
      const initial = [
        {
          courseSlug: 'complete-nextjs-development',
          courseTitle: 'Complete Next.js Development',
          studentId: 'SID-2026-8492',
          studentName: 'Sarah Khan',
          studentEmail: 'sarah.khan@example.com',
          unlockedAt: '2026-09-26T10:25:00.000Z',
        },
      ];
      localStorage.setItem(ENROLLED_COURSES_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function unlockCourseForStudent(enrollment: UnlockedEnrollment): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getUnlockedCourses();
    const updated = [enrollment, ...existing.filter((e) => e.courseSlug !== enrollment.courseSlug)];
    localStorage.setItem(ENROLLED_COURSES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to unlock course:', e);
  }
}

// Check if a course is unlocked/approved for access
export function isCourseAccessApproved(courseSlug: string): boolean {
  if (typeof window === 'undefined') return true;
  const list = getUnlockedCourses();
  return list.some((e) => e.courseSlug === courseSlug);
}
