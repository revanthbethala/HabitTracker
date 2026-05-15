package com.habit.controller;

import com.habit.dto.request.HabitRequest;
import com.habit.dto.response.ApiResponse;
import com.habit.dto.response.HabitResponse;
import com.habit.enums.HabitStatus;
import com.habit.service.HabitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/habits")
@RequiredArgsConstructor
public class HabitController {

    private final HabitService habitService;

    @PostMapping
    public ResponseEntity<ApiResponse<HabitResponse>> createHabit(@RequestBody HabitRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Habit created successfully", habitService.createHabit(request)));
    }

    @GetMapping
    public ResponseEntity<List<HabitResponse>> getAllHabits(
            @RequestParam(required = false) HabitStatus status,
            @RequestParam(required = false) String sort) {
        return ResponseEntity.ok(habitService.getAllHabits(status, sort));
    }

    @GetMapping("/{id}")
    public ResponseEntity<HabitResponse> getHabitById(@PathVariable Long id) {
        return ResponseEntity.ok(habitService.getHabitById(id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> updateHabit(@PathVariable Long id, @RequestBody HabitRequest request) {
        habitService.updateHabit(id, request);
        return ResponseEntity.ok(ApiResponse.success("Habit updated successfully", null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteHabit(@PathVariable Long id) {
        habitService.deleteHabit(id);
        return ResponseEntity.ok(ApiResponse.success("Habit deleted successfully", null));
    }

    @PatchMapping("/{id}/pause")
    public ResponseEntity<ApiResponse<String>> pauseHabit(@PathVariable Long id) {
        habitService.updateStatus(id, HabitStatus.PAUSED);
        return ResponseEntity.ok(ApiResponse.success("Habit paused successfully", null));
    }

    @PatchMapping("/{id}/resume")
    public ResponseEntity<ApiResponse<String>> resumeHabit(@PathVariable Long id) {
        habitService.updateStatus(id, HabitStatus.ACTIVE);
        return ResponseEntity.ok(ApiResponse.success("Habit resumed successfully", null));
    }

    @PatchMapping("/{id}/archive")
    public ResponseEntity<ApiResponse<String>> archiveHabit(@PathVariable Long id) {
        habitService.updateStatus(id, HabitStatus.ARCHIVED);
        return ResponseEntity.ok(ApiResponse.success("Habit archived successfully", null));
    }
}
