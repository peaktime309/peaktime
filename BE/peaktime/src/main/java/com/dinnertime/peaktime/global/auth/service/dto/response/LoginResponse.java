package com.dinnertime.peaktime.global.auth.service.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class LoginResponse {

    private String accessToken;
    private Boolean isRoot;
    private Long groupId;
    private String nickname;

    @Builder
    private LoginResponse(String accessToken, Boolean isRoot, Long groupId, String nickname) {
        this.accessToken = accessToken;
        this.isRoot = isRoot;
        this.groupId = groupId;
        this.nickname = nickname;
    }

    public static LoginResponse createLoginResponse(String accessToken, Boolean isRoot, Long groupId, String nickname) {
        return LoginResponse.builder()
                .accessToken(accessToken)
                .isRoot(isRoot)
                .groupId(groupId)
                .nickname(nickname)
                .build();
    }

}
