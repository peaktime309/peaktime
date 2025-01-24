package com.dinnertime.peaktime.domain.hiking.service;

import com.dinnertime.peaktime.domain.content.entity.Content;
import com.dinnertime.peaktime.domain.content.repository.ContentRepository;
import com.dinnertime.peaktime.domain.group.entity.Group;
import com.dinnertime.peaktime.domain.group.repository.GroupRepository;
import com.dinnertime.peaktime.domain.hiking.entity.Hiking;
import com.dinnertime.peaktime.domain.hiking.repository.HikingRepository;
import com.dinnertime.peaktime.domain.hiking.service.dto.query.HikingCalendarDetailQueryDto;
import com.dinnertime.peaktime.domain.hiking.service.dto.query.HikingCalendarQueryDto;
import com.dinnertime.peaktime.domain.hiking.service.dto.query.HikingDetailQueryDto;
import com.dinnertime.peaktime.domain.hiking.service.dto.request.EndHikingRequestDto;
import com.dinnertime.peaktime.domain.hiking.service.dto.request.StartHikingRequestDto;
import com.dinnertime.peaktime.domain.hiking.service.dto.response.*;
import com.dinnertime.peaktime.domain.statistic.entity.Statistic;
import com.dinnertime.peaktime.domain.statistic.entity.StatisticContent;
import com.dinnertime.peaktime.domain.statistic.repository.StatisticRepository;
import com.dinnertime.peaktime.domain.user.entity.User;
import com.dinnertime.peaktime.domain.user.repository.UserRepository;
import com.dinnertime.peaktime.domain.usergroup.entity.UserGroup;
import com.dinnertime.peaktime.domain.usergroup.repository.UserGroupRepository;
import com.dinnertime.peaktime.global.exception.CustomException;
import com.dinnertime.peaktime.global.exception.ErrorCode;
import com.dinnertime.peaktime.global.util.RedisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class HikingService {
    private final HikingRepository hikingRepository;
    private final UserRepository userRepository;
    private final ContentRepository contentRepository;
    private final UserGroupRepository userGroupRepository;
    private final RedisService redisService;
    private final StatisticRepository statisticRepository;
    private final GroupRepository groupRepository;

    private static final int DAY = 7;
    private static final int DAY_MINUTE = 1440;

    @Transactional
    public StartHikingResponseDto startHiking(Long userId, StartHikingRequestDto requestDto) {
        //유저 없으면 에러
        User user = userRepository.findByUserIdAndIsDeleteFalse(userId).orElseThrow(
                () -> new CustomException(ErrorCode.USER_NOT_FOUND)
        );
        LocalDateTime startTime = requestDto.getStartTime();
        
        //자식계정이고 스스로 했을 경우
        if(!user.getIsRoot() && requestDto.getIsSelf()) {
            UserGroup userGroup = userGroupRepository.findByUser_UserId(userId).orElseThrow(
                    () -> new CustomException(ErrorCode.GROUP_NOT_FOUND)
            );
            //검증
            //월요일이 1 일요일이 7 -> 일요일이 0, 월이 6으로 변경
            int day = DAY - startTime.getDayOfWeek().getValue();
            //분 구함
            int minute = (startTime.getHour() * 60) + startTime.getMinute();
            //레디스 저장된 시간으로 구하기
            int start = minute + (day * DAY_MINUTE);
            //child계정이 속한 그룹의 타이머에 속하는지 확인
            boolean checkDuplicated = redisService.checkTimerByGroupId(userGroup.getGroup().getGroupId(), start, start + requestDto.getAttentionTime());
            if (checkDuplicated) {
                throw new CustomException(ErrorCode.TIME_SLOT_OVERLAP);
            }
        }
        
        //시작시간에 집중 시간을 더하여 endTime을 구함
        LocalDateTime endTime = startTime.plusMinutes(requestDto.getAttentionTime());

        Hiking hiking = Hiking.createHiking(user, requestDto, endTime);
        hikingRepository.save(hiking);

        return StartHikingResponseDto.createStartHikingResponseDto(hiking.getHikingId());
    }

    @Transactional
    public void endHiking(EndHikingRequestDto requestDto, Long hikingId) {

        //하이킹 조회
        Hiking hiking = hikingRepository.findByHikingId(hikingId).orElseThrow(
                () -> new CustomException(ErrorCode.HIKING_NOT_FOUND)
        );

        //본인이 하이킹 하지 않고 실제 종료 시간이 종료 시간보다 작으면 에러
        if(!hiking.getIsSelf() && hiking.getEndTime().isAfter(requestDto.getRealEndTime())) {
            throw new CustomException(ErrorCode.CHILD_ACCOUNT_HIKING_NOT_TERMINABLE);
        }

        //하이킹 실제 종료 시간 업데이트
        hiking.updateRealEndTime(requestDto.getRealEndTime());
        hikingRepository.save(hiking);

        //없으면 조기 종료
        if(requestDto.getContentList()==null) return;

        //접속 기록 저장
        List<Content> contentList = requestDto.getContentList()
                .stream()
                .map(contentListRequestDto -> Content.createContent(hiking, contentListRequestDto))
                .toList();
        contentRepository.saveAll(contentList);
    }

    @Transactional(readOnly = true)
    public HikingCalendarResponseDto getCalendar(Long userId) {

        //날짜별로 누적 시간 합치기
        List<HikingCalendarQueryDto> calendarList = hikingRepository.getCalendar(userId);

        HikingCalendarResponseDto responseDto = HikingCalendarResponseDto.createHikingCalenderResponseDto(calendarList);

        log.info(calendarList.toString());

        return responseDto;
    }

    @Transactional(readOnly = true)
    public HikingCalendarDetailResponseDto getCalendarByDate(Long userId, LocalDate date) {

        List<HikingCalendarDetailQueryDto> calendarByDateList = hikingRepository.getCalendarByDate(date, userId);

        log.info(calendarByDateList.toString());

        return HikingCalendarDetailResponseDto.createHikingCalendarDetailResponseDto(calendarByDateList);
    }

    @Transactional(readOnly = true)
    public HikingDetailResponseDto getHikingDetail(Long hikingId) {

        //디테일 조회
        HikingDetailQueryDto hikingDetail = hikingRepository.getHikingDetail(hikingId);

        Hiking hiking = hikingRepository.findByHikingId(hikingId).orElseThrow(
                () -> new CustomException(ErrorCode.HIKING_NOT_FOUND)
        );
        //없으면 null 반환
        if(hikingDetail==null) return HikingDetailResponseDto.noHikingDetail(hiking);

        List<StatisticContent> visitedSiteList = contentRepository.getTopUsingInfoList("site", hikingId);
        List<StatisticContent> visitedProgramList = contentRepository.getTopUsingInfoList("program", hikingId);

        hikingDetail.setVisitedSiteList(visitedSiteList);
        hikingDetail.setVisitedProgramList(visitedProgramList);


        return HikingDetailResponseDto.createHikingDetailResponseDto(hikingDetail);

    }

    @Transactional(readOnly = true)
    public HikingStatisticResponseDto getHikingStatistic(Long userId) {

        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 자식 계정일 경우
        if (!user.getIsRoot()) {
            return createChildStatisticResponse(user);
        }

        // 루트 계정일 경우
        return createRootStatisticResponse(user);
    }

    //자식계정 생성
    private HikingStatisticResponseDto createChildStatisticResponse(User user) {
        Optional<Statistic> statistic = statisticRepository.findByUser_UserId(user.getUserId());
        HikingStatisticWrapperResponseDto root = statistic
                .map(HikingStatisticWrapperResponseDto::createHikingStatisticResponseDto)
                .orElseGet(() -> HikingStatisticWrapperResponseDto.createNoHiking(user));
        return HikingStatisticResponseDto.createChildHikingStatisticResponseDto(root);
    }

    //루트계정 생성
    private HikingStatisticResponseDto createRootStatisticResponse(User user) {
        Optional<Statistic> rootStatistic = statisticRepository.findByUser_UserId(user.getUserId());
        HikingStatisticWrapperResponseDto root = rootStatistic
                .map(HikingStatisticWrapperResponseDto::createHikingStatisticResponseDto)
                .orElseGet(() -> HikingStatisticWrapperResponseDto.createNoHiking(user));

        List<HikingGroupStatisticResponseDto> responseDtoList = groupRepository.findByUser_UserIdAndIsDeleteFalse(user.getUserId())
                .stream()
                .map(group -> {
                    List<User> userList = groupRepository.findUserListByGroupId(group.getGroupId());
                    List<Statistic> statisticList = statisticRepository.findAllByUserIn(userList);
                    List<HikingStatisticWrapperResponseDto> wrapperList = statisticList.stream()
                            .map(HikingStatisticWrapperResponseDto::createHikingStatisticResponseDto)
                            .toList();
                    return HikingGroupStatisticResponseDto.createGroupResponseDto(group, wrapperList);
                })
                .toList();

        return HikingStatisticResponseDto.createRootHikingStatisticResponseDto(root, responseDtoList);
    }

}