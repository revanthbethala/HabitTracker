import React from 'react';
import { useDashboard } from '@/hooks/useMetrics';
import { useCheckInMutation } from '@/hooks/useHabits';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Activity, Target, Trophy, TrendingUp, Check, X as XIcon, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const Dashboard: React.FC = () => {
  const { data: response, isLoading } = useDashboard();
  const checkInMutation = useCheckInMutation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--accent)]"></div>
      </div>
    );
  }

  const summary = response?.data;

  const handleCheckIn = async (habitId: number, status: 'DONE' | 'SKIPPED' | 'PARTIAL') => {
    try {
      await checkInMutation.mutateAsync({
        habitId,
        data: {
          checkInDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
          status,
        }
      });
      toast.success('Progress saved!');
    } catch (error) {
      toast.error('Failed to save progress');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-heading text-[var(--text-h)] tracking-tight">Today's Pulse</h1>
        <Link to="/habits/new">
          <Button>+ New Habit</Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <Activity className="text-blue-500 mb-2" size={24} />
            <p className="text-sm font-medium text-[var(--text)] mb-1">Active Habits</p>
            <p className="text-3xl font-bold font-mono text-[var(--text-h)]">{summary?.totalActiveHabits || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <TrendingUp className="text-emerald-500 mb-2" size={24} />
            <p className="text-sm font-medium text-[var(--text)] mb-1">Completion Rate</p>
            <p className="text-3xl font-bold font-mono text-[var(--text-h)]">{summary?.globalCompletionRate || 0}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <Target className="text-[var(--accent)] mb-2" size={24} />
            <p className="text-sm font-medium text-[var(--text)] mb-1">Today's Progress</p>
            <p className="text-3xl font-bold font-mono text-[var(--text-h)]">{summary?.todayProgress || 0}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <Trophy className="text-amber-500 mb-2" size={24} />
            <p className="text-sm font-medium text-[var(--text)] mb-1">Badges Earned</p>
            <p className="text-3xl font-bold font-mono text-[var(--text-h)]">{summary?.totalBadgesEarned || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Due Today */}
      <div className="mt-12">
        <h2 className="text-xl font-bold font-heading text-[var(--text-h)] mb-4 flex items-center gap-2">
          <Target className="text-[var(--accent)]" size={20} />
          Focus List
        </h2>
        
        {!summary?.dueHabits?.length ? (
          <Card className="bg-[var(--code-bg)] border-dashed">
            <CardContent className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-[var(--bg)] rounded-full flex items-center justify-center mb-4 text-emerald-500 shadow-sm">
                <Check size={32} />
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-h)] mb-2">You're all caught up!</h3>
              <p className="text-[var(--text)] max-w-sm mb-6">No habits are due today or you've completed them all. Enjoy your day!</p>
              <Link to="/habits/new">
                <Button variant="outline">Create a new habit</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {summary.dueHabits.map((habit, index) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                key={habit.id}
              >
                <Card className="overflow-hidden hover:border-[var(--accent-border)] transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5">
                    <div className="mb-4 sm:mb-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold font-heading text-[var(--text-h)]">{habit.name}</h3>
                        {habit.category && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-[var(--social-bg)] text-[var(--text)] font-medium">
                            {habit.category}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-4 text-sm text-[var(--text)]">
                        <span className="flex items-center gap-1">
                          <TrendingUp size={14} className="text-emerald-500" /> 
                          {habit.currentStreak} streak
                        </span>
                        <span>
                          {habit.targetType === 'COUNT' ? `Target: ${habit.targetValue} ${habit.unit}` : 'Daily goal'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-10 border-rose-500/20 text-rose-500 hover:bg-rose-500/10"
                        onClick={() => handleCheckIn(habit.id, 'SKIPPED')}
                        disabled={checkInMutation.isPending}
                        title="Skip today"
                      >
                        <XIcon size={18} />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-10 border-amber-500/20 text-amber-600 hover:bg-amber-500/10"
                        onClick={() => handleCheckIn(habit.id, 'PARTIAL')}
                        disabled={checkInMutation.isPending}
                        title="Partial completion"
                      >
                        <Minus size={18} />
                      </Button>
                      <Button 
                        size="sm" 
                        className="h-10 bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20"
                        onClick={() => handleCheckIn(habit.id, 'DONE')}
                        disabled={checkInMutation.isPending || habit.todayStatus === 'DONE'}
                      >
                        <Check size={18} className="mr-1" />
                        {habit.todayStatus === 'DONE' ? 'Completed' : 'Done'}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
