package com.dinnertime.peaktime.domain.child.service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.validator.constraints.Length;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
public class CreateChildRequestDto {

    @NotNull
    private Long groupId;

    @NotBlank
    @Length(min = 5, max = 15, message = "5자 이상 15자 이하의 아이디를 입력해주세요.")
    private String childLoginId;

    @NotBlank
    @Length(min = 2, max = 15, message = "2자 이상 15자 이하의 닉네임을 입력주세요.")
    private String childNickname;
}
