'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  getCurrentUser,
  loginAsRole,
  logoutUser,
  getRoleDashboardPath,
  getRoleFriendlyName,
  AuthUser,
  UserRole,
} from '@/lib/authService';

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string | number;
}

interface PortalLayoutProps {
  role: 'student' | 'instructor' | 'organization' | 'admin';
  userName: string;
  userRoleLabel: string;
  userAvatar?: string;
  organizationName?: string;
  navItems: NavItem[];
  children: React.ReactNode;
}

export default function PortalLayout({
  role,
  userName,
  userRoleLabel,
  organizationName,
  navItems,
  children,
}: PortalLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let user = getCurrentUser();
    if (!user) {
      // If no active session, initialize session with current portal's role
      user = loginAsRole(role, userName);
    }
    setCurrentUser(user);

    const onAuthChange = (e: any) => {
      setCurrentUser(e.detail || null);
    };
    window.addEventListener('learnx_auth_changed', onAuthChange);
    return () => window.removeEventListener('learnx_auth_changed', onAuthChange);
  }, [role, userName]);

  const handleLogout = () => {
    logoutUser();
    router.push('/login');
  };

  const handleSwitchToCurrentRole = () => {
    const newUser = loginAsRole(role, userName);
    setCurrentUser(newUser);
  };

  const roleTheme = {
    student: {
      badge: 'bg-primary-100 text-primary-800 border-primary-200',
      activeNav: 'bg-primary-600 text-white shadow-soft-sm',
      accent: 'text-primary-600',
      portalTitle: '🎓 Student Learning Portal',
    },
    instructor: {
      badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      activeNav: 'bg-indigo-600 text-white shadow-soft-sm',
      accent: 'text-indigo-600',
      portalTitle: '🎙️ Instructor Teaching Studio',
    },
    organization: {
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      activeNav: 'bg-emerald-600 text-white shadow-soft-sm',
      accent: 'text-emerald-600',
      portalTitle: organizationName ? `🏢 ${organizationName}` : '🏢 Enterprise Organization LMS',
    },
    admin: {
      badge: 'bg-rose-100 text-rose-800 border-rose-200',
      activeNav: 'bg-rose-600 text-white shadow-soft-sm',
      accent: 'text-rose-600',
      portalTitle: '🛡️ Academy Super Admin Command',
    },
  }[role];

  // ACCESS CONTROL GUARD:
  // If the logged-in user belongs to another role, restrict access to this dashboard
  const isAccessDenied = mounted && currentUser && currentUser.role !== role;

  if (isAccessDenied) {
    return (
      <div className="min-h-screen bg-background-100/80 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-background-200 shadow-soft-xl p-8 text-center space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-3xl mx-auto shadow-soft-xs">
            <i className="ri-shield-keyhole-line" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200 uppercase tracking-wider">
              Access Restricted / এক্সেস সীমাবদ্ধ
            </span>
            <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-foreground-950">
              অননুমোদিত ড্যাশবোর্ড এক্সেস
            </h2>
            <p className="text-xs text-foreground-600 leading-relaxed">
              আপনি বর্তমানে <strong className="text-foreground-950 font-bold">{getRoleFriendlyName(currentUser.role)}</strong> হিসেবে লগইন আছেন। এই ড্যাশবোর্ড ও অপশনগুলো শুধুমাত্র <strong className="text-primary-700 font-bold">{getRoleFriendlyName(role)}</strong> ব্যবহারকারীদের জন্য সংরক্ষিত।
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-background-50 border border-background-200 text-xs text-left space-y-1.5 text-foreground-700">
            <div className="flex justify-between">
              <span className="text-foreground-400">আপনার একাউন্ট:</span>
              <span className="font-bold">{currentUser.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-400">বর্তমান রোল:</span>
              <span className="font-mono font-bold uppercase text-primary-600">{currentUser.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-400">অনুরোধকৃত ড্যাশবোর্ড:</span>
              <span className="font-mono font-bold uppercase text-rose-600">{role}</span>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <Link
              href={getRoleDashboardPath(currentUser.role)}
              className="w-full py-3 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-soft-sm transition-all flex items-center justify-center gap-2"
            >
              <i className="ri-arrow-left-line" />
              <span>আমার {currentUser.role.toUpperCase()} ড্যাশবোর্ডে ফিরে যান</span>
            </Link>

            <button
              type="button"
              onClick={handleSwitchToCurrentRole}
              className="w-full py-2.5 px-4 rounded-xl border border-background-300 hover:bg-background-50 text-foreground-700 font-bold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <i className="ri-refresh-line" />
              <span>{role.toUpperCase()} হিসেবে লগইন স্যুইচ করুন</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-2 px-4 text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors"
            >
              লগআউট করুন (Log Out)
            </button>
          </div>
        </div>
      </div>
    );
  }

  const effectiveUserName = currentUser ? currentUser.name : userName;
  const effectiveUserRoleLabel = currentUser ? currentUser.roleLabel : userRoleLabel;

  return (
    <div className="min-h-screen bg-background-100/70 text-foreground-900 flex flex-col">
      {/* Academy Portal Header — Dedicated to the specific role without public switcher */}
      <div className="bg-foreground-950 text-white text-xs px-4 sm:px-6 py-2 flex items-center justify-between flex-wrap gap-2 border-b border-foreground-900 z-50">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="font-heading font-bold text-white text-xs sm:text-sm tracking-tight">
            {roleTheme.portalTitle}
          </span>
          <span className="text-foreground-500 hidden sm:inline">|</span>
          <span className="text-foreground-300 text-[11px] hidden sm:inline">
            Active Workspace
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-foreground-400 hidden md:inline">
            Logged in: <strong className="text-white font-medium">{effectiveUserName}</strong> ({effectiveUserRoleLabel})
          </span>
          <Link
            href="/"
            className="px-2.5 py-1 rounded bg-background-900 hover:bg-background-800 text-foreground-300 hover:text-white transition-colors"
          >
            Public Site ↗
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="px-2.5 py-1 rounded bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 hover:text-white font-bold transition-colors flex items-center gap-1"
          >
            <i className="ri-logout-box-r-line" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar for Desktop */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-background-200 shrink-0">
          {/* Brand header */}
          <div className="p-5 border-b border-background-200 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 font-heading text-xl font-bold tracking-tight text-foreground-950">
              <span className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-soft-sm">
                <i className="ri-book-open-line text-lg" />
              </span>
              <span>
                Learn<span className="text-primary-600">X</span>
              </span>
            </Link>
            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${roleTheme.badge}`}>
              {role}
            </span>
          </div>

          {/* Navigation Links — Strictly Isolated */}
          <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
            <p className="px-3 text-[11px] font-bold text-foreground-400 uppercase tracking-wider mb-2">
              {role.toUpperCase()} OPTIONS
            </p>
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== `/${role}/dashboard` && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? roleTheme.activeNav
                      : 'text-foreground-600 hover:bg-background-100 hover:text-foreground-950'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <i className={`${item.icon} text-lg`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-primary-50 text-primary-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer User Info */}
          <div className="p-4 border-t border-background-200 bg-background-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm shrink-0">
                {effectiveUserName.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-foreground-950 truncate">{effectiveUserName}</p>
                <p className="text-[11px] text-foreground-500 truncate">{effectiveUserRoleLabel}</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 text-foreground-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                title="Logout"
              >
                <i className="ri-logout-box-r-line text-lg" />
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-foreground-950/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <div
              className="w-64 max-w-xs h-full bg-white flex flex-col shadow-soft-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-background-200 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-heading font-bold text-lg">
                  <span className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white">
                    <i className="ri-book-open-line" />
                  </span>
                  <span>LearnX</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 text-foreground-500 hover:text-foreground-900"
                >
                  <i className="ri-close-line text-2xl" />
                </button>
              </div>

              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                <p className="px-3 text-[10px] font-bold text-foreground-400 uppercase tracking-wider mb-2">
                  {role.toUpperCase()} MENU
                </p>
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold ${
                        isActive
                          ? roleTheme.activeNav
                          : 'text-foreground-600 hover:bg-background-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <i className={`${item.icon} text-lg`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-primary-50 text-primary-700">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-background-200">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <i className="ri-logout-box-r-line" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Dashboard Sub Header */}
          <header className="h-16 bg-white border-b border-background-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl text-foreground-700 hover:bg-background-100"
                aria-label="Open sidebar"
              >
                <i className="ri-menu-2-line text-xl" />
              </button>
              <h1 className="font-heading font-extrabold text-base sm:text-lg text-foreground-950">
                {roleTheme.portalTitle}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-background-200 text-xs font-semibold text-foreground-600 hover:text-foreground-950 hover:bg-background-50 transition-colors"
              >
                <i className="ri-home-4-line text-sm" />
                <span>Home</span>
              </Link>

              {/* User Avatar dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-background-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-600 text-white font-bold text-xs flex items-center justify-center">
                    {effectiveUserName.charAt(0)}
                  </div>
                  <span className="hidden sm:inline text-xs font-bold text-foreground-800">
                    {effectiveUserName}
                  </span>
                  <i className="ri-arrow-down-s-line text-foreground-400" />
                </button>

                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-soft-xl border border-background-200 py-1.5 z-50 animate-fade-in"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-background-100">
                      <p className="text-xs font-bold text-foreground-950">{effectiveUserName}</p>
                      <p className="text-[11px] text-foreground-500">{effectiveUserRoleLabel}</p>
                    </div>
                    <Link
                      href={role === 'student' ? '/student/settings' : role === 'instructor' ? '/instructor/settings' : role === 'admin' ? '/admin/settings' : '/organization/settings'}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-foreground-700 hover:bg-background-50 hover:text-primary-600"
                    >
                      <i className="ri-user-settings-line text-sm" />
                      <span>Account Settings</span>
                    </Link>
                    <Link
                      href="/"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-foreground-700 hover:bg-background-50 hover:text-primary-600"
                    >
                      <i className="ri-earth-line text-sm" />
                      <span>Public Website</span>
                    </Link>
                    <div className="my-1 border-t border-background-100" />
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 text-left"
                    >
                      <i className="ri-logout-box-r-line text-sm" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Page Body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
