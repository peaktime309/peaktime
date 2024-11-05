package com.dinnertime.peaktime.domain.summary.service.dto.request;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access= AccessLevel.PROTECTED)
public class SaveSummaryRequestDto {

    private String content; // 질의한 내용
    private Long memoId;
    private String[] keywords; // 추가 키워드
}
