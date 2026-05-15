import React, { useState } from 'react';
import { useHabits, useHabitMutations } from '@/hooks/useHabits';
import type { HabitStatus } from '@/types/habit';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Archive, PauseCircle, PlayCircle, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export const HabitList: React.FC = () => {
  const [filter, setFilter] = useState<HabitStatus | 'ALL'>('ACTIVE');
  
  const { data: response, isLoading } = useHabits(filter === 'ALL' ? undefined : filter);
  const { deleteHabit } = useHabitMutations();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--accent)]"></div>
      </div>
    );
  }

  const habits = response?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-[var(--text-h)] tracking-tight">My Habits</h1>
          <p className="text-[var(--text)]">Manage and track your routines.</p>
        </div>
        <Link to="/habits/new">
          <Button className="flex items-center gap-2 shadow-[var(--shadow)]">
            <Plus size={18} />
            New Habit
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <Filter size={18} className="text-[var(--text)] mr-2 flex-shrink-0" />
        {['ALL', 'ACTIVE', 'PAUSED', 'ARCHIVED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as HabitStatus | 'ALL')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === status 
                ? 'bg-[var(--accent-bg)] text-[var(--accent)] border border-[var(--accent-border)]' 
                : 'bg-[var(--code-bg)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--border)]'
            }`}
          >
            {status.charAt(0) + status.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* List */}
      {habits.length === 0 ? (
        <Card className="bg-[var(--code-bg)] border-dashed mt-8">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-[var(--bg)] rounded-full flex items-center justify-center mb-4 text-[var(--text)] shadow-sm">
              <Archive size={32} />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-h)] mb-2">No habits found</h3>
            <p className="text-[var(--text)] max-w-sm mb-6">You don't have any {filter !== 'ALL' ? filter.toLowerCase() : ''} habits right now.</p>
            {filter === 'ACTIVE' && (
              <Link to="/habits/new">
                <Button variant="outline">Create your first habit</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 mt-6">
          {habits.map((habit, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              key={habit.id}
            >
              <Link to={`/habits/${habit.id}`}>
                <Card className="hover:border-[var(--accent-border)] transition-all hover:shadow-md cursor-pointer group">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold font-heading text-[var(--text-h)] group-hover:text-[var(--accent)] transition-colors">{habit.name}</h3>
                        {habit.status !== 'ACTIVE' && (
                          <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-[var(--social-bg)] text-[var(--text)]">
                            {habit.status}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[var(--text)] mb-3">{habit.description || 'No description'}</p>
                      
                      <div className="flex flex-wrap gap-4 text-xs font-medium text-[var(--text)]">
                         <div className="flex items-center gap-1.5 bg-[var(--code-bg)] px-2.5 py-1 rounded-md">
                           <span className="text-emerald-500 font-mono text-sm">{habit.currentStreak}</span> streak
                         </div>
                         <div className="flex items-center gap-1.5 bg-[var(--code-bg)] px-2.5 py-1 rounded-md">
                           <span className="text-[var(--accent)] font-mono text-sm">{habit.completionRate}%</span> rate
                         </div>
                         <div className="flex items-center gap-1.5 bg-[var(--code-bg)] px-2.5 py-1 rounded-md">
                           {habit.scheduleType === 'DAILY' && 'Daily'}
                           {habit.scheduleType === 'SPECIFIC_DAYS' && 'Specific Days'}
                           {habit.scheduleType === 'WEEKLY_COUNT' && `${habit.weeklyTarget}/week`}
                         </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
