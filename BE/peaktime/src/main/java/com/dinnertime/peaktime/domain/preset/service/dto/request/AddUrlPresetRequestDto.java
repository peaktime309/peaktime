package com.dinnertime.peaktime.domain.preset.service.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AddUrlPresetRequestDto {

    // url이 다소 길어질 수 있어서 requestBody로 처리
    @NotNull
    private String url;

    // presetId는 pathVariable로 받아와서 활용
}
