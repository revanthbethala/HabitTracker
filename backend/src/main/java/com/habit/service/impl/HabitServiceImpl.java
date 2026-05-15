package com.habit.service.impl;

import com.habit.dto.request.HabitRequest;
import com.habit.dto.response.HabitResponse;
import com.habit.entity.CheckIn;
import com.habit.entity.Habit;
import com.habit.entity.User;
import com.habit.enums.CheckInStatus;
import com.habit.enums.HabitStatus;
import com.habit.enums.ScheduleType;
import com.habit.exception.ResourceNotFoundException;
import com.habit.exception.UnauthorizedException;
import com.habit.repository.HabitRepository;
import com.habit.security.SecurityUtils;
import com.habit.service.HabitService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HabitServiceImpl implements HabitService {

    private final HabitRepository habitRepository;

    @Override
    @Transactional
    public HabitResponse createHabit(HabitRequest request) {
        User currentUser = SecurityUtils.getCurrentUser();
        
        Habit habit = Habit.builder()
                .user(currentUser)
                .name(request.getName())
                .description(request.getDescription())
                .category(request.getCategory())
                .targetType(request.getTargetType())
                .targetValue(request.getTargetValue())
                .unit(request.getUnit())
                .scheduleType(request.getScheduleType())
                .weekdays(request.getWeekdays() != null ? request.getWeekdays() : new ArrayList<>())
                .weeklyTarget(request.getWeeklyTarget())
                .status(HabitStatus.ACTIVE)
                .startDate(request.getStartDate() != null ? request.getStartDate() : LocalDate.now())
                .endDate(request.getEndDate())
                .build();

        Habit savedHabit = habitRepository.save(habit);
        return mapToResponse(savedHabit);
    }

    @Override
    public List<HabitResponse> getAllHabits(HabitStatus status, String sort) {
        User currentUser = SecurityUtils.getCurrentUser();
        List<Habit> habits = habitRepository.findByUserId(currentUser.getId());

        return habits.stream()
                .filter(h -> status == null || h.getStatus() == status)
                .map(this::mapToResponse)
                .sorted((h1, h2) -> {
                    if ("name".equalsIgnoreCase(sort)) return h1.getName().compareToIgnoreCase(h2.getName());
                    if ("recent".equalsIgnoreCase(sort)) {
                        if (h1.getLastCheckIn() == null) return 1;
                        if (h2.getLastCheckIn() == null) return -1;
                        return h2.getLastCheckIn().compareTo(h1.getLastCheckIn());
                    }
                    return 0;
                })
                .collect(Collectors.toList());
    }

    @Override
    public HabitResponse getHabitById(Long id) {
        Habit habit = getOwnedHabit(id);
        return mapToResponse(habit);
    }

    @Override
    @Transactional
    public HabitResponse updateHabit(Long id, HabitRequest request) {
        Habit habit = getOwnedHabit(id);
        
        if (request.getName() != null) habit.setName(request.getName());
        if (request.getDescription() != null) habit.setDescription(request.getDescription());
        if (request.getCategory() != null) habit.setCategory(request.getCategory());
        if (request.getTargetType() != null) habit.setTargetType(request.getTargetType());
        if (request.getTargetValue() != null) habit.setTargetValue(request.getTargetValue());
        if (request.getUnit() != null) habit.setUnit(request.getUnit());
        if (request.getScheduleType() != null) habit.setScheduleType(request.getScheduleType());
        if (request.getWeekdays() != null) habit.setWeekdays(request.getWeekdays());
        if (request.getWeeklyTarget() != null) habit.setWeeklyTarget(request.getWeeklyTarget());
        if (request.getStartDate() != null) habit.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) habit.setEndDate(request.getEndDate());

        return mapToResponse(habitRepository.save(habit));
    }

    @Override
    @Transactional
    public void deleteHabit(Long id) {
        Habit habit = getOwnedHabit(id);
        habitRepository.delete(habit);
    }

    @Override
    @Transactional
    public void updateStatus(Long id, HabitStatus status) {
        Habit habit = getOwnedHabit(id);
        habit.setStatus(status);
        habitRepository.save(habit);
    }

    private Habit getOwnedHabit(Long id) {
        User currentUser = SecurityUtils.getCurrentUser();
        Habit habit = habitRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Habit not found with id: " + id));
        
        if (!habit.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You do not have permission to access this habit");
        }
        return habit;
    }

    private HabitResponse mapToResponse(Habit habit) {
        LocalDate today = LocalDate.now();
        
        int currentStreak = calculateCurrentStreak(habit, today);
        int longestStreak = calculateLongestStreak(habit, today);
        int completionRate = calculateCompletionRate(habit, today, 30);
        int totalCompletions = habit.getCheckIns() == null ? 0 : (int) habit.getCheckIns().stream()
                .filter(c -> c.getStatus() == CheckInStatus.DONE)
                .count();

        Optional<CheckIn> todayCheckIn = habit.getCheckIns() == null ? Optional.empty() : habit.getCheckIns().stream()
                .filter(c -> c.getCheckInDate().equals(today))
                .findFirst();

        LocalDate lastCheckIn = habit.getCheckIns() == null ? null : habit.getCheckIns().stream()
                .map(CheckIn::getCheckInDate)
                .max(LocalDate::compareTo)
                .orElse(null);

        return HabitResponse.builder()
                .id(habit.getId())
                .name(habit.getName())
                .description(habit.getDescription())
                .category(habit.getCategory())
                .targetType(habit.getTargetType())
                .targetValue(habit.getTargetValue())
                .unit(habit.getUnit())
                .scheduleType(habit.getScheduleType())
                .weekdays(habit.getWeekdays())
                .weeklyTarget(habit.getWeeklyTarget())
                .status(habit.getStatus())
                .startDate(habit.getStartDate())
                .endDate(habit.getEndDate())
                .currentStreak(currentStreak)
                .longestStreak(longestStreak)
                .completionRate(completionRate)
                .totalCompletions(totalCompletions)
                .todayStatus(todayCheckIn.map(c -> c.getStatus().name()).orElse("PENDING"))
                .lastCheckIn(lastCheckIn)
                .createdAt(habit.getCreatedAt())
                .build();
    }

    private int calculateCurrentStreak(Habit habit, LocalDate today) {
        if (habit.getScheduleType() == ScheduleType.WEEKLY_COUNT) {
            return calculateWeeklyStreak(habit, today);
        }
        
        int streak = 0;
        LocalDate date = today;
        
        boolean doneToday = isDone(habit, today);
        if (doneToday) {
            streak++;
            date = date.minusDays(1);
        } else if (isExpected(habit, today)) {
            date = date.minusDays(1);
        } else {
            date = date.minusDays(1);
        }

        while (habit.getStartDate() != null && !date.isBefore(habit.getStartDate())) {
            if (isExpected(habit, date)) {
                if (isDone(habit, date)) {
                    streak++;
                } else {
                    break;
                }
            }
            date = date.minusDays(1);
        }
        return streak;
    }

    private int calculateWeeklyStreak(Habit habit, LocalDate today) {
        if (habit.getStartDate() == null) return 0;
        int streak = 0;
        LocalDate startOfWeek = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        
        if (isWeeklyTargetMet(habit, startOfWeek, today)) {
            streak++;
        } else if (today.equals(startOfWeek.plusDays(6))) {
             return 0;
        }
        
        LocalDate prevWeekStart = startOfWeek.minusWeeks(1);
        while (!prevWeekStart.isBefore(habit.getStartDate())) {
            if (isWeeklyTargetMet(habit, prevWeekStart, prevWeekStart.plusDays(6))) {
                streak++;
            } else {
                break;
            }
            prevWeekStart = prevWeekStart.minusWeeks(1);
        }
        return streak;
    }

    private int calculateLongestStreak(Habit habit, LocalDate today) {
        if (habit.getStartDate() == null) return 0;
        if (habit.getScheduleType() == ScheduleType.WEEKLY_COUNT) {
            return calculateMaxWeeklyStreak(habit, today);
        }

        int max = 0;
        int current = 0;
        LocalDate date = habit.getStartDate();
        while (!date.isAfter(today)) {
            if (isExpected(habit, date)) {
                if (isDone(habit, date)) {
                    current++;
                    max = Math.max(max, current);
                } else {
                    current = 0;
                }
            }
            date = date.plusDays(1);
        }
        return max;
    }

    private int calculateMaxWeeklyStreak(Habit habit, LocalDate today) {
        if (habit.getStartDate() == null) return 0;
        int max = 0;
        int current = 0;
        LocalDate weekStart = habit.getStartDate().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        while (!weekStart.isAfter(today)) {
            if (isWeeklyTargetMet(habit, weekStart, weekStart.plusDays(6))) {
                current++;
                max = Math.max(max, current);
            } else {
                current = 0;
            }
            weekStart = weekStart.plusWeeks(1);
        }
        return max;
    }

    private int calculateCompletionRate(Habit habit, LocalDate today, int days) {
        if (habit.getStartDate() == null) return 0;
        LocalDate startRange = today.minusDays(days - 1);
        if (startRange.isBefore(habit.getStartDate())) startRange = habit.getStartDate();

        int expectedDays = 0;
        int doneDays = 0;

        LocalDate date = startRange;
        while (!date.isAfter(today)) {
            if (isExpected(habit, date)) {
                expectedDays++;
                if (isDone(habit, date)) {
                    doneDays++;
                }
            }
            date = date.plusDays(1);
        }

        if (expectedDays == 0) return 0;
        return (int) ((doneDays * 100.0) / expectedDays);
    }

    private boolean isExpected(Habit habit, LocalDate date) {
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
        if (type == ScheduleType.WEEKLY_COUNT) return true; 

        return false;
    }

    private boolean isDone(Habit habit, LocalDate date) {
        if (habit.getCheckIns() == null) return false;
        return habit.getCheckIns().stream()
                .anyMatch(c -> c.getCheckInDate() != null && c.getCheckInDate().equals(date) && c.getStatus() == CheckInStatus.DONE);
    }

    private boolean isWeeklyTargetMet(Habit habit, LocalDate start, LocalDate end) {
        if (habit.getCheckIns() == null) return false;
        long doneCount = habit.getCheckIns().stream()
                .filter(c -> c.getCheckInDate() != null && !c.getCheckInDate().isBefore(start) && !c.getCheckInDate().isAfter(end))
                .filter(c -> c.getStatus() == CheckInStatus.DONE)
                .count();
        return habit.getWeeklyTarget() != null && doneCount >= habit.getWeeklyTarget();
    }
}
