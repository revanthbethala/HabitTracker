export type HabitStatus = 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
export type TargetType = 'YES_NO' | 'COUNT';
export type ScheduleType = 'DAILY' | 'SPECIFIC_DAYS' | 'WEEKLY_COUNT';
export type CheckInStatus = 'DONE' | 'PARTIAL' | 'SKIPPED';
export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface Habit {
  id: number;
  name: string;
  description?: string;
  category?: string;
  targetType: TargetType;
  targetValue?: number;
  unit?: string;
  scheduleType: ScheduleType;
  weekdays?: DayOfWeek[];
  weeklyTarget?: number;
  status: HabitStatus;
  startDate: string;
  endDate?: string;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  totalCompletions: number;
  todayStatus: string; // "DONE", "PARTIAL", "SKIPPED", "PENDING"
  lastCheckIn?: string;
  createdAt: string;
}

export interface HabitRequest {
  name: string;
  description?: string;
  category?: string;
  targetType: TargetType;
  targetValue?: number;
  unit?: string;
  scheduleType: ScheduleType;
  weekdays?: DayOfWeek[];
  weeklyTarget?: number;
  startDate?: string;
  endDate?: string;
}

export interface CheckIn {
  id: number;
  habitId: number;
  checkInDate: string;
  status: CheckInStatus;
  value?: number;
  note?: string;
}

export interface CheckInRequest {
  checkInDate: string;
  status: CheckInStatus;
  value?: number;
  note?: string;
}

export interface HabitException {
  id: number;
  habitId: number;
  exceptionDate: string;
  reason?: string;
}

export interface Reminder {
  id: number;
  habitId: number;
  reminderTime: string; // HH:mm
  isEnabled: boolean;
}

export interface DashboardSummary {
  totalActiveHabits: number;
  totalBadgesEarned: number;
  globalCompletionRate: number;
  todayProgress: number;
  dueHabits: Habit[];
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  criteria: string;
  icon?: string;
  earnedAt?: string;
  isEarned: boolean;
}
