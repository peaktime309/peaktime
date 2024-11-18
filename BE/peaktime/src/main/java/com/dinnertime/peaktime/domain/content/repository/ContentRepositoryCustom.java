package com.dinnertime.peaktime.domain.content.repository;

import com.dinnertime.peaktime.domain.statistic.entity.StatisticContent;

import java.util.List;

public interface ContentRepositoryCustom {
    List<StatisticContent> getTopUsingInfoList(String type, Long hikingId);

    List<StatisticContent> getTopUsingInfoListByUserId(String type, Long userId);
}
