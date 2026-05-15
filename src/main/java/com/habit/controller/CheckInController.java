package com.habit.controller;

import com.habit.dto.request.CheckInRequest;
import com.habit.dto.response.ApiResponse;
import com.habit.dto.response.HabitResponse;
import com.habit.service.CheckInService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CheckInController {

    private final CheckInService checkInService;

    @PutMapping("/habits/{habitId}/check-ins")
    public ResponseEntity<ApiResponse<HabitResponse>> upsertCheckIn(
            @PathVariable Long habitId,
            @RequestBody CheckInRequest request) {
        HabitResponse habitResponse = checkInService.upsertCheckIn(habitId, request);
        return ResponseEntity.ok(ApiResponse.success("Check-in recorded successfully", habitResponse));
    }

    @GetMapping("/habits/{habitId}/check-ins")
    public ResponseEntity<Page<?>> getCheckIns(
            @PathVariable Long habitId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "30") int size) {
        return ResponseEntity.ok(checkInService.getCheckInsByHabit(habitId, PageRequest.of(page, size)));
    }

    @DeleteMapping("/check-ins/{checkInId}")
    public ResponseEntity<ApiResponse<String>> deleteCheckIn(@PathVariable Long checkInId) {
        checkInService.deleteCheckIn(checkInId);
        return ResponseEntity.ok(ApiResponse.success("Check-in deleted successfully", null));
    }
}
