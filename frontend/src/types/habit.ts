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
  reminderTime?: string;
  isExpectedToday?: boolean;
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
  checkInDate: string; // Keep this for display/local, but we'll use 'date' for API if needed.
  // Actually, let's just use 'checkInDate' consistently for Response and 'date' for Request.
  status: CheckInStatus;
  value?: number;
  note?: string;
}

export interface CheckInRequest {
  date: string; // Backend expects 'date'
  status: CheckInStatus;
  value?: number;
  note?: string;
}

export interface HabitException {
  id: number;
  habitId: number;
  exceptionDate: string;
  date: string; // Adding 'date' to match backend response/request
  reason?: string;
}

export interface Reminder {
  id: number;
  habitId: number;
  time: string; // Backend returns 'time'
  enabled: boolean; // Backend returns 'enabled'
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
