package com.dinnertime.peaktime.domain.hiking.service.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ContentListRequestDto {

    @NotNull
    private String contentName;

    @NotNull
    @Pattern(regexp = "program|site", message = "컨텐츠 타입은 'program' 또는 'site' 여야 합니다.")
    private String contentType;

    @NotNull
    private Integer usingTime;

    @NotNull
    private Boolean isBlockContent;
}
