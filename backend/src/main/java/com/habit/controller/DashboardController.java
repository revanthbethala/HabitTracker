package com.habit.controller;

import com.habit.dto.response.ApiResponse;
import com.habit.dto.response.DashboardResponse;
import com.habit.dto.response.HabitResponse;
import com.habit.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<ApiResponse<DashboardResponse>> getSummary() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getDashboardSummary()));
    }

    @GetMapping("/due")
    public ResponseEntity<ApiResponse<List<HabitResponse>>> getDueHabits() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getDueHabits()));
    }
}
