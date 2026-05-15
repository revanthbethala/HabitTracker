package com.habit.controller;

import com.habit.dto.request.LoginRequest;
import com.habit.dto.request.RegisterRequest;
import com.habit.dto.request.TokenRefreshRequest;
import com.habit.dto.response.ApiResponse;
import com.habit.dto.response.JwtAuthResponse;
import com.habit.dto.response.UserResponse;
import com.habit.service.AuthService;
import jakarta.validation.Valid;
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
    public ResponseEntity<ApiResponse<String>> register(@Valid @RequestBody RegisterRequest registerRequest) {
        String message = authService.register(registerRequest);
        return new ResponseEntity<>(ApiResponse.success(message, null), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> login(
            @Valid @RequestBody LoginRequest loginRequest,
            jakarta.servlet.http.HttpServletResponse response) {
        JwtAuthResponse jwtAuthResponse = authService.login(loginRequest);
        
        // Set Refresh Token Cookie
        org.springframework.http.ResponseCookie refreshCookie = org.springframework.http.ResponseCookie.from("refreshToken", jwtAuthResponse.getRefreshToken())
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(7 * 24 * 60 * 60)
                .sameSite("Lax")
                .build();
        
        // Set Access Token Cookie
        org.springframework.http.ResponseCookie accessCookie = org.springframework.http.ResponseCookie.from("accessToken", jwtAuthResponse.getAccessToken())
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(15 * 60) // 15 minutes or match JWT expiration
                .sameSite("Lax")
                .build();
        
        response.addHeader(org.springframework.http.HttpHeaders.SET_COOKIE, refreshCookie.toString());
        response.addHeader(org.springframework.http.HttpHeaders.SET_COOKIE, accessCookie.toString());
        
        // Remove refresh token from response body for security
        jwtAuthResponse.setRefreshToken(null);
        
        return ResponseEntity.ok(ApiResponse.success("Login successful", jwtAuthResponse));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> refreshToken(
            @org.springframework.web.bind.annotation.CookieValue(name = "refreshToken", required = false) String refreshToken,
            jakarta.servlet.http.HttpServletResponse response) {
        
        if (refreshToken == null || refreshToken.isEmpty()) {
            return new ResponseEntity<>(ApiResponse.<JwtAuthResponse>error("Refresh token missing", null), HttpStatus.UNAUTHORIZED);
        }

        try {
            JwtAuthResponse jwtAuthResponse = authService.refreshToken(refreshToken);
            
            org.springframework.http.ResponseCookie refreshCookie = org.springframework.http.ResponseCookie.from("refreshToken", jwtAuthResponse.getRefreshToken())
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .maxAge(7 * 24 * 60 * 60)
                    .sameSite("Lax")
                    .build();

            org.springframework.http.ResponseCookie accessCookie = org.springframework.http.ResponseCookie.from("accessToken", jwtAuthResponse.getAccessToken())
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .maxAge(15 * 60)
                    .sameSite("Lax")
                    .build();
            
            response.addHeader(org.springframework.http.HttpHeaders.SET_COOKIE, refreshCookie.toString());
            response.addHeader(org.springframework.http.HttpHeaders.SET_COOKIE, accessCookie.toString());
            
            jwtAuthResponse.setRefreshToken(null);
            return ResponseEntity.ok(ApiResponse.success("Token refreshed successfully", jwtAuthResponse));
        } catch (Exception e) {
            return new ResponseEntity<>(ApiResponse.<JwtAuthResponse>error("Invalid refresh token", null), HttpStatus.UNAUTHORIZED);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(Authentication authentication) {
        UserResponse userResponse = authService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(userResponse));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(jakarta.servlet.http.HttpServletResponse response) {
        authService.logout();
        
        // Clear refresh token cookie
        org.springframework.http.ResponseCookie refreshCookie = org.springframework.http.ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        // Clear access token cookie
        org.springframework.http.ResponseCookie accessCookie = org.springframework.http.ResponseCookie.from("accessToken", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();
        
        response.addHeader(org.springframework.http.HttpHeaders.SET_COOKIE, refreshCookie.toString());
        response.addHeader(org.springframework.http.HttpHeaders.SET_COOKIE, accessCookie.toString());
        
        return ResponseEntity.ok(ApiResponse.success("User logged out successfully", null));
    }
}
