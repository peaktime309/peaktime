package com.dinnertime.peaktime.domain.schedule.service.dto.response;

import com.dinnertime.peaktime.domain.preset.entity.Preset;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SendTimerResponseDto {

    private Integer attentionTime;

    private Long presetId;

    private List<String> blockWebsiteArray;

    private List<String> blockProgramArray;


    @Builder
    private SendTimerResponseDto(Integer attentionTime, Long presetId, List<String> blockWebsiteArray, List<String> blockProgramArray) {
        this.attentionTime = attentionTime;
        this.presetId = presetId;
        this.blockWebsiteArray = blockWebsiteArray;
        this.blockProgramArray = blockProgramArray;
    }

    public static SendTimerResponseDto createSendTimerResponseDto(Integer attentionTime, Preset preset) {
        return SendTimerResponseDto.builder()
                .attentionTime(attentionTime)
                .presetId(preset.getPresetId())
                .blockWebsiteArray(preset.getBlockWebsiteArray())
                .blockProgramArray(preset.getBlockProgramArray())
                .build();
    }
}
