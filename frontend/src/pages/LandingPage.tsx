import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Calendar, Shield, Award, ArrowRight, ChartNoAxesCombined } from 'lucide-react';
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
    <div className="min-h-screen px-4 bg-[var(--bg)] font-sans selection:bg-[var(--accent)] selection:text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-[var(--accent)]">
          <ChartNoAxesCombined size={32} strokeWidth={2.5} />
          <span className="text-xl font-bold font-heading text-[var(--text-h)] tracking-tight">HabitTracker</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/register">
            <Button variant="primary">Register</Button>
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
            <span className="text-blue-500">
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

        {/* Interactive Preview Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 relative mx-auto max-w-5xl"
        >
          <div className="grid md:grid-cols-2 gap-6 text-left">
            {/* Left Column: Habit Card Preview */}
            <div className="bg-[var(--code-bg)] border border-[var(--border)] rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <ChartNoAxesCombined size={120} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                    <Activity className="text-emerald-500 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[var(--text-h)]">Morning Meditation</h3>
                    <p className="text-sm text-[var(--text)]">Daily • 15 mins</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm text-[var(--text)] uppercase tracking-wider font-semibold mb-1">Current Streak</p>
                      <p className="text-4xl font-bold text-emerald-500">14 Days</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[var(--text)] uppercase tracking-wider font-semibold mb-1">Completion</p>
                      <p className="text-2xl font-bold text-[var(--text-h)]">96%</p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="h-3 w-full bg-[var(--bg)] rounded-full overflow-hidden border border-[var(--border)]">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "96%" }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
                    />
                  </div>

                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <div key={i} className={`flex-1 h-10 rounded-lg border flex items-center justify-center font-bold text-xs ${i === 7 ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-[var(--bg)] border-[var(--border)] text-[var(--text)]'}`}>
                        {i === 7 ? '✓' : ''}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Global Stats Preview */}
            <div className="flex flex-col gap-6">
              <div className="bg-[var(--bg)] border border-[var(--border)] rounded-3xl p-6 shadow-xl flex-1 flex flex-col justify-center">
                <p className="text-sm text-[var(--text)] font-semibold mb-2 flex items-center gap-2">
                  <Award className="text-amber-500 w-4 h-4" />
                  Achievements
                </p>
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <Award className="text-amber-500 w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-[var(--text-h)]">Consistent Master</p>
                    <p className="text-sm text-[var(--text)]">Awarded for a 30-day streak</p>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--bg)] border border-[var(--border)] rounded-3xl p-6 shadow-xl flex-1 grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-2xl bg-[var(--social-bg)]">
                  <p className="text-2xl font-bold text-[var(--accent)]">12</p>
                  <p className="text-xs text-[var(--text)] font-semibold uppercase">Active Habits</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-[var(--social-bg)]">
                  <p className="text-2xl font-bold text-emerald-500">850+</p>
                  <p className="text-xs text-[var(--text)] font-semibold uppercase">Total Check-ins</p>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Accents */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-[var(--accent)]/10 blur-[100px] -z-10 rounded-full"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/10 blur-[100px] -z-10 rounded-full"></div>
        </motion.div>
      </main>

      {/* Features Section */}
      <section className="bg-[var(--code-bg)] border-y border-[var(--border)] py-32 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,var(--accent-bg)_0%,transparent_70%)] opacity-30"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-[var(--text-h)] mb-6 tracking-tight">Built for real life</h2>
            <p className="text-lg text-[var(--text)] max-w-2xl mx-auto leading-relaxed">We know that perfection is a myth. Our system is designed to handle the messy reality of building durable habits.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-[var(--bg)] p-10 rounded-3xl border border-[var(--border)] shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-[var(--social-bg)] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold font-heading text-[var(--text-h)] mb-4">{feature.title}</h3>
                <p className="text-[var(--text)] leading-relaxed text-lg">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-10 bg-gradient-to-br from-[var(--accent)] to-indigo-600 rounded-[3rem] py-20 text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-[2rem]"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl text-white font-bold mb-6">Ready to change your life?</h2>
            <p className="text-xl text-white/80 mb-10 max-w-xl mx-auto">Join thousands of others building better versions of themselves, one check-in at a time.</p>
            <Link to="/register">
              <Button size="lg" variant="ghost" className="bg-white text-[var(--accent)] hover:bg-white/90 text-xl px-12 py-8 rounded-2xl shadow-lg border-none">
                Get Started for Free
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-12 text-center text-[var(--text)] bg-[var(--bg)]">
        <div className="flex justify-center items-center gap-2 text-[var(--accent)] mb-4">
          <ChartNoAxesCombined size={24} strokeWidth={2.5} />
          <span className="text-lg font-bold font-heading text-[var(--text-h)]">HabitTracker</span>
        </div>
        <p className="text-sm">&copy; {new Date().getFullYear()} HabitTracker. All rights reserved.</p>
      </footer>
    </div>
  );
};
