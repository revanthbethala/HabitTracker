package com.habit.controller;

import com.habit.dto.response.ApiResponse;
import com.habit.dto.response.DailyMetricResponse;
import com.habit.service.MetricsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/metrics")
@RequiredArgsConstructor
public class MetricsController {

    private final MetricsService metricsService;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<List<DailyMetricResponse>>> getGlobalMetrics(
            @RequestParam(defaultValue = "30") Integer days) {
        if (days < 1 || days > 90) {
            days = 30;
        }
        return ResponseEntity.ok(ApiResponse.success(metricsService.getGlobalHistory(days)));
    }
}
