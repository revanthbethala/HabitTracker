package com.habit.service.impl;

import com.habit.dto.response.DailyMetricResponse;
import com.habit.dto.response.DashboardResponse;
import com.habit.dto.response.HabitResponse;
import com.habit.entity.Habit;
import com.habit.entity.User;
import com.habit.enums.HabitStatus;
import com.habit.repository.HabitRepository;
import com.habit.repository.UserBadgeRepository;
import com.habit.security.SecurityUtils;
import com.habit.service.DashboardService;
import com.habit.service.HabitScheduleService;
import com.habit.service.HabitService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final HabitRepository habitRepository;
    private final UserBadgeRepository userBadgeRepository;
    private final HabitService habitService;
    private final HabitScheduleService habitScheduleService;

    @Override
    public DashboardResponse getDashboardSummary() {
        User currentUser = SecurityUtils.getCurrentUser();
        List<HabitResponse> allHabits = habitService.getAllHabits(HabitStatus.ACTIVE, "name");
        
        int totalActive = allHabits.size();
        int totalBadges = (int) userBadgeRepository.countByUserId(currentUser.getId());
        
        int avgCompletionRate = allHabits.isEmpty() ? 0 : 
                (int) allHabits.stream().mapToInt(HabitResponse::getCompletionRate).average().orElse(0.0);

        List<HabitResponse> expectedToday = allHabits.stream()
                .filter(HabitResponse::getIsExpectedToday)
                .collect(Collectors.toList());
        
        long completedToday = expectedToday.stream()
                .filter(h -> "DONE".equals(h.getTodayStatus()))
                .count();
        
        int progress = expectedToday.isEmpty() ? 100 : (int) ((completedToday * 100.0) / expectedToday.size());

        List<HabitResponse> dueNow = expectedToday.stream()
                .filter(h -> !"DONE".equals(h.getTodayStatus()))
                .collect(Collectors.toList());

        return DashboardResponse.builder()
                .totalActiveHabits(totalActive)
                .totalBadgesEarned(totalBadges)
                .globalCompletionRate(avgCompletionRate)
                .todayProgress(progress)
                .dueHabits(dueNow)
                .build();
    }

    @Override
    public List<HabitResponse> getDueHabits() {
        List<HabitResponse> allHabits = habitService.getAllHabits(HabitStatus.ACTIVE, "name");
        return allHabits.stream()
                .filter(HabitResponse::getIsExpectedToday)
                .filter(h -> !"DONE".equals(h.getTodayStatus()))
                .collect(Collectors.toList());
    }

    @Override
    public List<DailyMetricResponse> getGlobalHistory(Integer days) {
        User currentUser = SecurityUtils.getCurrentUser();
        List<Habit> activeHabits = habitRepository.findByUserIdAndStatus(currentUser.getId(), HabitStatus.ACTIVE);

        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(days - 1);

        List<DailyMetricResponse> metrics = new ArrayList<>();
        LocalDate current = startDate;

        while (!current.isAfter(today)) {
            int expected = 0;
            int completed = 0;

            for (Habit habit : activeHabits) {
                if (habitScheduleService.isExpected(habit, current)) {
                    expected++;
                    if (habitScheduleService.isDone(habit, current)) {
                        completed++;
                    }
                }
            }

            metrics.add(DailyMetricResponse.builder()
                    .date(current)
                    .expectedCount(expected)
                    .completedCount(completed)
                    .completionRate(expected == 0 ? 0 : (int) ((completed * 100.0) / expected))
                    .build());

            current = current.plusDays(1);
        }

        return metrics;
    }
}

