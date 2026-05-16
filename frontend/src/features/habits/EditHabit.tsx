import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useHabit, useHabitMutations } from '@/hooks/useHabits';
import type { TargetType, ScheduleType, DayOfWeek } from '@/types/habit';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';

const habitSchema = z.object({
  name: z.string()
    .min(1, 'Habit name is required')
    .max(100)
    .regex(/^[a-zA-Z0-9\s\-_!@#$%^&*()]+$/, 'Name contains invalid characters'),
  description: z.string().max(500).optional().nullable(),
  category: z.string().max(50).optional().nullable(),
  targetType: z.enum(['YES_NO', 'COUNT']),
  targetValue: z.preprocess((val) => (val === "" || val === null || isNaN(val as number) ? undefined : Number(val)), z.number().min(1).optional()).nullable(),
  unit: z.string().optional().nullable(),
  scheduleType: z.enum(['DAILY', 'SPECIFIC_DAYS', 'WEEKLY_COUNT']),
  weekdays: z.array(z.string()).optional().nullable(),
  weeklyTarget: z.preprocess((val) => (val === "" || val === null || isNaN(val as number) ? undefined : Number(val)), z.number().min(1).max(7).optional()).nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
}).refine(data => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (data.startDate) {
    const start = new Date(data.startDate);
    // For edit, we only check if it's changing to a past date, but if it's already in the past, we allow it
    // However, the user request says "cant be less than current date" strictly.
    if (start < today) return false;
  }
  return true;
}, { message: "Start date cannot be in the past", path: ["startDate"] })
.refine(data => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (data.endDate) {
    const end = new Date(data.endDate);
    if (end < today) return false;
  }
  return true;
}, { message: "End date cannot be in the past", path: ["endDate"] })
.refine(data => {
  if (data.startDate && data.endDate) {
    return new Date(data.endDate) >= new Date(data.startDate);
  }
  return true;
}, { message: "End date must be after or equal to start date", path: ["endDate"] })
.refine(data => {
  if (data.targetType === 'COUNT' && !data.targetValue) return false;
  return true;
}, { message: "Target value is required for Count type", path: ["targetValue"] })
.refine(data => {
  if (data.targetType === 'COUNT' && !data.unit) return false;
  return true;
}, { message: "Unit is required for Count type", path: ["unit"] })
.refine(data => {
  if (data.scheduleType === 'SPECIFIC_DAYS' && (!data.weekdays || data.weekdays.length === 0)) return false;
  return true;
}, { message: "Select at least one day", path: ["weekdays"] })
.refine(data => {
  if (data.scheduleType === 'WEEKLY_COUNT' && (!data.weeklyTarget || data.weeklyTarget < 1 || data.weeklyTarget > 7)) return false;
  return true;
}, { message: "Weekly target must be between 1 and 7", path: ["weeklyTarget"] });

type HabitFormValues = z.infer<typeof habitSchema>;

const DAYS: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

