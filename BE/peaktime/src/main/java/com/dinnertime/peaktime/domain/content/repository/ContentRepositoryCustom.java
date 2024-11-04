package com.dinnertime.peaktime.domain.content.repository;

import com.dinnertime.peaktime.domain.hiking.service.dto.query.BlockInfo;

import java.util.List;

public interface ContentRepositoryCustom {
    List<BlockInfo> getTopBlockInfoList(String type, Long hikingId);
}
