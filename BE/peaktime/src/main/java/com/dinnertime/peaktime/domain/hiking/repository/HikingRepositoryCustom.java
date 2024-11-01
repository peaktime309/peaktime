package com.dinnertime.peaktime.domain.hiking.repository;

import com.dinnertime.peaktime.domain.hiking.service.dto.query.HikingCalendarQueryDto;

import java.util.List;

public interface HikingRepositoryCustom {
    List<HikingCalendarQueryDto> getCalendar();
}
