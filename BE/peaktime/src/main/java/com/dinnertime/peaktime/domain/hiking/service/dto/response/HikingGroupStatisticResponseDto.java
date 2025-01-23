package com.dinnertime.peaktime.domain.hiking.service.dto.response;

import com.dinnertime.peaktime.domain.group.entity.Group;
import com.dinnertime.peaktime.domain.statistic.entity.Statistic;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class HikingGroupStatisticResponseDto {
    private Long groupId;
    private String groupTitle;
    private List<HikingStatisticWrapperResponseDto> childList;

    @Builder
    private HikingGroupStatisticResponseDto(Long groupId, String groupTitle, List<HikingStatisticWrapperResponseDto> childList) {
        this.groupId = groupId;
        this.groupTitle = groupTitle;
        this.childList = childList;
    }

    public static HikingGroupStatisticResponseDto createGroupResponseDto(Group group, List<HikingStatisticWrapperResponseDto> childList) {
        return HikingGroupStatisticResponseDto
                .builder()
                .groupId(group.getGroupId())
                .groupTitle(group.getTitle())
                .childList(childList)
                .build();
    }

}
