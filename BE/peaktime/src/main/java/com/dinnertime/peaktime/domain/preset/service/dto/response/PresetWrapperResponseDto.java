package com.dinnertime.peaktime.domain.preset.service.dto.response;

import com.dinnertime.peaktime.domain.preset.entity.Preset;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
public class PresetWrapperResponseDto {

    private List<PresetResponseDto> presetList;

    @Builder
    private PresetWrapperResponseDto(List<PresetResponseDto> presetList){
        this.presetList = presetList;
    }

    public static PresetWrapperResponseDto buildPresetResponseDto(List<Preset> presets) {
        List<PresetResponseDto> responseDto = presets.stream()
                .map(PresetResponseDto::createPresetResponse)
                .toList();

        return PresetWrapperResponseDto.builder()
                .presetList(responseDto)
                .build();
    }

    public static PresetWrapperResponseDto buildPresetResponseDto(Preset preset) {
        List<PresetResponseDto> responseDto = new ArrayList<>();
        PresetResponseDto presetResponse = PresetResponseDto.createPresetResponse(preset);
        responseDto.add(presetResponse);

        return PresetWrapperResponseDto.builder()
                .presetList(responseDto)
                .build();
    }

}
