package com.dinnertime.peaktime.domain.preset.controller;

import com.dinnertime.peaktime.domain.preset.service.PresetService;
import com.dinnertime.peaktime.domain.preset.service.dto.request.AddUrlPresetRequestDto;
import com.dinnertime.peaktime.domain.preset.service.dto.request.SavePresetRequestDto;
import com.dinnertime.peaktime.domain.preset.service.dto.response.PresetResponseDto;
import com.dinnertime.peaktime.domain.preset.service.dto.response.PresetWrapperResponseDto;
import com.dinnertime.peaktime.domain.preset.service.dto.response.SaveUrlPresetResponseDto;
import com.dinnertime.peaktime.global.auth.service.dto.security.UserPrincipal;
import com.dinnertime.peaktime.global.util.CommonSwaggerResponse;
import com.dinnertime.peaktime.global.util.ResultDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Path;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/presets")
@RequiredArgsConstructor
public class PresetController {

    private final PresetService presetService;

    // 프리셋 생성
    @Operation(summary = "프리셋 생성", description = "추가 버튼으로 프리셋 생성하기")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "프리셋 생성에 성공했습니다.",
                    content = @Content(schema= @Schema(implementation = ResultDto.class))
            ),
            @ApiResponse(responseCode = "500", description = "프리셋 생성에 실패했습니다.",
                    content= @Content(schema= @Schema(implementation = ResultDto.class))
            )
    })
    @CommonSwaggerResponse.CommonResponses
    @PostMapping
    public ResponseEntity<?> createPreset(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody SavePresetRequestDto requestDto) {
        //단순한 데이터 형식과 길이에 대한 유효성 검증은 컨트롤러에서 처리 @Valid
        log.info("createPreset 메서드가 호출되었습니다.");
        log.info("프리셋 생성 : " + requestDto.toString());

        presetService.createPreset(userPrincipal.getUserId(), requestDto);

        return ResponseEntity.status(HttpStatus.OK).body(ResultDto.res(HttpStatus.OK.value(),"프리셋 생성에 성공했습니다."));
    }



    // 프리셋 조회
    @Operation(summary = "프리셋 전체 조회", description = "프리셋 전체 조회하기")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "프리셋 전체 조회에 성공했습니다.",
                content = @Content(schema= @Schema(implementation = PresetWrapperResponseDto.class))
            ),
            @ApiResponse(responseCode = "500", description = "프리셋 전체 조회에 실패했습니다.",
                content= @Content(schema= @Schema(implementation = ResultDto.class))
            )
    })
    @CommonSwaggerResponse.CommonResponses
    @GetMapping
    public ResponseEntity<?> getPreset(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        log.info("getPreset 메서드가 호출되었습니다.");

        PresetWrapperResponseDto responseDto = presetService.getPresets(userPrincipal.getUserId());

        return ResponseEntity.status(HttpStatus.OK).body(ResultDto.res(HttpStatus.OK.value(),"프리셋 전체 조회에 성공했습니다.", responseDto));
    }

    // 특정 프리셋 조회
    // 프리셋 조회
    @Operation(summary = "특정 프리셋 조회", description = "프리셋 상세 조회하기")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "특정 프리셋 조회에 성공했습니다.",
                    content = @Content(schema= @Schema(implementation = PresetResponseDto.class))
            ),
            @ApiResponse(responseCode = "500", description = "특정 프리셋 조회에 실패했습니다.",
                    content= @Content(schema= @Schema(implementation = ResultDto.class))
            )
    })
    @CommonSwaggerResponse.CommonResponses
    @GetMapping("/{presetId}")
    public ResponseEntity<?> getEachPreset(@AuthenticationPrincipal UserPrincipal userPrincipal,
    @PathVariable Long presetId) {
        log.info("getEachPreset 메서드가 호출되었습니다.");

        PresetResponseDto responseDto = presetService.getUniquePreset(userPrincipal.getUserId(), presetId);

        return ResponseEntity.status(HttpStatus.OK).body(ResultDto.res(HttpStatus.OK.value(),"특정 프리셋 조회에 성공했습니다.", responseDto));
    }

    // 프리셋 수정
    @Operation(summary = "특정 프리셋 수정하기", description = "프리셋 수정하기")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "해당 프리셋 수정에 성공했습니다.",
                    content = @Content(schema= @Schema(implementation = ResultDto.class))
            ),
            @ApiResponse(responseCode = "500", description = "프리셋 수정에 실패했습니다.",
                    content= @Content(schema= @Schema(implementation = ResultDto.class))
            )
    })
    @CommonSwaggerResponse.CommonResponses
    @PutMapping("/{presetId}")
    public ResponseEntity<?> updatePreset(
            @PathVariable Long presetId,
            @Valid @RequestBody SavePresetRequestDto requestDto) {

        log.info("updatePreset  메서드가 호출되었습니다.");

        presetService.updatePreset(requestDto, presetId);

        return ResponseEntity.status(HttpStatus.OK).body(ResultDto.res(HttpStatus.OK.value(),"프리셋 수정에 성공했습니다."));
    }



    // 프리셋 삭제
    @Operation(summary = "특정 프리셋 삭제하기", description = "프리셋 삭제하기")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "해당 프리셋 삭제에 성공했습니다.",
                    content = @Content(schema= @Schema(implementation = ResultDto.class))
            ),
            @ApiResponse(responseCode = "500", description = "프리셋 수정에 삭제했습니다.",
                    content= @Content(schema= @Schema(implementation = ResultDto.class))
            )
    })
    @CommonSwaggerResponse.CommonResponses
    @DeleteMapping("/{presetId}")
    public ResponseEntity<?> deletePreset(@PathVariable Long presetId) {

        log.info("deletePreset  메서드가 호출되었습니다.");

        presetService.deletePreset(presetId);

        return ResponseEntity.status(HttpStatus.OK).body(ResultDto.res(HttpStatus.OK.value(),"프리셋 삭제에 성공했습니다."));
    }

    // 특정 프리셋 생성
    @Operation(summary = "익스텐션에서 프리셋 웹사이트 추가", description = "익스텐션에서 프리셋 웹사이트 추가해주기")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "웹사이트를 프리셋에 추가하기에 성공했습니다.",
                    content = @Content(schema= @Schema(implementation = PresetResponseDto.class))
            ),
            @ApiResponse(responseCode = "500", description = "웹사이트를 프리셋에 추가하기에 실패했습니다.",
                    content= @Content(schema= @Schema(implementation = ResultDto.class))
            )
    })
    @CommonSwaggerResponse.CommonResponses
    @PostMapping("/{presetId}")
    public ResponseEntity<?> addUrl(
            @Valid @RequestBody AddUrlPresetRequestDto requestDto,
            @PathVariable Long presetId) {
        //단순한 데이터 형식과 길이에 대한 유효성 검증은 컨트롤러에서 처리 @Valid
        log.info("addUrl 메서드가 호출되었습니다.");

        SaveUrlPresetResponseDto responseDto = presetService.addWebsitePreset(requestDto, presetId);

        return ResponseEntity.status(HttpStatus.OK).body(ResultDto.res(HttpStatus.OK.value(),"웹사이트를 프리셋에 추가하기에 성공했습니다.", responseDto));
    }


}
