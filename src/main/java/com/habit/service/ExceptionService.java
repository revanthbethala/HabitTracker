package com.habit.service;

import com.habit.dto.request.ExceptionRequest;
import com.habit.entity.HabitException;

import java.util.List;

public interface ExceptionService {
    HabitException addException(Long habitId, ExceptionRequest request);
    List<HabitException> getExceptionsByHabit(Long habitId);
    HabitException updateException(Long exceptionId, ExceptionRequest request);
    void deleteException(Long exceptionId);
}
