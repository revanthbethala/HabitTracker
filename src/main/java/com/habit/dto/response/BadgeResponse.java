package com.habit.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BadgeResponse {
    private Long id;
    private String name;
    private String description;
    private String criteriaType;
    private Integer criteriaValue;
    private Boolean earned;
    private LocalDateTime earnedAt;
}
