package com.dinnertime.peaktime.domain.user.service.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GetProfileResponse {

    private String userLoginId;
    private String nickname;
    private String email;

    @Builder
    private GetProfileResponse(String userLoginId, String nickname, String email) {
        this.userLoginId = userLoginId;
        this.nickname = nickname;
        this.email = email;
    }

    public static GetProfileResponse createGetProfileResponse(String userLoginId, String nickname, String email) {
        return GetProfileResponse.builder()
                .userLoginId(userLoginId)
                .nickname(nickname)
                .email(email)
                .build();
    }

}
