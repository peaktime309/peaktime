package com.dinnertime.peaktime.domain.preset.service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SavePresetRequestDto {

    @Size(min = 2, max = 8, message = "제목은 2글자 이상 8글자 이하로 입력해주세요.")
    @NotNull
    private String title;

    private String[] blockWebsiteList;
    private String[] blockProgramList;
}
