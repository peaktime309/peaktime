package com.dinnertime.peaktime.domain.summary.service.dto.response;

import com.dinnertime.peaktime.domain.summary.entity.Summary;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SummaryDetailResponseDto {

    private Long summaryId;
    private String title;
    private String content;
    private LocalDateTime createdAt;

    // 요약 정보가 담긴 responseDto 작성
    @Builder
    private SummaryDetailResponseDto(Long summaryId, String content, LocalDateTime createdAt, String title) {
        this.summaryId = summaryId;
        this.content = content;
        this.createdAt = createdAt;
        this.title = title;
    }

    public static SummaryDetailResponseDto createSummaryDetailResponse(Summary summary) {
        return SummaryDetailResponseDto.builder()
                .summaryId(summary.getSummaryId())
                .content(summary.getContent())
                .createdAt(summary.getCreatedAt())
                .title(summary.getTitle())
                .build();
    }

}
