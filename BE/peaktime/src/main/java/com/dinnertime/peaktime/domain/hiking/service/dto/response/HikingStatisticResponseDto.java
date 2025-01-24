package com.dinnertime.peaktime.domain.hiking.service.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class HikingStatisticResponseDto {
    private HikingStatisticWrapperResponseDto root;
    private List<HikingGroupStatisticResponseDto> groupList;

    @Builder
    private HikingStatisticResponseDto(HikingStatisticWrapperResponseDto root, List<HikingGroupStatisticResponseDto> groupList) {
        this.root = root;
        this.groupList = groupList;
    }

    //루트 계정일 경우
    public static HikingStatisticResponseDto createRootHikingStatisticResponseDto(HikingStatisticWrapperResponseDto root, List<HikingGroupStatisticResponseDto> groupList) {
        return HikingStatisticResponseDto.builder()
                .root(root)
                .groupList(groupList)
                .build();
    }

    //자식 계정일 경우
    public static HikingStatisticResponseDto createChildHikingStatisticResponseDto(HikingStatisticWrapperResponseDto root) {
        return HikingStatisticResponseDto.builder()
                .root(root)
                .groupList(new ArrayList<>())
                .build();
    }
}
