package com.dinnertime.peaktime.domain.summary.service.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access= AccessLevel.PROTECTED)
public class SaveSummaryRequestDto {

    @NotNull
    private String content; // 질의한 내용

    @NotNull
    private Long memoId;

    @NotNull
    private String[] keywords; // 추가 키워드
}
