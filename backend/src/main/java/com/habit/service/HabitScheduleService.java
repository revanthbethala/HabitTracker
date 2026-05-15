package com.habit.service;

import com.habit.entity.Habit;
import java.time.LocalDate;

public interface HabitScheduleService {
    boolean isExpected(Habit habit, LocalDate date);
    boolean isDone(Habit habit, LocalDate date);
    boolean isSkipped(Habit habit, LocalDate date);
    boolean isPartial(Habit habit, LocalDate date);
    boolean isWeeklyTargetMet(Habit habit, LocalDate start, LocalDate end);
    double getWeeklyCompletionRatio(Habit habit, LocalDate start, LocalDate end);
}
