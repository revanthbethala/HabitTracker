package com.habit.dto.request;

import com.habit.enums.CheckInStatus;
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
    private LocalDate date;
    private CheckInStatus status;
    private Integer value;
    private String note;
}
