package com.habit.dto.request;

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
public class HabitRequest {
    private String name;
    private String description;
    private String category;
    private TargetType targetType;
    private Integer targetValue;
    private String unit;
    private ScheduleType scheduleType;
    private List<DayOfWeek> weekdays;
    private Integer weeklyTarget;
    private LocalDate startDate;
    private LocalDate endDate;
}
