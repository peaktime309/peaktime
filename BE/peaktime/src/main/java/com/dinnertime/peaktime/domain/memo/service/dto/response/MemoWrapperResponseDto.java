package com.dinnertime.peaktime.domain.memo.service.dto.response;

import com.dinnertime.peaktime.domain.memo.entity.Memo;
import lombok.*;

import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
public class MemoWrapperResponseDto {
    private List<MemoResponseDto> memoList;
    private Integer summaryCount; // 하루 gpt 사용 횟수
    private Boolean isLastPage;

    @Builder
    private MemoWrapperResponseDto(List<MemoResponseDto> memoList, Integer summaryCount, Boolean isLastPage) {
        this.memoList = memoList;
        this.summaryCount = summaryCount;
        this.isLastPage = isLastPage;
    }

    public static MemoWrapperResponseDto createMemoWrapperResponseDto(List<Memo> memos, Integer count, Boolean isLastPage) {
        List<MemoResponseDto> responseDto = memos.stream()
                .map(MemoResponseDto::createMemoResponseDto)
                .toList();

        return MemoWrapperResponseDto.builder()
                .memoList(responseDto)
                .summaryCount(count)
                .isLastPage(isLastPage)
                .build();
    }

}
