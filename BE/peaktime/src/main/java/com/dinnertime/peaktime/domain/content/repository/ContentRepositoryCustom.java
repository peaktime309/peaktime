package com.dinnertime.peaktime.domain.content.repository;

import com.dinnertime.peaktime.domain.hiking.service.dto.query.UsingInfo;

import java.util.List;

public interface ContentRepositoryCustom {
    List<UsingInfo> getTopUsingInfoList(String type, Long hikingId);

    List<UsingInfo> getTopUsingInfoListByUserId(String type, Long userId);
}
