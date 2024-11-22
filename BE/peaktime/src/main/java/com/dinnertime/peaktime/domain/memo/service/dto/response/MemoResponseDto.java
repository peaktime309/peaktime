package com.dinnertime.peaktime.domain.memo.service.dto.response;

import com.dinnertime.peaktime.domain.memo.entity.Memo;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MemoResponseDto {

    // 메모 리스트 responseDto 작성
    private Long memoId;
    private String title;
    private LocalDateTime createdAt;

    @Builder
    private MemoResponseDto(Long memoId, String title, LocalDateTime createdAt) {
        this.memoId = memoId;
        this.title = title;
        this.createdAt = createdAt;
    }

    // 메모리스트 (내용 제외) responseDto 작성
    public static MemoResponseDto createMemoResponseDto(Memo memo) {
        return MemoResponseDto.builder()
                .memoId(memo.getMemoId())
                .title(memo.getTitle())
                .createdAt(memo.getCreateAt())
                .build();
    }


}
