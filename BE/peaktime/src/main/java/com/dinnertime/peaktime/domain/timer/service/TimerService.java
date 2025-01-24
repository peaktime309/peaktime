package com.dinnertime.peaktime.domain.timer.service;

import com.dinnertime.peaktime.domain.group.entity.Group;
import com.dinnertime.peaktime.domain.group.repository.GroupRepository;
import com.dinnertime.peaktime.domain.group.service.GroupService;
import com.dinnertime.peaktime.domain.schedule.service.ScheduleService;
import com.dinnertime.peaktime.domain.group.service.dto.response.GroupDetailResponseDto;
import com.dinnertime.peaktime.domain.timer.entity.Timer;
import com.dinnertime.peaktime.domain.timer.repository.TimerRepository;
import com.dinnertime.peaktime.domain.timer.service.dto.request.TimerCreateRequestDto;
import com.dinnertime.peaktime.domain.timer.service.dto.response.TimerItemResponseDto;
import com.dinnertime.peaktime.global.exception.CustomException;
import com.dinnertime.peaktime.global.exception.ErrorCode;
import com.dinnertime.peaktime.global.util.RedisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TimerService {

    private final TimerRepository timerRepository;
    private final GroupRepository groupRepository;

    @Transactional
    public Timer postTimer(TimerCreateRequestDto requestDto) {
        Long groupId = requestDto.getGroupId();
        LocalDateTime startTime = requestDto.getStartTime();
        int attentionTime = requestDto.getAttentionTime();
        int repeatDay = requestDto.getRepeatDay();

        // 그룹 정보 확인
        Group group = groupRepository.findByGroupIdAndIsDeleteFalse(requestDto.getGroupId())
                .orElseThrow(() -> new CustomException(ErrorCode.GROUP_NOT_FOUND));

        // 중복되는 타이머가 있는지 확인
        if (timerRepository.existsOverlappingTimers(groupId, startTime, attentionTime, repeatDay)) {
            throw new CustomException(ErrorCode.TIME_SLOT_OVERLAP);
        }

        // 타이머 생성 및 저장
        Timer timer = Timer.createTimer(group, requestDto);
        timerRepository.save(timer);

        return timer;
    }

    @Transactional
    public void deleteTimer(Long timerId) {
            // is_repeat = false이고 repeat_day가 존재하지 않는 경우
            // 타이머 실행 완료 후 실행
        Timer timer = timerRepository.findByTimerId(timerId)
                .orElseThrow(() -> new CustomException(ErrorCode.TIMER_NOT_FOUND));

        timerRepository.delete(timer);
    }

    @Transactional(readOnly = true)
    public GroupDetailResponseDto getTimerByGroupId(Long groupId) {

        Group group = groupRepository.findByGroupIdAndIsDeleteFalse(groupId).orElseThrow(
                () -> new CustomException(ErrorCode.GROUP_NOT_FOUND)
        );

        // 타이머 리스트 조회
        List<TimerItemResponseDto> timerList = timerRepository.findByGroup_GroupId(groupId)
                .stream()
                .map(TimerItemResponseDto::createTimeItemResponseDto)
                .collect(Collectors.toList());

        return GroupDetailResponseDto.createGroupDetailResponseDto(group, timerList);
    }

    @Transactional(readOnly = true)
    public Timer getTimer(Long timerId) {
        return timerRepository.findByTimerId(timerId).orElseThrow(
                () -> new CustomException(ErrorCode.TIMER_NOT_FOUND)
        );
    }
}
