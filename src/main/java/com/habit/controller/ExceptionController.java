package com.habit.controller;

import com.habit.dto.request.ExceptionRequest;
import com.habit.dto.response.ApiResponse;
import com.habit.entity.HabitException;
import com.habit.service.ExceptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ExceptionController {

    private final ExceptionService exceptionService;

    @PostMapping("/habits/{habitId}/exceptions")
    public ResponseEntity<ApiResponse<HabitException>> addException(
            @PathVariable Long habitId,
            @Valid @RequestBody ExceptionRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Exception added successfully", exceptionService.addException(habitId, request)));
    }

    @GetMapping("/habits/{habitId}/exceptions")
    public ResponseEntity<ApiResponse<List<HabitException>>> getExceptions(@PathVariable Long habitId) {
        return ResponseEntity.ok(ApiResponse.success(exceptionService.getExceptionsByHabit(habitId)));
    }

    @PutMapping("/exceptions/{exceptionId}")
    public ResponseEntity<ApiResponse<HabitException>> updateException(
            @PathVariable Long exceptionId,
            @Valid @RequestBody ExceptionRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Exception updated successfully", exceptionService.updateException(exceptionId, request)));
    }

    @DeleteMapping("/exceptions/{exceptionId}")
    public ResponseEntity<ApiResponse<Void>> deleteException(@PathVariable Long exceptionId) {
        exceptionService.deleteException(exceptionId);
        return ResponseEntity.ok(ApiResponse.success("Exception deleted successfully", null));
    }
}
