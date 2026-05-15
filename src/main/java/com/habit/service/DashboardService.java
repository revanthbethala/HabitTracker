package com.habit.service;

import com.habit.dto.response.DashboardResponse;
import com.habit.dto.response.HabitResponse;

import java.util.List;

public interface DashboardService {
    DashboardResponse getDashboardSummary();
    List<HabitResponse> getDueHabits();
}
