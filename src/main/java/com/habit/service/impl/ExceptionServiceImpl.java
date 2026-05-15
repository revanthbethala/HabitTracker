package com.habit.service.impl;

import com.habit.dto.request.ExceptionRequest;
import com.habit.entity.Habit;
import com.habit.entity.HabitException;
import com.habit.entity.User;
import com.habit.exception.ResourceNotFoundException;
import com.habit.exception.UnauthorizedException;
import com.habit.repository.HabitExceptionRepository;
import com.habit.repository.HabitRepository;
import com.habit.security.SecurityUtils;
import com.habit.service.ExceptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExceptionServiceImpl implements ExceptionService {

    private final HabitExceptionRepository exceptionRepository;
    private final HabitRepository habitRepository;

    @Override
    @Transactional
    public HabitException addException(Long habitId, ExceptionRequest request) {
        Habit habit = getOwnedHabit(habitId);
        
        HabitException exception = HabitException.builder()
                .habit(habit)
                .exceptionDate(request.getDate())
                .reason(request.getReason())
                .build();
        
        return exceptionRepository.save(exception);
    }

    @Override
    public List<HabitException> getExceptionsByHabit(Long habitId) {
        getOwnedHabit(habitId); // Access check
        return exceptionRepository.findByHabitId(habitId);
    }

    @Override
    @Transactional
    public HabitException updateException(Long exceptionId, ExceptionRequest request) {
        HabitException exception = exceptionRepository.findById(exceptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Exception not found with id: " + exceptionId));
        
        // Ownership check
        if (!exception.getHabit().getUser().getId().equals(SecurityUtils.getCurrentUser().getId())) {
            throw new UnauthorizedException("You do not have permission to modify this exception");
        }

        if (request.getDate() != null) exception.setExceptionDate(request.getDate());
        if (request.getReason() != null) exception.setReason(request.getReason());

        return exceptionRepository.save(exception);
    }

    @Override
    @Transactional
    public void deleteException(Long exceptionId) {
        HabitException exception = exceptionRepository.findById(exceptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Exception not found with id: " + exceptionId));
        
        // Ownership check
        if (!exception.getHabit().getUser().getId().equals(SecurityUtils.getCurrentUser().getId())) {
            throw new UnauthorizedException("You do not have permission to delete this exception");
        }

        exceptionRepository.delete(exception);
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
}
