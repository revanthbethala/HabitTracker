import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  LayoutDashboard, 
  ListTodo, 
  Award, 
  LogOut, 
  Menu,
  X,
  Flame,
  ChartNoAxesCombined,
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { useDashboard } from '@/hooks/useMetrics';

export const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: dashboard } = useDashboard();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Habits', href: '/habits', icon: ListTodo },
    { name: 'Badges', href: '/badges', icon: Award },
  ];

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col md:flex-row">
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-[var(--border)] bg-[var(--bg)] z-30">
        <div className="flex items-center gap-2 text-[var(--accent)]">
          <Activity size={24} strokeWidth={2.5} />
          <span className="text-lg font-bold font-heading text-[var(--text-h)] tracking-tight">HabitTracker</span>
        </div>
        <div className="flex items-center gap-8">
          {dashboard?.data && (
            <div className="flex items-center gap-1  text-orange-500 px-3 py-1 rounded-full border border-orange-500/20">
              <Flame size={16} fill="currentColor" />
              <span className="text-sm font-bold">{dashboard.data.currentStreak || 0}</span>
            </div>
          )}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-[var(--text)]">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <AnimatePresence>
        {(isMobileMenuOpen || window.innerWidth >= 768) && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className={`
              fixed md:sticky top-0 left-0 h-screen w-64 bg-[var(--code-bg)] md:bg-[var(--bg)] border-r border-[var(--border)]
              flex flex-col z-40 shadow-2xl md:shadow-none
              ${isMobileMenuOpen ? 'block' : 'hidden md:flex'}
            `}
          >
            {/* Logo */}
            <div className="p-6 hidden md:flex items-center justify-between border-b border-[var(--border)]">
              <div className="flex items-center gap-2 text-[var(--accent)]">
                <ChartNoAxesCombined size={32} strokeWidth={2.5} />
                <span className="text-xl font-bold font-heading text-[var(--text-h)] tracking-tight">HabitTracker</span>
              </div>
              {dashboard?.data && (
                <div className="flex items-center gap-1 text-orange-500 px-3 py-1.5" title="Highest Current Streak">
                  <Flame size={18} fill="currentColor" />
                  <span className="font-bold">{dashboard.data.currentStreak || 0}</span>
                </div>
              )}
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={closeMobileMenu}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium
                      ${active 
                        ? 'bg-[var(--accent-bg)] text-[var(--accent)]' 
                        : 'text-[var(--text)] hover:bg-[var(--bg)] md:hover:bg-[var(--code-bg)] hover:text-[var(--text-h)]'}
                    `}
                  >
                    <Icon size={20} className={active ? "text-[var(--accent)]" : "text-[var(--text)]"} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* User Profile & Logout */}
            <div className="p-4 border-t border-[var(--border)]">
              <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-[var(--bg)] md:bg-[var(--code-bg)] border border-[var(--border)]">
                <div className="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-bold font-heading">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-semibold text-[var(--text-h)] truncate">{user?.name}</p>
                  <p className="text-xs text-[var(--text)] truncate">{user?.email}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                onClick={() => {
                  logout();
                  closeMobileMenu();
                }}
              >
                <LogOut size={18} className="mr-2" />
                Sign Out
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeMobileMenu}
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen overflow-y-auto">
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
