package com.habit.dto.response;

import com.habit.enums.HabitStatus;
import com.habit.enums.ScheduleType;
import com.habit.enums.TargetType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HabitResponse {
    private Long id;
    private String name;
    private String description;
    private String category;
    private TargetType targetType;
    private Integer targetValue;
    private String unit;
    private ScheduleType scheduleType;
    private List<DayOfWeek> weekdays;
    private Integer weeklyTarget;
    private HabitStatus status;
    private LocalDate startDate;
    private LocalDate endDate;

    private Integer currentStreak;
    private Integer longestStreak;
    private Integer completionRate;
    private Integer totalCompletions;
    private String todayStatus; 
    private LocalDate lastCheckIn;
    private java.time.LocalDateTime createdAt;
    private String reminderTime;
    private Boolean isExpectedToday;
}
