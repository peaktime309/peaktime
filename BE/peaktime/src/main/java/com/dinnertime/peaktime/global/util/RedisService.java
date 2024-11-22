package com.dinnertime.peaktime.global.util;

import com.dinnertime.peaktime.domain.schedule.entity.Schedule;
import com.dinnertime.peaktime.domain.schedule.service.dto.RedisSchedule;
import com.dinnertime.peaktime.domain.timer.entity.Timer;
import com.dinnertime.peaktime.domain.timer.service.dto.request.TimerCreateRequestDto;
import com.dinnertime.peaktime.global.exception.CustomException;
import com.dinnertime.peaktime.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.concurrent.TimeUnit;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Slf4j
@Service
@RequiredArgsConstructor
public class RedisService {

    private final RedisTemplate<String, String> stringRedisTemplate;
    private final RedisTemplate<String, RedisSchedule> scheduleRedisTemplate;
    private final RedisTemplate<String, Object> redisTemplate;
    private static final int TTL = 24; // 하루 단위 gpt
    private static final int DAY = 7;
    private static final int DAY_MINUTE = 1440;
    private static final int MAX_ATTENTION_TIME = 240;

    public void saveRefreshToken(long userId, String refreshToken) {
        String key = "refreshToken:" + userId;
        redisTemplate.opsForValue().set(key, refreshToken);
    }

    public String getRefreshToken(long userId) {
        String key = "refreshToken:" + userId;
        return (String) redisTemplate.opsForValue().get(key);
    }

    public void removeRefreshToken(long userId) {
        String key = "refreshToken:" + userId;
        redisTemplate.delete(key);
    }

    public void saveEmailCode(String lowerEmail, String code) {
        // 이미 이메일이 소문자로 변환되었다고 가정
        String key = "emailCode:" + lowerEmail;
        redisTemplate.opsForValue().set(key, code);
        redisTemplate.expire(key, 180, TimeUnit.SECONDS);
    }

    public String getEmailCode(String lowerEmail) {
        // 이미 이메일이 소문자로 변환되었다고 가정
        String key = "emailCode:" + lowerEmail;
        return (String) redisTemplate.opsForValue().get(key);
    }

    public void removeEmailCode(String lowerEmail) {
        // 이미 이메일이 소문자로 변환되었다고 가정
        String key = "emailCode:" + lowerEmail;
        redisTemplate.delete(key);
    }

    public void saveEmailAuthentication(String lowerEmail) {
        // 이미 이메일이 소문자로 변환되었다고 가정
        String key = "emailAuthentication:" + lowerEmail;
        redisTemplate.opsForValue().set(key, "Authenticated");
    }

    public String getEmailAuthentication(String lowerEmail) {
        // 이미 이메일이 소문자로 변환되었다고 가정
        String key = "emailAuthentication:" + lowerEmail;
        return (String) redisTemplate.opsForValue().get(key);
    }

    public void removeEmailAuthentication(String lowerEmail) {
        // 이미 이메일이 소문자로 변환되었다고 가정
        String key = "emailAuthentication:" + lowerEmail;
        redisTemplate.delete(key);
    }

    public Integer getGPTcount(Long userId) {
        String key = "gpt_usage_count:" + userId;
        Integer count = (Integer) redisTemplate.opsForValue().get(key);
        return count;
    }

    public void setGPTIncrement(Long userId) {
        String key = "gpt_usage_count:" + userId;
        // 초기 설정 or 개수 증가
        redisTemplate.opsForValue().increment(key);
        if (getGPTcount(userId) == 1) { // 맨 처음 생성 시 expire 설정
            redisTemplate.expire(key, TTL, TimeUnit.HOURS);
        }
    }

    public boolean checkTimerByGroupId(Long groupId, int start, int end) {
        //키는 timer:그룹아이디
        String key = "timer:"+groupId;

        ZSetOperations<String, String> zSet = stringRedisTemplate.opsForZSet();

        //key에 해당하는 score(start시간) 중 겹치는 것을 확인
        //최대 4시간 집중할 수 있으므로 시작시간 - 240부터 end시간까지 중 시작시간이 것을 확인
        //
        Set<String> checkRange = zSet.rangeByScore(key, start-MAX_ATTENTION_TIME, end);

        // 겹치는지 검사
        //한개라도 겹치면 true
        //겹치면 true
        return checkRange != null && checkRange.stream().anyMatch(range -> {
            String[] parts = range.split("-");
            int existingStart = Integer.parseInt(parts[0]);
            int existingEnd = Integer.parseInt(parts[1]);

            log.info(existingStart + "-" + existingEnd);

            return (start < existingEnd && end > existingStart); // 겹치는지 조건 확인
        });

    }

    public void deleteTimerByTimer(Long groupId, int start, int end) {
        String key = "timer:"+groupId;
        ZSetOperations<String, String> zSet = stringRedisTemplate.opsForZSet();
        log.info("타이머 제거 "+key+" "+start);

        zSet.remove(key, start +"-"+end+"-"+groupId, String.valueOf(start));
    }

