package com.habit.service;

import com.habit.dto.response.DailyMetricResponse;
import java.util.List;

public interface MetricsService {
    List<DailyMetricResponse> getGlobalHistory(Integer days);
}
