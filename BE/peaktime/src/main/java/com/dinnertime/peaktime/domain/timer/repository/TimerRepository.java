package com.dinnertime.peaktime.domain.timer.repository;

import com.dinnertime.peaktime.domain.timer.entity.Timer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TimerRepository extends JpaRepository<Timer, Long>, TimerRepositoryCustom {
    List<Timer> findByGroup_GroupId(Long groupId);
    Optional<Timer> findByTimerId(Long timerId);
}
