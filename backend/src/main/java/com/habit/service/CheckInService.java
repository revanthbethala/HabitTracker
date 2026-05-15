package com.habit.service;

import com.habit.dto.request.CheckInRequest;
import com.habit.dto.response.CheckInResponse;
import com.habit.dto.response.HabitResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CheckInService {
    HabitResponse upsertCheckIn(Long habitId, CheckInRequest request);
    Page<CheckInResponse> getCheckInsByHabit(Long habitId, Pageable pageable);
    void deleteCheckIn(Long checkInId);
}
