package com.dinnertime.peaktime.domain.timer.repository;

import com.dinnertime.peaktime.domain.timer.entity.QTimer;
import com.dinnertime.peaktime.domain.timer.entity.Timer;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class TimerRepositoryImpl implements TimerRepositoryCustom {

    private final EntityManager entityManager;
    private final QTimer timer = QTimer.timer;
    private final JPAQueryFactory queryFactory;

    @Override
    public Boolean existsOverlappingTimers (Long groupId, LocalDateTime startTime, int attentionTime, int repeatDay) {
        LocalDateTime requestEndTime = startTime.plusMinutes(attentionTime);
        LocalTime localEndTime = LocalTime.of(requestEndTime.getHour(), requestEndTime.getMinute());
        LocalTime localStartTime = LocalTime.of(startTime.getHour(), startTime.getMinute());

        int repeatDayNumber = (repeatDay == 0) ? (int) Math.pow(2, 7 - startTime.getDayOfWeek().getValue()) : repeatDay;

        String query = "SELECT COUNT(*) FROM timers t " +
                "WHERE t.group_id = :groupId " +
                "AND t.start_time::time <= :localEndTime " +
                "AND (t.start_time::time + INTERVAL '1 minute' * t.attention_time) >= :localStartTime " +
                "AND ( " +
                "      ((t.repeat_day & :repeatDayNumber) != 0) " + // 요일이 설정된 경우
                "      OR " +
                "      (t.repeat_day = 0 AND (1 << (CASE WHEN EXTRACT(DOW FROM t.start_time) = 0 THEN 0 ELSE 7 - CAST(EXTRACT(DOW FROM t.start_time) AS INTEGER) END)) & :repeatDayNumber != 0) " +
                "    )";

        Long count = (Long) entityManager.createNativeQuery(query)
                .setParameter("groupId", groupId)
                .setParameter("localEndTime", localEndTime)
                .setParameter("localStartTime", localStartTime)
                .setParameter("repeatDayNumber", repeatDayNumber)
                .getSingleResult();

        return count > 0; // 중복된 시간대의 타이머가 존재하면 true 반환
    }

    @Override
    public List<Timer> findByGroup_GroupId(Long groupId) {
        return queryFactory.selectFrom(timer)
                .where(timer.group.groupId.eq(groupId))
                .orderBy(
                        Expressions.stringTemplate("TO_CHAR({0}, 'HH24:MI:SS')", timer.startTime).asc(),
//                        Expressions.dateTemplate(LocalTime.class, "DATE_FORMAT({0}, '%h-%m-%s')",timer.startTime).asc()
                        timer.repeatDay.desc()
                )
                .fetch();
    }
}
