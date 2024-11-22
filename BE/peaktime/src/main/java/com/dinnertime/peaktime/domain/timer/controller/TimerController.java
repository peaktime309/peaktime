package com.dinnertime.peaktime.domain.timer.controller;

import com.dinnertime.peaktime.domain.group.service.dto.response.GroupDetailResponseDto;
import com.dinnertime.peaktime.domain.timer.service.TimerService;
import com.dinnertime.peaktime.domain.timer.service.dto.request.TimerCreateRequestDto;
import com.dinnertime.peaktime.domain.timer.service.facade.TimerFacade;
import com.dinnertime.peaktime.global.util.CommonSwaggerResponse;
import com.dinnertime.peaktime.global.util.ResultDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/timers")
@RequiredArgsConstructor
public class TimerController {

    private final TimerFacade timerFacade;

    @Operation(summary = "그룹 타이머 생성", description = "그룹의 타이머 목록과 비교해서 겹치는 시간이 존재하지 않을 때 타이머를 생성합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "타이머 생성을 성공했습니다.",
                    content = @Content(schema = @Schema(implementation = GroupDetailResponseDto.class))),
            @ApiResponse(responseCode = "409", description = "선택한 시간 범위가 다른 예약과 겹칩니다.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class))),
            @ApiResponse(responseCode = "500", description = "타이머를 생성하는 데 실패했습니다.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class)))
    })
    @CommonSwaggerResponse.CommonResponses
    @PostMapping("")
    public ResponseEntity<?> postTimer(@RequestBody @Valid TimerCreateRequestDto requestDto) {
        GroupDetailResponseDto responseDto = timerFacade.createTimer(requestDto);

        return ResponseEntity.status(HttpStatus.OK).body(ResultDto.res(HttpStatus.OK.value(), "타이머 생성을 성공했습니다.", responseDto));
    }

    @Operation(summary = "그룹 타이머 삭제", description = "선택한 그룹 타이머를 삭제합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "타이머 삭제를 성공했습니다.",
                    content = @Content(schema = @Schema(implementation = GroupDetailResponseDto.class))),
            @ApiResponse(responseCode = "500", description = "타이머 삭제를 실패했습니다.",
                    content = @Content(schema = @Schema(implementation = ResultDto.class)))
    })
    @CommonSwaggerResponse.CommonResponses
    @DeleteMapping("/{timerId}")
    public ResponseEntity<?> deleteTimer(@PathVariable("timerId") Long timerId) {
        GroupDetailResponseDto responseDto = timerFacade.deleteTimer(timerId);
        return ResponseEntity.status(HttpStatus.OK).body(ResultDto.res(HttpStatus.OK.value(), "타이머 삭제를 성공했습니다.", responseDto));
    }

}
