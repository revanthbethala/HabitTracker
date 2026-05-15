import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHabit, useHabitMutations, useCheckInMutation, useDeleteCheckInMutation } from '@/hooks/useHabits';
import { useExceptions, useExceptionMutations, useReminder, useReminderMutations, useCheckInHistory } from '@/hooks/useExtras';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CheckInModal } from '@/components/ui/CheckInModal';
import { ArrowLeft, Edit, Trash2, Calendar as CalendarIcon, TrendingUp, Activity, PauseCircle, PlayCircle, Clock, ShieldAlert, Check, Archive } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { HabitCharts } from '@/features/habits/HabitCharts';

export const HabitDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const habitId = parseInt(id || '0', 10);
  
  const { data: habitResponse, isLoading: isLoadingHabit } = useHabit(habitId);
  const { deleteHabit, updateHabit, toggleStatus: statusMutation } = useHabitMutations();
  const [historyPage, setHistoryPage] = useState(0);
  const { data: historyResponse } = useCheckInHistory(habitId, historyPage);
  const { data: exceptionsResponse } = useExceptions(habitId);
  const { data: reminderResponse } = useReminder(habitId);
  
  const { addException, removeException } = useExceptionMutations(habitId);
  const { setReminder, deleteReminder } = useReminderMutations(habitId);
  const checkInMutation = useCheckInMutation();
  const deleteCheckInMutation = useDeleteCheckInMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{ dateStr: string; initialData?: any } | null>(null);

  const [newExceptionDate, setNewExceptionDate] = useState('');
  const [newExceptionReason, setNewExceptionReason] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [isReminderEnabled, setIsReminderEnabled] = useState(true);

  if (isLoadingHabit) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--accent)]"></div>
      </div>
    );
  }

  const habit = habitResponse?.data;
  console.log("habit data:",habit);
  
  // Backend returns a Page object, so we need to extract the 'content' array
  const historyData = historyResponse?.data as any;
  const history = Array.isArray(historyData) ? historyData : historyData?.content || [];
  const exceptions = exceptionsResponse?.data || [];
  const reminder = reminderResponse?.data;

  if (!habit) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-[var(--text-h)]">Habit not found</h2>
        <Button className="mt-4" onClick={() => navigate('/habits')}>Back to habits</Button>
      </div>
    );
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this habit? All history will be lost.')) {
      try {
        await deleteHabit.mutateAsync(habitId);
        toast.success('Habit deleted');
        navigate('/habits');
      } catch (error) {
        toast.error('Failed to delete habit');
      }
    }
  };

  const toggleStatus = async (newStatus: 'ACTIVE' | 'PAUSED' | 'ARCHIVED') => {
    try {
      await statusMutation.mutateAsync({ id: habitId, status: newStatus as any });
      toast.success(`Habit ${newStatus.toLowerCase()}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleAddException = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExceptionDate) return;
    try {
      await addException.mutateAsync({ date: newExceptionDate, reason: newExceptionReason });
      setNewExceptionDate('');
      setNewExceptionReason('');
      toast.success('Exception added');
    } catch (error) {
      toast.error('Failed to add exception');
    }
  };

  const handleSaveReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderTime) return;
    try {
      await setReminder.mutateAsync({ time: reminderTime, enabled: isReminderEnabled });
      toast.success('Reminder saved');
    } catch (error) {
      toast.error('Failed to save reminder');
    }
  };

  const handleDeleteReminder = async () => {
    try {
      await deleteReminder.mutateAsync();
      setReminderTime('');
      toast.success('Reminder deleted');
    } catch (error) {
      toast.error('Failed to delete reminder');
    }
  };

  const handleDeleteCheckIn = async (checkInId: number) => {
    try {
      await deleteCheckInMutation.mutateAsync({ habitId, checkInId });
      toast.success('Check-in reset');
    } catch (error) {
      toast.error('Failed to reset check-in');
    }
  };

  const handlePastCheckIn = async (date: string, status: 'DONE' | 'SKIPPED' | 'PARTIAL') => {
    if (habit?.targetType === 'COUNT') {
      setModalConfig({ dateStr: date, initialData: { status } });
      setModalOpen(true);
      return;
    }
    
    try {
      await checkInMutation.mutateAsync({
        habitId,
        data: { date, status }
      });
      toast.success(`Updated check-in for ${date}`);
    } catch (error) {
      toast.error('Failed to update check-in');
    }
  };

  const handleModalSubmit = async (data: any) => {
    if (!modalConfig) return;
    try {
      await checkInMutation.mutateAsync({
        habitId,
        data: {
          date: modalConfig.dateStr,
          ...data
        }
      });
      toast.success(`Updated check-in for ${modalConfig.dateStr}`);
    } catch (error) {
      toast.error('Failed to update check-in');
    }
  };


  // Generate last 7 days for history list, filtering by creation date
const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const today = new Date();

const todayDate = formatDate(today);
const createdDate = habit.createdAt ? formatDate(new Date(habit.createdAt)) : todayDate;

// Convert only DATE part
const todayOnly = new Date(todayDate);
const createdOnly = new Date(createdDate);

const diffInDays = Math.floor(
  (todayOnly.getTime() - createdOnly.getTime()) /
    (1000 * 60 * 60 * 24)
);

// Always include today
const maxAvailableDays = diffInDays + 1;
const itemsPerPage = 7;
const startOffset = historyPage * itemsPerPage;
const daysToShow = Math.max(0, Math.min(itemsPerPage, maxAvailableDays - startOffset));
const hasMoreHistory = startOffset + itemsPerPage < maxAvailableDays;

const pastDays = Array.from(
  { length: Math.max(1, daysToShow) },
  (_, i) => {
    const d = new Date(todayOnly);
    d.setDate(todayOnly.getDate() - (startOffset + i));
    return formatDate(d);
  }
);
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/habits')} className="rounded-full">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold font-heading text-[var(--text-h)] tracking-tight">{habit.name}</h1>
              {habit.status !== 'ACTIVE' && (
                <span className="px-2.5 py-1 text-xs uppercase font-bold rounded-full bg-[var(--social-bg)] text-[var(--text)] border border-[var(--border)]">
                  {habit.status}
                </span>
              )}
            </div>
            {habit.description && <p className="text-[var(--text)]">{habit.description}</p>}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {habit.status === 'ACTIVE' ? (
            <Button variant="outline" size="sm" onClick={() => toggleStatus('PAUSED')} title="Pause Habit">
              <PauseCircle size={16} className="mr-2" /> Pause
            </Button>
          ) : (
             <Button variant="outline" size="sm" onClick={() => toggleStatus('ACTIVE')} title="Resume Habit">
              <PlayCircle size={16} className="mr-2" /> Resume
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => navigate(`/habits/${habit.id}/edit`)}>
            <Edit size={16} className="mr-2" /> Edit
          </Button>
          
          {habit.status !== 'ARCHIVED' && (
            <Button variant="outline" size="sm" onClick={() => toggleStatus('ARCHIVED')} title="Archive Habit">
              <Archive size={16} className="mr-2" /> Archive
            </Button>
          )}

          <Button variant="danger" size="icon" onClick={handleDelete} title="Delete Habit">
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <TrendingUp className="text-emerald-500 mb-2" size={24} />
            <p className="text-sm font-medium text-[var(--text)] mb-1">Current Streak</p>
            <p className="text-3xl font-bold font-mono text-[var(--text-h)]">{habit.currentStreak}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
             <Activity className="text-[var(--accent)] mb-2" size={24} />
            <p className="text-sm font-medium text-[var(--text)] mb-1">Completion Rate</p>
            <p className="text-3xl font-bold font-mono text-[var(--text-h)]">{habit.completionRate}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <CalendarIcon className="text-blue-500 mb-2" size={24} />
            <p className="text-sm font-medium text-[var(--text)] mb-1">Total Completions</p>
            <p className="text-3xl font-bold font-mono text-[var(--text-h)]">{habit.totalCompletions}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <Clock className="text-amber-500 mb-2" size={24} />
            <p className="text-sm font-medium text-[var(--text)] mb-1">Schedule</p>
            <p className="text-sm font-bold font-heading text-[var(--text-h)] mt-1">
               {habit.scheduleType === 'DAILY' && 'Daily'}
               {habit.scheduleType === 'SPECIFIC_DAYS' && habit.weekdays?.join(', ')}
               {habit.scheduleType === 'WEEKLY_COUNT' && `${habit.weeklyTarget}/wk`}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Visual Analytics */}
      <HabitCharts habitId={habitId} />

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: History & Check-ins */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-bold font-heading text-[var(--text-h)] mb-4">
                {historyPage === 0 ? "Recent History (Last 07 days)" : `History (Days ${historyPage * 7 + 1}-${historyPage * 7 + 7})`}
              </h2>
              <div className="space-y-3">
                {pastDays.map(date => {
                  const checkIn = history.find(c => c.checkInDate === date);
                  const isException = exceptions.some(e => e.exceptionDate === date);
                  const isToday = date === todayDate;
                  
                  let currentStatus = checkIn?.status || 'PENDING';
                  if (isToday && habit.todayStatus) {
                    currentStatus = habit.todayStatus;
                  }

                  let statusLabel = 'Pending';
                  let statusColor = 'text-[var(--text)] bg-[var(--code-bg)] border-dashed border-[var(--border)]';
                  let isFinished = false;
                  
                  if (currentStatus === 'DONE') {
                    statusLabel = 'Done';
                    statusColor = 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
                    isFinished = true;
                  } else if (currentStatus === 'PARTIAL') {
                    statusLabel = 'Partial';
                    statusColor = 'text-amber-700 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
                    isFinished = true;
                  } else if (currentStatus === 'SKIPPED') {
                    statusLabel = 'Skipped';
                    statusColor = 'text-rose-700 bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800';
                    isFinished = true;
                  } else if (isException) {
                    statusLabel = 'Exception';
                    statusColor = 'text-blue-700 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
                    isFinished = true;
                  }

                   return (
                    <div key={date} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isFinished ? 'bg-[var(--social-bg)]/30 border-[var(--border)] opacity-80' : 'bg-[var(--bg)] border-[var(--accent-border)] shadow-sm'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${isFinished ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`} />
                        <div>
                          <span className="font-mono text-sm font-bold block text-[var(--text-h)]">{date} {isToday && '(Today)'}</span>
                          <span className={`inline-block px-2 py-0.5 mt-1 rounded text-[10px] font-black uppercase border ${statusColor}`}>
                            {statusLabel}
                          </span>
                        </div>
                      </div>
                      
                      {!isFinished && (
                        <div className="flex gap-2">
                           <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => handlePastCheckIn(date, 'SKIPPED')}>Skip</Button>
                           <Button size="sm" className="h-8 px-3 bg-emerald-500 hover:bg-emerald-600" onClick={() => handlePastCheckIn(date, 'DONE')}><Check size={14} className="mr-1"/> Done</Button>
                        </div>
                      )}
                      
                      {isFinished && currentStatus !== 'PENDING' && (
                        <div className="flex gap-2">
                           {habit.targetType === 'COUNT' && (
                             <Button size="sm" variant="ghost" className="h-8 text-[var(--text)] opacity-50 hover:opacity-100" onClick={() => {
                               setModalConfig({ dateStr: date, initialData: checkIn });
                               setModalOpen(true);
                             }}>Edit</Button>
                           )}
                           {checkIn?.id && (
                             <Button size="sm" variant="ghost" className="h-8 text-[var(--text)] opacity-50 hover:opacity-100" onClick={() => handleDeleteCheckIn(checkIn.id)}>Reset</Button>
                           )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {(historyPage > 0 || hasMoreHistory) && (
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-[var(--border)]">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setHistoryPage(p => p + 1)} 
                    disabled={!hasMoreHistory}
                  >
                    &larr; Older
                  </Button>
                  <span className="text-sm font-medium text-[var(--text)]">Page {historyPage + 1}</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setHistoryPage(p => Math.max(0, p - 1))} 
                    disabled={historyPage === 0}
                  >
                    Newer &rarr;
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Extras (Exceptions & Reminders) */}
        <div className="space-y-8">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-bold font-heading text-[var(--text-h)] mb-4 flex items-center gap-2">
                <ShieldAlert size={20} className="text-blue-500" />
                Exceptions
              </h2>
              <p className="text-sm text-[var(--text)] mb-4">Add a sick day or vacation to protect your streak.</p>
              
              <form onSubmit={handleAddException} className="space-y-3 mb-6">
                <Input 
                  type="date" 
                  value={newExceptionDate}
                  onChange={(e) => setNewExceptionDate(e.target.value)}
                  required
                />
                <Input 
                  placeholder="Reason (Optional)" 
                  value={newExceptionReason}
                  onChange={(e) => setNewExceptionReason(e.target.value)}
                />
                <Button type="submit" className="w-full" size="sm">Add Exception</Button>
              </form>

              {exceptions.length > 0 && (
                <div className="space-y-2 mt-4 pt-4 border-t border-[var(--border)]">
                  {exceptions.map(exc => (
                     <div key={exc.id} className="flex justify-between items-center bg-[var(--code-bg)] p-2 rounded text-sm">
                       <div>
                         <span className="font-mono font-medium">{exc.exceptionDate}</span>
                         {exc.reason && <span className="block text-xs text-[var(--text)] truncate max-w-[120px]">{exc.reason}</span>}
                       </div>
                       <button onClick={() => removeException.mutate(exc.id)} className="text-rose-500 hover:text-rose-600"><Trash2 size={14}/></button>
                     </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-bold font-heading text-[var(--text-h)] mb-4 flex items-center gap-2">
                <Clock size={20} className="text-[var(--accent)]" />
                Reminder
              </h2>
              <p className="text-sm text-[var(--text)] mb-4">Get a daily nudge to complete this habit.</p>
              
              {reminder ? (
                 <div className="bg-[var(--code-bg)] p-4 rounded-xl border border-[var(--border)] mb-4 flex justify-between items-center">
                   <div>
                     <p className="font-mono text-xl font-bold">{reminder.time}</p>
                     <p className="text-xs text-[var(--text)]">{reminder.enabled ? 'Enabled' : 'Disabled'}</p>
                   </div>
                   <Button variant="danger" size="icon" onClick={handleDeleteReminder}><Trash2 size={16}/></Button>
                 </div>
              ) : (
                <form onSubmit={handleSaveReminder} className="space-y-3">
                  <Input 
                    type="time" 
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    required
                  />
                  <label className="flex items-center gap-2 text-sm text-[var(--text-h)]">
                    <input 
                      type="checkbox" 
                      checked={isReminderEnabled}
                      onChange={(e) => setIsReminderEnabled(e.target.checked)}
                      className="rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
                    />
                    Enable notification
                  </label>
                  <Button type="submit" className="w-full" size="sm">Save Reminder</Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <CheckInModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={modalConfig?.initialData}
        isCountType={habit.targetType === 'COUNT'}
        targetValue={habit.targetValue}
        unit={habit.unit}
        dateStr={modalConfig?.dateStr || ''}
      />
    </div>
  );
};
