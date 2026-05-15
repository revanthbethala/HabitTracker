package com.habit.dto.request;

import com.habit.enums.ScheduleType;
import com.habit.enums.TargetType;
import com.habit.validation.ValidHabitRequest;
import jakarta.validation.constraints.*;
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
@ValidHabitRequest
public class HabitRequest {
    
    @NotBlank(message = "Habit name is required")
    @Size(max = 100, message = "Habit name must be less than 100 characters")
    private String name;

    private String description;
    private String category;

    @NotNull(message = "Target type is required")
    private TargetType targetType;

    @Positive(message = "Target value must be a positive number")
    private Integer targetValue;

    private String unit;

    @NotNull(message = "Schedule type is required")
    private ScheduleType scheduleType;

    private List<DayOfWeek> weekdays;

    @Min(value = 1, message = "Weekly target must be at least 1")
    @Max(value = 7, message = "Weekly target cannot exceed 7")
    private Integer weeklyTarget;

    private LocalDate startDate;
    private LocalDate endDate;
    private com.habit.enums.HabitStatus status;
}
