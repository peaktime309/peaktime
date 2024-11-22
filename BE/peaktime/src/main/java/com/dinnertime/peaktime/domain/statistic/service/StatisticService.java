package com.dinnertime.peaktime.domain.statistic.service;

import com.dinnertime.peaktime.domain.content.repository.ContentRepository;
import com.dinnertime.peaktime.domain.hiking.repository.HikingRepository;
import com.dinnertime.peaktime.domain.hiking.service.dto.query.HikingStatisticQueryDto;
import com.dinnertime.peaktime.domain.statistic.entity.Statistic;
import com.dinnertime.peaktime.domain.statistic.entity.StatisticContent;
import com.dinnertime.peaktime.domain.statistic.repository.StatisticRepository;
import com.dinnertime.peaktime.domain.user.entity.User;
import com.dinnertime.peaktime.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StatisticService {

    private final HikingRepository hikingRepository;
    private final ContentRepository contentRepository;
    private final UserRepository userRepository;
    private final StatisticRepository statisticRepository;

    //매일 1시에 실행
    @Scheduled(cron = "0 0 1 * * *", zone = "Asia/Seoul")
//    @Scheduled(cron = "0 0/1 * * * *", zone = "Asia/Seoul")
    public void updateStatistics() {

        List<User> findUserList = userRepository.findAllByIsDeleteIsFalse();

        for (User findUser : findUserList) {
            Long findUserId = findUser.getUserId();

            Optional<Statistic> optionalStatistic = statisticRepository.findByUser_UserId(findUserId);
            if(optionalStatistic.isEmpty()) {
                Statistic statistic = Statistic.createFirstStatistic(findUser);
                statisticRepository.save(statistic);
            }

            HikingStatisticQueryDto hikingStatistic = hikingRepository.getHikingStatistic(findUserId);

            if (hikingStatistic == null) {
                continue;
            }
            //전체 차단 접근 횟수
            Long totalBlockedCount = hikingRepository.getTotalBlockedCount(findUserId);
            //사이트 리스트 조회
            List<StatisticContent> siteList = contentRepository.getTopUsingInfoListByUserId("site", findUserId);
            //프로그램 리스트 조회
            List<StatisticContent> programList = contentRepository.getTopUsingInfoListByUserId("program", findUserId);
            //시작 시간 리스트 조회
            List<LocalDateTime> startDateTimeList = hikingRepository.getStartTimeListByUserId(findUserId);

            List<String> startTimeList = startDateTimeList.stream()
                    .map(localDateTime -> localDateTime.toLocalTime().format(DateTimeFormatter.ofPattern("HH:mm")))
                    .toList();

            if(optionalStatistic.isPresent()) {
                Statistic statistic = optionalStatistic.get();

                statistic.updateStatistic(hikingStatistic, totalBlockedCount, siteList, programList, startTimeList);

                statisticRepository.save(statistic);
            }
        }
    }
}
