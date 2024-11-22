package com.dinnertime.peaktime.domain.schedule.service.dto;

import com.dinnertime.peaktime.domain.group.entity.Group;
import com.dinnertime.peaktime.domain.schedule.entity.Schedule;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalTimeSerializer;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RedisSchedule implements Serializable {

    //6이 월 0이 일
    //요일을 나타내는 컬럼
    private int dayOfWeek;

    //이벤트 발생 시간 -> 시작 시간
    private String startTime;

    private int attentionTime;

    private Long groupId;

    private Long timerId;

    @Builder
    private RedisSchedule(int dayOfWeek, String startTime, int attentionTime, Long groupId, Long timerId) {
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.attentionTime = attentionTime;
        this.groupId = groupId;
        this.timerId = timerId;
    }

    public static RedisSchedule createRedisSchedule(Schedule schedule) {
        return RedisSchedule.builder()
                .dayOfWeek(schedule.getDayOfWeek())
                .startTime(String.valueOf(schedule.getStartTime()))
                .attentionTime(schedule.getAttentionTime())
                .groupId(schedule.getTimer().getGroup().getGroupId())
                .timerId(schedule.getTimer().getTimerId())
                .build();
    }
}
