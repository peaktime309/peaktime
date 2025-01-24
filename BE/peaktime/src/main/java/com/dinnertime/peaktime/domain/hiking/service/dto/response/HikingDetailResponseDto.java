package com.dinnertime.peaktime.domain.hiking.service.dto.response;

import com.dinnertime.peaktime.domain.hiking.entity.Hiking;
import com.dinnertime.peaktime.domain.hiking.service.dto.query.HikingDetailQueryDto;
import com.dinnertime.peaktime.domain.statistic.entity.StatisticContent;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@ToString
@Slf4j
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class HikingDetailResponseDto {
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startTime;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime endTime;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime realEndTime;

    private int blockedSiteCount;

    private int blockedProgramCount;

    private List<StatisticContent> visitedSiteList;

    private List<StatisticContent> visitedProgramList;

    @Builder
    private HikingDetailResponseDto(LocalDateTime startTime, LocalDateTime endTime, LocalDateTime realEndTime, int blockedSiteCount, int blockedProgramCount, List<StatisticContent> visitedSiteList, List<StatisticContent> visitedProgramList) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.realEndTime = realEndTime;
        this.blockedSiteCount = blockedSiteCount;
        this.blockedProgramCount = blockedProgramCount;
        this.visitedSiteList = visitedSiteList;
        this.visitedProgramList = visitedProgramList;
    }

    public static HikingDetailResponseDto createHikingDetailResponseDto(HikingDetailQueryDto hikingDetailQueryDto) {

        return HikingDetailResponseDto.builder()
                .startTime(hikingDetailQueryDto.getStartTime())
                .endTime(hikingDetailQueryDto.getEndTime())
                .realEndTime(hikingDetailQueryDto.getRealEndTime())
                .blockedSiteCount(hikingDetailQueryDto.getBlockedSiteCount())
                .blockedProgramCount(hikingDetailQueryDto.getBlockedProgramCount())
                .visitedSiteList(hikingDetailQueryDto.getVisitedSiteList())
                .visitedProgramList(hikingDetailQueryDto.getVisitedProgramList())
                .build();
    }

    public static HikingDetailResponseDto noHikingDetail(Hiking hiking) {
                return HikingDetailResponseDto.builder()
                .startTime(hiking.getStartTime())
                .endTime(hiking.getEndTime())
                .realEndTime(hiking.getRealEndTime())
                .blockedSiteCount(0)
                .blockedProgramCount(0)
                .visitedSiteList(new ArrayList<>())
                .visitedProgramList(new ArrayList<>())
                .build();
    }

}