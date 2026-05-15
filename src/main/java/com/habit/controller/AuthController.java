package com.habit.controller;

import com.habit.dto.request.LoginRequest;
import com.habit.dto.request.RegisterRequest;
import com.habit.dto.request.TokenRefreshRequest;
import com.habit.dto.response.ApiResponse;
import com.habit.dto.response.JwtAuthResponse;
import com.habit.dto.response.UserResponse;
import com.habit.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> register(@RequestBody RegisterRequest registerRequest) {
        String message = authService.register(registerRequest);
        return new ResponseEntity<>(ApiResponse.success(message, null), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> login(@RequestBody LoginRequest loginRequest) {
        JwtAuthResponse jwtAuthResponse = authService.login(loginRequest);
        return ResponseEntity.ok(ApiResponse.success("Login successful", jwtAuthResponse));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> refreshToken(@RequestBody TokenRefreshRequest request) {
        JwtAuthResponse jwtAuthResponse = authService.refreshToken(request.getRefreshToken());
        return ResponseEntity.ok(ApiResponse.success("Token refreshed successfully", jwtAuthResponse));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(Authentication authentication) {
        UserResponse userResponse = authService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(userResponse));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout() {
        authService.logout();
        return ResponseEntity.ok(ApiResponse.success("User logged out successfully", null));
    }
}
