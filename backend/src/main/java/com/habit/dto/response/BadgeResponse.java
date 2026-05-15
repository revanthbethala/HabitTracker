package com.habit.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
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
    @JsonProperty("id")
    private Long id;
    
    @JsonProperty("name")
    private String name;
    
    @JsonProperty("description")
    private String description;
    
    @JsonProperty("criteria")
    private String criteria;
    
    @JsonProperty("criteriaType")
    private String criteriaType;
    
    @JsonProperty("criteriaValue")
    private Integer criteriaValue;
    
    @JsonProperty("isEarned")
    private Boolean isEarned;
    
    @JsonProperty("earnedAt")
    private LocalDateTime earnedAt;
}
