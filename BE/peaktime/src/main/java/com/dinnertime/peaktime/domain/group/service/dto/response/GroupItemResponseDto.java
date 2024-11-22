package com.dinnertime.peaktime.domain.group.service.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GroupItemResponseDto {

    private Long groupId;
    private String groupTitle;
    private List<ChildItemResponseDto> childList;

    @Builder
    private GroupItemResponseDto(Long groupId, String groupTitle, List<ChildItemResponseDto> childList) {
        this.groupId = groupId;
        this.groupTitle = groupTitle;
        this.childList = childList;
    }

    public static GroupItemResponseDto createGroupItemResponseDto(Long groupId, String groupTitle, List<ChildItemResponseDto> childList) {
        return GroupItemResponseDto.builder()
                .groupId(groupId)
                .groupTitle(groupTitle)
                .childList(childList)
                .build();
    }
}
