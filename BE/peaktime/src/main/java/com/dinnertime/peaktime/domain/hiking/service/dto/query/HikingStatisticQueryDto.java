package com.dinnertime.peaktime.domain.hiking.service.dto.query;

import lombok.Getter;

@Getter
public class HikingStatisticQueryDto {
    private Integer totalHikingTime;
    private Long totalHikingCount;
    private Integer totalHikingSuccessCount;
    private Integer totalBlockedCount;
}
