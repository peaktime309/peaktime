package com.dinnertime.peaktime.domain.hiking.service.dto.response;

import com.dinnertime.peaktime.domain.statistic.entity.Statistic;
import com.dinnertime.peaktime.domain.statistic.entity.StatisticContent;
import com.dinnertime.peaktime.domain.user.entity.User;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class HikingStatisticWrapperResponseDto {

    private Long userId;

    private String nickname;

    private Integer totalHikingTime;

    private Long totalHikingCount;

    private Integer totalSuccessCount;

    private Long totalBlockedCount;

//    private int preferTimeZone;
    private List<String> startTimeList;

    private List<StatisticContent> mostSiteList;

    private List<StatisticContent> mostProgramList;

    @Builder
    private HikingStatisticWrapperResponseDto(Long userId, String nickname, Integer totalHikingTime, Long totalHikingCount, Integer totalSuccessCount, Long totalBlockedCount, List<String> startTimeList, List<StatisticContent> mostSiteList, List<StatisticContent> mostProgramList) {
        this.userId = userId;
        this.nickname = nickname;
        this.totalHikingTime = totalHikingTime;
        this.totalHikingCount = totalHikingCount;
        this.totalSuccessCount = totalSuccessCount;
        this.totalBlockedCount = totalBlockedCount;
        this.startTimeList = startTimeList;
        this.mostSiteList = mostSiteList;
        this.mostProgramList = mostProgramList;
    }

    public static HikingStatisticWrapperResponseDto createHikingStatisticResponseDto(Statistic statistic) {
        return HikingStatisticWrapperResponseDto.builder()
                .userId(statistic.getUser().getUserId())
                .nickname(statistic.getUser().getNickname())
                .totalHikingTime(statistic.getTotalHikingTime())
                .totalHikingCount(statistic.getTotalHikingCount())
                .totalSuccessCount(statistic.getTotalSuccessCount())
                .totalBlockedCount(statistic.getTotalBlockCount())
                .startTimeList(statistic.getStartTimeArray())
                .mostSiteList(statistic.getMostSiteArray())
                .mostProgramList(statistic.getMostProgramArray())
                .build();
    }

    public static HikingStatisticWrapperResponseDto createNoHiking(User user) {
        return HikingStatisticWrapperResponseDto.builder()
                .userId(user.getUserId())
                .nickname(user.getNickname())
                .totalHikingTime(0)
                .totalHikingCount(0L)
                .totalSuccessCount(0)
                .totalBlockedCount(0L)
                .startTimeList(new ArrayList<>())
                .mostSiteList(new ArrayList<>())
                .mostProgramList(new ArrayList<>())
                .build();
    }
}