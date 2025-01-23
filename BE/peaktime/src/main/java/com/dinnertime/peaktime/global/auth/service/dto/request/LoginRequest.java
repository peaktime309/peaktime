package com.dinnertime.peaktime.global.auth.service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class LoginRequest {

    // `/auth/login` API를 호출할 때, Response Body에 빈 값이 오면 MethodArgumentNotValidException가 발생.

    @NotBlank(message = "잘못된 형식의 요청입니다.")
    private String userLoginId;

    @NotBlank(message = "잘못된 형식의 요청입니다.")
    private String password;

}
