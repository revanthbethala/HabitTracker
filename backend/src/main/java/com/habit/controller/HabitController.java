package com.habit.controller;

import com.habit.dto.request.HabitRequest;
import com.habit.dto.response.ApiResponse;
import com.habit.dto.response.HabitHistoryDayResponse;
import com.habit.dto.response.HabitResponse;
import com.habit.enums.HabitStatus;
import com.habit.security.SecurityUtils;
import com.habit.service.BadgeService;
import com.habit.service.HabitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/habits")
@RequiredArgsConstructor
public class HabitController {

    private final HabitService habitService;
    private final BadgeService badgeService;

    @PostMapping
    public ResponseEntity<ApiResponse<HabitResponse>> createHabit(@Valid @RequestBody HabitRequest request) {
        HabitResponse response = habitService.createHabit(request);
        badgeService.checkAndAwardBadges(SecurityUtils.getCurrentUser());
        return ResponseEntity.ok(ApiResponse.success("Habit created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<HabitResponse>>> getAllHabits(
            @RequestParam(required = false) HabitStatus status,
            @RequestParam(required = false) String sort) {
        return ResponseEntity.ok(ApiResponse.success(habitService.getAllHabits(status, sort)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HabitResponse>> getHabitById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(habitService.getHabitById(id)));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<HabitResponse>> updateHabit(@PathVariable Long id, @RequestBody HabitRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Habit updated successfully", habitService.updateHabit(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteHabit(@PathVariable Long id) {
        habitService.deleteHabit(id);
        return ResponseEntity.ok(ApiResponse.success("Habit deleted successfully", null));
    }

    @PatchMapping("/{id}/pause")
    public ResponseEntity<ApiResponse<Void>> pauseHabit(@PathVariable Long id) {
        habitService.updateStatus(id, HabitStatus.PAUSED);
        badgeService.checkAndAwardBadges(SecurityUtils.getCurrentUser());
        return ResponseEntity.ok(ApiResponse.success("Habit paused successfully", null));
    }

    @PatchMapping("/{id}/resume")
    public ResponseEntity<ApiResponse<Void>> resumeHabit(@PathVariable Long id) {
        habitService.updateStatus(id, HabitStatus.ACTIVE);
        badgeService.checkAndAwardBadges(SecurityUtils.getCurrentUser());
        return ResponseEntity.ok(ApiResponse.success("Habit resumed successfully", null));
    }

    @PatchMapping("/{id}/archive")
    public ResponseEntity<ApiResponse<Void>> archiveHabit(@PathVariable Long id) {
        habitService.updateStatus(id, HabitStatus.ARCHIVED);
        badgeService.checkAndAwardBadges(SecurityUtils.getCurrentUser());
        return ResponseEntity.ok(ApiResponse.success("Habit archived successfully", null));
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<ApiResponse<List<HabitHistoryDayResponse>>> getHabitHistory(
            @PathVariable Long id,
            @RequestParam(defaultValue = "30") Integer days) {
        if (days < 1 || days > 90) {
            days = 30; // Basic fallback or could throw error
        }
        return ResponseEntity.ok(ApiResponse.success(habitService.getHabitHistory(id, days)));
    }
}
