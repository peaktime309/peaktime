package com.dinnertime.peaktime.domain.timer.repository;

import com.dinnertime.peaktime.domain.timer.entity.Timer;

import java.time.LocalDateTime;
import java.util.List;

public interface TimerRepositoryCustom {
    Boolean existsOverlappingTimers(Long groupId, LocalDateTime startTime, int attentionTime, int repeatDay);

    List<Timer> findByGroup_GroupId(Long groupId);
}
