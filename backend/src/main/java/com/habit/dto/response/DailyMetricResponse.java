package com.habit.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyMetricResponse {
    private LocalDate date;
    private int completedCount;
    private int expectedCount;
    private int completionRate;
}
