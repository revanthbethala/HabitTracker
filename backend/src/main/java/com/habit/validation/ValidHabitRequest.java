package com.habit.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = HabitRequestValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidHabitRequest {
    String message() default "Invalid habit request parameters";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
