package com.habit.service.impl;

import com.habit.dto.request.ReminderRequest;
import com.habit.entity.Habit;
import com.habit.entity.Reminder;
import com.habit.entity.User;
import com.habit.exception.ResourceNotFoundException;
import com.habit.exception.UnauthorizedException;
import com.habit.repository.HabitRepository;
import com.habit.repository.ReminderRepository;
import com.habit.security.SecurityUtils;
import com.habit.service.ReminderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReminderServiceImpl implements ReminderService {

    private final ReminderRepository reminderRepository;
    private final HabitRepository habitRepository;

    @Override
    @Transactional
    public Reminder upsertReminder(Long habitId, ReminderRequest request) {
        Habit habit = getOwnedHabit(habitId);
        
        Reminder reminder = reminderRepository.findByHabitId(habitId)
                .orElse(Reminder.builder().habit(habit).build());
        
        reminder.setTime(request.getTime());
        reminder.setEnabled(request.getEnabled() != null ? request.getEnabled() : true);
        
        return reminderRepository.save(reminder);
    }

    @Override
    public Reminder getReminderByHabit(Long habitId) {
        getOwnedHabit(habitId); // Access check
        return reminderRepository.findByHabitId(habitId)
                .orElseThrow(() -> new ResourceNotFoundException("No reminder set for habit: " + habitId));
    }

    @Override
    @Transactional
    public void deleteReminder(Long habitId) {
        getOwnedHabit(habitId); // Access check
        Reminder reminder = reminderRepository.findByHabitId(habitId)
                .orElseThrow(() -> new ResourceNotFoundException("No reminder found for habit: " + habitId));
        
        reminderRepository.delete(reminder);
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
