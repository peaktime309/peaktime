package com.dinnertime.peaktime.global.auth.service.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class IsDuplicatedResponse {

    private Boolean isDuplicated;

    @Builder
    private IsDuplicatedResponse(Boolean isDuplicated) {
        this.isDuplicated = isDuplicated;
    }

    public static IsDuplicatedResponse createIsDuplicatedResponse(Boolean isDuplicated) {
        return IsDuplicatedResponse.builder()
                .isDuplicated(isDuplicated)
                .build();
    }

}
