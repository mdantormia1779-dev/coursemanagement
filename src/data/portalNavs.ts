import { NavItem } from '@/components/portal/PortalLayout';

export const STUDENT_NAV: NavItem[] = [
  { label: 'My Dashboard', href: '/student/dashboard', icon: 'ri-dashboard-line' },
  { label: 'My Class (আমার ক্লাস)', href: '/student/my-class', icon: 'ri-presentation-line', badge: 'Live' },
  { label: 'Live Classes', href: '/student/live-classes', icon: 'ri-broadcast-line' },
  { label: 'Batch & Admission', href: '/student/admission', icon: 'ri-id-card-line', badge: 'Active' },
  { label: 'My Courses', href: '/student/courses', icon: 'ri-book-read-line', badge: 3 },
  { label: 'Quizzes', href: '/student/quizzes', icon: 'ri-questionnaire-line', badge: 1 },
  { label: 'Assignments', href: '/student/assignments', icon: 'ri-file-list-3-line' },
  { label: 'Certificates', href: '/student/certificates', icon: 'ri-award-line', badge: 2 },
  { label: 'Wishlist', href: '/student/wishlist', icon: 'ri-heart-line' },
  { label: 'Order History', href: '/student/orders', icon: 'ri-receipt-line' },
  { label: 'Account Settings', href: '/student/settings', icon: 'ri-settings-4-line' },
];

export const INSTRUCTOR_NAV: NavItem[] = [
  { label: 'Studio Dashboard', href: '/instructor/dashboard', icon: 'ri-dashboard-line' },
  { label: 'Live Classes Hub', href: '/instructor/live-classes', icon: 'ri-broadcast-line', badge: 2 },
  { label: 'My Teaching Courses', href: '/instructor/courses', icon: 'ri-folder-video-line', badge: 4 },
  { label: 'Create New Course', href: '/instructor/courses/create', icon: 'ri-add-circle-line' },
  { label: 'Enrolled Students Roster', href: '/instructor/students', icon: 'ri-group-line', badge: 342 },
  { label: 'Assignments Grading', href: '/instructor/assignments', icon: 'ri-task-line', badge: 5 },
  { label: 'Earnings & Payouts', href: '/instructor/earnings', icon: 'ri-wallet-3-line' },
  { label: 'Student Reviews', href: '/instructor/reviews', icon: 'ri-star-smile-line' },
  { label: 'Instructor Settings', href: '/instructor/settings', icon: 'ri-settings-4-line' },
];

export const ORG_NAV: NavItem[] = [
  { label: 'Tenant Overview', href: '/organization/dashboard', icon: 'ri-building-line' },
  { label: 'Enrolled Employees', href: '/organization/students', icon: 'ri-user-star-line', badge: 1250 },
  { label: 'Faculty & Mentors', href: '/organization/instructors', icon: 'ri-presentation-line', badge: 18 },
  { label: 'Enterprise Catalog', href: '/organization/courses', icon: 'ri-book-open-line', badge: 28 },
  { label: 'White-Label Branding', href: '/organization/branding', icon: 'ri-palette-line' },
  { label: 'SaaS Subscription', href: '/organization/subscription', icon: 'ri-vip-crown-line' },
  { label: 'Analytics Reports', href: '/organization/reports', icon: 'ri-bar-chart-2-line' },
  { label: 'Tenant Settings', href: '/organization/settings', icon: 'ri-settings-3-line' },
];

export const ADMIN_NAV: NavItem[] = [
  { label: 'Academy Dashboard', href: '/admin/dashboard', icon: 'ri-pie-chart-line' },
  { label: 'Manual Payments & Admissions', href: '/admin/admissions', icon: 'ri-user-add-line', badge: 'New' },
  { label: 'Lead CRM & Calls', href: '/admin/leads', icon: 'ri-customer-service-2-line', badge: 14 },
  { label: 'Course Approvals', href: '/admin/courses', icon: 'ri-folder-video-line', badge: 3 },
  { label: 'Staff & Students Directory', href: '/admin/users', icon: 'ri-shield-user-line' },
  { label: 'Instructor Disbursements', href: '/admin/withdrawals', icon: 'ri-wallet-3-line' },
  { label: 'Enterprise Organizations', href: '/admin/organizations', icon: 'ri-building-line' },
  { label: 'SaaS Subscriptions', href: '/admin/subscriptions', icon: 'ri-vip-crown-line' },
  { label: 'System Audit Logs', href: '/admin/audit-logs', icon: 'ri-history-line' },
  { label: 'Academy & Payment Settings', href: '/admin/settings', icon: 'ri-settings-5-line' },
];
