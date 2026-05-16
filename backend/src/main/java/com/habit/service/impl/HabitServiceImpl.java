package com.habit.service.impl;

import com.habit.dto.request.HabitRequest;
import com.habit.dto.response.HabitHistoryDayResponse;
import com.habit.dto.response.HabitResponse;
import com.habit.entity.CheckIn;
import com.habit.entity.Habit;
import com.habit.entity.HabitException;
import com.habit.entity.User;
import com.habit.enums.CheckInStatus;
import com.habit.enums.HabitHistoryStatus;
import com.habit.enums.HabitStatus;
import com.habit.enums.ScheduleType;
import com.habit.exception.ResourceNotFoundException;
import com.habit.exception.UnauthorizedException;
import com.habit.repository.CheckInRepository;
import com.habit.repository.HabitExceptionRepository;
import com.habit.repository.HabitRepository;
import com.habit.security.SecurityUtils;
import com.habit.service.HabitService;
import com.habit.service.HabitScheduleService;
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
    private final CheckInRepository checkInRepository;
    private final HabitExceptionRepository habitExceptionRepository;
    private final HabitScheduleService habitScheduleService;

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
        if (request.getStatus() != null) habit.setStatus(request.getStatus());

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

        String reminderTime = null;
        if (habit.getReminder() != null && Boolean.TRUE.equals(habit.getReminder().getEnabled())) {
            reminderTime = habit.getReminder().getTime().toString();
        }

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
                .reminderTime(reminderTime)
                .isExpectedToday(habitScheduleService.isExpected(habit, today))
                .build();
    }

    private int calculateCurrentStreak(Habit habit, LocalDate today) {
        if (habit.getScheduleType() == ScheduleType.WEEKLY_COUNT) {
            return calculateWeeklyStreak(habit, today);
        }
        
        if (habitScheduleService.isSkipped(habit, today)) return 0;
        
        int streak = 0;
        if (habitScheduleService.isDone(habit, today)) {
            streak++;
        }
        
        LocalDate date = today.minusDays(1);
        while (habit.getStartDate() != null && !date.isBefore(habit.getStartDate())) {
            if (habitScheduleService.isExpected(habit, date)) {
                if (habitScheduleService.isDone(habit, date)) {
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
        int streak = 0;
        LocalDate currentWeekStart = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        
        if (habitScheduleService.isWeeklyTargetMet(habit, currentWeekStart, today)) {
            streak++;
        }
        
        currentWeekStart = currentWeekStart.minusWeeks(1);
        while (habit.getStartDate() != null && !currentWeekStart.isBefore(habit.getStartDate().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)))) {
            LocalDate weekEnd = currentWeekStart.plusDays(6);
            if (habitScheduleService.isWeeklyTargetMet(habit, currentWeekStart, weekEnd)) {
                streak++;
            } else {
                break;
            }
            currentWeekStart = currentWeekStart.minusWeeks(1);
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
            if (habitScheduleService.isExpected(habit, date)) {
                if (habitScheduleService.isDone(habit, date)) {
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
            if (habitScheduleService.isWeeklyTargetMet(habit, weekStart, weekStart.plusDays(6))) {
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

        if (habit.getScheduleType() == ScheduleType.WEEKLY_COUNT) {
            return calculateWeeklyCompletionRate(habit, today, days);
        }

        LocalDate startRange = today.minusDays(days - 1);
        if (startRange.isBefore(habit.getStartDate())) startRange = habit.getStartDate();

        int expectedDays = 0;
        int doneDays = 0;

        LocalDate date = startRange;
        while (!date.isAfter(today)) {
            if (habitScheduleService.isExpected(habit, date)) {
                expectedDays++;
                if (habitScheduleService.isDone(habit, date)) {
                    doneDays++;
                }
            }
            date = date.plusDays(1);
        }

        if (expectedDays == 0) return 0;
        return (int) ((doneDays * 100.0) / expectedDays);
    }

    private int calculateWeeklyCompletionRate(Habit habit, LocalDate today, int days) {
        LocalDate startRange = today.minusDays(days - 1);
        if (startRange.isBefore(habit.getStartDate())) startRange = habit.getStartDate();
        
        LocalDate currentWeekStart = startRange.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        int totalWeeks = 0;
        double totalRatio = 0.0;
        
        while (!currentWeekStart.isAfter(today)) {
            totalWeeks++;
            LocalDate weekEnd = currentWeekStart.plusDays(6);
            totalRatio += habitScheduleService.getWeeklyCompletionRatio(habit, currentWeekStart, weekEnd.isAfter(today) ? today : weekEnd);
            currentWeekStart = currentWeekStart.plusWeeks(1);
        }
        
        if (totalWeeks == 0) return 0;
        return (int) ((totalRatio * 100.0) / totalWeeks);
    }
    @Override
    public List<HabitHistoryDayResponse> getHabitHistory(Long habitId, Integer days) {
        User currentUser = SecurityUtils.getCurrentUser();
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new ResourceNotFoundException("Habit not found"));

        if (!habit.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You do not have permission to access this habit's history");
        }

        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(days - 1);

        List<CheckIn> checkIns = checkInRepository.findByHabitIdAndCheckInDateBetween(habitId, startDate, today);
        List<HabitException> exceptions = habitExceptionRepository.findByHabitIdAndExceptionDateBetween(habitId, startDate, today);

        Map<LocalDate, CheckIn> checkInMap = checkIns.stream()
                .collect(Collectors.toMap(CheckIn::getCheckInDate, c -> c));
        Map<LocalDate, HabitException> exceptionMap = exceptions.stream()
                .collect(Collectors.toMap(HabitException::getExceptionDate, e -> e));

        List<HabitHistoryDayResponse> history = new ArrayList<>();
        LocalDate current = startDate;
        while (!current.isAfter(today)) {
            HabitHistoryDayResponse.HabitHistoryDayResponseBuilder builder = HabitHistoryDayResponse.builder()
                    .date(current);

            boolean isException = exceptionMap.containsKey(current);
            boolean isExpected = habitScheduleService.isExpected(habit, current);
            CheckIn checkIn = checkInMap.get(current);

            builder.expected(isExpected);
            builder.exception(isException);

            if (checkIn != null) {
                builder.status(HabitHistoryStatus.valueOf(checkIn.getStatus().name()));
                builder.checkInId(checkIn.getId());
                builder.value(
                    checkIn.getValue() != null
                        ? checkIn.getValue().doubleValue()
                        : null
                );
                builder.note(checkIn.getNote());
                if (isException) {
                    builder.exceptionReason(exceptionMap.get(current).getReason());
                }
            } else if (isException) {
                builder.status(HabitHistoryStatus.EXCEPTION);
                builder.exceptionReason(exceptionMap.get(current).getReason());
            } else if (isExpected) {
                builder.status(HabitHistoryStatus.PENDING);
            } else {
                builder.status(HabitHistoryStatus.NOT_EXPECTED);
            }

            history.add(builder.build());
            current = current.plusDays(1);
        }

        return history;
    }
}
