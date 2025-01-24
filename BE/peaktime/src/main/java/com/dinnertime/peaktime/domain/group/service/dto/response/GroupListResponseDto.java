package com.dinnertime.peaktime.domain.group.service.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GroupListResponseDto {

    private List<GroupItemResponseDto> groupList;

    @Builder
    private GroupListResponseDto(List<GroupItemResponseDto> groupList) {
        this.groupList = groupList;
    }

    public static GroupListResponseDto createGroupListResponseDto(List<GroupItemResponseDto> groupList) {
        return GroupListResponseDto.builder()
                .groupList(groupList)
                .build();
    }
}
