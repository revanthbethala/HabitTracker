import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[var(--bg)]">
      {/* Left side - Branding/Marketing (Hidden on small screens) */}
      <div className="hidden md:flex md:w-1/2 bg-[var(--accent-bg)] flex-col justify-center items-center p-12 border-r border-[var(--border)] relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-[var(--accent)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="z-10 max-w-md text-center"
        >
          <div className="flex justify-center items-center mb-6 text-[var(--accent)]">
            <Activity size={64} strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-bold mb-4">Master Your Routine</h1>
          <p className="text-lg text-[var(--text)] mb-8">
            Build durable habits with smart streaks, schedule exceptions, and meaningful progress tracking.
          </p>
          <div className="flex gap-4 justify-center">
             <div className="p-4 bg-[var(--bg)] rounded-xl shadow-[var(--shadow)] flex flex-col items-center justify-center border border-[var(--border)]">
                <span className="text-2xl font-bold text-[var(--accent)]">100%</span>
                <span className="text-xs text-[var(--text)] uppercase font-semibold">Private</span>
             </div>
             <div className="p-4 bg-[var(--bg)] rounded-xl shadow-[var(--shadow)] flex flex-col items-center justify-center border border-[var(--border)]">
                <span className="text-2xl font-bold text-emerald-500">24/7</span>
                <span className="text-xs text-[var(--text)] uppercase font-semibold">Tracking</span>
             </div>
          </div>
        </motion.div>
      </div>

      {/* Right side - Forms */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="md:hidden flex items-center justify-center gap-2 mb-8 text-[var(--accent)]">
            <Activity size={32} />
            <span className="text-2xl font-bold font-heading text-[var(--text-h)]">HabitTracker</span>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Outlet />
          </motion.div>

          <div className="mt-8 text-center text-sm text-[var(--text)]">
            <Link to="/" className="hover:text-[var(--accent)] transition-colors">
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
