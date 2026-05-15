package com.habit.service.impl;

import com.habit.dto.response.DailyMetricResponse;
import com.habit.entity.Habit;
import com.habit.entity.User;
import com.habit.enums.HabitStatus;
import com.habit.repository.HabitRepository;
import com.habit.security.SecurityUtils;
import com.habit.service.HabitScheduleService;
import com.habit.service.MetricsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MetricsServiceImpl implements MetricsService {

    private final HabitRepository habitRepository;
    private final HabitScheduleService habitScheduleService;

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
