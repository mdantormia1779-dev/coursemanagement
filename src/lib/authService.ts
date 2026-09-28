// Authentication, Role-Based Access Control (RBAC) & Dashboard Isolation Service

export type UserRole = 'student' | 'instructor' | 'organization' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleLabel: string;
  avatar?: string;
  organizationName?: string;
}

export const PREDEFINED_USERS: Record<UserRole, AuthUser> = {
  student: {
    id: 'usr-std-101',
    name: 'Sarah Khan',
    email: 'sarah.khan@example.com',
    role: 'student',
    roleLabel: 'Enrolled Student',
  },
  instructor: {
    id: 'usr-inst-201',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'instructor',
    roleLabel: 'Lead Faculty Instructor',
  },
  organization: {
    id: 'usr-org-301',
    name: 'TechCorp Academy',
    email: 'admin@techcorp.com',
    role: 'organization',
    roleLabel: 'Tenant Enterprise Admin',
    organizationName: 'TechCorp Academy Ltd.',
  },
  admin: {
    id: 'usr-admin-401',
    name: 'Academy Director',
    email: 'director@academy.com',
    role: 'admin',
    roleLabel: 'Academy Super Administrator',
  },
};

const AUTH_STORAGE_KEY = 'learnx_auth_user_session_v2';

export function getRoleDashboardPath(role: UserRole): string {
  switch (role) {
    case 'student':
      return '/student/dashboard';
    case 'instructor':
      return '/instructor/dashboard';
    case 'organization':
      return '/organization/dashboard';
    case 'admin':
      return '/admin/dashboard';
  }
}

export function getRoleFriendlyName(role: UserRole): string {
  switch (role) {
    case 'student':
      return 'Student (শিক্ষার্থী)';
    case 'instructor':
      return 'Instructor (প্রশিক্ষক)';
    case 'organization':
      return 'Organization (প্রতিষ্ঠান)';
    case 'admin':
      return 'Super Admin (এডমিন)';
  }
}

// Get current active logged-in user
export function getCurrentUser(): AuthUser | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

// Login as specific role
export function loginAsRole(
  role: UserRole,
  customName?: string,
  customEmail?: string
): AuthUser {
  const base = PREDEFINED_USERS[role];
  const user: AuthUser = {
    ...base,
    name: customName || base.name,
    email: customEmail || base.email,
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      window.dispatchEvent(new CustomEvent('learnx_auth_changed', { detail: user }));
    } catch (e) {
      console.error('Failed to save auth session:', e);
    }
  }

  return user;
}

// Logout user
export function logoutUser(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('learnx_auth_changed', { detail: null }));
  } catch (e) {
    console.error('Failed to clear auth session:', e);
  }
}

// Check if user is allowed to access target role
export function isUserAuthorized(user: AuthUser | null, targetRole: UserRole): boolean {
  if (!user) {
    // If not logged in, auto-login with default for that role or deny
    return false;
  }
  return user.role === targetRole;
}
