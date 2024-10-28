package com.dinnertime.peaktime.domain.group.service.dto.response;

import com.dinnertime.peaktime.domain.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SubUserResponseDto {
    private Long userId;
    private String userLoginId;
//    private String nickname;

}
