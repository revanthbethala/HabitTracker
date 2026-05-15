package com.habit.config;

import com.habit.entity.Badge;
import com.habit.enums.BadgeCriteriaType;
import com.habit.repository.BadgeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final BadgeRepository badgeRepository;

    @Override
    public void run(String... args) throws Exception {
        if (badgeRepository.count() == 0) {
            Badge b1 = Badge.builder()
                    .name("First Steps")
                    .description("Recorded your first habit check-in!")
                    .criteriaType(BadgeCriteriaType.FIRST_CHECKIN)
                    .criteriaValue(1)
                    .build();

            Badge b2 = Badge.builder()
                    .name("Consistency King")
                    .description("Maintain a 7-day streak on any habit.")
                    .criteriaType(BadgeCriteriaType.STREAK)
                    .criteriaValue(7)
                    .build();

            Badge b3 = Badge.builder()
                    .name("Habit Master")
                    .description("Maintain a 30-day streak on any habit.")
                    .criteriaType(BadgeCriteriaType.STREAK)
                    .criteriaValue(30)
                    .build();

            Badge b4 = Badge.builder()
                    .name("Century")
                    .description("Recorded 100 total completions.")
                    .criteriaType(BadgeCriteriaType.TOTAL_COMPLETIONS)
                    .criteriaValue(100)
                    .build();

            badgeRepository.saveAll(Arrays.asList(b1, b2, b3, b4));
        }
    }
}
