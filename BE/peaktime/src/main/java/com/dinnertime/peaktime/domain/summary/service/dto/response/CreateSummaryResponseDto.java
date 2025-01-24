package com.dinnertime.peaktime.domain.summary.service.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CreateSummaryResponseDto {
    private Integer summaryCount; // 하루 gpt 사용 횟수

    @Builder
    private CreateSummaryResponseDto(Integer summaryCount) {
        this.summaryCount = summaryCount;
    }

    public static CreateSummaryResponseDto createSummaryResponseDto(Integer summaryCount) {
        return CreateSummaryResponseDto.builder()
                .summaryCount(summaryCount)
                .build();
    }
}
