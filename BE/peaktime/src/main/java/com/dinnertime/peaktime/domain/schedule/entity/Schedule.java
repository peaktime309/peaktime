package com.dinnertime.peaktime.domain.schedule.entity;

import com.dinnertime.peaktime.domain.group.entity.Group;
import com.dinnertime.peaktime.domain.timer.entity.Timer;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "schedules")
public class Schedule {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "schedule_id")
    private Long scheduleId;

    //6이 월 0이 일
    //요일을 나타내는 컬럼
    @Column(name = "day_of_week", nullable = false)
    private int dayOfWeek;

    //이벤트 발생 시간 -> 시작 시간
    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "attention_time", nullable = false)
    private int attentionTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "timer_id", nullable = false)
    private Timer timer;

    @Builder
    private Schedule(int dayOfWeek, LocalTime startTime, int attentionTime, Timer timer) {
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.attentionTime = attentionTime;
        this.timer = timer;
    }


    public static Schedule createSchedule(int dayOfWeek, LocalTime startTime, int attentionTime, Timer timer) {
        return Schedule.builder()
                .dayOfWeek(dayOfWeek)
                .startTime(startTime)
                .attentionTime(attentionTime)
                .timer(timer)
                .build();
    }
}
