package com.habit.service;

import com.habit.dto.response.BadgeResponse;
import com.habit.entity.User;

import java.util.List;

public interface BadgeService {
    List<BadgeResponse> getAllBadges();
    void checkAndAwardBadges(User user);
}
