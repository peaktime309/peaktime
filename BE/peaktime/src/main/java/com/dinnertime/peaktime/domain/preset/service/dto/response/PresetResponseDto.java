package com.dinnertime.peaktime.domain.preset.service.dto.response;


import com.dinnertime.peaktime.domain.preset.entity.Preset;
import lombok.*;

import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PresetResponseDto {
    private Long presetId;
    private String title;
    private List<String> blockWebsiteArray;
    private List<String> blockProgramArray;

    @Builder
    private PresetResponseDto(Long presetId, String title, List<String> blockWebsiteArray, List<String> blockProgramArray) {
        this.presetId = presetId;
        this.title = title;
        this.blockWebsiteArray = blockWebsiteArray;
        this.blockProgramArray = blockProgramArray;
    }

    public static PresetResponseDto createPresetResponse(Preset preset) {
        return PresetResponseDto.builder()
                .presetId(preset.getPresetId())
                .title(preset.getTitle())
                .blockWebsiteArray(
                        preset.getBlockWebsiteArray()
                                .stream()
                                .sorted()
                                .toList()
                )
                .blockProgramArray(
                        preset.getBlockProgramArray()
                                .stream()
                                .sorted()
                                .toList()
                )
                .build();
    }


}
