package com.dinnertime.peaktime.domain.hiking.service.dto.response;

import com.dinnertime.peaktime.domain.hiking.service.dto.query.HikingCalendarQueryDto;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class HikingCalendarResponseDto {
    private List<HikingCalendarQueryDto> hikingList;

    @Builder
    private HikingCalendarResponseDto(List<HikingCalendarQueryDto> hikingList) {
        this.hikingList = hikingList;
    }

    public static HikingCalendarResponseDto createHikingCalenderResponseDto(List<HikingCalendarQueryDto> hikingList) {
        return HikingCalendarResponseDto.builder()
                .hikingList(hikingList)
                .build();
    }
}
