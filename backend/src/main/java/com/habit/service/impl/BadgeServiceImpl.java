package com.habit.service.impl;

import com.habit.dto.response.BadgeResponse;
import com.habit.dto.response.HabitResponse;
import com.habit.entity.Badge;
import com.habit.entity.User;
import com.habit.entity.UserBadge;
import com.habit.enums.BadgeCriteriaType;
import com.habit.enums.HabitStatus;
import com.habit.repository.BadgeRepository;
import com.habit.repository.UserBadgeRepository;
import com.habit.security.SecurityUtils;
import com.habit.service.BadgeService;
import com.habit.service.HabitService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BadgeServiceImpl implements BadgeService {

    private final BadgeRepository badgeRepository;
    private final UserBadgeRepository userBadgeRepository;
    private final HabitService habitService;

    @Override
    public List<BadgeResponse> getAllBadges() {
        User currentUser = SecurityUtils.getCurrentUser();
        List<Badge> allBadges = badgeRepository.findAll();
        List<UserBadge> earnedBadges = userBadgeRepository.findByUserId(currentUser.getId());

        return allBadges.stream().map(badge -> {
            UserBadge earned = earnedBadges.stream()
                    .filter(ub -> ub.getBadge().getId().equals(badge.getId()))
                    .findFirst()
                    .orElse(null);

            return BadgeResponse.builder()
                    .id(badge.getId())
                    .name(badge.getName())
                    .description(badge.getDescription())
                    .criteria(formatCriteria(badge.getCriteriaType(), badge.getCriteriaValue()))
                    .criteriaType(badge.getCriteriaType().name())
                    .criteriaValue(badge.getCriteriaValue())
                    .isEarned(earned != null)
                    .earnedAt(earned != null ? earned.getEarnedAt() : null)
                    .build();
        }).collect(Collectors.toList());
    }

    private String formatCriteria(BadgeCriteriaType type, int value) {
        switch (type) {
            case FIRST_CHECKIN: return "Complete your first check-in";
            case STREAK: return "Achieve a " + value + " day streak";
            case TOTAL_COMPLETIONS: return "Reach " + value + " total completions";
            case ACTIVE_HABITS: return "Maintain " + value + " active habits";
            default: return "Complete the challenge";
        }
    }

    @Override
    @Transactional
    public void checkAndAwardBadges(User user) {
        List<Badge> allBadges = badgeRepository.findAll();
        List<UserBadge> earnedBadges = userBadgeRepository.findByUserId(user.getId());
        List<Long> earnedBadgeIds = earnedBadges.stream()
                .map(ub -> ub.getBadge().getId())
                .collect(Collectors.toList());

        List<HabitResponse> habits = habitService.getAllHabits(null, "name");

        for (Badge badge : allBadges) {
            if (earnedBadgeIds.contains(badge.getId())) continue;

            boolean qualified = false;
            BadgeCriteriaType type = badge.getCriteriaType();
            int value = badge.getCriteriaValue();

            switch (type) {
                case FIRST_CHECKIN:
                    qualified = habits.stream().anyMatch(h -> h.getTotalCompletions() >= value);
                    break;
                case STREAK:
                    qualified = habits.stream().anyMatch(h -> h.getLongestStreak() >= value);
                    break;
                case TOTAL_COMPLETIONS:
                    int total = habits.stream().mapToInt(HabitResponse::getTotalCompletions).sum();
                    qualified = total >= value;
                    break;
                case ACTIVE_HABITS:
                    long activeCount = habits.stream().filter(h -> h.getStatus() == HabitStatus.ACTIVE).count();
                    qualified = activeCount >= value;
                    break;
            }

            if (qualified) {
                UserBadge userBadge = UserBadge.builder()
                        .user(user)
                        .badge(badge)
                        .earnedAt(LocalDateTime.now())
                        .build();
                userBadgeRepository.save(userBadge);
            }
        }
    }
}
