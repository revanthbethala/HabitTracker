package com.habit.service.impl;

import com.habit.dto.response.DashboardResponse;
import com.habit.dto.response.HabitResponse;
import com.habit.entity.Habit;
import com.habit.entity.User;
import com.habit.enums.HabitStatus;
import com.habit.enums.ScheduleType;
import com.habit.repository.HabitRepository;
import com.habit.repository.UserBadgeRepository;
import com.habit.security.SecurityUtils;
import com.habit.service.DashboardService;
import com.habit.service.HabitService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final HabitRepository habitRepository;
    private final UserBadgeRepository userBadgeRepository;
    private final HabitService habitService;

    @Override
    public DashboardResponse getDashboardSummary() {
        User currentUser = SecurityUtils.getCurrentUser();
        List<HabitResponse> allHabits = habitService.getAllHabits(HabitStatus.ACTIVE, "name");
        
        int totalActive = allHabits.size();
        int totalBadges = (int) userBadgeRepository.countByUserId(currentUser.getId());
        
        int avgCompletionRate = allHabits.isEmpty() ? 0 : 
                (int) allHabits.stream().mapToInt(HabitResponse::getCompletionRate).average().orElse(0.0);

        List<HabitResponse> dueToday = filterDueToday(allHabits);
        
        long completedToday = dueToday.stream()
                .filter(h -> "DONE".equals(h.getTodayStatus()))
                .count();
        
        int progress = dueToday.isEmpty() ? 100 : (int) ((completedToday * 100.0) / dueToday.size());

        return DashboardResponse.builder()
                .totalActiveHabits(totalActive)
                .totalBadgesEarned(totalBadges)
                .globalCompletionRate(avgCompletionRate)
                .todayProgress(progress)
                .dueHabits(dueToday)
                .build();
    }

    @Override
    public List<HabitResponse> getDueHabits() {
        List<HabitResponse> allHabits = habitService.getAllHabits(HabitStatus.ACTIVE, "name");
        return filterDueToday(allHabits);
    }

    private List<HabitResponse> filterDueToday(List<HabitResponse> habits) {
        LocalDate today = LocalDate.now();
        return habits.stream()
                .filter(h -> isScheduledForDate(h, today))
                .collect(Collectors.toList());
    }

    private boolean isScheduledForDate(HabitResponse h, LocalDate date) {
        // We need to re-verify schedule logic here because HabitResponse doesn't store the full schedule entity
        // However, I can check if it's expected using the Habit entity from repo if needed, 
        // but for now let's use the fields available in Response
        
        if (h.getScheduleType() == ScheduleType.DAILY) return true;
        if (h.getScheduleType() == ScheduleType.SPECIFIC_DAYS) {
            return h.getWeekdays() != null && h.getWeekdays().contains(date.getDayOfWeek());
        }
        if (h.getScheduleType() == ScheduleType.WEEKLY_COUNT) return true;
        
        return false;
    }
}
