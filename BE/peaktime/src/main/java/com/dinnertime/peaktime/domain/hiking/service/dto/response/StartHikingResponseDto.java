package com.dinnertime.peaktime.domain.hiking.service.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class StartHikingResponseDto {
    private Long hikingId;

    @Builder
    private StartHikingResponseDto(Long hikingId) {
        this.hikingId = hikingId;
    }

    public static StartHikingResponseDto createStartHikingResponseDto(Long hikingId) {
        return builder()
                .hikingId(hikingId)
                .build();
    }
}
