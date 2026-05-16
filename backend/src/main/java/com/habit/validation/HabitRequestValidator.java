package com.habit.validation;

import com.habit.dto.request.HabitRequest;
import com.habit.enums.ScheduleType;
import com.habit.enums.TargetType;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.time.LocalDate;

public class HabitRequestValidator implements ConstraintValidator<ValidHabitRequest, HabitRequest> {

    @Override
    public boolean isValid(HabitRequest request, ConstraintValidatorContext context) {
        if (request == null) return true;

        boolean valid = true;

        // 1. Target Validation
        if (request.getTargetType() == TargetType.COUNT) {
            if (request.getTargetValue() == null) {
                addConstraintViolation(context, "Target value is required for COUNT type habits", "targetValue");
                valid = false;
            }
            if (request.getUnit() == null || request.getUnit().isBlank()) {
                addConstraintViolation(context, "Unit is required for COUNT type habits", "unit");
                valid = false;
            }
        }

        // 2. Schedule Validation
        if (request.getScheduleType() == ScheduleType.SPECIFIC_DAYS) {
            if (request.getWeekdays() == null || request.getWeekdays().isEmpty()) {
                addConstraintViolation(context, "At least one weekday must be selected for SPECIFIC_DAYS schedule", "weekdays");
                valid = false;
            }
        } else if (request.getScheduleType() == ScheduleType.WEEKLY_COUNT) {
            if (request.getWeeklyTarget() == null) {
                addConstraintViolation(context, "Weekly target is required for WEEKLY_COUNT schedule", "weeklyTarget");
                valid = false;
            }
        }

        // 3. Date Validation
        LocalDate today = LocalDate.now();
        
        if (request.getStartDate() != null && request.getStartDate().isBefore(today)) {
            addConstraintViolation(context, "Start date cannot be in the past", "startDate");
            valid = false;
        }

        if (request.getEndDate() != null) {
            if (request.getEndDate().isBefore(today)) {
                addConstraintViolation(context, "End date cannot be in the past", "endDate");
                valid = false;
            }
            if (request.getStartDate() != null && request.getEndDate().isBefore(request.getStartDate())) {
                addConstraintViolation(context, "End date must be after or equal to start date", "endDate");
                valid = false;
            }
        }

        return valid;
    }

    private void addConstraintViolation(ConstraintValidatorContext context, String message, String property) {
        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate(message)
                .addPropertyNode(property)
                .addConstraintViolation();
    }
}
