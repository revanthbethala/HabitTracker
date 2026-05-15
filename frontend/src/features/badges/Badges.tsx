import React from 'react';
import { useBadges } from '@/hooks/useMetrics';
import { Card, CardContent } from '@/components/ui/Card';
import { Award, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export const Badges: React.FC = () => {
  const { data: response, isLoading } = useBadges();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--accent)]"></div>
      </div>
    );
  }

  const badges = response?.data || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading text-[var(--text-h)] tracking-tight">Achievement Hall</h1>
        <p className="text-[var(--text)]">Track your progress and earn rewards.</p>
      </div>

      {badges.length === 0 ? (
         <Card className="bg-[var(--code-bg)] border-dashed mt-8">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-[var(--bg)] rounded-full flex items-center justify-center mb-4 text-[var(--text)] shadow-sm">
              <Award size={32} />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-h)] mb-2">No badges available</h3>
            <p className="text-[var(--text)] max-w-sm mb-6">Start checking in to earn your first badge!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {badges.map((badge, index) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              key={badge.id}
            >
              <Card className={`h-full border-2 transition-all ${badge.isEarned ? 'border-[var(--accent)] bg-[var(--accent-bg)] shadow-[var(--accent-border)]' : 'border-[var(--border)] bg-[var(--bg)] opacity-70 grayscale'}`}>
                <CardContent className="p-6 flex flex-col items-center text-center h-full justify-between gap-4">
                  <div className="relative">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center ${badge.isEarned ? 'bg-gradient-to-br from-[var(--accent)] to-emerald-500 text-white shadow-lg' : 'bg-[var(--code-bg)] text-[var(--text)]'}`}>
                      {badge.isEarned ? <Award size={40} /> : <Lock size={40} />}
                    </div>
                  </div>
                  <div>
                    <h3 className={`font-bold font-heading mb-1 ${badge.isEarned ? 'text-[var(--text-h)]' : 'text-[var(--text)]'}`}>{badge.name}</h3>
                    <p className="text-xs text-[var(--text)]">{badge.criteria}</p>
                  </div>
                  {badge.isEarned && badge.earnedAt && (
                    <div className="mt-auto pt-4 border-t border-[var(--border)] w-full">
                      <p className="text-xs font-mono text-[var(--accent)] font-semibold">
                        Unlocked {new Date(badge.earnedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
