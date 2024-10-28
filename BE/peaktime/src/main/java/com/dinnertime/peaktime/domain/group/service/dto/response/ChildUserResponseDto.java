package com.dinnertime.peaktime.domain.group.service.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ChildUserResponseDto {
    private Long userId;
    private String userLoginId;
    private String nickname;

    @Builder
    public ChildUserResponseDto(Long userId, String userLoginId, String nickname) {
        this.userId = userId;
        this.userLoginId = userLoginId;
        this.nickname = nickname;
    }
}
