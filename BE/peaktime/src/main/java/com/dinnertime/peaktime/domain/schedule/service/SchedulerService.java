package com.dinnertime.peaktime.domain.schedule.service;

import com.dinnertime.peaktime.domain.hiking.repository.HikingRepository;
import com.dinnertime.peaktime.domain.schedule.entity.Schedule;
import com.dinnertime.peaktime.domain.schedule.service.dto.RedisSchedule;
import com.dinnertime.peaktime.global.util.RedisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class SchedulerService {

    private final ScheduleService scheduleService;
    private final RedisService redisService;
    private final HikingRepository hikingRepository;

    //매일 0시에 실행
    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Seoul")
    public void addScheduling() {
        //오늘 날짜 기준으로 가져오기
        List<RedisSchedule> scheduleList = scheduleService.getNowDaySchedule();

        log.info(scheduleList.get(0).toString());

        //저장
        redisService.addFirstSchedule(scheduleList);
    }

    //1분마다 실행
    @Scheduled(cron = "0 0/1 * * * *")
    public void send() {
        LocalDateTime now = LocalDateTime.now();
        int day = 7 - now.getDayOfWeek().getValue();
        int hour = now.getHour();
        int minute = now.getMinute();

        int start = day * 1440 + hour * 60 + minute;

        List<String> timerList = redisService.findTimerByStart(start);

        if(timerList == null || timerList.isEmpty()) {
            return;
        }

        log.info("exist timer: "+ now);

        timerList.forEach(timer -> {
            String[] split = timer.split("-");
            // 집중 시간 계산
            int attentionTime = Integer.parseInt(split[1]) - Integer.parseInt(split[0]);
            Long groupId = Long.parseLong(split[2]);
            // `send` 메서드로 groupId와 attentionTime 전송
            scheduleService.send(groupId, attentionTime);
        });

    }
}