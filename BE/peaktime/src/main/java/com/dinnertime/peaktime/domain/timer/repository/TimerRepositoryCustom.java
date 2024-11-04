package com.dinnertime.peaktime.domain.timer.repository;

import java.time.LocalDateTime;

public interface TimerRepositoryCustom {
    Boolean existsOverlappingTimers(Long groupId, LocalDateTime startTime, int attentionTime, int repeatDay);
}
