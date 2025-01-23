package com.dinnertime.peaktime.domain.timer.service.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TimerCreateRequestDto {

    @NotNull
    private Long groupId;

    @NotNull
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startTime;

//    @Min(value = 30, message = "집중시간은 최소 30분이상이어야 합니다.")
    @Max(value = 240, message = "집중시간은 최대 240분이상이어야 합니다.")
    private int attentionTime;

    @Min(value = 1, message = "반복 요일은 최소 한개이상이어야합니다.")
    @Max(127)
    private int repeatDay;
}