    public void deleteTimerByTimer(Timer timer) {
        Long groupId = timer.getGroup().getGroupId();

        String key = "timer:"+groupId;
        ZSetOperations<String, String> zSet = stringRedisTemplate.opsForZSet();
        //레디스에서 타이머 삭제
        int repeatDay = timer.getRepeatDay();
        LocalDateTime startTime = timer.getStartTime();
        int attentionTime = timer.getAttentionTime();
        int plusMinute = (startTime.getHour()*60) + startTime.getMinute();

        IntStream.range(0, DAY)
                //반복 요일 필터링
                .filter(i -> (repeatDay & (1 << i)) != 0)
                .forEach(i -> {
                    int start = DAY_MINUTE * i + plusMinute;
                    int end = start + attentionTime;
                    zSet.remove(key, start +"-"+end+"-"+groupId+"-"+ timer.getTimerId(), String.valueOf(start));
                    log.info("타이머 삭제: {}", key);
                });
    }

    //현재 시간을 가져와서 보내주기
    public List<String> findTimerByStart(int start) {

        // "timer:"로 시작하는 모든 키 가져오기
        ZSetOperations<String, String> zSet = stringRedisTemplate.opsForZSet();
        Set<String> keys = stringRedisTemplate.keys("timer:*");

        // 각 키에서 해당 score에 해당하는 요소만 가져오기
        Set<String> elements = new HashSet<>();
        for (String key : keys) {
            Set<String> matchedElements = zSet.rangeByScore(key, start, start);
            elements.addAll(matchedElements);
        }

        if(elements.isEmpty()) {
            return null;
        }

        return elements.stream().toList();
    }

    public void addSchedule(Schedule schedule) {
        String key = "schedule:" + LocalDate.now();
        log.info("오늘 스케줄 추가: {}", key);

        //레디스에 저장할 객체 생성
        RedisSchedule saveSchedule = RedisSchedule.createRedisSchedule(schedule);

        ListOperations<String, RedisSchedule> listOps = scheduleRedisTemplate.opsForList();
        Long ttl = scheduleRedisTemplate.getExpire(key);

        listOps.rightPush(key, saveSchedule);

        // 만료 시간 설정
        if (ttl == null || ttl <= 0) {
            LocalDateTime midnight = LocalDate.now().plusDays(1).atStartOfDay();
            ttl = Duration.between(LocalDateTime.now(), midnight).getSeconds();
            scheduleRedisTemplate.expire(key, ttl, TimeUnit.SECONDS);
        }
    }

    public void addFirstSchedule(List<RedisSchedule> scheduleList) {
        String key = "schedule:" + LocalDate.now();

        ListOperations<String, RedisSchedule> listOps = scheduleRedisTemplate.opsForList();
        listOps.rightPushAll(key, scheduleList);

        // 자정까지 남은 시간으로 만료 설정
        LocalDateTime midnight = LocalDate.now().plusDays(1).atStartOfDay();
        long ttl = Duration.between(LocalDateTime.now(), midnight).getSeconds();
        scheduleRedisTemplate.expire(key, ttl, TimeUnit.SECONDS);

        log.info("첫 스케줄 추가 완료: {}", key);
    }

    public void addTimerList(Timer timer, int repeatDay, int plusMinute, int attentionTime) {
        Long groupId = timer.getGroup().getGroupId();

        String key = "timer:" + groupId;
        ZSetOperations<String, String> zSet = stringRedisTemplate.opsForZSet();

        IntStream.range(0, DAY)
                //반복 요일 필터링
                .filter(i -> (repeatDay & (1 << i)) != 0)
                .forEach(i -> {
                    int start = DAY_MINUTE * i + plusMinute;
                    int end = start + attentionTime;
                    zSet.add(key, start + "-" + end + "-" + groupId+"-"+timer.getTimerId(), start);
                    log.info("타이머 추가: {}", key);
                });
    }

    public void deleteScheduleByTimer(Timer timer) {
        String key = "schedule:" + LocalDate.now();
        log.info("오늘 스케줄 삭제: {}", key);

        ListOperations<String, RedisSchedule> listOps = scheduleRedisTemplate.opsForList();

        List<RedisSchedule> existingSchedules = listOps.range(key, 0, -1);

        if(existingSchedules==null) return;
        
        // 특정 타이머 ID가 아닌 항목만 필터링
        List<RedisSchedule> filteredSchedules = existingSchedules.stream()
                .filter(redisSchedule -> !Objects.equals(redisSchedule.getTimerId(), timer.getTimerId()))
                .collect(Collectors.toList());
        // 기존 키 삭제
        scheduleRedisTemplate.delete(key);

        // 필터링된 스케줄 다시 저장
        if (!filteredSchedules.isEmpty()) {
            listOps.rightPushAll(key, filteredSchedules);
        }
    }
}