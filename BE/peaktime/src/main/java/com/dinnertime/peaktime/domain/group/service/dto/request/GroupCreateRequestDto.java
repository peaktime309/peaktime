package com.dinnertime.peaktime.domain.group.service.dto.request;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GroupCreateRequestDto {
    private String title;
    private Long presetId;
}
