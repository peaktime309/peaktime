package com.dinnertime.peaktime.domain.user.service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UpdateNicknameRequest {

    @NotBlank(message = "잘못된 형식의 요청입니다.")
    private String nickname;

}
