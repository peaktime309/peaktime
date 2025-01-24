package com.dinnertime.peaktime.domain.summary.service.dto.response;

import com.dinnertime.peaktime.domain.summary.entity.Summary;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SummaryResponseDto {
    // 요약 리스트 responseDto 작성
    private Long summaryId;
    private String title;
    private LocalDateTime createdAt;

    @Builder
    private SummaryResponseDto(Long summaryId, String title, LocalDateTime createdAt) {
        this.summaryId = summaryId;
        this.title = title;
        this.createdAt = createdAt;
    }

    // 메모리스트 (내용 제외) responseDto 작성
    public static SummaryResponseDto createSummaryResponseDto(Summary summary) {
        return SummaryResponseDto.builder()
                .summaryId(summary.getSummaryId())
                .title(summary.getTitle())
                .createdAt(summary.getCreatedAt())
                .build();
    }
}
