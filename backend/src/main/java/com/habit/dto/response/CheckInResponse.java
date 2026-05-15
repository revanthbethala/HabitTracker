package com.habit.dto.response;

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
public class CheckInResponse {
    private Long id;
    private Long habitId;
    private LocalDate checkInDate;
    private CheckInStatus status;
    private Integer value;
    private String note;
}
