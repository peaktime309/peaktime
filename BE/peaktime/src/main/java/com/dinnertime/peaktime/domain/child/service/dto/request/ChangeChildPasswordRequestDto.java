package com.dinnertime.peaktime.domain.child.service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChangeChildPasswordRequestDto {

    @NotBlank
    @Length(min = 8, message = "최소 8자 이상의 패스워드를 입력해주세요.")
    private String childPassword;

    @NotBlank
    @Length(min = 8, message = "최소 8자 이상의 패스워드를 입력해주세요.")
    private String childConfirmPassword;
}
