package com.habit.service;

import com.habit.dto.request.HabitRequest;
import com.habit.dto.response.HabitHistoryDayResponse;
import com.habit.dto.response.HabitResponse;
import com.habit.enums.HabitStatus;

import java.util.List;

public interface HabitService {
    HabitResponse createHabit(HabitRequest request);
    List<HabitResponse> getAllHabits(HabitStatus status, String sort);
    HabitResponse getHabitById(Long id);
    HabitResponse updateHabit(Long id, HabitRequest request);
    void deleteHabit(Long id);
    void updateStatus(Long id, HabitStatus status);
    List<HabitHistoryDayResponse> getHabitHistory(Long habitId, Integer days);
}
