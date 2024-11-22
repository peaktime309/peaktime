package com.dinnertime.peaktime.domain.hiking.service.dto.response;

import com.dinnertime.peaktime.domain.hiking.service.dto.query.HikingCalendarDetailQueryDto;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class HikingCalendarDetailResponseDto {
    private List<HikingCalendarDetailQueryDto> hikingDetailList;

    @Builder
    private HikingCalendarDetailResponseDto(List<HikingCalendarDetailQueryDto> hikingDetailList) {
        this.hikingDetailList = hikingDetailList;
    }

    public static HikingCalendarDetailResponseDto createHikingCalendarDetailResponseDto(List<HikingCalendarDetailQueryDto> hikingDetailList) {
        return HikingCalendarDetailResponseDto.builder()
                .hikingDetailList(hikingDetailList)
                .build();
    }
}
