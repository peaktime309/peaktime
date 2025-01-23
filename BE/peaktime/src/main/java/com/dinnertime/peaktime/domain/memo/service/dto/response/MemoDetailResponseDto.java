package com.dinnertime.peaktime.domain.memo.service.dto.response;

import com.dinnertime.peaktime.domain.memo.entity.Memo;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MemoDetailResponseDto {

    // 메모 상세 정보 넣기
    private Long memoId;
    private String title;
    private LocalDateTime memoCreateAt;
    private String memoContent;

    @Builder
    private MemoDetailResponseDto(Long memoId, String title, LocalDateTime memoCreateAt, String memoContent, Long summaryId,String summaryContent, LocalDateTime summaryUpdateAt) {
        this.memoId = memoId;
        this.title = title;
        this.memoCreateAt = memoCreateAt;
        this.memoContent = memoContent;
    }

    public static MemoDetailResponseDto createMemoDetailResponse(Memo memo) {
        return MemoDetailResponseDto.builder()
                .memoId(memo.getMemoId())
                .title(memo.getTitle())
                .memoCreateAt(memo.getCreateAt())
                .memoContent(memo.getContent())
                .build();
    }




}
