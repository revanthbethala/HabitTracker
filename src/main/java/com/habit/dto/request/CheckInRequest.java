package com.habit.dto.request;

import com.habit.enums.CheckInStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckInRequest {
    
    @PastOrPresent(message = "Check-in date cannot be in the future")
    private LocalDate date;

    @NotNull(message = "Check-in status is required")
    private CheckInStatus status;

    private Integer value;
    private String note;
}
