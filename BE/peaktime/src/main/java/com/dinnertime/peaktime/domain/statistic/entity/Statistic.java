package com.dinnertime.peaktime.domain.statistic.entity;

import com.dinnertime.peaktime.domain.hiking.service.dto.query.HikingStatisticQueryDto;
import com.dinnertime.peaktime.domain.user.entity.User;
import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;

import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "statistics")
@Getter
public class Statistic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "statistic_id")
    private Long statisticId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "total_hiking_time")
    private Integer totalHikingTime;

    @Column(name = "total_hiking_count")
    private Long totalHikingCount;

    @Column(name = "total_success_count")
    private Integer totalSuccessCount;

    @Column(name = "total_block_count")
    private Long totalBlockCount;

    @Type(JsonBinaryType.class)
    @Column(name="start_time_array", columnDefinition = "jsonb")
    private List<String> startTimeArray;

    @Type(JsonBinaryType.class)
    @Column(name = "most_site_array", columnDefinition = "jsonb")
    private List<StatisticContent> mostSiteArray;

    @Type(JsonBinaryType.class)
    @Column(name = "most_program_array",columnDefinition = "jsonb")
    private List<StatisticContent> mostProgramArray;

    @Builder
    private Statistic(User user) {
        this.user = user;
        this.totalHikingTime = 0;
        this.totalHikingCount = 0L;
        this.totalSuccessCount = 0;
        this.totalBlockCount = 0L;
        this.startTimeArray = new ArrayList<>();
        this.mostSiteArray = new ArrayList<>();
        this.mostProgramArray = new ArrayList<>();
    }

    //사용자가 처음 회원가입할 때
    public static Statistic createFirstStatistic(User user) {
        return Statistic.builder()
                .user(user)
                .build();
    }

    //업데이트 용
    public void updateStatistic(HikingStatisticQueryDto hikingStatistic, Long totalBlockedCount, List<StatisticContent> siteList, List<StatisticContent> programList, List<String> startTimeList) {
        this.totalHikingTime = hikingStatistic.getTotalHikingTime();
        this.totalHikingCount = hikingStatistic.getTotalHikingCount();
        this.totalSuccessCount = hikingStatistic.getTotalHikingSuccessCount();
        this.totalBlockCount = totalBlockedCount;
        this.mostSiteArray = siteList;
        this.mostProgramArray = programList;
        this.startTimeArray = startTimeList;
    }

}