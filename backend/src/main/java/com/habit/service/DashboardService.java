package com.habit.service;

import com.habit.dto.response.DashboardResponse;
import com.habit.dto.response.HabitResponse;
import com.habit.dto.response.DailyMetricResponse;

import java.util.List;

public interface DashboardService {
    DashboardResponse getDashboardSummary();
    List<HabitResponse> getDueHabits();
    List<DailyMetricResponse> getGlobalHistory(Integer days);
}
