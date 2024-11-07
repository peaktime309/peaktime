package com.dinnertime.peaktime.domain.timer.service.strategy;

import com.dinnertime.peaktime.domain.group.service.dto.response.GroupDetailResponseDto;
import com.dinnertime.peaktime.domain.timer.service.dto.request.TimerCreateRequestDto;

public interface TimerStrategy {
    GroupDetailResponseDto createTimer(TimerCreateRequestDto requestDto);
    GroupDetailResponseDto deleteTimer(Long timerId);
}
