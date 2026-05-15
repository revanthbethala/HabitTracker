import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Calendar, Shield, Award, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const LandingPage: React.FC = () => {
  const features = [
    {
      icon: <Calendar className="w-6 h-6 text-emerald-500" />,
      title: "Smart Scheduling",
      description: "Daily, specific days, or weekly targets. The app adapts to your life, not the other way around."
    },
    {
      icon: <Shield className="w-6 h-6 text-blue-500" />,
      title: "Streak Protection",
      description: "Sick day? Vacation? Add an exception and protect your hard-earned streaks."
    },
    {
      icon: <Award className="w-6 h-6 text-[var(--accent)]" />,
      title: "Gamified Progress",
      description: "Earn badges and celebrate milestones as you build unbreakable habits."
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] font-sans selection:bg-[var(--accent)] selection:text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-[var(--accent)]">
          <Activity size={32} strokeWidth={2.5} />
          <span className="text-xl font-bold font-heading text-[var(--text-h)] tracking-tight">HabitTracker</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link to="/register">
            <Button variant="primary">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold font-heading text-[var(--text-h)] tracking-tight mb-6 leading-tight">
            Master your routine. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-emerald-500">
              Build your future.
            </span>
          </h1>
          <p className="text-xl text-[var(--text)] mb-10 leading-relaxed max-w-2xl mx-auto">
            A private, intelligent habit tracker designed to capture your commitments, accommodate real life, and celebrate your progress.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-xl flex items-center gap-2 group">
                Start Tracking Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Decorative App Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 relative mx-auto max-w-5xl"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--bg)] z-10 top-1/2"></div>
          <div className="rounded-2xl border border-[var(--border)] shadow-2xl bg-[var(--code-bg)] overflow-hidden aspect-[16/9] flex items-center justify-center relative">
            {/* Abstract representation of dashboard */}
            <div className="absolute top-0 w-full h-12 border-b border-[var(--border)] bg-[var(--bg)] flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
            </div>
            <div className="w-full h-full pt-12 flex">
              <div className="w-64 border-r border-[var(--border)] p-6 hidden md:block">
                <div className="w-32 h-4 bg-[var(--border)] rounded mb-8"></div>
                <div className="space-y-4">
                  <div className="w-full h-8 bg-[var(--accent-bg)] rounded"></div>
                  <div className="w-3/4 h-8 bg-[var(--bg)] rounded"></div>
                  <div className="w-4/5 h-8 bg-[var(--bg)] rounded"></div>
                </div>
              </div>
              <div className="flex-1 p-8">
                <div className="w-48 h-8 bg-[var(--text-h)] rounded opacity-20 mb-8"></div>
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="h-24 bg-[var(--bg)] rounded-xl border border-[var(--border)]"></div>
                  <div className="h-24 bg-[var(--bg)] rounded-xl border border-[var(--border)]"></div>
                  <div className="h-24 bg-[var(--bg)] rounded-xl border border-[var(--border)]"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-16 bg-[var(--bg)] rounded-xl border border-[var(--border)] w-full"></div>
                  <div className="h-16 bg-[var(--bg)] rounded-xl border border-[var(--border)] w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Features Section */}
      <section className="bg-[var(--code-bg)] border-t border-[var(--border)] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-heading text-[var(--text-h)] mb-4">Built for real life</h2>
            <p className="text-[var(--text)] max-w-2xl mx-auto">We know that perfection is a myth. Our system is designed to handle the messy reality of building durable habits.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[var(--bg)] p-8 rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--social-bg)] flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold font-heading text-[var(--text-h)] mb-3">{feature.title}</h3>
                <p className="text-[var(--text)] leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-8 text-center text-[var(--text)]">
        <p>&copy; {new Date().getFullYear()} HabitTracker. Built for focus.</p>
      </footer>
    </div>
  );
};
