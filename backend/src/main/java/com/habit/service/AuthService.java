package com.habit.service;

import com.habit.dto.request.LoginRequest;
import com.habit.dto.request.RegisterRequest;
import com.habit.dto.response.JwtAuthResponse;
import com.habit.dto.response.UserResponse;

public interface AuthService {
    String register(RegisterRequest registerRequest);
    JwtAuthResponse login(LoginRequest loginRequest);
    JwtAuthResponse refreshToken(String refreshToken);
    UserResponse getCurrentUser(String email);
    void logout();
}
