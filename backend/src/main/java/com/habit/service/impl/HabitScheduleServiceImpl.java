package com.habit.service.impl;

import com.habit.entity.Habit;
import com.habit.enums.CheckInStatus;
import com.habit.enums.ScheduleType;
import com.habit.service.HabitScheduleService;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;

@Service
public class HabitScheduleServiceImpl implements HabitScheduleService {

    @Override
    public boolean isExpected(Habit habit, LocalDate date) {
        if (habit.getEndDate() != null && date.isAfter(habit.getEndDate())) return false;
        if (habit.getStartDate() != null && date.isBefore(habit.getStartDate())) return false;

        if (habit.getHabitExceptions() != null) {
            boolean isException = habit.getHabitExceptions().stream()
                    .anyMatch(e -> e.getExceptionDate() != null && e.getExceptionDate().equals(date));
            if (isException) return false;
        }

        ScheduleType type = habit.getScheduleType();
        if (type == ScheduleType.DAILY) return true;
        if (type == ScheduleType.SPECIFIC_DAYS) {
            return habit.getWeekdays() != null && habit.getWeekdays().contains(date.getDayOfWeek());
        }
        if (type == ScheduleType.WEEKLY_COUNT) {
            LocalDate startOfWeek = date.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
            return !isWeeklyTargetMet(habit, startOfWeek, date);
        }
        return false;
    }

    @Override
    public boolean isDone(Habit habit, LocalDate date) {
        if (habit.getCheckIns() == null) return false;
        return habit.getCheckIns().stream()
                .anyMatch(c -> c.getCheckInDate() != null && c.getCheckInDate().equals(date) && c.getStatus() == CheckInStatus.DONE);
    }

    @Override
    public boolean isSkipped(Habit habit, LocalDate date) {
        if (habit.getCheckIns() == null) return false;
        return habit.getCheckIns().stream()
                .anyMatch(c -> c.getCheckInDate() != null && c.getCheckInDate().equals(date) && c.getStatus() == CheckInStatus.SKIPPED);
    }

    @Override
    public boolean isPartial(Habit habit, LocalDate date) {
        if (habit.getCheckIns() == null) return false;
        return habit.getCheckIns().stream()
                .anyMatch(c -> c.getCheckInDate() != null && c.getCheckInDate().equals(date) && c.getStatus() == CheckInStatus.PARTIAL);
    }

    @Override
    public boolean isWeeklyTargetMet(Habit habit, LocalDate start, LocalDate end) {
        if (habit.getCheckIns() == null) return false;

        long exceptionCount = 0;
        if (habit.getHabitExceptions() != null) {
            exceptionCount = habit.getHabitExceptions().stream()
                    .filter(e -> e.getExceptionDate() != null && !e.getExceptionDate().isBefore(start) && !e.getExceptionDate().isAfter(end))
                    .count();
        }

        long doneCount = habit.getCheckIns().stream()
                .filter(c -> c.getCheckInDate() != null && !c.getCheckInDate().isBefore(start) && !c.getCheckInDate().isAfter(end) && c.getStatus() == CheckInStatus.DONE)
                .count();

        int target = habit.getWeeklyTarget() != null ? habit.getWeeklyTarget() : 0;
        int effectiveTarget = Math.max(1, target - (int) exceptionCount);

        return doneCount >= effectiveTarget;
    }

    @Override
    public double getWeeklyCompletionRatio(Habit habit, LocalDate start, LocalDate end) {
        if (habit.getCheckIns() == null) return 0.0;

        long exceptionCount = 0;
        if (habit.getHabitExceptions() != null) {
            exceptionCount = habit.getHabitExceptions().stream()
                    .filter(e -> e.getExceptionDate() != null && !e.getExceptionDate().isBefore(start) && !e.getExceptionDate().isAfter(end))
                    .count();
        }

        long doneCount = habit.getCheckIns().stream()
                .filter(c -> c.getCheckInDate() != null && !c.getCheckInDate().isBefore(start) && !c.getCheckInDate().isAfter(end) && c.getStatus() == CheckInStatus.DONE)
                .count();

        int target = habit.getWeeklyTarget() != null ? habit.getWeeklyTarget() : 1;
        int effectiveTarget = Math.max(1, target - (int) exceptionCount);

        return Math.min(1.0, (double) doneCount / effectiveTarget);
    }
}
