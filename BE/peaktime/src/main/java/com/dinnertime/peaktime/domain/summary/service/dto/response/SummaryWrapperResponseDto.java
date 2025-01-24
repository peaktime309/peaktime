package com.dinnertime.peaktime.domain.summary.service.dto.response;

import com.dinnertime.peaktime.domain.memo.service.dto.response.MemoWrapperResponseDto;
import com.dinnertime.peaktime.domain.summary.entity.Summary;
import lombok.*;

import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
public class SummaryWrapperResponseDto {
    private List<SummaryResponseDto> summaryList;
    private Boolean isLastPage;

    @Builder
    private SummaryWrapperResponseDto(List<SummaryResponseDto> summaryList, Boolean isLastPage) {
        this.summaryList = summaryList;
        this.isLastPage = isLastPage;
    }

    public static SummaryWrapperResponseDto createMemoWrapperResponseDto(List<SummaryResponseDto> summaryList, Boolean isLastPage) {
        return SummaryWrapperResponseDto.builder()
                .summaryList(summaryList)
                .isLastPage(isLastPage)
                .build();
    }
}
