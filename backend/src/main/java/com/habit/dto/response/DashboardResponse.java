package com.habit.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private Integer totalActiveHabits;
    private Integer totalBadgesEarned;
    private Integer globalCompletionRate;
    private Integer todayProgress; // Percentage of today's habits completed
    private Integer currentStreak; // Highest current streak across all habits
    private List<HabitResponse> dueHabits;
}
