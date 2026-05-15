package com.habit.controller;

import com.habit.dto.response.ApiResponse;
import com.habit.dto.response.BadgeResponse;
import com.habit.service.BadgeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/badges")
@RequiredArgsConstructor
public class BadgeController {

    private final BadgeService badgeService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BadgeResponse>>> getAllBadges() {
        return ResponseEntity.ok(ApiResponse.success(badgeService.getAllBadges()));
    }
}
