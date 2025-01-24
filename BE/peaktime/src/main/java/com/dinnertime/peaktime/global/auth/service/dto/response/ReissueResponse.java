package com.dinnertime.peaktime.global.auth.service.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ReissueResponse {

    private String accessToken;

    @Builder
    private ReissueResponse(String accessToken) {
        this.accessToken = accessToken;
    }

    public static ReissueResponse createReissueResponse(String accessToken) {
        return ReissueResponse.builder()
                .accessToken(accessToken)
                .build();
    }

}
