package com.dinnertime.peaktime.domain.summary.service.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

@Getter
@NoArgsConstructor(access= AccessLevel.PROTECTED)
public class SaveSummaryRequestDto {

    @NotNull
    @Size(min = 2, max = 15, message = "제목은 2글자 이상 15글자 이하로 입력해주세요.")
    private String title;

    @NotNull(message = "내용을 입력해주세요.")
    private String content; // 질의한 내용

    private String[] keywords; // 추가 키워드
}
