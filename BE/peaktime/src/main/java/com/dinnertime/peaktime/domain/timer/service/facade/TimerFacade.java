package com.dinnertime.peaktime.domain.timer.service.facade;

import com.dinnertime.peaktime.domain.group.service.dto.response.GroupDetailResponseDto;
import com.dinnertime.peaktime.domain.schedule.entity.Schedule;
import com.dinnertime.peaktime.domain.schedule.service.ScheduleService;
import com.dinnertime.peaktime.domain.timer.entity.Timer;
import com.dinnertime.peaktime.domain.timer.service.TimerService;
import com.dinnertime.peaktime.domain.timer.service.dto.request.TimerCreateRequestDto;
import com.dinnertime.peaktime.global.util.RedisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TimerFacade {
    private final TimerService timerService;
    private final ScheduleService scheduleService;
    private final RedisService redisService;

    @Transactional
    public GroupDetailResponseDto createTimer(TimerCreateRequestDto requestDto) {
        Long groupId = requestDto.getGroupId();
        LocalDateTime startTime = requestDto.getStartTime();
        int attentionTime = requestDto.getAttentionTime();
        int repeatDay = requestDto.getRepeatDay();
        int plusMinute = (startTime.getHour() * 60) + startTime.getMinute();

        // 타이머와 스케줄 db 저장
        Timer timer = timerService.postTimer(requestDto);
        List<Schedule> scheduleList = scheduleService.createSchedule(requestDto, timer);

        // Redis에 타이머 추가
        redisService.addTimerList(timer, repeatDay, plusMinute, attentionTime);

        //오늘날짜가 있으면 저장
        scheduleService.saveTodayScheduleToRedis(scheduleList, repeatDay, startTime);

        //조회
        return timerService.getTimerByGroupId(groupId);
    }

    @Transactional
    public GroupDetailResponseDto deleteTimer(Long timerId) {

        //타이머 찾기
        Timer timer = timerService.getTimer(timerId);

        //생성의 역순
        //레디스 스케쥴 삭제 -> 오늘 있을 경우
        redisService.deleteScheduleByTimer(timer);

        //레디스 타이머 삭제
        redisService.deleteTimerByTimer(timer);

        //스케쥴 삭제
        scheduleService.deleteSchedule(timerId);

        //타이머 삭제 db삭제
        timerService.deleteTimer(timerId);

        //반환
        return timerService.getTimerByGroupId(timer.getGroup().getGroupId());
    }

}
