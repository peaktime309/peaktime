package com.dinnertime.peaktime.domain.memo.service.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SaveMemoRequestDto {

    @Size(min = 2, max = 15, message = "제목은 2글자 이상 15글자 이하로 입력해주세요.")
    @NotNull
    private String title;

    @NotNull
    private String content;


}
