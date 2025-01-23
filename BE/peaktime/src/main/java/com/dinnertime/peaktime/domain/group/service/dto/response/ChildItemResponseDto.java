package com.dinnertime.peaktime.domain.group.service.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChildItemResponseDto {
    private Long userId;
    private String userLoginId;
    private String nickname;

    @Builder
    private ChildItemResponseDto(Long userId, String userLoginId, String nickname) {
        this.userId = userId;
        this.userLoginId = userLoginId;
        this.nickname = nickname;
    }

    public static ChildItemResponseDto createChildItemResponseDto(Long userId, String userLoginId, String nickname) {
        return ChildItemResponseDto.builder()
                .userId(userId)
                .userLoginId(userLoginId)
                .nickname(nickname)
                .build();
    }
}
