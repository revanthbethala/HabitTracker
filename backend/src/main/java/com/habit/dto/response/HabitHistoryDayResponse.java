package com.habit.dto.response;

import com.habit.enums.HabitHistoryStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HabitHistoryDayResponse {
    private LocalDate date;
    private boolean expected;
    private boolean exception;
    private HabitHistoryStatus status;
    private Double value;
    private String note;
    private Long checkInId;
    private String exceptionReason;
}
