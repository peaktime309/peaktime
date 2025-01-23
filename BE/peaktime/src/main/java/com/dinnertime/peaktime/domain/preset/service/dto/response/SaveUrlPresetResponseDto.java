package com.dinnertime.peaktime.domain.preset.service.dto.response;

import com.dinnertime.peaktime.domain.preset.entity.Preset;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SaveUrlPresetResponseDto {
    private Long presetId;
    private List<String> blockWebsiteArray;

    @Builder
    private SaveUrlPresetResponseDto(Long presetId, List<String> blockWebsiteArray) {
        this.presetId = presetId;
        this.blockWebsiteArray = blockWebsiteArray;
    }

    public static SaveUrlPresetResponseDto createSaveUrlPresetResponseDto(Preset preset) {
        return SaveUrlPresetResponseDto.builder()
                .presetId(preset.getPresetId())
                .blockWebsiteArray(
                        preset.getBlockWebsiteArray()
                                .stream()
                                .sorted()
                                .toList()
                )
                .build();
    }
}
