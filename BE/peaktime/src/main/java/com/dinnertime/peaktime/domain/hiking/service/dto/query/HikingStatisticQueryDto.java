package com.dinnertime.peaktime.domain.hiking.service.dto.query;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
public class HikingStatisticQueryDto {
    private Integer totalHikingTime;
    private Long totalHikingCount;
    private Integer totalHikingSuccessCount;
    private Integer totalBlockedCount;
    private Integer preferTimeZone;
    @Setter
    private List<BlockInfo> mostSiteList;
    @Setter
    private List<BlockInfo> mostProgramList;
}
