package com.dinnertime.peaktime.domain.hiking.service.dto.query;

import lombok.Getter;
import lombok.ToString;

import java.sql.Date;
import java.time.LocalDate;

@Getter
@ToString
public class HikingCalendarQueryDto {
    private LocalDate date;
    private Integer totalMinute;
}
