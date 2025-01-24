package com.dinnertime.peaktime.domain.hiking.repository;

import com.dinnertime.peaktime.domain.content.entity.QContent;
import com.dinnertime.peaktime.domain.hiking.entity.QCalendar;
import com.dinnertime.peaktime.domain.hiking.entity.QHiking;
import com.dinnertime.peaktime.domain.hiking.service.dto.query.*;
import com.dinnertime.peaktime.domain.user.entity.User;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class HikingRepositoryImpl implements HikingRepositoryCustom {

    private final QHiking hiking = QHiking.hiking;
    private final QCalendar calendar = QCalendar.calendar;
    private final QContent content = QContent.content;
    private final JPAQueryFactory queryFactory;

    // 날짜만 가져오기
    @Override
    public List<HikingCalendarQueryDto> getCalendar(Long userId) {
        //날짜별로 하이킹 시간 조회
        return queryFactory.select(Projections.fields(
                HikingCalendarQueryDto.class,
                calendar.date.as("date"),
                //없는 경우 0을 출력
                Expressions.numberTemplate(Integer.class,
                    "COALESCE(FLOOR(SUM((EXTRACT(EPOCH FROM {0}) - EXTRACT(EPOCH FROM {1})) / 60)), 0)",
                    hiking.realEndTime, hiking.startTime
                ).as("totalMinute")
                ))
                .from(calendar)
                .leftJoin(hiking)
                .on(
                            calendar.date.eq(Expressions.dateTemplate(Date.class, "DATE_TRUNC('day', {0})", hiking.startTime))
                                .and(hiking.user.userId.eq(userId))
                                .and(hiking.realEndTime.isNotNull())
                                .and(hiking.realEndTime.after(hiking.endTime))
                )
                .groupBy(calendar.date)
                .orderBy(calendar.date.asc())
                .fetch();
    }

    @Override
    public List<HikingCalendarDetailQueryDto> getCalendarByDate(LocalDate date, Long userId) {

        return queryFactory.select(Projections.fields(
                        HikingCalendarDetailQueryDto.class,
                        hiking.hikingId.as("hikingId"),
                        hiking.startTime.as("startTime"),
                        hiking.endTime.as("endTime"),
                        hiking.realEndTime.as("realEndTime")
                ))
                .from(hiking)
                .where(
                        hiking.user.userId.eq(userId)
                                .and(hiking.realEndTime.isNotNull())
                                .and(Expressions.dateTemplate(LocalDate.class, "DATE({0})", hiking.startTime).eq(date))
                )
                .orderBy(hiking.startTime.asc())
                .fetch();
    }

    @Override
    public HikingDetailQueryDto getHikingDetail(Long hikingId) {
        // 주요 Hiking 정보 가져오기

        return queryFactory.select(Projections.fields(
                        HikingDetailQueryDto.class,
                        hiking.startTime.as("startTime"),
                        hiking.endTime.as("endTime"),
                        hiking.realEndTime.as("realEndTime"),
                        // 조건부 합계를 위한 blockedSiteCount
                        new CaseBuilder()
                                .when(content.isBlocked.isTrue().and(content.type.eq("site"))).then(1)
                                .otherwise(0)
                                .sum().as("blockedSiteCount")
                                ,
                        new CaseBuilder()
                                .when(content.isBlocked.isTrue().and(content.type.eq("program"))).then(1)
                                .otherwise(0)
                                .sum().as("blockedProgramCount")
                ))
                .from(hiking)
                .join(content)
                .on(hiking.hikingId.eq(content.hiking.hikingId))
                .where(hiking.hikingId.eq(hikingId))
                .groupBy(hiking.hikingId)
                .fetchOne();
    }


    @Override
    public HikingStatisticQueryDto getHikingStatistic(Long findUserId) {

        //통계 조회
        return queryFactory.select(Projections.fields(
                        HikingStatisticQueryDto.class,
                        Expressions.numberTemplate(Integer.class,
                                "COALESCE(FLOOR(SUM((EXTRACT(EPOCH FROM {0}) - EXTRACT(EPOCH FROM {1})) / 60)), 0)",
                                hiking.realEndTime, hiking.startTime
                        ).as("totalHikingTime"),
                        hiking.hikingId.count().as("totalHikingCount"),
                        new CaseBuilder()
                                .when(hiking.realEndTime.after(hiking.endTime)).then(1)
                                .otherwise(0)
                                .sum().as("totalHikingSuccessCount")
                ))
                .from(hiking)
                .where(hiking.user.userId.eq(findUserId).and(hiking.realEndTime.isNotNull()))
                .groupBy(hiking.user.userId)
                .fetchOne();
    }

    @Override
    public List<LocalDateTime> getStartTimeListByUserId(Long userId) {
        return queryFactory.select(hiking.startTime)
                .from(hiking)
                .where(
                        hiking.user.userId.eq(userId)
                                .and(hiking.realEndTime.isNotNull())
                                .and(hiking.realEndTime.after(hiking.endTime))
                )
                .fetch();
    }

    @Override
    public Long getTotalBlockedCount(Long findUserId) {
        return queryFactory.select(content.count())
                .from(content)
                .where(content.hiking.user.userId.eq(findUserId).and(content.isBlocked.isTrue()))
                .fetchOne();
    }

}
