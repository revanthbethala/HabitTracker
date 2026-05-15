package com.habit.controller;

import com.habit.dto.request.ReminderRequest;
import com.habit.dto.response.ApiResponse;
import com.habit.entity.Reminder;
import com.habit.service.ReminderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/habits/{habitId}/reminder")
@RequiredArgsConstructor
public class ReminderController {

    private final ReminderService reminderService;

    @PutMapping
    public ResponseEntity<ApiResponse<Reminder>> upsertReminder(
            @PathVariable Long habitId,
            @Valid @RequestBody ReminderRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Reminder updated successfully", reminderService.upsertReminder(habitId, request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Reminder>> getReminder(@PathVariable Long habitId) {
        return ResponseEntity.ok(ApiResponse.success(reminderService.getReminderByHabit(habitId)));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> deleteReminder(@PathVariable Long habitId) {
        reminderService.deleteReminder(habitId);
        return ResponseEntity.ok(ApiResponse.success("Reminder removed successfully", null));
    }
}