export const EditHabit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const habitId = parseInt(id || '0', 10);
  
  const { data: response, isLoading: isLoadingHabit } = useHabit(habitId);
  const { updateHabit } = useHabitMutations();

  const habit = response?.data;

  const { register, handleSubmit, watch, setValue, reset, formState: { errors, isSubmitting } } = useForm<HabitFormValues>({
    resolver: zodResolver(habitSchema) as any,
    defaultValues: {
      targetType: 'YES_NO',
      scheduleType: 'DAILY',
      weekdays: [],
    }
  });

  useEffect(() => {
    if (habit) {
      reset({
        name: habit.name,
        description: habit.description || '',
        category: habit.category || '',
        targetType: habit.targetType,
        targetValue: habit.targetValue || undefined,
        unit: habit.unit || '',
        scheduleType: habit.scheduleType,
        weekdays: habit.weekdays || [],
        weeklyTarget: habit.weeklyTarget || undefined,
        endDate: habit.endDate || '',
      });
    }
  }, [habit, reset]);

  const targetType = watch('targetType');
  const scheduleType = watch('scheduleType');
  const weekdays = watch('weekdays') || [];

  const toggleDay = (day: DayOfWeek) => {
    const current = [...weekdays];
    const index = current.indexOf(day);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(day);
    }
    setValue('weekdays', current, { shouldValidate: true });
  };

  const onSubmit = async (data: HabitFormValues) => {
    try {
      await updateHabit.mutateAsync({ id: habitId, data: data as any });
      toast.success('Habit updated successfully!');
      navigate(`/habits/${habitId}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update habit');
    }
  };

  if (isLoadingHabit) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--accent)]"></div>
      </div>
    );
  }

  if (!habit) {
    return <div className="text-center py-20">Habit not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-3xl font-bold font-heading text-[var(--text-h)] tracking-tight">Edit Habit</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardContent className="p-6 space-y-5">
            <h2 className="text-lg font-bold font-heading text-[var(--text-h)] border-b border-[var(--border)] pb-2 mb-4">The Basics</h2>
            
            <Input
              label="Habit Name"
              {...register('name')}
              error={errors.name?.message}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Description"
                {...register('description')}
                error={errors.description?.message}
              />
              <Input
                label="Category"
                {...register('category')}
                error={errors.category?.message}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
              <Input
                  label="Start Date (Optional)"
                  type="date"
                  {...register('startDate')}
                  error={errors.startDate?.message}
                />
              <Input
                  label="End Date (Optional)"
                  type="date"
                  {...register('endDate')}
                  error={errors.endDate?.message}
                />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold font-heading text-[var(--text-h)] border-b border-[var(--border)] pb-2 mb-4">How will you measure it?</h2>
            
            <div className="flex gap-4 mb-6">
              <label className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border cursor-pointer transition-all ${targetType === 'YES_NO' ? 'border-[var(--accent)] bg-[var(--accent-bg)] text-[var(--accent)]' : 'border-[var(--border)] text-[var(--text)] hover:bg-[var(--code-bg)]'}`}>
                <input type="radio" value="YES_NO" {...register('targetType')} className="sr-only" />
                <Check size={20} className={targetType === 'YES_NO' ? 'opacity-100' : 'opacity-0'} />
                <span className="font-semibold">Yes / No</span>
              </label>
              <label className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border cursor-pointer transition-all ${targetType === 'COUNT' ? 'border-[var(--accent)] bg-[var(--accent-bg)] text-[var(--accent)]' : 'border-[var(--border)] text-[var(--text)] hover:bg-[var(--code-bg)]'}`}>
                <input type="radio" value="COUNT" {...register('targetType')} className="sr-only" />
                <Check size={20} className={targetType === 'COUNT' ? 'opacity-100' : 'opacity-0'} />
                <span className="font-semibold">Numeric Target</span>
              </label>
            </div>

            <AnimatePresence>
              {targetType === 'COUNT' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-2 gap-4 overflow-hidden"
                >
                  <Input
                    label="Amount"
                    type="number"
                    {...register('targetValue', { valueAsNumber: true })}
                    error={errors.targetValue?.message}
                  />
                  <Input
                    label="Unit"
                    {...register('unit')}
                    error={errors.unit?.message}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold font-heading text-[var(--text-h)] border-b border-[var(--border)] pb-2 mb-4">When will you do it?</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {['DAILY', 'SPECIFIC_DAYS', 'WEEKLY_COUNT'].map((type) => (
                <label key={type} className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all text-sm font-medium ${scheduleType === type ? 'border-[var(--accent)] bg-[var(--accent-bg)] text-[var(--accent)]' : 'border-[var(--border)] text-[var(--text)] hover:bg-[var(--code-bg)]'}`}>
                  <input type="radio" value={type} {...register('scheduleType')} className="sr-only" />
                  {type === 'DAILY' ? 'Every Day' : type === 'SPECIFIC_DAYS' ? 'Specific Days' : 'Flexible Weekly'}
                </label>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {scheduleType === 'SPECIFIC_DAYS' && (
                <motion.div
                  key="specific"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-2"
                >
                  <label className="block text-sm font-medium text-[var(--text-h)] mb-2">Select Days</label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS.map(day => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                          weekdays.includes(day)
                            ? 'bg-[var(--accent)] text-white shadow-md'
                            : 'bg-[var(--code-bg)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--accent-border)]'
                        }`}
                      >
                        {day.charAt(0)}
                      </button>
                    ))}
                  </div>
                  {errors.weekdays && <p className="text-sm text-rose-500 mt-1">{errors.weekdays.message}</p>}
                </motion.div>
              )}

              {scheduleType === 'WEEKLY_COUNT' && (
                <motion.div
                  key="weekly"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Input
                    label="Times per week"
                    type="number"
                    min="1"
                    max="7"
                    {...register('weeklyTarget', { valueAsNumber: true })}
                    error={errors.weeklyTarget?.message}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" size="lg" isLoading={isSubmitting}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
