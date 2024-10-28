package com.dinnertime.peaktime.domain.preset.service.dto.request;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SavePresetRequestDto {
    private String title;
    private String[] blockSiteList;
    private String[] blockProgramList;
}
