package com.dinnertime.peaktime.domain.statistic.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class StatisticContent {
    private String name;
    private Integer usingTime;
}
