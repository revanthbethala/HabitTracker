package com.habit.service;

import com.habit.dto.request.ReminderRequest;
import com.habit.entity.Reminder;

public interface ReminderService {
    Reminder upsertReminder(Long habitId, ReminderRequest request);
    Reminder getReminderByHabit(Long habitId);
    void deleteReminder(Long habitId);
}
