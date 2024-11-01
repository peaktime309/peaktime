package com.dinnertime.peaktime.domain.timer.service.dto.request;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TimerCreateRequestDto {
    private Long groupId;
    private LocalDateTime startTime;
    private int attentionTime;
    private Boolean isRepeat;
    private int[] repeatDay;
}
