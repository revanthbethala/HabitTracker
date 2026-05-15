package com.habit.service.impl;

import com.habit.dto.request.LoginRequest;
import com.habit.dto.request.RegisterRequest;
import com.habit.dto.response.JwtAuthResponse;
import com.habit.dto.response.UserResponse;
import com.habit.entity.RefreshToken;
import com.habit.entity.User;
import com.habit.exception.ResourceNotFoundException;
import com.habit.exception.UnauthorizedException;
import com.habit.repository.RefreshTokenRepository;
import com.habit.repository.UserRepository;
import com.habit.security.CustomUserDetails;
import com.habit.security.JwtTokenProvider;
import com.habit.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Value("${jwt.refresh.expire}")
    private Long refreshTokenDurationMs;

    @Override
    public String register(RegisterRequest registerRequest) {
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new UnauthorizedException("Email is already registered.");
        }

        User user = User.builder()
                .email(registerRequest.getEmail())
                .name(registerRequest.getName())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .build();

        userRepository.save(user);

        return "User registered successfully.";
    }

    @Override
    @Transactional
    public JwtAuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        String accessToken = jwtTokenProvider.generateToken(authentication);
        
        RefreshToken refreshToken = createRefreshToken(userDetails.getUser());

        return JwtAuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .user(UserResponse.builder()
                        .id(userDetails.getUser().getId())
                        .email(userDetails.getUser().getEmail())
                        .name(userDetails.getUser().getName())
                        .createdAt(userDetails.getUser().getCreatedAt())
                        .build())
                .build();
    }

    @Override
    @Transactional
    public JwtAuthResponse refreshToken(String requestRefreshToken) {
        return refreshTokenRepository.findByToken(requestRefreshToken)
                .map(this::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String accessToken = jwtTokenProvider.generateTokenFromEmail(user.getEmail());
                    return JwtAuthResponse.builder()
                            .accessToken(accessToken)
                            .refreshToken(requestRefreshToken)
                            .build();
                })
                .orElseThrow(() -> new UnauthorizedException("Refresh token is not in database!"));
    }

    private RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(token);
            throw new UnauthorizedException("Refresh token was expired. Please make a new signin request");
        }
        return token;
    }

    private RefreshToken createRefreshToken(User user) {
        RefreshToken refreshToken = refreshTokenRepository.findByUser(user)
                .orElse(new RefreshToken());

        refreshToken.setUser(user);
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));

        return refreshTokenRepository.save(refreshToken);
    }

    @Override
    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .createdAt(user.getCreatedAt())
                .build();
    }

    @Override
    @Transactional
    public void logout() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails userDetails) {
            refreshTokenRepository.deleteByUser(userDetails.getUser());
        }
        SecurityContextHolder.clearContext();
    }
}
