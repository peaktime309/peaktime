package com.dinnertime.peaktime.domain.timer.service.dto.response;

import com.dinnertime.peaktime.domain.timer.entity.Timer;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TimerItemResponseDto {

    private Long timerId;
    private LocalDateTime startTime;
    private int attentionTime;
    private int repeatDay;

    @Builder
    private TimerItemResponseDto(Long timerId, LocalDateTime startTime, int attentionTime, int repeatDay) {
        this.timerId = timerId;
        this.startTime = startTime;
        this.attentionTime = attentionTime;
        this.repeatDay = repeatDay;
    }

    public static TimerItemResponseDto createTimeItemResponseDto(Timer timer) {
        return TimerItemResponseDto.builder()
                .timerId(timer.getTimerId())
                .startTime(timer.getStartTime())
                .attentionTime(timer.getAttentionTime())
                .repeatDay(timer.getRepeatDay())
                .build();
    }
}
